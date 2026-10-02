// Reduced motion 2 (September 2026): the pet itself and the house visitor follow the system's reduced-motion setting
// in the overlay, as Brick, Sip, called guests and the plants already did (calm-motion.js). A walk is a cut to where
// it ends, an idle wander waits, a pose is held on its first frame (a once-through pose still ends on time), the bob,
// breath, hop and lean stop, and window plays, tricks and small acts wait. The visitor's walk is run for real here;
// the pet's frame is pinned by source, and driven in Electron by first-run-drive.cjs (reduced_motion_pet_still).
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");
const Calm = require("./calm-motion.js");

const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");

function fnSource(name) {
  const start = petSrc.indexOf(`function ${name}(`);
  assert.ok(start >= 0, name);
  let depth = 0;
  for (let i = petSrc.indexOf("{", start); i < petSrc.length; i++) {
    if (petSrc[i] === "{") depth += 1;
    else if (petSrc[i] === "}") {
      depth -= 1;
      if (depth === 0) return petSrc.slice(start, i + 1);
    }
  }
  throw new Error(`no end for ${name}`);
}

test("calmOnceS: a once-through pose lasts as long as its frames would, never under 0.4 s", () => {
  assert.equal(Calm.calmOnceS(8, 8), 1);
  assert.equal(Calm.calmOnceS(6, 4), 1.5);
  assert.equal(Calm.calmOnceS(2, 10), 0.4);
  assert.equal(Calm.calmOnceS(0, 8), 0.4);
  assert.equal(Calm.calmOnceS(4, 0), 0.4);
});

/** The visitor's frame from pet.js, with a stand-in law: in for 1 s, a line, a wander, then out. */
function visitor(calm) {
  const painted = [];
  const guestEl = { style: {}, classList: { add() {}, remove() {}, contains: () => true } };
  const ctx = {
    guestEl,
    life: { hidden: false },
    visit: { key: "twig", born: 0, x: 1400, target: 900, facing: -1, frame: 0, acc: 0, said: false, wandered: false, placed: false, tapped: false, sprites: { walk: ["w0.png", "w1.png"], idle: ["i0.png"], talk: ["t0.png"] } },
    said: [],
    ended: 0,
    visitLaw: () => ({
      visitPhaseFromEnter: (age) => (age < 1000 ? "in" : age < 2000 ? "talk" : age < 3000 ? "wander" : age < 4000 ? "leave" : "gone"),
      visitLine: () => "Hello.",
    }),
    say(t) { ctx.said.push(t); },
    endVisit() { ctx.ended += 1; },
    paintActor(_el, src) { painted.push(src); },
    calmNow: () => calm,
  };
  vm.createContext(ctx);
  vm.runInContext(fnSource("tickVisit"), ctx);
  return { ctx, painted, tick: (now) => vm.runInContext(`tickVisit(0.05, ${now}, 1600)`, ctx) };
}

test("reduced motion: the house visitor is drawn standing where its walk ends, stays there, and leaves in one cut", () => {
  const v = visitor(true);
  v.tick(100);
  assert.equal(v.ctx.visit.x, 900, "at its spot on the first frame, not walked in");
  assert.deepEqual(v.painted, ["i0.png"], "standing, not a walk frame");
  v.tick(1500);
  assert.deepEqual(v.ctx.said, ["Hello."], "it still says its line");
  v.tick(2500);
  v.tick(2600);
  assert.equal(v.ctx.visit.x, 900, "the wander waits under reduced motion");
  v.tick(3500);
  assert.equal(v.ctx.visit.x, -140, "off the screen in one cut");
  assert.ok(!v.painted.some((src) => src.startsWith("w")), "no walk frame was drawn");
});

test("without the setting the visitor still walks in step by step", () => {
  const v = visitor(false);
  v.tick(100);
  assert.ok(Math.abs(v.ctx.visit.x - (1400 - 86 * 0.05)) < 1e-9);
  assert.match(v.painted[0], /^w/, "a walk frame");
  v.tick(2500);
  assert.notEqual(v.ctx.visit.target, 900, "and wanders");
});

test("the pet's frame under reduced motion: a cut, no turn on the spot, a wander that waits, first frames, no bob or tilt", () => {
  assert.match(petSrc, /function tickFrame\(now\) \{[\s\S]{0,700}const calm = calmNow\(\);/);
  assert.match(petSrc, /\} else if \(calm && sim\.anim === "walk" && sim\.target != null\) \{[\s\S]{0,200}sim\.x = sim\.target;\s+landWalk\(\);/);
  assert.match(petSrc, /if \(desired !== sim\.facing && !calmNow\(\)\) \{/);
  assert.match(petSrc, /if \(sim\.cmd === "wander" && calmNow\(\)\) \{[\s\S]{0,300}applyArrive\("arrive"\);\s+return;/);
  assert.match(petSrc, /const fps = calm \? 0 : FPS\[sim\.anim\]/);
  assert.match(petSrc, /if \(calm && ONCE\.has\(sim\.anim\)\) \{[\s\S]{0,200}window\.PetCalm\.calmOnceS\(kind\.sprites\[sim\.anim\]\.length, FPS\[sim\.anim\]\)/);
  assert.match(petSrc, /const src = frames\[calm && sim\.anim !== "sleep" \? 0 : Math\.min\(sim\.frame, frames\.length - 1\)\];/);
  assert.match(petSrc, /if \(!calm\) sim\.x = sim\.happy\.x;/);
  for (const piece of [
    /const hopPx = sim\.hop > 0 && !calm \?/,
    /sim\.anim === "walk" && !calm\n/,
    /const water = trait\.aquatic && !calm \?/,
    /!calm && \(sim\.anim === "idle" \|\| sim\.anim === "sit" \|\| sim\.anim === "sleep"\)/,
    /const pose = sim\.act && !calm \?/,
    /const stretch = calm \? 1 :/,
    /const climbRot = calm \? 0 :/,
  ]) assert.match(petSrc, piece);
  // Window plays, tricks and small acts wait; so does the small idle shift.
  assert.equal((petSrc.match(/\} else if \(\n\s+!calm &&\n/g) || []).length, 3);
  assert.match(petSrc, /if \(!calm && \(sim\.anim === "idle" \|\| sim\.anim === "sit"\) && sim\.shiftAge <= 0/);
  // One landing for both ways of getting there.
  assert.equal((petSrc.match(/landWalk\(\);/g) || []).length, 2);
});

test("the drive checks the pet under reduced motion in real Electron", () => {
  const drive = readFileSync(join(__dirname, "..", "first-run-drive.cjs"), "utf8");
  assert.match(drive, /await page\.emulateMedia\(\{ reducedMotion: "reduce" \}\);/);
  assert.match(drive, /await page\.emulateMedia\(\{ reducedMotion: null \}\);/);
  assert.match(drive, /check\(\s*"reduced_motion_pet_still"/);
});
