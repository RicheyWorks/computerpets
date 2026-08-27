const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const P = require("./window-play.js");

const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const htmlSrc = readFileSync(join(__dirname, "index.html"), "utf8");

const WORK = { width: 1400, height: 800, floorLift: 0 };
const WIN = { id: "hw", x: 360, y: 80, width: 640, height: 420 };

test("Rui's door is cling and dive; Arc rides the ridge; Volt coils a corner; Trace traces a path; Flux fields the glass; Spark crackles an edge; Ion charges a corner; Gauss orbits; Relay clicks; Fuse holds; Ground earths; Miso sits a ledge; other guests walk a sill", () => {
  assert.equal(P.playFor("red_panda"), "cling-dive");
  assert.equal(P.playFor("cyber_dragon"), "ridge");
  assert.equal(P.playFor("volt_dragon"), "coil");
  assert.equal(P.playFor("trace_dragon"), "path");
  assert.equal(P.playFor("flux_dragon"), "field");
  assert.equal(P.playFor("spark_dragon"), "crackle");
  assert.equal(P.playFor("ion_dragon"), "charge");
  assert.equal(P.playFor("gauss_dragon"), "orbit");
  assert.equal(P.playFor("relay_dragon"), "click");
  assert.equal(P.playFor("fuse_dragon"), "hold");
  assert.equal(P.playFor("ground_dragon"), "earth");
  assert.equal(P.playFor("cat"), "ledge");
  assert.equal(P.playFor("dog"), "sill");
  assert.equal(P.playFor("gecko"), "sill");
  const rui = P.pickTarget([WIN], 80, "red_panda", WORK, P.SPRITE, {
    rand: 0.9,
    side: "left",
    diveFrom: "side",
    spin: "spin",
  });
  assert.ok(rui);
  assert.equal(rui.kind, "cling-dive");
  assert.equal(rui.side, "left");
  const arc = P.pickTarget([WIN], 80, "cyber_dragon", WORK, P.SPRITE, { leave: "hop" });
  assert.ok(arc);
  assert.equal(arc.kind, "ridge");
  assert.equal(arc.side, "top");
  assert.notEqual(arc.kind, "cling-dive");
  assert.notEqual(arc.kind, "sill");
  assert.notEqual(arc.kind, "coil");
  const volt = P.pickTarget([WIN], 80, "volt_dragon", WORK, P.SPRITE, { side: "left" });
  assert.ok(volt);
  assert.equal(volt.kind, "coil");
  assert.equal(volt.side, "left");
  assert.notEqual(volt.kind, "cling-dive");
  assert.notEqual(volt.kind, "ridge");
  assert.notEqual(volt.kind, "sill");
  const cat = P.pickTarget([WIN], 80, "cat", WORK, P.SPRITE);
  assert.ok(cat);
  assert.equal(cat.kind, "ledge");
  assert.equal(cat.side, "top");
  assert.notEqual(cat.kind, "cling-dive");
  assert.notEqual(cat.kind, "ridge");
  assert.notEqual(cat.kind, "earth");
  assert.notEqual(cat.kind, "sill");
  const dog = P.pickTarget([WIN], 80, "dog", WORK, P.SPRITE);
  assert.ok(dog);
  assert.equal(dog.kind, "sill");
  assert.equal(dog.side, "top");
  const trace = P.pickTarget([WIN], 80, "trace_dragon", WORK, P.SPRITE, { side: "left", leave: "hop" });
  assert.ok(trace);
  assert.equal(trace.kind, "path");
  assert.equal(trace.side, "left");
  assert.notEqual(trace.kind, "cling-dive");
  assert.notEqual(trace.kind, "ridge");
  assert.notEqual(trace.kind, "coil");
  assert.notEqual(trace.kind, "sill");
  const flux = P.pickTarget([WIN], 80, "flux_dragon", WORK, P.SPRITE, { leave: "drift" });
  assert.ok(flux);
  assert.equal(flux.kind, "field");
  assert.equal(flux.side, "glass");
  assert.notEqual(flux.kind, "cling-dive");
  assert.notEqual(flux.kind, "ridge");
  assert.notEqual(flux.kind, "coil");
  assert.notEqual(flux.kind, "path");
  assert.notEqual(flux.kind, "sill");
});

test("Rui approaches a window side, clings, hangs, then dives with a spin path", () => {
  const target = P.pickTarget([WIN], 40, "red_panda", WORK, P.SPRITE, {
    rand: 0.8,
    side: "right",
    diveFrom: "side",
    spin: "spin",
  });
  let play = P.beginPlay(target, target.approachX);
  assert.equal(play.phase, "approach");
  const seen = new Set();
  let diveRot = 0;
  let diveLift = 0;
  for (let i = 0; i < 400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
    if (play.phase === "dive") {
      diveRot = Math.max(diveRot, Math.abs(play.rot));
      diveLift = Math.max(diveLift, play.lift);
    }
    if (play.phase === "cling" || play.phase === "hang") {
      assert.ok(play.lift > 40, "Rui holds above the floor");
      assert.equal(play.facing, -1);
    }
  }
  assert.ok(diveRot > 20, "dive rotates existing frames");
  assert.ok(diveLift > 40);
  assert.ok(seen.has("leap"));
  assert.ok(seen.has("cling"));
  assert.ok(seen.has("hang"));
  assert.ok(seen.has("dive"));
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
  assert.ok(!seen.has("sill-walk"));
});

test("a dive is motion, not a stamp — backflip and 360 both rotate through the path", () => {
  const from = { x: 400, lift: 220, side: "left" };
  const to = { x: 300, lift: 0 };
  const start = P.divePath(0, from, to, "spin");
  const mid = P.divePath(0.5, from, to, "spin");
  const end = P.divePath(1, from, to, "spin");
  assert.equal(start.rot, 0);
  assert.equal(start.x, from.x);
  assert.equal(end.rot, 360);
  assert.ok(Math.abs(end.lift) < 0.001);
  assert.ok(mid.lift > end.lift, "the arc rises then lands");
  assert.ok(Math.abs(mid.rot - 180) < 0.001);
  const flip = P.divePath(1, from, to, "backflip");
  assert.equal(flip.rot, -360);
});

test("sleep, hide, and a missing window abort the climb — an asleep guest never starts", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.canStart({ leaving: true, cmd: "wander" }), false);
  assert.equal(P.canStart({ asleep: false, hidden: false, cmd: "idle" }), true);
  assert.equal(P.shouldAbort({ asleep: true, cmd: "idle" }), true);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "wander" }), false);

  const target = P.pickTarget([WIN], 40, "red_panda", WORK, P.SPRITE, { side: "left", spin: "spin", diveFrom: "side" });
  let play = P.beginPlay(target, target.approachX);
  play = P.stepPlay(play, 0.6, { x: play.x, lift: 0 }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "leap");
  play = P.stepPlay(play, 0.6, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done");
  assert.equal(play.abort, true);

  play = P.beginPlay(target, target.approachX);
  play = P.stepPlay(play, 0.6, { x: play.x, lift: 0 }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  play = P.stepPlay(play, 0.6, { x: play.x, lift: play.lift }, [], WORK, P.SPRITE, { cmd: "idle" });
  assert.ok(play.phase === "drop" || play.phase === "done");
});

test("a moved window refits the cling hold", () => {
  const target = P.pickTarget([WIN], 200, "red_panda", WORK, P.SPRITE, { side: "left", spin: "backflip", diveFrom: "top" });
  let play = P.beginPlay(target, target.approachX);
  play = P.stepPlay(play, 0.6, { x: play.x, lift: 0 }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  play = P.stepPlay(play, 0.6, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "cling");
  const moved = { ...WIN, x: WIN.x + 120 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "cling");
  assert.ok(Math.abs(play.target.holdX - target.holdX) > 40);
  assert.equal(play.x, play.target.holdX);
});

test("other guests do not clone Rui's cling — they walk a sill and hop down", () => {
  const target = P.pickTarget([WIN], 80, "dog", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  for (let i = 0; i < 400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "cling");
    assert.notEqual(play.phase, "dive");
  }
  assert.ok(seen.has("sill-hop"));
  assert.ok(seen.has("sill-walk"));
  assert.ok(seen.has("sill-down"));
  assert.equal(play.phase, "done");
});

test("Arc jumps onto the title-bar ridge, holds, then hops off — not a cling or a dive", () => {
  const target = P.pickTarget([WIN], 40, "cyber_dragon", WORK, P.SPRITE, { leave: "hop" });
  assert.ok(target);
  assert.equal(target.kind, "ridge");
  assert.equal(target.side, "top");
  assert.equal(target.spin, "none");
  const sill = P.sillPoint(WIN, 0.5, P.SPRITE, WORK);
  const ridge = P.ridgePoint(WIN, 0.5, P.SPRITE, WORK);
  assert.ok(ridge.lift > sill.lift, "the ridge sits on the title-bar top, not the inner sill");
  assert.equal(target.holdLift, ridge.lift);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  let holdLift = 0;
  let offRot = 0;
  for (let i = 0; i < 400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "cling");
    assert.notEqual(play.phase, "hang");
    assert.notEqual(play.phase, "dive");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "ridge-hold") {
      holdLift = play.lift;
      assert.equal(play.anim, "sit");
      assert.equal(play.rot, 0);
    }
    if (play.phase === "ridge-off") offRot = Math.max(offRot, Math.abs(play.rot));
  }
  assert.ok(holdLift > 40, "Arc holds on the window top");
  assert.ok(offRot < 30, "a hop tilts; it is not a backflip dive");
  assert.ok(seen.has("ridge-leap"));
  assert.ok(seen.has("ridge-hold"));
  assert.ok(seen.has("ridge-off"));
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});

test("Arc can slide off the ridge without a spin", () => {
  const target = P.pickTarget([WIN], 200, "cyber_dragon", WORK, P.SPRITE, { leave: "slide" });
  let play = P.beginPlay(target, target.approachX);
  let slideRot = 0;
  const seen = new Set();
  for (let i = 0; i < 400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
    if (play.phase === "ridge-off") slideRot = Math.max(slideRot, Math.abs(play.rot));
  }
  assert.ok(seen.has("ridge-hold"));
  assert.ok(seen.has("ridge-off"));
  assert.equal(slideRot, 0);
  assert.equal(play.phase, "done");
});

test("a moved window refits Arc's ridge hold", () => {
  const target = P.pickTarget([WIN], 200, "cyber_dragon", WORK, P.SPRITE, { leave: "hop" });
  let play = P.beginPlay(target, target.approachX);
  play = P.stepPlay(play, 0.6, { x: play.x, lift: 0 }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  play = P.stepPlay(play, 0.6, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "ridge-hold");
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "ridge-hold");
  assert.ok(Math.abs(play.target.holdX - target.holdX) > 40);
  assert.equal(play.x, play.target.holdX);
});

test("an asleep Arc never starts a ridge climb, and sleep aborts a hold", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  const target = P.pickTarget([WIN], 40, "cyber_dragon", WORK, P.SPRITE, { leave: "hop" });
  let play = P.beginPlay(target, target.approachX);
  play = P.stepPlay(play, 0.6, { x: play.x, lift: 0 }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "ridge-leap");
  play = P.stepPlay(play, 0.6, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done");
  assert.equal(play.abort, true);
});

test("Volt wraps a window corner, holds, then uncoils off — not a cling, ridge, or sill", () => {
  const target = P.pickTarget([WIN], 40, "volt_dragon", WORK, P.SPRITE, { side: "left" });
  assert.ok(target);
  assert.equal(target.kind, "coil");
  assert.equal(target.side, "left");
  assert.equal(target.spin, "none");
  const cling = P.sideHold(WIN, "left", P.SPRITE, WORK);
  const ridge = P.ridgePoint(WIN, 0.5, P.SPRITE, WORK);
  const sill = P.sillPoint(WIN, 0.5, P.SPRITE, WORK);
  const coil = P.coilPoint(WIN, "left", P.SPRITE, WORK);
  assert.equal(target.holdLift, coil.lift);
  assert.equal(target.holdX, coil.x);
  assert.ok(Math.abs(coil.lift - ridge.lift) < 0.001, "the coil sits the top corner, not a mid-side cling");
  assert.ok(coil.lift > sill.lift, "the coil wraps the corner, not the inner sill");
  assert.ok(Math.abs(coil.x - cling.x) > 1 || Math.abs(coil.lift - cling.lift) > 40, "not Rui's mid-side hold");
  assert.ok(Math.abs(coil.x - ridge.x) > 40, "not Arc's mid-ridge sit");
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  let holdLift = 0;
  let onRot = 0;
  let offRot = 0;
  for (let i = 0; i < 400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "cling");
    assert.notEqual(play.phase, "hang");
    assert.notEqual(play.phase, "dive");
    assert.notEqual(play.phase, "ridge-leap");
    assert.notEqual(play.phase, "ridge-hold");
    assert.notEqual(play.phase, "ridge-off");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "coil-on") onRot = Math.max(onRot, Math.abs(play.rot));
    if (play.phase === "coil-hold") {
      holdLift = play.lift;
      assert.equal(play.anim, "sit");
      assert.equal(play.rot, 0);
    }
    if (play.phase === "coil-off") offRot = Math.max(offRot, Math.abs(play.rot));
  }
  assert.ok(holdLift > 40, "Volt holds on a window corner");
  assert.ok(onRot > 20, "the wrap tilts existing frames; it is not a stamp");
  assert.ok(offRot > 10, "the uncoil is a wrap-off, not a sit-and-vanish");
  assert.ok(onRot < 180, "the wrap is not Rui's 360 dive");
  assert.ok(seen.has("coil-on"));
  assert.ok(seen.has("coil-hold"));
  assert.ok(seen.has("coil-off"));
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});

test("a moved window refits Volt's coil hold", () => {
  const target = P.pickTarget([WIN], 200, "volt_dragon", WORK, P.SPRITE, { side: "left" });
  let play = P.beginPlay(target, target.approachX);
  play = P.stepPlay(play, 0.6, { x: play.x, lift: 0 }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  play = P.stepPlay(play, 0.8, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "coil-hold");
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "coil-hold");
  assert.ok(Math.abs(play.target.holdX - target.holdX) > 40);
  assert.equal(play.x, play.target.holdX);
});

test("an asleep Volt never starts a coil, and sleep aborts a hold", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.shouldAbort({ cmd: "play" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ cmd: "rest" }), true);
  const target = P.pickTarget([WIN], 40, "volt_dragon", WORK, P.SPRITE, { side: "left" });
  let play = P.beginPlay(target, target.approachX);
  play = P.stepPlay(play, 0.6, { x: play.x, lift: 0 }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "coil-on");
  play = P.stepPlay(play, 0.6, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done");
  assert.equal(play.abort, true);
});

test("Trace hops onto a window outline, walks the path, sits, then hops or drops off — not a cling, ridge, coil, or sill", () => {
  const target = P.pickTarget([WIN], 40, "trace_dragon", WORK, P.SPRITE, { side: "left", leave: "hop" });
  assert.ok(target);
  assert.equal(target.kind, "path");
  assert.equal(target.side, "left");
  assert.equal(target.spin, "none");
  const cling = P.sideHold(WIN, "left", P.SPRITE, WORK);
  const ridge = P.ridgePoint(WIN, 0.5, P.SPRITE, WORK);
  const sill = P.sillPoint(WIN, 0.5, P.SPRITE, WORK);
  const coil = P.coilPoint(WIN, "left", P.SPRITE, WORK);
  const start = P.pathPoint(WIN, 0, P.SPRITE, WORK, "left");
  const mid = P.pathPoint(WIN, 0.5, P.SPRITE, WORK, "left");
  const end = P.pathPoint(WIN, 1, P.SPRITE, WORK, "left");
  assert.equal(target.holdLift, start.lift);
  assert.equal(target.holdX, start.x);
  assert.ok(start.lift < cling.lift, "the path starts lower on the near side, not Rui's mid-side cling");
  assert.ok(Math.abs(mid.lift - ridge.lift) < 0.001, "the mid-path walks the title-bar top");
  assert.ok(mid.lift > sill.lift, "the path rides the outer outline, not the inner sill");
  assert.ok(Math.abs(start.x - coil.x) > 1 || Math.abs(start.lift - coil.lift) > 40, "not Volt's corner wrap");
  assert.ok(Math.abs(end.x - start.x) > 40, "the trail ends on the far side");
  assert.ok(Math.abs(mid.x - start.x) > 20, "the trail crosses the top, not a sit-in-place");
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  let walkLiftMin = Infinity;
  let walkLiftMax = 0;
  let walkXMin = Infinity;
  let walkXMax = 0;
  let sitLift = 0;
  let offRot = 0;
  for (let i = 0; i < 500 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "cling");
    assert.notEqual(play.phase, "hang");
    assert.notEqual(play.phase, "dive");
    assert.notEqual(play.phase, "ridge-leap");
    assert.notEqual(play.phase, "ridge-hold");
    assert.notEqual(play.phase, "ridge-off");
    assert.notEqual(play.phase, "coil-on");
    assert.notEqual(play.phase, "coil-hold");
    assert.notEqual(play.phase, "coil-off");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "path-walk") {
      walkLiftMin = Math.min(walkLiftMin, play.lift);
      walkLiftMax = Math.max(walkLiftMax, play.lift);
      walkXMin = Math.min(walkXMin, play.x);
      walkXMax = Math.max(walkXMax, play.x);
      assert.equal(play.anim, "walk");
      assert.equal(play.rot, 0);
    }
    if (play.phase === "path-sit") {
      sitLift = play.lift;
      assert.equal(play.anim, "sit");
      assert.equal(play.rot, 0);
    }
    if (play.phase === "path-off") offRot = Math.max(offRot, Math.abs(play.rot));
  }
  assert.ok(walkLiftMax - walkLiftMin > 40, "the path climbs a side, not a flat sill");
  assert.ok(walkXMax - walkXMin > 40, "the path crosses the window, not a one-side cling");
  assert.ok(sitLift > 40, "Trace sits on the far outline before leaving");
  assert.ok(offRot < 30, "a hop tilts; it is not a backflip dive");
  assert.ok(seen.has("path-on"));
  assert.ok(seen.has("path-walk"));
  assert.ok(seen.has("path-sit"));
  assert.ok(seen.has("path-off"));
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});

test("Trace can drop off the path without a spin", () => {
  const target = P.pickTarget([WIN], 200, "trace_dragon", WORK, P.SPRITE, { side: "left", leave: "drop" });
  let play = P.beginPlay(target, target.approachX);
  let dropRot = 0;
  const seen = new Set();
  for (let i = 0; i < 500 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
    if (play.phase === "path-off") dropRot = Math.max(dropRot, Math.abs(play.rot));
  }
  assert.ok(seen.has("path-walk"));
  assert.ok(seen.has("path-off"));
  assert.equal(dropRot, 0);
  assert.equal(play.phase, "done");
});

test("a moved window refits Trace's path", () => {
  const target = P.pickTarget([WIN], 200, "trace_dragon", WORK, P.SPRITE, { side: "left", leave: "hop" });
  let play = P.beginPlay(target, target.approachX);
  play = P.stepPlay(play, 0.6, { x: play.x, lift: 0 }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  play = P.stepPlay(play, 0.6, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "path-walk");
  const beforeX = play.x;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "path-walk");
  assert.ok(Math.abs(play.target.holdX - target.holdX) > 40);
  assert.ok(Math.abs(play.x - beforeX) > 40);
});

test("an asleep Trace never starts a path, and sleep aborts a walk", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.shouldAbort({ cmd: "play" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ cmd: "rest" }), true);
  const target = P.pickTarget([WIN], 40, "trace_dragon", WORK, P.SPRITE, { side: "left", leave: "hop" });
  let play = P.beginPlay(target, target.approachX);
  play = P.stepPlay(play, 0.6, { x: play.x, lift: 0 }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "path-on");
  play = P.stepPlay(play, 0.6, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done");
  assert.equal(play.abort, true);
});

test("Flux occupies the window glass as a field, holds, then drifts or drops — not a cling, ridge, coil, path, or sill", () => {
  const target = P.pickTarget([WIN], 40, "flux_dragon", WORK, P.SPRITE, { leave: "drift" });
  assert.ok(target);
  assert.equal(target.kind, "field");
  assert.equal(target.side, "glass");
  assert.equal(target.spin, "none");
  const cling = P.sideHold(WIN, "left", P.SPRITE, WORK);
  const ridge = P.ridgePoint(WIN, 0.5, P.SPRITE, WORK);
  const sill = P.sillPoint(WIN, 0.5, P.SPRITE, WORK);
  const coil = P.coilPoint(WIN, "left", P.SPRITE, WORK);
  const pathMid = P.pathPoint(WIN, 0.5, P.SPRITE, WORK, "left");
  const field = P.fieldPoint(WIN, P.SPRITE, WORK);
  assert.equal(target.holdLift, field.lift);
  assert.equal(target.holdX, field.x);
  assert.ok(field.lift < cling.lift, "the field sits in the glass, not Rui's mid-side cling");
  assert.ok(field.lift < ridge.lift - 40, "the field is not the title-bar ridge");
  assert.ok(field.lift < sill.lift - 40, "the field is not the inner sill");
  assert.ok(Math.abs(field.x - coil.x) > 40, "not Volt's corner wrap");
  assert.ok(Math.abs(field.x - pathMid.x) > 20 || Math.abs(field.lift - pathMid.lift) > 40, "not Trace's outline");
  assert.ok(field.x > WIN.x && field.x + P.SPRITE < WIN.x + WIN.width, "the hold stays inside the rect");
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  let holdLift = 0;
  let offRot = 0;
  for (let i = 0; i < 500 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "cling");
    assert.notEqual(play.phase, "hang");
    assert.notEqual(play.phase, "dive");
    assert.notEqual(play.phase, "ridge-hold");
    assert.notEqual(play.phase, "coil-hold");
    assert.notEqual(play.phase, "path-walk");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "field-hold") {
      holdLift = play.lift;
      assert.equal(play.anim, "sit");
      assert.equal(play.rot, 0);
    }
    if (play.phase === "field-off") offRot = Math.max(offRot, Math.abs(play.rot));
  }
  assert.ok(holdLift > 40, "Flux holds in the window glass");
  assert.equal(offRot, 0, "a drift is not a spin dive");
  assert.ok(seen.has("field-on"));
  assert.ok(seen.has("field-hold"));
  assert.ok(seen.has("field-off"));
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});

test("Flux can drop off the field without a spin", () => {
  const target = P.pickTarget([WIN], 200, "flux_dragon", WORK, P.SPRITE, { leave: "drop" });
  let play = P.beginPlay(target, target.approachX);
  let dropRot = 0;
  const seen = new Set();
  for (let i = 0; i < 500 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
    if (play.phase === "field-off") dropRot = Math.max(dropRot, Math.abs(play.rot));
  }
  assert.ok(seen.has("field-hold"));
  assert.ok(seen.has("field-off"));
  assert.equal(dropRot, 0);
  assert.equal(play.phase, "done");
});

test("a moved window refits Flux's field hold", () => {
  const target = P.pickTarget([WIN], 200, "flux_dragon", WORK, P.SPRITE, { leave: "drift" });
  let play = P.beginPlay(target, target.approachX);
  play = P.stepPlay(play, 0.6, { x: play.x, lift: 0 }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  play = P.stepPlay(play, 0.9, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "field-hold");
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "field-hold");
  assert.ok(Math.abs(play.target.holdX - target.holdX) > 40);
  assert.equal(play.x, play.target.holdX);
});

test("an asleep Flux never starts a field, and sleep aborts a hold", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.shouldAbort({ cmd: "play" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ cmd: "rest" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 40, "flux_dragon", WORK, P.SPRITE, { leave: "drift" });
  let play = P.beginPlay(target, target.approachX);
  play = P.stepPlay(play, 0.6, { x: play.x, lift: 0 }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "field-on");
  play = P.stepPlay(play, 0.6, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done");
  assert.equal(play.abort, true);
});

test("Spark crackles a window edge, hops corner to corner, then hops or drops — not cling, ridge, coil, path, field, or sill", () => {
  const target = P.pickTarget([WIN], 40, "spark_dragon", WORK, P.SPRITE, { side: "left", leave: "hop" });
  assert.ok(target);
  assert.equal(target.kind, "crackle");
  assert.equal(target.side, "left");
  assert.equal(target.spin, "none");
  const cling = P.sideHold(WIN, "left", P.SPRITE, WORK);
  const ridge = P.ridgePoint(WIN, 0.5, P.SPRITE, WORK);
  const field = P.fieldPoint(WIN, P.SPRITE, WORK);
  const start = P.cracklePoint(WIN, 0, P.SPRITE, WORK, "left");
  const end = P.cracklePoint(WIN, 1, P.SPRITE, WORK, "left");
  assert.equal(target.holdX, start.x);
  assert.ok(Math.abs(end.lift - start.lift) > 40, "corner to corner along the edge");
  assert.ok(Math.abs(start.x - cling.x) > 8 || Math.abs(start.lift - cling.lift) > 20, "not Rui's mid-side cling");
  assert.ok(Math.abs(start.x - ridge.x) > 40, "not Arc's title-bar center");
  assert.ok(Math.abs(start.x - field.x) > 40, "not Flux's glass");
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  let hopLift = 0;
  for (let i = 0; i < 500 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "cling");
    assert.notEqual(play.phase, "hang");
    assert.notEqual(play.phase, "ridge-hold");
    assert.notEqual(play.phase, "coil-hold");
    assert.notEqual(play.phase, "path-walk");
    assert.notEqual(play.phase, "field-hold");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "crackle-hop") hopLift = Math.max(hopLift, play.lift);
  }
  assert.ok(seen.has("crackle-on"));
  assert.ok(seen.has("crackle-hop"));
  assert.ok(seen.has("crackle-off"));
  assert.ok(hopLift > 40);
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});

test("a moved window refits Spark's crackle, and sleep aborts it", () => {
  const target = P.pickTarget([WIN], 200, "spark_dragon", WORK, P.SPRITE, { side: "left", leave: "drop" });
  let play = P.beginPlay(target, target.approachX);
  play = P.stepPlay(play, 0.6, { x: play.x, lift: 0 }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  play = P.stepPlay(play, 0.4, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  assert.ok(play.phase === "crackle-on" || play.phase === "crackle-hop");
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.ok(Math.abs(play.target.holdX - target.holdX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "crackle-off");
});

test("Ion charges a window corner, bolts the glass, holds, then hops or drops — not cling, ridge, coil, path, field, crackle, or sill", () => {
  const target = P.pickTarget([WIN], 40, "ion_dragon", WORK, P.SPRITE, { side: "left", corner: "tl", leave: "hop" });
  assert.ok(target);
  assert.equal(target.kind, "charge");
  assert.equal(target.side, "left");
  assert.equal(target.startCorner, "tl");
  assert.equal(target.endCorner, "br");
  assert.equal(target.spin, "none");
  const cling = P.sideHold(WIN, "left", P.SPRITE, WORK);
  const ridge = P.ridgePoint(WIN, 0.5, P.SPRITE, WORK);
  const coil = P.coilPoint(WIN, "left", P.SPRITE, WORK);
  const field = P.fieldPoint(WIN, P.SPRITE, WORK);
  const crackle = P.cracklePoint(WIN, 0, P.SPRITE, WORK, "left");
  const pathMid = P.pathPoint(WIN, 0.5, P.SPRITE, WORK, "left");
  const start = P.chargePoint(WIN, "tl", P.SPRITE, WORK);
  const end = P.chargePoint(WIN, "br", P.SPRITE, WORK);
  assert.equal(target.holdX, start.x);
  assert.equal(target.holdLift, start.lift);
  assert.equal(target.chargeEndX, end.x);
  assert.ok(start.x > WIN.x && start.x + P.SPRITE < WIN.x + WIN.width, "the gather sits inside the glass");
  assert.ok(end.x > WIN.x && end.x + P.SPRITE < WIN.x + WIN.width, "the far sit stays inside the glass");
  assert.ok(Math.abs(end.x - start.x) > 40 && Math.abs(end.lift - start.lift) > 40, "the bolt is a diagonal, not one edge");
  assert.ok(Math.abs(start.x - coil.x) > 20 || Math.abs(start.lift - coil.lift) > 20, "not Volt's wrap-hold");
  assert.ok(Math.abs(start.x - field.x) > 40, "not Flux's glass sit");
  assert.ok(Math.abs(start.x - crackle.x) > 20, "not Spark's edge");
  assert.ok(Math.abs(start.x - cling.x) > 20 || Math.abs(start.lift - cling.lift) > 20, "not Rui's mid-side cling");
  assert.ok(Math.abs(start.x - ridge.x) > 40, "not Arc's title-bar center");
  assert.ok(Math.abs(start.x - pathMid.x) > 20 || Math.abs(start.lift - pathMid.lift) > 20, "not Trace's outline");
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  let boltXMin = Infinity;
  let boltXMax = 0;
  let boltLiftMin = Infinity;
  let boltLiftMax = 0;
  let holdLift = 0;
  for (let i = 0; i < 500 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "cling");
    assert.notEqual(play.phase, "hang");
    assert.notEqual(play.phase, "ridge-hold");
    assert.notEqual(play.phase, "coil-on");
    assert.notEqual(play.phase, "coil-hold");
    assert.notEqual(play.phase, "path-walk");
    assert.notEqual(play.phase, "field-hold");
    assert.notEqual(play.phase, "crackle-hop");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "charge-bolt") {
      boltXMin = Math.min(boltXMin, play.x);
      boltXMax = Math.max(boltXMax, play.x);
      boltLiftMin = Math.min(boltLiftMin, play.lift);
      boltLiftMax = Math.max(boltLiftMax, play.lift);
      assert.equal(play.anim, "play");
    }
    if (play.phase === "charge-hold") {
      holdLift = play.lift;
      assert.equal(play.anim, "sit");
      assert.equal(play.rot, 0);
      assert.equal(play.x, play.target.chargeEndX);
    }
  }
  assert.ok(seen.has("charge-on"));
  assert.ok(seen.has("charge-bolt"));
  assert.ok(seen.has("charge-hold"));
  assert.ok(seen.has("charge-off"));
  assert.ok(boltXMax - boltXMin > 40, "the bolt crosses the glass");
  assert.ok(boltLiftMax - boltLiftMin > 40, "the bolt changes height — a diagonal, not a sill");
  assert.ok(holdLift > 40, "Ion holds the far corner");
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});

test("a moved window refits Ion's charge hold; sleep, card, and hide abort; Ion never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.canStart({ asleep: false, hidden: false, card: false, cmd: "idle" }), true);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "ion_dragon", WORK, P.SPRITE, { side: "left", corner: "tl", leave: "drop" });
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 80 && play.phase !== "charge-hold"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "charge-hold");
  const beforeEnd = play.target.chargeEndX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "charge-hold");
  assert.ok(Math.abs(play.target.chargeEndX - beforeEnd) > 40);
  assert.equal(play.x, play.target.chargeEndX);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "charge-off");
  assert.equal(play.abort, true);
});

test("Gauss orbits the outside of a window, holds, then hops or drops — not cling, ridge, coil, path, field, crackle, charge, or sill", () => {
  const target = P.pickTarget([WIN], 40, "gauss_dragon", WORK, P.SPRITE, { side: "left", orbitDir: 1, leave: "hop" });
  assert.ok(target);
  assert.equal(target.kind, "orbit");
  assert.equal(target.side, "left");
  assert.equal(target.spin, "none");
  const cling = P.sideHold(WIN, "left", P.SPRITE, WORK);
  const ridge = P.ridgePoint(WIN, 0.5, P.SPRITE, WORK);
  const coil = P.coilPoint(WIN, "left", P.SPRITE, WORK);
  const field = P.fieldPoint(WIN, P.SPRITE, WORK);
  const crackle = P.cracklePoint(WIN, 0, P.SPRITE, WORK, "left");
  const charge = P.chargePoint(WIN, "tl", P.SPRITE, WORK);
  const pathMid = P.pathPoint(WIN, 0.5, P.SPRITE, WORK, "left");
  const start = P.orbitPoint(WIN, 0, P.SPRITE, WORK, 1);
  const mid = P.orbitPoint(WIN, 0.5, P.SPRITE, WORK, 1);
  const end = P.orbitPoint(WIN, target.orbitEndU, P.SPRITE, WORK, 1);
  assert.equal(target.holdX, start.x);
  assert.equal(target.holdLift, start.lift);
  assert.ok(start.x + P.SPRITE / 2 < WIN.x, "the body center starts outside the left edge");
  assert.ok(mid.x + P.SPRITE / 2 > WIN.x + WIN.width, "the loop crosses the far outside");
  assert.ok(Math.abs(mid.x - start.x) > 40 && Math.abs(mid.lift - start.lift) > 20, "a closed loop, not one edge");
  assert.ok(Math.abs(end.x - start.x) > 8 || Math.abs(end.lift - start.lift) > 8, "the sit is after most of a circuit");
  assert.ok(Math.abs(start.x - cling.x) > 20 || Math.abs(start.lift - cling.lift) > 40, "not Rui's mid-side cling");
  assert.ok(Math.abs(start.x - coil.x) > 20 || Math.abs(start.lift - coil.lift) > 40, "not Volt's wrap-hold");
  assert.ok(Math.abs(start.x - ridge.x) > 40, "not Arc's title-bar center");
  assert.ok(Math.abs(start.x - field.x) > 40, "not Flux's glass sit");
  assert.ok(Math.abs(start.x - crackle.x) > 20 || Math.abs(start.lift - crackle.lift) > 20, "not Spark's edge");
  assert.ok(Math.abs(start.x - charge.x) > 20, "not Ion's inside corner");
  assert.ok(Math.abs(start.x - pathMid.x) > 20 || Math.abs(start.lift - pathMid.lift) > 20, "not Trace's outline");
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  let loopXMin = Infinity;
  let loopXMax = 0;
  let loopLiftMin = Infinity;
  let loopLiftMax = 0;
  let holdLift = 0;
  for (let i = 0; i < 500 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "cling");
    assert.notEqual(play.phase, "hang");
    assert.notEqual(play.phase, "ridge-hold");
    assert.notEqual(play.phase, "coil-on");
    assert.notEqual(play.phase, "coil-hold");
    assert.notEqual(play.phase, "path-walk");
    assert.notEqual(play.phase, "field-hold");
    assert.notEqual(play.phase, "crackle-hop");
    assert.notEqual(play.phase, "charge-bolt");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "orbit-loop") {
      loopXMin = Math.min(loopXMin, play.x);
      loopXMax = Math.max(loopXMax, play.x);
      loopLiftMin = Math.min(loopLiftMin, play.lift);
      loopLiftMax = Math.max(loopLiftMax, play.lift);
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "orbit-hold") {
      holdLift = play.lift;
      assert.equal(play.anim, "sit");
      assert.equal(play.rot, 0);
    }
  }
  assert.ok(seen.has("orbit-on"));
  assert.ok(seen.has("orbit-loop"));
  assert.ok(seen.has("orbit-hold"));
  assert.ok(seen.has("orbit-off"));
  assert.ok(loopXMax - loopXMin > 40, "the orbit crosses the frame");
  assert.ok(loopLiftMax - loopLiftMin > 40, "the orbit changes height — a closed loop, not a sill");
  assert.ok(holdLift > 16, "Gauss sits after the loop");
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});

test("a moved window refits Gauss's orbit hold; sleep, card, and hide abort; Gauss never starts asleep; Ground earths", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.canStart({ asleep: false, hidden: false, card: false, cmd: "idle" }), true);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  assert.equal(P.playFor("relay_dragon"), "click");
  assert.equal(P.playFor("fuse_dragon"), "hold");
  assert.equal(P.playFor("ground_dragon"), "earth");
  const target = P.pickTarget([WIN], 200, "gauss_dragon", WORK, P.SPRITE, { side: "left", orbitDir: 1, leave: "drop" });
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 120 && play.phase !== "orbit-hold"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "orbit-hold");
  const beforeEnd = play.target.orbitEndX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "orbit-hold");
  assert.ok(Math.abs(play.target.orbitEndX - beforeEnd) > 40);
  assert.equal(play.x, play.target.orbitEndX);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "orbit-off");
  assert.equal(play.abort, true);
});

test("Relay snaps on a window as a node, clicks, hops to a second window, clicks, then hops or drops — not cling, ridge, coil, path, field, crackle, charge, orbit, or sill", () => {
  const WIN_B = { id: "hw2", x: 1040, y: 120, width: 300, height: 360 };
  const target = P.pickTarget([WIN, WIN_B], 40, "relay_dragon", WORK, P.SPRITE, { leave: "hop" });
  assert.ok(target);
  assert.equal(target.kind, "click");
  assert.equal(target.spin, "none");
  assert.equal(target.id, "hw");
  assert.equal(target.clickToId, "hw2");
  assert.notEqual(target.startNode, target.endNode);
  const cling = P.sideHold(WIN, "left", P.SPRITE, WORK);
  const ridge = P.ridgePoint(WIN, 0.5, P.SPRITE, WORK);
  const coil = P.coilPoint(WIN, "left", P.SPRITE, WORK);
  const field = P.fieldPoint(WIN, P.SPRITE, WORK);
  const crackle = P.cracklePoint(WIN, 0, P.SPRITE, WORK, "left");
  const charge = P.chargePoint(WIN, "tl", P.SPRITE, WORK);
  const pathMid = P.pathPoint(WIN, 0.5, P.SPRITE, WORK, "left");
  const orbit = P.orbitPoint(WIN, 0, P.SPRITE, WORK, 1);
  const start = P.clickPoint(WIN, target.startNode, P.SPRITE, WORK);
  const end = P.clickPoint(WIN_B, target.endNode, P.SPRITE, WORK);
  assert.equal(target.holdX, start.x);
  assert.equal(target.holdLift, start.lift);
  assert.equal(target.clickEndX, end.x);
  assert.ok(Math.abs(end.x - start.x) > 80, "the hop closes from one window to the next");
  assert.ok(Math.abs(start.x - cling.x) > 8 || Math.abs(start.lift - cling.lift) > 16, "not Rui's mid-side cling");
  assert.ok(Math.abs(start.x - ridge.x) > 40, "not Arc's title-bar center");
  assert.ok(Math.abs(start.x - coil.x) > 8 || Math.abs(start.lift - coil.lift) > 16, "not Volt's wrap-hold");
  assert.ok(Math.abs(start.x - field.x) > 40, "not Flux's glass");
  assert.ok(Math.abs(start.x - crackle.x) > 8 || Math.abs(start.lift - crackle.lift) > 16, "not Spark's edge");
  assert.ok(Math.abs(start.x - charge.x) > 16, "not Ion's inside corner");
  assert.ok(Math.abs(start.x - orbit.x) > 20, "not Gauss's far outside circuit");
  assert.ok(Math.abs(start.x - pathMid.x) > 20 || Math.abs(start.lift - pathMid.lift) > 20, "not Trace's outline");
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  let hopXMin = Infinity;
  let hopXMax = 0;
  let hopLiftMax = 0;
  let firstClick = 0;
  let secondClick = 0;
  for (let i = 0; i < 500 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "cling");
    assert.notEqual(play.phase, "hang");
    assert.notEqual(play.phase, "ridge-hold");
    assert.notEqual(play.phase, "coil-hold");
    assert.notEqual(play.phase, "path-walk");
    assert.notEqual(play.phase, "field-hold");
    assert.notEqual(play.phase, "crackle-hop");
    assert.notEqual(play.phase, "charge-bolt");
    assert.notEqual(play.phase, "orbit-loop");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "click-a") {
      firstClick = play.lift;
      assert.equal(play.anim, "sit");
      assert.equal(play.rot, 0);
    }
    if (play.phase === "click-hop") {
      hopXMin = Math.min(hopXMin, play.x);
      hopXMax = Math.max(hopXMax, play.x);
      hopLiftMax = Math.max(hopLiftMax, play.lift);
      assert.equal(play.anim, "play");
    }
    if (play.phase === "click-b") {
      secondClick = play.lift;
      assert.equal(play.anim, "sit");
      assert.equal(play.x, play.target.clickEndX);
    }
  }
  assert.ok(seen.has("click-on"));
  assert.ok(seen.has("click-a"));
  assert.ok(seen.has("click-hop"));
  assert.ok(seen.has("click-b"));
  assert.ok(seen.has("click-off"));
  assert.ok(hopXMax - hopXMin > 40, "the hop closes from one node to the next");
  assert.ok(hopLiftMax > 40, "the hop is a hop, not a bolt along the glass");
  assert.ok(firstClick > 28, "Relay clicks the first node");
  assert.ok(secondClick > 28, "Relay clicks the second node");
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});

test("one usable window still clicks two nodes — not a sill, not crackle, charge, or orbit", () => {
  const target = P.pickTarget([WIN], 40, "relay_dragon", WORK, P.SPRITE, {
    side: "left",
    pair: "sides",
    leave: "drop",
  });
  assert.ok(target);
  assert.equal(target.kind, "click");
  assert.equal(target.id, target.clickToId);
  assert.equal(target.startNode, "left");
  assert.equal(target.endNode, "right");
  const start = P.clickPoint(WIN, "left", P.SPRITE, WORK);
  const end = P.clickPoint(WIN, "right", P.SPRITE, WORK);
  const crackle0 = P.cracklePoint(WIN, 0, P.SPRITE, WORK, "left");
  const crackle1 = P.cracklePoint(WIN, 1, P.SPRITE, WORK, "left");
  const chargeStart = P.chargePoint(WIN, "tl", P.SPRITE, WORK);
  const chargeEnd = P.chargePoint(WIN, "br", P.SPRITE, WORK);
  assert.ok(Math.abs(end.x - start.x) > 40, "two opposite-side nodes, not one edge");
  assert.ok(Math.abs(end.lift - start.lift) < 8, "same nape height — not Spark's vertical edge hops");
  assert.ok(Math.abs(start.x - crackle0.x) > 8 || Math.abs(end.x - crackle1.x) > 40, "not Spark's one-edge crackle");
  assert.ok(Math.abs(end.x - start.x) > 40 && Math.abs(end.lift - start.lift) < 20, "not Ion's diagonal bolt");
  assert.ok(Math.abs(start.x - chargeStart.x) > 16, "nodes sit on the frame, not inside the glass");
  assert.ok(Math.abs(end.x - chargeEnd.x) > 16 || Math.abs(end.lift - chargeEnd.lift) > 20, "not Ion's far inside corner");
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  let hopCount = 0;
  for (let i = 0; i < 500 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "sill-walk");
    assert.notEqual(play.phase, "crackle-hop");
    assert.notEqual(play.phase, "charge-bolt");
    assert.notEqual(play.phase, "orbit-loop");
    if (play.phase === "click-hop") hopCount += 1;
  }
  assert.ok(seen.has("click-on"));
  assert.ok(seen.has("click-a"));
  assert.ok(seen.has("click-hop"));
  assert.ok(seen.has("click-b"));
  assert.ok(seen.has("click-off"));
  assert.ok(hopCount >= 1 && hopCount <= 20, "one hop between nodes, not Spark's short edge hops");
  assert.equal(play.phase, "done");
});

test("a moved window refits Relay's second click; sleep, card, and hide abort; Relay never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "relay_dragon", WORK, P.SPRITE, { side: "left", pair: "sides", leave: "drop" });
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 120 && play.phase !== "click-b"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "click-b");
  const beforeEnd = play.target.clickEndX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "click-b");
  assert.ok(Math.abs(play.target.clickEndX - beforeEnd) > 40);
  assert.equal(play.x, play.target.clickEndX);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "click-off");
  assert.equal(play.abort, true);
});

test("Fuse seats into a window as a cartridge in a clip, holds still, then pops off — not cling, ridge, coil, path, field, crackle, charge, orbit, click, or sill", () => {
  const WIN_B = { id: "hw2", x: 1040, y: 120, width: 300, height: 360 };
  const target = P.pickTarget([WIN, WIN_B], 40, "fuse_dragon", WORK, P.SPRITE, { side: "left", clip: "jamb", leave: "hop" });
  assert.ok(target);
  assert.equal(target.kind, "hold");
  assert.equal(target.spin, "none");
  assert.equal(target.clip, "jamb");
  assert.equal(target.side, "left");
  assert.equal(target.id, "hw");
  assert.equal(target.clickToId, undefined);
  assert.ok(P.DUR.holdSit > P.DUR.clickHold * 4, "the hold is longer than Relay's brief click");
  const cling = P.sideHold(WIN, "left", P.SPRITE, WORK);
  const ridge = P.ridgePoint(WIN, 0.5, P.SPRITE, WORK);
  const coil = P.coilPoint(WIN, "left", P.SPRITE, WORK);
  const field = P.fieldPoint(WIN, P.SPRITE, WORK);
  const crackle = P.cracklePoint(WIN, 0, P.SPRITE, WORK, "left");
  const charge = P.chargePoint(WIN, "tl", P.SPRITE, WORK);
  const pathMid = P.pathPoint(WIN, 0.5, P.SPRITE, WORK, "left");
  const orbit = P.orbitPoint(WIN, 0, P.SPRITE, WORK, 1);
  const click = P.clickPoint(WIN, "left", P.SPRITE, WORK);
  const sill = P.sillPoint(WIN, 0.5, P.SPRITE, WORK);
  const hold = P.holdPoint(WIN, "jamb", "left", P.SPRITE, WORK);
  assert.equal(target.holdX, hold.x);
  assert.equal(target.holdLift, hold.lift);
  assert.ok(Math.abs(hold.x - cling.x) > 20, "seated in the jamb clip, not Rui's hang");
  assert.ok(Math.abs(hold.lift - ridge.lift) > 40, "not Arc's title-bar ridge");
  assert.ok(Math.abs(hold.x - coil.x) > 20 || Math.abs(hold.lift - coil.lift) > 40, "not Volt's wrap-hold");
  assert.ok(Math.abs(hold.x - field.x) > 40, "not Flux's glass");
  assert.ok(Math.abs(hold.x - crackle.x) > 16 || Math.abs(hold.lift - crackle.lift) > 16, "not Spark's edge");
  assert.ok(Math.abs(hold.x - charge.x) > 16 || Math.abs(hold.lift - charge.lift) > 20, "not Ion's inside corner");
  assert.ok(Math.abs(hold.x - orbit.x) > 20, "not Gauss's far outside circuit");
  assert.ok(Math.abs(hold.x - click.x) > 16 || Math.abs(hold.lift - click.lift) > 16, "not Relay's nape node");
  assert.ok(Math.abs(hold.x - pathMid.x) > 20 || Math.abs(hold.lift - pathMid.lift) > 20, "not Trace's outline");
  assert.ok(Math.abs(hold.lift - sill.lift) > 40, "not a generic sill");
  const seat0 = P.holdOnPath(0, { x: 40, lift: 0 }, { x: hold.x, lift: hold.lift });
  const seatMid = P.holdOnPath(0.5, { x: 40, lift: 0 }, { x: hold.x, lift: hold.lift });
  const seat1 = P.holdOnPath(1, { x: 40, lift: 0 }, { x: hold.x, lift: hold.lift });
  const leapMid = P.leapPath(0.5, { x: 40, lift: 0 }, { x: hold.x, lift: hold.lift });
  assert.equal(seat0.rot, 0);
  assert.equal(seatMid.rot, 0);
  assert.equal(seat1.rot, 0);
  assert.ok(Math.abs(seatMid.lift - leapMid.lift) > 4, "a seat-in is not a leap arc");
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  let sitMs = 0;
  let sitLift = 0;
  let windowIds = new Set();
  for (let i = 0; i < 600 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "cling");
    assert.notEqual(play.phase, "hang");
    assert.notEqual(play.phase, "ridge-hold");
    assert.notEqual(play.phase, "coil-hold");
    assert.notEqual(play.phase, "path-walk");
    assert.notEqual(play.phase, "field-hold");
    assert.notEqual(play.phase, "crackle-hop");
    assert.notEqual(play.phase, "charge-bolt");
    assert.notEqual(play.phase, "orbit-loop");
    assert.notEqual(play.phase, "click-hop");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "hold-sit") {
      sitMs += 0.05;
      sitLift = play.lift;
      assert.equal(play.anim, "sit");
      assert.equal(play.rot, 0);
      assert.equal(play.x, play.target.holdX);
    }
    if (play.target && play.target.id) windowIds.add(play.target.id);
  }
  assert.ok(seen.has("hold-on"));
  assert.ok(seen.has("hold-sit"));
  assert.ok(seen.has("hold-off"));
  assert.ok(sitMs >= 2.2, `the filament hold is long (${sitMs})`);
  assert.ok(sitLift > 28, "Fuse holds in the clip");
  assert.equal(windowIds.size, 1, "one window — not a hop between two");
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});

test("Fuse can seat a sash clip and drop off — still one window, still not a sill", () => {
  const target = P.pickTarget([WIN], 200, "fuse_dragon", WORK, P.SPRITE, { side: "left", clip: "sash", leave: "drop" });
  assert.ok(target);
  assert.equal(target.kind, "hold");
  assert.equal(target.clip, "sash");
  assert.equal(target.clickToId, undefined);
  const jamb = P.holdPoint(WIN, "jamb", "left", P.SPRITE, WORK);
  const sash = P.holdPoint(WIN, "sash", "left", P.SPRITE, WORK);
  const field = P.fieldPoint(WIN, P.SPRITE, WORK);
  const ridge = P.ridgePoint(WIN, 0.5, P.SPRITE, WORK);
  assert.ok(Math.abs(sash.x - jamb.x) > 20, "sash and jamb are different clips");
  assert.ok(Math.abs(sash.x - field.x) > 40, "sash is not Flux's glass center");
  assert.ok(Math.abs(sash.lift - ridge.lift) > 40, "sash is not the title-bar");
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  let dropRot = 0;
  for (let i = 0; i < 600 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "sill-walk");
    assert.notEqual(play.phase, "click-hop");
    if (play.phase === "hold-off") dropRot = Math.max(dropRot, Math.abs(play.rot));
  }
  assert.ok(seen.has("hold-on"));
  assert.ok(seen.has("hold-sit"));
  assert.ok(seen.has("hold-off"));
  assert.equal(dropRot, 0);
  assert.equal(play.phase, "done");
});

test("a moved window refits Fuse's hold; sleep, card, and hide abort; Fuse never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "fuse_dragon", WORK, P.SPRITE, { side: "left", clip: "jamb", leave: "drop" });
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 120 && play.phase !== "hold-sit"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "hold-sit");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "hold-sit");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  assert.equal(play.x, play.target.holdX);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "hold-off");
  assert.equal(play.abort, true);
});

test("Ground seats at the bottom of a window as an earth lug, holds the return, then steps or drops — not cling, ridge, coil, path, field, crackle, charge, orbit, click, hold, or sill", () => {
  const WIN_B = { id: "hw2", x: 1040, y: 120, width: 300, height: 360 };
  const target = P.pickTarget([WIN, WIN_B], 40, "ground_dragon", WORK, P.SPRITE, { leave: "step" });
  assert.ok(target);
  assert.equal(target.kind, "earth");
  assert.equal(target.side, "bottom");
  assert.equal(target.spin, "none");
  assert.equal(target.id, "hw");
  assert.equal(target.clickToId, undefined);
  assert.equal(target.clip, undefined);
  assert.ok(P.DUR.earthSit > P.DUR.clickHold * 3, "the earth hold is longer than Relay's brief click");
  assert.ok(P.DUR.earthSit < P.DUR.holdSit, "the earth is not Fuse's long filament sit");
  const cling = P.sideHold(WIN, "left", P.SPRITE, WORK);
  const ridge = P.ridgePoint(WIN, 0.5, P.SPRITE, WORK);
  const coil = P.coilPoint(WIN, "left", P.SPRITE, WORK);
  const field = P.fieldPoint(WIN, P.SPRITE, WORK);
  const crackle = P.cracklePoint(WIN, 0, P.SPRITE, WORK, "left");
  const charge = P.chargePoint(WIN, "bl", P.SPRITE, WORK);
  const pathMid = P.pathPoint(WIN, 0.5, P.SPRITE, WORK, "left");
  const orbit = P.orbitPoint(WIN, 0, P.SPRITE, WORK, 1);
  const click = P.clickPoint(WIN, "left", P.SPRITE, WORK);
  const sill = P.sillPoint(WIN, 0.5, P.SPRITE, WORK);
  const hold = P.holdPoint(WIN, "jamb", "left", P.SPRITE, WORK);
  const sash = P.holdPoint(WIN, "sash", "left", P.SPRITE, WORK);
  const earth = P.earthPoint(WIN, P.SPRITE, WORK);
  assert.equal(target.holdX, earth.x);
  assert.equal(target.holdLift, earth.lift);
  assert.ok(earth.x > WIN.x && earth.x + P.SPRITE < WIN.x + WIN.width, "the lug sits on the bottom rail, not a side hang");
  assert.ok(Math.abs(earth.x - cling.x) > 40, "not Rui's mid-side cling");
  assert.ok(Math.abs(earth.lift - ridge.lift) > 40, "not Arc's title-bar ridge");
  assert.ok(Math.abs(earth.x - coil.x) > 40 || Math.abs(earth.lift - coil.lift) > 40, "not Volt's wrap-hold");
  assert.ok(Math.abs(earth.lift - field.lift) > 40, "not Flux's glass");
  assert.ok(Math.abs(earth.x - crackle.x) > 20 || Math.abs(earth.lift - crackle.lift) > 40, "not Spark's edge");
  assert.ok(Math.abs(earth.x - charge.x) > 20 || Math.abs(earth.lift - charge.lift) > 20, "not Ion's inside bottom corner");
  assert.ok(Math.abs(earth.x - orbit.x) > 40, "not Gauss's far outside circuit");
  assert.ok(Math.abs(earth.x - click.x) > 20 || Math.abs(earth.lift - click.lift) > 20, "not Relay's nape node");
  assert.ok(Math.abs(earth.x - hold.x) > 20 || Math.abs(earth.lift - hold.lift) > 40, "not Fuse's jamb clip");
  assert.ok(Math.abs(earth.x - sash.x) > 20 || Math.abs(earth.lift - sash.lift) > 40, "not Fuse's sash clip");
  assert.ok(Math.abs(earth.x - pathMid.x) > 20 || Math.abs(earth.lift - pathMid.lift) > 40, "not Trace's outline");
  assert.ok(Math.abs(earth.lift - sill.lift) > 40, "not a generic top sill");
  const seat0 = P.earthOnPath(0, { x: 40, lift: 0 }, { x: earth.x, lift: earth.lift });
  const seatMid = P.earthOnPath(0.5, { x: 40, lift: 0 }, { x: earth.x, lift: earth.lift });
  const seat1 = P.earthOnPath(1, { x: 40, lift: 0 }, { x: earth.x, lift: earth.lift });
  const leapMid = P.leapPath(0.5, { x: 40, lift: 0 }, { x: earth.x, lift: earth.lift });
  assert.equal(seat0.rot, 0);
  assert.equal(seatMid.rot, 0);
  assert.equal(seat1.rot, 0);
  assert.ok(Math.abs(seatMid.lift - leapMid.lift) > 4, "a seat onto the lug is not a leap arc");
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  let sitMs = 0;
  let sitLift = 0;
  let sitXMin = Infinity;
  let sitXMax = -Infinity;
  let windowIds = new Set();
  for (let i = 0; i < 600 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "cling");
    assert.notEqual(play.phase, "hang");
    assert.notEqual(play.phase, "dive");
    assert.notEqual(play.phase, "ridge-hold");
    assert.notEqual(play.phase, "coil-hold");
    assert.notEqual(play.phase, "path-walk");
    assert.notEqual(play.phase, "field-hold");
    assert.notEqual(play.phase, "crackle-hop");
    assert.notEqual(play.phase, "charge-bolt");
    assert.notEqual(play.phase, "orbit-loop");
    assert.notEqual(play.phase, "click-hop");
    assert.notEqual(play.phase, "hold-sit");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "earth-sit") {
      sitMs += 0.05;
      sitLift = play.lift;
      sitXMin = Math.min(sitXMin, play.x);
      sitXMax = Math.max(sitXMax, play.x);
      assert.equal(play.anim, "sit");
      assert.equal(play.rot, 0);
      assert.equal(play.x, play.target.holdX);
    }
    if (play.target && play.target.id) windowIds.add(play.target.id);
  }
  assert.ok(seen.has("earth-on"));
  assert.ok(seen.has("earth-sit"));
  assert.ok(seen.has("earth-off"));
  assert.ok(sitMs >= 1.4, `the earth hold is still (${sitMs})`);
  assert.ok(sitLift > 16, "Ground holds the earth lug");
  assert.ok(sitLift < sill.lift - 40, "the sit is the bottom, not the top sill");
  assert.ok(sitXMax - sitXMin < 2, "one sit — not a walk along the rail");
  assert.equal(windowIds.size, 1, "one window — not a hop between two");
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});

test("Ground can drop off the earth lug — still one window, still not a sill or a hold", () => {
  const target = P.pickTarget([WIN], 200, "ground_dragon", WORK, P.SPRITE, { leave: "drop" });
  assert.ok(target);
  assert.equal(target.kind, "earth");
  assert.equal(target.leave, "drop");
  assert.equal(target.clickToId, undefined);
  const earth = P.earthPoint(WIN, P.SPRITE, WORK);
  const sill = P.sillPoint(WIN, 0.5, P.SPRITE, WORK);
  const hold = P.holdPoint(WIN, "jamb", "left", P.SPRITE, WORK);
  assert.equal(target.holdLift, earth.lift);
  assert.ok(Math.abs(earth.lift - sill.lift) > 40);
  assert.ok(Math.abs(earth.lift - hold.lift) > 40);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  let dropRot = 0;
  for (let i = 0; i < 600 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "sill-walk");
    assert.notEqual(play.phase, "hold-sit");
    assert.notEqual(play.phase, "click-hop");
    if (play.phase === "earth-off") dropRot = Math.max(dropRot, Math.abs(play.rot));
  }
  assert.ok(seen.has("earth-on"));
  assert.ok(seen.has("earth-sit"));
  assert.ok(seen.has("earth-off"));
  assert.equal(dropRot, 0);
  assert.equal(play.phase, "done");
});

test("a moved window refits Ground's earth; sleep, card, and hide abort; Ground never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "ground_dragon", WORK, P.SPRITE, { leave: "drop" });
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 120 && play.phase !== "earth-sit"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "earth-sit");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "earth-sit");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  assert.equal(play.x, play.target.holdX);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "earth-off");
  assert.equal(play.abort, true);
});

test("Miso hops onto the top ledge, sits the blink, then hops down — not a sill walk, ridge, earth, or cling", () => {
  const WIN_B = { id: "hw2", x: 1040, y: 120, width: 300, height: 360 };
  const target = P.pickTarget([WIN, WIN_B], 80, "cat", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "ledge");
  assert.equal(target.side, "top");
  assert.equal(target.leave, "hop");
  assert.equal(target.clickToId, undefined);
  const ledge = P.ledgePoint(WIN, P.SPRITE, WORK);
  const ridge = P.ridgePoint(WIN, 0.5, P.SPRITE, WORK);
  const sill = P.sillPoint(WIN, 0.5, P.SPRITE, WORK);
  const earth = P.earthPoint(WIN, P.SPRITE, WORK);
  const cling = P.sideHold(WIN, "left", P.SPRITE, WORK);
  const coil = P.coilPoint(WIN, "left", P.SPRITE, WORK);
  const field = P.fieldPoint(WIN, P.SPRITE, WORK);
  const hold = P.holdPoint(WIN, "jamb", "left", P.SPRITE, WORK);
  assert.equal(target.holdX, ledge.x);
  assert.equal(target.holdLift, ledge.lift);
  assert.ok(ledge.x > WIN.x && ledge.x + P.SPRITE < WIN.x + WIN.width, "the perch sits on the top frame");
  assert.ok(Math.abs(ledge.x - ridge.x) > 40, "not Arc's title-bar center ride");
  assert.ok(Math.abs(ledge.lift - ridge.lift) > 40, "on the outer ledge, not riding the title-bar");
  assert.ok(Math.abs(ledge.lift - sill.lift) > 40, "not a generic inner sill walk");
  assert.ok(Math.abs(ledge.lift - earth.lift) > 40, "not Ground's bottom lug");
  assert.ok(Math.abs(ledge.x - cling.x) > 40, "not Rui's mid-side cling");
  assert.ok(Math.abs(ledge.x - coil.x) > 40 || Math.abs(ledge.lift - coil.lift) > 40, "not Volt's wrap-hold");
  assert.ok(Math.abs(ledge.lift - field.lift) > 40, "not Flux's glass");
  assert.ok(Math.abs(ledge.x - hold.x) > 20 || Math.abs(ledge.lift - hold.lift) > 40, "not Fuse's jamb clip");
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  let sitMs = 0;
  let sitLift = 0;
  let sitXMin = Infinity;
  let sitXMax = -Infinity;
  let windowIds = new Set();
  let hopRot = 0;
  for (let i = 0; i < 700 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "cling");
    assert.notEqual(play.phase, "hang");
    assert.notEqual(play.phase, "dive");
    assert.notEqual(play.phase, "ridge-hold");
    assert.notEqual(play.phase, "coil-hold");
    assert.notEqual(play.phase, "path-walk");
    assert.notEqual(play.phase, "field-hold");
    assert.notEqual(play.phase, "crackle-hop");
    assert.notEqual(play.phase, "charge-bolt");
    assert.notEqual(play.phase, "orbit-loop");
    assert.notEqual(play.phase, "click-hop");
    assert.notEqual(play.phase, "hold-sit");
    assert.notEqual(play.phase, "earth-sit");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "ledge-sit") {
      sitMs += 0.05;
      sitLift = play.lift;
      sitXMin = Math.min(sitXMin, play.x);
      sitXMax = Math.max(sitXMax, play.x);
      assert.equal(play.anim, "sit");
      assert.equal(play.rot, 0);
      assert.equal(play.x, play.target.holdX);
    }
    if (play.phase === "ledge-on" || play.phase === "ledge-off") {
      hopRot = Math.max(hopRot, Math.abs(play.rot));
    }
    if (play.target && play.target.id) windowIds.add(play.target.id);
  }
  assert.ok(seen.has("ledge-on"));
  assert.ok(seen.has("ledge-sit"));
  assert.ok(seen.has("ledge-off"));
  assert.ok(!seen.has("sill-walk"), "the sit is the tell — no parade");
  assert.ok(sitMs >= 2.2, `the blink is a long sit (${sitMs})`);
  assert.ok(sitLift > 40, "Miso sits the top ledge");
  assert.ok(sitXMax - sitXMin < 2, "one sit — not a walk across the frame");
  assert.equal(windowIds.size, 1, "one window");
  assert.ok(hopRot > 0, "hop on and hop down rotate existing frames");
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});

test("a moved window refits Miso's ledge; sleep, card, and hide abort; Miso never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "cat", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 120 && play.phase !== "ledge-sit"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "ledge-sit");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "ledge-sit");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  assert.equal(play.x, play.target.holdX);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "ledge-off");
  assert.equal(play.abort, true);
});

test("the overlay and the demo share the window-play door", () => {
  assert.match(petSrc, /PetWindowPlay/);
  assert.match(petSrc, /beginPlay/);
  assert.match(petSrc, /shouldAbort/);
  assert.match(petSrc, /playFor/);
  assert.match(petSrc, /coil-on|coil-off/);
  assert.match(petSrc, /path-on|path-off/);
  assert.match(petSrc, /field-on|field-off/);
  assert.match(petSrc, /crackle-on|crackle-off/);
  assert.match(petSrc, /charge-on|charge-off/);
  assert.match(petSrc, /orbit-on|orbit-off/);
  assert.match(petSrc, /click-on|click-off/);
  assert.match(petSrc, /hold-on|hold-off/);
  assert.match(petSrc, /earth-on|earth-off/);
  assert.match(petSrc, /ledge-on|ledge-off/);
  assert.match(htmlSrc, /window-play\.js/);
  assert.doesNotMatch(petSrc, /sprites\/red_panda\/.*write|createCanvas/);
  assert.doesNotMatch(petSrc, /sprites\/volt_dragon\/.*write|createCanvas/);
  assert.doesNotMatch(petSrc, /sprites\/trace_dragon\/.*write|createCanvas/);
});
