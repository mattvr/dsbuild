
import { dirname, esbuild } from "./deps.ts";

import { denoLoaderPlugin, denoResolverPlugin, extname, join, normalize, parse, resolve } from "./deps.ts";
import { serve, setServeDir } from "./serve.ts";
import {
  DEFAULT_SERVE_DIR,
  IS_DEV
} from "./stuff.ts";
export type BuildOptions = {
  watch?: boolean; // watch for changes
  serve?: "only" | boolean; // serve only, or serve and build
  importMap?: string; // import map (e.g. importMap.json)
  target?: string; // esbuild target (e.g. chrome99, firefox99, safari15)

  inFile: string; // input file (e.g. src/app.tsx)
  inFiles?: string[]; // input files array (used for splitting)
  outFile: string; // output file (e.g. public/app.js)
  outDir?: string; // output file directory (used for splitting)
  outbase: string; // output file directory base (used for splitting)
  serveDir?: string; // directory to serve (e.g. public)
  hash?: boolean; // use hash in output file
  external?: string[]; // external dependencies

  plugins?: esbuild.Plugin[]; // additional esbuild plugins
  logLevel?: esbuild.LogLevel; // log level
  ignoredWarnings?: string[]; // ignored warnings
};


let isFirstBuild = true;

export const build = async (options: BuildOptions) => {
  const {
    watch,
    serve: shouldServe,
    importMap,
    target,
    inFile,
    inFiles,
    outFile,
    outDir: outDir_,
    outbase,
    serveDir = DEFAULT_SERVE_DIR,
    plugins = [],
    hash,
    logLevel,
    external,
  } = options;

  // Generate directories recursively if they don't exist
  const outDir = outDir_ ?? dirname(outFile);
  await Deno.mkdir(outDir, { recursive: true });

  const split = inFiles?.length ? true : false;

  const opts: esbuild.BuildOptions = {
    plugins: [
      denoResolverPlugin(
        importMap
          ? {
              importMapURL: importMap,
            }
          : {}
      ),
      ...plugins,
      denoLoaderPlugin({}),
    ],
    entryPoints: split ? inFiles : [inFile],
    ...((split) ? { outdir: outDir } : { outfile: outFile }),
    bundle: true,
    format: "esm",
    outbase: outbase,
    target: target ? target : ["chrome99", "firefox99", "safari15"],
    platform: "browser",
    treeShaking: true,
    minify: !IS_DEV,
    jsx: "automatic",
    splitting: split,
    logLevel,
    external,
    // write: false,
    banner: IS_DEV
      ? { js: "globalThis.window.DENO_ENV === 'development';\n" }
      : undefined,
  };

  const context = await esbuild.context(opts);

  const rebuild = async () => {
    console.log(isFirstBuild ? "Building..." : "Rebuilding...");
    const startTime = performance.now();
    try {
      // rebuild
      const _result = await context.rebuild();

      if (hash) {
        // Add hash to output file
        const { name, ext } = parse(outFile);
        const hash = Math.random().toString(36).substring(2, 8);
        const newOutFile = join(outDir, `${name}.${hash}${ext}`);
        await Deno.rename(outFile, newOutFile);
        // console.log(`Renamed ${outFile} to ${newOutFile}`);

        // Delete old files (SKIP new file)
        const files = Deno.readDirSync(outDir);
        for (const file of files) {
          const { name: fileName, ext: fileExt } = parse(file.name);
          if (
            file.isFile &&
            fileName.startsWith(name + ".") &&
            fileExt === ext &&
            file.name !== `${name}.${hash}${ext}`
          ) {
            const oldFile = join(outDir, file.name);
            await Deno.remove(oldFile);
          }
        }
      }

      isFirstBuild = false;
      const dt = performance.now() - startTime;
      console.log(`%c✅ Built JS in ${dt.toFixed(2)}ms`, `color: green`);
    } catch (e) {
      const dt = performance.now() - startTime;
      console.error(
        `%c🚨 Build error after ${dt.toFixed(2)}ms`,
        `color: red; font-weight: bold`
      );
      console.error(e);
    }
  };

  const serveBlock = async () => {
    // Just serve and don't terminate
    setServeDir(serveDir);
    await serve();
    return;
  };

  const serveBackground = () => {
    // Start a separate worker to serve the files
    const worker = new Worker(new URL("serve.ts", import.meta.url).href, {
      type: "module",
    });
    worker.postMessage({ serveDir });
  };

  if (!watch && !shouldServe) {
    // DEFAULT: Build once
    await rebuild();
    esbuild.stop();
  }

  if (shouldServe === "only" || (shouldServe && !watch)) {
    // SERVE-ONLY: Now, serve indefinitely
    await serveBlock();
    return;
  } else if (!watch) {
    // DEFAULT: Now exit
    return;
  }

  if (shouldServe) {
    // SERVE: Serve in background
    serveBackground();
  }

  let timeSinceLastRebuild = 0;
  let timer: number | null = null;
  const debounceRebuild = () => {
    if (performance.now() - timeSinceLastRebuild > 1000 * 1000) {
      // 1 second
      timeSinceLastRebuild = performance.now();
      rebuild();
      timer = null;
      return;
    } else {
      if (timer) clearTimeout(timer);
      timer = setTimeout(rebuild, 50);
    }
  };

  debounceRebuild();

  const inDir = dirname(inFile);

  const arePathsEqual = (path1: string, path2: string) => {
    return normalize(resolve(path1)) === normalize(resolve(path2));
  };

  if (arePathsEqual(inDir, outDir)) {
    throw new Error(
      "Input and output directories cannot be the same when using --watch, will cause infinite loop."
    );
  }

  const watcher = Deno.watchFs(inDir, { recursive: true });
  for await (const event of watcher) {
    // Skip events for files that might be output files (i.e. name and extension are similar, ignoring hash)
    const paths = event.paths;
    const isOutputFile = paths.some((path) => {
      const { name, ext } = parse(path);
      const nameWithoutHash = name.split(".").slice(0, -1).join(".");
      const outFileName = parse(outFile).name;
      const isSimilar =
        (nameWithoutHash === outFileName || name === outFileName) &&
        extname(outFile) === ext;
      return isSimilar;
    });
    if (isOutputFile) {
      continue;
    }

    debounceRebuild();
  }

  esbuild.stop();
};
