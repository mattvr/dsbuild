/* dsbuild - Deno + esbuild */

import { dirname, esbuild } from './deps.ts'
import { denoLoaderPlugin, denoResolverPlugin } from './deps.ts'
import { parseArgs } from "./deps.ts";
import { isAbsolute, join, resolve, normalize } from "./deps.ts";
import { serve, setServeDir } from "./serve.ts";
import { compileMdx, mdxPlugin } from './plugin-mdx.ts'
import { compileReactStatic } from "./plugin-react-static.tsx";
import { extname, parse } from "./deps.ts";

export const VERSION = "0.1.2"

const isDev = Deno.env.get("DENO_ENV") === "development";
let isFirstBuild = true;

const DEFAULT_IN_FILES = ["src/app.ts", "src/app.tsx", "src/index.ts", "src/index.tsx", "src/main.ts", "src/main.tsx", "src/mod.ts", "src/mod.tsx"];
const DEFAULT_IN_FOLDER = "src";
const DEFAULT_OUT_FILE = join("public", "app.js");
const DEFAULT_CSS_FILE = join("public", "app.css");
const DEFAULT_STATIC_FILE = join("public", "index.html");
const DEFAULT_SERVE_DIR = "public";

export type BuildOptions = {
  watch?: boolean; // watch for changes
  serve?: "only" | boolean; // serve only, or serve and build
  importMap?: string; // import map (e.g. importMap.json)
  target?: string; // esbuild target (e.g. chrome99, firefox99, safari15)

  inFile: string; // input file (e.g. src/app.tsx)
  outFile: string; // output file (e.g. public/app.js)
  serveDir?: string; // directory to serve (e.g. public)
  hash?: boolean; // use hash in output file

  plugins?: esbuild.Plugin[]; // additional esbuild plugins
  logLevel?: esbuild.LogLevel; // log level
  ignoredWarnings?: string[]; // ignored warnings
}

export const build = async (options: BuildOptions) => {
  const {
    watch,
    serve: shouldServe,
    importMap,
    target,
    inFile,
    outFile,
    serveDir = DEFAULT_SERVE_DIR,
    plugins = [],
    hash,
    logLevel,
  } = options;

  // Generate directories recursively if they don't exist
  const outDir = dirname(outFile)
  await Deno.mkdir(outDir, { recursive: true });

  const opts: esbuild.BuildOptions = {
    plugins: [
      denoResolverPlugin(importMap ? {
        importMapURL: importMap,
      } : {}),
      ...plugins,
      denoLoaderPlugin({})
    ],
    entryPoints: [inFile],
    outfile: outFile,
    bundle: true,
    format: "esm",
    target: target ? target : ["chrome99", "firefox99", "safari15"],
    platform: "browser",
    treeShaking: true,
    minify: !isDev,
    jsx: "automatic",
    logLevel
  };

  const result = await esbuild.context(opts);

  const rebuild = async () => {
    console.log(isFirstBuild ? "Building..." : "Rebuilding...");
    const startTime = performance.now();
    try {
      // rebuild
      await result.rebuild();

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
          if (file.isFile && fileName.startsWith(name + '.') && fileExt === ext && file.name !== `${name}.${hash}${ext}`) {
            const oldFile = join(outDir, file.name);
            await Deno.remove(oldFile);
            // console.log(`Removed old file: ${oldFile}`);
          }
        }
      }

      isFirstBuild = false;
      const dt = performance.now() - startTime;
      console.log(`%c✅ Built in: ${dt.toFixed(2)}ms`, `color: green`);
    } catch (e) {
      const dt = performance.now() - startTime;
      console.error(`%c🚨 Build error after ${dt.toFixed(2)}ms`, `color: red; font-weight: bold`);
      console.error(e);
    }
  };

  const serveBlock = async () => {
    // Just serve and don't terminate
    setServeDir(serveDir);
    await serve()
    return;
  }

  const serveBackground = () => {
    // Start a separate worker to serve the files
    const worker = new Worker(new URL("serve.ts", import.meta.url).href, {
      type: "module",
    });
    worker.postMessage({ serveDir });
  }

  if (!watch && !shouldServe) {
    // DEFAULT: Build once
    await rebuild();
    esbuild.stop();
  }

  if ((shouldServe === 'only') || (shouldServe && !watch)) {
    // SERVE-ONLY: Now, serve indefinitely
    await serveBlock();
    return;
  }
  else if (!watch) {
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
    if (performance.now() - timeSinceLastRebuild > (1000 * 1000)) { // 1 second
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

  const inDir = dirname(inFile)

  const arePathsEqual = (path1: string, path2: string) => {
    return normalize(resolve(path1)) === normalize(resolve(path2));
  };

  if (arePathsEqual(inDir, outDir)) {
    throw new Error("Input and output directories cannot be the same when using --watch, will cause infinite loop.");
  }

  const watcher = Deno.watchFs(inDir, { recursive: true });
  for await (const event of watcher) {
    // Skip events for files that might be output files (i.e. name and extension are similar, ignoring hash)
    const paths = event.paths;
    const isOutputFile = paths.some((path) => {
      const { name, ext } = parse(path);
      const nameWithoutHash = name.split('.').slice(0, -1).join('.');
      const outFileName = parse(outFile).name;
      const isSimilar = (nameWithoutHash === outFileName || name === outFileName) && extname(outFile) === ext;
      return isSimilar;
    });
    if (isOutputFile) {
      continue;
    }

    debounceRebuild();
  }

  esbuild.stop();
}

export const buildMdx = async (options: {
  inFile?: string; // input file (e.g. src/app.tsx)
  outFile?: string; // output file (e.g. public/app.js)
  watch?: boolean; // watch for changes
}) => {
  const {
    inFile = Deno.cwd(),
    outFile
    // outFile = DEFAULT_OUT_FILE,
  } = options;

  const doBuild = async () => {
    if (inFile.endsWith('.mdx')) {
      const output = await compileMdx(inFile);

      if (outFile) {
        await Deno.writeTextFile(outFile, output);
        return;
      }
      else {
        // file.mdx --> file.jsx (TODO: optional suffix)
        const filename = inFile.substring(0, inFile.lastIndexOf('.'));
        const compiledFile = filename + '.jsx';
        const outDir = dirname(compiledFile);
        await Deno.mkdir(outDir, { recursive: true });
        await Deno.writeTextFile(compiledFile, output);
      }
    }
    else {
      // if directory, then build all mdx files in directory
      const maybeFolder = await Deno.stat(inFile);
      if (!maybeFolder.isDirectory) {
        throw new Error(`Input file must be a .mdx file or a directory containing .mdx files. (got ${inFile})`)
      }
      const files = Deno.readDirSync(inFile);
      for (const file of files) {
        if (file.isFile && file.name.endsWith('.mdx')) {
          // file.mdx --> file.jsx (TODO: optional suffix)
          const startTime = performance.now();
          const inPath = join(inFile, file.name)
          let output = ''
          try {
            output = await compileMdx(inPath);
          }
          catch (e) {
            console.error("Error compiling file: ", inPath, e)
            continue;
          }

          let targetOutFile = outFile;
          if (!targetOutFile) {
            // use same directory
            targetOutFile = inFile;
          }
          if (extname(targetOutFile) !== '.jsx') {
            targetOutFile = join(targetOutFile, file.name.substring(0, file.name.lastIndexOf('.')) + '.jsx')
          }
          const filename = file.name.substring(0, file.name.lastIndexOf('.'));
          const fullfilename = filename + '.jsx'
          // create directory if it doesn't exist
          const outDir = dirname(targetOutFile);
          const finalOutFile = join(outDir, fullfilename)
          await Deno.mkdir(outDir, { recursive: true });
          await Deno.writeTextFile(finalOutFile, output)
          const endTime = performance.now();
          const diff = (endTime - startTime).toFixed(2)
          console.log(`Built file ${fullfilename} in ${diff}ms`)
        }
      }
    }
  }
  await doBuild();
  if (!options.watch) {
    return;
  }
  const watcher = Deno.watchFs(inFile, { recursive: true });
  for await (const event of watcher) {
    // if any paths end with .mdx, then rebuild
    let rebuild = false;
    for (const path of event.paths) {
      if (path.endsWith('.mdx')) {
        rebuild = true;
        break;
      }
    }
    if (rebuild) { await doBuild(); }
  }
}

export const buildCss = async (options: {
  inFile?: string; // input file (e.g. src/app.css)
  outFile?: string; // output file (e.g. public/app.css)
  watch?: boolean; // watch for changes
}) => {
  const {
    inFile = Deno.cwd(),
    outFile = 'public/app.css',
    watch = false,
  } = options;

  const doBuild = async () => {
    const maybeFolder = await Deno.stat(inFile);
    if (!maybeFolder.isDirectory) {
      throw new Error(`Input file must be a directory containing CSS files. (got ${inFile})`);
    }

    const cssFiles: string[] = [];
    for await (const entry of Deno.readDir(inFile)) {
      if (entry.isFile && entry.name.endsWith(".css")) {
        cssFiles.push(entry.name);
      }
    }

    cssFiles.sort((a, b) => {
      const orderA = a.split(".").length;
      const orderB = b.split(".").length;
      if (orderA === orderB) {
        return a.localeCompare(b);
      }
      return orderA - orderB;
    });

    let combinedCss = "";
    for (const file of cssFiles) {
      const filePath = join(inFile, file);
      const cssContent = await Deno.readTextFile(filePath);
      combinedCss += cssContent + "\n";
    }

    const outDir = dirname(outFile);
    await Deno.mkdir(outDir, { recursive: true });
    await Deno.writeTextFile(outFile, combinedCss);

    console.log(`Built CSS file: ${outFile}`);
  };

  await doBuild();

  if (watch) {
    const watcher = Deno.watchFs(inFile, { recursive: true });
    for await (const event of watcher) {
      if (event.kind === "modify" || event.kind === "create" || event.kind === "remove") {
        await doBuild();
      }
    }
  }
};
export const buildReactStatic = async (options: {
  inFile?: string; // input file (e.g. src/app.tsx)
  outFile?: string; // output file (e.g. public/app.js)
  watch?: boolean; // watch for changes
}) => {
  const {
    inFile = Deno.cwd(),
    outFile = DEFAULT_STATIC_FILE,
  } = options;

  const doBuild = async () => {
    if (inFile.endsWith('.tsx')) {
      const startTime = performance.now();
      const output = await compileReactStatic(inFile, options.watch);

      if (outFile) {
        await Deno.writeTextFile(outFile, output);
      }
      else {
        // file.mdx --> file.jsx (TODO: optional suffix)
        const filename = inFile.substring(0, inFile.lastIndexOf('.'));
        const compiledFile = filename + '.html';
        const outDir = dirname(compiledFile);
        await Deno.mkdir(outDir, { recursive: true });
        await Deno.writeTextFile(compiledFile, output);
      }
      const endTime = performance.now();
      const diff = (endTime - startTime).toFixed(2)
      console.log(`Built file ${outFile} in ${diff}ms`)
    }
    else {
      // if directory, then build first tsx file found
      const maybeFolder = await Deno.stat(inFile);
      if (!maybeFolder.isDirectory) {
        throw new Error(`Input file must be a .mdx file or a directory containing .mdx files. (got ${inFile})`)
      }
      const files = Deno.readDirSync(inFile);
      for (const file of files) {
        if (file.isFile && file.name.endsWith('.tsx')) {
          const startTime = performance.now();
          const inPath = join(inFile, file.name)
          let output = ''
          try {
            output = await compileReactStatic(inPath, options.watch)
          }
          catch (e) {
            console.error("Error compiling file: ", inPath, e)
            continue;
          }

          let targetOutFile = outFile;
          if (!targetOutFile) {
            // use same directory
            targetOutFile = inFile;
          }
          const filename = file.name.substring(0, file.name.lastIndexOf('.'));
          const fullfilename = filename + '.html'
          const finalOutFile = join(targetOutFile, fullfilename)
          // create directory if it doesn't exist
          const outDir = dirname(finalOutFile);
          await Deno.mkdir(outDir, { recursive: true });
          await Deno.writeTextFile(finalOutFile, output)
          const endTime = performance.now();
          const diff = (endTime - startTime).toFixed(2)
          console.log(`Built file ${fullfilename} in ${diff}ms`)

          break; // only build first file
        }
      }
    }
  }
  await doBuild();
  if (!options.watch) {
    return;
  }
  const watcher = Deno.watchFs(inFile, { recursive: true });
  for await (const event of watcher) {
    // if any paths end with .mdx, then rebuild
    let rebuild = false;
    for (const path of event.paths) {
      if (path.endsWith('.tsx')) {
        rebuild = true;
        break;
      }
    }
    if (rebuild) { await doBuild(); }
  }
}

if (import.meta.main) {
  const helpText = `dsbuild (Deno + esbuild) v${VERSION}

This is a simple build tool for Deno + esbuild. It compiles Deno TypeScript 
to a single JavaScript file that can be run in the browser.

Example usage:
 \`dsbuild --in src/app.ts --out public/app.js\`
   - Build \`src/app.ts\` to \`public/app.js\`

 \`dsbuild --live\`
   - Live reloads \`src/app.ts\` as you make changes.

 \`dsbuild --live --serve\`
   - Live build and serve \`public/\` on \`localhost:8080\`

 \`dsbuild --serve-only\`
   - Serve \`public/\` on \`localhost:8080\` without building

 \`dsbuild --import-map import-map.json\`
   - Build with import map

 \`dsbuild --tsconfig\`
   - Generate a tsconfig.json you can use for Deno + browser development

  \`dsbuild --denoconfig\`
    - Generate a deno.json you can use for Deno + browser development

 \`dsbuild --init=react\`
    - Initialize a React project (can also be \`mdx\`, \`node\`, \'basic\', \`react-static\`)
`

  const args = parseArgs(Deno.args);

  const isHelp = args["help"] || args["h"];
  const isVersion = args["version"] || args["v"];

  if (isHelp) {
    console.log(helpText);
    Deno.exit(0);
  }
  if (isVersion) {
    console.log(VERSION);
    Deno.exit(0);
  }

  const generateTsConfig = args['tsconfig'] || false;
  const generateDenoConfig = args['denoconfig'] || false;
  const init = args['init'] || false;

  let inFile = args["in"] || args["_"].join("")
  let outFile = args["out"];
  let serveDir = args["serve-dir"] || DEFAULT_SERVE_DIR;
  let importMap = args["import-map"];
  let useHash = args["hash"];
  let logLevel = args["log-level"] || "info";
  const target = args["target"] ? args["target"].split(",") : null;

  const isWatch = args["live"] || args["watch"] || args["w"] || args["l"];
  const isServe = args["serve"] || args["serve-only"] || args["s"];
  const isServeOnly = args["serve-only"]
  const isMdx = args["mdx"]
  const isReactStatic = args["react-static"]
  const isCss = args["css"]

  // Replace relative with absolute paths
  const cwd = Deno.cwd();
  if (inFile && !isAbsolute(inFile)) {
    inFile = join(cwd, inFile)
  }
  if (outFile && !isAbsolute(outFile)) {
    outFile = join(cwd, outFile)
  }
  if (!outFile && isCss) {
    outFile = DEFAULT_CSS_FILE;
  }
  else if (!outFile) {
    outFile = DEFAULT_OUT_FILE;
  }

  // Set up default import map
  if (importMap === "null" || importMap === "false") {
    importMap = null;
  }
  else {
    if (importMap && !isAbsolute(importMap)) {
      importMap = join('file://', cwd, importMap)
    }
    if (!importMap) {
      const importMaps = ['import-map.json', 'deno.json'] // NOTE: .jsonc doesn't work yet
      for (const map of importMaps) {
        const potentialImportMap = join(cwd, map).replace('file:', '')
        try {
          const stat = await Deno.stat(potentialImportMap);
          if (stat.isFile) {
            importMap = join('file://', potentialImportMap);
            break;
          }
        }
        catch (_e) {
          // ignore
        }
      }
    }
  }

  if (!isAbsolute(serveDir)) {
    serveDir = join(cwd, serveDir)
  }

  if (init) {
    const initStr = typeof init === 'string' ? init : 'basic'
    const rootDir = join(import.meta.url, '..').replace('file:', '')
    const exampleDir = join(rootDir, 'examples', initStr).replace('file:', '')
    // recursively copy files from ./examples/[example] to cwd
    const files = Deno.readDirSync(exampleDir);
    const copyFileOrFolder = async (src: string, dest: string) => {
      if (src.endsWith('.gitignore' || src.endsWith('.git'))) {
        return;
      }
      const stat = await Deno.stat(src);
      if (stat.isFile) {
        const contents = await Deno.readTextFile(src)
        console.log(`Copying ${src} to ${dest} (file)`)
        try {
          const isForce = args['force'] || false;
          await Deno.writeTextFile(dest, contents, {
            createNew: isForce ? undefined : true,
          });
        } catch (e) {
          console.error(`Error copying ${src} to ${dest}: ${e}`)
          console.error('You already have one of these files already at your destination. Please only use --init from an empty directory. (or use "--force" to overwrite existing files)')
          Deno.exit(1);
        }
      }
      else if (stat.isDirectory) {
        await Deno.mkdir(dest, { recursive: true })
        const files = Deno.readDirSync(src);
        console.log(`Copying ${src} to ${dest} (directory)`)
        for (const file of files) {
          const srcPath = join(src, file.name)
          const destPath = join(dest, file.name)
          await copyFileOrFolder(srcPath, destPath)
        }
      }
    }
    for (const file of files) {
      await copyFileOrFolder(join(exampleDir, file.name), join(cwd, file.name))
    }
    Deno.exit(0);
  }

  if (generateTsConfig) {
    // tsconfig.json for deno+browser dev
    const tsConfig = {
      "compilerOptions": {
        "target": "es6",
        "lib": ["dom", "dom.iterable", "esnext", "deno.ns"],
        "jsx": "react-jsxdev",
        "jsxImportSource": "react"
      },
      // "include": ["src"]
    }
    const str = JSON.stringify(tsConfig, null, 2);
    console.log(str);
    if (args["out"]) {
      await Deno.writeTextFile(outFile, str);
    }
    Deno.exit(0);
  }

  if (generateDenoConfig) {
    const denoConfig = {
      "compilerOptions": {
        "lib": ["dom", "dom.iterable", "dom.asynciterable", "esnext", "deno.ns"],
        "jsx": "react-jsxdev",
        "jsxImportSource": "react"
      },
      "imports": {
        "react": "https://esm.sh/react@18.2.0?dev",
        "react-dom/client": "https://esm.sh/react-dom@18.2.0/client?dev",
        "react/": "https://esm.sh/react@18.2.0/",
        "react-dom": "https://esm.sh/react-dom@18.2.0?dev"
      }
    }

    const str = JSON.stringify(denoConfig, null, 2);
    console.log(str);
    if (args["out"]) {
      await Deno.writeTextFile(outFile, str);
    }
    Deno.exit(0);
  }

  if (isMdx) {
    await buildMdx({
      inFile: inFile || DEFAULT_IN_FOLDER,
      outFile,
      watch: isWatch
    });
    Deno.exit(0);
  }

  if (isReactStatic) {
    await buildReactStatic({
      inFile: inFile || DEFAULT_IN_FOLDER,
      outFile,
      watch: isWatch
    });
    Deno.exit(0);
  }

  if (isCss) {
    await buildCss({
      inFile: inFile || DEFAULT_IN_FOLDER,
      outFile,
      watch: isWatch
    });
    Deno.exit(0);
  }

  if (!inFile) {
    // Look for default input file
    for (const file of DEFAULT_IN_FILES) {
      const path = join(...file.split('/'))
      try {
        const stat = await Deno.stat(path);
        if (stat.isFile) {
          inFile = file;
          break;
        }
      }
      catch (_e) {
        // ignore
      }
    }
  }

  if (!inFile && !isServeOnly) {
    console.error("No input file found. Use --in to specify an input file.")
    Deno.exit(1);
  }

  await build({
    watch: isWatch,
    serve: isServeOnly ? "only" : isServe,
    importMap,
    target,
    inFile: inFile,
    outFile,
    hash: useHash,
    serveDir,
    plugins: [
      mdxPlugin,
    ],
    logLevel
  });

  Deno.exit(0);
}
