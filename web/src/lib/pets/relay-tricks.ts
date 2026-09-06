/** Relay ground tricks while idle. Click Dragon — electrical-mechanical personality. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop `relay-tricks.js`. Not a Rui move clone. */

export const TRICK_KEY = "relay_dragon";
export const TRICKS = ["click", "latch", "arc", "buzz", "switch"] as const;
export const HAPPY = ["spark", "toggle", "chatter"] as const;
export type RelayTrickKind = (typeof TRICKS)[number];
export type RelayHappyKind = (typeof HAPPY)[number];
export type TrickAnim = "idle" | "walk" | "sit" | "sleep" | "talk" | "play";
export type TrickPhase = "go" | "hold" | "release" | "hop" | "done";
export type HappyPhase = "go" | "done";

export type TrickFlags = {
  asleep?: boolean;
  hidden?: boolean;
  leaving?: boolean;
  cmd?: string;
  windowPlay?: boolean;
  card?: boolean;
};

export type RelayTrick = {
  kind: RelayTrickKind;
  phase: TrickPhase;
  t: number;
  x: number;
  lift: number;
  rot: number;
  anim: TrickAnim;
  facing: 1 | -1;
  fromX?: number;
  hopFrom?: number;
  abort?: boolean;
};

export type RelayHappy = {
  kind: RelayHappyKind;
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

export const HAPPY_DUR: Record<RelayHappyKind, number> = {
  spark: 1.18,
  toggle: 1.48,
  chatter: 1.42,
};

/** Closed-contact hold — Relay seats as a latched relay, then clicks open and hops. */
export const LATCH_HOLD = 10;
export const RELEASE_S = 0.48;
export const HOP_S = 0.72;

export const DUR: Record<RelayTrickKind, number> = {
  click: 0.88,
  latch: LATCH_HOLD + RELEASE_S + HOP_S,
  arc: 0.78,
  buzz: 1.42,
  switch: 2.55,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: RelayTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "latch") return 44 + roll * 22;
  return justFinished ? 9 + roll * 8 : 4 + roll * 6;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: RelayTrickKind | null): RelayTrickKind {
  if (musicOn) return "switch";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "latch") {
    if (roll < 0.3) return "click";
    if (roll < 0.52) return "buzz";
    if (roll < 0.74) return "arc";
    return "switch";
  }
  if (roll < 0.22) return "click";
  if (roll < 0.3) return "latch";
  if (roll < 0.52) return "arc";
  if (roll < 0.74) return "buzz";
  return "switch";
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
  return key === TRICK_KEY || key === "relay";
}

export function startThankYou(
  key: string | undefined,
  lastKind: RelayHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: RelayHappyKind | null, rand?: number): RelayHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] ?? list[0]!;
}

export function beginHappy(kind: RelayHappyKind, x: number, facing: 1 | -1 = 1): RelayHappy {
  const name: RelayHappyKind = HAPPY.includes(kind) ? kind : "spark";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "toggle" ? "walk" : name === "chatter" ? "talk" : "play",
    facing,
    fromX: x,
  };
}

export function sparkPose(t: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.spark));
  return {
    lift: Math.abs(Math.sin(u * Math.PI * 2)) * 22,
    rot: facing * Math.sin(u * Math.PI * 4) * 18,
    dx: Math.sin(u * Math.PI * 4) * 3,
    anim: "play" as const,
  };
}

export function togglePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.toggle));
  if (u < 0.33) {
    const s = u / 0.33;
    return { x: fromX + facing * 28 * s, lift: 0, rot: 0, anim: "walk" as const };
  }
  if (u < 0.66) {
    const s = (u - 0.33) / 0.33;
    return { x: fromX + facing * 28 * (1 - s), lift: 0, rot: Math.sin(s * Math.PI) * 10, anim: "walk" as const };
  }
  return { x: fromX, lift: 1, rot: Math.sin(((u - 0.66) / 0.34) * Math.PI * 6) * 12, anim: "sit" as const };
}

export function chatterPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.chatter));
  if (u < 0.72) {
    return {
      lift: Math.abs(Math.sin(t * 28)) * 4,
      rot: Math.sin(t * 34) * 10,
      dx: Math.sin(t * 34) * 2,
      anim: "talk" as const,
    };
  }
  return { lift: 0, rot: Math.sin(((u - 0.72) / 0.28) * Math.PI) * 4, dx: 0, anim: "sit" as const };
}

export function stepHappy(happy: RelayHappy, dt: number, flags?: TrickFlags): RelayHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: RelayHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "spark") {
    const pose = sparkPose(next.t, next.facing);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "toggle") {
    const pose = togglePose(next.t, next.fromX != null ? next.fromX : next.x, next.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = chatterPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

/** Relay has no Rui-style sleep-frame hold. */
export function sleepHoldFrame(_key: string | undefined, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: RelayTrickKind, x: number, facing: 1 | -1 = 1): RelayTrick {
  const anim: TrickAnim =
    kind === "latch" || kind === "click" ? "sit" : kind === "buzz" ? "talk" : kind === "switch" ? "play" : "play";
  return {
    kind,
    phase: kind === "latch" ? "hold" : "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim,
    facing,
    fromX: x,
    hopFrom: x,
  };
}

function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

/** Contact-to-contact arc — half-flip hop, not Rui's full somersault. */
export function arcPath(u: number, fromX: number, facing: 1 | -1) {
  const t = Math.max(0, Math.min(1, u));
  const ease = smoothstep(t);
  return {
    x: fromX + facing * 64 * ease,
    lift: Math.sin(t * Math.PI) * 28,
    rot: facing * 180 * t,
  };
}

export function clickPose(t: number) {
  const pulse = Math.abs(Math.sin(t * 26));
  return { lift: pulse * 3, rot: Math.sin(t * 26) * 16, dx: Math.sin(t * 26) * 4 };
}

export function latchPose() {
  return { lift: 0, rot: 0 };
}

export function releasePose(t: number) {
  return { lift: Math.abs(Math.sin(t * 40)) * 5, rot: Math.sin(t * 40) * 14, dx: Math.sin(t * 40) * 3 };
}

export function buzzPose(t: number) {
  return { lift: Math.abs(Math.sin(t * 30)) * 5, rot: Math.sin(t * 36) * 11, dx: Math.sin(t * 36) * 2 };
}

export function switchPose(t: number, fromX: number, facing: 1 | -1) {
  const beat = Math.sin(t * 7);
  return {
    x: fromX + facing * beat * 14,
    lift: Math.abs(Math.sin(t * 9)) * 8,
    rot: beat * 14,
    anim: Math.abs(beat) > 0.55 ? ("walk" as const) : ("play" as const),
  };
}

export function stepTrick(trick: RelayTrick, dt: number, flags?: TrickFlags): RelayTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "arc" && trick.phase !== "hop") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: RelayTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "latch") {
    if (next.t < LATCH_HOLD) {
      const pose = latchPose();
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < LATCH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - LATCH_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "talk";
      next.hopFrom = next.x;
      return next;
    }
    if (next.t < LATCH_HOLD + RELEASE_S + HOP_S) {
      const u = (next.t - LATCH_HOLD - RELEASE_S) / HOP_S;
      const from = trick.hopFrom != null ? trick.hopFrom : trick.x;
      const pose = arcPath(Math.min(1, u), from, trick.facing);
      next.phase = "hop";
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.hopFrom = from;
      return next;
    }
    return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  }
  const hold = DUR[next.kind];
  const u = next.t / hold;
  if (next.kind === "arc") {
    const pose = arcPath(Math.min(1, u), trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "play";
  } else if (next.kind === "click") {
    const pose = clickPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "sit";
  } else if (next.kind === "buzz") {
    const pose = buzzPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "talk";
  } else {
    const pose = switchPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
