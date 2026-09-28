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
