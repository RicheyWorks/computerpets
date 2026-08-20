import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const farSrc = readFileSync(join(root, "src/lib/pets/far.ts"), "utf8");
const guideSrc = readFileSync(join(root, "src/lib/pets/far-guide.ts"), "utf8");
const denSrc = readFileSync(join(root, "src/routes/far.tsx"), "utf8");
const catalogSrc = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");
const rosterSrc = readFileSync(join(root, "src/lib/pets/roster.ts"), "utf8");

const EXPECTED = [
  ["photovore", "gleam", "Lucivora sitim"],
  ["choir", "choir", "Harmonia plexus"],
  ["nimbus", "drift", "Nimbus methanei"],
  ["silica", "shard", "Silica crescit"],
  ["terminator", "dusk", "Limitor cursor"],
  ["nexus", "knot", "Nexus colonis"],
  ["halovore", "brine", "Halovora brina"],
  ["magneton", "beacon", "Magneton natare"],
  ["umbral", "hush", "Umbralentis quietis"],
  ["cyst", "arca", "Arca vagans"],
];

function quotedKeys(src) {
  return [...src.matchAll(/key:\s*"([a-z_]+)"/g)].map((m) => m[1]);
}

test("the far den lists the same ten guests as the roster", () => {
  const rosterKeys = quotedKeys(farSrc);
  const guideKeys = [...guideSrc.matchAll(/entry\(\s*"([a-z_]+)"/g)].map((m) => m[1]);
  assert.deepEqual(rosterKeys, EXPECTED.map(([key]) => key));
  assert.deepEqual(guideKeys, rosterKeys);
  assert.equal(guideKeys.length, 10);
});

test("each guide entry has a tell, a mix-up, a lesson, and the latin name", () => {
  for (const [key, slug, latin] of EXPECTED) {
    assert.match(guideSrc, new RegExp(`entry\\(\\s*"${key}"`));
    assert.match(farSrc, new RegExp(`slug:\\s*"${slug}"`));
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
  const gleam = guideSrc.slice(guideSrc.indexOf('"photovore"'), guideSrc.indexOf('"choir"'));
  const choir = guideSrc.slice(guideSrc.indexOf('"choir"'), guideSrc.indexOf('"nimbus"'));
  const drift = guideSrc.slice(guideSrc.indexOf('"nimbus"'), guideSrc.indexOf('"silica"'));
  const shard = guideSrc.slice(guideSrc.indexOf('"silica"'), guideSrc.indexOf('"terminator"'));
  const dusk = guideSrc.slice(guideSrc.indexOf('"terminator"'), guideSrc.indexOf('"nexus"'));
  const knot = guideSrc.slice(guideSrc.indexOf('"nexus"'), guideSrc.indexOf('"halovore"'));
  const brine = guideSrc.slice(guideSrc.indexOf('"halovore"'), guideSrc.indexOf('"magneton"'));
  const beacon = guideSrc.slice(guideSrc.indexOf('"magneton"'), guideSrc.indexOf('"umbral"'));
  const hush = guideSrc.slice(guideSrc.indexOf('"umbral"'), guideSrc.indexOf('"cyst"'));
  const arca = guideSrc.slice(guideSrc.indexOf('"cyst"'));
  assert.match(gleam, /wavelength/i);
  assert.match(gleam, /not a firefly/i);
  assert.match(gleam, /Spark/);
  assert.match(choir, /one animal/i);
  assert.match(choir, /not a whale/i);
  assert.match(drift, /air is the water/i);
  assert.match(drift, /not a jellyfish/i);
  assert.match(drift, /Pulse/);
  assert.match(shard, /mineral/i);
  assert.match(shard, /not quartz/i);
  assert.match(shard, /not a plant/i);
  assert.match(dusk, /rim is the country/i);
  assert.match(dusk, /not a cat/i);
  assert.match(knot, /many animals/i);
  assert.match(knot, /one name/i);
  assert.match(knot, /siphonophore/i);
  assert.match(brine, /water is optional/i);
  assert.match(brine, /not a crab/i);
  assert.match(brine, /Ledger/);
  assert.match(beacon, /north is food/i);
  assert.match(beacon, /not a compass/i);
  assert.match(beacon, /Kite/);
  assert.match(hush, /cool is lunch/i);
  assert.match(hush, /not a moth/i);
  assert.match(hush, /orchid/i);
  assert.match(arca, /wait/i);
  assert.match(arca, /not Brood/i);
  assert.match(arca, /cicada/i);
});

test("the far page is a field guide, not a costume party", () => {
  assert.match(denSrc, /createFileRoute\("\/far"\)/);
  assert.match(denSrc, /FarDen/);
  assert.match(denSrc, /SpeciesPlaque/);
  assert.match(denSrc, /\/demo\/\$slug/);
  assert.match(denSrc, /FAR_GUIDE\.map/);
  assert.doesNotMatch(denSrc, /Star Wars|Trek|Jedi|Vulcan/i);
});

test("the catalog and living roster include the ten far keys", () => {
  for (const [key] of EXPECTED) {
    assert.match(catalogSrc, new RegExp(`key:\\s*"${key}"`));
  }
  assert.match(rosterSrc, /FAR_ROSTER/);
  assert.doesNotMatch(farSrc, /slug:\s*"ink"/);
  assert.doesNotMatch(farSrc, /slug:\s*"ember"/);
  assert.doesNotMatch(farSrc, /slug:\s*"spark"/);
  assert.doesNotMatch(farSrc, /slug:\s*"brood"/);
  assert.doesNotMatch(guideSrc, /slime mold/i);
  assert.doesNotMatch(guideSrc, /Star Wars/i);
  assert.doesNotMatch(guideSrc, /Vulcan/i);
});
