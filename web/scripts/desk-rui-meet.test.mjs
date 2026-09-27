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
const OverlayDesk = require(join(root, "../desktop/renderer/desk.js"));
const OverlayGait = require(join(root, "../desktop/renderer/gait.js"));
const roster = require(join(root, "../desktop/renderer/roster.json"));
const callSrc = readFileSync(join(root, "src/lib/pets/call-guests.ts"), "utf8");
const livingSrc = readFileSync(join(root, "src/components/desk/living-pet.tsx"), "utf8");
const calledSrc = readFileSync(join(root, "src/components/desk/called-guests.tsx"), "utf8");
const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const cssSrc = readFileSync(join(root, "../desktop/renderer/styles.css"), "utf8");
const petSrc = readFileSync(join(root, "../desktop/renderer/pet.js"), "utf8");

const WIN = { id: "hw", x: 360, y: 80, width: 640, height: 420 };
const WORK = { width: 1400, height: 800, floorLift: 0 };

function stepUntil(mod, guest, flags, want, n) {
  let g = guest;
  for (let i = 0; i < n && g.phase !== want; i++) g = mod.stepCalled(g, 0.05, 800, flags);
  return g;
}

test("/demo Dee notices Rui, hop-steps, and does not vanish as an empty box", () => {
  assert.equal(roster.length, 221);
  assert.equal(G.MEET_DEE_KEY, Overlay.MEET_DEE_KEY);
  assert.equal(G.DEE_RUI_LINE, Overlay.DEE_RUI_LINE);
  assert.deepEqual(G.matchCall("Dee", roster), ["chickadee"]);
  const sit = ["sit/1.png", "sit/2.png"];
  const walk = ["walk/1.png"];
  const flags = { hostKey: "red_panda", hostX: 200, hostFacing: 1, hostLift: 0 };
  let dee = G.beginCalled("chickadee", 800, 0, 1);
  dee = G.stepCalled(dee, 0.05, 800, flags);
  assert.equal(dee.phase, "approach-meet");
  dee = G.stepCalled(dee, 0.08, 800, flags);
  assert.ok((dee.lift || 0) > 0);
  dee = stepUntil(G, dee, flags, "meet", 40);
  assert.equal(dee.phase, "meet");
  assert.equal(G.poseSrc(dee, { sit, walk }), sit[0]);
  assert.notEqual(G.poseSrc(dee, { sit, walk }), "");
  const overlayDee = stepUntil(Overlay, Overlay.beginCalled("chickadee", 800, 0, 1), flags, "meet", 40);
  assert.equal(overlayDee.phase, "meet");
});

test("/demo Miso notices Rui on the floor", () => {
  assert.equal(G.MEET_CAT_KEY, "cat");
  assert.deepEqual(G.matchCall("Miso", roster), ["cat"]);
  const flags = { hostKey: "red_panda", hostX: 200, hostFacing: 1, hostLift: 0 };
  let miso = G.beginCalled("cat", 800, 0, 1);
  miso = stepUntil(G, miso, flags, "meet", 40);
  assert.equal(miso.phase, "meet");
  assert.equal(miso.lift || 0, 0);
  assert.equal(G.tellLine(miso), Overlay.CAT_RUI_LINE);
});

test("/demo Dee notices the robin guest", () => {
  const flags = {
    hostKey: "red_panda",
    hostX: 80,
    hostFacing: 1,
    hostLift: 0,
    peers: [{ key: "robin", x: 400, lift: 0, phase: "stay" }],
  };
  let dee = G.beginCalled("chickadee", 800, 0, 1);
  dee = stepUntil(G, dee, flags, "meet", 40);
  assert.equal(dee.meetKind, "peer");
  assert.equal(G.tellLine(dee), G.DEE_ROBIN_LINE);
  assert.equal(G.DEE_ROBIN_LINE, Overlay.DEE_ROBIN_LINE);
});

test("/demo Miso sits a window sill bound as furniture", () => {
  const bound = G.windowSitBound(WIN, WORK);
  assert.equal(bound.kind, "sill");
  assert.deepEqual(G.windowSitBound(WIN, WORK), Overlay.windowSitBound(WIN, WORK));
  const flags = { hostKey: "red_panda", hostX: 200, hostFacing: 1, hostLift: 0, windowBound: bound };
  let miso = G.beginCalled("cat", 800, 0, 1);
  miso = stepUntil(G, miso, flags, "meet", 40);
  miso = G.stepCalled(miso, 2, 800, flags);
  miso = stepUntil(G, miso, flags, "bound", 40);
  assert.equal(miso.phase, "bound");
  assert.equal(G.tellLine(miso), G.CAT_SILL_LINE);
  assert.match(roomSrc, /windows=\{demoWindow \? deskWindows : \[\]\}/);
});

test("/demo hide, click, and robin from 470 still hold", () => {
  const faded = { pointerEvents: "none", visibility: "visible", display: "block", opacity: "0" };
  assert.equal(OverlayDesk.hitAllows({ id: "pet" }, faded), true);
  assert.equal(OverlayGait.hideTuck(80, 800, 176, 16), 16);
  assert.match(livingSrc, /pointerEvents: "auto"/);
  assert.match(cssSrc, /#pet\.hidden[\s\S]{0,80}opacity:\s*0\.22/);
  const sit = ["sit/1.png", "sit/2.png"];
  const perched = { key: "robin", phase: "perch", frame: 3, t: 0, age: 1, x: 200, lift: 36, target: 200, facing: 1, dismissed: false };
  assert.equal(G.poseSrc(perched, { sit, walk: ["walk/1.png"] }), sit[1]);
  const flags = { hostKey: "red_panda", hostSleeping: true, hostX: 200, hostFacing: 1, hostLift: 0 };
  let robin = G.beginCalled("robin", 800, 0, 1);
  robin = stepUntil(G, robin, flags, "perch", 40);
  assert.equal(robin.phase, "perch");
  robin = G.stepCalled(robin, 24, 800, flags);
  assert.equal(robin.phase, "perch");
  assert.match(callSrc, /export function poseFrames/);
  assert.match(calledSrc, /paintCalledFrame/);
  assert.doesNotMatch(calledSrc, /if \(hidden \|\| !list\.length\)/);
  assert.match(petSrc, /shouldTell/);
});
