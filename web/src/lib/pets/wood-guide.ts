import { WOOD_KEYS, WOOD_ROSTER } from "./wood";

export type WoodGuide = {
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

function entry(key: string, latin: string, tell: string, mixup: string, lesson: string): WoodGuide {
  const roster = WOOD_ROSTER.find((s) => s.key === key);
  if (!roster) throw new Error(`wood guide is missing roster for ${key}`);
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

/** Field notes for the ten wood guests. Literary, short, and meant to be learned on the blotter. */
export const WOOD_GUIDE: WoodGuide[] = [
  entry(
    "deer",
    "Odocoileus virginianus",
    "A flag of a tail, long legs, a walk through the oak. White-tailed deer. She walks. Then she flags. The edge is a wood she agreed to.",
    "Not a moose rumor. A moose is a different office, heavier, palmate, a rumor of the north. Rack is Odocoileus virginianus, and the white flag is the tell. A deer is not a moose. The walk is the species.",
    "White-tailed deer. A flag of a tail. Not a moose rumor.",
  ),
  entry(
    "bat",
    "Eptesicus fuscus",
    "Wings of a hand, a hang from the rafter, a face that is not a beak. Big brown bat. She hangs. Then she flies. The fold is a night she agreed to.",
    "Not a bird. Sip is a hummingbird with a needle bill; Peck is a penguin who bows. Cape is Eptesicus fuscus, and the hands are the tell. A bat is not a bird. The hang is the species.",
    "Big brown bat. Wings of a hand. Not a bird. Not Sip. Not Peck.",
  ),
  entry(
    "squirrel",
    "Sciurus carolinensis",
    "Gray, a plume of a tail, a thought she buries and sometimes finds. Eastern gray squirrel. She hops. Then she hides. The dish is an oak she agreed to.",
    "Not a chipmunk rumor. A chipmunk wears racing stripes and a smaller office. Cache is Sciurus carolinensis, and the cache is the tell. A squirrel is not a chipmunk. The hide is the species.",
    "Eastern gray squirrel. She hides a thought. Not a chipmunk rumor.",
  ),
  entry(
    "otter",
    "Lontra canadensis",
    "A slick body, webbed feet, a slide that is a kind of walk. North American river otter. She swims. Then she slides. The dish is a water she agreed to.",
    "Not Slip — Slip is a caecilian with rings and a jaw. Not a weasel rumor only. Slick is Lontra canadensis, and the slide is the tell. An otter is not a caecilian. She is not only a weasel with opinions. The water is the species.",
    "North American river otter. A slide in water. Not Slip.",
  ),
  entry(
    "raccoon",
    "Procyon lotor",
    "A mask, ringed tail, hands that rinse before they keep. Raccoon. She sits. Then she washes. The bowl is a night she agreed to.",
    "Not Bandit — Bandit is a kingsnake who wears bands and inspects the drawer. Not Rui — Rui is a red panda, Ailuridae, a scarf of a tail. Wash is Procyon lotor, and the rinse is the tell. A raccoon is not a kingsnake. She is not a red panda.",
    "Raccoon. She washes. Not Bandit. Not Rui.",
  ),
  entry(
    "skunk",
    "Mephitis mephitis",
    "Black, two white lines down the back, a stamp before a warning. Striped skunk. She walks. Then she raises. The dish is a duff she agreed to.",
    "Not a polecat rumor. A polecat is a different continent and a different office. Not Wick — Wick is a ferret who steals dongles. Stripe is Mephitis mephitis, and the warning she wears is the tell. A skunk is not a ferret. The lines are the species.",
    "Striped skunk. A warning she wears. Not a polecat rumor. Not Wick.",
  ),
  entry(
    "opossum",
    "Didelphis virginiana",
    "A grin, a pouch, a still that can look like death. Virginia opossum. A marsupial. She walks. Then she goes still. The hem is a night she agreed to.",
    "Not a cat. Miso is Felis catus, claws that retract; Grin is Didelphis virginiana, and the pouch is the tell. Not Vesper — Vesper is a dragon of the mantel. An opossum is not a cat. She is a marsupial. The still is the species.",
    "Virginia opossum. She plays dead. A marsupial. Not a cat. Not Vesper.",
  ),
  entry(
    "beaver",
    "Castor canadensis",
    "Teeth that fell, a flat paddle of a tail, a lodge she builds. North American beaver. She sits. Then she gnaws. The cup is a lodge she agreed to.",
    "Not a muskrat rumor. A muskrat is smaller, no lodge of felled wood, a different tail. Dam is Castor canadensis, and the lodge is the tell. A beaver is not a muskrat. The teeth are the species.",
    "North American beaver. Teeth that fell. A lodge. Not a muskrat rumor.",
  ),
  entry(
    "porcupine",
    "Erethizon dorsatum",
    "Quills that can leave if you press them. She does not throw. North American porcupine. She walks. Then she bristles. The post is a pine she agreed to.",
    "Not Burr — Burr is a hedgehog who curls. Not Quill — Quill is a macaw who quotes. Spine is Erethizon dorsatum, and the quills that stay until they leave are the tell. A porcupine does not throw. A hedgehog is not a porcupine. A macaw is not a porcupine.",
    "North American porcupine. Quills that can leave. Not Burr. Not Quill.",
  ),
  entry(
    "black_bear",
    "Ursus americanus",
    "Dark, a plantigrade walk, a denside she keeps. American black bear. She walks. Then she sits. The oak is a den she agreed to.",
    "Not a red panda. Not Rui. Rui is Ailurus fulgens, a scarf of a tail, ribbon-minded. Coal is Ursus americanus, and the size is the tell. She is a bear. A red panda is not a bear. The denside is the species.",
    "American black bear. Not a red panda. Not Rui. She is a bear.",
  ),
];

const BY_KEY = Object.fromEntries(WOOD_GUIDE.map((g) => [g.key, g]));
const BY_SLUG = Object.fromEntries(WOOD_GUIDE.map((g) => [g.slug, g]));

export function woodGuideFor(key: string | undefined | null) {
  if (!key) return null;
  return BY_KEY[key] ?? null;
}

export function woodGuideBySlug(slug: string | undefined | null) {
  if (!slug) return null;
  return BY_SLUG[slug] ?? null;
}

export function woodGuideKeys() {
  return WOOD_GUIDE.map((g) => g.key);
}

/** The roster and the guide must name the same ten. */
export function woodGuideComplete() {
  return WOOD_KEYS.length === WOOD_GUIDE.length && WOOD_KEYS.every((key) => BY_KEY[key]);
}
