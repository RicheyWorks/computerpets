"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const vm = require("node:vm");

const SECRET = "gem-key/with?and=&equals";
const PET_SECRET = "pet-gem-key?not=on-url";
const MIND_SRC = fs.readFileSync(path.join(__dirname, "mind.js"), "utf8");

function loadMind(fetchImpl) {
  const calls = [];
  const window = {
    PetWeatherAreas: require("./weather-areas.js"),
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
    AbortController,
    setTimeout,
    clearTimeout,
    fetch: async (url, init) => {
      calls.push({ url: String(url), init });
      if (typeof fetchImpl === "function") return fetchImpl(url, init);
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
    lineInView: true,
  };
}

function painted(window, species) {
  const bind = window.PetMind.binding(species);
  return { ...ctx(species), shown: window.PetMind.talkHonesty(bind) };
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
    const reply = await window.PetMind.run(painted(window, "red_panda"));
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
    const reply = await window.PetMind.run(painted(window, "red_panda"));
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
    await window.PetMind.run(painted(window, "moth"));
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
    const reply = await window.PetMind.run(painted(window, "red_panda"));
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
      await window.PetMind.run(painted(window, "red_panda"));
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
      await window.PetMind.run(painted(window, "red_panda"));
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

describe("overlay drops a pasted secret model before the direct call", () => {
  const TOKEN = "sk-test-PASTEDKEY0123456789";
  const OPAQUE = "AbCdEfGh1234567890IjKlMnOp1234567890";

  it("does not store or send a secret model, and keeps a normal model id", async () => {
    const stored = [];
    const calls = [];
    const window = {
      PetWeatherAreas: require("./weather-areas.js"),
      localStorage: {
        getItem: () => null,
        setItem: (_key, value) => {
          stored.push(String(value));
        },
        removeItem: () => {},
      },
      sessionStorage: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      },
      URL,
      URLSearchParams,
      AbortController,
      setTimeout,
      clearTimeout,
      fetch: async (url, init) => {
        calls.push({ url: String(url), init });
        return {
          ok: true,
          json: async () => ({ candidates: [{ content: { parts: [{ text: "gemini line" }] } }] }),
        };
      },
    };
    window.window = window;
    vm.runInContext(MIND_SRC, vm.createContext(window));
    await window.PetMind.save({
      default: {
        plugin: "google",
        apiKey: SECRET,
        model: TOKEN,
        baseUrl: "https://example.test/v1beta",
      },
      voice: "browser",
      pets: {
        red_panda: { plugin: "openai", model: `key=${OPAQUE}` },
        moth: { plugin: "anthropic", model: "claude-sonnet-4-5" },
      },
    });
    const copy = stored.join("\n");
    assert.equal(copy.includes(TOKEN), false);
    assert.equal(copy.includes(OPAQUE), false);
    assert.equal(copy.includes("claude-sonnet-4-5"), true);
    const reply = await window.PetMind.run(painted(window, "budgie"));
    assert.equal(calls.length, 1);
    const url = calls[0].url;
    assert.equal(url.includes(TOKEN), false);
    assert.equal(url.includes(OPAQUE), false);
    assert.equal(new URL(url).pathname, "/v1beta/models/gemini-2.5-flash:generateContent");
    assert.equal(JSON.stringify(calls[0].init.body).includes(TOKEN), false);
    assert.equal(reply.source, "google");
    const loaded = window.PetMind.load();
    assert.equal(loaded.default.model, "");
    assert.equal(loaded.pets.moth.model, "claude-sonnet-4-5");
    assert.equal(loaded.pets.red_panda.model, "");
  });
});

describe("overlay cloud talk names the host before the fetch", () => {
  it("names api.x.ai and does not fetch until that line is in view", async () => {
    const { window, calls } = loadMind();
    const line = window.PetMind.talkHonesty({ plugin: "xai" });
    assert.equal(
      line,
      "This sends what you typed, your pet's name, and how hungry, happy, and rested it is to xAI, an AI website, so your pet can answer. It also sends your key for xAI, if you saved one. This computer's internet address also goes to xAI, like visiting any website.",
    );
    assert.equal(line.includes("/v1"), false);
    assert.equal(line.includes("?"), false);
    assert.equal(window.PetMind.talkMaySend({ plugin: "xai" }, false), false);
    assert.equal(window.PetMind.talkMaySend({ plugin: "xai" }, true), true);
    await window.PetMind.save({
      default: { plugin: "xai", apiKey: "sk-not-on-the-line" },
      voice: "browser",
      pets: {},
    });
    const held = await window.PetMind.run({ ...ctx("red_panda"), lineInView: false });
    assert.equal(calls.length, 0);
    assert.equal(held.source, "local");
    const booleanOnly = await window.PetMind.run({ ...ctx("red_panda"), lineInView: true, shown: "" });
    assert.equal(calls.length, 0);
    assert.equal(booleanOnly.source, "local");
    const otherHost = await window.PetMind.run({
      ...ctx("red_panda"),
      shown: window.PetMind.talkHonesty({ plugin: "openai" }),
    });
    assert.equal(calls.length, 0);
    assert.equal(otherHost.source, "local");
    assert.equal(line.includes("sk-not-on-the-line"), false);
    const sent = await window.PetMind.run(painted(window, "red_panda"));
    assert.equal(calls.length, 1);
    assert.equal(new URL(calls[0].url).hostname, "api.x.ai");
    assert.equal(sent.source, "xai");
  });

  it("times out a silent talk host and keeps the house line", async () => {
    assert.match(MIND_SRC, /TALK_TIMEOUT_MS/);
    assert.match(MIND_SRC, /TalkTimeout/);
    assert.match(MIND_SRC, /AbortController/);
    const { window } = loadMind(() => new Promise(() => {}));
    assert.equal(window.PetMind.TALK_TIMEOUT_MS, 12_000);
    assert.equal(window.PetMind.TalkTimeout.name, "TalkTimeout");
    const hang = window.PetMind.readTalk(
      window.PetMind.talkHonesty({ plugin: "xai" }),
      { plugin: "xai" },
      () => new Promise(() => {}),
      { text: "house", source: "local" },
      30,
    );
    await assert.rejects(
      () => hang,
      (err) => err instanceof window.PetMind.TalkTimeout && err.name === "TalkTimeout",
    );

    let fulfilled = null;
    const late = window.PetMind.readTalk(
      window.PetMind.talkHonesty({ plugin: "xai" }),
      { plugin: "xai" },
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ text: "late", source: "xai" }), 80);
        }),
      { text: "house", source: "local" },
      20,
    ).then(
      (body) => {
        fulfilled = body;
        return body;
      },
      (err) => {
        fulfilled = err;
        throw err;
      },
    );
    await assert.rejects(() => late, (err) => err instanceof window.PetMind.TalkTimeout);
    await new Promise((r) => setTimeout(r, 120));
    assert.ok(fulfilled instanceof window.PetMind.TalkTimeout);
    assert.equal(fulfilled.name, "TalkTimeout");

    const loop = await window.PetMind.readTalk(
      "",
      { plugin: "ollama", baseUrl: "http://127.0.0.1:11434" },
      async () => {
        await new Promise((r) => setTimeout(r, 40));
        return { text: "here", source: "ollama" };
      },
      { text: "house", source: "local" },
      15,
    );
    assert.equal(loop.source, "ollama");
  });

  it("names a custom host and keeps the path off the line", () => {
    const { window } = loadMind();
    const line = window.PetMind.talkHonesty({
      plugin: "custom",
      baseUrl: "https://mind.example.test/hook?alt=sse#room",
    });
    assert.match(line, /to mind\.example\.test, the AI website you set up, so your pet can answer\./);
    assert.match(line, /also goes to mind\.example\.test, like visiting any website\./);
    assert.equal(line.includes("/hook"), false);
    assert.equal(line.includes("alt="), false);
    assert.equal(line.includes("#room"), false);
    assert.equal(window.PetMind.talkHonesty({ plugin: "local" }), "");
    assert.equal(
      window.PetMind.talkHonesty({ plugin: "ollama", baseUrl: "http://127.0.0.1:11434" }),
      "",
    );
    assert.equal(window.PetMind.talkMaySend({ plugin: "ollama" }, false), true);
  });

  it("does not fetch a remote custom mind without the line", async () => {
    const { window, calls } = loadMind();
    await window.PetMind.save({
      default: { plugin: "custom", baseUrl: "https://mind.example.test/mind" },
      voice: "browser",
      pets: {},
    });
    const held = await window.PetMind.run({ ...ctx("red_panda"), lineInView: false });
    assert.equal(calls.length, 0);
    assert.equal(held.source, "local");
    assert.equal(held.text, "house line");
    const booleanOnly = await window.PetMind.run({ ...ctx("red_panda"), lineInView: true });
    assert.equal(calls.length, 0);
    assert.equal(booleanOnly.text, "house line");
  });
});
