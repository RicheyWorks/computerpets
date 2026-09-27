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
    return sim;
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
   */
  function guardedLoop(frame, schedule, guard, keyOf) {
    function loop(now) {
      schedule(loop);
      guard.step(frame, now, typeof keyOf === "function" ? keyOf() : "");
    }
    return loop;
  }

  const api = { safeIdle, makeGuard, guardedLoop, errorText, LOG_LIMIT, TRICK_BACKOFF };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetFrameGuard = api;
})(typeof window !== "undefined" ? window : globalThis);
