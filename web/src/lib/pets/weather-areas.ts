/** Keeper-chosen weather areas. The house does not guess a city and does not ask an IP place service. Same map as desktop `weather-areas.js`. */
import type { Weather } from "./weather";

export const NO_AREA = "no area set";
export const AREA_LABEL = "Weather area";
export const AREA_PLACEHOLDER = "A city or place — weather, not radio";
export const AREA_TRUTH = "Weather area. Named places you add. Not the radio station.";
export const TYPE_A_CITY = "type a city";
export const HERE_FAIL = "this computer did not share a place";
export const CANT_REACH = "can't reach";
export const FAVORITES_EMPTY = "No favorites yet — star a place.";
export const GEOCODE_HOST = "geocoding-api.open-meteo.com";
export const FORECAST_HOST = "api.open-meteo.com";
export const MAX_AREAS = 8;
export const MAX_FAVORITES = 24;
export const AREA_NAME_CHARS = 48;
export const WEATHER_TABS = ["current", "favorites"] as const;

export type WeatherTab = (typeof WEATHER_TABS)[number];

export type WeatherArea = {
  id: string;
  name: string;
  query: string;
  lat: number;
  lon: number;
};

export type WeatherAreas = {
  areas: WeatherArea[];
  currentId: string | null;
  tab: WeatherTab;
  favoriteIds: string[];
};

export type LiveSky = {
  sky: Weather;
  tempC: number | null;
  windKmh: number | null;
  label: string;
  daily: Array<{ day: string; sky: Weather; maxC: number | null; minC: number | null }>;
  source: "open-meteo";
};

export function blankAreas(): WeatherAreas {
  return { areas: [], currentId: null, tab: "current", favoriteIds: [] };
}

function clipName(text: unknown) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, AREA_NAME_CHARS);
}

function num(n: unknown) {
  const v = Number(n);
  return Number.isFinite(v) ? v : null;
}

function hash(text: string) {
  let n = 0;
  for (let i = 0; i < text.length; i++) n = (n * 31 + text.charCodeAt(i)) | 0;
  return Math.abs(n).toString(36);
}

function parseTab(raw: unknown): WeatherTab {
  return raw === "favorites" ? "favorites" : "current";
}

export function parseArea(raw: unknown): WeatherArea | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const lat = num(o.lat);
  const lon = num(o.lon);
  if (lat == null || lon == null) return null;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;
  const query = clipName(o.query || o.name);
  const name = clipName(o.name) || query;
  if (!name) return null;
  const id = typeof o.id === "string" && o.id ? o.id : `a-${hash(`${name}|${lat}|${lon}`)}`;
  return { id, name, query: query || name, lat, lon };
}

export function parseAreas(raw: unknown): WeatherAreas {
  const next = blankAreas();
  if (!raw || typeof raw !== "object") return next;
  const o = raw as Record<string, unknown>;
  const list = Array.isArray(o.weatherAreas) ? o.weatherAreas : Array.isArray(o.areas) ? o.areas : [];
  next.areas = list.map(parseArea).filter((a): a is WeatherArea => !!a).slice(0, MAX_AREAS);
  const want = typeof o.currentAreaId === "string" ? o.currentAreaId : typeof o.currentId === "string" ? o.currentId : null;
  next.currentId = want && next.areas.some((a) => a.id === want) ? want : next.areas[0]?.id ?? null;
  next.tab = parseTab(o.weatherTab != null ? o.weatherTab : o.tab);
  const favRaw = Array.isArray(o.favoriteAreaIds) ? o.favoriteAreaIds : Array.isArray(o.favoriteIds) ? o.favoriteIds : [];
  const known = new Set(next.areas.map((a) => a.id));
  next.favoriteIds = favRaw.filter((x): x is string => typeof x === "string" && !!x && known.has(x)).slice(0, MAX_FAVORITES);
  return next;
}

export function toCardPatch(areas: WeatherAreas | unknown) {
  const house = areas && typeof areas === "object" && Array.isArray((areas as WeatherAreas).areas) ? (areas as WeatherAreas) : parseAreas(areas);
  return {
    weatherAreas: house.areas,
    currentAreaId: house.currentId,
    weatherTab: house.tab,
    favoriteAreaIds: house.favoriteIds,
  };
}

export function currentArea(areas: WeatherAreas | undefined | null): WeatherArea | null {
  if (!areas || !areas.areas.length) return null;
  return areas.areas.find((a) => a.id === areas.currentId) ?? areas.areas[0] ?? null;
}

export function addArea(areas: unknown, area: unknown): WeatherAreas {
  const house = parseAreas(areas);
  const next = parseArea(area);
  if (!next) return house;
  const exists = house.areas.findIndex((a) => a.id === next.id || (a.lat === next.lat && a.lon === next.lon));
  if (exists >= 0) house.areas[exists] = { ...house.areas[exists]!, ...next };
  else house.areas = [...house.areas, next].slice(0, MAX_AREAS);
  if (!house.currentId) house.currentId = next.id;
  house.tab = "current";
  return house;
}

export function removeArea(areas: unknown, id: string): WeatherAreas {
  const house = parseAreas(areas);
  house.areas = house.areas.filter((a) => a.id !== id);
  house.favoriteIds = house.favoriteIds.filter((x) => x !== id);
  if (house.currentId === id) house.currentId = house.areas[0]?.id ?? null;
  return house;
}

export function pickArea(areas: unknown, id: string): WeatherAreas {
  const house = parseAreas(areas);
  if (house.areas.some((a) => a.id === id)) {
    house.currentId = id;
    if (house.tab === "favorites") house.tab = "current";
  }
  return house;
}

export function renameArea(areas: unknown, id: string, name: unknown): WeatherAreas {
  const house = parseAreas(areas);
  const label = clipName(name);
  house.areas = house.areas.map((a) => (a.id === id && label ? { ...a, name: label } : a));
  return house;
}

export function pickTab(areas: unknown, tab: unknown): WeatherAreas {
  const house = parseAreas(areas);
  house.tab = parseTab(tab);
  return house;
}

export function toggleFavorite(areas: unknown, id: string): WeatherAreas {
  const house = parseAreas(areas);
  if (!house.areas.some((a) => a.id === id)) return house;
  if (house.favoriteIds.includes(id)) house.favoriteIds = house.favoriteIds.filter((x) => x !== id);
  else house.favoriteIds = [...house.favoriteIds, id].slice(0, MAX_FAVORITES);
  return house;
}

export function isFavorite(areas: unknown, id: string) {
  return parseAreas(areas).favoriteIds.includes(id);
}

export function favoriteAreas(areas: unknown): WeatherArea[] {
  const house = parseAreas(areas);
  return house.favoriteIds.map((id) => house.areas.find((a) => a.id === id)).filter((a): a is WeatherArea => !!a);
}

export function tabLabel(tab: unknown) {
  return parseTab(tab) === "favorites" ? "Favorites" : "Current";
}

export function geocodeUrl(query: string) {
  const q = clipName(query);
  if (!q) return "";
  return `https://${GEOCODE_HOST}/v1/search?name=${encodeURIComponent(q)}&count=5&language=en&format=json`;
}

export function reverseUrl(lat: number, lon: number) {
  const la = num(lat);
  const lo = num(lon);
  if (la == null || lo == null) return "";
  return `https://${GEOCODE_HOST}/v1/reverse?latitude=${la}&longitude=${lo}&language=en&format=json`;
}

export function parseReverse(json: unknown): WeatherArea | null {
  if (!json || typeof json !== "object") return null;
  const o = json as { results?: unknown; name?: unknown };
  const list = Array.isArray(o.results) ? o.results : o.name ? [o] : [];
  return parseGeocode({ results: list })[0] || null;
}

export function forecastUrl(lat: number, lon: number) {
  const la = num(lat);
  const lo = num(lon);
  if (la == null || lo == null) return "";
  return `https://${FORECAST_HOST}/v1/forecast?latitude=${la}&longitude=${lo}&current=temperature_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=3&timezone=auto`;
}

export function parseGeocode(json: unknown): WeatherArea[] {
  if (!json || typeof json !== "object") return [];
  const results = (json as { results?: unknown }).results;
  if (!Array.isArray(results)) return [];
  const out: WeatherArea[] = [];
  for (const row of results) {
    if (!row || typeof row !== "object") continue;
    const o = row as Record<string, unknown>;
    const lat = num(o.latitude);
    const lon = num(o.longitude);
    const name = clipName(o.name);
    if (lat == null || lon == null || !name) continue;
    const bits = [name, clipName(o.admin1), clipName(o.country)].filter(Boolean);
    const label = bits.join(", ");
    out.push({
      id: `a-${hash(`${label}|${lat}|${lon}`)}`,
      name: label,
      query: name,
      lat,
      lon,
    });
  }
  return out;
}

/** WMO weather codes → house sky. Wind and heat can win on the numbers we actually received. */
export function mapLiveSky(code: unknown, tempC: unknown, windKmh: unknown): Weather {
  const wmo = Math.round(Number(code));
  const temp = num(tempC);
  const wind = num(windKmh);
  if (Number.isFinite(wmo)) {
    if (wmo >= 95 || (wmo >= 80 && wmo <= 82) || (wmo >= 51 && wmo <= 67) || (wmo >= 71 && wmo <= 77) || (wmo >= 85 && wmo <= 86)) {
      if (wind != null && wind >= 40) return "wind";
      return "rain";
    }
  }
  if (wind != null && wind >= 28) return "wind";
  if (temp != null && temp >= 32) return "heat";
  return "clear";
}

export function skyLabel(sky: Weather, tempC: number | null) {
  const name = sky === "rain" ? "Rain" : sky === "wind" ? "Wind" : sky === "heat" ? "Heat" : "Clear";
  if (tempC == null || !Number.isFinite(tempC)) return name;
  return `${name} · ${Math.round(tempC)}°`;
}

export function parseForecast(json: unknown): LiveSky | null {
  if (!json || typeof json !== "object") return null;
  const o = json as Record<string, unknown>;
  const current = o.current && typeof o.current === "object" ? (o.current as Record<string, unknown>) : null;
  if (!current) return null;
  const tempC = num(current.temperature_2m);
  const windKmh = num(current.wind_speed_10m);
  const code = current.weather_code;
  const sky = mapLiveSky(code, tempC, windKmh);
  const dailyRaw = o.daily && typeof o.daily === "object" ? (o.daily as Record<string, unknown>) : null;
  const days: LiveSky["daily"] = [];
  if (dailyRaw && Array.isArray(dailyRaw.time)) {
    for (let i = 0; i < dailyRaw.time.length; i++) {
      const day = String(dailyRaw.time[i] || "");
      const dCode = Array.isArray(dailyRaw.weather_code) ? dailyRaw.weather_code[i] : null;
      const maxC = Array.isArray(dailyRaw.temperature_2m_max) ? num(dailyRaw.temperature_2m_max[i]) : null;
      const minC = Array.isArray(dailyRaw.temperature_2m_min) ? num(dailyRaw.temperature_2m_min[i]) : null;
      days.push({ day, sky: mapLiveSky(dCode, maxC, null), maxC, minC });
    }
  }
  return {
    sky,
    tempC,
    windKmh,
    label: skyLabel(sky, tempC),
    daily: days,
    source: "open-meteo",
  };
}

export function plateLine(areas: WeatherAreas | undefined, live: LiveSky | null | undefined, unread = false) {
  const area = currentArea(areas);
  if (!area) return NO_AREA;
  if (unread) return `${area.name} · unread`;
  if (!live) return `${area.name} · looking up`;
  return `${area.name} · ${live.label}`;
}
