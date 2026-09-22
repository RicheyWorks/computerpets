(function () {
  const KEY = "computerpets.mind.v1";
  const PRESETS = [
    { id: "local", name: "House lines", kind: "local" },
    { id: "xai", name: "xAI Grok", kind: "openai", base: "https://api.x.ai/v1", model: "grok-4.5" },
    { id: "openai", name: "OpenAI", kind: "openai", base: "https://api.openai.com/v1", model: "gpt-4.1-mini" },
    { id: "anthropic", name: "Anthropic", kind: "anthropic", base: "https://api.anthropic.com", model: "claude-sonnet-4-5" },
    { id: "google", name: "Google Gemini", kind: "gemini", base: "https://generativelanguage.googleapis.com/v1beta", model: "gemini-2.5-flash" },
    { id: "groq", name: "Groq", kind: "openai", base: "https://api.groq.com/openai/v1", model: "llama-3.3-70b-versatile" },
    { id: "openrouter", name: "OpenRouter", kind: "openai", base: "https://openrouter.ai/api/v1", model: "x-ai/grok-4.5" },
    { id: "together", name: "Together", kind: "openai", base: "https://api.together.xyz/v1", model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo" },
    { id: "fireworks", name: "Fireworks", kind: "openai", base: "https://api.fireworks.ai/inference/v1", model: "accounts/fireworks/models/llama-v3p1-70b-instruct" },
    { id: "deepseek", name: "DeepSeek", kind: "openai", base: "https://api.deepseek.com/v1", model: "deepseek-chat" },
    { id: "mistral", name: "Mistral", kind: "openai", base: "https://api.mistral.ai/v1", model: "mistral-small-latest" },
    { id: "ollama", name: "Ollama", kind: "ollama", base: "http://127.0.0.1:11434", model: "llama3.2" },
    { id: "lmstudio", name: "LM Studio", kind: "openai", base: "http://127.0.0.1:1234/v1", model: "local-model" },
    { id: "custom", name: "Custom webhook", kind: "custom", base: "http://127.0.0.1:8787/mind", model: "default" },
  ];

  function browserCopy(mind) {
    const src = mind && typeof mind === "object" ? mind : {};
    const petsIn = src.pets && typeof src.pets === "object" ? src.pets : {};
    const pets = {};
    Object.keys(petsIn).forEach((name) => {
      const row = petsIn[name] && typeof petsIn[name] === "object" ? petsIn[name] : {};
      const next = {};
      if (typeof row.plugin === "string") next.plugin = row.plugin;
      if (typeof row.model === "string") next.model = row.model;
      if (typeof row.baseUrl === "string") next.baseUrl = scrubSecretQueryString(row.baseUrl);
      pets[name] = next;
    });
    const def = src.default && typeof src.default === "object" ? src.default : {};
    const defaults = { plugin: typeof def.plugin === "string" && def.plugin ? def.plugin : "local" };
    if (typeof def.model === "string") defaults.model = def.model;
    if (typeof def.baseUrl === "string") defaults.baseUrl = scrubSecretQueryString(def.baseUrl);
    return {
      default: defaults,
      voice: typeof src.voice === "string" ? src.voice : "browser",
      pets,
    };
  }

  let pageMind = null;

  function readStore(store) {
    try {
      if (!store || typeof store.getItem !== "function") return null;
      const parsed = JSON.parse(store.getItem(KEY) || "null");
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
      return null;
    }
  }

  function plainKey(raw) {
    if (!raw || typeof raw !== "object") return false;
    const def = raw.default;
    if (def && typeof def.apiKey === "string" && def.apiKey.trim()) return true;
    const pets = raw.pets;
    if (!pets || typeof pets !== "object") return false;
    return Object.keys(pets).some((name) => {
      const row = pets[name];
      return row && typeof row.apiKey === "string" && row.apiKey.trim();
    });
  }

  function scrubStore(store, drop) {
    if (!store || typeof store.getItem !== "function") return;
    try {
      const raw = JSON.parse(store.getItem(KEY) || "null");
      if (!raw || typeof raw !== "object") {
        if (store.getItem(KEY)) store.removeItem(KEY);
        return;
      }
      if (drop) {
        store.removeItem(KEY);
        return;
      }
      store.setItem(KEY, JSON.stringify(browserCopy(raw)));
    } catch {
      try {
        store.removeItem(KEY);
      } catch {
        /* ignore */
      }
    }
  }

  function scrubBrowser() {
    try {
      scrubStore(localStorage, false);
    } catch {
      /* ignore */
    }
    try {
      if (typeof sessionStorage !== "undefined") scrubStore(sessionStorage, true);
    } catch {
      /* ignore */
    }
  }

  function scrubBindingUrl(row) {
    if (!row || typeof row !== "object" || typeof row.baseUrl !== "string") return;
    row.baseUrl = scrubSecretQueryString(row.baseUrl);
  }

  function scrubMindBaseUrls(mind) {
    if (!mind || typeof mind !== "object") return mind;
    scrubBindingUrl(mind.default);
    const pets = mind.pets;
    if (pets && typeof pets === "object") {
      Object.keys(pets).forEach((name) => scrubBindingUrl(pets[name]));
    }
    return mind;
  }

  function load() {
    if (window.desk?.mindGet) {
      try {
        scrubBrowser();
        pageMind = null;
        return scrubMindBaseUrls(window.desk.mindGet() || { default: { plugin: "local" }, voice: "browser", pets: {} });
      } catch {
        /* fall through */
      }
    }
    if (pageMind) return pageMind;
    const localRaw = readStore(typeof localStorage !== "undefined" ? localStorage : null);
    const sessionRaw = readStore(typeof sessionStorage !== "undefined" ? sessionStorage : null);
    const source = localRaw || sessionRaw || { default: { plugin: "local" }, voice: "browser", pets: {} };
    scrubBrowser();
    pageMind = scrubMindBaseUrls(source);
    if (!pageMind.keyKept) pageMind.keyKept = plainKey(source) ? "none" : "empty";
    return pageMind;
  }

  function save(next) {
    const mind = scrubMindBaseUrls(
      next && typeof next === "object" ? next : { default: { plugin: "local" }, voice: "browser", pets: {} },
    );
    if (window.desk?.mindSet) {
      pageMind = null;
      try {
        localStorage.setItem(KEY, JSON.stringify(browserCopy(mind)));
      } catch {
        /* ignore */
      }
      try {
        if (typeof sessionStorage !== "undefined") scrubStore(sessionStorage, true);
      } catch {
        /* ignore */
      }
      return Promise.resolve(window.desk.mindSet(mind)).then(
        (result) => (result && typeof result === "object" ? result : { kept: "os" }),
        () => ({ kept: "none" }),
      );
    }
    pageMind = mind;
    const kept = plainKey(pageMind) ? "none" : "empty";
    pageMind.keyKept = kept;
    try {
      localStorage.setItem(KEY, JSON.stringify(browserCopy(pageMind)));
    } catch {
      /* ignore */
    }
    try {
      if (typeof sessionStorage !== "undefined") scrubStore(sessionStorage, true);
    } catch {
      /* ignore */
    }
    return Promise.resolve({ kept });
  }

  // Same names as web/src/lib/ai/secret-query.mjs. Desk talk uses that module.
  const SECRET_QUERY_NAMES = new Set([
    "key",
    "api_key",
    "apikey",
    "access_token",
    "refresh_token",
    "id_token",
    "token",
    "secret",
    "client_secret",
    "x_goog_api_key",
    "x_api_key",
    "auth",
    "authorization",
    "bearer",
  ]);

  function isSecretQueryName(name) {
    return SECRET_QUERY_NAMES.has(String(name || "").trim().toLowerCase().replace(/-/g, "_"));
  }

  function hashCarriesSecretQuery(hash) {
    const body = String(hash || "").replace(/^#\??/, "");
    if (!body) return false;
    const params = new URLSearchParams(body);
    let dirty = false;
    params.forEach((_, name) => {
      if (isSecretQueryName(name)) dirty = true;
    });
    return dirty;
  }

  function stripSecretQuery(url) {
    const names = new Set();
    url.searchParams.forEach((_, name) => names.add(name));
    names.forEach((name) => {
      if (isSecretQueryName(name)) url.searchParams.delete(name);
    });
    if (hashCarriesSecretQuery(url.hash)) url.hash = "";
  }

  function scrubSecretQueryString(raw) {
    const trimmed = String(raw || "").trim();
    if (!trimmed) return trimmed;
    let url;
    try {
      url = new URL(trimmed);
    } catch {
      return trimmed;
    }
    const before = url.toString();
    stripSecretQuery(url);
    const after = url.toString();
    return after === before ? trimmed : after;
  }

  function sanitizeModel(raw, fallback) {
    const fb = String(fallback || "");
    const value = String(raw || fb).trim();
    if (!value || value.includes("..") || value.includes("\\")) return fb;
    if (!/^[a-zA-Z0-9._:/-]{1,80}$/.test(value)) return fb;
    return value;
  }

  function pluginRequestUrl(base, suffix) {
    const url = new URL(base);
    stripSecretQuery(url);
    if (suffix) {
      const extra = String(suffix).startsWith("/") ? String(suffix) : `/${suffix}`;
      url.pathname = `${url.pathname.replace(/\/$/, "")}${extra}`;
    }
    stripSecretQuery(url);
    return url.toString();
  }

  function safeUrl(raw, id) {
    try {
      const url = new URL(String(raw || ""));
      if (url.username || url.password) return "";
      const host = url.hostname.replace(/^\[|\]$/g, "");
      const local = host === "127.0.0.1" || host === "localhost" || host === "::1";
      if (local) {
        if (!(id === "ollama" || id === "lmstudio" || id === "custom")) return "";
        stripSecretQuery(url);
        return url.toString().replace(/\/$/, "");
      }
      if (url.protocol !== "https:") return "";
      if (/^(10|127|0)\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[0-1])\./.test(host)) return "";
      stripSecretQuery(url);
      return url.toString().replace(/\/$/, "");
    } catch {
      return "";
    }
  }

  function preset(id) {
    return PRESETS.find((p) => p.id === id) || PRESETS[0];
  }

  function binding(species) {
    const s = load();
    return s.pets?.[species] || s.default || { plugin: "local" };
  }

  function clip(t) {
    return String(t || "")
      .replace(/^["']|["']$/g, "")
      .trim()
      .slice(0, 220);
  }

  function userTurn(ctx) {
    return `Your name is ${ctx.name}. Hunger ${ctx.hunger}/100, mood ${ctx.mood}/100, energy ${ctx.energy}/100. ${
      ctx.message ? `The keeper says: ${ctx.message}` : "The keeper is nearby. Say something small."
    }`;
  }

  async function run(ctx) {
    const bind = binding(ctx.species);
    const p = preset(bind.plugin);
    const base = safeUrl(bind.baseUrl || p.base || "", p.id);
    const model = sanitizeModel(bind.model, p.model);
    const key = bind.apiKey || "";
    if (p.kind === "local") return { text: ctx.fallback, source: "local" };
    if (!base && p.kind !== "local") return { text: ctx.fallback, source: "local" };
    try {
      if (p.kind === "openai") {
        const res = await fetch(pluginRequestUrl(base, "/chat/completions"), {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(key ? { Authorization: `Bearer ${key}` } : {}) },
          body: JSON.stringify({
            model,
            max_tokens: 80,
            temperature: 0.9,
            messages: [
              { role: "system", content: ctx.system },
              { role: "user", content: userTurn(ctx) },
            ],
          }),
        });
        const body = await res.json();
        const text = clip(body.choices?.[0]?.message?.content);
        if (text) return { text, source: p.id };
      } else if (p.kind === "anthropic") {
        const res = await fetch(pluginRequestUrl(base, "/v1/messages"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": key,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model,
            max_tokens: 80,
            system: ctx.system,
            messages: [{ role: "user", content: userTurn(ctx) }],
          }),
        });
        const body = await res.json();
        const text = clip(body.content?.[0]?.text);
        if (text) return { text, source: p.id };
      } else if (p.kind === "ollama") {
        const res = await fetch(pluginRequestUrl(base, "/api/chat"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model,
            stream: false,
            messages: [
              { role: "system", content: ctx.system },
              { role: "user", content: userTurn(ctx) },
            ],
          }),
        });
        const body = await res.json();
        const text = clip(body.message?.content);
        if (text) return { text, source: p.id };
      } else if (p.kind === "gemini") {
        const res = await fetch(pluginRequestUrl(base, `/models/${model}:generateContent`), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(key ? { "x-goog-api-key": key } : {}),
          },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: ctx.system }] },
            contents: [{ role: "user", parts: [{ text: userTurn(ctx) }] }],
            generationConfig: { maxOutputTokens: 80, temperature: 0.9 },
          }),
        });
        const body = await res.json();
        const text = clip(body.candidates?.[0]?.content?.parts?.[0]?.text);
        if (text) return { text, source: p.id };
      } else if (p.kind === "custom") {
        const res = await fetch(pluginRequestUrl(base), {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(key ? { Authorization: `Bearer ${key}` } : {}) },
          body: JSON.stringify({
            name: ctx.name,
            species: ctx.species,
            system: ctx.system,
            user: userTurn(ctx),
            stats: { hunger: ctx.hunger, mood: ctx.mood, energy: ctx.energy },
            message: ctx.message ?? null,
          }),
        });
        const body = await res.json();
        const text = clip(body.text || body.content);
        if (text) return { text, source: "custom" };
      }
    } catch {
      /* house lines */
    }
    return { text: ctx.fallback, source: "local" };
  }

  window.PetMind = { PRESETS, load, save, preset, binding, run };
})();
