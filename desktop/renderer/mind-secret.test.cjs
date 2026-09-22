"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const vm = require("node:vm");
const Secret = require("../mind-secret.cjs");

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
