/** Disk the water lily and Felt the moss. Existing garden guests. Drag-place and lean in the wind. Not a new taxon. */
(function (root) {
  const STORE = "computerpets.desktop.plants.v1";
  const PLANT_KEYS = ["water_lily", "moss"];
  const PLANT_NAMES = { water_lily: "Disk", moss: "Felt" };
  const DEST_PX = 128;
  const WIND_HZ = 1.15;

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function isPlantKey(key) {
    return PLANT_KEYS.indexOf(key) >= 0;
  }

  function defaultSpot(key, width, height, i) {
    const w = Math.max(320, width || 800);
    const h = Math.max(240, height || 480);
    return {
      key,
      name: PLANT_NAMES[key] || key,
      x: clamp(w * (0.22 + (i || 0) * 0.28), 24, w - DEST_PX - 16),
      y: clamp(h * 0.62, 80, h - DEST_PX - 8),
      selected: false,
      dragging: false,
    };
  }

  function parsePlant(raw, width, height, i) {
    const key = raw && isPlantKey(raw.key) ? raw.key : PLANT_KEYS[i] || PLANT_KEYS[0];
    const spot = defaultSpot(key, width, height, i);
    if (!raw || typeof raw !== "object") return spot;
    if (Number.isFinite(Number(raw.x))) spot.x = clamp(Number(raw.x), 8, Math.max(8, (width || 800) - 40));
    if (Number.isFinite(Number(raw.y))) spot.y = clamp(Number(raw.y), 8, Math.max(8, (height || 480) - 40));
    return spot;
  }

  function loadPlants(width, height, storage) {
    const store = storage || (typeof localStorage !== "undefined" ? localStorage : null);
    let raw = null;
    try {
      raw = store && store.getItem ? JSON.parse(store.getItem(STORE) || "null") : null;
    } catch {
      raw = null;
    }
    const list = Array.isArray(raw) ? raw : [];
    return PLANT_KEYS.map((key, i) => parsePlant(list.find((p) => p && p.key === key) || { key }, width, height, i));
  }

  function savePlants(plants, storage) {
    const store = storage || (typeof localStorage !== "undefined" ? localStorage : null);
    if (!store || !store.setItem) return plants;
    const rows = (Array.isArray(plants) ? plants : []).map((p) => ({ key: p.key, x: p.x, y: p.y }));
    try {
      store.setItem(STORE, JSON.stringify(rows));
    } catch {
      /* ignore */
    }
    return plants;
  }

  function windLean(age, windOn, selected) {
    const gust = windOn ? 1 : 0.35;
    const hold = selected ? 0.4 : 1;
    return Math.sin((age || 0) * WIND_HZ * Math.PI * 2) * 7.5 * gust * hold;
  }

  function destStyle() {
    return {
      width: DEST_PX + "px",
      height: DEST_PX + "px",
      objectFit: "contain",
      objectPosition: "bottom",
      border: "0",
      outline: "none",
      background: "transparent",
      boxShadow: "none",
    };
  }

  function applyDest(img) {
    if (!img) return false;
    if (img.style) Object.assign(img.style, destStyle());
    if (img.setAttribute) {
      img.setAttribute("width", String(DEST_PX));
      img.setAttribute("height", String(DEST_PX));
    }
    return true;
  }

  function plantSrc(key, sprites) {
    const pack = sprites && typeof sprites === "object" ? sprites : {};
    const idle = Array.isArray(pack.idle) ? pack.idle.filter(Boolean) : [];
    const sit = Array.isArray(pack.sit) ? pack.sit.filter(Boolean) : [];
    const frames = idle.length ? idle : sit;
    return frames[0] || "";
  }

  function beginDrag(plant, pointerX, pointerY) {
    if (!plant) return plant;
    return {
      ...plant,
      selected: true,
      dragging: true,
      dragDx: (pointerX || 0) - plant.x,
      dragDy: (pointerY || 0) - plant.y,
    };
  }

  function moveDrag(plant, pointerX, pointerY, width, height) {
    if (!plant || !plant.dragging) return plant;
    const w = Math.max(320, width || 800);
    const h = Math.max(240, height || 480);
    return {
      ...plant,
      x: clamp((pointerX || 0) - (plant.dragDx || 0), 8, w - DEST_PX - 8),
      y: clamp((pointerY || 0) - (plant.dragDy || 0), 8, h - DEST_PX - 8),
    };
  }

  function endDrag(plant) {
    if (!plant) return plant;
    return { ...plant, dragging: false };
  }

  function selectOnly(plants, key) {
    return (Array.isArray(plants) ? plants : []).map((p) => ({ ...p, selected: p.key === key, dragging: p.key === key ? p.dragging : false }));
  }

  function paintTransform(plant, lean) {
    const x = plant && plant.x != null ? plant.x : 0;
    const y = plant && plant.y != null ? plant.y : 0;
    return `translate3d(${x}px, ${y}px, 0) rotate(${lean || 0}deg)`;
  }

  const api = {
    STORE,
    PLANT_KEYS,
    PLANT_NAMES,
    DEST_PX,
    isPlantKey,
    defaultSpot,
    parsePlant,
    loadPlants,
    savePlants,
    windLean,
    destStyle,
    applyDest,
    plantSrc,
    beginDrag,
    moveDrag,
    endDrag,
    selectOnly,
    paintTransform,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetDeskPlants = api;
})(typeof window !== "undefined" ? window : globalThis);
