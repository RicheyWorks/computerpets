import { LOG_KEYS, LOG_ROSTER } from "./log";

export type LogGuide = {
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

function entry(key: string, latin: string, tell: string, mixup: string, lesson: string): LogGuide {
  const roster = LOG_ROSTER.find((s) => s.key === key);
  if (!roster) throw new Error(`log guide is missing roster for ${key}`);
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

/** Field notes for the ten log guests. Literary, short, and meant to be learned on the blotter. */
export const LOG_GUIDE: LogGuide[] = [
  entry(
    "house_centipede",
    "Scutigera coleoptrata",
    "Fifteen pairs of long legs, a hunt across the plaster, a sit in the crack until the next silverfish. House centipede. She sits. Then she hunts. The crack is a plaster she agreed to.",
    "Not a millipede. Link is Narceus americanus, two pairs per ring, an oil, a slow walk; Haste is Scutigera coleoptrata, and the fifteen pairs are the tell. Not an insect. A centipede is not a millipede. The hunt is the species.",
    "House centipede. Fifteen pairs. She hunts. Not a millipede. Not Link. Not an insect.",
  ),
  entry(
    "millipede",
    "Narceus americanus",
    "Two pairs of legs on each ring, a slow walk, an oil when the compile is unkind. American giant millipede. She walks. Then she oils. The log is a damp she agreed to.",
    "Not a centipede. Haste is Scutigera, fifteen pairs, a hunt; Link is Narceus americanus, and the rings are the tell. A millipede is not a centipede. The oil is the species.",
    "American giant millipede. Two pairs per ring. She oils. Not a centipede. Not Haste.",
  ),
  entry(
    "pillbug",
    "Armadillidium vulgare",
    "Seven pairs, plates that close into a ball, a walk of the bark. Common pillbug. A roly-poly. A crustacean. She walks. Then she rolls. The dish is a bark she agreed to.",
    "Not an insect. Comb is a bee with six legs. Not Pinch — Pinch is a crayfish with claws, a pond crustacean. Armor is Armadillidium vulgare, and the roll is the tell. A pillbug is not an insect. Seven pairs. The armor is the species.",
    "Common pillbug. A roly-poly. Seven pairs. A crustacean. Not an insect. Not Comb. Not Pinch.",
  ),
  entry(
    "earthworm",
    "Lumbricus terrestris",
    "A clitellum like a band, a cast left in the soil, a body that is not a snake. Common earthworm. She sits. Then she casts. The tray is a soil she agreed to.",
    "Not a snake. Sash is a corn snake who threads a gap. Not Slip — Slip is a caecilian, an amphibian with a jaw. Not Latch — Latch is a leech with suckers who hunts worms. Cast is Lumbricus terrestris, and the clitellum is the tell. An earthworm is not a snake. The cast is the species.",
    "Common earthworm. A clitellum. She casts. Not a snake. Not Sash. Not Slip. Not Latch.",
  ),
  entry(
    "velvet_worm",
    "Euperipatoides rowelli",
    "Velvet skin, a jet of glue from the head, a walk that is not a millipede's. Velvet worm. An onychophoran. She walks. Then she jets. The wood is a wet she agreed to.",
    "Not a millipede. Link is Narceus, rings, an oil. Not Dew — Dew is a sundew that glitters and curls on the garden blotter. Not Velvet — Velvet is a tarantula of the corner. Jet is Euperipatoides rowelli, and the glue from the head is the tell. A velvet worm is not a millipede. The jet is the species.",
    "Velvet worm. Velvet. Glue from the head. An onychophoran. Not a millipede. Not Link.",
  ),
  entry(
    "springtail",
    "Orchesella cincta",
    "A furcula folded under the belly, a hop that is not a flea's, six legs that do not make an insect. Orchesella springtail. A hexapod that is not an insect. She sits. Then she hops. The cup is a duff she agreed to.",
    "Not a flea. Not Comb — Comb is a bee of the hive. Hop is Orchesella cincta, and the furcula is the tell. A springtail is a hexapod. She is not an insect. The hop is the species.",
    "Orchesella springtail. A furcula. A hexapod that is not an insect. Not a flea. Not Comb.",
  ),
  entry(
    "tardigrade",
    "Hypsibius exemplaris",
    "Eight short legs, a plump walk of the moss, a tun when the film goes dry. Water bear. She walks. Then she goes tun. The film is a moss she agreed to.",
    "Not a bear. Coal is an American black bear of the wood; Tun is Hypsibius exemplaris, and the tun is the tell. A tardigrade is a water bear. She is not Coal. The dry is the species.",
    "Water bear. A tun when dry. Not a bear. Not Coal.",
  ),
  entry(
    "planarian",
    "Girardia tigrina",
    "Eyes like commas, a glide on the film, a body that can become two. Tiger planarian. She sits. Then she splits. The dish is a film she agreed to.",
    "Not a leech. Latch is Haemopis, suckers, a hunt of worms; Half is Girardia tigrina, and the commas are the tell. A planarian is not a leech. The split is the species.",
    "Tiger planarian. Eyes like commas. She splits. Not a leech. Not Latch.",
  ),
  entry(
    "nematode",
    "Caenorhabditis elegans",
    "A round thread, a thrash in the film, no clitellum, no cast you dig. C. elegans. A roundworm. She sits. Then she thrashes. The film is a soil she agreed to.",
    "Not Cast. Cast is Lumbricus terrestris, a clitellum, a cast in the tray. Thread is Caenorhabditis elegans, and the round is the tell. A nematode is not an earthworm you dig. The thread is the species.",
    "C. elegans. A roundworm. Not Cast. Not an earthworm you dig.",
  ),
  entry(
    "amphipod",
    "Gammarus minus",
    "A compressed body, a swim on the side, no roll, no claws of a crayfish. Gammarus scud. She sits. Then she scuds. The pool is a side she agreed to.",
    "Not Pinch. Pinch is a crayfish with ten legs and two claws. Not a pillbug — Armor rolls on bark, seven pairs, a crustacean of the dish. Scud is Gammarus minus, and the side is the tell. An amphipod is not a pillbug. The scud is the species.",
    "Gammarus scud. A scud. She swims on her side. Not Pinch. Not a pillbug.",
  ),
];

const BY_KEY = Object.fromEntries(LOG_GUIDE.map((g) => [g.key, g]));
const BY_SLUG = Object.fromEntries(LOG_GUIDE.map((g) => [g.slug, g]));

export function logGuideFor(key: string | undefined | null) {
  if (!key) return null;
  return BY_KEY[key] ?? null;
}

export function logGuideBySlug(slug: string | undefined | null) {
  if (!slug) return null;
  return BY_SLUG[slug] ?? null;
}

export function logGuideKeys() {
  return LOG_GUIDE.map((g) => g.key);
}

/** The roster and the guide must name the same ten. */
export function logGuideComplete() {
  return LOG_KEYS.length === LOG_GUIDE.length && LOG_KEYS.every((key) => BY_KEY[key]);
}
