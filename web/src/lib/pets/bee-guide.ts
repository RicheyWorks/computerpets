/**
 * The hive's second field notes. Comb is already in the insect ten.
 * These ten are bees and comb. A bumblebee is not a honey bee.
 * A carpenter bee does not keep honey the honey-bee way.
 * A drone is not a worker. The queen is not a second Comb.
 * The comb is a place. Many bees, one nest.
 */

import { BEE_KEYS, BEE_ROSTER } from "./bees";

export type BeeGuide = {
  key: string;
  slug: string;
  name: string;
  species: string;
  latin: string;
  tell: string;
  mixup: string;
  lesson: string;
  habitat: string;
  temperament: string;
};

function entry(key: string, latin: string, tell: string, mixup: string, lesson: string): BeeGuide {
  const roster = BEE_ROSTER.find((s) => s.key === key);
  if (!roster) throw new Error(`bee guide is missing roster for ${key}`);
  return {
    key,
    slug: roster.slug,
    name: roster.name,
    species: roster.speciesLabel,
    latin,
    tell,
    mixup,
    lesson,
    habitat: roster.habitat,
    temperament: roster.temperament,
  };
}

/** Field notes for the ten bees and comb. Literary, short, and meant to be learned on the blotter. */
export const BEE_GUIDE: BeeGuide[] = [
  entry(
    "bumblebee",
    "Bombus impatiens",
    "A round furred body, a louder wing, pollen in the fur. Common eastern bumble bee. She keeps a smaller nest. The moss cup is a meadow she agreed to.",
    "Not Comb. Comb is Apis mellifera, a honey bee with a waggle and a dish of wax. Thrum is Bombus impatiens. A bumblebee is not a honey bee. The fur is the tell. The nest is small.",
    "Bumblebee. Not a honey bee. She keeps a smaller nest.",
  ),
  entry(
    "carpenter_bee",
    "Xylocopa virginica",
    "A furred thorax, a bare shining abdomen, a hole in wood. Eastern carpenter bee. She nests in a gallery. The pencil tray is a beam she agreed to.",
    "Not Comb. Comb keeps honey in hex cells. Auger is Xylocopa virginica. A carpenter bee does not keep honey the honey-bee way. She drinks. She does not store. The hole is the office.",
    "Carpenter bee. She nests in wood. No honey the honey-bee way.",
  ),
  entry(
    "mason_bee",
    "Osmia lignaria",
    "A blue-black abdomen, mud on the mandibles, cells in a reed. Blue orchard mason. She works alone. The inkstone is a wall she agreed to.",
    "Not a hive bee. Not Comb with a colony. Mortar is Osmia lignaria, solitary, and the mud is the tell. One bee. One nest. No queen over workers.",
    "Mason bee. Solitary. Mud cells. Not a hive.",
  ),
  entry(
    "leafcutter",
    "Megachile rotundata",
    "A disc of leaf in the mandibles, pollen under the abdomen. Alfalfa leafcutter. She lines a tube. The leaf dish is a nest she agreed to.",
    "Not Comb. Comb maps a flower. Disc is Megachile rotundata. The disc is the wall. The pollen rides the abdomen, not a hind-leg basket Comb would know. Solitary.",
    "Leafcutter. A disc of leaf. A solitary cell.",
  ),
  entry(
    "stingless",
    "Melipona beecheii",
    "A small dark body, wax-and-resin pots, no sting. Maya stingless bee. She keeps a colony. The pot is the store.",
    "Not Comb's hex comb. Comb is Apis. Pot is Melipona beecheii. Pots, not comb. No sting. A different hive. Do not file her as a honey bee with the sting filed off.",
    "Stingless bee. Pots, not comb. She does not sting.",
  ),
  entry(
    "sweat_bee",
    "Agapostemon virescens",
    "A metallic green thorax, a banded abdomen, a small bright hover. Bicolored sweat bee. She is often solitary. The lamp rim is a meadow she agreed to.",
    "Not Comb. Not a honey bee that learned to shine. Sheen is Agapostemon virescens. Metallic. Often alone. No dish of wax. Sweat is a mineral she will take. Nectar is the meal.",
    "Sweat bee. Metallic. Often solitary. Not Comb.",
  ),
  entry(
    "mining_bee",
    "Andrena vicina",
    "A brown-and-cream miner, a hole in the ground, a neighbor on the bank. Neighborly mining bee. Each bee her own burrow. The sand tray is a bank she agreed to.",
    "Not a hive. Neighbors may share a bank. Each hole is hers. Bank is Andrena vicina. Not Comb. Not a colony on the blotter. The ground is the nest.",
    "Mining bee. A ground nest. Not a hive.",
  ),
  entry(
    "honey_drone",
    "Apis mellifera",
    "Larger than Comb. Eyes that meet. No pollen basket. No sting. Western honey bee drone. He hums. The workers feed him.",
    "A drone is not a worker. He is not Comb. Comb forages and dances. Hum is the same species, a different caste. He does not work the flower. He does not keep a nest.",
    "Drone. Not a worker. No sting. No pollen basket.",
  ),
  entry(
    "honey_queen",
    "Apis mellifera",
    "Longer than Comb. The abdomen is the work. She walks the comb. Western honey bee queen. She lays. The workers bring jelly.",
    "The queen is not a second Comb. Comb forages. Keep lays. One queen. Same species, a different office. She does not dance a map. She does not leave for flowers.",
    "Queen. Not a second Comb. She lays. She does not forage.",
  ),
  entry(
    "honeycomb",
    "Apis mellifera nest",
    "Hex cells. Brood in some. Stores in others. Honeycomb. The nest as a place. Wax sits. The bees walk on it.",
    "Not Comb the bee. Comb is one guest. Wax is the nest. Many bees, one comb. A colony is many bees, one nest. The line can stay or go quiet if neglected. It is not a shop.",
    "Honeycomb. Many bees, one nest. The line can go quiet.",
  ),
];

export const BEE_GUIDE_BY_KEY: Readonly<Record<string, BeeGuide>> = Object.fromEntries(
  BEE_GUIDE.map((row) => [row.key, row]),
);

export function beeGuideFor(key: string | undefined | null): BeeGuide | null {
  if (!key) return null;
  return BEE_GUIDE_BY_KEY[key] ?? null;
}

export function isBeeComplete(): boolean {
  return BEE_GUIDE.length === BEE_KEYS.length && BEE_GUIDE.length === BEE_ROSTER.length;
}
