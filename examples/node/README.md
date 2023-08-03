# `dsbuild` node example

Demo of a simple nodejs app written in Deno.

This is **not a recommended use for `dsbuild`** as this tool does not transform
Deno runtime APIs to work with node, nor does it support `node:` imports, both
of which are frequently required for command-line apps. However, for very simple
apps, this approach can work.

For the general use case of transforming Deno code to Node you should use
[dnt](https://github.com/denoland/dnt) (https://github.com/denoland/dnt).

1. After installing `dsbuild`, run `dsbuild --target node18.0` from this
   directory.
2. Run `node public/app.js` from this directory.
