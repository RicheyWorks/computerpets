const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const P = require("./window-play.js");

const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const htmlSrc = readFileSync(join(__dirname, "index.html"), "utf8");

const WORK = { width: 1400, height: 800, floorLift: 0 };
const WIN = { id: "hw", x: 360, y: 80, width: 640, height: 420 };

test("Rui's door is cling and dive; Arc rides the ridge; Volt coils a corner; Trace traces a path; Flux fields the glass; Spark crackles an edge; Ion charges a corner; Gauss orbits; Relay clicks; Fuse holds; Ground earths; Miso sits a ledge; Pip watches from the floor; Thimble thumps then vanishes; Clip stashes in a drawer; Whee wheeks at a window; Ink basks on a rail; Coin circles a bowl; Echo perches a shade; Rue scents a jamb; Peck bows a pane; Quill hooks a jamb; other guests walk a sill", () => {
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
  assert.equal(P.playFor("dog"), "watch");
  assert.equal(P.playFor("rabbit"), "thump");
  assert.equal(P.playFor("hamster"), "stash");
  assert.equal(P.playFor("guinea_pig"), "wheek");
  assert.equal(P.playFor("turtle"), "bask");
  assert.equal(P.playFor("goldfish"), "circle");
  assert.equal(P.playFor("budgie"), "perch");
  assert.equal(P.playFor("fox"), "scent");
  assert.equal(P.playFor("penguin"), "bow");
  assert.equal(P.playFor("parrot"), "hook");
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
  assert.equal(dog.kind, "watch");
  assert.equal(dog.side, "feet");
  assert.equal(dog.holdLift, 0);
  assert.notEqual(dog.kind, "sill");
  assert.notEqual(dog.kind, "ledge");
  assert.notEqual(dog.kind, "earth");
  assert.notEqual(dog.kind, "thump");
  const rabbit = P.pickTarget([WIN], 80, "rabbit", WORK, P.SPRITE, { side: "left" });
  assert.ok(rabbit);
  assert.equal(rabbit.kind, "thump");
  assert.equal(rabbit.holdLift, 0);
  assert.equal(rabbit.leave, "vanish");
  assert.notEqual(rabbit.kind, "sill");
  assert.notEqual(rabbit.kind, "watch");
  assert.notEqual(rabbit.kind, "ledge");
  assert.notEqual(rabbit.kind, "earth");
  const hamster = P.pickTarget([WIN], 80, "hamster", WORK, P.SPRITE, { side: "left" });
  assert.ok(hamster);
  assert.equal(hamster.kind, "stash");
  assert.equal(hamster.leave, "pop");
  assert.ok(hamster.holdLift > 16);
  assert.notEqual(hamster.kind, "sill");
  assert.notEqual(hamster.kind, "watch");
  assert.notEqual(hamster.kind, "thump");
  assert.notEqual(hamster.kind, "ledge");
  assert.notEqual(hamster.kind, "earth");
  const guinea = P.pickTarget([WIN], 80, "guinea_pig", WORK, P.SPRITE);
  assert.ok(guinea);
  assert.equal(guinea.kind, "wheek");
  assert.equal(guinea.side, "feet");
  assert.equal(guinea.holdLift, 0);
  assert.equal(guinea.leave, "waddle");
  assert.notEqual(guinea.kind, "sill");
  assert.notEqual(guinea.kind, "watch");
  assert.notEqual(guinea.kind, "thump");
  assert.notEqual(guinea.kind, "stash");
  assert.notEqual(guinea.kind, "ledge");
  assert.notEqual(guinea.kind, "earth");
  assert.notEqual(guinea.kind, "bask");
  const turtle = P.pickTarget([WIN], 80, "turtle", WORK, P.SPRITE);
  assert.ok(turtle);
  assert.equal(turtle.kind, "bask");
  assert.equal(turtle.side, "rail");
  assert.equal(turtle.leave, "slide");
  assert.ok(turtle.holdLift > 16);
  assert.notEqual(turtle.kind, "sill");
  assert.notEqual(turtle.kind, "earth");
  assert.notEqual(turtle.kind, "ledge");
  assert.notEqual(turtle.kind, "wheek");
  assert.notEqual(turtle.kind, "watch");
  assert.notEqual(turtle.kind, "stash");
  assert.notEqual(turtle.kind, "circle");
  const goldfish = P.pickTarget([WIN], 80, "goldfish", WORK, P.SPRITE);
  assert.ok(goldfish);
  assert.equal(goldfish.kind, "circle");
  assert.equal(goldfish.side, "bowl");
  assert.equal(goldfish.leave, "drift");
  assert.ok(goldfish.holdLift > 16);
  assert.notEqual(goldfish.kind, "sill");
  assert.notEqual(goldfish.kind, "bask");
  assert.notEqual(goldfish.kind, "field");
  assert.notEqual(goldfish.kind, "orbit");
  assert.notEqual(goldfish.kind, "charge");
  const budgie = P.pickTarget([WIN], 80, "budgie", WORK, P.SPRITE, { side: "left" });
  assert.ok(budgie);
  assert.equal(budgie.kind, "perch");
  assert.equal(budgie.side, "left");
  assert.equal(budgie.leave, "hop");
  assert.ok(budgie.holdLift > 16);
  assert.notEqual(budgie.kind, "sill");
  assert.notEqual(budgie.kind, "circle");
  assert.notEqual(budgie.kind, "bask");
  assert.notEqual(budgie.kind, "ledge");
  assert.notEqual(budgie.kind, "cling-dive");
  assert.notEqual(budgie.kind, "crackle");
  const fox = P.pickTarget([WIN], 80, "fox", WORK, P.SPRITE, { side: "left" });
  assert.ok(fox);
  assert.equal(fox.kind, "scent");
  assert.equal(fox.side, "left");
  assert.equal(fox.leave, "slip");
  assert.equal(fox.holdLift, 0);
  assert.notEqual(fox.kind, "sill");
  assert.notEqual(fox.kind, "perch");
  assert.notEqual(fox.kind, "watch");
  assert.notEqual(fox.kind, "ledge");
  assert.notEqual(fox.kind, "thump");
  assert.notEqual(fox.kind, "stash");
  assert.notEqual(fox.kind, "wheek");
  assert.notEqual(fox.kind, "bask");
  assert.notEqual(fox.kind, "circle");
  assert.notEqual(fox.kind, "earth");
  assert.notEqual(fox.kind, "cling-dive");
  const penguin = P.pickTarget([WIN], 80, "penguin", WORK, P.SPRITE);
  assert.ok(penguin);
  assert.equal(penguin.kind, "bow");
  assert.equal(penguin.side, "pane");
  assert.equal(penguin.leave, "hop");
  assert.ok(penguin.holdLift > 16);
  assert.notEqual(penguin.kind, "sill");
  assert.notEqual(penguin.kind, "scent");
  assert.notEqual(penguin.kind, "perch");
  assert.notEqual(penguin.kind, "watch");
  assert.notEqual(penguin.kind, "ledge");
  assert.notEqual(penguin.kind, "circle");
  assert.notEqual(penguin.kind, "bask");
  assert.notEqual(penguin.kind, "ridge");
  assert.notEqual(penguin.kind, "cling-dive");
  const parrot = P.pickTarget([WIN], 80, "parrot", WORK, P.SPRITE, { side: "left" });
  assert.ok(parrot);
  assert.equal(parrot.kind, "hook");
  assert.equal(parrot.side, "left");
  assert.equal(parrot.leave, "drop");
  assert.ok(parrot.holdLift > 16);
  assert.notEqual(parrot.kind, "sill");
  assert.notEqual(parrot.kind, "bow");
  assert.notEqual(parrot.kind, "perch");
  assert.notEqual(parrot.kind, "scent");
  assert.notEqual(parrot.kind, "watch");
  assert.notEqual(parrot.kind, "ledge");
  assert.notEqual(parrot.kind, "circle");
  assert.notEqual(parrot.kind, "bask");
  assert.notEqual(parrot.kind, "cling-dive");
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
  const target = P.pickTarget([WIN], 80, "gecko", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  for (let i = 0; i < 400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "cling");
    assert.notEqual(play.phase, "dive");
    assert.notEqual(play.phase, "watch-hold");
    assert.notEqual(play.phase, "thump");
    assert.notEqual(play.phase, "stash-cheek");
    assert.notEqual(play.phase, "wheek");
    assert.notEqual(play.phase, "bask");
    assert.notEqual(play.phase, "bask-withdraw");
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
  assert.ok(ledge.lift > ridge.lift, "on the outer ledge, not riding the title-bar");
  assert.ok(ledge.lift > sill.lift, "not a generic inner sill walk");
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
    assert.notEqual(play.phase, "watch-hold");
    assert.notEqual(play.phase, "thump");
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

test("Pip walks to a window, stays on the floor at its feet, watches, then trots away — not a sill, ledge, earth, or cling", () => {
  const WIN_B = { id: "hw2", x: 1040, y: 120, width: 300, height: 360 };
  const target = P.pickTarget([WIN, WIN_B], 80, "dog", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "watch");
  assert.equal(target.side, "feet");
  assert.equal(target.leave, "trot");
  assert.equal(target.holdLift, 0);
  assert.equal(target.clickToId, undefined);
  const watch = P.watchPoint(WIN, P.SPRITE, WORK);
  const ridge = P.ridgePoint(WIN, 0.5, P.SPRITE, WORK);
  const sill = P.sillPoint(WIN, 0.5, P.SPRITE, WORK);
  const earth = P.earthPoint(WIN, P.SPRITE, WORK);
  const ledge = P.ledgePoint(WIN, P.SPRITE, WORK);
  const cling = P.sideHold(WIN, "left", P.SPRITE, WORK);
  const coil = P.coilPoint(WIN, "left", P.SPRITE, WORK);
  const field = P.fieldPoint(WIN, P.SPRITE, WORK);
  const hold = P.holdPoint(WIN, "jamb", "left", P.SPRITE, WORK);
  assert.equal(target.holdX, watch.x);
  assert.equal(target.holdLift, watch.lift);
  assert.equal(watch.lift, 0, "the watch stays on the floor");
  assert.ok(watch.x > WIN.x && watch.x + P.SPRITE < WIN.x + WIN.width, "she stands at the window's feet");
  assert.ok(earth.lift > 8, "Ground's lug is off the floor");
  assert.ok(ledge.lift > 40, "Miso's ledge is off the floor");
  assert.ok(sill.lift > 20, "the generic sill is off the floor");
  assert.ok(ridge.lift > 40, "Arc's ridge is off the floor");
  assert.ok(Math.abs(watch.x - cling.x) > 40, "not Rui's mid-side cling");
  assert.ok(Math.abs(watch.x - coil.x) > 40 || watch.lift !== coil.lift, "not Volt's wrap-hold");
  assert.ok(field.lift > 40, "not Flux's glass");
  assert.ok(hold.lift > 20, "not Fuse's jamb clip");
  const on0 = P.watchOnPath(0, { x: 40, lift: 0 }, { x: watch.x, lift: 0 });
  const on1 = P.watchOnPath(1, { x: 40, lift: 0 }, { x: watch.x, lift: 0 });
  assert.equal(on0.lift, 0);
  assert.equal(on1.lift, 0);
  assert.equal(on1.x, watch.x);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  let sitMs = 0;
  let sitLift = 0;
  let sitXMin = Infinity;
  let sitXMax = -Infinity;
  let sitRot = 0;
  let maxLift = 0;
  let windowIds = new Set();
  for (let i = 0; i < 700 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    maxLift = Math.max(maxLift, play.lift);
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
    assert.notEqual(play.phase, "earth-on");
    assert.notEqual(play.phase, "ledge-sit");
    assert.notEqual(play.phase, "ledge-on");
    assert.notEqual(play.phase, "thump");
    assert.notEqual(play.phase, "thump-on");
    assert.notEqual(play.phase, "wheek");
    assert.notEqual(play.phase, "wheek-loaf");
    assert.notEqual(play.phase, "bask");
    assert.notEqual(play.phase, "bask-withdraw");
    assert.notEqual(play.phase, "sill-hop");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "watch-hold") {
      sitMs += 0.05;
      sitLift = play.lift;
      sitRot = play.rot;
      sitXMin = Math.min(sitXMin, play.x);
      sitXMax = Math.max(sitXMax, play.x);
      assert.equal(play.anim, "sit");
      assert.equal(play.lift, 0);
      assert.ok(play.rot > 0.05, "she looks up at the window");
      assert.equal(play.x, play.target.holdX);
    }
    if (play.phase === "watch-on" || play.phase === "watch-off") {
      assert.equal(play.lift, 0);
      assert.equal(play.anim, "walk");
    }
    if (play.target && play.target.id) windowIds.add(play.target.id);
  }
  assert.ok(seen.has("watch-on"));
  assert.ok(seen.has("watch-hold"));
  assert.ok(seen.has("watch-off"));
  assert.ok(!seen.has("sill-walk"), "not a sill parade");
  assert.ok(!seen.has("ledge-sit"), "not Miso's ledge sit");
  assert.ok(!seen.has("earth-sit"), "not Ground's lug");
  assert.ok(sitMs >= 1.7, `the watch is a real hold (${sitMs})`);
  assert.equal(sitLift, 0, "Pip stays on the floor for the watch");
  assert.ok(sitRot > 0.05, "the look-up is the tell");
  assert.ok(sitXMax - sitXMin < 2, "one watch — she does not walk the frame");
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(maxLift, 0, "never hops onto the frame");
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});

test("a moved window refits Pip's watch; sleep, card, and hide abort; Pip never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "dog", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 120 && play.phase !== "watch-hold"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "watch-hold");
  assert.equal(play.lift, 0);
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "watch-hold");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  assert.equal(play.x, play.target.holdX);
  assert.equal(play.lift, 0);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "done" || play.phase === "watch-off");
  assert.equal(play.abort, true);
  assert.equal(play.lift, 0);
});

test("Thimble hops to a window, stamps on the floor beside it, then vanishes — not a watch, ledge, earth, or sill", () => {
  const WIN_B = { id: "hw2", x: 1040, y: 120, width: 300, height: 360 };
  const target = P.pickTarget([WIN, WIN_B], 80, "rabbit", WORK, P.SPRITE, { side: "left" });
  assert.ok(target);
  assert.equal(target.kind, "thump");
  assert.equal(target.side, "left");
  assert.equal(target.leave, "vanish");
  assert.equal(target.holdLift, 0);
  assert.equal(target.clickToId, undefined);
  assert.ok(P.DUR.thump < P.DUR.watchHold / 3, "the stamp is a thump, not Pip's long watch");
  assert.ok(P.DUR.thump < P.DUR.ledgeSit / 4, "the stamp is not Miso's blink");
  assert.ok(P.DUR.thump < P.DUR.earthSit / 3, "the stamp is not Ground's lug hold");
  const thump = P.thumpPoint(WIN, P.SPRITE, WORK, "left");
  const watch = P.watchPoint(WIN, P.SPRITE, WORK);
  const ridge = P.ridgePoint(WIN, 0.5, P.SPRITE, WORK);
  const sill = P.sillPoint(WIN, 0.5, P.SPRITE, WORK);
  const earth = P.earthPoint(WIN, P.SPRITE, WORK);
  const ledge = P.ledgePoint(WIN, P.SPRITE, WORK);
  const cling = P.sideHold(WIN, "left", P.SPRITE, WORK);
  const coil = P.coilPoint(WIN, "left", P.SPRITE, WORK);
  const field = P.fieldPoint(WIN, P.SPRITE, WORK);
  const hold = P.holdPoint(WIN, "jamb", "left", P.SPRITE, WORK);
  assert.equal(target.holdX, thump.x);
  assert.equal(target.holdLift, thump.lift);
  assert.equal(thump.lift, 0, "the stamp stays on the floor");
  assert.ok(thump.x + P.SPRITE < WIN.x, "she stamps beside the frame, not under it");
  assert.ok(watch.x > WIN.x && watch.x + P.SPRITE < WIN.x + WIN.width, "Pip stands at the feet");
  assert.ok(Math.abs(thump.x - watch.x) > 40, "not Pip's watch point");
  assert.ok(earth.lift > 8, "Ground's lug is off the floor");
  assert.ok(ledge.lift > 40, "Miso's ledge is off the floor");
  assert.ok(sill.lift > 20, "the generic sill is off the floor");
  assert.ok(ridge.lift > 40, "Arc's ridge is off the floor");
  assert.ok(Math.abs(thump.x - cling.x) > 20 || thump.lift !== cling.lift, "not Rui's mid-side cling");
  assert.ok(Math.abs(thump.x - coil.x) > 20 || thump.lift !== coil.lift, "not Volt's wrap-hold");
  assert.ok(field.lift > 40, "not Flux's glass");
  assert.ok(hold.lift > 20, "not Fuse's jamb clip");
  const on0 = P.thumpOnPath(0, { x: 40, lift: 0 }, { x: thump.x, lift: 0 });
  const onMid = P.thumpOnPath(0.5, { x: 40, lift: 0 }, { x: thump.x, lift: 0 });
  const on1 = P.thumpOnPath(1, { x: 40, lift: 0 }, { x: thump.x, lift: 0 });
  assert.equal(on0.lift, 0);
  assert.ok(onMid.lift > 8 && onMid.lift < 36, "a floor hop, not onto the frame");
  assert.equal(on1.lift, 0);
  assert.equal(on1.x, thump.x);
  const stamp0 = P.thumpStampPath(0);
  const stampMid = P.thumpStampPath(0.35);
  const stampSlam = P.thumpStampPath(0.55);
  const stamp1 = P.thumpStampPath(1);
  assert.equal(stamp0.lift, 0);
  assert.ok(stampMid.lift > 4 && stampMid.lift < 16, "the cock is a stamp, not a hop onto glass");
  assert.ok(stampSlam.lift < stampMid.lift, "the slam is the tell");
  assert.equal(stamp1.lift, 0);
  assert.ok(stampMid.rot < 0, "a hind-foot stamp, not Pip's look-up");
  const vanishMid = P.thumpVanishPath(0.5, { x: thump.x, lift: 0 }, { x: thump.x - 118, lift: 0 });
  assert.ok(vanishMid.lift > 8 && vanishMid.lift < 40, "a vanish hop stays on the floor plane");
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  let stampMs = 0;
  let stampLift = 0;
  let stampXMin = Infinity;
  let stampXMax = -Infinity;
  let stampRot = 0;
  let maxLift = 0;
  let windowIds = new Set();
  for (let i = 0; i < 700 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    maxLift = Math.max(maxLift, play.lift);
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
    assert.notEqual(play.phase, "earth-on");
    assert.notEqual(play.phase, "ledge-sit");
    assert.notEqual(play.phase, "ledge-on");
    assert.notEqual(play.phase, "watch-hold");
    assert.notEqual(play.phase, "watch-on");
    assert.notEqual(play.phase, "wheek");
    assert.notEqual(play.phase, "wheek-loaf");
    assert.notEqual(play.phase, "bask");
    assert.notEqual(play.phase, "bask-withdraw");
    assert.notEqual(play.phase, "sill-hop");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "thump") {
      stampMs += 0.05;
      stampLift = Math.max(stampLift, play.lift);
      stampRot = play.rot;
      stampXMin = Math.min(stampXMin, play.x);
      stampXMax = Math.max(stampXMax, play.x);
      assert.equal(play.anim, "play");
      assert.ok(play.lift < 16, "the stamp stays on the floor");
      assert.ok(play.rot <= 0, "no look-up hold");
      assert.equal(play.x, play.target.holdX);
    }
    if (play.phase === "thump-on" || play.phase === "thump-off") {
      assert.equal(play.anim, "play");
      assert.ok(play.lift < 40, "hops stay on the floor plane");
    }
    if (play.target && play.target.id) windowIds.add(play.target.id);
  }
  assert.ok(seen.has("thump-on"));
  assert.ok(seen.has("thump"));
  assert.ok(seen.has("thump-off"));
  assert.ok(!seen.has("sill-walk"), "not a sill parade");
  assert.ok(!seen.has("watch-hold"), "not Pip's watch");
  assert.ok(!seen.has("ledge-sit"), "not Miso's ledge sit");
  assert.ok(!seen.has("earth-sit"), "not Ground's lug");
  assert.ok(stampMs >= 0.2 && stampMs <= 0.45, `the thump is brief (${stampMs})`);
  assert.ok(stampLift > 4, "the stamp is visible");
  assert.ok(stampLift < 16, "the stamp is a floor stamp");
  assert.ok(stampXMax - stampXMin < 2, "one stamp — she does not walk the frame");
  assert.equal(windowIds.size, 1, "one window");
  assert.ok(maxLift > 8, "she hops to the window and hops away");
  assert.ok(maxLift < 40, "never hops onto the frame");
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});

test("a moved window refits Thimble's thump; sleep, card, and hide abort; Thimble never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "rabbit", WORK, P.SPRITE, { side: "left" });
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 120 && play.phase !== "thump"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "thump");
  assert.ok(play.lift < 16);
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "thump");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  assert.equal(play.x, play.target.holdX);
  assert.ok(play.lift < 16);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "done" || play.phase === "thump-off");
  assert.equal(play.abort, true);
  assert.ok(play.lift < 40);
});

test("Clip hops to a window, ducks into the bottom-inside corner as a drawer, cheeks inventory, then pops out — not a ledge, watch, thump, earth, or sill", () => {
  const WIN_B = { id: "hw2", x: 1040, y: 120, width: 300, height: 360 };
  const target = P.pickTarget([WIN, WIN_B], 80, "hamster", WORK, P.SPRITE, { side: "left" });
  assert.ok(target);
  assert.equal(target.kind, "stash");
  assert.equal(target.side, "left");
  assert.equal(target.leave, "pop");
  assert.equal(target.clickToId, undefined);
  assert.ok(P.DUR.stashCheek > P.DUR.thump, "the cheek is a hold, not Thimble's stamp");
  assert.ok(P.DUR.stashCheek < P.DUR.watchHold / 2, "the cheek is short, not Pip's long watch");
  assert.ok(P.DUR.stashCheek < P.DUR.ledgeSit / 2, "the cheek is not Miso's blink");
  assert.ok(P.DUR.stashCheek < P.DUR.earthSit, "the cheek is not Ground's lug hold");
  const stash = P.stashPoint(WIN, "left", P.SPRITE, WORK);
  const watch = P.watchPoint(WIN, P.SPRITE, WORK);
  const thump = P.thumpPoint(WIN, P.SPRITE, WORK, "left");
  const ridge = P.ridgePoint(WIN, 0.5, P.SPRITE, WORK);
  const sill = P.sillPoint(WIN, 0.5, P.SPRITE, WORK);
  const earth = P.earthPoint(WIN, P.SPRITE, WORK);
  const ledge = P.ledgePoint(WIN, P.SPRITE, WORK);
  const cling = P.sideHold(WIN, "left", P.SPRITE, WORK);
  const coil = P.coilPoint(WIN, "left", P.SPRITE, WORK);
  const field = P.fieldPoint(WIN, P.SPRITE, WORK);
  const hold = P.holdPoint(WIN, "jamb", "left", P.SPRITE, WORK);
  const charge = P.chargePoint(WIN, "bl", P.SPRITE, WORK);
  assert.equal(target.holdX, stash.x);
  assert.equal(target.holdLift, stash.lift);
  assert.ok(stash.lift > 16, "the drawer is off the floor");
  assert.ok(stash.x >= WIN.x && stash.x + P.SPRITE <= WIN.x + WIN.width + 2, "he ducks inside the rect");
  assert.ok(Math.abs(stash.x - earth.x) > 40, "not Ground's mid-rail lug");
  assert.ok(stash.lift > earth.lift, "inside the bottom corner, not below the frame");
  assert.ok(Math.abs(stash.x - charge.x) > 8 || Math.abs(stash.lift - charge.lift) > 16, "not Ion's glass gather");
  assert.ok(ledge.lift > stash.lift + 40, "not Miso's top ledge");
  assert.equal(watch.lift, 0, "Pip stays on the floor");
  assert.equal(thump.lift, 0, "Thimble stays on the floor");
  assert.ok(sill.lift > stash.lift + 40, "not a generic top sill");
  assert.ok(ridge.lift > stash.lift + 40, "not Arc's ridge");
  assert.ok(Math.abs(stash.x - cling.x) > 20 || Math.abs(stash.lift - cling.lift) > 40, "not Rui's mid-side cling");
  assert.ok(Math.abs(stash.x - coil.x) > 20 || Math.abs(stash.lift - coil.lift) > 40, "not Volt's wrap-hold");
  assert.ok(Math.abs(stash.x - field.x) > 40 || Math.abs(stash.lift - field.lift) > 20, "not Flux's glass");
  assert.ok(Math.abs(stash.x - hold.x) > 16 || Math.abs(stash.lift - hold.lift) > 40, "not Fuse's jamb clip");
  const on0 = P.stashOnPath(0, { x: 40, lift: 0 }, { x: stash.x, lift: stash.lift });
  const onMid = P.stashOnPath(0.5, { x: 40, lift: 0 }, { x: stash.x, lift: stash.lift });
  const on1 = P.stashOnPath(1, { x: 40, lift: 0 }, { x: stash.x, lift: stash.lift });
  assert.equal(on0.lift, 0);
  assert.ok(onMid.lift > on0.lift, "he hops into the drawer");
  assert.ok(Math.abs(on1.lift - stash.lift) < 0.001);
  assert.equal(on1.x, stash.x);
  const cheek0 = P.stashCheekPath(0);
  const cheekMid = P.stashCheekPath(0.25);
  const cheek1 = P.stashCheekPath(1);
  assert.equal(cheek0.lift, 0);
  assert.ok(cheekMid.lift > 2 && cheekMid.lift < 8, "cheeks work in the drawer");
  assert.ok(Math.abs(cheekMid.rot) > 2, "the stuff is visible");
  assert.ok(Math.abs(cheekMid.rot) < 16, "not a look-up hold");
  assert.equal(cheek1.lift, 0);
  const popMid = P.stashOffPath(0.5, { x: stash.x, lift: stash.lift }, { x: stash.x - 80, lift: 0 });
  assert.ok(popMid.lift > 20, "the pop leaves the drawer");
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  let cheekMs = 0;
  let cheekLift = 0;
  let cheekXMin = Infinity;
  let cheekXMax = -Infinity;
  let cheekRot = 0;
  let maxLift = 0;
  let windowIds = new Set();
  for (let i = 0; i < 700 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    maxLift = Math.max(maxLift, play.lift);
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
    assert.notEqual(play.phase, "earth-on");
    assert.notEqual(play.phase, "ledge-sit");
    assert.notEqual(play.phase, "ledge-on");
    assert.notEqual(play.phase, "watch-hold");
    assert.notEqual(play.phase, "watch-on");
    assert.notEqual(play.phase, "thump");
    assert.notEqual(play.phase, "thump-on");
    assert.notEqual(play.phase, "wheek");
    assert.notEqual(play.phase, "wheek-loaf");
    assert.notEqual(play.phase, "bask");
    assert.notEqual(play.phase, "bask-withdraw");
    assert.notEqual(play.phase, "sill-hop");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "stash-cheek") {
      cheekMs += 0.05;
      cheekLift = play.lift;
      cheekRot = Math.max(cheekRot, Math.abs(play.rot));
      cheekXMin = Math.min(cheekXMin, play.x);
      cheekXMax = Math.max(cheekXMax, play.x);
      assert.equal(play.anim, "play");
      assert.ok(play.lift > 16, "the cheek stays in the drawer");
      assert.equal(play.x, play.target.holdX);
    }
    if (play.phase === "stash-on" || play.phase === "stash-off") {
      assert.equal(play.anim, "play");
    }
    if (play.target && play.target.id) windowIds.add(play.target.id);
  }
  assert.ok(seen.has("stash-on"));
  assert.ok(seen.has("stash-cheek"));
  assert.ok(seen.has("stash-off"));
  assert.ok(!seen.has("sill-walk"), "not a sill parade");
  assert.ok(!seen.has("watch-hold"), "not Pip's watch");
  assert.ok(!seen.has("thump"), "not Thimble's stamp");
  assert.ok(!seen.has("wheek"), "not Whee's voice");
  assert.ok(!seen.has("ledge-sit"), "not Miso's ledge sit");
  assert.ok(!seen.has("earth-sit"), "not Ground's lug");
  assert.ok(cheekMs >= 0.75 && cheekMs <= 1.1, `the cheek is a short hold (${cheekMs})`);
  assert.ok(cheekLift > 16, "he cheeks inside the drawer");
  assert.ok(cheekRot > 2, "the cheeks work");
  assert.ok(cheekXMax - cheekXMin < 2, "one hamster to a drawer");
  assert.equal(windowIds.size, 1, "one window");
  assert.ok(maxLift > 40, "he hops into the window drawer");
  assert.ok(maxLift < ledge.lift - 20, "never the top ledge");
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});

test("a moved window refits Clip's stash; sleep, card, and hide abort; Clip never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "hamster", WORK, P.SPRITE, { side: "left" });
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 120 && play.phase !== "stash-cheek"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "stash-cheek");
  assert.ok(play.lift > 16);
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "stash-cheek");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  assert.equal(play.x, play.target.holdX);
  assert.ok(play.lift > 16);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "stash-off");
  assert.equal(play.abort, true);
});

test("Whee waddles to a window, loaves on the floor, wheeks, popcorns once, then waddles off — not a watch, thump, stash, ledge, earth, or sill", () => {
  const WIN_B = { id: "hw2", x: 1040, y: 120, width: 300, height: 360 };
  const target = P.pickTarget([WIN, WIN_B], 80, "guinea_pig", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "wheek");
  assert.equal(target.side, "feet");
  assert.equal(target.leave, "waddle");
  assert.equal(target.clickToId, undefined);
  assert.ok(P.DUR.wheek < P.DUR.watchHold / 3, "the wheek is a voice, not Pip's long watch");
  assert.ok(P.DUR.wheek < P.DUR.ledgeSit / 4, "the wheek is not Miso's blink");
  assert.ok(P.DUR.wheek < P.DUR.earthSit / 2, "the wheek is not Ground's lug hold");
  assert.ok(P.DUR.wheekLoaf < P.DUR.watchHold, "the loaf is a sit, not Pip's look-up hold");
  assert.ok(P.DUR.wheekPop < P.DUR.watchHold / 3, "one popcorn hop, not a parade");
  const wheek = P.wheekPoint(WIN, P.SPRITE, WORK);
  const watch = P.watchPoint(WIN, P.SPRITE, WORK);
  const thump = P.thumpPoint(WIN, P.SPRITE, WORK, "left");
  const stash = P.stashPoint(WIN, "left", P.SPRITE, WORK);
  const ridge = P.ridgePoint(WIN, 0.5, P.SPRITE, WORK);
  const sill = P.sillPoint(WIN, 0.5, P.SPRITE, WORK);
  const earth = P.earthPoint(WIN, P.SPRITE, WORK);
  const ledge = P.ledgePoint(WIN, P.SPRITE, WORK);
  const cling = P.sideHold(WIN, "left", P.SPRITE, WORK);
  const coil = P.coilPoint(WIN, "left", P.SPRITE, WORK);
  const field = P.fieldPoint(WIN, P.SPRITE, WORK);
  const hold = P.holdPoint(WIN, "jamb", "left", P.SPRITE, WORK);
  assert.equal(target.holdX, wheek.x);
  assert.equal(target.holdLift, wheek.lift);
  assert.equal(wheek.lift, 0, "the loaf stays on the floor");
  assert.ok(wheek.x > WIN.x && wheek.x + P.SPRITE < WIN.x + WIN.width, "she loaves at the window's feet");
  assert.ok(Math.abs(wheek.x - watch.x) > 40, "not Pip's watch point");
  assert.ok(Math.abs(wheek.x - thump.x) > 40, "not Thimble's stamp beside the frame");
  assert.ok(Math.abs(wheek.x - stash.x) > 20 || wheek.lift !== stash.lift, "not Clip's drawer corner");
  assert.ok(ledge.lift > 40, "not Miso's top ledge");
  assert.ok(sill.lift > 40, "not a generic top sill");
  assert.ok(ridge.lift > 40, "not Arc's ridge");
  assert.ok(earth.lift !== 0 || Math.abs(wheek.x - earth.x) > 20, "not Ground's bottom lug");
  assert.ok(Math.abs(wheek.x - cling.x) > 20 || wheek.lift !== cling.lift, "not Rui's mid-side cling");
  assert.ok(Math.abs(wheek.x - coil.x) > 20 || wheek.lift !== coil.lift, "not Volt's wrap-hold");
  assert.ok(Math.abs(wheek.x - field.x) > 40 || wheek.lift !== field.lift, "not Flux's glass");
  assert.ok(Math.abs(wheek.x - hold.x) > 16 || wheek.lift !== hold.lift, "not Fuse's jamb clip");
  const on0 = P.wheekOnPath(0, { x: 40, lift: 0 }, { x: wheek.x, lift: 0 });
  const on1 = P.wheekOnPath(1, { x: 40, lift: 0 }, { x: wheek.x, lift: 0 });
  assert.equal(on0.lift, 0);
  assert.equal(on0.rot, 0, "no look-up on the waddle in");
  assert.equal(on1.x, wheek.x);
  assert.equal(on1.lift, 0);
  const voice0 = P.wheekVoicePath(0);
  const voiceMid = P.wheekVoicePath(0.25);
  const voice1 = P.wheekVoicePath(1);
  assert.equal(voice0.lift, 0);
  assert.ok(voiceMid.lift > 2 && voiceMid.lift < 8, "the wheek is a visible voice");
  assert.equal(voiceMid.rot, 0, "not a look-up");
  assert.equal(voice1.lift, 0);
  const pop0 = P.wheekPopPath(0);
  const popMid = P.wheekPopPath(0.5);
  const pop1 = P.wheekPopPath(1);
  assert.equal(pop0.lift, 0);
  assert.ok(popMid.lift > 16 && popMid.lift < 40, "one popcorn hop of joy");
  assert.equal(popMid.rot, 0, "the hop is joy, not a look-up");
  assert.equal(pop1.lift, 0);
  const offMid = P.wheekOffPath(0.5, { x: wheek.x, lift: 0 }, { x: wheek.x + 88, lift: 0 });
  assert.equal(offMid.lift, 0, "she waddles off on the floor");
  assert.equal(offMid.rot, 0);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  let loafMs = 0;
  let wheekMs = 0;
  let popMs = 0;
  let loafLift = 0;
  let loafRot = 0;
  let wheekRot = 0;
  let loafXMin = Infinity;
  let loafXMax = -Infinity;
  let wheekXMin = Infinity;
  let wheekXMax = -Infinity;
  let popXMin = Infinity;
  let popXMax = -Infinity;
  let maxLift = 0;
  let popLift = 0;
  let windowIds = new Set();
  for (let i = 0; i < 700 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    maxLift = Math.max(maxLift, play.lift);
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
    assert.notEqual(play.phase, "earth-on");
    assert.notEqual(play.phase, "ledge-sit");
    assert.notEqual(play.phase, "ledge-on");
    assert.notEqual(play.phase, "watch-hold");
    assert.notEqual(play.phase, "watch-on");
    assert.notEqual(play.phase, "thump");
    assert.notEqual(play.phase, "thump-on");
    assert.notEqual(play.phase, "stash-cheek");
    assert.notEqual(play.phase, "stash-on");
    assert.notEqual(play.phase, "bask");
    assert.notEqual(play.phase, "bask-withdraw");
    assert.notEqual(play.phase, "sill-hop");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "wheek-loaf") {
      loafMs += 0.05;
      loafLift = play.lift;
      loafRot = play.rot;
      loafXMin = Math.min(loafXMin, play.x);
      loafXMax = Math.max(loafXMax, play.x);
      assert.equal(play.anim, "sit");
      assert.equal(play.lift, 0, "the loaf stays on the floor");
      assert.equal(play.rot, 0, "the loaf does not look up");
      assert.equal(play.x, play.target.holdX);
    }
    if (play.phase === "wheek") {
      wheekMs += 0.05;
      wheekRot = Math.max(wheekRot, Math.abs(play.rot));
      wheekXMin = Math.min(wheekXMin, play.x);
      wheekXMax = Math.max(wheekXMax, play.x);
      assert.equal(play.anim, "talk", "the wheek is a voice pose");
      assert.ok(play.lift < 8, "the voice stays a loaf, not a hop");
      assert.equal(play.rot, 0, "not Pip's look-up");
      assert.equal(play.x, play.target.holdX);
    }
    if (play.phase === "wheek-pop") {
      popMs += 0.05;
      popLift = Math.max(popLift, play.lift);
      popXMin = Math.min(popXMin, play.x);
      popXMax = Math.max(popXMax, play.x);
      assert.equal(play.anim, "play");
      assert.equal(play.x, play.target.holdX, "one popcorn hop in place");
    }
    if (play.phase === "wheek-on" || play.phase === "wheek-off") {
      assert.equal(play.anim, "walk");
      assert.equal(play.lift, 0, "she stays visible on the floor");
      assert.equal(play.rot, 0);
    }
    if (play.target && play.target.id) windowIds.add(play.target.id);
  }
  assert.ok(seen.has("wheek-on"));
  assert.ok(seen.has("wheek-loaf"));
  assert.ok(seen.has("wheek"));
  assert.ok(seen.has("wheek-pop"));
  assert.ok(seen.has("wheek-off"));
  assert.ok(!seen.has("sill-walk"), "not a sill parade");
  assert.ok(!seen.has("watch-hold"), "not Pip's watch");
  assert.ok(!seen.has("thump"), "not Thimble's stamp");
  assert.ok(!seen.has("stash-cheek"), "not Clip's drawer");
  assert.ok(!seen.has("ledge-sit"), "not Miso's ledge sit");
  assert.ok(loafMs >= 0.6, `the loaf is a real sit (${loafMs})`);
  assert.equal(loafLift, 0, "Whee stays on the floor for the loaf");
  assert.equal(loafRot, 0, "the loaf does not look up");
  assert.ok(loafXMax - loafXMin < 2, "one loaf — she does not walk the frame");
  assert.ok(wheekMs >= 0.35 && wheekMs <= 0.6, `the wheek is brief (${wheekMs})`);
  assert.equal(wheekRot, 0, "the wheek is a voice, not a look-up");
  assert.ok(wheekXMax - wheekXMin < 2, "one wheek — she meant you");
  assert.ok(popMs >= 0.3 && popMs <= 0.55, `one popcorn hop (${popMs})`);
  assert.ok(popLift > 16 && popLift < 40, "the popcorn is joy, not a vanish");
  assert.ok(popXMax - popXMin < 2, "the hop stays at the loaf");
  assert.ok(maxLift < 40, "never hops onto the frame");
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
});

test("a moved window refits Whee's loaf; sleep, card, and hide abort; Whee never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "idle" }), false);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "guinea_pig", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 120 && play.phase !== "wheek-loaf"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "wheek-loaf");
  assert.equal(play.lift, 0);
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "wheek-loaf");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  assert.equal(play.x, play.target.holdX);
  assert.equal(play.lift, 0);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "done" || play.phase === "wheek-off");
  assert.equal(play.abort, true);
});

test("Ink paddles the long way to a window, basks on the bottom rail, withdraws the head, then slides back — not earth, ledge, wheek, watch, stash, or sill", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  const target = P.pickTarget([WIN, WIN_B], 80, "turtle", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "bask");
  assert.equal(target.side, "rail");
  assert.equal(target.leave, "slide");
  assert.equal(target.clickToId, undefined, "one window");
  assert.ok(P.DUR.baskOn > P.DUR.earthOn, "the paddle climb is the long way, not Ground's seat");
  assert.ok(P.DUR.baskWithdraw > P.DUR.wheek, "the scholar holds still longer than a wheek");
  assert.ok(P.DUR.baskWithdraw > P.DUR.earthSit * 0.9, "the withdraw is a scholar's stillness");
  assert.ok(P.DUR.baskOff > P.DUR.earthOff, "the slide home is the long way");
  const bask = P.baskPoint(WIN, P.SPRITE, WORK);
  const earth = P.earthPoint(WIN, P.SPRITE, WORK);
  const ledge = P.ledgePoint(WIN, P.SPRITE, WORK);
  const watch = P.watchPoint(WIN, P.SPRITE, WORK);
  const wheek = P.wheekPoint(WIN, P.SPRITE, WORK);
  const stash = P.stashPoint(WIN, "left", P.SPRITE, WORK);
  const cling = P.sideHold(WIN, "left", P.SPRITE, WORK);
  const coil = P.coilPoint(WIN, "left", P.SPRITE, WORK);
  const field = P.fieldPoint(WIN, P.SPRITE, WORK);
  const hold = P.holdPoint(WIN, "jamb", "left", P.SPRITE, WORK);
  const sill = P.sillPoint(WIN, 0.12, P.SPRITE, WORK);
  assert.equal(target.holdX, bask.x);
  assert.equal(target.holdLift, bask.lift);
  assert.ok(bask.lift > 16, "he sits the rail, not the floor");
  assert.ok(bask.x > WIN.x && bask.x + P.SPRITE < WIN.x + WIN.width, "inside the glass");
  assert.ok(bask.lift > earth.lift, "on the bottom rail, not below the frame as a lug");
  assert.ok(Math.abs(bask.x - earth.x) > 40, "not Ground's mid-rail lug");
  assert.ok(Math.abs(bask.lift - ledge.lift) > 40, "not Miso's top ledge");
  assert.ok(bask.lift !== 0 && Math.abs(bask.x - watch.x) > 40, "not Pip's floor watch");
  assert.ok(bask.lift !== 0 && Math.abs(bask.x - wheek.x) > 40, "not Whee's floor loaf");
  assert.ok(Math.abs(bask.x - stash.x) > 40, "not Clip's drawer corner");
  assert.ok(Math.abs(bask.x - cling.x) > 20 || Math.abs(bask.lift - cling.lift) > 20, "not Rui's mid-side cling");
  assert.ok(Math.abs(bask.x - coil.x) > 20 || Math.abs(bask.lift - coil.lift) > 20, "not Volt's wrap-hold");
  assert.ok(Math.abs(bask.x - field.x) > 20 || Math.abs(bask.lift - field.lift) > 20, "not Flux's glass");
  assert.ok(Math.abs(bask.x - hold.x) > 16 || Math.abs(bask.lift - hold.lift) > 20, "not Fuse's jamb clip");
  assert.ok(Math.abs(bask.lift - sill.lift) > 40, "not a generic top sill");
  const on0 = P.baskOnPath(0, { x: 40, lift: 0 }, { x: bask.x, lift: bask.lift });
  const onMid = P.baskOnPath(1 / 6, { x: 40, lift: 0 }, { x: bask.x, lift: bask.lift });
  const on1 = P.baskOnPath(1, { x: 40, lift: 0 }, { x: bask.x, lift: bask.lift });
  const earthMid = P.earthOnPath(1 / 6, { x: 40, lift: 0 }, { x: bask.x, lift: bask.lift });
  assert.equal(on0.x, 40);
  assert.equal(on1.x, bask.x);
  assert.equal(on1.lift, bask.lift);
  assert.ok(Math.abs(onMid.rot) > 1, "webbed feet paddle on the climb");
  assert.ok(Math.abs(onMid.lift - earthMid.lift) > 1, "the paddle is not Ground's straight seat");
  const tuck0 = P.baskWithdrawPath(0);
  const tuckMid = P.baskWithdrawPath(0.5);
  const tuck1 = P.baskWithdrawPath(1);
  assert.equal(tuck0.x, 0);
  assert.equal(tuck0.rot, 0);
  assert.ok(tuckMid.x < -4, "the head withdraws");
  assert.equal(tuck1.x, tuckMid.x);
  assert.equal(tuck1.rot, 0);
  const offMid = P.baskOffPath(0.25, { x: bask.x, lift: bask.lift }, { x: bask.x + 156, lift: 0 });
  assert.equal(offMid.lift, bask.lift);
  assert.ok(offMid.x !== bask.x, "the long way starts along the rail");
  let play = P.beginPlay(target, target.approachX);
  assert.ok(Math.abs(target.approachX - target.holdX) > 120, "he takes the long way in");
  assert.ok(Math.abs(target.landX - target.holdX) > 120, "he takes the long way home");
  const seen = new Set();
  let baskMs = 0;
  let withdrawMs = 0;
  let sitLift = 0;
  let withdrawRot = 0;
  let withdrawXMin = Infinity;
  let withdrawXMax = -Infinity;
  let windowIds = new Set();
  for (let i = 0; i < 800 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    windowIds.add(play.target.id);
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
    assert.notEqual(play.phase, "earth-on");
    assert.notEqual(play.phase, "ledge-sit");
    assert.notEqual(play.phase, "ledge-on");
    assert.notEqual(play.phase, "watch-hold");
    assert.notEqual(play.phase, "watch-on");
    assert.notEqual(play.phase, "thump");
    assert.notEqual(play.phase, "stash-cheek");
    assert.notEqual(play.phase, "wheek");
    assert.notEqual(play.phase, "wheek-loaf");
    assert.notEqual(play.phase, "sill-hop");
    assert.notEqual(play.phase, "sill-walk");
    assert.notEqual(play.phase, "circle");
    assert.notEqual(play.phase, "circle-on");
    if (play.phase === "bask") {
      baskMs += 0.05;
      sitLift = play.lift;
      assert.equal(play.anim, "sit");
      assert.equal(play.rot, 0);
      assert.ok(play.lift > earth.lift, "the stone is on the rail");
    }
    if (play.phase === "bask-withdraw") {
      withdrawMs += 0.05;
      withdrawRot = Math.max(withdrawRot, Math.abs(play.rot));
      withdrawXMin = Math.min(withdrawXMin, play.x);
      withdrawXMax = Math.max(withdrawXMax, play.x);
      assert.equal(play.anim, "sit", "the scholar holds still");
      assert.equal(play.rot, 0, "a withdraw, not a look-up");
      assert.ok(play.lift > 16, "still on the rail");
    }
    if (play.phase === "bask-on" || play.phase === "bask-off") {
      assert.equal(play.anim, "play");
    }
  }
  assert.ok(seen.has("bask-on"));
  assert.ok(seen.has("bask"));
  assert.ok(seen.has("bask-withdraw"));
  assert.ok(seen.has("bask-off"));
  assert.ok(!seen.has("earth-sit"), "not Ground's lug");
  assert.ok(!seen.has("ledge-sit"), "not Miso's ledge");
  assert.ok(!seen.has("wheek"), "not Whee's voice");
  assert.ok(!seen.has("sill-walk"), "not a generic sill");
  assert.equal(windowIds.size, 1, "one window");
  assert.ok(sitLift > earth.lift, "Ink holds the rail as a pond stone");
  assert.ok(baskMs >= 0.7 && baskMs <= 1.1, `the bask settles (${baskMs})`);
  assert.ok(withdrawMs >= 1.5 && withdrawMs <= 2.0, `the scholar withdraws and holds (${withdrawMs})`);
  assert.equal(withdrawRot, 0, "the withdraw is still, not a look-up");
  assert.ok(withdrawXMax - withdrawXMin < 12, "the head tucks; he does not walk the rail");
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});

test("a moved window refits Ink's rail; sleep, card, and hide abort; Ink never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  const target = P.pickTarget([WIN], 200, "turtle", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 200 && play.phase !== "bask"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "bask");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "bask");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  assert.equal(play.x, play.target.holdX);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "bask-off");
  assert.equal(play.abort, true);
});

test("Coin drifts onto a window as a bowl, swims one slow circle on the pane, then drifts off — not orbit, field, charge, bask, or sill", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  const target = P.pickTarget([WIN, WIN_B], 80, "goldfish", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "circle");
  assert.equal(target.side, "bowl");
  assert.equal(target.leave, "drift");
  assert.equal(target.clickToId, undefined, "one window");
  assert.ok(P.DUR.circle > P.DUR.fieldHold, "the thought is a swim, not Flux's still sit");
  assert.ok(P.DUR.circle > P.DUR.chargeBolt * 4, "one slow circle, not Ion's bolt");
  assert.ok(P.DUR.circleOn > P.DUR.earthOn, "she drifts onto the bowl, not a seat");
  assert.ok(P.DUR.circle !== P.DUR.orbitLoop, "her own duration — not Gauss's outside circuit");
  const start = P.circlePoint(WIN, 0, P.SPRITE, WORK, 1);
  const mid = P.circlePoint(WIN, 0.5, P.SPRITE, WORK, 1);
  const top = P.circlePoint(WIN, 0.25, P.SPRITE, WORK, 1);
  const field = P.fieldPoint(WIN, P.SPRITE, WORK);
  const orbit = P.orbitPoint(WIN, 0, P.SPRITE, WORK, 1);
  const orbitMid = P.orbitPoint(WIN, 0.5, P.SPRITE, WORK, 1);
  const charge = P.chargePoint(WIN, "tl", P.SPRITE, WORK);
  const bask = P.baskPoint(WIN, P.SPRITE, WORK);
  const earth = P.earthPoint(WIN, P.SPRITE, WORK);
  const ledge = P.ledgePoint(WIN, P.SPRITE, WORK);
  const watch = P.watchPoint(WIN, P.SPRITE, WORK);
  const wheek = P.wheekPoint(WIN, P.SPRITE, WORK);
  const stash = P.stashPoint(WIN, "left", P.SPRITE, WORK);
  const cling = P.sideHold(WIN, "left", P.SPRITE, WORK);
  const coil = P.coilPoint(WIN, "left", P.SPRITE, WORK);
  const hold = P.holdPoint(WIN, "jamb", "left", P.SPRITE, WORK);
  const sill = P.sillPoint(WIN, 0.12, P.SPRITE, WORK);
  assert.equal(target.holdX, start.x);
  assert.equal(target.holdLift, start.lift);
  assert.ok(start.x > WIN.x && start.x + P.SPRITE < WIN.x + WIN.width, "the body stays inside the pane");
  assert.ok(start.x + P.SPRITE / 2 > WIN.x && start.x + P.SPRITE / 2 < WIN.x + WIN.width, "the body center is on the glass");
  assert.ok(mid.x > WIN.x && mid.x + P.SPRITE < WIN.x + WIN.width, "the far thought stays inside");
  assert.ok(orbit.x + P.SPRITE / 2 < WIN.x, "Gauss starts outside the left edge");
  assert.ok(orbitMid.x + P.SPRITE / 2 > WIN.x + WIN.width, "Gauss crosses the far outside");
  assert.ok(Math.abs(start.x - field.x) > 40 || Math.abs(start.lift - field.lift) > 20, "not Flux's glass sit");
  assert.ok(Math.abs(start.x - orbit.x) > 40, "not Gauss's outside circuit");
  assert.ok(Math.abs(start.x - charge.x) > 20 || Math.abs(start.lift - charge.lift) > 20, "not Ion's inside corner");
  assert.ok(Math.abs(start.lift - bask.lift) > 40, "not Ink's bottom rail");
  assert.ok(Math.abs(start.lift - earth.lift) > 40, "not Ground's lug");
  assert.ok(Math.abs(start.lift - ledge.lift) > 40, "not Miso's top ledge");
  assert.ok(start.lift !== 0 && Math.abs(start.x - watch.x) > 20, "not Pip's floor watch");
  assert.ok(start.lift !== 0 && Math.abs(start.x - wheek.x) > 20, "not Whee's floor loaf");
  assert.ok(Math.abs(start.x - stash.x) > 20 || Math.abs(start.lift - stash.lift) > 20, "not Clip's drawer");
  assert.ok(Math.abs(start.x - cling.x) > 20 || Math.abs(start.lift - cling.lift) > 20, "not Rui's mid-side cling");
  assert.ok(Math.abs(start.x - coil.x) > 20 || Math.abs(start.lift - coil.lift) > 20, "not Volt's wrap-hold");
  assert.ok(Math.abs(start.x - hold.x) > 16 || Math.abs(start.lift - hold.lift) > 20, "not Fuse's jamb clip");
  assert.ok(Math.abs(start.lift - sill.lift) > 40, "not a generic top sill");
  assert.ok(Math.abs(mid.x - start.x) > 40, "one thought crosses the bowl");
  assert.ok(Math.abs(top.lift - start.lift) > 40, "the circle changes height");
  const on0 = P.circleOnPath(0, { x: 40, lift: 0 }, { x: start.x, lift: start.lift });
  const on1 = P.circleOnPath(1, { x: 40, lift: 0 }, { x: start.x, lift: start.lift });
  const fieldMid = P.fieldOnPath(0.5, { x: 40, lift: 0 }, { x: start.x, lift: start.lift });
  const onMid = P.circleOnPath(0.5, { x: 40, lift: 0 }, { x: start.x, lift: start.lift });
  assert.equal(on0.x, 40);
  assert.equal(on1.x, start.x);
  assert.equal(on1.lift, start.lift);
  assert.equal(on0.rot, 0);
  assert.equal(on1.rot, 0);
  assert.ok(Math.abs(onMid.lift - fieldMid.lift) > 0.5, "the drift onto the bowl is her own path");
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  let circleMs = 0;
  let circleXMin = Infinity;
  let circleXMax = -Infinity;
  let circleLiftMin = Infinity;
  let circleLiftMax = -Infinity;
  let inside = true;
  let windowIds = new Set();
  for (let i = 0; i < 800 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    windowIds.add(play.target.id);
    assert.notEqual(play.phase, "cling");
    assert.notEqual(play.phase, "hang");
    assert.notEqual(play.phase, "dive");
    assert.notEqual(play.phase, "ridge-hold");
    assert.notEqual(play.phase, "coil-hold");
    assert.notEqual(play.phase, "path-walk");
    assert.notEqual(play.phase, "field-hold");
    assert.notEqual(play.phase, "field-on");
    assert.notEqual(play.phase, "crackle-hop");
    assert.notEqual(play.phase, "charge-bolt");
    assert.notEqual(play.phase, "orbit-loop");
    assert.notEqual(play.phase, "orbit-on");
    assert.notEqual(play.phase, "click-hop");
    assert.notEqual(play.phase, "hold-sit");
    assert.notEqual(play.phase, "earth-sit");
    assert.notEqual(play.phase, "ledge-sit");
    assert.notEqual(play.phase, "watch-hold");
    assert.notEqual(play.phase, "thump");
    assert.notEqual(play.phase, "stash-cheek");
    assert.notEqual(play.phase, "wheek");
    assert.notEqual(play.phase, "bask");
    assert.notEqual(play.phase, "bask-withdraw");
    assert.notEqual(play.phase, "perch-talk");
    assert.notEqual(play.phase, "sill-hop");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "circle") {
      circleMs += 0.05;
      circleXMin = Math.min(circleXMin, play.x);
      circleXMax = Math.max(circleXMax, play.x);
      circleLiftMin = Math.min(circleLiftMin, play.lift);
      circleLiftMax = Math.max(circleLiftMax, play.lift);
      assert.equal(play.anim, "play", "she swims the thought; she does not sit it");
      assert.equal(play.rot, 0);
      if (play.x <= WIN.x || play.x + P.SPRITE >= WIN.x + WIN.width) inside = false;
    }
    if (play.phase === "circle-on" || play.phase === "circle-off") {
      assert.equal(play.anim, "play");
      assert.equal(play.rot, 0);
    }
  }
  assert.ok(seen.has("circle-on"));
  assert.ok(seen.has("circle"));
  assert.ok(seen.has("circle-off"));
  assert.ok(!seen.has("orbit-loop"), "not Gauss");
  assert.ok(!seen.has("field-hold"), "not Flux");
  assert.ok(!seen.has("charge-bolt"), "not Ion");
  assert.ok(!seen.has("bask"), "not Ink");
  assert.ok(!seen.has("sill-walk"), "not a generic sill");
  assert.equal(windowIds.size, 1, "one window");
  assert.ok(inside, "the circle stays on the pane");
  assert.ok(circleXMax - circleXMin > 40, "one thought crosses the bowl");
  assert.ok(circleLiftMax - circleLiftMin > 40, "the circle changes height");
  assert.ok(circleMs >= 2.4 && circleMs <= 3.2, `one slow thought (${circleMs})`);
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});

test("a moved window refits Coin's bowl; sleep, card, and hide abort; Coin never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "goldfish", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 200 && play.phase !== "circle"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "circle");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "circle");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  const u = play.t / P.DUR.circle;
  const pose = P.circlePoint(moved, u, P.SPRITE, WORK, play.target.circleDir);
  assert.ok(Math.abs(play.x - pose.x) < 2, "the thought follows the moved bowl");
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "circle-off");
  assert.equal(play.abort, true);
});

test("Echo hops onto a window as a lamp-shade perch, talks the room kinder, then hops off — not ledge, cling, crackle, circle, or sill", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  const target = P.pickTarget([WIN, WIN_B], 80, "budgie", WORK, P.SPRITE, { side: "left" });
  assert.ok(target);
  assert.equal(target.kind, "perch");
  assert.equal(target.side, "left");
  assert.equal(target.leave, "hop");
  assert.equal(target.clickToId, undefined, "one window");
  assert.ok(P.DUR.perchTalk > P.DUR.wheek, "the kinder repeat holds longer than a wheek");
  assert.ok(P.DUR.perchTalk !== P.DUR.ledgeSit, "not Miso's long blink");
  assert.ok(P.DUR.perchOn < P.DUR.circleOn, "he hops onto the shade, not a drift");
  assert.ok(P.DUR.perchOn !== P.DUR.ledgeOn, "his own hop onto the shade");
  const perch = P.perchPoint(WIN, "left", P.SPRITE, WORK);
  const cling = P.sideHold(WIN, "left", P.SPRITE, WORK);
  const ledge = P.ledgePoint(WIN, P.SPRITE, WORK);
  const crackle = P.cracklePoint(WIN, 0, P.SPRITE, WORK, "left");
  const circle = P.circlePoint(WIN, 0, P.SPRITE, WORK, 1);
  const bask = P.baskPoint(WIN, P.SPRITE, WORK);
  const field = P.fieldPoint(WIN, P.SPRITE, WORK);
  const earth = P.earthPoint(WIN, P.SPRITE, WORK);
  const watch = P.watchPoint(WIN, P.SPRITE, WORK);
  const wheek = P.wheekPoint(WIN, P.SPRITE, WORK);
  const stash = P.stashPoint(WIN, "left", P.SPRITE, WORK);
  const hold = P.holdPoint(WIN, "jamb", "left", P.SPRITE, WORK);
  const sill = P.sillPoint(WIN, 0.12, P.SPRITE, WORK);
  assert.equal(target.holdX, perch.x);
  assert.equal(target.holdLift, perch.lift);
  assert.ok(perch.lift > 16, "he sits the shade, not the floor");
  assert.ok(Math.abs(perch.lift - ledge.lift) > 40, "not Miso's top ledge");
  assert.ok(Math.abs(perch.x - cling.x) > 20 || Math.abs(perch.lift - cling.lift) > 20, "not Rui's mid-side cling");
  assert.ok(Math.abs(perch.x - crackle.x) > 16 || Math.abs(perch.lift - crackle.lift) > 20, "not Spark's edge hop");
  assert.ok(Math.abs(perch.x - circle.x) > 20 || Math.abs(perch.lift - circle.lift) > 20, "not Coin's bowl");
  assert.ok(Math.abs(perch.lift - bask.lift) > 40, "not Ink's bottom rail");
  assert.ok(Math.abs(perch.x - field.x) > 40, "not Flux's glass sit");
  assert.ok(Math.abs(perch.lift - earth.lift) > 40, "not Ground's lug");
  assert.ok(perch.lift !== 0 && Math.abs(perch.x - watch.x) > 20, "not Pip's floor watch");
  assert.ok(perch.lift !== 0 && Math.abs(perch.x - wheek.x) > 20, "not Whee's floor loaf");
  assert.ok(Math.abs(perch.x - stash.x) > 20 || Math.abs(perch.lift - stash.lift) > 20, "not Clip's drawer");
  assert.ok(Math.abs(perch.x - hold.x) > 16 || Math.abs(perch.lift - hold.lift) > 20, "not Fuse's jamb clip");
  assert.ok(Math.abs(perch.lift - sill.lift) > 40, "not a generic top sill");
  const on0 = P.perchOnPath(0, { x: 40, lift: 0 }, { x: perch.x, lift: perch.lift });
  const on1 = P.perchOnPath(1, { x: 40, lift: 0 }, { x: perch.x, lift: perch.lift });
  const onMid = P.perchOnPath(0.5, { x: 40, lift: 0 }, { x: perch.x, lift: perch.lift });
  const leapMid = P.leapPath(0.5, { x: 40, lift: 0 }, { x: perch.x, lift: perch.lift });
  assert.equal(on0.x, 40);
  assert.equal(on1.x, perch.x);
  assert.equal(on1.lift, perch.lift);
  assert.ok(onMid.lift > perch.lift * 0.4, "the hop has an arc");
  assert.ok(Math.abs(onMid.lift - leapMid.lift) > 0.5 || Math.abs(onMid.rot - leapMid.rot) > 0.5, "his own hop onto the shade");
  const talk0 = P.perchTalkPath(0);
  const talkMid = P.perchTalkPath(0.25);
  const talk1 = P.perchTalkPath(1);
  assert.equal(talk0.lift, 0);
  assert.equal(talk1.lift, 0);
  assert.ok(talkMid.lift > 0, "the cere bobs — he repeats it kinder");
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  let talkMs = 0;
  let talkXMin = Infinity;
  let talkXMax = -Infinity;
  let windowIds = new Set();
  for (let i = 0; i < 800 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    windowIds.add(play.target.id);
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
    assert.notEqual(play.phase, "ledge-sit");
    assert.notEqual(play.phase, "watch-hold");
    assert.notEqual(play.phase, "thump");
    assert.notEqual(play.phase, "stash-cheek");
    assert.notEqual(play.phase, "wheek");
    assert.notEqual(play.phase, "bask");
    assert.notEqual(play.phase, "bask-withdraw");
    assert.notEqual(play.phase, "circle");
    assert.notEqual(play.phase, "circle-on");
    assert.notEqual(play.phase, "scent");
    assert.notEqual(play.phase, "sill-hop");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "perch-talk") {
      talkMs += 0.05;
      talkXMin = Math.min(talkXMin, play.x);
      talkXMax = Math.max(talkXMax, play.x);
      assert.equal(play.anim, "talk", "he returns the room nicer");
      assert.ok(play.lift > 16, "he talks from the shade");
    }
  }
  assert.ok(seen.has("perch-on"));
  assert.ok(seen.has("perch-talk"));
  assert.ok(seen.has("perch-off"));
  assert.ok(!seen.has("ledge-sit"), "not Miso");
  assert.ok(!seen.has("cling"), "not Rui");
  assert.ok(!seen.has("crackle-hop"), "not Spark");
  assert.ok(!seen.has("circle"), "not Coin");
  assert.ok(!seen.has("sill-walk"), "not a generic sill");
  assert.equal(windowIds.size, 1, "one window");
  assert.ok(talkXMax - talkXMin < 2, "one perch — not a walk across");
  assert.ok(talkMs >= 1.2 && talkMs <= 1.8, `the kinder repeat holds (${talkMs})`);
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});

test("a moved window refits Echo's perch; sleep, card, and hide abort; Echo never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "budgie", WORK, P.SPRITE, { side: "left" });
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 200 && play.phase !== "perch-talk"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "perch-talk");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "perch-talk");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  assert.equal(play.x, play.target.holdX);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "perch-off");
  assert.equal(play.abort, true);
});

test("Rue walks to a window, scents the near jamb on the floor, then slips away — not perch, watch, thump, ledge, cling, or sill", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  const target = P.pickTarget([WIN, WIN_B], 80, "fox", WORK, P.SPRITE, { side: "left" });
  assert.ok(target);
  assert.equal(target.kind, "scent");
  assert.equal(target.side, "left");
  assert.equal(target.leave, "slip");
  assert.equal(target.clickToId, undefined, "one window");
  assert.equal(target.holdLift, 0, "she stays on the floor");
  assert.ok(P.DUR.scent > P.DUR.thump, "the scent holds longer than a thump");
  assert.ok(P.DUR.scent !== P.DUR.watchHold, "not Pip's look-up hold");
  assert.ok(P.DUR.scentOn !== P.DUR.perchOn, "she prowls, she does not hop");
  assert.ok(P.DUR.scentOn !== P.DUR.watchOn, "her own walk to the jamb");
  const scent = P.scentPoint(WIN, "left", P.SPRITE, WORK);
  const perch = P.perchPoint(WIN, "left", P.SPRITE, WORK);
  const cling = P.sideHold(WIN, "left", P.SPRITE, WORK);
  const ledge = P.ledgePoint(WIN, P.SPRITE, WORK);
  const watch = P.watchPoint(WIN, P.SPRITE, WORK);
  const thump = P.thumpPoint(WIN, P.SPRITE, WORK, "left");
  const stash = P.stashPoint(WIN, "left", P.SPRITE, WORK);
  const wheek = P.wheekPoint(WIN, P.SPRITE, WORK);
  const hold = P.holdPoint(WIN, "jamb", "left", P.SPRITE, WORK);
  const earth = P.earthPoint(WIN, P.SPRITE, WORK);
  const bask = P.baskPoint(WIN, P.SPRITE, WORK);
  const circle = P.circlePoint(WIN, 0, P.SPRITE, WORK, 1);
  const sill = P.sillPoint(WIN, 0.12, P.SPRITE, WORK);
  assert.equal(target.holdX, scent.x);
  assert.equal(target.holdLift, scent.lift);
  assert.equal(scent.lift, 0, "the nose is at the crack, not on the frame");
  assert.ok(Math.abs(scent.x - perch.x) > 12 || Math.abs(scent.lift - perch.lift) > 20, "not Echo's shade perch");
  assert.ok(scent.lift !== perch.lift, "not a mid-height perch");
  assert.ok(Math.abs(scent.x - cling.x) > 8 || Math.abs(scent.lift - cling.lift) > 20, "not Rui's mid-side cling");
  assert.ok(Math.abs(scent.lift - ledge.lift) > 40, "not Miso's top ledge");
  assert.ok(Math.abs(scent.x - watch.x) > 20, "not Pip's floor watch at the feet");
  assert.ok(Math.abs(scent.x - thump.x) > 12, "not Thimble's stamp beside the frame");
  assert.ok(Math.abs(scent.x - wheek.x) > 20, "not Whee's floor loaf");
  assert.ok(Math.abs(scent.x - stash.x) > 8 || Math.abs(scent.lift - stash.lift) > 16, "not Clip's drawer");
  assert.ok(Math.abs(scent.lift - hold.lift) > 20, "not Fuse's jamb clip");
  assert.ok(Math.abs(scent.lift - earth.lift) > 8, "not Ground's lug");
  assert.ok(Math.abs(scent.lift - bask.lift) > 16, "not Ink's rail");
  assert.ok(Math.abs(scent.x - circle.x) > 20 || Math.abs(scent.lift - circle.lift) > 20, "not Coin's bowl");
  assert.ok(Math.abs(scent.lift - sill.lift) > 16, "not a generic top sill");
  const on0 = P.scentOnPath(0, { x: 40, lift: 0 }, { x: scent.x, lift: 0 });
  const on1 = P.scentOnPath(1, { x: 40, lift: 0 }, { x: scent.x, lift: 0 });
  const onMid = P.scentOnPath(0.5, { x: 40, lift: 0 }, { x: scent.x, lift: 0 });
  const watchMid = P.watchOnPath(0.5, { x: 40, lift: 0 }, { x: scent.x, lift: 0 });
  assert.equal(on0.x, 40);
  assert.equal(on1.x, scent.x);
  assert.equal(on0.lift, 0);
  assert.equal(on1.lift, 0);
  assert.equal(onMid.lift, 0, "she prowls the floor — no hop");
  assert.ok(Math.abs(onMid.rot - watchMid.rot) > 0.01, "a lean into the jamb, not a look-up");
  const nose0 = P.scentNosePath(0);
  const noseMid = P.scentNosePath(0.25);
  const nosePeek = P.scentNosePath(0.85);
  const nose1 = P.scentNosePath(1);
  assert.equal(nose0.lift, 0);
  assert.ok(noseMid.lift > 0, "the muzzle lifts into the crack");
  assert.ok(noseMid.x > 0, "the nose goes into the jamb");
  assert.ok(nosePeek.x > noseMid.x, "then she peeks around the jamb");
  assert.ok(nose1.x > 0);
  const slip0 = P.scentOffPath(0, { x: scent.x, lift: 0 }, { x: scent.x - 110, lift: 0 });
  const slip1 = P.scentOffPath(1, { x: scent.x, lift: 0 }, { x: scent.x - 110, lift: 0 });
  assert.equal(slip0.x, scent.x);
  assert.equal(slip1.x, scent.x - 110);
  assert.equal(slip0.lift, 0);
  assert.equal(slip1.lift, 0);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  let scentMs = 0;
  let scentXMin = Infinity;
  let scentXMax = -Infinity;
  let scentLiftMax = 0;
  let windowIds = new Set();
  for (let i = 0; i < 800 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    windowIds.add(play.target.id);
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
    assert.notEqual(play.phase, "ledge-sit");
    assert.notEqual(play.phase, "watch-hold");
    assert.notEqual(play.phase, "thump");
    assert.notEqual(play.phase, "stash-cheek");
    assert.notEqual(play.phase, "wheek");
    assert.notEqual(play.phase, "bask");
    assert.notEqual(play.phase, "bask-withdraw");
    assert.notEqual(play.phase, "circle");
    assert.notEqual(play.phase, "perch-talk");
    assert.notEqual(play.phase, "perch-on");
    assert.notEqual(play.phase, "sill-hop");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "scent") {
      scentMs += 0.05;
      scentXMin = Math.min(scentXMin, play.x);
      scentXMax = Math.max(scentXMax, play.x);
      scentLiftMax = Math.max(scentLiftMax, play.lift);
      assert.equal(play.anim, "sit", "the scent is a still sit");
      assert.ok(play.lift < 12, "the muzzle stays at the crack, not a perch");
      assert.ok(Math.abs(play.rot) < 12, "a sniff tilt, not Pip's look-up");
    }
    if (play.phase === "scent-on" || play.phase === "scent-off") {
      assert.equal(play.lift, 0);
      assert.equal(play.anim, "walk");
    }
  }
  assert.ok(seen.has("scent-on"));
  assert.ok(seen.has("scent"));
  assert.ok(seen.has("scent-off"));
  assert.ok(!seen.has("perch-talk"), "not Echo");
  assert.ok(!seen.has("watch-hold"), "not Pip");
  assert.ok(!seen.has("thump"), "not Thimble");
  assert.ok(!seen.has("ledge-sit"), "not Miso");
  assert.ok(!seen.has("sill-walk"), "not a generic sill");
  assert.equal(windowIds.size, 1, "one window");
  assert.ok(scentXMax - scentXMin > 2, "the nose works the crack");
  assert.ok(scentXMax - scentXMin < 28, "one jamb — not a walk across");
  assert.ok(scentLiftMax > 0 && scentLiftMax < 12, "a sniff, not a hop");
  assert.ok(scentMs >= 1.4 && scentMs <= 2.0, `the scent holds (${scentMs})`);
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});

test("a moved window refits Rue's jamb; sleep, card, and hide abort; Rue never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "fox", WORK, P.SPRITE, { side: "left" });
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 200 && play.phase !== "scent"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "scent");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "scent");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "scent-off");
  assert.equal(play.abort, true);
});

test("Peck hops onto a window as a landing rock, stands in full dress, bows, then hops down — not scent, perch, watch, ledge, circle, bask, ridge, or sill", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  const target = P.pickTarget([WIN, WIN_B], 80, "penguin", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "bow");
  assert.equal(target.side, "pane");
  assert.equal(target.leave, "hop");
  assert.equal(target.clickToId, undefined, "one window");
  assert.ok(target.holdLift > 16, "he stands on the pane, not the floor");
  assert.ok(P.DUR.bow < P.DUR.bowStand, "the bow is brief; the stand is the dress code");
  assert.ok(P.DUR.bow !== P.DUR.scent, "not Rue's sniff");
  assert.ok(P.DUR.bowOn !== P.DUR.perchOn, "his own hop onto the rock");
  assert.ok(P.DUR.bowOn !== P.DUR.ledgeOn, "not Miso's ledge hop");
  assert.ok(P.DUR.bowStand !== P.DUR.watchHold, "not Pip's look-up");
  const bow = P.bowPoint(WIN, P.SPRITE, WORK);
  const scent = P.scentPoint(WIN, "left", P.SPRITE, WORK);
  const perch = P.perchPoint(WIN, "left", P.SPRITE, WORK);
  const cling = P.sideHold(WIN, "left", P.SPRITE, WORK);
  const ledge = P.ledgePoint(WIN, P.SPRITE, WORK);
  const watch = P.watchPoint(WIN, P.SPRITE, WORK);
  const thump = P.thumpPoint(WIN, P.SPRITE, WORK, "left");
  const stash = P.stashPoint(WIN, "left", P.SPRITE, WORK);
  const wheek = P.wheekPoint(WIN, P.SPRITE, WORK);
  const hold = P.holdPoint(WIN, "jamb", "left", P.SPRITE, WORK);
  const earth = P.earthPoint(WIN, P.SPRITE, WORK);
  const bask = P.baskPoint(WIN, P.SPRITE, WORK);
  const circle = P.circlePoint(WIN, 0, P.SPRITE, WORK, 1);
  const field = P.fieldPoint(WIN, P.SPRITE, WORK);
  const ridge = P.ridgePoint(WIN, 0.5, P.SPRITE, WORK);
  const sill = P.sillPoint(WIN, 0.12, P.SPRITE, WORK);
  assert.equal(target.holdX, bow.x);
  assert.equal(target.holdLift, bow.lift);
  assert.ok(bow.lift > 16, "the rock is on the pane");
  assert.ok(bow.x > WIN.x && bow.x + P.SPRITE < WIN.x + WIN.width, "inside the glass");
  assert.ok(Math.abs(bow.lift - scent.lift) > 16, "not Rue's floor jamb");
  assert.ok(Math.abs(bow.x - perch.x) > 20 || Math.abs(bow.lift - perch.lift) > 20, "not Echo's shade perch");
  assert.ok(Math.abs(bow.x - cling.x) > 20 || Math.abs(bow.lift - cling.lift) > 20, "not Rui's mid-side cling");
  assert.ok(Math.abs(bow.lift - ledge.lift) > 40, "not Miso's top ledge");
  assert.ok(bow.lift !== 0 && Math.abs(bow.x - watch.x) > 20, "not Pip's floor watch");
  assert.ok(bow.lift !== 0 && Math.abs(bow.x - thump.x) > 20, "not Thimble's stamp");
  assert.ok(bow.lift !== 0 && Math.abs(bow.x - wheek.x) > 20, "not Whee's floor loaf");
  assert.ok(Math.abs(bow.x - stash.x) > 20 || Math.abs(bow.lift - stash.lift) > 20, "not Clip's drawer");
  assert.ok(Math.abs(bow.x - hold.x) > 16 || Math.abs(bow.lift - hold.lift) > 20, "not Fuse's jamb clip");
  assert.ok(Math.abs(bow.lift - earth.lift) > 20, "not Ground's lug");
  assert.ok(Math.abs(bow.lift - bask.lift) > 20, "not Ink's rail");
  assert.ok(Math.abs(bow.x - circle.x) > 20 || Math.abs(bow.lift - circle.lift) > 20, "not Coin's bowl");
  assert.ok(Math.abs(bow.x - field.x) > 16 || Math.abs(bow.lift - field.lift) > 16, "not Flux's glass sit");
  assert.ok(Math.abs(bow.lift - ridge.lift) > 40, "not Arc's title-bar ridge");
  assert.ok(Math.abs(bow.lift - sill.lift) > 40, "not a generic top sill");
  const on0 = P.bowOnPath(0, { x: 40, lift: 0 }, { x: bow.x, lift: bow.lift });
  const on1 = P.bowOnPath(1, { x: 40, lift: 0 }, { x: bow.x, lift: bow.lift });
  const onMid = P.bowOnPath(0.5, { x: 40, lift: 0 }, { x: bow.x, lift: bow.lift });
  const perchMid = P.perchOnPath(0.5, { x: 40, lift: 0 }, { x: bow.x, lift: bow.lift });
  assert.equal(on0.x, 40);
  assert.equal(on1.x, bow.x);
  assert.equal(on1.lift, bow.lift);
  assert.ok(onMid.lift > bow.lift * 0.35, "the hop has an arc");
  assert.ok(Math.abs(onMid.rot) !== Math.abs(perchMid.rot) || Math.abs(onMid.lift - perchMid.lift) > 0.5, "a dignified hop, not Echo's shade hop");
  const dip0 = P.bowDipPath(0);
  const dipMid = P.bowDipPath(0.45);
  const dip1 = P.bowDipPath(1);
  assert.equal(dip0.lift, 0);
  assert.equal(dip0.rot, 0);
  assert.ok(dipMid.rot > 8, "the bow dips");
  assert.ok(dipMid.lift < 0, "the bib lowers");
  assert.equal(dip1.lift, 0);
  assert.equal(dip1.rot, 0);
  const off0 = P.bowOffPath(0, { x: bow.x, lift: bow.lift }, { x: bow.x + 88, lift: 0 });
  const off1 = P.bowOffPath(1, { x: bow.x, lift: bow.lift }, { x: bow.x + 88, lift: 0 });
  assert.equal(off0.x, bow.x);
  assert.equal(off1.x, bow.x + 88);
  assert.equal(off1.lift, 0);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  let standMs = 0;
  let bowMs = 0;
  let bowXMin = Infinity;
  let bowXMax = -Infinity;
  let dipRot = 0;
  let windowIds = new Set();
  for (let i = 0; i < 800 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    windowIds.add(play.target.id);
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
    assert.notEqual(play.phase, "ledge-sit");
    assert.notEqual(play.phase, "watch-hold");
    assert.notEqual(play.phase, "thump");
    assert.notEqual(play.phase, "stash-cheek");
    assert.notEqual(play.phase, "wheek");
    assert.notEqual(play.phase, "bask");
    assert.notEqual(play.phase, "bask-withdraw");
    assert.notEqual(play.phase, "circle");
    assert.notEqual(play.phase, "perch-talk");
    assert.notEqual(play.phase, "perch-on");
    assert.notEqual(play.phase, "scent");
    assert.notEqual(play.phase, "sill-hop");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "bow-stand") {
      standMs += 0.05;
      assert.equal(play.anim, "sit", "full dress, ankles together");
      assert.equal(play.rot, 0);
      assert.equal(play.x, target.holdX);
      assert.equal(play.lift, target.holdLift);
    }
    if (play.phase === "bow") {
      bowMs += 0.05;
      bowXMin = Math.min(bowXMin, play.x);
      bowXMax = Math.max(bowXMax, play.x);
      dipRot = Math.max(dipRot, Math.abs(play.rot));
      assert.equal(play.anim, "play", "the bow is the ritual");
      assert.ok(play.lift <= target.holdLift + 0.1, "he dips, he does not hop");
    }
    if (play.phase === "approach") {
      assert.equal(play.anim, "walk");
      assert.equal(play.lift, 0);
    }
  }
  assert.ok(seen.has("bow-on"));
  assert.ok(seen.has("bow-stand"));
  assert.ok(seen.has("bow"));
  assert.ok(seen.has("bow-off"));
  assert.ok(!seen.has("scent"), "not Rue");
  assert.ok(!seen.has("perch-talk"), "not Echo");
  assert.ok(!seen.has("watch-hold"), "not Pip");
  assert.ok(!seen.has("ledge-sit"), "not Miso");
  assert.ok(!seen.has("circle"), "not Coin");
  assert.ok(!seen.has("bask"), "not Ink");
  assert.ok(!seen.has("sill-walk"), "not a generic sill");
  assert.equal(windowIds.size, 1, "one window");
  assert.ok(bowXMax - bowXMin < 2, "one rock — not a walk across");
  assert.ok(dipRot > 6, "the bow is visible");
  assert.ok(standMs >= 0.7 && standMs <= 1.15, `the stand holds (${standMs})`);
  assert.ok(bowMs >= 0.45 && bowMs <= 0.75, `the bow is brief (${bowMs})`);
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});

test("a moved window refits Peck's pane; sleep, card, and hide abort; Peck never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "penguin", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 200 && play.phase !== "bow-stand"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "bow-stand");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "bow-stand");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "bow-off");
  assert.equal(play.abort, true);
});

test("Quill hooks a window jamb with the bill, climbs, hangs sideways, quotes from the chest, then drops — not bow, perch, scent, cling, ledge, or sill", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  const target = P.pickTarget([WIN, WIN_B], 80, "parrot", WORK, P.SPRITE, { side: "left" });
  assert.ok(target);
  assert.equal(target.kind, "hook");
  assert.equal(target.side, "left");
  assert.equal(target.leave, "drop");
  assert.equal(target.clickToId, undefined, "one window");
  assert.ok(target.holdLift > 16, "she hangs on the frame, not the floor");
  assert.ok(P.DUR.hookClimb > P.DUR.hookOn, "the climb is the travel; the hook is the grab");
  assert.ok(P.DUR.hook > P.DUR.perchTalk, "the quote is from the chest, longer than Echo's kinder repeat");
  assert.ok(P.DUR.hookOn !== P.DUR.perchOn, "her own reach onto the jamb");
  assert.ok(P.DUR.hook !== P.DUR.bow, "not Peck's dip");
  assert.ok(P.DUR.hookOn !== P.DUR.ledgeOn, "not Miso's ledge hop");
  const hang = P.hookPoint(WIN, "left", 1, P.SPRITE, WORK);
  const start = P.hookPoint(WIN, "left", 0, P.SPRITE, WORK);
  const bow = P.bowPoint(WIN, P.SPRITE, WORK);
  const scent = P.scentPoint(WIN, "left", P.SPRITE, WORK);
  const perch = P.perchPoint(WIN, "left", P.SPRITE, WORK);
  const cling = P.sideHold(WIN, "left", P.SPRITE, WORK);
  const ledge = P.ledgePoint(WIN, P.SPRITE, WORK);
  const watch = P.watchPoint(WIN, P.SPRITE, WORK);
  const thump = P.thumpPoint(WIN, P.SPRITE, WORK, "left");
  const stash = P.stashPoint(WIN, "left", P.SPRITE, WORK);
  const wheek = P.wheekPoint(WIN, P.SPRITE, WORK);
  const hold = P.holdPoint(WIN, "jamb", "left", P.SPRITE, WORK);
  const earth = P.earthPoint(WIN, P.SPRITE, WORK);
  const bask = P.baskPoint(WIN, P.SPRITE, WORK);
  const circle = P.circlePoint(WIN, 0, P.SPRITE, WORK, 1);
  const field = P.fieldPoint(WIN, P.SPRITE, WORK);
  const ridge = P.ridgePoint(WIN, 0.5, P.SPRITE, WORK);
  const sill = P.sillPoint(WIN, 0.12, P.SPRITE, WORK);
  assert.equal(target.holdX, hang.x);
  assert.equal(target.holdLift, hang.lift);
  assert.equal(target.hookStartX, start.x);
  assert.equal(target.hookStartLift, start.lift);
  assert.ok(hang.lift > start.lift + 40, "the climb goes up the jamb");
  assert.ok(Math.abs(hang.x - perch.x) > 20 || Math.abs(hang.lift - perch.lift) > 20, "not Echo's shade perch");
  assert.ok(Math.abs(hang.x - cling.x) > 20 || Math.abs(hang.lift - cling.lift) > 20, "not Rui's mid-side cling");
  assert.ok(Math.abs(hang.lift - ledge.lift) > 40, "not Miso's top ledge");
  assert.ok(hang.lift !== 0 && Math.abs(hang.x - watch.x) > 20, "not Pip's floor watch");
  assert.ok(hang.lift !== 0 && Math.abs(hang.x - scent.x) > 16, "not Rue's floor jamb");
  assert.ok(hang.lift !== 0 && Math.abs(hang.x - thump.x) > 20, "not Thimble's stamp");
  assert.ok(hang.lift !== 0 && Math.abs(hang.x - wheek.x) > 20, "not Whee's floor loaf");
  assert.ok(Math.abs(hang.x - stash.x) > 20 || Math.abs(hang.lift - stash.lift) > 20, "not Clip's drawer");
  assert.ok(Math.abs(hang.x - hold.x) > 16 || Math.abs(hang.lift - hold.lift) > 20, "not Fuse's jamb clip");
  assert.ok(Math.abs(hang.lift - earth.lift) > 20, "not Ground's lug");
  assert.ok(Math.abs(hang.lift - bask.lift) > 20, "not Ink's rail");
  assert.ok(Math.abs(hang.x - circle.x) > 20 || Math.abs(hang.lift - circle.lift) > 20, "not Coin's bowl");
  assert.ok(Math.abs(hang.x - field.x) > 16 || Math.abs(hang.lift - field.lift) > 16, "not Flux's glass sit");
  assert.ok(Math.abs(hang.lift - ridge.lift) > 40, "not Arc's title-bar ridge");
  assert.ok(Math.abs(hang.lift - sill.lift) > 40, "not a generic top sill");
  assert.ok(Math.abs(hang.x - bow.x) > 20 || Math.abs(hang.lift - bow.lift) > 20, "not Peck's landing rock");
  const on0 = P.hookOnPath(0, { x: 40, lift: 0 }, { x: start.x, lift: start.lift }, "left");
  const on1 = P.hookOnPath(1, { x: 40, lift: 0 }, { x: start.x, lift: start.lift }, "left");
  const onMid = P.hookOnPath(0.5, { x: 40, lift: 0 }, { x: start.x, lift: start.lift }, "left");
  const perchMid = P.perchOnPath(0.5, { x: 40, lift: 0 }, { x: start.x, lift: start.lift });
  assert.equal(on0.x, 40);
  assert.equal(on1.x, start.x);
  assert.equal(on1.lift, start.lift);
  assert.ok(onMid.lift > start.lift * 0.35, "the reach has an arc");
  assert.ok(Math.abs(onMid.rot) !== Math.abs(perchMid.rot) || Math.abs(onMid.lift - perchMid.lift) > 0.5, "a bill-hook, not Echo's shade hop");
  const climb0 = P.hookClimbPath(0, start, hang, "left");
  const climb1 = P.hookClimbPath(1, start, hang, "left");
  const climbMid = P.hookClimbPath(0.5, start, hang, "left");
  assert.equal(climb0.lift, start.lift);
  assert.equal(climb1.lift, hang.lift);
  assert.ok(climbMid.lift > start.lift && climbMid.lift < hang.lift + 12, "the beak walks the jamb");
  assert.ok(Math.abs(P.hookHangRot("left")) > 50, "the hang is sideways");
  const quote0 = P.hookQuotePath(0, "left");
  const quoteMid = P.hookQuotePath(0.35, "left");
  const quote1 = P.hookQuotePath(1, "left");
  assert.equal(quote0.rot, P.hookHangRot("left"));
  assert.ok(Math.abs(quoteMid.rot) > 50, "she hangs sideways while she quotes");
  assert.ok(quoteMid.lift > 0, "the chest works");
  assert.equal(quote1.rot, P.hookHangRot("left"));
  const off0 = P.hookOffPath(0, { x: hang.x, lift: hang.lift }, { x: hang.x - 88, lift: 0 }, "left");
  const off1 = P.hookOffPath(1, { x: hang.x, lift: hang.lift }, { x: hang.x - 88, lift: 0 }, "left");
  assert.equal(off0.x, hang.x);
  assert.equal(off1.x, hang.x - 88);
  assert.equal(off1.lift, 0);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  let climbLiftMin = Infinity;
  let climbLiftMax = -Infinity;
  let quoteXMin = Infinity;
  let quoteXMax = -Infinity;
  let hangRot = 0;
  let windowIds = new Set();
  for (let i = 0; i < 800 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    windowIds.add(play.target.id);
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
    assert.notEqual(play.phase, "ledge-sit");
    assert.notEqual(play.phase, "watch-hold");
    assert.notEqual(play.phase, "thump");
    assert.notEqual(play.phase, "stash-cheek");
    assert.notEqual(play.phase, "wheek");
    assert.notEqual(play.phase, "bask");
    assert.notEqual(play.phase, "circle");
    assert.notEqual(play.phase, "perch-talk");
    assert.notEqual(play.phase, "perch-on");
    assert.notEqual(play.phase, "scent");
    assert.notEqual(play.phase, "bow");
    assert.notEqual(play.phase, "bow-stand");
    assert.notEqual(play.phase, "sill-hop");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "hook-climb") {
      climbLiftMin = Math.min(climbLiftMin, play.lift);
      climbLiftMax = Math.max(climbLiftMax, play.lift);
      assert.equal(play.anim, "play", "the bill walks the jamb");
    }
    if (play.phase === "hook") {
      quoteXMin = Math.min(quoteXMin, play.x);
      quoteXMax = Math.max(quoteXMax, play.x);
      hangRot = Math.max(hangRot, Math.abs(play.rot));
      assert.equal(play.anim, "talk", "the quote is from the chest");
      assert.ok(play.lift > 16);
    }
    if (play.phase === "approach") {
      assert.equal(play.anim, "walk");
      assert.equal(play.lift, 0);
    }
  }
  assert.ok(seen.has("hook-on"));
  assert.ok(seen.has("hook-climb"));
  assert.ok(seen.has("hook"));
  assert.ok(seen.has("hook-off"));
  assert.ok(!seen.has("bow"), "not Peck");
  assert.ok(!seen.has("perch-talk"), "not Echo");
  assert.ok(!seen.has("scent"), "not Rue");
  assert.ok(!seen.has("watch-hold"), "not Pip");
  assert.ok(!seen.has("ledge-sit"), "not Miso");
  assert.ok(!seen.has("circle"), "not Coin");
  assert.ok(!seen.has("bask"), "not Ink");
  assert.ok(!seen.has("sill-walk"), "not a generic sill");
  assert.equal(windowIds.size, 1, "one window");
  assert.ok(climbLiftMax - climbLiftMin > 40, "the climb travels the jamb");
  assert.ok(quoteXMax - quoteXMin < 2, "one hang — not a walk across");
  assert.ok(hangRot > 50, "the hang is sideways");
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});

test("a moved window refits Quill's jamb; sleep, card, and hide abort; Quill never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "parrot", WORK, P.SPRITE, { side: "left" });
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 200 && play.phase !== "hook"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "hook");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "hook");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "hook-off");
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
  assert.match(petSrc, /watch-on|watch-off|playFor/);
  assert.match(petSrc, /thump-on|thump-off|playFor/);
  assert.match(petSrc, /stash-on|stash-off|playFor/);
  assert.match(petSrc, /wheek-on|wheek-off|playFor/);
  assert.match(petSrc, /bask-on|bask-off|playFor/);
  assert.match(petSrc, /circle-on|circle-off|playFor/);
  assert.match(petSrc, /perch-on|perch-off|playFor/);
  assert.match(petSrc, /scent-on|scent-off|playFor/);
  assert.match(petSrc, /bow-on|bow-off|playFor/);
  assert.match(petSrc, /hook-on|hook-off|playFor/);
  assert.match(htmlSrc, /window-play\.js/);
  assert.doesNotMatch(petSrc, /sprites\/red_panda\/.*write|createCanvas/);
  assert.doesNotMatch(petSrc, /sprites\/volt_dragon\/.*write|createCanvas/);
  assert.doesNotMatch(petSrc, /sprites\/trace_dragon\/.*write|createCanvas/);
});
