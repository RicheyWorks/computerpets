const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const P = require("./window-play.js");

const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const htmlSrc = readFileSync(join(__dirname, "index.html"), "utf8");

const WORK = { width: 1400, height: 800, floorLift: 0 };
const WIN = { id: "hw", x: 360, y: 80, width: 640, height: 420 };

test("Rui's door is cling and dive; Arc rides the ridge; other guests walk a sill", () => {
  assert.equal(P.playFor("red_panda"), "cling-dive");
  assert.equal(P.playFor("cyber_dragon"), "ridge");
  assert.equal(P.playFor("cat"), "sill");
  assert.equal(P.playFor("volt_dragon"), "sill");
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
  const cat = P.pickTarget([WIN], 80, "cat", WORK, P.SPRITE);
  assert.ok(cat);
  assert.equal(cat.kind, "sill");
  assert.equal(cat.side, "top");
  assert.notEqual(cat.kind, "cling-dive");
  assert.notEqual(cat.kind, "ridge");
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

test("the overlay and the demo share the window-play door", () => {
  assert.match(petSrc, /PetWindowPlay/);
  assert.match(petSrc, /beginPlay/);
  assert.match(petSrc, /shouldAbort/);
  assert.match(petSrc, /playFor/);
  assert.match(htmlSrc, /window-play\.js/);
  assert.doesNotMatch(petSrc, /sprites\/red_panda\/.*write|createCanvas/);
});
