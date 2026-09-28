/** How the sit sits on a phone. A tap is a choice. A drag is a carry. A long-press tends. /live is the door. */

import {
  HOLD_MS,
  TAP_PX,
  TAP_PX_LINUX,
  TAP_PX_MAC,
  TAP_PX_TABLET,
  followHover as deskFollowHover,
  isPhone,
  isTablet,
  readSit,
  tabletLift,
  tabletSafe,
  tapPxFor as deskTapPxFor,
  type TabletLift,
  type TabletSafe,
  type TabletSit,
} from "./tablet-desk.ts";

export { HOLD_MS, TAP_PX, TAP_PX_LINUX, TAP_PX_MAC, TAP_PX_TABLET, isPhone, isTablet, readSit };

/** A thumb needs more wood than a mouse. Less than a tablet finger. */
export const TAP_PX_PHONE = 16;

export type PhoneSit = TabletSit;
export type PhoneSafe = TabletSafe;
export type PhoneLift = TabletLift;

/** Portrait is the blotter. A phone blotter is tall. Landscape is a sit. */
export type PhoneOrient = "blotter" | "sit";

/**
 * A phone sit. iPhone. An Android phone. A small coarse sit.
 * A tablet is not a phone. A desk is not a phone.
 */
export function isHand(sit: PhoneSit | string | null | undefined): boolean {
  return isPhone(sit);
}

/** The house tap slop. A phone sits between a mouse and a tablet. The desks keep their own. */
export function tapPxFor(platform: string | undefined | null, sit?: PhoneSit | null): number {
  if (isPhone(sit ?? platform)) return TAP_PX_PHONE;
  return deskTapPxFor(platform, sit);
}

/** Portrait is the blotter. Landscape is a sit. */
export function phoneOrient(width: number, height: number): PhoneOrient {
  return height >= width ? "blotter" : "sit";
}

/** The floor sits below the notch and above the home mark. */
export function phoneSafe(insets?: Partial<PhoneSafe> | null): PhoneSafe & {
  floorTop: number;
  floorBottom: number;
} {
  return tabletSafe(insets);
}

/** Care sits in the thumb. Portrait is a sit. Landscape is a rail. One hand. */
export function thumbCare(orient: PhoneOrient): { zone: "rail" | "sit"; minTarget: number } {
  return orient === "blotter" ? { zone: "sit", minTarget: 44 } : { zone: "rail", minTarget: 40 };
}

/** A phone has no hover. The guest does not watch a cursor that is not there. */
export function followHover(sit: PhoneSit | string | null | undefined): boolean {
  return !isPhone(sit) && deskFollowHover(sit);
}

/** A phone has no extra and no mark. The sit is the chrome. Add to Home Screen is the pocket. */
export function overlayChrome(sit: PhoneSit | string | null | undefined): {
  type: "sit" | null;
  hover: boolean;
  extra: boolean;
  mark: boolean;
  home: boolean;
} {
  if (!isPhone(sit)) {
    return { type: null, hover: deskFollowHover(sit), extra: false, mark: false, home: false };
  }
  return { type: "sit", hover: false, extra: false, mark: false, home: true };
}

/** A tap on the sit opens care. There is no tray toggle and no menu-bar extra. */
export function sitClick(sit: PhoneSit | string | null | undefined): "care" | "none" {
  return isPhone(sit) ? "care" : "none";
}

/**
 * A long still thumb tends. A short still thumb is a choice. A long move is a carry.
 * Same house walk as the tablet. The slop is a phone slop.
 */
export function phoneLift(
  heldMs: number,
  dx: number,
  dy: number,
  tapPx = TAP_PX_PHONE,
  holdMs = HOLD_MS,
): PhoneLift {
  return tabletLift(heldMs, dx, dy, tapPx, holdMs);
}

/** A hold that has not wandered is a tend. A wander cancels the hold. */
export function careHold(heldMs: number, slopMoved: boolean, holdMs = HOLD_MS): boolean {
  return !slopMoved && heldMs >= holdMs;
}

/** /live is the door. Standalone is the pocket. It is not a settings panel. */
export function homeSit(installed: boolean): "home" | "add" {
  return installed ? "home" : "add";
}

/** One line. Add to Home Screen. Not a store. */
export function homeLine(installed: boolean): string {
  return installed
    ? "On the home screen. Tap the blotter for a treat."
    : "Add to Home Screen. Tap the blotter for a treat.";
}

/** Room kept between the panels and the care buttons on a phone desk, in CSS px. */
export const PHONE_FIT_GAP = 8;
/** A panel is never squeezed below this; it scrolls inside instead. */
export const PHONE_FIT_MIN = 48;

export type PhoneFitInput = {
  /** Top of the left panel (name, hello, plaque), from the top of the room. */
  asideTop: number;
  /** Top of the room rail on the right, from the top of the room. */
  railTop: number;
  /** Top of the care buttons, from the top of the room. */
  careTop: number;
  gap?: number;
  /** Height of one row of the room rail (every label is one row on a phone); the rail ends on a whole row. */
  railRow?: number;
};

export type PhoneFit = { asideMax: number; railMax: number };

/**
 * On a phone the care buttons sit in the thumb and everything above them has to end before them: the left panel
 * and the room rail each get the height down to the care buttons (less a small gap) and scroll inside past that.
 */
export function phoneFit(input: PhoneFitInput): PhoneFit {
  const gap = input.gap ?? PHONE_FIT_GAP;
  const room = (top: number) => Math.max(PHONE_FIT_MIN, Math.floor(input.careTop - top - gap));
  return { asideMax: room(input.asideTop), railMax: railRows(room(input.railTop), input.railRow) };
}

/**
 * The rail's height cut down to whole rows, so with its rows snapping to the top no label rests cut in half at
 * the bottom either. Never less than one row; unchanged when the row height is unknown.
 */
export function railRows(max: number, row: number | undefined): number {
  if (!row || !(row > 0) || !Number.isFinite(row)) return max;
  const rows = Math.max(1, Math.floor((max + 0.5) / row));
  return Math.round(rows * row * 100) / 100;
}

/** Space kept between the site header and a speech bubble, in CSS px. */
export const BUBBLE_HEADER_GAP = 6;

/**
 * How far a speech bubble may rise above its resting spot (restTop, its top before any lift, in viewport px) and
 * still end below the site header (headerBottom). On a landscape phone a pet high on the ridge would otherwise push
 * its bubble over the header. Unlimited when there is no header.
 */
export function bubbleRoom(restTop: number, headerBottom: number | null | undefined, gap = BUBBLE_HEADER_GAP): number {
  if (headerBottom == null || !Number.isFinite(headerBottom) || !Number.isFinite(restTop)) return Number.POSITIVE_INFINITY;
  return restTop - headerBottom - gap;
}

/** The bubble's lift: as high as the pet wants (want), capped by the room under the header (may go below rest). */
export function bubbleLift(want: number, room: number): number {
  return Math.min(want, room);
}

/** The same fit, or a new one only when a number moved (so a resize observer does not re-render for nothing). */
export function samePhoneFit(a: PhoneFit | null, b: PhoneFit | null): boolean {
  return !!a && !!b && a.asideMax === b.asideMax && a.railMax === b.railMax;
}

/** A box on the screen, in viewport px (only the edges deskFit needs). */
export type DeskBox = { top: number; left: number; right: number };

export type DeskFitInput = {
  /** The left panel (name, plaque, hello, keeper card). */
  aside: DeskBox;
  /** The room rail on the right (the rooms, then the guests' drawer). */
  rail: DeskBox;
  /** What sits along the bottom: the care buttons, the talk line, the room links. */
  below: readonly DeskBox[];
  /** The screen's height. */
  viewH: number;
  gap?: number;
};

export type DeskFit = { asideMax: number; railMax: number };

/**
 * A desktop-size room: the left panel and the room rail each end above whatever of the care buttons, the talk line
 * and the room links sits under them, and above the screen's bottom otherwise, and scroll inside past that. At 1024×768, 1280×720 and 1366×768
 * the panel ran 31 to 79 px off the screen (the hello's Got it with it) and the hello sat under Feed and Play; at
 * 1024 to 1440 px wide the rail's guest drawer ran 137 to 169 px past the bottom, so its last guests were out of reach.
 */
export function deskFit(input: DeskFitInput): DeskFit {
  const gap = input.gap ?? PHONE_FIT_GAP;
  const room = (box: DeskBox) => {
    let floor = input.viewH;
    for (const part of input.below) {
      const beside = part.right <= box.left - gap || part.left >= box.right + gap;
      if (!beside) floor = Math.min(floor, part.top);
    }
    return Math.max(PHONE_FIT_MIN, Math.floor(floor - box.top - gap));
  };
  return { asideMax: room(input.aside), railMax: room(input.rail) };
}

/** The folded plaque still does not fit above the care buttons: show it as one line instead. */
export function plaqueNeedsLine(scrollHeight: number, clientHeight: number): boolean {
  return scrollHeight > clientHeight + 1;
}

export type RailScrollInput = {
  /** The rail's scroll position now, and the height it shows. */
  scrollTop: number;
  viewH: number;
  /** The whole scroll height of the rail. */
  scrollH: number;
  /** The current guest's row: its top within the rail's content (scroll position 0) and its height. */
  rowTop: number;
  rowH: number;
  /** A phone rail snaps to whole rows of this height (railRows); the answer lands on a row too. */
  snap?: number;
};

/**
 * Where the room rail scrolls so the current guest's row shows: unchanged when the row already shows whole, else
 * the row in the middle of the rail (on a phone, on a whole row, so the snap does not move it again). A guest far
 * down a long room (the 20th of the reef, the 16th of the snakes) sat below the rail's end on arrival.
 */
export function railScrollFor(input: RailScrollInput): number {
  const { scrollTop, viewH, scrollH, rowTop, rowH } = input;
  const max = Math.max(0, scrollH - viewH);
  if (rowTop >= scrollTop - 0.5 && rowTop + rowH <= scrollTop + viewH + 0.5) return scrollTop;
  let next = rowTop - (viewH - rowH) / 2;
  const snap = input.snap;
  if (snap && snap > 0 && Number.isFinite(snap)) {
    next = Math.round(next / snap) * snap;
    // A whole-row rail: the row itself must still show after the rounding.
    if (rowTop < next) next = Math.floor(rowTop / snap) * snap;
    if (rowTop + rowH > next + viewH) next = Math.ceil((rowTop + rowH - viewH) / snap) * snap;
  }
  return Math.round(Math.min(max, Math.max(0, next)) * 100) / 100;
}

/** A box in one frame of reference (the room's), in CSS px. */
export type BubbleBox = { left: number; top: number; right: number; bottom: number };

export type BubbleDodgeInput = {
  /** Where the bubble would go (its left and top) and its size. */
  x: number;
  top: number;
  w: number;
  h: number;
  /** The plates it may not cross, in the same frame. */
  plates: readonly BubbleBox[];
  /** The room's width (the bubble stays 10 px inside it) and the highest the bubble may go (under the header). */
  width: number;
  minTop?: number;
  /** The lowest the bubble's top may go (it stays above the floor). */
  maxTop?: number;
  gap?: number;
};

/** Space kept between a speech bubble and a plate it steps around, in CSS px. */
export const BUBBLE_PLATE_GAP = 8;

/**
 * Where a speech bubble goes so it does not cross a weather, news or market plate: where the pet puts it when that
 * is clear, else the nearest spot beside, above or below the plates it would cross (clear of every plate), else
 * below the lowest of them. A pet walking under a plate put its line across the plate's words.
 */
export function bubbleDodge(input: BubbleDodgeInput): { x: number; top: number } {
  const gap = input.gap ?? BUBBLE_PLATE_GAP;
  const { w, h, plates } = input;
  const minX = 10;
  const maxX = Math.max(minX, input.width - w - 10);
  const minTop = Number.isFinite(input.minTop) ? (input.minTop as number) : Number.NEGATIVE_INFINITY;
  const maxTop = Number.isFinite(input.maxTop) ? (input.maxTop as number) : Number.POSITIVE_INFINITY;
  const hits = (x: number, top: number) =>
    plates.some((p) => Math.min(x + w, p.right) - Math.max(x, p.left) > 0 && Math.min(top + h, p.bottom) - Math.max(top, p.top) > 0);
  if (!hits(input.x, input.top)) return { x: input.x, top: input.top };
  const crossed = plates.filter((p) => Math.min(input.x + w, p.right) - Math.max(input.x, p.left) > 0 && Math.min(input.top + h, p.bottom) - Math.max(input.top, p.top) > 0);
  const tries: { x: number; top: number }[] = [];
  const clampX = (x: number) => Math.min(maxX, Math.max(minX, x));
  const clampTop = (t: number) => Math.min(maxTop, Math.max(minTop, t));
  for (const p of plates) {
    tries.push({ x: clampX(p.left - w - gap), top: input.top });
    tries.push({ x: clampX(p.right + gap), top: input.top });
    tries.push({ x: input.x, top: clampTop(p.top - h - gap) });
    tries.push({ x: input.x, top: clampTop(p.bottom + gap) });
  }
  let best: { x: number; top: number } | null = null;
  let bestD = Number.POSITIVE_INFINITY;
  for (const t of tries) {
    if (hits(t.x, t.top)) continue;
    const d = Math.hypot(t.x - input.x, t.top - input.top);
    if (d < bestD) {
      best = t;
      bestD = d;
    }
  }
  if (best) return best;
  const low = Math.max(...crossed.map((p) => p.bottom));
  return { x: input.x, top: clampTop(low + gap) };
}
