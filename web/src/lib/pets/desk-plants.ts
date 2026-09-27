/** Disk the water lily and Felt the moss. Existing garden guests. Drag-place, click a mode, lean in the wind. Same map as desktop `desk-plants.js`. */

export const STORE = "computerpets.desktop.plants.v1";
export const PLANT_KEYS = ["water_lily", "moss"] as const;
export const PLANT_NAMES: Record<string, string> = { water_lily: "Disk", moss: "Felt" };
export const PLANT_MODES = ["still", "wind", "meet"] as const;
export const DEFAULT_MODE: Record<string, PlantMode> = { water_lily: "wind", moss: "meet" };
export const GRASS_KEYS = ["moss"] as const;
export const DEST_PX = 128;
export const CLICK_PX = 8;
const WIND_HZ = 1.15;

export type PlantKey = (typeof PLANT_KEYS)[number];
export type PlantMode = (typeof PLANT_MODES)[number];
export type DeskPlant = {
  key: PlantKey;
  name: string;
  x: number;
  y: number;
  mode: PlantMode;
  selected: boolean;
  dragging: boolean;
  dragDx?: number;
  dragDy?: number;
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export function isPlantKey(key: string | undefined) {
  return !!key && (PLANT_KEYS as readonly string[]).indexOf(key) >= 0;
}

export function isPlantMode(mode: string | undefined): mode is PlantMode {
  return !!mode && (PLANT_MODES as readonly string[]).indexOf(mode) >= 0;
}

export function defaultMode(key: string): PlantMode {
  return DEFAULT_MODE[key] || "wind";
}

export function isGrass(key: string | undefined) {
  return !!key && (GRASS_KEYS as readonly string[]).indexOf(key) >= 0;
}

export function defaultSpot(key: PlantKey, width: number, height: number, i = 0): DeskPlant {
  const w = Math.max(320, width || 800);
  const h = Math.max(240, height || 480);
  return {
    key,
    name: PLANT_NAMES[key] || key,
    x: clamp(w * (0.22 + i * 0.28), 24, w - DEST_PX - 16),
    y: clamp(h * 0.62, 80, h - DEST_PX - 8),
    mode: defaultMode(key),
    selected: false,
    dragging: false,
  };
}

export function parsePlant(raw: { key?: string; x?: number; y?: number; mode?: string } | null | undefined, width: number, height: number, i: number): DeskPlant {
  const key = raw && isPlantKey(raw.key) ? (raw.key as PlantKey) : PLANT_KEYS[i] || PLANT_KEYS[0];
  const spot = defaultSpot(key, width, height, i);
  if (!raw || typeof raw !== "object") return spot;
  if (Number.isFinite(Number(raw.x))) spot.x = clamp(Number(raw.x), 8, Math.max(8, (width || 800) - 40));
  if (Number.isFinite(Number(raw.y))) spot.y = clamp(Number(raw.y), 8, Math.max(8, (height || 480) - 40));
  if (isPlantMode(raw.mode)) spot.mode = raw.mode;
  return spot;
}

export function loadPlants(width: number, height: number, storage?: { getItem: (k: string) => string | null } | null) {
  const store = storage || (typeof localStorage !== "undefined" ? localStorage : null);
  let raw: unknown = null;
  try {
    raw = store && store.getItem ? JSON.parse(store.getItem(STORE) || "null") : null;
  } catch {
    raw = null;
  }
  const list = Array.isArray(raw) ? raw : [];
  return PLANT_KEYS.map((key, i) => parsePlant(list.find((p: { key?: string }) => p && p.key === key) || { key }, width, height, i));
}

export function savePlants(plants: DeskPlant[], storage?: { setItem: (k: string, v: string) => void } | null) {
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

export function windLean(age: number, windOn: boolean, selected?: boolean, mode?: string) {
  if (mode === "still") return 0;
  const gust = windOn ? 1 : 0.35;
  const hold = selected ? 0.4 : 1;
  return Math.sin((age || 0) * WIND_HZ * Math.PI * 2) * 7.5 * gust * hold;
}

export function plantSrc(key: string, sprites?: { idle?: string[] | null; sit?: string[] | null } | null) {
  const pack = sprites && typeof sprites === "object" ? sprites : {};
  const idle = Array.isArray(pack.idle) ? pack.idle.filter(Boolean) : [];
  const sit = Array.isArray(pack.sit) ? pack.sit.filter(Boolean) : [];
  const frames = idle.length ? idle : sit;
  return frames[0] || "";
}

export function beginDrag(plant: DeskPlant, pointerX: number, pointerY: number): DeskPlant {
  return {
    ...plant,
    selected: true,
    dragging: true,
    dragDx: (pointerX || 0) - plant.x,
    dragDy: (pointerY || 0) - plant.y,
  };
}

export function moveDrag(plant: DeskPlant, pointerX: number, pointerY: number, width: number, height: number): DeskPlant {
  if (!plant.dragging) return plant;
  const w = Math.max(320, width || 800);
  const h = Math.max(240, height || 480);
  return {
    ...plant,
    x: clamp((pointerX || 0) - (plant.dragDx || 0), 8, w - DEST_PX - 8),
    y: clamp((pointerY || 0) - (plant.dragDy || 0), 8, h - DEST_PX - 8),
  };
}

export function endDrag(plant: DeskPlant): DeskPlant {
  return { ...plant, dragging: false };
}

export function selectOnly(plants: DeskPlant[], key: string) {
  return (Array.isArray(plants) ? plants : []).map((p) => ({ ...p, selected: p.key === key, dragging: p.key === key ? p.dragging : false }));
}

export function paintTransform(plant: DeskPlant, lean: number) {
  return `translate3d(${plant.x}px, ${plant.y}px, 0) rotate(${lean || 0}deg)`;
}

export function setMode(plant: DeskPlant, mode: string): DeskPlant {
  return { ...plant, mode: isPlantMode(mode) ? mode : defaultMode(plant.key) };
}

export function cycleMode(plant: DeskPlant): DeskPlant {
  const i = PLANT_MODES.indexOf(plant.mode);
  return setMode(plant, PLANT_MODES[(i + 1) % PLANT_MODES.length]);
}

export function clickMoved(dx: number, dy: number, threshold?: number) {
  const lim = threshold == null ? CLICK_PX : threshold;
  return Math.abs(dx || 0) > lim || Math.abs(dy || 0) > lim;
}

export function plantChoiceMarks() {
  return [
    { id: "still" as const, label: "Still" },
    { id: "wind" as const, label: "Wind" },
    { id: "meet" as const, label: "Meet" },
  ];
}

export function plantPick(id: string | undefined) {
  return isPlantMode(id) ? id : null;
}

export function isMeet(plant: DeskPlant | null | undefined) {
  return !!(plant && plant.mode === "meet");
}

export function isStill(plant: DeskPlant | null | undefined) {
  return !!(plant && plant.mode === "still");
}

export function grassBound(plant: DeskPlant | null | undefined, work?: { height?: number; floorLift?: number } | null) {
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

export function firstGrassBound(plants: DeskPlant[] | null | undefined, work?: { height?: number; floorLift?: number } | null) {
  const list = Array.isArray(plants) ? plants : [];
  const moss = list.find((p) => p && isGrass(p.key) && isMeet(p));
  if (moss) return grassBound(moss, work);
  for (const p of list) {
    const b = grassBound(p, work);
    if (b) return b;
  }
  return null;
}
