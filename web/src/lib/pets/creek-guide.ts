import { CREEK_KEYS, CREEK_ROSTER } from "./creek";

export type CreekGuide = {
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

function entry(key: string, latin: string, tell: string, mixup: string, lesson: string): CreekGuide {
  const roster = CREEK_ROSTER.find((s) => s.key === key);
  if (!roster) throw new Error(`creek guide is missing roster for ${key}`);
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

/** Field notes for the ten creek guests. Literary, short, and meant to be learned on the blotter. */
export const CREEK_GUIDE: CreekGuide[] = [
  entry(
    "bass",
    "Micropterus salmoides",
    "A wide gape, a dark stripe along the side, a sit in the weed until the lunge. Largemouth bass. She sits. Then she lunges. The edge is a weed she agreed to.",
    "Not a trout. Speck is Salvelinus fontinalis, a char, worm marks on the back; Lunge is Micropterus salmoides, and the mouth is the tell. A bass is not a trout. The gape is the species.",
    "Largemouth bass. A wide mouth. Not a trout. Not Speck.",
  ),
  entry(
    "brook_trout",
    "Salvelinus fontinalis",
    "Worm marks on the back, red spots with blue halos, fins edged in white. Brook trout. A char. She darts. Then she rises. The cup is a riffle she agreed to.",
    "Not a bass. Lunge is Micropterus, a wide mouth, a sit then a lunge. Not a rainbow rumor — those wear a pink stripe and keep a different office. Speck is Salvelinus fontinalis, and the worm marks are the tell. A brook trout is a char. The speck is the species.",
    "Brook trout. A char. Worm marks. Not a bass. Not a rainbow rumor.",
  ),
  entry(
    "catfish",
    "Ictalurus punctatus",
    "Barbels around the mouth, spots on a forked-tail body, a walk of the mud. Channel catfish. She sits. Then she whisks. The run is a mud she agreed to.",
    "Not a shark. A shark is a rumor of the sea; Whisk is Ictalurus punctatus, and the barbels are the tell. Not Spoon — Spoon filters with a paddle. A catfish is not a shark. The whisk is the species.",
    "Channel catfish. Barbels. Not a shark. Not a rumor of the sea.",
  ),
  entry(
    "bluegill",
    "Lepomis macrochirus",
    "A dark ear flap like a penny, a compressed sunfish body, an orange belly when the compile is kind. Bluegill. She sits the shade. Then she flares. The dock is a shade she agreed to.",
    "Not Coin. Coin is a goldfish who loops one thought in a brass bowl; Penny is Lepomis macrochirus, and the flap is the tell. A bluegill is a sunfish. She does not loop. The penny is the species.",
    "Bluegill. A dark ear flap. A sunfish. Not Coin the goldfish.",
  ),
  entry(
    "perch",
    "Perca flavescens",
    "Yellow gold, dark bars down the side, a spiny first dorsal. Yellow perch. She darts. Then she keeps the bars. The rail is a weed she agreed to.",
    "Not a walleye. Night is Sander vitreus, a tapetum, a dusk hunt; Bar is Perca flavescens, and the bars are the tell. A perch is not a walleye. The gold is the species.",
    "Yellow perch. Bars down the side. Not a walleye. Not Night.",
  ),
  entry(
    "pike",
    "Esox lucius",
    "A duckbill of a snout, light spots on a long green body, a wait in the reed. Northern pike. She sits. Then she lances. The reed is an ambush she agreed to.",
    "Not a muskellunge rumor she has to argue. A muskellunge wears dark bars on light and keeps a different argument; Lance is Esox lucius, and the duckbill is the tell. A pike is not a muskellunge. The wait is the species.",
    "Northern pike. A duckbill. Not a muskellunge rumor she has to argue.",
  ),
  entry(
    "walleye",
    "Sander vitreus",
    "A milky eye with a tapetum, an olive-gold body, a hunt when the lamp leans. Walleye. She sits. Then she hunts dusk. The run is a dusk she agreed to.",
    "Not a perch. Bar is Perca flavescens, bars down the side, a day gold; Night is Sander vitreus, and the tapetum is the tell. A walleye is not a perch. The dusk is the species.",
    "Walleye. A tapetum. She hunts dusk. Not a perch. Not Bar.",
  ),
  entry(
    "paddlefish",
    "Polyodon spathula",
    "A paddle of a rostrum, a vast filter of a mouth, a body that looks like a shark rumor and is not. American paddlefish. She sits. Then she filters. The dish is a current she agreed to.",
    "Not a shark. Not Whisk — Whisk is a catfish with barbels who tastes mud. Spoon is Polyodon spathula, and the paddle is the tell. A paddlefish filters. She does not hunt the shark way. The sieve is the species.",
    "American paddlefish. A paddle. Filter. Not a shark. Not Whisk.",
  ),
  entry(
    "lamprey",
    "Petromyzon marinus",
    "A disk of a mouth, no jaws, a stout body that is not a ribbon. Sea lamprey, in fresh water to spawn. She sits. Then she clings. The stone is a disk she agreed to.",
    "Not an eel. Silver is Anguilla rostrata, jaws, a continuous fin, a going to the Sargasso. Not Door — Door is a moray of the tide, a gape that is breath. Round is Petromyzon marinus, and the disk is the tell. A lamprey is not an eel. She is a disk, not a ribbon.",
    "Sea lamprey. A disk mouth. No jaws. Not an eel. Not Silver. Not a moray.",
  ),
  entry(
    "american_eel",
    "Anguilla rostrata",
    "A true eel, jaws, a continuous fin, a silver that is a going. American eel. She swims. Then she silvers. The hole is a bank she agreed to. She goes to the Sargasso.",
    "Not a lamprey. Round is Petromyzon, a disk, no jaws, here to spawn. Not a moray of the tide — Door keeps a crevice and a gape that is breath. Silver is Anguilla rostrata, and the Sargasso is the tell. An American eel is not a lamprey. The going is the species.",
    "American eel. She goes to the Sargasso. Not a lamprey. Not Round. Not a moray of the tide.",
  ),
];

const BY_KEY = Object.fromEntries(CREEK_GUIDE.map((g) => [g.key, g]));
const BY_SLUG = Object.fromEntries(CREEK_GUIDE.map((g) => [g.slug, g]));

export function creekGuideFor(key: string | undefined | null) {
  if (!key) return null;
  return BY_KEY[key] ?? null;
}

export function creekGuideBySlug(slug: string | undefined | null) {
  if (!slug) return null;
  return BY_SLUG[slug] ?? null;
}

export function creekGuideKeys() {
  return CREEK_GUIDE.map((g) => g.key);
}

/** The roster and the guide must name the same ten. */
export function creekGuideComplete() {
  return CREEK_KEYS.length === CREEK_GUIDE.length && CREEK_KEYS.every((key) => BY_KEY[key]);
}
