/** Call any of the 220. Groups are the existing dens. Same map as desktop `call-guests.js`. */
import { ROOMS, type Room } from "./rooms";

export type CallGroup = {
  id: string;
  label: string;
  aliases: string[];
  keys: readonly string[];
};

/** Words the rooms already use. Not new taxa. */
const ALIASES: Record<string, string[]> = {
  house: ["house", "study", "companions"],
  snakes: ["snakes", "snake", "den"],
  tide: ["tide", "sea", "marine"],
  garden: ["garden", "plant", "plants"],
  hive: ["hive", "insect", "insects", "bee", "bees"],
  pond: ["pond"],
  roost: ["roost", "bird", "birds"],
  corner: ["corner"],
  wood: ["wood"],
  canopy: ["canopy"],
  stone: ["stone"],
  creek: ["creek"],
  log: ["log"],
  shore: ["shore"],
  reef: ["reef"],
  meadow: ["meadow"],
  cellar: ["cellar", "fungi", "fungus"],
  well: ["well"],
  far: ["far", "far den"],
  grid: ["grid"],
};

export const CALL_GROUPS: CallGroup[] = ROOMS.map((room: Room) => ({
  id: room.id,
  label: room.label,
  aliases: ALIASES[room.id] ?? [room.id, room.label.toLowerCase()],
  keys: room.keys,
}));

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
  if (groupId) {
    const g = groupById(groupId);
    return g ? g.keys.slice() : [];
  }
  return matchCall(query, roster);
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
