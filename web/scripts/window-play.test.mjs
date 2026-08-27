import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const P = await import(join(root, "src/lib/pets/window-play.ts"));
const require = createRequire(import.meta.url);
const Overlay = require(join(root, "../desktop/renderer/window-play.js"));

const livingSrc = readFileSync(join(root, "src/components/desk/living-pet.tsx"), "utf8");
const demoSrc = readFileSync(join(root, "src/components/desk/demo-stage.tsx"), "utf8");

const WORK = { width: 1400, height: 800, floorLift: 0 };
const WIN = { id: "hw", x: 360, y: 80, width: 640, height: 420 };

test("Rui cling-dive is shared; Arc ridge is shared; Volt coil is shared; Trace path is shared; Flux field is shared; Miso sits a ledge; Pip watches from the floor", () => {
  assert.equal(P.playFor("red_panda"), Overlay.playFor("red_panda"));
  assert.equal(P.playFor("cyber_dragon"), "ridge");
  assert.equal(P.playFor("cyber_dragon"), Overlay.playFor("cyber_dragon"));
  assert.equal(P.playFor("volt_dragon"), "coil");
  assert.equal(P.playFor("volt_dragon"), Overlay.playFor("volt_dragon"));
  assert.equal(P.playFor("trace_dragon"), "path");
  assert.equal(P.playFor("trace_dragon"), Overlay.playFor("trace_dragon"));
  assert.equal(P.playFor("flux_dragon"), "field");
  assert.equal(P.playFor("flux_dragon"), Overlay.playFor("flux_dragon"));
  assert.equal(P.playFor("spark_dragon"), "crackle");
  assert.equal(P.playFor("spark_dragon"), Overlay.playFor("spark_dragon"));
  assert.equal(P.playFor("ion_dragon"), "charge");
  assert.equal(P.playFor("ion_dragon"), Overlay.playFor("ion_dragon"));
  assert.equal(P.playFor("gauss_dragon"), "orbit");
  assert.equal(P.playFor("gauss_dragon"), Overlay.playFor("gauss_dragon"));
  assert.equal(P.playFor("relay_dragon"), "click");
  assert.equal(P.playFor("relay_dragon"), Overlay.playFor("relay_dragon"));
  assert.equal(P.playFor("fuse_dragon"), "hold");
  assert.equal(P.playFor("fuse_dragon"), Overlay.playFor("fuse_dragon"));
  assert.equal(P.playFor("ground_dragon"), "earth");
  assert.equal(P.playFor("ground_dragon"), Overlay.playFor("ground_dragon"));
  assert.equal(P.playFor("cat"), "ledge");
  assert.equal(P.playFor("cat"), Overlay.playFor("cat"));
  assert.equal(P.playFor("dog"), "watch");
  assert.equal(P.playFor("dog"), Overlay.playFor("dog"));
  assert.equal(P.playFor("gecko"), "sill");
  assert.equal(P.playFor("rabbit"), "sill");
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  const spin = P.divePath(0.5, { x: 400, lift: 200, side: "right" }, { x: 500, lift: 0 }, "spin");
  const desk = Overlay.divePath(0.5, { x: 400, lift: 200, side: "right" }, { x: 500, lift: 0 }, "spin");
  assert.equal(spin.rot, desk.rot);
  assert.ok(spin.rot > 0);
  const webRidge = P.ridgePoint(WIN, 0.5, 176, WORK);
  const deskRidge = Overlay.ridgePoint(WIN, 0.5, 176, WORK);
  assert.equal(webRidge.lift, deskRidge.lift);
  const webCoil = P.coilPoint(WIN, "left", 176, WORK);
  const deskCoil = Overlay.coilPoint(WIN, "left", 176, WORK);
  assert.equal(webCoil.lift, deskCoil.lift);
  assert.equal(webCoil.x, deskCoil.x);
  const webPath = P.pathPoint(WIN, 0.5, 176, WORK, "left");
  const deskPath = Overlay.pathPoint(WIN, 0.5, 176, WORK, "left");
  assert.equal(webPath.lift, deskPath.lift);
  assert.equal(webPath.x, deskPath.x);
  const webField = P.fieldPoint(WIN, 176, WORK);
  const deskField = Overlay.fieldPoint(WIN, 176, WORK);
  assert.equal(webField.lift, deskField.lift);
  assert.equal(webField.x, deskField.x);
  const webCharge = P.chargePoint(WIN, "tl", 176, WORK);
  const deskCharge = Overlay.chargePoint(WIN, "tl", 176, WORK);
  assert.equal(webCharge.lift, deskCharge.lift);
  assert.equal(webCharge.x, deskCharge.x);
  const webClick = P.clickPoint(WIN, "left", 176, WORK);
  const deskClick = Overlay.clickPoint(WIN, "left", 176, WORK);
  assert.equal(webClick.lift, deskClick.lift);
  assert.equal(webClick.x, deskClick.x);
  const webHold = P.holdPoint(WIN, "jamb", "left", 176, WORK);
  const deskHold = Overlay.holdPoint(WIN, "jamb", "left", 176, WORK);
  assert.equal(webHold.lift, deskHold.lift);
  assert.equal(webHold.x, deskHold.x);
  const webEarth = P.earthPoint(WIN, 176, WORK);
  const deskEarth = Overlay.earthPoint(WIN, 176, WORK);
  assert.equal(webEarth.lift, deskEarth.lift);
  assert.equal(webEarth.x, deskEarth.x);
  const webLedge = P.ledgePoint(WIN, 176, WORK);
  const deskLedge = Overlay.ledgePoint(WIN, 176, WORK);
  assert.equal(webLedge.lift, deskLedge.lift);
  assert.equal(webLedge.x, deskLedge.x);
  const webWatch = P.watchPoint(WIN, 176, WORK);
  const deskWatch = Overlay.watchPoint(WIN, 176, WORK);
  assert.equal(webWatch.lift, deskWatch.lift);
  assert.equal(webWatch.x, deskWatch.x);
  assert.equal(webWatch.lift, 0);
});

test("the demo room walks the same Rui climb against a drawn window", () => {
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /playFor/);
  assert.match(livingSrc, /stepPlay/);
  assert.match(livingSrc, /shouldAbort/);
  assert.match(livingSrc, /asleepRef/);
  const target = P.pickTarget([WIN], 40, "red_panda", WORK, 176, { side: "left", spin: "backflip", diveFrom: "top" });
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  for (let i = 0; i < 400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, 176, { cmd: "idle" });
  }
  assert.ok(seen.has("cling"));
  assert.ok(seen.has("dive"));
  assert.equal(play.phase, "done");
});

test("the demo window plate walks Arc's ridge the same way", () => {
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /ridge-leap|playFor/);
  const target = P.pickTarget([WIN], 40, "cyber_dragon", WORK, 176, { leave: "hop" });
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  for (let i = 0; i < 400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, 176, { cmd: "idle" });
    assert.notEqual(play.phase, "cling");
    assert.notEqual(play.phase, "dive");
  }
  assert.ok(seen.has("ridge-leap"));
  assert.ok(seen.has("ridge-hold"));
  assert.ok(seen.has("ridge-off"));
  assert.equal(play.phase, "done");
});

test("the demo window plate walks Volt's coil the same way", () => {
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /coil-on|playFor/);
  const target = P.pickTarget([WIN], 40, "volt_dragon", WORK, 176, { side: "right" });
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  for (let i = 0; i < 400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, 176, { cmd: "idle" });
    assert.notEqual(play.phase, "cling");
    assert.notEqual(play.phase, "dive");
    assert.notEqual(play.phase, "ridge-hold");
    assert.notEqual(play.phase, "sill-walk");
  }
  assert.ok(seen.has("coil-on"));
  assert.ok(seen.has("coil-hold"));
  assert.ok(seen.has("coil-off"));
  assert.equal(play.phase, "done");
});

test("the demo window plate walks Trace's path the same way", () => {
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /path-on|playFor/);
  const overlayTarget = Overlay.pickTarget([WIN], 40, "trace_dragon", WORK, 176, { side: "left", leave: "hop" });
  const target = P.pickTarget([WIN], 40, "trace_dragon", WORK, 176, { side: "left", leave: "hop" });
  assert.equal(target.kind, overlayTarget.kind);
  assert.equal(target.holdX, overlayTarget.holdX);
  assert.equal(target.holdLift, overlayTarget.holdLift);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  for (let i = 0; i < 500 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, 176, { cmd: "idle" });
    assert.notEqual(play.phase, "cling");
    assert.notEqual(play.phase, "dive");
    assert.notEqual(play.phase, "ridge-hold");
    assert.notEqual(play.phase, "coil-hold");
    assert.notEqual(play.phase, "sill-walk");
  }
  assert.ok(seen.has("path-on"));
  assert.ok(seen.has("path-walk"));
  assert.ok(seen.has("path-sit"));
  assert.ok(seen.has("path-off"));
  assert.equal(play.phase, "done");
});

test("the demo window plate walks Flux's field the same way", () => {
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /field-on|playFor/);
  const overlayTarget = Overlay.pickTarget([WIN], 40, "flux_dragon", WORK, 176, { leave: "drift" });
  const target = P.pickTarget([WIN], 40, "flux_dragon", WORK, 176, { leave: "drift" });
  assert.equal(target.kind, overlayTarget.kind);
  assert.equal(target.holdX, overlayTarget.holdX);
  assert.equal(target.holdLift, overlayTarget.holdLift);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  for (let i = 0; i < 500 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, 176, { cmd: "idle" });
    assert.notEqual(play.phase, "cling");
    assert.notEqual(play.phase, "dive");
    assert.notEqual(play.phase, "ridge-hold");
    assert.notEqual(play.phase, "coil-hold");
    assert.notEqual(play.phase, "path-walk");
    assert.notEqual(play.phase, "sill-walk");
  }
  assert.ok(seen.has("field-on"));
  assert.ok(seen.has("field-hold"));
  assert.ok(seen.has("field-off"));
  assert.equal(play.phase, "done");
});

test("the demo window plate walks Spark's crackle the same way", () => {
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /crackle-on|playFor/);
  const overlayTarget = Overlay.pickTarget([WIN], 40, "spark_dragon", WORK, 176, { side: "left", leave: "hop", hopFrom: 0 });
  const target = P.pickTarget([WIN], 40, "spark_dragon", WORK, 176, { side: "left", leave: "hop", hopFrom: 0 });
  assert.equal(target.kind, overlayTarget.kind);
  assert.equal(target.holdX, overlayTarget.holdX);
  assert.equal(target.holdLift, overlayTarget.holdLift);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  for (let i = 0; i < 500 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, 176, { cmd: "idle" });
    assert.notEqual(play.phase, "cling");
    assert.notEqual(play.phase, "ridge-hold");
    assert.notEqual(play.phase, "coil-hold");
    assert.notEqual(play.phase, "field-hold");
    assert.notEqual(play.phase, "sill-walk");
  }
  assert.ok(seen.has("crackle-on"));
  assert.ok(seen.has("crackle-hop"));
  assert.ok(seen.has("crackle-off"));
  assert.equal(play.phase, "done");
});

test("the demo window plate walks Ion's charge the same way", () => {
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /charge-on|playFor/);
  const overlayTarget = Overlay.pickTarget([WIN], 40, "ion_dragon", WORK, 176, { side: "left", corner: "tl", leave: "hop" });
  const target = P.pickTarget([WIN], 40, "ion_dragon", WORK, 176, { side: "left", corner: "tl", leave: "hop" });
  assert.equal(target.kind, overlayTarget.kind);
  assert.equal(target.holdX, overlayTarget.holdX);
  assert.equal(target.holdLift, overlayTarget.holdLift);
  assert.equal(target.chargeEndX, overlayTarget.chargeEndX);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  for (let i = 0; i < 500 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, 176, { cmd: "idle" });
    assert.notEqual(play.phase, "cling");
    assert.notEqual(play.phase, "ridge-hold");
    assert.notEqual(play.phase, "coil-hold");
    assert.notEqual(play.phase, "path-walk");
    assert.notEqual(play.phase, "field-hold");
    assert.notEqual(play.phase, "crackle-hop");
    assert.notEqual(play.phase, "sill-walk");
  }
  assert.ok(seen.has("charge-on"));
  assert.ok(seen.has("charge-bolt"));
  assert.ok(seen.has("charge-hold"));
  assert.ok(seen.has("charge-off"));
  assert.equal(play.phase, "done");
});

test("the demo window plate walks Gauss's orbit the same way", () => {
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /orbit-on|playFor/);
  const overlayTarget = Overlay.pickTarget([WIN], 40, "gauss_dragon", WORK, 176, { side: "left", orbitDir: 1, leave: "hop" });
  const target = P.pickTarget([WIN], 40, "gauss_dragon", WORK, 176, { side: "left", orbitDir: 1, leave: "hop" });
  assert.equal(target.kind, overlayTarget.kind);
  assert.equal(target.holdX, overlayTarget.holdX);
  assert.equal(target.holdLift, overlayTarget.holdLift);
  assert.equal(target.orbitEndX, overlayTarget.orbitEndX);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  for (let i = 0; i < 500 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, 176, { cmd: "idle" });
    assert.notEqual(play.phase, "cling");
    assert.notEqual(play.phase, "ridge-hold");
    assert.notEqual(play.phase, "coil-hold");
    assert.notEqual(play.phase, "path-walk");
    assert.notEqual(play.phase, "field-hold");
    assert.notEqual(play.phase, "crackle-hop");
    assert.notEqual(play.phase, "charge-bolt");
    assert.notEqual(play.phase, "sill-walk");
  }
  assert.ok(seen.has("orbit-on"));
  assert.ok(seen.has("orbit-loop"));
  assert.ok(seen.has("orbit-hold"));
  assert.ok(seen.has("orbit-off"));
  assert.equal(play.phase, "done");
});

test("the demo window plates walk Relay's click the same way", () => {
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /click-on|playFor/);
  const WIN_B = { id: "hw2", x: 1040, y: 120, width: 300, height: 360 };
  const overlayTarget = Overlay.pickTarget([WIN, WIN_B], 40, "relay_dragon", WORK, 176, { leave: "hop" });
  const target = P.pickTarget([WIN, WIN_B], 40, "relay_dragon", WORK, 176, { leave: "hop" });
  assert.equal(target.kind, overlayTarget.kind);
  assert.equal(target.holdX, overlayTarget.holdX);
  assert.equal(target.holdLift, overlayTarget.holdLift);
  assert.equal(target.clickEndX, overlayTarget.clickEndX);
  assert.equal(target.clickToId, overlayTarget.clickToId);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  for (let i = 0; i < 500 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, 176, { cmd: "idle" });
    assert.notEqual(play.phase, "cling");
    assert.notEqual(play.phase, "ridge-hold");
    assert.notEqual(play.phase, "coil-hold");
    assert.notEqual(play.phase, "path-walk");
    assert.notEqual(play.phase, "field-hold");
    assert.notEqual(play.phase, "crackle-hop");
    assert.notEqual(play.phase, "charge-bolt");
    assert.notEqual(play.phase, "orbit-loop");
    assert.notEqual(play.phase, "sill-walk");
  }
  assert.ok(seen.has("click-on"));
  assert.ok(seen.has("click-a"));
  assert.ok(seen.has("click-hop"));
  assert.ok(seen.has("click-b"));
  assert.ok(seen.has("click-off"));
  assert.equal(play.phase, "done");
});

test("the demo window plate walks Fuse's hold the same way", () => {
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /hold-on|playFor/);
  const overlayTarget = Overlay.pickTarget([WIN], 40, "fuse_dragon", WORK, 176, { side: "left", clip: "jamb", leave: "hop" });
  const target = P.pickTarget([WIN], 40, "fuse_dragon", WORK, 176, { side: "left", clip: "jamb", leave: "hop" });
  assert.equal(target.kind, overlayTarget.kind);
  assert.equal(target.holdX, overlayTarget.holdX);
  assert.equal(target.holdLift, overlayTarget.holdLift);
  assert.equal(target.clip, overlayTarget.clip);
  assert.equal(target.clickToId, undefined);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  for (let i = 0; i < 600 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, 176, { cmd: "idle" });
    assert.notEqual(play.phase, "cling");
    assert.notEqual(play.phase, "ridge-hold");
    assert.notEqual(play.phase, "coil-hold");
    assert.notEqual(play.phase, "path-walk");
    assert.notEqual(play.phase, "field-hold");
    assert.notEqual(play.phase, "crackle-hop");
    assert.notEqual(play.phase, "charge-bolt");
    assert.notEqual(play.phase, "orbit-loop");
    assert.notEqual(play.phase, "click-hop");
    assert.notEqual(play.phase, "sill-walk");
  }
  assert.ok(seen.has("hold-on"));
  assert.ok(seen.has("hold-sit"));
  assert.ok(seen.has("hold-off"));
  assert.equal(play.phase, "done");
});

test("the demo window plate walks Ground's earth the same way", () => {
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /earth-on|playFor/);
  const overlayTarget = Overlay.pickTarget([WIN], 40, "ground_dragon", WORK, 176, { leave: "step" });
  const target = P.pickTarget([WIN], 40, "ground_dragon", WORK, 176, { leave: "step" });
  assert.equal(target.kind, overlayTarget.kind);
  assert.equal(target.holdX, overlayTarget.holdX);
  assert.equal(target.holdLift, overlayTarget.holdLift);
  assert.equal(target.side, "bottom");
  assert.equal(target.clickToId, undefined);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  for (let i = 0; i < 600 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, 176, { cmd: "idle" });
    assert.notEqual(play.phase, "cling");
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
  }
  assert.ok(seen.has("earth-on"));
  assert.ok(seen.has("earth-sit"));
  assert.ok(seen.has("earth-off"));
  assert.equal(play.phase, "done");
});

test("the demo window plate walks Miso's ledge the same way", () => {
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /ledge-on|playFor/);
  const overlayTarget = Overlay.pickTarget([WIN], 40, "cat", WORK, 176);
  const target = P.pickTarget([WIN], 40, "cat", WORK, 176);
  assert.equal(target.kind, overlayTarget.kind);
  assert.equal(target.kind, "ledge");
  assert.equal(target.holdX, overlayTarget.holdX);
  assert.equal(target.holdLift, overlayTarget.holdLift);
  assert.equal(target.side, "top");
  assert.equal(target.leave, "hop");
  assert.equal(target.clickToId, undefined);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  let sitXMin = Infinity;
  let sitXMax = -Infinity;
  for (let i = 0; i < 700 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, 176, { cmd: "idle" });
    assert.notEqual(play.phase, "cling");
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
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "ledge-sit") {
      sitXMin = Math.min(sitXMin, play.x);
      sitXMax = Math.max(sitXMax, play.x);
    }
  }
  assert.ok(seen.has("ledge-on"));
  assert.ok(seen.has("ledge-sit"));
  assert.ok(seen.has("ledge-off"));
  assert.ok(sitXMax - sitXMin < 2, "one sit — not a walk across");
  assert.equal(play.phase, "done");
});

test("the demo window plate walks Pip's watch the same way", () => {
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /watch-on|playFor/);
  const overlayTarget = Overlay.pickTarget([WIN], 40, "dog", WORK, 176);
  const target = P.pickTarget([WIN], 40, "dog", WORK, 176);
  assert.equal(target.kind, overlayTarget.kind);
  assert.equal(target.kind, "watch");
  assert.equal(target.holdX, overlayTarget.holdX);
  assert.equal(target.holdLift, overlayTarget.holdLift);
  assert.equal(target.holdLift, 0);
  assert.equal(target.side, "feet");
  assert.equal(target.leave, "trot");
  assert.equal(target.clickToId, undefined);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  let sitXMin = Infinity;
  let sitXMax = -Infinity;
  let maxLift = 0;
  for (let i = 0; i < 700 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, 176, { cmd: "idle" });
    maxLift = Math.max(maxLift, play.lift);
    assert.notEqual(play.phase, "cling");
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
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "watch-hold") {
      sitXMin = Math.min(sitXMin, play.x);
      sitXMax = Math.max(sitXMax, play.x);
      assert.equal(play.lift, 0);
    }
  }
  assert.ok(seen.has("watch-on"));
  assert.ok(seen.has("watch-hold"));
  assert.ok(seen.has("watch-off"));
  assert.ok(sitXMax - sitXMin < 2, "one watch — not a walk across");
  assert.equal(maxLift, 0, "never hops onto the frame");
  assert.equal(play.phase, "done");
});
