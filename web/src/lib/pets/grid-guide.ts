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

/** Field notes for the seven grid guests. Literary, short, and meant to be learned on the blotter. */
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
  entry(
    "flux_dragon",
    "Draco campus",
    "A living heat-field under the hide, a shimmer as if a magnetic field is moving under the scales, a cool glow that is weather. Field dragon. Flux sits. Then Flux fields. The night is a heat Flux agreed to.",
    "Not Arc. Arc is Draco reticulum, a grid-lit hide, a jumping dorsal arc between two nape nubs. Not Volt. Volt is Draco spira, live coils on the ribs. Not Trace. Trace is Draco semita, one gold circuit-trace from snout to tail. Flux is Draco campus, and the field is the tell. A field dragon is not a grid dragon, not a coil dragon, and not a path dragon. The heat is the species. Not Vesper. Vesper is a mantel dragon.",
    "Field dragon. A living heat-field under the hide. Not Arc. Not Volt. Not Trace. Not Vesper.",
  ),
  entry(
    "spark_dragon",
    "Draco scintilla",
    "Live crackle-points at the snout, the claw tips, and the tail tip, small white-gold sparks that stay on the hide, a cool glow that is weather. Crack dragon. Spark sits. Then Spark crackles. The night is a point Spark agreed to.",
    "Not Arc. Arc is Draco reticulum, a grid-lit hide, a jumping dorsal arc between two nape nubs. Not Volt. Volt is Draco spira, live coils on the ribs. Not Trace. Trace is Draco semita, one gold circuit-trace from snout to tail. Not Flux. Flux is Draco campus, a heat-field under dusk-plum scales. Not the firefly. That Spark is Photinus, a beetle who flashes a dusk. This Spark is Draco scintilla, and the crackle is the tell. A crack dragon is not a grid dragon, not a coil dragon, not a path dragon, not a field dragon, and not a firefly. The points are the species. Not Vesper. Vesper is a mantel dragon.",
    "Crack dragon. Live crackle-points at snout, claws, and tail. Not Arc. Not Volt. Not Trace. Not Flux. Not Vesper.",
  ),
  entry(
    "ion_dragon",
    "Draco caligo",
    "A pale ion haze clinging to the outline, thin charged air that stays on the hide, a cool glow that is weather. Haze dragon. Ion sits. Then Ion hazes. The night is an outline Ion agreed to.",
    "Not Arc. Arc is Draco reticulum, a grid-lit hide, a jumping dorsal arc between two nape nubs. Not Volt. Volt is Draco spira, live coils on the ribs. Not Trace. Trace is Draco semita, one gold circuit-trace from snout to tail. Not Flux. Flux is Draco campus, a heat-field under dusk-plum scales. Not Spark. Spark is Draco scintilla, live crackle-points at the snout, the claws, and the tail. Ion is Draco caligo, and the haze is the tell. A haze dragon is not a grid dragon, not a coil dragon, not a path dragon, not a field dragon, and not a crack dragon. The outline is the species. Not Vesper. Vesper is a mantel dragon.",
    "Haze dragon. A pale ion haze clinging to the outline. Not Arc. Not Volt. Not Trace. Not Flux. Not Spark. Not Vesper.",
  ),
  entry(
    "gauss_dragon",
    "Draco limatura",
    "Iron-filing field lines banding the hide, rust-and-iron grains standing as if a magnet is under the scales, a cool glow that is weather. Filing dragon. Gauss sits. Then Gauss files. The night is a magnet Gauss agreed to.",
    "Not Arc. Arc is Draco reticulum, a grid-lit hide, a jumping dorsal arc between two nape nubs. Not Volt. Volt is Draco spira, live coils on the ribs. Not Trace. Trace is Draco semita, one gold circuit-trace from snout to tail. Not Flux. Flux is Draco campus, a heat-field under dusk-plum scales. Not Spark. Spark is Draco scintilla, live crackle-points at the snout, the claws, and the tail. Not Ion. Ion is Draco caligo, a pale ion haze clinging to the outline. Gauss is Draco limatura, and the filings are the tell. A filing dragon is not a grid dragon, not a coil dragon, not a path dragon, not a field dragon, not a crack dragon, and not a haze dragon. The bands are the species. Not Vesper. Vesper is a mantel dragon.",
    "Filing dragon. Iron-filing field lines banding the hide. Not Arc. Not Volt. Not Trace. Not Flux. Not Spark. Not Ion. Not Vesper.",
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

/** The roster and the guide must name the same seven. */
export function gridGuideComplete() {
  return GRID_KEYS.length === GRID_GUIDE.length && GRID_KEYS.every((key) => BY_KEY[key]);
}
