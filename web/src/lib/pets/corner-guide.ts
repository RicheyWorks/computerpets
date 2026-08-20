import { CORNER_KEYS, CORNER_ROSTER } from "./corner";

export type CornerGuide = {
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

function entry(key: string, latin: string, tell: string, mixup: string, lesson: string): CornerGuide {
  const roster = CORNER_ROSTER.find((s) => s.key === key);
  if (!roster) throw new Error(`corner guide is missing roster for ${key}`);
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

/** Field notes for the ten corner guests. Literary, short, and meant to be learned on the blotter. */
export const CORNER_GUIDE: CornerGuide[] = [
  entry(
    "orb_weaver",
    "Araneus diadematus",
    "A round abdomen with a pale cross, eight legs, a web she spun herself. European garden spider. She sits. Then she waits. The lamp is a corner she agreed to.",
    "Not an insect. Comb is a bee with six legs; Loom is Araneus diadematus, and the web is the tell. Not Stem — Stem is a harvestman with one body and two eyes. A web is a trap she built. Not an insect.",
    "European garden spider. A web she built. Not an insect. Not Stem.",
  ),
  entry(
    "jumping_spider",
    "Phidippus audax",
    "Huge front eyes, a compact body, a leap that is a hunt. Bold jumper. She stalks. Then she leaps. The edge is a lookout she agreed to.",
    "Not a wolf spider. Prowl carries the brood and does not snare; Leap is Phidippus audax, and the front eyes are the tell. She stalks. She does not wait in a web. Not Prowl.",
    "Bold jumper. Big front eyes. A leap. Not a wolf spider.",
  ),
  entry(
    "wolf_spider",
    "Tigrosa helluo",
    "A ground hunter, a brood she carries on her back, no snare web. Wetland wolf spider. She walks. Then she waits. The litter is a floor she agreed to.",
    "Not Leap. Leap stalks with big front eyes and jumps; Prowl is Tigrosa helluo, and the brood is the tell. No snare web. A wolf spider is not a jumper. Not Leap.",
    "Wetland wolf spider. She carries the brood. No snare. Not Leap.",
  ),
  entry(
    "tarantula",
    "Aphonopelma chalcodes",
    "Blonde urticating hair, a stout walk, a silk burrow. Desert blonde. She kicks the hair first. The fangs are not the greeting. The burrow is a silk she agreed to.",
    "Not a wolf spider. Prowl hunts the floor and carries a brood; Velvet is Aphonopelma chalcodes, and the blonde hair is the tell. Urticating hair, not a rumor of fangs first. Not a wolf spider.",
    "Desert blonde. Urticating hair first. Not a wolf spider.",
  ),
  entry(
    "widow",
    "Latrodectus mactans",
    "Shiny black, a red hourglass on the underside, a hang in the dark. Southern black widow. She sits. Then she hangs. The corner is a dark she agreed to.",
    "Not every dark spider. A black spider is not Hour; Hour is Latrodectus mactans, and the hourglass is the tell. She is not every dark spider. The glass is the species.",
    "Southern black widow. Hourglass. She is not every dark spider.",
  ),
  entry(
    "harvestman",
    "Phalangium opilio",
    "One oval body, not two. Two eyes on a turret. Long thin legs. A harvestman. She walks the stem. She has no silk for a trap. The stem is a walk she agreed to.",
    "Not a spider. Loom has two body parts and a web; Stem is Phalangium opilio, and the one body is the tell. A harvestman is not a spider. Not Loom. Two eyes. One body.",
    "A harvestman. Two eyes. One body. Not a spider. Not Loom.",
  ),
  entry(
    "scorpion",
    "Centruroides vittatus",
    "Pincers, a segmented metasoma, a sting at the end. Striped bark scorpion. She walks. Then she raises. The bark is a night she agreed to.",
    "Not a spider. Not Whip. Whip is a vinegaroon with a flagellum and acetic acid; Barb is Centruroides vittatus, and the sting is the tell. A scorpion is not a spider. Not Whip.",
    "Striped bark scorpion. A metasoma, a sting. Not a spider. Not Whip.",
  ),
  entry(
    "vinegaroon",
    "Mastigoproctus giganteus",
    "Bulky pedipalps, a long thin whip, acetic acid, no sting. Giant vinegaroon. She walks. Then she sprays. The sand is a night she agreed to.",
    "Not a scorpion. Barb has a metasoma and a sting; Whip is Mastigoproctus giganteus, and the acid is the tell. A vinegaroon is not a scorpion. A whip. No sting. Not Barb.",
    "Giant vinegaroon. A whip, acetic acid, no sting. Not a scorpion. Not Barb.",
  ),
  entry(
    "tick",
    "Ixodes scapularis",
    "Eight short legs, a flattened body, a wait on the hem. Black-legged tick. A mite. She sits. Then she clasps. The hem is a wait she agreed to.",
    "Not an insect. Comb is a bee with six legs; Clasp is Ixodes scapularis, and the eight legs are the tell. A tick is not an insect. A mite. Not Comb.",
    "Black-legged tick. Eight legs. A mite. Not an insect. Not Comb.",
  ),
  entry(
    "solifuge",
    "Eremobates",
    "Huge chelicerae, long legs, a run, no silk, no sting. Windscorpion. A camel spider is not a spider. She runs. Then she bites. The dish is a dry she agreed to.",
    "Not a spider. Not a scorpion. Loom spins a web; Barb raises a sting; Gale is Eremobates, and the jaws are the tell. A camel spider is not a spider. Not Loom. Not Barb.",
    "Windscorpion. Huge chelicerae. Not a spider. Not a scorpion.",
  ),
];

const BY_KEY = Object.fromEntries(CORNER_GUIDE.map((g) => [g.key, g]));
const BY_SLUG = Object.fromEntries(CORNER_GUIDE.map((g) => [g.slug, g]));

export function cornerGuideFor(key: string | undefined | null) {
  if (!key) return null;
  return BY_KEY[key] ?? null;
}

export function cornerGuideBySlug(slug: string | undefined | null) {
  if (!slug) return null;
  return BY_SLUG[slug] ?? null;
}

export function cornerGuideKeys() {
  return CORNER_GUIDE.map((g) => g.key);
}

/** The roster and the guide must name the same ten. */
export function cornerGuideComplete() {
  return CORNER_KEYS.length === CORNER_GUIDE.length && CORNER_KEYS.every((key) => BY_KEY[key]);
}
