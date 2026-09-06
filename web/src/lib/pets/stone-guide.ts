import { STONE_KEYS, STONE_ROSTER } from "./stone";

export type StoneGuide = {
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

function entry(key: string, latin: string, tell: string, mixup: string, lesson: string): StoneGuide {
  const roster = STONE_ROSTER.find((s) => s.key === key);
  if (!roster) throw new Error(`stone guide is missing roster for ${key}`);
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

/** Field notes for the ten stone guests. Literary, short, and meant to be learned on the blotter. */
export const STONE_GUIDE: StoneGuide[] = [
  entry(
    "gecko",
    "Hemidactylus turcicus",
    "Toe pads like small lamps, a pale night body, a chirp that is a voice. Mediterranean house gecko. She climbs. Then she sits the plaster. The wall is a stone she agreed to.",
    "Not a salamander. Dapple is Ambystoma maculatum, wet coins on black, a vernal guest of the mold. Pad is Hemidactylus turcicus, and the pads are the tell. A gecko is not a salamander. The climb is the species.",
    "Mediterranean house gecko. Toe pads. A night voice. Not a salamander. Not Dapple.",
  ),
  entry(
    "anole",
    "Anolis carolinensis",
    "Green that can go brown, a pink dewlap she flashes like a sentence. Green anole. She sits. Then she flashes. The vine is a post she agreed to.",
    "Not a chameleon. Shift is Chamaeleo calyptratus, tong feet, independent eyes, a casque. Wink is Anolis carolinensis, and the dewlap is the tell. An anole is not a chameleon. The pink is the species.",
    "Green anole. A dewlap. She can go brown. Not a chameleon. Not Shift.",
  ),
  entry(
    "skink",
    "Plestiodon fasciatus",
    "Five pale lines, a blue tail when young, short legs that still walk. Five-lined skink. She dashes. Then she sits the crack. The stone is a route she agreed to.",
    "Not a snake. Sash is a garden garter who patrols and sheds the den way, blue then a coat. Dash is Plestiodon fasciatus, and the legs are the tell. A skink is not a snake. The dash is the species.",
    "Five-lined skink. A blue tail when young. Not a snake. Not Sash.",
  ),
  entry(
    "chameleon",
    "Chamaeleo calyptratus",
    "A casque, tong feet that hold a branch, eyes that keep two offices. Veiled chameleon. She walks slow. Then she aims. The perch is a branch she agreed to.",
    "Not Wink — Wink is an anole with a dewlap she flashes. Not Sol — Sol is an iguana of the south wall, Iguana iguana. Shift is Chamaeleo calyptratus, and the eyes are the tell. A chameleon is not an anole. She is not an iguana. The slow is the species.",
    "Veiled chameleon. Tong feet, independent eyes. Not Wink. Not Sol.",
  ),
  entry(
    "horned_lizard",
    "Phrynosoma cornutum",
    "A flattened body, a crown of horns, a threat that can be blood from the eye. Texas horned lizard. She sits. Then she crowns. The tray is a sand she agreed to.",
    "Not a toad. Pebble is Anaxyrus americanus, warty, dry, parotoids. Not Horn — Horn is a chanterelle, Cantharellus, false gills that fork. Spike is Phrynosoma cornutum, and the crown is the tell. A horned lizard is not a toad. She is not a mushroom. The horns are the species.",
    "Texas horned lizard. A crown of horns. She can squirt blood. Not a toad. Not Pebble.",
  ),
  entry(
    "alligator",
    "Alligator mississippiensis",
    "A broad U-snout, teeth that hide when the mouth closes, a sit on the bank. American alligator. She sits. Then she basks. The dish is a bank she agreed to.",
    "Not a crocodile. Jaw is Crocodylus acutus, a V-snout, a fourth tooth that shows. Levee is Alligator mississippiensis, and the hidden teeth are the tell. An alligator is not a crocodile. The U is the species.",
    "American alligator. A U-snout. Teeth hide on the close. Not a crocodile. Not Jaw.",
  ),
  entry(
    "crocodile",
    "Crocodylus acutus",
    "A narrower V-snout, a fourth tooth that keeps office when the mouth shuts. American crocodile. She sits. Then she shows. The dish is a brackish she agreed to.",
    "Not an alligator. Levee is Alligator mississippiensis, a U-snout, teeth that hide. Jaw is Crocodylus acutus, and the fourth tooth is the tell. A crocodile is not an alligator. The V is the species.",
    "American crocodile. A V-snout. Fourth tooth shows. Not an alligator. Not Levee.",
  ),
  entry(
    "snapper",
    "Chelydra serpentina",
    "A hooked beak, a long saw of a tail, a rugged carapace she keeps in mud. Common snapping turtle. She sits. Then she snaps. The bowl is a mud she agreed to.",
    "Not Ink — Ink is a Reeves's turtle, Mauremys reevesii, a patient dish guest of the study. Not a tortoise. A tortoise is a land office, no snap of a beak in mud. Beak is Chelydra serpentina, and the hook is the tell. A snapper is not a Reeves's turtle. The tail is the species.",
    "Common snapping turtle. A beak, a long tail. Not Ink. Not a tortoise.",
  ),
  entry(
    "box_turtle",
    "Terrapene carolina",
    "A high dome, a hinged plastron she can shut until she is a box. Eastern box turtle. She walks. Then she shuts. The dish is a leaf she agreed to.",
    "Not Ink — Ink is a Reeves's turtle who stays open and patient. Not Hinge — Hinge is a mussel, Elliptio, two valves that filter a river. Lid is Terrapene carolina, and the plastron is the tell. A box turtle is not a Reeves's turtle. She is not a mussel. The shut is the species.",
    "Eastern box turtle. A hinged plastron. She shuts. Not Ink. Not Hinge.",
  ),
  entry(
    "tuatara",
    "Sphenodon punctatus",
    "A crest of spines, a third eye on the peak of the head, a still that is not laziness. Tuatara. She sits. Then she is still. The burrow is a stone she agreed to. She is her own order.",
    "Not a lizard. Sol is an iguana, Iguana iguana, a lizard of the wall. Peak is Sphenodon punctatus, Rhynchocephalia, and the third eye is the tell. A tuatara is not a lizard. She is her own order. The still is the species.",
    "Tuatara. A third eye. Not a lizard. Not Sol. She is her own order.",
  ),
];

const BY_KEY = Object.fromEntries(STONE_GUIDE.map((g) => [g.key, g]));
const BY_SLUG = Object.fromEntries(STONE_GUIDE.map((g) => [g.slug, g]));

export function stoneGuideFor(key: string | undefined | null) {
  if (!key) return null;
  return BY_KEY[key] ?? null;
}

export function stoneGuideBySlug(slug: string | undefined | null) {
  if (!slug) return null;
  return BY_SLUG[slug] ?? null;
}

export function stoneGuideKeys() {
  return STONE_GUIDE.map((g) => g.key);
}

/** The roster and the guide must name the same ten. */
export function stoneGuideComplete() {
  return STONE_KEYS.length === STONE_GUIDE.length && STONE_KEYS.every((key) => BY_KEY[key]);
}
