// The web desk shares the overlay's sprite surface (desktop/renderer/sprite-surface.js). That file is a plain
// script: it sets window.PetSpriteSurface (and module.exports under Node). It is not an ES module, so the Vite
// dev server (npm run dev, which serves it as-is) has no default export to hand out. A default import there
// stopped the whole web app from starting in the browser: no clicks, no care, no talk. The desk reads the global.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { pathToFileURL } from "node:url";

const WEB = join(import.meta.dirname, "..");
const ROOT = join(WEB, "..");
const SURFACE = join(ROOT, "desktop", "renderer", "sprite-surface.js");

function files(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) files(p, out);
    else if (/\.(ts|tsx)$/.test(name)) out.push(p);
  }
  return out;
}

test("served as an ES module, the overlay surface file has no default export but sets the shared global", async () => {
  const src = readFileSync(SURFACE, "utf8");
  const before = globalThis.PetSpriteSurface;
  delete globalThis.PetSpriteSurface;
  try {
    const ns = await import("data:text/javascript;base64," + Buffer.from(src).toString("base64"));
    assert.equal("default" in ns, false, "a default import of this file breaks npm run dev");
    assert.equal(typeof globalThis.PetSpriteSurface?.paintHeld, "function");
    assert.equal(globalThis.PetSpriteSurface.BOX.sip, 112);
  } finally {
    if (before) globalThis.PetSpriteSurface = before;
  }
});

test("no web source takes a value import from the overlay renderer scripts (type-only and side-effect imports are fine)", () => {
  const bad = [];
  for (const f of files(join(WEB, "src"))) {
    const text = readFileSync(f, "utf8");
    for (const m of text.matchAll(/^\s*import\s+(?!type\b)([^"';]+?)\s+from\s+["']([^"']*desktop\/renderer\/[^"']+)["']/gm)) {
      bad.push(`${relative(WEB, f)}: import ${m[1]} from ${m[2]}`);
    }
  }
  assert.deepEqual(bad, []);
});

test("the desk still paints through the shared surface (the global, not a bundler shim)", async () => {
  const desk = await import(pathToFileURL(join(WEB, "src", "lib", "pets", "desk-sprite-surface.ts")).href);
  const canvas = { getContext: () => null, dataset: {}, width: 0, height: 0, style: {} };
  const r = desk.paintSipFrame(canvas, "sprites/crow/idle/1.png");
  assert.notEqual(r.reason, "no-surface", JSON.stringify(r));
  const text = readFileSync(join(WEB, "src", "lib", "pets", "desk-sprite-surface.ts"), "utf8");
  assert.match(text, /^import "\.\.\/\.\.\/\.\.\/\.\.\/desktop\/renderer\/sprite-surface\.js";$/m);
});
