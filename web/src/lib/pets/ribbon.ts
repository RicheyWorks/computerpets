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

export function stealRibbon(ribbon: RibbonSit, petX: number): RibbonSit {
  return { ...ribbon, x: petX, stolen: true, carried: true, hops: ribbon.hops };
}

export function dropRibbon(ribbon: RibbonSit, x: number): RibbonSit {
  return { ...ribbon, x, carried: false };
}

export function carryX(ribbon: RibbonSit | null | undefined, petX: number, facing: 1 | -1) {
  if (!ribbon || !ribbon.carried) return ribbon?.x ?? petX;
  return petX + facing * 38;
}

export function isRibbonSpecial(special: string | undefined) {
  return special === "ribbon";
}
