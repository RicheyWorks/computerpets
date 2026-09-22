"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const vm = require("node:vm");

const SECRET = "gem-key/with?and=&equals";
const PET_SECRET = "pet-gem-key?not=on-url";
const MIND_SRC = fs.readFileSync(path.join(__dirname, "mind.js"), "utf8");

function loadMind() {
  const calls = [];
  const window = {
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    },
    sessionStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    },
    URL,
    URLSearchParams,
    fetch: async (url, init) => {
      calls.push({ url: String(url), init });
      return {
        ok: true,
        json: async () => ({
          choices: [{ message: { content: "openai line" } }],
          content: [{ text: "anthropic line" }],
          candidates: [{ content: { parts: [{ text: "gemini line" }] } }],
          text: "custom line",
        }),
      };
    },
  };
  window.window = window;
  vm.runInContext(MIND_SRC, vm.createContext(window));
  return { window, calls };
}

function ctx(species) {
  return {
    species,
    name: "Moth",
    hunger: 40,
    mood: 50,
    energy: 60,
    system: "Be small.",
    message: "hello",
    fallback: "house line",
  };
}

function headerValue(init, name) {
  const headers = (init && init.headers) || {};
  const found = Object.keys(headers).find((key) => key.toLowerCase() === name.toLowerCase());
  return found ? headers[found] : undefined;
}

function assertKeyOffUrl(url, secret) {
  const parsed = new URL(url);
  assert.equal(parsed.searchParams.has("key"), false);
  assert.equal(parsed.search.includes("key="), false);
  assert.equal(url.includes(secret), false);
  assert.equal(url.includes(encodeURIComponent(secret)), false);
  assert.equal(parsed.username, "");
  assert.equal(parsed.password, "");
}

describe("overlay gemini key stays off the query", () => {
  it("does not build a generateContent URL with ?key=", () => {
    assert.doesNotMatch(MIND_SRC, /\?key=/);
    assert.doesNotMatch(MIND_SRC, /[?&]key=/);
    assert.doesNotMatch(MIND_SRC, /searchParams\.set/);
    assert.doesNotMatch(MIND_SRC, /searchParams\.append/);
    assert.match(MIND_SRC, /searchParams\.delete/);
    assert.match(MIND_SRC, /function sanitizeModel/);
    assert.match(MIND_SRC, /x-goog-api-key/);
    assert.doesNotMatch(MIND_SRC, /converseWithPet/);
    assert.doesNotMatch(MIND_SRC, /localhost:8080/);
    assert.doesNotMatch(MIND_SRC, /\/api\/pets/);
  });

  it("sends the plugin key as x-goog-api-key on a direct generateContent call", async () => {
    const { window, calls } = loadMind();
    await window.PetMind.save({
      default: {
        plugin: "google",
        apiKey: SECRET,
        model: "gemini-2.5-flash",
      },
      voice: "browser",
      pets: {},
    });
    const reply = await window.PetMind.run(ctx("red_panda"));
    assert.equal(calls.length, 1);
    const { url, init } = calls[0];
    const parsed = new URL(url);
    assert.equal(reply.text, "gemini line");
    assert.equal(reply.source, "google");
    assert.equal(parsed.origin, "https://generativelanguage.googleapis.com");
    assert.equal(parsed.pathname, "/v1beta/models/gemini-2.5-flash:generateContent");
    assert.equal(parsed.search, "");
    assertKeyOffUrl(url, SECRET);
    assert.equal(headerValue(init, "x-goog-api-key"), SECRET);
    assert.equal(headerValue(init, "authorization"), undefined);
    assert.equal(JSON.stringify(init.body).includes(SECRET), false);
    assert.equal(init.method, "POST");
  });

  it("uses the animal key on that same direct call, still off the URL", async () => {
    const { window, calls } = loadMind();
    await window.PetMind.save({
      default: { plugin: "local" },
      voice: "browser",
      pets: {
        red_panda: {
          plugin: "google",
          apiKey: PET_SECRET,
          baseUrl: "https://example.test/gemini",
          model: "gemini-2.0-flash",
        },
      },
    });
    const reply = await window.PetMind.run(ctx("red_panda"));
    assert.equal(calls.length, 1);
    const { url, init } = calls[0];
    const parsed = new URL(url);
    assert.equal(reply.source, "google");
    assert.equal(parsed.origin, "https://example.test");
    assert.equal(parsed.pathname, "/gemini/models/gemini-2.0-flash:generateContent");
    assert.equal(parsed.search, "");
    assertKeyOffUrl(url, PET_SECRET);
    assert.equal(headerValue(init, "x-goog-api-key"), PET_SECRET);
    assert.equal(url.includes("computerpets"), false);
    assert.equal(url.includes("/api/"), false);
  });

  it("omits the header when there is no key, and still does not invent a query", async () => {
    const { window, calls } = loadMind();
    await window.PetMind.save({
      default: { plugin: "google", apiKey: "", model: "gemini-2.5-flash" },
      voice: "browser",
      pets: {},
    });
    await window.PetMind.run(ctx("moth"));
    assert.equal(calls.length, 1);
    assert.equal(new URL(calls[0].url).search, "");
    assert.equal(headerValue(calls[0].init, "x-goog-api-key"), undefined);
  });
});

describe("overlay drops a pasted key query before the direct call", () => {
  const PASTED = "pasted-key-VALUE-should-not-ride";
  const PASTED_API = "pasted-api-key-VALUE-should-not-ride";
  const MODEL_BIT = "model-query-VALUE-should-not-ride";

  function pastedBase(originPath) {
    return `${originPath}?key=${PASTED}&api_key=${PASTED_API}&api-key=${PASTED}&access_token=${PASTED}&token=${PASTED}&alt=sse#key=${PASTED}`;
  }

  function assertScrubbed(url, secrets) {
    const parsed = new URL(url);
    for (const name of ["key", "api_key", "api-key", "apikey", "access_token", "token", "secret"]) {
      assert.equal(parsed.searchParams.has(name), false, name);
    }
    assert.equal(parsed.hash, "");
    for (const secret of secrets) {
      assert.equal(url.includes(secret), false, secret);
      assert.equal(url.includes(encodeURIComponent(secret)), false, secret);
    }
  }

  it("strips a pasted key query on generateContent and ignores a model query", async () => {
    const { window, calls } = loadMind();
    await window.PetMind.save({
      default: { plugin: "local" },
      voice: "browser",
      pets: {
        red_panda: {
          plugin: "google",
          apiKey: SECRET,
          baseUrl: pastedBase("https://example.test/v1beta"),
          model: `gemini-2.0-flash?key=${MODEL_BIT}&api_key=${PASTED_API}`,
        },
      },
    });
    const reply = await window.PetMind.run(ctx("red_panda"));
    assert.equal(calls.length, 1);
    const { url, init } = calls[0];
    const parsed = new URL(url);
    assert.equal(reply.source, "google");
    assert.equal(parsed.origin, "https://example.test");
    assert.equal(parsed.pathname, "/v1beta/models/gemini-2.5-flash:generateContent");
    assert.equal(parsed.searchParams.get("alt"), "sse");
    assertScrubbed(url, [SECRET, PASTED, PASTED_API, MODEL_BIT]);
    assert.equal(headerValue(init, "x-goog-api-key"), SECRET);
    assert.equal(JSON.stringify(init.body).includes(MODEL_BIT), false);
    assert.equal(JSON.stringify(init.body).includes(PASTED), false);
    assert.equal(JSON.stringify(init.body).includes("gemini-2.0-flash?"), false);
    assert.equal(url.includes("localhost"), false);
    assert.equal(url.includes("/api/pets"), false);
  });

  it("strips the same pasted query on OpenAI-compatible, Anthropic, and custom calls", async () => {
    const cases = [
      {
        plugin: "openai",
        header: "authorization",
        value: `Bearer ${SECRET}`,
        path: "/v1/chat/completions",
        origin: "https://api.example.test",
        baseUrl: pastedBase("https://api.example.test/v1"),
        model: `gpt-4.1-mini?key=${MODEL_BIT}`,
        fallbackModel: "gpt-4.1-mini",
      },
      {
        plugin: "anthropic",
        header: "x-api-key",
        value: SECRET,
        path: "/v1/messages",
        origin: "https://api.anthropic.com",
        baseUrl: pastedBase("https://api.anthropic.com"),
        model: `claude-sonnet-4-5&api_key=${PASTED_API}`,
        fallbackModel: "claude-sonnet-4-5",
      },
      {
        plugin: "custom",
        header: "authorization",
        value: `Bearer ${SECRET}`,
        path: "/mind",
        origin: "https://hooks.example",
        baseUrl: pastedBase("https://hooks.example/mind"),
        model: "default",
        fallbackModel: "default",
      },
    ];
    for (const item of cases) {
      const { window, calls } = loadMind();
      await window.PetMind.save({
        default: {
          plugin: item.plugin,
          apiKey: SECRET,
          baseUrl: item.baseUrl,
          model: item.model,
        },
        voice: "browser",
        pets: {},
      });
      await window.PetMind.run(ctx("red_panda"));
      assert.equal(calls.length, 1, item.plugin);
      const parsed = new URL(calls[0].url);
      assert.equal(parsed.origin, item.origin, item.plugin);
      assert.equal(parsed.pathname, item.path, item.plugin);
      assert.equal(parsed.searchParams.get("alt"), "sse", item.plugin);
      assertScrubbed(calls[0].url, [SECRET, PASTED, PASTED_API, MODEL_BIT]);
      assert.equal(headerValue(calls[0].init, item.header), item.value, item.plugin);
      const body = JSON.stringify(calls[0].init.body);
      assert.equal(body.includes(SECRET), false, item.plugin);
      assert.equal(body.includes(PASTED), false, item.plugin);
      assert.equal(body.includes(MODEL_BIT), false, item.plugin);
      if (item.plugin !== "custom") assert.match(body, new RegExp(item.fallbackModel), item.plugin);
    }
  });
});

describe("overlay sibling plugin calls keep the key in a header", () => {
  it("keeps OpenAI-compatible, Anthropic, and custom keys off the URL", async () => {
    const cases = [
      {
        plugin: "openai",
        header: "authorization",
        value: `Bearer ${SECRET}`,
        path: "/v1/chat/completions",
        origin: "https://api.openai.com",
      },
      {
        plugin: "anthropic",
        header: "x-api-key",
        value: SECRET,
        path: "/v1/messages",
        origin: "https://api.anthropic.com",
      },
      {
        plugin: "custom",
        header: "authorization",
        value: `Bearer ${SECRET}`,
        path: "/mind",
        origin: "https://hooks.example",
        baseUrl: "https://hooks.example/mind",
      },
    ];
    for (const item of cases) {
      const { window, calls } = loadMind();
      await window.PetMind.save({
        default: {
          plugin: item.plugin,
          apiKey: SECRET,
          ...(item.baseUrl ? { baseUrl: item.baseUrl } : {}),
        },
        voice: "browser",
        pets: {},
      });
      await window.PetMind.run(ctx("red_panda"));
      assert.equal(calls.length, 1, item.plugin);
      const parsed = new URL(calls[0].url);
      assert.equal(parsed.origin, item.origin, item.plugin);
      assert.equal(parsed.pathname, item.path, item.plugin);
      assert.equal(parsed.search, "", item.plugin);
      assertKeyOffUrl(calls[0].url, SECRET);
      assert.equal(headerValue(calls[0].init, item.header), item.value, item.plugin);
      assert.equal(JSON.stringify(calls[0].init.body).includes(SECRET), false, item.plugin);
    }
  });
});
