const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const Special = require("./specials.js");
const Life = require("./life.js");

const catalogSrc = readFileSync(join(__dirname, "..", "..", "web", "src", "lib", "pets", "catalog.ts"), "utf8");
const traitsSrc = readFileSync(join(__dirname, "..", "..", "web", "src", "lib", "pets", "traits.ts"), "utf8");
const webSpecials = readFileSync(join(__dirname, "..", "..", "web", "src", "lib", "pets", "specials.ts"), "utf8");
const overlayTraits = readFileSync(join(__dirname, "traits.js"), "utf8");
const lifeSrc = readFileSync(join(__dirname, "life.js"), "utf8");
const htmlSrc = readFileSync(join(__dirname, "index.html"), "utf8");
const mainSrc = readFileSync(join(__dirname, "..", "main.cjs"), "utf8");
const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");

const CATALOG = [...catalogSrc.matchAll(/\{ key: "([a-z0-9_]+)"/g)].map((m) => m[1]);
const WEB_TRAITS = Object.fromEntries(
  traitsSrc.split("\n").flatMap((line) => {
    const m = line.match(/^\s{2}([a-z0-9_]+): T\(.*, "([a-z]+)", "([^"]+)", "/);
    return m ? [[m[1], { special: m[2], verb: m[3] }]] : [];
  }),
);
const OVERLAY_SPECIAL = Object.fromEntries(
  [...overlayTraits.matchAll(/^\s{2}([a-z0-9_]+): \{[\s\S]*?special: "([a-z]+)"/gm)].map((m) => [m[1], m[2]]),
);

const LATER = {
  shore: ["fiddler_crab", "ghost_crab", "limpet", "barnacle", "chiton", "periwinkle", "sand_dollar", "sea_urchin", "knobbed_whelk", "lugworm"],
  meadow: ["field_cricket", "katydid", "grasshopper", "swallowtail", "jewelwing", "lacewing", "earwig", "acorn_weevil", "click_beetle", "robber_fly"],
  canopy: ["sloth", "lemur", "gibbon", "kinkajou", "colugo", "flying_squirrel", "howler", "tarsier", "potto", "koala"],
  reef: ["brain_coral", "anemone", "clownfish", "parrotfish", "cleaner_shrimp", "sea_cucumber", "lionfish", "giant_clam", "eagle_ray", "grouper"],
  wood: ["deer", "bat", "squirrel", "otter", "raccoon", "skunk", "opossum", "beaver", "porcupine", "black_bear"],
  stone: ["gecko", "anole", "skink", "chameleon", "horned_lizard", "alligator", "crocodile", "snapper", "box_turtle", "tuatara"],
  creek: ["bass", "brook_trout", "catfish", "bluegill", "perch", "pike", "walleye", "paddlefish", "lamprey", "american_eel"],
  log: ["house_centipede", "millipede", "pillbug", "earthworm", "velvet_worm", "springtail", "tardigrade", "planarian", "nematode", "amphipod"],
};

function blankStats() {
  return { hunger: 78, mood: 50, energy: 50, hygiene: 50, health: 80, bond: 10 };
}

test("every overlay guest keeps the same special verb the desk already keeps", () => {
  assert.equal(Object.keys(Special.VERB).length, 210);
  assert.deepEqual(Object.keys(Special.VERB).sort(), [...CATALOG].sort());
  assert.equal(Object.keys(WEB_TRAITS).length, 210);
  for (const key of CATALOG) {
    assert.equal(Special.verbFor(key), WEB_TRAITS[key].verb, key);
    assert.equal(OVERLAY_SPECIAL[key], WEB_TRAITS[key].special, key);
  }
  assert.equal(Special.verbFor("brain_coral"), "Ridge");
  assert.equal(Special.verbFor("field_cricket"), "Chirp");
  assert.equal(Special.verbFor("fiddler_crab"), "Wave");
  assert.equal(Special.verbFor("howler"), "Boom");
  assert.equal(Special.verbFor("red_panda"), "Steal ribbon");
  assert.equal(Special.verbFor("not_a_pet"), "Special");
});

test("later dens sit, wander, and talk the house way, and do not idle", () => {
  const pins = {
    brain_coral: "sit",
    field_cricket: "talk",
    fiddler_crab: "wander",
    howler: "talk",
    sloth: "sit",
    grasshopper: "wander",
    gecko: "wander",
    tardigrade: "sit",
    bass: "wander",
    deer: "wander",
    velvet_worm: "play",
    grouper: "sit",
  };
  for (const [key, cmd] of Object.entries(pins)) {
    const special = OVERLAY_SPECIAL[key];
    assert.equal(Special.commandFor(special), cmd, key);
    const applied = Special.applySpecial(blankStats(), special);
    assert.equal(applied.cmd, cmd, key);
    assert.equal(applied.stats.bond, 12, key);
  }
  for (const key of Object.values(LATER).flat()) {
    const cmd = Special.commandFor(OVERLAY_SPECIAL[key]);
    assert.notEqual(cmd, "idle", key);
  }
  assert.equal(Special.commandFor("regrow"), "idle");
  assert.match(webSpecials, /case "ridge"/);
  assert.match(webSpecials, /case "chirp"/);
  assert.match(webSpecials, /case "wave"/);
});

test("the overlay special is the same living sit as the desk, and the floor keeps its extras", () => {
  const trait = (special, line) => ({ special, extra: { special: [line] } });
  const ridge = Life.act(Life.blank(), trait("ridge", "I sat the rock. Hello."), "special", Date.now(), "brain_coral");
  assert.equal(ridge.cmd, "sit");
  assert.equal(ridge.line, "I sat the rock. Hello.");
  assert.ok(ridge.life.energy > 80);
  assert.ok(ridge.life.mood > 74);

  const chirp = Life.act(Life.blank(), trait("chirp", "I sang. Hello."), "special", Date.now(), "field_cricket");
  assert.equal(chirp.cmd, "talk");
  assert.ok(chirp.life.mood > 74);

  const wave = Life.act(Life.blank(), trait("wave", "I waved. Hello."), "special", Date.now(), "fiddler_crab");
  assert.equal(wave.cmd, "wander");

  const now = Date.now();
  const ribbon = Life.act({ ...Life.blank(), bond: 60, ribbon: 0, gifts: [] }, trait("ribbon", "I found a ribbon."), "special", now, "red_panda");
  assert.equal(ribbon.cmd, "play");
  assert.equal(ribbon.life.ribbon, 1);
  assert.equal(ribbon.notify, "ribbon");
  assert.equal(ribbon.life.gifts.length, 1);

  const steal = Life.act({ ...Life.blank(), mess: [] }, trait("steal", "I put your dongle somewhere better."), "special", now, "ferret");
  assert.equal(steal.cmd, "play");
  assert.equal(steal.notify, "steal");
  assert.equal(steal.life.mess.length, 1);

  const thump = Life.act(Life.blank(), trait("thump", "Thump."), "special", now, "rabbit");
  assert.equal(thump.cmd, "wander");
  assert.equal(thump.life.startledUntil, now + 2500);

  assert.match(lifeSrc, /PetSpecial/);
  assert.match(lifeSrc, /applySpecial/);
  assert.match(htmlSrc, /specials\.js/);
  assert.match(petSrc, /verbFor\(kind\.key\)/);
  assert.match(mainSrc, /lastVitals\.verb \|\| "Special"/);
  assert.doesNotMatch(lifeSrc, /pick\(extra\.special \|\| \["\.\.\."\]\), cmd: "idle"/);
});
