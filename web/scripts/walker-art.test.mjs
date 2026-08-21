import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cssSrc = readFileSync(join(root, "src/styles.css"), "utf8");
const livingSrc = readFileSync(join(root, "src/components/desk/living-pet.tsx"), "utf8");
const lawSrc = readFileSync(join(root, "scripts/house_walkers.py"), "utf8");
const overlayCss = readFileSync(join(root, "../desktop/renderer/styles.css"), "utf8");
const catalogSrc = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");

test("the walker paint is a clear plate; the tap pad is empty wood", () => {
  assert.match(lawSrc, /CLEAR = \(0, 0, 0, 0\)/);
  assert.match(lawSrc, /fit_like_rui/);
  assert.match(lawSrc, /clear_connected_plate/);
  assert.doesNotMatch(lawSrc, /Image\.new\("RGBA", \(HI, HI\), \(0, 0, 0, 255\)\)/);
  assert.match(livingSrc, /data-pet-hit/);
  assert.match(livingSrc, /data-pet-art/);
  assert.match(livingSrc, /background: "transparent"/);
  assert.match(cssSrc, /The pad is empty/);
  assert.match(cssSrc, /\[data-pet-art\]/);
  assert.match(cssSrc, /\[data-pet-hit\]/);
  assert.doesNotMatch(cssSrc, /\[data-phone-floor\] img\[data-pet\] \{/);
  assert.match(overlayCss, /background: transparent;/);
  assert.equal([...catalogSrc.matchAll(/\{ key: "/g)].length, 210);
});

test("every idle walker has no plate and is not a thin stamp", () => {
  const out = execFileSync("python3", [join(root, "scripts/assert-walker-art.py")], {
    encoding: "utf8",
  });
  assert.match(out, /ok 210 walkers/);
});
