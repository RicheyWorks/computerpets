/** Coin ground tricks while idle. House goldfish — drift / gulp / flare / glint / dart personality. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop `goldfish-tricks.js`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, or dragon move clone. Window-play CIRCLE is unchanged — this module never names a trick `circle`. Special Loop is unchanged — never names a trick `loop`. Turtle already owns paddle — dart is a short bowl dash, not a paddle copy. Earth already owns gleam as thank-you — glint is the light-catch tilt. Avoids soak/tuck/crane/plod/potato/loaf/nest/bow/dig/flop/zoom/popcorn/hay/rumble/zig/scurry name collisions with prior guests. */

export const TRICK_KEY = "goldfish";
export const TRICKS = ["drift", "gulp", "flare", "glint", "dart"] as const;
export const HAPPY = ["bubble", "lip", "swish"] as const;
export type GoldfishTrickKind = (typeof TRICKS)[number];
export type GoldfishHappyKind = (typeof HAPPY)[number];
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

export type GoldfishTrick = {
  kind: GoldfishTrickKind;
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

export type GoldfishHappy = {
  kind: GoldfishHappyKind;
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

export const HAPPY_DUR: Record<GoldfishHappyKind, number> = {
  bubble: 1.28,
  lip: 1.15,
  swish: 1.05,
};

/** Drift hold — Coin hangs mid-bowl on one honest thought. Not window-play circle. Not a turtle soak. Not a guinea-pig potato. */
export const DRIFT_HOLD = 11;
export const RELEASE_S = 0.6;

export const DUR: Record<GoldfishTrickKind, number> = {
  drift: DRIFT_HOLD + RELEASE_S,
  gulp: 1.35,
  flare: 1.5,
  glint: 1.28,
  dart: 1.05,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: GoldfishTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "drift") return 42 + roll * 22;
  if (kind === "dart") return 15 + roll * 10;
  return justFinished ? 10 + roll * 8 : 5 + roll * 6;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: GoldfishTrickKind | null): GoldfishTrickKind {
  if (musicOn) return "drift";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "drift") {
    if (roll < 0.26) return "gulp";
    if (roll < 0.48) return "flare";
    if (roll < 0.7) return "glint";
    return "dart";
  }
  if (lastKind === "dart") {
    if (roll < 0.36) return "drift";
    if (roll < 0.56) return "gulp";
    if (roll < 0.76) return "flare";
    return "glint";
  }
  if (roll < 0.24) return "drift";
  if (roll < 0.42) return "gulp";
  if (roll < 0.6) return "flare";
  if (roll < 0.8) return "glint";
  return "dart";
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
  return key === TRICK_KEY || key === "coin";
}

export function startThankYou(
  key: string | undefined,
  lastKind: GoldfishHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: GoldfishHappyKind | null, rand?: number): GoldfishHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] ?? list[0]!;
}

export function beginHappy(kind: GoldfishHappyKind, x: number, facing: 1 | -1 = 1): GoldfishHappy {
  const name: GoldfishHappyKind = HAPPY.includes(kind) ? kind : "bubble";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "bubble" ? "talk" : name === "lip" ? "sit" : "play",
    facing,
    fromX: x,
  };
}

export function bubblePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.bubble));
  if (u < 0.2) {
    const s = u / 0.2;
    return { lift: s * 2.5, rot: -s * 4, dx: 0, anim: "talk" as const };
  }
  if (u < 0.85) {
    return {
      lift: 2.5 + Math.abs(Math.sin(t * 8)) * 2.2,
      rot: -4 + Math.sin(t * 7) * 5,
      dx: 0,
      anim: "talk" as const,
    };
  }
  const s = (u - 0.85) / 0.15;
  return { lift: 2.5 * (1 - s), rot: -4 * (1 - s), dx: 0, anim: "sit" as const };
}

export function lipPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.lip));
  if (u < 0.9) {
    return {
      lift: Math.abs(Math.sin(t * 12)) * 1.6,
      rot: Math.sin(t * 14) * 6,
      dx: 0,
      anim: "sit" as const,
    };
  }
  return { lift: 0, rot: Math.sin(((u - 0.9) / 0.1) * Math.PI) * 2, dx: 0, anim: "idle" as const };
}

export function swishPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.swish));
  return {
    lift: Math.sin(u * Math.PI) * 2.8,
    rot: Math.sin(u * Math.PI * 3) * 10,
    dx: Math.sin(u * Math.PI * 2) * 2.5,
    anim: "play" as const,
  };
}

export function stepHappy(happy: GoldfishHappy, dt: number, flags?: TrickFlags): GoldfishHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: GoldfishHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "bubble") {
    const pose = bubblePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "lip") {
    const pose = lipPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = swishPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

/** Coin has no Rui-style sleep-frame hold. */
export function sleepHoldFrame(_key: string | undefined, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: GoldfishTrickKind, x: number, facing: 1 | -1 = 1): GoldfishTrick {
  const anim: TrickAnim =
    kind === "drift" || kind === "gulp" || kind === "flare" || kind === "glint"
      ? "sit"
      : kind === "dart"
        ? "walk"
        : "sit";
  return {
    kind,
    phase: kind === "drift" ? "hold" : "go",
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

/** Mid-bowl drift — soft hang, tiny undulation. Not window-play circle. Not a turtle soak. Not a cat loaf. */
export function driftPose(t: number) {
  return {
    lift: 3.2 + Math.sin(t * 1.6) * 1.4,
    rot: Math.sin(t * 1.1) * 4,
  };
}

/** Soft undrift — thought lets go, fins ease. */
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 3.2 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 4 * (1 - u) };
}

/** Surface gulp — mouth works the waterline. Ethogram gulp, ground-side. */
export function gulpPose(t: number) {
  const u = Math.max(0, Math.min(1, t / DUR.gulp));
  if (u < 0.2) {
    const s = smoothstep(u / 0.2);
    return { lift: s * 4.5, rot: -s * 6, dx: 0, anim: "sit" as const };
  }
  if (u < 0.8) {
    return {
      lift: 4.5 + Math.abs(Math.sin(t * 10)) * 1.5,
      rot: -6 + Math.sin(t * 9) * 4,
      dx: 0,
      anim: "talk" as const,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return { lift: 4.5 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "sit" as const };
}

/** Fin flare — pectorals and dorsal pulse open. Ethogram flare, ground-side. */
export function flarePose(t: number) {
  const u = Math.max(0, Math.min(1, t / DUR.flare));
  if (u < 0.22) {
    const s = smoothstep(u / 0.22);
    return { lift: s * 2.2, rot: s * 8, dx: 0, anim: "sit" as const };
  }
  if (u < 0.78) {
    return {
      lift: 2.2 + Math.abs(Math.sin(t * 5)) * 1.8,
      rot: 8 + Math.sin(t * 6) * 7,
      dx: Math.sin(t * 4) * 1.2,
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return { lift: 2.2 * (1 - s), rot: 8 * (1 - s), dx: 0, anim: "sit" as const };
}

/** Glint — metal body tilts to catch the lamp. Not Earth gleam thank-you. Not a cat wash. */
export function glintPose(t: number) {
  const u = Math.max(0, Math.min(1, t / DUR.glint));
  if (u < 0.25) {
    const s = smoothstep(u / 0.25);
    return { lift: s * 1.5, rot: -s * 14, dx: 0, anim: "sit" as const };
  }
  if (u < 0.75) {
    return {
      lift: 1.5 + Math.sin(t * 3) * 0.6,
      rot: -14 + Math.sin(t * 2.2) * 4,
      dx: Math.sin(t * 2) * 0.6,
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.75) / 0.25);
  return { lift: 1.5 * (1 - s), rot: -14 * (1 - s), dx: 0, anim: "sit" as const };
}

/** Dart — short bowl dash then settle. Not a dog zoom. Not a hamster scurry. Not a turtle paddle. Not window-play circle. */
export function dartPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.dart));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 1.2, rot: -s * 5, anim: "sit" as const };
  }
  if (u < 0.82) {
    const s = (u - 0.12) / 0.7;
    const kick = Math.sin(s * Math.PI);
    return {
      x: fromX + facing * 18 * smoothstep(s),
      lift: 1.2 + kick * 3.5,
      rot: -5 + Math.sin(s * Math.PI * 2) * 8,
      anim: "walk" as const,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX + facing * 18,
    lift: 1.5 * (1 - s),
    rot: 3 * (1 - s),
    anim: "sit" as const,
  };
}

export function stepTrick(trick: GoldfishTrick, dt: number, flags?: TrickFlags): GoldfishTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "dart") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: GoldfishTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "drift") {
    if (next.t < DRIFT_HOLD) {
      const pose = driftPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < DRIFT_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - DRIFT_HOLD);
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
  if (next.kind === "gulp") {
    const pose = gulpPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "flare") {
    const pose = flarePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "glint") {
    const pose = glintPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = dartPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
