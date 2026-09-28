"use strict";

/**
 * Overlay mind prefs may live in mind.json. A plugin key may not.
 * When a codec is present (Electron safeStorage), the key is sealed into
 * `sealedKeys` and the plain `apiKey` field is omitted. When it is not,
 * the key is left out of the file. Callers keep it in memory for the process.
 * A pasted secret on a base URL is dropped on save and on read:
 * the query, the userinfo, a token-shaped path segment, and a non-URL `key=` assignment.
 * That cleanup does not re-encode the seal. The seal payload is still only keys.
 * This module does not read the disk and does not talk to the network.
 */

const MAX_KEY = 4000;
const SEALED = "sealedKeys";

// Same names as web/src/lib/ai/secret-query.mjs. The overlay renderer keeps this list too.
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
  const norm = String(name || "")
    .trim()
    .toLowerCase()
    .replace(/-/g, "_");
  return SECRET_QUERY_NAMES.has(norm);
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

function baseUrlsNeedRewrite(raw) {
  if (!raw || typeof raw !== "object") return false;
  let dirty = false;
  const seen = (row) => {
    if (!row || typeof row !== "object") return;
    if (typeof row.baseUrl === "string" && scrubSecretQueryString(row.baseUrl) !== row.baseUrl.trim()) dirty = true;
    if (typeof row.model === "string" && isSecretModel(row.model)) dirty = true;
  };
  seen(raw.default);
  const pets = raw.pets && typeof raw.pets === "object" ? raw.pets : null;
  if (pets) {
    for (const name of Object.keys(pets)) seen(pets[name]);
  }
  return dirty;
}

function blankKeys() {
  return { default: "", pets: {} };
}

function rawKey(value) {
  return typeof value === "string" ? value.trim() : "";
}

function clipKey(value) {
  const text = rawKey(value);
  if (!text || text.length > MAX_KEY) return "";
  return text;
}

function petNameOk(name) {
  if (typeof name !== "string" || !name || name.length > 64) return false;
  if (name === "__proto__" || name === "constructor" || name === "prototype") return false;
  return /^[a-z0-9_]+$/.test(name);
}

function bindingPrefs(raw) {
  const next = { plugin: "local" };
  if (!raw || typeof raw !== "object") return next;
  if (typeof raw.plugin === "string" && raw.plugin.trim()) next.plugin = raw.plugin.trim().slice(0, 64);
  if (typeof raw.model === "string") {
    const model = scrubSecretModel(raw.model);
    if (model) next.model = model.slice(0, 200);
    else if (raw.model.trim()) next.model = "";
  }
  if (typeof raw.baseUrl === "string") next.baseUrl = scrubSecretQueryString(raw.baseUrl).slice(0, 500);
  return next;
}

function eachBinding(raw, fn) {
  if (!raw || typeof raw !== "object") return;
  if (raw.default && typeof raw.default === "object") fn("default", raw.default);
  const pets = raw.pets && typeof raw.pets === "object" ? raw.pets : null;
  if (!pets) return;
  for (const name of Object.keys(pets)) {
    if (!petNameOk(name)) continue;
    if (pets[name] && typeof pets[name] === "object") fn(name, pets[name]);
  }
}

function bindingHasSecret(row) {
  if (!row || typeof row !== "object") return false;
  if (!Object.prototype.hasOwnProperty.call(row, "apiKey")) return false;
  const value = row.apiKey;
  if (typeof value === "string") return value.trim().length > 0;
  return value != null && value !== "";
}

function fileHasPlainKey(raw) {
  let found = false;
  eachBinding(raw, (_name, row) => {
    if (bindingHasSecret(row)) found = true;
  });
  return found;
}

function collectKeys(raw) {
  const keys = blankKeys();
  eachBinding(raw, (name, row) => {
    const key = clipKey(row.apiKey);
    if (!key) return;
    if (name === "default") keys.default = key;
    else keys.pets[name] = key;
  });
  return keys;
}

function hasKeys(keys) {
  return Boolean(keys && (keys.default || Object.keys(keys.pets || {}).length));
}

function prefsFrom(raw) {
  const src = raw && typeof raw === "object" ? raw : {};
  const petsIn = src.pets && typeof src.pets === "object" ? src.pets : {};
  const pets = {};
  for (const name of Object.keys(petsIn)) {
    if (!petNameOk(name)) continue;
    pets[name] = bindingPrefs(petsIn[name]);
  }
  const voice = typeof src.voice === "string" && src.voice.trim() ? src.voice.trim().slice(0, 32) : "browser";
  return {
    default: bindingPrefs(src.default),
    voice,
    pets,
  };
}

function attachKeys(prefs, keys) {
  const mind = {
    default: { ...prefs.default },
    voice: prefs.voice,
    pets: {},
  };
  if (keys && keys.default) mind.default.apiKey = keys.default;
  const petKeys = keys && keys.pets ? keys.pets : {};
  for (const name of Object.keys(prefs.pets)) {
    mind.pets[name] = { ...prefs.pets[name] };
    if (petKeys[name]) mind.pets[name].apiKey = petKeys[name];
  }
  return mind;
}

function secretsIn(keys) {
  const list = [];
  if (keys.default) list.push(keys.default);
  for (const name of Object.keys(keys.pets || {})) {
    if (keys.pets[name]) list.push(keys.pets[name]);
  }
  return list;
}

function sealPayload(keys, codec) {
  if (!hasKeys(keys)) return "";
  if (!codec || typeof codec.encrypt !== "function") return "";
  let sealed = "";
  try {
    sealed = codec.encrypt(JSON.stringify({ default: keys.default || "", pets: keys.pets || {} }));
  } catch {
    return "";
  }
  if (typeof sealed !== "string" || !sealed) return "";
  for (const secret of secretsIn(keys)) {
    if (sealed.includes(secret)) return "";
  }
  return sealed;
}

function unseal(payload, codec) {
  if (typeof payload !== "string" || !payload) return null;
  if (!codec || typeof codec.decrypt !== "function") return null;
  let text = "";
  try {
    text = codec.decrypt(payload);
  } catch {
    return null;
  }
  if (typeof text !== "string" || !text) return null;
  try {
    const parsed = JSON.parse(text);
    const pets = {};
    const rawPets = parsed && parsed.pets && typeof parsed.pets === "object" ? parsed.pets : {};
    for (const name of Object.keys(rawPets)) {
      pets[name] = { apiKey: rawPets[name] };
    }
    return collectKeys({ default: { apiKey: parsed && parsed.default }, pets });
  } catch {
    return null;
  }
}

function previousSeal(parsed) {
  if (!parsed || typeof parsed !== "object") return "";
  return typeof parsed[SEALED] === "string" ? parsed[SEALED] : "";
}

/**
 * @param {unknown} parsed
 * @param {{ encrypt?: Function, decrypt?: Function } | null} codec
 * @returns {{ mind: object, file: object, rewrite: boolean, kept: string }}
 */
function readMindRecord(parsed, codec) {
  const prefs = prefsFrom(parsed);
  const scrubUrl = baseUrlsNeedRewrite(parsed);
  const legacy = collectKeys(parsed);
  const plain = fileHasPlainKey(parsed);
  const stored = previousSeal(parsed);
  const opened = stored ? unseal(stored, codec) : null;

  if (opened && hasKeys(opened)) {
    const mind = attachKeys(prefs, opened);
    mind.keyKept = "os";
    return {
      mind,
      file: { ...prefs, [SEALED]: stored },
      rewrite: plain || scrubUrl,
      kept: "os",
    };
  }

  if (hasKeys(legacy)) {
    const sealed = sealPayload(legacy, codec);
    if (sealed) {
      const mind = attachKeys(prefs, legacy);
      mind.keyKept = "os";
      return { mind, file: { ...prefs, [SEALED]: sealed }, rewrite: true, kept: "os" };
    }
    const mind = attachKeys(prefs, legacy);
    mind.keyKept = "none";
    return { mind, file: prefs, rewrite: true, kept: "none" };
  }

  if (plain) {
    const mind = attachKeys(prefs, blankKeys());
    mind.keyKept = "empty";
    return { mind, file: prefs, rewrite: true, kept: "empty" };
  }

  if (stored) {
    const mind = attachKeys(prefs, blankKeys());
    mind.keyKept = opened ? "empty" : "locked";
    return {
      mind,
      file: { ...prefs, [SEALED]: stored },
      rewrite: scrubUrl,
      kept: mind.keyKept,
    };
  }

  const mind = attachKeys(prefs, blankKeys());
  mind.keyKept = "empty";
  return { mind, file: prefs, rewrite: scrubUrl, kept: "empty" };
}

/**
 * @param {unknown} data
 * @param {{ encrypt?: Function, decrypt?: Function } | null} codec
 * @param {unknown} [previous]
 * @returns {{ file: object, kept: string }}
 */
function writeMindRecord(data, codec, previous) {
  const prefs = prefsFrom(data);
  const keys = collectKeys(data);
  const prior = previousSeal(previous);
  if (hasKeys(keys)) {
    const sealed = sealPayload(keys, codec);
    if (sealed) return { file: { ...prefs, [SEALED]: sealed }, kept: "os" };
    if (prior) return { file: { ...prefs, [SEALED]: prior }, kept: "none" };
    return { file: prefs, kept: "none" };
  }
  const locked = data && typeof data === "object" && "keyKept" in data && data.keyKept === "locked" && prior;
  if (locked) return { file: { ...prefs, [SEALED]: prior }, kept: "locked" };
  return { file: prefs, kept: "empty" };
}

module.exports = {
  MAX_KEY,
  SEALED,
  fileHasPlainKey,
  readMindRecord,
  writeMindRecord,
};
