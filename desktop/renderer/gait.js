/** Shared living-desk numbers — same as web `gait.ts` and PyQt `gait.py`. */
(function (root) {
  const CRAWL_KEYS = {
    ball_python: 1,
    corn_snake: 1,
    kingsnake: 1,
    green_tree_python: 1,
    hognose: 1,
    garter: 1,
    boa: 1,
    milk_snake: 1,
    rosy_boa: 1,
    carpet_python: 1,
  };

  const ACCEL_S = 0.4;
  const DECEL_DIST = 56;
  const TURN_S = 0.23;
  const TURN_SNAKE_S = 0.35;
  const TURN_SLOW_S = 0.3;
  const OVERSHOOT = 7;
  const OVERSHOOT_SLOW = 4;
  const SETTLE_S = 0.42;
  const LAND_DECAY = 1 / 0.45;
  const POSE_HOLD_S = 0.28;
  const BREATHE_IDLE = 0.028;
  const BREATHE_SLEEP = 0.04;
  const SWAY_PX = 3.5;
  const WALK_HOP_PX = 4;
  const PERCH_STEP_PX = 7;
  const HIGH_HOP = 20;
  const HIGH_WALK = 120;
  const STEP_S = 0.22;
  const STEP_S_QUICK = 0.16;

  function smoothstep(t) {
    const x = Math.max(0, Math.min(1, t));
    return x * x * (3 - 2 * x);
  }

  function walkSpeed(remaining, age, base) {
    const accel = Math.min(1, age / ACCEL_S);
    const decel = remaining < DECEL_DIST ? smoothstep(remaining / DECEL_DIST) : 1;
    return base * Math.max(0.3, accel * decel);
  }

  function isCrawlKey(key) {
    return !!key && !!CRAWL_KEYS[key];
  }

  function isLowWalk(hop, walk) {
    return hop <= 6 || walk < 40;
  }

  function isHighWalk(walk) {
    return walk >= HIGH_WALK;
  }

  function turnHoldS(opts) {
    if (opts.crawl) return TURN_SNAKE_S;
    if (isLowWalk(opts.hop ?? 20, opts.walk ?? 98)) return TURN_SLOW_S;
    return TURN_S;
  }

  function overshootPx(opts) {
    if (opts.crawl || isLowWalk(opts.hop ?? 20, opts.walk ?? 98)) return OVERSHOOT_SLOW;
    return OVERSHOOT;
  }

  function facingAfter(current, x, target, elapsed, holdS) {
    const desired = target >= x ? 1 : -1;
    if (desired === current) return current;
    if (elapsed < holdS) return current;
    return desired;
  }

  function settleOffset(settle, dir, px) {
    const t = 1 - Math.max(0, Math.min(1, settle));
    return dir * px * 4 * t * (1 - t);
  }

  function wanderPauseS() {
    return 0.2 + Math.random() * 0.2;
  }

  const SPRITE = 176;

  function leaveTarget(x, width, sprite) {
    const size = sprite == null ? SPRITE : sprite;
    return x + size / 2 < width / 2 ? -size - 24 : width + 12;
  }

  function enterSpawn(width, sprite, pad, left) {
    const size = sprite == null ? SPRITE : sprite;
    const edge = pad == null ? 20 : pad;
    const max = width - size - edge;
    const fromLeft = left == null ? Math.random() < 0.5 : left;
    return fromLeft ? -size : max + size;
  }

  function enterSit(width, sprite, pad, rand) {
    const size = sprite == null ? SPRITE : sprite;
    const edge = pad == null ? 20 : pad;
    const roll = rand == null ? Math.random() : rand;
    const max = width - size - edge;
    const sit = 80 + roll * Math.max(40, max - 80);
    return Math.max(edge, Math.min(max, sit));
  }

  const api = {
    ACCEL_S,
    DECEL_DIST,
    TURN_S,
    TURN_SNAKE_S,
    TURN_SLOW_S,
    OVERSHOOT,
    OVERSHOOT_SLOW,
    SETTLE_S,
    LAND_DECAY,
    POSE_HOLD_S,
    BREATHE_IDLE,
    BREATHE_SLEEP,
    SWAY_PX,
    WALK_HOP_PX,
    PERCH_STEP_PX,
    HIGH_HOP,
    HIGH_WALK,
    STEP_S,
    STEP_S_QUICK,
    smoothstep,
    walkSpeed,
    isCrawlKey,
    isLowWalk,
    isHighWalk,
    turnHoldS,
    overshootPx,
    facingAfter,
    settleOffset,
    wanderPauseS,
    leaveTarget,
    enterSpawn,
    enterSit,
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetGait = api;
})(typeof window !== "undefined" ? window : globalThis);
