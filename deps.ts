// Import the WASM build on platforms where running subprocesses is not
// permitted, such as Deno Deploy, or when running without `--allow-run`.
import * as esbuild from "https://deno.land/x/esbuild@v0.19.2/mod.js";
// import * as esbuild from "https://deno.land/x/esbuild@v0.19.2/wasm.js";

import { compile as compileMdx } from "https://esm.sh/@mdx-js/mdx@3.0.0"
import { renderToStaticMarkup as compileReactStatic } from "https://esm.sh/react-dom@18.2.0/server"
import { denoLoaderPlugin, denoResolverPlugin } from "https://deno.land/x/esbuild_deno_loader@0.8.2/mod.ts";
import {parseArgs} from "https://deno.land/std@0.208.0/cli/parse_args.ts";
import { isAbsolute, join, resolve, normalize } from "https://deno.land/std@0.208.0/path/mod.ts";
import React from "https://esm.sh/react@18.2.0";

export {
  // esbuild
  esbuild,

  // mdx-js
  compileMdx,

  // esbuild_deno_loader
  denoLoaderPlugin,
  denoResolverPlugin,

  // deno std
  parseArgs,

  // React
  React,
  compileReactStatic,

  // files
  isAbsolute,
  join,
  resolve,
  normalize,
}