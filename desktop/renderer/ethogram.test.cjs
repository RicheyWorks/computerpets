const assert = require("node:assert/strict");
const { test } = require("node:test");
const E = require("./ethogram.js");

test("snake keys never schedule scratch and can schedule tongue", () => {
  for (const key of E.TONGUE_KEYS) {
    const names = E.actsFor(key).map((a) => a.name);
    assert.ok(names.includes("tongue"), key);
    assert.equal(names.includes("scratch"), false, key);
  }
  let tongue = 0;
  for (let i = 0; i < 80; i++) {
    const act = E.pickAct("garter");
    assert.notEqual(act && act.name, "scratch");
    if (act && act.name === "tongue") tongue += 1;
  }
  assert.ok(tongue > 0);
});

test("only the scratching mammals list scratch", () => {
  assert.deepEqual(E.SCRATCH_KEYS, ["dog", "cat", "red_panda"]);
  assert.equal(E.actsFor("fox").some((a) => a.name === "scratch"), false);
  assert.equal(E.actsFor("iguana").some((a) => a.name === "scratch"), false);
  for (const key of ["octopus", "moon_jelly", "horseshoe_crab", "moray", "moss", "venus_flytrap", "saguaro"]) {
    const names = E.actsFor(key).map((a) => a.name);
    assert.ok(names.length > 0, key);
    assert.equal(names.includes("scratch"), false, key);
    assert.equal(names.includes("tongue"), false, key);
  }
});

test("insect keys never schedule scratch, tongue, or a mammal nibble", () => {
  const insects = [
    "honeybee", "monarch", "luna", "firefly", "darner",
    "stick", "carpenter_ant", "ladybird", "mantis", "cicada",
  ];
  for (const key of insects) {
    const names = E.actsFor(key).map((a) => a.name);
    assert.ok(names.length > 0, key);
    assert.equal(names.includes("scratch"), false, key);
    assert.equal(names.includes("tongue"), false, key);
    assert.equal(names.includes("eat"), false, key);
  }
  assert.ok(E.actsFor("honeybee").some((a) => a.name === "waggle"));
  assert.ok(E.actsFor("firefly").some((a) => a.name === "flash"));
  assert.ok(E.actsFor("luna").some((a) => a.name === "still"));
  assert.ok(E.actsFor("cicada").some((a) => a.name === "emerge"));
});

test("fungi keys never schedule scratch or tongue", () => {
  const fungi = [
    "oyster", "fly_agaric", "morel", "chanterelle", "turkey_tail",
    "lions_mane", "puffball", "chicken_of_woods", "yeast", "lichen",
  ];
  for (const key of fungi) {
    const names = E.actsFor(key).map((a) => a.name);
    assert.ok(names.length > 0, key);
    assert.equal(names.includes("scratch"), false, key);
    assert.equal(names.includes("tongue"), false, key);
    assert.equal(names.includes("waggle"), false, key);
  }
  assert.ok(E.actsFor("puffball").some((a) => a.name === "puff"));
  assert.ok(E.actsFor("yeast").some((a) => a.name === "rise"));
  assert.ok(E.actsFor("lichen").some((a) => a.name === "share-still"));
});

test("far keys never schedule scratch or tongue", () => {
  const far = [
    "photovore", "choir", "nimbus", "silica", "terminator",
    "nexus", "halovore", "magneton", "umbral", "cyst",
  ];
  for (const key of far) {
    const names = E.actsFor(key).map((a) => a.name);
    assert.ok(names.length > 0, key);
    assert.equal(names.includes("scratch"), false, key);
    assert.equal(names.includes("tongue"), false, key);
  }
  assert.ok(E.actsFor("photovore").some((a) => a.name === "drink-light"));
  assert.ok(E.actsFor("choir").some((a) => a.name === "chord-pulse"));
  assert.ok(E.actsFor("nimbus").some((a) => a.name === "float"));
  assert.ok(E.actsFor("silica").some((a) => a.name === "facet"));
  assert.ok(E.actsFor("terminator").some((a) => a.name === "edge-walk"));
  assert.ok(E.actsFor("nexus").some((a) => a.name === "count-ripple"));
  assert.ok(E.actsFor("halovore").some((a) => a.name === "frost"));
  assert.ok(E.actsFor("magneton").some((a) => a.name === "align"));
  assert.ok(E.actsFor("umbral").some((a) => a.name === "dim"));
  assert.ok(E.actsFor("cyst").some((a) => a.name === "wake"));
});

test("shore and meadow keys never schedule scratch or a snake tongue", () => {
  const shore = [
    "fiddler_crab", "ghost_crab", "limpet", "barnacle", "chiton",
    "periwinkle", "sand_dollar", "sea_urchin", "knobbed_whelk", "lugworm",
  ];
  const meadow = [
    "field_cricket", "katydid", "grasshopper", "swallowtail", "jewelwing",
    "lacewing", "earwig", "acorn_weevil", "click_beetle", "robber_fly",
  ];
  for (const key of [...shore, ...meadow]) {
    const names = E.actsFor(key).map((a) => a.name);
    assert.ok(names.length > 0, key);
    assert.equal(names.includes("scratch"), false, key);
    assert.equal(names.includes("tongue"), false, key);
  }
  assert.ok(E.actsFor("fiddler_crab").some((a) => a.name === "wave"));
  assert.ok(E.actsFor("field_cricket").some((a) => a.name === "chirp"));
  assert.ok(E.actsFor("grasshopper").some((a) => a.name === "vault"));
  assert.ok(E.actsFor("click_beetle").some((a) => a.name === "click"));
});
