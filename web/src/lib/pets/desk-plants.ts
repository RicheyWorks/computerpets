/** Disk the water lily and Felt the moss. Existing garden guests. Drag-place and lean in the wind. Same map as desktop `desk-plants.js`. */

export const STORE = "computerpets.desktop.plants.v1";
export const PLANT_KEYS = ["water_lily", "moss"] as const;
export const PLANT_NAMES: Record<string, string> = { water_lily: "Disk", moss: "Felt" };
export const DEST_PX = 128;
const WIND_HZ = 1.15;

export type PlantKey = (typeof PLANT_KEYS)[number];
export type DeskPlant = {
  key: PlantKey;
  name: string;
  x: number;
  y: number;
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

export function defaultSpot(key: PlantKey, width: number, height: number, i = 0): DeskPlant {
  const w = Math.max(320, width || 800);
  const h = Math.max(240, height || 480);
  return {
    key,
    name: PLANT_NAMES[key] || key,
    x: clamp(w * (0.22 + i * 0.28), 24, w - DEST_PX - 16),
    y: clamp(h * 0.62, 80, h - DEST_PX - 8),
    selected: false,
    dragging: false,
  };
}

export function parsePlant(raw: { key?: string; x?: number; y?: number } | null | undefined, width: number, height: number, i: number): DeskPlant {
  const key = raw && isPlantKey(raw.key) ? (raw.key as PlantKey) : PLANT_KEYS[i] || PLANT_KEYS[0];
  const spot = defaultSpot(key, width, height, i);
  if (!raw || typeof raw !== "object") return spot;
  if (Number.isFinite(Number(raw.x))) spot.x = clamp(Number(raw.x), 8, Math.max(8, (width || 800) - 40));
  if (Number.isFinite(Number(raw.y))) spot.y = clamp(Number(raw.y), 8, Math.max(8, (height || 480) - 40));
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
  const rows = (Array.isArray(plants) ? plants : []).map((p) => ({ key: p.key, x: p.x, y: p.y }));
  try {
    store.setItem(STORE, JSON.stringify(rows));
  } catch {
    /* ignore */
  }
  return plants;
}

export function windLean(age: number, windOn: boolean, selected?: boolean) {
  const gust = windOn ? 1 : 0.35;
  const hold = selected ? 0.4 : 1;
  return Math.sin((age || 0) * WIND_HZ * Math.PI * 2) * 7.5 * gust * hold;
}

export function destStyle() {
  return {
    width: `${DEST_PX}px`,
    height: `${DEST_PX}px`,
    objectFit: "contain" as const,
    objectPosition: "bottom",
    border: "0",
    outline: "none",
    background: "transparent",
    boxShadow: "none",
  };
}

export function applyDest(img: { style?: Record<string, string>; setAttribute?: (name: string, value: string) => void } | null | undefined) {
  if (!img) return false;
  if (img.style) Object.assign(img.style, destStyle());
  img.setAttribute?.("width", String(DEST_PX));
  img.setAttribute?.("height", String(DEST_PX));
  return true;
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
