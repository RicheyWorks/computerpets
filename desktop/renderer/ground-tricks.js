/** Species ground-trick registry. Rui, Relay, Fuse, Ground, Miso, Pip, Thimble, Clip, Whee, Ink, Coin, Echo, Rue, Peck, Quill, Wick, and Burr today. Overlay + /demo lockstep. */
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
    const Hamster = root.PetHamsterTricks;
    const GuineaPig = root.PetGuineaPigTricks;
    const Turtle = root.PetTurtleTricks;
    const Goldfish = root.PetGoldfishTricks;
    const Budgie = root.PetBudgieTricks;
    const Fox = root.PetFoxTricks;
    const Penguin = root.PetPenguinTricks;
    const Parrot = root.PetParrotTricks;
    const Ferret = root.PetFerretTricks;
    const Hedgehog = root.PetHedgehogTricks;
    if (Rui && (key === Rui.TRICK_KEY || key === "rui")) return Rui;
    if (Relay && (key === Relay.TRICK_KEY || key === "relay")) return Relay;
    if (Fuse && (key === Fuse.TRICK_KEY || key === "fuse")) return Fuse;
    if (Earth && (key === Earth.TRICK_KEY || key === "ground")) return Earth;
    if (Cat && (key === Cat.TRICK_KEY || key === "miso")) return Cat;
    if (Dog && (key === Dog.TRICK_KEY || key === "pip")) return Dog;
    if (Rabbit && (key === Rabbit.TRICK_KEY || key === "thimble")) return Rabbit;
    if (Hamster && (key === Hamster.TRICK_KEY || key === "clip")) return Hamster;
    if (GuineaPig && (key === GuineaPig.TRICK_KEY || key === "whee")) return GuineaPig;
    if (Turtle && (key === Turtle.TRICK_KEY || key === "ink")) return Turtle;
    if (Goldfish && (key === Goldfish.TRICK_KEY || key === "coin")) return Goldfish;
    if (Budgie && (key === Budgie.TRICK_KEY || key === "echo")) return Budgie;
    if (Fox && (key === Fox.TRICK_KEY || key === "rue")) return Fox;
    if (Penguin && (key === Penguin.TRICK_KEY || key === "peck")) return Penguin;
    if (Parrot && (key === Parrot.TRICK_KEY || key === "quill")) return Parrot;
    if (Ferret && (key === Ferret.TRICK_KEY || key === "wick")) return Ferret;
    if (Hedgehog && (key === Hedgehog.TRICK_KEY || key === "burr")) return Hedgehog;
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