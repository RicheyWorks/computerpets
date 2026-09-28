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
      if (typeof row.model === "string") {
        const model = scrubSecretModel(row.model);
        if (model) next.model = model;
        else if (row.model.trim()) next.model = "";
      }
      if (typeof row.baseUrl === "string") next.baseUrl = scrubSecretQueryString(row.baseUrl);
      pets[name] = next;
    });
    const def = src.default && typeof src.default === "object" ? src.default : {};
    const defaults = { plugin: typeof def.plugin === "string" && def.plugin ? def.plugin : "local" };
    if (typeof def.model === "string") {
      const model = scrubSecretModel(def.model);
      if (model) defaults.model = model;
      else if (def.model.trim()) defaults.model = "";
    }
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

  function scrubBindingModel(row) {
    if (!row || typeof row !== "object" || typeof row.model !== "string") return;
    const model = scrubSecretModel(row.model);
    if (model) row.model = model;
    else if (row.model.trim()) row.model = "";
  }

  function scrubMindBaseUrls(mind) {
    if (!mind || typeof mind !== "object") return mind;
    scrubBindingUrl(mind.default);
    scrubBindingModel(mind.default);
    const pets = mind.pets;
    if (pets && typeof pets === "object") {
      Object.keys(pets).forEach((name) => {
        scrubBindingUrl(pets[name]);
        scrubBindingModel(pets[name]);
      });
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
        () => ({ kept: "none", saved: false }),
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

  /** Longest name first so `api_key` wins over `key`. */
  function secretNameSource() {
    return [...SECRET_QUERY_NAMES]
      .sort((a, b) => b.length - a.length)
      .map((name) => name.replace(/_/g, "[-_]"))
      .join("|");
  }

  /**
   * Strip `key=value` (and the same secret-name family) from a string.
   * A string with no such assignment is returned as typed.
   */
  function stripSecretAssignments(text) {
    const source = String(text);
    const decoded = source.replace(/%3D/gi, "=").replace(/%3F/gi, "?").replace(/%26/gi, "&");
    const re = new RegExp(`(^|[^A-Za-z0-9_])(?:${secretNameSource()})=([^&#\\s/]*)`, "gi");
    if (!re.test(decoded)) return source;
    re.lastIndex = 0;
    let out = decoded.replace(re, (_match, boundary) => boundary || "");
    out = out.replace(/\?&+/g, "?").replace(/&&+/g, "&").replace(/[?&#]+$/g, "");
    return out;
  }

  /**
   * A path segment that is clearly a pasted key.
   * A version, a UUID, a dotted model id, and lowercase hyphen-words stay.
   */
  function isPastedKeySegment(seg) {
    if (!seg) return false;
    if (
      /^(?:sk-(?:ant-)?[A-Za-z0-9_-]{10,}|AIza[0-9A-Za-z_-]{20,}|xai-[A-Za-z0-9_-]{10,}|gh[pousr]_[A-Za-z0-9]{16,}|github_pat_[A-Za-z0-9_]{16,}|ya29\.[0-9A-Za-z_-]{10,})/.test(
        seg,
      )
    ) {
      return true;
    }
    if (/^[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}$/.test(seg)) return true;
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(seg)) return false;
    if (seg.length < 32) return false;
    if (!/^[A-Za-z0-9_-]+$/.test(seg)) return false;
    if (!/[A-Za-z]/.test(seg) || !/\d/.test(seg)) return false;
    if (/^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(seg)) return false;
    return true;
  }

  /** The segment after `/key/` when that segment is the pasted secret. */
  function isSecretPathValue(seg) {
    if (!seg) return false;
    if (isPastedKeySegment(seg)) return true;
    if (/[.:]/.test(seg) || /^v\d/i.test(seg)) return false;
    if (seg.length <= 24 && /^[A-Za-z][A-Za-z0-9-]*$/.test(seg) && !/\d/.test(seg) && !/[A-Z]/.test(seg.slice(1))) {
      return false;
    }
    return seg.length >= 12 && /[A-Z]/.test(seg) && /[a-z]/.test(seg) && /^[A-Za-z0-9_-]+$/.test(seg);
  }

  function decodeSeg(part) {
    if (!part) return "";
    try {
      return decodeURIComponent(part);
    } catch {
      return part;
    }
  }

  function scrubSecretPath(url) {
    const decoded = url.pathname.split("/").map(decodeSeg);
    const keep = [];
    for (let i = 0; i < decoded.length; i++) {
      const seg = decoded[i];
      if (seg === "") {
        keep.push("");
        continue;
      }
      const cleaned = stripSecretAssignments(seg);
      if (cleaned !== seg) {
        if (cleaned) keep.push(cleaned);
        continue;
      }
      if (isPastedKeySegment(seg)) continue;
      const next = decoded[i + 1];
      if (next && isSecretQueryName(seg) && isSecretPathValue(next)) {
        i += 1;
        continue;
      }
      keep.push(seg);
    }
    const before = decoded.join("/");
    let after = keep.join("/");
    if (after === before) return;
    if (!after.startsWith("/")) after = `/${after}`;
    if (after === "/") after = "/";
    url.pathname = after || "/";
  }

  function stripUserinfo(url) {
    if (url.username) url.username = "";
    if (url.password) url.password = "";
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

  /** Drop userinfo, a pasted key path, and a pasted `key` / `api_key` query from a URL. */
  function stripSecretQuery(url) {
    stripUserinfo(url);
    scrubSecretPath(url);
    const names = new Set();
    url.searchParams.forEach((_, name) => names.add(name));
    for (const name of names) {
      if (isSecretQueryName(name)) url.searchParams.delete(name);
    }
    if (hashCarriesSecretQuery(url.hash)) url.hash = "";
  }

  /**
   * Same drop, on a base URL string the desk is about to store or post.
   * A URL with nothing to drop is returned as typed.
   * A non-URL loses `key=` / `api_key=` (and the same secret-name family) and is otherwise left as typed.
   */
  function scrubSecretQueryString(raw) {
    const trimmed = String(raw || "").trim();
    if (!trimmed) return trimmed;
    let url;
    try {
      url = new URL(trimmed);
    } catch {
      return stripSecretAssignments(trimmed).trim();
    }
    const before = url.toString();
    stripSecretQuery(url);
    const after = url.toString();
    return after === before ? trimmed : after;
  }

  /**
   * True when a model field is a pasted secret, not a model id.
   * `sk-…`, a `key=` / `api_key=` assignment, query-like junk, and a long token count.
   * `gemini-2.5-flash`, `gpt-4o`, `claude-sonnet-4-5`, and a slash model path do not.
   */
  function isSecretModel(raw) {
    const value = String(raw || "").trim();
    if (!value) return false;
    if (/[?&#]/.test(value) || /%(?:3[DdFf]|26)/i.test(value)) return true;
    const decoded = value.replace(/%3D/gi, "=").replace(/%3F/gi, "?").replace(/%26/gi, "&");
    const assigned = new RegExp(`(^|[^A-Za-z0-9_])(?:${secretNameSource()})=`, "i");
    if (assigned.test(decoded)) return true;
    if (isPastedKeySegment(value)) return true;
    const parts = value.split("/");
    for (let i = 0; i < parts.length; i += 1) {
      if (isPastedKeySegment(parts[i])) return true;
    }
    return false;
  }

  /**
   * Drop a pasted secret in the model field.
   * A normal model id is returned trimmed.
   * A secret becomes `fallback`, or empty when the caller is about to store.
   */
  function scrubSecretModel(raw, fallback) {
    const fb = arguments.length > 1 && fallback != null ? String(fallback) : "";
    const value = String(raw || "").trim();
    if (!value || isSecretModel(value)) return fb;
    return value;
  }

  function sanitizeModel(raw, fallback) {
    const fb = String(fallback || "");
    const value = String(raw || fb).trim();
    if (!value || value.includes("..") || value.includes("\\")) return fb;
    if (isSecretModel(value)) return fb;
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
      stripSecretQuery(url);
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

  /**
   * One plain sentence for an AI website address talk would refuse, or "" when talk can use it.
   * Same rules as safeUrl, so Minds never says "Saved" for a mind that falls back to house lines.
   */
  function baseUrlProblem(raw, id) {
    const text = String(raw == null ? "" : raw).trim();
    const p = preset(id);
    if (!text || p.kind === "local") return "";
    let url;
    try {
      url = new URL(text);
    } catch {
      return "That is not a web address. Copy the AI website address from that AI website's own page. It starts with https.";
    }
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return "That is not a web address. Copy the AI website address from that AI website's own page. It starts with https.";
    }
    if (url.username || url.password) {
      return "Take the name and password out of the AI website address. They are never saved, so put your key in the \"Your key for that AI website\" box instead.";
    }
    const host = url.hostname.replace(/^\[|\]$/g, "");
    const local = host === "127.0.0.1" || host === "localhost" || host === "::1";
    if (local) {
      if (!(p.id === "ollama" || p.id === "lmstudio" || p.id === "custom")) {
        return "An AI website address on this computer only works with Ollama, LM Studio, or Custom. Pick one of those, or use that AI website's https address.";
      }
      return "";
    }
    if (url.protocol !== "https:") return "The AI website address must start with https:// so your key is not sent in the open.";
    if (/^(10|127|0)\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[0-1])\./.test(host)) {
      return "The AI website address points at a private network address, inside a home or office network. Talk only goes to a public https address or to this computer.";
    }
    return safeUrl(text, p.id) ? "" : "That is not a web address. Copy the AI website address from that AI website's own page. It starts with https.";
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

  const TALK_HOST_NAME = "the talk host";
  // Plain names for the AI websites the mind page offers; any other host is named as typed. Same as web talk-net.ts.
  const AI_SITES = new Map([
    ["api.x.ai", "xAI"],
    ["api.openai.com", "OpenAI"],
    ["api.anthropic.com", "Anthropic"],
    ["generativelanguage.googleapis.com", "Google Gemini"],
    ["api.groq.com", "Groq"],
    ["openrouter.ai", "OpenRouter"],
    ["api.together.xyz", "Together AI"],
    ["api.fireworks.ai", "Fireworks AI"],
    ["api.deepseek.com", "DeepSeek"],
    ["api.mistral.ai", "Mistral"],
  ]);
  const AI_SITE_KIND = "an AI website";
  const AI_SITE_OWN = "the AI website you set up";

  function aiSite(host) {
    const h = String(host || "").toLowerCase();
    const known = AI_SITES.get(h);
    if (known) return { name: known, who: `${known}, ${AI_SITE_KIND}` };
    if (h && h !== TALK_HOST_NAME) return { name: h, who: `${h}, ${AI_SITE_OWN}` };
    return { name: AI_SITE_OWN, who: AI_SITE_OWN };
  }

  // The kid-plain address sentence from weather-areas.js (plainNetLine), naming the AI website.
  function weatherNet(name) {
    const root = typeof window !== "undefined" ? window : globalThis;
    const areas = root.PetWeatherAreas;
    if (!areas || typeof areas.plainNetLine !== "function") return "";
    return areas.plainNetLine(name);
  }

  function talkHostName(raw) {
    try {
      return new URL(String(raw || "")).hostname.replace(/^\[|\]$/g, "") || "";
    } catch (err) {
      return "";
    }
  }

  function isLoopbackHost(host) {
    const name = String(host || "").toLowerCase();
    return name === "127.0.0.1" || name === "localhost" || name === "::1";
  }

  function talkTarget(bind) {
    const row = bind && typeof bind === "object" ? bind : {};
    const p = preset(row.plugin);
    if (!p || p.kind === "local") return null;
    const base = safeUrl(row.baseUrl || p.base || "", p.id);
    if (!base) return null;
    const host = talkHostName(base);
    return { local: isLoopbackHost(host), label: host || TALK_HOST_NAME };
  }

  function talkHonesty(bind) {
    const target = talkTarget(bind);
    if (!target || target.local) return "";
    const site = aiSite(target.label);
    const net = weatherNet(site.name);
    if (!net) return "";
    return `This sends what you typed, your pet's name, and how hungry, happy, and rested it is to ${site.who}, so your pet can answer. It also sends your key for ${site.name}, if you saved one. ${net}`;
  }

  function talkMaySend(bind, lineInView) {
    const target = talkTarget(bind);
    if (!target || target.local) return true;
    const net = weatherNet(aiSite(target.label).name);
    const line = talkHonesty(bind);
    if (!net || !line || lineInView !== true) return false;
    return line.indexOf(net) !== -1;
  }

  /** A remote talk leaves only when the painted line names that talk host. */
  function talkMayLeave(bind, shown) {
    const target = talkTarget(bind);
    if (!target || target.local) return true;
    const line = talkHonesty(bind);
    if (!line || typeof shown !== "string") return false;
    return shown.indexOf(line) !== -1;
  }

  /** Twelve seconds covers headers and the body. Matches weather, news, quote, and radio page wrappers. */
  const TALK_TIMEOUT_MS = 12_000;

  /** A silent talk host. Callers keep the house line. */
  class TalkTimeout extends Error {
    constructor() {
      super("talk request timed out");
      this.name = "TalkTimeout";
    }
  }

  function isTalkTimeout(err) {
    return !!(
      err &&
      (err.name === "TalkTimeout" ||
        err.name === "AbortError" ||
        err.name === "TimeoutError" ||
        err.code === "ABORT_ERR")
    );
  }

  /**
   * One remote talk leave. The timer covers headers and the body.
   * A timeout rejects with TalkTimeout. The caller does not get a body.
   * A late body after the deadline is not parsed.
   */
  function readRemoteTalk(request, timeoutMs) {
    if (typeof request !== "function") return Promise.reject(new TalkTimeout());
    const ctrl = new AbortController();
    let settled = false;
    let timer;
    return new Promise(function (resolve, reject) {
      timer = setTimeout(function () {
        if (settled) return;
        settled = true;
        ctrl.abort();
        reject(new TalkTimeout());
      }, timeoutMs);
      Promise.resolve()
        .then(function () {
          return request(ctrl.signal);
        })
        .then(function (value) {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          resolve(value);
        })
        .catch(function (err) {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          if (isTalkTimeout(err)) reject(new TalkTimeout());
          else reject(err);
        });
    });
  }

  /**
   * The only cloud-talk request. A miss resolves to the local reply and does not call request.
   * A loopback mind still calls request with no remote deadline. That fetch stays on this computer.
   * A remote hang rejects with TalkTimeout. Overlay connect-src names the preset hosts. ADR 0048.
   */
  function readTalk(shown, bind, request, fallback, timeoutMs) {
    if (!talkMayLeave(bind, shown)) return Promise.resolve(fallback);
    const target = talkTarget(bind);
    if (!target || target.local) {
      return Promise.resolve().then(function () {
        return request();
      });
    }
    return readRemoteTalk(request, timeoutMs == null ? TALK_TIMEOUT_MS : timeoutMs);
  }

  async function run(ctx) {
    const bind = binding(ctx.species);
    const p = preset(bind.plugin);
    const base = safeUrl(bind.baseUrl || p.base || "", p.id);
    const model = sanitizeModel(bind.model, p.model);
    const key = bind.apiKey || "";
    const fallback = { text: ctx.fallback, source: "local" };
    if (p.kind === "local") return fallback;
    if (!base && p.kind !== "local") return fallback;
    const shown = ctx && typeof ctx.shown === "string" ? ctx.shown : "";
    try {
      return await readTalk(shown, bind, async function (signal) {
    try {
      const leave = signal ? { signal: signal } : {};
      if (p.kind === "openai") {
        const res = await fetch(pluginRequestUrl(base, "/chat/completions"), Object.assign({
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
        }, leave));
        const body = await res.json();
        const text = clip(body.choices?.[0]?.message?.content);
        if (text) return { text, source: p.id };
      } else if (p.kind === "anthropic") {
        const res = await fetch(pluginRequestUrl(base, "/v1/messages"), Object.assign({
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
        }, leave));
        const body = await res.json();
        const text = clip(body.content?.[0]?.text);
        if (text) return { text, source: p.id };
      } else if (p.kind === "ollama") {
        const res = await fetch(pluginRequestUrl(base, "/api/chat"), Object.assign({
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
        }, leave));
        const body = await res.json();
        const text = clip(body.message?.content);
        if (text) return { text, source: p.id };
      } else if (p.kind === "gemini") {
        const res = await fetch(pluginRequestUrl(base, `/models/${model}:generateContent`), Object.assign({
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
        }, leave));
        const body = await res.json();
        const text = clip(body.candidates?.[0]?.content?.parts?.[0]?.text);
        if (text) return { text, source: p.id };
      } else if (p.kind === "custom") {
        const res = await fetch(pluginRequestUrl(base), Object.assign({
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
        }, leave));
        const body = await res.json();
        const text = clip(body.text || body.content);
        if (text) return { text, source: "custom" };
      }
    } catch {
      /* house lines */
    }
    return fallback;
    }, fallback);
    } catch (err) {
      if (isTalkTimeout(err)) return fallback;
      throw err;
    }
  }

  window.PetMind = {
    PRESETS,
    load,
    save,
    preset,
    baseUrlProblem,
    binding,
    run,
    TALK_HOST_NAME,
    TALK_TIMEOUT_MS,
    TalkTimeout,
    isTalkTimeout,
    talkHostName,
    talkTarget,
    talkHonesty,
    talkMaySend,
    talkMayLeave,
    readTalk,
  };
})();
