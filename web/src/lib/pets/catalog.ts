export type Rarity = "COMMON" | "UNCOMMON" | "RARE" | "LEGENDARY";

export type Species = {
  key: string;
  displayName: string;
  rarity: Rarity;
  temperament: string;
  habitat: string;
  blurb: string;
};

/** Wire catalog — keys match RicheyWorks/computerpets `PetType`. */
export const SPECIES: Species[] = [
  { key: "red_panda", displayName: "Red Panda", rarity: "COMMON", temperament: "Curious", habitat: "Study rafters", blurb: "The house default. Climbs bookshelves and steals ribbon." },
  { key: "cat", displayName: "Cat", rarity: "COMMON", temperament: "Aloof", habitat: "Window ledge", blurb: "Judges your code reviews from a sun-warmed cushion." },
  { key: "dog", displayName: "Dog", rarity: "COMMON", temperament: "Loyal", habitat: "Hearth rug", blurb: "Follows the cursor. Believes every compile is a walk." },
  { key: "rabbit", displayName: "Rabbit", rarity: "COMMON", temperament: "Timid", habitat: "Under-desk warren", blurb: "Thumps when the linter fails. Soft, then gone." },
  { key: "hamster", displayName: "Hamster", rarity: "COMMON", temperament: "Busy", habitat: "Drawer nest", blurb: "Hoards paperclips. Runs the night shift." },
  { key: "guinea_pig", displayName: "Guinea Pig", rarity: "COMMON", temperament: "Sociable", habitat: "Lettuce bowl", blurb: "Wheeks at deploy time. Requires salad diplomacy." },
  { key: "turtle", displayName: "Turtle", rarity: "COMMON", temperament: "Patient", habitat: "Inkstone dish", blurb: "Older than your repo. Will outlive the framework." },
  { key: "goldfish", displayName: "Goldfish", rarity: "COMMON", temperament: "Serene", habitat: "Brass bowl", blurb: "Circles the same thought. Very honest about it." },
  { key: "budgie", displayName: "Budgie", rarity: "COMMON", temperament: "Chatty", habitat: "Lamp shade", blurb: "Repeats error messages in a nicer voice." },
  { key: "fox", displayName: "Fox", rarity: "UNCOMMON", temperament: "Clever", habitat: "Coat closet", blurb: "Finds bugs you meant to hide. Smug about it." },
  { key: "penguin", displayName: "Penguin", rarity: "UNCOMMON", temperament: "Formal", habitat: "Cold tile", blurb: "Wears the house dress code. Approves of rituals." },
  { key: "parrot", displayName: "Parrot", rarity: "UNCOMMON", temperament: "Theatrical", habitat: "Hat stand", blurb: "Quotes your commit messages back at you." },
  { key: "ferret", displayName: "Ferret", rarity: "UNCOMMON", temperament: "Mischief", habitat: "Cable run", blurb: "Steals dongles. Returns them rearranged." },
  { key: "hedgehog", displayName: "Hedgehog", rarity: "UNCOMMON", temperament: "Guarded", habitat: "Knit basket", blurb: "Uncurls only for people who wait." },
  { key: "chinchilla", displayName: "Chinchilla", rarity: "UNCOMMON", temperament: "Fastidious", habitat: "Dust bath", blurb: "Will not sit on a messy desk. Correct." },
  { key: "axolotl", displayName: "Axolotl", rarity: "RARE", temperament: "Dreamy", habitat: "Glass cistern", blurb: "Regrows patience. Stares through the glass like a monk." },
  { key: "toucan", displayName: "Toucan", rarity: "RARE", temperament: "Bold", habitat: "High shelf", blurb: "The bill arrives first. The bird follows." },
  { key: "iguana", displayName: "Iguana", rarity: "RARE", temperament: "Still", habitat: "South wall", blurb: "A living ornament. Moves once per meeting." },
  { key: "dragon", displayName: "Dragon", rarity: "LEGENDARY", temperament: "Proud", habitat: "Mantel", blurb: "Small enough for a desk. Large enough for the room." },
  { key: "phoenix", displayName: "Phoenix", rarity: "LEGENDARY", temperament: "Unhurried", habitat: "Hearth ash", blurb: "Burns down and comes back kinder. The house relic." },
  { key: "ball_python", displayName: "Ball Python", rarity: "COMMON", temperament: "Shy", habitat: "Inkwell coil", blurb: "Makes a bun of herself and guards the inkwell." },
  { key: "corn_snake", displayName: "Corn Snake", rarity: "COMMON", temperament: "Curious", habitat: "Pencil tray", blurb: "Threads the blotter like a sentence you meant to finish." },
  { key: "kingsnake", displayName: "California Kingsnake", rarity: "UNCOMMON", temperament: "Bold", habitat: "Ruler drawer", blurb: "Wears the house in bands. Inspects other snakes for sport." },
  { key: "green_tree_python", displayName: "Green Tree Python", rarity: "RARE", temperament: "Still", habitat: "Lamp arm", blurb: "Sleeps in a saddle on the lamp arm. Emerald on purpose." },
  { key: "hognose", displayName: "Western Hognose", rarity: "UNCOMMON", temperament: "Dramatic", habitat: "Eraser dish", blurb: "Plays dead when the compile fails. Then gets hungry." },
  { key: "garter", displayName: "Common Garter", rarity: "COMMON", temperament: "Busy", habitat: "Moss cup", blurb: "Patrols the moss cup. Small, striped, always on a route." },
  { key: "boa", displayName: "Boa Constrictor", rarity: "RARE", temperament: "Steady", habitat: "Blotter river", blurb: "Holds the blotter the way a river holds a stone." },
  { key: "milk_snake", displayName: "Pueblo Milk Snake", rarity: "UNCOMMON", temperament: "Witty", habitat: "Stamp box", blurb: "Wears a warning she does not mean. Then asks for an egg." },
  { key: "rosy_boa", displayName: "Rosy Boa", rarity: "UNCOMMON", temperament: "Gentle", habitat: "Warm corner", blurb: "Nests in the warm corner and refuses to hurry." },
  { key: "carpet_python", displayName: "Jungle Carpet Python", rarity: "RARE", temperament: "Keen", habitat: "Map shelf", blurb: "Yellow and black cartography. Claims the shelf as a jungle." },
  { key: "octopus", displayName: "Common Octopus", rarity: "UNCOMMON", temperament: "Clever", habitat: "Teacup hide", blurb: "Tastes the blotter with an arm, then hides in a cup." },
  { key: "cuttlefish", displayName: "Common Cuttlefish", rarity: "UNCOMMON", temperament: "Flicker", habitat: "Lamp ripple", blurb: "Chromatophores rewrite the blotter. W-arms, then a hover." },
  { key: "nautilus", displayName: "Chambered Nautilus", rarity: "RARE", temperament: "Ancient", habitat: "Paperweight", blurb: "Rises by gas and memory. Tentacle fringe, then a hover." },
  { key: "moon_jelly", displayName: "Moon Jelly", rarity: "COMMON", temperament: "Vacant", habitat: "Glass of water", blurb: "No brain. Four moons in the bell. Still a guest." },
  { key: "sea_star", displayName: "Ochre Sea Star", rarity: "COMMON", temperament: "Still", habitat: "Damp blotter", blurb: "Everts a stomach and calls it lunch. Not a fish." },
  { key: "hermit_crab", displayName: "Common Hermit", rarity: "COMMON", temperament: "Fussy", habitat: "Stamp lid", blurb: "Tries the inkwell cap, the stamp box, your thimble." },
  { key: "horseshoe_crab", displayName: "Atlantic Horseshoe Crab", rarity: "UNCOMMON", temperament: "Patient", habitat: "Sand tray", blurb: "Book-gills, a telson, blue blood. A living fossil on the sand." },
  { key: "seahorse", displayName: "Lined Seahorse", rarity: "UNCOMMON", temperament: "Upright", habitat: "Pencil hitch", blurb: "Hovers like a question mark. Tail-wraps the pencil. Broods." },
  { key: "manta", displayName: "Reef Manta", rarity: "RARE", temperament: "Soaring", habitat: "Sky of the bowl", blurb: "Filters the lamp-light. Barrels when the compile is kind." },
  { key: "moray", displayName: "Green Moray", rarity: "RARE", temperament: "Watchful", habitat: "Book crevice", blurb: "Hides in a crevice. The mouth is not a yawn." },
  { key: "moss", displayName: "Sheet Moss", rarity: "COMMON", temperament: "Patient", habitat: "Blotter felt", blurb: "Carpets the blotter. No flowers. No true roots. Still a guest." },
  { key: "maidenhair", displayName: "Maidenhair Fern", rarity: "UNCOMMON", temperament: "Shy", habitat: "Damp saucer", blurb: "Unfurls black-stemmed fans. Not a flowering plant." },
  { key: "ginkgo", displayName: "Ginkgo", rarity: "RARE", temperament: "Ancient", habitat: "Lamp gold", blurb: "Fan leaves. Gold in the autumn of the desk. Not a flowering plant." },
  { key: "oak", displayName: "White Oak", rarity: "COMMON", temperament: "Steady", habitat: "Acorn dish", blurb: "A white oak seedling. Drops an acorn when the compile is kind." },
  { key: "water_lily", displayName: "Fragrant Water Lily", rarity: "UNCOMMON", temperament: "Serene", habitat: "Ink dish", blurb: "Floats the ink dish. Opens when the lamp is kind." },
  { key: "orchid", displayName: "Moth Orchid", rarity: "RARE", temperament: "Showy", habitat: "Bark mount", blurb: "Phalaenopsis. Roots in the air. Blooms like a moth that stayed." },
  { key: "saguaro", displayName: "Saguaro", rarity: "RARE", temperament: "Still", habitat: "Sand tray", blurb: "Stores the rain. A cactus, not a tree with opinions." },
  { key: "venus_flytrap", displayName: "Venus Flytrap", rarity: "UNCOMMON", temperament: "Watchful", habitat: "Wetland cup", blurb: "A wetland plant. Not a monster. Snaps when the hairs agree." },
  { key: "pitcher", displayName: "Purple Pitcher Plant", rarity: "UNCOMMON", temperament: "Patient", habitat: "Bog cup", blurb: "A leaf that became a well. Drowns. Not a flytrap with a cup glued on." },
  { key: "sundew", displayName: "Round-leaved Sundew", rarity: "UNCOMMON", temperament: "Slow", habitat: "Peat saucer", blurb: "Tentacles, mucilage, a slow curl. Glue. Not a flytrap." },
  { key: "honeybee", displayName: "Western Honey Bee", rarity: "COMMON", temperament: "Busy", habitat: "Wax dish", blurb: "Waggles the blotter. The dance is a map, not a mood." },
  { key: "monarch", displayName: "Monarch", rarity: "UNCOMMON", temperament: "Steadfast", habitat: "Milkweed cup", blurb: "Milkweed first. The orange is a warning she earned." },
  { key: "luna", displayName: "Luna Moth", rarity: "RARE", temperament: "Brief", habitat: "Lamp dusk", blurb: "The adult has no mouth. One week. She does not eat." },
  { key: "firefly", displayName: "Common Eastern Firefly", rarity: "UNCOMMON", temperament: "Signaling", habitat: "Ink dusk", blurb: "A beetle, not a fly. The flash is a sentence." },
  { key: "darner", displayName: "Common Green Darner", rarity: "UNCOMMON", temperament: "Hunting", habitat: "Lamp air", blurb: "The nymph is a different animal in the water. The adult hawks the lamp." },
  { key: "stick", displayName: "Common Walkingstick", rarity: "COMMON", temperament: "Still", habitat: "Pencil tray", blurb: "A stick that agreed to be an insect. Freezes first." },
  { key: "carpenter_ant", displayName: "Black Carpenter Ant", rarity: "COMMON", temperament: "Orderly", habitat: "Wood grain", blurb: "She does not eat the house. She nests in it." },
  { key: "ladybird", displayName: "Seven-spot Ladybird", rarity: "COMMON", temperament: "Tidy", habitat: "Leaf dish", blurb: "Seven spots. She eats aphids. A beetle, not a rumor." },
  { key: "mantis", displayName: "Chinese Mantis", rarity: "UNCOMMON", temperament: "Watchful", habitat: "Blotter stem", blurb: "An insect that hunts. She is not a plant." },
  { key: "cicada", displayName: "Periodical Cicada", rarity: "RARE", temperament: "Patient", habitat: "Inkstone", blurb: "Seventeen years underground. Then she sings." },
  { key: "oyster", displayName: "Oyster Mushroom", rarity: "COMMON", temperament: "Quiet", habitat: "Dead-wood shelf", blurb: "A shelf that eats the dead wood. A decomposer, not a plant." },
  { key: "fly_agaric", displayName: "Fly Agaric", rarity: "UNCOMMON", temperament: "Plain", habitat: "Moss cup", blurb: "White gills, a skirt, a volva. A warning, not lunch." },
  { key: "morel", displayName: "American Morel", rarity: "RARE", temperament: "Seasonal", habitat: "Leaf mold", blurb: "A hollow honeycomb. Not a false morel." },
  { key: "chanterelle", displayName: "Golden Chanterelle", rarity: "UNCOMMON", temperament: "Fragrant", habitat: "Moss rim", blurb: "False gills that fork. Not the jack-o’-lantern." },
  { key: "turkey_tail", displayName: "Turkey Tail", rarity: "COMMON", temperament: "Zoned", habitat: "Wood grain", blurb: "Thin, zoned, pores not gills. A bracket, not a turkey." },
  { key: "lions_mane", displayName: "Lion's Mane", rarity: "UNCOMMON", temperament: "Bearded", habitat: "Wound in wood", blurb: "Teeth, not gills. A beard on a wound in the wood." },
  { key: "puffball", displayName: "Common Puffball", rarity: "COMMON", temperament: "Brief", habitat: "Duff dish", blurb: "A puff, then a cloud. Cut a young one. An Amanita can hide." },
  { key: "chicken_of_woods", displayName: "Chicken of the Woods", rarity: "UNCOMMON", temperament: "Sulfur", habitat: "Oak shelf", blurb: "Sulfur shelves on oak. Not a chicken." },
  { key: "yeast", displayName: "Baker's Yeast", rarity: "COMMON", temperament: "Busy", habitat: "Bread crock", blurb: "A fungus you cannot see until the bread. The house already knows bread." },
  { key: "lichen", displayName: "Reindeer Lichen", rarity: "RARE", temperament: "Shared", habitat: "Lamp stone", blurb: "Not one creature. A fungus and a partner. Two kingdoms in one guest." },
  { key: "photovore", displayName: "Lamp-drinker", rarity: "COMMON", temperament: "Thirsty", habitat: "Lamp glass", blurb: "Drinks lamp-light. No mouth. Hunger is a wavelength." },
  { key: "choir", displayName: "Chord Body", rarity: "UNCOMMON", temperament: "Harmonic", habitat: "Blotter air", blurb: "A body that is a chord. One animal, many notes." },
  { key: "nimbus", displayName: "Methane Floater", rarity: "COMMON", temperament: "Vacant", habitat: "Cold bowl", blurb: "A cold-gas floater from a methane sea. The air is the water." },
  { key: "silica", displayName: "Living Crystal", rarity: "UNCOMMON", temperament: "Patient", habitat: "Inkstone", blurb: "Grows by faceting. A mineral that chose to live." },
  { key: "terminator", displayName: "Twilight Walker", rarity: "RARE", temperament: "Rim-bound", habitat: "Lamp-edge", blurb: "Lives only on the twilight belt. Noon kills. Night starves." },
  { key: "nexus", displayName: "Walking Colony", rarity: "RARE", temperament: "Many", habitat: "Paperweight", blurb: "A colony that walks as one guest. Many animals, one name." },
  { key: "halovore", displayName: "Salt-drinker", rarity: "UNCOMMON", temperament: "Dry", habitat: "Salt dish", blurb: "Drinks salt. Leaves a frost of waste. Water is optional." },
  { key: "magneton", displayName: "Field Swimmer", rarity: "UNCOMMON", temperament: "Aligned", habitat: "Ruler line", blurb: "Swims magnetic fields the way a fish swims current. North is food." },
  { key: "umbral", displayName: "Heat Shadow", rarity: "UNCOMMON", temperament: "Quiet", habitat: "Lamp shadow", blurb: "Feeds on waste heat and shadow. The lamp is loud. The cool is lunch." },
  { key: "cyst", displayName: "Traveling Cyst", rarity: "LEGENDARY", temperament: "Waiting", habitat: "Damp blotter", blurb: "A traveling cyst. Most of a life is the wait." },
];

export const SPECIES_BY_KEY: Record<string, Species> = Object.fromEntries(
  SPECIES.map((s) => [s.key, s]),
);

export const RARITY_WEIGHT: Record<Rarity, number> = {
  COMMON: 62,
  UNCOMMON: 28,
  RARE: 8,
  LEGENDARY: 2,
};

export const HATCH_COST: Record<Rarity, number> = {
  COMMON: 4,
  UNCOMMON: 8,
  RARE: 16,
  LEGENDARY: 32,
};

export const TRAIT_POOLS = {
  eyes: ["amber", "ink", "frost", "ember"],
  mark: ["plain", "masked", "banded", "starred"],
  aura: ["still", "dustlit", "emberlit", "moonlit"],
} as const;

export function portraitSrc(key: string) {
  return `/pets/${key}.jpg`;
}

export function findSpecies(key: string) {
  return SPECIES_BY_KEY[key] ?? null;
}

export function rarityLabel(rarity: Rarity) {
  return rarity.charAt(0) + rarity.slice(1).toLowerCase();
}

export function pickWeightedRarity(rand: () => number = Math.random): Rarity {
  const roll = rand() * 100;
  let acc = 0;
  for (const rarity of ["COMMON", "UNCOMMON", "RARE", "LEGENDARY"] as const) {
    acc += RARITY_WEIGHT[rarity];
    if (roll < acc) return rarity;
  }
  return "COMMON";
}

export function pickSpecies(rarity: Rarity, rand: () => number = Math.random) {
  const pool = SPECIES.filter((s) => s.rarity === rarity);
  return pool[Math.floor(rand() * pool.length)] ?? SPECIES[0]!;
}

export function mintTokenId(rand: () => number = Math.random) {
  const n = Math.floor(rand() * 0xfffff)
    .toString(16)
    .padStart(5, "0");
  return `0xcp${n}`;
}

export function walletFromUserId(userId: string) {
  let h = 0;
  for (let i = 0; i < userId.length; i++) h = (h * 33 + userId.charCodeAt(i)) >>> 0;
  const hex = (h.toString(16) + "a1b2c3d4e5f60789").slice(0, 40).padEnd(40, "0");
  return `0x${hex}`;
}
