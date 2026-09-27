/** Keeper-chosen weather areas. The house does not guess a city and does not ask an IP place service. A live fix is rounded before it leaves. A saved typed area is kept. A live locate waits for an in-app yes. A later locate in the session waits for a fresh yes. A stored live pin is rounded on load. A saved live pin does not forecast until the keeper says to use that place. A later forecast of that pin, or of a typed city, waits until the weather panel is open on the current place and the line names Open-Meteo, a weather website, and says this computer's internet address goes there too. `readForecast` refuses that fetch when the painted forecast line is missing. Look up and the reverse lookup after Send the place wait until that same panel shows the place-finder line that names Open-Meteo. `readGeocode` and `readReverse` refuse those fetches when that painted line is missing. A host that never answers times out after twelve seconds. That miss rejects so the plate can flip to unread / "can't reach". A late body is not parsed. Same map as desktop `weather-areas.js`. */
import type { Weather } from "./weather";

export const NO_AREA = "no place yet";
/** The closed plate's header on a clean profile: the next step is to open it (it points like Quotes). */
export const NO_AREA_WAITS = "open to add a place";
/** The open panel's next step on a clean profile (the open header keeps the short NO_AREA). */
export const NO_AREA_NEXT = "No place yet. Type a city below and press Look up.";
export const AREA_LABEL = "Weather area";
export const AREA_PLACEHOLDER = "A city or place — weather, not radio";
export const AREA_TRUTH = "Weather area. Named places you add. Not the radio station.";
export const TYPE_A_CITY = "type a city";
export const HERE_FAIL = "this computer did not share a place";
export const HERE_SEND = "Pressing this sends a place to Open-Meteo, a weather website.";
export const HERE_ASK = "Send where this computer is? If you said yes to your browser or computer before, it may not ask again, but this app still asks you first. This app can't take back a yes you gave your browser or computer. You can change that in its settings.";
export const HERE_YES = "Send the place";
export const HERE_NO = "Don't send";
export const HERE_HELD = "the place was not sent";
export const HERE_KEPT = "keeping the saved place";
export const HERE_SENT = "a place was sent to Open-Meteo";
/**
 * Any HTTPS client shows its network address to the host. This is not a city lookup.
 * An empty host is the bare sentence. Every consent line now paints the kid-plain
 * `plainNetLine` below; only radio (Rui's music block, left as it is) still paints this one.
 */
export function clientNetLine(host = ""): string {
  const where = host ? ` to ${host}` : "";
  return `this computer's network address goes with the https request${where}, as any client.`;
}
/** The weather website the forecast and the place finder ask (api. and geocoding-api.open-meteo.com). */
export const WEATHER_SITE = "Open-Meteo";
export const PLAIN_NET_HEAD = "This computer's internet address also goes to ";
export const PLAIN_NET_TAIL = ", like visiting any website.";
/**
 * The kid-plain network-address sentence the weather, news, and quote plates paint.
 * It names the website (or websites, joined with "and") in plain words. Any website
 * sees the address of the computer that asks, so the sentence says so. An empty name
 * is no sentence. Weather, news, quotes, cloud talk and voice, license, and STUN paint it.
 * `clientNetLine` stays only for radio in Rui's music block.
 */
export function plainNetLine(names = ""): string {
  return names ? `${PLAIN_NET_HEAD}${names}${PLAIN_NET_TAIL}` : "";
}
export const FORECAST_NET = plainNetLine(WEATHER_SITE);
export const GEOCODE_NET = plainNetLine(WEATHER_SITE);
export const GEOCODE_LOOK = `This asks Open-Meteo, a weather website, to find the place you typed. It sends what you typed. ${GEOCODE_NET}`;
export const GEOCODE_REVERSE = `This asks Open-Meteo, a weather website, for the name of the place you sent. It sends that place, rounded to about 11 km. ${GEOCODE_NET}`;
export const SAVED_HERE_ASK = `Use the place this computer saved for the forecast? This sends the saved place to Open-Meteo, a weather website. ${FORECAST_NET} It does not find where you are again.`;
export const SAVED_HERE_YES = "Use this saved place";
export const SAVED_HERE_NO = "Don't send";
export const SAVED_HERE_HELD = "the saved place was not sent";
export const SAVED_HERE_SENT = "the saved place was sent to Open-Meteo";
export const SAVED_HERE_WAIT = "saved place not sent";
export const TYPED_FORECAST = `This asks Open-Meteo, a weather website, for your forecast. It sends the place you picked. ${FORECAST_NET}`;
export const SAVED_FORECAST_CONTINUE = `This asks Open-Meteo, a weather website, for the forecast at the saved place you already said yes to. It sends that saved place. ${FORECAST_NET} It does not find where you are again.`;
/** The header while the forecast line is out of view: the forecast is asked only once that line is shown. */
export const FORECAST_WAITS = "open to see the weather";
/** The header while a shown, allowed forecast is on its way. */
export const FORECAST_LOOKING = "getting the weather…";
/** A tenth of a degree is about 11 km. Rounding is not anonymity. */
export const PLACE_STEP = 0.1;
export const CANT_REACH = "can't reach";
export const FAVORITES_EMPTY = "Nothing saved yet. Tap ☆ next to a place to keep it here.";
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
  /** The WMO code in words. Empty when the forecast gave no known code. */
  word: string;
  tempC: number | null;
  windKmh: number | null;
  label: string;
  daily: Array<{ day: string; sky: Weather; word: string; maxC: number | null; minC: number | null }>;
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
  const area = { id, name, query: query || name, lat, lon };
  if (!isLiveFix(area)) return area;
  const place = sharePlace(lat, lon);
  if (!place) return area;
  area.lat = place.lat;
  area.lon = place.lon;
  return area;
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

function isLiveFix(area: { id?: string; query?: string } | null | undefined) {
  if (!area) return false;
  return area.id === "here" || area.query === "this computer";
}

/**
 * Round a fix to a place before it can leave. A tenth of a degree.
 * This is not anonymity. The forecast host still receives a place.
 */
export function sharePlace(lat: number, lon: number): { lat: number; lon: number } | null {
  const la = num(lat);
  const lo = num(lon);
  if (la == null || lo == null) return null;
  if (la < -90 || la > 90 || lo < -180 || lo > 180) return null;
  const places = Math.round(1 / PLACE_STEP);
  const round = (v: number) => {
    const n = Number((Math.round(v * places) / places).toFixed(1));
    return Object.is(n, -0) ? 0 : n;
  };
  let latR = round(la);
  let lonR = round(lo);
  if (latR > 90) latR = 90;
  if (latR < -90) latR = -90;
  if (lonR > 180) lonR = 180;
  if (lonR < -180) lonR = -180;
  return { lat: latR, lon: lonR };
}

/** A place the keeper typed. A live "here" fix is not one. */
export function typedArea(areas: unknown): WeatherArea | null {
  const house = parseAreas(areas);
  const typed = house.areas.filter((a) => !isLiveFix(a));
  if (!typed.length) return null;
  return typed.find((a) => a.id === house.currentId) || typed[0] || null;
}

/**
 * Prefer a saved typed area. Do not start a live locate when one is present.
 * A cached geolocation grant is not consulted on that path.
 */
export function locateChoice(areas: unknown): { locate: false; area: WeatherArea } | { locate: true; area: null } {
  const saved = typedArea(areas);
  if (saved) return { locate: false, area: saved };
  return { locate: true, area: null };
}

export type LocateGate =
  | { act: "keep"; area: WeatherArea }
  | { act: "ask"; area: null }
  | { act: "locate"; area: null };

/**
 * A live locate needs a fresh in-app yes before geolocation is armed.
 * A saved typed area does not. A cached origin grant is not that yes.
 * confirmed must be the boolean true from the keeper's Send button.
 */
export function locateGate(areas: unknown, confirmed?: unknown): LocateGate {
  const choice = locateChoice(areas);
  if (!choice.locate) return { act: "keep", area: choice.area };
  if (confirmed === true) return { act: "locate", area: null };
  return { act: "ask", area: null };
}

/** A stored live pin still has digits finer than a tenth of a degree. */
export function storedLivePinNeedsFuzz(raw: unknown): boolean {
  if (!raw || typeof raw !== "object") return false;
  const o = raw as Record<string, unknown>;
  const list = Array.isArray(o.weatherAreas) ? o.weatherAreas : Array.isArray(o.areas) ? o.areas : [];
  for (const row of list) {
    if (!row || typeof row !== "object") continue;
    const item = row as Record<string, unknown>;
    const query = clipName(item.query || "");
    if (item.id !== "here" && query !== "this computer") continue;
    const lat = num(item.lat);
    const lon = num(item.lon);
    const place = lat != null && lon != null ? sharePlace(lat, lon) : null;
    if (!place) continue;
    if (place.lat !== lat || place.lon !== lon) return true;
  }
  return false;
}

export function geocodeUrl(query: string) {
  const q = clipName(query);
  if (!q) return "";
  return `https://${GEOCODE_HOST}/v1/search?name=${encodeURIComponent(q)}&count=5&language=en&format=json`;
}

export function reverseUrl(lat: number, lon: number) {
  const place = sharePlace(lat, lon);
  if (!place) return "";
  return `https://${GEOCODE_HOST}/v1/reverse?latitude=${place.lat.toFixed(1)}&longitude=${place.lon.toFixed(1)}&language=en&format=json`;
}

export function parseReverse(json: unknown): WeatherArea | null {
  if (!json || typeof json !== "object") return null;
  const o = json as { results?: unknown; name?: unknown };
  const list = Array.isArray(o.results) ? o.results : o.name ? [o] : [];
  return parseGeocode({ results: list })[0] || null;
}

export function forecastUrl(lat: number, lon: number) {
  const place = sharePlace(lat, lon);
  if (!place) return "";
  return `https://${FORECAST_HOST}/v1/forecast?latitude=${place.lat.toFixed(1)}&longitude=${place.lon.toFixed(1)}&current=temperature_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=3&timezone=auto`;
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
/**
 * The WMO weather code in words (Open-Meteo's table). The pets keep their four art
 * skies; the plate says what the code actually reports. An unknown code has no word.
 */
export const WMO_WORDS: Readonly<Record<number, string>> = {
  0: "Clear",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Fog",
  51: "Drizzle",
  53: "Drizzle",
  55: "Drizzle",
  56: "Freezing drizzle",
  57: "Freezing drizzle",
  61: "Rain",
  63: "Rain",
  65: "Rain",
  66: "Freezing rain",
  67: "Freezing rain",
  71: "Snow",
  73: "Snow",
  75: "Snow",
  77: "Snow grains",
  80: "Showers",
  81: "Showers",
  82: "Showers",
  85: "Snow showers",
  86: "Snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Thunderstorm with hail",
};

export function skyWord(code: unknown): string {
  if (code == null || code === "" || typeof code === "boolean") return "";
  const wmo = Number(code);
  if (!Number.isInteger(wmo) || !Object.prototype.hasOwnProperty.call(WMO_WORDS, wmo)) return "";
  return WMO_WORDS[wmo];
}

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

/**
 * With a word (a forecast), the word leads and wind or heat is added after it.
 * With no code the forecast did not say, so a calm sky reads "Sky not known", not "Clear".
 * Without a word argument (the house sky) the four names stay.
 */
function skyName(sky: Weather, word?: string) {
  const four = sky === "rain" ? "Rain" : sky === "wind" ? "Wind" : sky === "heat" ? "Heat" : "Clear";
  if (word === undefined) return four;
  if (!word) return sky === "clear" ? "Sky not known" : four;
  if (sky === "wind") return `${word}, windy`;
  if (sky === "heat") return `${word}, hot`;
  return word;
}

export function skyLabel(sky: Weather, tempC: number | null, word?: string) {
  const name = skyName(sky, word);
  if (tempC == null || !Number.isFinite(tempC)) return name;
  return `${name} · ${Math.round(tempC)}°`;
}

/** One forecast day in the plate's lower case: "overcast", "drizzle", "clear, hot". */
export function dayLabel(day: { sky: Weather; word?: string | null } | null | undefined) {
  if (!day || typeof day !== "object") return "sky not known";
  return skyName(day.sky, day.word == null ? "" : day.word).toLowerCase();
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
  const word = skyWord(code);
  const dailyRaw = o.daily && typeof o.daily === "object" ? (o.daily as Record<string, unknown>) : null;
  const days: LiveSky["daily"] = [];
  if (dailyRaw && Array.isArray(dailyRaw.time)) {
    for (let i = 0; i < dailyRaw.time.length; i++) {
      const day = String(dailyRaw.time[i] || "");
      const dCode = Array.isArray(dailyRaw.weather_code) ? dailyRaw.weather_code[i] : null;
      const maxC = Array.isArray(dailyRaw.temperature_2m_max) ? num(dailyRaw.temperature_2m_max[i]) : null;
      const minC = Array.isArray(dailyRaw.temperature_2m_min) ? num(dailyRaw.temperature_2m_min[i]) : null;
      days.push({ day, sky: mapLiveSky(dCode, maxC, null), word: skyWord(dCode), maxC, minC });
    }
  }
  return {
    sky,
    word,
    tempC,
    windKmh,
    label: skyLabel(sky, tempC, word),
    daily: days,
    source: "open-meteo",
  };
}

export type HereForecastAck = { lat: number; lon: number };

export type ForecastGate =
  | { act: "none"; area: null; ack: null; locate: false }
  | { act: "send"; area: WeatherArea; ack: HereForecastAck | null; locate: false }
  | { act: "hold"; area: WeatherArea; ack: null; locate: false };

/**
 * A stored yes for one saved live pin. Digits must already be a tenth of a degree.
 * A precise ack is not kept. This is not a locate and not a browser grant.
 */
export function hereForecastAckOf(raw: unknown): HereForecastAck | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const lat = num(o.lat);
  const lon = num(o.lon);
  if (lat == null || lon == null) return null;
  const place = sharePlace(lat, lon);
  if (!place) return null;
  if (place.lat !== lat || place.lon !== lon) return null;
  return { lat: place.lat, lon: place.lon };
}

/**
 * A typed city may go to the forecast host. A saved live pin does not,
 * until the keeper has acknowledged that exact place. The ack sticks for
 * that pin. It is not a geolocation arm and not a reverse lookup.
 * The same ack still allows a later forecast. That is not a new question.
 * The page calls `forecastMaySend` before the request, so a later read
 * waits until the weather panel is open. `forecastHonesty` names the
 * network address on that send. There is no forecast timer.
 */
export function forecastGate(areas: unknown, ack?: unknown): ForecastGate {
  const area = currentArea(parseAreas(areas));
  if (!area) return { act: "none", area: null, ack: null, locate: false };
  if (!isLiveFix(area)) return { act: "send", area, ack: null, locate: false };
  const pin = sharePlace(area.lat, area.lon);
  const saved = hereForecastAckOf(ack);
  if (pin && saved && pin.lat === saved.lat && pin.lon === saved.lon) {
    return { act: "send", area, ack: saved, locate: false };
  }
  return { act: "hold", area, ack: null, locate: false };
}

/** The rounded place of the current live pin, for the keeper's forecast yes. */
export function ackSavedHere(areas: unknown): HereForecastAck | null {
  const area = currentArea(parseAreas(areas));
  if (!area || !isLiveFix(area)) return null;
  return sharePlace(area.lat, area.lon);
}

/**
 * Keep an ack only while the current area is still that live pin.
 * Clearing the pin or picking another area drops it.
 */
export function stickHereForecastAck(areas: unknown, ack?: unknown): HereForecastAck | null {
  const gate = forecastGate(areas, ack);
  return gate.act === "send" && gate.ack ? gate.ack : null;
}

/**
 * The forecast host is called only while the keeper can see the honesty line.
 * A closed plate, a load, and the favorites tab are not that view.
 * This does not ask again and does not locate.
 */
export function forecastMaySend(gate: ForecastGate, panelOpen: boolean): boolean {
  return panelOpen === true && gate.act === "send" && gate.area != null;
}

/** The line in the open weather panel for a typed city or an acknowledged pin. */
export function forecastHonesty(gate: ForecastGate): string {
  if (gate.act !== "send" || !gate.area) return "";
  return gate.ack ? SAVED_FORECAST_CONTINUE : TYPED_FORECAST;
}

/** The line in the open weather panel before a typed look-up or a reverse lookup. */
export function geocodeHonesty(kind: unknown): string {
  if (kind === "look") return GEOCODE_LOOK;
  if (kind === "reverse") return GEOCODE_REVERSE;
  return "";
}

/**
 * The geocode host is called only while the keeper can see that line.
 * A closed plate, a load, and a missing line are not that view.
 * This does not geocode on its own and does not ask an IP place service.
 */
export function geocodeMaySend(kind: unknown, lineInView: boolean): boolean {
  return lineInView === true && geocodeHonesty(kind).includes(GEOCODE_NET);
}

/**
 * A forecast leaves only when the painted line is a forecast send sentence.
 * That sentence includes the forecast host line. The saved-place question,
 * a bare network-address sentence, and the geocode sentence do not count.
 * A missing line does not call fetch.
 */
export function forecastMayLeave(shown: unknown): boolean {
  if (!FORECAST_NET || typeof shown !== "string") return false;
  return shown.includes(TYPED_FORECAST) || shown.includes(SAVED_FORECAST_CONTINUE);
}

/**
 * A typed look-up leaves only when the painted look-up line names the geocode host.
 * The reverse sentence and the forecast sentence do not count.
 */
export function geocodeLookMayLeave(shown: unknown): boolean {
  return GEOCODE_LOOK.length > 0 && typeof shown === "string" && shown.includes(GEOCODE_LOOK);
}

/**
 * A reverse lookup leaves only when the painted reverse line names the geocode host.
 * The look-up sentence and the forecast sentence do not count.
 */
export function geocodeReverseMayLeave(shown: unknown): boolean {
  return GEOCODE_REVERSE.length > 0 && typeof shown === "string" && shown.includes(GEOCODE_REVERSE);
}

type JsonFetch = (url: string, init?: RequestInit) => Promise<{ json: () => Promise<unknown> }>;

/** Twelve seconds covers headers and the body. Matches overlay plate IPC. */
export const WEATHER_TIMEOUT_MS = 12_000;

/** A silent Open-Meteo host. Callers flip the plate to unread / "can't reach". */
export class WeatherTimeout extends Error {
  constructor() {
    super("weather request timed out");
    this.name = "WeatherTimeout";
  }
}

function isWeatherTimeout(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const name = (err as { name?: string }).name;
  const code = (err as { code?: string }).code;
  return name === "WeatherTimeout" || name === "AbortError" || name === "TimeoutError" || code === "ABORT_ERR";
}

/**
 * One outbound weather JSON read. The timer covers headers and the body.
 * A timeout rejects with WeatherTimeout. The caller does not get a body.
 * A late body after the deadline is not parsed.
 */
function readJson(
  url: string,
  fetchImpl: JsonFetch,
  timeoutMs: number = WEATHER_TIMEOUT_MS,
): Promise<unknown | null> {
  if (typeof fetchImpl !== "function") return Promise.reject(new WeatherTimeout());

  const ctrl = new AbortController();
  let settled = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  return new Promise((resolve, reject) => {
    timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      ctrl.abort();
      reject(new WeatherTimeout());
    }, timeoutMs);

    Promise.resolve()
      .then(() => fetchImpl(url, { cache: "no-store", signal: ctrl.signal }))
      .then(async (res) => {
        const json = res && typeof res.json === "function" ? await res.json() : null;
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve(json);
      })
      .catch((err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (isWeatherTimeout(err)) reject(new WeatherTimeout());
        else reject(err);
      });
  });
}

/** The only forecast fetch. A miss resolves to null and does not call fetch. A hang rejects. */
export function readForecast(
  shown: unknown,
  url: string,
  fetchImpl: JsonFetch = fetch,
  timeoutMs: number = WEATHER_TIMEOUT_MS,
): Promise<unknown | null> {
  if (!forecastMayLeave(shown) || !url) return Promise.resolve(null);
  return readJson(url, fetchImpl, timeoutMs);
}

/** The only geocode look-up fetch. A miss resolves to null and does not call fetch. A hang rejects. */
export function readGeocode(
  shown: unknown,
  url: string,
  fetchImpl: JsonFetch = fetch,
  timeoutMs: number = WEATHER_TIMEOUT_MS,
): Promise<unknown | null> {
  if (!geocodeLookMayLeave(shown) || !url) return Promise.resolve(null);
  return readJson(url, fetchImpl, timeoutMs);
}

/** The only reverse-lookup fetch. A miss resolves to null and does not call fetch. A hang rejects. */
export function readReverse(
  shown: unknown,
  url: string,
  fetchImpl: JsonFetch = fetch,
  timeoutMs: number = WEATHER_TIMEOUT_MS,
): Promise<unknown | null> {
  if (!geocodeReverseMayLeave(shown) || !url) return Promise.resolve(null);
  return readJson(url, fetchImpl, timeoutMs);
}

export function plateLine(
  areas: WeatherAreas | undefined,
  live: LiveSky | null | undefined,
  unread = false,
  held = false,
  waiting = false,
  /** The plate is shut: a clean profile's header says to open it (NO_AREA_WAITS). */
  closed = false,
) {
  const area = currentArea(areas);
  if (!area) return closed ? NO_AREA_WAITS : NO_AREA;
  if (held) return `${area.name} · ${SAVED_HERE_WAIT}`;
  if (unread) return `${area.name} · ${CANT_REACH}`;
  if (!live) return waiting ? `${area.name} · ${FORECAST_WAITS}` : `${area.name} · ${FORECAST_LOOKING}`;
  return `${area.name} · ${live.label}`;
}
