import { POND_KEYS, POND_ROSTER } from "./pond";

export type PondGuide = {
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

function entry(key: string, latin: string, tell: string, mixup: string, lesson: string): PondGuide {
  const roster = POND_ROSTER.find((s) => s.key === key);
  if (!roster) throw new Error(`pond guide is missing roster for ${key}`);
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

/** Field notes for the ten pond guests. Literary, short, and meant to be learned on the blotter. */
export const POND_GUIDE: PondGuide[] = [
  entry(
    "frog",
    "Lithobates clamitans",
    "Long hind legs, smooth damp skin, a tympanum like a coin behind the eye. Green frog. She hops, then sits. The cup is a bank she agreed to.",
    "Not a toad. Pebble is dry and warty, with parotoid glands; Reed is Lithobates clamitans, and the jump is the tell. A frog is not a toad. The damp is the species.",
    "Green frog. Long legs. Damp skin. Not a toad.",
  ),
  entry(
    "toad",
    "Anaxyrus americanus",
    "Warty dry skin, short hops, a pair of parotoid glands behind the eyes like a warning she wears. American toad. She hops, then puffs. The dish is a leaf she agreed to.",
    "Not a frog. Reed is damp and long-legged; Pebble is Anaxyrus americanus, and the glands are the tell. A toad is not a frog. The dry is the species.",
    "American toad. Warty, dry, parotoids. Not a frog.",
  ),
  entry(
    "newt",
    "Notophthalmus viridescens",
    "A smooth spotted salamander who walked the land as a red eft, then returned to water. Eastern newt. The tail is flattened, not scaled. The saucer is a moss she agreed to.",
    "Not a lizard. Sol is an iguana of the wall; Eft is Notophthalmus viridescens, and the wet skin is the tell. A newt is not a lizard. The orange of the eft is a stage, not a costume.",
    "Eastern newt. A newt is not a lizard.",
  ),
  entry(
    "salamander",
    "Ambystoma maculatum",
    "Black with yellow coins, a vernal-pool guest who hides under leaves until the rain. Spotted salamander. She sits. Then she hides. The mold is a pool she agreed to wait for.",
    "Not a lizard. Not Eft — Eft walked orange as a newt; Dapple is Ambystoma maculatum, and the coins are the tell. Sol keeps the wall. Dapple keeps the mold. A salamander is not a lizard.",
    "Spotted salamander. Yellow coins on black. Not a lizard. Not Eft.",
  ),
  entry(
    "caecilian",
    "Typhlonectes natans",
    "Rings down a slick body, a jaw, eyes that barely keep office. Rio caecilian. An amphibian. She slips. The tray is a silt she agreed to.",
    "Not a worm. Latch is a leech with suckers; Slip is Typhlonectes natans, and the jaw is the tell. A caecilian is not a worm. She is an amphibian who lost the walk and kept the rings.",
    "Rio caecilian. A caecilian is not a worm.",
  ),
  entry(
    "crayfish",
    "Cambarus bartonii",
    "Ten walking legs, two claws, a fan of a tail. Common crayfish. A crustacean. She walks, then pinches. The tray is a pebble she agreed to.",
    "Not an insect. Comb is a bee with six legs; Pinch is Cambarus bartonii, and the claws are the tell. A crayfish is not an insect. Ten legs. Two claws. The house of a crab, in a pond.",
    "Common crayfish. A crayfish is not an insect.",
  ),
  entry(
    "pond_snail",
    "Lymnaea stagnalis",
    "A tall spiral she grew herself, a lung under the shell, a rasp for a tongue. Great pond snail. She sits. Then she rasps. The rim is a glass she agreed to.",
    "Not an insect. Not Tenant — Tenant borrows a shell; Whorl is Lymnaea stagnalis, and the house she grew is the tell. A pond snail is not a slug with a lid glued on. She built the rooms.",
    "Great pond snail. A spiral she grew. Not an insect.",
  ),
  entry(
    "mussel",
    "Elliptio complanata",
    "Two dark valves, a pale hinge, a foot, a siphon that filters. Eastern elliptio. A freshwater mussel. She sits. Then she filters. The dish is a silt she agreed to.",
    "Not a sea guest. Ochre is a sea star of the tide; Hinge is Elliptio complanata, and the river is the tell. Not lunch. A mussel is not a clam you eat. She filters the pond.",
    "Eastern elliptio. Two valves. A filter. Not the tide.",
  ),
  entry(
    "leech",
    "Haemopis sanguisuga",
    "Segments, a sucker at each end, a swim like a ribbon. Horse leech. She hunts worms. She does not drink you. The blotter is a damp she agreed to.",
    "Not a worm you dig. Slip is a caecilian with a jaw; Latch is Haemopis sanguisuga, and the suckers are the tell. A leech is not a worm. Many pond leeches eat worms. The blood rumor is a different office.",
    "Horse leech. A leech is not a worm you dig.",
  ),
  entry(
    "stickleback",
    "Gasterosteus aculeatus",
    "Three spines on the back, a nest of glue in the weed, a flare when the compile is kind. Three-spined stickleback. She darts. Then she builds. The bowl is a weed she agreed to.",
    "Not a goldfish. Coin circles one thought; Prickle is Gasterosteus aculeatus, and the nest is the tell. A stickleback is not Coin. She builds. She does not loop.",
    "Three-spined stickleback. Three spines. A nest. Not Coin.",
  ),
];

const BY_KEY = Object.fromEntries(POND_GUIDE.map((g) => [g.key, g]));
const BY_SLUG = Object.fromEntries(POND_GUIDE.map((g) => [g.slug, g]));

export function pondGuideFor(key: string | undefined | null) {
  if (!key) return null;
  return BY_KEY[key] ?? null;
}

export function pondGuideBySlug(slug: string | undefined | null) {
  if (!slug) return null;
  return BY_SLUG[slug] ?? null;
}

export function pondGuideKeys() {
  return POND_GUIDE.map((g) => g.key);
}

/** The roster and the guide must name the same ten. */
export function pondGuideComplete() {
  return POND_KEYS.length === POND_GUIDE.length && POND_KEYS.every((key) => BY_KEY[key]);
}
