/** A lift on the guest. A short one talks. A long one places them on the wood. Neither is walking in. */

export const TAP_PX = 8;

export type PointerUpKind = "tap" | "place";

export type PointerUp = {
  kind: PointerUpKind;
  arrive: false;
};

/** Pointer-up after a drag is a place, not an arrival. Arrival is a walk that lands. */
export function pointerUp(dx: number, dy: number, tapPx = TAP_PX): PointerUp {
  if (Math.hypot(dx, dy) < tapPx) return { kind: "tap", arrive: false };
  return { kind: "place", arrive: false };
}

export type WalkLand = "act" | "pause" | "arrive";

/** The last yard of a walk. Ethogram darts pause; wander pauses; a seek or leave lands. */
export function walkLand(actWalk: boolean, waypointCount: number): WalkLand {
  if (actWalk) return "act";
  if (waypointCount > 0) return "pause";
  return "arrive";
}

export type ArriveFinish = "now" | "settle";

/** Walking off the blotter arrives at once. Walking onto a mark settles, then arrives. */
export function arriveFinish(leaving: boolean): ArriveFinish {
  return leaving ? "now" : "settle";
}

/** After a place, keep the walk if they still have a mark. */
export function afterPlace(hasTarget: boolean): "resume" | "idle" {
  return hasTarget ? "resume" : "idle";
}
