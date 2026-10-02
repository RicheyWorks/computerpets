/**
 * Reduced motion ("prefers-reduced-motion: reduce", the system's own setting, which Electron's page reads): the
 * robin, the hummingbird, called guests and the desk plants keep their visits, songs, calls and taps, but stop
 * travelling across the desk. A guest is drawn still where it rests: it shows once it first settles, stays put while
 * its walk or flight goes on unseen, and appears at its next resting spot without the trip between (a cut, not a
 * glide). The wing wobble, the tilt and the plants' wind lean stop. The pet itself and a house visitor keep their
 * care words, poses and visits too: a walk is a cut to where it ends, the bob, breath, hop and lean stop, a pose is
 * held on its first frame (a once-through pose such as eating still ends on time, calmOnceS), and window plays,
 * tricks and small idle acts wait for motion to be allowed again. The same rules as web/src/lib/pets/calm-motion.ts.
 */
(function (root) {
  const ROBIN_REST = ["stay", "perch"];
  const BIRD_REST = ["hover", "perch"];
  const CALLED_REST = ["stay", "perch", "meet", "bound"];

  /** @type {MediaQueryList | null | undefined} */
  let query;

  /** True while the system asks for reduced motion. Read every frame, so a change takes hold at once. */
  function reducedMotion() {
    const w = typeof window !== "undefined" ? window : null;
    if (!w || typeof w.matchMedia !== "function") return false;
    try {
      if (query === undefined) query = w.matchMedia("(prefers-reduced-motion: reduce)");
      return !!(query && query.matches);
    } catch {
      return false;
    }
  }

  /**
   * The spot to draw a guest at under reduced motion. It moves only when the guest settles into a rest after being
   * on the move (or into a different resting phase), facing the way it faced as it settled; while it travels the
   * last rest is kept (marked away). Null (draw nothing) until the guest first rests.
   * @param {{ phase: string, x: number, lift: number, facing: 1 | -1, away?: boolean } | null} hold
   * @param {{ phase: string, x: number, lift?: number, facing?: number }} actor
   * @param {readonly string[]} rest
   * @returns {{ phase: string, x: number, lift: number, facing: 1 | -1, away?: boolean } | null}
   */
  function calmHold(hold, actor, rest) {
    if (!rest.includes(actor.phase)) return hold && !hold.away ? { ...hold, away: true } : hold;
    if (hold && hold.phase === actor.phase && !hold.away) return hold;
    const facing = /** @type {1 | -1} */ (actor.facing != null && actor.facing < 0 ? -1 : 1);
    return { phase: actor.phase, x: actor.x, lift: actor.lift || 0, facing };
  }

  /**
   * How long a once-through pose (eating, a thank-you word) lasts under reduced motion, held on its first frame: as
   * long as its frames would have taken, never under 0.4 s, so what follows it (the thank-you, the next order) still
   * comes on time.
   * @param {number} len
   * @param {number} fps
   */
  function calmOnceS(len, fps) {
    return fps > 0 && len > 0 ? Math.max(0.4, len / fps) : 0.4;
  }

  const api = { ROBIN_REST, BIRD_REST, CALLED_REST, reducedMotion, calmHold, calmOnceS };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetCalm = api;
})(typeof window !== "undefined" ? window : globalThis);
