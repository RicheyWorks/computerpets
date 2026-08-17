import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const rosterSrc = readFileSync(join(root, "src/lib/pets/roster.ts"), "utf8");
const snakesSrc = readFileSync(join(root, "src/lib/pets/snakes.ts"), "utf8");
const seaSrc = readFileSync(join(root, "src/lib/pets/sea.ts"), "utf8");
const guideSrc = readFileSync(join(root, "src/lib/pets/house-guide.ts"), "utf8");
const studySrc = readFileSync(join(root, "src/routes/study.tsx"), "utf8");
const denSrc = readFileSync(join(root, "src/routes/snakes.tsx"), "utf8");
const plaqueSrc = readFileSync(join(root, "src/components/desk/species-plaque.tsx"), "utf8");
const deskSrc = readFileSync(join(root, "src/components/desk/desk-stage.tsx"), "utf8");
const demoSrc = readFileSync(join(root, "src/components/desk/demo-stage.tsx"), "utf8");

const EXPECTED = [
  ["red_panda", "rui", "Ailurus fulgens"],
  ["cat", "miso", "Felis catus"],
  ["dog", "pip", "Canis familiaris"],
  ["rabbit", "thimble", "Oryctolagus cuniculus"],
  ["hamster", "clip", "Mesocricetus auratus"],
  ["guinea_pig", "whee", "Cavia porcellus"],
  ["turtle", "ink", "Mauremys reevesii"],
  ["goldfish", "coin", "Carassius auratus"],
  ["budgie", "echo", "Melopsittacus undulatus"],
  ["fox", "rue", "Vulpes vulpes"],
  ["penguin", "peck", "Eudyptula minor"],
  ["parrot", "quill", "Ara macao"],
  ["ferret", "wick", "Mustela furo"],
  ["hedgehog", "burr", "Atelerix albiventris"],
  ["chinchilla", "floss", "Chinchilla lanigera"],
  ["axolotl", "bloom", "Ambystoma mexicanum"],
  ["toucan", "keel", "Ramphastos sulfuratus"],
  ["iguana", "sol", "Iguana iguana"],
  ["dragon", "vesper", "kept, not collected"],
  ["phoenix", "ember", "kept in the ash"],
];

function quotedKeys(src) {
  return [...src.matchAll(/key:\s*"([a-z_]+)"/g)].map((m) => m[1]);
}

function sliceEntry(src, key, nextKey) {
  const start = src.indexOf(`"${key}"`);
  const end = nextKey ? src.indexOf(`"${nextKey}"`) : src.length;
  return src.slice(start, end);
}

test("the study lists the same twenty living pets as the roster, and none of the snakes or the tide", () => {
  const rosterKeys = quotedKeys(rosterSrc);
  const snakeKeys = quotedKeys(snakesSrc);
  const seaKeys = quotedKeys(seaSrc);
  const houseKeys = rosterKeys.filter((key) => !snakeKeys.includes(key) && !seaKeys.includes(key));
  const guideKeys = [...guideSrc.matchAll(/entry\(\s*"([a-z_]+)"/g)].map((m) => m[1]);
  assert.deepEqual(houseKeys, EXPECTED.map(([key]) => key));
  assert.deepEqual(guideKeys, houseKeys);
  assert.equal(guideKeys.length, 20);
  for (const key of snakeKeys) {
    assert.equal(guideKeys.includes(key), false);
  }
  for (const key of seaKeys) {
    assert.equal(guideKeys.includes(key), false);
  }
});

test("each house guide entry has a tell, a mix-up, a lesson, and the latin name", () => {
  for (const [key, slug, latin] of EXPECTED) {
    assert.match(guideSrc, new RegExp(`entry\\(\\s*"${key}"`));
    assert.match(rosterSrc, new RegExp(`slug:\\s*"${slug}"`));
    assert.match(guideSrc, new RegExp(latin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  const entries = [...guideSrc.matchAll(/entry\(\s*"[a-z_]+"/g)];
  assert.equal(entries.length, 20);
  assert.match(guideSrc, /tell,/);
  assert.match(guideSrc, /mixup,/);
  assert.match(guideSrc, /lesson,/);
  assert.match(guideSrc, /latin,/);
});

test("the important mix-ups are actually taught", () => {
  const panda = sliceEntry(guideSrc, "red_panda", "cat");
  const axolotl = sliceEntry(guideSrc, "axolotl", "toucan");
  const chinchilla = sliceEntry(guideSrc, "chinchilla", "axolotl");
  const guinea = sliceEntry(guideSrc, "guinea_pig", "turtle");
  const hedgehog = sliceEntry(guideSrc, "hedgehog", "chinchilla");
  const rabbit = sliceEntry(guideSrc, "rabbit", "hamster");
  const goldfish = sliceEntry(guideSrc, "goldfish", "budgie");
  const fox = sliceEntry(guideSrc, "fox", "penguin");
  const penguin = sliceEntry(guideSrc, "penguin", "parrot");
  const dragon = sliceEntry(guideSrc, "dragon", "phoenix");
  assert.match(panda, /not a bear/i);
  assert.match(panda, /raccoon/i);
  assert.match(axolotl, /salamander/i);
  assert.match(axolotl, /gills/i);
  assert.match(axolotl, /not a fish/i);
  assert.match(chinchilla, /dust/i);
  assert.match(guinea, /wheek/i);
  assert.match(hedgehog, /porcupine/i);
  assert.match(hedgehog, /quills that stay/i);
  assert.match(rabbit, /not a rodent/i);
  assert.match(goldfish, /not a koi/i);
  assert.match(fox, /white tip/i);
  assert.match(penguin, /puffin/i);
  assert.match(dragon, /not a Komodo/i);
});

test("the study page is a field guide, not a portrait catalog", () => {
  assert.match(studySrc, /createFileRoute\("\/study"\)/);
  assert.match(studySrc, /HouseStudy/);
  assert.match(studySrc, /SpeciesPlaque/);
  assert.match(studySrc, /\/demo\/\$slug/);
  assert.match(studySrc, /HOUSE_GUIDE\.map/);
  assert.match(studySrc, /\/snakes/);
});

test("the den stays the snake classroom", () => {
  assert.match(denSrc, /createFileRoute\("\/snakes"\)/);
  assert.match(denSrc, /SnakeDen/);
  assert.match(denSrc, /SNAKE_GUIDE\.map/);
  assert.doesNotMatch(denSrc, /HOUSE_GUIDE/);
});

test("plaques appear on desk and demo for any living kind", () => {
  assert.match(plaqueSrc, /plaqueFor/);
  assert.match(plaqueSrc, /classroomFor/);
  assert.match(deskSrc, /SpeciesPlaque/);
  assert.match(demoSrc, /SpeciesPlaque/);
  assert.doesNotMatch(
    deskSrc.slice(deskSrc.indexOf("<SpeciesPlaque"), deskSrc.indexOf("<SpeciesPlaque") + 200),
    /isSnake/,
  );
});
