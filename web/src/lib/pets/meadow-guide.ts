import { MEADOW_KEYS, MEADOW_ROSTER } from "./meadow";

export type MeadowGuide = {
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

function entry(key: string, latin: string, tell: string, mixup: string, lesson: string): MeadowGuide {
  const roster = MEADOW_ROSTER.find((s) => s.key === key);
  if (!roster) throw new Error(`meadow guide is missing roster for ${key}`);
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

/** Field notes for the ten meadow insects. Literary, short, and meant to be learned on the blotter. */
export const MEADOW_GUIDE: MeadowGuide[] = [
  entry(
    "field_cricket",
    "Gryllus pennsylvanicus",
    "Black on the grass dish, wings raised into a song, a chirp that is a sentence. Fall field cricket. She sits. Then she sings. The dish is a grass she agreed to.",
    "Not Brood. Brood is a periodical cicada, years in the ground, a husk, a burst — not a cricket of the night song. Chirp is Gryllus pennsylvanicus, and the song is the tell. A cricket is not a cicada. The chirp is the species.",
    "Fall field cricket. The song is the tell. Not Brood. A cricket is not a cicada.",
  ),
  entry(
    "katydid",
    "Pterophylla camellifolia",
    "Wings like two leaves, a body that keeps the leaf rim, a still that is the grammar. Northern true katydid. She sits. Then she stills. The rim is a leaf she agreed to.",
    "Not a grasshopper. Vault jumps the grass; Blade stays a leaf, a true katydid, Pterophylla, not Melanoplus. The wings are leaves. She is not a grasshopper. The blade is the species.",
    "Northern true katydid. She is not a grasshopper. The wings are leaves. Not Vault.",
  ),
  entry(
    "grasshopper",
    "Melanoplus differentialis",
    "Barred hind legs, a jump of the grass plate, a vault that leaves the wood. Differential grasshopper. She sits. Then she vaults. The plate is a grass she agreed to.",
    "Not Leap. Leap is a jumping spider of the corner, eight eyes, a leap that is a hunt. Not Hop — Hop is a springtail under the log, a furcula, a hexapod that is not an insect. Not Blade — Blade is a katydid whose wings are leaves. Vault is Melanoplus differentialis, and the jump is the tell. A grasshopper is not a spider. The vault is the species.",
    "Differential grasshopper. A jump of the grass. Not Leap. Not Hop. Not Blade.",
  ),
  entry(
    "swallowtail",
    "Papilio glaucus",
    "Yellow bands on a swallow of a wing, tails like two commas, a banner on the blossom dish. Eastern tiger swallowtail. She sits. Then she banners. The dish is a blossom she agreed to.",
    "Not Milk. Milk is a monarch who earned orange on milkweed, a warning, a migrate. Not Ghost — Ghost is a luna moth of one week, no mouth. Banner is Papilio glaucus, and the bands are the tell. A swallowtail is not a monarch. The yellow is the species.",
    "Eastern tiger swallowtail. Yellow bands. Not Milk. Not Ghost. A swallowtail is not a monarch.",
  ),
  entry(
    "jewelwing",
    "Calopteryx maculata",
    "Black wings, a green body, a hover that folds. Ebony jewelwing. A damselfly. She sits. Then she jewels. The rim is a stream she agreed to.",
    "Not Dart. Dart is a common green darner, a dragonfly who hawks with wings out. Jewel folds. Jewel is Calopteryx maculata, and the black is the tell. A damselfly is not a darner. The jewel is the species.",
    "Ebony jewelwing. A damselfly. Black wings. Not Dart. A damselfly is not a darner.",
  ),
  entry(
    "lacewing",
    "Chrysoperla carnea",
    "Green lace for wings, gold for eyes, a larva that is a lion of aphids. Green lacewing. She sits. Then she laces. The dish is a leaf she agreed to.",
    "Not a moth. Ghost is a luna moth of one week, no mouth; Lace eats, and the larva is the lion. Not Milk. Lace is Chrysoperla carnea, and the lace is the tell. A lacewing is not a moth. The lace is the species.",
    "Green lacewing. Not a moth. The larva is the lion. Not Ghost.",
  ),
  entry(
    "earwig",
    "Forficula auricularia",
    "A pair of cerci at the tail, a raise that is not a sting, a body that keeps the bark dish. European earwig. She sits. Then she raises. The dish is a bark she agreed to.",
    "Not Fold. Fold is a Chinese mantis who waits with a fold, raptorial, a strike. Forceps raises cerci. Not a beetle with a sting. Forceps is Forficula auricularia, and the cerci are the tell. An earwig is not a mantis. The forceps are the species.",
    "European earwig. Cerci, not a sting. Not Fold. An earwig is not a beetle with a sting.",
  ),
  entry(
    "acorn_weevil",
    "Curculio glandium",
    "A snout longer than the thought of a bee, a drill of the acorn cup, a weevil who keeps the nut. Acorn weevil. She sits. Then she drills. The cup is an acorn she agreed to.",
    "Not Auger. Auger is an eastern carpenter bee who bores wood, a bee of the hive. Not Mast — Mast is a white oak of the garden, a tree, not a weevil. Snout is Curculio glandium, and the drill is the tell. A weevil is not a bee. The snout is the species.",
    "Acorn weevil. A drill of an acorn. Not Auger. Not Mast. A weevil is not a bee.",
  ),
  entry(
    "click_beetle",
    "Alaus oculatus",
    "Two false eyes on the back, a click that flips the body, a beetle who does not light. Eyed click beetle. She sits. Then she clicks. The plate is a bark she agreed to.",
    "Not Snap. Snap is a Venus flytrap of the garden, a plant who waits. Not Spark — Spark is a firefly who flashes; Click clicks and does not light. Click is Alaus oculatus, and the click is the tell. A click beetle is not a firefly. The click is the species.",
    "Eyed click beetle. A click, not a snap. Not Snap. Not Spark. A click beetle is not a firefly.",
  ),
  entry(
    "robber_fly",
    "Efferia aestuans",
    "A bristled face, a perch on the grass, a hunt that takes what flies. Robber fly. She sits. Then she hunts. The perch is a grass she agreed to.",
    "Not a bee. Thrum is a bumblebee of the hive, fur, a smaller nest. Not Sip — Sip is a ruby-throated hummingbird of the roost. Not Comb. Rob is Efferia aestuans, a Promachus neighbor, and the hunt is the tell. A robber fly is not a bee. The rob is the species.",
    "Robber fly. A fly that hunts. Not a bee. Not Thrum. Not Sip.",
  ),
];

const BY_KEY = Object.fromEntries(MEADOW_GUIDE.map((g) => [g.key, g]));
const BY_SLUG = Object.fromEntries(MEADOW_GUIDE.map((g) => [g.slug, g]));

export function meadowGuideFor(key: string | undefined | null) {
  if (!key) return null;
  return BY_KEY[key] ?? null;
}

export function meadowGuideBySlug(slug: string | undefined | null) {
  if (!slug) return null;
  return BY_SLUG[slug] ?? null;
}

export function meadowGuideKeys() {
  return MEADOW_GUIDE.map((g) => g.key);
}

/** The roster and the guide must name the same ten. */
export function meadowGuideComplete() {
  return MEADOW_KEYS.length === MEADOW_GUIDE.length && MEADOW_KEYS.every((key) => BY_KEY[key]);
}
