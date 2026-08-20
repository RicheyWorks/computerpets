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
    case "rise":
    case "pulse":
    case "soar":
    case "drop":
    case "waggle":
    case "migrate":
    case "hawk":
    case "trail":
    case "emerge":
    case "thrum":
    case "bore":
    case "shine":
    case "hum":
    case "float":
    case "edge":
    case "align":
    case "eft":
    case "flare":
    case "run":
    case "hover":
    case "leap":
    case "prowl":
    case "stem":
    case "gale":
    case "flag":
    case "cache":
    case "slide":
    case "forage":
    case "climb":
    case "dash":
    case "show":
    case "cilia":
    case "reach":
    case "spot":
    case "roll":
    case "spin":
    case "tumble":
      return { stats: next, cmd: "wander" };
    case "wheek":
    case "echo":
    case "quote":
    case "bug":
    case "bill":
    case "reborn":
    case "mimic":
    case "inspect":
    case "flush":
    case "gape":
    case "bloom":
    case "flash":
    case "count":
    case "warn":
    case "chord":
    case "croak":
    case "caw":
    case "kronk":
    case "hiss":
    case "dee":
    case "honk":
    case "dewlap":
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
    case "ink":
    case "cling":
    case "hitch":
    case "molt":
    case "carpet":
    case "unfurl":
    case "gold":
    case "open":
    case "store":
    case "drown":
    case "glue":
    case "freeze":
    case "fold":
    case "seal":
    case "cut":
    case "pot":
    case "dig":
    case "lay":
    case "hold":
    case "fruit":
    case "pit":
    case "ridge":
    case "zone":
    case "tooth":
    case "shelf":
    case "share":
    case "drink":
    case "facet":
    case "frost":
    case "dim":
    case "wake":
    case "puff":
    case "hide":
    case "ring":
    case "rasp":
    case "siphon":
    case "latch":
    case "pane":
    case "holdfast":
    case "trumpet":
    case "blush":
    case "web":
    case "hour":
    case "clasp":
    case "hang":
    case "rinse":
    case "lodge":
    case "bristle":
    case "shift":
    case "levee":
    case "shut":
    case "crest":
      next.energy = clampStat(next.energy + 6);
      next.mood = clampStat(next.mood + 6);
      return { stats: next, cmd: "sit" };
    case "trade":
    case "snap":
    case "spore":
    case "pinch":
    case "dabble":
    case "drum":
    case "flick":
    case "sting":
    case "spray":
    case "squirt":
      next.mood = clampStat(next.mood + 8);
      return { stats: next, cmd: "play" };
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
