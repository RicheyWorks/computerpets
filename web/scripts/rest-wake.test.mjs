// A rest sleep ends once the pet is fully rested, on the web and the desktop alike (the #1557 audit: a pet put to
// bed by day slept on at energy 100 on both until someone woke it). The same states go through care.ts decayStats
// and the desktop's life.js decay, and both must agree.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const C = await import(pathToFileURL(join(root, "src/lib/pets/care.ts")).href);
const require = createRequire(import.meta.url);
const Life = require(join(root, "..", "desktop", "renderer", "life.js"));

const TRAIT = { extra: {}, hungerH: 6, energyH: 9, hygieneH: 14, hardy: 0.8, social: 1, messy: 0.4, sleepStart: 22, sleepEnd: 6 };
const DAY = new Date(2023, 10, 14, 14, 0, 0).getTime();

function web(energy, hunger, ms) {
  return C.decayStats({ asleep: true, energy, hunger, mood: 60, hygiene: 80, health: 90 }, DAY, DAY + ms, false).asleep;
}
function desk(energy, hunger, ms) {
  const life = { ...Life.blank(DAY), asleep: true, sleepHeld: true, energy, hunger, lastTick: DAY };
  return Life.decay(life, TRAIT, DAY + ms, "fox").life.asleep;
}

test("the web and the desktop share one number for fully rested", () => {
  assert.equal(C.REST_WAKE_ENERGY, 100);
  assert.equal(Life.REST_WAKE_ENERGY, C.REST_WAKE_ENERGY);
});

test("Rest gives the same energy on the web and the desktop (it was +34 and +32)", () => {
  assert.equal(C.REST_ENERGY_GAIN, 34);
  assert.equal(Life.REST_ENERGY_GAIN, C.REST_ENERGY_GAIN);
  for (const energy of [0, 40, 50, 66, 80]) {
    const start = { energy, hunger: 70, mood: 60, hygiene: 80, health: 90 };
    const web = C.applyRest(start);
    const life = { ...Life.blank(DAY), ...start, lastTick: DAY };
    const desk = Life.act(life, TRAIT, "rest", DAY, "fox").life;
    assert.equal(web.energy, Math.min(100, energy + 34), `web from ${energy}`);
    assert.equal(desk.energy, web.energy, `desktop from ${energy}`);
    assert.equal(desk.hunger, web.hunger, `hunger from ${energy}`);
    assert.equal(desk.mood, web.mood, `mood from ${energy}`);
    assert.equal(desk.asleep, true);
    assert.equal(web.asleep, true);
  }
});

test("a fully rested pet wakes by itself; a tired one sleeps on; a hungry one wakes, on both", () => {
  const cases = [
    { energy: 100, hunger: 70, ms: 5_600, asleep: false, why: "fully rested wakes" },
    { energy: 40, hunger: 70, ms: 5_600, asleep: true, why: "not rested sleeps on" },
    { energy: 99, hunger: 70, ms: 5_600, asleep: true, why: "one short of rested sleeps on" },
    { energy: 60, hunger: 8, ms: 5_600, asleep: false, why: "too hungry wakes" },
  ];
  for (const c of cases) {
    assert.equal(web(c.energy, c.hunger, c.ms), c.asleep, `web: ${c.why}`);
    assert.equal(desk(c.energy, c.hunger, c.ms), c.asleep, `desktop: ${c.why}`);
  }
  // Rest by day, then the clock runs: both wake once the pet is full, never before.
  let w = C.applyRest({ energy: 50, hunger: 80, mood: 60, hygiene: 80, health: 90 });
  let t = DAY;
  let wokeAt = 0;
  let restedBefore = 0;
  for (let i = 1; i <= 12 && !wokeAt; i += 1) {
    const next = C.decayStats(w, t, t + 20 * 60_000, false);
    if (!next.asleep) {
      wokeAt = i;
      restedBefore = w.energy;
    }
    w = next;
    t += 20 * 60_000;
  }
  assert.ok(wokeAt > 0, "the web pet woke by itself");
  assert.equal(restedBefore, C.REST_WAKE_ENERGY, "it slept until fully rested, then woke");
});
