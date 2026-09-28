// On a phone on its side the speech bubble kept off the docked plates but painted over the panel's own kicker
// (844×390 and 568×320, web/scripts/phone-desk-layout.test.mjs drives it in a real browser). The panel's kicker and
// name are marked data-bubble-avoid there, and living-pet.tsx's bubble dodge reads them with the plates.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const room = readFileSync(new URL("../src/components/desk/companion-room.tsx", import.meta.url), "utf8");
const pet = readFileSync(new URL("../src/components/desk/living-pet.tsx", import.meta.url), "utf8");
const layout = readFileSync(new URL("./phone-desk-layout.test.mjs", import.meta.url), "utf8");

test("the sideways phone panel's kicker and name are marked for the bubble to avoid", () => {
  assert.match(room, /const bubbleAvoid = hand && handOrient === "sit" \? "" : undefined;/);
  assert.match(room, /<p data-bubble-avoid=\{bubbleAvoid\} className="text-\[11px\] uppercase tracking-\[0\.2em\] text-subtle">/);
  assert.match(room, /<div data-name-row data-bubble-avoid=\{bubbleAvoid\}/);
  assert.match(room, /<h1 data-bubble-avoid=\{bubbleAvoid\} className=\{hand \?/);
  // The care buttons too: stepping off the name must not land the bubble on them (it did below the name).
  assert.match(room, /<div className="pointer-events-auto" ref=\{careRef\} data-desk-care data-bubble-avoid=\{bubbleAvoid\}>/);
  assert.equal((room.match(/data-bubble-avoid=\{bubbleAvoid\}/g) || []).length, 4);
});

test("the bubble dodge reads the marked lines with the plates", () => {
  assert.match(pet, /document\.querySelectorAll<HTMLElement>\("\[data-desk-plate\], \[data-bubble-avoid\]"\)/);
  assert.match(pet, /bubblePlatesRef\.current = \{ restTop: el\.offsetTop, w: el\.offsetWidth, h: el\.offsetHeight, floor: parent\.clientHeight, plates \};/);
});

test("the real-browser sweep checks the kicker and name on the sideways phones", () => {
  assert.match(layout, /function bubbleOverNames\(\)/);
  assert.match(layout, /\{ w: 844, h: 390, phone: true \}, \{ w: 568, h: 320, phone: true \}\]\) \{/);
  assert.match(layout, /if \(size\.phone && size\.w > size\.h\) for \(const o of \(await page\.evaluate\(bubbleOverNames\)\) \|\| \[\]\) seen\.add\(o\);/);
});
