import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const meadowSrc = readFileSync(join(root, "src/lib/pets/meadow.ts"), "utf8");
const guideSrc = readFileSync(join(root, "src/lib/pets/meadow-guide.ts"), "utf8");
const denSrc = readFileSync(join(root, "src/routes/meadow.tsx"), "utf8");
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
const shellSrc = readFileSync(join(root, "src/components/app-shell.tsx"), "utf8");

const EXPECTED = [
  ["field_cricket", "chirp", "Gryllus pennsylvanicus"],
  ["katydid", "blade", "Pterophylla camellifolia"],
  ["grasshopper", "vault", "Melanoplus differentialis"],
  ["swallowtail", "banner", "Papilio glaucus"],
  ["jewelwing", "jewel", "Calopteryx maculata"],
  ["lacewing", "lace", "Chrysoperla carnea"],
  ["earwig", "forceps", "Forficula auricularia"],
  ["acorn_weevil", "snout", "Curculio glandium"],
  ["click_beetle", "click", "Alaus oculatus"],
  ["robber_fly", "rob", "Efferia aestuans"],
];

function quotedKeys(src) {
  return [...src.matchAll(/key:\s*"([a-z_]+)"/g)].map((m) => m[1]);
}

test("the meadow lists the same ten guests as the roster", () => {
  const rosterKeys = quotedKeys(meadowSrc);
  const guideKeys = [...guideSrc.matchAll(/entry\(\s*"([a-z_]+)"/g)].map((m) => m[1]);
  assert.deepEqual(rosterKeys, EXPECTED.map(([key]) => key));
  assert.deepEqual(guideKeys, rosterKeys);
  assert.equal(guideKeys.length, 10);
});

test("each guide entry has a tell, a mix-up, a lesson, and the latin name", () => {
  for (const [key, slug, latin] of EXPECTED) {
    assert.match(guideSrc, new RegExp(`entry\\(\\s*"${key}"`));
    assert.match(meadowSrc, new RegExp(`slug:\\s*"${slug}"`));
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
  const cricket = guideSrc.slice(guideSrc.indexOf('"field_cricket"'), guideSrc.indexOf('"katydid"'));
  const katydid = guideSrc.slice(guideSrc.indexOf('"katydid"'), guideSrc.indexOf('"grasshopper"'));
  const grasshopper = guideSrc.slice(guideSrc.indexOf('"grasshopper"'), guideSrc.indexOf('"swallowtail"'));
  const swallowtail = guideSrc.slice(guideSrc.indexOf('"swallowtail"'), guideSrc.indexOf('"jewelwing"'));
  const jewelwing = guideSrc.slice(guideSrc.indexOf('"jewelwing"'), guideSrc.indexOf('"lacewing"'));
  const lacewing = guideSrc.slice(guideSrc.indexOf('"lacewing"'), guideSrc.indexOf('"earwig"'));
  const earwig = guideSrc.slice(guideSrc.indexOf('"earwig"'), guideSrc.indexOf('"acorn_weevil"'));
  const weevil = guideSrc.slice(guideSrc.indexOf('"acorn_weevil"'), guideSrc.indexOf('"click_beetle"'));
  const click = guideSrc.slice(guideSrc.indexOf('"click_beetle"'), guideSrc.indexOf('"robber_fly"'));
  const robber = guideSrc.slice(guideSrc.indexOf('"robber_fly"'));
  assert.match(cricket, /not a cicada/i);
  assert.match(cricket, /Brood/);
  assert.match(cricket, /song/i);
  assert.match(katydid, /not a grasshopper/i);
  assert.match(katydid, /not Vault/i);
  assert.match(katydid, /wings are leaves/i);
  assert.match(grasshopper, /not Leap/i);
  assert.match(grasshopper, /not Hop/i);
  assert.match(grasshopper, /not Blade/i);
  assert.match(swallowtail, /not Milk/i);
  assert.match(swallowtail, /not Ghost/i);
  assert.match(swallowtail, /not a monarch/i);
  assert.match(jewelwing, /not Dart/i);
  assert.match(jewelwing, /not a darner/i);
  assert.match(jewelwing, /damselfly/i);
  assert.match(lacewing, /not a moth/i);
  assert.match(lacewing, /not Ghost/i);
  assert.match(lacewing, /lion/i);
  assert.match(earwig, /not Fold/i);
  assert.match(earwig, /cerci/i);
  assert.match(earwig, /not a sting/i);
  assert.match(weevil, /not Auger/i);
  assert.match(weevil, /not Mast/i);
  assert.match(weevil, /not a bee/i);
  assert.match(click, /not Snap/i);
  assert.match(click, /not Spark/i);
  assert.match(click, /not a firefly/i);
  assert.match(robber, /not a bee/i);
  assert.match(robber, /not Thrum/i);
  assert.match(robber, /not Sip/i);
});

test("the meadow page is a field guide, not a costume party", () => {
  assert.match(denSrc, /createFileRoute\("\/meadow"\)/);
  assert.match(denSrc, /MeadowDen/);
  assert.match(denSrc, /SpeciesPlaque/);
  assert.match(denSrc, /\/demo\/\$slug/);
  assert.match(denSrc, /MEADOW_GUIDE\.map/);
  assert.match(denSrc, /a cricket is not a cicada/i);
  assert.match(denSrc, /a katydid is not a grasshopper/i);
  assert.doesNotMatch(denSrc, /Wikipedia/i);
  assert.doesNotMatch(denSrc, /NFT/i);
});

test("the catalog and living roster include the ten meadow keys", () => {
  for (const [key] of EXPECTED) {
    assert.match(catalogSrc, new RegExp(`key:\\s*"${key}"`));
  }
  assert.match(rosterSrc, /MEADOW_ROSTER/);
  assert.doesNotMatch(meadowSrc, /slug:\s*"comb"/);
  assert.doesNotMatch(meadowSrc, /name:\s*"Comb"/);
  assert.doesNotMatch(meadowSrc, /slug:\s*"brood"/);
  assert.doesNotMatch(meadowSrc, /name:\s*"Brood"/);
  assert.doesNotMatch(meadowSrc, /name:\s*"Milk"/);
  assert.doesNotMatch(meadowSrc, /name:\s*"Ghost"/);
  assert.doesNotMatch(meadowSrc, /name:\s*"Dart"/);
  assert.doesNotMatch(meadowSrc, /name:\s*"Thrum"/);
  assert.doesNotMatch(meadowSrc, /name:\s*"Leap"/);
  assert.doesNotMatch(meadowSrc, /name:\s*"Hop"/);
  assert.doesNotMatch(guideSrc, /Wikipedia/i);
  assert.equal([...catalogSrc.matchAll(/\{ key: "/g)].length, 190);
});

test("rooms.ts only adds a meadow room", () => {
  assert.match(roomsSrc, /id:\s*"meadow"/);
  assert.match(roomsSrc, /watchSlug:\s*"chirp"/);
  assert.match(roomsSrc, /watchName:\s*"Chirp"/);
  assert.match(roomsSrc, /Ten of the meadow\. A cricket is not a cicada\. A katydid is not a grasshopper\./);
  assert.match(roomsSrc, /isMeadow/);
  assert.match(roomsSrc, /id:\s*"hive"/);
  assert.match(roomsSrc, /id:\s*"shore"/);
  assert.match(roomsSrc, /id:\s*"tide"/);
  assert.match(roomsSrc, /watchSlug:\s*"comb"/);
  assert.match(roomsSrc, /watchSlug:\s*"wave"/);
  assert.match(roomsSrc, /watchSlug:\s*"cup"/);
  const bleed = shellSrc.slice(shellSrc.indexOf("{desk || demo"), shellSrc.indexOf("mx-auto max-w-6xl px-4 py-8"));
  assert.match(bleed, /shore \|\| meadow/);
});

test("the hive, garden, roost, shore, and sea files stay as they were", () => {
  assert.doesNotMatch(beesSrc, /field_cricket|katydid|grasshopper|swallowtail|jewelwing|lacewing|earwig|acorn_weevil|click_beetle|robber_fly/);
  assert.doesNotMatch(insectsSrc, /field_cricket|katydid|grasshopper|swallowtail|jewelwing/);
  assert.doesNotMatch(hiveDenSrc, /MeadowDen|MEADOW_KEYS|\/meadow/);
  assert.doesNotMatch(pondSrc, /field_cricket|katydid|grasshopper|swallowtail/);
  assert.doesNotMatch(pondDenSrc, /MeadowDen|MEADOW_KEYS|\/meadow/);
  assert.doesNotMatch(seaSrc, /field_cricket|katydid|grasshopper|swallowtail/);
  assert.doesNotMatch(seaDenSrc, /MeadowDen|MEADOW_KEYS|\/meadow/);
  assert.doesNotMatch(gardenSrc, /field_cricket|katydid|grasshopper|swallowtail/);
  assert.doesNotMatch(gardenDenSrc, /MeadowDen|MEADOW_KEYS|\/meadow/);
  assert.doesNotMatch(roostSrc, /field_cricket|katydid|grasshopper|swallowtail/);
  assert.doesNotMatch(cornerSrc, /field_cricket|katydid|grasshopper|swallowtail/);
  assert.doesNotMatch(woodSrc, /field_cricket|katydid|grasshopper|swallowtail/);
  assert.doesNotMatch(shoreSrc, /field_cricket|katydid|grasshopper|swallowtail/);
  assert.doesNotMatch(shoreDenSrc, /MeadowDen|MEADOW_KEYS|\/meadow/);
  assert.match(insectsSrc, /name:\s*"Comb"/);
  assert.match(insectsSrc, /name:\s*"Brood"/);
  assert.match(insectsSrc, /name:\s*"Milk"/);
  assert.match(insectsSrc, /name:\s*"Ghost"/);
  assert.match(beesSrc, /name:\s*"Thrum"/);
  assert.match(beesSrc, /name:\s*"Auger"/);
});
