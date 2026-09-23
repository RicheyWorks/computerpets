/** Disk the water lily and Felt the moss. Existing garden guests. Drag-place, click a mode, lean in the wind. Not a new taxon. */
(function (root) {
  const STORE = "computerpets.desktop.plants.v1";
  const PLANT_KEYS = ["water_lily", "moss"];
  const PLANT_NAMES = { water_lily: "Disk", moss: "Felt" };
  const PLANT_MODES = ["still", "wind", "meet"];
  const DEFAULT_MODE = { water_lily: "wind", moss: "meet" };
  const GRASS_KEYS = ["moss"];
  const DEST_PX = 128;
  const WIND_HZ = 1.15;
  const CLICK_PX = 8;

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function isPlantKey(key) {
    return PLANT_KEYS.indexOf(key) >= 0;
  }

  function isPlantMode(mode) {
    return PLANT_MODES.indexOf(mode) >= 0;
  }

  function defaultMode(key) {
    return DEFAULT_MODE[key] || "wind";
  }

  function isGrass(key) {
    return GRASS_KEYS.indexOf(key) >= 0;
  }

  function defaultSpot(key, width, height, i) {
    const w = Math.max(320, width || 800);
    const h = Math.max(240, height || 480);
    return {
      key,
      name: PLANT_NAMES[key] || key,
      x: clamp(w * (0.22 + (i || 0) * 0.28), 24, w - DEST_PX - 16),
      y: clamp(h * 0.62, 80, h - DEST_PX - 8),
      mode: defaultMode(key),
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
    if (isPlantMode(raw.mode)) spot.mode = raw.mode;
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
    const rows = (Array.isArray(plants) ? plants : []).map((p) => ({ key: p.key, x: p.x, y: p.y, mode: isPlantMode(p.mode) ? p.mode : defaultMode(p.key) }));
    try {
      store.setItem(STORE, JSON.stringify(rows));
    } catch {
      /* ignore */
    }
    return plants;
  }

  function windLean(age, windOn, selected, mode) {
    if (mode === "still") return 0;
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
    // Width and height attributes clear a canvas backing store. The sprite surface owns that bitmap.
    if (img.setAttribute && typeof img.getContext !== "function") {
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

  function setMode(plant, mode) {
    if (!plant) return plant;
    return { ...plant, mode: isPlantMode(mode) ? mode : defaultMode(plant.key) };
  }

  function cycleMode(plant) {
    if (!plant) return plant;
    const i = PLANT_MODES.indexOf(plant.mode);
    return setMode(plant, PLANT_MODES[(i + 1) % PLANT_MODES.length]);
  }

  function clickMoved(dx, dy, threshold) {
    const lim = threshold == null ? CLICK_PX : threshold;
    return Math.abs(dx || 0) > lim || Math.abs(dy || 0) > lim;
  }

  function plantChoiceMarks() {
    return [
      { id: "still", label: "Still" },
      { id: "wind", label: "Wind" },
      { id: "meet", label: "Meet" },
    ];
  }

  function plantPick(id) {
    return isPlantMode(id) ? id : null;
  }

  function isMeet(plant) {
    return !!(plant && plant.mode === "meet");
  }

  function isStill(plant) {
    return !!(plant && plant.mode === "still");
  }

  function grassBound(plant, work) {
    if (!plant || !isMeet(plant)) return null;
    if (!isGrass(plant.key) && plant.key !== "water_lily") return null;
    const workH = Math.max(240, (work && work.height) || 800);
    const floor = (work && work.floorLift) || 0;
    const bottom = (plant.y || 0) + DEST_PX;
    let lift = workH - bottom + 12;
    if (!Number.isFinite(lift)) return null;
    lift = Math.max(floor, Math.min(floor + 28, lift));
    return {
      kind: isGrass(plant.key) ? "grass" : "pad",
      key: plant.key,
      x: (plant.x || 0) + DEST_PX * 0.38,
      lift,
    };
  }

  function firstGrassBound(plants, work) {
    const list = Array.isArray(plants) ? plants : [];
    const moss = list.find((p) => p && isGrass(p.key) && isMeet(p));
    if (moss) return grassBound(moss, work);
    for (const p of list) {
      const b = grassBound(p, work);
      if (b) return b;
    }
    return null;
  }

  const api = {
    STORE,
    PLANT_KEYS,
    PLANT_NAMES,
    PLANT_MODES,
    DEFAULT_MODE,
    GRASS_KEYS,
    DEST_PX,
    CLICK_PX,
    isPlantKey,
    isPlantMode,
    defaultMode,
    isGrass,
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
    setMode,
    cycleMode,
    clickMoved,
    plantChoiceMarks,
    plantPick,
    isMeet,
    isStill,
    grassBound,
    firstGrassBound,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetDeskPlants = api;
})(typeof window !== "undefined" ? window : globalThis);
