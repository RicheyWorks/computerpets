/** Fuse ground tricks while idle. Cartridge Dragon — seat / hold-current / blow / reseat personality. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop `fuse-tricks.js`. Not a Rui or Relay move clone. Window-play `hold` is unchanged. */

export const TRICK_KEY = "fuse_dragon";
export const TRICKS = ["seat", "current", "blow", "reseat"] as const;
export const HAPPY = ["warm", "snap", "pulse"] as const;
export type FuseTrickKind = (typeof TRICKS)[number];
export type FuseHappyKind = (typeof HAPPY)[number];
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

export type FuseTrick = {
  kind: FuseTrickKind;
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

export type FuseHappy = {
  kind: FuseHappyKind;
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

export const HAPPY_DUR: Record<FuseHappyKind, number> = {
  warm: 1.28,
  snap: 1.12,
  pulse: 1.36,
};

/** Intact-filament hold — Fuse seats as a cartridge and carries current, then soft-releases. No Relay hop. */
export const CURRENT_HOLD = 9.5;
export const RELEASE_S = 0.55;

export const DUR: Record<FuseTrickKind, number> = {
  seat: 1.05,
  current: CURRENT_HOLD + RELEASE_S,
  blow: 0.92,
  reseat: 2.2,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: FuseTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "current") return 42 + roll * 20;
  if (kind === "blow") return 14 + roll * 10;
  return justFinished ? 9 + roll * 8 : 4 + roll * 6;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: FuseTrickKind | null): FuseTrickKind {
  if (musicOn) return "current";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "current") {
    if (roll < 0.34) return "seat";
    if (roll < 0.58) return "reseat";
    return "blow";
  }
  if (lastKind === "blow") {
    if (roll < 0.55) return "reseat";
    if (roll < 0.8) return "seat";
    return "current";
  }
  if (roll < 0.28) return "seat";
  if (roll < 0.4) return "current";
  if (roll < 0.62) return "blow";
  return "reseat";
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
  return key === TRICK_KEY || key === "fuse";
}

export function startThankYou(
  key: string | undefined,
  lastKind: FuseHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: FuseHappyKind | null, rand?: number): FuseHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] ?? list[0]!;
}

export function beginHappy(kind: FuseHappyKind, x: number, facing: 1 | -1 = 1): FuseHappy {
  const name: FuseHappyKind = HAPPY.includes(kind) ? kind : "warm";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "snap" ? "sit" : name === "pulse" ? "talk" : "play",
    facing,
    fromX: x,
  };
}

export function warmPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.warm));
  return {
    lift: Math.sin(u * Math.PI) * 10,
    rot: Math.sin(u * Math.PI * 2) * 6,
    dx: 0,
    anim: "play" as const,
  };
}

export function snapPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.snap));
  if (u < 0.35) {
    const s = u / 0.35;
    return { lift: (1 - s) * 6, rot: (1 - s) * 8, dx: 0, anim: "sit" as const };
  }
  if (u < 0.7) {
    return { lift: 0, rot: Math.sin(((u - 0.35) / 0.35) * Math.PI) * 5, dx: 0, anim: "sit" as const };
  }
  return { lift: 1, rot: 0, dx: 0, anim: "sit" as const };
}

export function pulsePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.pulse));
  if (u < 0.75) {
    return {
      lift: Math.abs(Math.sin(t * 18)) * 5,
      rot: Math.sin(t * 20) * 7,
      dx: Math.sin(t * 20) * 1.5,
      anim: "talk" as const,
    };
  }
  return { lift: 0, rot: Math.sin(((u - 0.75) / 0.25) * Math.PI) * 3, dx: 0, anim: "sit" as const };
}

export function stepHappy(happy: FuseHappy, dt: number, flags?: TrickFlags): FuseHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: FuseHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "warm") {
    const pose = warmPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "snap") {
    const pose = snapPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = pulsePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

/** Fuse has no Rui-style sleep-frame hold. */
export function sleepHoldFrame(_key: string | undefined, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: FuseTrickKind, x: number, facing: 1 | -1 = 1): FuseTrick {
  const anim: TrickAnim =
    kind === "seat" || kind === "current" ? "sit" : kind === "blow" ? "play" : kind === "reseat" ? "walk" : "sit";
  return {
    kind,
    phase: kind === "current" ? "hold" : "go",
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

/** Seat into the clip — short settle, not a Relay click chatter. */
export function seatPose(t: number) {
  const u = Math.max(0, Math.min(1, t / DUR.seat));
  if (u < 0.45) {
    const s = u / 0.45;
    return { lift: (1 - s) * 8, rot: (1 - smoothstep(s)) * 10, anim: "sit" as const };
  }
  return { lift: 0, rot: Math.sin(((u - 0.45) / 0.55) * Math.PI) * 3, anim: "sit" as const };
}

export function currentPose() {
  return { lift: 0, rot: 0 };
}

/** Soft filament cool-down — no hop, no half-flip. */
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: Math.sin(u * Math.PI) * 4, rot: Math.sin(u * Math.PI * 2) * 6 };
}

/** Filament blows — one sharp pop, then drop back into the clip posture. */
export function blowPose(t: number) {
  const u = Math.max(0, Math.min(1, t / DUR.blow));
  if (u < 0.22) {
    const s = u / 0.22;
    return { lift: s * 26, rot: s * 28, dx: s * 4, anim: "play" as const };
  }
  if (u < 0.55) {
    const s = (u - 0.22) / 0.33;
    return {
      lift: 26 * (1 - s) + Math.abs(Math.sin(s * Math.PI * 3)) * 4,
      rot: Math.sin(s * Math.PI * 4) * 18,
      dx: Math.sin(s * Math.PI * 4) * 3,
      anim: "play" as const,
    };
  }
  const s = (u - 0.55) / 0.45;
  return { lift: (1 - s) * 4, rot: (1 - s) * 6, dx: 0, anim: "sit" as const };
}

/** Walk a short bay, then seat back into the clip. */
export function reseatPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.reseat));
  if (u < 0.45) {
    const s = smoothstep(u / 0.45);
    return { x: fromX + facing * 36 * s, lift: 0, rot: 0, anim: "walk" as const };
  }
  if (u < 0.7) {
    const s = (u - 0.45) / 0.25;
    return {
      x: fromX + facing * 36,
      lift: (1 - s) * 5,
      rot: (1 - s) * 8,
      anim: "sit" as const,
    };
  }
  return {
    x: fromX + facing * 36,
    lift: 0,
    rot: Math.sin(((u - 0.7) / 0.3) * Math.PI) * 3,
    anim: "sit" as const,
  };
}

export function stepTrick(trick: FuseTrick, dt: number, flags?: TrickFlags): FuseTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "blow") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: FuseTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "current") {
    if (next.t < CURRENT_HOLD) {
      const pose = currentPose();
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < CURRENT_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - CURRENT_HOLD);
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
  if (next.kind === "seat") {
    const pose = seatPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "blow") {
    const pose = blowPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = reseatPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
