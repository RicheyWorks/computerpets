const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const FG = require("./frame-guard.js");

function fakeRaf() {
  const queue = [];
  return {
    schedule: (fn) => queue.push(fn),
    runFrames(n, start = 0) {
      let now = start;
      for (let i = 0; i < n && queue.length; i += 1) {
        const fn = queue.shift();
        now += 16;
        fn(now);
      }
      return queue.length;
    },
    pending: () => queue.length,
  };
}

test("a frame that throws still schedules the next frame", () => {
  const raf = fakeRaf();
  const logs = [];
  const guard = FG.makeGuard({ log: (t) => logs.push(t) });
  let ran = 0;
  const loop = FG.guardedLoop(() => {
    ran += 1;
    throw new Error("broken pose");
  }, raf.schedule, guard, () => "cat");
  raf.schedule(loop);
  const left = raf.runFrames(30);
  assert.equal(ran, 30, "every frame ran");
  assert.equal(left, 1, "the next frame is always queued");
  assert.equal(guard.caught(), 30);
  assert.equal(logs.length, 1, "logged once for one distinct error");
  assert.match(logs[0], /\(cat\)/);
  assert.match(logs[0], /Error: broken pose/);
});

test("logs once per distinct error and pet key", () => {
  const logs = [];
  const guard = FG.makeGuard({ log: (t) => logs.push(t) });
  const boom = (msg) => () => { throw new TypeError(msg); };
  for (let i = 0; i < 5; i += 1) {
    guard.step(boom("a"), 0, "cat");
    guard.step(boom("a"), 0, "dog");
    guard.step(boom("b"), 0, "cat");
  }
  assert.equal(logs.length, 3);
  assert.equal(guard.distinct(), 3);
  assert.equal(guard.caught(), 15);
  assert.ok(logs.some((t) => t.includes("(dog)") && t.includes("TypeError: a")));
  assert.equal(guard.step(() => {}, 0, "cat"), true, "a good step reports true");
});

test("log count is capped so a storm of new errors cannot flood the console", () => {
  const logs = [];
  const guard = FG.makeGuard({ log: (t) => logs.push(t) });
  for (let i = 0; i < FG.LOG_LIMIT + 40; i += 1) guard.step(() => { throw new Error(`e${i}`); }, 0, "cat");
  assert.equal(logs.length, FG.LOG_LIMIT);
});

test("reset gets the pet key and puts the sim at a safe idle", () => {
  const sim = {
    x: 40, anim: "flip", hop: 3, land: 0.5, cmd: "eat",
    trick: { kind: "flip" }, happy: { kind: "spin" }, play: { phase: "climb" }, thankYou: true,
    act: { kind: "groom" }, actMotion: {}, pendingPose: "sit", poseHold: 2, trickWait: 0.1,
  };
  const keys = [];
  const guard = FG.makeGuard({
    log: () => {},
    reset: (key) => { keys.push(key); FG.safeIdle(sim); },
  });
  assert.equal(guard.step(() => { throw new Error("trick broke"); }, 0, "cat"), false);
  assert.deepEqual(keys, ["cat"]);
  assert.equal(sim.trick, null);
  assert.equal(sim.happy, null);
  assert.equal(sim.play, null);
  assert.equal(sim.thankYou, false);
  assert.equal(sim.act, null);
  assert.equal(sim.anim, "idle");
  assert.equal(sim.cmd, "wander");
  assert.equal(sim.hop, 0);
  assert.equal(sim.x, 40, "the pet stays where it stood");
  assert.ok(sim.trickWait >= FG.TRICK_BACKOFF, "a broken trick is not retried on the next frame");
});

test("a reset that throws is swallowed and the loop keeps going", () => {
  const raf = fakeRaf();
  const guard = FG.makeGuard({ log: () => {}, reset: () => { throw new Error("reset broke"); } });
  const loop = FG.guardedLoop(() => { throw new Error("x"); }, raf.schedule, guard, () => "cat");
  raf.schedule(loop);
  assert.doesNotThrow(() => raf.runFrames(5));
  assert.equal(raf.pending(), 1);
});

test("safeIdle ignores a missing sim", () => {
  assert.equal(FG.safeIdle(null), null);
  assert.equal(FG.safeIdle(undefined), undefined);
});

test("pet.js runs its frame through the guard and no longer schedules at the end of the frame", () => {
  const src = fs.readFileSync(path.join(__dirname, "pet.js"), "utf8");
  const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  assert.match(src, /function tickFrame\(now\)/);
  assert.match(src, /const tick = window\.PetFrameGuard\.guardedLoop\(tickFrame,/);
  assert.match(src, /window\.PetFrameGuard\.safeIdle\(sim\)/);
  const start = src.indexOf("function tickFrame(now)");
  const end = src.indexOf("function resetAfterFrameError", start);
  assert.ok(start > 0 && end > start);
  const body = src.slice(start, end);
  assert.doesNotMatch(body, /requestAnimationFrame\(tick\)/, "the loop schedules itself before the frame, not inside it");
  for (const key of ["visit guest", "bird", "robin", "plants", "called guests"]) {
    assert.ok(body.includes(`"${key}")`), `${key} runs in its own guarded step`);
  }
  const guardAt = html.indexOf('<script src="frame-guard.js"></script>');
  const petAt = html.indexOf('<script src="pet.js"></script>');
  assert.ok(guardAt > 0 && guardAt < petAt, "frame-guard.js loads before pet.js");
});

test("a frame that returns false ends the loop, and stop() ends it from outside", () => {
  const raf = fakeRaf();
  const guard = FG.makeGuard({ log: () => {} });
  let ran = 0;
  const loop = FG.guardedLoop(() => {
    ran += 1;
    return ran < 3;
  }, raf.schedule, guard, () => "robin");
  raf.schedule(loop);
  raf.runFrames(10);
  assert.equal(ran, 3, "the third frame said it was done");
  assert.equal(loop.stopped(), true);
  assert.equal(raf.pending(), 0, "nothing is asked for after the loop stopped");

  const raf2 = fakeRaf();
  let ran2 = 0;
  const guard2 = FG.makeGuard({ log: () => {}, reset: () => loop2.stop() });
  const loop2 = FG.guardedLoop(() => {
    ran2 += 1;
    if (ran2 === 2) throw new Error("broken flight");
  }, raf2.schedule, guard2, () => "robin");
  raf2.schedule(loop2);
  raf2.runFrames(10);
  assert.equal(ran2, 2, "a reset that calls stop() ends that guest's loop");
  assert.equal(raf2.pending(), 0);
});

test("music waits out brokeWait after a broken trick before it starts a dance again", () => {
  const sim = { trickWait: 0, brokeWait: 0 };
  assert.equal(FG.musicMayDance(sim, 0.016), true, "no broken trick: music may dance");
  FG.safeIdle(sim);
  assert.equal(sim.brokeWait, FG.TRICK_BACKOFF);
  let frames = 0;
  while (!FG.musicMayDance(sim, 0.5)) frames += 1;
  assert.equal(frames, FG.TRICK_BACKOFF / 0.5, "held for the whole backoff");
  const src = fs.readFileSync(path.join(__dirname, "pet.js"), "utf8");
  assert.match(src, /const musicWantsDance = window\.PetFrameGuard\.musicMayDance\(sim, dt\) && musicOn\(\)/);
});
