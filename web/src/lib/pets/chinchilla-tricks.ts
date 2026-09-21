/** Floss ground tricks while idle — ultra-polish pass. House chinchilla — ash / bound / fluff / chin / sift / ricochet / gnaw personality (soft Chinchilla lanigera desk life). Ash volcanic dust-bath hold without naming dust (window-play) or curl/ball; bound springy Andean hop without naming zoom/popcorn/binky/romp; fluff densest-fur cloud without naming wash/preen/bristle; chin chin-mark without naming scent/steal; sift ash-through-sixty-hairs without naming anoint/wag; ricochet cascading wall-bounce play without naming cascade/zoom/scurry/dart; gnaw soft desk-edge chew without naming crack/nosh/hay/teeth. Window-play DUST unchanged — never names a trick `dust`. Guest slug Floss / key chinchilla — accept "chinchilla" and "floss". Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk (`chinchilla.wav`). Thank-yous eep / coo / bark. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop `chinchilla-tricks.js`. True house-chinchilla desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/axolotl/toucan/iguana/dragon/Vesper clones. Bird ultra (Soot→Ember) + Miso/Pip/Thimble/Clip/Whee/Ink/Coin/Rue/Wick/Burr done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan skip birds. Next guest ultra is Bloom / axolotl (skip Ember if bird). No cry inventing — thank-yous silent desk motion only. Never retouch Rui sprites.  chinchilla.wav EXISTS so prefersHouseCry adds chinchilla. Amplitudes raised toward Rui richness; denser waits/weights (ASH_HOLD=11.2 RELEASE_S=1.18). Catalog 221. */

export const TRICK_KEY = "chinchilla";
export const TRICKS = ["ash", "bound", "fluff", "chin", "sift", "ricochet", "gnaw"] as const;
export const HAPPY = ["eep", "coo", "bark"] as const;
export type ChinchillaTrickKind = (typeof TRICKS)[number];
export type ChinchillaHappyKind = (typeof HAPPY)[number];
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

export type ChinchillaTrick = {
  kind: ChinchillaTrickKind;
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

export type ChinchillaHappy = {
  kind: ChinchillaHappyKind;
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

export const HAPPY_DUR: Record<ChinchillaHappyKind, number> = {
  eep: 1.62,
  coo: 1.7,
  bark: 1.66,
};

/** Ash hold — Floss rolls in ash-fine volcanic desk-dust. Not window-play DUST. Not a hedgehog curl. Not a cat loaf. Not a hamster nest. */
export const ASH_HOLD = 11.2;
export const RELEASE_S = 1.18;

export const DUR: Record<ChinchillaTrickKind, number> = {
  ash: ASH_HOLD + RELEASE_S,
  bound: 1.88,
  fluff: 1.96,
  chin: 1.78,
  sift: 1.92,
  ricochet: 2.08,
  gnaw: 2.15,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: ChinchillaTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "ash") return 40 + roll * 26;
  if (kind === "bound" || kind === "ricochet" || kind === "sift") return 12.8 + roll * 9.4;
  if (kind === "fluff" || kind === "chin" || kind === "gnaw") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: ChinchillaTrickKind | null): ChinchillaTrickKind {
  if (musicOn) return "ash";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : TRICKS.slice();
  const weights = list.map((k) =>
    k === "ash" ? 0.72 : k === "bound" || k === "ricochet" || k === "sift" ? 1.28 : k === "fluff" || k === "chin" ? 1.18 : 1.08
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i];
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i];
    if (r <= 0) return list[i];
  }
  return list[list.length - 1] || "ash";
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
  return key === TRICK_KEY || key === "floss";
}

export function startThankYou(
  key: string | undefined,
  lastKind: ChinchillaHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: ChinchillaHappyKind | null, rand?: number): ChinchillaHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] ?? list[0]!;
}

export function beginHappy(kind: ChinchillaHappyKind, x: number, facing: 1 | -1 = 1): ChinchillaHappy {
  const name: ChinchillaHappyKind = HAPPY.includes(kind) ? kind : "eep";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "eep" ? "talk" : name === "coo" ? "sit" : "play",
    facing,
    fromX: x,
  };
}
export function eepPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.eep));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 5.0, rot: -s * 14.4, dx: 0, anim: "talk" as const };
  }
  if (u < 0.8) {
    return {
      lift: 5.0 + Math.abs(Math.sin(t * 10)) * 3.8,
      rot: -14.4 + Math.sin(t * 12) * 12,
      dx: Math.sin(t * 8) * 1.9,
      anim: "talk" as const,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 5.0 * (1 - s), rot: -14.4 * (1 - s), dx: 0, anim: "sit" as const };
}

export function cooPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.coo));
  if (u < 0.88) {
    return {
      lift: Math.sin(u * Math.PI) * 4.1,
      rot: 26.4 * (1 - Math.sin(u * Math.PI * 0.5)) + Math.sin(u * Math.PI * 2) * 8.4,
      dx: Math.sin(u * Math.PI) * 2.6,
      anim: "sit" as const,
    };
  }
  return { lift: 0, rot: Math.sin(((u - 0.88) / 0.12) * Math.PI) * 3.6, dx: 0, anim: "idle" as const };
}

export function barkPose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 9)) * 6.2,
    rot: Math.sin(t * 11) * 19.2,
    dx: Math.sin(t * 7) * 2.4,
    anim: "play" as const,
  };
}

export function stepHappy(happy: ChinchillaHappy, dt: number, flags?: TrickFlags): ChinchillaHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: ChinchillaHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "eep") {
    const pose = eepPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "coo") {
    const pose = cooPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = barkPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

/** Floss has no Rui-style sleep-frame hold. */
export function sleepHoldFrame(_key: string | undefined, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: ChinchillaTrickKind, x: number, facing: 1 | -1 = 1): ChinchillaTrick {
  const anim: TrickAnim =
    kind === "ash"
      ? "sit"
      : kind === "bound"
        ? "play"
        : kind === "fluff"
          ? "sit"
          : kind === "chin"
            ? "sit"
            : kind === "sift"
              ? "play"
              : kind === "ricochet"
                ? "play"
                : kind === "gnaw"
                  ? "sit"
                  : "sit";
  return {
    kind,
    phase: kind === "ash" ? "hold" : "go",
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

/** Ash — volcanic dust-bath roll on the desk. Not window-play DUST. Not a hedgehog curl. Not a cat loaf. Ethogram Chinchilla lanigera true. */
export function ashPose(t: number) {
  return {
    lift: 1.0 + Math.sin(t * 2.4) * 2.6 + Math.abs(Math.sin(t * 4.2)) * 1.7,
    rot: 69.6 + Math.sin(t * 3.1) * 40.8 + Math.sin(t * 5.5) * 19.2,
  };
}

/** Soft unflip — coat settles; ash stays out of the tub. Not window-play leave. */
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: (1.0 + 2.6) * (1 - Math.sin(u * Math.PI * 0.5)), rot: 69.6 * (1 - u) };
}
/** Bound — springy Andean hop across the wood. Not a dog zoom. Not a rabbit binky. Not a guinea-pig popcorn. Not a ferret romp. Ethogram hop true. */
export function boundPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.bound));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.6, rot: -s * 14.4 * facing, anim: "sit" as const };
  }
  if (u < 0.86) {
    const s = (u - 0.12) / 0.74;
    const hop = Math.sin(s * Math.PI * 2.2);
    return {
      x: fromX + facing * (22 * smoothstep(s) + Math.sin(s * Math.PI * 3) * 3.5),
      lift: 2.6 + Math.abs(hop) * 13.8,
      rot: facing * (-14.4 + hop * 24),
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX + facing * 22,
    lift: 2.6 * (1 - s),
    rot: facing * -7.2 * (1 - s),
    anim: "sit" as const,
  };
}

/** Fluff — densest-fur cloud settle; soft desk life. Not a cat wash. Not a budgie preen. Not a hedgehog bristle. Ethogram coat true. */
export function fluffPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.fluff));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 5.5, rot: s * 12 * facing, anim: "sit" as const };
  }
  if (u < 0.86) {
    const s = (u - 0.14) / 0.72;
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 2.4,
      lift: 5.5 + Math.sin(s * Math.PI * 2.5) * 3.4,
      rot: facing * (12 + Math.sin(s * Math.PI * 3) * 16.8),
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 5.5 * (1 - s),
    rot: facing * 6 * (1 - s),
    anim: "sit" as const,
  };
}

/** Chin — chin-mark the desk grain. Particular. Not a fox scent. Not a dog sniff. Not a ferret steal. Ethogram marking true. */
export function chinPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.chin));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: -s * 4.8, rot: s * 19.2 * facing, anim: "sit" as const };
  }
  if (u < 0.82) {
    const s = (u - 0.16) / 0.66;
    return {
      x: fromX + facing * Math.sin(s * Math.PI * 3) * 3.6,
      lift: -4.8 + Math.abs(Math.sin(s * Math.PI * 4)) * 2.9,
      rot: facing * (19.2 + Math.sin(s * Math.PI * 5) * 14.4),
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: -4.8 * (1 - s),
    rot: facing * 9.6 * (1 - s),
    anim: "sit" as const,
  };
}

/** Sift — shake ash through sixty hairs to a follicle. Not a dog wag. Not a hedgehog anoint. Not window-play dust. Ethogram dust_shake true. */
export function siftPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.sift));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return {
      x: fromX,
      lift: s * 4.6,
      rot: -s * 21.6 * facing,
      anim: "sit" as const,
    };
  }
  if (u < 0.88) {
    const s = (u - 0.1) / 0.78;
    const shake = Math.sin(s * Math.PI * 7);
    return {
      x: fromX + facing * shake * 4.5,
      lift: 4.6 + Math.abs(shake) * 5.0,
      rot: facing * (-21.6 + shake * 38.4),
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX,
    lift: 4.6 * (1 - s),
    rot: facing * -10.8 * (1 - s),
    anim: "sit" as const,
  };
}

/** Ricochet — cascading wall-bounce play across the desk. Not cascade name-collision. Not dog zoom. Not guinea zig. Not ferret romp. House-chinchilla true. */
export function ricochetPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.ricochet));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 3.8, rot: -s * 16.8 * facing, anim: "sit" as const };
  }
  if (u < 0.88) {
    const s = (u - 0.1) / 0.78;
    const bounce = Math.sin(s * Math.PI * 4.5);
    const bank = Math.sin(s * Math.PI * 2.2);
    return {
      x: fromX + facing * (24 * smoothstep(s) + bank * 8),
      lift: 3.8 + Math.abs(bounce) * 15.0,
      rot: facing * (-16.8 + bounce * 33.6 + bank * 12),
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + facing * 24,
    lift: 3.8 * (1 - s),
    rot: facing * -8.4 * (1 - s),
    anim: "sit" as const,
  };
}

/** Gnaw — soft desk-edge chew; hypsodont teeth keep working. Not parrot crack. Not rabbit nosh. Not guinea hay/teeth. House-chinchilla true. */
export function gnawPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.gnaw));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: -s * 4.1, rot: s * 14.4 * facing, anim: "sit" as const };
  }
  if (u < 0.88) {
    const s = (u - 0.12) / 0.76;
    const chew = Math.sin(s * Math.PI * 8);
    return {
      x: fromX + facing * (6 * smoothstep(s) + chew * 2.2),
      lift: -4.1 + Math.abs(chew) * 4.3,
      rot: facing * (14.4 + chew * 16.8),
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + facing * 6,
    lift: -4.1 * (1 - s),
    rot: facing * 7.2 * (1 - s),
    anim: "sit" as const,
  };
}

export function stepTrick(trick: ChinchillaTrick, dt: number, flags?: TrickFlags): ChinchillaTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "bound" && trick.kind !== "sift" && trick.kind !== "ricochet") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: ChinchillaTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "ash") {
    if (next.t < ASH_HOLD) {
      const pose = ashPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < ASH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - ASH_HOLD);
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
  if (next.kind === "bound") {
    const pose = boundPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "fluff") {
    const pose = fluffPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "chin") {
    const pose = chinPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "sift") {
    const pose = siftPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "ricochet") {
    const pose = ricochetPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = gnawPose(next.t, fromX, trick.facing);
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