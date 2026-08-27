const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const P = require("./window-play.js");

const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const htmlSrc = readFileSync(join(__dirname, "index.html"), "utf8");

const WORK = { width: 1400, height: 800, floorLift: 0 };
const WIN = { id: "hw", x: 360, y: 80, width: 640, height: 420 };

test("Rui's door is cling and dive; Arc rides the ridge; Volt coils a corner; Trace traces a path; Flux fields the glass; Spark crackles an edge; Ion charges a corner; other guests walk a sill", () => {
  assert.equal(P.playFor("red_panda"), "cling-dive");
  assert.equal(P.playFor("cyber_dragon"), "ridge");
  assert.equal(P.playFor("volt_dragon"), "coil");
  assert.equal(P.playFor("trace_dragon"), "path");
  assert.equal(P.playFor("flux_dragon"), "field");
  assert.equal(P.playFor("spark_dragon"), "crackle");
  assert.equal(P.playFor("ion_dragon"), "charge");
  assert.equal(P.playFor("gauss_dragon"), "orbit");
  assert.equal(P.playFor("relay_dragon"), "sill");
  assert.equal(P.playFor("cat"), "sill");
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
  assert.equal(cat.kind, "sill");
  assert.equal(cat.side, "top");
  assert.notEqual(cat.kind, "cling-dive");
  assert.notEqual(cat.kind, "ridge");
  assert.notEqual(cat.kind, "coil");
  assert.notEqual(cat.kind, "path");
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
  const target = P.pickTarget([WIN], 80, "cat", WORK, P.SPRITE);
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
  assert.ok(Math.abs(mid.x - start.x) > 40 && Math.abs(end.lift - start.lift) > 20, "a closed loop, not one edge");
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

test("a moved window refits Gauss's orbit hold; sleep, card, and hide abort; Gauss never starts asleep; Relay still walks a sill", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.canStart({ asleep: false, hidden: false, card: false, cmd: "idle" }), true);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  assert.equal(P.playFor("relay_dragon"), "sill");
  assert.equal(P.playFor("fuse_dragon"), "sill");
  assert.equal(P.playFor("ground_dragon"), "sill");
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
  assert.match(htmlSrc, /window-play\.js/);
  assert.doesNotMatch(petSrc, /sprites\/red_panda\/.*write|createCanvas/);
  assert.doesNotMatch(petSrc, /sprites\/volt_dragon\/.*write|createCanvas/);
  assert.doesNotMatch(petSrc, /sprites\/trace_dragon\/.*write|createCanvas/);
});
