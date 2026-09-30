// The access pass 2 (September 2026): reduced motion's still-where-it-rests rule, the same on the web and the
// overlay; the skip link's target; the drawers a print opens; and the pieces the overlay's keyboard way in stands on.
// The browser checks (the skip link, 280 px, 200 % zoom, print, reduced motion on /demo) are in a11y-axe.test.mjs.

import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(root, "..");
const Web = await import(pathToFileURL(join(root, "src/lib/pets/calm-motion.ts")).href);
const Overlay = createRequire(import.meta.url)(join(repo, "desktop/renderer/calm-motion.js"));
const read = (...p) => readFileSync(join(repo, ...p), "utf8");

/** A robin's day under reduced motion: in, land, stay, leave, as the flight steps it. */
function run(C, steps, rest) {
  let hold = null;
  const drawn = [];
  for (const s of steps) {
    hold = C.calmHold(hold, s, rest);
    drawn.push(hold ? `${hold.phase}@${hold.x},${hold.lift},${hold.facing}` : "-");
  }
  return drawn;
}

test("calmHold: nothing drawn on the way in, one still spot per rest, a new rest is a cut; web and overlay agree", () => {
  const robin = [
    { phase: "enter", x: 900, lift: 200, facing: -1 },
    { phase: "cruise", x: 700, lift: 180, facing: -1 },
    { phase: "land", x: 650, lift: 60, facing: -1 },
    { phase: "stay", x: 640, lift: 0, facing: -1 },
    { phase: "stay", x: 641, lift: 0, facing: -1 },
    { phase: "leave", x: 700, lift: 40, facing: 1 },
    { phase: "leave", x: 900, lift: 90, facing: 1 },
  ];
  const want = ["-", "-", "-", "stay@640,0,-1", "stay@640,0,-1", "stay@640,0,-1", "stay@640,0,-1"];
  assert.deepEqual(run(Web, robin, Web.ROBIN_REST), want);
  assert.deepEqual(run(Overlay, robin, Overlay.ROBIN_REST), want);
  const bird = [
    { phase: "enter", x: 900, lift: 200, facing: -1 },
    { phase: "hover", x: 500, lift: 300, facing: -1 },
    { phase: "hover", x: 505, lift: 296, facing: -1 },
    { phase: "cruise", x: 400, lift: 250, facing: -1 },
    { phase: "hover", x: 300, lift: 240, facing: 1 },
  ];
  // A bird that leaves one hover for the next is drawn at the next at once (a cut); both halves agree.
  const wantBird = ["-", "hover@500,300,-1", "hover@500,300,-1", "hover@500,300,-1", "hover@300,240,1"];
  assert.deepEqual(run(Web, bird, Web.BIRD_REST), wantBird);
  assert.deepEqual(run(Overlay, bird, Overlay.BIRD_REST), wantBird);
  // A different resting phase moves it too (a perch on the host's shoulder).
  const hop = [...bird.slice(0, 4), { phase: "perch", x: 300, lift: 240, facing: 1 }];
  assert.deepEqual(run(Web, hop, Web.BIRD_REST).at(-1), "perch@300,240,1");
  assert.deepEqual(run(Overlay, hop, Overlay.BIRD_REST), run(Web, hop, Web.BIRD_REST));
  assert.deepEqual([...Web.ROBIN_REST], [...Overlay.ROBIN_REST]);
  assert.deepEqual([...Web.BIRD_REST], [...Overlay.BIRD_REST]);
  assert.deepEqual([...Web.CALLED_REST], [...Overlay.CALLED_REST]);
});

test("reducedMotion is false where there is no window (server render, the overlay's tests)", () => {
  assert.equal(Web.reducedMotion(), false);
  assert.equal(Overlay.reducedMotion(), false);
});

test("the web desk's moving guests read reduced motion", () => {
  const desk = (f) => read("web/src/components/desk", f);
  assert.match(desk("robin-fly.tsx"), /if \(reducedMotion\(\)\) \{\n\s+\/\/ Drawn still[\s\S]{0,200}hold = calmHold\(hold, fly, ROBIN_REST\);/);
  assert.match(desk("bird-fly.tsx"), /if \(reducedMotion\(\)\) \{\n\s+\/\/ Drawn still[\s\S]{0,200}hold = calmHold\(hold, fly, BIRD_REST\);/);
  assert.match(desk("called-guests.tsx"), /const hold = \(holds\[key\] = calmHold\(holds\[key\] \?\? null, g, CALLED_REST\)\);/);
  assert.match(desk("desk-plants.tsx"), /const still = reducedMotion\(\) \|\| plantsRef\.current\.every/);
});

test("the skip link, the print drawers, and /demo's landmark", async () => {
  const shell = read("web/src/components/app-shell.tsx");
  assert.match(shell, /export const CARE_ROW = '\.blotter-care\[role="toolbar"\]';/);
  assert.match(shell, /<SkipLink pathname=\{pathname\} page=\{pageRef\} \/>\n\s+<header/, "the first thing on every page");
  assert.equal((shell.match(/id="page"/g) || []).length, 3, "every page wrapper is the skip link's #page");
  assert.match(shell, /window\.addEventListener\("beforeprint", before\);/);
  assert.match(read("web/src/components/desk/demo-stage.tsx"), /<main data-demo-stage className="relative">/);
  assert.match(read("web/src/styles.css"), /@media print \{[\s\S]{0,200}color: #1d1a17 !important;/);
});

test("the overlay's keyboard way in: the Menu key or Shift+F10 opens the pet's menu, and the README says how", () => {
  const Keeper = createRequire(import.meta.url)(join(repo, "desktop/renderer/keeper.js"));
  assert.equal(Keeper.cardKey({ key: "ContextMenu", cardOpen: true }), "menu");
  assert.equal(Keeper.cardKey({ key: "F10", shiftKey: true, cardOpen: true }), "menu");
  assert.equal(Keeper.cardKey({ key: "F10", cardOpen: true }), "none");
  assert.equal(Keeper.cardKey({ key: "ContextMenu", cardOpen: true, inField: true }), "none", "a field keeps its own menu");
  assert.equal(Keeper.cardKey({ key: "ContextMenu", cardOpen: false }), "none", "only while the overlay has the keyboard");
  assert.equal(Keeper.cardKey({ key: "ContextMenu", cardOpen: true, menuOpen: true }), "none");
  const pet = read("desktop/renderer/pet.js");
  assert.match(pet, /if \(act === "menu"\) \{[\s\S]{0,400}window\.desk\?\.openMenu\(at\.left \+ at\.width \/ 2, at\.top \+ at\.height \/ 2\);/);
  const readme = read("desktop/README.md");
  assert.match(readme, /\*\*Getting in from the keyboard, without a mouse\.\*\*/);
  assert.match(readme, /Win\+B puts the keyboard on the notification area/);
  assert.match(readme, /Where the panel cannot, there is no keyboard way in/);
  assert.doesNotMatch(read("desktop/main.cjs"), /globalShortcut/, "no global shortcut (ADR 0012)");
});
