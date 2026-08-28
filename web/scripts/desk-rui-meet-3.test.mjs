import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const G = await import(new URL("../src/lib/pets/call-guests.ts", import.meta.url));
const Overlay = require(join(root, "../desktop/renderer/call-guests.js"));
const OverlayWP = require(join(root, "../desktop/renderer/window-play.js"));
const roster = require(join(root, "../desktop/renderer/roster.json"));
const callSrc = readFileSync(join(root, "src/lib/pets/call-guests.ts"), "utf8");
const calledSrc = readFileSync(join(root, "src/components/desk/called-guests.tsx"), "utf8");
const petSrc = readFileSync(join(root, "../desktop/renderer/pet.js"), "utf8");

const WIN = { id: "hw", x: 360, y: 80, width: 640, height: 420 };
const WORK = { width: 1400, height: 800, floorLift: 0 };

function stepUntil(mod, guest, flags, want, n) {
  let g = guest;
  for (let i = 0; i < n && g.phase !== want; i++) g = mod.stepCalled(g, 0.05, 800, flags);
  return g;
}

test("/demo Thimble notices Rui on the floor", () => {
  assert.equal(roster.length, 220);
  assert.equal(G.MEET_RABBIT_KEY, Overlay.MEET_RABBIT_KEY);
  assert.equal(G.THIMBLE_RUI_LINE, Overlay.THIMBLE_RUI_LINE);
  assert.deepEqual(G.matchCall("Thimble", roster), ["rabbit"]);
  const flags = { hostKey: "red_panda", hostX: 200, hostFacing: 1, hostLift: 0 };
  let thimble = G.beginCalled("rabbit", 800, 0, 1);
  thimble = G.stepCalled(thimble, 0.05, 800, flags);
  assert.equal(thimble.phase, "approach-meet");
  thimble = G.stepCalled(thimble, 0.08, 800, flags);
  assert.ok((thimble.lift || 0) > 0);
  thimble = stepUntil(G, thimble, flags, "meet", 40);
  assert.equal(thimble.phase, "meet");
  assert.equal(thimble.lift || 0, 0);
  assert.equal(G.tellLine(thimble), Overlay.THIMBLE_RUI_LINE);
  const overlayThimble = stepUntil(Overlay, Overlay.beginCalled("rabbit", 800, 0, 1), flags, "meet", 40);
  assert.equal(overlayThimble.phase, "meet");
});

test("/demo Wedge hops to Rui, not a robin perch or Soot hop", () => {
  assert.equal(G.MEET_RAVEN_KEY, "raven");
  assert.deepEqual(G.matchCall("Wedge", roster), ["raven"]);
  const flags = { hostKey: "red_panda", hostX: 200, hostFacing: 1, hostLift: 0, hostSleeping: true };
  assert.equal(G.shouldPerchCalled("raven", flags), false);
  let wedge = G.beginCalled("raven", 800, 0, 1);
  wedge = G.stepCalled(wedge, 0.05, 800, flags);
  assert.equal(wedge.phase, "approach-meet");
  wedge = G.stepCalled(wedge, 0.08, 800, flags);
  assert.ok((wedge.lift || 0) > 0);
  let soot = G.beginCalled("crow", 800, 0, 1);
  soot = G.stepCalled(soot, 0.05, 800, flags);
  soot = G.stepCalled(soot, 0.08, 800, flags);
  assert.notEqual(Math.round(wedge.lift || 0), Math.round(soot.lift || 0));
  wedge = stepUntil(G, wedge, flags, "meet", 40);
  assert.equal(wedge.phase, "meet");
  assert.notEqual(wedge.phase, "perch");
  assert.equal(G.tellLine(wedge), G.WEDGE_RUI_LINE);
  assert.equal(G.WEDGE_RUI_LINE, Overlay.WEDGE_RUI_LINE);
  assert.notEqual(G.WEDGE_RUI_LINE, G.SOOT_RUI_LINE);
});

test("/demo Thimble notices Pip already on the desk", () => {
  const flags = {
    hostKey: "red_panda",
    hostX: 80,
    hostFacing: 1,
    hostLift: 0,
    peers: [{ key: "dog", x: 400, lift: 0, phase: "stay" }],
  };
  let thimble = G.beginCalled("rabbit", 800, 0, 1);
  thimble = stepUntil(G, thimble, flags, "meet", 40);
  assert.equal(thimble.meetKind, "peer");
  assert.equal(G.tellLine(thimble), G.THIMBLE_PIP_LINE);
  assert.equal(G.THIMBLE_PIP_LINE, Overlay.THIMBLE_PIP_LINE);
});

test("/demo Wedge sits a transom bound, not a second croak playFor", () => {
  assert.equal(OverlayWP.playFor("raven"), "croak");
  const transom = G.windowTransomBound(WIN, WORK);
  assert.equal(transom.kind, "transom");
  assert.deepEqual(G.windowTransomBound(WIN, WORK), Overlay.windowTransomBound(WIN, WORK));
  const flags = { hostKey: "red_panda", hostX: 200, hostFacing: 1, hostLift: 0, transomBound: transom };
  let wedge = G.beginCalled("raven", 800, 0, 1);
  wedge = stepUntil(G, wedge, flags, "meet", 40);
  wedge = G.stepCalled(wedge, 2, 800, flags);
  wedge = stepUntil(G, wedge, flags, "bound", 40);
  assert.equal(wedge.phase, "bound");
  assert.equal(G.tellLine(wedge), G.WEDGE_TRANSOM_LINE);
  assert.match(calledSrc, /transomBound: firstTransomBound/);
  assert.match(petSrc, /firstTransomBound/);
  assert.match(callSrc, /export function windowTransomBound/);
});

test("/demo hide, robin, and first two meets from 470/471/472 still hold", () => {
  const flags = { hostKey: "red_panda", hostX: 200, hostFacing: 1, hostLift: 0 };
  let dee = stepUntil(G, G.beginCalled("chickadee", 800, 0, 1), flags, "meet", 40);
  assert.equal(G.tellLine(dee), G.DEE_RUI_LINE);
  let miso = stepUntil(G, G.beginCalled("cat", 800, 0, 1), flags, "meet", 40);
  assert.equal(miso.lift || 0, 0);
  let pip = stepUntil(G, G.beginCalled("dog", 800, 0, 1), flags, "meet", 40);
  assert.equal(pip.lift || 0, 0);
  const perchFlags = { hostKey: "red_panda", hostSleeping: true, hostX: 200, hostFacing: 1, hostLift: 0 };
  let robin = stepUntil(G, G.beginCalled("robin", 800, 0, 1), perchFlags, "perch", 40);
  assert.equal(robin.phase, "perch");
  let soot = stepUntil(G, G.beginCalled("crow", 800, 0, 1), perchFlags, "meet", 40);
  assert.equal(soot.phase, "meet");
  assert.equal(roster.length, 220);
});
