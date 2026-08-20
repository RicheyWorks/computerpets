import { isRestingHour } from "./hours.ts";

export type MessPile = { id: number; x: number; kind?: "gift" | "shed" };

/** Overlay already recovers this fast at night. The desk and blotter keep the same sit. */
export const NIGHT_HUNGER = 0.45;
export const NIGHT_ENERGY_PER_MS = 18 / 3_600_000;

/** Tend rail the living desk already keeps. /demo uses the same marks. */
export const DESK_TEND = [
  { label: "Rest", action: "rest" as const },
  { label: "Clean", action: "clean" as const },
  { label: "Bath", action: "bath" as const },
  { label: "Medicine", action: "medicine" as const },
  { label: "Praise", action: "praise" as const },
];

export type CareStats = {
  hunger: number;
  mood: number;
  energy: number;
  hygiene: number;
  health: number;
  bond: number;
  sick: boolean;
  hidden: boolean;
  mess: MessPile[];
  gifts: MessPile[];
  bornAt: number;
  lastTick: number;
  shedAt: number;
  /** Hive line. Brood cells on Wax. Other guests leave these unset. */
  brood?: number;
  /** Hive line. Nectar stores on Wax. Other guests leave these unset. */
  stores?: number;
};

const HUNGER_PER_MS = 100 / (6 * 60 * 60 * 1000);
const MOOD_PER_MS = 100 / (12 * 60 * 60 * 1000);
const ENERGY_PER_MS = 100 / (9 * 60 * 60 * 1000);
const HYGIENE_PER_MS = 100 / (14 * 60 * 60 * 1000);

export function clampStat(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function blankCare(now = Date.now()): CareStats {
  return {
    hunger: 78,
    mood: 74,
    energy: 80,
    hygiene: 86,
    health: 92,
    bond: 18,
    sick: false,
    hidden: false,
    mess: [],
    gifts: [],
    bornAt: now,
    lastTick: now,
    shedAt: 0,
  };
}

export function normalizeCare(raw: Partial<CareStats> | null | undefined, now = Date.now()): CareStats {
  const base = blankCare(now);
  if (!raw) return base;
  return {
    hunger: clampStat(raw.hunger ?? base.hunger),
    mood: clampStat(raw.mood ?? base.mood),
    energy: clampStat(raw.energy ?? base.energy),
    hygiene: clampStat(raw.hygiene ?? base.hygiene),
    health: clampStat(raw.health ?? base.health),
    bond: clampStat(raw.bond ?? base.bond),
    sick: Boolean(raw.sick),
    hidden: Boolean(raw.hidden),
    mess: Array.isArray(raw.mess) ? raw.mess.slice(0, 6) : [],
    gifts: Array.isArray(raw.gifts) ? raw.gifts.slice(0, 3) : [],
    bornAt: raw.bornAt ?? now,
    lastTick: raw.lastTick ?? now,
    shedAt: typeof raw.shedAt === "number" ? raw.shedAt : 0,
    brood: typeof raw.brood === "number" ? raw.brood : undefined,
    stores: typeof raw.stores === "number" ? raw.stores : undefined,
  };
}

/** The living line the meters do not already keep on companion_pets. */
export type CareLine = {
  bond: number;
  sick: boolean;
  hidden: boolean;
  mess: MessPile[];
  gifts: MessPile[];
  shedAt: number;
  brood?: number;
  stores?: number;
};

const NEW_LINE: CareLine = {
  bond: 18,
  sick: false,
  hidden: false,
  mess: [],
  gifts: [],
  shedAt: 0,
};

export function packLine(stats: Pick<CareStats, keyof CareLine>): string {
  const line: CareLine = {
    bond: clampStat(stats.bond),
    sick: Boolean(stats.sick),
    hidden: Boolean(stats.hidden),
    mess: Array.isArray(stats.mess) ? stats.mess.slice(0, 6) : [],
    gifts: Array.isArray(stats.gifts) ? stats.gifts.slice(0, 3) : [],
    shedAt: typeof stats.shedAt === "number" ? stats.shedAt : 0,
  };
  if (typeof stats.brood === "number") line.brood = Math.max(0, Math.min(8, Math.round(stats.brood)));
  if (typeof stats.stores === "number") line.stores = clampStat(stats.stores);
  return JSON.stringify(line);
}

export function unpackLine(raw: unknown): CareLine {
  if (raw == null || raw === "") return { ...NEW_LINE };
  let parsed: unknown = raw;
  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return { ...NEW_LINE };
    }
  }
  if (!parsed || typeof parsed !== "object") return { ...NEW_LINE };
  const o = parsed as Partial<CareLine>;
  return {
    bond: clampStat(typeof o.bond === "number" ? o.bond : NEW_LINE.bond),
    sick: Boolean(o.sick),
    hidden: Boolean(o.hidden),
    mess: Array.isArray(o.mess) ? o.mess.slice(0, 6) : [],
    gifts: Array.isArray(o.gifts) ? o.gifts.slice(0, 3) : [],
    shedAt: typeof o.shedAt === "number" ? o.shedAt : 0,
    brood: typeof o.brood === "number" ? Math.max(0, Math.min(8, Math.round(o.brood))) : undefined,
    stores: typeof o.stores === "number" ? clampStat(o.stores) : undefined,
  };
}

export type CompanionCareRow = {
  hunger: number;
  mood: number;
  energy: number;
  health?: number | null;
  hygiene?: number | null;
  bornAt: number;
  lastTick: number;
  line?: unknown;
};

/** Hydrate a sanctuary row. A missing line is New / empty blotter — they never had one. */
export function seedCareFromRow(row: CompanionCareRow, now = Date.now()): CareStats {
  const line = unpackLine(row.line);
  return normalizeCare(
    {
      hunger: Number(row.hunger),
      mood: Number(row.mood),
      energy: Number(row.energy),
      hygiene: row.hygiene == null ? 86 : Number(row.hygiene),
      health: row.health == null ? 92 : Number(row.health),
      bornAt: row.bornAt,
      lastTick: row.lastTick,
      ...line,
    },
    now,
  );
}

export type LifeStage = "hatchling" | "grown" | "elder";

export function stageOf(stats: CareStats, now = Date.now()): LifeStage {
  const days = Math.max(0, (now - stats.bornAt) / 86400000);
  if (days < 1) return "hatchling";
  if (days < 7) return "grown";
  return "elder";
}

/** Health at this value has reached the floor. A stretch here, then they leave. */
export const HEALTH_FLOOR = 0;
/** Keep-alive window once health is spent. Care in this stretch still saves them. */
export const FLOOR_STRETCH_MS = 6 * 60 * 60 * 1000;
/** Ghost’s adult span. After this from hatch, she spends. */
export const LUNA_SPAN_MS = 7 * 24 * 60 * 60 * 1000;

export function adultLuna(speciesKey: string, stats: Partial<CareStats>, now = Date.now()) {
  return speciesKey === "luna" && stageOf(normalizeCare(stats, now), now) !== "hatchling";
}

/** Hunger is stores. Health is brood. Same meters, hive names on the line. */
function stampHiveLine(stats: CareStats): CareStats {
  return {
    ...stats,
    brood: Math.max(0, Math.min(8, Math.round(stats.health / 12.5))),
    stores: clampStat(stats.hunger),
  };
}

export function applyFeedFor(speciesKey: string, stats: Partial<CareStats>, now = Date.now()): CareStats {
  const s = normalizeCare(stats, now);
  if (adultLuna(speciesKey, s, now)) return s;
  const fed = applyFeed(s);
  return speciesKey === "honeycomb" ? stampHiveLine(fed) : fed;
}

/** A guest at the floor who is still in the stretch can be lifted by care. */
export function liftFromFloor(stats: CareStats): CareStats {
  if (stats.health > HEALTH_FLOOR) return stats;
  return { ...stats, health: 12 };
}

export type SanctuaryCare = "feed" | "play" | "rest" | "clean" | "medicine" | "shed";

const SHED_DUE_MS = 8 * 60 * 60 * 1000;

export function applyShed(stats: Partial<CareStats>, now = Date.now()): CareStats {
  const s = normalizeCare(stats, now);
  const gifts = s.gifts.length >= 3 ? s.gifts : [...s.gifts, { id: now, x: 18 + Math.random() * 64, kind: "shed" as const }];
  return {
    ...s,
    hygiene: clampStat(s.hygiene + 28),
    mood: clampStat(s.mood + 12),
    health: clampStat(s.health + 8),
    bond: clampStat(s.bond + 3),
    shedAt: now,
    gifts,
  };
}

export function applySanctuaryCare(
  action: SanctuaryCare,
  speciesKey: string,
  stats: Partial<CareStats>,
  now = Date.now(),
): { stats: CareStats; note?: string } {
  const s = normalizeCare(stats, now);
  if (action === "feed") {
    if (adultLuna(speciesKey, s, now)) {
      return { stats: s, note: "Ghost does not eat. The week is the species." };
    }
    const fed = liftFromFloor(applyFeed(s));
    return { stats: speciesKey === "honeycomb" ? stampHiveLine(fed) : fed };
  }
  if (action === "play") {
    const played = applyPlay(s);
    return { stats: speciesKey === "honeycomb" ? stampHiveLine(played) : played };
  }
  if (action === "rest") {
    const rested = liftFromFloor(applyRest(s));
    return { stats: speciesKey === "honeycomb" ? stampHiveLine(rested) : rested };
  }
  if (action === "clean") {
    const cleaned = liftFromFloor(applyClean(s));
    return { stats: speciesKey === "honeycomb" ? stampHiveLine(cleaned) : cleaned };
  }
  if (action === "shed") {
    if (now - s.shedAt < SHED_DUE_MS) return { stats: s };
    return { stats: applyShed(s, now) };
  }
  const healed = liftFromFloor(applyMedicine(s));
  return { stats: speciesKey === "honeycomb" ? stampHiveLine(healed) : healed };
}

export type SanctuaryTick = {
  stats: CareStats;
  floorSince: number | null;
  departedAt: number | null;
  verb: string | null;
};

function decayForSpecies(speciesKey: string, stats: CareStats, lastTick: number, now: number): CareStats {
  const resting = isRestingHour(speciesKey, new Date(now).getHours());
  if (adultLuna(speciesKey, stats, now)) {
    const pinned = { ...stats, hunger: Math.max(stats.hunger, 50) };
    const live = decayStats(pinned, lastTick, now, resting);
    return { ...live, hunger: stats.hunger };
  }
  const live = decayStats(stats, lastTick, now, resting);
  return speciesKey === "honeycomb" ? stampHiveLine(live) : live;
}

/** Age a locally kept guest from lastTick. Same clocks as sanctuary; Luna's hunger stays pinned. */
export function tickCare(speciesKey: string, stats: Partial<CareStats>, now = Date.now()): CareStats {
  const prior = normalizeCare(stats, now);
  return decayForSpecies(speciesKey, prior, prior.lastTick, now);
}

function floorHitAt(prior: CareStats, lastTick: number, now: number, speciesKey: string): number {
  if (prior.health <= HEALTH_FLOOR) return lastTick;
  const live = decayForSpecies(speciesKey, prior, lastTick, now);
  if (live.health > HEALTH_FLOOR) return now;
  const dropped = prior.health - live.health;
  if (dropped <= 0) return now;
  const fraction = Math.min(1, prior.health / dropped);
  return lastTick + (now - lastTick) * fraction;
}

/**
 * Tick a sanctuary companion. Persist the result (meters, line, floor_since,
 * departed_at). Health at the floor for FLOOR_STRETCH_MS, or Ghost’s week, and they leave.
 */
export function tickSanctuary(
  speciesKey: string,
  stats: Partial<CareStats>,
  lastTick: number,
  floorSince: number | null,
  now = Date.now(),
): SanctuaryTick {
  const prior = normalizeCare(stats, now);
  const live = decayForSpecies(speciesKey, prior, lastTick, now);

  if (speciesKey === "luna" && now - prior.bornAt >= LUNA_SPAN_MS) {
    return {
      stats: live,
      floorSince,
      departedAt: prior.bornAt + LUNA_SPAN_MS,
      verb: "spent",
    };
  }

  let nextFloor = floorSince;
  if (live.health <= HEALTH_FLOOR) {
    if (nextFloor == null) nextFloor = floorHitAt(prior, lastTick, now, speciesKey);
    if (now - nextFloor >= FLOOR_STRETCH_MS) {
      return {
        stats: live,
        floorSince: nextFloor,
        departedAt: nextFloor + FLOOR_STRETCH_MS,
        verb: speciesKey === "luna" ? "spent" : "gone",
      };
    }
  } else {
    nextFloor = null;
  }

  return { stats: live, floorSince: nextFloor, departedAt: null, verb: null };
}

export function decayStats(stats: Partial<CareStats>, lastTick: number, now = Date.now(), resting = false): CareStats {
  const s = normalizeCare(stats, now);
  const dt = Math.max(0, now - lastTick);
  const asleep = resting && !s.hidden && !s.sick;
  const next: CareStats = {
    ...s,
    hunger: clampStat(s.hunger - dt * HUNGER_PER_MS * (asleep ? NIGHT_HUNGER : 1)),
    mood: clampStat(s.mood - dt * MOOD_PER_MS * (s.sick ? 1.3 : 1)),
    energy: asleep ? clampStat(s.energy + dt * NIGHT_ENERGY_PER_MS) : clampStat(s.energy - dt * ENERGY_PER_MS),
    hygiene: clampStat(s.hygiene - dt * HYGIENE_PER_MS),
    lastTick: now,
  };
  if (next.hunger < 18 || next.hygiene < 18) {
    next.health = clampStat(s.health - dt * (6 / (10 * 60 * 60 * 1000)) * 100);
  } else {
    next.health = clampStat(s.health + dt * (2 / (10 * 60 * 60 * 1000)) * 100);
  }
  if (!next.sick && next.health < 32) next.sick = true;
  if (next.sick && next.health > 64 && next.hygiene > 40) next.sick = false;
  if (next.hygiene < 42 && next.mess.length < 5 && Math.random() < Math.min(0.35, dt / 120000)) {
    next.mess = [...next.mess, { id: now + next.mess.length, x: 12 + Math.random() * 76 }];
  }
  if (next.bond >= 25 && next.gifts.length < 2 && Math.random() < Math.min(0.2, dt / 180000)) {
    next.gifts = [...next.gifts, { id: now + 17 + next.gifts.length, x: 14 + Math.random() * 72 }];
  }
  return next;
}

export function applyFeed(stats: Partial<CareStats>): CareStats {
  const s = normalizeCare(stats);
  return {
    ...s,
    hunger: clampStat(s.hunger + 28),
    mood: clampStat(s.mood + 6),
    energy: clampStat(s.energy - 6),
    bond: clampStat(s.bond + 2),
  };
}

export function applyPlay(stats: Partial<CareStats>): CareStats {
  const s = normalizeCare(stats);
  return {
    ...s,
    hunger: clampStat(s.hunger - 8),
    mood: clampStat(s.mood + 26),
    energy: clampStat(s.energy - 14),
    bond: clampStat(s.bond + 3),
  };
}

export function applyRest(stats: Partial<CareStats>): CareStats {
  const s = normalizeCare(stats);
  return {
    ...s,
    hunger: clampStat(s.hunger - 3),
    mood: clampStat(s.mood + 4),
    energy: clampStat(s.energy + 34),
    bond: clampStat(s.bond + 1),
  };
}

export function applyClean(stats: Partial<CareStats>): CareStats {
  const s = normalizeCare(stats);
  return {
    ...s,
    hygiene: clampStat(s.hygiene + 38),
    mood: clampStat(s.mood + 8),
    bond: clampStat(s.bond + 2),
    mess: [],
  };
}

export function applyBath(stats: Partial<CareStats>): CareStats {
  const s = normalizeCare(stats);
  return {
    ...s,
    hygiene: clampStat(s.hygiene + 48),
    mood: clampStat(s.mood + 6),
    energy: clampStat(s.energy - 6),
    bond: clampStat(s.bond + 2),
  };
}

export function applyMedicine(stats: Partial<CareStats>): CareStats {
  const s = normalizeCare(stats);
  return {
    ...s,
    sick: false,
    health: clampStat(s.health + 28),
    mood: clampStat(s.mood - 2),
    bond: clampStat(s.bond + 3),
  };
}

export function applySnack(stats: Partial<CareStats>): CareStats {
  const s = normalizeCare(stats);
  return {
    ...s,
    hunger: clampStat(s.hunger + 12),
    mood: clampStat(s.mood + 5),
    bond: clampStat(s.bond + 1),
  };
}

/** A treat on the blotter. Hunger is stores on Wax. Ghost declines the bite. */
export function applySnackFor(speciesKey: string, stats: Partial<CareStats>, now = Date.now()): CareStats {
  const s = normalizeCare(stats, now);
  if (adultLuna(speciesKey, s, now)) return s;
  const fed = applySnack(s);
  return speciesKey === "honeycomb" ? stampHiveLine(fed) : fed;
}

export function applyPraise(stats: Partial<CareStats>): CareStats {
  const s = normalizeCare(stats);
  return {
    ...s,
    mood: clampStat(s.mood + 12),
    bond: clampStat(s.bond + 2),
  };
}

export function applyCall(stats: Partial<CareStats>): CareStats {
  const s = normalizeCare(stats);
  return { ...s, hidden: false, mood: clampStat(s.mood + 4), bond: clampStat(s.bond + 1) };
}

export function applyHide(stats: Partial<CareStats>): CareStats {
  const s = normalizeCare(stats);
  return { ...s, hidden: true };
}

export function pickGift(stats: Partial<CareStats>, id: number): CareStats {
  const s = normalizeCare(stats);
  return {
    ...s,
    gifts: s.gifts.filter((g) => g.id !== id),
    mood: clampStat(s.mood + 6),
    bond: clampStat(s.bond + 2),
  };
}

export function leaveGift(stats: Partial<CareStats>): CareStats {
  const s = normalizeCare(stats);
  if (s.bond < 25 || s.gifts.length >= 2) return s;
  return {
    ...s,
    gifts: [...s.gifts, { id: Date.now(), x: 16 + Math.random() * 68 }],
  };
}

export function pickMess(stats: Partial<CareStats>, id: number): CareStats {
  const s = normalizeCare(stats);
  return {
    ...s,
    mess: s.mess.filter((m) => m.id !== id),
    hygiene: clampStat(s.hygiene + 8),
    mood: clampStat(s.mood + 3),
  };
}

export function bondScore(stats: Partial<CareStats>) {
  const s = normalizeCare(stats);
  return clampStat(s.hunger * 0.22 + s.mood * 0.28 + s.energy * 0.16 + s.hygiene * 0.14 + s.bond * 0.2);
}

export function moodWord(stats: Partial<CareStats>) {
  const s = normalizeCare(stats);
  if (s.sick) return "Unwell";
  if (s.hidden) return "Hiding";
  if (s.hunger < 22) return "Hungry";
  if (s.hygiene < 24) return "Unkempt";
  if (s.energy < 20) return "Tired";
  if (s.bond >= 80) return "Devoted";
  const score = bondScore(s);
  if (score >= 80) return "Content";
  if (score >= 55) return "Settled";
  if (score >= 30) return "Restless";
  return "Neglected";
}

export function bondTitle(bond: number) {
  if (bond >= 100) return "Soul";
  if (bond >= 75) return "Devoted";
  if (bond >= 50) return "Friend";
  if (bond >= 25) return "Known";
  return "New";
}

export function crossedBond(prev: number, next: number) {
  for (const mark of [25, 50, 75, 100]) {
    if (prev < mark && next >= mark) return bondTitle(mark);
  }
  return null;
}

export const BOND_LINE: Record<string, string> = {
  Known: "I know your hands now.",
  Friend: "We are past the first week.",
  Devoted: "I would wait by the door.",
  Soul: "The blotter is ours.",
};

export function maybeBondLine(prev: number, next: number) {
  const title = crossedBond(prev, next);
  return title ? (BOND_LINE[title] ?? null) : null;
}

export function loadCare(
  key: string,
  fallback?: Partial<CareStats>,
  speciesKey?: string,
  now = Date.now(),
): CareStats {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const saved = normalizeCare(JSON.parse(raw) as Partial<CareStats>, now);
      return speciesKey ? tickCare(speciesKey, saved, now) : decayStats(saved, saved.lastTick, now);
    }
  } catch {
    /* ignore */
  }
  return normalizeCare(fallback ?? null, now);
}

export function saveCare(key: string, stats: CareStats) {
  try {
    localStorage.setItem(key, JSON.stringify(stats));
  } catch {
    /* ignore */
  }
}
