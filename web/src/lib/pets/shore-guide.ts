import { SHORE_KEYS, SHORE_ROSTER } from "./shore";

export type ShoreGuide = {
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

function entry(key: string, latin: string, tell: string, mixup: string, lesson: string): ShoreGuide {
  const roster = SHORE_ROSTER.find((s) => s.key === key);
  if (!roster) throw new Error(`shore guide is missing roster for ${key}`);
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

/** Field notes for the ten shore guests. Literary, short, and meant to be learned on the blotter. */
export const SHORE_GUIDE: ShoreGuide[] = [
  entry(
    "fiddler_crab",
    "Minuca pugnax",
    "One claw grown into a flag, a body that keeps the marsh dish, a wave that is a sentence. Atlantic fiddler. She sits. Then she waves. The dish is a marsh she agreed to.",
    "Not a hermit. Tenant is Pagurus, a soft abdomen shopping for a lid. Not Pinch — Pinch is a crayfish of the pond, two claws, ten legs. Wave is Minuca pugnax, once filed as Uca, and the signal is the tell. A fiddler is not a hermit. The wave is the species.",
    "Atlantic fiddler crab. The big claw is a signal, not a pinch of lunch. Not Tenant. Not Pinch.",
  ),
  entry(
    "ghost_crab",
    "Ocypode quadrata",
    "Pale on the dry sand, eyestalks like two questions, a run that leaves almost no print. Atlantic ghost crab. She sits. Then she runs. The sand is a dry she agreed to.",
    "Not Tenant. Tenant shops and carries a house. Not Ledger — Ledger is Limulus, book-gills, a telson, not a crab. Not Ghost — Ghost is a luna moth of one week, no mouth. Pale is Ocypode quadrata, and the run is the tell. A ghost crab is not a horseshoe crab. The pale is the species.",
    "Atlantic ghost crab. She runs the dry sand. Not Tenant. Not Ledger. Not Ghost.",
  ),
  entry(
    "limpet",
    "Patella vulgata",
    "A cone of a shell, a foot that clamps the rock, a rasp that writes a home scar. Common limpet. She sits. Then she clamps. The rim is a rock she agreed to.",
    "Not Lid. Lid is a box turtle, a hinged plastron, a shut. Not Cement — Cement is a barnacle, a crustacean glued to the stone, cirri for lunch. Cone is Patella vulgata, and the clamp is the tell. A limpet is not a barnacle. The cone is the species.",
    "Common limpet. A cone that clamps. Not Lid. Not Cement.",
  ),
  entry(
    "barnacle",
    "Semibalanus balanoides",
    "Plates cemented to the stone, cirri that kick a drift of food, a body that does not walk away. Acorn barnacle. She sits. Then she kicks. The rim is a stone she agreed to.",
    "Not a limpet. Cone clamps and can walk a little; Cement is glued and stays. Not a crab — Wave and Pale walk; Cement is a cirripede, a crustacean who chose the stone. Semibalanus balanoides, and the cement is the tell. A barnacle is not a limpet. The stay is the species.",
    "Acorn barnacle. Cemented. Not a limpet. Not a crab.",
  ),
  entry(
    "chiton",
    "Tonicella lineata",
    "Eight overlapping plates, a girdle, a graze of the tide rock. Lined chiton. She walks. Then she plates. The rock is a tide she agreed to.",
    "Not a limpet. Cone is one cone; Mail is eight valves, a polyplacophoran, not a snail. Not Armor — Armor is a pillbug who rolls on bark. Mail is Tonicella lineata, and the eight are the tell. A chiton is not a snail. The mail is the species.",
    "Lined chiton. Eight plates. Not a limpet. Not Armor.",
  ),
  entry(
    "periwinkle",
    "Littorina littorea",
    "A dark spiral on the rock, a rasp, a snail who keeps the spray. Common periwinkle. She sits. Then she rasps. The face is a rock she agreed to.",
    "Not Chamber. Chamber is a nautilus, chambers of gas, a cephalopod. Not Whorl — Whorl is a pond snail with a lung. Not Knurl — Knurl is a whelk who hunts. Spire is Littorina littorea, and the rock is the tell. A periwinkle is not a nautilus. The rasp is the species.",
    "Common periwinkle. A snail of the rock. Not Chamber. Not Whorl. Not Knurl.",
  ),
  entry(
    "sand_dollar",
    "Echinarachnius parma",
    "A flat disk of an urchin, five petals on the test, a bury in the sand plate. Common sand dollar. She sits. Then she buries. The plate is a sand she agreed to.",
    "Not Coin. Coin is a goldfish who circles a bowl. Not Disk — Disk is a water lily of the garden. Not Ochre — Ochre is a sea star who clings and everts a stomach. Token is Echinarachnius parma, a flattened echinoid, and the petals are the tell. A sand dollar is not a coin. The flat is the species.",
    "Common sand dollar. A flat urchin. Not Coin. Not Disk. Not Ochre.",
  ),
  entry(
    "sea_urchin",
    "Strongylocentrotus purpuratus",
    "A purple globe, spines that walk, a mouth on the underside. Purple sea urchin. She walks. Then she spines. The pool is a tide she agreed to.",
    "Not Burr. Burr is a hedgehog who uncurls for people who wait. Not Spine — Spine is a porcupine of the wood. Not Token — Token is flat and buries; Thorn is regular, purple, and keeps the spines. Strongylocentrotus purpuratus, and the spines are the tell. An urchin is not a sand dollar. The purple is the species.",
    "Purple sea urchin. Spines. Not Burr. Not Spine. Not Token.",
  ),
  entry(
    "knobbed_whelk",
    "Busycon carica",
    "A heavy spiral, knobs on the shoulder, a canal, a hunt of clams. Knobbed whelk. She sits. Then she hunts. The dish is a wrack she agreed to.",
    "Not Spire. Spire is a periwinkle who rasps and does not hunt. Not Horn — Horn is a golden chanterelle of the cellar, false gills that fork. Not Chamber. Knurl is Busycon carica, and the knobs are the tell. A whelk is not a periwinkle. The hunt is the species.",
    "Knobbed whelk. A predator snail. Not Spire. Not Horn.",
  ),
  entry(
    "lugworm",
    "Arenicola marina",
    "A fat polychaete in the wet sand, a coil of castings left on the surface, a heap that is the tell. Lugworm. She sits. Then she heaps. The sand is a wet she agreed to.",
    "Not Cast. Cast is Lumbricus terrestris, a clitellum, a cast you dig in soil. Not Latch — Latch is a leech with suckers who hunts worms. Not Thread. Heap is Arenicola marina, and the castings are the tell. A lugworm is not an earthworm. The heap is the species.",
    "Lugworm. A worm of the castings. Not Cast. Not Latch.",
  ),
];

const BY_KEY = Object.fromEntries(SHORE_GUIDE.map((g) => [g.key, g]));
const BY_SLUG = Object.fromEntries(SHORE_GUIDE.map((g) => [g.slug, g]));

export function shoreGuideFor(key: string | undefined | null) {
  if (!key) return null;
  return BY_KEY[key] ?? null;
}

export function shoreGuideBySlug(slug: string | undefined | null) {
  if (!slug) return null;
  return BY_SLUG[slug] ?? null;
}

export function shoreGuideKeys() {
  return SHORE_GUIDE.map((g) => g.key);
}

/** The roster and the guide must name the same ten. */
export function shoreGuideComplete() {
  return SHORE_KEYS.length === SHORE_GUIDE.length && SHORE_KEYS.every((key) => BY_KEY[key]);
}
