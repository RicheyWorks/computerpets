import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const T = await import(join(root, "src/lib/pets/rui-tricks.ts"));
const Overlay = createRequire(import.meta.url)(join(root, "../desktop/renderer/rui-tricks.js"));

test("Rui tricks start only on idle ground", () => {
  assert.deepEqual([...T.TRICKS], ["somersault", "lie", "scratch", "wave", "dance"]);
  assert.equal(T.canStart({ asleep: false, hidden: false, leaving: false, cmd: "idle" }), true);
  assert.equal(T.canStart({ asleep: true, hidden: false, leaving: false, cmd: "idle" }), false);
  assert.equal(T.canStart({ asleep: false, hidden: true, leaving: false, cmd: "idle" }), false);
  assert.equal(T.canStart({ asleep: false, hidden: false, leaving: false, cmd: "sleep" }), false);
  assert.equal(T.canStart({ asleep: false, hidden: false, leaving: false, cmd: "seek" }), false);
  assert.equal(T.canStart({ asleep: false, hidden: false, leaving: false, cmd: "idle", windowPlay: true }), false);
  assert.equal(T.canStart({ asleep: false, hidden: false, leaving: false, cmd: "idle", card: true }), false);
  assert.equal(T.shouldAbort({ asleep: true, hidden: false, leaving: false, cmd: "idle" }), true);
  assert.equal(T.shouldAbort({ asleep: false, hidden: false, leaving: false, cmd: "idle", card: true }), true);
  assert.equal(T.shouldAbort({ asleep: false, hidden: false, leaving: false, cmd: "idle" }), false);
  assert.equal(T.pickTrick(0.99, true), "dance");
  assert.notEqual(T.pickTrick(0.3, false, "lie"), "lie");
  assert.equal(Overlay.TRICK_KEY, "red_panda");
  assert.equal(T.sleepHoldFrame("red_panda", 4), 1);
  assert.equal(T.sleepHoldFrame("cat", 4), null);
});

test("somersault is a rotate+arc on existing play frames", () => {
  const start = T.beginTrick("somersault", 80, 1);
  assert.equal(start.anim, "play");
  const mid = T.stepTrick(start, 0.46);
  assert.ok(mid.lift > 20);
  assert.ok(Math.abs(mid.rot) > 90);
  const done = T.stepTrick(start, 1);
  assert.equal(done.phase, "done");
  const lie = T.beginTrick("lie", 80, 1);
  assert.equal(lie.anim, "sleep");
  assert.equal(lie.phase, "lie");
  const held = T.stepTrick(lie, 6);
  assert.equal(held.phase, "lie");
  assert.equal(held.anim, "sleep");
  assert.equal(held.rot, 0);
  const stretch = T.stepTrick(lie, T.LIE_HOLD + 0.4);
  assert.equal(stretch.phase, "stretch");
  assert.equal(stretch.anim, "sit");
  const flip = T.stepTrick(lie, T.LIE_HOLD + T.STRETCH_S + 0.4);
  assert.equal(flip.phase, "flip");
  assert.equal(flip.anim, "play");
  assert.ok(Math.abs(flip.rot) > 40);
  const doneLie = T.stepTrick(lie, T.DUR.lie + 0.1);
  assert.equal(doneLie.phase, "done");
  const aborted = T.stepTrick(held, 0.1, { asleep: true, cmd: "sleep" });
  assert.equal(aborted.phase, "done");
  assert.ok(T.nextTrickWait(true, 0, "lie") > T.nextTrickWait(true, 0, "wave"));
  const wave = T.beginTrick("wave", 80, 1);
  assert.equal(wave.anim, "talk");
});
