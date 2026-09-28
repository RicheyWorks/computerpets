const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");
const Robin = require("./robin-fly.js");
const Bird = require("./bird-fly.js");
const Guard = require("./frame-guard.js");

// Brick (robin) and Sip (hummingbird) on the overlay: the real pet.js functions, run on a fake element.
// The web desk had a bird frozen mid-air when hidden; these prove the overlay never keeps one.
const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");

function fnSource(name) {
  const start = petSrc.indexOf(`function ${name}(`);
  assert.ok(start >= 0, `pet.js has ${name}`);
  let depth = 0;
  for (let i = petSrc.indexOf("{", start); i < petSrc.length; i++) {
    if (petSrc[i] === "{") depth += 1;
    if (petSrc[i] === "}") {
      depth -= 1;
      if (depth === 0) return petSrc.slice(start, i + 1);
    }
  }
  throw new Error(`no end for ${name}`);
}

function fakeEl() {
  const classes = new Set();
  return {
    style: {},
    classList: { add: (c) => classes.add(c), remove: (c) => classes.delete(c), contains: (c) => classes.has(c) },
    setAttribute() {},
    shown: () => classes.has("show"),
  };
}

function overlay(hostKey) {
  const robinEl = fakeEl();
  const birdEl = fakeEl();
  const guestEl = fakeEl();
  const logs = [];
  const ctx = {
    window: { PetRobinFly: Robin, PetBirdFly: Bird, PetFrameGuard: Guard, PetDeskHouse: { playVoice() {} }, innerWidth: 1280, innerHeight: 720 },
    robinEl,
    birdEl,
    guestEl,
    kind: { key: hostKey || "cat" },
    life: { hidden: false, asleep: false },
    sim: { x: 200, facing: 1, anim: "trick", trick: { kind: "spin" }, play: null, happy: null },
    card: {},
    paintBroken: false,
    painted: 0,
    said: [],
    pack: () => ({ idle: ["i.png"], play: ["p1.png", "p2.png"], sit: ["s.png"], walk: ["w.png"] }),
    say(text) { ctx.said.push(text); },
    ruiSleepBout: () => false,
  };
  ctx.paintActor = () => {
    if (ctx.paintBroken) throw new Error("injected paint fault");
    ctx.painted += 1;
  };
  vm.createContext(ctx);
  const names = ["dropRobin", "dropBird", "callRobin", "tickRobin", "callSip", "tickBird", "endVisit", "resetAfterFrameError"];
  vm.runInContext(
    "var robinFly = null, robinAcc = 0, robinFrame = 0, birdFly = null, birdAcc = 0, birdFrame = 0, sipSleepCalled = false, visit = null;\n" +
      names.map(fnSource).join("\n") +
      "\nvar frameGuard = window.PetFrameGuard.makeGuard({ reset: resetAfterFrameError, log: (t) => logs.push(t) });",
    Object.assign(ctx, { logs }),
  );
  return ctx;
}

function run(ctx, code) {
  return vm.runInContext(code, ctx);
}

test("Brick flies in, stays, flies off, and his canvas leaves with him", () => {
  const o = overlay();
  run(o, "callRobin()");
  assert.equal(o.robinEl.shown(), true);
  let steps = 0;
  while (run(o, "robinFly") && steps < 4000) {
    run(o, "frameGuard.step(tickRobin, 0.05, 'robin')");
    steps += 1;
  }
  assert.ok(steps > 400 && steps < 4000, `a whole visit ran (${steps} frames)`);
  assert.equal(run(o, "robinFly"), null);
  assert.equal(o.robinEl.shown(), false, "no robin left on the glass after the flight");
  assert.ok(o.said.includes(Robin.ROBIN_SONG), "he sang while he stayed");
  assert.equal(run(o, "frameGuard.caught()"), 0);
});

test("hiding the pet mid-flight takes Brick off the glass on the next frame", () => {
  const o = overlay();
  run(o, "callRobin()");
  for (let i = 0; i < 20; i++) run(o, "tickRobin(0.05)");
  assert.equal(o.robinEl.shown(), true);
  const x = o.robinEl.style.transform;
  o.life.hidden = true;
  run(o, "tickRobin(0.05)");
  assert.equal(run(o, "robinFly"), null);
  assert.equal(o.robinEl.shown(), false, "not frozen mid-air while hidden");
  run(o, "tickRobin(0.05)");
  assert.equal(o.robinEl.style.transform, x, "nothing moves him once he is gone");
  run(o, "callRobin()");
  assert.equal(o.robinEl.shown(), false, "a call while hidden does not bring him back");
});

test("a broken robin frame drops Brick instead of freezing him mid-air", () => {
  const o = overlay();
  run(o, "callRobin()");
  for (let i = 0; i < 10; i++) run(o, "tickRobin(0.05)");
  o.paintBroken = true;
  assert.equal(run(o, "frameGuard.step(tickRobin, 0.05, 'robin')"), false);
  assert.equal(run(o, "robinFly"), null, "the flight is gone");
  assert.equal(o.robinEl.shown(), false, "the canvas is gone");
  for (let i = 0; i < 30; i++) run(o, "frameGuard.step(tickRobin, 0.05, 'robin')");
  assert.equal(run(o, "frameGuard.caught()"), 1, "the fault does not repeat every frame");
  assert.equal(o.logs.length, 1);
  assert.match(o.logs[0], /\(robin\)/);
});

test("Sip flies a whole visit and leaves nothing behind", () => {
  const o = overlay();
  run(o, "callSip()");
  assert.equal(o.birdEl.shown(), true);
  let steps = 0;
  while (run(o, "birdFly") && steps < 6000) {
    run(o, "frameGuard.step(tickBird, 0.05, 'bird')");
    steps += 1;
  }
  assert.ok(steps > 20 && steps < 6000, `a whole visit ran (${steps} frames)`);
  assert.equal(o.birdEl.shown(), false, "no bird left on the glass after the flight");
  assert.equal(run(o, "frameGuard.caught()"), 0);
});

test("hiding the pet mid-flight takes Sip off the glass on the next frame", () => {
  const o = overlay();
  run(o, "callSip()");
  for (let i = 0; i < 10; i++) run(o, "tickBird(0.05)");
  assert.equal(o.birdEl.shown(), true);
  o.life.hidden = true;
  run(o, "tickBird(0.05)");
  assert.equal(run(o, "birdFly"), null);
  assert.equal(o.birdEl.shown(), false, "not frozen mid-air while hidden");
});

test("a broken bird frame drops Sip instead of freezing her mid-air", () => {
  const o = overlay();
  run(o, "callSip()");
  o.paintBroken = true;
  assert.equal(run(o, "frameGuard.step(tickBird, 0.2, 'bird')"), false);
  assert.equal(run(o, "birdFly"), null);
  assert.equal(o.birdEl.shown(), false);
  for (let i = 0; i < 30; i++) run(o, "frameGuard.step(tickBird, 0.2, 'bird')");
  assert.equal(run(o, "frameGuard.caught()"), 1);
});

test("when the pet on the glass is the robin or the hummingbird, the guest copy steps aside", () => {
  const r = overlay("robin");
  run(r, "robinFly = window.PetRobinFly.beginRobinFly(1280, 720, true); robinEl.classList.add('show'); tickRobin(0.05)");
  assert.equal(run(r, "robinFly"), null);
  assert.equal(r.robinEl.shown(), false);
  const b = overlay(Bird.FLY_BIRD_KEY);
  run(b, "birdFly = window.PetBirdFly.beginFly(1280, 720, true); birdEl.classList.add('show'); tickBird(0.05)");
  assert.equal(run(b, "birdFly"), null);
  assert.equal(b.birdEl.shown(), false);
});

test("a broken visit guest leaves; a broken host pet still goes back to idle", () => {
  const o = overlay();
  run(o, "visit = { key: 'fox' }; guestEl.classList.add('show')");
  assert.equal(run(o, "frameGuard.step(() => { throw new Error('visit fault'); }, undefined, 'visit guest')"), false);
  assert.equal(run(o, "visit"), null);
  assert.equal(o.guestEl.shown(), false);
  assert.equal(run(o, "frameGuard.step(() => { throw new Error('trick fault'); }, 0, 'cat')"), false);
  assert.equal(o.sim.trick, null);
  assert.equal(o.sim.anim, "idle");
});

test("pet.js wires the drops: every early exit and the frame reset use dropRobin and dropBird", () => {
  assert.doesNotMatch(petSrc, /robinFly = null;\s*robinEl\.classList\.remove/, "one way out for Brick");
  assert.doesNotMatch(petSrc, /birdFly = null;\s*birdEl\.classList\.remove/, "one way out for Sip");
  const reset = fnSource("resetAfterFrameError");
  assert.match(reset, /petKey === "robin"\) dropRobin\(\)/);
  assert.match(reset, /petKey === "bird"\) dropBird\(\)/);
  assert.match(reset, /petKey === "visit guest"\) endVisit\(\)/);
  assert.match(reset, /safeIdle\(sim\)/);
});
