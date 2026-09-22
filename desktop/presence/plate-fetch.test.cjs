"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  PLATE_TIMEOUT_MS,
  PlateTimeout,
  unread,
  fetchPlate,
  readRadioDirectory,
  parseJson,
} = require("./plate-fetch.cjs");

const DE1 = "https://de1.api.radio-browser.info";
const DE2 = "https://de2.api.radio-browser.info";
const SEARCH = `${DE1}/json/stations/search?name=KEXP`;

function urlsOnHost(urls, host) {
  return urls.map((url) => {
    const parsed = new URL(url);
    return `${host}${parsed.pathname}${parsed.search}`;
  });
}

function hang() {
  return new Promise(() => {});
}

describe("plate IPC fetch times out and denies", () => {
  it("aborts a fetch that never answers and does not return a body", async () => {
    const calls = [];
    await assert.rejects(
      () =>
        fetchPlate(
          "https://news.google.com/rss",
          { headers: { Accept: "application/rss+xml" } },
          {
            timeoutMs: 30,
            fetchImpl: (url) => {
              calls.push(url);
              return hang();
            },
          },
        ),
      (err) => err instanceof PlateTimeout && err.name === "PlateTimeout",
    );
    assert.deepEqual(calls, ["https://news.google.com/rss"]);
    const denied = unread({ items: [] });
    assert.equal(denied.ok, false);
    assert.equal(denied.error, "unread");
    assert.deepEqual(denied.items, []);
    assert.equal(denied.price, undefined);
    assert.equal(PLATE_TIMEOUT_MS, 12_000);
  });

  it("returns the real body when the host answers, and does not invent JSON", async () => {
    const res = await fetchPlate("https://api.coingecko.com/api/v3/simple/price", undefined, {
      timeoutMs: 200,
      fetchImpl: async () => ({
        ok: true,
        status: 200,
        text: async () => "{\"bitcoin\":{\"usd\":1}}",
      }),
    });
    assert.equal(res.ok, true);
    assert.deepEqual(parseJson(res.text), { bitcoin: { usd: 1 } });
    assert.equal(parseJson("not-json"), null);
    assert.equal(parseJson(""), null);
    const denied = unread({ live: null });
    assert.equal(denied.ok, false);
    assert.equal(denied.live, null);
  });

  it("a radio timeout does not call the next directory host", async () => {
    const calls = [];
    await assert.rejects(
      () =>
        readRadioDirectory(SEARCH, {
          hosts: [DE1, DE2],
          urlsOnHost,
          timeoutMs: 30,
          fetchImpl: (url) => {
            calls.push(url);
            return hang();
          },
        }),
      (err) => err instanceof PlateTimeout,
    );
    assert.deepEqual(calls, [SEARCH]);
    const denied = unread({ stations: [] });
    assert.equal(denied.ok, false);
    assert.deepEqual(denied.stations, []);
  });

  it("a radio answer is the host body, not a made-up station", async () => {
    const calls = [];
    const json = await readRadioDirectory(SEARCH, {
      hosts: [DE1, DE2],
      urlsOnHost,
      timeoutMs: 200,
      fetchImpl: async (url) => {
        calls.push(url);
        return {
          ok: true,
          status: 200,
          text: async () => "[{\"name\":\"KEXP\",\"url\":\"https://kexp.example/stream\"}]",
        };
      },
    });
    assert.deepEqual(calls, [SEARCH]);
    assert.equal(json[0].name, "KEXP");
    assert.equal(json[0].url, "https://kexp.example/stream");
  });
});

describe("desktop main uses the plate deadline before those handlers return", () => {
  const main = fs.readFileSync(path.join(__dirname, "../main.cjs"), "utf8");

  function handler(name, next) {
    const start = main.indexOf(`ipcMain.handle("${name}"`);
    const end = next ? main.indexOf(`ipcMain.handle("${next}"`, start + 1) : main.length;
    assert.ok(start > 0, name);
    return main.slice(start, end);
  }

  it("news, quote, and radio handlers read through the plate deadline", () => {
    assert.match(main, /require\("\.\/presence\/plate-fetch\.cjs"\)/);
    const radioFn = main.slice(main.indexOf("function fetchRadioJson"), main.indexOf("function heldPlate"));
    assert.match(radioFn, /readRadioDirectory/);
    assert.doesNotMatch(radioFn, /\bfetch\(/);
    const radio = handler("radio-search", "news-topic");
    assert.match(radio, /fetchRadioJson/);
    assert.doesNotMatch(radio, /\bfetch\(/);
    const newsFn = main.slice(main.indexOf("async function fetchNewsRss"), main.indexOf("ipcMain.handle(\"news-topic\""));
    assert.match(newsFn, /fetchPlate\(/);
    assert.match(handler("news-topic", "news-feed"), /fetchNewsRss/);
    assert.match(handler("news-feed", "market-quote"), /fetchNewsRss/);
    for (const [name, next] of [
      ["market-quote", "market-quotes"],
      ["market-quotes", "market-terminal"],
      ["market-terminal", "market-search"],
      ["market-search", "nft-quote"],
      ["nft-quote", "license-status"],
    ]) {
      const body = handler(name, next);
      assert.match(body, /fetchPlate\(/, name);
      assert.doesNotMatch(body, /\bfetch\(/, name);
    }
    const license = main.slice(main.indexOf('ipcMain.handle("license-status"'));
    assert.doesNotMatch(license, /fetchPlate\(/);
  });
});
