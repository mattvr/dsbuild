# `dsbuild` basic example

Demo of a simple React MDX web app built with Deno. 

It first compiles `src/MyExample.mdx` to `src/MyExample.jsx`. This transforms the MDX format to be usable by Deno. It's unfortunately requires while Deno doesn't support mdx imports.

Then it compiles `src/app.tsx` into `public/app.js`, a bundle to be used by a browser.

Last, it serves the changes you make live.

1. After installing `dsbuild`, run `deno task run` from this directory.
2. Open up http://localhost:8000 in a browser.
3. Make some changes to `src/app.ts`.
4. Refresh the page in your browser, and you should see your updates instantly!