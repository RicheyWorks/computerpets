/** Species ground-trick registry. Rui, Relay, Fuse, Ground, Miso, Pip, Thimble, Clip, Whee, and Ink today. Overlay + /demo lockstep. */

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

export type GroundTricks = typeof Rui | typeof Relay | typeof Fuse | typeof Earth | typeof Cat | typeof Dog | typeof Rabbit | typeof Hamster | typeof GuineaPig | typeof Turtle;

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

