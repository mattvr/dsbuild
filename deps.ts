import * as esbuild from "npm:esbuild@^0.23.0"
import { compile as compileMdx } from "https://esm.sh/@mdx-js/mdx@3.0.0"
import { renderToStaticMarkup } from "https://esm.sh/react-dom@18.2.0/server"
import { denoLoaderPlugin, denoResolverPlugin } from "jsr:@luca/esbuild-deno-loader@^0.10.3";
import React from "https://esm.sh/react@18.2.0";
import {parseArgs} from "jsr:@std/cli@^0.224.7/parse-args";
import { isAbsolute, join, resolve, normalize, dirname, extname, parse } from 'jsr:@std/path@^0.225.2'
import { ensureDir } from 'jsr:@std/fs'
import init, { transform } from "https://cdn.jsdelivr.net/npm/lightningcss-wasm/+esm";
import { parse as parseJsonc } from "jsr:@std/jsonc";


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
  parseJsonc,

  // React
  React,
  renderToStaticMarkup,

  // files
  isAbsolute,
  join,
  resolve,
  normalize,
  dirname,
  extname,
  parse,
  ensureDir,

  // css
  init as initCss,
  transform as transformCss,
}