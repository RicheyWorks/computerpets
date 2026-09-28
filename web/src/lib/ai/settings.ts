import { mindPreset } from "./catalog.ts";
import { scrubSecretModel, scrubSecretQueryString } from "./secret-query.mjs";
import type { MindBinding, MindSettings, VoiceKind } from "./types";

/**
 * Desk `/mind` prefs may live in localStorage. A plugin key may not.
 * When `window.desk` can reach the overlay seal, the key goes there.
 * Otherwise it stays in this page's memory until the keeper leaves.
 * localStorage and sessionStorage keep the prefs only.
 * A pasted secret on a base URL is dropped on save and on read:
 * the query, the userinfo, a token-shaped path segment, and a non-URL `key=` assignment.
 * A pasted secret in the model field is dropped the same way. A normal model id stays.
 */

export const MIND_STORAGE_KEY = "computerpets.mind.v1";

const MAX_KEY = 4000;

export const DEFAULT_MIND: MindSettings = {
  default: { plugin: "xai", model: "grok-4.5" },
  voice: "browser",
  pets: {},
};

type KeyBag = { default: string; pets: Record<string, string> };

type DeskBridge = {
  mindGet?: () => unknown;
  mindSet?: (data: MindSettings) => unknown;
};

type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

let booted = false;
let generation = 0;
let memory: KeyBag = blankKeys();
let snapshot: MindSettings = DEFAULT_MIND;
let onChange: (() => void) | null = null;

function blankKeys(): KeyBag {
  return { default: "", pets: {} };
}

function rawKey(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function clipKey(value: unknown): string {
  const text = rawKey(value);
  if (!text || text.length > MAX_KEY) return "";
  return text;
}

function petNameOk(name: string): boolean {
  if (!name || name.length > 64) return false;
  if (name === "__proto__" || name === "constructor" || name === "prototype") return false;
  return true;
}

function bindingPrefs(raw: unknown, fallbackPlugin: string): MindBinding {
  const row = (raw && typeof raw === "object" ? raw : {}) as { plugin?: unknown; model?: unknown; baseUrl?: unknown };
  const next: MindBinding = { plugin: fallbackPlugin };
  if (typeof row.plugin === "string" && row.plugin.trim()) next.plugin = row.plugin.trim().slice(0, 64);
  if (typeof row.model === "string") {
    const model = scrubSecretModel(row.model);
    if (model) next.model = model.slice(0, 200);
    else if (row.model.trim()) next.model = "";
  }
  if (typeof row.baseUrl === "string") next.baseUrl = scrubSecretQueryString(row.baseUrl).slice(0, 500);
  return next;
}

function voiceOf(raw: unknown): VoiceKind {
  if (raw === "xai" || raw === "openai" || raw === "none" || raw === "browser") return raw;
  if (typeof raw === "string" && raw.trim()) return raw.trim().slice(0, 32) as VoiceKind;
  return "browser";
}

function prefsFrom(raw: unknown): MindSettings {
  const src = raw && typeof raw === "object" ? (raw as Partial<MindSettings>) : {};
  const petsIn = src.pets && typeof src.pets === "object" ? src.pets : {};
  const pets: Record<string, MindBinding> = {};
  for (const name of Object.keys(petsIn)) {
    if (!petNameOk(name)) continue;
    pets[name] = bindingPrefs(petsIn[name], "local");
  }
  const defaults = bindingPrefs(src.default, DEFAULT_MIND.default.plugin);
  return {
    default: { ...DEFAULT_MIND.default, ...defaults },
    voice: voiceOf(src.voice ?? "browser"),
    pets,
  };
}

function collectKeys(raw: unknown): KeyBag {
  const keys = blankKeys();
  if (!raw || typeof raw !== "object") return keys;
  const src = raw as Partial<MindSettings>;
  const house = clipKey(src.default?.apiKey);
  if (house) keys.default = house;
  const pets = src.pets && typeof src.pets === "object" ? src.pets : {};
  for (const name of Object.keys(pets)) {
    if (!petNameOk(name)) continue;
    const key = clipKey(pets[name]?.apiKey);
    if (key) keys.pets[name] = key;
  }
  return keys;
}

function hasKeys(keys: KeyBag): boolean {
  return Boolean(keys.default || Object.keys(keys.pets).length);
}

function secretsIn(keys: KeyBag): string[] {
  const list: string[] = [];
  if (keys.default) list.push(keys.default);
  for (const name of Object.keys(keys.pets)) {
    if (keys.pets[name]) list.push(keys.pets[name]);
  }
  return list;
}

function attach(prefs: MindSettings, keys: KeyBag, kept: string): MindSettings {
  const mind: MindSettings = {
    default: { ...prefs.default },
    voice: prefs.voice,
    pets: {},
    keyKept: kept,
  };
  if (keys.default) mind.default = { ...mind.default, apiKey: keys.default };
  for (const name of Object.keys(prefs.pets)) {
    const row: MindBinding = { ...prefs.pets[name] };
    if (keys.pets[name]) row.apiKey = keys.pets[name];
    mind.pets[name] = row;
  }
  return mind;
}

function rawKept(raw: unknown): string {
  if (!raw || typeof raw !== "object") return "";
  const kept = (raw as { keyKept?: unknown }).keyKept;
  return typeof kept === "string" ? kept : "";
}

function keptFrom(result: unknown): string {
  if (result && typeof result === "object") {
    const kept = (result as { kept?: unknown }).kept;
    if (typeof kept === "string" && kept) return kept;
  }
  return "os";
}

function storageOf(kind: "localStorage" | "sessionStorage"): StorageLike | null {
  if (typeof window === "undefined") return null;
  try {
    const store = window[kind] as StorageLike | undefined;
    if (!store || typeof store.getItem !== "function" || typeof store.setItem !== "function") return null;
    return store;
  } catch {
    return null;
  }
}

function readText(store: StorageLike | null): string {
  if (!store) return "";
  try {
    return store.getItem(MIND_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

function parseStored(text: string): unknown {
  if (!text) return null;
  try {
    const parsed = JSON.parse(text) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

function deskBridge(): DeskBridge | null {
  if (typeof window === "undefined") return null;
  const desk = (window as Window & { desk?: DeskBridge }).desk;
  if (!desk || typeof desk.mindGet !== "function" || typeof desk.mindSet !== "function") return null;
  return desk;
}

function dropSession() {
  const session = storageOf("sessionStorage");
  if (!session) return;
  try {
    session.removeItem(MIND_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function writePrefs(prefs: MindSettings, secrets: string[]) {
  dropSession();
  const local = storageOf("localStorage");
  if (!local) return;
  const text = JSON.stringify(prefs);
  if (secrets.some((secret) => secret && text.includes(secret))) {
    try {
      local.removeItem(MIND_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    return;
  }
  try {
    local.setItem(MIND_STORAGE_KEY, text);
  } catch {
    /* ignore */
  }
}

function scrubBrowser() {
  const local = storageOf("localStorage");
  const session = storageOf("sessionStorage");
  const localText = readText(local);
  const sessionText = readText(session);
  const parsed = parseStored(localText) ?? parseStored(sessionText);
  const secrets = [
    ...secretsIn(collectKeys(parseStored(localText))),
    ...secretsIn(collectKeys(parseStored(sessionText))),
  ];
  dropSession();
  if (!local) return;
  if (!localText && !sessionText) return;
  if (!parsed || (localText && !parseStored(localText) && !sessionText)) {
    try {
      local.removeItem(MIND_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    return;
  }
  writePrefs(prefsFrom(parsed), secrets);
}

function readLeftoverKeys(): KeyBag {
  const keys = collectKeys(parseStored(readText(storageOf("localStorage"))));
  const extra = collectKeys(parseStored(readText(storageOf("sessionStorage"))));
  if (!keys.default && extra.default) keys.default = extra.default;
  for (const name of Object.keys(extra.pets)) {
    if (!keys.pets[name]) keys.pets[name] = extra.pets[name];
  }
  return keys;
}

function readPrefs(): MindSettings {
  const local = parseStored(readText(storageOf("localStorage")));
  const session = parseStored(readText(storageOf("sessionStorage")));
  if (!local && !session) {
    return { default: { ...DEFAULT_MIND.default }, voice: DEFAULT_MIND.voice, pets: {} };
  }
  return prefsFrom(local ?? session);
}

function notify() {
  try {
    onChange?.();
  } catch {
    /* ignore */
  }
}

function applyKept(prefs: MindSettings, keys: KeyBag, kept: string) {
  if (kept === "none" || kept === "plain") {
    memory = keys;
    snapshot = attach(prefs, keys, hasKeys(keys) ? "none" : "empty");
    return;
  }
  if (kept === "locked" || kept === "empty") {
    memory = blankKeys();
    snapshot = attach(prefs, blankKeys(), kept);
    return;
  }
  memory = blankKeys();
  snapshot = attach(prefs, keys, kept);
}

function ensureBoot() {
  if (booted || typeof window === "undefined") return;
  booted = true;
  const gen = ++generation;
  const leftover = readLeftoverKeys();
  const prefs = readPrefs();
  scrubBrowser();
  const bridge = deskBridge();
  if (!bridge) {
    memory = leftover;
    snapshot = attach(prefs, memory, hasKeys(memory) ? "none" : "empty");
    return;
  }
  let raw: unknown = null;
  try {
    raw = bridge.mindGet?.();
  } catch {
    raw = null;
  }
  if (!raw || typeof raw !== "object") {
    memory = leftover;
    snapshot = attach(prefs, leftover, hasKeys(leftover) ? "none" : "empty");
    return;
  }
  const sealed = collectKeys(raw);
  const kept = rawKept(raw) || (hasKeys(sealed) ? "os" : "empty");
  if (!hasKeys(sealed) && hasKeys(leftover)) {
    const sealPrefs = prefsFrom(raw);
    const prefsNow = {
      default: { ...prefs.default, ...sealPrefs.default },
      voice: sealPrefs.voice || prefs.voice,
      pets: { ...prefs.pets, ...sealPrefs.pets },
    };
    const merged = attach(prefsNow, leftover, "os");
    snapshot = merged;
    const pending = merged;
    void Promise.resolve()
      .then(() => bridge.mindSet?.(pending))
      .then((result) => {
        if (gen !== generation) return;
        const nextKept = keptFrom(result);
        let fresh: unknown = pending;
        try {
          fresh = bridge.mindGet?.() ?? pending;
        } catch {
          fresh = pending;
        }
        const opened = collectKeys(fresh);
        const prefsNow = prefsFrom(fresh);
        if (nextKept === "none" || nextKept === "plain") applyKept(prefsNow, leftover, "none");
        else if (hasKeys(opened)) applyKept(prefsNow, opened, nextKept);
        else applyKept(prefsNow, leftover, nextKept === "os" ? "os" : nextKept);
        notify();
      })
      .catch(() => {
        if (gen !== generation) return;
        applyKept(prefsFrom(pending), leftover, "none");
        notify();
      });
    return;
  }
  memory = blankKeys();
  snapshot = attach(prefsFrom(raw), sealed, kept);
}

export function onMindStoreChange(fn: (() => void) | null) {
  onChange = fn;
}

/** Another tab wrote the prefs. The next read scrubs a plain key again. */
export function noteExternalMindStorage() {
  booted = false;
  generation += 1;
  memory = blankKeys();
}

/** Test isolation. Production code does not call this. */
export function resetMindStoreForTests() {
  booted = false;
  generation += 1;
  memory = blankKeys();
  snapshot = DEFAULT_MIND;
}

export function describeKeyKept(kept: string | undefined): string {
  if (kept === "os") return "Your key is locked in this computer's secret store. This browser does not keep it.";
  if (kept === "none" || kept === "plain") return "This browser has no secret store, so the key was not saved. It stays on this page until you leave.";
  if (kept === "locked") return "This computer's secret store did not open. Your key stays locked away. It is not shown.";
  return "No key is saved in this browser.";
}

export function loadMindSettings(): MindSettings {
  if (typeof window === "undefined") return DEFAULT_MIND;
  ensureBoot();
  return snapshot;
}

export function saveMindSettings(next: MindSettings): Promise<{ kept: string }> {
  const prefs = prefsFrom(next);
  const keys = collectKeys(next);
  const hint = rawKept(next);
  if (typeof window === "undefined") {
    applyKept(prefs, keys, hasKeys(keys) ? "none" : "empty");
    return Promise.resolve({ kept: snapshot.keyKept || "empty" });
  }
  ensureBoot();
  const gen = generation;
  const keptOnSave = hasKeys(keys) ? hint || "os" : hint === "locked" ? "locked" : "empty";
  const payload = attach(prefs, keys, keptOnSave);
  writePrefs(prefs, secretsIn(keys));
  const bridge = deskBridge();
  if (!bridge) {
    applyKept(prefs, keys, hasKeys(keys) ? "none" : "empty");
    notify();
    return Promise.resolve({ kept: snapshot.keyKept || "empty" });
  }
  memory = blankKeys();
  snapshot = hasKeys(keys) ? attach(prefs, keys, "os") : payload;
  notify();
  return Promise.resolve()
    .then(() => bridge.mindSet?.(payload))
    .then((result) => {
      if (gen !== generation) return { kept: snapshot.keyKept || "empty" };
      const kept = keptFrom(result);
      if ((kept === "none" || kept === "plain") && hasKeys(keys)) applyKept(prefs, keys, "none");
      else if (kept === "locked") applyKept(prefs, blankKeys(), "locked");
      else if (kept === "empty" || !hasKeys(keys)) applyKept(prefs, blankKeys(), kept === "locked" ? "locked" : "empty");
      else applyKept(prefs, keys, kept);
      notify();
      return { kept: snapshot.keyKept || kept };
    })
    .catch(() => {
      if (gen !== generation) return { kept: snapshot.keyKept || "none" };
      applyKept(prefs, keys, hasKeys(keys) ? "none" : "empty");
      notify();
      return { kept: snapshot.keyKept || "none" };
    });
}

export function bindingFor(settings: MindSettings, species: string): MindBinding {
  return settings.pets[species] ?? settings.default;
}

export function describeBinding(binding: MindBinding) {
  const preset = mindPreset(binding.plugin);
  return binding.model ? `${preset.name} · ${binding.model}` : preset.name;
}
