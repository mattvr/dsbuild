/* Must keep react import even though it's not directly used */
import { React, dirname, join, parseJsonc, renderToStaticMarkup } from "./deps.ts";
import { REACT_STATIC_TS_CONFIG } from "./stuff.ts";

import {
  DEFAULT_STATIC_FILE
} from "./stuff.ts";

// Put this here so it's not optimized out
React;

export const buildReactStatic = async (options: {
  inFile?: string; // input file (e.g. src/app.tsx)
  outFile?: string; // output file (e.g. public/app.js)
  watch?: boolean; // watch for changes
}) => {
  const { inFile = Deno.cwd(), outFile = DEFAULT_STATIC_FILE } = options;

  const doBuild = async () => {
    if (inFile.endsWith(".tsx")) {
      const startTime = performance.now();
      const output = await compileReactStatic(inFile, options.watch);

      if (outFile) {
        await Deno.writeTextFile(outFile, output);
      } else {
        // file.mdx --> file.jsx (TODO: optional suffix)
        const filename = inFile.substring(0, inFile.lastIndexOf("."));
        const compiledFile = filename + ".html";
        const outDir = dirname(compiledFile);
        await Deno.mkdir(outDir, { recursive: true });
        await Deno.writeTextFile(compiledFile, output);
      }
      const endTime = performance.now();
      const diff = (endTime - startTime).toFixed(2);
      console.log(`Built file ${outFile} in ${diff}ms`);
    } else {
      // if directory, then build first tsx file found
      const maybeFolder = await Deno.stat(inFile);
      if (!maybeFolder.isDirectory) {
        throw new Error(
          `Input file must be a .mdx file or a directory containing .mdx files. (got ${inFile})`
        );
      }
      const files = Deno.readDirSync(inFile);
      for (const file of files) {
        if (file.isFile && file.name.endsWith(".tsx")) {
          const startTime = performance.now();
          const inPath = join(inFile, file.name);
          let output = "";
          try {
            output = await compileReactStatic(inPath, options.watch);
          } catch (e) {
            console.error("Error compiling file: ", inPath, e);
            continue;
          }

          let targetOutFile = outFile;
          if (!targetOutFile) {
            // use same directory
            targetOutFile = inFile;
          }
          const filename = file.name.substring(0, file.name.lastIndexOf("."));
          const fullfilename = filename + ".html";
          const finalOutFile = join(targetOutFile, fullfilename);
          // create directory if it doesn't exist
          const outDir = dirname(finalOutFile);
          await Deno.mkdir(outDir, { recursive: true });
          await Deno.writeTextFile(finalOutFile, output);
          const endTime = performance.now();
          const diff = (endTime - startTime).toFixed(2);
          console.log(`Built React Static file ${fullfilename} in ${diff}ms`);

          break; // only build first file
        }
      }
    }
  };
  await doBuild();
  if (!options.watch) {
    return;
  }
  const watcher = Deno.watchFs(inFile, { recursive: true });
  for await (const event of watcher) {
    // if any paths end with .mdx, then rebuild
    let rebuild = false;
    for (const path of event.paths) {
      if (path.endsWith(".tsx")) {
        rebuild = true;
        break;
      }
    }
    if (rebuild) {
      await doBuild();
    }
  }
};

export const compileReactStatic = async (
  path: string,
  watch?: boolean
): Promise<string> => {
  // Randomize the path so that it's unique (and thus reimported each time)
  const pathUnique = watch
    ? `${path}?v=${Math.random().toString(36).substring(7)}`
    : path;

  const filePath = "file://" + pathUnique;

  // eval the JS, then run through compileReactStatic
  const App = await import(filePath).then((m) => m.default)
  const compiled = renderToStaticMarkup(<App />)
  return '<!DOCTYPE html>' + compiled
};

export const compileReactStaticNew = async (
  path: string,
  watch?: boolean
) => {
    // Randomize the path so that it's unique (and thus reimported each time)
    const pathUnique = watch
    ? `${path}?v=${Math.random().toString(36).substring(7)}`
    : path;

  const filePath = "file://" + pathUnique;

  const denoProgram = `
import React from "react";
import { renderToStaticMarkup as compileReactStatic } from "react-dom/server"
const filePath = "${filePath}";
const App = await import(filePath).then((m) => m.default)
const compiled = compileReactStatic(<App />)
console.log('<!DOCTYPE html>' + compiled)`;

  // create a tmp config here
  const config = { ...REACT_STATIC_TS_CONFIG };

  const existingConfigText = await Deno.readTextFile("deno.jsonc");
  if (existingConfigText) {
    const existingConfig = parseJsonc(existingConfigText) as {
      imports?: {
        [key: string]: string;
      };
      importMap?: string;
    };
    let imports = existingConfig?.imports;
    if (existingConfig?.importMap) {
      const importMap = await Deno.readTextFile(existingConfig?.importMap);
      imports = (parseJsonc(importMap) as {
        imports: {
          [key: string]: string;
        };
      }).imports;
    }
    config.imports = {
      ...config.imports,
      ...imports,
    };
  }

  const configPath = join(Deno.cwd(), "dsbuild-config.tmp.json");
  await Deno.writeTextFile(configPath, JSON.stringify(config));

  const programPath = join(Deno.cwd(), "dsbuild-program.tmp.tsx");
  await Deno.writeTextFile(programPath, denoProgram);

  const cmd = await new Deno.Command("deno", {
    args: ["run", `--config=${configPath}`, "-A", programPath],
    // stdin: "piped",
    stdout: "piped",
  });

  const spawned = await cmd.spawn();

  const reader = spawned.stdout.getReader();

  let buffer: string = "";
  const decoder = new TextDecoder();
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }
    buffer += decoder.decode(value);
  }
  await reader.releaseLock();

  await Deno.remove(configPath);
  await Deno.remove(programPath);
  return buffer;

}
