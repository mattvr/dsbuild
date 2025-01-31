<p align="center"><a href="https://github.com/mattvr/dsbuild">
<img src="/dsbuild.svg" ></a></p>
<p align="center"><strong>Run Deno code in the browser. Fast & simple.</strong></p>
<h4 align="center"><strong><a href="https://orgsoft.org/discord"><img src="https://github.com/mattvr/ShellGPT/assets/4052466/9ba871c8-451c-4178-9035-645142b617d9" /> Discord </a></strong></h4>

---

`dsbuild` is a simple, fast static site builder.

It compiles any [Deno](https://deno.land/) TypeScript (or Markdown) into a
single JavaScript file that can be run in the browser.

It's a one-command, zero-configuration way to build React, Markdown, or other
JS-powered web sites entirely using Deno.

**Features:**

- Supports TypeScript, MDX (Markdown), JSX, and React out of the box.
- Automatic rebuilds as you develop (`dsbuild --watch`)
- Previewing via a simple included web server (`dsbuild --serve`)
- URL imports using `https://`, `file://`, `npm:`, `jsr:`, and import maps.
- Full support for Deno syntax and modules that don't require the `Deno`
  namespace or system APIs.
- Powered by [`esbuild`](https://esbuild.github.io/) and
  [`esbuild_deno_loader`](https://github.com/lucacasonato/esbuild_deno_loader)
  under the hood.

<br /><br />

## Installation

1. Install the
   [Deno runtime](https://deno.land/manual/getting_started/installation).

2. Run the following command to install dsbuild:

```sh
deno install -frAg jsr:@orgsoft/dsbuild
```

3. Ensure `$HOME/.deno/bin` is in your `PATH` environment variable.

<br /><br />

## Usage

See [examples/](examples/) for full examples of building React, Markdown, or
other JS-powered web sites.

- ### `dsbuild`

  - Run this command from any directory to compile `src/app.ts` into
    `public/app.js`.

- ### `dsbuild --watch` (or `dsbuild -w`)

  - Watches `src/` directory and rebuilds on changes.

- ### `dsbuild --watch=src/ui,src/api`
  
  - Watches `src/ui` and `src/api` and rebuilds on changes.

- ### `dsbuild --watch --serve` (or `dsbuild -ws`)

  - Watch and serve `public/` on `localhost:8000`.

- ### `dsbuild --import-map import-map.json`

  - Builds with import map.

- ### `dsbuild --denoconfig`

  - Generates a deno.json you can use for Deno development with proper `target`
    and `lib` settings for Browsers/React/JSX.

  - You can also run `dsbuild --denoconfig --out deno.json` to write to a
    file.

- ### `dsbuild --tsconfig`

  - Generates a tsconfig.json you can use for Deno development with proper
    `target` and `lib` settings for Browsers/React/JSX.

  - You can also run `dsbuild --tsconfig --out tsconfig.json` to write to a
    file.

- ### `dsbuild --in src/some-file.ts --out public/another-file.js`

  - You can configure the `in` and `out` flags to customize the input and output
    files.
    
  - These example values are the same as the defaults when you call `dsbuild`.

- ### `dsbuild --target chrome99,firefox99,safari15`

  - Customize the output target, to specify browsers or a different environment.
    ([esbuild target docs](https://esbuild.github.io/api/#target))

- ### `dsbuild --serve-only`

  - Serve `public/` on `localhost:8000` without building.

- ### `DENO_ENV=development dsbuild`

  - Builds without minification.

<br /><br />

## Quick Start

Check out the `examples/` folder for a demo, after `git clone`-ing this repo and
installing `dsbuild`.

Inside the folder, run `dsbuild --serve --watch`, make changes to `src/app.ts`,
and you should see the page immediately update.

<br /><br />

## Contributions & local development

You can clone this repository to make changes. 

Once you have a local copy, run `deno task install:dev` from this directory to replace your `dsbuild` installation with a local development copy.

Contributions are welcome.

## License

MIT license.
