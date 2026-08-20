import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pondSrc = readFileSync(join(root, "src/lib/pets/pond.ts"), "utf8");
const guideSrc = readFileSync(join(root, "src/lib/pets/pond-guide.ts"), "utf8");
const denSrc = readFileSync(join(root, "src/routes/pond.tsx"), "utf8");
const catalogSrc = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");
const rosterSrc = readFileSync(join(root, "src/lib/pets/roster.ts"), "utf8");
const beesSrc = readFileSync(join(root, "src/lib/pets/bees.ts"), "utf8");
const hiveDenSrc = readFileSync(join(root, "src/components/desk/hive-den.tsx"), "utf8");

const EXPECTED = [
  ["frog", "reed", "Lithobates clamitans"],
  ["toad", "pebble", "Anaxyrus americanus"],
  ["newt", "eft", "Notophthalmus viridescens"],
  ["salamander", "dapple", "Ambystoma maculatum"],
  ["caecilian", "slip", "Typhlonectes natans"],
  ["crayfish", "pinch", "Cambarus bartonii"],
  ["pond_snail", "whorl", "Lymnaea stagnalis"],
  ["mussel", "hinge", "Elliptio complanata"],
  ["leech", "latch", "Haemopis sanguisuga"],
  ["stickleback", "prickle", "Gasterosteus aculeatus"],
];

function quotedKeys(src) {
  return [...src.matchAll(/key:\s*"([a-z_]+)"/g)].map((m) => m[1]);
}

test("the pond lists the same ten guests as the roster", () => {
  const rosterKeys = quotedKeys(pondSrc);
  const guideKeys = [...guideSrc.matchAll(/entry\(\s*"([a-z_]+)"/g)].map((m) => m[1]);
  assert.deepEqual(rosterKeys, EXPECTED.map(([key]) => key));
  assert.deepEqual(guideKeys, rosterKeys);
  assert.equal(guideKeys.length, 10);
});

test("each guide entry has a tell, a mix-up, a lesson, and the latin name", () => {
  for (const [key, slug, latin] of EXPECTED) {
    assert.match(guideSrc, new RegExp(`entry\\(\\s*"${key}"`));
    assert.match(pondSrc, new RegExp(`slug:\\s*"${slug}"`));
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
  const frog = guideSrc.slice(guideSrc.indexOf('"frog"'), guideSrc.indexOf('"toad"'));
  const toad = guideSrc.slice(guideSrc.indexOf('"toad"'), guideSrc.indexOf('"newt"'));
  const newt = guideSrc.slice(guideSrc.indexOf('"newt"'), guideSrc.indexOf('"salamander"'));
  const salamander = guideSrc.slice(guideSrc.indexOf('"salamander"'), guideSrc.indexOf('"caecilian"'));
  const caecilian = guideSrc.slice(guideSrc.indexOf('"caecilian"'), guideSrc.indexOf('"crayfish"'));
  const crayfish = guideSrc.slice(guideSrc.indexOf('"crayfish"'), guideSrc.indexOf('"pond_snail"'));
  const snail = guideSrc.slice(guideSrc.indexOf('"pond_snail"'), guideSrc.indexOf('"mussel"'));
  const mussel = guideSrc.slice(guideSrc.indexOf('"mussel"'), guideSrc.indexOf('"leech"'));
  const leech = guideSrc.slice(guideSrc.indexOf('"leech"'), guideSrc.indexOf('"stickleback"'));
  const stickleback = guideSrc.slice(guideSrc.indexOf('"stickleback"'));
  assert.match(frog, /not a toad/i);
  assert.match(frog, /Pebble/);
  assert.match(toad, /not a frog/i);
  assert.match(toad, /Reed/);
  assert.match(newt, /not a lizard/i);
  assert.match(newt, /Sol/);
  assert.match(salamander, /not a lizard/i);
  assert.match(salamander, /not Eft/i);
  assert.match(caecilian, /not a worm/i);
  assert.match(caecilian, /Latch/);
  assert.match(crayfish, /not an insect/i);
  assert.match(crayfish, /Comb/);
  assert.match(snail, /not an insect/i);
  assert.match(snail, /Tenant/);
  assert.match(mussel, /not a sea guest/i);
  assert.match(mussel, /Ochre/);
  assert.match(leech, /not a worm/i);
  assert.match(leech, /Slip/);
  assert.match(leech, /blood rumor/i);
  assert.match(stickleback, /not a goldfish/i);
  assert.match(stickleback, /Coin/);
});

test("the pond page is a field guide, not a costume party", () => {
  assert.match(denSrc, /createFileRoute\("\/pond"\)/);
  assert.match(denSrc, /PondDen/);
  assert.match(denSrc, /SpeciesPlaque/);
  assert.match(denSrc, /\/demo\/\$slug/);
  assert.match(denSrc, /POND_GUIDE\.map/);
  assert.match(denSrc, /a frog is not a toad/i);
  assert.doesNotMatch(denSrc, /axolotl/i);
});

test("the catalog and living roster include the ten pond keys", () => {
  for (const [key] of EXPECTED) {
    assert.match(catalogSrc, new RegExp(`key:\\s*"${key}"`));
  }
  assert.match(rosterSrc, /POND_ROSTER/);
  assert.doesNotMatch(pondSrc, /slug:\s*"bloom"/);
  assert.doesNotMatch(pondSrc, /key:\s*"axolotl"/);
  assert.doesNotMatch(guideSrc, /Wikipedia/i);
});

test("the hive files stay as they were", () => {
  assert.doesNotMatch(beesSrc, /frog|toad|stickleback|pond_snail/);
  assert.doesNotMatch(hiveDenSrc, /PondDen|POND_KEYS|\/pond/);
});
