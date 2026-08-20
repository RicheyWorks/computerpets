import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const creekSrc = readFileSync(join(root, "src/lib/pets/creek.ts"), "utf8");
const guideSrc = readFileSync(join(root, "src/lib/pets/creek-guide.ts"), "utf8");
const denSrc = readFileSync(join(root, "src/routes/creek.tsx"), "utf8");
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
const stoneSrc = readFileSync(join(root, "src/lib/pets/stone.ts"), "utf8");
const stoneDenSrc = readFileSync(join(root, "src/components/desk/stone-den.tsx"), "utf8");
const wellSrc = readFileSync(join(root, "src/lib/pets/well.ts"), "utf8");
const seaSrc = readFileSync(join(root, "src/lib/pets/sea.ts"), "utf8");
const snakesSrc = readFileSync(join(root, "src/lib/pets/snakes.ts"), "utf8");

const EXPECTED = [
  ["bass", "lunge", "Micropterus salmoides"],
  ["brook_trout", "speck", "Salvelinus fontinalis"],
  ["catfish", "whisk", "Ictalurus punctatus"],
  ["bluegill", "penny", "Lepomis macrochirus"],
  ["perch", "bar", "Perca flavescens"],
  ["pike", "lance", "Esox lucius"],
  ["walleye", "night", "Sander vitreus"],
  ["paddlefish", "spoon", "Polyodon spathula"],
  ["lamprey", "round", "Petromyzon marinus"],
  ["american_eel", "silver", "Anguilla rostrata"],
];

function quotedKeys(src) {
  return [...src.matchAll(/key:\s*"([a-z_]+)"/g)].map((m) => m[1]);
}

test("the creek lists the same ten guests as the roster", () => {
  const rosterKeys = quotedKeys(creekSrc);
  const guideKeys = [...guideSrc.matchAll(/entry\(\s*"([a-z_]+)"/g)].map((m) => m[1]);
  assert.deepEqual(rosterKeys, EXPECTED.map(([key]) => key));
  assert.deepEqual(guideKeys, rosterKeys);
  assert.equal(guideKeys.length, 10);
});

test("each guide entry has a tell, a mix-up, a lesson, and the latin name", () => {
  for (const [key, slug, latin] of EXPECTED) {
    assert.match(guideSrc, new RegExp(`entry\\(\\s*"${key}"`));
    assert.match(creekSrc, new RegExp(`slug:\\s*"${slug}"`));
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
  const bass = guideSrc.slice(guideSrc.indexOf('"bass"'), guideSrc.indexOf('"brook_trout"'));
  const trout = guideSrc.slice(guideSrc.indexOf('"brook_trout"'), guideSrc.indexOf('"catfish"'));
  const catfish = guideSrc.slice(guideSrc.indexOf('"catfish"'), guideSrc.indexOf('"bluegill"'));
  const bluegill = guideSrc.slice(guideSrc.indexOf('"bluegill"'), guideSrc.indexOf('"perch"'));
  const perch = guideSrc.slice(guideSrc.indexOf('"perch"'), guideSrc.indexOf('"pike"'));
  const pike = guideSrc.slice(guideSrc.indexOf('"pike"'), guideSrc.indexOf('"walleye"'));
  const walleye = guideSrc.slice(guideSrc.indexOf('"walleye"'), guideSrc.indexOf('"paddlefish"'));
  const paddlefish = guideSrc.slice(guideSrc.indexOf('"paddlefish"'), guideSrc.indexOf('"lamprey"'));
  const lamprey = guideSrc.slice(guideSrc.indexOf('"lamprey"'), guideSrc.indexOf('"american_eel"'));
  const eel = guideSrc.slice(guideSrc.indexOf('"american_eel"'));
  assert.match(bass, /not a trout/i);
  assert.match(bass, /Speck/);
  assert.match(bass, /wide mouth|mouth/i);
  assert.match(trout, /not a bass/i);
  assert.match(trout, /Lunge/);
  assert.match(trout, /char/i);
  assert.match(trout, /rainbow/i);
  assert.match(catfish, /not a shark/i);
  assert.match(catfish, /Spoon/);
  assert.match(bluegill, /not Coin/i);
  assert.match(bluegill, /sunfish/i);
  assert.match(perch, /not a walleye/i);
  assert.match(perch, /Night/);
  assert.match(pike, /not a muskellunge/i);
  assert.match(walleye, /not a perch/i);
  assert.match(walleye, /Bar/);
  assert.match(walleye, /tapetum/i);
  assert.match(paddlefish, /not a shark/i);
  assert.match(paddlefish, /not Whisk/i);
  assert.match(paddlefish, /filter/i);
  assert.match(lamprey, /not an eel/i);
  assert.match(lamprey, /Silver/);
  assert.match(lamprey, /not a ribbon/i);
  assert.match(lamprey, /disk/i);
  assert.match(eel, /not a lamprey/i);
  assert.match(eel, /Round/);
  assert.match(eel, /Sargasso/);
  assert.match(eel, /not a moray/i);
});

test("the creek page is a field guide, not a costume party", () => {
  assert.match(denSrc, /createFileRoute\("\/creek"\)/);
  assert.match(denSrc, /CreekDen/);
  assert.match(denSrc, /SpeciesPlaque/);
  assert.match(denSrc, /\/demo\/\$slug/);
  assert.match(denSrc, /CREEK_GUIDE\.map/);
  assert.match(denSrc, /a bass is not a trout/i);
  assert.match(denSrc, /a lamprey is not an eel/i);
  assert.doesNotMatch(denSrc, /axolotl/i);
  assert.doesNotMatch(denSrc, /Wikipedia/i);
  assert.doesNotMatch(denSrc, /NFT/i);
});

test("the catalog and living roster include the ten creek keys", () => {
  for (const [key] of EXPECTED) {
    assert.match(catalogSrc, new RegExp(`key:\\s*"${key}"`));
  }
  assert.match(rosterSrc, /CREEK_ROSTER/);
  assert.doesNotMatch(creekSrc, /slug:\s*"bloom"/);
  assert.doesNotMatch(creekSrc, /key:\s*"axolotl"/);
  assert.doesNotMatch(creekSrc, /key:\s*"goldfish"/);
  assert.doesNotMatch(creekSrc, /key:\s*"stickleback"/);
  assert.doesNotMatch(guideSrc, /Wikipedia/i);
  assert.doesNotMatch(creekSrc, /name:\s*"Coin"/);
  assert.doesNotMatch(creekSrc, /name:\s*"Prickle"/);
  assert.doesNotMatch(creekSrc, /name:\s*"Anchor"/);
  assert.doesNotMatch(creekSrc, /name:\s*"Pulse"/);
  assert.doesNotMatch(creekSrc, /name:\s*"Disk"/);
});

test("rooms.ts only adds a creek room", () => {
  assert.match(roomsSrc, /id:\s*"creek"/);
  assert.match(roomsSrc, /watchSlug:\s*"lunge"/);
  assert.match(roomsSrc, /watchName:\s*"Lunge"/);
  assert.match(roomsSrc, /Ten of the creek\. A bass is not a trout\. A lamprey is not an eel\./);
  assert.match(roomsSrc, /isCreek/);
  assert.match(roomsSrc, /id:\s*"stone"/);
  assert.match(roomsSrc, /id:\s*"wood"/);
  assert.match(roomsSrc, /id:\s*"pond"/);
  assert.match(roomsSrc, /watchSlug:\s*"pad"/);
  assert.match(roomsSrc, /watchSlug:\s*"reed"/);
});

test("the hive, pond, roost, corner, wood, stone, well, sea, and snake files stay as they were", () => {
  assert.doesNotMatch(beesSrc, /bass|brook_trout|catfish|bluegill|lamprey|american_eel/);
  assert.doesNotMatch(hiveDenSrc, /CreekDen|CREEK_KEYS|\/creek/);
  assert.doesNotMatch(pondSrc, /bass|brook_trout|walleye|paddlefish/);
  assert.doesNotMatch(pondDenSrc, /CreekDen|CREEK_KEYS|\/creek/);
  assert.doesNotMatch(roostSrc, /bass|brook_trout|walleye|paddlefish/);
  assert.doesNotMatch(roostDenSrc, /CreekDen|CREEK_KEYS|\/creek/);
  assert.doesNotMatch(cornerSrc, /bass|brook_trout|walleye|paddlefish/);
  assert.doesNotMatch(cornerDenSrc, /CreekDen|CREEK_KEYS|\/creek/);
  assert.doesNotMatch(woodSrc, /bass|brook_trout|walleye|paddlefish/);
  assert.doesNotMatch(woodDenSrc, /CreekDen|CREEK_KEYS|\/creek/);
  assert.doesNotMatch(stoneSrc, /bass|brook_trout|walleye|paddlefish/);
  assert.doesNotMatch(stoneDenSrc, /CreekDen|CREEK_KEYS|\/creek/);
  assert.doesNotMatch(wellSrc, /bass|brook_trout|walleye|paddlefish/);
  assert.doesNotMatch(seaSrc, /bass|brook_trout|walleye|paddlefish|bluegill/);
  assert.doesNotMatch(snakesSrc, /bass|brook_trout|walleye|paddlefish/);
});
