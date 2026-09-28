/** The two drawn windows on a desktop-size /demo (the guests perch on, hop between and watch them). */

export type DemoWindowBox = { left: number; top: number; width: number; height: number };

/** Space kept between the second window and the room's left panel, in CSS px. */
export const DEMO_WINDOW_GAP = 16;

/** "A window": right of the middle, upper half (right 12%, top 16%, up to 36rem by 46% wide, 42% tall). */
export function firstWindowSpot(stageW: number, stageH: number): DemoWindowBox {
  const width = Math.min(576, stageW * 0.46);
  return { left: stageW * 0.88 - width, top: stageH * 0.16, width, height: stageH * 0.42 };
}

/**
 * "A second window": under the first, starting clear of the left panel (keepLeft, the panel's right edge). It sat at
 * 8% from the left and 32% down, behind the panel's species plaque and hello at 1024 to 1440 px wide. It now starts
 * at 60% down (the first window ends at 58%, the market plate at 38% plus its 38 px, the care buttons at about 88%)
 * and up to 24rem by 30% wide, 24% tall.
 */
export function secondWindowSpot(stageW: number, stageH: number, keepLeft = 0): DemoWindowBox {
  const width = Math.min(384, stageW * 0.3);
  const lo = stageW * 0.08;
  const hi = Math.max(lo, stageW - width - DEMO_WINDOW_GAP);
  const left = Math.min(hi, Math.max(lo, keepLeft > 0 ? keepLeft + DEMO_WINDOW_GAP : lo));
  return { left, top: stageH * 0.6, width, height: stageH * 0.24 };
}
