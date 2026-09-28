import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const OverlayDesk = require(join(root, "../desktop/renderer/desk.js"));
const OverlayGait = require(join(root, "../desktop/renderer/gait.js"));
const OverlayCall = require(join(root, "../desktop/renderer/call-guests.js"));
const gaitSrc = readFileSync(join(root, "src/lib/pets/gait.ts"), "utf8");
const callSrc = readFileSync(join(root, "src/lib/pets/call-guests.ts"), "utf8");
const livingSrc = readFileSync(join(root, "src/components/desk/living-pet.tsx"), "utf8");
const calledSrc = readFileSync(join(root, "src/components/desk/called-guests.tsx"), "utf8");
const cssSrc = readFileSync(join(root, "../desktop/renderer/styles.css"), "utf8");
const petSrc = readFileSync(join(root, "../desktop/renderer/pet.js"), "utf8");

test("/demo and overlay keep hidden Rui hittable and tucked, not stuck", () => {
  const faded = { pointerEvents: "none", visibility: "visible", display: "block", opacity: "0" };
  assert.equal(OverlayDesk.hitAllows({ id: "pet" }, faded), true);
  assert.equal(OverlayGait.hideTuck(80, 800, 176, 16), 16);
  assert.equal(OverlayGait.hideTuck(600, 800, 176, 16), 608);
  assert.match(gaitSrc, /export function hideTuck/);
  assert.match(livingSrc, /hideTuck/);
  assert.match(livingSrc, /pointerEvents: "auto"/);
  assert.match(petSrc, /PetGait\.hideTuck/);
  assert.match(cssSrc, /#pet\.hidden[\s\S]{0,80}pointer-events:\s*auto/);
});

test("/demo robin paint uses one real pose and does not unmount on host hide", () => {
  const sit = ["sit/1.png", "sit/2.png"];
  const walk = ["walk/1.png", "walk/2.png"];
  const perched = { key: "robin", phase: "perch", frame: 3, t: 0, age: 1, x: 200, lift: 36, target: 200, facing: 1, dismissed: false };
  assert.equal(OverlayCall.poseSrc(perched, { sit, walk }), sit[1]);
  assert.match(callSrc, /export function poseFrames/);
  assert.doesNotMatch(callSrc, /export function (assignSrc|assignedSrc|syncCalledPaint|destFit)\b/);
  assert.match(calledSrc, /paintCalledFrame/);
  assert.doesNotMatch(calledSrc, /<img/);
  assert.match(calledSrc, /hiddenRef/);
  assert.doesNotMatch(calledSrc, /if \(hidden \|\| !list\.length\)/);
});

test("/demo Rui idle is not a parked card sit, and hide still tucks", () => {
  // An open keeper card holds Rui still on the idle loop (sleep if asleep), never the sit pose;
  // the "still Rui while card open" hold replaced the old disabled `if (false && ...)` branch.
  const cardHold = (src, head) => {
    const at = src.indexOf(head);
    assert.ok(at > 0, head);
    return src.slice(at, src.indexOf("return;", at));
  };
  const deskHold = cardHold(livingSrc, "if (cardRef.current && (cmd === \"wander\" || cmd === \"idle\")) {");
  assert.match(deskHold, /s\.anim = asleepRef\.current \? "sleep" : "idle";/);
  assert.doesNotMatch(deskHold, /"sit"/);
  const overlayHold = cardHold(petSrc, "if (cardOpen() && (sim.cmd === \"wander\" || sim.cmd === \"idle\")) {");
  assert.match(overlayHold, /sim\.anim = life\?\.asleep \? "sleep" : "idle";/);
  assert.doesNotMatch(overlayHold, /"sit"/);
  assert.doesNotMatch(livingSrc, /if \(false && /);
  assert.doesNotMatch(petSrc, /if \(false && /);
  // A walk still folds the open card, once the hello is read and a few seconds after a press (PetKeeper.cardFoldsOnWalk).
  assert.match(petSrc, /if \(cardOpen\(\) && sim\.anim === "walk" && !sim\.dragging && cardFoldsNow\(\)\) \{\s*collapseKeeperCard\(\);/);
  assert.match(livingSrc, /pointerEvents: "auto"/);
  assert.match(cssSrc, /#pet\.hidden[\s\S]{0,80}pointer-events:\s*auto/);
});

test("/demo launch walks Rui and does not sit after talk", () => {
  const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
  assert.match(roomSrc, /issue\(kind\.key === "red_panda" \? "wander" : "talk"\)/);
  assert.match(roomSrc, /live\.hidden = false/);
  assert.match(petSrc, /PetLife\.bootCmd/);
  assert.match(petSrc, /issue\(boot\)/);
});
