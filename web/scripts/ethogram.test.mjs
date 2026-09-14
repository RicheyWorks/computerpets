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
const WOOD = [
  "deer",
  "bat",
  "squirrel",
  "otter",
  "raccoon",
  "skunk",
  "opossum",
  "beaver",
  "porcupine",
  "black_bear",
];
const STONE = [
  "gecko",
  "anole",
  "skink",
  "chameleon",
  "horned_lizard",
  "alligator",
  "crocodile",
  "snapper",
  "box_turtle",
  "tuatara",
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
const CREEK = [
  "bass",
  "brook_trout",
  "catfish",
  "bluegill",
  "perch",
  "pike",
  "walleye",
  "paddlefish",
  "lamprey",
  "american_eel",
];
const LOG = [
  "house_centipede",
  "millipede",
  "pillbug",
  "earthworm",
  "velvet_worm",
  "springtail",
  "tardigrade",
  "planarian",
  "nematode",
  "amphipod",
];
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
const WELL = [
  "paramecium",
  "amoeba",
  "euglena",
  "volvox",
  "diatom",
  "kelp",
  "chlamydomonas",
  "stentor",
  "coli",
  "haloarchaea",
];

function names(key) {
  return E.actsFor(key).map((a) => a.name);
}

test("every living kind has an ethogram, and snakes never scratch", () => {
  for (const key of [...HOUSE, ...SNAKES, ...SEA, ...GARDEN, ...INSECTS, ...BEES, ...FUNGI, ...FAR, ...POND, ...ROOST, ...CORNER, ...WOOD, ...CANOPY, ...STONE, ...CREEK, ...LOG, ...SHORE, ...REEF, ...MEADOW, ...WELL]) {
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
  assert.ok(names("honeycomb").includes("tessera"));
  assert.ok(names("honeycomb").includes("alveoli_soft"));
  assert.ok(names("honeycomb").includes("foundation_soft"));
  assert.ok(names("honeycomb").includes("freeze"));
  assert.equal(names("honeycomb").includes("hold"), false);
  assert.equal(names("honeycomb").includes("brood"), false);
  assert.equal(names("honeycomb").includes("still"), false);
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
  assert.ok(names("puffball").includes("lycoperdon"));
  assert.ok(names("puffball").includes("gemmate_soft"));
  assert.ok(names("puffball").includes("capillitium_soft"));
  assert.ok(names("puffball").includes("freeze"));
  assert.equal(names("puffball").includes("puff"), false);
  assert.equal(names("puffball").includes("lean"), false);
  assert.equal(names("puffball").includes("still"), false);
  assert.ok(names("chicken_of_woods").includes("laetiporus"));
  assert.ok(names("chicken_of_woods").includes("poroid_soft"));
  assert.ok(names("chicken_of_woods").includes("cluster_soft"));
  assert.ok(names("chicken_of_woods").includes("freeze"));
  assert.equal(names("chicken_of_woods").includes("lean"), false);
  assert.equal(names("chicken_of_woods").includes("flush"), false);
  assert.equal(names("chicken_of_woods").includes("still"), false);
  assert.ok(names("yeast").includes("saccharomyces"));
  assert.ok(names("yeast").includes("ascus_soft"));
  assert.ok(names("yeast").includes("floc_soft"));
  assert.ok(names("yeast").includes("freeze"));
  assert.equal(names("yeast").includes("rise"), false);
  assert.equal(names("yeast").includes("foam"), false);
  assert.equal(names("yeast").includes("still"), false);
  assert.ok(names("yeast").includes("saccharomyces"));
  assert.ok(names("lichen").includes("cladonia"))
  assert.ok(names("lichen").includes("soredia_soft"))
  assert.ok(names("lichen").includes("scyphi_soft"))
  assert.ok(names("lichen").includes("freeze"))
  assert.equal(names("lichen").includes("share-still"), false)
  assert.equal(names("lichen").includes("lean"), false)
  assert.equal(names("lichen").includes("still"), false);
  assert.ok(names("oyster").includes("pleurotus"));
  assert.ok(names("oyster").includes("sporulate_soft"));
  assert.ok(names("oyster").includes("hypha_soft"));
  assert.ok(names("oyster").includes("freeze"));
  assert.equal(names("oyster").includes("lean"), false);
  assert.equal(names("oyster").includes("flush"), false);
  assert.equal(names("oyster").includes("still"), false);
  assert.ok(names("fly_agaric").includes("amanita"));
  assert.ok(names("fly_agaric").includes("pileus_soft"));
  assert.ok(names("fly_agaric").includes("bulb_soft"));
  assert.ok(names("fly_agaric").includes("freeze"));
  assert.equal(names("fly_agaric").includes("lean"), false);
  assert.equal(names("fly_agaric").includes("flush"), false);
  assert.equal(names("fly_agaric").includes("still"), false);
  assert.ok(names("morel").includes("morchella"));
  assert.ok(names("morel").includes("costa_soft"));
  assert.ok(names("morel").includes("hymenium_soft"));
  assert.ok(names("morel").includes("freeze"));
  assert.equal(names("morel").includes("lean"), false);
  assert.equal(names("morel").includes("still_hold"), false);
  assert.equal(names("morel").includes("still"), false);
  assert.ok(names("chanterelle").includes("cantharellus"));
  assert.ok(names("chanterelle").includes("vase_soft"));
  assert.ok(names("chanterelle").includes("plica_soft"));
  assert.ok(names("chanterelle").includes("freeze"));
  assert.equal(names("chanterelle").includes("lean"), false);
  assert.equal(names("chanterelle").includes("flush"), false);
  assert.equal(names("chanterelle").includes("still"), false);
  assert.ok(names("turkey_tail").includes("trametes"));
  assert.ok(names("turkey_tail").includes("concentric_soft"));
  assert.ok(names("turkey_tail").includes("tomentum_soft"));
  assert.ok(names("turkey_tail").includes("freeze"));
  assert.equal(names("turkey_tail").includes("lean"), false);
  assert.equal(names("turkey_tail").includes("zone"), false);
  assert.equal(names("turkey_tail").includes("still"), false);
  assert.ok(names("lions_mane").includes("hericium"));
  assert.ok(names("lions_mane").includes("pompon_soft"));
  assert.ok(names("lions_mane").includes("hydnoid_soft"));
  assert.ok(names("lions_mane").includes("freeze"));
  assert.equal(names("lions_mane").includes("lean"), false);
  assert.equal(names("lions_mane").includes("beard"), false);
  assert.equal(names("lions_mane").includes("still"), false);
  for (const key of FAR) {
    const acts = names(key);
    assert.equal(acts.includes("scratch"), false, `${key} does not scratch`);
    assert.equal(acts.includes("tongue"), false, `${key} is not a snake`);
  }
  assert.ok(names("photovore").includes("photovore"))
  assert.ok(names("photovore").includes("opsin_soft"))
  assert.ok(names("photovore").includes("iridophore_soft"))
  assert.ok(names("photovore").includes("freeze"))
  assert.equal(names("photovore").includes("drink-light"), false)
  assert.equal(names("photovore").includes("hover"), false)
  assert.equal(names("photovore").includes("still"), false);
  assert.ok(names("choir").includes("harmonia"))
  assert.ok(names("choir").includes("formant_soft"))
  assert.ok(names("choir").includes("dyad_soft"))
  assert.ok(names("choir").includes("freeze"))
  assert.equal(names("choir").includes("chord-pulse"), false)
  assert.equal(names("choir").includes("overtone"), false)
  assert.equal(names("choir").includes("still"), false);
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
  assert.ok(names("crow").includes("cock_look"));
  assert.ok(names("crow").includes("bill_wipe"));
  assert.ok(names("crow").includes("perch"));
  assert.ok(names("raven").includes("kronk"));
  assert.ok(names("raven").includes("ruff_flare"));
  assert.ok(names("raven").includes("head_cock"));
  assert.ok(names("raven").includes("perch"));
  assert.ok(names("barn_owl").includes("hiss"));
  assert.ok(names("barn_owl").includes("disk_listen"));
  assert.ok(names("barn_owl").includes("soft_settle"));
  assert.ok(names("barn_owl").includes("perch"));
  assert.ok(names("red_tail").includes("soar"));
  assert.ok(names("red_tail").includes("keeyer"));
  assert.ok(names("red_tail").includes("perch"));
  assert.ok(names("chickadee").includes("dee"));
  assert.ok(names("chickadee").includes("fee_bee"));
  assert.ok(names("chickadee").includes("wing_flick"));
  assert.ok(names("chickadee").includes("perch"));
  assert.ok(names("robin").includes("hop"));
  assert.ok(names("robin").includes("carol_soft"));
  assert.ok(names("robin").includes("breast_puff"));
  assert.ok(names("robin").includes("perch"));
  assert.ok(names("mallard").includes("dabble"));
  assert.ok(names("mallard").includes("quack_soft"));
  assert.ok(names("mallard").includes("upend_soft"));
  assert.ok(names("mallard").includes("loaf"));
  assert.ok(names("canada_goose").includes("honk"));
  assert.ok(names("canada_goose").includes("graze_soft"));
  assert.ok(names("canada_goose").includes("hiss_soft"));
  assert.ok(names("canada_goose").includes("loaf"));
  assert.ok(names("pileated").includes("drum"));
  assert.ok(names("pileated").includes("excavate_soft"));
  assert.ok(names("pileated").includes("kuk_soft"));
  assert.ok(names("pileated").includes("loaf"));
  assert.ok(names("hummingbird").includes("hover"));
  assert.ok(names("hummingbird").includes("chip_soft"));
  assert.ok(names("hummingbird").includes("perch"));
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
  for (const key of WOOD) {
    const acts = names(key);
    assert.equal(acts.includes("tongue"), false, `${key} is not a snake`);
  }
  assert.ok(names("deer").includes("flag"));
  assert.ok(names("bat").includes("hang"));
  assert.ok(names("squirrel").includes("bury"));
  assert.ok(names("otter").includes("slide"));
  assert.ok(names("raccoon").includes("rinse"));
  assert.ok(names("skunk").includes("stamp"));
  assert.ok(names("opossum").includes("playdead"));
  assert.ok(names("beaver").includes("gnaw"));
  assert.ok(names("porcupine").includes("bristle"));
  assert.ok(names("black_bear").includes("forage"));
  for (const key of STONE) {
    const acts = names(key);
    assert.equal(acts.includes("tongue"), false, `${key} is not a snake`);
    assert.equal(acts.includes("scratch"), false, `${key} does not scratch`);
  }
  assert.ok(names("gecko").includes("climb"));
  assert.ok(names("anole").includes("flash"));
  assert.ok(names("skink").includes("dash"));
  assert.ok(names("chameleon").includes("aim"));
  assert.ok(names("horned_lizard").includes("crown"));
  assert.ok(names("alligator").includes("bask"));
  assert.ok(names("crocodile").includes("show"));
  assert.ok(names("snapper").includes("snap"));
  assert.ok(names("box_turtle").includes("shut"));
  assert.ok(names("tuatara").includes("still"));
  for (const key of CREEK) {
    const acts = names(key);
    assert.equal(acts.includes("scratch"), false, `${key} does not scratch`);
    assert.equal(acts.includes("tongue"), false, `${key} is not a snake`);
  }
  assert.ok(names("bass").includes("lunge"));
  assert.ok(names("lamprey").includes("disk"));
  for (const key of LOG) {
    const acts = names(key);
    assert.equal(acts.includes("scratch"), false, `${key} does not scratch`);
    assert.equal(acts.includes("tongue"), false, `${key} is not a snake`);
  }
  assert.ok(names("millipede").includes("walk"));
  assert.ok(names("pillbug").includes("roll"));
  for (const key of SHORE) {
    const acts = names(key);
    assert.equal(acts.includes("scratch"), false, `${key} does not scratch`);
    assert.equal(acts.includes("tongue"), false, `${key} is not a snake`);
  }
  assert.ok(names("fiddler_crab").includes("wave"));
  assert.ok(names("ghost_crab").includes("run"));
  assert.ok(names("lugworm").includes("heap"));
  for (const key of MEADOW) {
    const acts = names(key);
    assert.equal(acts.includes("scratch"), false, `${key} does not scratch`);
    assert.equal(acts.includes("tongue"), false, `${key} is not a snake`);
    assert.equal(acts.includes("waggle"), false, `${key} is not Comb`);
  }
  assert.ok(names("field_cricket").includes("chirp"));
  assert.ok(names("grasshopper").includes("vault"));
  assert.ok(names("click_beetle").includes("click"));
  for (const key of CANOPY) {
    const acts = names(key);
    assert.equal(acts.includes("scratch"), false, `${key} does not scratch`);
    assert.equal(acts.includes("tongue"), false, `${key} is not a snake`);
  }
  assert.ok(names("sloth").includes("hang"));
  assert.ok(names("lemur").includes("sun"));
  assert.ok(names("gibbon").includes("swing"));
  assert.ok(names("koala").includes("chew"));
  for (const key of REEF) {
    const acts = names(key);
    assert.equal(acts.includes("scratch"), false, `${key} does not scratch`);
    assert.equal(acts.includes("tongue"), false, `${key} is not a snake`);
  }
  assert.ok(names("brain_coral").includes("ridge"));
  assert.ok(names("anemone").includes("wreath"));
  assert.ok(names("clownfish").includes("dart"));
  assert.ok(names("parrotfish").includes("scrape"));
  assert.ok(names("grouper").includes("hide"));
  for (const key of WELL) {
    const acts = names(key);
    assert.equal(acts.includes("scratch"), false, `${key} does not scratch`);
    assert.equal(acts.includes("tongue"), false, `${key} is not a snake`);
  }
  assert.ok(names("honeybee").includes("hive"));
  assert.ok(names("firefly").includes("photinus"));
  assert.ok(names("stick").includes("diapheromera"));
  assert.ok(names("stick").includes("freeze"));
  assert.ok(names("mantis").includes("mantodea"));
  assert.equal(names("mantis").includes("fold"), false);
  assert.ok(names("cicada").includes("magicicada"));
  assert.equal(names("cicada").includes("still"), false);
  assert.ok(names("luna").includes("actias"));
  assert.equal(names("luna").includes("still"), false);
  assert.equal(names("luna").includes("eat"), false);
  assert.ok(names("venus_flytrap").includes("poise"));
  assert.ok(names("pitcher").includes("urn"));
  assert.ok(names("sundew").includes("rosette"));
  for (const key of E.SCRATCH_KEYS) {
    assert.ok(names(key).includes("scratch"), `${key} scratches`);
  }
  assert.equal(names("goldfish").includes("scratch"), false);
  assert.equal(names("goldfish").includes("tongue"), false);
  assert.equal(names("turtle").includes("scratch"), false);
  assert.equal(names("budgie").includes("scratch"), false);
  assert.ok(names("budgie").includes("preen"));
  assert.ok(names("budgie").includes("beakgrind_soft"));
  assert.ok(names("budgie").includes("loaf"));
  assert.ok(names("penguin").includes("huddle"));
  assert.ok(names("penguin").includes("rockhop_soft"));
  assert.ok(names("penguin").includes("loaf"));
  assert.ok(names("parrot").includes("quote"));
  assert.ok(names("parrot").includes("pineye_soft"));
  assert.ok(names("parrot").includes("loaf"));
  assert.ok(names("toucan").includes("roost"));
  assert.ok(names("toucan").includes("rattle_soft"));
  assert.ok(names("toucan").includes("loaf"));
  assert.ok(names("phoenix").includes("cinder"));
  assert.ok(names("phoenix").includes("reignite_soft"));
  assert.ok(names("phoenix").includes("loaf"));
  assert.ok(names("cat").includes("loaf"));
  assert.ok(names("cat").includes("bunting_soft"));
  assert.ok(names("cat").includes("mlem_soft"));
  assert.ok(names("cat").includes("alert"));
  assert.ok(names("dog").includes("wait"));
  assert.ok(names("dog").includes("beg_soft"));
  assert.ok(names("dog").includes("pant_soft"));
  assert.ok(names("dog").includes("scratch"));
  assert.ok(names("rabbit").includes("flop"));
  assert.ok(names("rabbit").includes("rub_soft"));
  assert.ok(names("rabbit").includes("nosh_soft"));
  assert.ok(names("rabbit").includes("freeze"));
  assert.ok(names("hamster").includes("nest"));
  assert.ok(names("hamster").includes("scrub_soft"));
  assert.ok(names("hamster").includes("seed_soft"));
  assert.ok(names("hamster").includes("freeze"));
  assert.ok(names("guinea_pig").includes("potato"));
  assert.ok(names("guinea_pig").includes("lookout_soft"));
  assert.ok(names("guinea_pig").includes("teeth_soft"));
  assert.ok(names("guinea_pig").includes("freeze"));
  assert.ok(names("turtle").includes("soak"));
  assert.ok(names("turtle").includes("snorkel_soft"));
  assert.ok(names("turtle").includes("wipe_soft"));
  assert.ok(names("turtle").includes("freeze"));
  assert.ok(names("goldfish").includes("drift"));
  assert.ok(names("goldfish").includes("yawn_soft"));
  assert.ok(names("goldfish").includes("forage_soft"));
  assert.ok(names("goldfish").includes("freeze"));
  assert.ok(names("fox").includes("den"));
  assert.ok(names("fox").includes("cock_soft"));
  assert.ok(names("fox").includes("stash_soft"));
  assert.ok(names("fox").includes("freeze"));
  assert.ok(names("ferret").includes("tube"));
  assert.ok(names("ferret").includes("corkscrew_soft"));
  assert.ok(names("ferret").includes("slink_soft"));
  assert.ok(names("ferret").includes("freeze"));
  assert.ok(names("hedgehog").includes("curl"));
  assert.ok(names("hedgehog").includes("trundle_soft"));
  assert.ok(names("hedgehog").includes("wheel_soft"));
  assert.ok(names("hedgehog").includes("freeze"));
  assert.ok(names("chinchilla").includes("ash"));
  assert.ok(names("chinchilla").includes("ricochet_soft"));
  assert.ok(names("chinchilla").includes("gnaw_soft"));
  assert.ok(names("chinchilla").includes("freeze"));
  assert.ok(names("axolotl").includes("gill"));
  assert.ok(names("axolotl").includes("sprout_soft"));
  assert.ok(names("axolotl").includes("glop_soft"));
  assert.ok(names("axolotl").includes("freeze"));
  assert.ok(names("iguana").includes("sun"));
  assert.ok(names("iguana").includes("sneeze_soft"));
  assert.ok(names("iguana").includes("lash_soft"));
  assert.ok(names("iguana").includes("freeze"));
  assert.ok(names("dragon").includes("sprawl"));
  assert.ok(names("dragon").includes("ruff_soft"));
  assert.ok(names("dragon").includes("scrape_soft"));
  assert.ok(names("dragon").includes("freeze"));
  assert.ok(names("ball_python").includes("tongue"));
  assert.ok(names("ball_python").includes("orb"));
  assert.ok(names("ball_python").includes("loom_soft"));
  assert.ok(names("ball_python").includes("weave_soft"));
  assert.ok(names("ball_python").includes("freeze"));
  assert.ok(names("corn_snake").includes("tongue"));
  assert.ok(names("corn_snake").includes("comma"));
  assert.ok(names("corn_snake").includes("blotter_soft"));
  assert.ok(names("corn_snake").includes("pencil_soft"));
  assert.ok(names("corn_snake").includes("freeze"));
  assert.ok(names("kingsnake").includes("tongue"));
  assert.ok(names("kingsnake").includes("verdict"));
  assert.ok(names("kingsnake").includes("band_soft"));
  assert.ok(names("kingsnake").includes("drawer_soft"));
  assert.ok(names("kingsnake").includes("freeze"));
  assert.equal(names("kingsnake").includes("inspect"), false);
  assert.ok(names("green_tree_python").includes("tongue"));
  assert.ok(names("green_tree_python").includes("bracelet"));
  assert.ok(names("green_tree_python").includes("liana_soft"));
  assert.ok(names("green_tree_python").includes("arbor_soft"));
  assert.ok(names("green_tree_python").includes("freeze"));
  assert.equal(names("green_tree_python").includes("drape"), false);
  assert.ok(names("hognose").includes("tongue"));
  assert.ok(names("hognose").includes("flatten"));
  assert.ok(names("hognose").includes("quiver_soft"));
  assert.ok(names("hognose").includes("upright_soft"));
  assert.ok(names("hognose").includes("freeze"));
  assert.equal(names("hognose").includes("flip"), false);
  assert.ok(names("garter").includes("tongue"));
  assert.ok(names("garter").includes("seam"));
  assert.ok(names("garter").includes("ribbon_soft"));
  assert.ok(names("garter").includes("creek_soft"));
  assert.ok(names("garter").includes("freeze"));
  assert.equal(names("garter").includes("patrol"), false);
  assert.equal(names("garter").includes("dart"), false);
  assert.ok(names("boa").includes("tongue"));
  assert.ok(names("boa").includes("hold"));
  assert.ok(names("boa").includes("anchor_soft"));
  assert.ok(names("boa").includes("meander_soft"));
  assert.ok(names("boa").includes("freeze"));
  assert.equal(names("boa").includes("loop"), false);
  assert.equal(names("boa").includes("coil"), false);
  assert.ok(names("milk_snake").includes("tongue"));
  assert.ok(names("milk_snake").includes("rhyme"));
  assert.ok(names("milk_snake").includes("cipher_soft"));
  assert.ok(names("milk_snake").includes("verse_soft"));
  assert.ok(names("milk_snake").includes("freeze"));
  assert.equal(names("milk_snake").includes("mosaic"), false);
  assert.equal(names("milk_snake").includes("mimic"), false);
  assert.ok(names("rosy_boa").includes("tongue"));
  assert.ok(names("rosy_boa").includes("pebble"));
  assert.ok(names("rosy_boa").includes("dune_soft"));
  assert.ok(names("rosy_boa").includes("talus_soft"));
  assert.ok(names("rosy_boa").includes("freeze"));
  assert.equal(names("rosy_boa").includes("stone"), false);
  assert.equal(names("rosy_boa").includes("nest"), false);
  assert.ok(names("carpet_python").includes("tongue"));
  assert.ok(names("carpet_python").includes("legend"));
  assert.ok(names("carpet_python").includes("canopy_soft"));
  assert.ok(names("carpet_python").includes("inset_soft"));
  assert.ok(names("carpet_python").includes("freeze"));
  assert.equal(names("carpet_python").includes("chart"), false);
  assert.equal(names("carpet_python").includes("drape"), false);
  assert.ok(names("octopus").includes("hide"));
  assert.ok(names("octopus").includes("papilla_soft"));
  assert.ok(names("octopus").includes("ooze_soft"));
  assert.ok(names("octopus").includes("freeze"));
  assert.equal(names("octopus").includes("lid"), false);
  assert.equal(names("octopus").includes("flush"), false);
  assert.ok(names("cuttlefish").includes("hide"));
  assert.ok(names("cuttlefish").includes("strike_soft"));
  assert.ok(names("cuttlefish").includes("zebra_soft"));
  assert.ok(names("cuttlefish").includes("freeze"));
  assert.equal(names("cuttlefish").includes("flush"), false);
  assert.equal(names("cuttlefish").includes("lid"), false);
  assert.ok(names("nautilus").includes("hide"));
  assert.ok(names("nautilus").includes("hyponome_soft"));
  assert.ok(names("nautilus").includes("aperture_soft"));
  assert.ok(names("nautilus").includes("freeze"));
  assert.equal(names("nautilus").includes("rise"), false);
  assert.equal(names("nautilus").includes("flush"), false);
  assert.ok(names("moon_jelly").includes("hide"));
  assert.ok(names("moon_jelly").includes("rhopalium_soft"));
  assert.ok(names("moon_jelly").includes("horseshoe_soft"));
  assert.ok(names("moon_jelly").includes("freeze"));
  assert.equal(names("moon_jelly").includes("chime"), false);
  assert.equal(names("moon_jelly").includes("pulse"), false);
  assert.equal(names("moon_jelly").includes("drift"), false);
  assert.ok(names("sea_star").includes("cling"));
  assert.ok(names("sea_star").includes("madre_soft"));
  assert.ok(names("sea_star").includes("papula_soft"));
  assert.ok(names("sea_star").includes("freeze"));
  assert.equal(names("sea_star").includes("reef"), false);
  assert.equal(names("sea_star").includes("still"), false);
  assert.equal(names("sea_star").includes("bell"), false);
  assert.ok(names("hermit_crab").includes("withdraw"));
  assert.ok(names("hermit_crab").includes("chela_soft"));
  assert.ok(names("hermit_crab").includes("bailer_soft"));
  assert.ok(names("hermit_crab").includes("freeze"));
  assert.equal(names("hermit_crab").includes("inspect"), false);
  assert.equal(names("hermit_crab").includes("shuffle"), false);
  assert.equal(names("hermit_crab").includes("knob"), false);
  assert.ok(names("horseshoe_crab").includes("carapace"));
  assert.ok(names("horseshoe_crab").includes("pusher_soft"));
  assert.ok(names("horseshoe_crab").includes("ocular_soft"));
  assert.ok(names("horseshoe_crab").includes("freeze"));
  assert.equal(names("horseshoe_crab").includes("plow"), false);
  assert.equal(names("horseshoe_crab").includes("still"), false);
  assert.equal(names("horseshoe_crab").includes("molt"), false);
  assert.ok(names("seahorse").includes("coil"));
  assert.ok(names("seahorse").includes("dorsal_soft"));
  assert.ok(names("seahorse").includes("pectoral_soft"));
  assert.ok(names("seahorse").includes("freeze"));
  assert.equal(names("seahorse").includes("hitch"), false);
  assert.equal(names("seahorse").includes("hover"), false);
  assert.equal(names("seahorse").includes("anchor"), false);
  assert.ok(names("manta").includes("span"));
  assert.ok(names("manta").includes("breach_soft"));
  assert.ok(names("manta").includes("ram_soft"));
  assert.ok(names("manta").includes("freeze"));
  assert.equal(names("manta").includes("soar"), false);
  assert.equal(names("manta").includes("glide"), false);
  assert.equal(names("manta").includes("barrel"), false);
  assert.ok(names("moray").includes("jamb"));
  assert.ok(names("moray").includes("mucus_soft"));
  assert.ok(names("moray").includes("sentry_soft"));
  assert.ok(names("moray").includes("freeze"));
  assert.equal(names("moray").includes("gape"), false);
  assert.equal(names("moray").includes("hide"), false);
  assert.equal(names("moray").includes("dart"), false);
});

test("moss ethogram is Felt ultra (thatch + softs + freeze, not lean/nod/still)", () => {
  assert.ok(names("moss").includes("thatch"));
  assert.ok(names("moss").includes("rhizoid_soft"));
  assert.ok(names("moss").includes("seta_soft"));
  assert.ok(names("moss").includes("freeze"));
  assert.equal(names("moss").includes("lean"), false);
  assert.equal(names("moss").includes("nod"), false);
  assert.equal(names("moss").includes("still"), false);
});

test("maidenhair ethogram is Vein ultra (saucer + softs + freeze, not lean/nod/unfurl)", () => {
  assert.ok(names("maidenhair").includes("saucer"));
  assert.ok(names("maidenhair").includes("sori_soft"));
  assert.ok(names("maidenhair").includes("bulb_soft"));
  assert.ok(names("maidenhair").includes("freeze"));
  assert.equal(names("maidenhair").includes("lean"), false);
  assert.equal(names("maidenhair").includes("nod"), false);
  assert.equal(names("maidenhair").includes("unfurl"), false);
});

test("ginkgo ethogram is Fan ultra (amber + softs + freeze, not lean/nod/still)", () => {
  assert.ok(names("ginkgo").includes("amber"));
  assert.ok(names("ginkgo").includes("dichotomy_soft"));
  assert.ok(names("ginkgo").includes("petiole_soft"));
  assert.ok(names("ginkgo").includes("freeze"));
  assert.equal(names("ginkgo").includes("lean"), false);
  assert.equal(names("ginkgo").includes("nod"), false);
  assert.equal(names("ginkgo").includes("still"), false);
});

test("oak ethogram is Mast ultra (bole + softs + freeze, not lean/nod/still)", () => {
  assert.ok(names("oak").includes("bole"));
  assert.ok(names("oak").includes("catkin_soft"));
  assert.ok(names("oak").includes("tyloses_soft"));
  assert.ok(names("oak").includes("freeze"));
  assert.equal(names("oak").includes("lean"), false);
  assert.equal(names("oak").includes("nod"), false);
  assert.equal(names("oak").includes("still"), false);
});

test("water_lily ethogram is Disk ultra (sheen + softs + freeze, not open/nod/lean)", () => {
  assert.ok(names("water_lily").includes("sheen"));
  assert.ok(names("water_lily").includes("peltate_soft"));
  assert.ok(names("water_lily").includes("hydropote_soft"));
  assert.ok(names("water_lily").includes("freeze"));
  assert.equal(names("water_lily").includes("open"), false);
  assert.equal(names("water_lily").includes("nod"), false);
  assert.equal(names("water_lily").includes("lean"), false);
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
