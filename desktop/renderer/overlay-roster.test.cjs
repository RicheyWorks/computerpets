const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const E = require("./ethogram.js");

const roster = JSON.parse(readFileSync(join(__dirname, "roster.json"), "utf8"));
const traitsSrc = readFileSync(join(__dirname, "traits.js"), "utf8");
const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const visitorSrc = readFileSync(join(__dirname, "visitor.js"), "utf8");
const styleSrc = readFileSync(join(__dirname, "styles.css"), "utf8");
const catalogSrc = readFileSync(join(__dirname, "..", "..", "web", "src", "lib", "pets", "catalog.ts"), "utf8");
const treatsSrc = readFileSync(join(__dirname, "..", "..", "web", "src", "lib", "pets", "treats.ts"), "utf8");

const CATALOG = [...catalogSrc.matchAll(/\{ key: "([a-z0-9_]+)"/g)].map((m) => m[1]);
const SHORE = [
  "fiddler_crab",
  "ghost_crab",
  "limpet",
  "barnacle",
  "chiton",
  "periwinkle",
  "sand_dollar",
  "sea_urchin",
  "knobbed_whelk",
  "lugworm",
];
const MEADOW = [
  "field_cricket",
  "katydid",
  "grasshopper",
  "swallowtail",
  "jewelwing",
  "lacewing",
  "earwig",
  "acorn_weevil",
  "click_beetle",
  "robber_fly",
];
const BEES = [
  "bumblebee",
  "carpenter_bee",
  "mason_bee",
  "leafcutter",
  "stingless",
  "sweat_bee",
  "mining_bee",
  "honey_drone",
  "honey_queen",
  "honeycomb",
];
const CANOPY = [
  "sloth",
  "lemur",
  "gibbon",
  "kinkajou",
  "colugo",
  "flying_squirrel",
  "howler",
  "tarsier",
  "potto",
  "koala",
];
const REEF = [
  "brain_coral",
  "anemone",
  "clownfish",
  "parrotfish",
  "cleaner_shrimp",
  "sea_cucumber",
  "lionfish",
  "giant_clam",
  "eagle_ray",
  "grouper",
];

function objectKeys(src, marker) {
  const start = src.indexOf(marker);
  const slice = src.slice(start);
  return [...slice.matchAll(/^\s{2}([a-z0-9_]+):\s/gm)].map((m) => m[1]);
}

test("the overlay roster is the same two hundred ten as the catalog", () => {
  const keys = roster.map((r) => r.key);
  assert.equal(keys.length, 210);
  assert.deepEqual(keys.sort(), [...CATALOG].sort());
});

test("every overlay guest keeps their own life traits, not Rui's clock", () => {
  const traitKeys = objectKeys(traitsSrc, "window.PET_TRAITS = {");
  for (const key of CATALOG) {
    assert.ok(traitKeys.includes(key), key);
    assert.match(traitsSrc, new RegExp(`^\\s{2}${key}: \\{`, "m"));
  }
  assert.match(traitsSrc, /special: "wave"/);
  assert.match(traitsSrc, /special: "chirp"/);
  assert.doesNotMatch(traitsSrc.slice(traitsSrc.indexOf("fiddler_crab:")), /special: "ribbon"/);
});

test("shore, meadow, canopy, and reef keep their own idle acts on the overlay", () => {
  for (const key of [...SHORE, ...MEADOW, ...CANOPY, ...REEF]) {
    const names = E.actsFor(key).map((a) => a.name);
    assert.ok(names.length > 0, key);
    assert.equal(names.includes("scratch"), false, key);
  }
  assert.ok(E.actsFor("fiddler_crab").some((a) => a.name === "wave"));
  assert.ok(E.actsFor("field_cricket").some((a) => a.name === "chirp"));
  assert.ok(E.actsFor("grasshopper").some((a) => a.name === "vault"));
  assert.ok(E.actsFor("sloth").some((a) => a.name === "hang"));
  assert.ok(E.actsFor("koala").some((a) => a.name === "chew"));
  assert.ok(E.actsFor("brain_coral").some((a) => a.name === "ridge"));
  assert.ok(E.actsFor("grouper").some((a) => a.name === "hide"));
});

test("shore, meadow, canopy, and reef keep a living special on the overlay, not an idle", () => {
  const specialsSrc = readFileSync(join(__dirname, "specials.js"), "utf8");
  const Special = require("./specials.js");
  for (const key of [...SHORE, ...MEADOW, ...CANOPY, ...REEF]) {
    const match = traitsSrc.match(new RegExp(`^\\s{2}${key}: \\{[\\s\\S]*?special: "([a-z]+)"`, "m"));
    assert.ok(match, key);
    assert.notEqual(Special.commandFor(match[1]), "idle", key);
  }
  assert.equal(Special.verbFor("brain_coral"), "Ridge");
  assert.equal(Special.verbFor("field_cricket"), "Chirp");
  assert.equal(Special.verbFor("fiddler_crab"), "Wave");
  assert.equal(Special.verbFor("sloth"), "Hang");
  assert.match(specialsSrc, /Ridge sits/);
});

test("treat shapes and visit lines cover bees, shore, meadow, canopy, and reef", () => {
  const treatKeys = objectKeys(petSrc, "const TREAT_SHAPE = {");
  const visitKeys = objectKeys(visitorSrc, "const VISIT_LINE = {");
  for (const key of [...BEES, ...SHORE, ...MEADOW, ...CANOPY, ...REEF]) {
    assert.ok(treatKeys.includes(key), `treat ${key}`);
    assert.ok(visitKeys.includes(key), `visit ${key}`);
  }
  assert.match(petSrc, /fiddler_crab: "flake"/);
  assert.match(petSrc, /field_cricket: "flake"/);
  assert.match(petSrc, /sloth: "leaf"/);
  assert.match(petSrc, /koala: "leaf"/);
  assert.match(petSrc, /brain_coral: "flake"/);
  assert.match(visitorSrc, /honeycomb: "I sat\. Then the line went quieter\."/);
  assert.match(visitorSrc, /fiddler_crab: "I waved\. Then I left the marsh\."/);
  assert.match(visitorSrc, /field_cricket: "I sang\. Then I left the grass\."/);
  assert.match(visitorSrc, /sloth: "I hung\. Then I left the bough\."/);
  assert.match(visitorSrc, /koala: "I chewed\. Then I left the gum\."/);
  assert.match(visitorSrc, /brain_coral: "I sat the rock\. Then I left the boulder\."/);
  assert.match(visitorSrc, /grouper: "I sat the hole\. Then I left the dish\."/);
});

test("the overlay drops the same treat the desk already drops, including the egg", () => {
  const webShapes = Object.fromEntries(
    [...treatsSrc.matchAll(/^\s{2}([a-z0-9_]+): \{ shape: "([a-z]+)"/gm)].map((m) => [m[1], m[2]]),
  );
  const overlayStart = petSrc.indexOf("const TREAT_SHAPE = {");
  const overlaySlice = petSrc.slice(overlayStart, petSrc.indexOf("};", overlayStart));
  const overlayShapes = Object.fromEntries(
    [...overlaySlice.matchAll(/^\s{2}([a-z0-9_]+): "([a-z]+)"/gm)].map((m) => [m[1], m[2]]),
  );
  assert.equal(Object.keys(overlayShapes).length, 210);
  assert.equal(Object.keys(webShapes).length, 210);
  for (const key of CATALOG) {
    assert.equal(overlayShapes[key], webShapes[key], key);
  }
  assert.equal(overlayShapes.kingsnake, "egg");
  assert.equal(overlayShapes.milk_snake, "egg");
  assert.match(styleSrc, /data-shape="egg"/);
  assert.match(styleSrc, /border-radius: 50% 50% 45% 45%/);
  assert.doesNotMatch(petSrc, /kingsnake: "pebble"/);
  assert.doesNotMatch(petSrc, /milk_snake: "pebble"/);
});
