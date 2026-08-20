import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const shoreSrc = readFileSync(join(root, "src/lib/pets/shore.ts"), "utf8");
const guideSrc = readFileSync(join(root, "src/lib/pets/shore-guide.ts"), "utf8");
const denSrc = readFileSync(join(root, "src/routes/shore.tsx"), "utf8");
const catalogSrc = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");
const rosterSrc = readFileSync(join(root, "src/lib/pets/roster.ts"), "utf8");
const roomsSrc = readFileSync(join(root, "src/lib/pets/rooms.ts"), "utf8");
const beesSrc = readFileSync(join(root, "src/lib/pets/bees.ts"), "utf8");
const hiveDenSrc = readFileSync(join(root, "src/components/desk/hive-den.tsx"), "utf8");
const insectsSrc = readFileSync(join(root, "src/lib/pets/insects.ts"), "utf8");
const pondSrc = readFileSync(join(root, "src/lib/pets/pond.ts"), "utf8");
const pondDenSrc = readFileSync(join(root, "src/components/desk/pond-den.tsx"), "utf8");
const seaSrc = readFileSync(join(root, "src/lib/pets/sea.ts"), "utf8");
const seaDenSrc = readFileSync(join(root, "src/components/desk/sea-den.tsx"), "utf8");
const creekSrc = readFileSync(join(root, "src/lib/pets/creek.ts"), "utf8");
const creekDenSrc = readFileSync(join(root, "src/components/desk/creek-den.tsx"), "utf8");
const logSrc = readFileSync(join(root, "src/lib/pets/log.ts"), "utf8");
const logDenSrc = readFileSync(join(root, "src/components/desk/log-den.tsx"), "utf8");
const cornerSrc = readFileSync(join(root, "src/lib/pets/corner.ts"), "utf8");
const fungiSrc = readFileSync(join(root, "src/lib/pets/fungi.ts"), "utf8");

const EXPECTED = [
  ["fiddler_crab", "wave", "Minuca pugnax"],
  ["ghost_crab", "pale", "Ocypode quadrata"],
  ["limpet", "cone", "Patella vulgata"],
  ["barnacle", "cement", "Semibalanus balanoides"],
  ["chiton", "mail", "Tonicella lineata"],
  ["periwinkle", "spire", "Littorina littorea"],
  ["sand_dollar", "token", "Echinarachnius parma"],
  ["sea_urchin", "thorn", "Strongylocentrotus purpuratus"],
  ["knobbed_whelk", "knurl", "Busycon carica"],
  ["lugworm", "heap", "Arenicola marina"],
];

function quotedKeys(src) {
  return [...src.matchAll(/key:\s*"([a-z_]+)"/g)].map((m) => m[1]);
}

test("the shore lists the same ten guests as the roster", () => {
  const rosterKeys = quotedKeys(shoreSrc);
  const guideKeys = [...guideSrc.matchAll(/entry\(\s*"([a-z_]+)"/g)].map((m) => m[1]);
  assert.deepEqual(rosterKeys, EXPECTED.map(([key]) => key));
  assert.deepEqual(guideKeys, rosterKeys);
  assert.equal(guideKeys.length, 10);
});

test("each guide entry has a tell, a mix-up, a lesson, and the latin name", () => {
  for (const [key, slug, latin] of EXPECTED) {
    assert.match(guideSrc, new RegExp(`entry\\(\\s*"${key}"`));
    assert.match(shoreSrc, new RegExp(`slug:\\s*"${slug}"`));
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
  const fiddler = guideSrc.slice(guideSrc.indexOf('"fiddler_crab"'), guideSrc.indexOf('"ghost_crab"'));
  const ghost = guideSrc.slice(guideSrc.indexOf('"ghost_crab"'), guideSrc.indexOf('"limpet"'));
  const limpet = guideSrc.slice(guideSrc.indexOf('"limpet"'), guideSrc.indexOf('"barnacle"'));
  const barnacle = guideSrc.slice(guideSrc.indexOf('"barnacle"'), guideSrc.indexOf('"chiton"'));
  const chiton = guideSrc.slice(guideSrc.indexOf('"chiton"'), guideSrc.indexOf('"periwinkle"'));
  const periwinkle = guideSrc.slice(guideSrc.indexOf('"periwinkle"'), guideSrc.indexOf('"sand_dollar"'));
  const sandDollar = guideSrc.slice(guideSrc.indexOf('"sand_dollar"'), guideSrc.indexOf('"sea_urchin"'));
  const urchin = guideSrc.slice(guideSrc.indexOf('"sea_urchin"'), guideSrc.indexOf('"knobbed_whelk"'));
  const whelk = guideSrc.slice(guideSrc.indexOf('"knobbed_whelk"'), guideSrc.indexOf('"lugworm"'));
  const lugworm = guideSrc.slice(guideSrc.indexOf('"lugworm"'));
  assert.match(fiddler, /not a hermit/i);
  assert.match(fiddler, /Tenant/);
  assert.match(fiddler, /not Pinch/i);
  assert.match(fiddler, /signal/i);
  assert.match(ghost, /not Tenant/i);
  assert.match(ghost, /not Ledger/i);
  assert.match(ghost, /not Ghost/i);
  assert.match(ghost, /not a horseshoe crab/i);
  assert.match(limpet, /not Lid/i);
  assert.match(limpet, /not Cement/i);
  assert.match(limpet, /clamp/i);
  assert.match(barnacle, /not a limpet/i);
  assert.match(barnacle, /not a crab/i);
  assert.match(barnacle, /Cone/);
  assert.match(chiton, /not a limpet/i);
  assert.match(chiton, /not Armor/i);
  assert.match(chiton, /eight/i);
  assert.match(periwinkle, /not Chamber/i);
  assert.match(periwinkle, /not Whorl/i);
  assert.match(periwinkle, /not Knurl/i);
  assert.match(sandDollar, /not Coin/i);
  assert.match(sandDollar, /not Disk/i);
  assert.match(sandDollar, /not Ochre/i);
  assert.match(urchin, /not Burr/i);
  assert.match(urchin, /not Spine/i);
  assert.match(urchin, /not Token/i);
  assert.match(whelk, /not Spire/i);
  assert.match(whelk, /not Horn/i);
  assert.match(whelk, /knob/i);
  assert.match(lugworm, /not Cast/i);
  assert.match(lugworm, /not Latch/i);
  assert.match(lugworm, /not an earthworm/i);
});

test("the shore page is a field guide, not a costume party", () => {
  assert.match(denSrc, /createFileRoute\("\/shore"\)/);
  assert.match(denSrc, /ShoreDen/);
  assert.match(denSrc, /SpeciesPlaque/);
  assert.match(denSrc, /\/demo\/\$slug/);
  assert.match(denSrc, /SHORE_GUIDE\.map/);
  assert.match(denSrc, /a fiddler is not a hermit/i);
  assert.match(denSrc, /a ghost crab is not a horseshoe crab/i);
  assert.doesNotMatch(denSrc, /Wikipedia/i);
  assert.doesNotMatch(denSrc, /NFT/i);
});

test("the catalog and living roster include the ten shore keys", () => {
  for (const [key] of EXPECTED) {
    assert.match(catalogSrc, new RegExp(`key:\\s*"${key}"`));
  }
  assert.match(rosterSrc, /SHORE_ROSTER/);
  assert.doesNotMatch(shoreSrc, /slug:\s*"horn"/);
  assert.doesNotMatch(shoreSrc, /name:\s*"Horn"/);
  assert.doesNotMatch(shoreSrc, /slug:\s*"ghost"/);
  assert.doesNotMatch(shoreSrc, /name:\s*"Ghost"/);
  assert.doesNotMatch(shoreSrc, /name:\s*"Coin"/);
  assert.doesNotMatch(shoreSrc, /name:\s*"Tenant"/);
  assert.doesNotMatch(shoreSrc, /name:\s*"Ledger"/);
  assert.doesNotMatch(shoreSrc, /name:\s*"Cast"/);
  assert.doesNotMatch(shoreSrc, /name:\s*"Lid"/);
  assert.doesNotMatch(guideSrc, /Wikipedia/i);
  assert.equal([...catalogSrc.matchAll(/\{ key: "/g)].length, 190);
});

test("rooms.ts only adds a shore room", () => {
  assert.match(roomsSrc, /id:\s*"shore"/);
  assert.match(roomsSrc, /watchSlug:\s*"wave"/);
  assert.match(roomsSrc, /watchName:\s*"Wave"/);
  assert.match(roomsSrc, /Ten of the shore\. A fiddler is not a hermit\. A ghost crab is not a horseshoe crab\./);
  assert.match(roomsSrc, /isShore/);
  assert.match(roomsSrc, /id:\s*"tide"/);
  assert.match(roomsSrc, /id:\s*"log"/);
  assert.match(roomsSrc, /id:\s*"creek"/);
  assert.match(roomsSrc, /watchSlug:\s*"cup"/);
  assert.match(roomsSrc, /watchSlug:\s*"haste"/);
  assert.match(roomsSrc, /watchSlug:\s*"lunge"/);
});

test("the hive, pond, sea, creek, and log files stay as they were", () => {
  assert.doesNotMatch(beesSrc, /fiddler_crab|ghost_crab|limpet|barnacle|chiton|periwinkle|sand_dollar|sea_urchin|knobbed_whelk|lugworm/);
  assert.doesNotMatch(insectsSrc, /fiddler_crab|ghost_crab|limpet|barnacle|chiton/);
  assert.doesNotMatch(hiveDenSrc, /ShoreDen|SHORE_KEYS|\/shore/);
  assert.doesNotMatch(pondSrc, /fiddler_crab|ghost_crab|limpet|barnacle|lugworm/);
  assert.doesNotMatch(pondDenSrc, /ShoreDen|SHORE_KEYS|\/shore/);
  assert.doesNotMatch(seaSrc, /fiddler_crab|ghost_crab|limpet|barnacle|lugworm/);
  assert.doesNotMatch(seaDenSrc, /ShoreDen|SHORE_KEYS|\/shore/);
  assert.doesNotMatch(creekSrc, /fiddler_crab|ghost_crab|limpet|barnacle|lugworm/);
  assert.doesNotMatch(creekDenSrc, /ShoreDen|SHORE_KEYS|\/shore/);
  assert.doesNotMatch(logSrc, /fiddler_crab|ghost_crab|limpet|barnacle|lugworm/);
  assert.doesNotMatch(logDenSrc, /ShoreDen|SHORE_KEYS|\/shore/);
  assert.doesNotMatch(cornerSrc, /fiddler_crab|ghost_crab|limpet|barnacle|lugworm/);
  assert.doesNotMatch(fungiSrc, /fiddler_crab|ghost_crab|limpet|barnacle|lugworm/);
  assert.match(fungiSrc, /name:\s*"Horn"/);
  assert.match(insectsSrc, /name:\s*"Ghost"/);
});
