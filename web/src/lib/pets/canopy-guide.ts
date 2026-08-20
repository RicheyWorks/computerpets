import { CANOPY_KEYS, CANOPY_ROSTER } from "./canopy";

export type CanopyGuide = {
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

function entry(key: string, latin: string, tell: string, mixup: string, lesson: string): CanopyGuide {
  const roster = CANOPY_ROSTER.find((s) => s.key === key);
  if (!roster) throw new Error(`canopy guide is missing roster for ${key}`);
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

/** Field notes for the ten canopy guests. Literary, short, and meant to be learned on the blotter. */
export const CANOPY_GUIDE: CanopyGuide[] = [
  entry(
    "sloth",
    "Choloepus didactylus",
    "Two toes, a hang that is a kind of walk, a face that is not lazy. Linnaeus's two-toed sloth. She hangs. Then she reaches. The hook is a bough she agreed to.",
    "Not lazy. The hang is the work. Not Rui — Rui is Ailurus fulgens, a scarf of a tail, ribbon-minded. Hang is Choloepus didactylus, and the two toes are the tell. A sloth is not a red panda. The hang is the species.",
    "Linnaeus's two-toed sloth. She hangs. She is not lazy. Not Rui.",
  ),
  entry(
    "lemur",
    "Lemur catta",
    "A ringed tail held up like a flag, a sit that faces the sun, a troop that keeps the ledge. Ring-tailed lemur. She sits. Then she flags. The ledge is a sun she agreed to.",
    "Not Stripe — Stripe is Mephitis, a skunk of the duff, a warning she wears. Not Ring — Ring is Trametes versicolor, a turkey tail, pores not gills. Not a raccoon. Wash rinses; Sun is Lemur catta, and the flag of a tail is the tell. A lemur is not a raccoon.",
    "Ring-tailed lemur. The tail is a flag. Not Stripe. Not Ring.",
  ),
  entry(
    "gibbon",
    "Hylobates lar",
    "Long arms, a song that carries, a swing that is a walk through air. Lar gibbon. She swings. Then she sings. The arm is a lamp she agreed to.",
    "Not a monkey rumor. A gibbon is an ape. The song and the swing are the office. Not Quill — Quill is a macaw who quotes the hat stand. Swing is Hylobates lar, and the brachiation is the tell. A gibbon is not a monkey. A macaw is not a gibbon.",
    "Lar gibbon. A song and a swing. Not a monkey rumor. Not Quill.",
  ),
  entry(
    "kinkajou",
    "Potos flavus",
    "A prehensile tail, a night sip of nectar, a wrap that is a kind of sit. Kinkajou. She wraps. Then she sips. The cup is a night she agreed to.",
    "Not Sip — Sip is a hummingbird with a needle bill. Not Comb — Comb is a honey bee who waggles a map. Not Rue — Rue is a fox of the closet. Not Wick — Wick is a ferret who steals dongles. Wrist is Potos flavus, and the tail that holds is the tell. A kinkajou is not a ferret.",
    "Kinkajou. A prehensile tail. Nectar at night. Not Sip. Not Comb. Not Rue.",
  ),
  entry(
    "colugo",
    "Galeopterus variegatus",
    "A skin from the chin to the tail, a cling, then a sail between trunks. Sunda colugo. She clings. Then she sails. The trunk is a night she agreed to.",
    "Not a lemur. Sun is Lemur catta of the ledge; Sail is Galeopterus, and the patagium is the tell. Not Glide — Glide is a flying squirrel, a rodent with a smaller fold. Not Cape — Cape is a bat, hands that fly. A colugo is not a lemur. She is not a flying squirrel. She is not a bat.",
    "Sunda colugo. A skin that sails. Not a lemur. Not Glide. Not Cape.",
  ),
  entry(
    "flying_squirrel",
    "Glaucomys volans",
    "A fold of skin, a hop, then a glide that is not a flight. Southern flying squirrel. She hops. Then she glides. The fold is an oak she agreed to.",
    "Not a bird. Not Kite — Kite is a manta of the bowl, a filter of lamp-light. Not Cache — Cache is Sciurus, a gray squirrel who buries a thought and walks. Glide is Glaucomys volans, and the skin is the tell. A flying squirrel is not a bird. A skin is not a wing.",
    "Southern flying squirrel. A skin, not a wing. Not Kite. Not a bird.",
  ),
  entry(
    "howler",
    "Alouatta palliata",
    "A mantle, a sit in the crown, a howl that is the whole room. Mantled howler. She sits. Then she booms. The crown is a perch she agreed to.",
    "Not Vee — Vee is a Canada goose, a V, a honk of the blotter. Not Swing — Swing is a gibbon who sings and swings; Boom is Alouatta palliata, and the hyoid is the tell. A howler is not a gibbon. The howl is the species.",
    "Mantled howler. The howl is the tell. Not Vee. Not Swing.",
  ),
  entry(
    "tarsier",
    "Carlito syrichta",
    "Eyes that fill the face, a leap from a hollow, a look that does not blink first. Philippine tarsier. She looks. Then she leaps. The hollow is a night she agreed to.",
    "Not Heart — Heart is a barn owl, a heart of feathers, a hiss not a hoot. Gaze is Carlito syrichta, and the eyes are the tell. A tarsier is not an owl. The look is the species.",
    "Philippine tarsier. The eyes are the face. Not Heart.",
  ),
  entry(
    "potto",
    "Perodicticus potto",
    "A slow grip, a still that is a kind of hunt, a cousin of the loris who is not a loris. Potto. She grips. Then she stills. The rail is a vine she agreed to.",
    "Not a loris. Not Twig — Twig is a walkingstick who freezes. Not Fold — Fold is a mantis who waits to strike. Not Hang — Hang is a two-toed sloth of the hook. Still is Perodicticus potto, and the grip is the tell. A potto is not a sloth. She is not a loris.",
    "Potto. A slow cousin. Not a loris. Not Twig. Not Fold. Not Hang.",
  ),
  entry(
    "koala",
    "Phascolarctos cinereus",
    "A pouch, a chew of gum leaves, a sit that can look like a bear and is not. Koala. A marsupial. She sits. Then she chews. The perch is a gum she agreed to.",
    "Not a bear. Not Coal — Coal is Ursus americanus, a black bear of the denside. Not Burr — Burr is a hedgehog who curls. Gum is Phascolarctos cinereus, and the pouch is the tell. A koala is not a bear. She is a marsupial. The chew is the species.",
    "Koala. A marsupial. Not a bear. Not Coal. Not Burr.",
  ),
];

const BY_KEY = Object.fromEntries(CANOPY_GUIDE.map((g) => [g.key, g]));
const BY_SLUG = Object.fromEntries(CANOPY_GUIDE.map((g) => [g.slug, g]));

export function canopyGuideFor(key: string | undefined | null) {
  if (!key) return null;
  return BY_KEY[key] ?? null;
}

export function canopyGuideBySlug(slug: string | undefined | null) {
  if (!slug) return null;
  return BY_SLUG[slug] ?? null;
}

export function canopyGuideKeys() {
  return CANOPY_GUIDE.map((g) => g.key);
}

/** The roster and the guide must name the same ten. */
export function canopyGuideComplete() {
  return CANOPY_KEYS.length === CANOPY_GUIDE.length && CANOPY_KEYS.every((key) => BY_KEY[key]);
}
