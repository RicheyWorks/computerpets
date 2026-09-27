/** Who is listening on the mind bus. Names only. Never a key, a URL, or a model. */
(function (root) {
  const PRESETS = [
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
  const HOUSE = { id: "local", name: "House lines", line: "Listening · House lines" };
  const UNREAD = { id: "unread", name: "not sure", line: "Listening · not sure" };

  function presetById(id) {
    return PRESETS.find((p) => p.id === id) || null;
  }

  function isPrivateIpv4(host) {
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

  function isPrivateHost(host) {
    const h = String(host || "").toLowerCase().replace(/^\[|\]$/g, "");
    if (LOCAL_HOSTS.has(h)) return true;
    if (h.endsWith(".local") || h.endsWith(".internal")) return true;
    if (h.includes("metadata")) return true;
    if (h.startsWith("fc") || h.startsWith("fd") || h.startsWith("fe80")) return true;
    return isPrivateIpv4(h);
  }

  function allowLocal(id) {
    return id === "ollama" || id === "lmstudio" || id === "custom";
  }

  function urlOk(raw, id) {
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

  function named(preset) {
    return { id: preset.id, name: preset.name, line: "Listening · " + preset.name };
  }

  /**
   * Name the plugin that will actually be asked.
   * `hasKey` must be strictly true — a key string does not count and is never copied.
   * Desk cloud plugins listen only when `houseKeys[id] === true`.
   * Guests and the blotter are House lines.
   */
  function nameListener(input) {
    const src = input && typeof input === "object" ? input : {};
    const door = src.door === "desk" || src.door === "blotter" ? src.door : "overlay";
    if (door === "blotter") return { ...HOUSE };
    const signedIn = src.signedIn === true;
    if (door === "desk" && !signedIn) return { ...HOUSE };
    const houseKeys = src.houseKeys && typeof src.houseKeys === "object" ? src.houseKeys : {};
    const plugin = typeof src.plugin === "string" ? src.plugin.trim() : "";
    if (door === "desk" && signedIn && !plugin) {
      return houseKeys.xai === true ? named(presetById("xai")) : { ...HOUSE };
    }
    const preset = presetById(plugin);
    if (!preset || preset.kind === "local") return { ...HOUSE };
    const base = (typeof src.baseUrl === "string" && src.baseUrl.trim()) || preset.base || "";
    if (!urlOk(base, preset.id)) return { ...HOUSE };
    if (preset.needsKey) {
      if (door === "desk") return houseKeys[preset.id] === true ? named(preset) : { ...HOUSE };
      return src.hasKey === true ? named(preset) : { ...HOUSE };
    }
    return named(preset);
  }

  function presentListener(raw) {
    if (!raw || typeof raw !== "object") return { ...UNREAD };
    const keys = Object.keys(raw);
    if (keys.some((k) => k !== "id" && k !== "name" && k !== "line")) return { ...UNREAD };
    if (raw.id === UNREAD.id && raw.name === UNREAD.name && raw.line === UNREAD.line) return { ...UNREAD };
    const preset = typeof raw.id === "string" ? presetById(raw.id) : null;
    if (!preset || raw.name !== preset.name) return { ...UNREAD };
    const line = "Listening · " + preset.name;
    if (raw.line !== line) return { ...UNREAD };
    return { id: preset.id, name: preset.name, line };
  }

  const api = {
    PRESETS,
    HOUSE,
    UNREAD,
    presetById,
    urlOk,
    nameListener,
    presentListener,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetListener = api;
})(typeof window !== "undefined" ? window : globalThis);
