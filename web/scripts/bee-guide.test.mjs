import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const beeSrc = readFileSync(join(root, "src/lib/pets/bees.ts"), "utf8");
const guideSrc = readFileSync(join(root, "src/lib/pets/bee-guide.ts"), "utf8");
const denSrc = readFileSync(join(root, "src/routes/hive.tsx"), "utf8");
const catalogSrc = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");
const rosterSrc = readFileSync(join(root, "src/lib/pets/roster.ts"), "utf8");
const insectSrc = readFileSync(join(root, "src/lib/pets/insects.ts"), "utf8");

const EXPECTED = [
  ["bumblebee", "thrum", "Bombus impatiens"],
  ["carpenter_bee", "auger", "Xylocopa virginica"],
  ["mason_bee", "mortar", "Osmia lignaria"],
  ["leafcutter", "disc", "Megachile rotundata"],
  ["stingless", "pot", "Melipona beecheii"],
  ["sweat_bee", "sheen", "Agapostemon virescens"],
  ["mining_bee", "bank", "Andrena vicina"],
  ["honey_drone", "hum", "Apis mellifera"],
  ["honey_queen", "keep", "Apis mellifera"],
  ["honeycomb", "wax", "Apis mellifera nest"],
];

function quotedKeys(src) {
  return [...src.matchAll(/key:\s*"([a-z_]+)"/g)].map((m) => m[1]);
}

test("the hive bees list the same ten as the roster", () => {
  const rosterKeys = quotedKeys(beeSrc);
  const guideKeys = [...guideSrc.matchAll(/entry\(\s*"([a-z_]+)"/g)].map((m) => m[1]);
  assert.deepEqual(rosterKeys, EXPECTED.map(([key]) => key));
  assert.deepEqual(guideKeys, rosterKeys);
  assert.equal(guideKeys.length, 10);
});

test("each guide entry has a tell, a mix-up, a lesson, and the latin name", () => {
  for (const [key, slug, latin] of EXPECTED) {
    assert.match(guideSrc, new RegExp(`entry\\(\\s*"${key}"`));
    assert.match(beeSrc, new RegExp(`slug:\\s*"${slug}"`));
    assert.match(guideSrc, new RegExp(latin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  const entries = [...guideSrc.matchAll(/entry\(\s*"[a-z_]+"/g)];
  assert.equal(entries.length, 10);
  assert.match(guideSrc, /tell,/);
  assert.match(guideSrc, /mixup,/);
  assert.match(guideSrc, /lesson,/);
  assert.match(guideSrc, /latin,/);
});

test("the important mix-ups are actually taught", () => {
  const thrum = guideSrc.slice(guideSrc.indexOf('"bumblebee"'), guideSrc.indexOf('"carpenter_bee"'));
  const auger = guideSrc.slice(guideSrc.indexOf('"carpenter_bee"'), guideSrc.indexOf('"mason_bee"'));
  const hum = guideSrc.slice(guideSrc.indexOf('"honey_drone"'), guideSrc.indexOf('"honey_queen"'));
  const keep = guideSrc.slice(guideSrc.indexOf('"honey_queen"'), guideSrc.indexOf('"honeycomb"'));
  const wax = guideSrc.slice(guideSrc.indexOf('"honeycomb"'));
  assert.match(thrum, /not a honey bee/i);
  assert.match(auger, /does not keep honey the honey-bee way/i);
  assert.match(hum, /drone is not a worker/i);
  assert.match(keep, /not a second Comb/i);
  assert.match(wax, /many bees, one/i);
  assert.match(wax, /not a shop/i);
});

test("Comb stays Comb — the bee roster does not restack her", () => {
  assert.match(insectSrc, /key:\s*"honeybee"/);
  assert.match(insectSrc, /slug:\s*"comb"/);
  assert.doesNotMatch(beeSrc, /key:\s*"honeybee"/);
  assert.doesNotMatch(beeSrc, /slug:\s*"comb"/);
  assert.match(rosterSrc, /BEE_ROSTER/);
  assert.match(denSrc, /INSECT_GUIDE\.map/);
  assert.match(denSrc, /BEE_GUIDE\.map/);
});

test("the catalog includes the ten bee keys", () => {
  for (const [key] of EXPECTED) {
    assert.match(catalogSrc, new RegExp(`key:\\s*"${key}"`));
  }
  assert.doesNotMatch(beeSrc, /pond/i);
  assert.doesNotMatch(guideSrc, /amphibian/i);
});
