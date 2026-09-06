import { FAR_KEYS, FAR_ROSTER } from "./far";

export type FarGuide = {
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

function entry(key: string, latin: string, tell: string, mixup: string, lesson: string): FarGuide {
  const roster = FAR_ROSTER.find((s) => s.key === key);
  if (!roster) throw new Error(`far guide is missing roster for ${key}`);
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

/** Field notes for the ten far guests. Literary, short, and meant to be learned on the blotter. */
export const FAR_GUIDE: FarGuide[] = [
  entry(
    "photovore",
    "Lucivora sitim",
    "A mouthless body of glass and thirst, hovering at the lamp. Lamp-drinker. She drinks a wavelength. The glass is a lamp she agreed to.",
    "Not a firefly. Spark is a beetle; Gleam is Lucivora sitim, and the thirst is the tell. No mouth. No flash of courtship. Hunger is a wavelength.",
    "Lamp-drinker. Drinks lamp-light. No mouth. Hunger is a wavelength.",
  ),
  entry(
    "choir",
    "Harmonia plexus",
    "A body that is already a chord, overtones stacked like ribs. Chord body. She speaks in many notes. The air is a score she agreed to.",
    "Not a whale. Not a choir of people. Choir is Harmonia plexus: one animal, many notes. The overtone is the species. Do not count the room.",
    "Chord body. One animal, many notes.",
  ),
  entry(
    "nimbus",
    "Nimbus methanei",
    "A cold-gas sack from a methane sea, trailing streamers of weather, not tentacles. Methane floater. She hovers. The bowl is a sea she agreed to breathe.",
    "Not a jellyfish. Pulse is Aurelia, a moon jelly of Earth; Drift is Nimbus methanei, and the air is the water. A sack of cold. Not a bell.",
    "Methane floater. The air is the water.",
  ),
  entry(
    "silica",
    "Silica crescit",
    "A crystal that chose to live, planes like leaves she will shed. Living crystal. She grows by faceting. The stone is a vein she agreed to.",
    "Not quartz. Not a plant. Shard is Silica crescit: a mineral with a hunger. The facet is the tell. She sheds a crystal the way a tree sheds a leaf, and is still not a tree.",
    "Living crystal. A mineral that chose to live.",
  ),
  entry(
    "terminator",
    "Limitor cursor",
    "A thin walker of the twilight belt, half in lamp, half in dark. Twilight walker. Noon kills. Night starves. The rim is the country.",
    "Not a cat claiming a sun-patch. Miso keeps the ledge; Dusk is Limitor cursor, and the belt is the whole map. The rim is not a mood. It is the habitat.",
    "Twilight walker. Noon kills, night starves; the rim is the country.",
  ),
  entry(
    "nexus",
    "Nexus colonis",
    "A colony that walks as one guest, nodes counted and then named. Walking colony. Many animals. One name. The weight is a walk they agreed to.",
    "Not a siphonophore of Earth, though that is the rhyme. Knot is Nexus colonis: many animals, one name, and the count is the tell. Pact taught not one. Knot teaches many, then one.",
    "Walking colony. Many animals, one name.",
  ),
  entry(
    "halovore",
    "Halovora brina",
    "A salt-drinker who leaves a frost of waste on the dish. Salt-drinker. Water is optional. Brine is the blood. The dish is a sea she agreed to drink dry.",
    "Not a crab. Not Ledger — Ledger is a horseshoe with book-gills. Brine is Halovora brina, and the frost is the waste. Water is optional here.",
    "Salt-drinker. Water is optional; brine is the blood.",
  ),
  entry(
    "magneton",
    "Magneton natare",
    "A needle that swims a field the way a fish swims current. Field swimmer. North is food. The line is a current she agreed to.",
    "Not a compass. Not a manta — Kite is the reef guest. Beacon is Magneton natare, and the axis is the tell. She darts along a line. She does not soar a bowl.",
    "Field swimmer. North is food.",
  ),
  entry(
    "umbral",
    "Umbralentis quietis",
    "A heat-shadow that feeds on waste warmth and the cool that follows. Heat shadow. The lamp is loud. The cool is lunch. The shadow is a meal she agreed to.",
    "Not a moth. Moth is an orchid on bark; Hush is Umbralentis quietis, and the dim is the species. She does not eat a flower. She eats the leftover heat.",
    "Heat shadow. The lamp is loud; the cool is lunch.",
  ),
  entry(
    "cyst",
    "Arca vagans",
    "A sealed traveler, a seed of a body, waiting for lamp and damp to agree. Traveling cyst. Most of a life is the wait. The blotter is a wait she agreed to.",
    "Not Brood the cicada, though they both wait. Arca is Arca vagans: a cyst that travels, and the seal is the tell. Brood sings after seventeen years. Arca wakes when the lamp and the damp agree.",
    "Traveling cyst. Most of a life is the wait.",
  ),
];

const BY_KEY = Object.fromEntries(FAR_GUIDE.map((g) => [g.key, g]));
const BY_SLUG = Object.fromEntries(FAR_GUIDE.map((g) => [g.slug, g]));

export function farGuideFor(key: string | undefined | null) {
  if (!key) return null;
  return BY_KEY[key] ?? null;
}

export function farGuideBySlug(slug: string | undefined | null) {
  if (!slug) return null;
  return BY_SLUG[slug] ?? null;
}

export function farGuideKeys() {
  return FAR_GUIDE.map((g) => g.key);
}

/** The roster and the guide must name the same ten. */
export function farGuideComplete() {
  return FAR_KEYS.length === FAR_GUIDE.length && FAR_KEYS.every((key) => BY_KEY[key]);
}
