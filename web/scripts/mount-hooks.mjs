// Module hooks for the web mount tests (registered by mount-setup.mjs, not by the app).
// - `@/x` resolves to web/src/x, and extensionless imports find x.ts, x.tsx or x/index.ts, as Vite does.
// - .ts and .tsx under web/src are turned into plain JS with the TypeScript that is already installed.
// - A named function in a named file can be wrapped so a test can make it throw: the wrapper calls
//   globalThis.__mountFaults[name](...args) first when the test has set one.
import { existsSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import ts from "typescript";

let SRC = "";
let FAULTS = {};

export async function initialize(data) {
  SRC = data.src;
  FAULTS = data.faults || {};
}

/** Is `file` inside web/src? Windows paths compare without case (C: and c: are the same drive). */
function underSrc(file) {
  if (process.platform === "win32") return file.toLowerCase().startsWith(SRC.toLowerCase());
  return file.startsWith(SRC);
}

function isFile(p) {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
}

function findTs(base) {
  if (isFile(base)) return base;
  for (const ext of [".ts", ".tsx"]) if (isFile(base + ext)) return base + ext;
  for (const ext of ["/index.ts", "/index.tsx"]) if (isFile(base + ext)) return base + ext;
  return null;
}

export async function resolve(specifier, context, next) {
  if (specifier.startsWith("@/")) {
    const hit = findTs(path.join(SRC, specifier.slice(2)));
    if (hit) return { url: pathToFileURL(hit).href, shortCircuit: true };
  }
  const parent = context.parentURL && context.parentURL.startsWith("file:") ? fileURLToPath(context.parentURL) : "";
  if (parent && underSrc(parent) && (specifier.startsWith("./") || specifier.startsWith("../"))) {
    const base = path.resolve(path.dirname(parent), specifier);
    if (!existsSync(base) || !isFile(base)) {
      const hit = findTs(base);
      if (hit) return { url: pathToFileURL(hit).href, shortCircuit: true };
    }
  }
  return next(specifier, context);
}

function wrapFaults(file, code) {
  const rel = path.relative(SRC, file).split(path.sep).join("/");
  const names = FAULTS[rel];
  if (!names) return code;
  let out = code;
  for (const name of names) {
    const decl = new RegExp(`export function ${name}\\(`);
    if (!decl.test(out)) throw new Error(`mount-hooks: no "export function ${name}(" in ${rel}`);
    out = out.replace(decl, `function __real_${name}(`);
    out += `\nexport function ${name}(...args) {\n  const f = globalThis.__mountFaults && globalThis.__mountFaults[${JSON.stringify(name)}];\n  if (f) f(...args);\n  return __real_${name}(...args);\n}\n`;
  }
  return out;
}

export async function load(url, context, next) {
  if (url.startsWith("file:")) {
    const file = fileURLToPath(url);
    if (underSrc(file) && (file.endsWith(".ts") || file.endsWith(".tsx"))) {
      const source = readFileSync(file, "utf8");
      const out = ts.transpileModule(source, {
        fileName: file,
        compilerOptions: {
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2022,
          jsx: ts.JsxEmit.ReactJSX,
          sourceMap: false,
          verbatimModuleSyntax: false,
          isolatedModules: true,
        },
      });
      return { format: "module", source: wrapFaults(file, out.outputText), shortCircuit: true };
    }
  }
  return next(url, context);
}
