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
