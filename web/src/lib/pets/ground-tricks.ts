/** Species ground-trick registry. Rui, Relay, Fuse, Ground, Miso, Pip, Thimble, Clip, Whee, Ink, Coin, Echo, Rue, Peck, Quill, Wick, Burr, Floss, Bloom, Keel, Sol, Vesper, Ember, Nori, Saffron, Bandit, Jade, Bluff, Sash, Lula, Coral, Blush, Atlas, Cup, Sepia, Chamber, Pulse, Cling, Tenant, Ledger, Anchor, Kite, Door, Felt, Vein, Fan, Mast, Disk, Moth, Arm, Snap, Drown, Dew, Comb, Milk, Ghost, Spark, Dart, Twig, Column, Seven, Fold, Brood, Thrum, Auger, Mortar, Disc, Pot, Sheen, Bank, Hum, Keep, Wax, Frill, Cap, Lattice, Horn, Ring, Mane, Puff, Flame, Starter, Pact, Gleam, Choir, and Drift today. Overlay + /demo lockstep. */

import * as Rui from "./rui-tricks";
import * as Relay from "./relay-tricks";
import * as Fuse from "./fuse-tricks";
import * as Earth from "./earth-tricks";
import * as Cat from "./cat-tricks";
import * as Dog from "./dog-tricks";
import * as Rabbit from "./rabbit-tricks";
import * as Hamster from "./hamster-tricks";
import * as GuineaPig from "./guinea-pig-tricks";
import * as Turtle from "./turtle-tricks";
import * as Goldfish from "./goldfish-tricks";
import * as Budgie from "./budgie-tricks";
import * as Fox from "./fox-tricks";
import * as Penguin from "./penguin-tricks";
import * as Parrot from "./parrot-tricks";
import * as Ferret from "./ferret-tricks";
import * as Hedgehog from "./hedgehog-tricks";
import * as Chinchilla from "./chinchilla-tricks";
import * as Axolotl from "./axolotl-tricks";
import * as Toucan from "./toucan-tricks";
import * as Iguana from "./iguana-tricks";
import * as Dragon from "./dragon-tricks";
import * as Phoenix from "./phoenix-tricks";
import * as BallPython from "./ball-python-tricks";
import * as CornSnake from "./corn-snake-tricks";
import * as Kingsnake from "./kingsnake-tricks";
import * as GreenTreePython from "./green-tree-python-tricks";
import * as Hognose from "./hognose-tricks";
import * as Garter from "./garter-tricks";
import * as Boa from "./boa-tricks";
import * as MilkSnake from "./milk-snake-tricks";
import * as RosyBoa from "./rosy-boa-tricks";
import * as CarpetPython from "./carpet-python-tricks";
import * as Octopus from "./octopus-tricks";
import * as Cuttlefish from "./cuttlefish-tricks";
import * as Nautilus from "./nautilus-tricks";
import * as MoonJelly from "./moon_jelly-tricks";
import * as SeaStar from "./sea_star-tricks";
import * as HermitCrab from "./hermit_crab-tricks";
import * as HorseshoeCrab from "./horseshoe_crab-tricks";
import * as Seahorse from "./seahorse-tricks";
import * as Manta from "./manta-tricks";
import * as Moray from "./moray-tricks";
import * as Moss from "./moss-tricks";
import * as Maidenhair from "./maidenhair-tricks";
import * as Ginkgo from "./ginkgo-tricks";
import * as Oak from "./oak-tricks";
import * as WaterLily from "./water_lily-tricks";
import * as Orchid from "./orchid-tricks";
import * as Saguaro from "./saguaro-tricks";
import * as VenusFlytrap from "./venus_flytrap-tricks";
import * as Pitcher from "./pitcher-tricks";
import * as Sundew from "./sundew-tricks";
import * as Honeybee from "./honeybee-tricks";
import * as Monarch from "./monarch-tricks";
import * as Luna from "./luna-tricks";
import * as Firefly from "./firefly-tricks";
import * as Darner from "./darner-tricks";
import * as Stick from "./stick-tricks";
import * as CarpenterAnt from "./carpenter_ant-tricks";
import * as Ladybird from "./ladybird-tricks";
import * as Mantis from "./mantis-tricks";
import * as Cicada from "./cicada-tricks";
import * as Bumblebee from "./bumblebee-tricks";
import * as CarpenterBee from "./carpenter_bee-tricks";
import * as MasonBee from "./mason_bee-tricks";
import * as Leafcutter from "./leafcutter-tricks";
import * as Stingless from "./stingless-tricks";
import * as SweatBee from "./sweat_bee-tricks";
import * as MiningBee from "./mining_bee-tricks";
import * as HoneyDrone from "./honey_drone-tricks";
import * as HoneyQueen from "./honey_queen-tricks";
import * as Honeycomb from "./honeycomb-tricks";
import * as Oyster from "./oyster-tricks";
import * as FlyAgaric from "./fly_agaric-tricks";
import * as Morel from "./morel-tricks";
import * as Chanterelle from "./chanterelle-tricks";
import * as TurkeyTail from "./turkey_tail-tricks";
import * as LionsMane from "./lions_mane-tricks";
import * as Puffball from "./puffball-tricks";
import * as ChickenOfWoods from "./chicken_of_woods-tricks";
import * as Yeast from "./yeast-tricks";
import * as Lichen from "./lichen-tricks";
import * as Photovore from "./photovore-tricks";
import * as Choir from "./choir-tricks";
import * as Nimbus from "./nimbus-tricks";

export type GroundTricks = typeof Rui | typeof Relay | typeof Fuse | typeof Earth | typeof Cat | typeof Dog | typeof Rabbit | typeof Hamster | typeof GuineaPig | typeof Turtle | typeof Goldfish | typeof Budgie | typeof Fox | typeof Penguin | typeof Parrot | typeof Ferret | typeof Hedgehog | typeof Chinchilla | typeof Axolotl | typeof Toucan | typeof Iguana | typeof Dragon | typeof Phoenix | typeof BallPython | typeof CornSnake | typeof Kingsnake | typeof GreenTreePython | typeof Hognose | typeof Garter | typeof Boa | typeof MilkSnake | typeof RosyBoa | typeof CarpetPython | typeof Octopus | typeof Cuttlefish | typeof Nautilus | typeof MoonJelly | typeof SeaStar | typeof HermitCrab | typeof HorseshoeCrab | typeof Seahorse | typeof Manta | typeof Moray | typeof Moss | typeof Maidenhair | typeof Ginkgo | typeof Oak | typeof WaterLily | typeof Orchid | typeof Saguaro | typeof VenusFlytrap | typeof Pitcher | typeof Sundew | typeof Honeybee | typeof Monarch | typeof Luna | typeof Firefly | typeof Darner | typeof Stick | typeof CarpenterAnt | typeof Ladybird | typeof Mantis | typeof Cicada | typeof Bumblebee | typeof CarpenterBee | typeof MasonBee | typeof Leafcutter | typeof Stingless | typeof SweatBee | typeof MiningBee | typeof HoneyDrone | typeof HoneyQueen | typeof Honeycomb | typeof Oyster | typeof FlyAgaric | typeof Morel | typeof Chanterelle | typeof TurkeyTail | typeof LionsMane | typeof Puffball | typeof ChickenOfWoods | typeof Yeast | typeof Lichen | typeof Photovore | typeof Choir | typeof Nimbus;

export function tricksFor(key: string | undefined | null): GroundTricks | null {
  if (!key) return null;
  if (key === Rui.TRICK_KEY || key === "rui") return Rui;
  if (key === Relay.TRICK_KEY || key === "relay") return Relay;
  if (key === Fuse.TRICK_KEY || key === "fuse") return Fuse;
  if (key === Earth.TRICK_KEY || key === "ground") return Earth;
  if (key === Cat.TRICK_KEY || key === "miso") return Cat;
  if (key === Dog.TRICK_KEY || key === "pip") return Dog;
  if (key === Rabbit.TRICK_KEY || key === "thimble") return Rabbit;
  if (key === Hamster.TRICK_KEY || key === "clip") return Hamster;
  if (key === GuineaPig.TRICK_KEY || key === "whee") return GuineaPig;
  if (key === Turtle.TRICK_KEY || key === "ink") return Turtle;
  if (key === Goldfish.TRICK_KEY || key === "coin") return Goldfish;
  if (key === Budgie.TRICK_KEY || key === "echo") return Budgie;
  if (key === Fox.TRICK_KEY || key === "rue") return Fox;
  if (key === Penguin.TRICK_KEY || key === "peck") return Penguin;
  if (key === Parrot.TRICK_KEY || key === "quill") return Parrot;
  if (key === Ferret.TRICK_KEY || key === "wick") return Ferret;
  if (key === Hedgehog.TRICK_KEY || key === "burr") return Hedgehog;
  if (key === Chinchilla.TRICK_KEY || key === "floss") return Chinchilla;
  if (key === Axolotl.TRICK_KEY || key === "bloom") return Axolotl;
  if (key === Toucan.TRICK_KEY || key === "keel") return Toucan;
  if (key === Iguana.TRICK_KEY || key === "sol") return Iguana;
  if (key === Dragon.TRICK_KEY || key === "vesper") return Dragon;
  if (key === Phoenix.TRICK_KEY || key === "ember") return Phoenix;
  if (key === BallPython.TRICK_KEY || key === "nori") return BallPython;
  if (key === CornSnake.TRICK_KEY || key === "saffron") return CornSnake;
  if (key === Kingsnake.TRICK_KEY || key === "bandit") return Kingsnake;
  if (key === GreenTreePython.TRICK_KEY || key === "jade") return GreenTreePython;
  if (key === Hognose.TRICK_KEY || key === "bluff") return Hognose;
  if (key === Garter.TRICK_KEY || key === "sash") return Garter;
  if (key === Boa.TRICK_KEY || key === "lula") return Boa;
  if (key === MilkSnake.TRICK_KEY || key === "coral") return MilkSnake;
  if (key === RosyBoa.TRICK_KEY || key === "blush") return RosyBoa;
  if (key === CarpetPython.TRICK_KEY || key === "atlas") return CarpetPython;
  if (key === Octopus.TRICK_KEY || key === "cup") return Octopus;
  if (key === Cuttlefish.TRICK_KEY || key === "sepia") return Cuttlefish;
  if (key === Nautilus.TRICK_KEY || key === "chamber") return Nautilus;
  if (key === MoonJelly.TRICK_KEY || key === "pulse") return MoonJelly;
  if (key === SeaStar.TRICK_KEY || key === "cling") return SeaStar;
  if (key === HermitCrab.TRICK_KEY || key === "tenant") return HermitCrab;
  if (key === HorseshoeCrab.TRICK_KEY || key === "ledger") return HorseshoeCrab;
  if (key === Seahorse.TRICK_KEY || key === "anchor") return Seahorse;
  if (key === Manta.TRICK_KEY || key === "kite") return Manta;
  if (key === Moray.TRICK_KEY || key === "door") return Moray;
  if (key === Moss.TRICK_KEY || key === "felt") return Moss;
  if (key === Maidenhair.TRICK_KEY || key === "vein") return Maidenhair;
  if (key === Ginkgo.TRICK_KEY || key === "fan") return Ginkgo;
  if (key === Oak.TRICK_KEY || key === "mast") return Oak;
  if (key === WaterLily.TRICK_KEY || key === "disk") return WaterLily;
  if (key === Orchid.TRICK_KEY || key === "moth") return Orchid;
  if (key === Saguaro.TRICK_KEY || key === "arm") return Saguaro;
  if (key === VenusFlytrap.TRICK_KEY || key === "snap") return VenusFlytrap;
  if (key === Pitcher.TRICK_KEY || key === "drown") return Pitcher;
  if (key === Sundew.TRICK_KEY || key === "dew") return Sundew;
  if (key === Honeybee.TRICK_KEY || key === "comb") return Honeybee;
  if (key === Monarch.TRICK_KEY || key === "milk") return Monarch;
  if (key === Luna.TRICK_KEY || key === "ghost") return Luna;
  if (key === Firefly.TRICK_KEY || key === "spark") return Firefly;
  if (key === Darner.TRICK_KEY || key === "dart") return Darner;
  if (key === Stick.TRICK_KEY || key === "twig") return Stick;
  if (key === CarpenterAnt.TRICK_KEY || key === "column") return CarpenterAnt;
  if (key === Ladybird.TRICK_KEY || key === "seven") return Ladybird;
  if (key === Mantis.TRICK_KEY || key === "fold") return Mantis;
  if (key === Cicada.TRICK_KEY || key === "brood") return Cicada;
  if (key === Bumblebee.TRICK_KEY || key === "thrum") return Bumblebee;
  if (key === CarpenterBee.TRICK_KEY || key === "auger") return CarpenterBee;
  if (key === MasonBee.TRICK_KEY || key === "mortar") return MasonBee;
  if (key === Leafcutter.TRICK_KEY || key === "disc") return Leafcutter;
  if (key === Stingless.TRICK_KEY || key === "pot") return Stingless;
  if (key === SweatBee.TRICK_KEY || key === "sheen") return SweatBee;
  if (key === MiningBee.TRICK_KEY || key === "bank") return MiningBee;
  if (key === HoneyDrone.TRICK_KEY || key === "hum") return HoneyDrone;
  if (key === HoneyQueen.TRICK_KEY || key === "keep") return HoneyQueen;
  if (key === Honeycomb.TRICK_KEY || key === "wax") return Honeycomb;
  if (key === Oyster.TRICK_KEY || key === "frill") return Oyster;
  if (key === FlyAgaric.TRICK_KEY || key === "cap") return FlyAgaric;
if (key === Morel.TRICK_KEY || key === "lattice") return Morel;
if (key === Chanterelle.TRICK_KEY || key === "horn") return Chanterelle;
if (key === TurkeyTail.TRICK_KEY || key === "ring") return TurkeyTail;
if (key === LionsMane.TRICK_KEY || key === "mane") return LionsMane;
if (key === Puffball.TRICK_KEY || key === "puff") return Puffball;
if (key === ChickenOfWoods.TRICK_KEY || key === "flame") return ChickenOfWoods;
  if (key === Yeast.TRICK_KEY || key === "starter") return Yeast;
  if (key === Lichen.TRICK_KEY || key === "pact") return Lichen;
  if (key === Photovore.TRICK_KEY || key === "gleam") return Photovore;
  if (key === Choir.TRICK_KEY || key === "choir") return Choir;
  if (key === Nimbus.TRICK_KEY || key === "nimbus" || key === "drift") return Nimbus;
}

export function wantsThankYou(key: string | undefined | null) {
  const T = tricksFor(key ?? undefined);
  return !!(T && T.wantsThankYou(key ?? undefined));
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: Rui.TrickFlags,
) {
  const T = tricksFor(key ?? undefined);
  if (!T) return null;
  return T.startThankYou(key ?? undefined, lastKind as never, x, facing, flags);
}

export function sleepHoldFrame(key: string | undefined | null, frameCount?: number) {
  const T = tricksFor(key ?? undefined);
  if (!T) return null;
  return T.sleepHoldFrame(key ?? undefined, frameCount);
}




