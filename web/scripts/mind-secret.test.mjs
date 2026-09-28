import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const S = await import(pathToFileURL(join(root, "src/lib/ai/settings.ts")).href);

const SECRET = "sk-live-desk-key";
const PET_SECRET = "sk-pet-desk-key";
const KEY = "computerpets.mind.v1";

function memStore() {
  const map = new Map();
  return {
    getItem(k) {
      return map.has(k) ? map.get(k) : null;
    },
    setItem(k, v) {
      map.set(k, String(v));
    },
    removeItem(k) {
      map.delete(k);
    },
    raw: map,
  };
}

function install(extra = {}) {
  const local = extra.local ?? memStore();
  const session = extra.session ?? memStore();
  const win = {
    localStorage: local,
    sessionStorage: session,
    desk: extra.desk,
    addEventListener() {},
    removeEventListener() {},
  };
  globalThis.window = win;
  globalThis.localStorage = local;
  globalThis.sessionStorage = session;
  S.resetMindStoreForTests();
  return { local, session, win };
}

function textOf(store) {
  return store.raw.get(KEY) || "";
}

function mindWithKey() {
  return {
    default: { plugin: "xai", model: "grok-4.5", baseUrl: "https://api.x.ai/v1", apiKey: SECRET },
    voice: "browser",
    pets: { red_panda: { plugin: "openai", model: "gpt-4.1-mini", apiKey: PET_SECRET } },
    keyKept: "none",
  };
}

test("desk /mind does not write the plugin key into localStorage or sessionStorage", async () => {
  const { local, session } = install();
  const saved = await S.saveMindSettings(mindWithKey());
  const disk = textOf(local);
  assert.equal(saved.kept, "none");
  assert.equal(disk.includes(SECRET), false);
  assert.equal(disk.includes(PET_SECRET), false);
  assert.equal(disk.includes("apiKey"), false);
  assert.equal(disk.includes("xai"), true);
  assert.equal(textOf(session), "");
  const live = S.loadMindSettings();
  assert.equal(live.default.apiKey, SECRET);
  assert.equal(live.pets.red_panda.apiKey, PET_SECRET);
  assert.equal(live.keyKept, "none");
  assert.match(S.describeKeyKept(live.keyKept), /no secret store/);
});

test("a leftover browser key is scrubbed and kept only for this page", () => {
  const local = memStore();
  const session = memStore();
  local.setItem(KEY, JSON.stringify({ default: { plugin: "openai", apiKey: SECRET }, voice: "browser", pets: {} }));
  session.setItem(KEY, JSON.stringify({ default: { plugin: "xai", apiKey: PET_SECRET }, voice: "browser", pets: {} }));
  install({ local, session });
  const live = S.loadMindSettings();
  assert.equal(live.default.apiKey, SECRET);
  assert.equal(live.keyKept, "none");
  assert.equal(textOf(local).includes(SECRET), false);
  assert.equal(textOf(local).includes("apiKey"), false);
  assert.equal(textOf(local).includes("openai"), true);
  assert.equal(textOf(session), "");
  assert.equal(S.loadMindSettings().default.apiKey, SECRET);

  S.resetMindStoreForTests();
  const again = S.loadMindSettings();
  assert.equal(again.default.apiKey, undefined);
  assert.equal(again.keyKept, "empty");
  assert.match(S.describeKeyKept(again.keyKept), /No key is saved in this browser/);
});

test("the desk bridge seals the key and the browser copy stays prefs", async () => {
  const local = memStore();
  local.setItem(
    KEY,
    JSON.stringify({ default: { plugin: "xai", apiKey: SECRET }, voice: "browser", pets: { red_panda: { apiKey: PET_SECRET } } }),
  );
  let sealed = {
    default: { plugin: "xai", model: "grok-4.5" },
    voice: "browser",
    pets: {},
    keyKept: "empty",
  };
  let sent = null;
  const desk = {
    mindGet() {
      return sealed;
    },
    mindSet(data) {
      sent = data;
      sealed = {
        default: { ...data.default },
        voice: data.voice,
        pets: { ...data.pets },
        keyKept: "os",
      };
      return { kept: "os" };
    },
  };
  const { local: store, session } = install({ local, desk });
  const lifted = S.loadMindSettings();
  assert.equal(lifted.default.apiKey, SECRET);
  assert.equal(textOf(store).includes(SECRET), false);
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(sent.default.apiKey, SECRET);
  assert.equal(S.loadMindSettings().keyKept, "os");
  assert.match(S.describeKeyKept("os"), /locked in this computer's secret store/);
  assert.equal(textOf(store).includes("apiKey"), false);
  assert.equal(textOf(session), "");

  S.resetMindStoreForTests();
  const opened = S.loadMindSettings();
  assert.equal(opened.default.apiKey, SECRET);
  assert.equal(opened.keyKept, "os");
  assert.equal(textOf(store).includes(SECRET), false);
});

test("a missing secret store keeps the typed key off disk", async () => {
  let sent = null;
  const desk = {
    mindGet() {
      return { default: { plugin: "xai", model: "grok-4.5" }, voice: "browser", pets: {}, keyKept: "empty" };
    },
    mindSet(data) {
      sent = data;
      return { kept: "none" };
    },
  };
  const { local, session } = install({ desk });
  const saved = await S.saveMindSettings(mindWithKey());
  assert.equal(saved.kept, "none");
  assert.equal(sent.default.apiKey, SECRET);
  assert.equal(textOf(local).includes(SECRET), false);
  assert.equal(textOf(local).includes("apiKey"), false);
  assert.equal(textOf(session), "");
  assert.equal(S.loadMindSettings().default.apiKey, SECRET);
  assert.match(S.describeKeyKept(S.loadMindSettings().keyKept), /was not saved/);
});

test("a locked seal is not replaced with an invented key", async () => {
  let sent = null;
  const desk = {
    mindGet() {
      return { default: { plugin: "xai", model: "grok-4.5" }, voice: "browser", pets: {}, keyKept: "locked" };
    },
    mindSet(data) {
      sent = data;
      return { kept: "locked" };
    },
  };
  install({ desk });
  const live = S.loadMindSettings();
  assert.equal(live.default.apiKey, undefined);
  assert.equal(live.keyKept, "locked");
  assert.match(S.describeKeyKept(live.keyKept), /did not open/);
  const saved = await S.saveMindSettings({
    default: { plugin: "xai", model: "grok-4.5", apiKey: "" },
    voice: "browser",
    pets: {},
    keyKept: "locked",
  });
  assert.equal(saved.kept, "locked");
  assert.equal(sent.keyKept, "locked");
  assert.equal(sent.default.apiKey, undefined);
  assert.equal(S.loadMindSettings().default.apiKey, undefined);
});

const PASTED = "pasted-key-VALUE-should-not-ride";
const PASTED_API = "pasted-api-key-VALUE-should-not-ride";

test("desk mind prefs drop a pasted key query on save and on read", async () => {
  const dirty = `https://example.test/v1beta?key=${PASTED}&api_key=${PASTED_API}&alt=sse`;
  const { local } = install();
  await S.saveMindSettings({
    default: { plugin: "google", model: "gemini-2.5-flash", baseUrl: dirty },
    voice: "browser",
    pets: { red_panda: { plugin: "openai", baseUrl: `https://api.example.test/v1?api_key=${PASTED_API}` } },
  });
  const disk = textOf(local);
  assert.equal(disk.includes(PASTED), false);
  assert.equal(disk.includes(PASTED_API), false);
  assert.equal(disk.includes("key="), false);
  assert.equal(disk.includes("api_key="), false);
  assert.equal(disk.includes("alt=sse"), true);
  const live = S.loadMindSettings();
  assert.equal(live.default.baseUrl, "https://example.test/v1beta?alt=sse");
  assert.equal(live.pets.red_panda.baseUrl, "https://api.example.test/v1");
  assert.equal(live.default.model, "gemini-2.5-flash");

  const leftover = memStore();
  leftover.setItem(
    KEY,
    JSON.stringify({
      default: { plugin: "google", baseUrl: `https://example.test/v1?key=${PASTED}&alt=sse` },
      voice: "browser",
      pets: {},
    }),
  );
  install({ local: leftover });
  const opened = S.loadMindSettings();
  assert.equal(opened.default.baseUrl, "https://example.test/v1?alt=sse");
  assert.equal(textOf(leftover).includes(PASTED), false);
  assert.equal(textOf(leftover).includes("key="), false);
  assert.equal(textOf(leftover).includes("alt=sse"), true);
});

test("desk mind prefs drop a pasted secret model and keep a normal model id", async () => {
  const token = "sk-test-PASTEDKEY0123456789";
  const opaque = "AbCdEfGh1234567890IjKlMnOp1234567890";
  const { local } = install();
  await S.saveMindSettings({
    default: { plugin: "openai", model: token, baseUrl: "https://api.openai.com/v1" },
    voice: "browser",
    pets: {
      red_panda: { plugin: "google", model: `api_key=${token}` },
      moth: { plugin: "anthropic", model: "claude-sonnet-4-5" },
      fox: { plugin: "together", model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo" },
    },
  });
  const disk = textOf(local);
  assert.equal(disk.includes(token), false);
  assert.equal(disk.includes("api_key="), false);
  assert.equal(disk.includes("claude-sonnet-4-5"), true);
  assert.equal(disk.includes("Meta-Llama-3.1-70B-Instruct-Turbo"), true);
  const live = S.loadMindSettings();
  assert.equal(live.default.model, "");
  assert.equal(live.default.baseUrl, "https://api.openai.com/v1");
  assert.equal(live.pets.red_panda.model, "");
  assert.equal(live.pets.moth.model, "claude-sonnet-4-5");
  assert.equal(live.pets.fox.model, "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo");

  const leftover = memStore();
  leftover.setItem(
    KEY,
    JSON.stringify({
      default: { plugin: "openai", model: `key=${opaque}`, baseUrl: "https://api.openai.com/v1" },
      voice: "browser",
      pets: { red_panda: { plugin: "google", model: "gemini-2.5-flash" } },
    }),
  );
  install({ local: leftover });
  const opened = S.loadMindSettings();
  assert.equal(opened.default.model, "");
  assert.equal(opened.pets.red_panda.model, "gemini-2.5-flash");
  assert.equal(textOf(leftover).includes(opaque), false);
  assert.equal(textOf(leftover).includes("gpt-4o") || textOf(leftover).includes("gemini-2.5-flash"), true);
});

test("a desk save does not hand a pasted key query to the seal", async () => {
  let sent = null;
  const desk = {
    mindGet() {
      return {
        default: { plugin: "google", baseUrl: `https://example.test/v1?key=${PASTED}` },
        voice: "browser",
        pets: {},
        keyKept: "empty",
      };
    },
    mindSet(data) {
      sent = data;
      return { kept: "empty" };
    },
  };
  const { local } = install({ desk });
  const live = S.loadMindSettings();
  assert.equal(live.default.baseUrl, "https://example.test/v1");
  assert.equal(JSON.stringify(live).includes(PASTED), false);
  await S.saveMindSettings({
    ...live,
    default: { ...live.default, baseUrl: `https://example.test/v1?api_key=${PASTED_API}&alt=sse` },
  });
  assert.equal(sent.default.baseUrl, "https://example.test/v1?alt=sse");
  assert.equal(JSON.stringify(sent).includes(PASTED_API), false);
  assert.equal(JSON.stringify(sent).includes("api_key="), false);
  assert.equal(textOf(local).includes(PASTED_API), false);

  const token = "sk-test-PASTEDKEY0123456789";
  await S.saveMindSettings({
    default: { plugin: "openai", baseUrl: `https://user:${token}@api.example.test/v1/key/${token}?alt=sse` },
    voice: "browser",
    pets: { red_panda: { plugin: "custom", baseUrl: `not a url?key=${token}` } },
  });
  const again = textOf(local);
  assert.equal(again.includes(token), false);
  assert.equal(again.includes("alt=sse"), true);
  const kept = S.loadMindSettings();
  assert.equal(kept.default.baseUrl, "https://api.example.test/v1?alt=sse");
  assert.equal(kept.pets.red_panda.baseUrl, "not a url");
  assert.equal(kept.default.model, "grok-4.5");
});

test("the desk page does not say the key stays in the browser", () => {
  const page = readFileSync(join(root, "src/routes/mind.tsx"), "utf8");
  const settings = readFileSync(join(root, "src/lib/ai/settings.ts"), "utf8");
  const mindDoc = readFileSync(join(root, "..", "docs/MIND.md"), "utf8");
  const overlay = readFileSync(join(root, "..", "desktop/renderer/mind.js"), "utf8");
  assert.doesNotMatch(page, /keys stay in this browser/);
  assert.match(page, /describeKeyKept/);
  assert.match(settings, /mindSet/);
  assert.match(settings, /scrubSecretQueryString/);
  assert.match(settings, /secret-query\.mjs/);
  assert.match(settings, /sessionStorage/);
  assert.doesNotMatch(settings, /sessionStorage\.setItem/);
  assert.match(mindDoc, /not stored in this browser/);
  assert.match(overlay, /browserCopy\(pageMind\)/);
  assert.doesNotMatch(overlay, /JSON\.stringify\(next\)/);
  assert.doesNotMatch(page, /resetMindStoreForTests/);
});
