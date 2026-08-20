/** How the extra sits. Mac opens the menu. Windows toggles the window. */
(function (root) {
  const TAP_PX = 8;
  const TAP_PX_MAC = 12;

  const CARE_VERBS = [
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
  ];

  function isMac(platform) {
    return platform === "darwin" || /^Mac/i.test(String(platform || ""));
  }

  /** A click on the Mac extra opens care. A click on the Windows tray toggles the window. */
  function extraClick(platform) {
    return isMac(platform) ? "menu" : "toggle";
  }

  /** A Mac trackpad jitters. The tap is still a tap. */
  function tapPx(platform) {
    return isMac(platform) ? TAP_PX_MAC : TAP_PX;
  }

  /** First click on a Mac is a sit, not a focus. */
  function firstClick(platform) {
    return isMac(platform) ? "accept" : "focus";
  }

  /** They walk every Space. Mission Control does not keep a card. */
  function spacesWalk(platform) {
    return isMac(platform);
  }

  function extraIconTemplate(platform) {
    return isMac(platform);
  }

  function appMenu(platform) {
    return isMac(platform);
  }

  /** The Mac floor follows the desk under the cursor. Windows stays the primary blotter. */
  function followCursorDisplay(platform) {
    return isMac(platform);
  }

  function overlayChrome(platform) {
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

  function hideWindowLabel() {
    return "Hide the window";
  }

  function careVerbs() {
    return CARE_VERBS.slice();
  }

  /** Control-click and a right button tend. They do not start a carry. */
  function carePointer(e) {
    return !!(e && (e.button === 2 || e.ctrlKey));
  }

  const api = {
    TAP_PX,
    TAP_PX_MAC,
    isMac,
    extraClick,
    tapPx,
    firstClick,
    spacesWalk,
    extraIconTemplate,
    appMenu,
    followCursorDisplay,
    overlayChrome,
    hideWindowLabel,
    careVerbs,
    carePointer,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetDesk = api;
})(typeof window !== "undefined" ? window : globalThis);
