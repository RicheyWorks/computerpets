export type MessPile = { id: number; x: number };

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
  bornAt: number;
  lastTick: number;
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
    bornAt: now,
    lastTick: now,
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
    bornAt: raw.bornAt ?? now,
    lastTick: raw.lastTick ?? now,
  };
}

export function stageOf(stats: CareStats, now = Date.now()) {
  const days = Math.max(0, (now - stats.bornAt) / 86400000);
  if (days < 1) return "hatchling";
  if (days < 7) return "grown";
  return "elder";
}

export function decayStats(stats: Partial<CareStats>, lastTick: number, now = Date.now()): CareStats {
  const s = normalizeCare(stats, now);
  const dt = Math.max(0, now - lastTick);
  const next: CareStats = {
    ...s,
    hunger: clampStat(s.hunger - dt * HUNGER_PER_MS),
    mood: clampStat(s.mood - dt * MOOD_PER_MS * (s.sick ? 1.3 : 1)),
    energy: clampStat(s.energy - dt * ENERGY_PER_MS),
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
