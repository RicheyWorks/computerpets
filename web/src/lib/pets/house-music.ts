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
};

export const RADIO_CANT_REACH = "can't reach";
export const RADIO_EMPTY = "no station from that look-up";
export const RADIO_LABEL = "Radio station";
export const RADIO_PLACEHOLDER = "Station, city, or 99.9";
export const HOUSE_LOOP_LICENSE = "CC0 · house-made";
export const RADIO_DIR = "https://de1.api.radio-browser.info/json/stations/search";

export type RadioQuery = {
  raw: string;
  freq: string;
  place: string;
  tags: string[];
  tokens: string[];
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

export function parseRadioQuery(query = ""): RadioQuery {
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
  return { raw, freq, place, tags, tokens };
}

function searchParams(extra: Record<string, string>) {
  const params = new URLSearchParams({
    limit: "16",
    hidebroken: "true",
    order: "clickcount",
    reverse: "true",
  });
  for (const [k, v] of Object.entries(extra || {})) {
    if (v) params.set(k, String(v).slice(0, 40));
  }
  return `${RADIO_DIR}?${params.toString()}`;
}

export function radioSearchUrl(query = "") {
  const p = parseRadioQuery(query);
  if (!p.raw) return searchParams({ tag: "classical" });
  if (p.freq && p.place) return searchParams({ name: p.freq, tag: p.place });
  if (p.freq) return searchParams({ name: p.freq });
  return searchParams({ name: p.raw.slice(0, 40) });
}

export function radioSearchUrls(query = "") {
  const p = parseRadioQuery(query);
  if (!p.raw) return [searchParams({ tag: "classical" })];
  const out: string[] = [];
  const add = (url: string) => {
    if (url && !out.includes(url)) out.push(url);
  };
  add(radioSearchUrl(p.raw));
  if (p.freq) add(searchParams({ name: p.freq }));
  if (p.place) {
    add(searchParams({ name: p.place }));
    add(searchParams({ tag: p.place }));
    add(searchParams({ state: p.place }));
  }
  return out.slice(0, 4);
}

export function rankStations(stations: RadioStation[], query = "") {
  const p = parseRadioQuery(query);
  const tokens = [p.freq, p.place, ...p.tokens, ...p.tags].filter(Boolean);
  const list = Array.isArray(stations) ? stations.slice() : [];
  return list
    .map((st) => {
      const hay = `${st.name || ""} ${st.tags || ""}`.toLowerCase();
      let score = 0;
      for (const t of tokens) {
        if (hay.includes(String(t).toLowerCase())) score += 2;
      }
      if (p.freq && hay.includes(p.freq)) score += 5;
      if (p.place && hay.includes(p.place)) score += 3;
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
    });
  }
  return out.slice(0, 16);
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
