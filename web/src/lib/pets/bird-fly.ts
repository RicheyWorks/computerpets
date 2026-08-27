/**
 * Sip the ruby-throated hummingbird (`hummingbird`).
 * Her dart leftover was 0.7s — she flashed and was gone. This sit stays and flies.
 * When Rui sleeps she lands on him and chills. Same map as desktop `bird-fly.js`.
 */

export const FLY_BIRD_KEY = "hummingbird";
export const FLY_BIRD_NAME = "Sip";
export const FLY_BIRD_SLUG = "sip";
export const PERCH_HOST = "red_panda";
export const MIN_STAY_S = 24;
export const CALL_EVERY_S = 7.5;
export const PERCH_ON_S = 0.85;
export const LIFT_S = 0.72;
const SHOULDER_X = 38;
const SHOULDER_LIFT = 72;

export type FlyPhase = "enter" | "cruise" | "hover" | "approach-perch" | "perch" | "lift" | "done";
export type FlyFlags = {
  asleep?: boolean;
  hidden?: boolean;
  leaving?: boolean;
  hostKey?: string;
  hostSleeping?: boolean;
  hostX?: number;
  hostLift?: number;
  hostFacing?: 1 | -1;
};

export type BirdFly = {
  key: typeof FLY_BIRD_KEY;
  phase: FlyPhase;
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
  callAt: number;
  called: boolean;
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

export function canStart(state: FlyFlags | undefined) {
  if (!state) return true;
  return !state.hidden;
}

export function shouldAbort(state: FlyFlags | undefined) {
  return !!(state && state.hidden);
}

export function shouldPerch(flags: FlyFlags | undefined) {
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

export function beginFly(width: number, height: number, fromRight = true): BirdFly {
  const w = Math.max(320, width || 800);
  const h = Math.max(240, height || 480);
  const startX = fromRight ? w + 20 : -80;
  const destX = clamp(w * (fromRight ? 0.62 : 0.28), 40, w - 120);
  const destLift = clamp(h * 0.42, 80, h - 80);
  return {
    key: FLY_BIRD_KEY,
    phase: "enter",
    t: 0,
    age: 0,
    x: startX,
    lift: destLift + 28,
    rot: 0,
    facing: fromRight ? -1 : 1,
    fromX: startX,
    toX: destX,
    fromLift: destLift + 28,
    toLift: destLift,
    callAt: 0.2,
    called: false,
  };
}

function goCruise(fly: BirdFly, width: number, height: number): BirdFly {
  const w = Math.max(320, width || 800);
  const h = Math.max(240, height || 480);
  const nextX = clamp(40 + Math.random() * Math.max(80, w - 160), 24, w - 100);
  const nextLift = clamp(70 + Math.random() * Math.max(40, h * 0.38), 64, h - 70);
  return {
    ...fly,
    phase: "cruise",
    t: 0,
    fromX: fly.x,
    toX: nextX,
    fromLift: fly.lift,
    toLift: nextLift,
    facing: nextX >= fly.x ? 1 : -1,
  };
}

export function goPerch(fly: BirdFly, hostX?: number, hostLift?: number, hostFacing?: 1 | -1): BirdFly {
  const hold = perchPoint(hostX, hostFacing, hostLift);
  return {
    ...fly,
    phase: "approach-perch",
    t: 0,
    fromX: fly.x,
    toX: hold.x,
    fromLift: fly.lift,
    toLift: hold.lift,
    facing: hold.x >= fly.x ? 1 : -1,
  };
}

function goLift(fly: BirdFly, height: number): BirdFly {
  const destLift = Math.min((fly.lift || 0) + 48, (height || 480) - 70);
  return {
    ...fly,
    phase: "lift",
    t: 0,
    fromX: fly.x,
    toX: fly.x,
    fromLift: fly.lift,
    toLift: destLift,
  };
}

function flyLerp(u: number, from: number, to: number, arc: number) {
  const t = smoothstep(Math.max(0, Math.min(1, u)));
  return from + (to - from) * t + Math.sin(Math.max(0, Math.min(1, u)) * Math.PI) * arc;
}

export function stepFly(fly: BirdFly, dt: number, width: number, height: number, flags?: FlyFlags): BirdFly {
  if (!fly || fly.phase === "done") return fly;
  if (shouldAbort(flags)) return { ...fly, phase: "done", called: false };
  const next: BirdFly = { ...fly, t: fly.t + Math.max(0, dt), age: fly.age + Math.max(0, dt) };
  const hoverBob = Math.sin(next.age * 14) * 5;
  const perchNow = shouldPerch(flags);
  if (perchNow && next.phase !== "approach-perch" && next.phase !== "perch") {
    return goPerch(next, flags?.hostX, flags?.hostLift, flags?.hostFacing);
  }
  if (!perchNow && (next.phase === "approach-perch" || next.phase === "perch")) {
    return goLift(next, height);
  }

  if (next.phase === "enter") {
    const u = next.t / 1.15;
    next.x = flyLerp(u, next.fromX, next.toX, 0);
    next.lift = flyLerp(u, next.fromLift, next.toLift, 18) + hoverBob * 0.3;
    next.rot = Math.sin(u * Math.PI) * 8 * next.facing;
    if (u >= 1) return { ...next, phase: "hover", t: 0, x: next.toX, lift: next.toLift };
    return next;
  }
  if (next.phase === "hover") {
    next.x = next.toX + Math.sin(next.age * 3) * 10;
    next.lift = next.toLift + hoverBob;
    next.rot = Math.sin(next.age * 10) * 6;
    if (next.t >= 2.2) return goCruise(next, width, height);
    return next;
  }
  if (next.phase === "cruise") {
    const span = Math.max(80, Math.abs(next.toX - next.fromX));
    const dur = Math.max(1.4, span / 140);
    const u = next.t / dur;
    next.x = flyLerp(u, next.fromX, next.toX, 16);
    next.lift = flyLerp(u, next.fromLift, next.toLift, 22) + hoverBob;
    next.rot = Math.sin(u * Math.PI) * 10 * next.facing;
    if (u >= 1) {
      if (next.age >= MIN_STAY_S * 2.2) return { ...next, phase: "done" };
      return { ...next, phase: "hover", t: 0, x: next.toX, lift: next.toLift, fromX: next.toX, fromLift: next.toLift };
    }
    return next;
  }
  if (next.phase === "approach-perch") {
    const hold = perchPoint(flags?.hostX, flags?.hostFacing, flags?.hostLift);
    next.toX = hold.x;
    next.toLift = hold.lift;
    const u = next.t / PERCH_ON_S;
    next.x = flyLerp(u, next.fromX, next.toX, 8);
    next.lift = flyLerp(u, next.fromLift, next.toLift, 12);
    next.rot = Math.sin(Math.max(0, Math.min(1, u)) * Math.PI) * 6 * next.facing;
    next.facing = next.toX >= next.fromX ? 1 : -1;
    if (u >= 1) return { ...next, phase: "perch", t: 0, x: hold.x, lift: hold.lift, fromX: hold.x, toX: hold.x, fromLift: hold.lift, toLift: hold.lift };
    return next;
  }
  if (next.phase === "perch") {
    const hold = perchPoint(flags?.hostX, flags?.hostFacing, flags?.hostLift);
    next.x = hold.x + Math.sin(next.age * 2.2) * 3;
    next.lift = hold.lift + Math.sin(next.age * 6) * 2;
    next.rot = Math.sin(next.age * 5) * 3;
    next.toX = hold.x;
    next.toLift = hold.lift;
    return next;
  }
  if (next.phase === "lift") {
    const u = next.t / LIFT_S;
    next.x = flyLerp(u, next.fromX, next.toX, 0);
    next.lift = flyLerp(u, next.fromLift, next.toLift, 10);
    next.rot = Math.sin(Math.max(0, Math.min(1, u)) * Math.PI) * 5;
    if (u >= 1) return { ...next, phase: "hover", t: 0, x: next.toX, lift: next.toLift, fromX: next.toX, fromLift: next.toLift };
    return next;
  }
  return next;
}

export function shouldCall(fly: BirdFly) {
  if (!fly || fly.phase === "done") return false;
  if (fly.age + 0.0001 >= fly.callAt && !fly.called) return true;
  return false;
}

export function markCalled(fly: BirdFly): BirdFly {
  return { ...fly, called: true, callAt: fly.age + CALL_EVERY_S };
}

export function stillVisible(fly: BirdFly | null | undefined) {
  return !!(fly && fly.phase !== "done");
}
