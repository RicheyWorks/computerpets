import { ROOST_KEYS, ROOST_ROSTER } from "./roost";

export type RoostGuide = {
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

function entry(key: string, latin: string, tell: string, mixup: string, lesson: string): RoostGuide {
  const roster = ROOST_ROSTER.find((s) => s.key === key);
  if (!roster) throw new Error(`roost guide is missing roster for ${key}`);
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

/** Field notes for the ten roost guests. Literary, short, and meant to be learned on the blotter. */
export const ROOST_GUIDE: RoostGuide[] = [
  entry(
    "crow",
    "Corvus brachyrhynchos",
    "A fan of a tail, a square-cut end, a caw that stays in the neighborhood. American crow. She hops. Then she caws. The ledge is a chimney she agreed to.",
    "Not a raven. Wedge is larger, with a wedge tail and a croak; Soot is Corvus brachyrhynchos, and the fan is the tell. A crow is not a raven. Not Quill — Quill is the scarlet macaw. The fan is the species.",
    "American crow. Fan tail. A caw. Not a raven.",
  ),
  entry(
    "raven",
    "Corvus corax",
    "A wedge of a tail, a thicker bill, a croak that carries farther than a caw. Common raven. She hops. Then she croaks. The rafter is a height she agreed to.",
    "Not a crow. Soot fans and caws; Wedge is Corvus corax, and the wedge is the tell. A raven is not a crow. Not Quill — Quill quotes from a macaw chest. The croak is the species.",
    "Common raven. Wedge tail. A croak. Not a crow. Not Quill.",
  ),
  entry(
    "barn_owl",
    "Tyto alba",
    "A heart of a face, pale disks, a hiss instead of a hoot. Barn owl. She sits. Then she turns. The beam is a hollow she agreed to.",
    "Not a hawk. Hook soars in the day with a rusty fan; Heart is Tyto alba, and the face is the tell. A barn owl is not a hawk. She does not hoot. The heart is the species.",
    "Barn owl. Heart face. Not a hawk.",
  ),
  entry(
    "red_tail",
    "Buteo jamaicensis",
    "A rusty fan of a tail, a hooked bill, a soar that uses the lamp-lift. Red-tailed hawk. She flies. Then she stoops. The post is a sky she agreed to.",
    "Not an owl. Heart is a barn face of the night; Hook is Buteo jamaicensis, and the rusty fan is the tell. A hawk is not an owl. Not Heart. She does not sit like Felt. The soar is the species.",
    "Red-tailed hawk. A rusty fan. Not an owl. Not Heart.",
  ),
  entry(
    "chickadee",
    "Poecile atricapillus",
    "A black cap, white cheeks, a name she says: dee-dee. Black-capped chickadee. She hops. Then she dees. The cup is a twig she agreed to.",
    "Not a sparrow rumor. Sparrows wear streaks and a different office; Dee is Poecile atricapillus, and the cap is the tell. A chickadee is not a sparrow. The name is the species.",
    "Black-capped chickadee. Black cap. Not a sparrow rumor.",
  ),
  entry(
    "robin",
    "Turdus migratorius",
    "A brick breast, a dark head, a hop on the lawn that pulls a worm. American robin. A thrush. She hops. Then she pulls. The rim is a nest she agreed to.",
    "Not the European robin. That one is a chat with an orange face; Brick is Turdus migratorius, and the brick is the tell. An American robin is not Erithacus. The hop is the species.",
    "American robin. A brick breast. Not the European robin.",
  ),
  entry(
    "mallard",
    "Anas platyrhynchos",
    "A green head, a yellow bill, a speculum of blue, a dabble that tips. Mallard. She walks. Then she dabbles. The dish is an ink she agreed to.",
    "Not a goose. Vee wears a chinstrap and keeps a V; Drake is Anas platyrhynchos, and the green is the tell. A mallard is not a goose. Not Coin — Coin is a goldfish who loops. Drake walks. Drake flies.",
    "Mallard. Green head. Not a goose. Not Coin.",
  ),
  entry(
    "canada_goose",
    "Branta canadensis",
    "A black head, a white chinstrap, a honk that writes a V on the sky. Canada goose. She walks. Then she honks. The green is a blotter she agreed to.",
    "Not a duck. Drake dabbles and wears a green head; Vee is Branta canadensis, and the V is the tell. A Canada goose is not a duck. Not Drake. The honk is the species.",
    "Canada goose. A V. Not a duck. Not Drake.",
  ),
  entry(
    "pileated",
    "Dryocopus pileatus",
    "A red crest, a long bill, a rectangular hole in the dead wood. Pileated woodpecker. She hops. Then she drums. The post is a gallery she agreed to.",
    "Not a flicker. Flickers keep a rounder hole and a smaller drum; Drum is Dryocopus pileatus, and the rectangle is the tell. A pileated is not a flicker. The hole is the species.",
    "Pileated woodpecker. A rectangular hole. Not a flicker.",
  ),
  entry(
    "hummingbird",
    "Archilochus colubris",
    "A needle bill, a ruby throat, a hover that is not a waggle. Ruby-throated hummingbird. She darts. Then she hovers. The cup is a nectar she agreed to.",
    "Not a bee. Thrum is a bumblebee with pollen pants; Sip is Archilochus colubris, and the hover is the tell. A hummingbird is not a bee. Not Thrum. The needle is the species.",
    "Ruby-throated hummingbird. A hover. Not a bee. Not Thrum.",
  ),
];

const BY_KEY = Object.fromEntries(ROOST_GUIDE.map((g) => [g.key, g]));
const BY_SLUG = Object.fromEntries(ROOST_GUIDE.map((g) => [g.slug, g]));

export function roostGuideFor(key: string | undefined | null) {
  if (!key) return null;
  return BY_KEY[key] ?? null;
}

export function roostGuideBySlug(slug: string | undefined | null) {
  if (!slug) return null;
  return BY_SLUG[slug] ?? null;
}

export function roostGuideKeys() {
  return ROOST_GUIDE.map((g) => g.key);
}

/** The roster and the guide must name the same ten. */
export function roostGuideComplete() {
  return ROOST_KEYS.length === ROOST_GUIDE.length && ROOST_KEYS.every((key) => BY_KEY[key]);
}
