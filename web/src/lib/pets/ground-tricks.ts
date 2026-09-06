/** Species ground-trick registry. Rui, Relay, Fuse, Ground, Miso, Pip, Thimble, Clip, Whee, Ink, Coin, Echo, Rue, Peck, Quill, Wick, Burr, Floss, Bloom, Keel, Sol, Vesper, Ember, Nori, Saffron, Bandit, Jade, Bluff, Sash, Lula, Coral, Blush, Atlas, Cup, Sepia, Chamber, Pulse, Cling, Tenant, Ledger, Anchor, Kite, Door, Felt, Vein, Fan, Mast, Disk, and Moth today. Overlay + /demo lockstep. */

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

export type GroundTricks = typeof Rui | typeof Relay | typeof Fuse | typeof Earth | typeof Cat | typeof Dog | typeof Rabbit | typeof Hamster | typeof GuineaPig | typeof Turtle | typeof Goldfish | typeof Budgie | typeof Fox | typeof Penguin | typeof Parrot | typeof Ferret | typeof Hedgehog | typeof Chinchilla | typeof Axolotl | typeof Toucan | typeof Iguana | typeof Dragon | typeof Phoenix | typeof BallPython | typeof CornSnake | typeof Kingsnake | typeof GreenTreePython | typeof Hognose | typeof Garter | typeof Boa | typeof MilkSnake | typeof RosyBoa | typeof CarpetPython | typeof Octopus | typeof Cuttlefish | typeof Nautilus | typeof MoonJelly | typeof SeaStar | typeof HermitCrab | typeof HorseshoeCrab | typeof Seahorse | typeof Manta | typeof Moray | typeof Moss | typeof Maidenhair | typeof Ginkgo | typeof Oak | typeof WaterLily | typeof Orchid;

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
  return null;
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




