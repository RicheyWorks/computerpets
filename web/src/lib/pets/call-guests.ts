/** Call any of the 220. Groups are the existing dens. Same map as desktop `call-guests.js`. */

export type CallGroup = {
  id: string;
  label: string;
  aliases: string[];
  keys: readonly string[];
};

const HOUSE_KEYS = [
  "red_panda",
  "cat",
  "dog",
  "rabbit",
  "hamster",
  "guinea_pig",
  "turtle",
  "goldfish",
  "budgie",
  "fox",
  "penguin",
  "parrot",
  "ferret",
  "hedgehog",
  "chinchilla",
  "axolotl",
  "toucan",
  "iguana",
  "dragon",
  "phoenix",
] as const;
const SNAKE_KEYS = ["ball_python", "corn_snake", "kingsnake", "green_tree_python", "hognose", "garter", "boa", "milk_snake", "rosy_boa", "carpet_python"] as const;
const SEA_KEYS = ["octopus", "cuttlefish", "nautilus", "moon_jelly", "sea_star", "hermit_crab", "horseshoe_crab", "seahorse", "manta", "moray"] as const;
const GARDEN_KEYS = ["moss", "maidenhair", "ginkgo", "oak", "water_lily", "orchid", "saguaro", "venus_flytrap", "pitcher", "sundew"] as const;
const INSECT_KEYS = ["honeybee", "monarch", "luna", "firefly", "darner", "stick", "carpenter_ant", "ladybird", "mantis", "cicada"] as const;
const BEE_KEYS = ["bumblebee", "carpenter_bee", "mason_bee", "leafcutter", "stingless", "sweat_bee", "mining_bee", "honey_drone", "honey_queen", "honeycomb"] as const;
const POND_KEYS = ["frog", "toad", "newt", "salamander", "caecilian", "crayfish", "pond_snail", "mussel", "leech", "stickleback"] as const;
const ROOST_KEYS = ["crow", "raven", "barn_owl", "red_tail", "chickadee", "robin", "mallard", "canada_goose", "pileated", "hummingbird"] as const;
const CORNER_KEYS = ["orb_weaver", "jumping_spider", "wolf_spider", "tarantula", "widow", "harvestman", "scorpion", "vinegaroon", "tick", "solifuge"] as const;
const WOOD_KEYS = ["deer", "bat", "squirrel", "otter", "raccoon", "skunk", "opossum", "beaver", "porcupine", "black_bear"] as const;
const CANOPY_KEYS = ["sloth", "lemur", "gibbon", "kinkajou", "colugo", "flying_squirrel", "howler", "tarsier", "potto", "koala"] as const;
const STONE_KEYS = ["gecko", "anole", "skink", "chameleon", "horned_lizard", "alligator", "crocodile", "snapper", "box_turtle", "tuatara"] as const;
const CREEK_KEYS = ["bass", "brook_trout", "catfish", "bluegill", "perch", "pike", "walleye", "paddlefish", "lamprey", "american_eel"] as const;
const LOG_KEYS = ["house_centipede", "millipede", "pillbug", "earthworm", "velvet_worm", "springtail", "tardigrade", "planarian", "nematode", "amphipod"] as const;
const SHORE_KEYS = ["fiddler_crab", "ghost_crab", "limpet", "barnacle", "chiton", "periwinkle", "sand_dollar", "sea_urchin", "knobbed_whelk", "lugworm"] as const;
const REEF_KEYS = ["brain_coral", "anemone", "clownfish", "parrotfish", "cleaner_shrimp", "sea_cucumber", "lionfish", "giant_clam", "eagle_ray", "grouper"] as const;
const MEADOW_KEYS = ["field_cricket", "katydid", "grasshopper", "swallowtail", "jewelwing", "lacewing", "earwig", "acorn_weevil", "click_beetle", "robber_fly"] as const;
const FUNGI_KEYS = ["oyster", "fly_agaric", "morel", "chanterelle", "turkey_tail", "lions_mane", "puffball", "chicken_of_woods", "yeast", "lichen"] as const;
const WELL_KEYS = ["paramecium", "amoeba", "euglena", "volvox", "diatom", "kelp", "chlamydomonas", "stentor", "coli", "haloarchaea"] as const;
const FAR_KEYS = ["photovore", "choir", "nimbus", "silica", "terminator", "nexus", "halovore", "magneton", "umbral", "cyst"] as const;
const GRID_KEYS = ["cyber_dragon", "volt_dragon", "trace_dragon", "flux_dragon", "spark_dragon", "ion_dragon", "gauss_dragon", "relay_dragon", "fuse_dragon", "ground_dragon"] as const;

/** Same dens as the house rooms. Aliases are words the rooms already use. */
export const CALL_GROUPS: CallGroup[] = [
  { id: "house", label: "House", aliases: ["house", "study", "companions"], keys: HOUSE_KEYS },
  { id: "snakes", label: "Snakes", aliases: ["snakes", "snake", "den"], keys: SNAKE_KEYS },
  { id: "tide", label: "Tide", aliases: ["tide", "sea", "marine"], keys: SEA_KEYS },
  { id: "garden", label: "Garden", aliases: ["garden", "plant", "plants"], keys: GARDEN_KEYS },
  { id: "hive", label: "Hive", aliases: ["hive", "insect", "insects", "bee", "bees"], keys: [...INSECT_KEYS, ...BEE_KEYS] },
  { id: "pond", label: "Pond", aliases: ["pond"], keys: POND_KEYS },
  { id: "roost", label: "Roost", aliases: ["roost", "bird", "birds"], keys: ROOST_KEYS },
  { id: "corner", label: "Corner", aliases: ["corner"], keys: CORNER_KEYS },
  { id: "wood", label: "Wood", aliases: ["wood"], keys: WOOD_KEYS },
  { id: "canopy", label: "Canopy", aliases: ["canopy"], keys: CANOPY_KEYS },
  { id: "stone", label: "Stone", aliases: ["stone"], keys: STONE_KEYS },
  { id: "creek", label: "Creek", aliases: ["creek"], keys: CREEK_KEYS },
  { id: "log", label: "Log", aliases: ["log"], keys: LOG_KEYS },
  { id: "shore", label: "Shore", aliases: ["shore"], keys: SHORE_KEYS },
  { id: "reef", label: "Reef", aliases: ["reef"], keys: REEF_KEYS },
  { id: "meadow", label: "Meadow", aliases: ["meadow"], keys: MEADOW_KEYS },
  { id: "cellar", label: "Cellar", aliases: ["cellar", "fungi", "fungus"], keys: FUNGI_KEYS },
  { id: "well", label: "Well", aliases: ["well"], keys: WELL_KEYS },
  { id: "far", label: "Far", aliases: ["far", "far den"], keys: FAR_KEYS },
  { id: "grid", label: "Grid", aliases: ["grid"], keys: GRID_KEYS },
];

export const FLY_BIRD_KEY = "hummingbird";
export const MIN_STAY_S = 24;
export const CALL_EMPTY = "no guest from that look-up";

export type CallGuest = {
  key: string;
  slug?: string;
  name?: string;
  speciesLabel?: string;
  species?: string;
};

export type CalledWalker = {
  key: string;
  phase: "in" | "stay" | "wander" | "leave" | "gone";
  t: number;
  age: number;
  x: number;
  target: number;
  facing: 1 | -1;
  dismissed: boolean;
};

export function norm(text: unknown) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function groups() {
  return CALL_GROUPS.map((g) => ({ id: g.id, label: g.label, aliases: g.aliases.slice(), keys: g.keys.slice() }));
}

export function groupById(id: string | null | undefined) {
  return CALL_GROUPS.find((g) => g.id === id) ?? null;
}

export function matchGroup(query: unknown) {
  const q = norm(query);
  if (!q) return null;
  return CALL_GROUPS.find((g) => g.id === q || norm(g.label) === q || g.aliases.some((a) => a === q)) ?? null;
}

function guestFields(row: CallGuest | null | undefined) {
  if (!row || typeof row !== "object") return null;
  const key = String(row.key || "");
  if (!key) return null;
  return {
    key,
    slug: String(row.slug || ""),
    name: String(row.name || ""),
    speciesLabel: String(row.speciesLabel || row.species || ""),
  };
}

export function matchOneGuest(query: unknown, roster: CallGuest[] | null | undefined) {
  const q = norm(query);
  if (!q || !Array.isArray(roster)) return null;
  const rows = roster.map(guestFields).filter((g): g is NonNullable<ReturnType<typeof guestFields>> => !!g);
  const exact = rows.find(
    (g) => norm(g.key) === q || norm(g.slug) === q || norm(g.name) === q || norm(g.speciesLabel) === q,
  );
  if (exact) return exact;
  const starts = rows.filter((g) => norm(g.name).startsWith(q) || norm(g.slug).startsWith(q) || norm(g.key).startsWith(q));
  if (starts.length === 1) return starts[0]!;
  return null;
}

export function matchCall(query: unknown, roster: CallGuest[] | null | undefined) {
  const q = norm(query);
  if (!q) return [];
  const group = matchGroup(q);
  if (group) return group.keys.slice();
  const one = matchOneGuest(q, roster);
  if (one) return [one.key];
  return [];
}

export function callKeys(query: unknown, roster: CallGuest[] | null | undefined, groupId?: string | null) {
  const fromQuery = matchCall(query, roster);
  if (fromQuery.length) return fromQuery;
  if (groupId) {
    const g = groupById(groupId);
    return g ? g.keys.slice() : [];
  }
  return [];
}

export function walkersOf(keys: string[] | null | undefined, hostKey?: string | null) {
  const list = Array.isArray(keys) ? keys.filter((k, i, all) => k && all.indexOf(k) === i) : [];
  return list.filter((k) => k !== hostKey && k !== FLY_BIRD_KEY);
}

export function shouldFly(keys: string[] | null | undefined, hostKey?: string | null) {
  const list = Array.isArray(keys) ? keys : [];
  return list.includes(FLY_BIRD_KEY) && hostKey !== FLY_BIRD_KEY;
}

export function beginCalled(key: string, width: number, slot: number, of: number): CalledWalker {
  const w = Math.max(320, width || 800);
  const n = Math.max(1, of || 1);
  const dest = 48 + slot * Math.max(64, (w - 200) / n);
  return {
    key,
    phase: "in",
    t: 0,
    age: 0,
    x: w + 24,
    target: dest,
    facing: -1,
    dismissed: false,
  };
}

export function dismissCalled(guest: CalledWalker | null | undefined) {
  if (!guest) return guest;
  return { ...guest, phase: "leave" as const, target: -160, dismissed: true };
}

export function stepCalled(guest: CalledWalker, dt: number, width: number): CalledWalker {
  if (!guest || guest.phase === "gone") return guest;
  const next = { ...guest, t: guest.t + Math.max(0, dt), age: guest.age + Math.max(0, dt) };
  const remaining = next.target - next.x;
  if (Math.abs(remaining) > 2) {
    next.facing = remaining >= 0 ? 1 : -1;
    next.x += next.facing * 90 * Math.max(0, dt);
    return next;
  }
  next.x = next.target;
  if (next.phase === "in") return { ...next, phase: "stay", t: 0 };
  if (next.phase === "stay") {
    if (next.t >= 3.2) {
      const w = Math.max(320, width || 800);
      const dest = 48 + Math.random() * Math.max(80, w - 200);
      return { ...next, phase: "wander", t: 0, target: dest, facing: dest >= next.x ? 1 : -1 };
    }
    return next;
  }
  if (next.phase === "wander") {
    if (next.t >= 2.4) return { ...next, phase: "stay", t: 0 };
    return next;
  }
  if (next.phase === "leave") {
    if (next.x <= -140 || next.age >= MIN_STAY_S * 8) return { ...next, phase: "gone" };
    return next;
  }
  return next;
}

export function stillVisible(guest: CalledWalker | null | undefined) {
  return !!(guest && guest.phase !== "gone");
}
