/** Chamber ground tricks while idle. House nautilus — spiral / siphuncle / nacre / pinhole / fringe personality (chambered shell spiral, gas-tube buoyancy, pearly nacre calm, pinhole-eye regard, suckerless tentacle fringe; not Cup mantle dens, Sepia cuttlebone chromatophores, or Coin bowl-drift). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop `nautilus-tricks.js`. Window-play RISE unchanged — never names `rise`. Cup owns jet; Sepia owns bone/pupil/chroma/hover/blot; Bluff owns hood; Bandit owns tribute; Phoenix owns lift. Not Ink/Coin/Bloom/Cup/Sepia clones. No cry inventing — thank-yous are silent desk motion only. */

export const TRICK_KEY = "nautilus";
export const TRICKS = ["spiral", "siphuncle", "nacre", "pinhole", "fringe"] as const;
export const HAPPY = ["chamber", "pearl", "quiet"] as const;
export type NautilusTrickKind = (typeof TRICKS)[number];
export type NautilusHappyKind = (typeof HAPPY)[number];
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

export type NautilusTrick = {
  kind: NautilusTrickKind;
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

export type NautilusHappy = {
  kind: NautilusHappyKind;
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

export const HAPPY_DUR: Record<NautilusHappyKind, number> = {
  chamber: 1.28,
  pearl: 1.2,
  quiet: 1.16,
};

/** Spiral hold — Chamber rests in the coiled chambers. Not window-play RISE. Not Cup mantle plate. Not Sepia bone. */
export const SPIRAL_HOLD = 11.2;
export const RELEASE_S = 0.65;

export const DUR: Record<NautilusTrickKind, number> = {
  spiral: SPIRAL_HOLD + RELEASE_S,
  siphuncle: 1.44,
  nacre: 1.38,
  pinhole: 1.34,
  fringe: 1.5,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: NautilusTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "spiral") return 48 + roll * 28;
  if (kind === "siphuncle") return 15 + roll * 10;
  if (kind === "fringe") return 16 + roll * 11;
  return justFinished ? 10 + roll * 8 : 5 + roll * 6;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: NautilusTrickKind | null) {
  if (musicOn) return "spiral";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "spiral") {
    if (roll < 0.26) return "siphuncle";
    if (roll < 0.48) return "nacre";
    if (roll < 0.72) return "pinhole";
    return "fringe";
  }
  if (lastKind === "siphuncle") {
    if (roll < 0.28) return "spiral";
    if (roll < 0.5) return "nacre";
    if (roll < 0.72) return "pinhole";
    return "fringe";
  }
  if (lastKind === "nacre") {
    if (roll < 0.22) return "spiral";
    if (roll < 0.44) return "siphuncle";
    if (roll < 0.66) return "pinhole";
    return "fringe";
  }
  if (roll < 0.2) return "spiral";
  if (roll < 0.4) return "siphuncle";
  if (roll < 0.6) return "nacre";
  if (roll < 0.8) return "pinhole";
  return "fringe";
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

export function wantsThankYou(key: string | undefined | null) {
  return key === TRICK_KEY || key === "chamber";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: NautilusHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as NautilusHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: NautilusHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: NautilusHappyKind | string, x: number, facing: 1 | -1): NautilusHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as NautilusHappyKind) : "chamber";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "chamber" ? "sit" : name === "pearl" ? "talk" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function chamberPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.chamber));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 1.05, rot: s * 3.2, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const coil = Math.sin(t * 2.4);
    return {
      lift: 1.05 + Math.abs(coil) * 0.22,
      rot: 3.2 + coil * 3.8,
      dx: coil * 0.1,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 0.85 * (1 - s), rot: 2.0 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function pearlPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.pearl));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 0.75, rot: s * -7.5, dx: 0, anim: "talk" as TrickAnim };
  }
  if (u < 0.8) {
    const w = Math.sin(t * 2.2);
    return {
      lift: 0.75 + Math.abs(w) * 0.18,
      rot: -7.5 + w * 9,
      dx: w * 0.1,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 0.75 * (1 - s), rot: -7.5 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function quietPose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 1.6)) * 0.35 + 0.7,
    rot: 1.5 + Math.sin(t * 1.9) * 3.2,
    dx: Math.sin(t * 1.2) * 0.08,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: NautilusHappy, dt: number, flags?: TrickFlags): NautilusHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: NautilusHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "chamber") {
    const pose = chamberPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "pearl") {
    const pose = pearlPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = quietPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

export function sleepHoldFrame(_key?: string | null, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: NautilusTrickKind, x: number, facing: 1 | -1): NautilusTrick {
  const anim: TrickAnim =
    kind === "spiral"
      ? "sit"
      : kind === "siphuncle"
        ? "walk"
        : kind === "nacre"
          ? "sit"
          : kind === "pinhole"
            ? "talk"
            : kind === "fringe"
              ? "play"
              : "sit";
  return {
    kind: kind,
    phase: kind === "spiral" ? "hold" : "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: anim,
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

export function spiralPose(t: number) {
  const beat = Math.sin(t * 0.72) + 0.18 * Math.sin(t * 2.1);
  return {
    lift: 0.95 + Math.abs(Math.sin(t * 0.55)) * 0.18,
    rot: 2.4 + beat * 2.8,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 0.95 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 2.4 * (1 - u) };
}

export function siphunclePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.siphuncle));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 1.65, rot: s * 2.5 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.72) {
    const s = (u - 0.12) / 0.6;
    const gas = Math.sin(s * Math.PI * 2.6);
    const tube = Math.sin(s * Math.PI * 1.4);
    return {
      x: fromX + facing * tube * 0.2,
      lift: 1.65 + gas * 0.55,
      rot: facing * (2.5 + gas * 4 + tube * 2),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX,
    lift: 1.65 * (1 - s),
    rot: facing * (2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function nacrePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.nacre));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 0.85, rot: s * 5 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.7) {
    const s = (u - 0.14) / 0.56;
    const sheen = Math.sin(s * Math.PI * 3.4);
    return {
      x: fromX + facing * sheen * 0.16,
      lift: 0.85 + Math.abs(sheen) * 0.22,
      rot: facing * (5 + sheen * 7),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.7) / 0.3);
  return {
    x: fromX,
    lift: 0.85 * (1 - s),
    rot: facing * (3 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function pinholePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.pinhole));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 0.55, rot: s * -10 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.14) / 0.41;
    const w = Math.sin(s * Math.PI * 1.8);
    return {
      x: fromX + facing * w * 0.14,
      lift: 0.55 + Math.abs(w) * 0.12,
      rot: facing * (-10 + w * 12),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.55) / 0.23;
    return {
      x: fromX,
      lift: 0.55 - s * 0.1,
      rot: facing * (-3 + s * 1.5),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 0.45 * (1 - s),
    rot: facing * (-1.5 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function fringePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.fringe));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 1.2, rot: s * -3 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.72) {
    const s = (u - 0.1) / 0.62;
    const wave = Math.sin(s * Math.PI * 4.8);
    const soft = Math.sin(s * Math.PI * 2.2);
    return {
      x: fromX + facing * soft * 0.35,
      lift: 1.2 + Math.abs(wave) * 0.4,
      rot: facing * (-3 + wave * 8 + soft * 3),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX,
    lift: 1.2 * (1 - s),
    rot: facing * (-1.5 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function stepTrick(trick: NautilusTrick, dt: number, flags?: TrickFlags): NautilusTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "siphuncle" && trick.kind !== "nacre" && trick.kind !== "fringe") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: NautilusTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "spiral") {
    if (next.t < SPIRAL_HOLD) {
      const pose = spiralPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < SPIRAL_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - SPIRAL_HOLD);
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
  if (next.kind === "siphuncle") {
    const pose = siphunclePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "nacre") {
    const pose = nacrePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "pinhole") {
    const pose = pinholePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = fringePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
