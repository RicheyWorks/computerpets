// No-recent-repeat lines: a pet or guest does not say the same line again within its last few lines or 60 s,
// unless the pool is too small. Web, overlay and the Python blotter pick the same way (seeded here). Only the
// choosing changed: every line a pet says is still word-for-word from its roster.
import { test, before } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { mountSetup } from "./mount-setup.mjs";

const WEB = join(import.meta.dirname, "..");
const RENDERER = join(WEB, "..", "desktop", "renderer");
const require = createRequire(import.meta.url);
const P = await import(pathToFileURL(join(WEB, "src", "lib", "pets", "line-picker.ts")).href);
const OverlayLines = require(join(RENDERER, "line-picker.js"));

// The fixed rolls and clock every door is checked against (client/tests/test_line_picker.py uses the same).
const ROLLS = [0.9, 0.1, 0.5, 0.7, 0.3, 0.99, 0, 0.45, 0.62, 0.2, 0.8, 0.05];
const FIVE = ["a", "b", "c", "d", "e"];
const FIVE_EVERY_4S = ["e", "a", "c", "d", "b", "e", "a", "c", "d", "b", "e", "a"];
const TWO_EVERY_1S = ["y", "x", "y", "x", "y", "x"];

function seeded(create) {
  let i = 0;
  const clock = { t: 0 };
  const picker = create({ random: () => ROLLS[i++ % ROLLS.length], now: () => clock.t });
  return { picker, clock };
}

function run(create, pool, speaker, steps, stepMs) {
  const { picker, clock } = seeded(create);
  const out = [];
  for (let k = 0; k < steps; k++) {
    out.push(picker.pick(speaker, pool));
    clock.t += stepMs;
  }
  return out;
}

let m;
before(async () => {
  m = await mountSetup();
});

test("never one of the last three lines; the same seeded picks on web and overlay", () => {
  for (const create of [P.createLinePicker, OverlayLines.createLinePicker]) {
    const five = run(create, FIVE, "red_panda", 12, 4000);
    assert.deepEqual(five, FIVE_EVERY_4S);
    for (let k = 1; k < five.length; k++) assert.ok(!five.slice(Math.max(0, k - 3), k).includes(five[k]), `repeat at ${k}`);
    assert.deepEqual(run(create, ["x", "y"], "dee", 6, 1000), TWO_EVERY_1S);
  }
  assert.equal(P.RECENT_LINES, 3);
  assert.equal(P.RECENT_WITHIN_MS, 60000);
  assert.equal(OverlayLines.RECENT_LINES, P.RECENT_LINES);
  assert.equal(OverlayLines.RECENT_WITHIN_MS, P.RECENT_WITHIN_MS);
});

test("a line said in the last 60 s waits when another line is free; after 60 s it may come back", () => {
  let i = 0;
  const clock = { t: 0 };
  const rolls = [0, 0, 0, 0, 0, 0, 0, 0];
  const p = P.createLinePicker({ recent: 1, random: () => rolls[i++], now: () => clock.t });
  const pool = ["one", "two", "three"];
  const said = [];
  for (let k = 0; k < 3; k++) {
    said.push(p.pick("cat", pool));
    clock.t += 5000;
  }
  assert.deepEqual(said, ["one", "two", "three"], "recent is 1, but the 60 s rule still walks the pool");
  clock.t = 61_000;
  assert.equal(p.pick("cat", pool), "one", "past 60 s the first line is free again");
});

test("a pool too small still answers: one line repeats, two lines take turns", () => {
  const { picker, clock } = seeded(P.createLinePicker);
  for (let k = 0; k < 4; k++) {
    assert.equal(picker.pick("rui", ["The lamp is warm."]), "The lamp is warm.");
    clock.t += 100;
  }
  assert.equal(picker.pick("rui", []), "");
});

test("an optional line (a guest's tell) is said once, stays quiet for 60 s, and each speaker keeps its own memory", () => {
  const { picker, clock } = seeded(P.createLinePicker);
  const dee = "Dee-dee. I saw the red one.";
  assert.equal(picker.offer("chickadee", dee), dee);
  clock.t = 7_600; // the audit saw Dee say it again at 7.6 s
  assert.equal(picker.offer("chickadee", dee), "");
  assert.equal(picker.offer("cat", "I sat. You were already here."), "I sat. You were already here.");
  clock.t = 60_001;
  assert.equal(picker.offer("chickadee", dee), dee);
  assert.equal(picker.offer("chickadee", ""), "");
});

test("the desk's pets pick through the picker, and every line is still the roster's own words", async () => {
  const L = await m.load("lib/pets/line-picker.ts");
  const living = await m.load("lib/pets/living.ts");
  const { ROSTER } = await m.load("lib/pets/roster.ts");
  let i = 0;
  const clock = { t: 0 };
  L.setLinePickerForTests(L.createLinePicker({ random: () => ROLLS[i++ % ROLLS.length], now: () => clock.t }));
  try {
    const rui = living.livingByKey("red_panda");
    const def = ROSTER.find((d) => d.key === "red_panda");
    const good = { hunger: 90, energy: 90, mood: 90, hygiene: 90, bond: 90, health: 90 };
    const said = [];
    for (let k = 0; k < 12; k++) {
      said.push(rui.ambientLine(good));
      clock.t += 4000;
    }
    for (const line of said) assert.ok(def.lines.ambient.includes(line), `not a roster line: ${line}`);
    const avoid = Math.min(3, new Set(def.lines.ambient).size - 1);
    for (let k = 1; k < said.length; k++) assert.ok(!said.slice(Math.max(0, k - avoid), k).includes(said[k]), `Rui repeated "${said[k]}" at ${k}`);
    const heard = [rui.listenLine(), rui.listenLine()];
    assert.notEqual(heard[0], heard[1], "two listen lines take turns");
  } finally {
    L.setLinePickerForTests();
  }
});

test("wired on every door: web guests and robin, overlay pet, guests and care lines, Python blotter", () => {
  const called = readFileSync(join(WEB, "src", "components", "desk", "called-guests.tsx"), "utf8");
  const robin = readFileSync(join(WEB, "src", "components", "desk", "robin-fly.tsx"), "utf8");
  const living = readFileSync(join(WEB, "src", "lib", "pets", "living.ts"), "utf8");
  const guests = readFileSync(join(WEB, "src", "lib", "pets", "call-guests.ts"), "utf8");
  assert.match(called, /const line = linePicker\.offer\(next\.key, tellLine\(next\)\);/);
  assert.match(called, /const song = linePicker\.offer\(next\.key, ROBIN_SONG\);/);
  assert.match(robin, /const song = linePicker\.offer\(ROBIN_KEY, ROBIN_SONG\);/);
  assert.match(living, /return linePicker\.pick\(speaker, lines\);/);
  assert.doesNotMatch(living, /Math\.random\(\) \* lines\.length/);
  // Why the guest lines repeated: every new approach to Rui cleared `told`. It no longer does (one tell a visit);
  // the picker stays as the backstop (guest-told-once.test.mjs).
  assert.equal((guests.match(/told: false,/g) || []).length, 0);
  const pet = readFileSync(join(RENDERER, "pet.js"), "utf8");
  const life = readFileSync(join(RENDERER, "life.js"), "utf8");
  const html = readFileSync(join(RENDERER, "index.html"), "utf8");
  assert.match(html, /<script src="line-picker\.js"><\/script>\n    <script src="call-guests\.js"><\/script>/);
  assert.match(pet, /if \(Lines && Lines\.pick\) return Lines\.pick\(kind\?\.key \|\| "pet", list\);/);
  assert.match(pet, /const line = offerLine\(g\.key, G\.tellLine \? G\.tellLine\(g\) : ""\);/);
  assert.match(pet, /const song = offerLine\(g\.key, G\.ROBIN_SONG\);/);
  assert.match(pet, /const line = offerLine\(g\.key, \(G\.tellLine && G\.tellLine\(g\)\) \|\| ""\) \|\| \(g\.name \? `\$\{g\.name\} nods\.` : "A nod\."\);/);
  assert.match(life, /if \(Lines && Lines\.pick\) return Lines\.pick\(key \|\| "pet", list\);/);
  const py = readFileSync(join(WEB, "..", "client", "computerpets_client", "life.py"), "utf8");
  assert.match(py, /return _lines\.line_picker\.pick\(speaker, lines\) if lines else ""/);
});

test("overlay care lines go through the shared picker once it is loaded", () => {
  const ctx = { Date, Math, console };
  ctx.window = ctx;
  ctx.globalThis = ctx;
  const sb = vm.createContext(ctx);
  vm.runInContext(readFileSync(join(RENDERER, "line-picker.js"), "utf8"), sb);
  vm.runInContext(readFileSync(join(RENDERER, "life.js"), "utf8"), sb);
  const Life = ctx.PetLife;
  assert.ok(Life && ctx.PetLines, "both loaded");
  const trait = { extra: { praise: ["I heard that.", "Noted.", "Again, please."] } };
  const said = [];
  for (let k = 0; k < 6; k++) said.push(Life.act(Life.blank(), trait, "praise", Date.now(), "red_panda").line);
  for (let k = 1; k < said.length; k++) assert.ok(!said.slice(Math.max(0, k - 2), k).includes(said[k]), `repeat at ${k}: ${said}`);
  assert.equal(JSON.stringify(ctx.PetLines.recentFor("red_panda").slice(-6)), JSON.stringify(said));
});
