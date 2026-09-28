import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const FG = await import(pathToFileURL(join(root, "src/lib/pets/frame-guard.ts")).href);
const Overlay = createRequire(import.meta.url)(join(root, "../desktop/renderer/frame-guard.js"));

/** The desk guests' loops, each with its guard key and what it does when it breaks. */
const GUESTS = [
  { file: "robin-fly.tsx", key: "() => ROBIN_KEY", leaves: true },
  { file: "bird-fly.tsx", key: "() => FLY_BIRD_KEY", leaves: true },
  { file: "called-guests.tsx", key: "() => ALL_CALLED", leaves: true },
  { file: "desk-plants.tsx", key: '() => "plants"', leaves: false },
  { file: "blotter.tsx", key: '() => "carried lure"', leaves: false },
];

function fakeRaf() {
  let queue = [];
  return {
    schedule: (fn) => queue.push(fn),
    /** cancelAnimationFrame for the frame asked for last. */
    cancelLast: () => {
      queue.pop();
    },
    run(n) {
      for (let i = 0; i < n; i++) {
        const due = queue;
        queue = [];
        for (const fn of due) fn(i * 16);
      }
    },
    pending: () => queue.length,
  };
}

test("a guest guard lives across visits: the same error on every visit is logged once", () => {
  const logs = [];
  const guard = FG.makeGuestGuard({ log: (t) => logs.push(t), outcome: "The robin leaves the desk; the other pets keep moving." });
  let left = 0;
  for (let visit = 0; visit < 3; visit++) {
    const raf = fakeRaf();
    let steps = 0;
    const loop = FG.guardedLoop(() => {
      steps += 1;
      if (steps === 2) throw new Error("broken flight");
      return true;
    }, raf.schedule, guard, () => "robin");
    guard.onReset(() => {
      left += 1;
      loop.stop();
    });
    raf.schedule(loop);
    raf.run(10);
    assert.equal(steps, 2, `visit ${visit}: the loop stopped at the broken step`);
    assert.equal(raf.pending(), 0);
    guard.onReset(null);
  }
  assert.equal(left, 3, "each visit's own reset ran");
  assert.equal(guard.caught(), 3);
  assert.deepEqual(logs, ["desk frame error (robin): Error: broken flight. The robin leaves the desk; the other pets keep moving."]);
});

test("a frame that returns false ends the loop; true or nothing keeps it going", () => {
  const raf = fakeRaf();
  let n = 0;
  const loop = FG.guardedLoop(() => (++n < 4 ? undefined : false), raf.schedule, FG.makeGuard({ log: () => {} }));
  raf.schedule(loop);
  raf.run(10);
  assert.equal(n, 4);
  assert.equal(loop.stopped(), true);
  assert.equal(raf.pending(), 0);
});

test("a guest that keeps running after a throw (plants, the carried lure) steps on the next frame", () => {
  const raf = fakeRaf();
  let lean = 5;
  let n = 0;
  const guard = FG.makeGuestGuard({ log: () => {} });
  guard.onReset(() => {
    lean = 0;
  });
  const loop = FG.guardedLoop(() => {
    n += 1;
    if (n === 3) throw new Error("wind");
    lean = 5;
  }, raf.schedule, guard, () => "plants");
  raf.schedule(loop);
  raf.run(3);
  assert.equal(lean, 0, "upright right after the throw");
  raf.run(1);
  assert.equal(n, 4, "the next frame ran");
  assert.equal(lean, 5);
  assert.equal(loop.stopped(), false);
});

test("musicMayDance holds music off for the backoff after a broken trick, same as the overlay", () => {
  for (const lib of [FG, Overlay]) {
    const pet = { trick: null, happy: null, play: null, act: null, actMotion: null, pendingPose: null, poseHold: 0, anim: "play", hop: 0, land: 0, trickWait: 0 };
    assert.equal(lib.musicMayDance(pet, 0.016), true);
    lib.safeIdle(pet);
    assert.equal(pet.brokeWait, 8);
    let held = 0;
    while (!lib.musicMayDance(pet, 0.5)) held += 1;
    assert.equal(held, 16);
  }
  const living = readFileSync(join(root, "src/components/desk/living-pet.tsx"), "utf8");
  assert.match(living, /const musicWantsDance = musicMayDance\(s, dt\) && musicRef\.current/);
});

test("a loop with a cancel leaves no frame queued on the very frame it stops (return false, or stop from a reset)", () => {
  for (const lib of [FG, Overlay]) {
    // Return false: the frame already asked for is cancelled at once, not one paint later.
    const raf = fakeRaf();
    let n = 0;
    let cancels = 0;
    const loop = lib.guardedLoop(() => (++n < 3 ? true : false), raf.schedule, lib.makeGuard({ log: () => {} }), () => "robin", () => {
      cancels += 1;
      raf.cancelLast();
    });
    raf.schedule(loop);
    raf.run(3);
    assert.equal(n, 3);
    assert.equal(loop.stopped(), true);
    assert.equal(raf.pending(), 0, "nothing waits behind a guest that has left");
    assert.equal(cancels, 1);
    loop.stop();
    assert.equal(cancels, 1, "stopping twice cancels once");
    // A reset that stops the loop mid-frame cancels the frame it had just asked for.
    const raf2 = fakeRaf();
    const guard = lib.makeGuard({ log: () => {}, reset: () => loop2.stop() });
    const loop2 = lib.guardedLoop(() => {
      throw new Error("broken flight");
    }, raf2.schedule, guard, () => "bird", () => raf2.cancelLast());
    raf2.schedule(loop2);
    raf2.run(1);
    assert.equal(raf2.pending(), 0, "a broken guest leaves no frame behind either");
  }
});

test("the overlay's guardedLoop has the same stop rules", () => {
  const raf = fakeRaf();
  let n = 0;
  const loop = Overlay.guardedLoop(() => (++n < 2 ? true : false), raf.schedule, Overlay.makeGuard({ log: () => {} }));
  raf.schedule(loop);
  raf.run(5);
  assert.equal(n, 2);
  assert.equal(loop.stopped(), true);
});

for (const g of GUESTS) {
  test(`${g.file}: its frame loop runs through a guest guard and schedules first`, () => {
    const src = readFileSync(join(root, "src/components/desk", g.file), "utf8");
    assert.match(src, /import \{ guardedLoop, makeGuestGuard \} from "@\/lib\/pets\/frame-guard";/);
    assert.match(src, /const \[guard\] = useState\(\(\) => makeGuestGuard\(\{ outcome: "[^"]+" \}\)\);/);
    assert.ok(src.includes(`const tick = guardedLoop(step, (next) => { raf = window.requestAnimationFrame(next); }, guard, ${g.key}, () => window.cancelAnimationFrame(raf));`), "guardedLoop with its key and its cancel");
    assert.match(src, /guard\.onReset\(/, "a reset for this guest");
    assert.match(src, /tick\.stop\(\);\s*guard\.onReset\(null\);\s*window\.cancelAnimationFrame\(raf\);/, "cleanup stops the loop");
    assert.doesNotMatch(src, /raf = window\.requestAnimationFrame\(tick\);\s*\};/, "no frame schedules itself at its end any more");
    if (g.leaves) assert.match(src, /return false;/, "the loop ends when the guest has gone");
  });
}
