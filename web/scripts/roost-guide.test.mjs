import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const roostSrc = readFileSync(join(root, "src/lib/pets/roost.ts"), "utf8");
const guideSrc = readFileSync(join(root, "src/lib/pets/roost-guide.ts"), "utf8");
const denSrc = readFileSync(join(root, "src/routes/roost.tsx"), "utf8");
const catalogSrc = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");
const rosterSrc = readFileSync(join(root, "src/lib/pets/roster.ts"), "utf8");
const roomsSrc = readFileSync(join(root, "src/lib/pets/rooms.ts"), "utf8");
const beesSrc = readFileSync(join(root, "src/lib/pets/bees.ts"), "utf8");
const hiveDenSrc = readFileSync(join(root, "src/components/desk/hive-den.tsx"), "utf8");
const pondSrc = readFileSync(join(root, "src/lib/pets/pond.ts"), "utf8");
const pondDenSrc = readFileSync(join(root, "src/components/desk/pond-den.tsx"), "utf8");

const EXPECTED = [
  ["crow", "soot", "Corvus brachyrhynchos"],
  ["raven", "wedge", "Corvus corax"],
  ["barn_owl", "heart", "Tyto alba"],
  ["red_tail", "hook", "Buteo jamaicensis"],
  ["chickadee", "dee", "Poecile atricapillus"],
  ["robin", "brick", "Turdus migratorius"],
  ["mallard", "drake", "Anas platyrhynchos"],
  ["canada_goose", "vee", "Branta canadensis"],
  ["pileated", "drum", "Dryocopus pileatus"],
  ["hummingbird", "sip", "Archilochus colubris"],
];

function quotedKeys(src) {
  return [...src.matchAll(/key:\s*"([a-z_]+)"/g)].map((m) => m[1]);
}

test("the roost lists the same ten guests as the roster", () => {
  const rosterKeys = quotedKeys(roostSrc);
  const guideKeys = [...guideSrc.matchAll(/entry\(\s*"([a-z_]+)"/g)].map((m) => m[1]);
  assert.deepEqual(rosterKeys, EXPECTED.map(([key]) => key));
  assert.deepEqual(guideKeys, rosterKeys);
  assert.equal(guideKeys.length, 10);
});

test("each guide entry has a tell, a mix-up, a lesson, and the latin name", () => {
  for (const [key, slug, latin] of EXPECTED) {
    assert.match(guideSrc, new RegExp(`entry\\(\\s*"${key}"`));
    assert.match(roostSrc, new RegExp(`slug:\\s*"${slug}"`));
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
  const crow = guideSrc.slice(guideSrc.indexOf('"crow"'), guideSrc.indexOf('"raven"'));
  const raven = guideSrc.slice(guideSrc.indexOf('"raven"'), guideSrc.indexOf('"barn_owl"'));
  const owl = guideSrc.slice(guideSrc.indexOf('"barn_owl"'), guideSrc.indexOf('"red_tail"'));
  const hawk = guideSrc.slice(guideSrc.indexOf('"red_tail"'), guideSrc.indexOf('"chickadee"'));
  const chickadee = guideSrc.slice(guideSrc.indexOf('"chickadee"'), guideSrc.indexOf('"robin"'));
  const robin = guideSrc.slice(guideSrc.indexOf('"robin"'), guideSrc.indexOf('"mallard"'));
  const mallard = guideSrc.slice(guideSrc.indexOf('"mallard"'), guideSrc.indexOf('"canada_goose"'));
  const goose = guideSrc.slice(guideSrc.indexOf('"canada_goose"'), guideSrc.indexOf('"pileated"'));
  const pileated = guideSrc.slice(guideSrc.indexOf('"pileated"'), guideSrc.indexOf('"hummingbird"'));
  const hummingbird = guideSrc.slice(guideSrc.indexOf('"hummingbird"'));
  assert.match(crow, /not a raven/i);
  assert.match(crow, /Wedge/);
  assert.match(crow, /Not Quill/);
  assert.match(raven, /not a crow/i);
  assert.match(raven, /Soot/);
  assert.match(raven, /Not Quill/);
  assert.match(owl, /not a hawk/i);
  assert.match(owl, /Hook/);
  assert.match(hawk, /not an owl/i);
  assert.match(hawk, /Heart/);
  assert.match(hawk, /not sit like Felt/i);
  assert.match(chickadee, /not a sparrow/i);
  assert.match(robin, /not the European robin/i);
  assert.match(mallard, /not a goose/i);
  assert.match(mallard, /Vee/);
  assert.match(mallard, /Coin/);
  assert.match(goose, /not a duck/i);
  assert.match(goose, /Drake/);
  assert.match(pileated, /not a flicker/i);
  assert.match(hummingbird, /not a bee/i);
  assert.match(hummingbird, /Thrum/);
});

test("the roost page is a field guide, not a costume party", () => {
  assert.match(denSrc, /createFileRoute\("\/roost"\)/);
  assert.match(denSrc, /RoostDen/);
  assert.match(denSrc, /SpeciesPlaque/);
  assert.match(denSrc, /\/demo\/\$slug/);
  assert.match(denSrc, /ROOST_GUIDE\.map/);
  assert.match(denSrc, /a crow is not a raven/i);
  assert.doesNotMatch(denSrc, /axolotl/i);
  assert.doesNotMatch(denSrc, /Wikipedia/i);
});

test("the catalog and living roster include the ten roost keys", () => {
  for (const [key] of EXPECTED) {
    assert.match(catalogSrc, new RegExp(`key:\\s*"${key}"`));
  }
  assert.match(rosterSrc, /ROOST_ROSTER/);
  assert.doesNotMatch(roostSrc, /slug:\s*"bloom"/);
  assert.doesNotMatch(roostSrc, /key:\s*"axolotl"/);
  assert.doesNotMatch(roostSrc, /key:\s*"budgie"/);
  assert.doesNotMatch(roostSrc, /key:\s*"penguin"/);
  assert.doesNotMatch(roostSrc, /key:\s*"parrot"/);
  assert.doesNotMatch(roostSrc, /key:\s*"toucan"/);
  assert.doesNotMatch(roostSrc, /key:\s*"phoenix"/);
  assert.doesNotMatch(guideSrc, /Wikipedia/i);
  assert.doesNotMatch(roostSrc, /name:\s*"Quill"/);
  assert.doesNotMatch(roostSrc, /name:\s*"Ember"/);
});

test("rooms.ts only adds a roost room", () => {
  assert.match(roomsSrc, /id:\s*"roost"/);
  assert.match(roomsSrc, /watchSlug:\s*"soot"/);
  assert.match(roomsSrc, /watchName:\s*"Soot"/);
  assert.match(roomsSrc, /Ten birds\. A crow is not a raven\./);
  assert.match(roomsSrc, /id:\s*"well"/);
  assert.match(roomsSrc, /watchSlug:\s*"boot"/);
});

test("the hive and pond files stay as they were", () => {
  assert.doesNotMatch(beesSrc, /crow|raven|chickadee|hummingbird|mallard/);
  assert.doesNotMatch(hiveDenSrc, /RoostDen|ROOST_KEYS|\/roost/);
  assert.doesNotMatch(pondSrc, /crow|raven|chickadee|hummingbird/);
  assert.doesNotMatch(pondDenSrc, /RoostDen|ROOST_KEYS|\/roost/);
});
