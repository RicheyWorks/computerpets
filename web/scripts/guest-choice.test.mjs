import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const C = await import(join(root, "src/lib/pets/guest-choice.ts"));
const Overlay = createRequire(import.meta.url)(join(root, "../desktop/renderer/choice.js"));

const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const choiceSrc = readFileSync(join(root, "src/components/desk/guest-choice.tsx"), "utf8");
const livingSrc = readFileSync(join(root, "src/components/desk/living-pet.tsx"), "utf8");
const demoSrc = readFileSync(join(root, "src/components/desk/demo-stage.tsx"), "utf8");
const liveSrc = readFileSync(join(root, "src/components/desk/live-stage.tsx"), "utf8");
const cssSrc = readFileSync(join(root, "src/styles.css"), "utf8");
const overlayPetSrc = readFileSync(join(root, "../desktop/renderer/pet.js"), "utf8");
const overlayHtml = readFileSync(join(root, "../desktop/renderer/index.html"), "utf8");
const blotterApp = readFileSync(join(root, "../client/computerpets_client/app.py"), "utf8");
const blotterChoice = readFileSync(join(root, "../client/computerpets_client/choice.py"), "utf8");
const speciesSrc = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");

function ids(marks) {
  return marks.map((m) => m.id);
}

test("a tap is a choice, not a sit", () => {
  assert.equal(C.guestTap(), "choice");
  assert.equal(Overlay.guestTap(), "choice");
  assert.deepEqual([...C.GUEST_CHOICE], [...Overlay.GUEST_CHOICE]);
  assert.equal(C.guestPick("talk"), "talk");
  assert.equal(C.guestPick("feed"), null);
  assert.equal(C.guestPick("bath"), null);
  assert.equal(Overlay.guestPick("rest"), "rest");
  assert.equal(Overlay.guestPick("medicine"), null);
});

test("the walking guest may sit; the still guest may walk; Rest is sleep", () => {
  assert.deepEqual(C.poseFlip(true), { id: "sit", label: "Sit" });
  assert.deepEqual(C.poseFlip(false), { id: "walk", label: "Walk" });
  assert.deepEqual(Overlay.poseFlip(true), { id: "sit", label: "Sit" });
  const open = ids(C.guestMarks({ walking: true }));
  assert.deepEqual(open, ["rest", "sit", "talk", "treat", "play", "special", "hide"]);
  const still = ids(C.guestMarks({ walking: false, treatVerb: "Egg", specialVerb: "Ridge" }));
  assert.deepEqual(still, ["rest", "walk", "talk", "treat", "play", "special", "hide"]);
  assert.equal(C.guestMarks({ treatVerb: "Egg" }).find((m) => m.id === "treat")?.label, "Egg");
  assert.equal(C.guestMarks({ specialVerb: "Ridge" }).find((m) => m.id === "special")?.label, "Ridge");
});

test("hidden keeps Call back; a gift on the wood keeps Pick; leaving is not a new treat", () => {
  assert.deepEqual(ids(C.guestMarks({ hidden: true })), ["talk", "special", "call"]);
  assert.ok(ids(C.guestMarks({ gifts: 1 })).includes("pick"));
  assert.ok(!ids(C.guestMarks({ hidden: true, gifts: 1 })).includes("pick"));
  assert.deepEqual(ids(C.guestMarks({ leaving: true })), ["talk", "special"]);
  assert.deepEqual(ids(Overlay.guestMarks({ hidden: true })), ["talk", "special", "call"]);
  assert.ok(ids(Overlay.guestMarks({ gifts: 2 })).includes("pick"));
});

test("a finger sit keeps extra wood; the room around them may still pan", () => {
  assert.equal(C.guestHitPad({ phone: true }), 12);
  assert.equal(C.guestHitPad({ tablet: true }), 16);
  assert.equal(C.guestHitPad({}), 0);
  assert.equal(Overlay.guestHitPad({ phone: true }), 12);
  assert.equal(Overlay.guestHitPad({ tablet: true }), 16);
  assert.match(cssSrc, /\[data-phone-floor\] \[data-pet-hit\]/);
  assert.match(cssSrc, /padding:\s*12px 12px 0/);
  assert.match(cssSrc, /\[data-tablet-floor\] \[data-pet-hit\]/);
  assert.match(cssSrc, /padding:\s*16px 16px 0/);
  assert.match(cssSrc, /touch-action:\s*manipulation/);
  assert.match(livingSrc, /touch-none/);
  assert.match(livingSrc, /data-pet-hit/);
  assert.match(livingSrc, /data-pet-art/);
  assert.match(cssSrc, /\[data-pet-art\]/);
  assert.match(cssSrc, /The pad is empty/);
  assert.doesNotMatch(cssSrc, /\[data-phone-floor\] img\[data-pet\]/);
});

test("desk, /demo, and /live share the choice; a tap does not talk by itself", () => {
  assert.match(roomSrc, /guestTap\(\)/);
  assert.match(roomSrc, /setChoiceOpen/);
  assert.match(roomSrc, /GuestChoice/);
  assert.match(roomSrc, /pickGuest/);
  assert.match(roomSrc, /guestMarks\(/);
  assert.doesNotMatch(roomSrc, /onTap=\{\(\) => void talk\(\)\}/);
  assert.match(choiceSrc, /data-guest-choice/);
  assert.match(choiceSrc, /aria-label="A sit"/);
  assert.match(demoSrc, /CompanionRoom/);
  assert.match(liveSrc, /CompanionRoom/);
  assert.match(demoSrc, /persistLocal=\{false\}/);
  assert.doesNotMatch(liveSrc, /persistLocal=\{false\}/);
  assert.equal([...speciesSrc.matchAll(/\{ key: "/g)].length, 210);
});

test("overlay and blotter keep the same choice on those woods", () => {
  assert.match(overlayHtml, /choice\.js/);
  assert.match(overlayHtml, /id="choice"/);
  assert.match(overlayPetSrc, /openChoice/);
  assert.match(overlayPetSrc, /pickChoice/);
  assert.match(overlayPetSrc, /guestTap\(\)/);
  const liftStart = overlayPetSrc.indexOf('window.addEventListener("pointerup"');
  const liftEnd = overlayPetSrc.indexOf('window.addEventListener("pointercancel"');
  const lift = overlayPetSrc.slice(liftStart, liftEnd);
  assert.match(lift, /openChoice/);
  assert.doesNotMatch(lift, /handle\("talk"\)/);
  assert.match(blotterChoice, /def guest_tap/);
  assert.match(blotterApp, /_open_choice/);
  assert.match(blotterApp, /_pick_choice/);
  assert.doesNotMatch(blotterApp, /the plaque teaches, they say the lesson/);
});
