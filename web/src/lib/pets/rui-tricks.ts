/** Rui ground tricks while idle. Sleep, hide, card, and window-play still win. Same map as desktop `rui-tricks.js`. */

export const TRICK_KEY = "red_panda";
export const TRICKS = ["somersault", "lie", "scratch", "wave", "dance"] as const;
export type RuiTrickKind = (typeof TRICKS)[number];
export type TrickAnim = "idle" | "walk" | "sit" | "sleep" | "talk" | "play";
export type TrickPhase = "go" | "lie" | "stretch" | "flip" | "done";

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
  if (kind === "lie") return 16 + roll * 10;
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
  if (roll < 0.38) return "lie";
  if (roll < 0.58) return "scratch";
  if (roll < 0.76) return "wave";
  return "dance";
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
