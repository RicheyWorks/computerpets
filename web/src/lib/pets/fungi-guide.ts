import { FUNGI_KEYS, FUNGI_ROSTER } from "./fungi";

export type FungiGuide = {
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

function entry(key: string, latin: string, tell: string, mixup: string, lesson: string): FungiGuide {
  const roster = FUNGI_ROSTER.find((s) => s.key === key);
  if (!roster) throw new Error(`fungi guide is missing roster for ${key}`);
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

/** Field notes for the ten cellar guests. Literary, short, and meant to be learned on the blotter. */
export const FUNGI_GUIDE: FungiGuide[] = [
  entry(
    "oyster",
    "Pleurotus ostreatus",
    "Cream shelves stacked like plates, a short lateral stem, gills that run down. Oyster mushroom. She fruits on dead wood. She eats what has finished. The shelf is a log she agreed to.",
    "Not a plant. Plants keep chlorophyll and a different kingdom; Frill is Pleurotus ostreatus, a fungus, and the shelf is the tell. Not a turkey tail — those keep pores and zones. She decomposes. She does not photosynthesize.",
    "Oyster mushroom. A shelf that eats the dead wood.",
  ),
  entry(
    "fly_agaric",
    "Amanita muscaria",
    "A red cap with white warts, white gills, a skirt on the stem, a volva at the base like a cup she has not left. Fly agaric. She is mycorrhizal. She trades with roots. The cup is a moss she agreed to.",
    "Not lunch. The red is a warning, not a costume. Cap is Amanita muscaria: white gills, a skirt, a volva. Not a puffball — cut a young one and an Amanita can hide inside a pearl. A warning. Not a meal.",
    "Fly agaric. White gills, a skirt, a volva. A warning, not lunch.",
  ),
  entry(
    "morel",
    "Morchella americana",
    "A tan cone of pits, a honeycomb that is a room, hollow from cap to stem. American morel. She is a lattice. The mold is a spring she agreed to.",
    "Not a false morel. Those keep a wrinkled brain and are stuffed, not hollow. Lattice is Morchella americana: cut her and she is a room. Not a recolored amanita. The pits are the species.",
    "American morel. A hollow honeycomb. Not a false morel.",
  ),
  entry(
    "chanterelle",
    "Cantharellus cibarius",
    "A gold vase, ridges that fork and run down the stem, an apricot she will not waste. Golden chanterelle. False gills. The rim is a moss she agreed to.",
    "Not the jack-o’-lantern. Omphalotus glows on wood and keeps true gills that do not fork; Horn is Cantharellus cibarius, and the fork is the tell. The lantern is not a guest here. Learn her on the plaque. Do not take the twin home.",
    "Golden chanterelle. False gills that fork. Not the jack-o’-lantern.",
  ),
  entry(
    "turkey_tail",
    "Trametes versicolor",
    "Thin fans, color in zones, a white pore face if you turn her over. Turkey tail. A bracket. Not a turkey. The grain is a log she agreed to.",
    "Not a turkey. Not an oyster — Frill keeps gills; Ring is Trametes versicolor, pores not gills, and the zones are the years. Turn her over. The pore is the identification.",
    "Turkey tail. Thin, zoned, pores not gills. A bracket, not a turkey.",
  ),
  entry(
    "lions_mane",
    "Hericium erinaceus",
    "A white cascade of teeth, no cap, no gills, a beard on a wound in the wood. Lion's mane. She hangs. The wound is a door she agreed to.",
    "Not a lion. Not a puffball. Mane is Hericium erinaceus: teeth, not gills. A beard, not a shelf. She fruits from a wound. That is the whole office.",
    "Lion's mane. Teeth, not gills. A beard on a wound in the wood.",
  ),
  entry(
    "puffball",
    "Lycoperdon perlatum",
    "A pearly globe with tiny warts, a pore at the top, a puff then a cloud. Common puffball. She sits. Then she bursts. The dish is a meadow she agreed to.",
    "Not a young Amanita. Cut a puffball and it is a room of white; cut a button Amanita and you find gills and a volva hiding. Puff is Lycoperdon perlatum. The cut is the law. Cap taught the warning. Puff teaches the check.",
    "Common puffball. A puff, then a cloud. Cut a young one.",
  ),
  entry(
    "chicken_of_woods",
    "Laetiporus sulphureus",
    "Overlapping sulfur-orange shelves, a soft edge, no gills, oak underneath. Chicken of the woods. She is a bracket. The oak is a host she agreed to.",
    "Not a chicken. The name is a rumor of supper. Flame is Laetiporus sulphureus, sulfur shelves on oak, and the layer is the tell. Not Frill — Frill is cream and eats finished wood. Flame keeps the sulfur.",
    "Chicken of the woods. Sulfur shelves on oak. Not a chicken.",
  ),
  entry(
    "yeast",
    "Saccharomyces cerevisiae",
    "A jar, a foam, a few cells that rise. Baker's yeast. You cannot see her until the bread. The house already knows bread. The crock is a loaf she agreed to.",
    "Not a plant. Not a mushroom with a cap glued on. Starter is Saccharomyces cerevisiae, a fungus, and the rise is the species. She barely walks. She rises in place. The loaf is the identification.",
    "Baker's yeast. A fungus you cannot see until the bread.",
  ),
  entry(
    "lichen",
    "Cladonia rangiferina",
    "A pale branching shrub on stone, no cap, no gills, a guest that is already a treaty. Reindeer lichen. She sits. The stone is a tundra she agreed to.",
    "Not one creature. Not a moss — Felt is a plant; Pact is a fungus and a partner, alga or cyanobacterium, two kingdoms in one guest. Ledger taught not a crab. Pact teaches not one. The share is the tell.",
    "Reindeer lichen. Not one creature. A fungus and a partner.",
  ),
];

const BY_KEY = Object.fromEntries(FUNGI_GUIDE.map((g) => [g.key, g]));
const BY_SLUG = Object.fromEntries(FUNGI_GUIDE.map((g) => [g.slug, g]));

export function fungiGuideFor(key: string | undefined | null) {
  if (!key) return null;
  return BY_KEY[key] ?? null;
}

export function fungiGuideBySlug(slug: string | undefined | null) {
  if (!slug) return null;
  return BY_SLUG[slug] ?? null;
}

export function fungiGuideKeys() {
  return FUNGI_GUIDE.map((g) => g.key);
}

/** The roster and the guide must name the same ten. */
export function fungiGuideComplete() {
  return FUNGI_KEYS.length === FUNGI_GUIDE.length && FUNGI_KEYS.every((key) => BY_KEY[key]);
}
