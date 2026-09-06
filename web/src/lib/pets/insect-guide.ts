import { INSECT_KEYS, INSECT_ROSTER } from "./insects";

export type InsectGuide = {
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

function entry(key: string, latin: string, tell: string, mixup: string, lesson: string): InsectGuide {
  const roster = INSECT_ROSTER.find((s) => s.key === key);
  if (!roster) throw new Error(`insect guide is missing roster for ${key}`);
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

/** Field notes for the ten hive guests. Literary, short, and meant to be learned on the blotter. */
export const INSECT_GUIDE: InsectGuide[] = [
  entry(
    "honeybee",
    "Apis mellifera",
    "Gold bands, a pollen basket, a waggle that points. Western honey bee. She dances. The dance is a map — direction, distance, a flower she will not waste. The wax dish is a meadow she agreed to.",
    "Not a fly. Not a wasp with a thinner waist and a worse temper. Comb is Apis mellifera, a bee, Insecta, and the waggle is the whole identification. She does not guess. She maps.",
    "Honey bee. A dance that is a map.",
  ),
  entry(
    "monarch",
    "Danaus plexippus",
    "Orange panes, black veins, white spots on the rim. Monarch. She ate milkweed as a caterpillar. The orange is a warning she earned — bitter, honest, not a costume. The cup is a prairie she has not outgrown.",
    "Not a viceroy with a borrowed coat. Not Milk the snake — Coral wears a warning she does not mean. Milk the butterfly means it. Danaus plexippus, and the milkweed is the law. The orange is not a mood.",
    "Monarch. Milkweed first. The orange is a warning she earned.",
  ),
  entry(
    "luna",
    "Actias luna",
    "Lime-green wings, long tails, eyespots like a polite moon. Luna moth. The adult has no mouth. One week. She does not eat. The lamp is a dusk she agreed to.",
    "Not a monarch with extra tails. Milk keeps orange and a warning; Ghost is Actias luna, pale, tailed, and finished with food. Not a luna of the rumor with a sip. She has no mouth. The week is the species.",
    "Luna moth. The adult has no mouth. One week. She does not eat.",
  ),
  entry(
    "firefly",
    "Photinus pyralis",
    "Soft elytra, a lamp in the tail, a flash that is a sentence. Common eastern firefly. She is a beetle. The dusk is a grammar she keeps. The blotter is a meadow after dark.",
    "Not a fly. Flies keep two wings and no lamp; Spark is Photinus pyralis, a beetle, Lampyridae, and the flash is the tell. Not a glowworm of the rumor with no wings. She lifts. She speaks in light.",
    "Firefly. A language of light. Beetle, not a fly.",
  ),
  entry(
    "darner",
    "Anax junius",
    "A green needle, a bull's-eye on the forehead, wings that do not fold flat. Common green darner. She hawks. The nymph is a different animal in the water. The lamp is a sky she agreed to.",
    "Not a damselfly — those rest with wings together and keep a thinner needle. Not the nymph. The nymph hunted in a cup; Dart is Anax junius, the adult, aerial, and the hawk is the tell. She does not commute to the pond.",
    "Green darner. The nymph is a different animal in the water.",
  ),
  entry(
    "stick",
    "Diapheromera femorata",
    "A brown twig with joints, thread legs, a freeze that works. Common walkingstick. She is furniture until she walks. The pencil tray is a forest she borrowed.",
    "Not a twig. Not a millipede — those keep many legs and a different kingdom. Twig is Diapheromera femorata, a phasmid, Insecta, and the freeze is the whole identification. She does not hurry. She is the pencil until she isn't.",
    "Walkingstick. Furniture until it walks.",
  ),
  entry(
    "carpenter_ant",
    "Camponotus pennsylvanicus",
    "A black column, a heart-shaped head, a scent road she will not waste. Black carpenter ant. She nests in wood. She does not eat the house. The grain is a city she agreed to.",
    "Not a termite. Termites eat the beam; Column is Camponotus pennsylvanicus, and the nest is a room in wood already kind. Not a pavement ant with smaller opinions. The trail is the tell. She does not dine on the desk.",
    "Carpenter ant. A scent road. She does not eat the house; she nests in it.",
  ),
  entry(
    "ladybird",
    "Coccinella septempunctata",
    "Red elytra, seven black spots, a bead that hunts. Seven-spot ladybird. She eats aphids. She is a beetle. The dish is a leaf she agreed to.",
    "Not a luck charm. Not a fly with a better publicist. Seven is Coccinella septempunctata, a beetle, and the count is the species. Not Spark — Spark flashes; Seven hunts. Aphids. Seven spots. A beetle.",
    "Ladybird. Seven spots. She eats aphids. A beetle.",
  ),
  entry(
    "mantis",
    "Tenodera sinensis",
    "A long green hinge, raptorial arms folded, a face that turns. Chinese mantis — the common desk one. She hunts. The prayer is a trap. The stem is a perch she borrowed.",
    "Not a plant. Snap, Well, and Dew hunt on the garden blotter and remain plants. Fold is Tenodera sinensis, an insect, and the fold is the tell. Not a leaf with opinions. The prayer is a trap she earned.",
    "Chinese mantis. The prayer is a trap. An insect that hunts — not a plant.",
  ),
  entry(
    "cicada",
    "Magicicada septendecim",
    "Red eyes, a black body, a song written underground. Periodical cicada. Seventeen years in the dark. Then she emerges. Then she sings. The inkstone is a door she agreed to.",
    "Not a fly. Not a locust of the rumor — locusts are grasshoppers who travel. Brood is Magicicada septendecim, a cicada, and the wait is the species. She sits. Then a burst. Seventeen years. Then a song.",
    "Periodical cicada. Seventeen years underground, then a song.",
  ),
];

const BY_KEY = Object.fromEntries(INSECT_GUIDE.map((g) => [g.key, g]));
const BY_SLUG = Object.fromEntries(INSECT_GUIDE.map((g) => [g.slug, g]));

export function insectGuideFor(key: string | undefined | null) {
  if (!key) return null;
  return BY_KEY[key] ?? null;
}

export function insectGuideBySlug(slug: string | undefined | null) {
  if (!slug) return null;
  return BY_SLUG[slug] ?? null;
}

export function insectGuideKeys() {
  return INSECT_GUIDE.map((g) => g.key);
}

/** The roster and the guide must name the same ten. */
export function insectGuideComplete() {
  return INSECT_KEYS.length === INSECT_GUIDE.length && INSECT_KEYS.every((key) => BY_KEY[key]);
}
