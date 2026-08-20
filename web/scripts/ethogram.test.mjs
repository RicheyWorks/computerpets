import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const E = require(join(root, "../desktop/renderer/ethogram.js"));
const snakesSrc = readFileSync(join(root, "src/lib/pets/snakes.ts"), "utf8");
const ethogramSrc = readFileSync(join(root, "src/lib/pets/ethogram.ts"), "utf8");
const livingSrc = readFileSync(join(root, "src/components/desk/living-pet.tsx"), "utf8");

const SNAKES = [
  "ball_python",
  "corn_snake",
  "kingsnake",
  "green_tree_python",
  "hognose",
  "garter",
  "boa",
  "milk_snake",
  "rosy_boa",
  "carpet_python",
];
const SEA = [
  "octopus",
  "cuttlefish",
  "nautilus",
  "moon_jelly",
  "sea_star",
  "hermit_crab",
  "horseshoe_crab",
  "seahorse",
  "manta",
  "moray",
];
const GARDEN = [
  "moss",
  "maidenhair",
  "ginkgo",
  "oak",
  "water_lily",
  "orchid",
  "saguaro",
  "venus_flytrap",
  "pitcher",
  "sundew",
];
const INSECTS = [
  "honeybee",
  "monarch",
  "luna",
  "firefly",
  "darner",
  "stick",
  "carpenter_ant",
  "ladybird",
  "mantis",
  "cicada",
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
const FUNGI = [
  "oyster",
  "fly_agaric",
  "morel",
  "chanterelle",
  "turkey_tail",
  "lions_mane",
  "puffball",
  "chicken_of_woods",
  "yeast",
  "lichen",
];
const FAR = [
  "photovore",
  "choir",
  "nimbus",
  "silica",
  "terminator",
  "nexus",
  "halovore",
  "magneton",
  "umbral",
  "cyst",
];
const POND = [
  "frog",
  "toad",
  "newt",
  "salamander",
  "caecilian",
  "crayfish",
  "pond_snail",
  "mussel",
  "leech",
  "stickleback",
];
const ROOST = [
  "crow",
  "raven",
  "barn_owl",
  "red_tail",
  "chickadee",
  "robin",
  "mallard",
  "canada_goose",
  "pileated",
  "hummingbird",
];
const CORNER = [
  "orb_weaver",
  "jumping_spider",
  "wolf_spider",
  "tarantula",
  "widow",
  "harvestman",
  "scorpion",
  "vinegaroon",
  "tick",
  "solifuge",
];
const HOUSE = [
  "red_panda",
  "cat",
  "dog",
  "rabbit",
  "hamster",
  "guinea_pig",
  "turtle",
  "goldfish",
  "budgie",
  "fox",
  "penguin",
  "parrot",
  "ferret",
  "hedgehog",
  "chinchilla",
  "axolotl",
  "toucan",
  "iguana",
  "dragon",
  "phoenix",
];

function names(key) {
  return E.actsFor(key).map((a) => a.name);
}

test("every living kind has an ethogram, and snakes never scratch", () => {
  for (const key of [...HOUSE, ...SNAKES, ...SEA, ...GARDEN, ...INSECTS, ...BEES, ...FUNGI, ...FAR, ...POND, ...ROOST, ...CORNER]) {
    assert.ok(E.actsFor(key).length > 0, key);
  }
  for (const key of SNAKES) {
    const acts = names(key);
    assert.ok(acts.includes("tongue"), `${key} flicks`);
    assert.equal(acts.includes("scratch"), false, `${key} does not scratch`);
    assert.equal(acts.includes("yawn"), false, `${key} does not mammal-yawn`);
  }
  for (const key of SEA) {
    const acts = names(key);
    assert.equal(acts.includes("scratch"), false, `${key} does not scratch`);
    assert.equal(acts.includes("tongue"), false, `${key} is not a snake`);
  }
  for (const key of GARDEN) {
    const acts = names(key);
    assert.equal(acts.includes("scratch"), false, `${key} does not scratch`);
    assert.equal(acts.includes("tongue"), false, `${key} is not a snake`);
  }
  for (const key of INSECTS) {
    const acts = names(key);
    assert.equal(acts.includes("scratch"), false, `${key} does not scratch`);
    assert.equal(acts.includes("tongue"), false, `${key} is not a snake`);
    assert.equal(acts.includes("eat"), false, `${key} does not nibble like a mammal`);
  }
  for (const key of BEES) {
    const acts = names(key);
    assert.equal(acts.includes("scratch"), false, `${key} does not scratch`);
    assert.equal(acts.includes("tongue"), false, `${key} is not a snake`);
    assert.equal(acts.includes("eat"), false, `${key} does not nibble like a mammal`);
    assert.equal(acts.includes("waggle"), false, `${key} is not Comb`);
  }
  assert.ok(names("honeycomb").includes("hold"));
  assert.ok(names("honey_drone").includes("hum"));
  assert.ok(names("honey_queen").includes("lay"));
  assert.ok(names("bumblebee").includes("thrum"));
  for (const key of FUNGI) {
    const acts = names(key);
    assert.equal(acts.includes("scratch"), false, `${key} does not scratch`);
    assert.equal(acts.includes("tongue"), false, `${key} is not a snake`);
    assert.equal(acts.includes("waggle"), false, `${key} does not waggle`);
    assert.equal(acts.includes("yawn"), false, `${key} does not mammal-yawn`);
  }
  assert.ok(names("puffball").includes("puff"));
  assert.ok(names("yeast").includes("rise"));
  assert.ok(names("lichen").includes("share-still"));
  assert.ok(names("oyster").includes("lean"));
  assert.ok(names("fly_agaric").includes("flush"));
  for (const key of FAR) {
    const acts = names(key);
    assert.equal(acts.includes("scratch"), false, `${key} does not scratch`);
    assert.equal(acts.includes("tongue"), false, `${key} is not a snake`);
  }
  assert.ok(names("photovore").includes("drink-light"));
  assert.ok(names("choir").includes("chord-pulse"));
  assert.ok(names("nimbus").includes("float"));
  assert.ok(names("silica").includes("facet"));
  assert.ok(names("terminator").includes("edge-walk"));
  assert.ok(names("nexus").includes("count-ripple"));
  assert.ok(names("halovore").includes("frost"));
  assert.ok(names("magneton").includes("align"));
  assert.ok(names("umbral").includes("dim"));
  assert.ok(names("cyst").includes("wake"));
  for (const key of POND) {
    const acts = names(key);
    assert.equal(acts.includes("scratch"), false, `${key} does not scratch`);
    assert.equal(acts.includes("tongue"), false, `${key} is not a snake`);
  }
  assert.ok(names("frog").includes("hop"));
  assert.ok(names("frog").includes("croak"));
  assert.ok(names("toad").includes("puff"));
  assert.ok(names("salamander").includes("hide"));
  assert.ok(names("caecilian").includes("slip"));
  assert.ok(names("crayfish").includes("pinch"));
  assert.ok(names("pond_snail").includes("rasp"));
  assert.ok(names("mussel").includes("siphon"));
  assert.ok(names("leech").includes("latch"));
  assert.ok(names("stickleback").includes("flare"));
  for (const key of ROOST) {
    const acts = names(key);
    assert.equal(acts.includes("scratch"), false, `${key} does not scratch`);
    assert.equal(acts.includes("tongue"), false, `${key} is not a snake`);
  }
  assert.ok(names("crow").includes("caw"));
  assert.ok(names("raven").includes("kronk"));
  assert.ok(names("barn_owl").includes("hiss"));
  assert.ok(names("red_tail").includes("soar"));
  assert.ok(names("chickadee").includes("dee"));
  assert.ok(names("robin").includes("hop"));
  assert.ok(names("mallard").includes("dabble"));
  assert.ok(names("canada_goose").includes("honk"));
  assert.ok(names("pileated").includes("drum"));
  assert.ok(names("hummingbird").includes("hover"));
  for (const key of CORNER) {
    const acts = names(key);
    assert.equal(acts.includes("scratch"), false, `${key} does not scratch`);
    assert.equal(acts.includes("tongue"), false, `${key} is not a snake`);
  }
  assert.ok(names("orb_weaver").includes("sit_web"));
  assert.ok(names("jumping_spider").includes("leap"));
  assert.ok(names("wolf_spider").includes("prowl"));
  assert.ok(names("tarantula").includes("flick"));
  assert.ok(names("widow").includes("hang"));
  assert.ok(names("harvestman").includes("walk"));
  assert.ok(names("scorpion").includes("sting"));
  assert.ok(names("vinegaroon").includes("whip"));
  assert.ok(names("tick").includes("clasp"));
  assert.ok(names("solifuge").includes("run"));
  assert.ok(names("honeybee").includes("waggle"));
  assert.ok(names("firefly").includes("flash"));
  assert.ok(names("stick").includes("freeze"));
  assert.ok(names("mantis").includes("fold"));
  assert.ok(names("cicada").includes("emerge"));
  assert.ok(names("luna").includes("still"));
  assert.equal(names("luna").includes("eat"), false);
  assert.ok(names("venus_flytrap").includes("snap"));
  assert.ok(names("pitcher").includes("still"));
  assert.ok(names("sundew").includes("curl"));
  for (const key of E.SCRATCH_KEYS) {
    assert.ok(names(key).includes("scratch"), `${key} scratches`);
  }
  assert.equal(names("goldfish").includes("scratch"), false);
  assert.equal(names("goldfish").includes("tongue"), false);
  assert.equal(names("turtle").includes("scratch"), false);
  assert.equal(names("budgie").includes("scratch"), false);
});

test("pickAct can schedule tongue on a snake and never scratch", () => {
  let tongue = 0;
  for (let i = 0; i < 80; i++) {
    const act = E.pickAct("ball_python");
    assert.notEqual(act?.name, "scratch");
    if (act?.name === "tongue") tongue += 1;
  }
  assert.ok(tongue > 0);
});

test("the living desk stages idle acts and a snake-only tongue", () => {
  assert.match(ethogramSrc, /export const ETHOGRAM/);
  assert.match(livingSrc, /pickAct/);
  assert.match(livingSrc, /tongueFlick/);
  assert.match(livingSrc, /ref=\{tongueRef\}/);
  for (const key of SNAKES) {
    assert.match(snakesSrc, new RegExp(`key:\\s*"${key}"`));
  }
});
