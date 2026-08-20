import { REEF_KEYS, REEF_ROSTER } from "./reef";

export type ReefGuide = {
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

function entry(key: string, latin: string, tell: string, mixup: string, lesson: string): ReefGuide {
  const roster = REEF_ROSTER.find((s) => s.key === key);
  if (!roster) throw new Error(`reef guide is missing roster for ${key}`);
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

/** Field notes for the ten reef guests. Literary, short, and meant to be learned on the blotter. */
export const REEF_GUIDE: ReefGuide[] = [
  entry(
    "brain_coral",
    "Colpophyllia natans",
    "A boulder of living valleys, polyps in the grooves, a ridge that is an animal. Boulder brain coral. She sits. Then she ridges. The dish is a rock she agreed to.",
    "Not a plant. Not Fan — Fan is a ginkgo of gold leaves. Not Bloom — Bloom is an axolotl of the cistern. Not Hold — Hold is kelp in the well, brown algae, a holdfast. Not Coral — Coral is a milk snake who wears a warning she does not mean. Ridge is Colpophyllia natans, and the valleys are the tell. A coral is an animal. The ridge is the species.",
    "Boulder brain coral. A coral is an animal. Not a plant. Not Fan. Not Bloom. Not Hold. Not Coral.",
  ),
  entry(
    "anemone",
    "Heteractis magnifica",
    "A column, a wreath of tentacles, a house that Paint agreed to. Magnificent sea anemone. Also filed as Radianthus. She sits. Then she wreathes. The dish is a column she agreed to.",
    "Not a jelly. Pulse is a moon jelly, a bell, four moons, no brain. Not Snap — Snap is a flytrap of the garden who waits for hairs to agree. Wreath is Heteractis magnifica, and the tentacles are the tell. An anemone is not a jelly. The wreath is the species.",
    "Magnificent sea anemone. A wreath of tentacles. Not Pulse. Not Snap.",
  ),
  entry(
    "clownfish",
    "Amphiprion ocellaris",
    "Orange, white bars, a sit in the wreath that is the whole office. Ocellaris clownfish. She darts. Then she nestles. The cup is a wreath she agreed to.",
    "Not a goldfish. Coin circles a brass bowl and is honest about it. Not Stripe — Stripe is a skunk of the duff who wears a warning. Paint is Amphiprion ocellaris, and the bars are the tell. A clownfish is not a goldfish. She lives in the wreath. The paint is the species.",
    "Ocellaris clownfish. She lives in the wreath. Not Stripe. Not Coin.",
  ),
  entry(
    "parrotfish",
    "Sparisoma viride",
    "A beak that rasps the living rock, a stoplight of a body, a scrape that makes the sand. Stoplight parrotfish. She scrapes. Then she swims. The plate is a rock she agreed to.",
    "Not a parrot. Quill is a macaw who quotes your commits. Not Beak — Beak is a snapping turtle of the stone, a hooked jaw, a long tail. Scrape is Sparisoma viride, and the rasp is the tell. A parrotfish is not a parrot. The scrape is the species.",
    "Stoplight parrotfish. She rasps the rock. Not Quill. Not Beak.",
  ),
  entry(
    "cleaner_shrimp",
    "Lysmata amboinensis",
    "Red and white bands, long antennae, a wave that is an offer, not a pinch. Pacific cleaner shrimp. She waits. Then she waves. The dish is a station she agreed to.",
    "Not a hermit. Tenant is Pagurus, a soft abdomen shopping for a lid. Not Pinch — Pinch is a crayfish of the pond, two claws, ten legs. Scrub is Lysmata amboinensis, and the station is the tell. A cleaner shrimp is not a hermit. The wait is the species.",
    "Pacific cleaner shrimp. A station, not a hunt. Not Tenant. Not Pinch.",
  ),
  entry(
    "sea_cucumber",
    "Thelenota ananas",
    "A soft tube, papillae like a pineapple, a crawl of the sand well. Pineapple sea cucumber. She crawls. Then she stills. The well is a sand she agreed to.",
    "Not a worm. Heap is a lugworm of the wet sand, a coil of castings. Not Cast — Cast is Lumbricus terrestris, a clitellum, a cast you dig in soil. Tube is Thelenota ananas, an echinoderm, and the papillae are the tell. A sea cucumber is not a lugworm. The soft is the species.",
    "Pineapple sea cucumber. Soft. Not a worm. Not Heap. Not Cast.",
  ),
  entry(
    "lionfish",
    "Pterois volitans",
    "Stripes, a veil of pectoral rays, a hover on the reef ledge. Red lionfish. She hovers. Then she veils. The ledge is a rock she agreed to.",
    "Not Mane. Mane is Hericium, teeth not gills, a beard on a wound in the wood. Not Fan — Fan is a ginkgo of the garden. Not Spine — Spine is a porcupine of the wood. Not Spike — Spike is a horned lizard of the sand. Veil is Pterois volitans, and the fins are the tell. A lionfish is not a ginkgo fan. The veil is the species.",
    "Red lionfish. The fins are a veil. Not Mane. Not Fan. Not Spine. Not Spike.",
  ),
  entry(
    "giant_clam",
    "Tridacna gigas",
    "Two valves, a mantle that drinks the lamp, a door that stays a clam. Giant clam. She sits. Then she opens. The dish is a mantle she agreed to.",
    "Not a nautilus. Chamber rises by gas, chambers, a cephalopod. Not Cone — Cone is a limpet who clamps the rock and walks a little. Gate is Tridacna gigas, and the mantle is the tell. A giant clam is not a nautilus. The gate is the species.",
    "Giant clam. A door of a shell. Not Chamber. Not Cone.",
  ),
  entry(
    "eagle_ray",
    "Aetobatus narinari",
    "A diamond of spotted wings, a whip of a tail, a soar of the reef sky. Spotted eagle ray. She soars. Then she glides. The sky is a bowl she agreed to.",
    "Not a manta. Kite is a reef manta who filters the lamp-light and barrels when the compile is kind. Not a bird — Hook soars the lamp as a hawk. Soar is Aetobatus narinari, and the spots are the tell. An eagle ray is not a manta. The soar is the species.",
    "Spotted eagle ray. A ray of the reef. Not Kite. Not a bird.",
  ),
  entry(
    "grouper",
    "Epinephelus striatus",
    "A stout fish, bars, a sit in a hole that is the whole office. Nassau grouper. She sits. Then she hides. The dish is a hole she agreed to.",
    "Not a moray. Door is a green moray of the book crevice; the mouth is not a yawn. Not Lance — Lance is a pike of the creek, a duckbill who waits in a reed. Hide is Epinephelus striatus, and the hole is the tell. A grouper is not a moray. The hide is the species.",
    "Nassau grouper. A fish of a hole. Not Door. Not Lance.",
  ),
];

const BY_KEY = Object.fromEntries(REEF_GUIDE.map((g) => [g.key, g]));
const BY_SLUG = Object.fromEntries(REEF_GUIDE.map((g) => [g.slug, g]));

export function reefGuideFor(key: string | undefined | null) {
  if (!key) return null;
  return BY_KEY[key] ?? null;
}

export function reefGuideBySlug(slug: string | undefined | null) {
  if (!slug) return null;
  return BY_SLUG[slug] ?? null;
}

export function reefGuideKeys() {
  return REEF_GUIDE.map((g) => g.key);
}

/** The roster and the guide must name the same ten. */
export function reefGuideComplete() {
  return REEF_KEYS.length === REEF_GUIDE.length && REEF_KEYS.every((key) => BY_KEY[key]);
}
