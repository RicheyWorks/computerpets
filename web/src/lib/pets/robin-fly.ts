/**
 * Brick the American robin. One dest. Flies like Sip, lands, stays, sings, flies off.
 * Same map as desktop `robin-fly.js`.
 */

export const ROBIN_KEY = "robin";
export const ROBIN_NAME = "Brick";
export const ROBIN_SLUG = "brick";
export const PERCH_HOST = "red_panda";
export const ROBIN_SONG = "I sang. The worm can wait.";
export const MIN_STAY_S = 24;
export const SONG_EVERY_S = 8;
export const LAND_S = 0.82;
export const LIFT_S = 0.7;
export const LEAVE_S = 1.15;
export const DEST_PX = 112;
const SHOULDER_X = 36;
const SHOULDER_LIFT = 36;

export type RobinPhase = "enter" | "cruise" | "land" | "stay" | "approach-perch" | "perch" | "lift" | "leave" | "done";
export type RobinFlags = {
  hidden?: boolean;
  hostKey?: string;
  hostSleeping?: boolean;
  hostX?: number;
  hostLift?: number;
  hostFacing?: 1 | -1;
};

export type RobinFly = {
  key: typeof ROBIN_KEY;
  phase: RobinPhase;
  t: number;
  age: number;
  x: number;
  lift: number;
  rot: number;
  facing: 1 | -1;
  fromX: number;
  toX: number;
  fromLift: number;
  toLift: number;
  sungAt: number;
  flap: number;
  frame?: number;
};

export type RobinSprites = { play?: readonly string[] | null; sit?: readonly string[] | null; idle?: readonly string[] | null; walk?: readonly string[] | null };

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

function flyLerp(u: number, from: number, to: number, arc: number) {
  const t = smoothstep(Math.max(0, Math.min(1, u)));
  return from + (to - from) * t + Math.sin(Math.max(0, Math.min(1, u)) * Math.PI) * arc;
}

export function canStart(state: RobinFlags | undefined) {
  if (!state) return true;
  return !state.hidden;
}

export function shouldAbort(state: RobinFlags | undefined) {
  return !!(state && state.hidden);
}

export function shouldPerch(flags: RobinFlags | undefined) {
  if (!flags || flags.hidden) return false;
  if (flags.hostKey && flags.hostKey !== PERCH_HOST) return false;
  return !!flags.hostSleeping;
}

export function perchPoint(hostX?: number, hostFacing?: 1 | -1, hostLift?: number) {
  const face = hostFacing != null && hostFacing < 0 ? -1 : 1;
  return {
    x: (hostX || 0) + face * SHOULDER_X,
    lift: (hostLift || 0) + SHOULDER_LIFT,
  };
}

export function beginRobinFly(width: number, height: number, fromRight = true): RobinFly {
  const w = Math.max(320, width || 800);
  const h = Math.max(240, height || 480);
  const right = fromRight !== false;
  const startX = right ? w + 24 : -80;
  const destX = clamp(w * (right ? 0.68 : 0.32), 48, w - 130);
  const destLift = clamp(h * 0.28, 64, h - 90);
  return {
    key: ROBIN_KEY,
    phase: "enter",
    t: 0,
    age: 0,
    x: startX,
    lift: destLift + 36,
    rot: 0,
    facing: right ? -1 : 1,
    fromX: startX,
    toX: destX,
    fromLift: destLift + 36,
    toLift: destLift,
    sungAt: 0,
    flap: 0,
  };
}

function goLand(fly: RobinFly, width: number): RobinFly {
  const w = Math.max(320, width || 800);
  const destX = clamp(fly.toX || fly.x, 48, w - 130);
  return {
    ...fly,
    phase: "land",
    t: 0,
    fromX: fly.x,
    toX: destX,
    fromLift: fly.lift,
    toLift: 0,
    facing: destX >= fly.x ? 1 : -1,
  };
}

function goLeave(fly: RobinFly, width: number): RobinFly {
  const w = Math.max(320, width || 800);
  const out = fly.facing < 0 ? -120 : w + 40;
  return {
    ...fly,
    phase: "leave",
    t: 0,
    fromX: fly.x,
    toX: out,
    fromLift: fly.lift || 0,
    toLift: (fly.lift || 0) + 56,
    facing: out >= fly.x ? 1 : -1,
  };
}

function goPerch(fly: RobinFly, flags: RobinFlags | undefined): RobinFly {
  const hold = perchPoint(flags && flags.hostX, flags && flags.hostFacing, flags && flags.hostLift);
  return {
    ...fly,
    phase: "approach-perch",
    t: 0,
    fromX: fly.x,
    toX: hold.x,
    fromLift: fly.lift || 0,
    toLift: hold.lift,
    facing: hold.x >= fly.x ? 1 : -1,
  };
}

export function isFlying(phase: RobinPhase | undefined) {
  return phase === "enter" || phase === "cruise" || phase === "land" || phase === "lift" || phase === "leave" || phase === "approach-perch";
}

export function wingBeat(age: number, phase: RobinPhase | undefined) {
  if (!isFlying(phase)) return 1;
  return 0.84 + 0.16 * Math.abs(Math.sin((age || 0) * 16));
}

export function poseKind(fly: RobinFly | null | undefined) {
  if (!fly) return "idle";
  if (isFlying(fly.phase)) return "play";
  if (fly.phase === "perch" || fly.phase === "stay") return "sit";
  return "idle";
}

export function destSrc(fly: RobinFly | null | undefined, sprites?: RobinSprites | null) {
  const pack = sprites && typeof sprites === "object" ? sprites : {};
  const kind = poseKind(fly);
  const play = Array.isArray(pack.play) ? pack.play.filter(Boolean) : [];
  const sit = Array.isArray(pack.sit) ? pack.sit.filter(Boolean) : [];
  const idle = Array.isArray(pack.idle) ? pack.idle.filter(Boolean) : [];
  const walk = Array.isArray(pack.walk) ? pack.walk.filter(Boolean) : [];
  let frames = kind === "play" ? play : kind === "sit" ? sit : idle;
  if (!frames.length) frames = play.length ? play : sit.length ? sit : idle.length ? idle : walk;
  if (!frames.length) return "";
  const i = Math.abs((fly && fly.frame) || 0) % frames.length;
  return frames[i] || frames[0] || "";
}

export function shouldSing(fly: RobinFly | null | undefined) {
  if (!fly || (fly.phase !== "stay" && fly.phase !== "perch")) return false;
  return fly.age + 0.0001 >= (fly.sungAt || 0);
}

export function markSung(fly: RobinFly) {
  return { ...fly, sungAt: (fly.age || 0) + SONG_EVERY_S };
}

export function stillVisible(fly: RobinFly | null | undefined) {
  return !!(fly && fly.phase !== "done");
}

export function asPeer(fly: RobinFly | null | undefined) {
  if (!stillVisible(fly)) return null;
  return { key: ROBIN_KEY, x: fly!.x, lift: fly!.lift || 0, phase: fly!.phase === "stay" ? "stay" : fly!.phase === "perch" ? "perch" : "in" };
}

export function stepRobinFly(fly: RobinFly | null | undefined, dt: number, width: number, height: number, flags?: RobinFlags): RobinFly | null | undefined {
  if (!fly || fly.phase === "done") return fly;
  if (shouldAbort(flags)) return { ...fly, phase: "done" };
  const next: RobinFly = { ...fly, t: fly.t + Math.max(0, dt), age: fly.age + Math.max(0, dt) };
  next.flap = wingBeat(next.age, next.phase);
  const perchNow = shouldPerch(flags);
  if (perchNow && next.phase !== "approach-perch" && next.phase !== "perch" && next.phase !== "leave") {
    return goPerch(next, flags);
  }
  if (!perchNow && (next.phase === "approach-perch" || next.phase === "perch")) {
    return { ...next, phase: "lift", t: 0, fromX: next.x, toX: next.x, fromLift: next.lift || 0, toLift: (next.lift || 0) + 40 };
  }

  if (next.phase === "enter") {
    const u = next.t / 1.2;
    next.x = flyLerp(u, next.fromX, next.toX, 0);
    next.lift = flyLerp(u, next.fromLift, next.toLift, 22);
    next.rot = Math.sin(u * Math.PI) * 10 * next.facing;
    if (u >= 1) return { ...next, phase: "cruise", t: 0, x: next.toX, lift: next.toLift };
    return next;
  }
  if (next.phase === "cruise") {
    next.x = next.toX + Math.sin(next.age * 2.4) * 12;
    next.lift = next.toLift + Math.sin(next.age * 9) * 6;
    next.rot = Math.sin(next.age * 8) * 7;
    if (next.t >= 1.8) return goLand(next, width);
    return next;
  }
  if (next.phase === "land") {
    const u = next.t / LAND_S;
    next.x = flyLerp(u, next.fromX, next.toX, 8);
    next.lift = flyLerp(u, next.fromLift, 0, 14);
    next.rot = Math.sin(Math.max(0, Math.min(1, u)) * Math.PI) * 6 * next.facing;
    if (u >= 1) return { ...next, phase: "stay", t: 0, x: next.toX, lift: 0, rot: 0, flap: 1 };
    return next;
  }
  if (next.phase === "stay") {
    next.lift = 0;
    next.rot = Math.sin(next.age * 1.6) * 1.2;
    next.flap = 1;
    if (next.t >= MIN_STAY_S) return goLeave(next, width);
    return next;
  }
  if (next.phase === "approach-perch") {
    const hold = perchPoint(flags && flags.hostX, flags && flags.hostFacing, flags && flags.hostLift);
    next.toX = hold.x;
    next.toLift = hold.lift;
    const u = next.t / LAND_S;
    next.x = flyLerp(u, next.fromX, hold.x, 8);
    next.lift = flyLerp(u, next.fromLift, hold.lift, 10);
    next.rot = Math.sin(Math.max(0, Math.min(1, u)) * Math.PI) * 6 * next.facing;
    if (u >= 1) return { ...next, phase: "perch", t: 0, x: hold.x, lift: hold.lift, rot: 0, flap: 1 };
    return next;
  }
  if (next.phase === "perch") {
    const hold = perchPoint(flags && flags.hostX, flags && flags.hostFacing, flags && flags.hostLift);
    next.x = hold.x + Math.sin(next.age * 1.3) * 1.1;
    next.lift = hold.lift + Math.sin(next.age * 2) * 0.7;
    next.rot = Math.sin(next.age * 2.2) * 1.4;
    next.flap = 1;
    return next;
  }
  if (next.phase === "lift") {
    const u = next.t / LIFT_S;
    next.x = flyLerp(u, next.fromX, next.toX, 0);
    next.lift = flyLerp(u, next.fromLift, next.toLift, 8);
    next.rot = Math.sin(Math.max(0, Math.min(1, u)) * Math.PI) * 5;
    if (u >= 1) return goLeave(next, width);
    return next;
  }
  if (next.phase === "leave") {
    const u = next.t / LEAVE_S;
    next.x = flyLerp(u, next.fromX, next.toX, 0);
    next.lift = flyLerp(u, next.fromLift, next.toLift, 16);
    next.rot = Math.sin(u * Math.PI) * 8 * next.facing;
    if (u >= 1) return { ...next, phase: "done" };
    return next;
  }
  return next;
}
