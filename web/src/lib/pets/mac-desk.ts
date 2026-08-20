/** How the extra sits. Mac opens the menu. Windows toggles the window. */

export const TAP_PX = 8;
export const TAP_PX_MAC = 12;

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

/** A click on the Mac extra opens care. A click on the Windows tray toggles the window. */
export function extraClick(platform: string): "menu" | "toggle" {
  return isMac(platform) ? "menu" : "toggle";
}

/** A Mac trackpad jitters. The tap is still a tap. */
export function tapPxFor(platform: string | undefined | null): number {
  return isMac(platform) ? TAP_PX_MAC : TAP_PX;
}

/** First click on a Mac is a sit, not a focus. */
export function firstClick(platform: string): "accept" | "focus" {
  return isMac(platform) ? "accept" : "focus";
}

/** They walk every Space. Mission Control does not keep a card. */
export function spacesWalk(platform: string): boolean {
  return isMac(platform);
}

export function extraIconTemplate(platform: string): boolean {
  return isMac(platform);
}

export function appMenu(platform: string): boolean {
  return isMac(platform);
}

/** The Mac floor follows the desk under the cursor. Windows stays the primary blotter. */
export function followCursorDisplay(platform: string): boolean {
  return isMac(platform);
}

export type OverlayChrome = {
  type: "panel" | null;
  acceptFirstMouse: boolean;
  hiddenInMissionControl: boolean;
  hideDock: boolean;
};

export function overlayChrome(platform: string): OverlayChrome {
  if (!isMac(platform)) {
    return {
      type: null,
      acceptFirstMouse: false,
      hiddenInMissionControl: false,
      hideDock: false,
    };
  }
  return {
    type: "panel",
    acceptFirstMouse: true,
    hiddenInMissionControl: true,
    hideDock: true,
  };
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
