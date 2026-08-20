const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const H = require("./hours.js");
const Life = require("./life.js");

const catalogSrc = readFileSync(join(__dirname, "..", "..", "web", "src", "lib", "pets", "catalog.ts"), "utf8");
const webHours = readFileSync(join(__dirname, "..", "..", "web", "src", "lib", "pets", "hours.ts"), "utf8");
const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const lifeSrc = readFileSync(join(__dirname, "life.js"), "utf8");
const htmlSrc = readFileSync(join(__dirname, "index.html"), "utf8");

const CATALOG = [...catalogSrc.matchAll(/\{ key: "([a-z0-9_]+)"/g)].map((m) => m[1]);

test("every overlay guest keeps their own snack line, not a small treaty", () => {
  assert.equal(Object.keys(H.SNACK_LINE).length, 210);
  assert.deepEqual(Object.keys(H.SNACK_LINE).sort(), [...CATALOG].sort());
  assert.equal(H.snackLine("dog"), "For me? I have prepared a sit.");
  assert.equal(H.snackLine("red_panda"), "A small treaty. Bamboo-adjacent.");
  assert.equal(H.snackLine("honeycomb"), "Nectar of a store. I do not bite.");
  assert.equal(H.snackLine("grouper"), "Fish of a treaty.");
  assert.equal(H.snackLine("not_a_pet"), "A small treaty.");
  assert.equal(H.snackLine("dog", "A biscuit."), "A biscuit.");
  assert.match(webHours, /dog: "For me\? I have prepared a sit\."/);
  assert.match(webHours, /honeycomb: "Nectar of a store\. I do not bite\."/);
});

test("the overlay snack branch says the guest's line", () => {
  const trait = { extra: {} };
  const dog = Life.act(Life.blank(), trait, "snack", Date.now(), "dog");
  assert.equal(dog.line, "For me? I have prepared a sit.");
  assert.equal(dog.cmd, "eat");
  const comb = Life.act(Life.blank(), trait, "snack", Date.now(), "honeycomb");
  assert.equal(comb.line, "Nectar of a store. I do not bite.");
  const luna = Life.act(Life.blank(), trait, "snack", Date.now(), "luna");
  assert.equal(luna.line, "Nothing of a treaty. I decline the bite.");
  assert.match(lifeSrc, /snackLine\(key\)/);
  assert.doesNotMatch(lifeSrc, /action === "snack"[\s\S]{0,200}line: "A small treaty\."/);
  assert.match(petSrc, /PetLife\.snackLine\(kind\.key\)/);
  assert.doesNotMatch(petSrc, /say\(lineFrom\(result\) \|\| "A small treaty\."\)/);
  assert.match(htmlSrc, /hours\.js/);
});
