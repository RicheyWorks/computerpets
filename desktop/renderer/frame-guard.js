/**
 * Keeps the overlay's frame loop alive. pet.js used to call requestAnimationFrame(tick) only at the end
 * of tick, so one thrown error (a broken trick module, a bad pose) stopped every pet on the glass.
 * Now tick schedules the next frame first and runs each part of the frame through `step`: an error is
 * caught, written to the console once per distinct error and pet key, and that pet goes back to a safe
 * idle (no trick, no thank-you, no window play). The next frame runs as usual.
 */
(function (root) {
  const LOG_LIMIT = 50;

  /** Seconds before a pet may try another trick after one broke, so a broken trick is not retried every frame. */
  const TRICK_BACKOFF = 8;

  /**
   * Sends a pet back to standing still: no trick, no thank-you, no window play, no small act,
   * feet on the floor, back to wandering.
   */
  function safeIdle(sim) {
    if (!sim || typeof sim !== "object") return sim;
    sim.trick = null;
    sim.happy = null;
    sim.play = null;
    sim.thankYou = false;
    sim.act = null;
    sim.actMotion = null;
    sim.pendingPose = null;
    sim.poseHold = 0;
    sim.cmd = "wander";
    sim.anim = "idle";
    sim.hop = 0;
    sim.land = 0;
    sim.trickWait = Math.max(Number(sim.trickWait) || 0, TRICK_BACKOFF);
    sim.brokeWait = TRICK_BACKOFF;
    return sim;
  }

  /**
   * Music starts a dance as soon as the pet is free, without waiting for `trickWait`. After a trick broke,
   * this holds that off for `brokeWait` seconds too, so a broken dance is not restarted every other frame.
   * Counts `brokeWait` down by `dt` and says whether music may start a dance now.
   */
  function musicMayDance(sim, dt) {
    const left = Number(sim && sim.brokeWait) || 0;
    if (left <= 0) return true;
    sim.brokeWait = Math.max(0, left - Math.max(0, Number(dt) || 0));
    return false;
  }

  function errorText(err) {
    if (err && typeof err === "object") return `${err.name || "Error"}: ${err.message || String(err)}`;
    return String(err);
  }

  /**
   * opts.log(text)          where a first-seen error goes (default console.warn)
   * opts.reset(petKey, err) puts that pet back to a safe idle; its own errors are swallowed
   */
  function makeGuard(opts) {
    const o = opts || {};
    const log = typeof o.log === "function" ? o.log : (text) => { if (root.console) root.console.warn(text); };
    const reset = typeof o.reset === "function" ? o.reset : () => {};
    const seen = new Map();
    let caught = 0;

    function step(fn, arg, petKey) {
      try {
        fn(arg);
        return true;
      } catch (err) {
        caught += 1;
        const key = `${petKey || "overlay"} | ${errorText(err)}`;
        const count = seen.get(key) || 0;
        if (count === 0 && seen.size < LOG_LIMIT) {
          log(`overlay frame error (${petKey || "overlay"}): ${errorText(err)}. That pet goes back to idle; the other pets keep moving.`);
        }
        seen.set(key, count + 1);
        try {
          reset(petKey, err);
        } catch (_) {
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
   * `schedule` is requestAnimationFrame; `frame(now)` is the old tick body; `keyOf()` names the host pet.
   * A frame that returns `false` is done: the loop stops there. `loop.stop()` ends it from outside
   * (a reset for a guest that should leave). Same rules as the web desk's `frame-guard.ts`.
   */
  function guardedLoop(frame, schedule, guard, keyOf) {
    let stopped = false;
    function run(now) {
      if (frame(now) === false) stopped = true;
    }
    function loop(now) {
      if (stopped) return;
      schedule(loop);
      guard.step(run, now, typeof keyOf === "function" ? keyOf() : "");
    }
    loop.stop = () => {
      stopped = true;
    };
    loop.stopped = () => stopped;
    return loop;
  }

  const api = { safeIdle, musicMayDance, makeGuard, guardedLoop, errorText, LOG_LIMIT, TRICK_BACKOFF };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetFrameGuard = api;
})(typeof window !== "undefined" ? window : globalThis);
