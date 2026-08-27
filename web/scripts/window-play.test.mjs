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

test("Rui cling-dive is shared; Arc ridge is shared; Volt coil is shared; a cat stays on the sill door", () => {
  assert.equal(P.playFor("red_panda"), Overlay.playFor("red_panda"));
  assert.equal(P.playFor("cyber_dragon"), "ridge");
  assert.equal(P.playFor("cyber_dragon"), Overlay.playFor("cyber_dragon"));
  assert.equal(P.playFor("volt_dragon"), "coil");
  assert.equal(P.playFor("volt_dragon"), Overlay.playFor("volt_dragon"));
  assert.equal(P.playFor("cat"), "sill");
  assert.equal(P.playFor("trace_dragon"), "sill");
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
