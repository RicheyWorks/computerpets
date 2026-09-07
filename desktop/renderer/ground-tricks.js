/** Species ground-trick registry. Rui, Relay, Fuse, Ground, Miso, Pip, Thimble, Clip, Whee, Ink, Coin, Echo, Rue, Peck, Quill, Wick, Burr, Floss, Bloom, Keel, Sol, Vesper, Ember, Nori, Saffron, Bandit, Jade, Bluff, Sash, Lula, Coral, Blush, Atlas, Cup, Sepia, Chamber, Pulse, Cling, Tenant, Ledger, Anchor, Kite, Door, Felt, Vein, Fan, Mast, Disk, Moth, Arm, Snap, Drown, Dew, Comb, Milk, Ghost, Spark, Dart, Twig, Column, Seven, Fold, and Brood today. Overlay + /demo lockstep. */
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
    const Nautilus = root.PetNautilusTricks;
    const MoonJelly = root.PetMoonJellyTricks;
    const SeaStar = root.PetSeaStarTricks;
    const HermitCrab = root.PetHermitCrabTricks;
    const HorseshoeCrab = root.PetHorseshoeCrabTricks;
    const Seahorse = root.PetSeahorseTricks;
    const Manta = root.PetMantaTricks;
    const Moray = root.PetMorayTricks;
    const Moss = root.PetMossTricks;
    const Maidenhair = root.PetMaidenhairTricks;
    const Ginkgo = root.PetGinkgoTricks;
    const Oak = root.PetOakTricks;
    const WaterLily = root.PetWaterLilyTricks;
    const Orchid = root.PetOrchidTricks;
    const Saguaro = root.PetSaguaroTricks;
    const VenusFlytrap = root.PetVenusFlytrapTricks;
    const Pitcher = root.PetPitcherTricks;
    const Sundew = root.PetSundewTricks;
    const Honeybee = root.PetHoneybeeTricks;
    const Monarch = root.PetMonarchTricks;
    const Luna = root.PetLunaTricks;
    const Firefly = root.PetFireflyTricks;
    const Darner = root.PetDarnerTricks;
    const Stick = root.PetStickTricks;
    const CarpenterAnt = root.PetCarpenterAntTricks;
    const Ladybird = root.PetLadybirdTricks;
    const Mantis = root.PetMantisTricks;
    const Cicada = root.PetCicadaTricks;
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
    if (Nautilus && (key === Nautilus.TRICK_KEY || key === "chamber")) return Nautilus;
    if (MoonJelly && (key === MoonJelly.TRICK_KEY || key === "pulse")) return MoonJelly;
    if (SeaStar && (key === SeaStar.TRICK_KEY || key === "cling")) return SeaStar;
    if (HermitCrab && (key === HermitCrab.TRICK_KEY || key === "tenant")) return HermitCrab;
    if (HorseshoeCrab && (key === HorseshoeCrab.TRICK_KEY || key === "ledger")) return HorseshoeCrab;
    if (Seahorse && (key === Seahorse.TRICK_KEY || key === "anchor")) return Seahorse;
    if (Manta && (key === Manta.TRICK_KEY || key === "kite")) return Manta;
    if (Moray && (key === Moray.TRICK_KEY || key === "door")) return Moray;
    if (Moss && (key === Moss.TRICK_KEY || key === "felt")) return Moss;
    if (Maidenhair && (key === Maidenhair.TRICK_KEY || key === "vein")) return Maidenhair;
    if (Ginkgo && (key === Ginkgo.TRICK_KEY || key === "fan")) return Ginkgo;
    if (Oak && (key === Oak.TRICK_KEY || key === "mast")) return Oak;
    if (WaterLily && (key === WaterLily.TRICK_KEY || key === "disk")) return WaterLily;
    if (Orchid && (key === Orchid.TRICK_KEY || key === "moth")) return Orchid;
    if (Saguaro && (key === Saguaro.TRICK_KEY || key === "arm")) return Saguaro;
    if (VenusFlytrap && (key === VenusFlytrap.TRICK_KEY || key === "snap")) return VenusFlytrap;
    if (Pitcher && (key === Pitcher.TRICK_KEY || key === "drown")) return Pitcher;
    if (Sundew && (key === Sundew.TRICK_KEY || key === "dew")) return Sundew;
    if (Honeybee && (key === Honeybee.TRICK_KEY || key === "comb")) return Honeybee;
    if (Monarch && (key === Monarch.TRICK_KEY || key === "milk")) return Monarch;
    if (Luna && (key === Luna.TRICK_KEY || key === "ghost")) return Luna;
    if (Firefly && (key === Firefly.TRICK_KEY || key === "spark")) return Firefly;
    if (Darner && (key === Darner.TRICK_KEY || key === "dart")) return Darner;
    if (Stick && (key === Stick.TRICK_KEY || key === "twig")) return Stick;
    if (CarpenterAnt && (key === CarpenterAnt.TRICK_KEY || key === "column")) return CarpenterAnt;
    if (Ladybird && (key === Ladybird.TRICK_KEY || key === "seven")) return Ladybird;
    if (Mantis && (key === Mantis.TRICK_KEY || key === "fold")) return Mantis;
    if (Cicada && (key === Cicada.TRICK_KEY || key === "brood")) return Cicada;
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




