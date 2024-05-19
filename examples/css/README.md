# `dsbuild` basic example

Demo of combining multiple CSS files into a single file.

Since Deno doesn't support CSS imports yet, we can just combine them into a single file to improve organization & simplicity.

Files are concatenated in alphabetical order, using "." as a separator.

Last, it serves the changes you make live.

1. After installing `dsbuild`, run `deno task run` from this directory.
2. Open up http://localhost:8000 in a browser.
3. Re-run the command after making changes to the CSS files to see changes.