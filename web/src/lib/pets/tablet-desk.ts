/** How the sit sits. A tablet has no extra and no mark. A tap talks. A drag is a carry. A long-press tends. */

export const TAP_PX = 8;
export const TAP_PX_MAC = 12;
export const TAP_PX_LINUX = 10;
export const TAP_PX_TABLET = 24;
export const HOLD_MS = 480;

/** Short side of a tablet. A phone is smaller. Phone waits. */
export const TABLET_SHORT_PX = 600;

export type TabletSit = {
  platform?: string | null;
  userAgent?: string | null;
  pointer?: string | null;
  hover?: string | null;
  maxTouchPoints?: number;
  width?: number;
  height?: number;
};

export type TabletSafe = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type TabletOrient = "blotter" | "sit";

export type TabletLift = "tend" | "tap" | "place";

function textOf(value: string | null | undefined): string {
  return String(value || "");
}

function shortSide(sit: TabletSit | null | undefined): number {
  const w = Number(sit?.width) || 0;
  const h = Number(sit?.height) || 0;
  if (w <= 0 || h <= 0) return 0;
  return Math.min(w, h);
}

function longSide(sit: TabletSit | null | undefined): number {
  const w = Number(sit?.width) || 0;
  const h = Number(sit?.height) || 0;
  return Math.max(w, h);
}

function coarseSit(sit: TabletSit | null | undefined): boolean {
  return sit?.pointer === "coarse" || sit?.hover === "none" || (sit?.maxTouchPoints ?? 0) > 1;
}

/**
 * A phone-shaped sit. Phone waits. The tablet leftover does not teach a phone.
 */
export function isPhone(sit: TabletSit | string | null | undefined): boolean {
  if (sit == null) return false;
  if (typeof sit === "string") {
    return /iPhone|iPod/i.test(sit);
  }
  const platform = textOf(sit.platform);
  const ua = textOf(sit.userAgent);
  if (/iPhone|iPod/i.test(platform) || /iPhone|iPod/i.test(ua)) return true;
  if (/Android/i.test(ua) && /Mobile/i.test(ua) && shortSide(sit) < TABLET_SHORT_PX) return true;
  const short = shortSide(sit);
  const long = longSide(sit);
  if (coarseSit(sit) && short > 0 && short < TABLET_SHORT_PX && long > 0 && long < 960) return true;
  return false;
}

/**
 * A tablet sit. iPad. A large Android. A coarse finger on a wide blotter.
 * Macintosh with many touches is an iPad that lied. A mouse Mac is still a Mac.
 * A phone is not a tablet.
 */
export function isTablet(sit: TabletSit | string | null | undefined): boolean {
  if (sit == null) return false;
  if (typeof sit === "string") {
    return /^iPad/i.test(sit) || /Tablet/i.test(sit);
  }
  if (isPhone(sit)) return false;
  const platform = textOf(sit.platform);
  const ua = textOf(sit.userAgent);
  if (/iPad/i.test(platform) || /iPad/i.test(ua)) return true;
  if (/Macintosh/i.test(platform) && (sit.maxTouchPoints ?? 0) > 1) return true;
  if (/Android/i.test(ua) && !/Mobile/i.test(ua)) return true;
  const short = shortSide(sit);
  const long = longSide(sit);
  if (coarseSit(sit) && short >= TABLET_SHORT_PX && long >= 900) return true;
  return false;
}

/** The house tap slop. A finger needs more wood than a mouse. The desks keep their own. */
export function tapPxFor(platform: string | undefined | null, sit?: TabletSit | null): number {
  if (isTablet(sit ?? platform)) return TAP_PX_TABLET;
  if (platform === "darwin" || /^Mac/i.test(platform || "")) return TAP_PX_MAC;
  if (platform === "linux" || /^Linux/i.test(platform || "")) return TAP_PX_LINUX;
  return TAP_PX;
}

/** Landscape is the blotter. Portrait is a sit. */
export function tabletOrient(width: number, height: number): TabletOrient {
  return width > height ? "blotter" : "sit";
}

/** The floor sits below the notch and above the home mark. */
export function tabletSafe(insets?: Partial<TabletSafe> | null): TabletSafe & {
  floorTop: number;
  floorBottom: number;
} {
  const top = Math.max(0, Number(insets?.top) || 0);
  const right = Math.max(0, Number(insets?.right) || 0);
  const bottom = Math.max(0, Number(insets?.bottom) || 0);
  const left = Math.max(0, Number(insets?.left) || 0);
  return { top, right, bottom, left, floorTop: top, floorBottom: bottom };
}

/** Care sits in the thumb. Landscape is a rail. Portrait is a sit. */
export function thumbCare(orient: TabletOrient): { zone: "rail" | "sit"; minTarget: number } {
  return orient === "blotter" ? { zone: "rail", minTarget: 44 } : { zone: "sit", minTarget: 48 };
}

/** A tablet has no hover. The guest does not watch a cursor that is not there. */
export function followHover(sit: TabletSit | string | null | undefined): boolean {
  return !isTablet(sit);
}

/** A tablet has no extra and no mark. The sit is the chrome. */
export function overlayChrome(sit: TabletSit | string | null | undefined): {
  type: "sit" | null;
  hover: boolean;
  extra: boolean;
  mark: boolean;
} {
  if (!isTablet(sit)) {
    return { type: null, hover: true, extra: false, mark: false };
  }
  return { type: "sit", hover: false, extra: false, mark: false };
}

/** A tap on the sit opens care. There is no tray toggle and no menu-bar extra. */
export function sitClick(sit: TabletSit | string | null | undefined): "care" | "none" {
  return isTablet(sit) ? "care" : "none";
}

/**
 * A long still finger tends. A short still finger talks. A long move is a carry.
 * Neither is walking in.
 */
export function tabletLift(
  heldMs: number,
  dx: number,
  dy: number,
  tapPx = TAP_PX_TABLET,
  holdMs = HOLD_MS,
): TabletLift {
  const moved = Math.hypot(dx, dy) >= tapPx;
  if (!moved && heldMs >= holdMs) return "tend";
  if (!moved) return "tap";
  return "place";
}

/** A hold that has not wandered is a tend. A wander cancels the hold. */
export function careHold(heldMs: number, slopMoved: boolean, holdMs = HOLD_MS): boolean {
  return !slopMoved && heldMs >= holdMs;
}

export function readSit(win?: {
  navigator?: { platform?: string; userAgent?: string; maxTouchPoints?: number };
  matchMedia?: (query: string) => { matches: boolean };
  innerWidth?: number;
  innerHeight?: number;
} | null): TabletSit {
  const nav = win?.navigator;
  const hover = win?.matchMedia?.("(hover: hover)").matches
    ? "hover"
    : win?.matchMedia?.("(hover: none)").matches
      ? "none"
      : undefined;
  const pointer = win?.matchMedia?.("(pointer: coarse)").matches
    ? "coarse"
    : win?.matchMedia?.("(pointer: fine)").matches
      ? "fine"
      : undefined;
  return {
    platform: nav?.platform,
    userAgent: nav?.userAgent,
    pointer,
    hover,
    maxTouchPoints: nav?.maxTouchPoints,
    width: win?.innerWidth,
    height: win?.innerHeight,
  };
}
