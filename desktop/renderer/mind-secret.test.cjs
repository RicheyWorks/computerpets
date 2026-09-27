"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const vm = require("node:vm");
const Secret = require("../mind-secret.cjs");
const { readSource } = require("../test-source.cjs");

const SECRET = "sk-live-overlay-key";
const PET_SECRET = "sk-pet-overlay-key";

function xorCodec() {
  return {
    encrypt(text) {
      const buf = Buffer.from(String(text), "utf8");
      for (let i = 0; i < buf.length; i += 1) buf[i] ^= 0x5a;
      return buf.toString("base64");
    },
    decrypt(payload) {
      const buf = Buffer.from(String(payload), "base64");
      for (let i = 0; i < buf.length; i += 1) buf[i] ^= 0x5a;
      return buf.toString("utf8");
    },
  };
}

function mindWithKey() {
  return {
    default: { plugin: "xai", model: "grok-4.5", baseUrl: "https://api.x.ai/v1", apiKey: SECRET },
    voice: "browser",
    pets: { red_panda: { plugin: "openai", model: "gpt-4.1-mini", apiKey: PET_SECRET } },
  };
}

describe("mind secret", () => {
  it("seals a plugin key and leaves it out of the mind file", () => {
    const written = Secret.writeMindRecord(mindWithKey(), xorCodec(), null);
    const disk = JSON.stringify(written.file);
    assert.equal(written.kept, "os");
    assert.equal(Object.hasOwn(written.file.default, "apiKey"), false);
    assert.equal(Object.hasOwn(written.file.pets.red_panda, "apiKey"), false);
    assert.equal(disk.includes(SECRET), false);
    assert.equal(disk.includes(PET_SECRET), false);
    assert.equal(disk.includes("apiKey"), false);
    assert.equal(typeof written.file.sealedKeys, "string");

    const opened = Secret.readMindRecord(written.file, xorCodec());
    assert.equal(opened.rewrite, false);
    assert.equal(opened.kept, "os");
    assert.equal(opened.mind.default.apiKey, SECRET);
    assert.equal(opened.mind.pets.red_panda.apiKey, PET_SECRET);
    assert.equal(opened.mind.default.plugin, "xai");
    assert.equal(JSON.stringify(opened.file).includes(SECRET), false);
  });

  it("moves a legacy plain key off disk when a secret store exists", () => {
    const legacy = mindWithKey();
    const opened = Secret.readMindRecord(legacy, xorCodec());
    assert.equal(opened.rewrite, true);
    assert.equal(opened.kept, "os");
    assert.equal(opened.mind.default.apiKey, SECRET);
    const disk = JSON.stringify(opened.file);
    assert.equal(disk.includes(SECRET), false);
    assert.equal(disk.includes(PET_SECRET), false);
    assert.equal(Secret.fileHasPlainKey(opened.file), false);
  });

  it("does not write a plain key when the secret store is missing", () => {
    const written = Secret.writeMindRecord(mindWithKey(), null, null);
    const disk = JSON.stringify(written.file);
    assert.equal(written.kept, "none");
    assert.equal(disk.includes(SECRET), false);
    assert.equal(disk.includes("sealedKeys"), false);
    assert.equal(disk.includes("apiKey"), false);

    const opened = Secret.readMindRecord(mindWithKey(), null);
    assert.equal(opened.rewrite, true);
    assert.equal(opened.kept, "none");
    assert.equal(opened.mind.default.apiKey, SECRET);
    assert.equal(JSON.stringify(opened.file).includes(SECRET), false);
  });

  it("rejects a codec that echoes the key", () => {
    const echo = { encrypt: (text) => String(text), decrypt: (text) => String(text) };
    const written = Secret.writeMindRecord(mindWithKey(), echo, null);
    assert.equal(written.kept, "none");
    assert.equal(JSON.stringify(written.file).includes(SECRET), false);
  });

  it("keeps a seal it cannot open and does not invent a key", () => {
    const sealed = Secret.writeMindRecord(mindWithKey(), xorCodec(), null).file;
    const opened = Secret.readMindRecord(sealed, null);
    assert.equal(opened.rewrite, false);
    assert.equal(opened.kept, "locked");
    assert.equal(opened.mind.default.apiKey, undefined);
    assert.equal(opened.file.sealedKeys, sealed.sealedKeys);
    assert.equal(JSON.stringify(opened.mind).includes(SECRET), false);
  });

  it("does not drop a locked seal when the form has no key", () => {
    const sealed = Secret.writeMindRecord(mindWithKey(), xorCodec(), null).file;
    const written = Secret.writeMindRecord(
      { default: { plugin: "xai" }, voice: "browser", pets: {}, keyKept: "locked" },
      null,
      sealed,
    );
    assert.equal(written.kept, "locked");
    assert.equal(written.file.sealedKeys, sealed.sealedKeys);
    assert.equal(JSON.stringify(written.file).includes(SECRET), false);
  });

  it("clears the seal when the keeper clears the key", () => {
    const sealed = Secret.writeMindRecord(mindWithKey(), xorCodec(), null).file;
    const written = Secret.writeMindRecord(
      { default: { plugin: "local", apiKey: "" }, voice: "browser", pets: {}, keyKept: "os" },
      xorCodec(),
      sealed,
    );
    assert.equal(written.kept, "empty");
    assert.equal(written.file.sealedKeys, undefined);
    assert.equal(JSON.stringify(written.file).includes(SECRET), false);
  });
});

const PASTED = "pasted-key-VALUE-should-not-ride";
const PASTED_API = "pasted-api-key-VALUE-should-not-ride";

describe("mind.json base URL", () => {
  it("drops a pasted key query on save and does not put it in the seal", () => {
    const clean = Secret.writeMindRecord(mindWithKey(), xorCodec(), null);
    const dirty = mindWithKey();
    dirty.default.baseUrl = `https://api.x.ai/v1?key=${PASTED}&api_key=${PASTED_API}&alt=sse`;
    dirty.pets.red_panda.baseUrl = `https://api.example.test/v1?api-key=${PASTED}#token=${PASTED_API}`;
    const written = Secret.writeMindRecord(dirty, xorCodec(), null);
    const disk = JSON.stringify(written.file);
    assert.equal(written.kept, "os");
    assert.equal(written.file.default.baseUrl, "https://api.x.ai/v1?alt=sse");
    assert.equal(written.file.pets.red_panda.baseUrl, "https://api.example.test/v1");
    assert.equal(disk.includes(PASTED), false);
    assert.equal(disk.includes(PASTED_API), false);
    assert.equal(disk.includes("key="), false);
    assert.equal(disk.includes("api_key="), false);
    assert.equal(disk.includes("api-key="), false);
    assert.equal(disk.includes("alt=sse"), true);
    assert.equal(written.file.sealedKeys, clean.file.sealedKeys);
    assert.equal(disk.includes(SECRET), false);
    assert.equal(disk.includes(PET_SECRET), false);
  });

  it("rewrites a leftover dirty base URL on read and keeps the same seal", () => {
    const sealed = Secret.writeMindRecord(mindWithKey(), xorCodec(), null).file;
    const prior = sealed.sealedKeys;
    sealed.default.baseUrl = `https://api.x.ai/v1?key=${PASTED}&alt=sse`;
    sealed.pets.red_panda.baseUrl = `https://api.example.test/v1?api_key=${PASTED_API}`;
    const opened = Secret.readMindRecord(sealed, xorCodec());
    const disk = JSON.stringify(opened.file);
    assert.equal(opened.rewrite, true);
    assert.equal(opened.kept, "os");
    assert.equal(opened.file.sealedKeys, prior);
    assert.equal(opened.mind.default.apiKey, SECRET);
    assert.equal(opened.mind.pets.red_panda.apiKey, PET_SECRET);
    assert.equal(opened.mind.default.baseUrl, "https://api.x.ai/v1?alt=sse");
    assert.equal(opened.file.default.baseUrl, "https://api.x.ai/v1?alt=sse");
    assert.equal(opened.mind.pets.red_panda.baseUrl, "https://api.example.test/v1");
    assert.equal(disk.includes(PASTED), false);
    assert.equal(disk.includes(PASTED_API), false);
    assert.equal(disk.includes(SECRET), false);
  });

  it("rewrites a locked file's dirty base URL without opening or replacing the seal", () => {
    const sealed = Secret.writeMindRecord(mindWithKey(), xorCodec(), null).file;
    const prior = sealed.sealedKeys;
    sealed.default.baseUrl = `https://api.x.ai/v1?key=${PASTED}`;
    const opened = Secret.readMindRecord(sealed, null);
    assert.equal(opened.rewrite, true);
    assert.equal(opened.kept, "locked");
    assert.equal(opened.file.sealedKeys, prior);
    assert.equal(opened.mind.default.apiKey, undefined);
    assert.equal(opened.file.default.baseUrl, "https://api.x.ai/v1");
    assert.equal(JSON.stringify(opened.file).includes(PASTED), false);
    assert.equal(JSON.stringify(opened.mind).includes(SECRET), false);
  });

  it("does not rewrite a clean base URL and strips a non-URL key assignment", () => {
    const sealed = Secret.writeMindRecord(mindWithKey(), xorCodec(), null).file;
    const opened = Secret.readMindRecord(JSON.parse(JSON.stringify(sealed)), xorCodec());
    assert.equal(opened.rewrite, false);
    assert.equal(opened.file.sealedKeys, sealed.sealedKeys);
    const cleanOdd = {
      default: { plugin: "custom", baseUrl: "not a url" },
      voice: "browser",
      pets: {},
    };
    const cleanWritten = Secret.writeMindRecord(cleanOdd, null, null);
    assert.equal(cleanWritten.file.default.baseUrl, "not a url");
    const cleanRead = Secret.readMindRecord(cleanWritten.file, null);
    assert.equal(cleanRead.rewrite, false);
    assert.equal(cleanRead.mind.default.baseUrl, "not a url");

    const odd = {
      default: { plugin: "custom", baseUrl: `not a url?key=${PASTED}` },
      voice: "browser",
      pets: {},
    };
    const written = Secret.writeMindRecord(odd, null, null);
    assert.equal(written.file.default.baseUrl, "not a url");
    assert.equal(JSON.stringify(written.file).includes(PASTED), false);
    const read = Secret.readMindRecord(written.file, null);
    assert.equal(read.rewrite, false);
    assert.equal(read.mind.default.baseUrl, "not a url");
  });

  it("drops userinfo and a path key on save and rewrites a leftover without a new seal", () => {
    const token = "sk-test-PASTEDKEY0123456789";
    const sealed = Secret.writeMindRecord(mindWithKey(), xorCodec(), null).file;
    const prior = sealed.sealedKeys;
    sealed.default.baseUrl = `https://user:${token}@api.example.test/v1/key/${token}?alt=sse`;
    sealed.pets.red_panda.baseUrl = `https://api.example.test/v1/models/gemini-2.5-flash%3Fapi_key%3D${token}`;
    const opened = Secret.readMindRecord(sealed, xorCodec());
    assert.equal(opened.rewrite, true);
    assert.equal(opened.kept, "os");
    assert.equal(opened.file.sealedKeys, prior);
    assert.equal(opened.mind.default.apiKey, SECRET);
    assert.equal(opened.file.default.baseUrl, "https://api.example.test/v1?alt=sse");
    assert.equal(opened.file.pets.red_panda.baseUrl, "https://api.example.test/v1/models/gemini-2.5-flash");
    assert.equal(JSON.stringify(opened.file).includes(token), false);
    assert.equal(JSON.stringify(opened.mind).includes(SECRET), true);
    assert.equal(JSON.stringify(opened.file).includes(SECRET), false);
  });

  it("drops a pasted secret model on save and rewrites a leftover without a new seal", () => {
    const token = "sk-test-PASTEDKEY0123456789";
    const opaque = "AbCdEfGh1234567890IjKlMnOp1234567890";
    const written = Secret.writeMindRecord(
      {
        default: { plugin: "openai", model: token, baseUrl: "https://api.openai.com/v1", apiKey: SECRET },
        voice: "browser",
        pets: {
          red_panda: { plugin: "google", model: `api_key=${token}` },
          moth: { plugin: "anthropic", model: "claude-sonnet-4-5" },
          fox: { plugin: "together", model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo" },
        },
      },
      xorCodec(),
      null,
    );
    const disk = JSON.stringify(written.file);
    assert.equal(disk.includes(token), false);
    assert.equal(disk.includes("api_key="), false);
    assert.equal(disk.includes(SECRET), false);
    assert.equal(written.file.default.model, "");
    assert.equal(written.file.default.baseUrl, "https://api.openai.com/v1");
    assert.equal(written.file.pets.red_panda.model, "");
    assert.equal(written.file.pets.moth.model, "claude-sonnet-4-5");
    assert.equal(written.file.pets.fox.model, "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo");
    assert.equal(written.kept, "os");

    const sealed = Secret.writeMindRecord(mindWithKey(), xorCodec(), null).file;
    const prior = sealed.sealedKeys;
    sealed.default.model = `key=${opaque}`;
    sealed.pets.red_panda.model = "gpt-4o";
    const opened = Secret.readMindRecord(sealed, xorCodec());
    assert.equal(opened.rewrite, true);
    assert.equal(opened.kept, "os");
    assert.equal(opened.file.sealedKeys, prior);
    assert.equal(opened.mind.default.apiKey, SECRET);
    assert.equal(opened.file.default.model, "");
    assert.equal(opened.file.pets.red_panda.model, "gpt-4o");
    assert.equal(JSON.stringify(opened.file).includes(opaque), false);
    assert.equal(JSON.stringify(opened.file).includes(SECRET), false);
    assert.equal(opened.mind.default.model, "");

    const clean = Secret.writeMindRecord(
      {
        default: { plugin: "google", model: "gemini-2.5-flash" },
        voice: "browser",
        pets: { red_panda: { plugin: "openai", model: "gpt-4o" } },
      },
      null,
      null,
    );
    const reread = Secret.readMindRecord(clean.file, null);
    assert.equal(reread.rewrite, false);
    assert.equal(reread.file.default.model, "gemini-2.5-flash");
    assert.equal(reread.file.pets.red_panda.model, "gpt-4o");
  });

  it("keeps the secret-query names in lockstep with the web module and the overlay", () => {
    const secretQuerySrc = readSource(path.join(__dirname, "..", "..", "web/src/lib/ai/secret-query.mjs"));
    const overlay = readSource(path.join(__dirname, "mind.js"));
    const disk = readSource(path.join(__dirname, "..", "mind-secret.cjs"));
    const namesOf = (src) => {
      const block = src.slice(src.indexOf("SECRET_QUERY_NAMES"), src.indexOf("function isSecretQueryName"));
      return [...block.matchAll(/"([a-z_]+)"/g)].map((m) => m[1]);
    };
    const shared = namesOf(secretQuerySrc);
    assert.deepEqual(namesOf(overlay), shared);
    assert.deepEqual(namesOf(disk), shared);
    assert.match(disk, /scrubSecretQueryString/);
    assert.match(overlay, /scrubSecretQueryString/);
    assert.match(disk, /baseUrlsNeedRewrite/);
    assert.match(disk, /function isPastedKeySegment/);
    assert.match(overlay, /function isPastedKeySegment/);
    assert.match(disk, /function stripUserinfo/);
    assert.match(overlay, /function stripUserinfo/);
    const helper = (src) => {
      let start = src.indexOf("function secretNameSource");
      start = src.lastIndexOf("\n", start) + 1;
      const endName = src.indexOf("function scrubSecretModel");
      const after = src.slice(endName);
      let depth = 0;
      let end = -1;
      for (let i = after.indexOf("{"); i < after.length; i += 1) {
        if (after[i] === "{") depth += 1;
        else if (after[i] === "}") {
          depth -= 1;
          if (depth === 0) {
            end = i + 1;
            break;
          }
        }
      }
      const block = src.slice(start, endName + end);
      const lines = block.replace(/export function /g, "function ").split("\n");
      const min = Math.min(...lines.filter((line) => line.trim()).map((line) => line.match(/^ */)[0].length));
      return lines.map((line) => line.slice(min)).join("\n").trim();
    };
    assert.equal(helper(disk), helper(secretQuerySrc));
    assert.equal(helper(overlay), helper(secretQuerySrc));
  });
});

describe("overlay mind.js local store", () => {
  it("does not copy the plugin key into localStorage when the desk bridge is up", async () => {
    const store = new Map();
    store.set(
      "computerpets.mind.v1",
      JSON.stringify({ default: { plugin: "xai", apiKey: SECRET }, voice: "browser", pets: {} }),
    );
    let sent = null;
    const window = {
      localStorage: {
        getItem: (key) => (store.has(key) ? store.get(key) : null),
        setItem: (key, value) => {
          store.set(key, String(value));
        },
      },
      desk: {
        mindGet() {
          return {
            default: { plugin: "xai", apiKey: SECRET },
            voice: "browser",
            pets: {},
            keyKept: "os",
          };
        },
        mindSet(data) {
          sent = data;
          return Promise.resolve({ kept: "os" });
        },
      },
    };
    window.window = window;
    const context = vm.createContext(window);
    vm.runInContext(fs.readFileSync(path.join(__dirname, "mind.js"), "utf8"), context);
    const loaded = window.PetMind.load();
    assert.equal(loaded.default.apiKey, SECRET);
    assert.equal(store.get("computerpets.mind.v1").includes(SECRET), false);
    assert.equal(store.get("computerpets.mind.v1").includes("apiKey"), false);

    window.PetMind.save({
      default: { plugin: "xai", model: "grok-4.5", baseUrl: "https://api.x.ai/v1", apiKey: SECRET },
      voice: "browser",
      pets: { red_panda: { plugin: "openai", apiKey: PET_SECRET } },
      keyKept: "os",
    });
    const kept = await window.PetMind.save({
      default: { plugin: "xai", apiKey: SECRET },
      voice: "browser",
      pets: {},
    });
    assert.equal(kept.kept, "os");
    assert.equal(sent.default.apiKey, SECRET);
    assert.equal(store.get("computerpets.mind.v1").includes(SECRET), false);
    assert.equal(store.get("computerpets.mind.v1").includes(PET_SECRET), false);
  });

  it("does not keep a plain key in the browser when the desk bridge is down", async () => {
    const local = new Map();
    const session = new Map();
    session.set(
      "computerpets.mind.v1",
      JSON.stringify({ default: { plugin: "xai", apiKey: SECRET }, voice: "browser", pets: {} }),
    );
    const window = {
      localStorage: {
        getItem: (key) => (local.has(key) ? local.get(key) : null),
        setItem: (key, value) => {
          local.set(key, String(value));
        },
        removeItem: (key) => {
          local.delete(key);
        },
      },
      sessionStorage: {
        getItem: (key) => (session.has(key) ? session.get(key) : null),
        setItem: (key, value) => {
          session.set(key, String(value));
        },
        removeItem: (key) => {
          session.delete(key);
        },
      },
    };
    window.window = window;
    const context = vm.createContext(window);
    vm.runInContext(fs.readFileSync(path.join(__dirname, "mind.js"), "utf8"), context);
    const loaded = window.PetMind.load();
    assert.equal(loaded.default.apiKey, SECRET);
    assert.equal(loaded.keyKept, "none");
    assert.equal(session.has("computerpets.mind.v1"), false);
    const again = window.PetMind.load();
    assert.equal(again.default.apiKey, SECRET);
    const saved = await window.PetMind.save({
      default: { plugin: "openai", apiKey: PET_SECRET },
      voice: "browser",
      pets: {},
    });
    assert.equal(saved.kept, "none");
    assert.equal(local.get("computerpets.mind.v1").includes(PET_SECRET), false);
    assert.equal(local.get("computerpets.mind.v1").includes(SECRET), false);
    assert.equal(local.get("computerpets.mind.v1").includes("apiKey"), false);
    assert.equal(window.PetMind.load().default.apiKey, PET_SECRET);
  });

  it("drops a pasted key query from the browser copy and from the loaded mind", async () => {
    const dirty = `https://example.test/v1beta?key=${PASTED}&api_key=${PASTED_API}&alt=sse`;
    const local = new Map();
    local.set(
      "computerpets.mind.v1",
      JSON.stringify({
        default: { plugin: "google", baseUrl: dirty, apiKey: SECRET },
        voice: "browser",
        pets: { red_panda: { plugin: "openai", baseUrl: `https://api.example.test/v1?api_key=${PASTED_API}` } },
      }),
    );
    const window = {
      localStorage: {
        getItem: (key) => (local.has(key) ? local.get(key) : null),
        setItem: (key, value) => {
          local.set(key, String(value));
        },
        removeItem: (key) => {
          local.delete(key);
        },
      },
      URL,
      URLSearchParams,
      decodeURIComponent,
    };
    window.window = window;
    vm.runInContext(fs.readFileSync(path.join(__dirname, "mind.js"), "utf8"), vm.createContext(window));
    const loaded = window.PetMind.load();
    assert.equal(loaded.default.baseUrl, "https://example.test/v1beta?alt=sse");
    assert.equal(loaded.pets.red_panda.baseUrl, "https://api.example.test/v1");
    assert.equal(loaded.default.apiKey, SECRET);
    const disk = local.get("computerpets.mind.v1");
    assert.equal(disk.includes(PASTED), false);
    assert.equal(disk.includes(PASTED_API), false);
    assert.equal(disk.includes("apiKey"), false);
    assert.equal(disk.includes("alt=sse"), true);
    const saved = await window.PetMind.save({
      default: { plugin: "google", baseUrl: `https://example.test/v1?api-key=${PASTED}&alt=sse`, apiKey: PET_SECRET },
      voice: "browser",
      pets: {},
    });
    assert.equal(saved.kept, "none");
    assert.equal(window.PetMind.load().default.baseUrl, "https://example.test/v1?alt=sse");
    assert.equal(local.get("computerpets.mind.v1").includes(PASTED), false);
    assert.equal(local.get("computerpets.mind.v1").includes(PET_SECRET), false);
  });

  it("drops userinfo, a path key, and a non-URL key assignment from the browser copy", async () => {
    const token = "sk-test-PASTEDKEY0123456789";
    const local = new Map();
    const window = {
      localStorage: {
        getItem: (key) => (local.has(key) ? local.get(key) : null),
        setItem: (key, value) => {
          local.set(key, String(value));
        },
        removeItem: (key) => {
          local.delete(key);
        },
      },
      URL,
      URLSearchParams,
      decodeURIComponent,
    };
    window.window = window;
    vm.runInContext(fs.readFileSync(path.join(__dirname, "mind.js"), "utf8"), vm.createContext(window));
    await window.PetMind.save({
      default: {
        plugin: "openai",
        baseUrl: `https://user:${token}@api.example.test/v1/key/${token}?alt=sse`,
      },
      voice: "browser",
      pets: {
        red_panda: { plugin: "google", baseUrl: `not a url?api_key=${token}` },
      },
    });
    const disk = local.get("computerpets.mind.v1");
    assert.equal(disk.includes(token), false);
    assert.equal(disk.includes("alt=sse"), true);
    const loaded = window.PetMind.load();
    assert.equal(loaded.default.baseUrl, "https://api.example.test/v1?alt=sse");
    assert.equal(loaded.pets.red_panda.baseUrl, "not a url");
    assert.equal(loaded.default.model, undefined);
  });

  it("does not hand a pasted key query to the desk bridge or the browser copy", async () => {
    const local = new Map();
    local.set(
      "computerpets.mind.v1",
      JSON.stringify({
        default: { plugin: "google", baseUrl: `https://example.test/v1?key=${PASTED}` },
        voice: "browser",
        pets: {},
      }),
    );
    let sent = null;
    const window = {
      localStorage: {
        getItem: (key) => (local.has(key) ? local.get(key) : null),
        setItem: (key, value) => {
          local.set(key, String(value));
        },
        removeItem: (key) => {
          local.delete(key);
        },
      },
      URL,
      URLSearchParams,
      decodeURIComponent,
      desk: {
        mindGet() {
          return {
            default: { plugin: "google", baseUrl: `https://example.test/v1?api_key=${PASTED_API}&alt=sse`, apiKey: SECRET },
            voice: "browser",
            pets: { red_panda: { plugin: "openai", baseUrl: `https://api.example.test/v1?token=${PASTED}` } },
            keyKept: "os",
          };
        },
        mindSet(data) {
          sent = data;
          return Promise.resolve({ kept: "os" });
        },
      },
    };
    window.window = window;
    vm.runInContext(fs.readFileSync(path.join(__dirname, "mind.js"), "utf8"), vm.createContext(window));
    const loaded = window.PetMind.load();
    assert.equal(loaded.default.baseUrl, "https://example.test/v1?alt=sse");
    assert.equal(loaded.pets.red_panda.baseUrl, "https://api.example.test/v1");
    assert.equal(loaded.default.apiKey, SECRET);
    assert.equal(local.get("computerpets.mind.v1").includes(PASTED), false);
    const kept = await window.PetMind.save({
      default: { plugin: "google", baseUrl: `https://example.test/v1?key=${PASTED}&alt=sse`, apiKey: SECRET },
      voice: "browser",
      pets: {},
      keyKept: "os",
    });
    assert.equal(kept.kept, "os");
    assert.equal(sent.default.baseUrl, "https://example.test/v1?alt=sse");
    assert.equal(sent.default.apiKey, SECRET);
    assert.equal(JSON.stringify(sent).includes(PASTED), false);
    assert.equal(local.get("computerpets.mind.v1").includes(PASTED), false);
    assert.equal(local.get("computerpets.mind.v1").includes(SECRET), false);
  });
});

describe("overlay main wiring", () => {
  it("seals through mind-secret and does not write the raw mind object", () => {
    const main = fs.readFileSync(path.join(__dirname, "..", "main.cjs"), "utf8");
    const preload = fs.readFileSync(path.join(__dirname, "..", "preload.cjs"), "utf8");
    const writeMind = main.split("function writeMind")[1].split("function ")[0];
    const readMind = main.split("function readMind")[1].split("function ")[0];
    assert.match(writeMind, /MindSecret\.writeMindRecord/);
    assert.match(readMind, /MindSecret\.readMindRecord/);
    assert.doesNotMatch(writeMind, /JSON\.stringify\(data\)/);
    assert.doesNotMatch(writeMind, /apiKey/);
    assert.match(preload, /mindSet: \(data\) => ipcRenderer\.invoke\("mind-set", data\)/);
  });
});

describe("minds settings copy", () => {
  it("tells the keeper the key is not plain text in mind.json", () => {
    const html = fs.readFileSync(path.join(__dirname, "settings.html"), "utf8");
    assert.match(html, /not written in plain text in mind\.json/);
    assert.doesNotMatch(html, /keyStore\.textContent = key\.value/);
    assert.doesNotMatch(html, /ok\.textContent = key\.value/);
  });
});
