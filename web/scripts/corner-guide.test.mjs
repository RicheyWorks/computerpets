import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cornerSrc = readFileSync(join(root, "src/lib/pets/corner.ts"), "utf8");
const guideSrc = readFileSync(join(root, "src/lib/pets/corner-guide.ts"), "utf8");
const denSrc = readFileSync(join(root, "src/routes/corner.tsx"), "utf8");
const catalogSrc = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");
const rosterSrc = readFileSync(join(root, "src/lib/pets/roster.ts"), "utf8");
const roomsSrc = readFileSync(join(root, "src/lib/pets/rooms.ts"), "utf8");
const beesSrc = readFileSync(join(root, "src/lib/pets/bees.ts"), "utf8");
const hiveDenSrc = readFileSync(join(root, "src/components/desk/hive-den.tsx"), "utf8");
const pondSrc = readFileSync(join(root, "src/lib/pets/pond.ts"), "utf8");
const pondDenSrc = readFileSync(join(root, "src/components/desk/pond-den.tsx"), "utf8");
const roostSrc = readFileSync(join(root, "src/lib/pets/roost.ts"), "utf8");
const roostDenSrc = readFileSync(join(root, "src/components/desk/roost-den.tsx"), "utf8");
const wellSrc = readFileSync(join(root, "src/lib/pets/well.ts"), "utf8");

const EXPECTED = [
  ["orb_weaver", "loom", "Araneus diadematus"],
  ["jumping_spider", "leap", "Phidippus audax"],
  ["wolf_spider", "prowl", "Tigrosa helluo"],
  ["tarantula", "velvet", "Aphonopelma chalcodes"],
  ["widow", "hour", "Latrodectus mactans"],
  ["harvestman", "stem", "Phalangium opilio"],
  ["scorpion", "barb", "Centruroides vittatus"],
  ["vinegaroon", "whip", "Mastigoproctus giganteus"],
  ["tick", "clasp", "Ixodes scapularis"],
  ["solifuge", "gale", "Eremobates"],
];

function quotedKeys(src) {
  return [...src.matchAll(/key:\s*"([a-z_]+)"/g)].map((m) => m[1]);
}

test("the corner lists the same ten guests as the roster", () => {
  const rosterKeys = quotedKeys(cornerSrc);
  const guideKeys = [...guideSrc.matchAll(/entry\(\s*"([a-z_]+)"/g)].map((m) => m[1]);
  assert.deepEqual(rosterKeys, EXPECTED.map(([key]) => key));
  assert.deepEqual(guideKeys, rosterKeys);
  assert.equal(guideKeys.length, 10);
});

test("each guide entry has a tell, a mix-up, a lesson, and the latin name", () => {
  for (const [key, slug, latin] of EXPECTED) {
    assert.match(guideSrc, new RegExp(`entry\\(\\s*"${key}"`));
    assert.match(cornerSrc, new RegExp(`slug:\\s*"${slug}"`));
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
  const orb = guideSrc.slice(guideSrc.indexOf('"orb_weaver"'), guideSrc.indexOf('"jumping_spider"'));
  const jumper = guideSrc.slice(guideSrc.indexOf('"jumping_spider"'), guideSrc.indexOf('"wolf_spider"'));
  const wolf = guideSrc.slice(guideSrc.indexOf('"wolf_spider"'), guideSrc.indexOf('"tarantula"'));
  const tarantula = guideSrc.slice(guideSrc.indexOf('"tarantula"'), guideSrc.indexOf('"widow"'));
  const widow = guideSrc.slice(guideSrc.indexOf('"widow"'), guideSrc.indexOf('"harvestman"'));
  const harvestman = guideSrc.slice(guideSrc.indexOf('"harvestman"'), guideSrc.indexOf('"scorpion"'));
  const scorpion = guideSrc.slice(guideSrc.indexOf('"scorpion"'), guideSrc.indexOf('"vinegaroon"'));
  const vinegaroon = guideSrc.slice(guideSrc.indexOf('"vinegaroon"'), guideSrc.indexOf('"tick"'));
  const tick = guideSrc.slice(guideSrc.indexOf('"tick"'), guideSrc.indexOf('"solifuge"'));
  const solifuge = guideSrc.slice(guideSrc.indexOf('"solifuge"'));
  assert.match(orb, /not an insect/i);
  assert.match(orb, /Stem/);
  assert.match(orb, /web is a trap/i);
  assert.match(jumper, /not a wolf spider/i);
  assert.match(jumper, /Prowl/);
  assert.match(wolf, /not Leap/i);
  assert.match(wolf, /No snare/i);
  assert.match(tarantula, /not a wolf spider/i);
  assert.match(tarantula, /Urticating hair/i);
  assert.match(widow, /not every dark spider/i);
  assert.match(widow, /hourglass/i);
  assert.match(harvestman, /not a spider/i);
  assert.match(harvestman, /Not Loom/);
  assert.match(harvestman, /Two eyes/i);
  assert.match(scorpion, /not a spider/i);
  assert.match(scorpion, /Not Whip/);
  assert.match(vinegaroon, /not a scorpion/i);
  assert.match(vinegaroon, /Not Barb/);
  assert.match(vinegaroon, /no sting/i);
  assert.match(tick, /not an insect/i);
  assert.match(tick, /Comb/);
  assert.match(tick, /mite/i);
  assert.match(solifuge, /not a spider/i);
  assert.match(solifuge, /not a scorpion/i);
  assert.match(solifuge, /camel spider is not a spider/i);
});

test("the corner page is a field guide, not a costume party", () => {
  assert.match(denSrc, /createFileRoute\("\/corner"\)/);
  assert.match(denSrc, /CornerDen/);
  assert.match(denSrc, /SpeciesPlaque/);
  assert.match(denSrc, /\/demo\/\$slug/);
  assert.match(denSrc, /CORNER_GUIDE\.map/);
  assert.match(denSrc, /a harvestman is not a spider/i);
  assert.doesNotMatch(denSrc, /axolotl/i);
  assert.doesNotMatch(denSrc, /Wikipedia/i);
});

test("the catalog and living roster include the ten corner keys", () => {
  for (const [key] of EXPECTED) {
    assert.match(catalogSrc, new RegExp(`key:\\s*"${key}"`));
  }
  assert.match(rosterSrc, /CORNER_ROSTER/);
  assert.doesNotMatch(cornerSrc, /slug:\s*"bloom"/);
  assert.doesNotMatch(cornerSrc, /key:\s*"axolotl"/);
  assert.doesNotMatch(cornerSrc, /key:\s*"honeybee"/);
  assert.doesNotMatch(cornerSrc, /key:\s*"horseshoe_crab"/);
  assert.doesNotMatch(guideSrc, /Wikipedia/i);
  assert.doesNotMatch(cornerSrc, /name:\s*"Comb"/);
  assert.doesNotMatch(cornerSrc, /name:\s*"Pinch"/);
  assert.doesNotMatch(cornerSrc, /name:\s*"Ledger"/);
});

test("rooms.ts only adds a corner room", () => {
  assert.match(roomsSrc, /id:\s*"corner"/);
  assert.match(roomsSrc, /watchSlug:\s*"loom"/);
  assert.match(roomsSrc, /watchName:\s*"Loom"/);
  assert.match(roomsSrc, /Ten guests of the corner\. A harvestman is not a spider\./);
  assert.match(roomsSrc, /isCorner/);
  assert.match(roomsSrc, /id:\s*"roost"/);
  assert.match(roomsSrc, /id:\s*"well"/);
  assert.match(roomsSrc, /watchSlug:\s*"boot"/);
});

test("the hive, pond, roost, and well files stay as they were", () => {
  assert.doesNotMatch(beesSrc, /orb_weaver|harvestman|vinegaroon|solifuge|widow/);
  assert.doesNotMatch(hiveDenSrc, /CornerDen|CORNER_KEYS|\/corner/);
  assert.doesNotMatch(pondSrc, /orb_weaver|harvestman|vinegaroon|solifuge/);
  assert.doesNotMatch(pondDenSrc, /CornerDen|CORNER_KEYS|\/corner/);
  assert.doesNotMatch(roostSrc, /orb_weaver|harvestman|vinegaroon|solifuge/);
  assert.doesNotMatch(roostDenSrc, /CornerDen|CORNER_KEYS|\/corner/);
  assert.doesNotMatch(wellSrc, /orb_weaver|harvestman|vinegaroon|solifuge/);
});
