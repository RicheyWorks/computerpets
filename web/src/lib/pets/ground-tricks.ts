/** Species ground-trick registry. Rui, Relay, Fuse, and Ground today. Overlay + /demo lockstep. */

import * as Rui from "./rui-tricks";
import * as Relay from "./relay-tricks";
import * as Fuse from "./fuse-tricks";
import * as Earth from "./earth-tricks";

export type GroundTricks = typeof Rui | typeof Relay | typeof Fuse | typeof Earth;

export function tricksFor(key: string | undefined | null): GroundTricks | null {
  if (!key) return null;
  if (key === Rui.TRICK_KEY || key === "rui") return Rui;
  if (key === Relay.TRICK_KEY || key === "relay") return Relay;
  if (key === Fuse.TRICK_KEY || key === "fuse") return Fuse;
  if (key === Earth.TRICK_KEY || key === "ground") return Earth;
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