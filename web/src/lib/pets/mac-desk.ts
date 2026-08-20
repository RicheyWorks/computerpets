/** How the extra sits. Mac opens the menu. Linux opens the mark. Windows toggles the window. */

export const TAP_PX = 8;
export const TAP_PX_MAC = 12;
export const TAP_PX_LINUX = 10;

export const CARE_VERBS = [
  "Feed",
  "Treat",
  "Play",
  "Rest",
  "Talk",
  "Hide",
  "Call back",
  "Clean",
  "Bath",
  "Medicine",
  "Praise",
  "Special",
  "Shed",
] as const;

export function isMac(platform: string | undefined | null): boolean {
  return platform === "darwin" || /^Mac/i.test(platform || "");
}

export function isLinux(platform: string | undefined | null): boolean {
  return platform === "linux" || /^Linux/i.test(platform || "");
}

/** A click on the Mac extra or the Linux mark opens care. A click on the Windows tray toggles the window. */
export function extraClick(platform: string): "menu" | "toggle" {
  return isMac(platform) || isLinux(platform) ? "menu" : "toggle";
}

/** A Mac trackpad jitters. A Linux pad jitters less. The tap is still a tap. */
export function tapPxFor(platform: string | undefined | null): number {
  if (isMac(platform)) return TAP_PX_MAC;
  if (isLinux(platform)) return TAP_PX_LINUX;
  return TAP_PX;
}

/** First click on a Mac or a Linux desk is a sit, not a focus. */
export function firstClick(platform: string): "accept" | "focus" {
  return isMac(platform) || isLinux(platform) ? "accept" : "focus";
}

/** They walk every Space. They walk every workspace. */
export function spacesWalk(platform: string): boolean {
  return isMac(platform) || isLinux(platform);
}

export function extraIconTemplate(platform: string): boolean {
  return isMac(platform);
}

export function appMenu(platform: string): boolean {
  return isMac(platform);
}

/** The Mac and Linux floors follow the desk under the cursor. Windows stays the primary blotter. */
export function followCursorDisplay(platform: string): boolean {
  return isMac(platform) || isLinux(platform);
}

export type OverlayChrome = {
  type: "panel" | "toolbar" | null;
  acceptFirstMouse: boolean;
  hiddenInMissionControl: boolean;
  hideDock: boolean;
  focusable: boolean;
};

export function overlayChrome(platform: string): OverlayChrome {
  if (isMac(platform)) {
    return {
      type: "panel",
      acceptFirstMouse: true,
      hiddenInMissionControl: true,
      hideDock: true,
      focusable: true,
    };
  }
  if (isLinux(platform)) {
    return {
      type: "toolbar",
      acceptFirstMouse: true,
      hiddenInMissionControl: false,
      hideDock: false,
      focusable: false,
    };
  }
  return {
    type: null,
    acceptFirstMouse: false,
    hiddenInMissionControl: false,
    hideDock: false,
    focusable: true,
  };
}

/** Mutter and KWin do not forward a hover through an ignored floor. The mark watches the cursor. */
export function hitForward(platform: string): boolean {
  return isLinux(platform);
}

export function cursorHits(
  point: { x: number; y: number } | null | undefined,
  rects: Array<{ x: number; y: number; width: number; height: number } | null | undefined> | null | undefined,
): boolean {
  if (!point || !Array.isArray(rects)) return false;
  return rects.some((r) => {
    if (!r) return false;
    const w = Number(r.width) || 0;
    const h = Number(r.height) || 0;
    if (w < 2 || h < 2) return false;
    return point.x >= r.x && point.x < r.x + w && point.y >= r.y && point.y < r.y + h;
  });
}

export function sameArea(
  a: { x: number; y: number; width: number; height: number } | null | undefined,
  b: { x: number; y: number; width: number; height: number } | null | undefined,
): boolean {
  return !!(a && b && a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height);
}

export function hideWindowLabel(): string {
  return "Hide the window";
}

export function careVerbs(): string[] {
  return [...CARE_VERBS];
}

/** Control-click and a right button tend. They do not start a carry. */
export function carePointer(e: { button?: number; ctrlKey?: boolean } | null | undefined): boolean {
  return !!(e && (e.button === 2 || e.ctrlKey));
}
