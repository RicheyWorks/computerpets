/** How the extra sits. Mac opens the menu. Linux opens the mark. Windows toggles the window. */
(function (root) {
  const TAP_PX = 8;
  const TAP_PX_MAC = 12;
  const TAP_PX_LINUX = 10;

  /** Rui, Sip, and the grid ten. The tray can pick them without burying them in two hundred twenty-one. */
  const DESK_PICKS = [
    "red_panda",
    "hummingbird",
    "cyber_dragon",
    "volt_dragon",
    "trace_dragon",
    "flux_dragon",
    "spark_dragon",
    "ion_dragon",
    "gauss_dragon",
    "relay_dragon",
    "fuse_dragon",
    "ground_dragon",
  ];

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

  function isWindows(platform) {
    return platform === "win32" || /^Win/i.test(String(platform || ""));
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

  /** First click on Windows, Mac, or Linux is a sit, not a focus steal. */
  function firstClick(platform) {
    return isMac(platform) || isLinux(platform) || isWindows(platform) ? "accept" : "focus";
  }

  /** They walk every Space. They walk every workspace. Electron pins the overlay there. */
  function spacesWalk(platform) {
    return isMac(platform) || isLinux(platform);
  }

  /** Windows virtual desktops have no Electron pin. The overlay follows you instead (vdesk-win.cjs, ADR 0131). */
  function desktopFollow(platform) {
    return isWindows(platform);
  }

  function extraIconTemplate(platform) {
    return isMac(platform);
  }

  function appMenu(platform) {
    return isMac(platform);
  }

  /** The Windows, Mac, and Linux floors follow the desk under the cursor. */
  function followCursorDisplay(platform) {
    return isMac(platform) || isLinux(platform) || isWindows(platform);
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
      acceptFirstMouse: true,
      hiddenInMissionControl: false,
      hideDock: false,
      focusable: false,
    };
  }

  /**
   * DWM layered glass, Mutter, and KWin do not reliably forward a hover through
   * an ignored floor. The tray watches the cursor. This is still Chromium
   * compositing, not a DirectX 12 or Vulkan engine.
   */
  function hitForward(platform) {
    return isLinux(platform) || isWindows(platform);
  }

  function deskPicks() {
    return DESK_PICKS.slice();
  }

  function isDeskPick(key) {
    return DESK_PICKS.indexOf(key) >= 0;
  }

  function hitId(el) {
    if (!el) return "";
    if (el.id) return String(el.id);
    if (typeof el.getAttribute === "function") return String(el.getAttribute("id") || "");
    return "";
  }

  /** Hidden Rui and his choice chrome stay hittable. Empty desk stays click-through. */
  function hitAllows(el, style) {
    const id = hitId(el);
    if (id === "pet" || id === "choice") return true;
    if (el && el.dataset && (el.dataset.petHit != null || el.dataset.hit === "pet")) return true;
    if (el && typeof el.hasAttribute === "function" && (el.hasAttribute("data-pet-hit") || el.hasAttribute("data-pet"))) return true;
    if (!style) return false;
    if (style.pointerEvents === "none" || style.visibility === "hidden" || style.display === "none") return false;
    if (Number(style.opacity) === 0) return false;
    return true;
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
    DESK_PICKS,
    isMac,
    isLinux,
    isWindows,
    extraClick,
    tapPx,
    firstClick,
    spacesWalk,
    desktopFollow,
    extraIconTemplate,
    appMenu,
    followCursorDisplay,
    overlayChrome,
    hitForward,
    deskPicks,
    isDeskPick,
    cursorHits,
    hitAllows,
    sameArea,
    hideWindowLabel,
    careVerbs,
    carePointer,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetDesk = api;
})(typeof window !== "undefined" ? window : globalThis);
