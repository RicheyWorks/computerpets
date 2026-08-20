import { SNAKE_KEYS, SNAKE_ROSTER } from "./snakes";

export type SnakeGuide = {
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

function entry(key: string, latin: string, tell: string, mixup: string, lesson: string): SnakeGuide {
  const roster = SNAKE_ROSTER.find((s) => s.key === key);
  if (!roster) throw new Error(`snake guide is missing roster for ${key}`);
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

/** Field notes for the ten house snakes. Literary, short, and meant to be learned on the blotter. */
export const SNAKE_GUIDE: SnakeGuide[] = [
  entry(
    "ball_python",
    "Python regius",
    "A small head on a thick body. Dark chocolate broken by gold puzzle-blotches — keepers call them alien heads. When the room is too much, she becomes a bun. That is the name.",
    "Lula the boa is the usual mistake: both are heavy and kind. Nori is African and shorter, and her marks are puzzles, not saddles. She balls. The boa holds.",
    "Ball python. I become a bun. That is how you know me.",
  ),
  entry(
    "corn_snake",
    "Pantherophis guttatus",
    "Orange thread, black-edged saddles, and a belly like a checkerboard. A spear of darker scales sits on the head. Slim. Already looking for a gap.",
    "Copperheads wear hourglasses and a copper head; Saffron wears a spear and a checked belly. Some morphs get filed with milk snakes. She is a rat snake, not a rumor.",
    "Corn snake. Look at the belly. It is a checkerboard.",
  ),
  entry(
    "kingsnake",
    "Lampropeltis californiae",
    "Black and white, banded or striped, glossy as a ruler. The bands often meet under the belly. The head is barely a head — just more snake.",
    "Not a coral snake: there is no red on him. Not a racer, though the stripes lie. People also file him with milk snakes — cousins, both kings of a sort. He eats other snakes. That is the office.",
    "California kingsnake. Black and white. No red. I am not a rumor.",
  ),
  entry(
    "green_tree_python",
    "Morelia viridis",
    "Emerald on a branch, folded into a saddle, head in the middle of the loop. Hatchlings come yellow or red and earn the green. Heat pits along the lips.",
    "The emerald tree boa is the classic twin: same jewelry, different continent. Jade is New Guinea. The boa is Amazon. Count the lip pits if you must; better to remember who sleeps like a bracelet.",
    "Green tree python. I sit like jewelry. The green is earned.",
  ),
  entry(
    "hognose",
    "Heterodon nasicus",
    "The snout turns up like a little plow. Stout, blotched, keeled. When the room is too much, he flattens, hisses, then dies on his back with the mouth open. He gets over it.",
    "A young rattlesnake is the frightened guess — blotches and theater. No rattle. The upturned nose is the whole identification. Eastern hognose is a cousin with a milder shovel.",
    "Western hognose. The nose turns up. The death is optional.",
  ),
  entry(
    "garter",
    "Thamnophis sirtalis",
    "Three pale lines the length of a small errand — one down the spine, one on each flank — on a dark, keeled body. Often damp. Always mid-route.",
    "Ribbon snakes are the slim cousins: longer tail, cleaner sides, less checkering between the stripes. Young watersnakes get the same glance. Sash is the garden one.",
    "Common garter. Three lines. I was already going.",
  ),
  entry(
    "boa",
    "Boa constrictor",
    "A river of muscle. Tan saddles that rust toward the tail. A dark line through the eye. Heat pits. She does not hurry a coil.",
    "Nori is the other thick friend: African, smaller, a bun when pressed. Lula is American and longer. Anacondas are the wet rumor — same family, different job.",
    "Boa constrictor. Saddles that rust. I am the river, not the bun.",
  ),
  entry(
    "milk_snake",
    "Lampropeltis gentilis",
    "Red, black, and cream in clean rings. Red touches black. A small glossy head. The Pueblo animals wear the colors like stamps. She borrows a warning and means lunch.",
    "Coral snakes are the rhyme people mutter: in the United States, red against yellow is the venomous one; red against black is the costume. The rhyme fails south of the border. She is a western milksnake from the Pueblo country — not a Micrurus.",
    "Milk snake. Red touches black. I borrowed the warning.",
  ),
  entry(
    "rosy_boa",
    "Lichanura trivirgata",
    "Three wide stripes — rose, rust, or sand — on a slow, heavy little body. Smooth. A tail as blunt as a second thought. No theater.",
    "Rubber boas are the other small western boa: plain brown, with a tail that pretends to be a head. Blush wears the three lines. She is not a pink ball python.",
    "Rosy boa. Three stripes and no hurry.",
  ),
  entry(
    "carpet_python",
    "Morelia spilota cheynei",
    "Yellow and black like a map that refused to be neat — jagged, high-contrast, a carpet from the tablelands. Slimmer than a boa. Often up on an edge.",
    "Other carpet pythons wear quieter rugs: coastal, inland, diamond. The jungle form is the gold-and-ink highland one from Queensland. Not a kingsnake. The yellow is a country, not a band.",
    "Jungle carpet. The yellow is a map. Follow it.",
  ),
];

const BY_KEY = Object.fromEntries(SNAKE_GUIDE.map((g) => [g.key, g]));
const BY_SLUG = Object.fromEntries(SNAKE_GUIDE.map((g) => [g.slug, g]));

export function guideFor(key: string | undefined | null) {
  if (!key) return null;
  return BY_KEY[key] ?? null;
}

export function guideBySlug(slug: string | undefined | null) {
  if (!slug) return null;
  return BY_SLUG[slug] ?? null;
}

export function snakeGuideKeys() {
  return SNAKE_GUIDE.map((g) => g.key);
}

/** The roster and the guide must name the same ten. */
export function snakeGuideComplete() {
  return SNAKE_KEYS.length === SNAKE_GUIDE.length && SNAKE_KEYS.every((key) => BY_KEY[key]);
}
