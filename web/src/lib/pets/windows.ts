/** Visible top-level window bounds. Rects only — never pixels, titles, or paths. Same map as desktop `windows.js`.
 * Field 9 of a live enum line is a shell bit. A legacy class token can still set
 * that bit and is not stored. The live enumerator does not copy a window class.
 * Extra columns are not titles and are not kept.
 */

export const TASKBAR_CLASS: Record<string, number> = {
  Shell_TrayWnd: 1,
  Shell_SecondaryTrayWnd: 1,
  NotifyIconOverflowWindow: 1,
  Progman: 1,
  WorkerW: 1,
};

export const MIN_W = 80;
export const MIN_H = 80;
/** The Mac list is Accessibility. This door is closed. Do not invent rects. */
export const LATER_DOOR = null;
/** Dock, WindowServer, menu bar, Control Center. Not written on the pipe. */
export const MAC_SHELL_BUNDLES = [
  "com.apple.dock",
  "com.apple.WindowServer",
  "com.apple.SystemUIServer",
  "com.apple.controlcenter",
];
/** Floating, dialog, and unknown subroles are tool windows. A standard window is not. */
export const MAC_TOOL_SUBROLES = [
  "AXFloatingWindow",
  "AXSystemFloatingWindow",
  "AXDialog",
  "AXSystemDialog",
  "AXUnknown",
];
/** Notification Center is a tool even when the subrole is blank. */
export const MAC_TOOL_BUNDLES = ["com.apple.notificationcenterui"];

export type RawWindow = {
  id?: string;
  hwnd?: string;
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  minimized?: boolean;
  iconic?: boolean;
  tool?: boolean;
  toolWindow?: boolean;
  cloaked?: boolean;
  /** Shell bit from the enumerator. A class string is not stored. */
  shell?: boolean;
  className?: string;
  class?: string;
};

export type DeskWindow = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type WorkArea = { x: number; y: number; width: number; height: number };

export function isWindows(platform: string | undefined) {
  return platform === "win32" || /^Win/i.test(String(platform || ""));
}

export function isLinux(platform: string | undefined) {
  return platform === "linux" || /^Linux/i.test(String(platform || ""));
}

export function isMac(platform: string | undefined) {
  return platform === "darwin" || /^Mac/i.test(String(platform || ""));
}

export function enumeratesOn(platform: string | undefined) {
  return isWindows(platform) || isLinux(platform) || isMac(platform);
}

/** Windows, Linux X11, and Mac Accessibility enumerate. Other hosts do not invent rects. */
export function laterDoor(platform: string | undefined) {
  return enumeratesOn(platform) ? null : null;
}

/**
 * Electron on Mac reports `window:<CGWindowID>:<webContents>`.
 * The view pointer from getNativeWindowHandle is not this id.
 * A window that is not on screen yet is `window:-1` and is refused.
 */
export function cgWindowIdFromMediaSource(id: string | undefined) {
  const matched = /^window:(\d+):\d+$/.exec(String(id || "").trim());
  if (!matched || matched[1] === "0") return "";
  return matched[1];
}

function listed(arr: readonly string[], item: string) {
  return arr.indexOf(item) >= 0;
}

/** Same bits the Accessibility helper emits. A bundle id is not stored on the row. */
export function macWindowBits(
  subrole: string | undefined,
  bundle: string | undefined,
  minimized: boolean | undefined,
  appHidden: boolean | undefined,
) {
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

export function parseEnumText(text: string | undefined) {
  const rows: RawWindow[] = [];
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

export function hwndFromHandle(buf: { length: number; readBigUInt64LE?: (n: number) => bigint; readUInt32LE?: (n: number) => number } | null | undefined) {
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

function sameish(a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }) {
  return (
    Math.abs(a.x - b.x) < 2 &&
    Math.abs(a.y - b.y) < 2 &&
    Math.abs(a.width - b.width) < 2 &&
    Math.abs(a.height - b.height) < 2
  );
}

function rowBox(row: RawWindow, scale: number, work: WorkArea) {
  const s = scale > 0 ? scale : 1;
  let left: number;
  let top: number;
  let width: number;
  let height: number;
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

export function takeRects(
  raw: RawWindow[] | undefined,
  opts?: {
    workArea?: WorkArea;
    scaleFactor?: number;
    skipIds?: Array<string | number>;
    overlayBounds?: { x: number; y: number; width: number; height: number };
  },
) {
  const work = opts?.workArea ?? { x: 0, y: 0, width: 1920, height: 1080 };
  const scale = opts && Number(opts.scaleFactor) > 0 ? Number(opts.scaleFactor) : 1;
  const skip = new Set((opts?.skipIds || []).map(String).filter(Boolean));
  const overlay = opts?.overlayBounds;
  const list = Array.isArray(raw) ? raw : [];
  const out: DeskWindow[] = [];
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

export const DEMO_WINDOW_ID = "demo-window";
export const DEMO_WINDOW_B_ID = "demo-window-b";

/** Same windows, same order, to the half pixel. */
export function sameWindows(a: DeskWindow[], b: DeskWindow[]) {
  if (a.length !== b.length) return false;
  return a.every((w, i) => {
    const o = b[i];
    return (
      w.id === o.id &&
      Math.abs(w.x - o.x) < 0.5 &&
      Math.abs(w.y - o.y) < 0.5 &&
      Math.abs(w.width - o.width) < 0.5 &&
      Math.abs(w.height - o.height) < 0.5
    );
  });
}

/**
 * Swap one /demo plate's windows (by id) into the list and keep the rest. Hands back `prev` itself when
 * nothing moved, so a plate that reports on every render cannot set state again and loop
 * ("Maximum update depth exceeded" on /demo phones, found in the kennel-first pass).
 */
export function swapWindows(prev: DeskWindow[], ids: string[], next: DeskWindow[], first = false): DeskWindow[] {
  const others = prev.filter((w) => !ids.includes(w.id));
  const out = first ? [...next, ...others] : [...others, ...next];
  return sameWindows(prev, out) ? prev : out;
}

export function demoWindowPlate(stage: { width: number; height: number }): DeskWindow {
  const width = Math.min(stage.width * 0.46, 420);
  const height = stage.height * 0.42;
  return {
    id: DEMO_WINDOW_ID,
    x: stage.width * 0.42,
    y: stage.height * 0.16,
    width,
    height,
  };
}

export function demoWindowPlates(stage: { width: number; height: number }): DeskWindow[] {
  return [
    demoWindowPlate(stage),
    {
      id: DEMO_WINDOW_B_ID,
      x: stage.width * 0.08,
      y: stage.height * 0.32,
      width: Math.min(stage.width * 0.34, 320),
      height: stage.height * 0.36,
    },
  ];
}
