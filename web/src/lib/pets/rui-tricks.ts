/** Rui ground tricks while idle. Feed-happy dances sit after eat. Card-open freeze and leftover window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop `rui-tricks.js`. */

export const TRICK_KEY = "red_panda";
export const TRICKS = ["somersault", "lie", "scratch", "wave", "dance"] as const;
export const HAPPY = ["twirl", "bounce", "shuffle"] as const;
export type RuiTrickKind = (typeof TRICKS)[number];
export type RuiHappyKind = (typeof HAPPY)[number];
export type TrickAnim = "idle" | "walk" | "sit" | "sleep" | "talk" | "play";
export type TrickPhase = "go" | "lie" | "stretch" | "flip" | "done";
export type HappyPhase = "go" | "done";

export type TrickFlags = {
  asleep?: boolean;
  hidden?: boolean;
  leaving?: boolean;
  cmd?: string;
  windowPlay?: boolean;
  card?: boolean;
};

export type RuiTrick = {
  kind: RuiTrickKind;
  phase: TrickPhase;
  t: number;
  x: number;
  lift: number;
  rot: number;
  anim: TrickAnim;
  facing: 1 | -1;
  fromX?: number;
  flipFrom?: number;
  abort?: boolean;
};

export type RuiHappy = {
  kind: RuiHappyKind;
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

export const HAPPY_DUR: Record<RuiHappyKind, number> = {
  twirl: 1.35,
  bounce: 1.22,
  shuffle: 1.58,
};

/** sleep/2.png — lying down, eyes closed. Frames 3–4 are standing and must not loop. */
export const SLEEP_HOLD_FRAME = 1;
export const LIE_HOLD = 12;
export const STRETCH_S = 1.4;
export const FLIP_S = 0.92;

export const DUR: Record<RuiTrickKind, number> = {
  somersault: 0.92,
  lie: LIE_HOLD + STRETCH_S + FLIP_S,
  scratch: 1.35,
  wave: 1.15,
  dance: 2.8,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: RuiTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "lie") return 48 + roll * 24;
  return justFinished ? 9 + roll * 8 : 4 + roll * 6;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: RuiTrickKind | null): RuiTrickKind {
  if (musicOn) return "dance";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "lie") {
    if (roll < 0.28) return "somersault";
    if (roll < 0.5) return "scratch";
    if (roll < 0.72) return "wave";
    return "dance";
  }
  if (roll < 0.18) return "somersault";
  if (roll < 0.26) return "lie";
  if (roll < 0.52) return "scratch";
  if (roll < 0.74) return "wave";
  return "dance";
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
  return key === TRICK_KEY || key === "rui";
}

export function startThankYou(
  key: string | undefined,
  lastKind: RuiHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: RuiHappyKind | null, rand?: number): RuiHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] ?? list[0]!;
}

export function beginHappy(kind: RuiHappyKind, x: number, facing: 1 | -1 = 1): RuiHappy {
  const name: RuiHappyKind = HAPPY.includes(kind) ? kind : "twirl";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "shuffle" ? "walk" : "play",
    facing,
    fromX: x,
  };
}

export function twirlPose(t: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.twirl));
  return {
    lift: Math.abs(Math.sin(u * Math.PI * 2)) * 16,
    rot: facing * 320 * u,
    dx: 0,
    anim: "play" as const,
  };
}

export function bouncePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.bounce));
  return {
    lift: Math.abs(Math.sin(u * Math.PI * 3)) * 28,
    rot: Math.sin(u * Math.PI * 3) * 10,
    dx: Math.sin(u * Math.PI * 3) * 4,
    anim: "play" as const,
  };
}

export function shufflePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.shuffle));
  if (u < 0.38) {
    const s = u / 0.38;
    return { x: fromX + facing * 36 * s, lift: 0, rot: 0, anim: "walk" as const };
  }
  if (u < 0.76) {
    const s = (u - 0.38) / 0.38;
    return { x: fromX + facing * 36 * (1 - s), lift: 0, rot: 0, anim: "walk" as const };
  }
  return { x: fromX, lift: 2, rot: Math.sin(((u - 0.76) / 0.24) * Math.PI) * 8, anim: "sit" as const };
}

export function stepHappy(happy: RuiHappy, dt: number, flags?: TrickFlags): RuiHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: RuiHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "twirl") {
    const pose = twirlPose(next.t, next.facing);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "bounce") {
    const pose = bouncePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = shufflePose(next.t, next.fromX != null ? next.fromX : next.x, next.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

export function sleepHoldFrame(key: string | undefined, frameCount?: number) {
  if (key !== TRICK_KEY) return null;
  const len = Number(frameCount) || 0;
  if (len <= 0) return SLEEP_HOLD_FRAME;
  return Math.min(SLEEP_HOLD_FRAME, len - 1);
}

export function beginTrick(kind: RuiTrickKind, x: number, facing: 1 | -1 = 1): RuiTrick {
  const anim: TrickAnim =
    kind === "lie" ? "sleep" : kind === "scratch" ? "sit" : kind === "wave" ? "talk" : "play";
  return {
    kind,
    phase: kind === "lie" ? "lie" : "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim,
    facing,
    fromX: x,
    flipFrom: x,
  };
}

function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

/** Somersault is a rotate+arc on existing play frames, same spirit as the dive leftover. */
export function somersaultPath(u: number, fromX: number, facing: 1 | -1) {
  const t = Math.max(0, Math.min(1, u));
  const ease = smoothstep(t);
  return {
    x: fromX + facing * 92 * ease,
    lift: Math.sin(t * Math.PI) * 46,
    rot: facing * 360 * t,
  };
}

export function wavePose(t: number) {
  return { lift: 4 + Math.abs(Math.sin(t * 10)) * 6, rot: Math.sin(t * 10) * 14 };
}

export function scratchPose(t: number) {
  return { lift: 0, rot: Math.sin(t * 22) * 8, dx: Math.sin(t * 22) * 3 };
}

export function liePose() {
  return { lift: 0, rot: 0 };
}

export function stretchPose(t: number) {
  const u = Math.max(0, Math.min(1, t / STRETCH_S));
  return { lift: Math.sin(u * Math.PI) * 8, rot: Math.sin(u * Math.PI) * 6 };
}

export function dancePose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 8)) * 10,
    rot: Math.sin(t * 6) * 12,
    dx: Math.sin(t * 5) * 6,
  };
}

export function stepTrick(trick: RuiTrick, dt: number, flags?: TrickFlags): RuiTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "somersault" && trick.phase !== "flip") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: RuiTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "lie") {
    if (next.t < LIE_HOLD) {
      const pose = liePose();
      next.phase = "lie";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sleep";
      return next;
    }
    if (next.t < LIE_HOLD + STRETCH_S) {
      const pose = stretchPose(next.t - LIE_HOLD);
      next.phase = "stretch";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      next.flipFrom = next.x;
      return next;
    }
    if (next.t < LIE_HOLD + STRETCH_S + FLIP_S) {
      const u = (next.t - LIE_HOLD - STRETCH_S) / FLIP_S;
      const from = trick.flipFrom != null ? trick.flipFrom : trick.x;
      const pose = somersaultPath(Math.min(1, u), from, trick.facing);
      next.phase = "flip";
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.flipFrom = from;
      return next;
    }
    return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  }
  const hold = DUR[next.kind];
  const u = next.t / hold;
  if (next.kind === "somersault") {
    const pose = somersaultPath(Math.min(1, u), trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "play";
  } else if (next.kind === "scratch") {
    const pose = scratchPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "sit";
  } else if (next.kind === "wave") {
    const pose = wavePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "talk";
  } else {
    const pose = dancePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "play";
  }
  if (u >= 1) {
    return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  }
  return next;
}
