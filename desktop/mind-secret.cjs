"use strict";

/**
 * Overlay mind prefs may live in mind.json. A plugin key may not.
 * When a codec is present (Electron safeStorage), the key is sealed into
 * `sealedKeys` and the plain `apiKey` field is omitted. When it is not,
 * the key is left out of the file. Callers keep it in memory for the process.
 * This module does not read the disk and does not talk to the network.
 */

const MAX_KEY = 4000;
const SEALED = "sealedKeys";

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
  if (typeof raw.model === "string") next.model = raw.model.slice(0, 200);
  if (typeof raw.baseUrl === "string") next.baseUrl = raw.baseUrl.slice(0, 500);
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
      rewrite: plain,
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
      rewrite: false,
      kept: mind.keyKept,
    };
  }

  const mind = attachKeys(prefs, blankKeys());
  mind.keyKept = "empty";
  return { mind, file: prefs, rewrite: false, kept: "empty" };
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
  const locked = data && typeof data === "object" && data.keyKept === "locked" && prior;
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
