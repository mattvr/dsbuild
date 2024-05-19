let serveDir: string | null = null

export const setServeDir = (serveDir_: string) => {
  serveDir = serveDir_
}

self.addEventListener("message", (e: any) => {
  const { serveDir: serveDir_ } = e.data

  setServeDir(serveDir_)
})

const serveFile = async (req: Request): Promise<Response> => {
  // const startTime = performance.now();
  const headers = new Headers({
    "X-Deno-Version": Deno.version.deno,
  });

  if (!serveDir) {
    return new Response("Initializing...", {
      headers,
    });
  }

  let path = new URL(req.url).pathname;
  path = path.substring(1);

  if (path === "") {
    path = `${serveDir}/index.html`
  } else {
    path = `${serveDir}/${path}`
  }

  let file: Deno.FsFile;
  try {
    file = await Deno.open(path);
  }
  catch (e) {
    return new Response("Not found", {
      status: 404,
      headers,
    });
  }

  const contentType = path.endsWith(".html") ? "text/html" : path.endsWith(".js") ? "text/javascript" : path.endsWith(".css") ? "text/css" : "text/plain"

  headers.set("Content-Type", contentType);

  // const data = (await toArrayBuffer(file.readable))

  // headers.set("Content-Length", data.byteLength.toString());
  // headers.set("X-Response-Time", `${performance.now() - startTime}ms`);

  return new Response(file.readable, {
    headers,
  });
}

export const serve = (): Promise<void> => {
  return Deno.serve(serveFile).finished
}

if (import.meta.main) {
  await serve()
}