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

test("the overlay keeps the same night as the desk for every guest", () => {
  assert.equal(Object.keys(H.REST).length, 210);
  assert.deepEqual(Object.keys(H.REST).sort(), [...CATALOG].sort());
  assert.equal(H.isRestingHour("dog", 22), true);
  assert.equal(H.isRestingHour("dog", 14), false);
  assert.equal(H.isRestingHour("goldfish", 23), true);
  assert.equal(H.isRestingHour("goldfish", 0), true);
  assert.equal(H.isRestingHour("goldfish", 5), false);
  assert.equal(H.isRestingHour("ferret", 10), true);
  assert.equal(H.isRestingHour("ferret", 2), false);
  assert.match(webHours, /goldfish: \[23, 5\]/);
  assert.match(webHours, /ferret: \[10, 17\]/);
  assert.match(lifeSrc, /hours\.isRestingHour/);
});

test("illness and mess tick the house way, and save keeps the clock", () => {
  require("./hours.js");
  const trait = { extra: {}, hungerH: 6, energyH: 9, hygieneH: 14, hardy: 0.8, social: 1, messy: 0.9, sleepStart: 0, sleepEnd: 4 };
  const day = new Date(2023, 10, 14, 14, 0, 0).getTime();
  const sick = Life.decay({ ...Life.blank(day), health: 20, hygiene: 50, lastTick: day }, trait, day, "dog");
  assert.equal(sick.life.sick, true);
  const orig = Math.random;
  Math.random = () => 0;
  const mess = Life.decay({ ...Life.blank(day), hygiene: 20, mess: [], lastTick: day - 180000 }, trait, day, "dog");
  Math.random = orig;
  assert.equal(mess.life.mess.length, 1);
  assert.ok(mess.life.hygiene < 42);

  const night = new Date(2023, 10, 14, 23, 0, 0).getTime();
  const then = night - 3 * 3600 * 1000;
  const slept = Life.decay({ ...Life.blank(then), hunger: 78, energy: 40, lastTick: then }, trait, night, "dog");
  assert.ok(slept.life.hunger > 28);
  assert.ok(slept.life.energy > 40);
  assert.equal(slept.life.asleep, true);

  const mem = new Map();
  globalThis.localStorage = {
    getItem: (k) => (mem.has(k) ? mem.get(k) : null),
    setItem: (k, v) => mem.set(k, String(v)),
    removeItem: (k) => mem.delete(k),
    clear: () => mem.clear(),
  };
  const kept = { ...Life.blank(then), hunger: 78, lastTick: then, key: "dog" };
  Life.save("dog", kept);
  const stored = JSON.parse(mem.get("computerpets.desktop.life.v2.dog"));
  assert.equal(stored.lastTick, then);
  assert.equal(stored.hunger, 78);
  assert.match(lifeSrc, /JSON\.stringify\(life\)/);
  assert.doesNotMatch(lifeSrc, /lastTick: Date\.now\(\)/);
  assert.match(petSrc, /if \(document\.hidden\) return;/);
});

test("every overlay guest keeps their own call-back, not Pip's tail", () => {
  assert.equal(Object.keys(H.CALL_LINE).length, 210);
  assert.deepEqual(Object.keys(H.CALL_LINE).sort(), [...CATALOG].sort());
  assert.equal(H.callLine("dog"), "You called. I was already coming.");
  assert.equal(H.callLine("field_cricket"), "I sang. Hello.");
  assert.equal(H.callLine("brain_coral"), "I sat the rock. Hello.");
  assert.equal(H.callLine("not_a_pet"), "You called.");
  assert.notEqual(H.callLine("field_cricket"), "You called. I brought the whole tail.");
  assert.match(webHours, /field_cricket: "I sang\. Hello\."/);
  const trait = { extra: {} };
  const back = Life.act({ ...Life.blank(), hidden: true, mood: 50, bond: 10 }, trait, "call", Date.now(), "field_cricket");
  assert.equal(back.line, "I sang. Hello.");
  assert.equal(back.cmd, "enter");
  assert.equal(back.life.mood, 54);
  assert.equal(back.life.bond, 11);
  assert.match(lifeSrc, /callLine\(key\)/);
  assert.match(petSrc, /PetGait\.leaveTarget/);
  assert.match(petSrc, /PetGait\.enterSpawn/);
});

test("every overlay guest keeps their own gift line, not a leftover this", () => {
  assert.equal(Object.keys(H.GIFT_LINE).length, 210);
  assert.deepEqual(Object.keys(H.GIFT_LINE).sort(), [...CATALOG].sort());
  assert.equal(H.giftLine("red_panda"), "A ribbon I was not using. For the desk.");
  assert.equal(H.giftLine("grouper"), "A fish I was finished hiding for.");
  assert.equal(H.giftLine("not_a_pet"), "I left this.");
  assert.equal(H.giftLine("dog", "Already held."), "Already held.");
  const treatsSrc = readFileSync(join(__dirname, "..", "..", "web", "src", "lib", "pets", "treats.ts"), "utf8");
  assert.match(treatsSrc, /red_panda: "A ribbon I was not using\. For the desk\."/);
  assert.match(lifeSrc, /giftLine\(key/);
  assert.match(petSrc, /PetLife\.giftLine\(kind\.key\)/);
  assert.match(petSrc, /PetLife\.pickGift/);
  assert.doesNotMatch(petSrc, /say\("I left this\."\)/);
  const held = { ...Life.blank(), mood: 50, bond: 30, gifts: [{ id: 7, x: 0.2 }, { id: 8, x: 0.4, kind: "shed" }] };
  Life.pickGift(held, 7);
  assert.equal(held.gifts.length, 1);
  assert.equal(held.gifts[0].id, 8);
  assert.equal(held.mood, 56);
  assert.equal(held.bond, 32);
});

test("a Known overlay guest can leave a gift on the tick", () => {
  require("./hours.js");
  const trait = { extra: {}, hungerH: 6, energyH: 9, hygieneH: 14, hardy: 0.8, social: 1, messy: 0.9, sleepStart: 0, sleepEnd: 4 };
  const day = new Date(2023, 10, 14, 14, 0, 0).getTime();
  const orig = Math.random;
  Math.random = () => 0;
  const known = Life.decay({ ...Life.blank(day), bond: 25, hygiene: 80, gifts: [], lastTick: day - 180000 }, trait, day, "dog");
  const fresh = Life.decay({ ...Life.blank(day), bond: 18, hygiene: 80, gifts: [], lastTick: day - 180000 }, trait, day, "dog");
  Math.random = orig;
  assert.equal(known.life.gifts.length, 1);
  assert.notEqual(known.life.gifts[0]?.kind, "shed");
  assert.equal(fresh.life.gifts.length, 0);
  assert.match(lifeSrc, /bond >= 25/);
  assert.match(lifeSrc, /dt \/ 180000/);
  assert.doesNotMatch(lifeSrc, /bond >= 50 && \(!life\.gifts/);
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
