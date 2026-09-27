// Real bugs the web type-check work found (tsc 185 -> 0), pinned so they stay fixed on web and overlay.
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { transformSync } from "rolldown/experimental";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const pets = join(root, "src", "lib", "pets");
const renderer = join(root, "..", "desktop", "renderer");
const web = (name) => import(pathToFileURL(join(pets, name)).href);
const overlay = (name) => require(join(renderer, name));
const finite = (o) => Object.entries(o || {}).filter(([, v]) => typeof v === "number" && !Number.isFinite(v)).map(([k]) => k);

test("every web source file parses with the Vite 8 parser (the desk plates did not: duplicate imports)", () => {
  const walk = (d) => readdirSync(d).flatMap((n) => {
    const p = join(d, n);
    if (statSync(p).isDirectory()) return walk(p);
    return /\.(ts|tsx)$/.test(n) && !n.endsWith(".d.ts") ? [p] : [];
  });
  const files = walk(join(root, "src"));
  assert.ok(files.length > 400);
  const bad = files
    .map((f) => [f, transformSync(f, readFileSync(f, "utf8")).errors.length])
    .filter(([, n]) => n > 0)
    .map(([f]) => f);
  assert.deepEqual(bad, []);
  const plates = readFileSync(join(root, "src", "components", "desk", "desk-plates.tsx"), "utf8");
  const head = plates.slice(0, plates.indexOf("export function"));
  for (const name of ["isFavorite", "pickTab", "toggleFavorite", "toCardPatch"]) {
    const bare = head.match(new RegExp(`^\\s+${name},`, "gm")) || [];
    assert.ok(bare.length <= 1, `${name} is imported bare ${bare.length} times`);
  }
});

test("thank-you poses divide by their own duration (motet, fogbow, denspad, inkpad were NaN)", async () => {
  const cases = [
    ["choir-tricks", "motetPose", "motet"],
    ["nimbus-tricks", "fogbowPose", "fogbow"],
    ["gecko-tricks", "denspadPose", "denspad"],
    ["gecko-tricks", "inkpadPose", "inkpad"],
  ];
  for (const [mod, pose, key] of cases) {
    const W = await web(`${mod}.ts`);
    const O = overlay(`${mod}.js`);
    for (let t = 0; t <= W.HAPPY_DUR[key]; t += W.HAPPY_DUR[key] / 12) {
      const w = W[pose](t);
      assert.deepEqual(finite(w), [], `web ${pose}(${t})`);
      assert.deepEqual(O[pose](t), w, `overlay ${pose}(${t}) matches web`);
    }
    let h = W.beginHappy(key, 100, 1);
    let n = 0;
    while (h.phase !== "done" && n < 200) {
      h = W.stepHappy(h, 0.05, {});
      assert.deepEqual(finite(h), [], `web ${key} step ${n}`);
      n++;
    }
    assert.equal(h.phase, "done");
  }
});

test("Morel's costa trick ends (DUR had `stipe` instead of `costa`, so it never did)", async () => {
  for (const M of [await web("morel-tricks.ts"), overlay("morel-tricks.js")]) {
    assert.equal(M.DUR.costa, 1.68);
    assert.equal("stipe" in M.DUR, false);
    let tr = M.beginTrick("costa", 100, 1);
    let steps = 0;
    while (tr.phase !== "done" && steps < 2000) {
      tr = M.stepTrick(tr, 0.05, {});
      assert.deepEqual(finite(tr), []);
      steps++;
    }
    assert.equal(tr.phase, "done");
    assert.ok(steps <= Math.ceil(1.68 / 0.05) + 1, `costa took ${steps} steps`);
  }
});

test("every web trick module keeps a duration for each trick and thank-you, finite poses, and an end", async () => {
  const files = readdirSync(pets).filter((n) => n.endsWith("-tricks.ts") && n !== "ground-tricks.ts");
  assert.equal(files.length, 221);
  const bad = [];
  for (const f of files) {
    const M = await web(f);
    for (const k of M.TRICKS || []) if (M.DUR && !(M.DUR[k] > 0)) bad.push(`${f} DUR has no ${k}`);
    for (const k of M.HAPPY || []) if (M.HAPPY_DUR && !(M.HAPPY_DUR[k] > 0)) bad.push(`${f} HAPPY_DUR has no ${k}`);
    for (const [name, fn] of Object.entries(M)) {
      if (typeof fn !== "function" || !/Pose$/.test(name)) continue;
      for (let t = 0; t <= 14; t += 0.37) {
        const out = fn(t, 100, 1);
        if (out && typeof out === "object" && finite(out).length) { bad.push(`${f} ${name} t=${t.toFixed(2)}`); break; }
      }
    }
    for (const k of M.TRICKS || []) {
      let tr = M.beginTrick(k, 100, 1);
      let n = 0;
      while (tr.phase !== "done" && n < 1000) { tr = M.stepTrick(tr, 0.05, {}); n++; }
      if (tr.phase !== "done") bad.push(`${f} ${k} never ends`);
    }
  }
  assert.deepEqual(bad, []);
});

test("ground tricksFor answers null for an unknown key on web and overlay", () => {
  // The web registry imports its 221 modules without extensions (Vite resolves them), so read its source.
  const src = readFileSync(join(pets, "ground-tricks.ts"), "utf8").replace(/\r\n/g, "\n");
  const body = src.slice(src.indexOf("export function tricksFor"), src.indexOf("\n}\n", src.indexOf("export function tricksFor")));
  assert.match(body, /return null;\s*$/);
  assert.match(src, /export function tricksFor\(key: string \| undefined \| null\): GroundTricks \| null/);
  const O = overlay("ground-tricks.js");
  assert.equal(O.tricksFor("nope"), null);
  assert.equal(O.tricksFor(""), null);
});

test("the web type-check baseline is zero", () => {
  assert.equal(readFileSync(join(root, "tsc-baseline.txt"), "utf8").trim(), "0");
  const cfg = readFileSync(join(root, "tsconfig.json"), "utf8");
  assert.match(cfg, /"allowImportingTsExtensions": true/);
  const src = (rel) => readFileSync(join(root, "src", rel), "utf8");
  for (const rel of ["lib/pets/window-play.ts", "components/desk/desk-plates.tsx", "lib/ai/settings.ts", "lib/pets/gpu.ts", "lib/pets/card.ts", "components/desk/companion-room.tsx"]) {
    assert.doesNotMatch(src(rel), /@ts-ignore|@ts-expect-error|: any\b|as any\b/, rel);
  }
});
