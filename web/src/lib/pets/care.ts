export type CareStats = {
  hunger: number;
  mood: number;
  energy: number;
};

const HUNGER_PER_MS = 100 / (8 * 60 * 60 * 1000);
const MOOD_PER_MS = 100 / (12 * 60 * 60 * 1000);
const ENERGY_PER_MS = 100 / (10 * 60 * 60 * 1000);

export function clampStat(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function decayStats(stats: CareStats, lastTick: number, now = Date.now()): CareStats {
  const dt = Math.max(0, now - lastTick);
  return {
    hunger: clampStat(stats.hunger - dt * HUNGER_PER_MS),
    mood: clampStat(stats.mood - dt * MOOD_PER_MS),
    energy: clampStat(stats.energy - dt * ENERGY_PER_MS),
  };
}

export function applyFeed(stats: CareStats): CareStats {
  return {
    hunger: clampStat(stats.hunger + 28),
    mood: clampStat(stats.mood + 6),
    energy: clampStat(stats.energy - 6),
  };
}

export function applyPlay(stats: CareStats): CareStats {
  return {
    hunger: clampStat(stats.hunger - 8),
    mood: clampStat(stats.mood + 26),
    energy: clampStat(stats.energy - 14),
  };
}

export function applyRest(stats: CareStats): CareStats {
  return {
    hunger: clampStat(stats.hunger - 4),
    mood: clampStat(stats.mood + 4),
    energy: clampStat(stats.energy + 34),
  };
}

export function bondScore(stats: CareStats) {
  return clampStat(stats.hunger * 0.34 + stats.mood * 0.4 + stats.energy * 0.26);
}

export function moodWord(stats: CareStats) {
  const score = bondScore(stats);
  if (score >= 80) return "Content";
  if (score >= 55) return "Settled";
  if (score >= 30) return "Restless";
  return "Neglected";
}
