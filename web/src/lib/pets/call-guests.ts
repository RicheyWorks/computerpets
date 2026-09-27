/** Call any of the 221. Groups are the existing dens. Same map as desktop `call-guests.js`. */

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
const WOOD_KEYS = ["deer", "bat", "squirrel", "otter", "raccoon", "skunk", "opossum", "beaver", "porcupine", "black_bear", "capybara"] as const;
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
export const PERCH_BIRD_KEY = "robin";
export const PERCH_HOST = "red_panda";
export const ROBIN_SONG = "I sang. The worm can wait.";
export const SONG_EVERY_S = 8;
export const PERCH_ON_S = 0.72;
const SHOULDER_X = 36;
const SHOULDER_LIFT = 36;
export const MIN_STAY_S = 24;
export const CALL_EMPTY = "no guest from that look-up";
export const MEET_DEE_KEY = "chickadee";
export const MEET_CAT_KEY = "cat";
export const MEET_HOST = "red_panda";
export const PEER_ROBIN_KEY = "robin";
export const WINDOW_SIT_KEY = "cat";
export const DEE_RUI_LINE = "Dee-dee. I saw the red one.";
export const DEE_ROBIN_LINE = "Dee. You found the lawn first.";
export const CAT_RUI_LINE = "I sat. You were already here.";
export const CAT_SILL_LINE = "The sill will do.";
export const GRASS_LIE_KEY = "cat";
export const CAT_GRASS_LINE = "The moss will do.";
export const GRASS_STAY_S = 4.8;
export const MEET_DOG_KEY = "dog";
export const MEET_CROW_KEY = "crow";
export const PEER_PIP_KEY = "dog";
export const WINDOW_CAP_KEY = "crow";
export const PIP_RUI_LINE = "I walked over. You were the red one.";
export const SOOT_RUI_LINE = "Caw. I found the red one.";
export const SOOT_CAP_LINE = "The cap will do.";
export const CAT_PIP_LINE = "I sat. You were already walking.";
export const MEET_RABBIT_KEY = "rabbit";
export const MEET_RAVEN_KEY = "raven";
export const WINDOW_TRANSOM_KEY = "raven";
export const THIMBLE_RUI_LINE = "I thumped. You were the red one.";
export const THIMBLE_PIP_LINE = "I thumped. You were already walking.";
export const WEDGE_RUI_LINE = "I croaked. You were the red one.";
export const WEDGE_TRANSOM_LINE = "The transom will do.";
const CROW_HOP = 16;
const CROW_LIFT = 16;
const RAVEN_HOP = 22;
const RAVEN_LIFT = 20;
const THUMP_HOP = 8;
export const MEET_ON_S = 0.64;
export const TELL_S = 1.6;
const HOP_LIFT = 10;
const BESIDE_X = 52;
const NEAR_X = 44;

export type CallGuest = {
  key: string;
  slug?: string;
  name?: string;
  speciesLabel?: string;
  species?: string;
};

export type CalledFlags = {
  hidden?: boolean;
  hostKey?: string;
  hostSleeping?: boolean;
  hostX?: number;
  hostLift?: number;
  hostFacing?: 1 | -1;
  peers?: { key: string; x?: number; lift?: number; phase?: string }[];
  windowBound?: { x: number; lift: number; kind?: string } | null;
  capBound?: { x: number; lift: number; kind?: string } | null;
  transomBound?: { x: number; lift: number; kind?: string } | null;
  grassBound?: { x: number; lift: number; kind?: string } | null;
};

export type CalledWalker = {
  key: string;
  phase: "in" | "stay" | "wander" | "leave" | "gone" | "approach-perch" | "perch" | "approach-meet" | "meet" | "approach-bound" | "bound";
  t: number;
  age: number;
  x: number;
  lift?: number;
  target: number;
  facing: 1 | -1;
  dismissed: boolean;
  fromX?: number;
  fromLift?: number;
  toX?: number;
  toLift?: number;
  sungAt?: number;
  frame?: number;
  meetKind?: "rui" | "peer" | "bound";
  boundKind?: string;
  told?: boolean;
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
  return list.filter((k) => k !== hostKey && k !== FLY_BIRD_KEY && k !== PERCH_BIRD_KEY);
}

export function shouldFly(keys: string[] | null | undefined, hostKey?: string | null) {
  const list = Array.isArray(keys) ? keys : [];
  return list.includes(FLY_BIRD_KEY) && hostKey !== FLY_BIRD_KEY;
}

export function shouldRobinFly(keys: string[] | null | undefined, hostKey?: string | null) {
  const list = Array.isArray(keys) ? keys : [];
  return list.includes(PERCH_BIRD_KEY) && hostKey !== PERCH_BIRD_KEY;
}

export const AUTO_MEET_KEYS = [MEET_DEE_KEY, MEET_CAT_KEY, MEET_DOG_KEY, MEET_CROW_KEY, MEET_RABBIT_KEY, MEET_RAVEN_KEY];

export function nextAutoMeet(present: Array<string | { key?: string }> | null | undefined, hostKey?: string | null) {
  const have = new Set((Array.isArray(present) ? present : []).map((row) => (typeof row === "string" ? row : row && row.key)).filter(Boolean));
  for (const key of AUTO_MEET_KEYS) {
    if (key !== hostKey && !have.has(key)) return key;
  }
  return null;
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
    lift: 0,
    target: dest,
    facing: -1,
    dismissed: false,
    sungAt: 0,
  };
}

export function dismissCalled(guest: CalledWalker): CalledWalker;
export function dismissCalled(guest: CalledWalker | null | undefined): CalledWalker | null | undefined;
export function dismissCalled(guest: CalledWalker | null | undefined): CalledWalker | null | undefined {
  if (!guest) return guest;
  return { ...guest, phase: "leave" as const, target: -160, dismissed: true, lift: guest.lift || 0 };
}

export function shouldPerchCalled(key: string, flags?: CalledFlags) {
  if (!flags || flags.hidden) return false;
  if (key !== PERCH_BIRD_KEY) return false;
  if (flags.hostKey && flags.hostKey !== PERCH_HOST) return false;
  return !!flags.hostSleeping;
}

export function perchPoint(hostX?: number, hostFacing?: 1 | -1, hostLift?: number) {
  const face = hostFacing != null && hostFacing < 0 ? -1 : 1;
  return {
    x: (hostX || 0) + face * SHOULDER_X,
    lift: (hostLift || 0) + SHOULDER_LIFT,
  };
}

function goCalledPerch(guest: CalledWalker, flags?: CalledFlags): CalledWalker {
  const hold = perchPoint(flags?.hostX, flags?.hostFacing, flags?.hostLift);
  return {
    ...guest,
    phase: "approach-perch",
    t: 0,
    target: hold.x,
    fromX: guest.x,
    fromLift: guest.lift || 0,
    toX: hold.x,
    toLift: hold.lift,
    facing: hold.x >= guest.x ? 1 : -1,
  };
}

export type CalledPeer = { key: string; x?: number; lift?: number; phase?: string };
export type WindowBound = { x: number; lift: number; kind?: string };

export function peerOf(flags: CalledFlags | null | undefined, key: string) {
  const peers = flags && Array.isArray(flags.peers) ? flags.peers : [];
  for (const p of peers) {
    if (!p || p.key !== key) continue;
    if (p.phase === "gone" || p.phase === "leave") continue;
    return p;
  }
  return null;
}

export function shouldMeetRui(key: string, flags?: CalledFlags) {
  if (!flags || flags.hidden) return false;
  if (key !== MEET_DEE_KEY && key !== MEET_CAT_KEY && key !== MEET_DOG_KEY && key !== MEET_CROW_KEY && key !== MEET_RABBIT_KEY && key !== MEET_RAVEN_KEY) return false;
  if (flags.hostKey && flags.hostKey !== MEET_HOST) return false;
  if (key === MEET_DEE_KEY && peerOf(flags, PEER_ROBIN_KEY)) return false;
  if (key === MEET_CAT_KEY && peerOf(flags, PEER_PIP_KEY)) return false;
  if (key === MEET_RABBIT_KEY && peerOf(flags, PEER_PIP_KEY)) return false;
  return true;
}

export function shouldMeetPeer(key: string, flags?: CalledFlags) {
  if (!flags || flags.hidden) return false;
  if (key === MEET_DEE_KEY) return !!peerOf(flags, PEER_ROBIN_KEY);
  if (key === MEET_CAT_KEY) {
    if (peerOf(flags, PEER_ROBIN_KEY) && peerOf(flags, MEET_DEE_KEY)) return false;
    return !!peerOf(flags, PEER_PIP_KEY);
  }
  if (key === MEET_RABBIT_KEY) {
    if (peerOf(flags, MEET_CAT_KEY)) return false;
    return !!peerOf(flags, PEER_PIP_KEY);
  }
  return false;
}

export function shouldSitGrass(key: string, flags?: CalledFlags) {
  if (!flags || flags.hidden) return false;
  if (key !== GRASS_LIE_KEY) return false;
  const b = flags.grassBound;
  return !!(b && Number.isFinite(b.x) && Number.isFinite(b.lift));
}

export function shouldSitBound(key: string, flags?: CalledFlags) {
  if (!flags || flags.hidden) return false;
  if (key === WINDOW_SIT_KEY) {
    if (shouldSitGrass(key, flags)) return true;
    const b = flags.windowBound;
    return !!(b && Number.isFinite(b.x) && Number.isFinite(b.lift));
  }
  if (key === WINDOW_CAP_KEY) {
    const b = flags.capBound;
    return !!(b && Number.isFinite(b.x) && Number.isFinite(b.lift));
  }
  if (key === WINDOW_TRANSOM_KEY) {
    const b = flags.transomBound;
    return !!(b && Number.isFinite(b.x) && Number.isFinite(b.lift));
  }
  return false;
}

export function meetPoint(flags?: CalledFlags, key?: string) {
  const hostX = flags && flags.hostX != null ? flags.hostX : 0;
  const face = flags && flags.hostFacing != null && flags.hostFacing < 0 ? -1 : 1;
  if (key === MEET_DEE_KEY) return { x: hostX + face * NEAR_X, lift: 8 };
  if (key === MEET_CROW_KEY) return { x: hostX + face * NEAR_X, lift: CROW_LIFT };
  if (key === MEET_RAVEN_KEY) return { x: hostX + face * NEAR_X, lift: RAVEN_LIFT };
  if (key === MEET_DOG_KEY) return { x: hostX + face * BESIDE_X, lift: 0 };
  if (key === MEET_RABBIT_KEY) return { x: hostX - face * BESIDE_X, lift: 0 };
  return { x: hostX - face * BESIDE_X, lift: 0 };
}

export function peerPoint(flags?: CalledFlags, guestKey?: string) {
  if (guestKey === MEET_CAT_KEY || guestKey === MEET_RABBIT_KEY) {
    const p = peerOf(flags, PEER_PIP_KEY);
    if (!p) return { x: 200, lift: 0 };
    return { x: (p.x || 0) + 48, lift: 0 };
  }
  const p = peerOf(flags, PEER_ROBIN_KEY);
  if (!p) return { x: 200, lift: 8 };
  return { x: (p.x || 0) + 36, lift: (p.lift || 0) + 8 };
}

function boundPoint(flags?: CalledFlags, key?: string) {
  if (key === WINDOW_SIT_KEY || key === MEET_CAT_KEY || key === GRASS_LIE_KEY) {
    const g = flags && flags.grassBound;
    if (g && Number.isFinite(g.x) && Number.isFinite(g.lift)) return { x: g.x, lift: g.lift, kind: g.kind || "grass" };
  }
  if (key === WINDOW_TRANSOM_KEY || key === MEET_RAVEN_KEY) {
    const b = flags && flags.transomBound;
    if (!b) return { x: 120, lift: 72, kind: "transom" };
    return { x: b.x, lift: b.lift, kind: b.kind || "transom" };
  }
  if (key === WINDOW_CAP_KEY || key === MEET_CROW_KEY) {
    const b = flags && flags.capBound;
    if (!b) return { x: 120, lift: 48, kind: "drip-cap" };
    return { x: b.x, lift: b.lift, kind: b.kind || "drip-cap" };
  }
  const b = flags && flags.windowBound;
  if (!b) return { x: 120, lift: 18, kind: "sill" };
  return { x: b.x, lift: b.lift, kind: b.kind || "sill" };
}

export function windowSitBound(win: { x?: number; y?: number; width?: number; height?: number } | null | undefined, work?: { height?: number; floorLift?: number } | null) {
  if (!win || typeof win !== "object") return null;
  const w = Number(win.width);
  const h = Number(win.height);
  if (!(w > 8) || !(h > 8)) return null;
  const workH = Math.max(240, (work && work.height) || 800);
  const floor = (work && work.floorLift) || 0;
  const x0 = Number(win.x);
  const y0 = Number(win.y);
  if (![x0, y0, w, h].every(Number.isFinite)) return null;
  const bottom = y0 + h;
  let lift = workH - bottom + 16;
  if (!Number.isFinite(lift)) return null;
  lift = Math.max(floor + 12, Math.min(workH * 0.42, lift));
  return { kind: "sill" as const, x: x0 + w * 0.38, lift };
}

export function firstWindowBound(windows: Array<{ x?: number; y?: number; width?: number; height?: number }> | null | undefined, work?: { width?: number; height?: number; floorLift?: number } | null) {
  const list = Array.isArray(windows) ? windows : [];
  for (const win of list) {
    const b = windowSitBound(win, work);
    if (b) return b;
  }
  return null;
}

export function windowCapBound(win: { x?: number; y?: number; width?: number; height?: number } | null | undefined, work?: { width?: number; height?: number; floorLift?: number } | null) {
  if (!win || typeof win !== "object") return null;
  const w = Number(win.width);
  const h = Number(win.height);
  if (!(w > 8) || !(h > 8)) return null;
  const workH = Math.max(240, (work && work.height) || 800);
  const workW = Math.max(320, (work && work.width) || 1400);
  const floor = (work && work.floorLift) || 0;
  const x0 = Number(win.x);
  const y0 = Number(win.y);
  if (![x0, y0, w, h].every(Number.isFinite)) return null;
  const cap = 22;
  const gripY = y0 - cap;
  let lift = workH - floor - gripY;
  if (!Number.isFinite(lift)) return null;
  lift = Math.max(floor + 36, Math.min(workH * 0.72, lift));
  const chimneyLeft = x0 + w / 2 < workW / 2;
  const x = chimneyLeft ? x0 + 10 : x0 + w - 10;
  return { kind: "drip-cap" as const, x, lift };
}

export function firstCapBound(windows: Array<{ x?: number; y?: number; width?: number; height?: number }> | null | undefined, work?: { width?: number; height?: number; floorLift?: number } | null) {
  const list = Array.isArray(windows) ? windows : [];
  for (const win of list) {
    const b = windowCapBound(win, work);
    if (b) return b;
  }
  return null;
}

export function windowTransomBound(win: { x?: number; y?: number; width?: number; height?: number } | null | undefined, work?: { width?: number; height?: number; floorLift?: number } | null) {
  if (!win || typeof win !== "object") return null;
  const w = Number(win.width);
  const h = Number(win.height);
  if (!(w > 8) || !(h > 8)) return null;
  const workH = Math.max(240, (work && work.height) || 800);
  const floor = (work && work.floorLift) || 0;
  const x0 = Number(win.x);
  const y0 = Number(win.y);
  if (![x0, y0, w, h].every(Number.isFinite)) return null;
  const rafter = 16;
  const gripY = y0 + rafter;
  let lift = workH - floor - gripY;
  if (!Number.isFinite(lift)) return null;
  lift = Math.max(floor + 48, Math.min(workH * 0.82, lift));
  return { kind: "transom" as const, x: x0 + w * 0.5, lift };
}

export function firstTransomBound(windows: Array<{ x?: number; y?: number; width?: number; height?: number }> | null | undefined, work?: { width?: number; height?: number; floorLift?: number } | null) {
  const list = Array.isArray(windows) ? windows : [];
  for (const win of list) {
    const b = windowTransomBound(win, work);
    if (b) return b;
  }
  return null;
}

function goCalledMeet(guest: CalledWalker, flags: CalledFlags | undefined, kind: "rui" | "peer"): CalledWalker {
  const hold = kind === "peer" ? peerPoint(flags, guest.key) : meetPoint(flags, guest.key);
  return {
    ...guest,
    phase: "approach-meet",
    meetKind: kind,
    t: 0,
    target: hold.x,
    fromX: guest.x,
    fromLift: guest.lift || 0,
    toX: hold.x,
    toLift: hold.lift,
    facing: hold.x >= guest.x ? 1 : -1,
    told: false,
  };
}

function goCalledBound(guest: CalledWalker, flags?: CalledFlags): CalledWalker {
  const hold = boundPoint(flags, guest.key);
  return {
    ...guest,
    phase: "approach-bound",
    meetKind: "bound",
    t: 0,
    target: hold.x,
    fromX: guest.x,
    fromLift: guest.lift || 0,
    toX: hold.x,
    toLift: hold.lift,
    facing: hold.x >= guest.x ? 1 : -1,
    told: false,
    boundKind: hold.kind,
  };
}

function meetBusy(phase: CalledWalker["phase"]) {
  return (
    phase === "approach-meet" ||
    phase === "meet" ||
    phase === "approach-bound" ||
    phase === "bound" ||
    phase === "approach-perch" ||
    phase === "perch" ||
    phase === "leave" ||
    phase === "gone"
  );
}

export function shouldTell(guest: CalledWalker | null | undefined) {
  if (!guest || guest.told) return false;
  if (guest.phase !== "meet" && guest.phase !== "bound") return false;
  return true;
}

export function tellLine(guest: CalledWalker | null | undefined) {
  if (!guest) return "";
  if (guest.phase === "bound" || guest.meetKind === "bound") {
    if (guest.boundKind === "grass" || guest.boundKind === "pad") return CAT_GRASS_LINE;
    if (guest.key === MEET_CROW_KEY || guest.key === WINDOW_CAP_KEY) return SOOT_CAP_LINE;
    if (guest.key === MEET_RAVEN_KEY || guest.key === WINDOW_TRANSOM_KEY) return WEDGE_TRANSOM_LINE;
    return CAT_SILL_LINE;
  }
  if (guest.key === MEET_DEE_KEY && guest.meetKind === "peer") return DEE_ROBIN_LINE;
  if (guest.key === MEET_DEE_KEY) return DEE_RUI_LINE;
  if (guest.key === MEET_CAT_KEY && guest.meetKind === "peer") return CAT_PIP_LINE;
  if (guest.key === MEET_CAT_KEY) return CAT_RUI_LINE;
  if (guest.key === MEET_RABBIT_KEY && guest.meetKind === "peer") return THIMBLE_PIP_LINE;
  if (guest.key === MEET_RABBIT_KEY) return THIMBLE_RUI_LINE;
  if (guest.key === MEET_DOG_KEY) return PIP_RUI_LINE;
  if (guest.key === MEET_CROW_KEY) return SOOT_RUI_LINE;
  if (guest.key === MEET_RAVEN_KEY) return WEDGE_RUI_LINE;
  return "";
}

export function markTold(guest: CalledWalker): CalledWalker {
  return { ...guest, told: true };
}

export function shouldSing(guest: CalledWalker | null | undefined) {
  if (!guest || guest.key !== PERCH_BIRD_KEY || guest.phase !== "perch") return false;
  return guest.age + 0.0001 >= (guest.sungAt || 0);
}

export function markSung(guest: CalledWalker): CalledWalker {
  return { ...guest, sungAt: (guest.age || 0) + SONG_EVERY_S };
}

export function stepCalled(guest: CalledWalker, dt: number, width: number, flags?: CalledFlags): CalledWalker {
  if (!guest || guest.phase === "gone") return guest;
  const next: CalledWalker = { ...guest, t: guest.t + Math.max(0, dt), age: guest.age + Math.max(0, dt), lift: guest.lift || 0 };
  const perchNow = shouldPerchCalled(next.key, flags);
  if (perchNow && next.phase !== "approach-perch" && next.phase !== "perch" && next.phase !== "leave" && next.phase !== "gone") {
    return goCalledPerch(next, flags);
  }
  if (!perchNow && (next.phase === "approach-perch" || next.phase === "perch")) {
    return { ...next, phase: "stay", t: 0, lift: 0, target: next.x };
  }

  const meetPeer = shouldMeetPeer(next.key, flags);
  const meetRui = shouldMeetRui(next.key, flags);
  const sitBound = shouldSitBound(next.key, flags);
  if (!meetBusy(next.phase)) {
    if (meetPeer) return goCalledMeet(next, flags, "peer");
    if (meetRui) return goCalledMeet(next, flags, "rui");
    if (sitBound) return goCalledBound(next, flags);
  }
  if ((next.phase === "approach-meet" || next.phase === "meet") && !meetPeer && !meetRui) {
    if (sitBound && (next.key === WINDOW_SIT_KEY || next.key === WINDOW_CAP_KEY || next.key === WINDOW_TRANSOM_KEY)) return goCalledBound(next, flags);
    return { ...next, phase: "stay", t: 0, lift: 0, target: next.x };
  }
  if ((next.phase === "approach-bound" || next.phase === "bound") && !sitBound) {
    return { ...next, phase: "stay", t: 0, lift: 0, target: next.x };
  }

  if (next.phase === "approach-perch") {
    const hold = perchPoint(flags?.hostX, flags?.hostFacing, flags?.hostLift);
    next.target = hold.x;
    next.toX = hold.x;
    next.toLift = hold.lift;
    const u = Math.min(1, next.t / PERCH_ON_S);
    const fromX = next.fromX != null ? next.fromX : next.x;
    const fromLift = next.fromLift != null ? next.fromLift : next.lift || 0;
    next.x = fromX + (hold.x - fromX) * u;
    next.lift = fromLift + (hold.lift - fromLift) * u;
    next.facing = hold.x >= fromX ? 1 : -1;
    if (u >= 1) return { ...next, phase: "perch", t: 0, x: hold.x, lift: hold.lift, target: hold.x };
    return next;
  }
  if (next.phase === "perch") {
    const hold = perchPoint(flags?.hostX, flags?.hostFacing, flags?.hostLift);
    next.x = hold.x;
    next.lift = hold.lift;
    next.target = hold.x;
    next.facing = flags?.hostFacing != null && flags.hostFacing < 0 ? -1 : 1;
    return next;
  }

  if (next.phase === "approach-meet") {
    const hold = next.meetKind === "peer" ? peerPoint(flags, next.key) : meetPoint(flags, next.key);
    next.target = hold.x;
    next.toX = hold.x;
    next.toLift = hold.lift;
    const u = Math.min(1, next.t / MEET_ON_S);
    const fromX = next.fromX != null ? next.fromX : next.x;
    const fromLift = next.fromLift != null ? next.fromLift : next.lift || 0;
    const hop = next.key === MEET_DEE_KEY
      ? Math.abs(Math.sin(next.t * 16)) * HOP_LIFT * (1 - u)
      : next.key === MEET_CROW_KEY
        ? Math.abs(Math.sin(next.t * 14)) * CROW_HOP * (1 - u)
        : next.key === MEET_RAVEN_KEY
          ? Math.abs(Math.sin(next.t * 11)) * RAVEN_HOP * (1 - u)
          : next.key === MEET_RABBIT_KEY
            ? Math.abs(Math.sin(next.t * 10)) * THUMP_HOP * (1 - u)
            : 0;
    next.x = fromX + (hold.x - fromX) * u;
    next.lift = fromLift + (hold.lift - fromLift) * u + hop;
    next.facing = hold.x >= fromX ? 1 : -1;
    if (u >= 1) return { ...next, phase: "meet", t: 0, x: hold.x, lift: hold.lift, target: hold.x };
    return next;
  }
  if (next.phase === "meet") {
    const hold = next.meetKind === "peer" ? peerPoint(flags, next.key) : meetPoint(flags, next.key);
    next.x = hold.x;
    next.lift = hold.lift;
    next.target = hold.x;
    if (next.t >= TELL_S) {
      if (next.meetKind === "rui" && (next.key === WINDOW_SIT_KEY || next.key === WINDOW_CAP_KEY || next.key === WINDOW_TRANSOM_KEY) && sitBound) return goCalledBound(next, flags);
      return dismissCalled(next);
    }
    return next;
  }
  if (next.phase === "approach-bound") {
    const hold = boundPoint(flags, next.key);
    next.target = hold.x;
    next.toX = hold.x;
    next.toLift = hold.lift;
    const u = Math.min(1, next.t / MEET_ON_S);
    const fromX = next.fromX != null ? next.fromX : next.x;
    const fromLift = next.fromLift != null ? next.fromLift : next.lift || 0;
    next.x = fromX + (hold.x - fromX) * u;
    next.lift = fromLift + (hold.lift - fromLift) * u;
    next.facing = hold.x >= fromX ? 1 : -1;
    if (u >= 1) return { ...next, phase: "bound", t: 0, x: hold.x, lift: hold.lift, target: hold.x };
    return next;
  }
  if (next.phase === "bound") {
    const hold = boundPoint(flags, next.key);
    next.x = hold.x;
    const bat = next.key === GRASS_LIE_KEY && (hold.kind === "grass" || hold.kind === "pad") && next.t > 1.1 && next.t < 2.4
      ? Math.abs(Math.sin(next.t * 9)) * 7
      : 0;
    next.lift = hold.lift + bat;
    next.target = hold.x;
    next.boundKind = hold.kind;
    const stay = hold.kind === "grass" || hold.kind === "pad" ? GRASS_STAY_S : TELL_S;
    if (next.t >= stay) return dismissCalled(next)!;
    return next;
  }

  const remaining = next.target - next.x;
  if (Math.abs(remaining) > 2) {
    next.facing = remaining >= 0 ? 1 : -1;
    next.x += next.facing * 90 * Math.max(0, dt);
    next.lift = 0;
    return next;
  }
  next.x = next.target;
  next.lift = 0;
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


export type CalledSprites = { sit?: string[] | null; idle?: string[] | null; walk?: string[] | null };

export function poseFrames(guest: CalledWalker | null | undefined, sprites?: CalledSprites | null) {
  const pack = sprites && typeof sprites === "object" ? sprites : {};
  const sit = Array.isArray(pack.sit) ? pack.sit.filter(Boolean) : [];
  const idle = Array.isArray(pack.idle) ? pack.idle.filter(Boolean) : [];
  const walk = Array.isArray(pack.walk) ? pack.walk.filter(Boolean) : [];
  if (guest && (guest.phase === "perch" || guest.phase === "approach-perch" || guest.phase === "meet" || guest.phase === "bound")) {
    if (sit.length) return sit;
    if (idle.length) return idle;
  }
  if (walk.length) return walk;
  if (idle.length) return idle;
  if (sit.length) return sit;
  return [];
}

export function poseSrc(guest: CalledWalker | null | undefined, sprites?: CalledSprites | null) {
  const frames = poseFrames(guest, sprites);
  if (!frames.length) return "";
  const i = Math.abs(guest?.frame || 0) % frames.length;
  return frames[i] || "";
}
