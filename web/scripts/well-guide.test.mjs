import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const wellSrc = readFileSync(join(root, "src/lib/pets/well.ts"), "utf8");
const guideSrc = readFileSync(join(root, "src/lib/pets/well-guide.ts"), "utf8");
const denSrc = readFileSync(join(root, "src/routes/well.tsx"), "utf8");
const catalogSrc = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");
const rosterSrc = readFileSync(join(root, "src/lib/pets/roster.ts"), "utf8");
const beesSrc = readFileSync(join(root, "src/lib/pets/bees.ts"), "utf8");
const hiveDenSrc = readFileSync(join(root, "src/components/desk/hive-den.tsx"), "utf8");
const pondSrc = readFileSync(join(root, "src/lib/pets/pond.ts"), "utf8");

const EXPECTED = [
  ["paramecium", "boot", "Paramecium caudatum"],
  ["amoeba", "reach", "Amoeba proteus"],
  ["euglena", "spot", "Euglena gracilis"],
  ["volvox", "orb", "Volvox aureus"],
  ["diatom", "pane", "Navicula"],
  ["kelp", "hold", "Macrocystis pyrifera"],
  ["chlamydomonas", "spin", "Chlamydomonas reinhardtii"],
  ["stentor", "bell", "Stentor coeruleus"],
  ["coli", "rod", "Escherichia coli"],
  ["haloarchaea", "rose", "Halobacterium salinarum"],
];

function quotedKeys(src) {
  return [...src.matchAll(/key:\s*"([a-z_]+)"/g)].map((m) => m[1]);
}

test("the well lists the same ten guests as the roster", () => {
  const rosterKeys = quotedKeys(wellSrc);
  const guideKeys = [...guideSrc.matchAll(/entry\(\s*"([a-z_]+)"/g)].map((m) => m[1]);
  assert.deepEqual(rosterKeys, EXPECTED.map(([key]) => key));
  assert.deepEqual(guideKeys, rosterKeys);
  assert.equal(guideKeys.length, 10);
});

test("each guide entry has a tell, a mix-up, a lesson, and the latin name", () => {
  for (const [key, slug, latin] of EXPECTED) {
    assert.match(guideSrc, new RegExp(`entry\\(\\s*"${key}"`));
    assert.match(wellSrc, new RegExp(`slug:\\s*"${slug}"`));
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
  const paramecium = guideSrc.slice(guideSrc.indexOf('"paramecium"'), guideSrc.indexOf('"amoeba"'));
  const amoeba = guideSrc.slice(guideSrc.indexOf('"amoeba"'), guideSrc.indexOf('"euglena"'));
  const euglena = guideSrc.slice(guideSrc.indexOf('"euglena"'), guideSrc.indexOf('"volvox"'));
  const volvox = guideSrc.slice(guideSrc.indexOf('"volvox"'), guideSrc.indexOf('"diatom"'));
  const diatom = guideSrc.slice(guideSrc.indexOf('"diatom"'), guideSrc.indexOf('"kelp"'));
  const kelp = guideSrc.slice(guideSrc.indexOf('"kelp"'), guideSrc.indexOf('"chlamydomonas"'));
  const chlamydomonas = guideSrc.slice(guideSrc.indexOf('"chlamydomonas"'), guideSrc.indexOf('"stentor"'));
  const stentor = guideSrc.slice(guideSrc.indexOf('"stentor"'), guideSrc.indexOf('"coli"'));
  const coli = guideSrc.slice(guideSrc.indexOf('"coli"'), guideSrc.indexOf('"haloarchaea"'));
  const haloarchaea = guideSrc.slice(guideSrc.indexOf('"haloarchaea"'));
  assert.match(paramecium, /not an animal/i);
  assert.match(paramecium, /Reed/);
  assert.match(amoeba, /not a blob/i);
  assert.match(euglena, /not a plant/i);
  assert.match(euglena, /Felt/);
  assert.match(volvox, /not one creature/i);
  assert.match(volvox, /Pact/);
  assert.match(diatom, /not Gleam/i);
  assert.match(diatom, /far den/i);
  assert.match(kelp, /not Felt/i);
  assert.match(kelp, /not a garden plant/i);
  assert.match(chlamydomonas, /not a land plant/i);
  assert.match(chlamydomonas, /Mast/);
  assert.match(stentor, /not a worm/i);
  assert.match(stentor, /Slip/);
  assert.match(stentor, /Latch/);
  assert.match(coli, /not a fungus/i);
  assert.match(coli, /Starter/);
  assert.match(haloarchaea, /not a bacterium/i);
  assert.match(haloarchaea, /Brine/);
});

test("the well page is a field guide, not a costume party", () => {
  assert.match(denSrc, /createFileRoute\("\/well"\)/);
  assert.match(denSrc, /WellDen/);
  assert.match(denSrc, /SpeciesPlaque/);
  assert.match(denSrc, /\/demo\/\$slug/);
  assert.match(denSrc, /WELL_GUIDE\.map/);
  assert.match(denSrc, /a paramecium is not an animal/i);
  assert.doesNotMatch(denSrc, /axolotl/i);
  assert.doesNotMatch(denSrc, /slime/i);
});

test("the catalog and living roster include the ten well keys", () => {
  for (const [key] of EXPECTED) {
    assert.match(catalogSrc, new RegExp(`key:\\s*"${key}"`));
  }
  assert.match(rosterSrc, /WELL_ROSTER/);
  assert.doesNotMatch(wellSrc, /slug:\s*"bloom"/);
  assert.doesNotMatch(wellSrc, /key:\s*"axolotl"/);
  assert.doesNotMatch(wellSrc, /key:\s*"yeast"/);
  assert.doesNotMatch(wellSrc, /key:\s*"lichen"/);
  assert.doesNotMatch(guideSrc, /Wikipedia/i);
});

test("the hive files and pond roster stay as they were", () => {
  assert.doesNotMatch(beesSrc, /paramecium|amoeba|euglena|volvox|diatom|kelp|chlamydomonas|stentor|coli|haloarchaea/);
  assert.doesNotMatch(hiveDenSrc, /WellDen|WELL_KEYS|\/well/);
  assert.match(pondSrc, /key:\s*"frog"/);
  assert.match(pondSrc, /slug:\s*"reed"/);
  assert.doesNotMatch(pondSrc, /paramecium|kelp|haloarchaea/);
});
