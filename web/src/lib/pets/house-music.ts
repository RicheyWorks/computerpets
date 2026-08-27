/** Free music + radio for Rui. Same plugin store shape as the mind bus. Same map as desktop `house-music.js`. */

export const MUSIC_PLUGINS = [
  { id: "off" as const, name: "Quiet", blurb: "No music.", license: "" },
  {
    id: "house" as const,
    name: "House loop",
    blurb: "A short house-made loop. Rui can dance.",
    license: "CC0 · house-made",
  },
  {
    id: "radio" as const,
    name: "Radio Browser",
    blurb: "A free public station directory. No key. Play/stop on the card.",
    license: "Station license varies. Streams are free to hear.",
  },
] as const;

export type MusicPluginId = (typeof MUSIC_PLUGINS)[number]["id"];

export type MusicPrefs = {
  plugin: MusicPluginId;
  stationId: string;
  stationName: string;
  stationUrl: string;
  playing: boolean;
};

export type RadioStation = {
  id: string;
  name: string;
  url: string;
  tags: string;
  city?: string;
  state?: string;
  country?: string;
  countrycode?: string;
  geo_lat?: number;
  geo_long?: number;
};

export type RadioArea = {
  name?: string;
  query?: string;
  lat?: number;
  lon?: number;
  countrycode?: string;
};

export const RADIO_CANT_REACH = "can't reach";
export const RADIO_EMPTY = "no station from that look-up";
export const RADIO_LABEL = "Radio station";
export const RADIO_PLACEHOLDER = "Station, city, or 99.9";
export const RADIO_LOCAL = "Local";
export const HOUSE_LOOP_LICENSE = "CC0 · house-made";
export const RADIO_UA = "ComputerPets/0.2 (https://github.com/RicheyWorks/computerpets)";
export const RADIO_HOSTS = [
  "https://de1.api.radio-browser.info",
  "https://de2.api.radio-browser.info",
  "https://fi1.api.radio-browser.info",
] as const;
export const RADIO_DIR = `${RADIO_HOSTS[0]}/json/stations/search`;

export const KNOWN_PLACES: Record<string, { city: string; state: string; countrycode: string }> = {
  seattle: { city: "Seattle", state: "Washington", countrycode: "US" },
};

const COUNTRY_CODES: Record<string, string> = {
  "united states": "US",
  usa: "US",
  us: "US",
  "united kingdom": "GB",
  uk: "GB",
  canada: "CA",
  australia: "AU",
  germany: "DE",
  france: "FR",
  japan: "JP",
  ireland: "IE",
  mexico: "MX",
};

export type RadioQuery = {
  raw: string;
  freq: string;
  place: string;
  tags: string[];
  tokens: string[];
  city: string;
  state: string;
  countrycode: string;
};

export function blankMusic(): MusicPrefs {
  return { plugin: "off", stationId: "", stationName: "", stationUrl: "", playing: false };
}

export function parseMusic(raw: unknown): MusicPrefs {
  const next = blankMusic();
  if (!raw || typeof raw !== "object") return next;
  const o = raw as Record<string, unknown>;
  const id = String(o.plugin || "");
  next.plugin = MUSIC_PLUGINS.some((p) => p.id === id) ? (id as MusicPluginId) : "off";
  next.stationId = typeof o.stationId === "string" ? o.stationId : "";
  next.stationName = typeof o.stationName === "string" ? o.stationName.slice(0, 80) : "";
  next.stationUrl = safeStream(o.stationUrl);
  next.playing = !!o.playing && next.plugin !== "off";
  return next;
}

export function safeStream(raw: unknown) {
  try {
    const url = new URL(String(raw || ""));
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";
    if (url.username || url.password) return "";
    return url.toString();
  } catch {
    return "";
  }
}

export function musicPreset(id: string | undefined) {
  return MUSIC_PLUGINS.find((p) => p.id === id) ?? MUSIC_PLUGINS[0]!;
}

function countryCodeOf(raw: unknown) {
  const key = String(raw || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  if (!key) return "";
  if (/^[a-z]{2}$/.test(key)) return key.toUpperCase();
  return COUNTRY_CODES[key] || "";
}

export function parseAreaPlace(area?: RadioArea | null) {
  if (!area || typeof area !== "object") return { city: "", state: "", countrycode: "", lat: null as number | null, lon: null as number | null };
  const name = String(area.name || area.query || "")
    .replace(/\s+/g, " ")
    .trim();
  const bits = name
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const city = String(area.query || bits[0] || "").trim();
  let state = "";
  let country = "";
  for (const bit of bits.slice(1)) {
    if (countryCodeOf(bit)) country = bit;
    else if (!state) state = bit;
  }
  const lat = Number(area.lat);
  const lon = Number(area.lon);
  return {
    city,
    state,
    countrycode: countryCodeOf(country) || countryCodeOf(area.countrycode) || "",
    lat: Number.isFinite(lat) ? lat : null,
    lon: Number.isFinite(lon) ? lon : null,
  };
}

function knownPlace(token: string) {
  const key = String(token || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  return KNOWN_PLACES[key] || null;
}

export function resolvePlace(place = "", area?: RadioArea | null) {
  const named = knownPlace(place);
  if (named) return { city: named.city, state: named.state, countrycode: named.countrycode };
  const fromArea = parseAreaPlace(area);
  if (place && fromArea.city && fromArea.city.toLowerCase() === place.toLowerCase()) {
    return { city: fromArea.city, state: fromArea.state, countrycode: fromArea.countrycode };
  }
  if (place) return { city: place, state: "", countrycode: "" };
  return { city: fromArea.city, state: fromArea.state, countrycode: fromArea.countrycode };
}

export function parseRadioQuery(query = "", area?: RadioArea | null): RadioQuery {
  const raw = String(query || "").replace(/\s+/g, " ").trim().slice(0, 80);
  const freqMatch = raw.match(/\b(\d{2,3}\.\d)\b/);
  const freq = freqMatch ? freqMatch[1] : "";
  const tags: string[] = [];
  if (/\bfm\b/i.test(raw)) tags.push("fm");
  if (/\bam\b/i.test(raw)) tags.push("am");
  const tokens = raw
    .toLowerCase()
    .split(/[^a-z0-9.]+/)
    .filter((t) => t && t !== freq && t !== "fm" && t !== "am");
  const place = tokens.find((t) => t.length > 2 && !/^\d/.test(t)) || "";
  const resolved = resolvePlace(place, area);
  return {
    raw,
    freq,
    place,
    tags,
    tokens,
    city: resolved.city,
    state: resolved.state,
    countrycode: resolved.countrycode,
  };
}

function searchParams(extra: Record<string, string>, host?: string) {
  const params = new URLSearchParams({
    limit: "24",
    hidebroken: "true",
    order: "clickcount",
    reverse: "true",
  });
  for (const [k, v] of Object.entries(extra || {})) {
    if (v) params.set(k, String(v).slice(0, 40));
  }
  const base = `${host || RADIO_HOSTS[0]}/json/stations/search`;
  return `${base}?${params.toString()}`;
}

function localAreaParams(area?: RadioArea | null) {
  const place = parseAreaPlace(area);
  if (!place.city && !place.state && !place.countrycode) return null;
  const extra: Record<string, string> = {};
  if (place.city) extra.city = place.city;
  if (place.state) extra.state = place.state;
  if (place.countrycode) extra.countrycode = place.countrycode;
  return extra;
}

export function radioSearchUrl(query = "", area?: RadioArea | null) {
  return radioSearchUrls(query, area)[0] || "";
}

export function radioSearchUrls(query = "", area?: RadioArea | null) {
  const p = parseRadioQuery(query, area);
  const out: string[] = [];
  const add = (extra: Record<string, string>) => {
    if (!extra || !Object.keys(extra).length) return;
    const url = searchParams(extra);
    if (url && !out.includes(url)) out.push(url);
  };
  if (!p.raw) {
    const local = localAreaParams(area);
    if (local) {
      add(local);
      if (local.city) add({ name: local.city, countrycode: local.countrycode || "", state: local.state || "" });
    }
    return out.slice(0, 4);
  }
  if (p.freq && (p.city || p.state || p.countrycode)) {
    add({ name: p.freq, city: p.city, state: p.state, countrycode: p.countrycode });
    add({ name: p.freq, state: p.state, countrycode: p.countrycode });
  }
  if (p.freq) add({ name: p.freq });
  if (p.city || p.state || p.countrycode) {
    add({ city: p.city, state: p.state, countrycode: p.countrycode });
    add({ name: p.city || p.place, state: p.state, countrycode: p.countrycode });
  }
  if (!p.freq && p.raw && !p.place) add({ name: p.raw.slice(0, 40) });
  if (!p.freq && p.raw && p.place && p.tokens.length) {
    const call = p.tokens.find((t) => t.length >= 3 && t !== String(p.city).toLowerCase()) || "";
    if (call) add({ name: call, countrycode: p.countrycode, state: p.state });
  }
  if (!out.length && p.raw) add({ name: p.raw.slice(0, 40) });
  return out.slice(0, 4);
}

export function urlsOnHost(urls: string[], host: string) {
  return (urls || [])
    .map((url) => {
      try {
        const parsed = new URL(url);
        return `${host}${parsed.pathname}${parsed.search}`;
      } catch {
        return "";
      }
    })
    .filter(Boolean);
}

function kmBetween(aLat: number | null, aLon: number | null, bLat: number, bLon: number) {
  if (aLat == null || aLon == null || ![bLat, bLon].every((n) => Number.isFinite(n))) return null;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const s =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return 6371 * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

export function rankStations(stations: RadioStation[], query = "", area?: RadioArea | null) {
  const p = parseRadioQuery(query, area);
  const tokens = [p.freq, p.place, p.city, p.state, p.countrycode, ...p.tokens, ...p.tags].filter(Boolean);
  const list = Array.isArray(stations) ? stations.slice() : [];
  const here = parseAreaPlace(area);
  return list
    .map((st) => {
      const hay = `${st.name || ""} ${st.tags || ""} ${st.state || ""} ${st.country || ""} ${st.countrycode || ""} ${st.city || ""}`.toLowerCase();
      let score = 0;
      for (const t of tokens) {
        if (hay.includes(String(t).toLowerCase())) score += 2;
      }
      if (p.freq && hay.includes(p.freq)) score += 5;
      if (p.place && hay.includes(String(p.place).toLowerCase())) score += 3;
      if (p.city && hay.includes(String(p.city).toLowerCase())) score += 4;
      if (p.state && hay.includes(String(p.state).toLowerCase())) score += 3;
      if (p.countrycode && String(st.countrycode || "").toUpperCase() === p.countrycode) score += 2;
      const km = kmBetween(here.lat, here.lon, Number(st.geo_lat), Number(st.geo_long));
      if (km != null) {
        if (km <= 80) score += 6;
        else if (km <= 250) score += 3;
        else if (km <= 600) score += 1;
      }
      return { st, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((row) => row.st);
}

export function mergeStations(batches: Array<RadioStation[] | null | undefined>) {
  const seen: Record<string, true> = Object.create(null);
  const out: RadioStation[] = [];
  for (const list of batches || []) {
    for (const st of list || []) {
      if (!st || !st.id || seen[st.id]) continue;
      seen[st.id] = true;
      out.push(st);
    }
  }
  return out;
}

export function parseStations(json: unknown): RadioStation[] {
  if (!Array.isArray(json)) return [];
  const out: RadioStation[] = [];
  for (const row of json) {
    if (!row || typeof row !== "object") continue;
    const o = row as Record<string, unknown>;
    const url = safeStream(o.url_resolved || o.url);
    const name = String(o.name || "").replace(/\s+/g, " ").trim().slice(0, 72);
    if (!url || !name) continue;
    out.push({
      id: String(o.stationuuid || o.changeuuid || name),
      name,
      url,
      tags: String(o.tags || "").slice(0, 60),
      city: String(o.city || o.state || "").slice(0, 40),
      state: String(o.state || "").slice(0, 40),
      country: String(o.country || "").slice(0, 40),
      countrycode: String(o.countrycode || "").slice(0, 4),
      geo_lat: Number(o.geo_lat),
      geo_long: Number(o.geo_long),
    });
  }
  return out.slice(0, 24);
}

export function houseLoopSrc() {
  return "/sounds/house-loop.wav";
}

export function overlayHouseLoopSrc() {
  return "sounds/house-loop.wav";
}

export function playSrc(music: MusicPrefs) {
  if (!music.playing || music.plugin === "off") return "";
  if (music.plugin === "house") return houseLoopSrc();
  return music.stationUrl || "";
}

export function overlayPlaySrc(music: MusicPrefs) {
  if (!music.playing || music.plugin === "off") return "";
  if (music.plugin === "house") return overlayHouseLoopSrc();
  return music.stationUrl || "";
}
