import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const reefSrc = readFileSync(join(root, "src/lib/pets/reef.ts"), "utf8");
const guideSrc = readFileSync(join(root, "src/lib/pets/reef-guide.ts"), "utf8");
const denSrc = readFileSync(join(root, "src/routes/reef.tsx"), "utf8");
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
const gardenSrc = readFileSync(join(root, "src/lib/pets/garden.ts"), "utf8");
const gardenDenSrc = readFileSync(join(root, "src/components/desk/garden-den.tsx"), "utf8");
const roostSrc = readFileSync(join(root, "src/lib/pets/roost.ts"), "utf8");
const cornerSrc = readFileSync(join(root, "src/lib/pets/corner.ts"), "utf8");
const woodSrc = readFileSync(join(root, "src/lib/pets/wood.ts"), "utf8");
const shoreSrc = readFileSync(join(root, "src/lib/pets/shore.ts"), "utf8");
const shoreDenSrc = readFileSync(join(root, "src/components/desk/shore-den.tsx"), "utf8");
const meadowSrc = readFileSync(join(root, "src/lib/pets/meadow.ts"), "utf8");
const canopySrc = readFileSync(join(root, "src/lib/pets/canopy.ts"), "utf8");
const canopyDenSrc = readFileSync(join(root, "src/components/desk/canopy-den.tsx"), "utf8");
const shellSrc = readFileSync(join(root, "src/components/app-shell.tsx"), "utf8");

const EXPECTED = [
  ["brain_coral", "ridge", "Colpophyllia natans"],
  ["anemone", "wreath", "Heteractis magnifica"],
  ["clownfish", "paint", "Amphiprion ocellaris"],
  ["parrotfish", "scrape", "Sparisoma viride"],
  ["cleaner_shrimp", "scrub", "Lysmata amboinensis"],
  ["sea_cucumber", "tube", "Thelenota ananas"],
  ["lionfish", "veil", "Pterois volitans"],
  ["giant_clam", "gate", "Tridacna gigas"],
  ["eagle_ray", "soar", "Aetobatus narinari"],
  ["grouper", "hide", "Epinephelus striatus"],
];

function quotedKeys(src) {
  return [...src.matchAll(/key:\s*"([a-z_]+)"/g)].map((m) => m[1]);
}

test("the reef lists the same ten guests as the roster", () => {
  const rosterKeys = quotedKeys(reefSrc);
  const guideKeys = [...guideSrc.matchAll(/entry\(\s*"([a-z_]+)"/g)].map((m) => m[1]);
  assert.deepEqual(rosterKeys, EXPECTED.map(([key]) => key));
  assert.deepEqual(guideKeys, rosterKeys);
  assert.equal(guideKeys.length, 10);
});

test("each guide entry has a tell, a mix-up, a lesson, and the latin name", () => {
  for (const [key, slug, latin] of EXPECTED) {
    assert.match(guideSrc, new RegExp(`entry\\(\\s*"${key}"`));
    assert.match(reefSrc, new RegExp(`slug:\\s*"${slug}"`));
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
  const ridge = guideSrc.slice(guideSrc.indexOf('"brain_coral"'), guideSrc.indexOf('"anemone"'));
  const wreath = guideSrc.slice(guideSrc.indexOf('"anemone"'), guideSrc.indexOf('"clownfish"'));
  const paint = guideSrc.slice(guideSrc.indexOf('"clownfish"'), guideSrc.indexOf('"parrotfish"'));
  const scrape = guideSrc.slice(guideSrc.indexOf('"parrotfish"'), guideSrc.indexOf('"cleaner_shrimp"'));
  const scrub = guideSrc.slice(guideSrc.indexOf('"cleaner_shrimp"'), guideSrc.indexOf('"sea_cucumber"'));
  const tube = guideSrc.slice(guideSrc.indexOf('"sea_cucumber"'), guideSrc.indexOf('"lionfish"'));
  const veil = guideSrc.slice(guideSrc.indexOf('"lionfish"'), guideSrc.indexOf('"giant_clam"'));
  const gate = guideSrc.slice(guideSrc.indexOf('"giant_clam"'), guideSrc.indexOf('"eagle_ray"'));
  const soar = guideSrc.slice(guideSrc.indexOf('"eagle_ray"'), guideSrc.indexOf('"grouper"'));
  const hide = guideSrc.slice(guideSrc.indexOf('"grouper"'));
  assert.match(ridge, /not a plant/i);
  assert.match(ridge, /not Fan/i);
  assert.match(ridge, /not Bloom/i);
  assert.match(ridge, /not Hold/i);
  assert.match(ridge, /not Coral/i);
  assert.match(wreath, /not a jelly/i);
  assert.match(wreath, /not Pulse/i);
  assert.match(wreath, /not Snap/i);
  assert.match(paint, /not a goldfish/i);
  assert.match(paint, /not Stripe/i);
  assert.match(paint, /not Coin/i);
  assert.match(scrape, /not a parrot/i);
  assert.match(scrape, /not Quill/i);
  assert.match(scrape, /not Beak/i);
  assert.match(scrub, /not a hermit/i);
  assert.match(scrub, /not Tenant/i);
  assert.match(scrub, /not Pinch/i);
  assert.match(tube, /not a lugworm/i);
  assert.match(tube, /not Heap/i);
  assert.match(tube, /not Cast/i);
  assert.match(veil, /not Mane/i);
  assert.match(veil, /not Fan/i);
  assert.match(veil, /not Spine/i);
  assert.match(veil, /not Spike/i);
  assert.match(gate, /not a nautilus/i);
  assert.match(gate, /not Chamber/i);
  assert.match(gate, /not Cone/i);
  assert.match(soar, /not a manta/i);
  assert.match(soar, /not Kite/i);
  assert.match(soar, /not a bird/i);
  assert.match(hide, /not a moray/i);
  assert.match(hide, /not Door/i);
  assert.match(hide, /not Lance/i);
});

test("the reef page is a field guide, not a costume party", () => {
  assert.match(denSrc, /createFileRoute\("\/reef"\)/);
  assert.match(denSrc, /ReefDen/);
  assert.match(denSrc, /SpeciesPlaque/);
  assert.match(denSrc, /\/demo\/\$slug/);
  assert.match(denSrc, /REEF_GUIDE\.map/);
  assert.match(denSrc, /a coral is not a plant/i);
  assert.match(denSrc, /an anemone is not a jelly/i);
  assert.doesNotMatch(denSrc, /Wikipedia/i);
  assert.doesNotMatch(denSrc, /NFT/i);
  assert.doesNotMatch(reefSrc, /slug:\s*"mane"/);
  assert.doesNotMatch(reefSrc, /name:\s*"Mane"/);
});

test("the catalog and living roster include the ten reef keys", () => {
  for (const [key] of EXPECTED) {
    assert.match(catalogSrc, new RegExp(`key:\\s*"${key}"`));
  }
  assert.match(rosterSrc, /REEF_ROSTER/);
  assert.doesNotMatch(reefSrc, /slug:\s*"mane"/);
  assert.doesNotMatch(reefSrc, /name:\s*"Mane"/);
  assert.doesNotMatch(guideSrc, /Wikipedia/i);
  assert.equal([...catalogSrc.matchAll(/\{ key: "/g)].length, 210);
});

test("rooms.ts only adds a reef room", () => {
  assert.match(roomsSrc, /id:\s*"reef"/);
  assert.match(roomsSrc, /watchSlug:\s*"ridge"/);
  assert.match(roomsSrc, /watchName:\s*"Ridge"/);
  assert.match(roomsSrc, /Ten of the reef\. A coral is not a plant\. An anemone is not a jelly\./);
  assert.match(roomsSrc, /isReef/);
  assert.match(roomsSrc, /id:\s*"shore"/);
  assert.match(roomsSrc, /id:\s*"tide"/);
  assert.match(roomsSrc, /watchSlug:\s*"wave"/);
  assert.match(roomsSrc, /watchSlug:\s*"cup"/);
  const bleed = shellSrc.slice(shellSrc.indexOf("{desk || demo"), shellSrc.indexOf("mx-auto max-w-6xl px-4 py-8"));
  assert.match(bleed, /shore \|\| reef \|\| meadow/);
});

test("the hive, garden, roost, wood, sea, shore, and canopy files stay as they were", () => {
  assert.doesNotMatch(beesSrc, /brain_coral|anemone|clownfish|parrotfish|cleaner_shrimp|sea_cucumber|lionfish|giant_clam|eagle_ray|grouper/);
  assert.doesNotMatch(insectsSrc, /brain_coral|anemone|clownfish|parrotfish/);
  assert.doesNotMatch(hiveDenSrc, /ReefDen|REEF_KEYS|\/reef/);
  assert.doesNotMatch(pondSrc, /brain_coral|anemone|clownfish|parrotfish/);
  assert.doesNotMatch(pondDenSrc, /ReefDen|REEF_KEYS|\/reef/);
  assert.doesNotMatch(seaSrc, /brain_coral|anemone|clownfish|parrotfish|cleaner_shrimp|sea_cucumber|lionfish|giant_clam|eagle_ray|grouper/);
  assert.doesNotMatch(seaDenSrc, /ReefDen|REEF_KEYS|\/reef/);
  assert.doesNotMatch(gardenSrc, /brain_coral|anemone|clownfish|parrotfish/);
  assert.doesNotMatch(gardenDenSrc, /ReefDen|REEF_KEYS|\/reef/);
  assert.doesNotMatch(roostSrc, /brain_coral|anemone|clownfish|parrotfish/);
  assert.doesNotMatch(cornerSrc, /brain_coral|anemone|clownfish|parrotfish/);
  assert.doesNotMatch(woodSrc, /brain_coral|anemone|clownfish|parrotfish/);
  assert.doesNotMatch(shoreSrc, /brain_coral|anemone|clownfish|parrotfish|cleaner_shrimp|sea_cucumber|lionfish|giant_clam|eagle_ray|grouper/);
  assert.doesNotMatch(shoreDenSrc, /ReefDen|REEF_KEYS|\/reef/);
  assert.doesNotMatch(meadowSrc, /brain_coral|anemone|clownfish|parrotfish/);
  assert.doesNotMatch(canopySrc, /brain_coral|anemone|clownfish|parrotfish/);
  assert.doesNotMatch(canopyDenSrc, /ReefDen|REEF_KEYS|\/reef/);
  assert.match(seaSrc, /name:\s*"Cup"/);
  assert.match(seaSrc, /name:\s*"Kite"/);
  assert.match(seaSrc, /name:\s*"Door"/);
  assert.match(shoreSrc, /name:\s*"Wave"/);
  assert.match(canopySrc, /name:\s*"Hang"/);
  assert.match(insectsSrc, /name:\s*"Comb"/);
});
