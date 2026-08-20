import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const canopySrc = readFileSync(join(root, "src/lib/pets/canopy.ts"), "utf8");
const guideSrc = readFileSync(join(root, "src/lib/pets/canopy-guide.ts"), "utf8");
const denSrc = readFileSync(join(root, "src/routes/canopy.tsx"), "utf8");
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
const woodDenSrc = readFileSync(join(root, "src/components/desk/wood-den.tsx"), "utf8");
const meadowSrc = readFileSync(join(root, "src/lib/pets/meadow.ts"), "utf8");
const shellSrc = readFileSync(join(root, "src/components/app-shell.tsx"), "utf8");

const EXPECTED = [
  ["sloth", "hang", "Choloepus didactylus"],
  ["lemur", "sun", "Lemur catta"],
  ["gibbon", "swing", "Hylobates lar"],
  ["kinkajou", "wrist", "Potos flavus"],
  ["colugo", "sail", "Galeopterus variegatus"],
  ["flying_squirrel", "glide", "Glaucomys volans"],
  ["howler", "boom", "Alouatta palliata"],
  ["tarsier", "gaze", "Carlito syrichta"],
  ["potto", "still", "Perodicticus potto"],
  ["koala", "gum", "Phascolarctos cinereus"],
];

function quotedKeys(src) {
  return [...src.matchAll(/key:\s*"([a-z_]+)"/g)].map((m) => m[1]);
}

test("the canopy lists the same ten guests as the roster", () => {
  const rosterKeys = quotedKeys(canopySrc);
  const guideKeys = [...guideSrc.matchAll(/entry\(\s*"([a-z_]+)"/g)].map((m) => m[1]);
  assert.deepEqual(rosterKeys, EXPECTED.map(([key]) => key));
  assert.deepEqual(guideKeys, rosterKeys);
  assert.equal(guideKeys.length, 10);
});

test("each guide entry has a tell, a mix-up, a lesson, and the latin name", () => {
  for (const [key, slug, latin] of EXPECTED) {
    assert.match(guideSrc, new RegExp(`entry\\(\\s*"${key}"`));
    assert.match(canopySrc, new RegExp(`slug:\\s*"${slug}"`));
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
  const sloth = guideSrc.slice(guideSrc.indexOf('"sloth"'), guideSrc.indexOf('"lemur"'));
  const lemur = guideSrc.slice(guideSrc.indexOf('"lemur"'), guideSrc.indexOf('"gibbon"'));
  const gibbon = guideSrc.slice(guideSrc.indexOf('"gibbon"'), guideSrc.indexOf('"kinkajou"'));
  const kinkajou = guideSrc.slice(guideSrc.indexOf('"kinkajou"'), guideSrc.indexOf('"colugo"'));
  const colugo = guideSrc.slice(guideSrc.indexOf('"colugo"'), guideSrc.indexOf('"flying_squirrel"'));
  const flying = guideSrc.slice(guideSrc.indexOf('"flying_squirrel"'), guideSrc.indexOf('"howler"'));
  const howler = guideSrc.slice(guideSrc.indexOf('"howler"'), guideSrc.indexOf('"tarsier"'));
  const tarsier = guideSrc.slice(guideSrc.indexOf('"tarsier"'), guideSrc.indexOf('"potto"'));
  const potto = guideSrc.slice(guideSrc.indexOf('"potto"'), guideSrc.indexOf('"koala"'));
  const koala = guideSrc.slice(guideSrc.indexOf('"koala"'));
  assert.match(sloth, /not lazy/i);
  assert.match(sloth, /not Rui/i);
  assert.match(sloth, /not a red panda/i);
  assert.match(lemur, /not Stripe/i);
  assert.match(lemur, /not Ring/i);
  assert.match(lemur, /not a raccoon/i);
  assert.match(gibbon, /not a monkey/i);
  assert.match(gibbon, /not Quill/i);
  assert.match(kinkajou, /not Sip/i);
  assert.match(kinkajou, /not Comb/i);
  assert.match(kinkajou, /not Rue/i);
  assert.match(kinkajou, /not a ferret/i);
  assert.match(colugo, /not a lemur/i);
  assert.match(colugo, /not Glide/i);
  assert.match(colugo, /not Cape/i);
  assert.match(flying, /not a bird/i);
  assert.match(flying, /not Kite/i);
  assert.match(flying, /not a wing/i);
  assert.match(howler, /not Vee/i);
  assert.match(howler, /not Swing/i);
  assert.match(howler, /not a gibbon/i);
  assert.match(tarsier, /not Heart/i);
  assert.match(tarsier, /not an owl/i);
  assert.match(potto, /not a loris/i);
  assert.match(potto, /not Twig/i);
  assert.match(potto, /not Fold/i);
  assert.match(potto, /not Hang/i);
  assert.match(koala, /not a bear/i);
  assert.match(koala, /not Coal/i);
  assert.match(koala, /not Burr/i);
  assert.match(koala, /marsupial/i);
});

test("the canopy page is a field guide, not a costume party", () => {
  assert.match(denSrc, /createFileRoute\("\/canopy"\)/);
  assert.match(denSrc, /CanopyDen/);
  assert.match(denSrc, /SpeciesPlaque/);
  assert.match(denSrc, /\/demo\/\$slug/);
  assert.match(denSrc, /CANOPY_GUIDE\.map/);
  assert.match(denSrc, /a sloth is not a red panda/i);
  assert.match(denSrc, /a koala is not a bear/i);
  assert.doesNotMatch(denSrc, /Wikipedia/i);
  assert.doesNotMatch(denSrc, /NFT/i);
});

test("the catalog and living roster include the ten canopy keys", () => {
  for (const [key] of EXPECTED) {
    assert.match(catalogSrc, new RegExp(`key:\\s*"${key}"`));
  }
  assert.match(rosterSrc, /CANOPY_ROSTER/);
  assert.doesNotMatch(canopySrc, /slug:\s*"ring"/);
  assert.doesNotMatch(canopySrc, /name:\s*"Ring"/);
  assert.doesNotMatch(canopySrc, /slug:\s*"bluff"/);
  assert.doesNotMatch(canopySrc, /name:\s*"Bluff"/);
  assert.doesNotMatch(canopySrc, /key:\s*"opossum"/);
  assert.doesNotMatch(guideSrc, /Wikipedia/i);
  assert.equal([...catalogSrc.matchAll(/\{ key: "/g)].length, 210);
});

test("rooms.ts only adds a canopy room", () => {
  assert.match(roomsSrc, /id:\s*"canopy"/);
  assert.match(roomsSrc, /watchSlug:\s*"hang"/);
  assert.match(roomsSrc, /watchName:\s*"Hang"/);
  assert.match(roomsSrc, /Ten of the canopy\. A sloth is not a red panda\. A koala is not a bear\./);
  assert.match(roomsSrc, /isCanopy/);
  assert.match(roomsSrc, /id:\s*"wood"/);
  assert.match(roomsSrc, /id:\s*"hive"/);
  assert.match(roomsSrc, /watchSlug:\s*"rack"/);
  assert.match(roomsSrc, /watchSlug:\s*"comb"/);
  const bleed = shellSrc.slice(shellSrc.indexOf("{desk || demo"), shellSrc.indexOf("mx-auto max-w-6xl px-4 py-8"));
  assert.match(bleed, /wood \|\| canopy/);
});

test("the hive, garden, roost, wood, and sea files stay as they were", () => {
  assert.doesNotMatch(beesSrc, /sloth|lemur|gibbon|kinkajou|colugo|flying_squirrel|howler|tarsier|potto|koala/);
  assert.doesNotMatch(insectsSrc, /sloth|lemur|gibbon|kinkajou/);
  assert.doesNotMatch(hiveDenSrc, /CanopyDen|CANOPY_KEYS|\/canopy/);
  assert.doesNotMatch(pondSrc, /sloth|lemur|gibbon|kinkajou/);
  assert.doesNotMatch(pondDenSrc, /CanopyDen|CANOPY_KEYS|\/canopy/);
  assert.doesNotMatch(seaSrc, /sloth|lemur|gibbon|kinkajou/);
  assert.doesNotMatch(seaDenSrc, /CanopyDen|CANOPY_KEYS|\/canopy/);
  assert.doesNotMatch(gardenSrc, /sloth|lemur|gibbon|kinkajou/);
  assert.doesNotMatch(gardenDenSrc, /CanopyDen|CANOPY_KEYS|\/canopy/);
  assert.doesNotMatch(roostSrc, /sloth|lemur|gibbon|kinkajou/);
  assert.doesNotMatch(cornerSrc, /sloth|lemur|gibbon|kinkajou/);
  assert.doesNotMatch(woodSrc, /sloth|lemur|gibbon|kinkajou|colugo/);
  assert.doesNotMatch(woodDenSrc, /CanopyDen|CANOPY_KEYS|\/canopy/);
  assert.doesNotMatch(meadowSrc, /sloth|lemur|gibbon|kinkajou/);
  assert.match(woodSrc, /name:\s*"Grin"/);
  assert.match(woodSrc, /name:\s*"Coal"/);
  assert.match(insectsSrc, /name:\s*"Comb"/);
  assert.match(insectsSrc, /name:\s*"Twig"/);
  assert.match(insectsSrc, /name:\s*"Fold"/);
});
