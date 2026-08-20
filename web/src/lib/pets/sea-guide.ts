import { SEA_KEYS, SEA_ROSTER } from "./sea";

export type SeaGuide = {
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

function entry(key: string, latin: string, tell: string, mixup: string, lesson: string): SeaGuide {
  const roster = SEA_ROSTER.find((s) => s.key === key);
  if (!roster) throw new Error(`sea guide is missing roster for ${key}`);
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

/** Field notes for the ten tide guests. Literary, short, and meant to be learned on the blotter. */
export const SEA_GUIDE: SeaGuide[] = [
  entry(
    "octopus",
    "Octopus vulgaris",
    "Eight arms, no bones, a bag of a body that can become a cup. Skin that tastes. Pupils like slits. When the room is too much, she jets, then crawls, then is the teacup.",
    "Not a squid — those keep a pen and two long clubs. Not a cuttlefish. Sepia hovers and flushes; Cup leaves an arm on the problem and hides in crockery. The ink is a door, not a mood.",
    "Common octopus. I taste with the arms. The cup is the tell.",
  ),
  entry(
    "cuttlefish",
    "Sepia officinalis",
    "A W of arms, a fin like a ruffle around the mantle, and a skin that rewrites itself. The cuttlebone is a private buoyancy. He hovers. Then he is another weather.",
    "Not an octopus. Cup crawls and hides; Sepia stays in the water column and changes the sentence. Not a squid. The W-arms and the ripple-fin are the whole identification. The ink is a name he keeps.",
    "Common cuttlefish. I flush. The W is the greeting.",
  ),
  entry(
    "nautilus",
    "Nautilus pompilius",
    "A coiled shell of chambers, nacre on the inside, a hood, and a fringe of tentacles without suckers. He jets. He rises by gas. The eye is a pinhole. The fossil refused to finish.",
    "Not an ammonite — those ended. Not a snail with a better publicist. Chamber is a cephalopod who kept the shell the others abandoned. Coin is a fish in a bowl. Chamber is a room that swims.",
    "Chambered nautilus. I rise. The rooms are the tell.",
  ),
  entry(
    "moon_jelly",
    "Aurelia aurita",
    "A saucer of a bell, four horseshoe moons in the jelly, a fringe of short tentacles. She pulses. She drifts. There is no brain to argue with. Not a fish. The water is the rest of her.",
    "Not a fish — no bones, no face that plans. Not a Portuguese man o' war, which is a colony and a rumor. Pulse is Aurelia, the moon one, and the four moons in the bell are the whole identification.",
    "Moon jelly. I pulse. I am not a fish.",
  ),
  entry(
    "sea_star",
    "Pisaster ochraceus",
    "Five stout arms, ochre to rust, a center that is also a mouth. Tube feet in grooves. She clings. She can evert a stomach and call it lunch. Not a fish. The star is the animal.",
    "Not a fish, though the house once said starfish and was wrong. Not a brittle star — those are long, fast, and break on purpose. Ochre is the ochre sea star of the Pacific door. She stays.",
    "Ochre sea star. I cling. I am not a fish.",
  ),
  entry(
    "hermit_crab",
    "Pagurus bernhardus",
    "A soft abdomen shopping for architecture. The European common hermit: right claw larger, walking legs, a borrowed whelk or, on this desk, a stamp lid. He measures. He trades. He walks the damp floor.",
    "Not a true crab — those grow their own roof. Ledger is the other not-crab, older, and he does not shop. Tenant is Pagurus bernhardus, intertidal, and the house is a lease he carries. Coin stayed in the bowl.",
    "Common hermit. I trade the lid. The abdomen is the tenant.",
  ),
  entry(
    "horseshoe_crab",
    "Limulus polyphemus",
    "A helmet of a carapace, book-gills, a telson that is a rudder and not a sting, and blood that runs blue. He walks the sand. He molts the whole lid. He is not a crab. He is older than the word.",
    "Not a crab. Crabs are the short-tailed cousins with a fold; Ledger is a chelicerate — kin to spiders, if you must — who kept the sea. Not Tenant. Tenant shops. Ledger is the book. The telson does not sting.",
    "Horseshoe crab. I am not a crab. The book-gills are the tell.",
  ),
  entry(
    "seahorse",
    "Hippocampus erectus",
    "A horse of a head on a plated body, a tail that wraps, a crown of spines. He hovers upright. The male keeps the brood. Lined: pale rings on a brown-olive hide. The pencil is a stem.",
    "Not a pipefish with a better posture — those stay long and horizontal. Not a fish who forgot to lie down. Anchor is the lined seahorse, Hippocampus erectus, and the hitch is the whole identification. He does not gallop.",
    "Lined seahorse. I hitch. The tail is a hand.",
  ),
  entry(
    "manta",
    "Mobula alfredi",
    "Wings that became fins, a filter of a mouth, cephalic lobes like a polite mustache. She soars. She barrels. The reef manta is the smaller vast one — spots on the belly, a kite that stayed in the water.",
    "Not a stingray. Those keep a tail with an argument; Kite's tail is a polite ribbon. Not the giant manta of the open rumor — Mobula birostris. She is alfredi, the reef one, and the bowl is a sky she agreed to.",
    "Reef manta. I soar. The wings are the tell.",
  ),
  entry(
    "moray",
    "Gymnothorax funebris",
    "A green ribbon of muscle in a crevice. The gape is how she breathes — a second set of jaws waits further in. No pectoral fins. The books make a reef. She darts, then is a door again.",
    "Not an eel of the river rumor, and not a snake. Lula holds; Door hides. The yawn is a mammal story she declined. Green moray: uniform olive, a face like a hinge, and the crevice is the species.",
    "Green moray. The gape is breath. I am the door.",
  ),
];

const BY_KEY = Object.fromEntries(SEA_GUIDE.map((g) => [g.key, g]));
const BY_SLUG = Object.fromEntries(SEA_GUIDE.map((g) => [g.slug, g]));

export function seaGuideFor(key: string | undefined | null) {
  if (!key) return null;
  return BY_KEY[key] ?? null;
}

export function seaGuideBySlug(slug: string | undefined | null) {
  if (!slug) return null;
  return BY_SLUG[slug] ?? null;
}

export function seaGuideKeys() {
  return SEA_GUIDE.map((g) => g.key);
}

/** The roster and the guide must name the same ten. */
export function seaGuideComplete() {
  return SEA_KEYS.length === SEA_GUIDE.length && SEA_KEYS.every((key) => BY_KEY[key]);
}
