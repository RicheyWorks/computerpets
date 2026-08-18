import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fungiSrc = readFileSync(join(root, "src/lib/pets/fungi.ts"), "utf8");
const guideSrc = readFileSync(join(root, "src/lib/pets/fungi-guide.ts"), "utf8");
const denSrc = readFileSync(join(root, "src/routes/cellar.tsx"), "utf8");
const catalogSrc = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");
const rosterSrc = readFileSync(join(root, "src/lib/pets/roster.ts"), "utf8");

const EXPECTED = [
  ["oyster", "frill", "Pleurotus ostreatus"],
  ["fly_agaric", "cap", "Amanita muscaria"],
  ["morel", "lattice", "Morchella americana"],
  ["chanterelle", "horn", "Cantharellus cibarius"],
  ["turkey_tail", "ring", "Trametes versicolor"],
  ["lions_mane", "mane", "Hericium erinaceus"],
  ["puffball", "puff", "Lycoperdon perlatum"],
  ["chicken_of_woods", "flame", "Laetiporus sulphureus"],
  ["yeast", "starter", "Saccharomyces cerevisiae"],
  ["lichen", "pact", "Cladonia rangiferina"],
];

function quotedKeys(src) {
  return [...src.matchAll(/key:\s*"([a-z_]+)"/g)].map((m) => m[1]);
}

test("the cellar lists the same ten fungi as the roster", () => {
  const rosterKeys = quotedKeys(fungiSrc);
  const guideKeys = [...guideSrc.matchAll(/entry\(\s*"([a-z_]+)"/g)].map((m) => m[1]);
  assert.deepEqual(rosterKeys, EXPECTED.map(([key]) => key));
  assert.deepEqual(guideKeys, rosterKeys);
  assert.equal(guideKeys.length, 10);
});

test("each guide entry has a tell, a mix-up, a lesson, and the latin name", () => {
  for (const [key, slug, latin] of EXPECTED) {
    assert.match(guideSrc, new RegExp(`entry\\(\\s*"${key}"`));
    assert.match(fungiSrc, new RegExp(`slug:\\s*"${slug}"`));
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
  const oyster = guideSrc.slice(guideSrc.indexOf('"oyster"'), guideSrc.indexOf('"fly_agaric"'));
  const agaric = guideSrc.slice(guideSrc.indexOf('"fly_agaric"'), guideSrc.indexOf('"morel"'));
  const morel = guideSrc.slice(guideSrc.indexOf('"morel"'), guideSrc.indexOf('"chanterelle"'));
  const chant = guideSrc.slice(guideSrc.indexOf('"chanterelle"'), guideSrc.indexOf('"turkey_tail"'));
  const turkey = guideSrc.slice(guideSrc.indexOf('"turkey_tail"'), guideSrc.indexOf('"lions_mane"'));
  const mane = guideSrc.slice(guideSrc.indexOf('"lions_mane"'), guideSrc.indexOf('"puffball"'));
  const puff = guideSrc.slice(guideSrc.indexOf('"puffball"'), guideSrc.indexOf('"chicken_of_woods"'));
  const chicken = guideSrc.slice(guideSrc.indexOf('"chicken_of_woods"'), guideSrc.indexOf('"yeast"'));
  const yeast = guideSrc.slice(guideSrc.indexOf('"yeast"'), guideSrc.indexOf('"lichen"'));
  const lichen = guideSrc.slice(guideSrc.indexOf('"lichen"'));
  assert.match(oyster, /dead wood/i);
  assert.match(oyster, /not a plant/i);
  assert.match(agaric, /warning/i);
  assert.match(agaric, /volva/i);
  assert.match(agaric, /not lunch/i);
  assert.match(morel, /hollow/i);
  assert.match(morel, /false morel/i);
  assert.match(chant, /fork/i);
  assert.match(chant, /jack-o/i);
  assert.match(chant, /Omphalotus/);
  assert.match(turkey, /pores not gills/i);
  assert.match(turkey, /not a turkey/i);
  assert.match(mane, /teeth/i);
  assert.match(mane, /not gills/i);
  assert.match(puff, /puff/i);
  assert.match(puff, /Amanita/);
  assert.match(puff, /cut/i);
  assert.match(chicken, /sulfur/i);
  assert.match(chicken, /not a chicken/i);
  assert.match(yeast, /bread/i);
  assert.match(yeast, /fungus/i);
  assert.match(lichen, /not one creature/i);
  assert.match(lichen, /partner/i);
  assert.match(lichen, /two kingdoms/i);
});

test("the cellar page is a field guide, not a portrait catalog", () => {
  assert.match(denSrc, /createFileRoute\("\/cellar"\)/);
  assert.match(denSrc, /CellarDen/);
  assert.match(denSrc, /SpeciesPlaque/);
  assert.match(denSrc, /\/demo\/\$slug/);
  assert.match(denSrc, /FUNGI_GUIDE\.map/);
});

test("the catalog and living roster include the ten fungi keys", () => {
  for (const [key] of EXPECTED) {
    assert.match(catalogSrc, new RegExp(`key:\\s*"${key}"`));
  }
  assert.match(rosterSrc, /FUNGI_ROSTER/);
  assert.doesNotMatch(fungiSrc, /slug:\s*"ink"/);
  assert.doesNotMatch(fungiSrc, /slug:\s*"ember"/);
  assert.doesNotMatch(fungiSrc, /slug:\s*"fan"/);
  assert.doesNotMatch(fungiSrc, /slug:\s*"well"/);
  assert.doesNotMatch(guideSrc, /slime mold/i);
  assert.doesNotMatch(guideSrc, /cordyceps/i);
  assert.doesNotMatch(guideSrc, /kelp/i);
});
