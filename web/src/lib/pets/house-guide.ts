import { BEE_KEYS } from "./bees";
import { CORNER_KEYS } from "./corner";
import { FAR_KEYS } from "./far";
import { FUNGI_KEYS } from "./fungi";
import { GARDEN_KEYS } from "./garden";
import { INSECT_KEYS } from "./insects";
import { POND_KEYS } from "./pond";
import { ROOST_KEYS } from "./roost";
import { ROSTER } from "./roster";
import { SEA_KEYS } from "./sea";
import { SNAKE_KEYS } from "./snakes";
import { WELL_KEYS } from "./well";
import { CREEK_KEYS } from "./creek";
import { LOG_KEYS } from "./log";
import { CANOPY_KEYS } from "./canopy";
import { MEADOW_KEYS } from "./meadow";
import { REEF_KEYS } from "./reef";
import { SHORE_KEYS } from "./shore";
import { STONE_KEYS } from "./stone";
import { WOOD_KEYS } from "./wood";

export type HouseGuide = {
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

function entry(key: string, latin: string, tell: string, mixup: string, lesson: string): HouseGuide {
  const roster = ROSTER.find((s) => s.key === key);
  if (!roster) throw new Error(`house guide is missing roster for ${key}`);
  if (SNAKE_KEYS.includes(key)) throw new Error(`house guide does not file snakes: ${key}`);
  if (SEA_KEYS.includes(key)) throw new Error(`house guide does not file the tide: ${key}`);
  if (GARDEN_KEYS.includes(key)) throw new Error(`house guide does not file the garden: ${key}`);
  if (INSECT_KEYS.includes(key)) throw new Error(`house guide does not file the hive: ${key}`);
  if (BEE_KEYS.includes(key)) throw new Error(`house guide does not file the hive: ${key}`);
  if (FUNGI_KEYS.includes(key)) throw new Error(`house guide does not file the cellar: ${key}`);
  if (FAR_KEYS.includes(key)) throw new Error(`house guide does not file the far den: ${key}`);
  if (POND_KEYS.includes(key)) throw new Error(`house guide does not file the pond: ${key}`);
  if (ROOST_KEYS.includes(key)) throw new Error(`house guide does not file the roost: ${key}`);
  if (CORNER_KEYS.includes(key)) throw new Error(`house guide does not file the corner: ${key}`);
  if (WELL_KEYS.includes(key)) throw new Error(`house guide does not file the well: ${key}`);
  if (WOOD_KEYS.includes(key)) throw new Error(`house guide does not file the wood: ${key}`);
  if (CANOPY_KEYS.includes(key)) throw new Error(`house guide does not file the canopy: ${key}`);
  if (STONE_KEYS.includes(key)) throw new Error(`house guide does not file the stone: ${key}`);
  if (CREEK_KEYS.includes(key)) throw new Error(`house guide does not file the creek: ${key}`);
  if (LOG_KEYS.includes(key)) throw new Error(`house guide does not file the log: ${key}`);
  if (SHORE_KEYS.includes(key)) throw new Error(`house guide does not file the shore: ${key}`);
  if (REEF_KEYS.includes(key)) throw new Error(`house guide does not file the reef: ${key}`);
  if (MEADOW_KEYS.includes(key)) throw new Error(`house guide does not file the meadow: ${key}`);
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

/** Field notes for the twenty who are not snakes. Literary, short, and meant to be learned on the blotter. */
export const HOUSE_GUIDE: HouseGuide[] = [
  entry(
    "red_panda",
    "Ailurus fulgens",
    "Rust from whisker to ringed tail, a cream face, and ear tufts like small commas. She climbs with a wrist-bone that works as a thumb. About the size of a house cat, and twice as serious about ribbon.",
    "Not a bear. Not a raccoon. Rui keeps her own family — Ailuridae — in the Himalaya. People file her with Miso's cousins or with the laundry-thief in a cartoon. She is neither. The tail is a scarf she earned.",
    "Red panda. I am not a bear. The tail is the tell.",
  ),
  entry(
    "cat",
    "Felis catus",
    "A cream British shorthair: dense coat, round face, copper-coin eyes. The claws go away when she is done making a point. Whiskers measure the gap. She blinks when it is earned.",
    "Not a lynx — no ear tufts, no bobbed tail, no wild commission. Not a small lion. Miso is the old house cat, Felis catus, and the ledge is her whole taxonomy.",
    "House cat. The claws retract. The blink is optional.",
  ),
  entry(
    "dog",
    "Canis familiaris",
    "A cream corgi: short legs, a long earnest back, and a face that believes the cursor is a walk. Herding bones in a hearth-rug body. The chest arrives first.",
    "Not a fox. Rue has the white tail-tip and a private agenda; Pip has the whole heart and no secrets. Not a dachshund — those are hounds. She is a herding dog who was built close to the grass.",
    "Corgi. I follow. That is how you know me.",
  ),
  entry(
    "rabbit",
    "Oryctolagus cuniculus",
    "Long ears that fill with the room, a cotton scut, and a thump that means both warning and hello. The second pair of upper teeth — peg teeth — is the quiet proof. Soft, then gone.",
    "Not a rodent. Lagomorph: two pairs of incisors, not one. Not a hare — hares are born furred and ready; Thimble was a nestling and still prefers the warren. People also file her with Clip. She is larger, quieter, and she thumps.",
    "House rabbit. I thump. Then I vanish.",
  ),
  entry(
    "hamster",
    "Mesocricetus auratus",
    "A golden Syrian: pouches that run to the shoulders, a thread of a tail, and a night shift. One hamster to a drawer. He will cheek a paperclip and call it inventory.",
    "Not a gerbil — those keep a longer tail and a committee. Not a guinea pig. Whee is social and loud about salad; Clip is solitary, nocturnal, and managerial. Two Syrians in one nest is a diplomatic incident.",
    "Golden hamster. The cheeks are the office.",
  ),
  entry(
    "guinea_pig",
    "Cavia porcellus",
    "A loaf with a voice. No tail worth mentioning. The wheek carries when a fridge opens — or a deploy lands. She cannot make her own vitamin C. She prefers a second loaf nearby.",
    "Not a hamster. Clip works the night shift alone; Whee is a cavy from the Andes, social, and fluent in salad. Not a pig. The name is a rumor she declined. She popcorns when the news is good.",
    "Guinea pig. I wheek. That is how you know I meant you.",
  ),
  entry(
    "turtle",
    "Mauremys reevesii",
    "A small pond turtle of the inkstone school: three faint keels on the carapace, webbed working feet, a head that can withdraw. He takes the long way through still water.",
    "Not a tortoise. Tortoises keep club feet and a high dry dome; Ink keeps webbing and a dish. Not a terrapin of the brackish rumor. He is a Reeves's turtle — the scholar's pond one — and he will outlive the framework.",
    "Reeves's turtle. Webbed feet. I am not a dry-land rumor.",
  ),
  entry(
    "goldfish",
    "Carassius auratus",
    "A carp that learned to be a coin: no barbels, a split tail, metal that turns when the light does. She circles one honest thought. The memory is longer than the joke.",
    "Not a koi. Koi wear barbels and grow into a pond; Coin is Carassius, smaller, and honest about the bowl. The three-second memory is a slander. She forgot on purpose. It came back kinder.",
    "Goldfish. No barbels. I still have the thought.",
  ),
  entry(
    "budgie",
    "Melopsittacus undulatus",
    "A small Australian parrot: scalloped wings, a cere above the bill, a voice that steals the room and returns it nicer. Green, unless the house has other ideas. He fits on a finger and a lamp shade.",
    "Not a lovebird, not a cockatiel. Quill is the scarlet one with a chest for quotation; Echo is the budgerigar — a parakeet, if you must — and he repeats the error message in a better key. The cere is the tell.",
    "Budgie. I repeat it kinder. Look at the cere.",
  ),
  entry(
    "fox",
    "Vulpes vulpes",
    "Red coat, black socks, and a white tip on the brush — that tip is the whole identification. Vertical pupils. A face that already knows why you opened the closet.",
    "Not a dog. Pip believes you; Rue has already found the bug. Not a coyote, not a small wolf, not a cat who learned to scheme. She is Vulpes vulpes. The white tip does not lie.",
    "Red fox. The tail ends white. I found you first.",
  ),
  entry(
    "penguin",
    "Eudyptula minor",
    "The smallest tuxedo in the house: slate-blue, not ink-black, a white bib, wings that became flippers and declined to fly. He keeps cold tile and a brief bow.",
    "Not a puffin. Puffins fly, keep a carnival bill, and work the North Atlantic. Peck is a little penguin — Australia and New Zealand, not the ice-cap rumor. Not every penguin is Antarctic. His dress code is countershading.",
    "Little penguin. I do not fly. The bow is required.",
  ),
  entry(
    "parrot",
    "Ara macao",
    "A scarlet macaw: red that means it, yellow and blue in the wings, a hooked bill that can open a nut or a subject line. Zygodactyl feet — two toes forward, two back. The stand is a stage.",
    "Not a toucan. Keel's bill is a hollow fruit-bowl; Quill's is a tool. Not a budgie with better lighting. Echo steals phrases. Quill quotes from the chest. The macaw is the large scarlet one.",
    "Scarlet macaw. The bill is a tool. I say it from the chest.",
  ),
  entry(
    "ferret",
    "Mustela furo",
    "A tube with opinions: sable mask, short legs, a spine that treats a cable-run as a palace. Domesticated polecat. He sleeps like a comma and wakes as a heist.",
    "Not a weasel — those are the wild, smaller cousins. Not a mongoose, not an otter, not a meerkat. Wick is Mustela furo, the house polecat, and the dongle was not lost. It was relocated.",
    "Ferret. I am a tube. Your dongle is somewhere better.",
  ),
  entry(
    "hedgehog",
    "Atelerix albiventris",
    "A walking pin-cushion that chooses. The quills are hollow hairs, banded, and they stay put — she does not throw them. When the room is too much, she becomes a ball with a face inside.",
    "Not a porcupine. Porcupines are rodents with long barbed quills they can leave in you. Burr is an African pygmy hedgehog, an insectivore, smaller, and the ball is the whole defense. Wait. She uncurls.",
    "Hedgehog. Quills that stay. I am not a rumor with a tail.",
  ),
  entry(
    "chinchilla",
    "Chinchilla lanigera",
    "A cloud with whiskers. The densest fur in the house — sixty hairs to a follicle. Soft enough to refuse water. She bathes in volcanic dust, not in the bowl. The Andes sent her. She likes the desk clean.",
    "Not a rabbit. Thimble thumps; Floss rolls in ash-fine dust because water ruins the coat. Not a squirrel, not a hamster in formal wear. She is Andean, nocturnal, and particular. Fetch the dust, not the tub.",
    "Chinchilla. I dust-bathe. Do not offer the tub.",
  ),
  entry(
    "axolotl",
    "Ambystoma mexicanum",
    "A salamander that refused to grow up. External gills like pink feathers, a smile that is just the mouth, and a body that stays larval on purpose. Still water. Slow thoughts. Things grow back.",
    "Not a fish. Not a lizard. Bloom is an amphibian who kept the gills — neoteny, the house calls it patience. People file her with Coin because of the glass. The gills are the whole identification. She is from Xochimilco, and she is a salamander.",
    "Axolotl. I kept the gills. I am a salamander.",
  ),
  entry(
    "toucan",
    "Ramphastos sulfuratus",
    "The bill arrives first: keel-shaped, painted like a fruit stall, and lighter than it looks — keratin over air. Black body, a yellow bib, a bird that follows the architecture.",
    "Not a hornbill. Hornbills are the Old-World cousins with a casque; Keel is a keel-billed toucan of the American canopy. Not a macaw. Quill's bill crushes. Keel's bill carries fruit and makes an entrance.",
    "Keel-billed toucan. The bill is the room. I am behind it.",
  ),
  entry(
    "iguana",
    "Iguana iguana",
    "A green dewlap, a row of spines like a modest saw, and a third eye on the brow that watches the sun. He is a herbivore who treats stillness as a career. The wall is the correct chair.",
    "Not a chameleon — those change on purpose and keep tong-feet. Not a bearded dragon. Not Vesper. Sol is Iguana iguana, the green one, and he will move when the light asks. People also file him with dinosaurs. He declined the extinction.",
    "Green iguana. I blinked. Minutes will not record it.",
  ),
  entry(
    "dragon",
    "kept, not collected",
    "Wings that fold like a letter. Scales that hold heat. Small enough for the mantel, large enough that the room rearranges around the tail. She could be larger. She chooses this.",
    "Sol is the living ornament: green, still, a dewlap, no fire. Vesper is the house's own — not a Komodo, not an iguana with a story, not a dinosaur we kept. Linnaeus does not file her. The mantel does.",
    "Desk dragon. I am the province. The iguana kept the wall.",
  ),
  entry(
    "phoenix",
    "kept in the ash",
    "A bird of ash and return. Gold at the throat, ember at the flight feathers. She does not stay gone. The hearth keeps a place, and she comes back kinder.",
    "Not a peacock. Not Quill with better lighting. Ember is the house relic — the firebird of the old stories, not a pheasant and not a parrot who learned a trick. If she goes, she will not stay gone.",
    "Phoenix. I come back. That is the species.",
  ),
];

export const HOUSE_KEYS = HOUSE_GUIDE.map((g) => g.key);

const BY_KEY = Object.fromEntries(HOUSE_GUIDE.map((g) => [g.key, g]));
const BY_SLUG = Object.fromEntries(HOUSE_GUIDE.map((g) => [g.slug, g]));

export function houseGuideFor(key: string | undefined | null) {
  if (!key) return null;
  return BY_KEY[key] ?? null;
}

export function houseGuideBySlug(slug: string | undefined | null) {
  if (!slug) return null;
  return BY_SLUG[slug] ?? null;
}

export function houseGuideKeys() {
  return HOUSE_GUIDE.map((g) => g.key);
}

/** The living roster minus snakes and the tide, and the guide, must name the same twenty. */
export function houseGuideComplete() {
  const living = ROSTER.filter((r) => !SNAKE_KEYS.includes(r.key) && !SEA_KEYS.includes(r.key) && !GARDEN_KEYS.includes(r.key) && !INSECT_KEYS.includes(r.key) && !BEE_KEYS.includes(r.key) && !FUNGI_KEYS.includes(r.key) && !FAR_KEYS.includes(r.key) && !POND_KEYS.includes(r.key) && !WELL_KEYS.includes(r.key) && !ROOST_KEYS.includes(r.key) && !CORNER_KEYS.includes(r.key) && !WOOD_KEYS.includes(r.key) && !CANOPY_KEYS.includes(r.key) && !STONE_KEYS.includes(r.key) && !CREEK_KEYS.includes(r.key) && !LOG_KEYS.includes(r.key) && !SHORE_KEYS.includes(r.key) && !REEF_KEYS.includes(r.key) && !MEADOW_KEYS.includes(r.key)).map((r) => r.key);
  return living.length === HOUSE_GUIDE.length && living.every((key) => BY_KEY[key]);
}
