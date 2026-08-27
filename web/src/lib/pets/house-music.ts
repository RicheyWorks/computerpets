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
export const HOUSE_LOOP_LICENSE = "CC0 · house-made";
export const RADIO_DIR = "https://de1.api.radio-browser.info/json/stations/search";

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

export function radioSearchUrl(query = "") {
  const q = String(query || "").trim().slice(0, 40);
  const params = new URLSearchParams({
    limit: "16",
    hidebroken: "true",
    order: "clickcount",
    reverse: "true",
  });
  if (q) params.set("name", q);
  else params.set("tag", "classical");
  return `${RADIO_DIR}?${params.toString()}`;
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
