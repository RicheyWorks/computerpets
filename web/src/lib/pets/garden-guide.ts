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
    "Not a maple — those bleed sweet and keep a different leaf. Not Fan. Fan is a ginkgo and a living fossil; Mast is Quercus alba, the white oak of the eastern door, and the lobe is the tell. The acorn is a letter, not a toy.",
    "White oak. I drop. I agreed to be small.",
  ),
  entry(
    "water_lily",
    "Nymphaea odorata",
    "A round pad with a slit, a white bloom that opens for the lamp and closes for the night. Fragrant water lily. She floats. The ink dish is a pond she agreed to.",
    "Not a lotus — those hold the leaf above the water and keep a different center. Disk is Nymphaea odorata, the fragrant one, and the open is the tell. Coin stayed in the bowl. Disk is the floor of the dish.",
    "Fragrant water lily. I open. The pad is the floor.",
  ),
  entry(
    "orchid",
    "Phalaenopsis amabilis",
    "Thick aerial roots, a spray of white moths that are flowers, a stem that will not sit in dirt like a rumor. Moth orchid. She blooms. The bark is a tree she borrowed.",
    "Not a moth. The moth is the flower's joke — Phalaenopsis, the moth-like one, amabilis. Not a lily. Disk floats; Moth hangs her roots in the air. The bloom is the tell. The dirt is optional.",
    "Moth orchid. I bloom. The roots are in the air.",
  ),
  entry(
    "saguaro",
    "Carnegiea gigantea",
    "A young column of ribs and spines, green, storing rain, an arm that has not arrived. Saguaro: a cactus of the Sonoran door. He sits the tray. He is not a tree with opinions.",
    "Not a tree. Trees keep wood and a different thirst; Arm is Carnegiea gigantea, a cactus, and the store is the species. Not a succulent of the windowsill rumor with no spines. He works the night. The day is for sitting.",
    "Saguaro. I store. I am a cactus, not a tree.",
  ),
  entry(
    "venus_flytrap",
    "Dionaea muscipula",
    "A rosette of hinged leaves, teeth like a polite fence, two hairs that must agree. Venus flytrap: a wetland plant of poor soil. She snaps. She is not a monster. The cup is a bog.",
    "Not a monster. Not Well — Well drowns, a leaf that became a pitfall. Not Dew — Dew glues and curls. Snap is Dionaea muscipula, the Carolina door, and two hairs are the law. Three hunts. Three plants.",
    "Venus flytrap. Two hairs, then the trap. I snap. I am a plant.",
  ),
  entry(
    "pitcher",
    "Sarracenia purpurea",
    "Short wine-purple pitchers, heavy veins, a hood that does not close, rain sitting in the well. Purple pitcher plant of northern bogs. He drowns. The leaf became a hole. The cup is a bog.",
    "Not a flytrap with a cup glued on. Snap hinges; Well is Sarracenia purpurea, a passive pitfall, and the water is the method. Not Dew. Dew glitters and curls. He does not chase. The well is enough.",
    "Purple pitcher plant. A leaf that became a well. I drown.",
  ),
  entry(
    "sundew",
    "Drosera rotundifolia",
    "Round pads on thin stalks, red tentacles, a drop of glue on each hair, a curl that takes its time. Round-leaved sundew of peat and light. She glues. She is not a door.",
    "Not a flytrap. Snap slams; Dew is Drosera rotundifolia, mucilage and a slow curl. Not Well. Well is a pitfall that waits with water. Three hunts on this blotter: snap, drown, glue.",
    "Round-leaved sundew. Tentacles, then a curl. I glue.",
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
