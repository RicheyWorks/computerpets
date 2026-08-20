/** Species-true idle acts — same map as web `ethogram.ts` and PyQt `ethogram.py`. */
(function (root) {
  const A = (name, motion, hold, weight, anim) =>
    anim ? { name, motion, hold, weight, anim } : { name, motion, hold, weight };
  const PREEN = [
    A("preen", "groom", 1.4, 3, "sit"),
    A("hop_step", "hop", 0.5, 2, "play"),
    A("wings", "pulse", 0.7, 1, "play"),
  ];
  const ETHOGRAM = {
    dog: [A("scratch", "scratch", 1.2, 3, "sit"), A("shake", "shake", 0.7, 2), A("yawn", "yawn", 1.1, 2), A("circle_sit", "circle", 1.6, 2, "sit")],
    cat: [A("groom", "groom", 1.6, 3, "sit"), A("scratch", "scratch", 1.1, 2, "sit"), A("yawn", "yawn", 1.2, 2), A("stretch", "stretch", 1.4, 2, "sit"), A("claim", "sit_hold", 2.2, 1, "sit")],
    fox: [A("stretch", "stretch", 1.3, 2, "sit"), A("yawn", "yawn", 1.1, 2), A("pounce", "hop", 0.7, 2, "play")],
    red_panda: [A("groom", "groom", 1.5, 3, "sit"), A("scratch", "scratch", 1.1, 2, "sit"), A("steal_dart", "dart", 1.2, 2), A("wash", "groom", 1.3, 2, "sit")],
    rabbit: [A("face_wash", "groom", 1.2, 3, "sit"), A("freeze", "freeze", 1.4, 2), A("flop", "sit_hold", 2.4, 2, "sit"), A("binky", "hop", 0.6, 1, "play")],
    hamster: [A("nibble", "eat", 1.1, 3, "eat"), A("groom", "groom", 1.2, 2, "sit"), A("freeze", "freeze", 1.0, 2), A("burst", "dart", 0.9, 2)],
    guinea_pig: [A("wheek", "talk", 0.8, 1, "talk"), A("popcorn", "hop", 0.45, 2, "play"), A("freeze", "freeze", 1.2, 2), A("groom", "groom", 1.3, 3, "sit")],
    ferret: [A("warble", "hop", 0.7, 3, "play"), A("tunnel", "sit_hold", 1.4, 2, "sit"), A("dook", "talk", 0.7, 1, "talk")],
    hedgehog: [A("snuffle", "wiggle", 1.0, 3), A("curl", "sit_hold", 1.8, 2, "sit"), A("unroll", "stretch", 1.2, 2)],
    chinchilla: [A("dust_shake", "shake", 0.9, 3, "sit"), A("hop", "hop", 0.55, 2, "play"), A("groom", "groom", 1.2, 2, "sit")],
    turtle: [A("bask", "sit_hold", 3.2, 3, "sit"), A("blink", "freeze", 1.6, 2)],
    iguana: [A("bask", "sit_hold", 3.0, 3, "sit"), A("head_bob", "bob", 1.4, 2), A("still", "freeze", 2.0, 2)],
    dragon: [A("watch", "sit_hold", 2.4, 3, "sit"), A("huff", "pulse", 0.8, 2), A("bask", "sit_hold", 2.8, 2, "sit")],
    axolotl: [A("gill", "bob", 1.4, 3), A("still", "freeze", 2.0, 2), A("gulp", "gulp", 0.7, 1)],
    budgie: PREEN,
    parrot: PREEN,
    toucan: PREEN,
    phoenix: PREEN,
    penguin: [A("preen", "groom", 1.4, 3, "sit"), A("nod", "nod", 0.7, 2, "sit"), A("huddle", "sit_hold", 2.0, 2, "sit")],
    goldfish: [A("gulp", "gulp", 0.6, 2), A("flare", "pulse", 0.7, 2)],
    ball_python: [A("tongue", "tongue", 0.7, 4), A("coil", "sit_hold", 2.8, 3, "sit"), A("hide_head", "sit_hold", 1.6, 2, "sit"), A("gape", "gape", 1.2, 1)],
    corn_snake: [A("tongue", "tongue", 0.7, 4), A("explore", "freeze", 1.2, 2), A("slither", "dart", 1.0, 2)],
    kingsnake: [A("tongue", "tongue", 0.7, 4), A("inspect", "freeze", 1.4, 3), A("still", "sit_hold", 1.8, 2, "sit")],
    green_tree_python: [A("tongue", "tongue", 0.7, 4), A("drape", "sit_hold", 2.6, 3, "sit")],
    hognose: [A("tongue", "tongue", 0.7, 4), A("flatten", "sit_hold", 1.4, 2, "sit"), A("playdead", "sit_hold", 1.8, 1, "sit"), A("gape", "gape", 1.1, 1)],
    garter: [A("tongue", "tongue", 0.7, 4), A("patrol", "wiggle", 0.8, 2), A("dart", "dart", 0.9, 2)],
    boa: [A("tongue", "tongue", 0.7, 3), A("hold", "sit_hold", 3.0, 3, "sit")],
    milk_snake: [A("tongue", "tongue", 0.7, 4), A("mimic", "freeze", 1.6, 2)],
    rosy_boa: [A("tongue", "tongue", 0.7, 3), A("nest", "sit_hold", 2.6, 3, "sit")],
    carpet_python: [A("tongue", "tongue", 0.7, 4), A("drape", "sit_hold", 2.2, 3, "sit")],
    octopus: [A("hide", "sit_hold", 2.0, 3, "sit"), A("jet", "dart", 0.8, 2), A("taste", "wiggle", 1.0, 2)],
    cuttlefish: [A("flush", "pulse", 0.9, 3), A("hover", "bob", 1.4, 2)],
    nautilus: [A("rise", "bob", 1.6, 3), A("still", "freeze", 2.0, 2)],
    moon_jelly: [A("pulse", "pulse", 1.2, 4), A("drift", "bob", 1.6, 2)],
    sea_star: [A("cling", "sit_hold", 2.8, 4, "sit"), A("still", "freeze", 2.2, 2)],
    hermit_crab: [A("inspect", "freeze", 1.2, 3), A("shuffle", "wiggle", 0.9, 2)],
    horseshoe_crab: [A("plow", "wiggle", 1.0, 2), A("still", "freeze", 2.0, 3)],
    seahorse: [A("hitch", "sit_hold", 2.4, 3, "sit"), A("hover", "bob", 1.4, 2)],
    manta: [A("soar", "pulse", 1.4, 3), A("glide", "bob", 1.8, 2)],
    moray: [A("gape", "gape", 1.2, 3), A("hide", "sit_hold", 2.2, 3, "sit"), A("dart", "dart", 0.8, 2)],
    moss: [A("lean", "lean", 1.8, 3), A("nod", "nod", 1.0, 2, "sit"), A("still", "freeze", 2.4, 2)],
    maidenhair: [A("unfurl", "unfurl", 1.8, 4, "sit"), A("lean", "lean", 1.4, 2), A("nod", "nod", 0.9, 1, "sit")],
    ginkgo: [A("lean", "lean", 1.6, 3), A("nod", "nod", 1.0, 2, "sit"), A("still", "freeze", 2.0, 2)],
    oak: [A("lean", "lean", 1.6, 3), A("nod", "nod", 1.1, 2, "sit"), A("still", "freeze", 2.2, 2)],
    water_lily: [A("open", "open", 1.8, 4, "sit"), A("nod", "nod", 1.0, 2, "sit"), A("lean", "lean", 1.2, 1)],
    orchid: [A("unfurl", "unfurl", 1.6, 2, "sit"), A("lean", "lean", 1.4, 3), A("nod", "nod", 0.9, 2, "sit")],
    saguaro: [A("still", "freeze", 2.8, 4), A("lean", "lean", 1.6, 2), A("nod", "nod", 1.2, 1, "sit")],
    venus_flytrap: [A("snap", "snap", 0.7, 2, "play"), A("lean", "lean", 1.4, 3), A("nod", "nod", 1.0, 2, "sit")],
    pitcher: [A("still", "freeze", 3.2, 5), A("lean", "lean", 1.6, 2), A("nod", "nod", 1.0, 1, "sit")],
    sundew: [A("curl", "curl", 2.0, 4, "sit"), A("lean", "lean", 1.4, 2), A("nod", "nod", 0.9, 1, "sit")],
    honeybee: [A("waggle", "waggle", 1.2, 4), A("dart", "dart", 0.8, 2), A("still", "freeze", 1.4, 1)],
    monarch: [A("flutter", "pulse", 1.0, 3), A("migrate", "dart", 1.2, 2), A("still", "freeze", 1.8, 2)],
    luna: [A("still", "freeze", 2.6, 5), A("drift", "bob", 1.6, 2), A("refuse", "freeze", 1.8, 1)],
    firefly: [A("flash", "flash", 0.8, 4), A("lift", "hop", 0.55, 2, "play"), A("still", "freeze", 1.6, 2)],
    darner: [A("hawk", "dart", 0.9, 4), A("hover", "bob", 1.4, 2), A("still", "freeze", 1.2, 1)],
    stick: [A("freeze", "freeze", 3.0, 6), A("still", "sit_hold", 2.4, 2, "sit"), A("walk", "wiggle", 0.8, 1)],
    carpenter_ant: [A("trail", "trail", 1.0, 4), A("dart", "dart", 0.8, 2), A("still", "freeze", 1.2, 1)],
    ladybird: [A("count", "nod", 1.0, 3, "sit"), A("hunt", "dart", 0.8, 2), A("still", "freeze", 1.6, 2)],
    mantis: [A("fold", "fold", 2.0, 4, "sit"), A("strike", "snap", 0.6, 1, "play"), A("still", "freeze", 2.0, 2)],
    cicada: [A("still", "sit_hold", 2.8, 5, "sit"), A("emerge", "emerge", 1.8, 1, "sit"), A("burst", "dart", 0.7, 2)],
    bumblebee: [A("thrum", "pulse", 1.2, 4), A("hover", "bob", 1.4, 2), A("still", "freeze", 1.6, 1)],
    carpenter_bee: [A("hover", "bob", 1.4, 3), A("bore", "sit_hold", 2.0, 3, "sit"), A("still", "freeze", 1.6, 2)],
    mason_bee: [A("seal", "sit_hold", 1.8, 4, "sit"), A("hover", "bob", 1.2, 2), A("still", "freeze", 1.6, 2)],
    leafcutter: [A("cut", "nod", 1.2, 4, "sit"), A("hover", "bob", 1.2, 2), A("still", "freeze", 1.6, 2)],
    stingless: [A("pot", "sit_hold", 1.8, 4, "sit"), A("hover", "bob", 1.2, 2), A("still", "freeze", 1.4, 2)],
    sweat_bee: [A("shine", "pulse", 1.0, 4), A("hover", "bob", 1.2, 2), A("still", "freeze", 1.4, 2)],
    mining_bee: [A("dig", "sit_hold", 1.8, 4, "sit"), A("hover", "bob", 1.2, 2), A("still", "freeze", 1.6, 2)],
    honey_drone: [A("hum", "pulse", 1.4, 4), A("hover", "bob", 1.6, 2), A("still", "freeze", 2.0, 3)],
    honey_queen: [A("lay", "sit_hold", 2.2, 5, "sit"), A("walk", "wiggle", 1.0, 1), A("still", "freeze", 2.0, 2)],
    honeycomb: [A("hold", "sit_hold", 2.8, 5, "sit"), A("brood", "freeze", 2.4, 3, "sit"), A("still", "freeze", 2.6, 3)],
    oyster: [A("lean", "lean", 1.8, 4), A("flush", "flush", 1.2, 2), A("still", "freeze", 2.2, 2)],
    fly_agaric: [A("lean", "lean", 1.6, 3), A("flush", "flush", 1.4, 3), A("still", "freeze", 2.0, 2)],
    morel: [A("lean", "lean", 1.6, 3), A("still", "sit_hold", 2.4, 3, "sit"), A("still_hold", "freeze", 2.0, 2)],
    chanterelle: [A("lean", "lean", 1.6, 3), A("flush", "flush", 1.2, 2), A("still", "freeze", 2.0, 2)],
    turkey_tail: [A("lean", "lean", 1.6, 3), A("still", "freeze", 2.4, 3), A("zone", "lean", 1.4, 2)],
    lions_mane: [A("lean", "lean", 1.6, 3), A("still", "freeze", 2.2, 3), A("beard", "sit_hold", 2.0, 2, "sit")],
    puffball: [A("puff", "puff", 0.8, 4, "play"), A("still", "freeze", 2.0, 3), A("lean", "lean", 1.4, 1)],
    chicken_of_woods: [A("lean", "lean", 1.6, 3), A("flush", "flush", 1.2, 2), A("still", "freeze", 2.2, 2)],
    yeast: [A("rise", "rise", 1.6, 5), A("still", "freeze", 2.0, 2), A("foam", "bob", 1.2, 1)],
    lichen: [A("share-still", "share", 2.8, 5, "sit"), A("still", "freeze", 2.4, 3), A("lean", "lean", 1.4, 1)],
    photovore: [A("drink-light", "drink", 1.4, 5), A("still", "freeze", 1.8, 2), A("hover", "bob", 1.2, 1)],
    choir: [A("chord-pulse", "chord", 1.6, 5), A("still", "freeze", 2.0, 2), A("overtone", "pulse", 1.2, 1)],
    nimbus: [A("float", "float", 1.8, 5), A("still", "freeze", 2.0, 2), A("hover", "bob", 1.4, 1)],
    silica: [A("facet", "facet", 2.2, 5, "sit"), A("still", "freeze", 2.4, 3), A("shed", "freeze", 1.6, 1)],
    terminator: [A("edge-walk", "edge", 1.4, 5), A("still", "freeze", 1.8, 2), A("rim", "trail", 1.0, 1)],
    nexus: [A("count-ripple", "ripple", 1.6, 5), A("still", "freeze", 2.0, 2), A("name", "pulse", 1.2, 1)],
    halovore: [A("frost", "frost", 1.8, 5, "sit"), A("still", "freeze", 2.2, 3), A("waste", "freeze", 1.4, 1)],
    magneton: [A("align", "align", 1.2, 5), A("still", "freeze", 1.6, 2), A("north", "stretch", 1.0, 1)],
    umbral: [A("dim", "dim", 2.4, 5, "sit"), A("still", "freeze", 2.6, 3), A("cool", "share", 1.8, 1)],
    cyst: [A("wake", "wake", 1.8, 4, "sit"), A("wait", "sit_hold", 3.2, 5, "sit"), A("still", "freeze", 2.8, 3)],
    frog: [A("hop", "hop", 0.55, 4, "play"), A("croak", "talk", 0.8, 3, "talk"), A("still", "freeze", 1.6, 2)],
    toad: [A("hop", "hop", 0.5, 3, "play"), A("puff", "puff", 1.2, 4, "sit"), A("still", "freeze", 1.8, 2)],
    newt: [A("walk", "wiggle", 1.0, 4), A("still", "freeze", 1.6, 2), A("dart", "dart", 0.8, 2)],
    salamander: [A("hide", "sit_hold", 2.2, 5, "sit"), A("still", "freeze", 2.0, 3), A("walk", "wiggle", 0.9, 1)],
    caecilian: [A("slip", "wiggle", 1.2, 5), A("ring", "sit_hold", 2.0, 3, "sit"), A("still", "freeze", 1.8, 2)],
    crayfish: [A("pinch", "snap", 0.7, 4, "play"), A("walk", "wiggle", 1.0, 3), A("still", "freeze", 1.6, 2)],
    pond_snail: [A("rasp", "nod", 1.4, 5, "sit"), A("still", "sit_hold", 2.4, 3, "sit"), A("lean", "lean", 1.2, 1)],
    mussel: [A("siphon", "open", 1.8, 5, "sit"), A("still", "sit_hold", 2.8, 4, "sit"), A("filter", "freeze", 2.2, 2)],
    leech: [A("latch", "sit_hold", 1.8, 4, "sit"), A("swim", "wiggle", 1.2, 3), A("still", "freeze", 1.6, 2)],
    stickleback: [A("flare", "pulse", 1.0, 4), A("dart", "dart", 0.8, 3), A("still", "freeze", 1.4, 2)],
    paramecium: [A("cilia", "wiggle", 1.0, 5), A("row", "dart", 0.8, 3), A("still", "freeze", 1.4, 2)],
    amoeba: [A("reach", "stretch", 1.6, 5, "sit"), A("foot", "sit_hold", 2.2, 3, "sit"), A("still", "freeze", 2.0, 2)],
    euglena: [A("spot", "bob", 1.2, 4), A("drink", "drink", 1.4, 3), A("still", "freeze", 1.6, 2)],
    volvox: [A("roll", "pulse", 1.4, 5), A("daughters", "ripple", 1.6, 2), A("still", "freeze", 1.8, 2)],
    diatom: [A("glide", "sit_hold", 2.0, 4, "sit"), A("pane", "facet", 1.8, 3, "sit"), A("still", "freeze", 2.2, 2)],
    kelp: [A("sway", "lean", 1.8, 5), A("holdfast", "sit_hold", 2.6, 3, "sit"), A("still", "freeze", 2.4, 2)],
    chlamydomonas: [A("spin", "pulse", 1.0, 5), A("oar", "dart", 0.8, 3), A("still", "freeze", 1.4, 2)],
    stentor: [A("trumpet", "open", 1.6, 5, "sit"), A("contract", "sit_hold", 1.8, 3, "sit"), A("still", "freeze", 1.8, 2)],
    coli: [A("tumble", "dart", 0.7, 5), A("run", "wiggle", 0.9, 3), A("still", "freeze", 1.2, 2)],
    haloarchaea: [A("blush", "frost", 1.8, 5, "sit"), A("still", "freeze", 2.2, 3), A("pink", "flush", 1.4, 1)],
    crow: [A("caw", "talk", 0.8, 4, "talk"), A("hop_step", "hop", 0.5, 3, "play"), A("preen", "groom", 1.4, 2, "sit")],
    raven: [A("kronk", "talk", 0.9, 4, "talk"), A("hop_step", "hop", 0.55, 3, "play"), A("preen", "groom", 1.4, 2, "sit")],
    barn_owl: [A("hiss", "talk", 0.8, 3, "talk"), A("swivel", "nod", 1.2, 3, "sit"), A("preen", "groom", 1.6, 2, "sit")],
    red_tail: [A("soar", "pulse", 1.4, 4), A("stoop", "dart", 0.8, 3), A("still", "freeze", 1.6, 2)],
    chickadee: [A("dee", "talk", 0.7, 4, "talk"), A("hop_step", "hop", 0.45, 3, "play"), A("preen", "groom", 1.2, 2, "sit")],
    robin: [A("hop", "hop", 0.5, 4, "play"), A("pull", "nod", 1.0, 3, "sit"), A("preen", "groom", 1.3, 2, "sit")],
    mallard: [A("dabble", "eat", 1.2, 4, "eat"), A("waddle", "wiggle", 1.0, 3), A("still", "freeze", 1.6, 2)],
    canada_goose: [A("honk", "talk", 0.8, 4, "talk"), A("walk", "wiggle", 1.0, 3), A("still", "freeze", 1.8, 2)],
    pileated: [A("drum", "snap", 0.7, 4, "play"), A("hop_step", "hop", 0.5, 3, "play"), A("preen", "groom", 1.4, 2, "sit")],
    hummingbird: [A("hover", "bob", 1.2, 5), A("dart", "dart", 0.7, 3), A("sip", "eat", 0.8, 2, "eat")],
    orb_weaver: [A("sit_web", "sit_hold", 2.4, 5, "sit"), A("still", "freeze", 2.0, 3), A("wrap", "nod", 1.2, 1)],
    jumping_spider: [A("leap", "hop", 0.5, 5, "play"), A("look", "nod", 1.0, 3, "sit"), A("still", "freeze", 1.4, 2)],
    wolf_spider: [A("prowl", "wiggle", 1.0, 4), A("carry", "sit_hold", 1.8, 3, "sit"), A("still", "freeze", 1.6, 2)],
    tarantula: [A("flick", "snap", 0.8, 3, "play"), A("walk", "wiggle", 1.2, 3), A("still", "sit_hold", 2.2, 3, "sit")],
    widow: [A("hang", "sit_hold", 2.4, 5, "sit"), A("still", "freeze", 2.2, 3), A("hour", "nod", 1.4, 1)],
    harvestman: [A("walk", "wiggle", 1.0, 5), A("stem", "nod", 1.2, 3), A("still", "freeze", 1.6, 2)],
    scorpion: [A("sting", "snap", 0.7, 3, "play"), A("walk", "wiggle", 1.0, 4), A("still", "freeze", 1.8, 2)],
    vinegaroon: [A("whip", "snap", 0.8, 3, "play"), A("walk", "wiggle", 1.0, 4), A("still", "freeze", 1.8, 2)],
    tick: [A("clasp", "sit_hold", 2.6, 5, "sit"), A("still", "freeze", 2.4, 3), A("wait", "nod", 1.8, 1)],
    solifuge: [A("run", "dart", 0.6, 5), A("bite", "snap", 0.7, 3, "play"), A("still", "freeze", 1.4, 2)],
    deer: [A("flag", "pulse", 0.8, 4), A("walk", "wiggle", 1.0, 3), A("still", "freeze", 1.6, 2)],
    bat: [A("hang", "sit_hold", 2.2, 5, "sit"), A("flutter", "pulse", 1.0, 3), A("still", "freeze", 1.6, 2)],
    squirrel: [A("bury", "nod", 1.2, 4, "sit"), A("hop", "hop", 0.5, 3, "play"), A("chatter", "talk", 0.7, 2, "talk")],
    otter: [A("slide", "wiggle", 1.2, 5), A("swim", "bob", 1.4, 3), A("groom", "groom", 1.2, 2, "sit")],
    raccoon: [A("rinse", "groom", 1.4, 5, "sit"), A("rummage", "nod", 1.0, 3, "sit"), A("still", "freeze", 1.6, 2)],
    skunk: [A("stamp", "nod", 0.8, 4, "sit"), A("raise", "pulse", 1.0, 3), A("still", "freeze", 1.8, 2)],
    opossum: [A("playdead", "sit_hold", 2.2, 5, "sit"), A("grin", "gape", 1.0, 2), A("walk", "wiggle", 1.0, 2)],
    beaver: [A("gnaw", "eat", 1.4, 5, "eat"), A("slap", "snap", 0.7, 2, "play"), A("sit", "sit_hold", 2.0, 3, "sit")],
    porcupine: [A("bristle", "puff", 1.4, 5, "sit"), A("climb", "wiggle", 1.0, 2), A("still", "freeze", 2.0, 3)],
    black_bear: [A("forage", "eat", 1.4, 4, "eat"), A("sit", "sit_hold", 2.2, 4, "sit"), A("huff", "pulse", 0.8, 2)],
    gecko: [A("climb", "wiggle", 1.0, 5), A("chirp", "talk", 0.7, 3, "talk"), A("cling", "sit_hold", 2.0, 2, "sit")],
    anole: [A("flash", "pulse", 0.8, 5), A("brown", "nod", 1.2, 2, "sit"), A("still", "freeze", 1.6, 2)],
    skink: [A("dash", "dart", 0.5, 5), A("tail", "pulse", 0.8, 3), A("still", "freeze", 1.4, 2)],
    chameleon: [A("aim", "nod", 1.6, 5, "sit"), A("walk", "wiggle", 1.8, 3), A("catch", "snap", 0.6, 2, "play")],
    horned_lizard: [A("crown", "sit_hold", 2.2, 5, "sit"), A("squirt", "pulse", 0.8, 2), A("still", "freeze", 2.0, 3)],
    alligator: [A("bask", "sit_hold", 2.4, 5, "sit"), A("bank", "freeze", 2.0, 3), A("close", "nod", 1.2, 2)],
    crocodile: [A("show", "gape", 1.2, 5), A("sit", "sit_hold", 2.2, 3, "sit"), A("still", "freeze", 1.8, 2)],
    snapper: [A("snap", "snap", 0.6, 5, "play"), A("sit", "sit_hold", 2.0, 3, "sit"), A("still", "freeze", 1.8, 2)],
    box_turtle: [A("shut", "sit_hold", 2.2, 5, "sit"), A("walk", "wiggle", 1.0, 3), A("still", "freeze", 1.8, 2)],
    tuatara: [A("still", "freeze", 2.6, 5), A("crest", "sit_hold", 2.2, 3, "sit"), A("watch", "nod", 1.6, 2)],
    bass: [A("lunge", "dart", 0.6, 5), A("sit", "sit_hold", 2.0, 3, "sit"), A("gape", "gape", 0.8, 2)],
    brook_trout: [A("dart", "dart", 0.5, 5), A("rise", "bob", 1.0, 3), A("still", "freeze", 1.6, 2)],
    catfish: [A("whisk", "wiggle", 1.2, 5), A("sit", "sit_hold", 2.0, 3, "sit"), A("still", "freeze", 1.8, 2)],
    bluegill: [A("flare", "pulse", 0.8, 5), A("sit", "sit_hold", 1.8, 3, "sit"), A("dart", "dart", 0.6, 2)],
    perch: [A("bar", "pulse", 0.8, 4), A("dart", "dart", 0.6, 4), A("still", "freeze", 1.6, 2)],
    pike: [A("wait", "sit_hold", 2.4, 5, "sit"), A("lance", "dart", 0.5, 3), A("still", "freeze", 2.0, 2)],
    walleye: [A("hunt", "dart", 0.8, 5), A("glow", "pulse", 1.2, 3), A("still", "freeze", 1.8, 2)],
    paddlefish: [A("filter", "sit_hold", 2.4, 5, "sit"), A("paddle", "bob", 1.6, 3), A("still", "freeze", 2.0, 2)],
    lamprey: [A("disk", "sit_hold", 2.2, 5, "sit"), A("cling", "freeze", 2.0, 3), A("still", "freeze", 1.8, 2)],
    american_eel: [A("swim", "wiggle", 1.4, 5), A("silver", "pulse", 1.0, 3), A("still", "freeze", 1.6, 2)],
    house_centipede: [A("hunt", "dart", 0.5, 5), A("walk", "wiggle", 0.8, 3), A("still", "freeze", 1.4, 2)],
    millipede: [A("walk", "wiggle", 1.6, 5), A("oil", "puff", 1.2, 3, "sit"), A("still", "freeze", 2.0, 2)],
    pillbug: [A("roll", "sit_hold", 2.2, 5, "sit"), A("walk", "wiggle", 1.0, 3), A("still", "freeze", 1.6, 2)],
    earthworm: [A("cast", "nod", 1.4, 5, "sit"), A("crawl", "wiggle", 1.2, 3), A("still", "freeze", 1.8, 2)],
    velvet_worm: [A("jet", "snap", 0.7, 4, "play"), A("walk", "wiggle", 1.0, 3), A("still", "freeze", 1.8, 2)],
    springtail: [A("hop", "hop", 0.5, 5, "play"), A("still", "freeze", 1.4, 3), A("walk", "wiggle", 0.8, 2)],
    tardigrade: [A("tun", "sit_hold", 2.4, 5, "sit"), A("walk", "wiggle", 1.2, 3), A("still", "freeze", 2.0, 2)],
    planarian: [A("split", "pulse", 1.2, 5), A("glide", "wiggle", 1.4, 3), A("still", "freeze", 1.8, 2)],
    nematode: [A("thrash", "wiggle", 1.0, 5), A("still", "freeze", 1.6, 3), A("sit", "sit_hold", 1.8, 2, "sit")],
    amphipod: [A("scud", "wiggle", 1.2, 5), A("dart", "dart", 0.6, 3), A("still", "freeze", 1.6, 2)],
    fiddler_crab: [A("wave", "pulse", 0.8, 5), A("walk", "wiggle", 1.0, 3), A("still", "freeze", 1.6, 2)],
    ghost_crab: [A("run", "dart", 0.5, 5), A("walk", "wiggle", 0.8, 3), A("still", "freeze", 1.4, 2)],
    limpet: [A("clamp", "sit_hold", 2.4, 5, "sit"), A("rasp", "nod", 1.2, 3), A("still", "freeze", 2.0, 2)],
    barnacle: [A("kick", "pulse", 1.0, 5), A("still", "freeze", 2.2, 4), A("sit", "sit_hold", 2.0, 2, "sit")],
    chiton: [A("graze", "wiggle", 1.2, 5), A("plate", "sit_hold", 1.8, 3, "sit"), A("still", "freeze", 1.8, 2)],
    periwinkle: [A("rasp", "nod", 1.4, 5), A("sit", "sit_hold", 1.8, 3, "sit"), A("still", "freeze", 1.8, 2)],
    sand_dollar: [A("bury", "sit_hold", 2.2, 5, "sit"), A("flat", "freeze", 2.0, 3), A("still", "freeze", 1.8, 2)],
    sea_urchin: [A("walk", "wiggle", 1.2, 5), A("spine", "pulse", 1.0, 3), A("still", "freeze", 1.8, 2)],
    knobbed_whelk: [A("hunt", "wiggle", 1.2, 5), A("sit", "sit_hold", 1.8, 3, "sit"), A("still", "freeze", 1.8, 2)],
    lugworm: [A("heap", "nod", 1.4, 5, "sit"), A("cast", "wiggle", 1.2, 3), A("still", "freeze", 1.8, 2)],
    field_cricket: [A("chirp", "talk", 0.8, 5, "talk"), A("walk", "wiggle", 1.0, 3), A("still", "freeze", 1.6, 2)],
    katydid: [A("still", "sit_hold", 2.4, 5, "sit"), A("blade", "freeze", 2.0, 3), A("walk", "wiggle", 0.9, 1)],
    grasshopper: [A("vault", "hop", 0.55, 5, "play"), A("walk", "wiggle", 1.0, 3), A("still", "freeze", 1.6, 2)],
    swallowtail: [A("banner", "pulse", 1.0, 4), A("flutter", "bob", 1.2, 3), A("still", "freeze", 1.8, 2)],
    jewelwing: [A("jewel", "pulse", 1.2, 4), A("hover", "bob", 1.4, 3), A("still", "freeze", 1.6, 2)],
    lacewing: [A("lace", "pulse", 1.0, 4), A("hover", "bob", 1.2, 3), A("still", "freeze", 1.6, 2)],
    earwig: [A("raise", "sit_hold", 1.8, 5, "sit"), A("walk", "wiggle", 1.0, 3), A("still", "freeze", 1.6, 2)],
    acorn_weevil: [A("drill", "sit_hold", 2.0, 5, "sit"), A("walk", "wiggle", 1.0, 3), A("still", "freeze", 1.8, 2)],
    click_beetle: [A("click", "pulse", 0.7, 5), A("walk", "wiggle", 1.0, 3), A("still", "freeze", 1.6, 2)],
    robber_fly: [A("hunt", "dart", 0.6, 5), A("perch", "sit_hold", 1.8, 3, "sit"), A("still", "freeze", 1.4, 2)],
    sloth: [A("hang", "sit_hold", 2.6, 5, "sit"), A("reach", "stretch", 1.6, 3, "sit"), A("still", "freeze", 2.2, 2)],
    lemur: [A("sun", "sit_hold", 2.2, 5, "sit"), A("flag", "pulse", 0.8, 3), A("walk", "wiggle", 1.0, 2)],
    gibbon: [A("swing", "pulse", 1.2, 5), A("song", "talk", 0.8, 3, "talk"), A("still", "freeze", 1.6, 2)],
    kinkajou: [A("wrap", "sit_hold", 2.0, 5, "sit"), A("lick", "eat", 1.2, 3, "eat"), A("still", "freeze", 1.6, 2)],
    colugo: [A("sail", "pulse", 1.4, 5), A("cling", "sit_hold", 2.2, 3, "sit"), A("still", "freeze", 1.8, 2)],
    flying_squirrel: [A("glide", "pulse", 1.2, 5), A("hop", "hop", 0.5, 3, "play"), A("still", "freeze", 1.6, 2)],
    howler: [A("boom", "talk", 0.9, 5, "talk"), A("sit", "sit_hold", 2.2, 3, "sit"), A("still", "freeze", 1.8, 2)],
    tarsier: [A("gaze", "nod", 1.4, 5, "sit"), A("leap", "hop", 0.5, 3, "play"), A("still", "freeze", 1.6, 2)],
    potto: [A("still", "freeze", 2.6, 5), A("cling", "sit_hold", 2.2, 3, "sit"), A("walk", "wiggle", 1.0, 1)],
    koala: [A("chew", "eat", 1.6, 5, "eat"), A("cling", "sit_hold", 2.4, 3, "sit"), A("still", "freeze", 2.0, 2)],
  };
  const TONGUE_KEYS = [
    "ball_python", "corn_snake", "kingsnake", "green_tree_python", "hognose",
    "garter", "boa", "milk_snake", "rosy_boa", "carpet_python",
  ];
  const SCRATCH_KEYS = ["dog", "cat", "red_panda"];

  function actsFor(key) {
    return (key && ETHOGRAM[key]) || [];
  }

  function pickAct(key) {
    const list = actsFor(key);
    if (!list.length) return null;
    let roll = Math.random() * list.reduce((sum, act) => sum + act.weight, 0);
    for (const act of list) {
      roll -= act.weight;
      if (roll <= 0) return act;
    }
    return list[list.length - 1] || null;
  }

  function nextActWait(wander, nocturnal, night) {
    let wait = 20 - Math.max(0, Math.min(1, wander)) * 12;
    if (wander < 0.18) wait += 8;
    if (nocturnal && night) wait *= 0.7;
    if (nocturnal && !night) wait *= 1.22;
    return Math.max(8, wait) * (0.85 + Math.random() * 0.35);
  }

  function afterSettleWait(wander) {
    const late = wander < 0.18;
    return (late ? 6 : 3) + Math.random() * (late ? 5 : 4);
  }

  function tongueFlick(t, hold) {
    if (t < 0 || t > hold) return 0;
    const cycle = 0.22;
    const n = Math.floor(t / cycle);
    if (n >= 3) return 0;
    const u = (t % cycle) / cycle;
    return u < 0.55 ? 1 - u / 0.55 : 0;
  }

  function actPose(motion, t, hold) {
    const u = hold > 0 ? Math.max(0, Math.min(1, t / hold)) : 1;
    const pose = { dx: 0, dy: 0, rot: 0, stretch: 1, squat: 1 };
    if (!motion) return pose;
    if (motion === "scratch") {
      pose.dx = Math.sin(t * 28) * 2.2;
      pose.rot = Math.sin(t * 28) * 3.2;
    } else if (motion === "shake") pose.dx = Math.sin(t * 40) * 3.4;
    else if (motion === "yawn") {
      pose.stretch = 1 + Math.sin(u * Math.PI) * 0.08;
      pose.squat = 2 - pose.stretch;
    } else if (motion === "groom") {
      pose.dy = Math.sin(t * 10) * 3;
      pose.stretch = 1 + Math.sin(t * 10) * 0.02;
    } else if (motion === "stretch") {
      pose.stretch = 1 + Math.sin(u * Math.PI) * 0.1;
      pose.squat = 1 - Math.sin(u * Math.PI) * 0.05;
    } else if (motion === "wiggle") pose.dx = Math.sin(t * 16) * 2;
    else if (motion === "bob") pose.dy = Math.sin(t * 8) * 4;
    else if (motion === "pulse") {
      pose.stretch = 1 + Math.sin(u * Math.PI * 2) * 0.05;
      pose.squat = 2 - pose.stretch;
    } else if (motion === "gape") {
      pose.stretch = 1 + Math.sin(u * Math.PI) * 0.07;
      pose.squat = 2 - pose.stretch;
    } else if (motion === "gulp") {
      pose.dy = Math.sin(u * Math.PI) * 5;
      pose.stretch = 1 + Math.sin(u * Math.PI) * 0.04;
    }     else if (motion === "nod") {
      pose.dy = -Math.sin(u * Math.PI) * 6;
      pose.stretch = 1 - Math.sin(u * Math.PI) * 0.04;
    } else if (motion === "lean") {
      pose.rot = Math.sin(u * Math.PI) * 8;
      pose.dx = Math.sin(u * Math.PI) * 4;
    } else if (motion === "unfurl") {
      pose.stretch = 0.88 + Math.sin(u * Math.PI) * 0.16;
      pose.squat = 2 - pose.stretch;
    } else if (motion === "snap") {
      pose.stretch = 1 - Math.sin(u * Math.PI) * 0.12;
      pose.squat = 2 - pose.stretch;
      pose.dy = Math.sin(u * Math.PI) * 3;
    } else if (motion === "open") {
      pose.stretch = 1 + Math.sin(u * Math.PI) * 0.1;
      pose.squat = 2 - pose.stretch;
    } else if (motion === "curl") {
      pose.rot = Math.sin(u * Math.PI) * 6;
      pose.stretch = 1 - Math.sin(u * Math.PI) * 0.08;
      pose.squat = 2 - pose.stretch;
    } else if (motion === "waggle") {
      pose.dx = Math.sin(t * 22) * 3.2;
      pose.rot = Math.sin(t * 22) * 10;
    } else if (motion === "flash") {
      pose.stretch = 1 + Math.sin(u * Math.PI * 2) * 0.07;
      pose.squat = 2 - pose.stretch;
      pose.dy = -Math.sin(u * Math.PI) * 5;
    } else if (motion === "fold") {
      pose.stretch = 1 - Math.sin(u * Math.PI) * 0.06;
      pose.squat = 2 - pose.stretch;
      pose.dy = Math.sin(u * Math.PI) * 2;
    } else if (motion === "trail") {
      pose.dx = Math.sin(t * 14) * 2.4;
      pose.dy = Math.sin(t * 28) * 1.2;
    } else if (motion === "emerge") {
      pose.stretch = 0.9 + Math.sin(u * Math.PI) * 0.18;
      pose.squat = 2 - pose.stretch;
      pose.dy = -Math.sin(u * Math.PI) * 4;
    } else if (motion === "puff") {
      pose.stretch = 1 + Math.sin(u * Math.PI) * 0.14;
      pose.squat = 2 - pose.stretch;
      pose.dy = -Math.sin(u * Math.PI) * 6;
    } else if (motion === "flush") {
      pose.stretch = 1 + Math.sin(u * Math.PI * 2) * 0.06;
      pose.squat = 2 - pose.stretch;
      pose.rot = Math.sin(u * Math.PI) * 3;
    } else if (motion === "rise") {
      pose.dy = -Math.sin(u * Math.PI) * 8;
      pose.stretch = 1 + Math.sin(u * Math.PI) * 0.08;
      pose.squat = 2 - pose.stretch;
    } else if (motion === "share") {
      pose.dx = Math.sin(u * Math.PI) * 1.2;
      pose.rot = Math.sin(u * Math.PI) * 2;
    } else if (motion === "drink") {
      pose.dy = -Math.sin(u * Math.PI) * 6;
      pose.stretch = 1 + Math.sin(u * Math.PI) * 0.07;
      pose.squat = 2 - pose.stretch;
    } else if (motion === "chord") {
      pose.stretch = 1 + Math.sin(u * Math.PI * 3) * 0.06;
      pose.squat = 2 - pose.stretch;
      pose.dx = Math.sin(t * 10) * 1.4;
    } else if (motion === "float") {
      pose.dy = Math.sin(t * 6) * 5;
      pose.dx = Math.sin(t * 3) * 2;
    } else if (motion === "facet") {
      pose.rot = Math.sin(u * Math.PI) * 4;
      pose.stretch = 1 + Math.sin(u * Math.PI) * 0.05;
    } else if (motion === "edge") {
      pose.dx = Math.sin(t * 12) * 3.2;
      pose.dy = Math.sin(t * 24) * 0.8;
    } else if (motion === "ripple") {
      pose.stretch = 1 + Math.sin(u * Math.PI * 3) * 0.05;
      pose.dx = Math.sin(u * Math.PI * 2) * 2.4;
    } else if (motion === "frost") {
      pose.stretch = 1 - Math.sin(u * Math.PI) * 0.04;
      pose.squat = 2 - pose.stretch;
      pose.dy = Math.sin(u * Math.PI) * 2;
    } else if (motion === "align") {
      pose.stretch = 1 + Math.sin(u * Math.PI) * 0.1;
      pose.dx = Math.sin(u * Math.PI) * 6;
    } else if (motion === "dim") {
      pose.dy = Math.sin(u * Math.PI) * 2;
      pose.rot = Math.sin(u * Math.PI) * 2;
    } else if (motion === "wake") {
      pose.stretch = 0.88 + Math.sin(u * Math.PI) * 0.2;
      pose.squat = 2 - pose.stretch;
      pose.dy = -Math.sin(u * Math.PI) * 5;
    }
    return pose;
  }

  const api = {
    ETHOGRAM,
    TONGUE_KEYS,
    SCRATCH_KEYS,
    actsFor,
    pickAct,
    nextActWait,
    afterSettleWait,
    tongueFlick,
    actPose,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetEthogram = api;
})(typeof window !== "undefined" ? window : globalThis);
