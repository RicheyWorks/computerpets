/** How the extra sits. Mac opens the menu. Linux opens the mark. Windows toggles the window. */
(function (root) {
  const TAP_PX = 8;
  const TAP_PX_MAC = 12;
  const TAP_PX_LINUX = 10;

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

  function isLinux(platform) {
    return platform === "linux" || /^Linux/i.test(String(platform || ""));
  }

  /** A click on the Mac extra or the Linux mark opens care. A click on the Windows tray toggles the window. */
  function extraClick(platform) {
    return isMac(platform) || isLinux(platform) ? "menu" : "toggle";
  }

  /** A Mac trackpad jitters. A Linux pad jitters less. The tap is still a tap. */
  function tapPx(platform) {
    if (isMac(platform)) return TAP_PX_MAC;
    if (isLinux(platform)) return TAP_PX_LINUX;
    return TAP_PX;
  }

  /** First click on a Mac or a Linux desk is a sit, not a focus. */
  function firstClick(platform) {
    return isMac(platform) || isLinux(platform) ? "accept" : "focus";
  }

  /** They walk every Space. They walk every workspace. */
  function spacesWalk(platform) {
    return isMac(platform) || isLinux(platform);
  }

  function extraIconTemplate(platform) {
    return isMac(platform);
  }

  function appMenu(platform) {
    return isMac(platform);
  }

  /** The Mac and Linux floors follow the desk under the cursor. Windows stays the primary blotter. */
  function followCursorDisplay(platform) {
    return isMac(platform) || isLinux(platform);
  }

  function overlayChrome(platform) {
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
  function hitForward(platform) {
    return isLinux(platform);
  }

  function cursorHits(point, rects) {
    if (!point || !Array.isArray(rects)) return false;
    return rects.some((r) => {
      if (!r) return false;
      const w = Number(r.width) || 0;
      const h = Number(r.height) || 0;
      if (w < 2 || h < 2) return false;
      return point.x >= r.x && point.x < r.x + w && point.y >= r.y && point.y < r.y + h;
    });
  }

  function sameArea(a, b) {
    return !!(
      a &&
      b &&
      a.x === b.x &&
      a.y === b.y &&
      a.width === b.width &&
      a.height === b.height
    );
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
    TAP_PX_LINUX,
    isMac,
    isLinux,
    extraClick,
    tapPx,
    firstClick,
    spacesWalk,
    extraIconTemplate,
    appMenu,
    followCursorDisplay,
    overlayChrome,
    hitForward,
    cursorHits,
    sameArea,
    hideWindowLabel,
    careVerbs,
    carePointer,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetDesk = api;
})(typeof window !== "undefined" ? window : globalThis);
