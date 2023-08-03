<p align="center"><a href="https://github.com/mattvr/dsbuild">
<img src="/dsbuild.svg" ></a></p>
<p align="center"><strong>Run Deno code in the browser. Fast & simple.</strong></p>

---

`dsbuild` compiles [Deno](https://deno.land/) TypeScript code to a single JavaScript
file that can be run in the browser.

**Features:**

- Automatic rebuilds as you develop (`dsbuild --watch`)
- Previewing via a simple included web server (`dsbuild --serve`)
- URL imports using `https://`, `file://`, `npm:`, and import maps.
- Full support for Deno syntax and modules that don't require the `Deno`
  namespace or system APIs.
- Powered by [`esbuild`](https://esbuild.github.io/) and
  [`esbuild_deno_loader`](https://github.com/lucacasonato/esbuild_deno_loader)
  under the hood.

## Installation

1. Install the
   [Deno runtime](https://deno.land/manual/getting_started/installation).

2. Run the following command to install dsbuild:

```sh
deno install -frA -n dsbuild https://deno.land/x/dsbuild/mod.ts
```

3. Ensure `$HOME/.deno/bin` is in your `PATH` environment variable.

## Usage

- ### `dsbuild`

  - Run this command from any directory to compile `src/app.ts` into
    `public/app.js`.

- ### `dsbuild --in src/app.ts --out public/app.js`

  - You can configure the `in` and `out` flags to customize the input and output
  files.

  - These example values are the same as the defaults when you call `dsbuild`.

- ### `dsbuild --watch`

  - Watches `src/` directory and rebuilds on changes.

- ### `dsbuild --serve --watch`

  - Watch and serve `public/` on `localhost:8000`.

- ### `dsbuild --serve-only`

  - Serve `public/` on `localhost:8000` without building.

- ### `dsbuild --import-map import-map.json`

  - Builds with import map.

- ### `dsbuild --tsconfig`

  - Generates a tsconfig.json you can use for Deno + browser development

  - You can also run `dsbuild --tsconfig --out tsconfig.json` to write to a
    file.

- ### `dsbuild --target chrome99,firefox99,safari15`

  - Customize the output target, to specify browsers or a different environment.
    ([esbuild target docs](https://esbuild.github.io/api/#target))

- ### `DENO_ENV=development dsbuild`

  - Builds without minification.

## Quick Start

Check out the `examples/` folder for a demo, after `git clone`-ing this repo and
installing `dsbuild`.

Inside the folder, run `dsbuild --serve --watch`, make changes to `src/app.ts`,
and you should see the page immediately update.

## Contributors

Feel free to contribute to this project.

## License

MIT license.
