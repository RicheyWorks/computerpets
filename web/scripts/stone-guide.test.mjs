import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const stoneSrc = readFileSync(join(root, "src/lib/pets/stone.ts"), "utf8");
const guideSrc = readFileSync(join(root, "src/lib/pets/stone-guide.ts"), "utf8");
const denSrc = readFileSync(join(root, "src/routes/stone.tsx"), "utf8");
const catalogSrc = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");
const rosterSrc = readFileSync(join(root, "src/lib/pets/roster.ts"), "utf8");
const roomsSrc = readFileSync(join(root, "src/lib/pets/rooms.ts"), "utf8");
const beesSrc = readFileSync(join(root, "src/lib/pets/bees.ts"), "utf8");
const hiveDenSrc = readFileSync(join(root, "src/components/desk/hive-den.tsx"), "utf8");
const pondSrc = readFileSync(join(root, "src/lib/pets/pond.ts"), "utf8");
const pondDenSrc = readFileSync(join(root, "src/components/desk/pond-den.tsx"), "utf8");
const roostSrc = readFileSync(join(root, "src/lib/pets/roost.ts"), "utf8");
const roostDenSrc = readFileSync(join(root, "src/components/desk/roost-den.tsx"), "utf8");
const cornerSrc = readFileSync(join(root, "src/lib/pets/corner.ts"), "utf8");
const cornerDenSrc = readFileSync(join(root, "src/components/desk/corner-den.tsx"), "utf8");
const woodSrc = readFileSync(join(root, "src/lib/pets/wood.ts"), "utf8");
const woodDenSrc = readFileSync(join(root, "src/components/desk/wood-den.tsx"), "utf8");
const wellSrc = readFileSync(join(root, "src/lib/pets/well.ts"), "utf8");
const snakesSrc = readFileSync(join(root, "src/lib/pets/snakes.ts"), "utf8");

const EXPECTED = [
  ["gecko", "pad", "Hemidactylus turcicus"],
  ["anole", "wink", "Anolis carolinensis"],
  ["skink", "dash", "Plestiodon fasciatus"],
  ["chameleon", "shift", "Chamaeleo calyptratus"],
  ["horned_lizard", "spike", "Phrynosoma cornutum"],
  ["alligator", "levee", "Alligator mississippiensis"],
  ["crocodile", "jaw", "Crocodylus acutus"],
  ["snapper", "beak", "Chelydra serpentina"],
  ["box_turtle", "lid", "Terrapene carolina"],
  ["tuatara", "peak", "Sphenodon punctatus"],
];

function quotedKeys(src) {
  return [...src.matchAll(/key:\s*"([a-z_]+)"/g)].map((m) => m[1]);
}

test("the stone lists the same ten guests as the roster", () => {
  const rosterKeys = quotedKeys(stoneSrc);
  const guideKeys = [...guideSrc.matchAll(/entry\(\s*"([a-z_]+)"/g)].map((m) => m[1]);
  assert.deepEqual(rosterKeys, EXPECTED.map(([key]) => key));
  assert.deepEqual(guideKeys, rosterKeys);
  assert.equal(guideKeys.length, 10);
});

test("each guide entry has a tell, a mix-up, a lesson, and the latin name", () => {
  for (const [key, slug, latin] of EXPECTED) {
    assert.match(guideSrc, new RegExp(`entry\\(\\s*"${key}"`));
    assert.match(stoneSrc, new RegExp(`slug:\\s*"${slug}"`));
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
  const gecko = guideSrc.slice(guideSrc.indexOf('"gecko"'), guideSrc.indexOf('"anole"'));
  const anole = guideSrc.slice(guideSrc.indexOf('"anole"'), guideSrc.indexOf('"skink"'));
  const skink = guideSrc.slice(guideSrc.indexOf('"skink"'), guideSrc.indexOf('"chameleon"'));
  const chameleon = guideSrc.slice(guideSrc.indexOf('"chameleon"'), guideSrc.indexOf('"horned_lizard"'));
  const horned = guideSrc.slice(guideSrc.indexOf('"horned_lizard"'), guideSrc.indexOf('"alligator"'));
  const alligator = guideSrc.slice(guideSrc.indexOf('"alligator"'), guideSrc.indexOf('"crocodile"'));
  const crocodile = guideSrc.slice(guideSrc.indexOf('"crocodile"'), guideSrc.indexOf('"snapper"'));
  const snapper = guideSrc.slice(guideSrc.indexOf('"snapper"'), guideSrc.indexOf('"box_turtle"'));
  const box = guideSrc.slice(guideSrc.indexOf('"box_turtle"'), guideSrc.indexOf('"tuatara"'));
  const tuatara = guideSrc.slice(guideSrc.indexOf('"tuatara"'));
  assert.match(gecko, /not a salamander/i);
  assert.match(gecko, /Dapple/);
  assert.match(gecko, /Toe pads|pads/i);
  assert.match(anole, /not a chameleon/i);
  assert.match(anole, /Shift/);
  assert.match(anole, /dewlap/i);
  assert.match(skink, /not a snake/i);
  assert.match(skink, /Sash/);
  assert.match(chameleon, /not Wink/i);
  assert.match(chameleon, /not Sol/i);
  assert.match(horned, /not a toad/i);
  assert.match(horned, /Pebble/);
  assert.match(horned, /Horn/);
  assert.match(alligator, /not a crocodile/i);
  assert.match(alligator, /Jaw/);
  assert.match(crocodile, /not an alligator/i);
  assert.match(crocodile, /Levee/);
  assert.match(snapper, /not Ink/i);
  assert.match(snapper, /not a tortoise/i);
  assert.match(box, /not Ink/i);
  assert.match(box, /not Hinge/i);
  assert.match(tuatara, /not a lizard/i);
  assert.match(tuatara, /not Sol/i);
  assert.match(tuatara, /own order/i);
});

test("the stone page is a field guide, not a costume party", () => {
  assert.match(denSrc, /createFileRoute\("\/stone"\)/);
  assert.match(denSrc, /StoneDen/);
  assert.match(denSrc, /SpeciesPlaque/);
  assert.match(denSrc, /\/demo\/\$slug/);
  assert.match(denSrc, /STONE_GUIDE\.map/);
  assert.match(denSrc, /a tuatara is not a lizard/i);
  assert.match(denSrc, /an alligator is not a crocodile/i);
  assert.doesNotMatch(denSrc, /axolotl/i);
  assert.doesNotMatch(denSrc, /Wikipedia/i);
  assert.doesNotMatch(denSrc, /NFT/i);
});

test("the catalog and living roster include the ten stone keys", () => {
  for (const [key] of EXPECTED) {
    assert.match(catalogSrc, new RegExp(`key:\\s*"${key}"`));
  }
  assert.match(rosterSrc, /STONE_ROSTER/);
  assert.doesNotMatch(stoneSrc, /slug:\s*"bloom"/);
  assert.doesNotMatch(stoneSrc, /key:\s*"axolotl"/);
  assert.doesNotMatch(stoneSrc, /key:\s*"honeybee"/);
  assert.doesNotMatch(stoneSrc, /key:\s*"red_panda"/);
  assert.doesNotMatch(guideSrc, /Wikipedia/i);
  assert.doesNotMatch(stoneSrc, /name:\s*"Sol"/);
  assert.doesNotMatch(stoneSrc, /name:\s*"Vesper"/);
  assert.doesNotMatch(stoneSrc, /name:\s*"Ink"/);
  assert.doesNotMatch(stoneSrc, /name:\s*"Hinge"/);
  assert.doesNotMatch(stoneSrc, /name:\s*"Horn"/);
  assert.doesNotMatch(stoneSrc, /name:\s*"Bank"/);
  assert.doesNotMatch(stoneSrc, /name:\s*"Sash"/);
  assert.doesNotMatch(stoneSrc, /name:\s*"Dapple"/);
});

test("rooms.ts only adds a stone room", () => {
  assert.match(roomsSrc, /id:\s*"stone"/);
  assert.match(roomsSrc, /watchSlug:\s*"pad"/);
  assert.match(roomsSrc, /watchName:\s*"Pad"/);
  assert.match(roomsSrc, /Ten of the stone\. A tuatara is not a lizard\. An alligator is not a crocodile\./);
  assert.match(roomsSrc, /isStone/);
  assert.match(roomsSrc, /id:\s*"wood"/);
  assert.match(roomsSrc, /id:\s*"corner"/);
  assert.match(roomsSrc, /id:\s*"roost"/);
  assert.match(roomsSrc, /id:\s*"well"/);
  assert.match(roomsSrc, /watchSlug:\s*"boot"/);
});

test("the hive, pond, roost, corner, wood, well, and snake files stay as they were", () => {
  assert.doesNotMatch(beesSrc, /gecko|anole|skink|chameleon|tuatara|alligator|crocodile/);
  assert.doesNotMatch(hiveDenSrc, /StoneDen|STONE_KEYS|\/stone/);
  assert.doesNotMatch(pondSrc, /gecko|anole|skink|chameleon|tuatara/);
  assert.doesNotMatch(pondDenSrc, /StoneDen|STONE_KEYS|\/stone/);
  assert.doesNotMatch(roostSrc, /gecko|anole|skink|chameleon|tuatara/);
  assert.doesNotMatch(roostDenSrc, /StoneDen|STONE_KEYS|\/stone/);
  assert.doesNotMatch(cornerSrc, /gecko|anole|skink|chameleon|tuatara/);
  assert.doesNotMatch(cornerDenSrc, /StoneDen|STONE_KEYS|\/stone/);
  assert.doesNotMatch(woodSrc, /gecko|anole|skink|chameleon|tuatara/);
  assert.doesNotMatch(woodDenSrc, /StoneDen|STONE_KEYS|\/stone/);
  assert.doesNotMatch(wellSrc, /gecko|anole|skink|chameleon|tuatara/);
  assert.doesNotMatch(snakesSrc, /gecko|anole|skink|chameleon|tuatara/);
});
