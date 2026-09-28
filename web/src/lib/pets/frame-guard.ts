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
  /** Seconds left before music may start a dance again after a trick broke (music skips `trickWait`). */
  brokeWait?: number;
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
  pet.brokeWait = TRICK_BACKOFF;
  return pet;
}

/**
 * Music starts a dance as soon as the pet is free, without waiting for `trickWait`. After a trick broke,
 * this holds that off for `brokeWait` seconds too, so a broken dance is not restarted every other frame.
 * Counts `brokeWait` down by `dt` and says whether music may start a dance now.
 */
export function musicMayDance(pet: { brokeWait?: number }, dt: number): boolean {
  const left = Number(pet.brokeWait) || 0;
  if (left <= 0) return true;
  pet.brokeWait = Math.max(0, left - Math.max(0, Number(dt) || 0));
  return false;
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
  /** What happens next, at the end of the log line. A guest that leaves says so instead of "goes back to idle". */
  outcome?: string;
};

export type FrameGuard = {
  step<A>(fn: (arg: A) => void, arg: A, petKey?: string): boolean;
  caught(): number;
  distinct(): number;
  counts(): Array<[string, number]>;
};

export function makeGuard(opts: FrameGuardOptions = {}): FrameGuard {
  const where = opts.where || "desk";
  const outcome = opts.outcome || "That pet goes back to idle and keeps moving.";
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
        log(`${where} frame error (${name}): ${errorText(err)}. ${outcome}`);
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

/** A guard that lives as long as a guest component, so an error that comes back on every visit is logged once. */
export type GuestGuard = FrameGuard & {
  /** The running visit's reset (who leaves, what goes back to rest). Set again by each new visit. */
  onReset(fn: ((petKey: string) => void) | null): void;
};

/**
 * For the desk's guests (robin, bird, called guests, plants, the carried lure): one guard per component,
 * kept across visits with `useState(makeGuestGuard)`. Each visit's loop hands it that visit's reset.
 */
export function makeGuestGuard(opts: Omit<FrameGuardOptions, "reset"> = {}): GuestGuard {
  let current: ((petKey: string) => void) | null = null;
  const guard = makeGuard({ ...opts, reset: (petKey) => current?.(petKey) });
  return {
    ...guard,
    onReset(fn) {
      current = fn;
    },
  };
}

/** A running frame loop. `stop()` ends it: the frame already asked for returns without running or asking again. */
export type GuardedLoop = ((now: number) => void) & { stop(): void; stopped(): boolean };

/**
 * The frame loop: schedule the next frame first, then run the frame through the guard.
 * `schedule` is requestAnimationFrame; `frame(now)` is the tick body; `keyOf()` names the pet.
 * A frame that returns `false` is done (a guest that has flown or walked off): the loop stops there.
 * A guest's `reset` can call `stop()` too, so a guest that broke leaves instead of freezing on the desk.
 */
export function guardedLoop(
  frame: (now: number) => void | boolean,
  schedule: (loop: (now: number) => void) => void,
  guard: FrameGuard,
  keyOf?: () => string,
): GuardedLoop {
  let stopped = false;
  const run = (now: number) => {
    if (frame(now) === false) stopped = true;
  };
  const loop = ((now: number) => {
    if (stopped) return;
    schedule(loop);
    guard.step(run, now, keyOf ? keyOf() : "");
  }) as GuardedLoop;
  loop.stop = () => {
    stopped = true;
  };
  loop.stopped = () => stopped;
  return loop;
}
