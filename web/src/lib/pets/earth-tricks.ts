/** Ground ground tricks while idle. Earth Dragon — lug / earth-hold / heave / bed personality. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop `earth-tricks.js`. Not a Rui, Relay, or Fuse move clone. Window-play `earth` is unchanged. */

export const TRICK_KEY = "ground_dragon";
export const TRICKS = ["lug", "earth", "heave", "bed"] as const;
export const HAPPY = ["hum", "bow", "gleam"] as const;
export type EarthTrickKind = (typeof TRICKS)[number];
export type EarthHappyKind = (typeof HAPPY)[number];
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

export type EarthTrick = {
  kind: EarthTrickKind;
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

export type EarthHappy = {
  kind: EarthHappyKind;
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

export const HAPPY_DUR: Record<EarthHappyKind, number> = {
  hum: 1.34,
  bow: 1.18,
  gleam: 1.4,
};

/** Earthed-strap hold — Ground seats in the lug and stays return-bound, then soft-unearths. No Fuse current. No Relay latch hop. */
export const EARTH_HOLD = 11;
export const RELEASE_S = 0.6;

export const DUR: Record<EarthTrickKind, number> = {
  lug: 1.12,
  earth: EARTH_HOLD + RELEASE_S,
  heave: 1.15,
  bed: 2.4,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: EarthTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "earth") return 44 + roll * 22;
  if (kind === "heave") return 15 + roll * 11;
  return justFinished ? 10 + roll * 8 : 4.5 + roll * 6;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: EarthTrickKind | null): EarthTrickKind {
  if (musicOn) return "earth";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "earth") {
    if (roll < 0.36) return "lug";
    if (roll < 0.6) return "bed";
    return "heave";
  }
  if (lastKind === "heave") {
    if (roll < 0.52) return "bed";
    if (roll < 0.78) return "lug";
    return "earth";
  }
  if (roll < 0.3) return "lug";
  if (roll < 0.42) return "earth";
  if (roll < 0.64) return "heave";
  return "bed";
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
  return key === TRICK_KEY || key === "ground";
}

export function startThankYou(
  key: string | undefined,
  lastKind: EarthHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: EarthHappyKind | null, rand?: number): EarthHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] ?? list[0]!;
}

export function beginHappy(kind: EarthHappyKind, x: number, facing: 1 | -1 = 1): EarthHappy {
  const name: EarthHappyKind = HAPPY.includes(kind) ? kind : "hum";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "bow" ? "sit" : name === "hum" ? "talk" : "play",
    facing,
    fromX: x,
  };
}

export function humPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.hum));
  if (u < 0.8) {
    return {
      lift: Math.abs(Math.sin(t * 14)) * 3.5,
      rot: Math.sin(t * 16) * 4,
      dx: 0,
      anim: "talk" as const,
    };
  }
  return { lift: 0, rot: Math.sin(((u - 0.8) / 0.2) * Math.PI) * 2, dx: 0, anim: "sit" as const };
}

export function bowPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.bow));
  if (u < 0.4) {
    const s = u / 0.4;
    return { lift: -s * 5, rot: s * 10, dx: 0, anim: "sit" as const };
  }
  if (u < 0.7) {
    return { lift: -5, rot: 10, dx: 0, anim: "sit" as const };
  }
  const s = (u - 0.7) / 0.3;
  return { lift: -5 * (1 - s), rot: 10 * (1 - s), dx: 0, anim: "sit" as const };
}

export function gleamPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.gleam));
  return {
    lift: Math.sin(u * Math.PI) * 9,
    rot: Math.sin(u * Math.PI * 2) * 5,
    dx: Math.sin(u * Math.PI) * 1.2,
    anim: "play" as const,
  };
}

export function stepHappy(happy: EarthHappy, dt: number, flags?: TrickFlags): EarthHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: EarthHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "hum") {
    const pose = humPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "bow") {
    const pose = bowPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = gleamPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

/** Ground has no Rui-style sleep-frame hold. */
export function sleepHoldFrame(_key: string | undefined, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: EarthTrickKind, x: number, facing: 1 | -1 = 1): EarthTrick {
  const anim: TrickAnim =
    kind === "lug" || kind === "earth" ? "sit" : kind === "heave" ? "play" : kind === "bed" ? "walk" : "sit";
  return {
    kind,
    phase: kind === "earth" ? "hold" : "go",
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

/** Drop into the earth lug — low seat, strap down. Not a cartridge clip seat. */
export function lugPose(t: number) {
  const u = Math.max(0, Math.min(1, t / DUR.lug));
  if (u < 0.5) {
    const s = smoothstep(u / 0.5);
    return { lift: (1 - s) * 4 - s * 3, rot: (1 - s) * 6 + s * 4, anim: "sit" as const };
  }
  return { lift: -3, rot: Math.sin(((u - 0.5) / 0.5) * Math.PI) * 2, anim: "sit" as const };
}

export function earthPose() {
  return { lift: -2, rot: 0 };
}

/** Soft unearth — strap loosens, no hop, no filament pop. */
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: -2 + Math.sin(u * Math.PI) * 3, rot: Math.sin(u * Math.PI) * 4 };
}

/** Slow soil heave — one long pulse, not a fuse blow. */
export function heavePose(t: number) {
  const u = Math.max(0, Math.min(1, t / DUR.heave));
  if (u < 0.35) {
    const s = smoothstep(u / 0.35);
    return { lift: -2 + s * 14, rot: s * 8, dx: 0, anim: "play" as const };
  }
  if (u < 0.7) {
    const s = (u - 0.35) / 0.35;
    return {
      lift: 12 + Math.sin(s * Math.PI) * 3,
      rot: Math.sin(s * Math.PI * 2) * 6,
      dx: Math.sin(s * Math.PI) * 1.5,
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.7) / 0.3);
  return { lift: 12 * (1 - s) - s * 2, rot: 4 * (1 - s), dx: 0, anim: "sit" as const };
}

/** Walk a short bay, then bed back into the lug. */
export function bedPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.bed));
  if (u < 0.42) {
    const s = smoothstep(u / 0.42);
    return { x: fromX + facing * 28 * s, lift: 0, rot: 0, anim: "walk" as const };
  }
  if (u < 0.68) {
    const s = (u - 0.42) / 0.26;
    return {
      x: fromX + facing * 28,
      lift: (1 - s) * 3 - s * 3,
      rot: s * 5,
      anim: "sit" as const,
    };
  }
  return {
    x: fromX + facing * 28,
    lift: -3,
    rot: Math.sin(((u - 0.68) / 0.32) * Math.PI) * 2,
    anim: "sit" as const,
  };
}

export function stepTrick(trick: EarthTrick, dt: number, flags?: TrickFlags): EarthTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "heave") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: EarthTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "earth") {
    if (next.t < EARTH_HOLD) {
      const pose = earthPose();
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < EARTH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - EARTH_HOLD);
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
  if (next.kind === "lug") {
    const pose = lugPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "heave") {
    const pose = heavePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = bedPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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