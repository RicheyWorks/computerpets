/** Species-true house clips and footstep picks. */
(function (root) {
  const VOICE_KEYS = ["red_panda", "hummingbird", "cat", "dog", "chickadee"];
  const SPECIES_KEYS = [
  "red_panda", "cat", "dog", "rabbit", "hamster", "guinea_pig", "turtle", "goldfish",
  "budgie", "fox", "penguin", "parrot", "ferret", "hedgehog", "chinchilla", "axolotl",
  "toucan", "iguana", "dragon", "phoenix", "ball_python", "corn_snake", "kingsnake",
  "green_tree_python", "hognose", "garter", "boa", "milk_snake", "rosy_boa",
  "carpet_python", "octopus", "cuttlefish", "nautilus", "moon_jelly", "sea_star",
  "hermit_crab", "horseshoe_crab", "seahorse", "manta", "moray", "moss", "maidenhair",
  "ginkgo", "oak", "water_lily", "orchid", "saguaro", "venus_flytrap", "pitcher",
  "sundew", "honeybee", "monarch", "luna", "firefly", "darner", "stick", "carpenter_ant",
  "ladybird", "mantis", "cicada", "bumblebee", "carpenter_bee", "mason_bee",
  "leafcutter", "stingless", "sweat_bee", "mining_bee", "honey_drone", "honey_queen",
  "honeycomb", "oyster", "fly_agaric", "morel", "chanterelle", "turkey_tail",
  "lions_mane", "puffball", "chicken_of_woods", "yeast", "lichen", "photovore", "choir",
  "nimbus", "silica", "terminator", "nexus", "halovore", "magneton", "umbral", "cyst",
  "frog", "toad", "newt", "salamander", "caecilian", "crayfish", "pond_snail", "mussel",
  "leech", "stickleback", "paramecium", "amoeba", "euglena", "volvox", "diatom", "kelp",
  "chlamydomonas", "stentor", "coli", "haloarchaea", "crow", "raven", "barn_owl",
  "red_tail", "chickadee", "robin", "mallard", "canada_goose", "pileated", "hummingbird",
  "orb_weaver", "jumping_spider", "wolf_spider", "tarantula", "widow", "harvestman",
  "scorpion", "vinegaroon", "tick", "solifuge", "deer", "bat", "squirrel", "otter",
  "raccoon", "skunk", "opossum", "beaver", "porcupine", "black_bear", "capybara", "gecko", "anole",
  "skink", "chameleon", "horned_lizard", "alligator", "crocodile", "snapper",
  "box_turtle", "tuatara", "bass", "brook_trout", "catfish", "bluegill", "perch", "pike",
  "walleye", "paddlefish", "lamprey", "american_eel", "house_centipede", "millipede",
  "pillbug", "earthworm", "velvet_worm", "springtail", "tardigrade", "planarian",
  "nematode", "amphipod", "fiddler_crab", "ghost_crab", "limpet", "barnacle", "chiton",
  "periwinkle", "sand_dollar", "sea_urchin", "knobbed_whelk", "lugworm", "field_cricket",
  "katydid", "grasshopper", "swallowtail", "jewelwing", "lacewing", "earwig",
  "acorn_weevil", "click_beetle", "robber_fly", "sloth", "lemur", "gibbon", "kinkajou",
  "colugo", "flying_squirrel", "howler", "tarsier", "potto", "koala", "brain_coral",
  "anemone", "clownfish", "parrotfish", "cleaner_shrimp", "sea_cucumber", "lionfish",
  "giant_clam", "eagle_ray", "grouper", "cyber_dragon", "volt_dragon", "trace_dragon",
  "flux_dragon", "spark_dragon", "ion_dragon", "gauss_dragon", "relay_dragon",
  "fuse_dragon", "ground_dragon"
  ];
  const SPECIES_SET = Object.create(null);
  for (let i = 0; i < SPECIES_KEYS.length; i++) SPECIES_SET[SPECIES_KEYS[i]] = true;
  const STEP_KINDS = ["species", "soft", "tap", "claw", "wood", "mute"];
  const STEP_LABELS = {
    species: "Species",
    soft: "Soft pad",
    tap: "Tap",
    claw: "Claw",
    wood: "Wood",
    mute: "Mute",
  };
  const SOUND_LICENSE =
    "Cries may be Grok Imagine extracts (house-sat). Short, loop-safe. Not CC0 zoo tapes. Five house-synth cries remain until replaced.";

  function isVoiceKey(key) {
    return !!key && SPECIES_SET[key] === true;
  }

  function parseStep(raw) {
    return STEP_KINDS.indexOf(String(raw)) >= 0 ? raw : "species";
  }

  function stepDefault(key) {
    if (key === "red_panda" || key === "cat" || key === "fox") return "soft";
    if (key === "dog") return "tap";
    if (
      key === "hummingbird" ||
      key === "chickadee" ||
      key === "crow" ||
      key === "raven" ||
      key === "robin" ||
      key === "budgie" ||
      key === "parrot" ||
      key === "toucan" ||
      key === "phoenix" ||
      key === "barn_owl" ||
      key === "red_tail" ||
      key === "pileated" ||
      key === "mallard" ||
      key === "canada_goose"
    )
      return "claw";
    if (key === "turtle" || key === "hedgehog" || key === "armadillo") return "wood";
    return "tap";
  }

  function stepOf(houseKind, guestKind, key) {
    const guest = parseStep(guestKind);
    if (guest !== "species" && String(guestKind || "")) return guest;
    const house = parseStep(houseKind);
    if (house !== "species") return house;
    return stepDefault(key);
  }

  function voiceSrc(key) {
    return isVoiceKey(key) ? "/sounds/" + key + ".wav" : "";
  }

  function overlayVoiceSrc(key) {
    return isVoiceKey(key) ? "sounds/" + key + ".wav" : "";
  }

  function stepSrc(kind, key) {
    const resolved = kind === "species" ? stepDefault(key) : kind;
    if (resolved === "mute") return "";
    return "/sounds/step-" + resolved + ".wav";
  }

  function overlayStepSrc(kind, key) {
    const resolved = kind === "species" ? stepDefault(key) : kind;
    if (resolved === "mute") return "";
    return "sounds/step-" + resolved + ".wav";
  }

  const api = {
    VOICE_KEYS,
    SPECIES_KEYS,
    STEP_KINDS,
    STEP_LABELS,
    SOUND_LICENSE,
    isVoiceKey,
    parseStep,
    stepDefault,
    stepOf,
    voiceSrc,
    overlayVoiceSrc,
    stepSrc,
    overlayStepSrc,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetHouseSounds = api;
})(typeof window !== "undefined" ? window : globalThis);