/**
 * Reduced motion ("prefers-reduced-motion: reduce", the system's own setting): the robin, the hummingbird, called
 * guests and the desk plants keep their visits, songs, calls and taps, but stop travelling across the desk. A guest
 * is drawn still where it rests: it shows once it first settles, stays put while its walk or flight goes on unseen,
 * and appears at its next resting spot without the trip between (a cut, not a glide). The wing wobble, the tilt and
 * the plants' wind lean stop. The same rules as desktop/renderer/calm-motion.js.
 */

export type CalmHold = { phase: string; x: number; lift: number; facing: 1 | -1; away?: boolean } | null;

/** Resting phases, where a guest sits still long enough to be drawn. */
export const ROBIN_REST: readonly string[] = ["stay", "perch"];
export const BIRD_REST: readonly string[] = ["hover", "perch"];
export const CALLED_REST: readonly string[] = ["stay", "perch", "meet", "bound"];

let query: MediaQueryList | null | undefined;

/** True while the system asks for reduced motion. Read every frame, so a change takes hold at once. */
export function reducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  try {
    if (query === undefined) query = window.matchMedia("(prefers-reduced-motion: reduce)");
    return !!query?.matches;
  } catch {
    return false;
  }
}

/**
 * The spot to draw a guest at under reduced motion. It moves only when the guest settles into a rest after being on
 * the move (or into a different resting phase), facing the way it faced as it settled; while it travels the last
 * rest is kept (marked away). Null (draw nothing) until the guest first rests.
 */
export function calmHold(hold: CalmHold, actor: { phase: string; x: number; lift?: number; facing?: number }, rest: readonly string[]): CalmHold {
  if (!rest.includes(actor.phase)) return hold && !hold.away ? { ...hold, away: true } : hold;
  if (hold && hold.phase === actor.phase && !hold.away) return hold;
  return { phase: actor.phase, x: actor.x, lift: actor.lift || 0, facing: actor.facing != null && actor.facing < 0 ? -1 : 1 };
}
