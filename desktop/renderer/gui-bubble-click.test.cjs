"use strict";
// The real-window GUI harness (COMPUTERPETS_GUI_HARNESS=1) now clicks the talk bubble in the real overlay: a House
// lines answer opens it, Chromium gets a real mouse down/up at its middle, and it must close. These pins keep the
// check wired; the run itself needs Electron and a desktop (scripts/test-all runs it only where one exists).
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const main = fs.readFileSync(path.join(__dirname, "..", "main.cjs"), "utf8");
const pet = fs.readFileSync(path.join(__dirname, "pet.js"), "utf8");

test("main.cjs sends a real mouse down and up to the bubble's middle and reports gui.bubble_click", () => {
  const fn = main.slice(main.indexOf("async function guiBubbleClick(target)"), main.indexOf("function bootDesk()"));
  assert.ok(fn.length > 200, "guiBubbleClick exists");
  assert.match(fn, /window\.PetGuiHarness\.talkForClick\(\)/);
  assert.match(fn, /sendInputEvent\(\{ type: "mouseDown", x, y, button: "left", clickCount: 1 \}\)/);
  assert.match(fn, /sendInputEvent\(\{ type: "mouseUp", x, y, button: "left", clickCount: 1 \}\)/);
  assert.match(fn, /window\.PetGuiHarness\.bubbleState\(\)/);
  assert.match(fn, /ok: opened && longEnough && closed/);
  assert.match(fn, /before\.holdMs >= 3500/);
  assert.match(fn, /const closed = !after\.open && after\.pointer === "none";/);
  assert.match(main, /payload\.results\["gui\.bubble_click"\] = bubble;\n\s+if \(!bubble\.ok\) \{\n\s+payload\.ok = false;/);
});

test("pet.js: the harness talks with House lines only and reads the bubble the way a click would find it", () => {
  assert.match(pet, /async talkForClick\(\) \{\n\s+const mind = window\.PetMind && window\.PetMind\.binding\(kind\.key\);\n\s+if \(!mind \|\| mind\.plugin !== "local"\) return \{ skipped:/);
  assert.match(pet, /await askMind\(\{\}\);\n\s+return bubbleState\(\);/);
  const state = pet.slice(pet.indexOf("function bubbleState()"), pet.indexOf("window.PetGuiHarness = {"));
  assert.match(state, /document\.elementFromPoint\(cx, cy\)/);
  assert.match(state, /topInBubble: !!\(top && bubble\.contains\(top\)\)/);
  assert.match(state, /pointer: getComputedStyle\(bubble\)\.pointerEvents/);
  assert.match(pet, /bubble\.addEventListener\("click", \(\) => \{\n\s+speechUntil = 0;\n\s+bubble\.classList\.remove\("open"\);/);
});

test("main.cjs checks the click-through decision from the hit rects the renderer really sent (gui.clickthrough_hits)", () => {
  const fn = main.slice(main.indexOf("function guiClickThrough("), main.indexOf("function bootDesk()"));
  assert.ok(fn.length > 200, "guiClickThrough exists");
  assert.match(fn, /if \(!Desk\.hitForward\(process\.platform\)\) \{/);
  assert.match(fn, /const takesClick = Desk\.cursorHits\(\{ x: bubble\.cx, y: bubble\.cy \}, hitsOpen\);/);
  assert.match(fn, /const fallsThrough = !!bare && !Desk\.cursorHits\(bare, hitsOpen\);/);
  assert.match(fn, /const goneAfter = !hitsClosed\.some\(same\);/);
  assert.match(fn, /const ok = inHits && takesClick && fallsThrough && goneAfter;/);
  // The same test the tray's cursor poll runs before it calls setIgnoreMouseEvents.
  assert.match(main, /const over = Desk\.cursorHits\(\{ x: cursor\.x - bounds\.x, y: cursor\.y - bounds\.y \}, hitRects\);\n\s+win\.setIgnoreMouseEvents\(!\(wantClickable \|\| over\)\);/);
  const click = main.slice(main.indexOf("async function guiBubbleClick(target)"), main.indexOf("let lastClickThrough = null;"));
  assert.match(click, /const hitsOpen = hitRects\.slice\(\);\n\s+const bare = await wc\.executeJavaScript\("window\.PetGuiHarness\.barePoint\(\)", true\);/);
  assert.match(click, /const hitsClosed = hitRects\.slice\(\);\n\s+lastClickThrough = guiClickThrough\(before, bare, hitsOpen, hitsClosed\);/);
  assert.match(main, /payload\.results\["gui\.clickthrough_hits"\] = through;\n\s+if \(!through\.ok\) \{\n\s+payload\.ok = false;/);
  const bare = pet.slice(pet.indexOf("function barePoint()"), pet.indexOf("window.PetGuiHarness = {"));
  assert.match(bare, /if \(!el \|\| !el\.closest\("\[data-hit\]"\)\) return \{ x, y \};/);
});

test("the click-through decision itself: bubble takes the click, bare glass falls through, a closed bubble is gone", () => {
  const Desk = require("./desk.js");
  const bubble = { x: 400, y: 900, w: 220, h: 54 };
  const rects = [{ x: 400, y: 900, width: 220, height: 54 }, { x: 60, y: 980, width: 120, height: 120 }];
  assert.equal(Desk.cursorHits({ x: 510, y: 927 }, rects), true);
  assert.equal(Desk.cursorHits({ x: 24, y: 24 }, rects), false);
  assert.equal(Desk.cursorHits({ x: 510, y: 927 }, rects.slice(1)), false);
  assert.equal(bubble.w, rects[0].width);
});
