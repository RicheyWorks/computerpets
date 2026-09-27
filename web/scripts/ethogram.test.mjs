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
  assert.ok(names("honey_drone").includes("mellifera"));
assert.ok(names("honey_drone").includes("holoptic_soft"));
assert.ok(names("honey_drone").includes("congregation_soft"));
assert.ok(names("honey_drone").includes("sortie_soft"));
assert.ok(names("honey_drone").includes("ocellus_soft"));
assert.ok(names("honey_drone").includes("dronepatrol_soft"));
assert.ok(names("honey_drone").includes("eyemeet_soft"));
assert.ok(names("honey_drone").includes("freeze"));
assert.equal(names("honey_drone").includes("hum"), false);
assert.equal(names("honey_drone").includes("hover"), false);
assert.equal(names("honey_drone").includes("still"), false);
assert.ok(names("carpenter_bee").includes("xylocopa"));
assert.ok(names("carpenter_bee").includes("rasp_soft"));
assert.ok(names("carpenter_bee").includes("glabrous_soft"));
assert.ok(names("carpenter_bee").includes("partition_soft"));
assert.ok(names("carpenter_bee").includes("picket_soft"));
assert.ok(names("carpenter_bee").includes("tunnelrasp_soft"));
assert.ok(names("carpenter_bee").includes("baldflash_soft"));
assert.ok(names("carpenter_bee").includes("freeze"));
assert.equal(names("carpenter_bee").includes("hover"), false);
assert.equal(names("carpenter_bee").includes("bore"), false);
assert.equal(names("carpenter_bee").includes("still"), false);

assert.ok(names("mason_bee").includes("osmia"));
assert.ok(names("mason_bee").includes("trowel_soft"));
assert.ok(names("mason_bee").includes("beebread_soft"));
assert.ok(names("mason_bee").includes("orchard_soft"));
assert.ok(names("mason_bee").includes("plug_soft"));
assert.ok(names("mason_bee").includes("mudseptum_soft"));
assert.ok(names("mason_bee").includes("tubeprovision_soft"));
assert.ok(names("mason_bee").includes("freeze"));
assert.equal(names("mason_bee").includes("seal"), false);
assert.equal(names("mason_bee").includes("hover"), false);
assert.equal(names("mason_bee").includes("still"), false);

assert.ok(names("leafcutter").includes("megachile"));
assert.ok(names("leafcutter").includes("circle_soft"));
assert.ok(names("leafcutter").includes("liner_soft"));
assert.ok(names("leafcutter").includes("cavity_soft"));
assert.ok(names("leafcutter").includes("parcel_soft"));
assert.ok(names("leafcutter").includes("discpress_soft"));
assert.ok(names("leafcutter").includes("cellcup_soft"));
assert.ok(names("leafcutter").includes("freeze"));
assert.equal(names("leafcutter").includes("cut"), false);
assert.equal(names("leafcutter").includes("hover"), false);
assert.equal(names("leafcutter").includes("still"), false);

assert.ok(names("stingless").includes("melipona"));
assert.ok(names("stingless").includes("cerumen_soft"));
assert.ok(names("stingless").includes("spout_soft"));
assert.ok(names("stingless").includes("vessel_soft"));
assert.ok(names("stingless").includes("batumen_soft"));
assert.ok(names("stingless").includes("potpress_soft"));
assert.ok(names("stingless").includes("involucrum_soft"));
assert.ok(names("stingless").includes("freeze"));
assert.equal(names("stingless").includes("pot"), false);
assert.equal(names("stingless").includes("hover"), false);
assert.equal(names("stingless").includes("still"), false);

assert.ok(names("mining_bee").includes("andrena"));
assert.ok(names("mining_bee").includes("shaft_soft"));
assert.ok(names("mining_bee").includes("mass_soft"));
assert.ok(names("mining_bee").includes("vernal_soft"));
assert.ok(names("mining_bee").includes("fovea_soft"));
assert.ok(names("mining_bee").includes("floccus_soft"));
assert.ok(names("mining_bee").includes("dufourline_soft"));
assert.ok(names("mining_bee").includes("freeze"));
assert.equal(names("mining_bee").includes("dig"), false);
assert.equal(names("mining_bee").includes("hover"), false);
assert.equal(names("mining_bee").includes("still"), false);




  assert.ok(names("honey_queen").includes("regina"));
  assert.ok(names("bumblebee").includes("bombus"));
assert.ok(names("bumblebee").includes("sonicate_soft"));
assert.ok(names("bumblebee").includes("scopa_soft"));
assert.ok(names("bumblebee").includes("fossor_soft"));
assert.ok(names("bumblebee").includes("lumber_soft"));
assert.ok(names("bumblebee").includes("thoraxload_soft"));
assert.ok(names("bumblebee").includes("corbicularub_soft"));
assert.ok(names("bumblebee").includes("freeze"));
assert.equal(names("bumblebee").includes("thrum"), false);
assert.equal(names("bumblebee").includes("hover"), false);
assert.equal(names("bumblebee").includes("still"), false);
assert.ok(names("sweat_bee").includes("agapostemon"));
assert.ok(names("sweat_bee").includes("lustre_soft"));
assert.ok(names("sweat_bee").includes("tumulus_soft"));
assert.ok(names("sweat_bee").includes("salt_soft"));
assert.ok(names("sweat_bee").includes("commune_soft"));
assert.ok(names("sweat_bee").includes("metallictilt_soft"));
assert.ok(names("sweat_bee").includes("nestmound_soft"));
assert.ok(names("sweat_bee").includes("freeze"));
assert.equal(names("sweat_bee").includes("shine"), false);
assert.equal(names("sweat_bee").includes("hover"), false);
assert.equal(names("sweat_bee").includes("still"), false);
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
  assert.ok(names("nimbus").includes("stratus"))
  assert.ok(names("nimbus").includes("tholin_soft"))
  assert.ok(names("nimbus").includes("nucleate_soft"))
  assert.ok(names("nimbus").includes("freeze"))
  assert.equal(names("nimbus").includes("float"), false)
  assert.equal(names("nimbus").includes("still"), false)
  assert.equal(names("nimbus").includes("hover"), false);
  assert.ok(names("silica").includes("crescit"));
assert.ok(names("silica").includes("hopper_soft"));
assert.ok(names("silica").includes("phantom_soft"));
assert.ok(names("silica").includes("freeze"));
assert.equal(names("silica").includes("facet"), false);
assert.equal(names("silica").includes("still"), false);
assert.equal(names("silica").includes("shed"), false);
  assert.ok(names("terminator").includes("limitor"));
  assert.ok(names("terminator").includes("umbra_soft"));
  assert.ok(names("terminator").includes("syzygy_soft"));
  assert.ok(names("terminator").includes("freeze"));
  assert.equal(names("terminator").includes("edge-walk"), false);
  assert.equal(names("terminator").includes("still"), false);
  assert.equal(names("terminator").includes("rim"), false);
  assert.ok(names("nexus").includes("mesh"));
  assert.ok(names("nexus").includes("fascicle_soft"));
  assert.ok(names("nexus").includes("sennit_soft"));
  assert.ok(names("nexus").includes("freeze"));
  assert.equal(names("nexus").includes("count-ripple"), false);
  assert.equal(names("nexus").includes("still"), false);
  assert.equal(names("nexus").includes("name"), false);
  assert.ok(names("halovore").includes("deliquesce"));
  assert.ok(names("halovore").includes("ectoine_soft"));
  assert.ok(names("halovore").includes("sabkha_soft"));
  assert.ok(names("halovore").includes("freeze"));
  assert.equal(names("halovore").includes("frost"), false);
  assert.equal(names("halovore").includes("still"), false);
  assert.equal(names("halovore").includes("waste"), false);
  assert.ok(names("magneton").includes("remanence"));
  assert.ok(names("magneton").includes("barkhausen_soft"));
  assert.ok(names("magneton").includes("hysteresis_soft"));
  assert.ok(names("magneton").includes("freeze"));
  assert.equal(names("magneton").includes("align"), false);
  assert.equal(names("magneton").includes("still"), false);
  assert.equal(names("magneton").includes("north"), false);
  assert.ok(names("umbral").includes("caligo"));
  assert.ok(names("umbral").includes("sfumato_soft"));
  assert.ok(names("umbral").includes("tenebrae_soft"));
  assert.ok(names("umbral").includes("freeze"));
  assert.equal(names("umbral").includes("dim"), false);
  assert.equal(names("umbral").includes("still"), false);
  assert.equal(names("umbral").includes("cool"), false);
  assert.ok(names("cyst").includes("cryptobiosis"));
  assert.ok(names("cyst").includes("sporocyst_soft"));
  assert.ok(names("cyst").includes("tachyzoite_soft"));
  assert.ok(names("cyst").includes("freeze"));
  assert.equal(names("cyst").includes("wake"), false);
  assert.equal(names("cyst").includes("wait"), false);
  assert.equal(names("cyst").includes("still"), false);
  for (const key of POND) {
    const acts = names(key);
    assert.equal(acts.includes("scratch"), false, `${key} does not scratch`);
    assert.equal(acts.includes("tongue"), false, `${key} is not a snake`);
  }
  assert.ok(names("frog").includes("lentic"));
  assert.ok(names("frog").includes("toepad_soft"));
  assert.ok(names("frog").includes("webbing_soft"));
  assert.ok(names("frog").includes("freeze"));
  assert.ok(names("toad").includes("bufonid"));
assert.ok(names("toad").includes("unken_soft"));
assert.ok(names("toad").includes("cranial_soft"));
assert.ok(names("toad").includes("freeze"));
  assert.ok(names("newt").includes("caudate"));
  assert.ok(names("newt").includes("hedonic_soft"));
  assert.ok(names("newt").includes("aposematic_soft"));
  assert.ok(names("newt").includes("freeze"));
  assert.ok(names("salamander").includes("ambystomid"));
  assert.ok(names("salamander").includes("mental_soft"));
  assert.ok(names("salamander").includes("granular_soft"));
  assert.ok(names("salamander").includes("freeze"));
  assert.ok(names("salamander").includes("ambystomid"));
  assert.ok(names("caecilian").includes("gymnophion"));
  assert.ok(names("caecilian").includes("stegos_soft"));
  assert.ok(names("caecilian").includes("dualjaw_soft"));
  assert.ok(names("caecilian").includes("freeze"));
  assert.ok(names("crayfish").includes("astacid"));
  assert.ok(names("crayfish").includes("scaph_soft"));
  assert.ok(names("crayfish").includes("meral_soft"));
  assert.ok(names("crayfish").includes("freeze"));
  assert.ok(names("pond_snail").includes("lymnaeid"));
  assert.ok(names("pond_snail").includes("odontophore_soft"));
  assert.ok(names("pond_snail").includes("neuston_soft"));
  assert.ok(names("pond_snail").includes("freeze"));
  assert.ok(names("mussel").includes("unionid"));
  assert.ok(names("mussel").includes("ligament_soft"));
  assert.ok(names("mussel").includes("glochid_soft"));
  assert.ok(names("mussel").includes("freeze"));
  assert.ok(names("leech").includes("hirudinean"));
  assert.ok(names("leech").includes("botryoidal_soft"));
  assert.ok(names("leech").includes("auricle_soft"));
  assert.ok(names("leech").includes("freeze"));
  assert.ok(names("stickleback").includes("gasterosteid"));
  assert.ok(names("stickleback").includes("nuptial_soft"));
  assert.ok(names("stickleback").includes("pelvic_soft"));
  assert.ok(names("stickleback").includes("freeze"));
  assert.ok(names("paramecium").includes("ciliophora"));
  assert.ok(names("paramecium").includes("trichocyst_soft"));
  assert.ok(names("paramecium").includes("avoiding_soft"));
  assert.ok(names("paramecium").includes("freeze"));
  assert.ok(names("amoeba").includes("proteus"));
  assert.ok(names("amoeba").includes("uroid_soft"));
  assert.ok(names("amoeba").includes("streaming_soft"));
  assert.ok(names("amoeba").includes("freeze"));
  assert.ok(names("euglena").includes("euglenid"));
  assert.ok(names("euglena").includes("metaboly_soft"));
  assert.ok(names("euglena").includes("paramylon_soft"));
  assert.ok(names("euglena").includes("freeze"));
  assert.ok(names("volvox").includes("coenobium"));
  assert.ok(names("volvox").includes("daughter_soft"));
  assert.ok(names("volvox").includes("gonidia_soft"));
  assert.ok(names("volvox").includes("freeze"));
  assert.ok(names("diatom").includes("navicula"));
  assert.ok(names("diatom").includes("pennate_soft"));
  assert.ok(names("diatom").includes("epitheca_soft"));
  assert.ok(names("diatom").includes("freeze"));
  assert.ok(names("kelp").includes("meristem"));
  assert.ok(names("kelp").includes("sorus_soft"));
  assert.ok(names("kelp").includes("sporophyll_soft"));
  assert.ok(names("kelp").includes("freeze"));
  assert.ok(names("chlamydomonas").includes("palmella"));
  assert.ok(names("chlamydomonas").includes("cellwall_soft"));
  assert.ok(names("chlamydomonas").includes("wetplate_soft"));
  assert.ok(names("chlamydomonas").includes("freeze"));
  assert.ok(names("stentor").includes("introversus"));
  assert.ok(names("stentor").includes("vortex_soft"));
  assert.ok(names("stentor").includes("beadedmac_soft"));
  assert.ok(names("stentor").includes("freeze"));
  assert.ok(names("coli").includes("nucleoid"));
  assert.ok(names("coli").includes("fimbria_soft"));
  assert.ok(names("coli").includes("flagmotor_soft"));
  assert.ok(names("coli").includes("freeze"));
  assert.ok(names("haloarchaea").includes("retinal"));
  assert.ok(names("haloarchaea").includes("archaellum_soft"));
  assert.ok(names("haloarchaea").includes("brinedrift_soft"));
  assert.ok(names("haloarchaea").includes("freeze"));
  assert.ok(names("orb_weaver").includes("araneus"));
  assert.ok(names("orb_weaver").includes("dragline_soft"));
  assert.ok(names("orb_weaver").includes("viscid_soft"));
  assert.ok(names("orb_weaver").includes("freeze"));
  assert.ok(names("jumping_spider").includes("phidippus"));
  assert.ok(names("jumping_spider").includes("safetyline_soft"));
  assert.ok(names("jumping_spider").includes("ame_soft"));
  assert.ok(names("jumping_spider").includes("scopula_soft"));
  assert.ok(names("jumping_spider").includes("freeze"));
  assert.ok(names("wolf_spider").includes("tigrosa"));
  assert.ok(names("wolf_spider").includes("spur_soft"));
  assert.ok(names("wolf_spider").includes("apron_soft"));
  assert.ok(names("wolf_spider").includes("cursor_soft"));
  assert.ok(names("wolf_spider").includes("freeze"));
  assert.ok(names("tarantula").includes("aphonopelma"));
  assert.ok(names("tarantula").includes("rastellum_soft"));
  assert.ok(names("tarantula").includes("apophysis_soft"));
  assert.ok(names("tarantula").includes("urticate_soft"));
  assert.ok(names("tarantula").includes("freeze"));
  for (const key of ROOST) {
    const acts = names(key);
    assert.equal(acts.includes("scratch"), false, `${key} does not scratch`);
    assert.equal(acts.includes("tongue"), false, `${key} is not a snake`);
  }
  assert.ok(names("crow").includes("corvid"));
  assert.ok(names("crow").includes("hopwalk_soft"));
  assert.ok(names("crow").includes("scrutinize_soft"));
  assert.ok(names("crow").includes("freeze"));
  assert.ok(names("raven").includes("hackles"));
  assert.ok(names("raven").includes("dihedral_soft"));
  assert.ok(names("raven").includes("cronk_soft"));
  assert.ok(names("raven").includes("freeze"));
  assert.ok(names("barn_owl").includes("tytonid"));
  assert.ok(names("barn_owl").includes("diskturn_soft"));
  assert.ok(names("barn_owl").includes("twist_soft"));
  assert.ok(names("barn_owl").includes("freeze"));
  assert.ok(names("red_tail").includes("buteo"));
  assert.ok(names("red_tail").includes("kettle_soft"));
  assert.ok(names("red_tail").includes("keeyer_soft"));
  assert.ok(names("red_tail").includes("freeze"));
  assert.ok(names("chickadee").includes("poecile"));
  assert.ok(names("chickadee").includes("feebee_soft"));
  assert.ok(names("chickadee").includes("hangup_soft"));
  assert.ok(names("chickadee").includes("freeze"));
  assert.ok(names("robin").includes("turdus"));
  assert.ok(names("robin").includes("runstop_soft"));
  assert.ok(names("robin").includes("carol_soft"));
  assert.ok(names("robin").includes("freeze"));
  assert.ok(names("mallard").includes("anas"));
  assert.ok(names("mallard").includes("dabble_soft"));
  assert.ok(names("mallard").includes("gruntwhistle_soft"));
  assert.ok(names("mallard").includes("freeze"));
  assert.ok(names("canada_goose").includes("branta"));
  assert.ok(names("canada_goose").includes("graze_soft"));
  assert.ok(names("canada_goose").includes("honk_soft"));
  assert.ok(names("canada_goose").includes("freeze"));
  assert.ok(names("pileated").includes("dryocopus"));
  assert.ok(names("pileated").includes("excavate_soft"));
  assert.ok(names("pileated").includes("kuk_soft"));
  assert.ok(names("pileated").includes("freeze"));
  assert.ok(names("hummingbird").includes("archilochus"));
  assert.ok(names("hummingbird").includes("nectary_soft"));
  assert.ok(names("hummingbird").includes("chip_soft"));
  assert.ok(names("hummingbird").includes("freeze"));
  for (const key of CORNER) {
    const acts = names(key);
    assert.equal(acts.includes("scratch"), false, `${key} does not scratch`);
    assert.equal(acts.includes("tongue"), false, `${key} is not a snake`);
  }
  assert.ok(names("orb_weaver").includes("araneus"));
  assert.ok(names("jumping_spider").includes("phidippus"));
  assert.ok(names("wolf_spider").includes("tigrosa"));
  assert.ok(names("tarantula").includes("aphonopelma"));
  assert.ok(names("widow").includes("latrodectus"));
  assert.ok(names("widow").includes("combfoot_soft"));
  assert.ok(names("widow").includes("theridiid_soft"));
  assert.ok(names("widow").includes("hourglass_soft"));
  assert.ok(names("widow").includes("freeze"));
  assert.ok(names("harvestman").includes("phalangium"));
  assert.ok(names("harvestman").includes("ozopore_soft"));
  assert.ok(names("harvestman").includes("leiobunum_soft"));
  assert.ok(names("harvestman").includes("legwave_soft"));
  assert.ok(names("harvestman").includes("freeze"));
  assert.ok(names("scorpion").includes("centruroides"));
  assert.ok(names("scorpion").includes("pectines_soft"));
  assert.ok(names("scorpion").includes("booklung_soft"));
  assert.ok(names("scorpion").includes("pedipalp_soft"));
  assert.ok(names("scorpion").includes("freeze"));
  assert.ok(names("vinegaroon").includes("mastigoproctus"));
  assert.ok(names("vinegaroon").includes("pygidial_soft"));
  assert.ok(names("vinegaroon").includes("antenniform_soft"));
  assert.ok(names("vinegaroon").includes("caudalwhip_soft"));
  assert.ok(names("vinegaroon").includes("freeze"));
  assert.ok(names("tick").includes("ixodes"));
  assert.ok(names("tick").includes("scutum_soft"));
  assert.ok(names("tick").includes("capitulum_soft"));
  assert.ok(names("tick").includes("quest_soft"));
  assert.ok(names("tick").includes("freeze"));
  assert.ok(names("solifuge").includes("eremobates"));
  assert.ok(names("solifuge").includes("propeltidium_soft"));
  assert.ok(names("solifuge").includes("tracheate_soft"));
  assert.ok(names("solifuge").includes("malleoli_soft"));
  assert.ok(names("solifuge").includes("freeze"));
  for (const key of WOOD) {
    const acts = names(key);
    assert.equal(acts.includes("tongue"), false, `${key} is not a snake`);
  }
  assert.ok(names("deer").includes("odocoileus"));
  assert.ok(names("deer").includes("flagtail_soft"));
  assert.ok(names("deer").includes("stotbound_soft"));
  assert.ok(names("deer").includes("snortblow_soft"));
  assert.ok(names("deer").includes("freeze"));
  assert.ok(names("bat").includes("eptesicus"));
  assert.ok(names("bat").includes("wingwrap_soft"));
  assert.ok(names("bat").includes("echolocate_soft"));
  assert.ok(names("bat").includes("calcar_soft"));
  assert.ok(names("bat").includes("freeze"));
  assert.ok(names("squirrel").includes("sciurus"));
  assert.ok(names("squirrel").includes("nutbury_soft"));
  assert.ok(names("squirrel").includes("barkscramble_soft"));
  assert.ok(names("squirrel").includes("scold_soft"));
  assert.ok(names("squirrel").includes("freeze"));
  assert.ok(names("otter").includes("lontra"));
  assert.ok(names("otter").includes("bellyglide_soft"));
  assert.ok(names("otter").includes("denslide_soft"));
  assert.ok(names("otter").includes("spraint_soft"));
  assert.ok(names("otter").includes("freeze"));
  assert.ok(names("raccoon").includes("procyon"));
  assert.ok(names("raccoon").includes("pawdouse_soft"));
  assert.ok(names("raccoon").includes("dexterous_soft"));
  assert.ok(names("raccoon").includes("ringtail_soft"));
  assert.ok(names("raccoon").includes("freeze"));
  assert.ok(names("skunk").includes("mephitis"));
  assert.ok(names("skunk").includes("footstomp_soft"));
  assert.ok(names("skunk").includes("scentraise_soft"));
  assert.ok(names("skunk").includes("plantigrade_soft"));
  assert.ok(names("skunk").includes("freeze"));
  assert.ok(names("opossum").includes("didelphis"));
  assert.ok(names("opossum").includes("stillfeign_soft"));
  assert.ok(names("opossum").includes("pouchcarry_soft"));
  assert.ok(names("opossum").includes("prehensile_soft"));
  assert.ok(names("opossum").includes("freeze"));
  assert.ok(names("beaver").includes("castor"));
  assert.ok(names("beaver").includes("woodfell_soft"));
  assert.ok(names("beaver").includes("aspen_soft"));
  assert.ok(names("beaver").includes("divehush_soft"));
  assert.ok(names("beaver").includes("freeze"));
  assert.ok(names("porcupine").includes("erethizon"));
  assert.ok(names("porcupine").includes("toothclack_soft"));
  assert.ok(names("porcupine").includes("guardhair_soft"));
  assert.ok(names("porcupine").includes("pinehush_soft"));
  assert.ok(names("porcupine").includes("freeze"));
  assert.ok(names("black_bear").includes("ursus"));
  assert.ok(names("black_bear").includes("bipedrise_soft"));
  assert.ok(names("black_bear").includes("bluffhuff_soft"));
  assert.ok(names("black_bear").includes("mastforage_soft"));
  assert.ok(names("black_bear").includes("freeze"));
  assert.ok(names("capybara").includes("hydrochoerus"));
  assert.ok(names("capybara").includes("mudwallow_soft"));
  assert.ok(names("capybara").includes("scentgland_soft"));
  assert.ok(names("capybara").includes("socialpile_soft"));
  assert.ok(names("capybara").includes("freeze"));
  for (const key of STONE) {
    const acts = names(key);
    assert.equal(acts.includes("tongue"), false, `${key} is not a snake`);
    assert.equal(acts.includes("scratch"), false, `${key} does not scratch`);
  }
  assert.ok(names("gecko").includes("hemidactylus"));
  assert.ok(names("gecko").includes("toepadcling_soft"));
  assert.ok(names("gecko").includes("setae_soft"));
  assert.ok(names("gecko").includes("lamphush_soft"));
  assert.ok(names("gecko").includes("freeze"));
  assert.ok(names("anole").includes("anolis"));
  assert.ok(names("anole").includes("dewlapflash_soft"));
  assert.ok(names("anole").includes("nuchal_soft"));
  assert.ok(names("anole").includes("vinehush_soft"));
  assert.ok(names("anole").includes("freeze"));
  assert.equal(names("anole").includes("flash"), false);
  assert.equal(names("anole").includes("brown"), false);
  assert.equal(names("anole").includes("still"), false);
  assert.ok(names("skink").includes("plestiodon"));
  assert.ok(names("skink").includes("tailbluff_soft"));
  assert.ok(names("skink").includes("bluetail_soft"));
  assert.ok(names("skink").includes("stonehush_soft"));
  assert.ok(names("skink").includes("freeze"));
  assert.equal(names("skink").includes("dash"), false);
  assert.equal(names("skink").includes("tail"), false);
  assert.equal(names("skink").includes("still"), false);
  assert.ok(names("chameleon").includes("calyptratus"));
  assert.ok(names("chameleon").includes("veilflush_soft"));
  assert.ok(names("chameleon").includes("casque_soft"));
  assert.ok(names("chameleon").includes("zygodactyl_soft"));
  assert.ok(names("chameleon").includes("freeze"));
  assert.equal(names("chameleon").includes("aim"), false);
  assert.equal(names("chameleon").includes("walk"), false);
  assert.equal(names("chameleon").includes("catch"), false);
  assert.ok(names("horned_lizard").includes("phrynosoma"));
  assert.ok(names("horned_lizard").includes("bloodsquirt_soft"));
  assert.ok(names("horned_lizard").includes("coronal_soft"));
  assert.ok(names("horned_lizard").includes("sandhush_soft"));
  assert.ok(names("horned_lizard").includes("freeze"));
  assert.equal(names("horned_lizard").includes("crown"), false);
  assert.equal(names("horned_lizard").includes("squirt"), false);
  assert.equal(names("horned_lizard").includes("still"), false);
  assert.ok(names("alligator").includes("mississippi"));
  assert.ok(names("alligator").includes("bellowbank_soft"));
  assert.ok(names("alligator").includes("osteoderm_soft"));
  assert.ok(names("alligator").includes("scutehush_soft"));
  assert.ok(names("alligator").includes("freeze"));
  assert.equal(names("alligator").includes("bask"), false);
  assert.equal(names("alligator").includes("bank"), false);
  assert.equal(names("alligator").includes("close"), false);
  assert.ok(names("crocodile").includes("acutus"));
  assert.ok(names("crocodile").includes("toothlock_soft"));
  assert.ok(names("crocodile").includes("vsnout_soft"));
  assert.ok(names("crocodile").includes("keelridge_soft"));
  assert.ok(names("crocodile").includes("freeze"));
  assert.equal(names("crocodile").includes("show"), false);
  assert.equal(names("crocodile").includes("sit"), false);
  assert.equal(names("crocodile").includes("still"), false);
  assert.ok(names("snapper").includes("serpentina"));
  assert.ok(names("snapper").includes("ambushgape_soft"));
  assert.ok(names("snapper").includes("serrated_soft"));
  assert.ok(names("snapper").includes("plastron_soft"));
  assert.ok(names("snapper").includes("freeze"));
  assert.equal(names("snapper").includes("snap"), false);
  assert.equal(names("snapper").includes("sit"), false);
  assert.equal(names("snapper").includes("still"), false);
  assert.ok(names("box_turtle").includes("carolinae"));
  assert.ok(names("box_turtle").includes("hingeshut_soft"));
  assert.ok(names("box_turtle").includes("dome_soft"));
  assert.ok(names("box_turtle").includes("leafhush_soft"));
  assert.ok(names("box_turtle").includes("freeze"));
  assert.equal(names("box_turtle").includes("shut"), false);
  assert.equal(names("box_turtle").includes("walk"), false);
  assert.equal(names("box_turtle").includes("still"), false);
  assert.ok(names("tuatara").includes("punctatus"));
  assert.ok(names("tuatara").includes("parietalgaze_soft"));
  assert.ok(names("tuatara").includes("acrodont_soft"));
  assert.ok(names("tuatara").includes("diapsid_soft"));
  assert.ok(names("tuatara").includes("freeze"));
  assert.equal(names("tuatara").includes("still"), false);
  assert.equal(names("tuatara").includes("crest"), false);
  assert.equal(names("tuatara").includes("watch"), false);
  for (const key of CREEK) {
    const acts = names(key);
    assert.equal(acts.includes("scratch"), false, `${key} does not scratch`);
    assert.equal(acts.includes("tongue"), false, `${key} is not a snake`);
  }
  assert.ok(names("bass").includes("salmoides"));
  assert.ok(names("bass").includes("coverstrike_soft"));
  assert.ok(names("bass").includes("maxilla_soft"));
  assert.ok(names("bass").includes("weedline_soft"));
  assert.ok(names("bass").includes("freeze"));
  assert.equal(names("bass").includes("lunge"), false);
  assert.equal(names("bass").includes("sit"), false);
  assert.equal(names("bass").includes("gape"), false);
  assert.ok(names("brook_trout").includes("fontinalis"));
  assert.ok(names("brook_trout").includes("driftfeed_soft"));
  assert.ok(names("brook_trout").includes("adipose_soft"));
  assert.ok(names("brook_trout").includes("coldriffle_soft"));
  assert.ok(names("brook_trout").includes("freeze"));
  assert.equal(names("brook_trout").includes("dart"), false);
  assert.equal(names("brook_trout").includes("rise"), false);
  assert.equal(names("brook_trout").includes("still"), false);
  assert.ok(names("catfish").includes("ictalurus"));
  assert.ok(names("catfish").includes("barbelprobe_soft"));
  assert.ok(names("catfish").includes("channel_soft"));
  assert.ok(names("catfish").includes("mudhush_soft"));
  assert.ok(names("catfish").includes("freeze"));
  assert.equal(names("catfish").includes("whisk"), false);
  assert.equal(names("catfish").includes("sit"), false);
  assert.equal(names("catfish").includes("still"), false);
  assert.ok(names("bluegill").includes("macrochirus"));
  assert.ok(names("bluegill").includes("platehover_soft"));
  assert.ok(names("bluegill").includes("opercle_soft"));
  assert.ok(names("bluegill").includes("earflap_soft"));
  assert.ok(names("bluegill").includes("freeze"));
  assert.equal(names("bluegill").includes("flare"), false);
  assert.equal(names("bluegill").includes("sit"), false);
  assert.equal(names("bluegill").includes("dart"), false);
  assert.equal(names("bluegill").includes("penny"), false);
  assert.ok(names("perch").includes("flavescens"));
  assert.ok(names("perch").includes("tigerbar_soft"));
  assert.ok(names("perch").includes("spiny_soft"));
  assert.ok(names("perch").includes("yellowflank_soft"));
  assert.ok(names("perch").includes("freeze"));
  assert.equal(names("perch").includes("bar"), false);
  assert.equal(names("perch").includes("sit"), false);
  assert.equal(names("perch").includes("dart"), false);
  assert.equal(names("perch").includes("still"), false);
  assert.ok(names("pike").includes("lucius"));
  assert.ok(names("pike").includes("weedambush_soft"));
  assert.ok(names("pike").includes("duckbill_soft"));
  assert.ok(names("pike").includes("lateral_soft"));
  assert.ok(names("pike").includes("freeze"));
  assert.equal(names("pike").includes("wait"), false);
  assert.equal(names("pike").includes("lance"), false);
  assert.equal(names("pike").includes("sit"), false);
  assert.equal(names("pike").includes("still"), false);
  assert.ok(names("walleye").includes("vitreus"));
  assert.ok(names("walleye").includes("tapetumglow_soft"));
  assert.ok(names("walleye").includes("canine_soft"));
  assert.ok(names("walleye").includes("glassy_soft"));
  assert.ok(names("walleye").includes("freeze"));
  assert.equal(names("walleye").includes("hunt"), false);
  assert.equal(names("walleye").includes("glow"), false);
  assert.equal(names("walleye").includes("still"), false);
  assert.equal(names("walleye").includes("night"), false);
  assert.equal(names("walleye").includes("sit"), false);

  assert.ok(names("paddlefish").includes("spathula"));
  assert.ok(names("paddlefish").includes("rostrumscan_soft"));
  assert.ok(names("paddlefish").includes("ampullae_soft"));
  assert.ok(names("paddlefish").includes("cartilaginous_soft"));
  assert.ok(names("paddlefish").includes("freeze"));
  assert.equal(names("paddlefish").includes("filter"), false);
  assert.equal(names("paddlefish").includes("paddle"), false);
  assert.equal(names("paddlefish").includes("still"), false);
  assert.equal(names("paddlefish").includes("spoon"), false);
  assert.equal(names("paddlefish").includes("sit"), false);


  assert.ok(names("lamprey").includes("marinus"));
  assert.ok(names("lamprey").includes("oralclamp_soft"));
  assert.ok(names("lamprey").includes("anadromous_soft"));
  assert.ok(names("lamprey").includes("sevengill_soft"));
  assert.ok(names("lamprey").includes("freeze"));
  assert.equal(names("lamprey").includes("disk"), false);
  assert.equal(names("lamprey").includes("cling"), false);
  assert.equal(names("lamprey").includes("still"), false);
  assert.equal(names("lamprey").includes("round"), false);
  assert.equal(names("lamprey").includes("sit"), false);
  assert.ok(names("american_eel").includes("rostrata"));
  assert.ok(names("american_eel").includes("glasscrawl_soft"));
  assert.ok(names("american_eel").includes("sargasso_soft"));
  assert.ok(names("american_eel").includes("yellowphase_soft"));
  assert.ok(names("american_eel").includes("freeze"));
  assert.equal(names("american_eel").includes("swim"), false);
  assert.equal(names("american_eel").includes("silver"), false);
  assert.equal(names("american_eel").includes("still"), false);
  assert.equal(names("american_eel").includes("sit"), false);
  assert.ok(names("house_centipede").includes("scutigera"));
  assert.ok(names("house_centipede").includes("forcipule_soft"));
  assert.ok(names("house_centipede").includes("compound_soft"));
  assert.ok(names("house_centipede").includes("fifteenpair_soft"));
  assert.ok(names("house_centipede").includes("freeze"));
  assert.equal(names("house_centipede").includes("hunt"), false);
  assert.equal(names("house_centipede").includes("walk"), false);
  assert.equal(names("house_centipede").includes("still"), false);
  assert.equal(names("house_centipede").includes("sit"), false);
  for (const key of LOG) {
    const acts = names(key);
    assert.equal(acts.includes("scratch"), false, `${key} does not scratch`);
    assert.equal(acts.includes("tongue"), false, `${key} is not a snake`);
  }
  assert.ok(names("millipede").includes("narceus"));
  assert.ok(names("millipede").includes("coilcurl_soft"));
  assert.ok(names("millipede").includes("benzoquinone_soft"));
  assert.ok(names("millipede").includes("metachronal_soft"));
  assert.ok(names("millipede").includes("freeze"));
  assert.equal(names("millipede").includes("walk"), false);
  assert.equal(names("millipede").includes("oil"), false);
  assert.equal(names("millipede").includes("still"), false);
  assert.equal(names("millipede").includes("sit"), false);
  assert.ok(names("pillbug").includes("vulgare"));
assert.ok(names("pillbug").includes("conglobate_soft"));
assert.ok(names("pillbug").includes("pleopods_soft"));
assert.ok(names("pillbug").includes("uropodtap_soft"));
assert.ok(names("pillbug").includes("freeze"));
assert.equal(names("pillbug").includes("roll"), false);
assert.equal(names("pillbug").includes("walk"), false);
assert.equal(names("pillbug").includes("still"), false);
assert.equal(names("pillbug").includes("sit"), false);
assert.ok(names("earthworm").includes("terrestris"));
assert.ok(names("earthworm").includes("peristalse_soft"));
assert.ok(names("earthworm").includes("clitellum_soft"));
assert.ok(names("earthworm").includes("setaebrace_soft"));
assert.ok(names("earthworm").includes("freeze"));
assert.equal(names("earthworm").includes("cast"), false);
assert.equal(names("earthworm").includes("crawl"), false);
assert.equal(names("earthworm").includes("still"), false);
assert.equal(names("earthworm").includes("sit"), false);
assert.ok(names("velvet_worm").includes("peripatus"));
assert.ok(names("velvet_worm").includes("slimejet_soft"));
assert.ok(names("velvet_worm").includes("oralpapilla_soft"));
assert.ok(names("velvet_worm").includes("onychophore_soft"));
assert.ok(names("velvet_worm").includes("freeze"));
assert.equal(names("velvet_worm").includes("jet"), false);
assert.equal(names("velvet_worm").includes("walk"), false);
assert.equal(names("velvet_worm").includes("still"), false);
assert.equal(names("velvet_worm").includes("sit"), false);

assert.ok(names("springtail").includes("orchesella"));
assert.ok(names("springtail").includes("furculaflick_soft"));
assert.ok(names("springtail").includes("collophore_soft"));
assert.ok(names("springtail").includes("denspring_soft"));
assert.ok(names("springtail").includes("freeze"));
assert.equal(names("springtail").includes("hop"), false);
assert.equal(names("springtail").includes("walk"), false);
assert.equal(names("springtail").includes("still"), false);
assert.equal(names("springtail").includes("sit"), false);
assert.ok(names("tardigrade").includes("eutardigrada"));
assert.ok(names("tardigrade").includes("cryptotun_soft"));
assert.ok(names("tardigrade").includes("clawamble_soft"));
assert.ok(names("tardigrade").includes("mosssip_soft"));
assert.ok(names("tardigrade").includes("waterbearroll_soft"));
assert.ok(names("tardigrade").includes("styletpierce_soft"));
assert.ok(names("tardigrade").includes("anhydro_soft"));
assert.ok(names("tardigrade").includes("freeze"));
assert.equal(names("tardigrade").includes("tun"), false);
assert.equal(names("tardigrade").includes("walk"), false);
assert.equal(names("tardigrade").includes("still"), false);
assert.equal(names("tardigrade").includes("sit"), false);
assert.ok(names("planarian").includes("dugesia"));
assert.ok(names("planarian").includes("ciliaryglide_soft"));
assert.ok(names("planarian").includes("lightflee_soft"));
assert.ok(names("planarian").includes("preywrap_soft"));
assert.ok(names("planarian").includes("regensplit_soft"));
assert.ok(names("planarian").includes("auriclesense_soft"));
assert.ok(names("planarian").includes("pharynxprobe_soft"));
assert.ok(names("planarian").includes("freeze"));
assert.equal(names("planarian").includes("split"), false);
assert.equal(names("planarian").includes("glide"), false);
assert.equal(names("planarian").includes("still"), false);
assert.equal(names("planarian").includes("half"), false);
assert.equal(names("planarian").includes("sit"), false);
assert.ok(names("nematode").includes("elegans"));
assert.ok(names("nematode").includes("sinusoid_soft"));
assert.ok(names("nematode").includes("dauerrest_soft"));
assert.ok(names("nematode").includes("pharynxpump_soft"));
assert.ok(names("nematode").includes("thrashturn_soft"));
assert.ok(names("nematode").includes("omegaturn_soft"));
assert.ok(names("nematode").includes("vulvaseek_soft"));
assert.ok(names("nematode").includes("freeze"));
assert.equal(names("nematode").includes("thrash"), false);
assert.equal(names("nematode").includes("still"), false);
assert.equal(names("nematode").includes("sit"), false);
assert.equal(names("nematode").includes("thread"), false);
assert.ok(names("amphipod").includes("gammarus"));
assert.ok(names("amphipod").includes("sideswim_soft"));
assert.ok(names("amphipod").includes("gnathopod_soft"));
assert.ok(names("amphipod").includes("detritusclutch_soft"));
assert.ok(names("amphipod").includes("pairguard_soft"));
assert.ok(names("amphipod").includes("urosome_soft"));
assert.ok(names("amphipod").includes("pleopod_soft"));
assert.ok(names("amphipod").includes("freeze"));
assert.equal(names("amphipod").includes("scud"), false);
assert.equal(names("amphipod").includes("dart"), false);
assert.equal(names("amphipod").includes("still"), false);
assert.equal(names("amphipod").includes("sit"), false);







  for (const key of SHORE) {
    const acts = names(key);
    assert.equal(acts.includes("scratch"), false, `${key} does not scratch`);
    assert.equal(acts.includes("tongue"), false, `${key} is not a snake`);
  }
  assert.ok(names("fiddler_crab").includes("pugilator"));
assert.ok(names("fiddler_crab").includes("clawwave_soft"));
assert.ok(names("fiddler_crab").includes("burrowdig_soft"));
assert.ok(names("fiddler_crab").includes("sandfeed_soft"));
assert.ok(names("fiddler_crab").includes("lateralsidestep_soft"));
assert.ok(names("fiddler_crab").includes("majorclaw_soft"));
assert.ok(names("fiddler_crab").includes("mudball_soft"));
assert.ok(names("fiddler_crab").includes("freeze"));
assert.equal(names("fiddler_crab").includes("wave"), false);
assert.equal(names("fiddler_crab").includes("walk"), false);
assert.equal(names("fiddler_crab").includes("still"), false);
assert.equal(names("fiddler_crab").includes("sit"), false);

  assert.ok(names("ghost_crab").includes("ocypodehush"));
assert.ok(names("ghost_crab").includes("sprintdash_soft"));
assert.ok(names("ghost_crab").includes("stalkeyescan_soft"));
assert.ok(names("ghost_crab").includes("burrowplunge_soft"));
assert.ok(names("ghost_crab").includes("freezecamo_soft"));
assert.ok(names("ghost_crab").includes("nightforage_soft"));
assert.ok(names("ghost_crab").includes("sandghost_soft"));
assert.ok(names("ghost_crab").includes("freeze"));
assert.equal(names("ghost_crab").includes("run"), false);
assert.equal(names("ghost_crab").includes("walk"), false);
assert.equal(names("ghost_crab").includes("still"), false);
assert.equal(names("ghost_crab").includes("sit"), false);
assert.ok(names("limpet").includes("patellahush"));
assert.ok(names("limpet").includes("clampseal_soft"));
assert.ok(names("limpet").includes("radialgraze_soft"));
assert.ok(names("limpet").includes("circumhome_soft"));
assert.ok(names("limpet").includes("shelltilt_soft"));
assert.ok(names("limpet").includes("homescar_soft"));
assert.ok(names("limpet").includes("radulasweep_soft"));
assert.ok(names("limpet").includes("freeze"));
assert.equal(names("limpet").includes("clamp"), false);
assert.equal(names("limpet").includes("rasp"), false);
assert.equal(names("limpet").includes("still"), false);
assert.equal(names("limpet").includes("sit"), false);
assert.ok(names("barnacle").includes("balanushush"));
assert.ok(names("barnacle").includes("cirrikick_soft"));
assert.ok(names("barnacle").includes("opershut_soft"));
assert.ok(names("barnacle").includes("cementhold_soft"));
assert.ok(names("barnacle").includes("tidereopen_soft"));
assert.ok(names("barnacle").includes("cirrisweep_soft"));
assert.ok(names("barnacle").includes("plateshut_soft"));
assert.ok(names("barnacle").includes("freeze"));
assert.equal(names("barnacle").includes("kick"), false);
assert.equal(names("barnacle").includes("still"), false);
assert.equal(names("barnacle").includes("sit"), false);
assert.equal(names("barnacle").includes("cirri"), false);
assert.ok(names("chiton").includes("chitonhush"));
assert.ok(names("chiton").includes("plateflex_soft"));
assert.ok(names("chiton").includes("radularasp_soft"));
assert.ok(names("chiton").includes("girdlesettle_soft"));
assert.ok(names("chiton").includes("rockcreep_soft"));
assert.ok(names("chiton").includes("eightvalve_soft"));
assert.ok(names("chiton").includes("aesthete_soft"));
assert.ok(names("chiton").includes("freeze"));
assert.equal(names("chiton").includes("graze"), false);
assert.equal(names("chiton").includes("plate"), false);
assert.equal(names("chiton").includes("still"), false);
assert.equal(names("chiton").includes("sit"), false);
assert.ok(names("periwinkle").includes("littorinahush"));
assert.ok(names("periwinkle").includes("spiralcrawl_soft"));
assert.ok(names("periwinkle").includes("filmgraze_soft"));
assert.ok(names("periwinkle").includes("opercshut_soft"));
assert.ok(names("periwinkle").includes("tidehuddle_soft"));
assert.ok(names("periwinkle").includes("tipup_soft"));
assert.ok(names("periwinkle").includes("littorine_soft"));
assert.ok(names("periwinkle").includes("freeze"));
assert.equal(names("periwinkle").includes("rasp"), false);
assert.equal(names("periwinkle").includes("graze"), false);
assert.equal(names("periwinkle").includes("still"), false);
assert.equal(names("periwinkle").includes("sit"), false);
assert.ok(names("sand_dollar").includes("mellitahush"));
assert.ok(names("sand_dollar").includes("lunulesift_soft"));
assert.ok(names("sand_dollar").includes("dollarright_soft"));
assert.ok(names("sand_dollar").includes("sandfilmburrow_soft"));
assert.ok(names("sand_dollar").includes("spinefurcreep_soft"));
assert.ok(names("sand_dollar").includes("petaloid_soft"));
assert.ok(names("sand_dollar").includes("ambulacra_soft"));
assert.ok(names("sand_dollar").includes("freeze"));
assert.equal(names("sand_dollar").includes("bury"), false);
assert.equal(names("sand_dollar").includes("flat"), false);
assert.equal(names("sand_dollar").includes("still"), false);
assert.equal(names("sand_dollar").includes("sit"), false);
assert.ok(names("sea_urchin").includes("strongylhush"));
assert.ok(names("sea_urchin").includes("spinewalk_soft"));
assert.ok(names("sea_urchin").includes("lanterngraze_soft"));
assert.ok(names("sea_urchin").includes("gripcreep_soft"));
assert.ok(names("sea_urchin").includes("spineflare_soft"));
assert.ok(names("sea_urchin").includes("pedicellaria_soft"));
assert.ok(names("sea_urchin").includes("aristotle_soft"));
assert.ok(names("sea_urchin").includes("freeze"));
assert.equal(names("sea_urchin").includes("walk"), false);
assert.equal(names("sea_urchin").includes("spine"), false);
assert.equal(names("sea_urchin").includes("still"), false);
assert.equal(names("sea_urchin").includes("sit"), false);
assert.ok(names("knobbed_whelk").includes("busyconhush"));
assert.ok(names("knobbed_whelk").includes("siphonprobe_soft"));
assert.ok(names("knobbed_whelk").includes("footplow_soft"));
assert.ok(names("knobbed_whelk").includes("opercdoor_soft"));
assert.ok(names("knobbed_whelk").includes("knobbyrock_soft"));
assert.ok(names("knobbed_whelk").includes("whelkhaul_soft"));
assert.ok(names("knobbed_whelk").includes("canalprobe_soft"));
assert.ok(names("knobbed_whelk").includes("freeze"));
assert.equal(names("knobbed_whelk").includes("hunt"), false);
assert.equal(names("knobbed_whelk").includes("sit"), false);
assert.equal(names("knobbed_whelk").includes("still"), false);
assert.ok(names("lugworm").includes("arenicolahush"));
assert.ok(names("lugworm").includes("uburrow_soft"));
assert.ok(names("lugworm").includes("sedgulp_soft"));
assert.ok(names("lugworm").includes("gillflush_soft"));
assert.ok(names("lugworm").includes("heapcast_soft"));
assert.ok(names("lugworm").includes("tailcast_soft"));
assert.ok(names("lugworm").includes("headdig_soft"));
assert.ok(names("lugworm").includes("freeze"));
assert.equal(names("lugworm").includes("hunt"), false);
assert.equal(names("lugworm").includes("sit"), false);
assert.equal(names("lugworm").includes("still"), false);
assert.equal(names("lugworm").includes("heap"), false);
assert.equal(names("lugworm").includes("cast"), false);
assert.ok(names("field_cricket").includes("gryllushush"));
assert.ok(names("field_cricket").includes("stridulate_soft"));
assert.ok(names("field_cricket").includes("antennasweep_soft"));
assert.ok(names("field_cricket").includes("hopskip_soft"));
assert.ok(names("field_cricket").includes("burrowmouth_soft"));
assert.ok(names("field_cricket").includes("cerciflick_soft"));
assert.ok(names("field_cricket").includes("tegmenraise_soft"));
assert.ok(names("field_cricket").includes("freeze"));
assert.equal(names("field_cricket").includes("hunt"), false);
assert.equal(names("field_cricket").includes("sit"), false);
assert.equal(names("field_cricket").includes("still"), false);
assert.equal(names("field_cricket").includes("chirp"), false);
assert.equal(names("field_cricket").includes("walk"), false);
assert.ok(names("katydid").includes("tettigonihush"));
assert.ok(names("katydid").includes("leafstill_soft"));
assert.ok(names("katydid").includes("antennatick_soft"));
assert.ok(names("katydid").includes("tegminasong_soft"));
assert.ok(names("katydid").includes("leafwalk_soft"));
assert.ok(names("katydid").includes("tegminlift_soft"));
assert.ok(names("katydid").includes("greenmimic_soft"));
assert.ok(names("katydid").includes("freeze"));
assert.equal(names("katydid").includes("hunt"), false);
assert.equal(names("katydid").includes("sit"), false);
assert.equal(names("katydid").includes("still"), false);
assert.equal(names("katydid").includes("blade"), false);
assert.equal(names("katydid").includes("walk"), false);
  for (const key of MEADOW) {
    const acts = names(key);
    assert.equal(acts.includes("scratch"), false, `${key} does not scratch`);
    assert.equal(acts.includes("tongue"), false, `${key} is not a snake`);
    assert.equal(acts.includes("waggle"), false, `${key} is not Comb`);
  }
  assert.ok(names("field_cricket").includes("gryllushush"));
  assert.ok(names("grasshopper").includes("caeliferahush"));
  assert.ok(names("grasshopper").includes("hindleap_soft"));
  assert.ok(names("grasshopper").includes("deskbask_soft"));
  assert.ok(names("grasshopper").includes("mandiblegraze_soft"));
  assert.ok(names("grasshopper").includes("femurrasp_soft"));
  assert.ok(names("grasshopper").includes("tympanal_soft"));
  assert.ok(names("grasshopper").includes("saltatory_soft"));
  assert.ok(names("grasshopper").includes("freeze"));
  assert.equal(names("grasshopper").includes("hunt"), false);
  assert.equal(names("grasshopper").includes("sit"), false);
  assert.equal(names("grasshopper").includes("still"), false);
  assert.equal(names("grasshopper").includes("vault"), false);
  assert.equal(names("grasshopper").includes("walk"), false);
assert.ok(names("swallowtail").includes("papiliohush"));
assert.ok(names("swallowtail").includes("wingbanner_soft"));
assert.ok(names("swallowtail").includes("puddlesip_soft"));
assert.ok(names("swallowtail").includes("flutterhop_soft"));
assert.ok(names("swallowtail").includes("tailglidesettle_soft"));
assert.ok(names("swallowtail").includes("tornusflash_soft"));
assert.ok(names("swallowtail").includes("tigerband_soft"));
assert.ok(names("swallowtail").includes("freeze"));
assert.equal(names("swallowtail").includes("hunt"), false);
assert.equal(names("swallowtail").includes("sit"), false);
assert.equal(names("swallowtail").includes("still"), false);
assert.equal(names("swallowtail").includes("banner"), false);
assert.equal(names("swallowtail").includes("flutter"), false);
assert.equal(names("swallowtail").includes("walk"), false);
assert.ok(names("jewelwing").includes("calopteryxhush"));
assert.ok(names("jewelwing").includes("jewelflick_soft"));
assert.ok(names("jewelwing").includes("creekpatrol_soft"));
assert.ok(names("jewelwing").includes("perchfan_soft"));
assert.ok(names("jewelwing").includes("ovipositdip_soft"));
assert.ok(names("jewelwing").includes("metallicwing_soft"));
assert.ok(names("jewelwing").includes("damselflick_soft"));
assert.ok(names("jewelwing").includes("freeze"));
assert.equal(names("jewelwing").includes("hunt"), false);
assert.equal(names("jewelwing").includes("sit"), false);
assert.equal(names("jewelwing").includes("still"), false);
assert.equal(names("jewelwing").includes("jewel"), false);
assert.equal(names("jewelwing").includes("hover"), false);
assert.equal(names("jewelwing").includes("walk"), false);
assert.ok(names("lacewing").includes("chrysopahush"));
assert.ok(names("lacewing").includes("wingtremble_soft"));
assert.ok(names("lacewing").includes("aphidstalk_soft"));
assert.ok(names("lacewing").includes("eggraise_soft"));
assert.ok(names("lacewing").includes("nightglint_soft"));
assert.ok(names("lacewing").includes("pedicel_soft"));
assert.ok(names("lacewing").includes("laceveil_soft"));
assert.ok(names("lacewing").includes("freeze"));
assert.equal(names("lacewing").includes("hunt"), false);
assert.equal(names("lacewing").includes("sit"), false);
assert.equal(names("lacewing").includes("still"), false);
assert.equal(names("lacewing").includes("lace"), false);
assert.equal(names("lacewing").includes("hover"), false);
assert.equal(names("lacewing").includes("walk"), false);
assert.ok(names("earwig").includes("forficulahush"));
assert.ok(names("earwig").includes("cercithreat_soft"));
assert.ok(names("earwig").includes("fanwing_soft"));
assert.ok(names("earwig").includes("nightscuttle_soft"));
assert.ok(names("earwig").includes("broodguard_soft"));
assert.ok(names("earwig").includes("tegminacurl_soft"));
assert.ok(names("earwig").includes("cerciwhip_soft"));
assert.ok(names("earwig").includes("freeze"));
assert.equal(names("earwig").includes("raise"), false);
assert.equal(names("earwig").includes("walk"), false);
assert.equal(names("earwig").includes("still"), false);
assert.equal(names("earwig").includes("earwig"), false);
assert.equal(names("earwig").includes("forceps"), false);
assert.equal(names("earwig").includes("sit"), false);
assert.ok(names("acorn_weevil").includes("curculiohush"));
assert.ok(names("acorn_weevil").includes("rostrumdrill_soft"));
assert.ok(names("acorn_weevil").includes("acornroll_soft"));
assert.ok(names("acorn_weevil").includes("dropthanatosis_soft"));
assert.ok(names("acorn_weevil").includes("snoutwalk_soft"));
assert.ok(names("acorn_weevil").includes("elytraclamp_soft"));
assert.ok(names("acorn_weevil").includes("cupprobe_soft"));
assert.ok(names("acorn_weevil").includes("freeze"));
assert.equal(names("acorn_weevil").includes("drill"), false);
assert.equal(names("acorn_weevil").includes("walk"), false);
assert.equal(names("acorn_weevil").includes("still"), false);
assert.equal(names("acorn_weevil").includes("acorn_weevil"), false);
assert.equal(names("acorn_weevil").includes("snout"), false);
assert.equal(names("acorn_weevil").includes("sit"), false);
assert.equal(names("lacewing").includes("hunt"), false);
assert.equal(names("lacewing").includes("sit"), false);
assert.equal(names("lacewing").includes("still"), false);
assert.equal(names("lacewing").includes("lace"), false);
assert.equal(names("lacewing").includes("hover"), false);
assert.equal(names("lacewing").includes("walk"), false);
assert.ok(names("click_beetle").includes("elaterhush"));
assert.ok(names("click_beetle").includes("clickjack_soft"));
assert.ok(names("click_beetle").includes("eyespotflash_soft"));
assert.ok(names("click_beetle").includes("clickfreeze_soft"));
assert.ok(names("click_beetle").includes("tickwalk_soft"));
assert.ok(names("click_beetle").includes("feelertick_soft"));
assert.ok(names("click_beetle").includes("rightingclick_soft"));
assert.ok(names("click_beetle").includes("freeze"));
assert.equal(names("click_beetle").includes("raise"), false);
assert.equal(names("click_beetle").includes("walk"), false);
assert.equal(names("click_beetle").includes("still"), false);
assert.equal(names("click_beetle").includes("click"), false);
assert.equal(names("click_beetle").includes("click_beetle"), false);
assert.equal(names("click_beetle").includes("sit"), false);
assert.ok(names("robber_fly").includes("asilushush"));
assert.ok(names("robber_fly").includes("sallyhawk_soft"));
assert.ok(names("robber_fly").includes("beardgroom_soft"));
assert.ok(names("robber_fly").includes("midsnatch_soft"));
assert.ok(names("robber_fly").includes("stiltsstance_soft"));
assert.ok(names("robber_fly").includes("mystaxwipe_soft"));
assert.ok(names("robber_fly").includes("perchsally_soft"));
assert.ok(names("robber_fly").includes("freeze"));
assert.equal(names("robber_fly").includes("raise"), false);
assert.equal(names("robber_fly").includes("walk"), false);
assert.equal(names("robber_fly").includes("still"), false);
assert.equal(names("robber_fly").includes("hunt"), false);
assert.equal(names("robber_fly").includes("perch"), false);
assert.equal(names("robber_fly").includes("robber_fly"), false);
assert.equal(names("robber_fly").includes("rob"), false);
assert.equal(names("robber_fly").includes("sit"), false);
  for (const key of CANOPY) {
    const acts = names(key);
    assert.equal(acts.includes("scratch"), false, `${key} does not scratch`);
    assert.equal(acts.includes("tongue"), false, `${key} is not a snake`);
  }
assert.ok(names("sloth").includes("bradypushush"));
assert.ok(names("sloth").includes("hangsway_soft"));
assert.ok(names("sloth").includes("reachcrawl_soft"));
assert.ok(names("sloth").includes("algaescratch_soft"));
assert.ok(names("sloth").includes("headturnstare_soft"));
assert.ok(names("sloth").includes("clawhook_soft"));
assert.ok(names("sloth").includes("slowdrip_soft"));
assert.ok(names("sloth").includes("freeze"));
assert.equal(names("sloth").includes("hang"), false);
assert.equal(names("sloth").includes("reach"), false);
assert.equal(names("sloth").includes("still"), false);
assert.equal(names("sloth").includes("sit"), false);
assert.equal(names("sloth").includes("sloth"), false);
assert.equal(names("sloth").includes("walk"), false);
assert.ok(names("lemur").includes("lemurhush"));
assert.ok(names("lemur").includes("bellybask_soft"));
assert.ok(names("lemur").includes("ringtailcurl_soft"));
assert.ok(names("lemur").includes("hopgallop_soft"));
assert.ok(names("lemur").includes("scentmark_soft"));
assert.ok(names("lemur").includes("stinkfight_soft"));
assert.ok(names("lemur").includes("sunworship_soft"));
assert.ok(names("lemur").includes("freeze"));
assert.equal(names("lemur").includes("sun"), false);
assert.equal(names("lemur").includes("flag"), false);
assert.equal(names("lemur").includes("walk"), false);
assert.equal(names("lemur").includes("sit"), false);
assert.equal(names("lemur").includes("lemur"), false);
assert.equal(names("lemur").includes("wait"), false);
assert.ok(names("gibbon").includes("hylobateshush"));
assert.ok(names("gibbon").includes("brachiate_soft"));
assert.ok(names("gibbon").includes("whoopduet_soft"));
assert.ok(names("gibbon").includes("bipedalstrut_soft"));
assert.ok(names("gibbon").includes("hangreach_soft"));
assert.ok(names("gibbon").includes("armhook_soft"));
assert.ok(names("gibbon").includes("duetbow_soft"));
assert.ok(names("gibbon").includes("freeze"));
assert.equal(names("gibbon").includes("swing"), false);
assert.equal(names("gibbon").includes("song"), false);
assert.equal(names("gibbon").includes("still"), false);
assert.equal(names("gibbon").includes("sit"), false);
assert.equal(names("gibbon").includes("gibbon"), false);
assert.equal(names("gibbon").includes("wait"), false);
assert.ok(names("kinkajou").includes("potoshush"));
assert.ok(names("kinkajou").includes("pretailhang_soft"));
assert.ok(names("kinkajou").includes("nectarsip_soft"));
assert.ok(names("kinkajou").includes("wristrotate_soft"));
assert.ok(names("kinkajou").includes("nightscamper_soft"));
assert.ok(names("kinkajou").includes("honeylap_soft"));
assert.ok(names("kinkajou").includes("tailcoil_soft"));
assert.ok(names("kinkajou").includes("freeze"));
assert.equal(names("kinkajou").includes("wrap"), false);
assert.equal(names("kinkajou").includes("lick"), false);
assert.equal(names("kinkajou").includes("still"), false);
assert.equal(names("kinkajou").includes("sit"), false);
assert.equal(names("kinkajou").includes("kinkajou"), false);
assert.equal(names("kinkajou").includes("wait"), false);
assert.ok(names("colugo").includes("galeopterushush"));
assert.ok(names("colugo").includes("patagiumglide_soft"));
assert.ok(names("colugo").includes("clingclimb_soft"));
assert.ok(names("colugo").includes("headdownhang_soft"));
assert.ok(names("colugo").includes("leaffoldsettle_soft"));
assert.ok(names("colugo").includes("membranespread_soft"));
assert.ok(names("colugo").includes("barkclamp_soft"));
assert.ok(names("colugo").includes("freeze"));
assert.equal(names("colugo").includes("sail"), false);
assert.equal(names("colugo").includes("cling"), false);
assert.equal(names("colugo").includes("still"), false);
assert.equal(names("colugo").includes("sit"), false);
assert.equal(names("colugo").includes("colugo"), false);
assert.equal(names("colugo").includes("wait"), false);
assert.ok(names("flying_squirrel").includes("glaucomyshush"));
assert.ok(names("flying_squirrel").includes("membranelaunch_soft"));
assert.ok(names("flying_squirrel").includes("softland_soft"));
assert.ok(names("flying_squirrel").includes("nestboxhuddle_soft"));
assert.ok(names("flying_squirrel").includes("nocturnalscurry_soft"));
assert.ok(names("flying_squirrel").includes("flapstretch_soft"));
assert.ok(names("flying_squirrel").includes("barksprint_soft"));
assert.ok(names("flying_squirrel").includes("freeze"));
assert.equal(names("flying_squirrel").includes("glide"), false);
assert.equal(names("flying_squirrel").includes("hop"), false);
assert.equal(names("flying_squirrel").includes("still"), false);
assert.equal(names("flying_squirrel").includes("sit"), false);
assert.equal(names("flying_squirrel").includes("flying_squirrel"), false);
assert.equal(names("flying_squirrel").includes("wait"), false);

assert.ok(names("howler").includes("alouattahush"));
assert.ok(names("howler").includes("hyoidboom_soft"));
assert.ok(names("howler").includes("tailbrace_soft"));
assert.ok(names("howler").includes("canopylounge_soft"));
assert.ok(names("howler").includes("leafchew_soft"));
assert.ok(names("howler").includes("mantelstretch_soft"));
assert.ok(names("howler").includes("throatpuff_soft"));
assert.ok(names("howler").includes("freeze"));
assert.equal(names("howler").includes("boom"), false);
assert.equal(names("howler").includes("sit"), false);
assert.equal(names("howler").includes("still"), false);
assert.equal(names("howler").includes("howler"), false);
assert.equal(names("howler").includes("wait"), false);

assert.ok(names("tarsier").includes("tarsiushush"));
assert.ok(names("tarsier").includes("eyeswivel_soft"));
assert.ok(names("tarsier").includes("clingleap_soft"));
assert.ok(names("tarsier").includes("insectpounce_soft"));
assert.ok(names("tarsier").includes("stillstare_soft"));
assert.ok(names("tarsier").includes("earfan_soft"));
assert.ok(names("tarsier").includes("verticalcling_soft"));
assert.ok(names("tarsier").includes("freeze"));
assert.equal(names("tarsier").includes("gaze"), false);
assert.equal(names("tarsier").includes("leap"), false);
assert.equal(names("tarsier").includes("still"), false);
assert.equal(names("tarsier").includes("tarsier"), false);
assert.equal(names("tarsier").includes("sit"), false);
assert.equal(names("tarsier").includes("wait"), false);

assert.ok(names("potto").includes("perodicticushush"));
assert.ok(names("potto").includes("scapularshield_soft"));
assert.ok(names("potto").includes("crypticcreep_soft"));
assert.ok(names("potto").includes("gumscrape_soft"));
assert.ok(names("potto").includes("gripclamp_soft"));
assert.ok(names("potto").includes("neckspine_soft"));
assert.ok(names("potto").includes("branchfreeze_soft"));
assert.ok(names("potto").includes("freeze"));
assert.equal(names("potto").includes("still"), false);
assert.equal(names("potto").includes("cling"), false);
assert.equal(names("potto").includes("walk"), false);
assert.equal(names("potto").includes("potto"), false);
assert.equal(names("potto").includes("sit"), false);
assert.equal(names("potto").includes("wait"), false);



  assert.ok(names("koala").includes("phascolarctoshush"));
assert.ok(names("koala").includes("eucchewbrowse_soft"));
assert.ok(names("koala").includes("forkbranchperch_soft"));
assert.ok(names("koala").includes("sleepychintuck_soft"));
assert.ok(names("koala").includes("climbhugtrunk_soft"));
assert.ok(names("koala").includes("pouchpress_soft"));
assert.ok(names("koala").includes("eardroop_soft"));
assert.ok(names("koala").includes("freeze"));
assert.equal(names("koala").includes("chew"), false);
assert.equal(names("koala").includes("cling"), false);
assert.equal(names("koala").includes("still"), false);
assert.equal(names("koala").includes("koala"), false);
assert.equal(names("koala").includes("gum"), false);
assert.equal(names("koala").includes("sit"), false);
assert.equal(names("koala").includes("wait"), false);
  for (const key of REEF) {
    const acts = names(key);
    assert.equal(acts.includes("scratch"), false, `${key} does not scratch`);
    assert.equal(acts.includes("tongue"), false, `${key} is not a snake`);
  }
  assert.ok(names("brain_coral").includes("diploriahush"));
  assert.ok(names("brain_coral").includes("meandroidridgepulse_soft"));
  assert.ok(names("brain_coral").includes("polyptentaclewave_soft"));
  assert.ok(names("brain_coral").includes("mucussheetsettle_soft"));
  assert.ok(names("brain_coral").includes("dayexpandnightcontract_soft"));
  assert.ok(names("brain_coral").includes("labyrinthfold_soft"));
  assert.ok(names("brain_coral").includes("zooxflash_soft"));
  assert.ok(names("brain_coral").includes("freeze"));
  assert.equal(names("brain_coral").includes("ridge"), false);
  assert.equal(names("brain_coral").includes("polyp"), false);
  assert.equal(names("brain_coral").includes("still"), false);
  assert.equal(names("brain_coral").includes("brain_coral"), false);
  assert.equal(names("brain_coral").includes("coral"), false);
  assert.equal(names("brain_coral").includes("sit"), false);
  assert.equal(names("brain_coral").includes("wait"), false);
  assert.ok(names("anemone").includes("actiniahush"));
  assert.ok(names("anemone").includes("oraldiskwreathsway_soft"));
  assert.ok(names("anemone").includes("nematocysttuck_soft"));
  assert.ok(names("anemone").includes("pedaldiskwalkcreep_soft"));
  assert.ok(names("anemone").includes("retractintocolumn_soft"));
  assert.ok(names("anemone").includes("tentaclefan_soft"));
  assert.ok(names("anemone").includes("oralflare_soft"));
  assert.ok(names("anemone").includes("freeze"));
  assert.equal(names("anemone").includes("wreath"), false);
  assert.equal(names("anemone").includes("open"), false);
  assert.equal(names("anemone").includes("still"), false);
  assert.equal(names("anemone").includes("anemone"), false);
  assert.equal(names("anemone").includes("sit"), false);
  assert.equal(names("anemone").includes("wait"), false);
  assert.ok(names("clownfish").includes("amphiprionhush"));
  assert.ok(names("clownfish").includes("wiggledancehostcue_soft"));
  assert.ok(names("clownfish").includes("darthideinanemone_soft"));
  assert.ok(names("clownfish").includes("stripeflashturn_soft"));
  assert.ok(names("clownfish").includes("peckcleanhost_soft"));
  assert.ok(names("clownfish").includes("hostnestle_soft"));
  assert.ok(names("clownfish").includes("orangebarflash_soft"));
  assert.ok(names("clownfish").includes("freeze"));
  assert.equal(names("clownfish").includes("dart"), false);
  assert.equal(names("clownfish").includes("nestle"), false);
  assert.equal(names("clownfish").includes("still"), false);
  assert.equal(names("clownfish").includes("clownfish"), false);
  assert.equal(names("clownfish").includes("paint"), false);
  assert.equal(names("clownfish").includes("sit"), false);
  assert.equal(names("clownfish").includes("wait"), false);
  assert.ok(names("parrotfish").includes("scarushush"));
  assert.ok(names("parrotfish").includes("pectoralhover_soft"));
  assert.ok(names("parrotfish").includes("mucuscocoonnightsettle_soft"));
  assert.ok(names("parrotfish").includes("sandpooppuffcue_soft"));
  assert.ok(names("parrotfish").includes("beakscrapegraze_soft"));
  assert.ok(names("parrotfish").includes("pharyngealmill_soft"));
  assert.ok(names("parrotfish").includes("greenphaseflash_soft"));
  assert.ok(names("parrotfish").includes("freeze"));
  assert.equal(names("parrotfish").includes("scrape"), false);
  assert.equal(names("parrotfish").includes("swim"), false);
  assert.equal(names("parrotfish").includes("still"), false);
  assert.equal(names("parrotfish").includes("parrotfish"), false);
  assert.equal(names("parrotfish").includes("sit"), false);
  assert.equal(names("parrotfish").includes("wait"), false);
  assert.ok(names("cleaner_shrimp").includes("lysmatahush"));
  assert.ok(names("cleaner_shrimp").includes("antennawaveadvertise_soft"));
  assert.ok(names("cleaner_shrimp").includes("dancescrubclientcue_soft"));
  assert.ok(names("cleaner_shrimp").includes("rockcreviceretreat_soft"));
  assert.ok(names("cleaner_shrimp").includes("bipedalwalktick_soft"));
  assert.ok(names("cleaner_shrimp").includes("whitebandflash_soft"));
  assert.ok(names("cleaner_shrimp").includes("clientstation_soft"));
  assert.ok(names("cleaner_shrimp").includes("freeze"));
  assert.equal(names("cleaner_shrimp").includes("wave"), false);
  assert.equal(names("cleaner_shrimp").includes("wait"), false);
  assert.equal(names("cleaner_shrimp").includes("still"), false);
  assert.equal(names("cleaner_shrimp").includes("cleaner_shrimp"), false);
  assert.equal(names("cleaner_shrimp").includes("scrub"), false);
  assert.equal(names("cleaner_shrimp").includes("sit"), false);
  assert.ok(names("sea_cucumber").includes("holothuriahush"));
  assert.ok(names("sea_cucumber").includes("tubefootcrawl_soft"));
  assert.ok(names("sea_cucumber").includes("depositfeedsift_soft"));
  assert.ok(names("sea_cucumber").includes("cucumberswellshrink_soft"));
  assert.ok(names("sea_cucumber").includes("softretractcue_soft"));
  assert.ok(names("sea_cucumber").includes("teatspike_soft"));
  assert.ok(names("sea_cucumber").includes("cloacalbreathe_soft"));
  assert.ok(names("sea_cucumber").includes("freeze"));
  assert.equal(names("sea_cucumber").includes("crawl"), false);
  assert.equal(names("sea_cucumber").includes("still"), false);
  assert.equal(names("sea_cucumber").includes("wait"), false);
  assert.equal(names("sea_cucumber").includes("sea_cucumber"), false);
  assert.equal(names("sea_cucumber").includes("tube"), false);
  assert.equal(names("sea_cucumber").includes("sit"), false);
  assert.ok(names("lionfish").includes("pteroishush"));
  assert.ok(names("lionfish").includes("pectoralveilfanflare_soft"));
  assert.ok(names("lionfish").includes("gulpinginhalecue_soft"));
  assert.ok(names("lionfish").includes("spinewarnraise_soft"));
  assert.ok(names("lionfish").includes("slowhoverstalk_soft"));
  assert.ok(names("lionfish").includes("stripebar_soft"));
  assert.ok(names("lionfish").includes("venomwarn_soft"));
  assert.ok(names("lionfish").includes("freeze"));
  assert.equal(names("lionfish").includes("veil"), false);
  assert.equal(names("lionfish").includes("hover"), false);
  assert.equal(names("lionfish").includes("still"), false);
  assert.equal(names("lionfish").includes("wait"), false);
  assert.equal(names("lionfish").includes("lionfish"), false);
  assert.equal(names("lionfish").includes("sit"), false);
  assert.ok(names("giant_clam").includes("tridacnahush"));
  assert.ok(names("giant_clam").includes("mantlecurtainpulse_soft"));
  assert.ok(names("giant_clam").includes("siphonjetpuff_soft"));
  assert.ok(names("giant_clam").includes("shellgapeclosegate_soft"));
  assert.ok(names("giant_clam").includes("zooxanthellaesunbask_soft"));
  assert.ok(names("giant_clam").includes("byssusgrip_soft"));
  assert.ok(names("giant_clam").includes("mantleedge_soft"));
  assert.ok(names("giant_clam").includes("freeze"));
  assert.equal(names("giant_clam").includes("open"), false);
  assert.equal(names("giant_clam").includes("mantle"), false);
  assert.equal(names("giant_clam").includes("still"), false);
  assert.equal(names("giant_clam").includes("wait"), false);
  assert.equal(names("giant_clam").includes("giant_clam"), false);
  assert.equal(names("giant_clam").includes("sit"), false);
  assert.ok(names("eagle_ray").includes("aetobatushush"));
  assert.ok(names("eagle_ray").includes("wingsoarflapglide_soft"));
  assert.ok(names("eagle_ray").includes("cephaliclobesift_soft"));
  assert.ok(names("eagle_ray").includes("sanddigbury_soft"));
  assert.ok(names("eagle_ray").includes("leapbreachcue_soft"));
  assert.ok(names("eagle_ray").includes("spotflash_soft"));
  assert.ok(names("eagle_ray").includes("wingbank_soft"));
  assert.ok(names("eagle_ray").includes("freeze"));
  assert.equal(names("eagle_ray").includes("soar"), false);
  assert.equal(names("eagle_ray").includes("glide"), false);
  assert.equal(names("eagle_ray").includes("still"), false);
  assert.equal(names("eagle_ray").includes("wait"), false);
  assert.equal(names("eagle_ray").includes("eagle_ray"), false);
  assert.equal(names("eagle_ray").includes("sit"), false);
  assert.ok(names("grouper").includes("epinephelushush"));
  assert.ok(names("grouper").includes("cavernambushsettle_soft"));
  assert.ok(names("grouper").includes("gulargulpinhale_soft"));
  assert.ok(names("grouper").includes("colorpatternflush_soft"));
  assert.ok(names("grouper").includes("slowcaudalhover_soft"));
  assert.ok(names("grouper").includes("jawsnap_soft"));
  assert.ok(names("grouper").includes("stripeband_soft"));
  assert.ok(names("grouper").includes("freeze"));
  assert.equal(names("grouper").includes("hide"), false);
  assert.equal(names("grouper").includes("gape"), false);
  assert.equal(names("grouper").includes("still"), false);
  assert.equal(names("grouper").includes("wait"), false);
  assert.equal(names("grouper").includes("grouper"), false);
  assert.equal(names("grouper").includes("sit"), false);
  assert.ok(names("cyber_dragon").includes("cyberhush"));
  assert.ok(names("cyber_dragon").includes("arcsparkcoil_soft"));
  assert.ok(names("cyber_dragon").includes("circuitridgewalk_soft"));
  assert.ok(names("cyber_dragon").includes("databreathshimmer_soft"));
  assert.ok(names("cyber_dragon").includes("perchscanblink_soft"));
  assert.ok(names("cyber_dragon").includes("gridpulse_soft"));
  assert.ok(names("cyber_dragon").includes("packetflick_soft"));
  assert.ok(names("cyber_dragon").includes("freeze"));
  assert.equal(names("cyber_dragon").includes("arc"), false);
  assert.equal(names("cyber_dragon").includes("still"), false);
  assert.equal(names("cyber_dragon").includes("watch"), false);
  assert.equal(names("cyber_dragon").includes("wait"), false);
  assert.equal(names("cyber_dragon").includes("cyber_dragon"), false);
  assert.equal(names("cyber_dragon").includes("sit"), false);
  assert.ok(names("volt_dragon").includes("volthush"));
  assert.ok(names("volt_dragon").includes("coiledgecharge_soft"));
  assert.ok(names("volt_dragon").includes("windowwireskim_soft"));
  assert.ok(names("volt_dragon").includes("staticfringecrackle_soft"));
  assert.ok(names("volt_dragon").includes("sparkhop_soft"));
  assert.ok(names("volt_dragon").includes("coilwind_soft"));
  assert.ok(names("volt_dragon").includes("coronaflash_soft"));
  assert.ok(names("volt_dragon").includes("freeze"));
  assert.equal(names("volt_dragon").includes("current"), false);
  assert.equal(names("volt_dragon").includes("still"), false);
  assert.equal(names("volt_dragon").includes("watch"), false);
  assert.equal(names("volt_dragon").includes("wait"), false);
  assert.equal(names("volt_dragon").includes("volt_dragon"), false);
  assert.equal(names("volt_dragon").includes("sit"), false);
  assert.ok(names("trace_dragon").includes("tracehush"));
  assert.ok(names("trace_dragon").includes("outlinetracepathwalk_soft"));
  assert.ok(names("trace_dragon").includes("dashedlineflicker_soft"));
  assert.ok(names("trace_dragon").includes("cornersnapturn_soft"));
  assert.ok(names("trace_dragon").includes("breadcrumbperch_soft"));
  assert.ok(names("trace_dragon").includes("pathglow_soft"));
  assert.ok(names("trace_dragon").includes("waypointskip_soft"));
  assert.ok(names("trace_dragon").includes("freeze"));
  assert.equal(names("trace_dragon").includes("path"), false);
  assert.equal(names("trace_dragon").includes("still"), false);
  assert.equal(names("trace_dragon").includes("watch"), false);
  assert.equal(names("trace_dragon").includes("wait"), false);
  assert.equal(names("trace_dragon").includes("trace_dragon"), false);
  assert.equal(names("trace_dragon").includes("sit"), false);
  assert.ok(names("flux_dragon").includes("fluxhush"));
  assert.ok(names("flux_dragon").includes("heatfieldclaimwalk_soft"));
  assert.ok(names("flux_dragon").includes("fieldlineshimmer_soft"));
  assert.ok(names("flux_dragon").includes("hideheatbloom_soft"));
  assert.ok(names("flux_dragon").includes("treatyfieldsettle_soft"));
  assert.ok(names("flux_dragon").includes("fieldripple_soft"));
  assert.ok(names("flux_dragon").includes("boundaryglow_soft"));
  assert.ok(names("flux_dragon").includes("freeze"));
  assert.equal(names("flux_dragon").includes("field"), false);
  assert.equal(names("flux_dragon").includes("still"), false);
  assert.equal(names("flux_dragon").includes("watch"), false);
  assert.equal(names("flux_dragon").includes("wait"), false);
  assert.equal(names("flux_dragon").includes("flux_dragon"), false);
  assert.equal(names("flux_dragon").includes("sit"), false);
  assert.ok(names("spark_dragon").includes("sparkhush"));
  assert.ok(names("spark_dragon").includes("crackpointskitter_soft"));
  assert.ok(names("spark_dragon").includes("snoutcrackpop_soft"));
  assert.ok(names("spark_dragon").includes("clawtipcrackle_soft"));
  assert.ok(names("spark_dragon").includes("tailpointperch_soft"));
  assert.ok(names("spark_dragon").includes("fissureflash_soft"));
  assert.ok(names("spark_dragon").includes("tipscorch_soft"));
  assert.ok(names("spark_dragon").includes("freeze"));
  assert.equal(names("spark_dragon").includes("crackle"), false);
  assert.equal(names("spark_dragon").includes("still"), false);
  assert.equal(names("spark_dragon").includes("watch"), false);
  assert.equal(names("spark_dragon").includes("wait"), false);
  assert.equal(names("spark_dragon").includes("spark_dragon"), false);
  assert.equal(names("spark_dragon").includes("sit"), false);
  assert.ok(names("ion_dragon").includes("ionhush"));
  assert.ok(names("ion_dragon").includes("paleionhazecling_soft"));
  assert.ok(names("ion_dragon").includes("outlinehazedrift_soft"));
  assert.ok(names("ion_dragon").includes("chargehazeclaim_soft"));
  assert.ok(names("ion_dragon").includes("mistperchsettle_soft"));
  assert.ok(names("ion_dragon").includes("hazeveil_soft"));
  assert.ok(names("ion_dragon").includes("ionbloom_soft"));
  assert.ok(names("ion_dragon").includes("freeze"));
  assert.equal(names("ion_dragon").includes("haze"), false);
  assert.equal(names("ion_dragon").includes("still"), false);
  assert.equal(names("ion_dragon").includes("watch"), false);
  assert.equal(names("ion_dragon").includes("wait"), false);
  assert.equal(names("ion_dragon").includes("ion_dragon"), false);
  assert.equal(names("ion_dragon").includes("sit"), false);
  assert.ok(names("gauss_dragon").includes("gausshush"));
  assert.ok(names("gauss_dragon").includes("filinglinesbandwalk_soft"));
  assert.ok(names("gauss_dragon").includes("ironfilingsstand_soft"));
  assert.ok(names("gauss_dragon").includes("fieldlinealign_soft"));
  assert.ok(names("gauss_dragon").includes("magneticperchsettle_soft"));
  assert.ok(names("gauss_dragon").includes("filingsweep_soft"));
  assert.ok(names("gauss_dragon").includes("bandclamp_soft"));
  assert.ok(names("gauss_dragon").includes("freeze"));
  assert.equal(names("gauss_dragon").includes("filing"), false);
  assert.equal(names("gauss_dragon").includes("still"), false);
  assert.equal(names("gauss_dragon").includes("watch"), false);
  assert.equal(names("gauss_dragon").includes("wait"), false);
  assert.equal(names("gauss_dragon").includes("gauss_dragon"), false);
  assert.equal(names("gauss_dragon").includes("sit"), false);
  assert.ok(names("relay_dragon").includes("relayhush"));
  assert.ok(names("relay_dragon").includes("contactclick_soft"));
  assert.ok(names("relay_dragon").includes("latchseat_soft"));
  assert.ok(names("relay_dragon").includes("arcflick_soft"));
  assert.ok(names("relay_dragon").includes("coilbuzz_soft"));
  assert.ok(names("relay_dragon").includes("poleswitch_soft"));
  assert.ok(names("relay_dragon").includes("armaturetap_soft"));
  assert.ok(names("relay_dragon").includes("freeze"));
  assert.equal(names("relay_dragon").includes("relay"), false);
  assert.equal(names("relay_dragon").includes("still"), false);
  assert.equal(names("relay_dragon").includes("watch"), false);
  assert.equal(names("relay_dragon").includes("wait"), false);
  assert.equal(names("relay_dragon").includes("relay_dragon"), false);
  assert.equal(names("relay_dragon").includes("sit"), false);
  assert.ok(names("fuse_dragon").includes("fusehush"));
  assert.ok(names("fuse_dragon").includes("railseat_soft"));
  assert.ok(names("fuse_dragon").includes("holdcurrent_soft"));
  assert.ok(names("fuse_dragon").includes("blowclear_soft"));
  assert.ok(names("fuse_dragon").includes("reseatsnap_soft"));
  assert.ok(names("fuse_dragon").includes("cartridgerattle_soft"));
  assert.ok(names("fuse_dragon").includes("bladeflash_soft"));
  assert.ok(names("fuse_dragon").includes("freeze"));
  assert.equal(names("fuse_dragon").includes("fuse"), false);
  assert.equal(names("fuse_dragon").includes("still"), false);
  assert.equal(names("fuse_dragon").includes("watch"), false);
  assert.equal(names("fuse_dragon").includes("wait"), false);
  assert.equal(names("fuse_dragon").includes("fuse_dragon"), false);
  assert.equal(names("fuse_dragon").includes("sit"), false);
  assert.ok(names("ground_dragon").includes("groundhush"));
  assert.ok(names("ground_dragon").includes("lugstrap_soft"));
  assert.ok(names("ground_dragon").includes("earthseat_soft"));
  assert.ok(names("ground_dragon").includes("heaveplate_soft"));
  assert.ok(names("ground_dragon").includes("bedsettle_soft"));
  assert.ok(names("ground_dragon").includes("soilgrip_soft"));
  assert.ok(names("ground_dragon").includes("plateclamp_soft"));
  assert.ok(names("ground_dragon").includes("freeze"));
  assert.equal(names("ground_dragon").includes("earth"), false);
  assert.equal(names("ground_dragon").includes("still"), false);
  assert.equal(names("ground_dragon").includes("watch"), false);
  assert.equal(names("ground_dragon").includes("wait"), false);
  assert.equal(names("ground_dragon").includes("ground_dragon"), false);
  assert.equal(names("ground_dragon").includes("sit"), false);



  for (const key of WELL) {
    const acts = names(key);
    assert.equal(acts.includes("scratch"), false, `${key} does not scratch`);
    assert.equal(acts.includes("tongue"), false, `${key} is not a snake`);
  }
  assert.ok(names("honeybee").includes("hive"));
  assert.ok(names("honeybee").includes("figure_soft"));
  assert.ok(names("honeybee").includes("corbicula_soft"));
  assert.ok(names("honeybee").includes("hex_soft"));
  assert.ok(names("honeybee").includes("proboscis_soft"));
  assert.ok(names("honeybee").includes("ocelli_soft"));
  assert.ok(names("honeybee").includes("nasonov_soft"));
  assert.ok(names("honeybee").includes("freeze"));
  assert.equal(names("honeybee").includes("waggle"), false);
  assert.equal(names("honeybee").includes("dart"), false);
  assert.equal(names("honeybee").includes("still"), false);
  assert.ok(names("monarch").includes("danaus"));
  assert.ok(names("monarch").includes("asclepias_soft"));
  assert.ok(names("monarch").includes("oyamel_soft"));
  assert.ok(names("monarch").includes("warning_soft"));
  assert.ok(names("monarch").includes("chrysalis_soft"));
  assert.ok(names("monarch").includes("cremaster_soft"));
  assert.ok(names("monarch").includes("tarsus_soft"));
  assert.ok(names("monarch").includes("freeze"));
  assert.equal(names("monarch").includes("flutter"), false);
  assert.equal(names("monarch").includes("migrate"), false);
  assert.equal(names("monarch").includes("still"), false);
assert.ok(names("bumblebee").includes("bombus"));
assert.ok(names("bumblebee").includes("sonicate_soft"));
assert.ok(names("bumblebee").includes("scopa_soft"));
assert.ok(names("bumblebee").includes("fossor_soft"));
assert.ok(names("bumblebee").includes("lumber_soft"));
assert.ok(names("bumblebee").includes("thoraxload_soft"));
assert.ok(names("bumblebee").includes("corbicularub_soft"));
assert.ok(names("bumblebee").includes("freeze"));
assert.equal(names("bumblebee").includes("thrum"), false);
assert.equal(names("bumblebee").includes("hover"), false);
assert.equal(names("bumblebee").includes("still"), false);
assert.ok(names("sweat_bee").includes("agapostemon"));
assert.ok(names("sweat_bee").includes("lustre_soft"));
assert.ok(names("sweat_bee").includes("tumulus_soft"));
assert.ok(names("sweat_bee").includes("salt_soft"));
assert.ok(names("sweat_bee").includes("commune_soft"));
assert.ok(names("sweat_bee").includes("metallictilt_soft"));
assert.ok(names("sweat_bee").includes("nestmound_soft"));
assert.ok(names("sweat_bee").includes("freeze"));
assert.equal(names("sweat_bee").includes("shine"), false);
assert.equal(names("sweat_bee").includes("hover"), false);
assert.equal(names("sweat_bee").includes("still"), false);
assert.ok(names("honey_drone").includes("mellifera"));
assert.ok(names("honey_drone").includes("holoptic_soft"));
assert.ok(names("honey_drone").includes("congregation_soft"));
assert.ok(names("honey_drone").includes("sortie_soft"));
assert.ok(names("honey_drone").includes("ocellus_soft"));
assert.ok(names("honey_drone").includes("dronepatrol_soft"));
assert.ok(names("honey_drone").includes("eyemeet_soft"));
assert.ok(names("honey_drone").includes("freeze"));
assert.equal(names("honey_drone").includes("hum"), false);
assert.equal(names("honey_drone").includes("hover"), false);
assert.equal(names("honey_drone").includes("still"), false);
assert.ok(names("carpenter_bee").includes("xylocopa"));
assert.ok(names("carpenter_bee").includes("rasp_soft"));
assert.ok(names("carpenter_bee").includes("glabrous_soft"));
assert.ok(names("carpenter_bee").includes("partition_soft"));
assert.ok(names("carpenter_bee").includes("picket_soft"));
assert.ok(names("carpenter_bee").includes("tunnelrasp_soft"));
assert.ok(names("carpenter_bee").includes("baldflash_soft"));
assert.ok(names("carpenter_bee").includes("freeze"));
assert.equal(names("carpenter_bee").includes("hover"), false);
assert.equal(names("carpenter_bee").includes("bore"), false);
assert.equal(names("carpenter_bee").includes("still"), false);

assert.ok(names("mason_bee").includes("osmia"));
assert.ok(names("mason_bee").includes("trowel_soft"));
assert.ok(names("mason_bee").includes("beebread_soft"));
assert.ok(names("mason_bee").includes("orchard_soft"));
assert.ok(names("mason_bee").includes("plug_soft"));
assert.ok(names("mason_bee").includes("mudseptum_soft"));
assert.ok(names("mason_bee").includes("tubeprovision_soft"));
assert.ok(names("mason_bee").includes("freeze"));
assert.equal(names("mason_bee").includes("seal"), false);
assert.equal(names("mason_bee").includes("hover"), false);
assert.equal(names("mason_bee").includes("still"), false);

assert.ok(names("leafcutter").includes("megachile"));
assert.ok(names("leafcutter").includes("circle_soft"));
assert.ok(names("leafcutter").includes("liner_soft"));
assert.ok(names("leafcutter").includes("cavity_soft"));
assert.ok(names("leafcutter").includes("parcel_soft"));
assert.ok(names("leafcutter").includes("discpress_soft"));
assert.ok(names("leafcutter").includes("cellcup_soft"));
assert.ok(names("leafcutter").includes("freeze"));
assert.equal(names("leafcutter").includes("cut"), false);
assert.equal(names("leafcutter").includes("hover"), false);
assert.equal(names("leafcutter").includes("still"), false);

assert.ok(names("stingless").includes("melipona"));
assert.ok(names("stingless").includes("cerumen_soft"));
assert.ok(names("stingless").includes("spout_soft"));
assert.ok(names("stingless").includes("vessel_soft"));
assert.ok(names("stingless").includes("batumen_soft"));
assert.ok(names("stingless").includes("potpress_soft"));
assert.ok(names("stingless").includes("involucrum_soft"));
assert.ok(names("stingless").includes("freeze"));
assert.equal(names("stingless").includes("pot"), false);
assert.equal(names("stingless").includes("hover"), false);
assert.equal(names("stingless").includes("still"), false);

assert.ok(names("mining_bee").includes("andrena"));
assert.ok(names("mining_bee").includes("shaft_soft"));
assert.ok(names("mining_bee").includes("mass_soft"));
assert.ok(names("mining_bee").includes("vernal_soft"));
assert.ok(names("mining_bee").includes("fovea_soft"));
assert.ok(names("mining_bee").includes("floccus_soft"));
assert.ok(names("mining_bee").includes("dufourline_soft"));
assert.ok(names("mining_bee").includes("freeze"));
assert.equal(names("mining_bee").includes("dig"), false);
assert.equal(names("mining_bee").includes("hover"), false);
assert.equal(names("mining_bee").includes("still"), false);





  assert.ok(names("firefly").includes("photinus"));
  assert.ok(names("firefly").includes("lantern_soft"));
  assert.ok(names("firefly").includes("jstroke_soft"));
  assert.ok(names("firefly").includes("semaphore_soft"));
  assert.ok(names("firefly").includes("elytra_soft"));
  assert.ok(names("firefly").includes("photocyte_soft"));
  assert.ok(names("firefly").includes("sternite_soft"));
  assert.ok(names("firefly").includes("freeze"));
  assert.equal(names("firefly").includes("flash"), false);
  assert.equal(names("firefly").includes("lift"), false);
  assert.equal(names("firefly").includes("still"), false);
  assert.ok(names("darner").includes("anax"));
  assert.ok(names("darner").includes("hawking_soft"));
  assert.ok(names("darner").includes("tandem_soft"));
  assert.ok(names("darner").includes("nymph_soft"));
  assert.ok(names("darner").includes("whir_soft"));
  assert.ok(names("darner").includes("obelisk_soft"));
  assert.ok(names("darner").includes("ommatidia_soft"));
  assert.ok(names("darner").includes("freeze"));
  assert.equal(names("darner").includes("hawk"), false);
  assert.equal(names("darner").includes("hover"), false);
  assert.equal(names("darner").includes("still"), false);
  assert.ok(names("stick").includes("diapheromera"));
  assert.ok(names("stick").includes("rocking_soft"));
  assert.ok(names("stick").includes("catalepsy_soft"));
  assert.ok(names("stick").includes("browse_soft"));
  assert.ok(names("stick").includes("tread_soft"));
  assert.ok(names("stick").includes("oviposit_soft"));
  assert.ok(names("stick").includes("filiform_soft"));
  assert.ok(names("stick").includes("freeze"));
  assert.equal(names("stick").includes("still"), false);
  assert.equal(names("stick").includes("walk"), false);
  assert.equal(names("stick").includes("tegminlift_soft"), false);
  assert.ok(names("carpenter_ant").includes("camponotus"));
  assert.ok(names("carpenter_ant").includes("gallery_soft"));
  assert.ok(names("carpenter_ant").includes("pheromone_soft"));
  assert.ok(names("carpenter_ant").includes("crumb_soft"));
  assert.ok(names("carpenter_ant").includes("bustle_soft"));
  assert.ok(names("carpenter_ant").includes("trophallaxis_soft"));
  assert.ok(names("carpenter_ant").includes("frass_soft"));
  assert.ok(names("carpenter_ant").includes("freeze"));
  assert.equal(names("carpenter_ant").includes("trail"), false);
  assert.equal(names("carpenter_ant").includes("dart"), false);
  assert.equal(names("carpenter_ant").includes("still"), false);
  assert.ok(names("ladybird").includes("coccinella"));
  assert.ok(names("ladybird").includes("spots_soft"));
  assert.ok(names("ladybird").includes("aphid_soft"));
  assert.ok(names("ladybird").includes("reflex_soft"));
  assert.ok(names("ladybird").includes("climb_soft"));
  assert.ok(names("ladybird").includes("pronotum_soft"));
  assert.ok(names("ladybird").includes("alar_soft"));
  assert.ok(names("ladybird").includes("freeze"));
  assert.equal(names("ladybird").includes("count"), false);
  assert.equal(names("ladybird").includes("hunt"), false);
  assert.equal(names("ladybird").includes("still"), false);
  assert.ok(names("mantis").includes("mantodea"));
  assert.ok(names("mantis").includes("raptorial_soft"));
  assert.ok(names("mantis").includes("gimbal_soft"));
  assert.ok(names("mantis").includes("snatch_soft"));
  assert.ok(names("mantis").includes("pendulum_soft"));
  assert.ok(names("mantis").includes("ootheca_soft"));
  assert.ok(names("mantis").includes("deimatic_soft"));
  assert.ok(names("mantis").includes("freeze"));
  assert.equal(names("mantis").includes("fold"), false);
  assert.equal(names("mantis").includes("strike"), false);
  assert.equal(names("mantis").includes("still"), false);
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
  assert.ok(names("budgie").includes("freeze"));
  assert.equal(names("budgie").includes("loaf"), false);
  assert.equal(names("budgie").includes("pharyngealmill_soft"), false);
  assert.ok(names("penguin").includes("huddle"));
  assert.ok(names("penguin").includes("rockhop_soft"));
  assert.ok(names("penguin").includes("freeze"));
  assert.equal(names("penguin").includes("loaf"), false);
  assert.equal(names("penguin").includes("denslide_soft"), false);
  assert.ok(names("parrot").includes("quote"));
  assert.ok(names("parrot").includes("pineye_soft"));
  assert.ok(names("parrot").includes("fan_soft"));
  assert.ok(names("parrot").includes("invert_soft"));
  assert.ok(names("parrot").includes("freeze"));
  assert.equal(names("parrot").includes("loaf"), false);
  assert.equal(names("parrot").includes("pectoral_soft"), false);
  assert.equal(names("parrot").includes("alert"), false);
  assert.ok(names("toucan").includes("roost"));
  assert.ok(names("toucan").includes("rattle_soft"));
  assert.ok(names("toucan").includes("clatter_soft"));
  assert.ok(names("toucan").includes("freeze"));
  assert.ok(names("phoenix").includes("cinder"));
  assert.ok(names("phoenix").includes("reignite_soft"));
  assert.ok(names("phoenix").includes("hearth_soft"));
  assert.ok(names("phoenix").includes("freeze"));
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
  assert.ok(names("ball_python").includes("taste_soft"));
  assert.ok(names("ball_python").includes("unroll_soft"));
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
  assert.ok(names("maidenhair").includes("stipe_soft"));
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

test("orchid ethogram is Moth ultra (epiphyte sit_hold + softs + freeze, not unfurl/lean/nod)", () => {
  assert.ok(names("orchid").includes("epiphyte"));
  assert.ok(names("orchid").includes("labellum_soft"));
  assert.ok(names("orchid").includes("velamen_soft"));
  assert.ok(names("orchid").includes("column_soft"));
  assert.ok(names("orchid").includes("spike_soft"));
  assert.ok(names("orchid").includes("keiki_soft"));
  assert.ok(names("orchid").includes("pollinia_soft"));
  assert.ok(names("orchid").includes("freeze"));
  assert.equal(names("orchid").includes("unfurl"), false);
  assert.equal(names("orchid").includes("lean"), false);
  assert.equal(names("orchid").includes("nod"), false);
});

test("saguaro ethogram is Arm ultra (sentinel sit_hold + softs + freeze, not still/lean/nod)", () => {
  assert.ok(names("saguaro").includes("sentinel"));
  assert.ok(names("saguaro").includes("rib_soft"));
  assert.ok(names("saguaro").includes("branch_soft"));
  assert.ok(names("saguaro").includes("nocturne_soft"));
  assert.ok(names("saguaro").includes("areole_soft"));
  assert.ok(names("saguaro").includes("pleat_soft"));
  assert.ok(names("saguaro").includes("boot_soft"));
  assert.ok(names("saguaro").includes("freeze"));
  assert.equal(names("saguaro").includes("still"), false);
  assert.equal(names("saguaro").includes("lean"), false);
  assert.equal(names("saguaro").includes("nod"), false);
});

test("venus_flytrap ethogram is Snap ultra (poise sit_hold + softs + freeze, not snap/lean/nod)", () => {
  assert.ok(names("venus_flytrap").includes("poise"));
  assert.ok(names("venus_flytrap").includes("clamp_soft"));
  assert.ok(names("venus_flytrap").includes("trichome_soft"));
  assert.ok(names("venus_flytrap").includes("stew_soft"));
  assert.ok(names("venus_flytrap").includes("unseal_soft"));
  assert.ok(names("venus_flytrap").includes("cage_soft"));
  assert.ok(names("venus_flytrap").includes("scape_soft"));
  assert.ok(names("venus_flytrap").includes("freeze"));
  assert.equal(names("venus_flytrap").includes("snap"), false);
  assert.equal(names("venus_flytrap").includes("lean"), false);
  assert.equal(names("venus_flytrap").includes("nod"), false);
});

test("pitcher ethogram is Well ultra (urn sit_hold + peristome_soft + softs + freeze, not still/lean/nod)", () => {
  assert.ok(names("pitcher").includes("urn"));
  assert.ok(names("pitcher").includes("peristome_soft"));
  assert.ok(names("pitcher").includes("cistern_soft"));
  assert.ok(names("pitcher").includes("brine_soft"));
  assert.ok(names("pitcher").includes("operculum_soft"));
  assert.ok(names("pitcher").includes("ala_soft"));
  assert.ok(names("pitcher").includes("baffle_soft"));
  assert.ok(names("pitcher").includes("freeze"));
  assert.equal(names("pitcher").includes("adoral_soft"), false);
  assert.equal(names("pitcher").includes("still"), false);
  assert.equal(names("pitcher").includes("lean"), false);
  assert.equal(names("pitcher").includes("nod"), false);
});

test("sundew ethogram is Dew ultra (rosette sit_hold + mucilage_soft + softs + freeze, not curl/lean/nod)", () => {
  assert.ok(names("sundew").includes("rosette"));
  assert.ok(names("sundew").includes("mucilage_soft"));
  assert.ok(names("sundew").includes("tentacle_soft"));
  assert.ok(names("sundew").includes("digest_soft"));
  assert.ok(names("sundew").includes("gland_soft"));
  assert.ok(names("sundew").includes("lamina_soft"));
  assert.ok(names("sundew").includes("circinate_soft"));
  assert.ok(names("sundew").includes("freeze"));
  assert.equal(names("sundew").includes("curl"), false);
  assert.equal(names("sundew").includes("lean"), false);
  assert.equal(names("sundew").includes("nod"), false);
});


test("firefly ethogram is Spark ultra (photinus sit_hold + softs + freeze, not flash/lift/still)", () => {
  assert.ok(names("firefly").includes("photinus"));
  assert.ok(names("firefly").includes("lantern_soft"));
  assert.ok(names("firefly").includes("jstroke_soft"));
  assert.ok(names("firefly").includes("semaphore_soft"));
  assert.ok(names("firefly").includes("elytra_soft"));
  assert.ok(names("firefly").includes("photocyte_soft"));
  assert.ok(names("firefly").includes("sternite_soft"));
  assert.ok(names("firefly").includes("freeze"));
  assert.equal(names("firefly").includes("flash"), false);
  assert.equal(names("firefly").includes("lift"), false);
  assert.equal(names("firefly").includes("still"), false);
});

test("darner ethogram is Dart ultra (anax sit_hold + softs + freeze, not hawk/hover/still)", () => {
  assert.ok(names("darner").includes("anax"));
  assert.ok(names("darner").includes("hawking_soft"));
  assert.ok(names("darner").includes("tandem_soft"));
  assert.ok(names("darner").includes("nymph_soft"));
  assert.ok(names("darner").includes("whir_soft"));
  assert.ok(names("darner").includes("obelisk_soft"));
  assert.ok(names("darner").includes("ommatidia_soft"));
  assert.ok(names("darner").includes("freeze"));
  assert.equal(names("darner").includes("hawk"), false);
  assert.equal(names("darner").includes("hover"), false);
  assert.equal(names("darner").includes("still"), false);
});

test("ladybird ethogram is Seven ultra (coccinella sit_hold + softs + freeze, not count/hunt/still)", () => {
  assert.ok(names("ladybird").includes("coccinella"));
  assert.ok(names("ladybird").includes("spots_soft"));
  assert.ok(names("ladybird").includes("aphid_soft"));
  assert.ok(names("ladybird").includes("reflex_soft"));
  assert.ok(names("ladybird").includes("climb_soft"));
  assert.ok(names("ladybird").includes("pronotum_soft"));
  assert.ok(names("ladybird").includes("alar_soft"));
  assert.ok(names("ladybird").includes("freeze"));
  assert.equal(names("ladybird").includes("count"), false);
  assert.equal(names("ladybird").includes("hunt"), false);
  assert.equal(names("ladybird").includes("still"), false);
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
