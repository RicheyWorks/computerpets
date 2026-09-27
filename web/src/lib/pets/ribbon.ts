/** Rui's ribbon lure. House lines stay. Same map as desktop `ribbon.js`. */

export const RIBBON_SPECIAL = "I found a ribbon. It was not lost. It is now safer.";
export const RIBBON_CATCH = "A ribbon. Catch it.";
export const RIBBON_PLAY = "Catch the ribbon. I invented this game.";

export type RibbonSit = {
  x: number;
  hops: number;
  stolen: boolean;
  carried: boolean;
};

export function blankRibbon(x: number): RibbonSit {
  return { x, hops: 0, stolen: false, carried: false };
}

/** The desk's lure mark is ribbon-shaped too: it carries its own `kind` and may not have counted hops yet. */
export type RibbonLike = { x: number; hops?: number; stolen?: boolean; carried?: boolean };

export function stealRibbon<R extends RibbonLike>(ribbon: R, petX: number): R & { x: number; stolen: boolean; carried: boolean } {
  return { ...ribbon, x: petX, stolen: true, carried: true, hops: ribbon.hops };
}

export function dropRibbon<R extends RibbonLike>(ribbon: R, x: number): R & { x: number; carried: boolean } {
  return { ...ribbon, x, carried: false };
}

export function carryX(ribbon: RibbonLike | null | undefined, petX: number, facing: 1 | -1) {
  if (!ribbon || !ribbon.carried) return ribbon?.x ?? petX;
  return petX + facing * 38;
}

export function isRibbonSpecial(special: string | undefined) {
  return special === "ribbon";
}
