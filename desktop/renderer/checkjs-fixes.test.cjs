// Bugs and dead code the desktop checkJs pass (scripts/checkjs-baseline.mjs) found, pinned so they stay fixed.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const here = __dirname;
const read = (name) => fs.readFileSync(path.join(here, name), "utf8");

test("a thank-you never repeats the last one (42 trick files passed `lastKind | null | undefined`, a bitwise OR that is always 0)", () => {
  const files = fs.readdirSync(here).filter((n) => n.endsWith(".js"));
  for (const f of files) {
    assert.doesNotMatch(read(f), /\w \| null \| undefined\)/, `${f} still has a type cast turned into a bitwise OR`);
  }
  const realRandom = Math.random;
  let checked = 0;
  try {
    for (const f of files.filter((n) => n.endsWith("-tricks.js") && n !== "ground-tricks.js")) {
      const Mod = require(path.join(here, f));
      if (typeof Mod.startThankYou !== "function" || !Array.isArray(Mod.HAPPY) || Mod.HAPPY.length < 2) continue;
      for (const last of Mod.HAPPY) {
        for (const roll of [0, 0.2, 0.4, 0.6, 0.8, 0.999]) {
          Math.random = () => roll;
          const got = Mod.startThankYou(Mod.TRICK_KEY, last, 100, 1, { cmd: "idle" });
          if (!got) continue;
          assert.notEqual(got.kind, last, `${f}: thank-you "${last}" repeated right after itself`);
          checked += 1;
        }
      }
    }
  } finally {
    Math.random = realRandom;
  }
  assert.ok(checked > 200, `checked ${checked} thank-you picks`);
});

test("window-play's api object lists each export once (six duplicate shorthand keys are gone)", () => {
  const src = read("window-play.js");
  const start = src.indexOf("  const api = {");
  const end = src.indexOf("\n  };", start);
  assert.ok(start > 0 && end > start);
  const keys = src.slice(start + "  const api = {".length, end).match(/[A-Za-z_$][\w$]*(?=\s*,)/g);
  const seen = new Set();
  const dup = [];
  for (const k of keys) {
    if (seen.has(k)) dup.push(k);
    seen.add(k);
  }
  assert.deepEqual(dup, []);
  const P = require("./window-play.js");
  for (const k of ["SILL", "BARRED", "IGNORE", "orbitOnPath", "barredOffPath", "pickTarget"]) {
    assert.ok(k in P, `${k} is still exported`);
  }
});

test("no pet opts out of window play today, and the IGNORE guard stays for one that does", () => {
  const P = require("./window-play.js");
  const keys = ["red_panda", "cat", "dog", "grouper", "no_such_pet"];
  for (const k of keys) assert.notEqual(P.playFor(k), P.IGNORE);
  assert.match(read("window-play.js"), /if \(kind === IGNORE\) return null;/);
  assert.match(read("pet.js"), /\(window\.PetWindowPlay\.playFor\(kind\.key\)\) !== "ignore"/);
});

test("pet.js drops comparisons tsc proved can never be true, without changing what runs", () => {
  const src = read("pet.js");
  // applyCommand: once the order is wander or idle it cannot also be seek or eat.
  assert.match(src, /if \(\(sim\.anim === "eat" \|\| sim\.thankYou\) && \(sim\.cmd === "wander" \|\| sim\.cmd === "idle"\)\) \{\s*if \(sim\.thankYou && sim\.anim !== "eat"\) \{/);
  assert.doesNotMatch(src, /sim\.cmd !== "seek" && sim\.cmd !== "eat"/);
  // The idle-act gate already needs idle or sit, so "not sleep" was always true.
  assert.doesNotMatch(src, /\(sim\.anim === "idle" \|\| sim\.anim === "sit"\) &&\s*!life\.hidden &&\s*!life\.asleep &&\s*sim\.anim !== "sleep"/);
  // tickVisit: the leave branch returns first, so "placed and not leaving" is just "placed".
  assert.match(src, /\} else if \(visit\.placed\) \{\s*visit\.target = visit\.x;/);
  assert.doesNotMatch(src, /visit\.placed && phase !== "leave"/);
});

test("presence: the key-classifier doc sits on classifyKey, and keyText is documented as a string", () => {
  const src = fs.readFileSync(path.join(here, "..", "presence.cjs"), "utf8");
  assert.match(src, /@returns \{\{ record: false, field: boolean, toggle: false \| "dismiss" \}\}\s*\*\/\s*function classifyKey\(/);
  assert.match(src, /@returns \{string\}\s*\*\/\s*function keyText\(/);
  const Presence = require("../presence.cjs");
  assert.deepEqual(Presence.classifyKey({ key: "Escape" }), { record: false, field: false, toggle: "dismiss" });
  assert.deepEqual(Presence.classifyKey({ key: "a", field: true }), { record: false, field: true, toggle: false });
  assert.deepEqual(Presence.classifyKey({ key: "a" }), { record: false, field: false, toggle: false });
  assert.deepEqual(Presence.classifyKey(null), { record: false, field: false, toggle: false });
});

test("the desktop checkJs pass is wired with a whole-number baseline", () => {
  const root = path.join(here, "..", "..");
  const baseline = fs.readFileSync(path.join(root, "desktop", "checkjs-baseline.txt"), "utf8").trim();
  assert.match(baseline, /^\d+$/);
  const config = JSON.parse(fs.readFileSync(path.join(root, "desktop", "tsconfig.checkjs.json"), "utf8"));
  assert.equal(config.compilerOptions.checkJs, true);
  for (const inc of ["renderer/*.js", "*.cjs", "license/*.cjs", "presence/*.cjs"]) assert.ok(config.include.includes(inc), inc);
  assert.deepEqual(config.compilerOptions.paths.electron, ["./types/electron.d.ts"]);
  const script = fs.readFileSync(path.join(root, "scripts", "checkjs-baseline.mjs"), "utf8");
  assert.match(script, /checkjs-baseline\.txt/);
  for (const runner of ["test-all.ps1", "test-all.sh"]) {
    assert.match(fs.readFileSync(path.join(root, "scripts", runner), "utf8"), /checkjs-baseline\.mjs/, runner);
  }
});

test("pet.js keeps the chirp context and the visit timer in variables, not on functions", () => {
  const src = read("pet.js");
  assert.doesNotMatch(src, /playSound\.ctx|startVisit\.timer/);
  assert.match(src, /let soundCtx = null;/);
  assert.match(src, /let visitTimer = 0;/);
  assert.match(src, /const ac = soundCtx \|\| \(soundCtx = new Ctor\(\)\);/);
  assert.match(src, /window\.clearTimeout\(visitTimer\);\s*visitTimer = window\.setTimeout\(startVisit,/);
  // Both sit near the top, before any function that uses them can run.
  assert.ok(src.indexOf("let soundCtx = null;") < src.indexOf("function playSound("));
  assert.ok(src.indexOf("let visitTimer = 0;") < src.indexOf("function startVisit("));
});

test("pet.js looks elements up as HTML elements and types the plant pointer handler", () => {
  const src = read("pet.js");
  assert.match(src, /function htmlAll\(root, sel\) \{\s*return \/\*\* @type \{HTMLElement\[\]\} \*\/ \(Array\.from\(root\.querySelectorAll\(sel\)\)\);/);
  assert.match(src, /function htmlOne\(root, sel\) \{\s*return \/\*\* @type \{HTMLElement \| null\} \*\/ \(root\.querySelector\(sel\)\);/);
  assert.match(src, /const kids = htmlAll\(plantsRoot, "\[data-plant\]"\);/);
  assert.match(src, /node\.addEventListener\("pointerdown", \(\/\*\* @type \{PointerEvent\} \*\/ e\) => \{/);
  assert.match(src, /items\.indexOf\(\/\*\* @type \{HTMLElement\} \*\/ \(document\.activeElement\)\)/);
  // Rui's radio block is left as it was.
  assert.match(src, /hudRadioQ/);
});

test("the contract double serves the bundle bytes as a plain Uint8Array copy", async () => {
  const { createContractTestDouble } = require("../license/contract-test-double.cjs");
  const bytes = Buffer.from("PK\u0003\u0004pet-bytes");
  const dbl = createContractTestDouble({ cdnBytes: bytes });
  const res = await dbl.fetchImpl("https://cdn.enterprisepet.example/p.zip");
  assert.equal(res.status, 200);
  assert.deepEqual(Buffer.from(await res.arrayBuffer()), bytes);
  const plain = await createContractTestDouble({}).fetchImpl("https://cdn.enterprisepet.example/p.zip");
  assert.equal(Buffer.from(await plain.arrayBuffer()).toString("latin1"), "PK\u0003\u0004fake-zip");
});

test("checkJs also reads Electron's own types when desktop/node_modules has Electron", () => {
  const root = path.join(here, "..", "..");
  const cfg = JSON.parse(fs.readFileSync(path.join(root, "desktop", "tsconfig.checkjs-electron.json"), "utf8"));
  assert.equal(cfg.extends, "./tsconfig.checkjs.json");
  assert.deepEqual(cfg.compilerOptions.paths.electron, ["./node_modules/electron/electron.d.ts"]);
  const script = fs.readFileSync(path.join(root, "scripts", "checkjs-baseline.mjs"), "utf8");
  assert.match(script, /tsconfig\.checkjs-electron\.json/);
  assert.match(script, /more than with the stand-in\. FAIL/);
  const stub = fs.readFileSync(path.join(root, "desktop", "types", "electron.d.ts"), "utf8");
  assert.match(stub, /export type MenuItemConstructorOptions = any;/);
  const main = fs.readFileSync(path.join(root, "desktop", "main.cjs"), "utf8");
  assert.match(main, /@typedef \{import\("electron"\)\.MenuItemConstructorOptions\} MenuRow/);
  for (const fn of ["companionMenu", "deskPickMenu", "careMenu", "gpuPathRows", "refusedTrayTemplate", "trayTemplate", "macAppMenu", "desktopFollowRows"]) {
    assert.match(main, new RegExp(`@returns \\{MenuRow\\[\\]\\}\\s*\\*/\\s*function ${fn}\\(`), fn);
  }
  assert.equal(Number(fs.readFileSync(path.join(root, "desktop", "checkjs-baseline.txt"), "utf8").trim()) <= 3, true);
});
