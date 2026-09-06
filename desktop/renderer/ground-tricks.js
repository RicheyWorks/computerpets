/** Species ground-trick registry. Rui, Relay, Fuse, Ground, Miso, Pip, and Thimble today. Overlay + /demo lockstep. */
(function (root) {
  function tricksFor(key) {
    if (!key) return null;
    const Rui = root.PetRuiTricks;
    const Relay = root.PetRelayTricks;
    const Fuse = root.PetFuseTricks;
    const Earth = root.PetEarthTricks;
    const Cat = root.PetCatTricks;
    const Dog = root.PetDogTricks;
    const Rabbit = root.PetRabbitTricks;
    if (Rui && (key === Rui.TRICK_KEY || key === "rui")) return Rui;
    if (Relay && (key === Relay.TRICK_KEY || key === "relay")) return Relay;
    if (Fuse && (key === Fuse.TRICK_KEY || key === "fuse")) return Fuse;
    if (Earth && (key === Earth.TRICK_KEY || key === "ground")) return Earth;
    if (Cat && (key === Cat.TRICK_KEY || key === "miso")) return Cat;
    if (Dog && (key === Dog.TRICK_KEY || key === "pip")) return Dog;
    if (Rabbit && (key === Rabbit.TRICK_KEY || key === "thimble")) return Rabbit;
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