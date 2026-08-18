import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const insectSrc = readFileSync(join(root, "src/lib/pets/insects.ts"), "utf8");
const guideSrc = readFileSync(join(root, "src/lib/pets/insect-guide.ts"), "utf8");
const denSrc = readFileSync(join(root, "src/routes/hive.tsx"), "utf8");
const catalogSrc = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");
const rosterSrc = readFileSync(join(root, "src/lib/pets/roster.ts"), "utf8");

const EXPECTED = [
  ["honeybee", "comb", "Apis mellifera"],
  ["monarch", "milk", "Danaus plexippus"],
  ["luna", "ghost", "Actias luna"],
  ["firefly", "spark", "Photinus pyralis"],
  ["darner", "dart", "Anax junius"],
  ["stick", "twig", "Diapheromera femorata"],
  ["carpenter_ant", "column", "Camponotus pennsylvanicus"],
  ["ladybird", "seven", "Coccinella septempunctata"],
  ["mantis", "fold", "Tenodera sinensis"],
  ["cicada", "brood", "Magicicada septendecim"],
];

function quotedKeys(src) {
  return [...src.matchAll(/key:\s*"([a-z_]+)"/g)].map((m) => m[1]);
}

test("the hive lists the same ten insects as the roster", () => {
  const rosterKeys = quotedKeys(insectSrc);
  const guideKeys = [...guideSrc.matchAll(/entry\(\s*"([a-z_]+)"/g)].map((m) => m[1]);
  assert.deepEqual(rosterKeys, EXPECTED.map(([key]) => key));
  assert.deepEqual(guideKeys, rosterKeys);
  assert.equal(guideKeys.length, 10);
});

test("each guide entry has a tell, a mix-up, a lesson, and the latin name", () => {
  for (const [key, slug, latin] of EXPECTED) {
    assert.match(guideSrc, new RegExp(`entry\\(\\s*"${key}"`));
    assert.match(insectSrc, new RegExp(`slug:\\s*"${slug}"`));
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
  const bee = guideSrc.slice(guideSrc.indexOf('"honeybee"'), guideSrc.indexOf('"monarch"'));
  const monarch = guideSrc.slice(guideSrc.indexOf('"monarch"'), guideSrc.indexOf('"luna"'));
  const luna = guideSrc.slice(guideSrc.indexOf('"luna"'), guideSrc.indexOf('"firefly"'));
  const firefly = guideSrc.slice(guideSrc.indexOf('"firefly"'), guideSrc.indexOf('"darner"'));
  const darner = guideSrc.slice(guideSrc.indexOf('"darner"'), guideSrc.indexOf('"stick"'));
  const stick = guideSrc.slice(guideSrc.indexOf('"stick"'), guideSrc.indexOf('"carpenter_ant"'));
  const ant = guideSrc.slice(guideSrc.indexOf('"carpenter_ant"'), guideSrc.indexOf('"ladybird"'));
  const lady = guideSrc.slice(guideSrc.indexOf('"ladybird"'), guideSrc.indexOf('"mantis"'));
  const mantis = guideSrc.slice(guideSrc.indexOf('"mantis"'), guideSrc.indexOf('"cicada"'));
  const cicada = guideSrc.slice(guideSrc.indexOf('"cicada"'));
  assert.match(bee, /dance/i);
  assert.match(bee, /map/i);
  assert.match(monarch, /milkweed/i);
  assert.match(monarch, /warning/i);
  assert.match(luna, /no mouth/i);
  assert.match(luna, /does not eat/i);
  assert.match(luna, /not a monarch/i);
  assert.match(firefly, /beetle/i);
  assert.match(firefly, /not a fly/i);
  assert.match(darner, /nymph/i);
  assert.match(darner, /water/i);
  assert.match(stick, /furniture/i);
  assert.match(stick, /walk/i);
  assert.match(ant, /does not eat the house/i);
  assert.match(ant, /nests/i);
  assert.match(lady, /seven/i);
  assert.match(lady, /aphid/i);
  assert.match(lady, /beetle/i);
  assert.match(mantis, /prayer is a trap/i);
  assert.match(mantis, /not a plant/i);
  assert.match(cicada, /seventeen/i);
  assert.match(cicada, /song/i);
});

test("the hive page is a field guide, not a portrait catalog", () => {
  assert.match(denSrc, /createFileRoute\("\/hive"\)/);
  assert.match(denSrc, /HiveDen/);
  assert.match(denSrc, /SpeciesPlaque/);
  assert.match(denSrc, /\/demo\/\$slug/);
  assert.match(denSrc, /INSECT_GUIDE\.map/);
});

test("the catalog and living roster include the ten insect keys", () => {
  for (const [key] of EXPECTED) {
    assert.match(catalogSrc, new RegExp(`key:\\s*"${key}"`));
  }
  assert.match(rosterSrc, /INSECT_ROSTER/);
  assert.doesNotMatch(insectSrc, /slug:\s*"ink"/);
  assert.doesNotMatch(insectSrc, /spider/i);
  assert.doesNotMatch(guideSrc, /spider/i);
});
