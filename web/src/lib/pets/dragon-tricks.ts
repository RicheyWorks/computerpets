/** Vesper ground tricks while idle — ultra-polish pass. House dragon — sprawl / guard / smolder / claim / fold / ruff / scrape personality (wyrm on the mantel; sleeping-dragon desk life). Sprawl heat-hold without naming bask/flatten/drape (window-play owns those); guard watchful rise without naming alert/loaf; smolder breath-glow without naming huff/steam thank-you collision; claim blotter plant without naming hoard special; fold wing-tuck settle without naming curl/coil; ruff neck-ruff flare without naming dewlap/fan/frill/mantle; scrape claw-scrape mark without naming scratch/dig. Window-play DRAPE unchanged — never names a trick `drape`. Window-play BASK/COIL untouched — never names `bask` or `coil`. Special `hoard` stays the special. Guest slug Vesper / key dragon — accept "dragon" and "vesper". Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via dragon.wav. Thank-yous thrum / glow / incline. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop `dragon-tricks.js`. True house-dragon desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol or *Dragon electrical (Relay/Fuse/Ground) clones. Bird ultra (Soot→Ember) + Miso→Sol done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan skip birds. prefersHouseCry via dragon.wav. Amplitudes raised toward Rui richness; denser waits/weights (SPRAWL_HOLD=11.2 RELEASE_S=1.18). Next leftover Ember / phoenix. Catalog 221. Never retouch Rui sprites. */

export const TRICK_KEY = "dragon";
export const TRICKS = ["sprawl", "guard", "smolder", "claim", "fold", "ruff", "scrape"] as const;
export const HAPPY = ["thrum", "glow", "incline"] as const;
export type DragonTrickKind = (typeof TRICKS)[number];
export type DragonHappyKind = (typeof HAPPY)[number];
export type TrickAnim = "idle" | "walk" | "sit" | "sleep" | "talk" | "play";
export type TrickPhase = "go" | "hold" | "release" | "done";
export type HappyPhase = "go" | "done";

export type TrickFlags = {
  asleep?: boolean;
  hidden?: boolean;
  leaving?: boolean;
  cmd?: string;
  windowPlay?: boolean;
  card?: boolean;
};

export type DragonTrick = {
  kind: DragonTrickKind;
  phase: TrickPhase;
  t: number;
  x: number;
  lift: number;
  rot: number;
  anim: TrickAnim;
  facing: 1 | -1;
  fromX?: number;
  abort?: boolean;
};

export type DragonHappy = {
  kind: DragonHappyKind;
  happy: true;
  phase: HappyPhase;
  t: number;
  x: number;
  lift: number;
  rot: number;
  anim: TrickAnim;
  facing: 1 | -1;
  fromX?: number;
  abort?: boolean;
};

export const HAPPY_DUR: Record<DragonHappyKind, number> = {
  thrum: 1.55,
  glow: 1.62,
  incline: 1.58,
};

/** Sprawl hold — Vesper sprawls on the mantel blotter. Not window-play BASK or FLATTEN. Sleeping-dragon heat-holding. */
export const SPRAWL_HOLD = 11.2;
export const RELEASE_S = 1.18;

export const DUR: Record<DragonTrickKind, number> = {
  sprawl: SPRAWL_HOLD + RELEASE_S,
  guard: 1.82,
  smolder: 1.76,
  claim: 1.88,
  fold: 1.72,
  ruff: 2.02,
  scrape: 2.1,
};

export function canStart(state: TrickFlags | undefined) {
  if (!state) return false;
  if (state.asleep || state.hidden || state.leaving || state.windowPlay || state.card) return false;
  const cmd = String(state.cmd || "");
  if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest") return false;
  if (cmd === "seek" || cmd === "eat" || cmd === "play" || cmd === "talk" || cmd === "enter") return false;
  return true;
}

export function shouldAbort(state: TrickFlags | undefined) {
  if (!state) return true;
  if (state.asleep || state.hidden || state.leaving || state.windowPlay || state.card) return true;
  const cmd = String(state.cmd || "");
  return (
    cmd === "sleep" ||
    cmd === "leave" ||
    cmd === "hide" ||
    cmd === "rest" ||
    cmd === "seek" ||
    cmd === "eat" ||
    cmd === "play" ||
    cmd === "talk" ||
    cmd === "enter"
  );
}

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: DragonTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "sprawl") return 40 + roll * 26;
  if (kind === "guard" || kind === "ruff" || kind === "smolder") return 12.8 + roll * 9.4;
  if (kind === "claim" || kind === "fold" || kind === "scrape") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: DragonTrickKind | null): DragonTrickKind {
  if (musicOn) return "sprawl";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...TRICKS];
  const weights = list.map((k) =>
    k === "sprawl" ? 0.72 : k === "guard" || k === "ruff" || k === "smolder" ? 1.28 : k === "claim" || k === "fold" ? 1.18 : 1.08
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i]!;
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return list[i]!;
  }
  return list[list.length - 1] || "sprawl";
}

export function happyCanStart(state: TrickFlags | undefined) {
  if (!state) return false;
  if (state.asleep || state.hidden || state.leaving) return false;
  const cmd = String(state.cmd || "");
  if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest") return false;
  if (cmd === "seek" || cmd === "play" || cmd === "talk" || cmd === "enter") return false;
  return true;
}

export function happyShouldAbort(state: TrickFlags | undefined) {
  if (!state) return true;
  if (state.asleep || state.hidden || state.leaving) return true;
  const cmd = String(state.cmd || "");
  return (
    cmd === "sleep" ||
    cmd === "leave" ||
    cmd === "hide" ||
    cmd === "rest" ||
    cmd === "seek" ||
    cmd === "play" ||
    cmd === "talk" ||
    cmd === "enter"
  );
}

export function wantsThankYou(key: string | undefined) {
  return key === TRICK_KEY || key === "vesper";
}

export function startThankYou(
  key: string | undefined,
  lastKind: DragonHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: DragonHappyKind | null, rand?: number): DragonHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] ?? list[0]!;
}

export function beginHappy(kind: DragonHappyKind, x: number, facing: 1 | -1 = 1): DragonHappy {
  const name: DragonHappyKind = HAPPY.includes(kind) ? kind : "thrum";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "thrum" ? "sit" : name === "glow" ? "sit" : "talk",
    facing,
    fromX: x,
  };
}

export function thrumPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.thrum));
  if (u < 0.18) {
    const s = u / 0.18;
    return { lift: s * 5.3, rot: s * 16.8, dx: 0, anim: "sit" as const };
  }
  if (u < 0.78) {
    return {
      lift: 5.3 + Math.abs(Math.sin(t * 5.2)) * 3.1,
      rot: 16.8 + Math.sin(t * 4.4) * 12,
      dx: 0,
      anim: "sit" as const,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 5.3 * (1 - s), rot: 16.8 * (1 - s), dx: 0, anim: "idle" as const };
}

export function glowPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.glow));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 6.7, rot: -s * 19.2, dx: 0, anim: "sit" as const };
  }
  if (u < 0.86) {
    return {
      lift: 6.7 + Math.abs(Math.sin(t * 10)) * 3.8,
      rot: -19.2 + Math.sin(t * 12) * 21.6,
      dx: Math.sin(t * 6) * 1.4,
      anim: "sit" as const,
    };
  }
  const s = (u - 0.86) / 0.14;
  return { lift: 6.7 * (1 - s), rot: -19.2 * (1 - s), dx: 0, anim: "sit" as const };
}

export function inclinePose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 3.4)) * 4.6 + 1.4,
    rot: -16.8 + Math.sin(t * 3.0) * 14.4,
    dx: Math.sin(t * 2.4) * 1.7,
    anim: "talk" as const,
  };
}

export function stepHappy(happy: DragonHappy, dt: number, flags?: TrickFlags): DragonHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: DragonHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "thrum") {
    const pose = thrumPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "glow") {
    const pose = glowPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = inclinePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

/** Vesper has no Rui-style sleep-frame hold. */
export function sleepHoldFrame(_key: string | undefined, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: DragonTrickKind, x: number, facing: 1 | -1 = 1): DragonTrick {
  const anim: TrickAnim =
    kind === "sprawl"
      ? "sit"
      : kind === "guard"
        ? "sit"
        : kind === "smolder"
          ? "sit"
          : kind === "claim"
            ? "play"
            : kind === "fold"
              ? "play"
              : kind === "ruff"
                ? "talk"
                : kind === "scrape"
                  ? "play"
                  : "sit";
  return {
    kind,
    phase: kind === "sprawl" ? "hold" : "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim,
    facing,
    fromX: x,
  };
}

function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

/** Sprawl — sleeping-dragon desk sprawl on the blotter. Heat-holding. Not window-play DRAPE or BASK. Ethogram sit_hold true. */
export function sprawlPose(t: number) {
  return {
    lift: 2.6 + Math.sin(t * 1.7) * 3.4 + Math.abs(Math.sin(t * 3.4)) * 1.9,
    rot: 36 + Math.sin(t * 2.4) * 14.4 + Math.sin(t * 4.6) * 7.2,
  };
}

/** Soft lift — Vesper leaves the mantel sprawl; stays on the desk. Not window-play leave. */
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: (2.6 + 3.4) * (1 - Math.sin(u * Math.PI * 0.5)), rot: 36 * (1 - u) };
}

/** Guard — watchful province turn on the mantel. Not earth bed. Not window-play DRAPE. Ethogram watch true. */
export function guardPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.guard));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 5.5, rot: s * 21.6 * facing, anim: "sit" as const };
  }
  if (u < 0.86) {
    const s = (u - 0.14) / 0.72;
    const sweep = Math.sin(s * Math.PI * 2.4);
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 1.9,
      lift: 5.5 + Math.abs(sweep) * 5.0,
      rot: facing * (21.6 + sweep * 19.2),
      anim: "talk" as const,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 5.5 * (1 - s),
    rot: facing * 10.8 * (1 - s),
    anim: "sit" as const,
  };
}

/** Smolder — scales hold heat; a soft chest pulse. Not fuse warm. Not iguana sun. Ethogram pulse energy without naming huff. */
export function smolderPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.smolder));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 4.6, rot: s * 14.4 * facing, anim: "sit" as const };
  }
  if (u < 0.86) {
    const s = (u - 0.12) / 0.74;
    const breath = Math.abs(Math.sin(s * Math.PI * 3.2));
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 1.4,
      lift: 4.6 + breath * 5.5,
      rot: facing * (14.4 + breath * 16.8),
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 4.6 * (1 - s),
    rot: facing * 7.2 * (1 - s),
    anim: "sit" as const,
  };
}

/** Claim — soft territorial settle of a desk province spot. Not special hoard. Not earth lug. */
export function claimPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.claim));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 6.2, rot: -s * 16.8 * facing, anim: "sit" as const };
  }
  if (u < 0.86) {
    const s = (u - 0.12) / 0.74;
    const plant = Math.abs(Math.sin(s * Math.PI * 2.4));
    return {
      x: fromX + facing * (6.6 * smoothstep(s) + plant * 1.7),
      lift: 6.2 + plant * 5.8,
      rot: facing * (-16.8 + plant * 21.6),
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX + facing * 6.6,
    lift: 6.2 * (1 - s),
    rot: facing * -8.4 * (1 - s),
    anim: "sit" as const,
  };
}

/** Fold — wings fold like a letter on the blotter. House voice true. Not window-play DRAPE or COIL. */
export function foldPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.fold));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 6.0, rot: -s * 26.4 * facing, anim: "play" as const };
  }
  if (u < 0.78) {
    const s = (u - 0.16) / 0.62;
    const tuck = smoothstep(s);
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 2.2,
      lift: 6.0 * (1 - tuck * 0.45),
      rot: facing * (-26.4 + tuck * 33.6),
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 6.0 * 0.55 * (1 - s),
    rot: facing * 9.6 * (1 - s),
    anim: "sit" as const,
  };
}


/** Ruff — neck-ruff flare on the mantel. Not iguana dewlap. Not parrot fan. Not mantle. Ethogram ruff_soft. */
export function ruffPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.ruff));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 5.8, rot: s * 24 * facing, anim: "talk" as const };
  }
  if (u < 0.86) {
    const s = (u - 0.14) / 0.72;
    const flare = Math.abs(Math.sin(s * Math.PI * 2.8));
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 1.7,
      lift: 5.8 + flare * 6.2,
      rot: facing * (24 + flare * 21.6),
      anim: "talk" as const,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 5.8 * (1 - s),
    rot: facing * 12 * (1 - s),
    anim: "sit" as const,
  };
}

/** Scrape — claw-scrape territorial mark across the grain. Not cat scratch. Not rabbit dig. Ethogram scrape_soft. */
export function scrapePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.scrape));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 3.4, rot: s * 19.2 * facing, anim: "sit" as const };
  }
  if (u < 0.88) {
    const s = (u - 0.12) / 0.76;
    const drag = Math.sin(s * Math.PI * 3.6);
    return {
      x: fromX + facing * (Math.abs(drag) * 10.2 + s * 2.6),
      lift: 3.4 + Math.abs(drag) * 8.6,
      rot: facing * (19.2 + drag * 38.4),
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + facing * 7.2,
    lift: 3.4 * (1 - s),
    rot: facing * 9.6 * (1 - s),
    anim: "sit" as const,
  };
}

export function stepTrick(trick: DragonTrick, dt: number, flags?: TrickFlags): DragonTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "claim" && trick.kind !== "fold" && trick.kind !== "scrape") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: DragonTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "sprawl") {
    if (next.t < SPRAWL_HOLD) {
      const pose = sprawlPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < SPRAWL_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - SPRAWL_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  }
  const hold = DUR[next.kind];
  const u = next.t / hold;
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "guard") {
    const pose = guardPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "smolder") {
    const pose = smolderPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "claim") {
    const pose = claimPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "fold") {
    const pose = foldPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "ruff") {
    const pose = ruffPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = scrapePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) {
    return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  }
  return next;
}