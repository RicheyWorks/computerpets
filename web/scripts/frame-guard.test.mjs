import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const FG = await import(pathToFileURL(join(root, "src/lib/pets/frame-guard.ts")).href);
const Cat = await import(pathToFileURL(join(root, "src/lib/pets/cat-tricks.ts")).href);
const Overlay = createRequire(import.meta.url)(join(root, "../desktop/renderer/frame-guard.js"));

function deskPet() {
  return {
    x: 300, facing: 1, anim: "idle", hop: 0, land: 0, trick: null, trickWait: 0, happy: null, play: null,
    act: null, actMotion: null, pendingPose: null, poseHold: 0,
  };
}

/** Runs the web desk's loop shape with a trick module whose step throws; returns what happened. */
function runBroken(frames) {
  const Broken = { ...Cat, stepTrick() { throw new Error("injected trick fault"); } };
  const queue = [];
  const logs = [];
  const pet = deskPet();
  const guard = FG.makeGuard({ log: (t) => logs.push(t), reset: () => FG.safeIdle(pet) });
  let begun = 0;
  let resets = 0;
  let last = 0;
  const frame = (now) => {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    if (pet.trick) {
      pet.trick = Broken.stepTrick(pet.trick, dt, { cmd: "wander" });
    } else {
      pet.trickWait -= dt;
      if (pet.trickWait <= 0) {
        pet.trick = Broken.beginTrick(Broken.TRICKS[0], pet.x, pet.facing);
        pet.anim = pet.trick.anim;
        begun += 1;
        pet.trickWait = Broken.nextTrickWait(false);
      }
    }
  };
  const tick = FG.guardedLoop(frame, (fn) => queue.push(fn), guard, () => Cat.TRICK_KEY);
  queue.push(tick);
  let now = 0;
  let ran = 0;
  for (; ran < frames && queue.length; ran += 1) {
    const had = !!pet.trick;
    now += 1000 / 60;
    queue.shift()(now);
    if (had && !pet.trick && pet.anim === "idle") resets += 1;
  }
  return { ran, pending: queue.length, logs, begun, resets, caught: guard.caught(), distinct: guard.distinct(), pet };
}

test("a throwing trick on the web desk is logged once and the pet goes back to idle", () => {
  const r = runBroken(1200);
  assert.equal(r.ran, 1200);
  assert.equal(r.pending, 1, "the next frame is always queued");
  assert.ok(r.begun >= 2, "the pet tries again after the backoff");
  assert.equal(r.caught, r.begun, "every broken step was caught");
  assert.equal(r.resets, r.caught, "each catch put the pet back to idle");
  assert.equal(r.distinct, 1);
  assert.equal(r.logs.length, 1);
  assert.match(r.logs[0], /^desk frame error \(cat\): Error: injected trick fault\. That pet goes back to idle and keeps moving\.$/);
  assert.equal(r.pet.trick, null);
  assert.equal(r.pet.anim, "idle");
});

test("distinct errors and distinct pets each log once", () => {
  const logs = [];
  const guard = FG.makeGuard({ log: (t) => logs.push(t) });
  const boom = (msg) => () => { throw new TypeError(msg); };
  for (let i = 0; i < 5; i += 1) {
    guard.step(boom("a"), 0, "cat");
    guard.step(boom("b"), 0, "cat");
    guard.step(boom("a"), 0, "dog");
  }
  assert.equal(guard.caught(), 15);
  assert.equal(guard.distinct(), 3);
  assert.equal(logs.length, 3);
  assert.equal(guard.step(() => {}, 0, "cat"), true);
});

test("a reset that throws does not stop the loop", () => {
  const guard = FG.makeGuard({ log: () => {}, reset: () => { throw new Error("reset broke"); } });
  assert.equal(guard.step(() => { throw new Error("x"); }, 0, "cat"), false);
  assert.equal(guard.caught(), 1);
});

test("safeIdle matches the overlay and only touches fields the pet has", () => {
  const overlaySim = { ...deskPet(), trick: { kind: "loaf" }, happy: { kind: "x" }, play: {}, act: "sniff", actMotion: {}, pendingPose: "sit", poseHold: 2, anim: "loaf", hop: 3, land: 1, trickWait: 2, thankYou: true, cmd: "talk" };
  assert.deepEqual(FG.safeIdle({ ...overlaySim }), Overlay.safeIdle({ ...overlaySim }));
  assert.equal(FG.TRICK_BACKOFF, Overlay.TRICK_BACKOFF);
  assert.equal(FG.LOG_LIMIT, Overlay.LOG_LIMIT);
  const web = FG.safeIdle({ ...deskPet(), trick: { kind: "loaf" }, anim: "loaf", trickWait: 20 });
  assert.equal("cmd" in web, false);
  assert.equal("thankYou" in web, false);
  assert.equal(web.trickWait, 20, "a longer wait is kept");
  assert.equal(FG.errorText(new RangeError("bad")), Overlay.errorText(new RangeError("bad")));
  assert.equal(FG.errorText("plain"), "plain");
});

test("living-pet.tsx runs its frame through the guard and has no `as never` casts", () => {
  const src = readFileSync(join(root, "src/components/desk/living-pet.tsx"), "utf8");
  assert.match(src, /from "@\/lib\/pets\/frame-guard"/);
  assert.match(src, /const tick = guardedLoop\(\s*frame,/);
  assert.match(src, /safeIdle\(s\);/);
  const body = src.slice(src.indexOf("const frame = (now: number) => {"), src.indexOf("const tick = guardedLoop("));
  assert.ok(body.length > 5000);
  assert.doesNotMatch(body, /requestAnimationFrame|catch \{/);
  assert.doesNotMatch(src, /as never/);
  assert.match(src, /stepGroundTrick\(GT, s\.trick,/);
  assert.match(src, /stepGroundHappy\(GT, s\.happy,/);
  assert.match(src, /nextGroundTrickWait\(GT, true, undefined, s\.lastTrick\)/);
});
