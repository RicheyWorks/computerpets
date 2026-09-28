/**
 * Keeps the web desk's frame loop alive. Same rules as the overlay's `desktop/renderer/frame-guard.js`:
 * the loop schedules the next frame first and runs the frame through `step`, so one thrown error (a broken
 * trick module, a bad pose) no longer stops the pet. The error is written to the console once per distinct
 * error and pet key, and that pet goes back to a safe idle (no trick, no thank-you, no window play).
 * The next frame runs as usual.
 */

export const LOG_LIMIT = 50;

/** Seconds before a pet may try another trick after one broke, so a broken trick is not retried every frame. */
export const TRICK_BACKOFF = 8;

/** The parts of a pet's frame state that `safeIdle` puts back. The overlay also has `thankYou` and `cmd`. */
export type SafeIdlePet = {
  trick: object | null;
  happy: object | null;
  play: object | null;
  act: string | null;
  actMotion: unknown;
  pendingPose: string | null;
  poseHold: number;
  anim: string;
  hop: number;
  land: number;
  trickWait: number;
  thankYou?: boolean;
  cmd?: string;
};

/**
 * Sends a pet back to standing still: no trick, no thank-you, no window play, no small act,
 * feet on the floor. On the overlay it also goes back to wandering; the web desk's command
 * comes from the page, so there is nothing to put back.
 */
export function safeIdle<T extends SafeIdlePet>(pet: T): T {
  pet.trick = null;
  pet.happy = null;
  pet.play = null;
  if ("thankYou" in pet) pet.thankYou = false;
  pet.act = null;
  pet.actMotion = null;
  pet.pendingPose = null;
  pet.poseHold = 0;
  if ("cmd" in pet) pet.cmd = "wander";
  pet.anim = "idle";
  pet.hop = 0;
  pet.land = 0;
  pet.trickWait = Math.max(Number(pet.trickWait) || 0, TRICK_BACKOFF);
  return pet;
}

export function errorText(err: unknown): string {
  if (err && typeof err === "object") {
    const e = err as { name?: unknown; message?: unknown };
    return `${e.name || "Error"}: ${e.message || String(err)}`;
  }
  return String(err);
}

export type FrameGuardOptions = {
  /** Where a first-seen error goes (default console.warn). */
  log?: (text: string) => void;
  /** Puts that pet back to a safe idle; its own errors are swallowed. */
  reset?: (petKey: string, err: unknown) => void;
  /** The word at the front of the log line: "desk" here, "overlay" on the desktop app. */
  where?: string;
};

export type FrameGuard = {
  step<A>(fn: (arg: A) => void, arg: A, petKey?: string): boolean;
  caught(): number;
  distinct(): number;
  counts(): Array<[string, number]>;
};

export function makeGuard(opts: FrameGuardOptions = {}): FrameGuard {
  const where = opts.where || "desk";
  const log = opts.log ?? ((text: string) => console.warn(text));
  const reset = opts.reset ?? (() => {});
  const seen = new Map<string, number>();
  let caught = 0;

  function step<A>(fn: (arg: A) => void, arg: A, petKey?: string): boolean {
    try {
      fn(arg);
      return true;
    } catch (err) {
      caught += 1;
      const name = petKey || where;
      const key = `${name} | ${errorText(err)}`;
      const count = seen.get(key) || 0;
      if (count === 0 && seen.size < LOG_LIMIT) {
        log(`${where} frame error (${name}): ${errorText(err)}. That pet goes back to idle and keeps moving.`);
      }
      seen.set(key, count + 1);
      try {
        reset(name, err);
      } catch {
        /* a reset that throws must not stop the loop either */
      }
      return false;
    }
  }

  return {
    step,
    caught: () => caught,
    distinct: () => seen.size,
    counts: () => Array.from(seen.entries()),
  };
}

/**
 * The frame loop: schedule the next frame first, then run the frame through the guard.
 * `schedule` is requestAnimationFrame; `frame(now)` is the tick body; `keyOf()` names the pet.
 */
export function guardedLoop(
  frame: (now: number) => void,
  schedule: (loop: (now: number) => void) => void,
  guard: FrameGuard,
  keyOf?: () => string,
): (now: number) => void {
  function loop(now: number) {
    schedule(loop);
    guard.step(frame, now, keyOf ? keyOf() : "");
  }
  return loop;
}
