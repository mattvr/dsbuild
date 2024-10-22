import { compileMdx as compileMdx_, dirname, ensureDir, esbuild, extname, join } from './deps.ts';

export const buildMdx = async (options: {
  inFile?: string; // input file (e.g. src/app.tsx)
  outFile?: string; // output file (e.g. public/app.js)
  outDir?: string; // output directory (e.g. public)
  watch?: boolean; // watch for changes
}) => {
  const {
    inFile = Deno.cwd(),
    outFile,
    outDir: outDir_,
    // outFile = DEFAULT_OUT_FILE,
  } = options;

  const doBuild = async () => {
    if (inFile.endsWith(".mdx")) {
      const output = await compileMdx(inFile);

      if (outFile) {
        await Deno.writeTextFile(outFile, output);
        return;
      } else {
        // file.mdx --> file.jsx (TODO: optional suffix)
        const filename = inFile.substring(0, inFile.lastIndexOf("."));
        const compiledFile = filename + ".jsx";
        const outDir = outDir_ ?? dirname(compiledFile);
        await ensureDir(outDir);
        await Deno.writeTextFile(compiledFile, output);
      }
    } else {
      // if directory, then build all mdx files in directory
      const maybeFolder = await Deno.stat(inFile);
      if (!maybeFolder.isDirectory) {
        throw new Error(
          `Input file must be a .mdx file or a directory containing .mdx files. (got ${inFile})`
        );
      }
      const files = Deno.readDirSync(inFile);
      for (const file of files) {
        if (file.isFile && file.name.endsWith(".mdx")) {
          // file.mdx --> file.jsx (TODO: optional suffix)
          const startTime = performance.now();
          const inPath = join(inFile, file.name);
          let output = "";
          try {
            output = await compileMdx(inPath);
          } catch (e) {
            console.error("Error compiling file: ", inPath, e);
            continue;
          }

          let targetOutFile = outFile;
          if (!targetOutFile) {
            // use same directory
            targetOutFile = inFile;
          }
          if (extname(targetOutFile) !== ".jsx") {
            targetOutFile = join(
              targetOutFile,
              file.name.substring(0, file.name.lastIndexOf(".")) + ".jsx"
            );
          }
          const filename = file.name.substring(0, file.name.lastIndexOf("."));
          const fullfilename = filename + ".jsx";
          // create directory if it doesn't exist
          const outDir = outDir_ ?? dirname(targetOutFile);
          const finalOutFile = join(outDir, fullfilename);
          await ensureDir(outDir);
          await Deno.writeTextFile(finalOutFile, output);
          const endTime = performance.now();
          const diff = (endTime - startTime).toFixed(2);
          console.log(`✅ Built MDX file ${fullfilename} in ${diff}ms`);
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
      if (path.endsWith(".mdx")) {
        rebuild = true;
        break;
      }
    }
    if (rebuild) {
      await doBuild();
    }
  }
};

export const compileMdxText = (text: string) => compileMdx_(text).then((result: any) => result.value) as Promise<string>;

export const compileMdx = async (path: string, withCache = true /* todo */): Promise<string> => {
  const compiled = await compileMdxText(await Deno.readTextFile(path))

  return compiled
}

export const mdxPlugin: esbuild.Plugin = {
  "name": "mdx-preprocessor",
  "setup": (build) => {
    build.onResolve({ filter: /.*/ }, (args) => {
      if (args.path.endsWith(".mdx")) {
        return {
          path: args.path,
          namespace: "mdx",
        };
      }
    })

    build.onLoad({ filter: /.*/, namespace: "mdx" }, async (args) => {
      const result = await compileMdx(args.path);
      return {
        contents: result,
        loader: "jsx",
      };
    })
  }
}