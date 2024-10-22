import { dirname, initCss, transformCss } from "./deps.ts";

import { join } from "./deps.ts";
import {
  IS_DEV
} from "./stuff.ts";
export const buildCss = async (options: {
  inFile?: string; // input file (e.g. src/app.css)
  outFile?: string; // output file (e.g. public/app.css)
  watch?: boolean; // watch for changes
}) => {
  const {
    inFile = Deno.cwd(),
    outFile = "public/app.css",
    watch = false,
  } = options;

  const doBuild = async () => {
    const maybeFolder = await Deno.stat(inFile);
    if (!maybeFolder.isDirectory) {
      throw new Error(
        `Input file must be a directory containing CSS files. (got ${inFile})`
      );
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

    if (IS_DEV) {
      // write as is
      await Deno.writeTextFile(outFile, combinedCss);
    }
    if (!IS_DEV) {
      // minify & optimize
      const { code } = transformCss({
        filename: outFile,
        code: new TextEncoder().encode(combinedCss),
        minify: true,
      });
      await Deno.writeTextFile(outFile, new TextDecoder().decode(code));
    }

    console.log(`Built CSS file: ${outFile}`);
  };

  if (!IS_DEV) {
    await initCss(undefined);
  }

  await doBuild();

  if (watch) {
    const watcher = Deno.watchFs(inFile, { recursive: true });
    for await (const event of watcher) {
      if (
        event.kind === "modify" ||
        event.kind === "create" ||
        event.kind === "remove"
      ) {
        await doBuild();
      }
    }
  }
};
