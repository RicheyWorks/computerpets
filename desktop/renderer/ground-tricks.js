/** Species ground-trick registry. Rui, Relay, Fuse, Ground, Miso, Pip, Thimble, Clip, Whee, Ink, Coin, Echo, Rue, Peck, Quill, Wick, Burr, Floss, Bloom, Keel, Sol, Vesper, Ember, Nori, Saffron, Bandit, Jade, Bluff, Sash, Lula, Coral, Blush, Atlas, Cup, and Sepia today. Overlay + /demo lockstep. */
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
    const Chinchilla = root.PetChinchillaTricks;
    const Axolotl = root.PetAxolotlTricks;
    const Toucan = root.PetToucanTricks;
    const Iguana = root.PetIguanaTricks;
    const Dragon = root.PetDragonTricks;
    const Phoenix = root.PetPhoenixTricks;
    const BallPython = root.PetBallPythonTricks;
    const CornSnake = root.PetCornSnakeTricks;
    const Kingsnake = root.PetKingsnakeTricks;
    const GreenTreePython = root.PetGreenTreePythonTricks;
    const Hognose = root.PetHognoseTricks;
    const Garter = root.PetGarterTricks;
    const Boa = root.PetBoaTricks;
    const MilkSnake = root.PetMilkSnakeTricks;
    const RosyBoa = root.PetRosyBoaTricks;
    const CarpetPython = root.PetCarpetPythonTricks;
    const Octopus = root.PetOctopusTricks;
    const Cuttlefish = root.PetCuttlefishTricks;
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
    if (Chinchilla && (key === Chinchilla.TRICK_KEY || key === "floss")) return Chinchilla;
    if (Axolotl && (key === Axolotl.TRICK_KEY || key === "bloom")) return Axolotl;
    if (Toucan && (key === Toucan.TRICK_KEY || key === "keel")) return Toucan;
    if (Iguana && (key === Iguana.TRICK_KEY || key === "sol")) return Iguana;
    if (Dragon && (key === Dragon.TRICK_KEY || key === "vesper")) return Dragon;
    if (Phoenix && (key === Phoenix.TRICK_KEY || key === "ember")) return Phoenix;
    if (BallPython && (key === BallPython.TRICK_KEY || key === "nori")) return BallPython;
    if (CornSnake && (key === CornSnake.TRICK_KEY || key === "saffron")) return CornSnake;
    if (Kingsnake && (key === Kingsnake.TRICK_KEY || key === "bandit")) return Kingsnake;
    if (GreenTreePython && (key === GreenTreePython.TRICK_KEY || key === "jade")) return GreenTreePython;
    if (Hognose && (key === Hognose.TRICK_KEY || key === "bluff")) return Hognose;
    if (Garter && (key === Garter.TRICK_KEY || key === "sash")) return Garter;
    if (Boa && (key === Boa.TRICK_KEY || key === "lula")) return Boa;
    if (MilkSnake && (key === MilkSnake.TRICK_KEY || key === "coral")) return MilkSnake;
    if (RosyBoa && (key === RosyBoa.TRICK_KEY || key === "blush")) return RosyBoa;
    if (CarpetPython && (key === CarpetPython.TRICK_KEY || key === "atlas")) return CarpetPython;
    if (Octopus && (key === Octopus.TRICK_KEY || key === "cup")) return Octopus;
    if (Cuttlefish && (key === Cuttlefish.TRICK_KEY || key === "sepia")) return Cuttlefish;
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

