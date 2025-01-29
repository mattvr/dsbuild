import { isAbsolute, join, resolve, normalize } from "./deps.ts";
import denoJson from "./deno.json" with { type: "json" };

export const DSBUILD_VERSION = denoJson.version;
export const IS_DEV = Deno.env.get("DENO_ENV") === "development";

export const DEFAULT_IN_FILES = [
  "src/app.ts",
  "src/app.tsx",
  "src/index.ts",
  "src/index.tsx",
  "src/main.ts",
  "src/main.tsx",
  "src/mod.ts",
  "src/mod.tsx",
];
export const DEFAULT_IN_FOLDER = "src";
export const DEFAULT_OUT_FILE = join("public", "app.js");
export const DEFAULT_CSS_FILE = join("public", "app.css");
export const DEFAULT_STATIC_FILE = join("public", "index.html");
export const DEFAULT_SERVE_DIR = "public";

export const REACT_TS_CONFIG = {
  compilerOptions: {
    target: "es6",
    lib: ["dom", "dom.iterable", "esnext", "deno.ns"],
    jsx: "react-jsxdev",
    jsxImportSource: "react",
  },
  // "include": ["src"]
};

export const REACT_STATIC_TS_CONFIG = {
  compilerOptions: {
    lib: ["dom", "dom.iterable", "dom.asynciterable", "esnext", "deno.ns"],
    jsx: "react-jsxdev",
    jsxImportSource: "react",
  },
  imports: {
    react: "https://esm.sh/v119/react@18.2.0",
    "react-dom/client": "https://esm.sh/v119/react-dom@18.2.0/client",
    "react/": "https://esm.sh/v119/react@18.2.0/",
    "react-dom": "https://esm.sh/v119/react-dom@18.2.0",
  },
};

export const REACT_STATIC_TS_CONFIG_DEV = {
  compilerOptions: {
    lib: ["dom", "dom.iterable", "dom.asynciterable", "esnext", "deno.ns"],
    jsx: "react-jsxdev",
    jsxImportSource: "react",
  },
  imports: {
    react: "https://esm.sh/v119/react@18.2.0?dev",
    "react-dom/client": "https://esm.sh/v119/react-dom@18.2.0/client?dev",
    "react/": "https://esm.sh/v119/react@18.2.0/",
    "react-dom": "https://esm.sh/v119/react-dom@18.2.0?dev",
  },
};
