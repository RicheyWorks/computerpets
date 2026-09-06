/** Sepia ground tricks while idle. House cuttlefish — bone / pupil / chroma / hover / blot personality (cuttlebone buoyancy, W-pupil regard, chromatophore rewrite, water-column hover, sepia ink blot; not Cup mantle dens, Coin bowl-drift, or Bloom gill-amble). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop `cuttlefish-tricks.js`. Window-play FLUSH unchanged — never names `flush`. Parrot owns flash — chroma is the chromatophore rewrite, not a flash copy. Not Ink/Coin/Bloom/Cup clones. No cry inventing — thank-yous are silent desk motion only. */

export const TRICK_KEY = "cuttlefish";
export const TRICKS = ["bone", "pupil", "chroma", "hover", "blot"] as const;
export const HAPPY = ["ripple", "glance", "dab"] as const;
export type CuttlefishTrickKind = (typeof TRICKS)[number];
export type CuttlefishHappyKind = (typeof HAPPY)[number];
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

export type CuttlefishTrick = {
  kind: CuttlefishTrickKind;
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

export type CuttlefishHappy = {
  kind: CuttlefishHappyKind;
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

export const HAPPY_DUR: Record<CuttlefishHappyKind, number> = {
  ripple: 1.26,
  glance: 1.22,
  dab: 1.14,
};

/** Bone hold — Sepia rides the cuttlebone mid-column. Not window-play FLUSH. Not Cup mantle plate. Not Coin drift. */
export const BONE_HOLD = 10.6;
export const RELEASE_S = 0.6;

export const DUR: Record<CuttlefishTrickKind, number> = {
  bone: BONE_HOLD + RELEASE_S,
  pupil: 1.36,
  chroma: 1.48,
  hover: 1.52,
  blot: 1.4,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: CuttlefishTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "bone") return 46 + roll * 26;
  if (kind === "chroma") return 14 + roll * 10;
  if (kind === "blot") return 16 + roll * 11;
  return justFinished ? 10 + roll * 8 : 5 + roll * 6;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: CuttlefishTrickKind | null) {
  if (musicOn) return "bone";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "bone") {
    if (roll < 0.26) return "pupil";
    if (roll < 0.48) return "chroma";
    if (roll < 0.72) return "hover";
    return "blot";
  }
  if (lastKind === "pupil") {
    if (roll < 0.28) return "bone";
    if (roll < 0.5) return "chroma";
    if (roll < 0.72) return "hover";
    return "blot";
  }
  if (lastKind === "chroma") {
    if (roll < 0.22) return "bone";
    if (roll < 0.44) return "pupil";
    if (roll < 0.66) return "hover";
    return "blot";
  }
  if (roll < 0.2) return "bone";
  if (roll < 0.4) return "pupil";
  if (roll < 0.6) return "chroma";
  if (roll < 0.8) return "hover";
  return "blot";
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
  return key === TRICK_KEY || key === "sepia";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: CuttlefishHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as CuttlefishHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: CuttlefishHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: CuttlefishHappyKind | string, x: number, facing: 1 | -1): CuttlefishHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as CuttlefishHappyKind) : "ripple";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "ripple" ? "sit" : name === "glance" ? "talk" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function ripplePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.ripple));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 1.35, rot: s * 4.5, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const fin = Math.sin(t * 3.4);
    return {
      lift: 1.35 + Math.abs(fin) * 0.28,
      rot: 4.5 + fin * 5.2,
      dx: fin * 0.18,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 1.0 * (1 - s), rot: 2.5 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function glancePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.glance));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 0.85, rot: s * -9, dx: 0, anim: "talk" as TrickAnim };
  }
  if (u < 0.8) {
    const w = Math.sin(t * 2.6);
    return {
      lift: 0.85 + Math.abs(w) * 0.2,
      rot: -9 + w * 11,
      dx: w * 0.12,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 0.85 * (1 - s), rot: -9 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function dabPose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 2.1)) * 0.55 + 1.05,
    rot: 3 + Math.sin(t * 2.8) * 5.5,
    dx: Math.sin(t * 1.6) * 0.16,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: CuttlefishHappy, dt: number, flags?: TrickFlags): CuttlefishHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: CuttlefishHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "ripple") {
    const pose = ripplePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "glance") {
    const pose = glancePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = dabPose(next.t);
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

export function beginTrick(kind: CuttlefishTrickKind, x: number, facing: 1 | -1): CuttlefishTrick {
  const anim: TrickAnim =
    kind === "bone"
      ? "sit"
      : kind === "pupil"
        ? "talk"
        : kind === "chroma"
          ? "play"
          : kind === "hover"
            ? "walk"
            : kind === "blot"
              ? "play"
              : "sit";
  return {
    kind: kind,
    phase: kind === "bone" ? "hold" : "go",
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

export function bonePose(t: number) {
  const beat = Math.sin(t * 0.95) + 0.22 * Math.sin(t * 2.7);
  return {
    lift: 1.15 + Math.abs(Math.sin(t * 0.68)) * 0.22,
    rot: 1.8 + beat * 2.4,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 1.15 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 1.8 * (1 - u) };
}

export function pupilPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.pupil));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 0.7, rot: s * -12 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.14) / 0.41;
    const w = Math.sin(s * Math.PI * 2.2);
    return {
      x: fromX + facing * w * 0.22,
      lift: 0.7 + Math.abs(w) * 0.18,
      rot: facing * (-12 + w * 16),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.55) / 0.23;
    return {
      x: fromX,
      lift: 0.7 - s * 0.15,
      rot: facing * (-4 + s * 2),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 0.55 * (1 - s),
    rot: facing * (-2 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function chromaPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.chroma));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 1.4, rot: s * 6 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.72) {
    const s = (u - 0.1) / 0.62;
    const flash = Math.sin(s * Math.PI * 5.6);
    const band = Math.sin(s * Math.PI * 2.1);
    return {
      x: fromX + facing * band * 0.3,
      lift: 1.4 + Math.abs(flash) * 0.55,
      rot: facing * (6 + flash * 12 + band * 4),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX,
    lift: 1.4 * (1 - s),
    rot: facing * (4 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function hoverPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.hover));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + facing * s * 0.4, lift: s * 1.8, rot: s * 3 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.75) {
    const s = (u - 0.12) / 0.63;
    const bob = Math.sin(s * Math.PI * 3.2);
    const fin = Math.sin(s * Math.PI * 6.4);
    return {
      x: fromX + facing * (0.4 + s * 1.6 + fin * 0.25),
      lift: 1.8 + bob * 0.35,
      rot: facing * (3 + fin * 5 + bob * 2),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.75) / 0.25);
  return {
    x: fromX + facing * (2.0 * (1 - s)),
    lift: 1.8 * (1 - s),
    rot: facing * (2 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function blotPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.blot));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 1.55, rot: s * -5 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.42) {
    const s = (u - 0.12) / 0.3;
    const cloud = Math.sin(s * Math.PI * 2.4);
    return {
      x: fromX + facing * cloud * 0.45,
      lift: 1.55 + Math.abs(cloud) * 0.5,
      rot: facing * (-5 + cloud * 9),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.72) {
    const s = (u - 0.42) / 0.3;
    return {
      x: fromX - facing * s * 0.8,
      lift: 1.55 * (1 - s * 0.45),
      rot: facing * (2 - s * 4),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX - facing * (0.8 * (1 - s)),
    lift: 0.85 * (1 - s),
    rot: facing * (-1.5 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function stepTrick(trick: CuttlefishTrick, dt: number, flags?: TrickFlags): CuttlefishTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "chroma" && trick.kind !== "hover" && trick.kind !== "blot") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: CuttlefishTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "bone") {
    if (next.t < BONE_HOLD) {
      const pose = bonePose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < BONE_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - BONE_HOLD);
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
  if (next.kind === "pupil") {
    const pose = pupilPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "chroma") {
    const pose = chromaPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "hover") {
    const pose = hoverPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = blotPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
