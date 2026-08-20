import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const woodSrc = readFileSync(join(root, "src/lib/pets/wood.ts"), "utf8");
const guideSrc = readFileSync(join(root, "src/lib/pets/wood-guide.ts"), "utf8");
const denSrc = readFileSync(join(root, "src/routes/wood.tsx"), "utf8");
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
const wellSrc = readFileSync(join(root, "src/lib/pets/well.ts"), "utf8");

const EXPECTED = [
  ["deer", "rack", "Odocoileus virginianus"],
  ["bat", "cape", "Eptesicus fuscus"],
  ["squirrel", "cache", "Sciurus carolinensis"],
  ["otter", "slick", "Lontra canadensis"],
  ["raccoon", "wash", "Procyon lotor"],
  ["skunk", "stripe", "Mephitis mephitis"],
  ["opossum", "grin", "Didelphis virginiana"],
  ["beaver", "dam", "Castor canadensis"],
  ["porcupine", "spine", "Erethizon dorsatum"],
  ["black_bear", "coal", "Ursus americanus"],
];

function quotedKeys(src) {
  return [...src.matchAll(/key:\s*"([a-z_]+)"/g)].map((m) => m[1]);
}

test("the wood lists the same ten guests as the roster", () => {
  const rosterKeys = quotedKeys(woodSrc);
  const guideKeys = [...guideSrc.matchAll(/entry\(\s*"([a-z_]+)"/g)].map((m) => m[1]);
  assert.deepEqual(rosterKeys, EXPECTED.map(([key]) => key));
  assert.deepEqual(guideKeys, rosterKeys);
  assert.equal(guideKeys.length, 10);
});

test("each guide entry has a tell, a mix-up, a lesson, and the latin name", () => {
  for (const [key, slug, latin] of EXPECTED) {
    assert.match(guideSrc, new RegExp(`entry\\(\\s*"${key}"`));
    assert.match(woodSrc, new RegExp(`slug:\\s*"${slug}"`));
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
  const deer = guideSrc.slice(guideSrc.indexOf('"deer"'), guideSrc.indexOf('"bat"'));
  const bat = guideSrc.slice(guideSrc.indexOf('"bat"'), guideSrc.indexOf('"squirrel"'));
  const squirrel = guideSrc.slice(guideSrc.indexOf('"squirrel"'), guideSrc.indexOf('"otter"'));
  const otter = guideSrc.slice(guideSrc.indexOf('"otter"'), guideSrc.indexOf('"raccoon"'));
  const raccoon = guideSrc.slice(guideSrc.indexOf('"raccoon"'), guideSrc.indexOf('"skunk"'));
  const skunk = guideSrc.slice(guideSrc.indexOf('"skunk"'), guideSrc.indexOf('"opossum"'));
  const opossum = guideSrc.slice(guideSrc.indexOf('"opossum"'), guideSrc.indexOf('"beaver"'));
  const beaver = guideSrc.slice(guideSrc.indexOf('"beaver"'), guideSrc.indexOf('"porcupine"'));
  const porcupine = guideSrc.slice(guideSrc.indexOf('"porcupine"'), guideSrc.indexOf('"black_bear"'));
  const bear = guideSrc.slice(guideSrc.indexOf('"black_bear"'));
  assert.match(deer, /not a moose/i);
  assert.match(deer, /flag/i);
  assert.match(bat, /not a bird/i);
  assert.match(bat, /Sip/);
  assert.match(bat, /Peck/);
  assert.match(squirrel, /not a chipmunk/i);
  assert.match(otter, /not Slip/i);
  assert.match(otter, /weasel rumor/i);
  assert.match(raccoon, /not Bandit/i);
  assert.match(raccoon, /not Rui/i);
  assert.match(skunk, /not a polecat/i);
  assert.match(skunk, /not Wick/i);
  assert.match(opossum, /marsupial/i);
  assert.match(opossum, /not a cat/i);
  assert.match(opossum, /not Vesper/i);
  assert.match(beaver, /not a muskrat/i);
  assert.match(beaver, /lodge/i);
  assert.match(porcupine, /does not throw/i);
  assert.match(porcupine, /not Burr/i);
  assert.match(porcupine, /not Quill/i);
  assert.match(bear, /not a red panda/i);
  assert.match(bear, /not Rui/i);
  assert.match(bear, /She is a bear/);
});

test("the wood page is a field guide, not a costume party", () => {
  assert.match(denSrc, /createFileRoute\("\/wood"\)/);
  assert.match(denSrc, /WoodDen/);
  assert.match(denSrc, /SpeciesPlaque/);
  assert.match(denSrc, /\/demo\/\$slug/);
  assert.match(denSrc, /WOOD_GUIDE\.map/);
  assert.match(denSrc, /a bat is not a bird/i);
  assert.match(denSrc, /a porcupine is not Burr/i);
  assert.doesNotMatch(denSrc, /axolotl/i);
  assert.doesNotMatch(denSrc, /Wikipedia/i);
  assert.doesNotMatch(denSrc, /NFT/i);
});

test("the catalog and living roster include the ten wood keys", () => {
  for (const [key] of EXPECTED) {
    assert.match(catalogSrc, new RegExp(`key:\\s*"${key}"`));
  }
  assert.match(rosterSrc, /WOOD_ROSTER/);
  assert.doesNotMatch(woodSrc, /slug:\s*"bloom"/);
  assert.doesNotMatch(woodSrc, /key:\s*"axolotl"/);
  assert.doesNotMatch(woodSrc, /key:\s*"honeybee"/);
  assert.doesNotMatch(woodSrc, /key:\s*"red_panda"/);
  assert.doesNotMatch(guideSrc, /Wikipedia/i);
  assert.doesNotMatch(woodSrc, /name:\s*"Rui"/);
  assert.doesNotMatch(woodSrc, /name:\s*"Burr"/);
  assert.doesNotMatch(woodSrc, /name:\s*"Quill"/);
  assert.doesNotMatch(woodSrc, /name:\s*"Bandit"/);
  assert.doesNotMatch(woodSrc, /name:\s*"Slip"/);
});

test("rooms.ts only adds a wood room", () => {
  assert.match(roomsSrc, /id:\s*"wood"/);
  assert.match(roomsSrc, /watchSlug:\s*"rack"/);
  assert.match(roomsSrc, /watchName:\s*"Rack"/);
  assert.match(roomsSrc, /Ten of the wood\. A bat is not a bird\. A porcupine is not Burr\./);
  assert.match(roomsSrc, /isWood/);
  assert.match(roomsSrc, /id:\s*"corner"/);
  assert.match(roomsSrc, /id:\s*"roost"/);
  assert.match(roomsSrc, /id:\s*"well"/);
  assert.match(roomsSrc, /watchSlug:\s*"boot"/);
});

test("the hive, pond, roost, corner, and well files stay as they were", () => {
  assert.doesNotMatch(beesSrc, /deer|raccoon|porcupine|black_bear|opossum/);
  assert.doesNotMatch(hiveDenSrc, /WoodDen|WOOD_KEYS|\/wood/);
  assert.doesNotMatch(pondSrc, /deer|raccoon|porcupine|black_bear/);
  assert.doesNotMatch(pondDenSrc, /WoodDen|WOOD_KEYS|\/wood/);
  assert.doesNotMatch(roostSrc, /deer|raccoon|porcupine|black_bear/);
  assert.doesNotMatch(roostDenSrc, /WoodDen|WOOD_KEYS|\/wood/);
  assert.doesNotMatch(cornerSrc, /deer|raccoon|porcupine|black_bear/);
  assert.doesNotMatch(cornerDenSrc, /WoodDen|WOOD_KEYS|\/wood/);
  assert.doesNotMatch(wellSrc, /deer|raccoon|porcupine|black_bear/);
});
