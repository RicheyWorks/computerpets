/** Ink ground tricks while idle. House turtle — soak / tuck / crane / plod / paddle personality. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop `turtle-tricks.js`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, or dragon move clone. Window-play BASK is unchanged — this module never names a trick `bask`. Cat already owns stretch — crane is the neck reach, not a stretch copy. Rabbit already owns periscope — crane surveys, not a hop-up. Avoids potato/loaf/nest/bow/dig/flop/zoom/popcorn/hay/rumble/zig name collisions with prior guests. */

export const TRICK_KEY = "turtle";
export const TRICKS = ["soak", "tuck", "crane", "plod", "paddle"] as const;
export const HAPPY = ["munch", "bob", "huff"] as const;
export type TurtleTrickKind = (typeof TRICKS)[number];
export type TurtleHappyKind = (typeof HAPPY)[number];
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

export type TurtleTrick = {
  kind: TurtleTrickKind;
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

export type TurtleHappy = {
  kind: TurtleHappyKind;
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

export const HAPPY_DUR: Record<TurtleHappyKind, number> = {
  munch: 1.45,
  bob: 1.18,
  huff: 1.05,
};

/** Soak hold — Ink settles as a warm blotter stone under the lamp. Not window-play bask. Not a cat loaf. Not a guinea-pig potato. */
export const SOAK_HOLD = 12;
export const RELEASE_S = 0.65;

export const DUR: Record<TurtleTrickKind, number> = {
  soak: SOAK_HOLD + RELEASE_S,
  tuck: 1.55,
  crane: 1.7,
  plod: 1.35,
  paddle: 1.2,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: TurtleTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "soak") return 44 + roll * 22;
  if (kind === "plod" || kind === "paddle") return 16 + roll * 10;
  return justFinished ? 10 + roll * 8 : 5 + roll * 6;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: TurtleTrickKind | null): TurtleTrickKind {
  if (musicOn) return "soak";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "soak") {
    if (roll < 0.28) return "crane";
    if (roll < 0.5) return "tuck";
    if (roll < 0.72) return "plod";
    return "paddle";
  }
  if (lastKind === "plod" || lastKind === "paddle") {
    if (roll < 0.36) return "soak";
    if (roll < 0.56) return "crane";
    if (roll < 0.76) return "tuck";
    return lastKind === "plod" ? "paddle" : "plod";
  }
  if (roll < 0.24) return "soak";
  if (roll < 0.42) return "crane";
  if (roll < 0.6) return "tuck";
  if (roll < 0.8) return "plod";
  return "paddle";
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
  return key === TRICK_KEY || key === "ink";
}

export function startThankYou(
  key: string | undefined,
  lastKind: TurtleHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: TurtleHappyKind | null, rand?: number): TurtleHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] ?? list[0]!;
}

export function beginHappy(kind: TurtleHappyKind, x: number, facing: 1 | -1 = 1): TurtleHappy {
  const name: TurtleHappyKind = HAPPY.includes(kind) ? kind : "munch";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "munch" ? "sit" : name === "bob" ? "talk" : "play",
    facing,
    fromX: x,
  };
}

export function munchPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.munch));
  if (u < 0.25) {
    const s = u / 0.25;
    return { lift: -s * 1.5, rot: s * 4, dx: 0, anim: "sit" as const };
  }
  if (u < 0.85) {
    return {
      lift: -1.5 + Math.abs(Math.sin(t * 9)) * 1.2,
      rot: 4 + Math.sin(t * 8) * 3,
      dx: 0,
      anim: "sit" as const,
    };
  }
  const s = (u - 0.85) / 0.15;
  return { lift: -1.5 * (1 - s), rot: 4 * (1 - s), dx: 0, anim: "sit" as const };
}

export function bobPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.bob));
  if (u < 0.9) {
    return {
      lift: Math.abs(Math.sin(t * 11)) * 2.8,
      rot: Math.sin(t * 10) * 5,
      dx: 0,
      anim: "talk" as const,
    };
  }
  return { lift: 0, rot: Math.sin(((u - 0.9) / 0.1) * Math.PI) * 2, dx: 0, anim: "sit" as const };
}

export function huffPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.huff));
  return {
    lift: Math.sin(u * Math.PI) * 3.5,
    rot: Math.sin(u * Math.PI * 2) * 4,
    dx: Math.sin(u * Math.PI) * 1.5,
    anim: "play" as const,
  };
}

export function stepHappy(happy: TurtleHappy, dt: number, flags?: TrickFlags): TurtleHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: TurtleHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "munch") {
    const pose = munchPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "bob") {
    const pose = bobPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = huffPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

/** Ink has no Rui-style sleep-frame hold. */
export function sleepHoldFrame(_key: string | undefined, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: TurtleTrickKind, x: number, facing: 1 | -1 = 1): TurtleTrick {
  const anim: TrickAnim =
    kind === "soak" || kind === "tuck" || kind === "crane"
      ? "sit"
      : kind === "plod" || kind === "paddle"
        ? "walk"
        : "sit";
  return {
    kind,
    phase: kind === "soak" ? "hold" : "go",
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

/** Warm blotter soak — shell flat, slight tilt toward the lamp. Not window-play bask. Not a cat loaf. Not a guinea-pig potato. */
export function soakPose() {
  return { lift: -2.8, rot: 3 };
}

/** Soft unsoak — head and limbs ease out, no hop. */
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: -2.8 + Math.sin(u * Math.PI) * 4, rot: 3 - Math.sin(u * Math.PI) * 4 };
}

/** Shell tuck — head withdraws, shell rounds. Not a hamster nest. Not box-turtle window shut. */
export function tuckPose(t: number) {
  const u = Math.max(0, Math.min(1, t / DUR.tuck));
  if (u < 0.22) {
    const s = smoothstep(u / 0.22);
    return { lift: -s * 3.2, rot: s * 2, dx: 0, anim: "sit" as const };
  }
  if (u < 0.78) {
    return {
      lift: -3.2 + Math.abs(Math.sin(t * 4)) * 0.6,
      rot: 2 + Math.sin(t * 3) * 1.5,
      dx: 0,
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return { lift: -3.2 * (1 - s), rot: 2 * (1 - s), dx: 0, anim: "sit" as const };
}

/** Crane neck — long reach up to survey the blotter. Not a cat stretch. Not a rabbit periscope. */
export function cranePose(t: number) {
  const u = Math.max(0, Math.min(1, t / DUR.crane));
  if (u < 0.28) {
    const s = smoothstep(u / 0.28);
    return { lift: s * 5.5, rot: -s * 10, dx: 0, anim: "sit" as const };
  }
  if (u < 0.72) {
    return {
      lift: 5.5 + Math.sin(t * 3) * 0.8,
      rot: -10 + Math.sin(t * 2.5) * 3,
      dx: Math.sin(t * 2) * 0.8,
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return { lift: 5.5 * (1 - s), rot: -10 * (1 - s), dx: 0, anim: "sit" as const };
}

/** Plod — slow deliberate desk crawl. Not a dog zoom. Not a hamster scurry. Not a guinea-pig zig. */
export function plodPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.plod));
  if (u < 0.15) {
    const s = smoothstep(u / 0.15);
    return { x: fromX, lift: -s * 1, rot: s * 3, anim: "sit" as const };
  }
  if (u < 0.88) {
    const s = (u - 0.15) / 0.73;
    const rock = Math.sin(s * Math.PI * 3);
    return {
      x: fromX + facing * 12 * smoothstep(s),
      lift: Math.abs(rock) * 1.8,
      rot: rock * 6,
      anim: "walk" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + facing * 12,
    lift: 1 * (1 - s),
    rot: 2 * (1 - s),
    anim: "sit" as const,
  };
}

/** Paddle — soft swimming feet in place, tiny lateral scoot. Not a dog wag. Not Relay buzz. */
export function paddlePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.paddle));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: -s * 0.8, rot: s * 2, anim: "sit" as const };
  }
  if (u < 0.88) {
    const s = (u - 0.12) / 0.76;
    const stroke = Math.sin(s * Math.PI * 4);
    return {
      x: fromX + facing * 4 * Math.sin(s * Math.PI),
      lift: Math.abs(stroke) * 2.2,
      rot: stroke * 8,
      anim: "walk" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX,
    lift: 0.8 * (1 - s),
    rot: 2 * (1 - s),
    anim: "sit" as const,
  };
}

export function stepTrick(trick: TurtleTrick, dt: number, flags?: TrickFlags): TurtleTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "plod" && trick.kind !== "paddle") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: TurtleTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "soak") {
    if (next.t < SOAK_HOLD) {
      const pose = soakPose();
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < SOAK_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - SOAK_HOLD);
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
  if (next.kind === "tuck") {
    const pose = tuckPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "crane") {
    const pose = cranePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "plod") {
    const pose = plodPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = paddlePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
