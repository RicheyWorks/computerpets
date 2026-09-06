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

test("/demo Pip notices Rui on the floor", () => {
  assert.equal(roster.length, 220);
  assert.equal(G.MEET_DOG_KEY, Overlay.MEET_DOG_KEY);
  assert.equal(G.PIP_RUI_LINE, Overlay.PIP_RUI_LINE);
  assert.deepEqual(G.matchCall("Pip", roster), ["dog"]);
  const flags = { hostKey: "red_panda", hostX: 200, hostFacing: 1, hostLift: 0 };
  let pip = G.beginCalled("dog", 800, 0, 1);
  pip = stepUntil(G, pip, flags, "meet", 40);
  assert.equal(pip.phase, "meet");
  assert.equal(pip.lift || 0, 0);
  assert.equal(G.tellLine(pip), Overlay.PIP_RUI_LINE);
  const overlayPip = stepUntil(Overlay, Overlay.beginCalled("dog", 800, 0, 1), flags, "meet", 40);
  assert.equal(overlayPip.phase, "meet");
});

test("/demo Soot hops to Rui, not a robin perch", () => {
  assert.equal(G.MEET_CROW_KEY, "crow");
  assert.deepEqual(G.matchCall("Soot", roster), ["crow"]);
  const flags = { hostKey: "red_panda", hostX: 200, hostFacing: 1, hostLift: 0, hostSleeping: true };
  assert.equal(G.shouldPerchCalled("crow", flags), false);
  let soot = G.beginCalled("crow", 800, 0, 1);
  soot = G.stepCalled(soot, 0.05, 800, flags);
  assert.equal(soot.phase, "approach-meet");
  soot = G.stepCalled(soot, 0.08, 800, flags);
  assert.ok((soot.lift || 0) > 0);
  soot = stepUntil(G, soot, flags, "meet", 40);
  assert.equal(soot.phase, "meet");
  assert.notEqual(soot.phase, "perch");
  assert.equal(G.tellLine(soot), G.SOOT_RUI_LINE);
  assert.equal(G.SOOT_RUI_LINE, Overlay.SOOT_RUI_LINE);
});

test("/demo Miso notices Pip already on the desk", () => {
  const flags = {
    hostKey: "red_panda",
    hostX: 80,
    hostFacing: 1,
    hostLift: 0,
    peers: [{ key: "dog", x: 400, lift: 0, phase: "stay" }],
  };
  let miso = G.beginCalled("cat", 800, 0, 1);
  miso = stepUntil(G, miso, flags, "meet", 40);
  assert.equal(miso.meetKind, "peer");
  assert.equal(G.tellLine(miso), G.CAT_PIP_LINE);
  assert.equal(G.CAT_PIP_LINE, Overlay.CAT_PIP_LINE);
});

test("/demo Soot sits a drip-cap bound, not a second caw playFor", () => {
  assert.equal(OverlayWP.playFor("crow"), "caw");
  const cap = G.windowCapBound(WIN, WORK);
  assert.equal(cap.kind, "drip-cap");
  assert.deepEqual(G.windowCapBound(WIN, WORK), Overlay.windowCapBound(WIN, WORK));
  const flags = { hostKey: "red_panda", hostX: 200, hostFacing: 1, hostLift: 0, capBound: cap };
  let soot = G.beginCalled("crow", 800, 0, 1);
  soot = stepUntil(G, soot, flags, "meet", 40);
  soot = G.stepCalled(soot, 2, 800, flags);
  soot = stepUntil(G, soot, flags, "bound", 40);
  assert.equal(soot.phase, "bound");
  assert.equal(G.tellLine(soot), G.SOOT_CAP_LINE);
  assert.match(calledSrc, /capBound: firstCapBound/);
  assert.match(petSrc, /firstCapBound/);
  assert.match(callSrc, /export function windowCapBound/);
});

test("/demo hide, robin, and first meets from 470/471 still hold", () => {
  const flags = { hostKey: "red_panda", hostX: 200, hostFacing: 1, hostLift: 0 };
  let dee = stepUntil(G, G.beginCalled("chickadee", 800, 0, 1), flags, "meet", 40);
  assert.equal(G.tellLine(dee), G.DEE_RUI_LINE);
  let miso = stepUntil(G, G.beginCalled("cat", 800, 0, 1), flags, "meet", 40);
  assert.equal(miso.lift || 0, 0);
  const perchFlags = { hostKey: "red_panda", hostSleeping: true, hostX: 200, hostFacing: 1, hostLift: 0 };
  let robin = stepUntil(G, G.beginCalled("robin", 800, 0, 1), perchFlags, "perch", 40);
  assert.equal(robin.phase, "perch");
  assert.equal(roster.length, 220);
});
