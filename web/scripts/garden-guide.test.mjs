import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const gardenSrc = readFileSync(join(root, "src/lib/pets/garden.ts"), "utf8");
const guideSrc = readFileSync(join(root, "src/lib/pets/garden-guide.ts"), "utf8");
const denSrc = readFileSync(join(root, "src/routes/garden.tsx"), "utf8");
const catalogSrc = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");
const rosterSrc = readFileSync(join(root, "src/lib/pets/roster.ts"), "utf8");

const EXPECTED = [
  ["moss", "felt", "Hypnum cupressiforme"],
  ["maidenhair", "vein", "Adiantum capillus-veneris"],
  ["ginkgo", "fan", "Ginkgo biloba"],
  ["oak", "mast", "Quercus alba"],
  ["redwood", "spire", "Sequoia sempervirens"],
  ["water_lily", "pad", "Nymphaea odorata"],
  ["duckweed", "speck", "Lemna minor"],
  ["venus_flytrap", "snap", "Dionaea muscipula"],
  ["orchid", "moth", "Phalaenopsis amabilis"],
  ["saguaro", "arm", "Carnegiea gigantea"],
];

function quotedKeys(src) {
  return [...src.matchAll(/key:\s*"([a-z_]+)"/g)].map((m) => m[1]);
}

test("the garden lists the same ten plants as the roster", () => {
  const rosterKeys = quotedKeys(gardenSrc);
  const guideKeys = [...guideSrc.matchAll(/entry\(\s*"([a-z_]+)"/g)].map((m) => m[1]);
  assert.deepEqual(rosterKeys, EXPECTED.map(([key]) => key));
  assert.deepEqual(guideKeys, rosterKeys);
  assert.equal(guideKeys.length, 10);
});

test("each guide entry has a tell, a mix-up, a lesson, and the latin name", () => {
  for (const [key, slug, latin] of EXPECTED) {
    assert.match(guideSrc, new RegExp(`entry\\(\\s*"${key}"`));
    assert.match(gardenSrc, new RegExp(`slug:\\s*"${slug}"`));
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
  const moss = guideSrc.slice(guideSrc.indexOf('"moss"'), guideSrc.indexOf('"maidenhair"'));
  const fern = guideSrc.slice(guideSrc.indexOf('"maidenhair"'), guideSrc.indexOf('"ginkgo"'));
  const ginkgo = guideSrc.slice(guideSrc.indexOf('"ginkgo"'), guideSrc.indexOf('"oak"'));
  const duckweed = guideSrc.slice(guideSrc.indexOf('"duckweed"'), guideSrc.indexOf('"venus_flytrap"'));
  const flytrap = guideSrc.slice(guideSrc.indexOf('"venus_flytrap"'), guideSrc.indexOf('"orchid"'));
  const saguaro = guideSrc.slice(guideSrc.indexOf('"saguaro"'));
  assert.match(moss, /no flower/i);
  assert.match(moss, /not a lichen/i);
  assert.match(fern, /not a flowering plant/i);
  assert.match(ginkgo, /not a flowering plant/i);
  assert.match(duckweed, /flower the size of a pin/i);
  assert.match(flytrap, /not a monster/i);
  assert.match(flytrap, /two hairs/i);
  assert.match(saguaro, /not a tree/i);
  assert.match(saguaro, /cactus/i);
});

test("the garden page is a field guide, not a portrait catalog", () => {
  assert.match(denSrc, /createFileRoute\("\/garden"\)/);
  assert.match(denSrc, /GardenDen/);
  assert.match(denSrc, /SpeciesPlaque/);
  assert.match(denSrc, /\/demo\/\$slug/);
  assert.match(denSrc, /GARDEN_GUIDE\.map/);
});

test("the catalog and living roster include the ten garden keys", () => {
  for (const [key] of EXPECTED) {
    assert.match(catalogSrc, new RegExp(`key:\\s*"${key}"`));
  }
  assert.match(rosterSrc, /GARDEN_ROSTER/);
  assert.doesNotMatch(gardenSrc, /slug:\s*"ink"/);
});
