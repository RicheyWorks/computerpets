/** Species ground-trick registry. Rui and Relay today; Fuse / Ground later. Overlay + /demo lockstep. */
(function (root) {
  function tricksFor(key) {
    if (!key) return null;
    const Rui = root.PetRuiTricks;
    const Relay = root.PetRelayTricks;
    if (Rui && (key === Rui.TRICK_KEY || key === "rui")) return Rui;
    if (Relay && (key === Relay.TRICK_KEY || key === "relay")) return Relay;
    return null;
  }

  function wantsThankYou(key) {
    const T = tricksFor(key);
    return !!(T && T.wantsThankYou && T.wantsThankYou(key));
  }

  function startThankYou(key, lastKind, x, facing, flags) {
    const T = tricksFor(key);
    if (!T || !T.startThankYou) return null;
    return T.startThankYou(key, lastKind, x, facing, flags);
  }

  function sleepHoldFrame(key, frameCount) {
    const T = tricksFor(key);
    if (!T || !T.sleepHoldFrame) return null;
    return T.sleepHoldFrame(key, frameCount);
  }

  const api = { tricksFor, wantsThankYou, startThankYou, sleepHoldFrame };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetGroundTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
