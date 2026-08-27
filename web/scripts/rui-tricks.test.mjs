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
  assert.equal(T.shouldAbort({ asleep: true, hidden: false, leaving: false, cmd: "idle" }), true);
  assert.equal(T.shouldAbort({ asleep: false, hidden: false, leaving: false, cmd: "idle" }), false);
  assert.equal(T.pickTrick(0.99, true), "dance");
  assert.equal(Overlay.TRICK_KEY, "red_panda");
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
  const wave = T.beginTrick("wave", 80, 1);
  assert.equal(wave.anim, "talk");
});
