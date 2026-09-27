/** Who is listening on the mind bus. Names only. Never a key, a URL, or a model. */

export type ListenerName = {
  id: string;
  name: string;
  line: string;
};

type Preset = {
  id: string;
  name: string;
  kind: "local" | "openai" | "anthropic" | "gemini" | "ollama" | "custom";
  needsKey: boolean;
  base: string;
};

export const LISTENER_PRESETS: Preset[] = [
  { id: "local", name: "House lines", kind: "local", needsKey: false, base: "" },
  { id: "xai", name: "xAI Grok", kind: "openai", needsKey: true, base: "https://api.x.ai/v1" },
  { id: "openai", name: "OpenAI", kind: "openai", needsKey: true, base: "https://api.openai.com/v1" },
  { id: "anthropic", name: "Anthropic", kind: "anthropic", needsKey: true, base: "https://api.anthropic.com" },
  { id: "google", name: "Google Gemini", kind: "gemini", needsKey: true, base: "https://generativelanguage.googleapis.com/v1beta" },
  { id: "groq", name: "Groq", kind: "openai", needsKey: true, base: "https://api.groq.com/openai/v1" },
  { id: "openrouter", name: "OpenRouter", kind: "openai", needsKey: true, base: "https://openrouter.ai/api/v1" },
  { id: "together", name: "Together", kind: "openai", needsKey: true, base: "https://api.together.xyz/v1" },
  { id: "fireworks", name: "Fireworks", kind: "openai", needsKey: true, base: "https://api.fireworks.ai/inference/v1" },
  { id: "deepseek", name: "DeepSeek", kind: "openai", needsKey: true, base: "https://api.deepseek.com/v1" },
  { id: "mistral", name: "Mistral", kind: "openai", needsKey: true, base: "https://api.mistral.ai/v1" },
  { id: "ollama", name: "Ollama", kind: "ollama", needsKey: false, base: "http://127.0.0.1:11434" },
  { id: "lmstudio", name: "LM Studio", kind: "openai", needsKey: false, base: "http://127.0.0.1:1234/v1" },
  { id: "custom", name: "Custom webhook", kind: "custom", needsKey: false, base: "http://127.0.0.1:8787/mind" },
];

const LOCAL_HOSTS = new Set(["127.0.0.1", "localhost", "::1"]);

export const HOUSE_LISTENER: ListenerName = {
  id: "local",
  name: "House lines",
  line: "Listening · House lines",
};

/** Until the listener read returns (or when it fails): plain words, not "unread". The id stays "unread". */
export const UNREAD_LISTENER: ListenerName = {
  id: "unread",
  name: "not sure",
  line: "Listening · not sure",
};

export type ListenerFacts = {
  door?: "overlay" | "desk" | "blotter";
  plugin?: string | null;
  baseUrl?: string | null;
  /** Strictly true. A key string must not be passed and is not read. */
  hasKey?: boolean;
  signedIn?: boolean;
  /** Plugin id → true when that house env key exists. Never the secret. */
  houseKeys?: Record<string, boolean> | null;
};

function presetById(id: string | null | undefined) {
  return LISTENER_PRESETS.find((p) => p.id === id) ?? null;
}

function isPrivateIpv4(host: string) {
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (!m) return false;
  const a = Number(m[1]);
  const b = Number(m[2]);
  if (a === 10 || a === 0 || a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  return false;
}

function isPrivateHost(host: string) {
  const h = host.toLowerCase().replace(/^\[|\]$/g, "");
  if (LOCAL_HOSTS.has(h)) return true;
  if (h.endsWith(".local") || h.endsWith(".internal")) return true;
  if (h.includes("metadata")) return true;
  if (h.startsWith("fc") || h.startsWith("fd") || h.startsWith("fe80")) return true;
  return isPrivateIpv4(h);
}

function allowLocal(id: string) {
  return id === "ollama" || id === "lmstudio" || id === "custom";
}

export function listenerUrlOk(raw: string, id: string) {
  try {
    const url = new URL(String(raw || "").trim());
    if (url.username || url.password) return false;
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
    if (LOCAL_HOSTS.has(host)) return allowLocal(id);
    if (url.protocol !== "https:") return false;
    if (isPrivateHost(host)) return false;
    return true;
  } catch {
    return false;
  }
}

function named(preset: Preset): ListenerName {
  return { id: preset.id, name: preset.name, line: `Listening · ${preset.name}` };
}

function house(): ListenerName {
  return { ...HOUSE_LISTENER };
}

/**
 * Name the plugin that will actually be asked.
 * Overlay cloud minds need `hasKey === true`. Desk cloud minds need `houseKeys[id] === true`.
 * A guest, the blotter, an unknown plugin, a missing key, or an unsafe URL is House lines.
 */
export function nameListener(input: ListenerFacts | null | undefined): ListenerName {
  const src = input ?? {};
  const door = src.door === "desk" || src.door === "blotter" ? src.door : "overlay";
  if (door === "blotter") return house();
  const signedIn = src.signedIn === true;
  if (door === "desk" && !signedIn) return house();
  const houseKeys = src.houseKeys && typeof src.houseKeys === "object" ? src.houseKeys : {};
  const plugin = typeof src.plugin === "string" ? src.plugin.trim() : "";
  if (door === "desk" && signedIn && !plugin) {
    return houseKeys.xai === true ? named(presetById("xai")!) : house();
  }
  const preset = presetById(plugin);
  if (!preset || preset.kind === "local") return house();
  const base = (typeof src.baseUrl === "string" && src.baseUrl.trim()) || preset.base || "";
  if (!listenerUrlOk(base, preset.id)) return house();
  if (preset.needsKey) {
    if (door === "desk") return houseKeys[preset.id] === true ? named(preset) : house();
    return src.hasKey === true ? named(preset) : house();
  }
  return named(preset);
}

/** Accept a listener payload. Any extra field (a key, a URL) becomes unread. */
export function presentListener(raw: unknown): ListenerName {
  if (!raw || typeof raw !== "object") return { ...UNREAD_LISTENER };
  const row = raw as Record<string, unknown>;
  const extra = Object.keys(row).filter((k) => k !== "id" && k !== "name" && k !== "line");
  if (extra.length) return { ...UNREAD_LISTENER };
  if (row.id === UNREAD_LISTENER.id && row.name === UNREAD_LISTENER.name && row.line === UNREAD_LISTENER.line) {
    return { ...UNREAD_LISTENER };
  }
  const preset = typeof row.id === "string" ? presetById(row.id) : null;
  if (!preset || row.name !== preset.name) return { ...UNREAD_LISTENER };
  const line = `Listening · ${preset.name}`;
  if (row.line !== line) return { ...UNREAD_LISTENER };
  return { id: preset.id, name: preset.name, line };
}
