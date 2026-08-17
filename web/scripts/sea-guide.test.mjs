import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const seaSrc = readFileSync(join(root, "src/lib/pets/sea.ts"), "utf8");
const guideSrc = readFileSync(join(root, "src/lib/pets/sea-guide.ts"), "utf8");
const denSrc = readFileSync(join(root, "src/routes/sea.tsx"), "utf8");
const catalogSrc = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");
const rosterSrc = readFileSync(join(root, "src/lib/pets/roster.ts"), "utf8");

const EXPECTED = [
  ["octopus", "cup", "Octopus vulgaris"],
  ["cuttlefish", "sepia", "Sepia officinalis"],
  ["nautilus", "chamber", "Nautilus pompilius"],
  ["moon_jelly", "bell", "Aurelia aurita"],
  ["sea_star", "ochre", "Pisaster ochraceus"],
  ["hermit_crab", "tenant", "Pagurus bernhardus"],
  ["horseshoe_crab", "ledger", "Limulus polyphemus"],
  ["seahorse", "anchor", "Hippocampus erectus"],
  ["manta", "kite", "Mobula alfredi"],
  ["moray", "door", "Gymnothorax funebris"],
];

function quotedKeys(src) {
  return [...src.matchAll(/key:\s*"([a-z_]+)"/g)].map((m) => m[1]);
}

test("the tide lists the same ten sea creatures as the roster", () => {
  const rosterKeys = quotedKeys(seaSrc);
  const guideKeys = [...guideSrc.matchAll(/entry\(\s*"([a-z_]+)"/g)].map((m) => m[1]);
  assert.deepEqual(rosterKeys, EXPECTED.map(([key]) => key));
  assert.deepEqual(guideKeys, rosterKeys);
  assert.equal(guideKeys.length, 10);
});

test("each guide entry has a tell, a mix-up, a lesson, and the latin name", () => {
  for (const [key, slug, latin] of EXPECTED) {
    assert.match(guideSrc, new RegExp(`entry\\(\\s*"${key}"`));
    assert.match(seaSrc, new RegExp(`slug:\\s*"${slug}"`));
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
  const jelly = guideSrc.slice(guideSrc.indexOf('"moon_jelly"'), guideSrc.indexOf('"sea_star"'));
  const star = guideSrc.slice(guideSrc.indexOf('"sea_star"'), guideSrc.indexOf('"hermit_crab"'));
  const horseshoe = guideSrc.slice(guideSrc.indexOf('"horseshoe_crab"'), guideSrc.indexOf('"seahorse"'));
  const hermit = guideSrc.slice(guideSrc.indexOf('"hermit_crab"'), guideSrc.indexOf('"horseshoe_crab"'));
  const moray = guideSrc.slice(guideSrc.indexOf('"moray"'));
  assert.match(jelly, /not a fish/i);
  assert.match(star, /not a fish/i);
  assert.match(horseshoe, /not a crab/i);
  assert.match(horseshoe, /book-gills/i);
  assert.match(hermit, /Pagurus bernhardus/);
  assert.match(moray, /gape is breath/i);
});

test("the tide page is a field guide, not a portrait catalog", () => {
  assert.match(denSrc, /createFileRoute\("\/sea"\)/);
  assert.match(denSrc, /SeaDen/);
  assert.match(denSrc, /SpeciesPlaque/);
  assert.match(denSrc, /\/demo\/\$slug/);
  assert.match(denSrc, /SEA_GUIDE\.map/);
});

test("the catalog and living roster include the ten tide keys", () => {
  for (const [key] of EXPECTED) {
    assert.match(catalogSrc, new RegExp(`key:\\s*"${key}"`));
  }
  assert.match(rosterSrc, /SEA_ROSTER/);
  assert.doesNotMatch(seaSrc, /slug:\s*"ink"/);
});
