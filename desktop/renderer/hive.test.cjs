const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const Hive = require("./hive.js");
const Life = require("./life.js");

const hiveSrc = readFileSync(join(__dirname, "hive.js"), "utf8");
const lifeSrc = readFileSync(join(__dirname, "life.js"), "utf8");
const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const htmlSrc = readFileSync(join(__dirname, "index.html"), "utf8");
const cssSrc = readFileSync(join(__dirname, "styles.css"), "utf8");
const webHive = readFileSync(join(__dirname, "..", "..", "web", "src", "lib", "pets", "hive.ts"), "utf8");

test("Wax is the place; Comb, Keep, and Hum sit on it", () => {
  assert.equal(Hive.HIVE_PLACE, "honeycomb");
  assert.equal(Hive.HIVE_WORKER, "honeybee");
  assert.deepEqual([...Hive.HIVE_SITTERS], ["honeybee", "honey_queen", "honey_drone"]);
  assert.equal(Hive.isHivePlace("honeycomb"), true);
  assert.equal(Hive.isHivePlace("honeybee"), false);
  assert.equal(Hive.sitsOnWax("honeybee"), true);
  assert.equal(Hive.sitsOnWax("honeycomb"), false);
  assert.deepEqual(
    Hive.combSeats().map((s) => s.key),
    ["honey_queen", "honeybee", "honeybee", "honey_drone"],
  );
});

test("brood and stores are a reading of the overlay line; neglect can go quiet", () => {
  const living = Hive.colonyOf({ hunger: 78, health: 92 });
  assert.equal(living.quiet, false);
  assert.equal(living.stores, 78);
  assert.equal(living.brood, 7);
  assert.match(Hive.colonyWord(living), /Brood in some cells/);

  const named = Hive.colonyOf({ hunger: 40, health: 50, brood: 3, stores: 40 });
  assert.equal(named.brood, 3);
  assert.equal(named.stores, 40);

  const empty = Hive.colonyOf({ hunger: 8, health: 0, brood: 0, stores: 8 });
  assert.equal(empty.quiet, true);
  assert.equal(Hive.colonyWord(empty), "The line went quieter.");

  const stamped = Hive.stampColony({ hunger: 78, health: 92, mood: 74 });
  assert.equal(stamped.brood, 7);
  assert.equal(stamped.stores, 78);
});

test("the overlay stamps Comb and can go quieter", () => {
  const trait = { extra: {}, hungerH: 10, energyH: 14, hygieneH: 16, hardy: 0.8, social: 0.95, messy: 0.06, sleepStart: 21, sleepEnd: 6 };
  const life = Life.blank();
  const stamped = Life.stampHive({ ...life, hunger: 78, health: 92 }, "honeycomb");
  assert.equal(stamped.brood, 7);
  assert.equal(stamped.stores, 78);
  const dog = Life.stampHive({ ...life, hunger: 40, health: 50 }, "dog");
  assert.equal(dog.brood, undefined);
  assert.equal(dog.stores, undefined);

  const spent = { ...life, hunger: 8, health: 0, brood: 0, stores: 8 };
  assert.match(Life.vitals(spent, "honeycomb"), /The line went quieter/);
  assert.doesNotMatch(Life.vitals(spent, "dog"), /quieter/);

  const fed = Life.act({ ...stamped }, trait, "feed", Date.now(), "honeycomb");
  assert.ok(fed.life.stores > 78 || fed.life.hunger > 78);
  assert.equal(fed.life.stores, fed.life.hunger);

  assert.match(lifeSrc, /stampHive/);
  assert.match(petSrc, /colonyOf\(life/);
  assert.match(petSrc, /colonyWord/);
  assert.match(petSrc, /classList\.toggle\("dull"/);
  assert.match(cssSrc, /#pet\.dull/);
  assert.match(htmlSrc, /hive\.js/);
  assert.match(hiveSrc, /not a shop/);
  assert.match(webHive, /companion_pets\.line/);
  assert.doesNotMatch(hiveSrc, /amphibian/i);
});
