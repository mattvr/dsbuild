import { readAll } from "https://deno.land/std@0.196.0/streams/read_all.ts";

let serveDir: string | null = null

export const setServeDir = (serveDir_: string) => {
  serveDir = serveDir_
}

self.addEventListener("message", (e: any) => {
  const { serveDir: serveDir_ } = e.data

  setServeDir(serveDir_)
})

const serveFile = async (req: Request) => {
  if (!serveDir) {
    return new Response("Initializing...", {
      headers: new Headers({
        "X-Deno-Version": Deno.version.deno,
      }),
    });
  }

  let path = new URL(req.url).pathname;
  path = path.substring(1);

  if (path === "") {
    path = `${serveDir}/index.html`
  } else {
    path = `${serveDir}/${path}`
  }

  const file = await Deno.open(path);
  return new Response(await readAll(file));
}

export const serve = () => {
  return Deno.serve(serveFile).finished
}

if (import.meta.main) {
  await serve()
}