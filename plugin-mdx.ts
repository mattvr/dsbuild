import { esbuild, compileMdx as compileMdx_ } from './deps.ts'

export const compileMdxText = (text: string) => compileMdx_(text).then((result) => result.value) as Promise<string>;

export const compileMdx = async (path: string, withCache = true /* todo */) => {
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