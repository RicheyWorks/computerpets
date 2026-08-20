const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const E = require("./ethogram.js");

const roster = JSON.parse(readFileSync(join(__dirname, "roster.json"), "utf8"));
const traitsSrc = readFileSync(join(__dirname, "traits.js"), "utf8");
const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const catalogSrc = readFileSync(join(__dirname, "..", "..", "web", "src", "lib", "pets", "catalog.ts"), "utf8");

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

function objectKeys(src, marker) {
  const start = src.indexOf(marker);
  const slice = src.slice(start);
  return [...slice.matchAll(/^\s{2}([a-z0-9_]+):\s/gm)].map((m) => m[1]);
}

test("the overlay roster is the same two hundred as the catalog", () => {
  const keys = roster.map((r) => r.key);
  assert.equal(keys.length, 200);
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

test("shore, meadow, and canopy keep their own idle acts on the overlay", () => {
  for (const key of [...SHORE, ...MEADOW, ...CANOPY]) {
    const names = E.actsFor(key).map((a) => a.name);
    assert.ok(names.length > 0, key);
    assert.equal(names.includes("scratch"), false, key);
  }
  assert.ok(E.actsFor("fiddler_crab").some((a) => a.name === "wave"));
  assert.ok(E.actsFor("field_cricket").some((a) => a.name === "chirp"));
  assert.ok(E.actsFor("grasshopper").some((a) => a.name === "vault"));
  assert.ok(E.actsFor("sloth").some((a) => a.name === "hang"));
  assert.ok(E.actsFor("koala").some((a) => a.name === "chew"));
});

test("treat shapes and visit lines cover bees, shore, meadow, and canopy", () => {
  const treatKeys = objectKeys(petSrc, "const TREAT_SHAPE = {");
  const visitKeys = objectKeys(petSrc, "const VISIT_LINE = {");
  for (const key of [...BEES, ...SHORE, ...MEADOW, ...CANOPY]) {
    assert.ok(treatKeys.includes(key), `treat ${key}`);
    assert.ok(visitKeys.includes(key), `visit ${key}`);
  }
  assert.match(petSrc, /fiddler_crab: "flake"/);
  assert.match(petSrc, /field_cricket: "flake"/);
  assert.match(petSrc, /sloth: "leaf"/);
  assert.match(petSrc, /koala: "leaf"/);
  assert.match(petSrc, /honeycomb: "I sat\. Then the line went quieter\."/);
  assert.match(petSrc, /fiddler_crab: "I waved\. Then I left the marsh\."/);
  assert.match(petSrc, /field_cricket: "I sang\. Then I left the grass\."/);
  assert.match(petSrc, /sloth: "I hung\. Then I left the bough\."/);
  assert.match(petSrc, /koala: "I chewed\. Then I left the gum\."/);
});
