import { isSnake } from "./shed";

/** Shared living-desk numbers — ported to Electron `gait.js` and PyQt `gait.py`. */
export const ACCEL_S = 0.4;
export const DECEL_DIST = 56;
export const TURN_S = 0.23;
export const TURN_SNAKE_S = 0.35;
export const TURN_SLOW_S = 0.3;
export const OVERSHOOT = 7;
export const OVERSHOOT_SLOW = 4;
export const SETTLE_S = 0.42;
export const LAND_DECAY = 1 / 0.45;
export const POSE_HOLD_S = 0.28;
export const BREATHE_IDLE = 0.028;
export const BREATHE_SLEEP = 0.04;
export const SWAY_PX = 3.5;
export const WALK_HOP_PX = 4;
export const PERCH_STEP_PX = 7;
export const HIGH_HOP = 20;
export const HIGH_WALK = 120;
export const STEP_S = 0.22;
export const STEP_S_QUICK = 0.16;

export function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

export function walkSpeed(remaining: number, age: number, base: number) {
  const accel = Math.min(1, age / ACCEL_S);
  const decel = remaining < DECEL_DIST ? smoothstep(remaining / DECEL_DIST) : 1;
  return base * Math.max(0.3, accel * decel);
}

export function isCrawlKey(key: string | undefined | null) {
  return !!key && isSnake(key);
}

export function isLowWalk(hop: number, walk: number) {
  return hop <= 6 || walk < 40;
}

export function isHighWalk(walk: number) {
  return walk >= HIGH_WALK;
}

export function turnHoldS(opts: { crawl?: boolean; hop?: number; walk?: number }) {
  if (opts.crawl) return TURN_SNAKE_S;
  if (isLowWalk(opts.hop ?? 20, opts.walk ?? 98)) return TURN_SLOW_S;
  return TURN_S;
}

export function overshootPx(opts: { crawl?: boolean; hop?: number; walk?: number }) {
  if (opts.crawl || isLowWalk(opts.hop ?? 20, opts.walk ?? 98)) return OVERSHOOT_SLOW;
  return OVERSHOOT;
}

export function facingAfter(current: 1 | -1, x: number, target: number, elapsed: number, holdS: number): 1 | -1 {
  const desired: 1 | -1 = target >= x ? 1 : -1;
  if (desired === current) return current;
  if (elapsed < holdS) return current;
  return desired;
}

export function settleOffset(settle: number, dir: 1 | -1, px: number) {
  const t = 1 - Math.max(0, Math.min(1, settle));
  return dir * px * 4 * t * (1 - t);
}

export function wanderPauseS() {
  return 0.2 + Math.random() * 0.2;
}

const SPRITE = 176;

/** Walk off the nearest edge. Same sit on desk, overlay, and blotter. */
export function leaveTarget(x: number, width: number, sprite = SPRITE) {
  return x + sprite / 2 < width / 2 ? -sprite - 24 : width + 12;
}

/** Come back from off-stage. Same sit as the desk enter. */
export function enterSpawn(width: number, sprite = SPRITE, pad = 20, left?: boolean) {
  const max = width - sprite - pad;
  const fromLeft = left ?? Math.random() < 0.5;
  return fromLeft ? -sprite : max + sprite;
}

export function enterSit(width: number, sprite = SPRITE, pad = 20, rand = Math.random()) {
  const max = width - sprite - pad;
  const sit = 80 + rand * Math.max(40, max - 80);
  return Math.max(pad, Math.min(max, sit));
}
