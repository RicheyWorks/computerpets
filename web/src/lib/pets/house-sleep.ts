/** House sleep-aid beds. Local file, same door as the house loop. Same map as desktop `house-sleep.js`. Not radio. */

export const SLEEP_AID_PLUGINS = [
  { id: "off" as const, name: "Off", blurb: "No sleep aid.", license: "" },
  {
    id: "rain" as const,
    name: "Rain and thunder",
    blurb: "A house-made storm bed. About three minutes, then it loops.",
    license: "CC0 · house-made",
  },
] as const;

export type SleepAidPluginId = (typeof SLEEP_AID_PLUGINS)[number]["id"];

export type SleepAidPrefs = {
  plugin: SleepAidPluginId;
  playing: boolean;
};

export const SLEEP_AID_LABEL = "Sleep aid";
export const SLEEP_AID_LICENSE = "CC0 · house-made";
export const SLEEP_AID_MUTE_TRUTH = "Music mute also quiets the bed.";
export const SLEEP_AID_SECONDS = 180;
export const SLEEP_RAIN_FILE = "sleep-rain.ogg";

export function blankSleepAid(): SleepAidPrefs {
  return { plugin: "off", playing: false };
}

export function parseSleepAid(raw: unknown): SleepAidPrefs {
  const next = blankSleepAid();
  if (!raw || typeof raw !== "object") return next;
  const o = raw as Record<string, unknown>;
  const id = String(o.plugin || "");
  next.plugin = SLEEP_AID_PLUGINS.some((p) => p.id === id) ? (id as SleepAidPluginId) : "off";
  next.playing = !!o.playing && next.plugin !== "off";
  return next;
}

export function sleepAidPreset(id: string | undefined) {
  return SLEEP_AID_PLUGINS.find((p) => p.id === id) ?? SLEEP_AID_PLUGINS[0]!;
}

export function shouldPlay(aid: unknown, mutes?: { music?: boolean } | null) {
  const next = parseSleepAid(aid);
  if (!next.playing || next.plugin === "off") return false;
  if (mutes && mutes.music) return false;
  return true;
}

export function rainSrc() {
  return `/sounds/${SLEEP_RAIN_FILE}`;
}

export function overlayRainSrc() {
  return `sounds/${SLEEP_RAIN_FILE}`;
}

export function playSrc(aid: SleepAidPrefs) {
  const next = parseSleepAid(aid);
  if (!next.playing || next.plugin === "off") return "";
  if (next.plugin === "rain") return rainSrc();
  return "";
}

export function overlayPlaySrc(aid: SleepAidPrefs) {
  const next = parseSleepAid(aid);
  if (!next.playing || next.plugin === "off") return "";
  if (next.plugin === "rain") return overlayRainSrc();
  return "";
}

type SleepAudio = {
  src: string;
  loop: boolean;
  volume: number;
  dataset: { src?: string };
  pause: () => void;
  play: () => Promise<void> | void;
};

export function applySleepAid(
  node: SleepAudio | null,
  aid: unknown,
  mutes: { music?: boolean } | null | undefined,
  volume: number,
  opts?: {
    srcOf?: (next: SleepAidPrefs) => string;
    makeAudio?: (src: string) => SleepAudio;
  },
): SleepAudio | null {
  const pickSrc = opts?.srcOf ?? overlayPlaySrc;
  const src = shouldPlay(aid, mutes) ? pickSrc(parseSleepAid(aid)) : "";
  if (!src) {
    if (node) {
      node.pause();
      node.src = "";
    }
    return null;
  }
  const vol = Math.max(0, Math.min(1, Number(volume) || 0));
  if (node && node.dataset?.src === src) {
    node.volume = vol;
    return node;
  }
  if (node) {
    node.pause();
    node.src = "";
  }
  const makeAudio =
    opts?.makeAudio ??
    (typeof Audio !== "undefined" ? (nextSrc: string) => new Audio(nextSrc) as unknown as SleepAudio : undefined);
  if (!makeAudio) return null;
  const next = makeAudio(src);
  if (!next.dataset) next.dataset = {};
  next.dataset.src = src;
  next.loop = true;
  next.volume = vol;
  const played = next.play();
  if (played && typeof played.catch === "function") played.catch(() => {});
  return next;
}
