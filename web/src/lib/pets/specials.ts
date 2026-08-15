import { clampStat, type CareStats } from "./care";
import type { SpeciesTrait } from "./traits";

export type SpecialCommand = "play" | "wander" | "talk" | "sit" | "idle";

export function applySpecial(stats: CareStats, trait: SpeciesTrait): { stats: CareStats; cmd: SpecialCommand } {
  const next = { ...stats, bond: clampStat(stats.bond + 2) };
  switch (trait.special) {
    case "ribbon":
    case "steal":
      next.mood = clampStat(next.mood + 8);
      return { stats: next, cmd: "play" };
    case "follow":
      next.mood = clampStat(next.mood + 4);
      return { stats: next, cmd: "wander" };
    case "thump":
    case "loop":
    case "slither":
    case "patrol":
    case "chart":
      return { stats: next, cmd: "wander" };
    case "wheek":
    case "echo":
    case "quote":
    case "bug":
    case "bill":
    case "reborn":
    case "mimic":
    case "inspect":
      next.mood = clampStat(next.mood + 8);
      return { stats: next, cmd: "talk" };
    case "still":
    case "bask":
    case "curl":
    case "sun":
    case "hoard":
    case "ritual":
    case "coil":
    case "drape":
    case "hold":
    case "nest":
      next.energy = clampStat(next.energy + 6);
      next.mood = clampStat(next.mood + 6);
      return { stats: next, cmd: "sit" };
    case "playdead":
      next.energy = clampStat(next.energy + 10);
      return { stats: next, cmd: "sit" };
    case "bath":
      next.hygiene = clampStat(next.hygiene + 40);
      next.mood = clampStat(next.mood + 12);
      return { stats: next, cmd: "sit" };
    case "regrow":
      next.health = clampStat(next.health + 12);
      return { stats: next, cmd: "idle" };
    default:
      return { stats: next, cmd: "idle" };
  }
}
