/** Species ground-trick registry. Rui, Relay, Fuse, Ground, Miso, Pip, Thimble, Clip, Whee, Ink, Coin, Echo, Rue, Peck, Quill, Wick, Burr, Floss, Bloom, Keel, Sol, and Vesper today. Overlay + /demo lockstep. */

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

export type GroundTricks = typeof Rui | typeof Relay | typeof Fuse | typeof Earth | typeof Cat | typeof Dog | typeof Rabbit | typeof Hamster | typeof GuineaPig | typeof Turtle | typeof Goldfish | typeof Budgie | typeof Fox | typeof Penguin | typeof Parrot | typeof Ferret | typeof Hedgehog | typeof Chinchilla | typeof Axolotl | typeof Toucan | typeof Iguana | typeof Dragon;

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
