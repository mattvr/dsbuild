/* dsbuild - Deno + esbuild */

import { isAbsolute, join, parseArgs } from "./deps.ts";
import { buildCss } from "./plugin-css.ts";
import { build } from "./plugin-main.ts";
import { buildMdx, mdxPlugin } from "./plugin-mdx.ts";
import { buildReactStatic } from "./plugin-react-static.tsx";
import {
  DEFAULT_CSS_FILE,
  DEFAULT_IN_FILES,
  DEFAULT_IN_FOLDER,
  DEFAULT_OUT_FILE,
  DEFAULT_SERVE_DIR,
  DEFAULT_STATIC_FILE,
  DSBUILD_VERSION,
  REACT_STATIC_TS_CONFIG_DEV,
  REACT_TS_CONFIG
} from "./stuff.ts";

if (import.meta.main) {
  const helpText = `dsbuild (Deno + esbuild) v${DSBUILD_VERSION}

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
`;

  const args = parseArgs(Deno.args);

  const isHelp = args["help"] || args["h"];
  const isVersion = args["version"] || args["v"];

  if (isHelp) {
    console.log(helpText);
    Deno.exit(0);
  }
  if (isVersion) {
    console.log(DSBUILD_VERSION);
    Deno.exit(0);
  }

  const generateTsConfig = args["tsconfig"] || false;
  const generateDenoConfig = args["denoconfig"] || false;
  const init = args["init"] || false;

  let inFile = args["in"] || args["_"].join("");
  const inFiles = inFile.includes(",") ? inFile.split(",") : undefined;
  let outFile = args["out"];
  let outDir: string | undefined;
  let outbase = args["outbase"]
  try {
    const statResult = await Deno.stat(outFile);
    if (statResult && statResult.isDirectory) {
      outDir = outFile;
      outFile = undefined;
    }
  } catch (_) { /**/ }
  let serveDir = args["serve-dir"] || DEFAULT_SERVE_DIR;
  let importMap = args["import-map"];
  let useHash = args["hash"];
  let logLevel = args["log-level"] || "info";
  const target = args["target"] ? args["target"].split(",") : null;

  const watchArg = args["live"] || args["watch"] || args["w"] || args["l"];
  const isWatch = typeof watchArg === "string" ? watchArg : watchArg !== undefined;
  const isServe = args["serve"] || args["serve-only"] || args["s"];
  const isServeOnly = args["serve-only"];
  const isMdx = args["mdx"];
  const isReactStatic = args["react-static"];
  const isCss = args["css"];
  const external = args["external"] ? args["external"].split(",") : [];

  // Replace relative with absolute paths
  const cwd = Deno.cwd();
  if (inFile && !isAbsolute(inFile)) {
    inFile = join(cwd, inFile);
  }
  if (outFile && !isAbsolute(outFile)) {
    outFile = join(cwd, outFile);
  }
  if (!outFile && isCss) {
    outFile = DEFAULT_CSS_FILE;
  } else if (!outFile && isReactStatic) {
    outFile = DEFAULT_STATIC_FILE;
  } else if (!outFile && !outDir) {
    outFile = DEFAULT_OUT_FILE;
  }

  // Set up default import map
  if (importMap === "null" || importMap === "false") {
    importMap = null;
  } else {
    if (importMap && !isAbsolute(importMap)) {
      importMap = join("file://", cwd, importMap);
    }
    if (!importMap) {
      const importMaps = ["import-map.json", "deno.json"]; // NOTE: .jsonc doesn't work yet
      for (const map of importMaps) {
        const potentialImportMap = join(cwd, map).replace("file:", "");
        try {
          const stat = await Deno.stat(potentialImportMap);
          if (stat.isFile) {
            importMap = join("file://", potentialImportMap);
            break;
          }
        } catch (_e) {
          // ignore
        }
      }
    }
  }

  if (!isAbsolute(serveDir)) {
    serveDir = join(cwd, serveDir);
  }

  if (init) {
    const initStr = typeof init === "string" ? init : "basic";
    const rootDir = join(import.meta.url, "..").replace("file:", "");
    const exampleDir = join(rootDir, "examples", initStr).replace("file:", "");
    // recursively copy files from ./examples/[example] to cwd
    const files = Deno.readDirSync(exampleDir);
    const copyFileOrFolder = async (src: string, dest: string) => {
      if (src.endsWith(".gitignore") || src.endsWith(".git")) {
        return;
      }
      const stat = await Deno.stat(src);
      if (stat.isFile) {
        const contents = await Deno.readTextFile(src);
        console.log(`Copying ${src} to ${dest} (file)`);
        try {
          const isForce = args["force"] || false;
          await Deno.writeTextFile(dest, contents, {
            createNew: isForce ? undefined : true,
          });
        } catch (e) {
          console.error(`Error copying ${src} to ${dest}: ${e}`);
          console.error(
            'You already have one of these files already at your destination. Please only use --init from an empty directory. (or use "--force" to overwrite existing files)'
          );
          Deno.exit(1);
        }
      } else if (stat.isDirectory) {
        await Deno.mkdir(dest, { recursive: true });
        const files = Deno.readDirSync(src);
        console.log(`Copying ${src} to ${dest} (directory)`);
        for (const file of files) {
          const srcPath = join(src, file.name);
          const destPath = join(dest, file.name);
          await copyFileOrFolder(srcPath, destPath);
        }
      }
    };
    for (const file of files) {
      await copyFileOrFolder(join(exampleDir, file.name), join(cwd, file.name));
    }
    Deno.exit(0);
  }

  if (generateTsConfig) {
    // tsconfig.json for deno+browser dev

    const str = JSON.stringify(REACT_TS_CONFIG, null, 2);
    console.log(str);
    if (args["out"]) {
      await Deno.writeTextFile(outFile, str);
    }
    Deno.exit(0);
  }

  if (generateDenoConfig) {
    const str = JSON.stringify(REACT_STATIC_TS_CONFIG_DEV, null, 2);
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
      outDir,
      watch: isWatch,
    });
    Deno.exit(0);
  }

  if (isReactStatic) {
    await buildReactStatic({
      inFile: inFile || DEFAULT_IN_FOLDER,
      outFile,
      watch: Boolean(isWatch),
    });
    Deno.exit(0);
  }

  if (isCss) {
    await buildCss({
      inFile: inFile || DEFAULT_IN_FOLDER,
      outFile,
      watch: Boolean(isWatch),
    });
    Deno.exit(0);
  }

  if (!inFile) {
    // Look for default input file
    for (const file of DEFAULT_IN_FILES) {
      const path = join(...file.split("/"));
      try {
        const stat = await Deno.stat(path);
        if (stat.isFile) {
          inFile = file;
          break;
        }
      } catch (_e) {
        // ignore
      }
    }
  }

  if (!inFile && !isServeOnly) {
    console.error("No input file found. Use --in to specify an input file.");
    Deno.exit(1);
  }

  await build({
    watch: watchArg,
    serve: isServeOnly ? "only" : isServe,
    importMap,
    target,
    inFile,
    inFiles,
    outFile,
    outDir,
    outbase,
    hash: useHash,
    serveDir,
    plugins: [mdxPlugin],
    logLevel,
    external
  });

  Deno.exit(0);
}
