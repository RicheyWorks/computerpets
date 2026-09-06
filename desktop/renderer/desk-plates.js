/** Weather, News, Quotes desk plates. Drag by the header bar, recolor from the body. Same map as web desk-plates.ts. Persist like plants. */
(function (root) {
  const STORE = "computerpets.desktop.plates.v1";
  const PLATE_KEYS = ["weather", "news", "market"];
  const PLATE_NAMES = { weather: "Weather", news: "News", market: "Quotes" };
  const CLICK_PX = 8;
  const PLATE_W = 288;
  const PLATE_H = 44;

  const DEFAULT_COLORS = {
    bg: "#161412",
    fg: "#f2ece3",
    muted: "#9a9288",
  };

  const SWATCHES = [
    { id: "charcoal", name: "Charcoal", bg: "#161412", fg: "#f2ece3", muted: "#9a9288" },
    { id: "ink", name: "Ink", bg: "#0c0b0a", fg: "#f2ece3", muted: "#9a9288" },
    { id: "blotter", name: "Blotter", bg: "#2a2621", fg: "#f2ece3", muted: "#c4b8a8" },
    { id: "moss", name: "Moss", bg: "#1a2a1c", fg: "#e8f0e4", muted: "#8aaa80" },
    { id: "ember", name: "Ember", bg: "#2a1814", fg: "#f5e6d8", muted: "#c49070" },
    { id: "dusk", name: "Dusk", bg: "#1a1828", fg: "#e8e4f2", muted: "#9088aa" },
    { id: "frost", name: "Frost", bg: "#1a2228", fg: "#e4eef2", muted: "#88a0aa" },
  ];

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function isPlateKey(key) {
    return PLATE_KEYS.indexOf(key) >= 0;
  }

  function isHexColor(v) {
    return typeof v === "string" && /^#[0-9a-fA-F]{6}$/.test(v.trim());
  }

  function normalizeHex(v, fallback) {
    if (!isHexColor(v)) return fallback;
    return v.trim().toLowerCase();
  }

  function defaultSpot(key, width, height) {
    const w = Math.max(320, width || 800);
    const h = Math.max(240, height || 480);
    const spots = {
      weather: { x: clamp(w * 0.04, 8, w - PLATE_W - 8), y: clamp(h * 0.08, 8, h - PLATE_H - 8) },
      news: { x: clamp(w - PLATE_W - w * 0.08, 8, w - PLATE_W - 8), y: clamp(h * 0.08, 8, h - PLATE_H - 8) },
      market: { x: clamp(w * 0.04, 8, w - PLATE_W - 8), y: clamp(h * 0.38, 8, h - PLATE_H - 8) },
    };
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

  function parsePlate(raw, width, height, keyHint) {
    const key = raw && isPlateKey(raw.key) ? raw.key : isPlateKey(keyHint) ? keyHint : PLATE_KEYS[0];
    const spot = defaultSpot(key, width, height);
    if (!raw || typeof raw !== "object") return spot;
    if (Number.isFinite(Number(raw.x))) spot.x = clamp(Number(raw.x), 8, Math.max(8, (width || 800) - 40));
    if (Number.isFinite(Number(raw.y))) spot.y = clamp(Number(raw.y), 8, Math.max(8, (height || 480) - 40));
    spot.bg = normalizeHex(raw.bg, spot.bg);
    spot.fg = normalizeHex(raw.fg, spot.fg);
    spot.muted = normalizeHex(raw.muted, spot.muted);
    return spot;
  }

  function loadPlates(width, height, storage) {
    const store = storage || (typeof localStorage !== "undefined" ? localStorage : null);
    let raw = null;
    try {
      raw = store && store.getItem ? JSON.parse(store.getItem(STORE) || "null") : null;
    } catch {
      raw = null;
    }
    const list = Array.isArray(raw) ? raw : [];
    return PLATE_KEYS.map((key) => parsePlate(list.find((p) => p && p.key === key) || { key }, width, height, key));
  }

  function savePlates(plates, storage) {
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

  function beginDrag(plate, pointerX, pointerY) {
    if (!plate) return plate;
    return {
      ...plate,
      dragging: true,
      dragDx: (pointerX || 0) - plate.x,
      dragDy: (pointerY || 0) - plate.y,
    };
  }

  function moveDrag(plate, pointerX, pointerY, width, height, boxW, boxH) {
    if (!plate || !plate.dragging) return plate;
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

  function endDrag(plate) {
    if (!plate) return plate;
    return { ...plate, dragging: false };
  }

  function clickMoved(dx, dy, threshold) {
    const lim = threshold == null ? CLICK_PX : threshold;
    return Math.abs(dx || 0) > lim || Math.abs(dy || 0) > lim;
  }

  function setColors(plate, colors) {
    if (!plate) return plate;
    const next = { ...plate };
    if (colors && typeof colors === "object") {
      if (colors.bg != null) next.bg = normalizeHex(colors.bg, next.bg);
      if (colors.fg != null) next.fg = normalizeHex(colors.fg, next.fg);
      if (colors.muted != null) next.muted = normalizeHex(colors.muted, next.muted);
    }
    return next;
  }

  function applySwatch(plate, swatchId) {
    const sw = SWATCHES.find((s) => s.id === swatchId);
    if (!sw || !plate) return plate;
    return setColors(plate, { bg: sw.bg, fg: sw.fg, muted: sw.muted });
  }

  function paintStyle(plate) {
    if (!plate) return {};
    return {
      left: (plate.x || 0) + "px",
      top: (plate.y || 0) + "px",
      right: "auto",
      "--plate-bg": plate.bg || DEFAULT_COLORS.bg,
      "--plate-fg": plate.fg || DEFAULT_COLORS.fg,
      "--plate-muted": plate.muted || DEFAULT_COLORS.muted,
    };
  }

  function applyPaint(el, plate) {
    if (!el || !plate) return false;
    const style = paintStyle(plate);
    el.style.left = style.left;
    el.style.top = style.top;
    el.style.right = style.right;
    el.style.setProperty("--plate-bg", style["--plate-bg"]);
    el.style.setProperty("--plate-fg", style["--plate-fg"]);
    el.style.setProperty("--plate-muted", style["--plate-muted"]);
    return true;
  }

  function plateOf(plates, key) {
    return (Array.isArray(plates) ? plates : []).find((p) => p && p.key === key) || null;
  }

  const api = {
    STORE,
    PLATE_KEYS,
    PLATE_NAMES,
    CLICK_PX,
    PLATE_W,
    PLATE_H,
    DEFAULT_COLORS,
    SWATCHES,
    isPlateKey,
    isHexColor,
    normalizeHex,
    defaultSpot,
    parsePlate,
    loadPlates,
    savePlates,
    beginDrag,
    moveDrag,
    endDrag,
    clickMoved,
    setColors,
    applySwatch,
    paintStyle,
    applyPaint,
    plateOf,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetDeskPlates = api;
})(typeof window !== "undefined" ? window : globalThis);