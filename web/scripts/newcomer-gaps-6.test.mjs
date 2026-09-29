import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

// Newcomer pass 6 (September 2026): the web part of the pass. The Python and desktop parts are tested in
// client/tests/test_blotter_fit.py, desktop/license/session.test.cjs and desktop/renderer/settings-intro.test.cjs.
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (...p) => readFileSync(join(...p), "utf8").replace(/\r\n/g, "\n");

test("on a laptop or wider the speech bubble keeps clear of the species plaque; a phone keeps its list", () => {
  const src = read(root, "src/components/desk/living-pet.tsx");
  const at = src.indexOf("const readPlates = () =>");
  assert.ok(at >= 0, "readPlates");
  const body = src.slice(at, src.indexOf("bubblePlatesRef.current = {", at));
  const m = body.match(/const plaques = window\.innerWidth >= (\d+) \? Array\.from\(document\.querySelectorAll<HTMLElement>\("\[data-plaque\]"\)\) : \[\];/);
  assert.ok(m, "the plaque, on wide screens only");
  assert.ok(Number(m[1]) >= 900 && Number(m[1]) <= 1366, "a laptop at 1366 wide counts, a phone does not");
  assert.match(body, /querySelectorAll<HTMLElement>\("\[data-desk-plate\], \[data-bubble-avoid\]"\)\), \.\.\.plaques\]/);
  // The plaque really carries the marker the bubble reads.
  assert.match(read(root, "src/components/desk/species-plaque.tsx"), /data-plaque=\{/);
});

test("the plates are re-read as soon as the plaque opens or folds while a line shows", () => {
  const src = read(root, "src/components/desk/living-pet.tsx");
  assert.match(src, /new MutationObserver\(/);
  assert.match(src, /attributeFilter: \["data-plaque"\]/);
  assert.match(src, /plaqueMoved\?\.disconnect\(\)/);
  assert.match(src, /if \(soon\) cancelAnimationFrame\(soon\)/);
});
