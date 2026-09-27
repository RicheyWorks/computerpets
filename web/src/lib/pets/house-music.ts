/** Free music + radio for Rui. Same plugin store shape as the mind bus. Find waits until the radio form shows this computer's network address on that https request. `readRadioSearch` also refuses when that painted line is missing. A host that never answers times out after twelve seconds. That miss rejects so the plate can say can't reach. A late body is not parsed. A timeout does not call the next directory host. `openStationStream` refuses a station audio open when the painted stream-host line is missing. A house loop is not that open. Same map as desktop `house-music.js`. */
import { clientNetLine } from "./weather-areas.ts";

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
  call: string;
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
  if (!place) return { city: fromArea.city, state: fromArea.state, countrycode: fromArea.countrycode };
  const city = String(place)
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
  return { city, state: "", countrycode: "" };
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
  const isCall = (t: string) => /^[kw][a-z0-9]{2,4}$/i.test(t);
  const call = tokens.find(isCall) || "";
  const named = tokens.find((t) => knownPlace(t));
  const places = tokens.filter((t) => t.length > 2 && !/^\d/.test(t) && t !== call);
  const place = named || places[places.length - 1] || "";
  const resolved = resolvePlace(place, area);
  return {
    raw,
    freq,
    place,
    tags,
    tokens,
    call,
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

export const RADIO_NET = clientNetLine("the radio host");
export const RADIO_FIND = `this find sends the station look-up. ${RADIO_NET}`;

export function radioHonesty(): string {
  return RADIO_FIND;
}

/**
 * Radio Browser is called only when the keeper triggers Find or Local
 * and that line is in view. A load does not search. This does not add a tracker.
 */
export function radioMaySend(lineInView: boolean): boolean {
  return lineInView === true && RADIO_FIND.includes(RADIO_NET);
}

/**
 * Radio Browser Find/Local leaves only when the painted line names the radio host.
 * A missing line does not call fetch.
 */
export function radioSearchMayLeave(shown: unknown): boolean {
  return RADIO_FIND.length > 0 && typeof shown === "string" && shown.includes(RADIO_FIND);
}

type RadioFetch = (url: string, init?: RequestInit) => Promise<{ json: () => Promise<unknown> }>;

/** Twelve seconds covers headers and the body. Matches weather page and overlay plate IPC. */
export const RADIO_TIMEOUT_MS = 12_000;

/** A silent radio host. Callers flip the plate to unread / "can't reach". */
export class RadioTimeout extends Error {
  constructor() {
    super("radio request timed out");
    this.name = "RadioTimeout";
  }
}

function isRadioTimeout(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const name = (err as { name?: string }).name;
  const code = (err as { code?: string }).code;
  return name === "RadioTimeout" || name === "AbortError" || name === "TimeoutError" || code === "ABORT_ERR";
}

/**
 * One outbound radio JSON read. The timer covers headers and the body.
 * A timeout rejects with RadioTimeout. The caller does not get a body.
 * A late body after the deadline is not parsed.
 */
function readRadioJson(
  url: string,
  fetchImpl: RadioFetch,
  timeoutMs: number = RADIO_TIMEOUT_MS,
): Promise<unknown | null> {
  if (typeof fetchImpl !== "function") return Promise.reject(new RadioTimeout());

  const ctrl = new AbortController();
  let settled = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  return new Promise((resolve, reject) => {
    timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      ctrl.abort();
      reject(new RadioTimeout());
    }, timeoutMs);

    Promise.resolve()
      .then(() =>
        fetchImpl(url, { cache: "no-store", headers: { Accept: "application/json" }, signal: ctrl.signal }),
      )
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
        if (isRadioTimeout(err)) reject(new RadioTimeout());
        else reject(err);
      });
  });
}

/**
 * The only Radio Browser search. A miss resolves to null and does not call fetch.
 * An empty URL list resolves to []. A hang rejects. A timeout does not call the next directory host.
 * A total unread throws so the plate can say can't reach.
 */
export function readRadioSearch(
  shown: unknown,
  query = "",
  area?: RadioArea | null,
  fetchImpl: RadioFetch = fetch,
  timeoutMs: number = RADIO_TIMEOUT_MS,
): Promise<RadioStation[] | null> {
  if (!radioSearchMayLeave(shown)) return Promise.resolve(null);
  const urls = radioSearchUrls(query, area);
  if (!urls.length) return Promise.resolve([]);
  return Promise.all(
    urls.map((url) =>
      readRadioJson(url, fetchImpl, timeoutMs)
        .then((json) => parseStations(json))
        .catch((err) => {
          if (isRadioTimeout(err)) throw new RadioTimeout();
          return null;
        }),
    ),
  ).then((batches) => {
    if (batches.every((b) => b == null)) throw new Error("unread");
    const merged = mergeStations(batches.filter((b): b is RadioStation[] => !!b));
    return rankStations(merged, query, area).slice(0, 16);
  });
}

export const STREAM_HOST_NAME = "the station stream host";

/** Hostname of a station stream. Empty when the value is not an http(s) stream. */
export function streamHostName(raw: unknown): string {
  const safe = safeStream(raw);
  if (!safe) return "";
  try {
    return new URL(safe).hostname || "";
  } catch {
    return "";
  }
}

/** The actual stream host when known, otherwise the station-stream name. */
export function streamHostLabel(hostname: string): string {
  const host = String(hostname || "").trim();
  return host || STREAM_HOST_NAME;
}

export function streamHostPhrase(music: MusicPrefs | null | undefined): string {
  if (!music || music.plugin !== "radio" || !music.playing) return "";
  const safe = safeStream(music.stationUrl);
  if (!safe) return "";
  return streamHostLabel(streamHostName(safe));
}

export function streamHonesty(music: MusicPrefs | null | undefined): string {
  const host = streamHostPhrase(music);
  if (!host) return "";
  return `this play opens the station stream. ${clientNetLine(host)}`;
}

/**
 * A station stream is opened only when Play (or a station pick) has put that
 * line in view. A load does not open it. A house loop is not this send.
 */
export function streamMaySend(music: MusicPrefs | null | undefined, lineInView: boolean): boolean {
  const host = streamHostPhrase(music);
  const line = streamHonesty(music);
  if (!host || !line || lineInView !== true) return false;
  return line.includes(clientNetLine(host));
}

/**
 * A station stream leaves only when the painted line names that stream host.
 * The radio-find sentence, another host's line, and a missing line do not count.
 */
export function streamMayLeave(shown: unknown, music: MusicPrefs | null | undefined): boolean {
  const line = streamHonesty(music);
  if (!line || typeof shown !== "string") return false;
  return shown.includes(line);
}

/**
 * The only station-stream open. A miss returns null and does not construct Audio
 * or assign src. A house loop is not this open.
 */
export function openStationStream<T>(
  shown: unknown,
  music: MusicPrefs | null | undefined,
  src: string,
  makeAudio: (src: string) => T,
): T | null {
  if (!streamMayLeave(shown, music) || !src || typeof makeAudio !== "function") return null;
  return makeAudio(src);
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
  if (p.call) add({ name: p.call.toUpperCase(), countrycode: p.countrycode, state: p.state });
  if (!p.freq && p.raw && !p.place && !p.call) add({ name: p.raw.slice(0, 40) });
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

/** The guest whose keeper card carries the full music block (plugins, radio find). */
export const HOUSE_MUSIC_OWNER = "red_panda";
/** The small shared Pause/Play on every other guest's card. */
export const HOUSE_MUSIC_LABEL = "House music";

/**
 * Show the shared Pause/Play when the owner's block is not on screen and there
 * is something to play: the house loop or a picked station. Radio with no
 * station yet stays hidden (only the owner's block can find one).
 */
export function sharedMusicShows(guestKey: string | null | undefined, music: MusicPrefs | null | undefined): boolean {
  if (!music || guestKey === HOUSE_MUSIC_OWNER) return false;
  if (music.plugin === "house") return true;
  return music.plugin === "radio" && !!music.stationUrl;
}

/** What the shared Pause/Play shows and commits. Same rule as the owner's Play button. */
export function houseMusicToggle(music: MusicPrefs, streamAsked: boolean) {
  const remote = music.plugin === "radio" && !!music.stationUrl;
  const audible = !!music.playing && music.plugin !== "off" && (!remote || streamAsked);
  return {
    audible,
    label: audible ? "Pause music" : "Play music",
    next: { ...music, playing: !audible && music.plugin !== "off" } as MusicPrefs,
  };
}
