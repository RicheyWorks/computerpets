import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const logSrc = readFileSync(join(root, "src/lib/pets/log.ts"), "utf8");
const guideSrc = readFileSync(join(root, "src/lib/pets/log-guide.ts"), "utf8");
const denSrc = readFileSync(join(root, "src/routes/log.tsx"), "utf8");
const catalogSrc = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");
const rosterSrc = readFileSync(join(root, "src/lib/pets/roster.ts"), "utf8");
const roomsSrc = readFileSync(join(root, "src/lib/pets/rooms.ts"), "utf8");
const beesSrc = readFileSync(join(root, "src/lib/pets/bees.ts"), "utf8");
const hiveDenSrc = readFileSync(join(root, "src/components/desk/hive-den.tsx"), "utf8");
const insectsSrc = readFileSync(join(root, "src/lib/pets/insects.ts"), "utf8");
const pondSrc = readFileSync(join(root, "src/lib/pets/pond.ts"), "utf8");
const pondDenSrc = readFileSync(join(root, "src/components/desk/pond-den.tsx"), "utf8");
const roostSrc = readFileSync(join(root, "src/lib/pets/roost.ts"), "utf8");
const roostDenSrc = readFileSync(join(root, "src/components/desk/roost-den.tsx"), "utf8");
const cornerSrc = readFileSync(join(root, "src/lib/pets/corner.ts"), "utf8");
const cornerDenSrc = readFileSync(join(root, "src/components/desk/corner-den.tsx"), "utf8");
const woodSrc = readFileSync(join(root, "src/lib/pets/wood.ts"), "utf8");
const woodDenSrc = readFileSync(join(root, "src/components/desk/wood-den.tsx"), "utf8");
const stoneSrc = readFileSync(join(root, "src/lib/pets/stone.ts"), "utf8");
const stoneDenSrc = readFileSync(join(root, "src/components/desk/stone-den.tsx"), "utf8");
const creekSrc = readFileSync(join(root, "src/lib/pets/creek.ts"), "utf8");
const creekDenSrc = readFileSync(join(root, "src/components/desk/creek-den.tsx"), "utf8");
const wellSrc = readFileSync(join(root, "src/lib/pets/well.ts"), "utf8");

const EXPECTED = [
  ["house_centipede", "haste", "Scutigera coleoptrata"],
  ["millipede", "link", "Narceus americanus"],
  ["pillbug", "armor", "Armadillidium vulgare"],
  ["earthworm", "cast", "Lumbricus terrestris"],
  ["velvet_worm", "jet", "Euperipatoides rowelli"],
  ["springtail", "hop", "Orchesella cincta"],
  ["tardigrade", "tun", "Hypsibius exemplaris"],
  ["planarian", "half", "Girardia tigrina"],
  ["nematode", "thread", "Caenorhabditis elegans"],
  ["amphipod", "scud", "Gammarus minus"],
];

function quotedKeys(src) {
  return [...src.matchAll(/key:\s*"([a-z_]+)"/g)].map((m) => m[1]);
}

test("the log lists the same ten guests as the roster", () => {
  const rosterKeys = quotedKeys(logSrc);
  const guideKeys = [...guideSrc.matchAll(/entry\(\s*"([a-z_]+)"/g)].map((m) => m[1]);
  assert.deepEqual(rosterKeys, EXPECTED.map(([key]) => key));
  assert.deepEqual(guideKeys, rosterKeys);
  assert.equal(guideKeys.length, 10);
});

test("each guide entry has a tell, a mix-up, a lesson, and the latin name", () => {
  for (const [key, slug, latin] of EXPECTED) {
    assert.match(guideSrc, new RegExp(`entry\\(\\s*"${key}"`));
    assert.match(logSrc, new RegExp(`slug:\\s*"${slug}"`));
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
  const haste = guideSrc.slice(guideSrc.indexOf('"house_centipede"'), guideSrc.indexOf('"millipede"'));
  const millipede = guideSrc.slice(guideSrc.indexOf('"millipede"'), guideSrc.indexOf('"pillbug"'));
  const pillbug = guideSrc.slice(guideSrc.indexOf('"pillbug"'), guideSrc.indexOf('"earthworm"'));
  const earthworm = guideSrc.slice(guideSrc.indexOf('"earthworm"'), guideSrc.indexOf('"velvet_worm"'));
  const velvet = guideSrc.slice(guideSrc.indexOf('"velvet_worm"'), guideSrc.indexOf('"springtail"'));
  const springtail = guideSrc.slice(guideSrc.indexOf('"springtail"'), guideSrc.indexOf('"tardigrade"'));
  const tardigrade = guideSrc.slice(guideSrc.indexOf('"tardigrade"'), guideSrc.indexOf('"planarian"'));
  const planarian = guideSrc.slice(guideSrc.indexOf('"planarian"'), guideSrc.indexOf('"nematode"'));
  const nematode = guideSrc.slice(guideSrc.indexOf('"nematode"'), guideSrc.indexOf('"amphipod"'));
  const amphipod = guideSrc.slice(guideSrc.indexOf('"amphipod"'));
  assert.match(haste, /not a millipede/i);
  assert.match(haste, /Link/);
  assert.match(haste, /not an insect/i);
  assert.match(haste, /fifteen pairs/i);
  assert.match(millipede, /not a centipede/i);
  assert.match(millipede, /Haste/);
  assert.match(millipede, /oil/i);
  assert.match(pillbug, /not an insect/i);
  assert.match(pillbug, /Comb/);
  assert.match(pillbug, /not Pinch/i);
  assert.match(pillbug, /crustacean/i);
  assert.match(earthworm, /not a snake/i);
  assert.match(earthworm, /Sash/);
  assert.match(earthworm, /not Slip/i);
  assert.match(earthworm, /not Latch/i);
  assert.match(velvet, /not a millipede/i);
  assert.match(velvet, /not Link/i);
  assert.match(velvet, /onychophoran/i);
  assert.match(velvet, /not Dew/i);
  assert.match(springtail, /not an insect/i);
  assert.match(springtail, /not a flea/i);
  assert.match(springtail, /not Comb/i);
  assert.match(springtail, /furcula/i);
  assert.match(tardigrade, /not a bear/i);
  assert.match(tardigrade, /not Coal/i);
  assert.match(tardigrade, /tun/i);
  assert.match(planarian, /not a leech/i);
  assert.match(planarian, /Latch/);
  assert.match(planarian, /split/i);
  assert.match(nematode, /not Cast/i);
  assert.match(nematode, /not an earthworm/i);
  assert.match(amphipod, /not Pinch/i);
  assert.match(amphipod, /not a pillbug/i);
  assert.match(amphipod, /side/i);
});

test("the log page is a field guide, not a costume party", () => {
  assert.match(denSrc, /createFileRoute\("\/log"\)/);
  assert.match(denSrc, /LogDen/);
  assert.match(denSrc, /SpeciesPlaque/);
  assert.match(denSrc, /\/demo\/\$slug/);
  assert.match(denSrc, /LOG_GUIDE\.map/);
  assert.match(denSrc, /a millipede is not a centipede/i);
  assert.match(denSrc, /a pillbug is not an insect/i);
  assert.doesNotMatch(denSrc, /axolotl/i);
  assert.doesNotMatch(denSrc, /Wikipedia/i);
  assert.doesNotMatch(denSrc, /NFT/i);
});

test("the catalog and living roster include the ten log keys", () => {
  for (const [key] of EXPECTED) {
    assert.match(catalogSrc, new RegExp(`key:\\s*"${key}"`));
  }
  assert.match(rosterSrc, /LOG_ROSTER/);
  assert.doesNotMatch(logSrc, /slug:\s*"dew"/);
  assert.doesNotMatch(logSrc, /name:\s*"Dew"/);
  assert.doesNotMatch(logSrc, /key:\s*"honeybee"/);
  assert.doesNotMatch(logSrc, /key:\s*"leech"/);
  assert.doesNotMatch(guideSrc, /Wikipedia/i);
  assert.doesNotMatch(logSrc, /name:\s*"Comb"/);
  assert.doesNotMatch(logSrc, /name:\s*"Loom"/);
  assert.doesNotMatch(logSrc, /name:\s*"Latch"/);
  assert.doesNotMatch(logSrc, /name:\s*"Slip"/);
  assert.doesNotMatch(logSrc, /name:\s*"Felt"/);
  assert.doesNotMatch(logSrc, /name:\s*"Coal"/);
  assert.doesNotMatch(logSrc, /name:\s*"Lance"/);
  assert.doesNotMatch(logSrc, /name:\s*"Pinch"/);
});

test("rooms.ts only adds a log room", () => {
  assert.match(roomsSrc, /id:\s*"log"/);
  assert.match(roomsSrc, /watchSlug:\s*"haste"/);
  assert.match(roomsSrc, /watchName:\s*"Haste"/);
  assert.match(roomsSrc, /Ten under the log\. A millipede is not a centipede\. A pillbug is not an insect\./);
  assert.match(roomsSrc, /isLog/);
  assert.match(roomsSrc, /id:\s*"creek"/);
  assert.match(roomsSrc, /id:\s*"pond"/);
  assert.match(roomsSrc, /watchSlug:\s*"lunge"/);
  assert.match(roomsSrc, /watchSlug:\s*"reed"/);
});

test("the hive, pond, roost, corner, wood, stone, creek, and well files stay as they were", () => {
  assert.doesNotMatch(beesSrc, /house_centipede|millipede|pillbug|velvet_worm|tardigrade/);
  assert.doesNotMatch(insectsSrc, /house_centipede|millipede|pillbug|velvet_worm|tardigrade/);
  assert.doesNotMatch(hiveDenSrc, /LogDen|LOG_KEYS|\/log/);
  assert.doesNotMatch(pondSrc, /house_centipede|millipede|velvet_worm|tardigrade/);
  assert.doesNotMatch(pondDenSrc, /LogDen|LOG_KEYS|\/log/);
  assert.doesNotMatch(roostSrc, /house_centipede|millipede|velvet_worm|tardigrade/);
  assert.doesNotMatch(roostDenSrc, /LogDen|LOG_KEYS|\/log/);
  assert.doesNotMatch(cornerSrc, /house_centipede|millipede|velvet_worm|tardigrade/);
  assert.doesNotMatch(cornerDenSrc, /LogDen|LOG_KEYS|\/log/);
  assert.doesNotMatch(woodSrc, /house_centipede|millipede|velvet_worm|tardigrade/);
  assert.doesNotMatch(woodDenSrc, /LogDen|LOG_KEYS|\/log/);
  assert.doesNotMatch(stoneSrc, /house_centipede|millipede|velvet_worm|tardigrade/);
  assert.doesNotMatch(stoneDenSrc, /LogDen|LOG_KEYS|\/log/);
  assert.doesNotMatch(creekSrc, /house_centipede|millipede|velvet_worm|tardigrade/);
  assert.doesNotMatch(creekDenSrc, /LogDen|LOG_KEYS|\/log/);
  assert.doesNotMatch(wellSrc, /house_centipede|millipede|velvet_worm|tardigrade/);
});
