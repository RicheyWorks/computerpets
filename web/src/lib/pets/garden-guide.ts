import { GARDEN_KEYS, GARDEN_ROSTER } from "./garden";

export type GardenGuide = {
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

function entry(key: string, latin: string, tell: string, mixup: string, lesson: string): GardenGuide {
  const roster = GARDEN_ROSTER.find((s) => s.key === key);
  if (!roster) throw new Error(`garden guide is missing roster for ${key}`);
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

/** Field notes for the ten garden guests. Literary, short, and meant to be learned on the blotter. */
export const GARDEN_GUIDE: GardenGuide[] = [
  entry(
    "moss",
    "Hypnum cupressiforme",
    "A sheet of green scales, no flower, no true root — only rhizoids that cling. Cypress-moss: the felt of woods and walls. She carpets. She leans to the lamp. The blotter is a forest floor she agreed to.",
    "Not a flowering plant. Not a lichen — those are a fungus with an alga, a different kingdom. Felt is Hypnum cupressiforme, a moss, Plantae, and the carpet is the whole identification. She does not bloom. She does not commute.",
    "Sheet moss. I have no flower. The carpet is the tell.",
  ),
  entry(
    "maidenhair",
    "Adiantum capillus-veneris",
    "Black wiry stems, fanlets of pale green, a fiddlehead that unfurls like a sentence. Maidenhair: the Venus-hair fern of damp stone. She does not flower. The saucer is a cliff she borrowed.",
    "Not a flowering plant. Not a palm with smaller opinions. Vein is a fern — spores, not petals — Adiantum capillus-veneris, and the black stem is the tell. Sol is a lizard who basks. Vein unfurls and stays.",
    "Maidenhair fern. I unfurl. I do not flower.",
  ),
  entry(
    "ginkgo",
    "Ginkgo biloba",
    "Fan leaves with a notch, veins that do not net, gold when the desk turns autumn. A living fossil. He is not a flowering plant. The lamp is a season he wears.",
    "Not a maple with a better publicist — those have palmate leaves and flowers. Not an oak. Fan is Ginkgo biloba, the last of his line, and the fan is the whole identification. The gold is a season, not a mood.",
    "Ginkgo. I gold. The fan is the tell.",
  ),
  entry(
    "oak",
    "Quercus alba",
    "A white oak who agreed to be a seedling: lobed leaves, pale bark starting, an acorn he may drop. A tree on a blotter. The dish is a forest he has not outgrown.",
    "Not a maple — those bleed sweet and keep a different leaf. Not Spire. Spire is a redwood and a needle; Mast is Quercus alba, the white oak of the eastern door, and the lobe is the tell. The acorn is a letter, not a toy.",
    "White oak. I drop. I agreed to be small.",
  ),
  entry(
    "redwood",
    "Sequoia sempervirens",
    "Needles in a flat spray, red-brown bark even as a child, a spire that means to keep rising. Coast redwood: the tallest thing pretending to be a desk plant. The pot is a courtesy.",
    "Not a pine of the Christmas rumor — those keep bundles. Not Mast. Mast drops an acorn; Spire is Sequoia sempervirens, the coast one, and the rise is the species. Fog would help. The house does not have fog. He leans anyway.",
    "Coast redwood. I rise. The pot is a courtesy.",
  ),
  entry(
    "water_lily",
    "Nymphaea odorata",
    "A round pad with a slit, a white bloom that opens for the lamp and closes for the night. Fragrant water lily. She floats. The ink dish is a pond she agreed to.",
    "Not a lotus — those hold the leaf above the water and keep a different center. Not Speck. Speck is a film; Pad is Nymphaea odorata, the fragrant one, and the open is the tell. Coin stayed in the bowl. Pad is the floor of the dish.",
    "Fragrant water lily. I open. The pad is the floor.",
  ),
  entry(
    "duckweed",
    "Lemna minor",
    "A green lentil of a plant, a root like a thread, a flower the size of a pin. Common duckweed. She divides. The glass is a pond she filled.",
    "Not algae — those are another kingdom's rumor. Not moss. Felt carpets; Speck flowers, barely, and is the smallest flowering plant the house will keep. Lemna minor. The divide is the whole identification.",
    "Common duckweed. I divide. The flower is a pin.",
  ),
  entry(
    "venus_flytrap",
    "Dionaea muscipula",
    "A rosette of hinged leaves, teeth like a polite fence, two hairs that must agree. Venus flytrap: a wetland plant of poor soil. She snaps. She is not a monster. The cup is a bog.",
    "Not a monster. Not a pitcher, which drowns. Snap is Dionaea muscipula, the Carolina door, and two hairs are the law. The house does not keep a rumor with teeth. She is a plant who learned a lunch.",
    "Venus flytrap. Two hairs, then the trap. I am a plant.",
  ),
  entry(
    "orchid",
    "Phalaenopsis amabilis",
    "Thick aerial roots, a spray of white moths that are flowers, a stem that will not sit in dirt like a rumor. Moth orchid. She blooms. The bark is a tree she borrowed.",
    "Not a moth. The moth is the flower's joke — Phalaenopsis, the moth-like one, amabilis. Not a lily. Pad floats; Moth hangs her roots in the air. The bloom is the tell. The dirt is optional.",
    "Moth orchid. I bloom. The roots are in the air.",
  ),
  entry(
    "saguaro",
    "Carnegiea gigantea",
    "A young column of ribs and spines, green, storing rain, an arm that has not arrived. Saguaro: a cactus of the Sonoran door. He sits the tray. He is not a tree with opinions.",
    "Not a tree. Trees keep wood and a different thirst; Arm is Carnegiea gigantea, a cactus, and the store is the species. Not a succulent of the windowsill rumor with no spines. He works the night. The day is for sitting.",
    "Saguaro. I store. I am a cactus, not a tree.",
  ),
];

const BY_KEY = Object.fromEntries(GARDEN_GUIDE.map((g) => [g.key, g]));
const BY_SLUG = Object.fromEntries(GARDEN_GUIDE.map((g) => [g.slug, g]));

export function gardenGuideFor(key: string | undefined | null) {
  if (!key) return null;
  return BY_KEY[key] ?? null;
}

export function gardenGuideBySlug(slug: string | undefined | null) {
  if (!slug) return null;
  return BY_SLUG[slug] ?? null;
}

export function gardenGuideKeys() {
  return GARDEN_GUIDE.map((g) => g.key);
}

/** The roster and the guide must name the same ten. */
export function gardenGuideComplete() {
  return GARDEN_KEYS.length === GARDEN_GUIDE.length && GARDEN_KEYS.every((key) => BY_KEY[key]);
}
