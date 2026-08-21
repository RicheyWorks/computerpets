/**
 * Species-true specials. The desk and blotter already keep this sit.
 * The overlay used to idle after the first house and the snakes.
 * Ridge sits. Chirp sings. Wave waves. Comb stays Comb. It is not a shop.
 */
(function (root) {
  const PLAY = new Set([
    "ribbon", "steal", "trade", "snap", "spore", "pinch", "dabble", "drum",
    "flick", "sting", "spray", "squirt", "jet",
  ]);
  const WANDER = new Set([
    "thump", "loop", "slither", "patrol", "chart", "rise", "pulse", "soar",
    "drop", "waggle", "migrate", "hawk", "trail", "emerge", "thrum", "bore",
    "shine", "hum", "float", "edge", "align", "eft", "flare", "run", "hover",
    "leap", "prowl", "stem", "gale", "flag", "cache", "slide", "forage",
    "climb", "dash", "show", "lunge", "speck", "whisk", "penny", "bar",
    "lance", "night", "silver", "haste", "link", "hop", "thread", "scud",
    "wave", "pale", "thorn", "vault", "banner", "jewel", "lace", "click",
    "rob", "swing", "sail", "glide", "cilia", "reach", "spot", "roll",
    "spin", "tumble",
  ]);
  const TALK = new Set([
    "wheek", "echo", "quote", "bug", "bill", "reborn", "mimic", "inspect",
    "flush", "gape", "bloom", "flash", "count", "warn", "chord", "croak",
    "caw", "kronk", "hiss", "dee", "honk", "dewlap", "chirp", "boom",
  ]);
  const SIT = new Set([
    "still", "bask", "curl", "sun", "hoard", "ritual", "coil", "drape",
    "hold", "nest", "ink", "cling", "hitch", "molt", "carpet", "unfurl",
    "gold", "open", "store", "drown", "glue", "freeze", "fold", "seal",
    "cut", "pot", "dig", "lay", "fruit", "pit", "ridge", "zone", "tooth",
    "shelf", "share", "drink", "facet", "frost", "dim", "wake", "puff",
    "hide", "ring", "rasp", "siphon", "latch", "pane", "holdfast",
    "trumpet", "blush", "web", "hour", "clasp", "hang", "rinse", "lodge",
    "bristle", "shift", "levee", "shut", "crest", "spoon", "round",
    "armor", "cast", "tun", "half", "clamp", "cement", "mail", "spire",
    "token", "knurl", "heap", "blade", "forceps", "snout", "wrist",
    "gaze", "gum", "wreath", "paint", "scrape", "scrub", "tube", "veil",
    "gate",
  ]);

  /** Same verbs the desk already keeps in traits.ts. */
  const VERB = {
    red_panda: "Steal ribbon",
    cat: "Claim the sun",
    dog: "Heel",
    rabbit: "Thump",
    hamster: "Hoard",
    guinea_pig: "Wheek",
    turtle: "Be still",
    goldfish: "Loop",
    budgie: "Echo",
    fox: "Find a bug",
    penguin: "Bow",
    parrot: "Quote",
    ferret: "Steal",
    hedgehog: "Curl",
    chinchilla: "Dust bath",
    axolotl: "Regrow",
    toucan: "Inspect",
    iguana: "Bask",
    dragon: "Keep watch",
    phoenix: "Ember",
    ball_python: "Coil",
    corn_snake: "Thread",
    kingsnake: "Inspect",
    green_tree_python: "Drape",
    hognose: "Play dead",
    garter: "Patrol",
    boa: "Hold",
    milk_snake: "Mimic",
    rosy_boa: "Nest",
    carpet_python: "Chart",
    octopus: "Ink",
    cuttlefish: "Flush",
    nautilus: "Rise",
    moon_jelly: "Pulse",
    sea_star: "Cling",
    hermit_crab: "Trade",
    horseshoe_crab: "Molt",
    seahorse: "Hitch",
    manta: "Soar",
    moray: "Gape",
    moss: "Carpet",
    maidenhair: "Unfurl",
    ginkgo: "Gold",
    oak: "Drop",
    water_lily: "Open",
    orchid: "Bloom",
    saguaro: "Store",
    venus_flytrap: "Snap",
    pitcher: "Drown",
    sundew: "Glue",
    honeybee: "Waggle",
    monarch: "Migrate",
    luna: "Moon",
    firefly: "Flash",
    darner: "Hawk",
    stick: "Freeze",
    carpenter_ant: "Trail",
    ladybird: "Count",
    mantis: "Fold",
    cicada: "Emerge",
    bumblebee: "Thrum",
    carpenter_bee: "Bore",
    mason_bee: "Seal",
    leafcutter: "Cut",
    stingless: "Pot",
    sweat_bee: "Shine",
    mining_bee: "Dig",
    honey_drone: "Hum",
    honey_queen: "Lay",
    honeycomb: "Hold",
    oyster: "Fruit",
    fly_agaric: "Warn",
    morel: "Pit",
    chanterelle: "Ridge",
    turkey_tail: "Zone",
    lions_mane: "Tooth",
    puffball: "Puff",
    chicken_of_woods: "Shelf",
    yeast: "Rise",
    lichen: "Share",
    photovore: "Drink",
    choir: "Chord",
    nimbus: "Float",
    silica: "Facet",
    terminator: "Edge",
    nexus: "Count",
    halovore: "Frost",
    magneton: "Align",
    umbral: "Dim",
    cyst: "Wake",
    frog: "Croak",
    toad: "Puff",
    newt: "Eft",
    salamander: "Hide",
    caecilian: "Ring",
    crayfish: "Pinch",
    pond_snail: "Rasp",
    mussel: "Siphon",
    leech: "Latch",
    stickleback: "Flare",
    paramecium: "Cilia",
    amoeba: "Reach",
    euglena: "Spot",
    volvox: "Roll",
    diatom: "Pane",
    kelp: "Holdfast",
    chlamydomonas: "Spin",
    stentor: "Trumpet",
    coli: "Tumble",
    haloarchaea: "Blush",
    crow: "Caw",
    raven: "Croak",
    barn_owl: "Hiss",
    red_tail: "Soar",
    chickadee: "Dee",
    robin: "Hop",
    mallard: "Dabble",
    canada_goose: "Honk",
    pileated: "Drum",
    hummingbird: "Hover",
    orb_weaver: "Loom",
    jumping_spider: "Leap",
    wolf_spider: "Prowl",
    tarantula: "Flick",
    widow: "Hour",
    harvestman: "Stem",
    scorpion: "Sting",
    vinegaroon: "Spray",
    tick: "Clasp",
    solifuge: "Gale",
    deer: "Flag",
    bat: "Hang",
    squirrel: "Cache",
    otter: "Slide",
    raccoon: "Wash",
    skunk: "Warn",
    opossum: "Play dead",
    beaver: "Lodge",
    porcupine: "Bristle",
    black_bear: "Forage",
    gecko: "Climb",
    anole: "Flash",
    skink: "Dash",
    chameleon: "Shift",
    horned_lizard: "Squirt",
    alligator: "Bank",
    crocodile: "Show",
    snapper: "Snap",
    box_turtle: "Shut",
    tuatara: "Still",
    bass: "Lunge",
    brook_trout: "Speck",
    catfish: "Whisk",
    bluegill: "Penny",
    perch: "Bar",
    pike: "Lance",
    walleye: "Night",
    paddlefish: "Filter",
    lamprey: "Disk",
    american_eel: "Silver",
    house_centipede: "Hunt",
    millipede: "Oil",
    pillbug: "Roll",
    earthworm: "Cast",
    velvet_worm: "Jet",
    springtail: "Hop",
    tardigrade: "Tun",
    planarian: "Split",
    nematode: "Thrash",
    amphipod: "Scud",
    fiddler_crab: "Wave",
    ghost_crab: "Run",
    limpet: "Clamp",
    barnacle: "Stay",
    chiton: "Plate",
    periwinkle: "Rasp",
    sand_dollar: "Bury",
    sea_urchin: "Spine",
    knobbed_whelk: "Hunt",
    lugworm: "Heap",
    field_cricket: "Chirp",
    katydid: "Still",
    grasshopper: "Vault",
    swallowtail: "Banner",
    jewelwing: "Jewel",
    lacewing: "Lace",
    earwig: "Forceps",
    acorn_weevil: "Snout",
    click_beetle: "Click",
    robber_fly: "Rob",
    sloth: "Hang",
    lemur: "Sun",
    gibbon: "Swing",
    kinkajou: "Wrist",
    colugo: "Sail",
    flying_squirrel: "Glide",
    howler: "Boom",
    tarsier: "Gaze",
    potto: "Still",
    koala: "Gum",
    brain_coral: "Ridge",
    anemone: "Wreath",
    clownfish: "Paint",
    parrotfish: "Scrape",
    cleaner_shrimp: "Scrub",
    sea_cucumber: "Tube",
    lionfish: "Veil",
    giant_clam: "Gate",
    eagle_ray: "Soar",
    grouper: "Hide",
  };

  function clamp(n, a = 0, b = 100) {
    return Math.max(a, Math.min(b, Math.round(n)));
  }

  function commandFor(special) {
    if (PLAY.has(special)) return "play";
    if (special === "follow") return "wander";
    if (WANDER.has(special)) return "wander";
    if (TALK.has(special)) return "talk";
    if (SIT.has(special) || special === "playdead" || special === "bath") return "sit";
    if (special === "regrow") return "idle";
    return "idle";
  }

  function verbFor(key) {
    return VERB[key] || "Special";
  }

  /** Same care law as web/src/lib/pets/specials.ts and the blotter. */
  function applySpecial(stats, special) {
    const next = { ...stats, bond: clamp((stats.bond || 0) + 2) };
    if (PLAY.has(special)) {
      next.mood = clamp((next.mood || 0) + 8);
      return { stats: next, cmd: "play" };
    }
    if (special === "follow") {
      next.mood = clamp((next.mood || 0) + 4);
      return { stats: next, cmd: "wander" };
    }
    if (WANDER.has(special)) {
      return { stats: next, cmd: "wander" };
    }
    if (TALK.has(special)) {
      next.mood = clamp((next.mood || 0) + 8);
      return { stats: next, cmd: "talk" };
    }
    if (SIT.has(special)) {
      next.energy = clamp((next.energy || 0) + 6);
      next.mood = clamp((next.mood || 0) + 6);
      return { stats: next, cmd: "sit" };
    }
    if (special === "playdead") {
      next.energy = clamp((next.energy || 0) + 10);
      return { stats: next, cmd: "sit" };
    }
    if (special === "bath") {
      next.hygiene = clamp((next.hygiene || 0) + 40);
      next.mood = clamp((next.mood || 0) + 12);
      return { stats: next, cmd: "sit" };
    }
    if (special === "regrow") {
      next.health = clamp((next.health || 0) + 12);
      return { stats: next, cmd: "idle" };
    }
    return { stats: next, cmd: "idle" };
  }

  const api = {
    PLAY,
    WANDER,
    TALK,
    SIT,
    VERB,
    clamp,
    commandFor,
    verbFor,
    applySpecial,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetSpecial = api;
})(typeof window !== "undefined" ? window : globalThis);
