import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const E = require(join(root, "../desktop/renderer/ethogram.js"));
const snakesSrc = readFileSync(join(root, "src/lib/pets/snakes.ts"), "utf8");
const ethogramSrc = readFileSync(join(root, "src/lib/pets/ethogram.ts"), "utf8");
const livingSrc = readFileSync(join(root, "src/components/desk/living-pet.tsx"), "utf8");

const SNAKES = [
  "ball_python",
  "corn_snake",
  "kingsnake",
  "green_tree_python",
  "hognose",
  "garter",
  "boa",
  "milk_snake",
  "rosy_boa",
  "carpet_python",
];
const HOUSE = [
  "red_panda",
  "cat",
  "dog",
  "rabbit",
  "hamster",
  "guinea_pig",
  "turtle",
  "goldfish",
  "budgie",
  "fox",
  "penguin",
  "parrot",
  "ferret",
  "hedgehog",
  "chinchilla",
  "axolotl",
  "toucan",
  "iguana",
  "dragon",
  "phoenix",
];

function names(key) {
  return E.actsFor(key).map((a) => a.name);
}

test("every living kind has an ethogram, and snakes never scratch", () => {
  for (const key of [...HOUSE, ...SNAKES]) {
    assert.ok(E.actsFor(key).length > 0, key);
  }
  for (const key of SNAKES) {
    const acts = names(key);
    assert.ok(acts.includes("tongue"), `${key} flicks`);
    assert.equal(acts.includes("scratch"), false, `${key} does not scratch`);
    assert.equal(acts.includes("yawn"), false, `${key} does not mammal-yawn`);
  }
  for (const key of E.SCRATCH_KEYS) {
    assert.ok(names(key).includes("scratch"), `${key} scratches`);
  }
  assert.equal(names("goldfish").includes("scratch"), false);
  assert.equal(names("goldfish").includes("tongue"), false);
  assert.equal(names("turtle").includes("scratch"), false);
  assert.equal(names("budgie").includes("scratch"), false);
});

test("pickAct can schedule tongue on a snake and never scratch", () => {
  let tongue = 0;
  for (let i = 0; i < 80; i++) {
    const act = E.pickAct("ball_python");
    assert.notEqual(act?.name, "scratch");
    if (act?.name === "tongue") tongue += 1;
  }
  assert.ok(tongue > 0);
});

test("the living desk stages idle acts and a snake-only tongue", () => {
  assert.match(ethogramSrc, /export const ETHOGRAM/);
  assert.match(livingSrc, /pickAct/);
  assert.match(livingSrc, /tongueFlick/);
  assert.match(livingSrc, /ref=\{tongueRef\}/);
  for (const key of SNAKES) {
    assert.match(snakesSrc, new RegExp(`key:\\s*"${key}"`));
  }
});
