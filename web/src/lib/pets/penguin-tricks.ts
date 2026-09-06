/** Peck ground tricks while idle. House penguin — huddle / toboggan / waddle / porpoise / trumpet personality. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop `penguin-tricks.js`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, or dragon move clone. Window-play BOW is unchanged — this module never names a trick `bow`. Pip already owns bow. Budgie already owns preen. Turtle already owns paddle. Avoids soak/tuck/crane/plod/paddle/potato/loaf/nest/bow/dig/flop/zoom/popcorn/hay/rumble/zig/scurry/drift/gulp/flare/glint/dart/circle/loop/preen/bobble/mimic/sidle/dangle/perch/den/mouser/stalk/trot/prance name collisions with prior guests. */

export const TRICK_KEY = "penguin";
export const TRICKS = ["huddle", "toboggan", "waddle", "porpoise", "trumpet"] as const;
export const HAPPY = ["bray", "beak", "shimmy"] as const;
export type PenguinTrickKind = (typeof TRICKS)[number];
export type PenguinHappyKind = (typeof HAPPY)[number];
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

export type PenguinTrick = {
  kind: PenguinTrickKind;
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

export type PenguinHappy = {
  kind: PenguinHappyKind;
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

export const HAPPY_DUR: Record<PenguinHappyKind, number> = {
  bray: 1.22,
  beak: 1.12,
  shimmy: 1.18,
};

/** Huddle hold — Peck packs into a formal heat-ball on the cold tile. Not a cat loaf. Not a fox den. Not a hamster nest. Not an earth bed. */
export const HUDDLE_HOLD = 10;
export const RELEASE_S = 0.55;

export const DUR: Record<PenguinTrickKind, number> = {
  huddle: HUDDLE_HOLD + RELEASE_S,
  toboggan: 1.32,
  waddle: 1.4,
  porpoise: 1.26,
  trumpet: 1.2,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: PenguinTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "huddle") return 40 + roll * 20;
  if (kind === "toboggan") return 15 + roll * 10;
  if (kind === "trumpet") return 12 + roll * 9;
  return justFinished ? 10 + roll * 8 : 5 + roll * 6;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: PenguinTrickKind | null): PenguinTrickKind {
  if (musicOn) return "huddle";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "huddle") {
    if (roll < 0.26) return "toboggan";
    if (roll < 0.48) return "waddle";
    if (roll < 0.72) return "porpoise";
    return "trumpet";
  }
  if (lastKind === "toboggan") {
    if (roll < 0.34) return "huddle";
    if (roll < 0.54) return "waddle";
    if (roll < 0.76) return "porpoise";
    return "trumpet";
  }
  if (lastKind === "trumpet") {
    if (roll < 0.22) return "huddle";
    if (roll < 0.42) return "toboggan";
    if (roll < 0.66) return "waddle";
    return "porpoise";
  }
  if (roll < 0.22) return "huddle";
  if (roll < 0.4) return "toboggan";
  if (roll < 0.6) return "waddle";
  if (roll < 0.8) return "porpoise";
  return "trumpet";
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
  return key === TRICK_KEY || key === "peck";
}

export function startThankYou(
  key: string | undefined,
  lastKind: PenguinHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: PenguinHappyKind | null, rand?: number): PenguinHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] ?? list[0]!;
}

export function beginHappy(kind: PenguinHappyKind, x: number, facing: 1 | -1 = 1): PenguinHappy {
  const name: PenguinHappyKind = HAPPY.includes(kind) ? kind : "bray";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "bray" ? "talk" : name === "shimmy" ? "play" : "sit",
    facing,
    fromX: x,
  };
}

export function brayPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.bray));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 3.5, rot: -s * 8, dx: 0, anim: "talk" as const };
  }
  if (u < 0.8) {
    return {
      lift: 3.5 + Math.abs(Math.sin(t * 10)) * 2,
      rot: -8 + Math.sin(t * 12) * 6,
      dx: 0,
      anim: "talk" as const,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 3.5 * (1 - s), rot: -8 * (1 - s), dx: 0, anim: "sit" as const };
}

export function beakPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.beak));
  return {
    lift: Math.sin(u * Math.PI) * 1.8,
    rot: Math.sin(u * Math.PI * 3) * 9,
    dx: Math.sin(u * Math.PI) * 2.8,
    anim: "sit" as const,
  };
}

export function shimmyPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.shimmy));
  if (u < 0.88) {
    return {
      lift: Math.abs(Math.sin(t * 14)) * 3.2,
      rot: Math.sin(t * 16) * 12,
      dx: Math.sin(t * 11) * 1.6,
      anim: "play" as const,
    };
  }
  return { lift: 0, rot: Math.sin(((u - 0.88) / 0.12) * Math.PI) * 3, dx: 0, anim: "idle" as const };
}

export function stepHappy(happy: PenguinHappy, dt: number, flags?: TrickFlags): PenguinHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: PenguinHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "bray") {
    const pose = brayPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "beak") {
    const pose = beakPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = shimmyPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

/** Peck has no Rui-style sleep-frame hold. */
export function sleepHoldFrame(_key: string | undefined, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: PenguinTrickKind, x: number, facing: 1 | -1 = 1): PenguinTrick {
  const anim: TrickAnim =
    kind === "huddle"
      ? "sit"
      : kind === "toboggan"
        ? "play"
        : kind === "waddle"
          ? "walk"
          : kind === "porpoise"
            ? "play"
            : kind === "trumpet"
              ? "talk"
              : "sit";
  return {
    kind,
    phase: kind === "huddle" ? "hold" : "go",
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

/** Huddle — formal heat-ball on cold tile. Not a cat loaf. Not a fox den. Not a hamster nest. */
export function huddlePose(t: number) {
  return {
    lift: 0.6 + Math.sin(t * 1.5) * 0.35,
    rot: 10 + Math.sin(t * 1.3) * 3.5 + Math.sin(t * 2.6) * 1.8,
  };
}

/** Soft un-huddle — shoulders open, bill finds the room again. */
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 0.6 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 10 * (1 - u) };
}

/** Toboggan — belly slide on the desk ice. Not a turtle paddle. Not a dog zoom. Ethogram penguin true. */
export function tobogganPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.toboggan));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: -s * 2.5, rot: s * 18 * facing, anim: "sit" as const };
  }
  if (u < 0.82) {
    const s = (u - 0.14) / 0.68;
    return {
      x: fromX + facing * 28 * smoothstep(s),
      lift: -2.5 + Math.sin(s * Math.PI) * 1.2,
      rot: facing * (18 - s * 6),
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX + facing * 28,
    lift: -2.5 * (1 - s),
    rot: facing * 12 * (1 - s),
    anim: "sit" as const,
  };
}

/** Waddle — side-to-side upright gait. Not a fox trot. Not a hamster scurry. Not a budgie sidle. */
export function waddlePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.waddle));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 1.2, rot: s * 8 * facing, anim: "sit" as const };
  }
  if (u < 0.88) {
    const s = (u - 0.1) / 0.78;
    const step = Math.sin(s * Math.PI * 5);
    return {
      x: fromX + facing * 16 * smoothstep(s),
      lift: 1.2 + Math.abs(step) * 2.2,
      rot: facing * (8 + step * 10),
      anim: "walk" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + facing * 16,
    lift: 1.2 * (1 - s),
    rot: facing * 4 * (1 - s),
    anim: "sit" as const,
  };
}

/** Porpoise — leap-swim arcs on desk ice. Not a rabbit binky. Not a guinea-pig popcorn. Not a fox prance. */
export function porpoisePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.porpoise));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2, rot: -s * 6, anim: "sit" as const };
  }
  if (u < 0.88) {
    const s = (u - 0.12) / 0.76;
    const arc = Math.sin(s * Math.PI * 2.5);
    return {
      x: fromX + facing * 24 * smoothstep(s),
      lift: 2 + Math.max(0, arc) * 12,
      rot: facing * (arc * 16),
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + facing * 24,
    lift: 2 * (1 - s),
    rot: facing * 4 * (1 - s),
    anim: "sit" as const,
  };
}

/** Trumpet — ecstatic display. Bill up, flippers out. Not window-play bow. Not a budgie mimic. Not Echo whistle. */
export function trumpetPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.trumpet));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return {
      x: fromX,
      lift: s * 5,
      rot: -s * 12,
      anim: "talk" as const,
    };
  }
  if (u < 0.82) {
    return {
      x: fromX + facing * Math.sin(t * 7) * 1.2,
      lift: 5 + Math.abs(Math.sin(t * 9)) * 2.5,
      rot: -12 + Math.sin(t * 8) * 8,
      anim: "talk" as const,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: 5 * (1 - s),
    rot: -12 * (1 - s),
    anim: "sit" as const,
  };
}

export function stepTrick(trick: PenguinTrick, dt: number, flags?: TrickFlags): PenguinTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "toboggan" && trick.kind !== "porpoise") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: PenguinTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "huddle") {
    if (next.t < HUDDLE_HOLD) {
      const pose = huddlePose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < HUDDLE_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - HUDDLE_HOLD);
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
  if (next.kind === "toboggan") {
    const pose = tobogganPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "waddle") {
    const pose = waddlePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "porpoise") {
    const pose = porpoisePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = trumpetPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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