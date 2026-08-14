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
