/** A lift on the guest. A short one is a choice. A long one places them. Neither is walking in. */
(function (root) {
  const TAP_PX = 8;

  function pointerUp(dx, dy, tapPx = TAP_PX) {
    if (Math.hypot(dx, dy) < tapPx) return { kind: "tap", arrive: false };
    return { kind: "place", arrive: false };
  }

  function walkLand(actWalk, waypointCount) {
    if (actWalk) return "act";
    if (waypointCount > 0) return "pause";
    return "arrive";
  }

  function arriveFinish(leaving) {
    return leaving ? "now" : "settle";
  }

  function afterPlace(hasTarget) {
    return hasTarget ? "resume" : "idle";
  }

  const api = { TAP_PX, pointerUp, walkLand, arriveFinish, afterPlace };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetArrive = api;
})(typeof window !== "undefined" ? window : globalThis);
