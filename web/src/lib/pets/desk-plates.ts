/** Weather, News, Quotes desk plates. Drag by the header bar, recolor from the body. Same map as desktop desk-plates.js. */

export const STORE = "computerpets.desktop.plates.v1";
export const PLATE_KEYS = ["weather", "news", "market"] as const;
export const PLATE_NAMES: Record<string, string> = { weather: "Weather", news: "News", market: "Quotes" };
export const CLICK_PX = 8;
export const PLATE_W = 288;
export const PLATE_H = 44;

export const DEFAULT_COLORS = {
  bg: "#161412",
  fg: "#f2ece3",
  muted: "#9a9288",
};

export const SWATCHES = [
  { id: "charcoal", name: "Charcoal", bg: "#161412", fg: "#f2ece3", muted: "#9a9288" },
  { id: "ink", name: "Ink", bg: "#0c0b0a", fg: "#f2ece3", muted: "#9a9288" },
  { id: "blotter", name: "Blotter", bg: "#2a2621", fg: "#f2ece3", muted: "#c4b8a8" },
  { id: "moss", name: "Moss", bg: "#1a2a1c", fg: "#e8f0e4", muted: "#8aaa80" },
  { id: "ember", name: "Ember", bg: "#2a1814", fg: "#f5e6d8", muted: "#c49070" },
  { id: "dusk", name: "Dusk", bg: "#1a1828", fg: "#e8e4f2", muted: "#9088aa" },
  { id: "frost", name: "Frost", bg: "#1a2228", fg: "#e4eef2", muted: "#88a0aa" },
] as const;

export type PlateKey = (typeof PLATE_KEYS)[number];
export type DeskPlate = {
  key: PlateKey;
  name: string;
  x: number;
  y: number;
  bg: string;
  fg: string;
  muted: string;
  dragging: boolean;
  dragDx?: number;
  dragDy?: number;
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export function isPlateKey(key: string | undefined): key is PlateKey {
  return !!key && (PLATE_KEYS as readonly string[]).indexOf(key) >= 0;
}

export function isHexColor(v: unknown): v is string {
  return typeof v === "string" && /^#[0-9a-fA-F]{6}$/.test(v.trim());
}

export function normalizeHex(v: unknown, fallback: string) {
  if (!isHexColor(v)) return fallback;
  return v.trim().toLowerCase();
}

/** Room chrome a first-time plate keeps clear of, in px from each edge (the web room's panel, rail and header). */
export type KeepOff = { left?: number; right?: number; top?: number };

/** The gap between a plate and the room chrome it keeps off, and between two stacked plates. */
export const KEEP_GAP = 16;

/**
 * Where a plate sits before anyone moves it. With keepOff (the web /demo room: its panel on the left, its rail on
 * the right, the site header on top) the plates start in the free middle of the room: the weather plate sat on the
 * panel's small label and the guest's name at 1024 to 1920 px wide, and Quotes behind the species plaque. Without
 * keepOff (the desktop overlay, a bare screen) the spots are the same as ever.
 */
export function defaultSpot(key: PlateKey, width: number, height: number, keepOff?: KeepOff | null): DeskPlate {
  const w = Math.max(320, width || 800);
  const h = Math.max(240, height || 480);
  const spots: Record<PlateKey, { x: number; y: number }> = {
    weather: { x: clamp(w * 0.04, 8, w - PLATE_W - 8), y: clamp(h * 0.08, 8, h - PLATE_H - 8) },
    news: { x: clamp(w - PLATE_W - w * 0.08, 8, w - PLATE_W - 8), y: clamp(h * 0.08, 8, h - PLATE_H - 8) },
    market: { x: clamp(w * 0.04, 8, w - PLATE_W - 8), y: clamp(h * 0.38, 8, h - PLATE_H - 8) },
  };
  if (keepOff) {
    const left = Math.max(0, Number(keepOff.left) || 0);
    const right = Math.max(0, Number(keepOff.right) || 0);
    const top = Math.max(0, Number(keepOff.top) || 0);
    const xMax = w - PLATE_W - 8;
    const yMax = h - PLATE_H - 8;
    for (const k of ["weather", "market"] as const) spots[k].x = clamp(Math.max(spots[k].x, left + KEEP_GAP), 8, xMax);
    spots.news.x = clamp(Math.min(spots.news.x, w - right - PLATE_W - KEEP_GAP), 8, xMax);
    for (const k of PLATE_KEYS) spots[k].y = clamp(Math.max(spots[k].y, top + KEEP_GAP / 2), 8, yMax);
    // A narrow room: news under the weather plate instead of on top of it.
    if (spots.news.x < spots.weather.x + PLATE_W + KEEP_GAP) spots.news.y = clamp(spots.weather.y + PLATE_H + KEEP_GAP / 2, 8, yMax);
  }
  const spot = spots[key] || spots.weather;
  return {
    key,
    name: PLATE_NAMES[key] || key,
    x: spot.x,
    y: spot.y,
    bg: DEFAULT_COLORS.bg,
    fg: DEFAULT_COLORS.fg,
    muted: DEFAULT_COLORS.muted,
    dragging: false,
  };
}

export function parsePlate(
  raw: { key?: string; x?: number; y?: number; bg?: string; fg?: string; muted?: string } | null | undefined,
  width: number,
  height: number,
  keyHint?: string,
  keepOff?: KeepOff | null,
): DeskPlate {
  const key = raw && isPlateKey(raw.key) ? raw.key : isPlateKey(keyHint) ? keyHint : PLATE_KEYS[0];
  const spot = defaultSpot(key, width, height, keepOff);
  if (!raw || typeof raw !== "object") return spot;
  if (Number.isFinite(Number(raw.x))) spot.x = clamp(Number(raw.x), 8, Math.max(8, (width || 800) - 40));
  if (Number.isFinite(Number(raw.y))) spot.y = clamp(Number(raw.y), 8, Math.max(8, (height || 480) - 40));
  spot.bg = normalizeHex(raw.bg, spot.bg);
  spot.fg = normalizeHex(raw.fg, spot.fg);
  spot.muted = normalizeHex(raw.muted, spot.muted);
  return spot;
}

export function loadPlates(
  width: number,
  height: number,
  storage?: { getItem: (k: string) => string | null } | null,
  keepOff?: KeepOff | null,
) {
  const store = storage || (typeof localStorage !== "undefined" ? localStorage : null);
  let raw: unknown = null;
  try {
    raw = store && store.getItem ? JSON.parse(store.getItem(STORE) || "null") : null;
  } catch {
    raw = null;
  }
  const list = Array.isArray(raw) ? raw : [];
  return PLATE_KEYS.map((key) => parsePlate(list.find((p: { key?: string }) => p && p.key === key) || { key }, width, height, key, keepOff));
}

export function savePlates(plates: DeskPlate[], storage?: { setItem: (k: string, v: string) => void } | null) {
  const store = storage || (typeof localStorage !== "undefined" ? localStorage : null);
  if (!store || !store.setItem) return plates;
  const rows = (Array.isArray(plates) ? plates : []).map((p) => ({
    key: p.key,
    x: p.x,
    y: p.y,
    bg: normalizeHex(p.bg, DEFAULT_COLORS.bg),
    fg: normalizeHex(p.fg, DEFAULT_COLORS.fg),
    muted: normalizeHex(p.muted, DEFAULT_COLORS.muted),
  }));
  try {
    store.setItem(STORE, JSON.stringify(rows));
  } catch {
    /* ignore */
  }
  return plates;
}

export function beginDrag(plate: DeskPlate, pointerX: number, pointerY: number): DeskPlate {
  return {
    ...plate,
    dragging: true,
    dragDx: (pointerX || 0) - plate.x,
    dragDy: (pointerY || 0) - plate.y,
  };
}

export function moveDrag(
  plate: DeskPlate,
  pointerX: number,
  pointerY: number,
  width: number,
  height: number,
  boxW?: number,
  boxH?: number,
): DeskPlate {
  if (!plate.dragging) return plate;
  const w = Math.max(320, width || 800);
  const h = Math.max(240, height || 480);
  const bw = Math.max(48, boxW || PLATE_W);
  const bh = Math.max(28, boxH || PLATE_H);
  return {
    ...plate,
    x: clamp((pointerX || 0) - (plate.dragDx || 0), 8, Math.max(8, w - bw - 8)),
    y: clamp((pointerY || 0) - (plate.dragDy || 0), 8, Math.max(8, h - bh - 8)),
  };
}

export function endDrag(plate: DeskPlate): DeskPlate {
  return { ...plate, dragging: false };
}

export function clickMoved(dx: number, dy: number, threshold?: number) {
  const lim = threshold == null ? CLICK_PX : threshold;
  return Math.abs(dx || 0) > lim || Math.abs(dy || 0) > lim;
}

export function setColors(plate: DeskPlate, colors: { bg?: string; fg?: string; muted?: string }): DeskPlate {
  const next = { ...plate };
  if (colors.bg != null) next.bg = normalizeHex(colors.bg, next.bg);
  if (colors.fg != null) next.fg = normalizeHex(colors.fg, next.fg);
  if (colors.muted != null) next.muted = normalizeHex(colors.muted, next.muted);
  return next;
}

export function applySwatch(plate: DeskPlate, swatchId: string): DeskPlate {
  const sw = SWATCHES.find((s) => s.id === swatchId);
  if (!sw) return plate;
  return setColors(plate, { bg: sw.bg, fg: sw.fg, muted: sw.muted });
}

export function paintStyle(plate: DeskPlate) {
  return {
    left: (plate.x || 0) + "px",
    top: (plate.y || 0) + "px",
    right: "auto" as const,
    ["--plate-bg" as string]: plate.bg || DEFAULT_COLORS.bg,
    ["--plate-fg" as string]: plate.fg || DEFAULT_COLORS.fg,
    ["--plate-muted" as string]: plate.muted || DEFAULT_COLORS.muted,
  };
}

export function plateOf(plates: DeskPlate[], key: string) {
  return (Array.isArray(plates) ? plates : []).find((p) => p && p.key === key) || null;
}