/* dsbuild - Deno + esbuild */

import * as esbuild from "https://deno.land/x/esbuild@v0.18.11/mod.js";

// Import the WASM build on platforms where running subprocesses is not
// permitted, such as Deno Deploy, or when running without `--allow-run`.
// import as esbuild from "https://deno.land/x/esbuild@v0.18.11/wasm.js";

import { denoPlugins } from "https://deno.land/x/esbuild_deno_loader@0.8.1/mod.ts";

import { parse } from "https://deno.land/std@0.196.0/flags/mod.ts";
import { isAbsolute, join, resolve, normalize } from "https://deno.land/std@0.196.0/path/mod.ts";
import { serve, setServeDir } from "./serve.ts";

const helpText = `dsbuild - Deno + esbuild

This is a simple build tool for Deno + esbuild. It compiles Deno TypeScript 
to a single JavaScript file that can be run in the browser.

Example usage:
 \`dsbuild --in src/app.ts --out public/app.js\`
   - Build \`src/app.ts\` to \`public/app.js\`

 \`dsbuild --watch\`
   - Watch \`src/app.ts\` and rebuild on changes

 \`dsbuild --serve\`
   - Build (with defaults), and serve \`public/\` on \`localhost:8080\`

 \`dsbuild --serve-only\`
   - Serve \`public/\` on \`localhost:8080\` without building

 \`dsbuild --import-map import-map.json\`
   - Build with import map

 \`dsbuild --tsconfig\`
   - Generate a tsconfig.json you can use for Deno + browser development
`

const args = parse(Deno.args);

const isHelp = args["help"] || args["h"];

if (isHelp) {
  console.log(helpText);
  Deno.exit(0);
}

const generateTsConfig = args['tsconfig'] || false;

let inFile = args["in"] || args["_"].join("") || "src/app.ts";
let outFile = args["out"] || "public/app.js";
let serveDir = args["serve-dir"] || "public";
let importMap = args["import-map"];
let target = args["target"] ? args["target"].split(",") : null;

// Replace relative with absolute paths
const cwd = Deno.cwd();
if (!isAbsolute(inFile)) {
  inFile = join(cwd, inFile)
}
if (!isAbsolute(outFile)) {
  outFile = join(cwd, outFile)
}
if (importMap && !isAbsolute(importMap)) {
  importMap = join('file://', cwd, importMap)
}
if (!isAbsolute(serveDir)) {
  serveDir = join(cwd, serveDir)
}

if (generateTsConfig) {
  // tsconfig.json for deno+browser
  const tsConfig = {
    "compilerOptions": {
      "target": "es6",
      "lib": ["dom", "esnext", "deno.ns"]
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

const isDev = Deno.env.get("DENO_ENV") === "development";
const isWatch = args["watch"]
const isServe = args["serve"] || args["serve-only"]
const isServeOnly = args["serve-only"]
let isFirstBuild = true;

if (import.meta.main) {
  // Generate directories recursively if they don't exist
  const outDir = outFile.substring(0, outFile.lastIndexOf("/"));
  await Deno.mkdir(outDir, { recursive: true });

  const opts: esbuild.BuildOptions = {
    plugins: [...denoPlugins(importMap ? {
      "importMapURL": importMap,
    } : {})],
    entryPoints: [inFile],
    outfile: outFile,
    bundle: true,
    format: "esm",
    target: target ? target : ["chrome99", "firefox99", "safari15"],
    platform: "browser",
    treeShaking: true,
    minify: !isDev,
    jsx: "automatic",
  };

  const result = await esbuild.context(opts);

  const rebuild = async () => {
    console.log(isFirstBuild ? "Building..." : "Rebuilding...");
    const startTime = performance.now();
    try {
      // rebuild
      await result.rebuild();
      isFirstBuild = false;
      const dt = performance.now() - startTime;
      console.log(`Built in: ${dt.toFixed(2)}ms`);
    } catch (e) {
      console.error(e);
    }
  };

  const serveBlock = async () => {
    // Just serve and don't terminate
    setServeDir(serveDir);
    await serve()
    Deno.exit(0);
  }

  const serveBackground = () => {
    // Start a separate worker to serve the files
    const worker = new Worker(new URL("./serve.ts", import.meta.url).href, {
      type: "module",
    });
    worker.postMessage({ serveDir });
  }

  if (!isWatch && !isServeOnly) {
    // DEFAULT: Build once
    await rebuild();
    esbuild.stop();
  }

  if (isServeOnly || (isServe && !isWatch)) {
    // SERVE-ONLY: Now, serve indefinitely
    await serveBlock();
    Deno.exit(0)
  }
  else if (!isWatch) {
    // DEFAULT: Now exit
    Deno.exit(0);
  }

  if (isServe) {
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

  const inDir = inFile.substring(0, inFile.lastIndexOf("/"));

  const arePathsEqual = (path1: string, path2: string) => {
    return normalize(resolve(path1)) === normalize(resolve(path2));
  };

  if (arePathsEqual(inDir, outDir)) {
    throw new Error("Input and output directories cannot be the same when using --watch, will cause infinite loop.");
  }

  const watcher = Deno.watchFs(inDir, { recursive: true });
  for await (const _event of watcher) {
    debounceRebuild();
  }

  esbuild.stop();
}
