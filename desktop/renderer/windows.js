/** Visible top-level window bounds. Rects only — never pixels, titles, or paths.
 * Field 9 of a live enum line is a shell bit. A legacy class token can still set
 * that bit and is not stored. The live enumerator does not copy a window class.
 * Extra columns are not titles and are not kept.
 */
(function (root) {
  const TASKBAR_CLASS = {
    Shell_TrayWnd: 1,
    Shell_SecondaryTrayWnd: 1,
    NotifyIconOverflowWindow: 1,
    Progman: 1,
    WorkerW: 1,
  };

  const MIN_W = 80;
  const MIN_H = 80;
  /** The Mac list is Accessibility. This door is closed. Do not invent rects. */
  const LATER_DOOR = null;
  /** Dock, WindowServer, menu bar, Control Center. Not written on the pipe. */
  const MAC_SHELL_BUNDLES = [
    "com.apple.dock",
    "com.apple.WindowServer",
    "com.apple.SystemUIServer",
    "com.apple.controlcenter",
  ];
  /** Floating, dialog, and unknown subroles are tool windows. A standard window is not. */
  const MAC_TOOL_SUBROLES = [
    "AXFloatingWindow",
    "AXSystemFloatingWindow",
    "AXDialog",
    "AXSystemDialog",
    "AXUnknown",
  ];
  /** Notification Center is a tool even when the subrole is blank. */
  const MAC_TOOL_BUNDLES = ["com.apple.notificationcenterui"];

  function isWindows(platform) {
    return platform === "win32" || /^Win/i.test(String(platform || ""));
  }

  function isLinux(platform) {
    return platform === "linux" || /^Linux/i.test(String(platform || ""));
  }

  function isMac(platform) {
    return platform === "darwin" || /^Mac/i.test(String(platform || ""));
  }

  function enumeratesOn(platform) {
    return isWindows(platform) || isLinux(platform) || isMac(platform);
  }

  /** Windows, Linux X11, and Mac Accessibility enumerate. Other hosts do not invent rects. */
  function laterDoor(platform) {
    return enumeratesOn(platform) ? null : null;
  }

  /**
   * Electron on Mac reports `window:<CGWindowID>:<webContents>`.
   * The view pointer from getNativeWindowHandle is not this id.
   * A window that is not on screen yet is `window:-1` and is refused.
   */
  function cgWindowIdFromMediaSource(id) {
    const matched = /^window:(\d+):\d+$/.exec(String(id || "").trim());
    if (!matched || matched[1] === "0") return "";
    return matched[1];
  }

  function listed(arr, item) {
    return arr.indexOf(item) >= 0;
  }

  /** Same bits the Accessibility helper emits. A bundle id is not stored on the row. */
  function macWindowBits(subrole, bundle, minimized, appHidden) {
    const shell = listed(MAC_SHELL_BUNDLES, String(bundle || ""));
    const tool =
      !shell &&
      (listed(MAC_TOOL_SUBROLES, String(subrole || "")) || listed(MAC_TOOL_BUNDLES, String(bundle || "")));
    return {
      minimized: !!minimized,
      tool,
      cloaked: !!appHidden,
      shell,
    };
  }

  function parseEnumText(text) {
    const rows = [];
    for (const line of String(text || "").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === "END") continue;
      const p = trimmed.split("\t");
      if (p.length < 9) continue;
      const left = Number(p[1]);
      const top = Number(p[2]);
      const right = Number(p[3]);
      const bottom = Number(p[4]);
      if (![left, top, right, bottom].every(Number.isFinite)) continue;
      const token = p[8];
      const shell = token === "1" || Boolean(TASKBAR_CLASS[token]);
      rows.push({
        id: String(p[0]),
        left,
        top,
        right,
        bottom,
        minimized: p[5] === "1",
        tool: p[6] === "1",
        cloaked: p[7] === "1",
        shell,
      });
    }
    return rows;
  }

  function hwndFromHandle(buf) {
    if (!buf || typeof buf.length !== "number" || buf.length < 4) return "";
    try {
      if (typeof buf.readBigUInt64LE === "function" && buf.length >= 8) {
        return buf.readBigUInt64LE(0).toString();
      }
      if (typeof buf.readUInt32LE === "function") return String(buf.readUInt32LE(0));
    } catch {
      /* ignore */
    }
    return "";
  }

  function sameish(a, b) {
    if (!a || !b) return false;
    return (
      Math.abs(a.x - b.x) < 2 &&
      Math.abs(a.y - b.y) < 2 &&
      Math.abs(a.width - b.width) < 2 &&
      Math.abs(a.height - b.height) < 2
    );
  }

  function rowBox(row, scale, work) {
    const s = scale > 0 ? scale : 1;
    if (row == null) return null;
    let left;
    let top;
    let width;
    let height;
    if (row.width != null && row.height != null && (row.x != null || row.left != null)) {
      left = Number(row.left != null ? row.left : row.x);
      top = Number(row.top != null ? row.top : row.y);
      width = Number(row.width);
      height = Number(row.height);
    } else {
      left = Number(row.left);
      top = Number(row.top);
      width = Number(row.right) - left;
      height = Number(row.bottom) - top;
    }
    if (![left, top, width, height].every(Number.isFinite)) return null;
    return {
      x: left / s - work.x,
      y: top / s - work.y,
      width: width / s,
      height: height / s,
    };
  }

  /**
   * Work-area DIP rects. Skip the overlay itself, minimized, cloaked,
   * tool windows, the taskbar / desktop host, and tiny junk.
   */
  function takeRects(raw, opts) {
    const work = opts && opts.workArea
      ? opts.workArea
      : { x: 0, y: 0, width: 1920, height: 1080 };
    const scale = opts && Number(opts.scaleFactor) > 0 ? Number(opts.scaleFactor) : 1;
    const skip = new Set(((opts && opts.skipIds) || []).map(String).filter(Boolean));
    const overlay = opts && opts.overlayBounds;
    const list = Array.isArray(raw) ? raw : [];
    const out = [];
    for (const row of list) {
      if (!row) continue;
      const id = String(row.id != null ? row.id : row.hwnd != null ? row.hwnd : "");
      if (!id || skip.has(id)) continue;
      if (row.minimized || row.iconic) continue;
      if (row.tool || row.toolWindow) continue;
      if (row.cloaked) continue;
      if (row.shell) continue;
      const cls = String(row.className || row.class || "");
      if (TASKBAR_CLASS[cls]) continue;
      const box = rowBox(row, scale, work);
      if (!box) continue;
      if (box.width < MIN_W || box.height < MIN_H) continue;
      if (overlay && sameish(box, overlay)) continue;
      if (box.x + box.width < 0 || box.y + box.height < 0) continue;
      if (box.x > work.width || box.y > work.height) continue;
      out.push({ id, x: box.x, y: box.y, width: box.width, height: box.height });
    }
    return out;
  }

  const api = {
    TASKBAR_CLASS,
    MIN_W,
    MIN_H,
    LATER_DOOR,
    MAC_SHELL_BUNDLES,
    MAC_TOOL_SUBROLES,
    MAC_TOOL_BUNDLES,
    isWindows,
    isLinux,
    isMac,
    enumeratesOn,
    laterDoor,
    cgWindowIdFromMediaSource,
    macWindowBits,
    parseEnumText,
    hwndFromHandle,
    takeRects,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetWindows = api;
})(typeof window !== "undefined" ? window : globalThis);
