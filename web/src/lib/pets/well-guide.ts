import { WELL_KEYS, WELL_ROSTER } from "./well";

export type WellGuide = {
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

function entry(key: string, latin: string, tell: string, mixup: string, lesson: string): WellGuide {
  const roster = WELL_ROSTER.find((s) => s.key === key);
  if (!roster) throw new Error(`well guide is missing roster for ${key}`);
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

/** Field notes for the ten leftovers. Literary, short, and meant to be learned on the blotter. */
export const WELL_GUIDE: WellGuide[] = [
  entry(
    "paramecium",
    "Paramecium caudatum",
    "A slipper of a cell, a thousand cilia for oars, a mouth that is a groove. Slipper paramecium. She rows. Then she turns. The glass is a drop she agreed to.",
    "Not an animal. Reed is a frog of the pond; Boot is Paramecium caudatum, and the slipper is the tell. A paramecium is not an animal. One cell. Cilia. The rest of the kingdoms keeps her.",
    "Slipper paramecium. A slipper. Cilia. Not an animal.",
  ),
  entry(
    "amoeba",
    "Amoeba proteus",
    "No fixed outline, a foot she puts where she means to be, a nucleus that keeps the office. Proteus amoeba. She reaches. Then she is that reach. The film is a silt she agreed to.",
    "Not a blob with no office. The foot is the office. Reach is Amoeba proteus, and the pseudopod is the tell. She is not shapeless. She is a plan that moves.",
    "Proteus amoeba. She reaches. Not a blob with no office.",
  ),
  entry(
    "euglena",
    "Euglena gracilis",
    "A green spindle, a red eyespot, a flagellum, a hunger that is also a thirst for light. Euglena. She drinks the lamp. She also eats. The drop is a lamp she agreed to.",
    "Not a plant. Felt is moss of the garden; Spot is Euglena gracilis, and the eyespot is the tell. A mixotroph is not a plant. She keeps two offices.",
    "Euglena. Eyespot. Mixotroph. Not a plant.",
  ),
  entry(
    "volvox",
    "Volvox aureus",
    "A hollow sphere of cells, daughter colonies inside like rooms, a roll that is the whole walk. Golden volvox. She is many. The bowl is a green she agreed to.",
    "Not one creature. Not Pact — Pact is a fungus and a partner, two kingdoms in one guest; Orb is Volvox aureus, and the daughters are the tell. A colony is not one animal wearing a ball.",
    "Golden volvox. A colony. Not one creature. Not Pact.",
  ),
  entry(
    "diatom",
    "Navicula",
    "A boat of silica she grew herself, striae like a ruled page, a raphe she glides on. Navicula. She sits. Then she glides. The dish is a silica she agreed to.",
    "Not Gleam. Gleam drinks lamp-light and has no mouth. Not glass from the far den — Shard is Silica crescit, a mineral that chose to live; Pane is Navicula, and the house she grew is the tell. A diatom is not far-den crystal.",
    "Navicula. A silica house she grew. Not Gleam. Not the far den.",
  ),
  entry(
    "kelp",
    "Macrocystis pyrifera",
    "A holdfast, not a root, a stipe, blades, bladders of gas. Giant kelp. Brown algae. She sways. Then she holds. The cold is a hold she agreed to.",
    "Not Felt. Felt is sheet moss of the garden, a land plant of the blotter; Hold is Macrocystis pyrifera, and the holdfast is the tell. A kelp is not a garden plant. No flowers. No true roots. A forest of brown algae.",
    "Giant kelp. Holdfast. Brown algae. Not Felt. Not a garden plant.",
  ),
  entry(
    "chlamydomonas",
    "Chlamydomonas reinhardtii",
    "An oval of green, two flagella, a cup of chloroplast. Chlamydomonas. She spins. Then she drinks. The plate is a wet she agreed to.",
    "Not a land plant. Mast is a white oak of the garden; Spin is Chlamydomonas reinhardtii, and the two oars are the tell. A green alga is not a tree. She lives in a drop.",
    "Chlamydomonas. Two flagella. A green alga. Not a land plant.",
  ),
  entry(
    "stentor",
    "Stentor coeruleus",
    "A trumpet of blue-green, a mouth of cilia, a contract that makes a dot of her. Blue stentor. She opens. Then she is a horn again. The rim is a trumpet she agreed to.",
    "Not a worm. Not Slip — Slip is a caecilian with a jaw; Latch is a leech with suckers; Bell is Stentor coeruleus, and the trumpet is the tell. A stentor is not a worm. She is a ciliate who sits as a horn.",
    "Blue stentor. A trumpet. Not a worm. Not Slip. Not Latch.",
  ),
  entry(
    "coli",
    "Escherichia coli",
    "A rod, flagella, a tumble and a run, a divide that is the whole family. Escherichia coli. A bacterium. She runs. Then she tumbles. The cup is a broth she agreed to.",
    "Not a fungus. Not Starter — Starter is baker's yeast, a fungus of the crock; Rod is Escherichia coli, and the rod is the tell. A bacterium is not a fungus. The house already knows bread. This is a different office.",
    "Escherichia coli. A bacterium. Not a fungus. Not Starter.",
  ),
  entry(
    "haloarchaea",
    "Halobacterium salinarum",
    "Pink from bacteriorhodopsin, a salt she requires, a membrane that is a sun. Halobacterium. An archaeon. She blushes. The pan is a salt she agreed to.",
    "Not a bacterium. Rod is Escherichia, a bacterium of the broth; Rose is Halobacterium salinarum, and the pink is the tell. Not Brine — Brine drinks salt from the far den; Rose is of Earth. An archaeon is not a bacterium.",
    "Halobacterium. An archaeon. Pink salt. Not a bacterium. Not Brine.",
  ),
];

const BY_KEY = Object.fromEntries(WELL_GUIDE.map((g) => [g.key, g]));
const BY_SLUG = Object.fromEntries(WELL_GUIDE.map((g) => [g.slug, g]));

export function wellGuideFor(key: string | undefined | null) {
  if (!key) return null;
  return BY_KEY[key] ?? null;
}

export function wellGuideBySlug(slug: string | undefined | null) {
  if (!slug) return null;
  return BY_SLUG[slug] ?? null;
}

export function wellGuideKeys() {
  return WELL_GUIDE.map((g) => g.key);
}

/** The roster and the guide must name the same ten. */
export function wellGuideComplete() {
  return WELL_KEYS.length === WELL_GUIDE.length && WELL_KEYS.every((key) => BY_KEY[key]);
}
