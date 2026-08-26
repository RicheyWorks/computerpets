import { GRID_KEYS, GRID_ROSTER } from "./grid";

export type GridGuide = {
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

function entry(key: string, latin: string, tell: string, mixup: string, lesson: string): GridGuide {
  const roster = GRID_ROSTER.find((s) => s.key === key);
  if (!roster) throw new Error(`grid guide is missing roster for ${key}`);
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

/** Field notes for the three grid guests. Literary, short, and meant to be learned on the blotter. */
export const GRID_GUIDE: GridGuide[] = [
  entry(
    "cyber_dragon",
    "Draco reticulum",
    "A grid-lit hide, an electric arc between two nape nubs, a cool glow that is weather. Grid dragon. She sits. Then she arcs. The night is a glow she agreed to.",
    "Not Vesper. Vesper is the house dragon of the mantel, a province, a proud sit, warm at the chest. Arc is Draco reticulum, and the grid is the tell. A grid dragon is not a mantel dragon. The arc is the species.",
    "Grid dragon. A grid-lit hide. An electric arc. Not Vesper. Not a mantel dragon.",
  ),
  entry(
    "volt_dragon",
    "Draco spira",
    "A live coil along the ribs, a winding current that stays on the hide, a cool glow that is weather. Coil dragon. He sits. Then he coils. The night is a current he agreed to.",
    "Not Arc. Arc is Draco reticulum, a grid-lit hide, a jumping dorsal arc between two nape nubs. Volt is Draco spira, and the coil is the tell. A coil dragon is not a grid dragon. The current is the species. Not Vesper. Vesper is a mantel dragon.",
    "Coil dragon. A live coil along the ribs. Not Arc. Not a dorsal jump. Not Vesper.",
  ),
  entry(
    "trace_dragon",
    "Draco semita",
    "A single live circuit-trace from snout to tail, a path on a board that stays on the hide, a cool glow that is weather. Path dragon. Trace sits. Then Trace traces. The night is a board Trace agreed to.",
    "Not Arc. Arc is Draco reticulum, a grid-lit hide, a jumping dorsal arc between two nape nubs. Not Volt. Volt is Draco spira, live coils on the ribs. Trace is Draco semita, and the path is the tell. A path dragon is not a grid dragon and not a coil dragon. The trace is the species. Not Vesper. Vesper is a mantel dragon.",
    "Path dragon. A single live circuit-trace from snout to tail. Not Arc. Not Volt. Not Vesper.",
  ),
];

const BY_KEY = Object.fromEntries(GRID_GUIDE.map((g) => [g.key, g]));
const BY_SLUG = Object.fromEntries(GRID_GUIDE.map((g) => [g.slug, g]));

export function gridGuideFor(key: string | undefined | null) {
  if (!key) return null;
  return BY_KEY[key] ?? null;
}

export function gridGuideBySlug(slug: string | undefined | null) {
  if (!slug) return null;
  return BY_SLUG[slug] ?? null;
}

export function gridGuideKeys() {
  return GRID_GUIDE.map((g) => g.key);
}

/** The roster and the guide must name the same three. */
export function gridGuideComplete() {
  return GRID_KEYS.length === GRID_GUIDE.length && GRID_KEYS.every((key) => BY_KEY[key]);
}
