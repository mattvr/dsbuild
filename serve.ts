import { contentType, join } from "./deps.ts"; 

let serveDir: string | null = null;

export const setServeDir = (serveDir_: string) => {
  serveDir = serveDir_;
};

self.addEventListener("message", (e: any) => {
  const { serveDir: serveDir_, launchBrowser, port } = e.data;
  setServeDir(serveDir_);
  serve({ launchBrowser, port });
});

const serveFile = async (req: Request): Promise<Response> => {
  const headers = new Headers({
    "X-Deno-Version": Deno.version.deno,
  });

  if (!serveDir) {
    return new Response("Initializing...", {
      headers,
    });
  }

  const pathname = new URL(req.url).pathname;
  let filePath = pathname;

  if (pathname === "" || pathname === "/") {
    filePath = join(serveDir, "index.html");
  } else {
    filePath = join(serveDir, pathname);
  }

  let file: Deno.FsFile;
  try {
    file = await Deno.open(filePath);
  } catch (e) {
    return new Response("Not found", {
      status: 404,
      headers,
    });
  }

  const ext = pathname.split(".").pop() || "";
  const ct = pathname === "/"
    ? "text/html; charset=UTF-8"
    : contentType(ext) || (ext === "es"
      ? "text/javascript; charset=UTF-8"
      : "application/octet-stream");

  const fileSize = (await Deno.stat(filePath)).size;
  headers.set("Content-Type", ct);
  headers.set("Content-Length", fileSize.toString());

  return new Response(file.readable, {
    headers,
  });
};

export const serve = (
  opts?: { launchBrowser?: boolean; port?: number },
): Promise<void> => {
  const server = Deno.serve({
    port: opts?.port || 8000,
  }, serveFile);
  if (opts?.launchBrowser) {
    openWebsite(`http://localhost:${opts.port || 8000}`);
  }
  return server.finished;
};

/**
 * Open a web page with the appropriate browser.
 *
 * This utility is used by a few dev-servers to
 * auto-launch the browser with the url being served.
 * @module
 */

/**
 * Get a browser open command based on the os
 * @returns the string for the command to call
 */
export function getBrowserCmd(): string {
  switch (Deno.build.os) {
    case "windows":
      return "explorer.exe";
    case "darwin":
      return "open";
    case "linux":
      if (Deno.env.get("WSL_DISTRO_NAME")) {
        // is WSL
        return "explorer.exe";
      } else {
        return "xdg-open";
      }
    default:
      return "Unknown os";
  }
}

/**
 * Opens a URL in the default browser
 *
 * @param url  - the complete url to be opened in the browser
 *
 * @examples
 *    openWebsite('https://Deno.com')
 *    openWebsite('http://localhost:8080')
 */
export function openWebsite(url: string): Deno.CommandOutput {
  return new Deno.Command(getBrowserCmd(), { args: [url] }).outputSync();
}

if (import.meta.main) {
}
