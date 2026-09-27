import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const R = await import(pathToFileURL(join(root, "src/lib/pets/ribbon.ts")).href);
const Overlay = createRequire(import.meta.url)(join(root, "../desktop/renderer/ribbon.js"));
const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const petSrc = readFileSync(join(root, "../desktop/renderer/pet.js"), "utf8");
const htmlSrc = readFileSync(join(root, "../desktop/renderer/index.html"), "utf8");

test("the house ribbon lines stay", () => {
  assert.equal(R.RIBBON_SPECIAL, "I found a ribbon. It was not lost. It is now safer.");
  assert.equal(R.RIBBON_CATCH, "A ribbon. Catch it.");
  assert.equal(R.isRibbonSpecial("ribbon"), true);
  assert.equal(R.isRibbonSpecial("bug"), false);
  const sit = R.blankRibbon(40);
  const stolen = R.stealRibbon(sit, 120);
  assert.equal(stolen.stolen, true);
  assert.equal(stolen.carried, true);
  assert.equal(R.carryX(stolen, 200, 1), 238);
  assert.equal(Overlay.RIBBON_SPECIAL, R.RIBBON_SPECIAL);
  assert.match(roomSrc, /stealRibbon/);
  assert.match(petSrc, /stealDeskRibbon/);
  assert.match(htmlSrc, /id="lure"/);
});
