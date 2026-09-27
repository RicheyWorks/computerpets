"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  LOCAL_STAYS,
  clientNetLine,
  plainNetLine,
  mayFetch,
  NEWS_HOST,
  QUOTE_HOST,
  TERMINAL_HOST,
  STOCK_HOST,
  NEWS_LEAD,
  RADIO_LEAD,
  QUOTE_LEAD,
  LOOK_LEAD,
} = require("./plate-net.cjs");

const NEWS = "https://news.google.com/rss?hl=en-US";
const GECKO = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin";
const TERMINAL = "https://api.geckoterminal.com/api/v2/networks/solana/tokens/mint";
const YAHOO = "https://query1.finance.yahoo.com/v8/finance/chart/AAPL";
const RADIO = "https://de1.api.radio-browser.info/json/stations/search?name=KEXP";
const LOOP = "http://127.0.0.1:9/json/stations/search";

// News and quotes paint the kid-plain sentence; Radio Find (Rui's music block) keeps the older one.
function line(lead, host) {
  return `${lead} ${plainNetLine(host)}`;
}
function radioLine(host) {
  return `${RADIO_LEAD} ${clientNetLine(host)}`;
}

describe("main refuses a remote plate fetch until the painted line is present", () => {
  it("holds news, quotes, and radio when the line is missing", () => {
    assert.equal(mayFetch("news", "", [NEWS]), false);
    assert.equal(mayFetch("news", plainNetLine("Google News"), [NEWS]), false);
    assert.equal(mayFetch("news", `${NEWS_LEAD} ${clientNetLine("Google News")}`, [NEWS]), false);
    assert.equal(mayFetch("quote", "", [GECKO]), false);
    assert.equal(mayFetch("terminal", "", [TERMINAL]), false);
    assert.equal(mayFetch("stock", "", [YAHOO]), false);
    assert.equal(mayFetch("look", "", [GECKO]), false);
    assert.equal(mayFetch("radio", "", [RADIO]), false);
    assert.equal(mayFetch("radio", radioLine("the quote host"), [RADIO]), false);
    assert.equal(mayFetch("radio", `${RADIO_LEAD} ${plainNetLine("the radio host")}`, [RADIO]), false);
  });

  it("allows the fetch when the painted line names that host", () => {
    assert.equal(mayFetch("news", line(NEWS_LEAD, "Google News"), [NEWS]), true);
    assert.equal(mayFetch("quote", line(QUOTE_LEAD, "CoinGecko"), [GECKO]), true);
    assert.equal(mayFetch("terminal", line(QUOTE_LEAD, "GeckoTerminal"), [TERMINAL]), true);
    assert.equal(mayFetch("stock", line(QUOTE_LEAD, "Yahoo Finance"), [YAHOO]), true);
    assert.equal(mayFetch("look", line(LOOK_LEAD, "CoinGecko"), [GECKO]), true);
    assert.equal(mayFetch("radio", radioLine("the radio host"), [RADIO]), true);
    assert.equal(mayFetch("quote", line(LOOK_LEAD, "CoinGecko"), [GECKO]), false);
    assert.equal(mayFetch("look", line(QUOTE_LEAD, "CoinGecko"), [GECKO]), false);
    assert.equal(mayFetch("news", line(NEWS_LEAD, "Wikipedia"), [NEWS]), false);
    assert.equal(mayFetch("quote", line(QUOTE_LEAD, "the quote host"), [GECKO]), false);
  });

  it("accepts a combined quote line that names each host in that phrase", () => {
    const shown = `${QUOTE_LEAD} ${plainNetLine("CoinGecko and GeckoTerminal")}`;
    assert.equal(mayFetch("quote", shown, [GECKO]), true);
    assert.equal(mayFetch("terminal", shown, [TERMINAL]), true);
    assert.equal(mayFetch("stock", shown, [YAHOO]), false);
    const three = `${QUOTE_LEAD} ${plainNetLine("CoinGecko, GeckoTerminal, and Yahoo Finance")}`;
    assert.equal(mayFetch("stock", three, [YAHOO]), true);
    assert.equal(mayFetch("quote", three, [GECKO]), true);
  });

  it("keeps a loopback read on this computer without the outbound sentence", () => {
    assert.equal(mayFetch("radio", "", [LOOP]), true);
    assert.equal(mayFetch("news", "", ["http://localhost/rss", "http://[::1]/rss"]), true);
    assert.equal(LOCAL_STAYS, "this read stays on this computer.");
    assert.equal(mayFetch("radio", "", [LOOP, RADIO]), false);
  });

  it("does not treat an empty url list as a remote fetch", () => {
    assert.equal(mayFetch("news", "", []), true);
    assert.equal(mayFetch("radio", "", [""]), true);
    assert.equal(mayFetch("nope", line(NEWS_LEAD, "Google News"), [NEWS]), false);
  });

  it("matches the leads and plain names the news and quote plates paint", () => {
    const News = require("../renderer/news.js");
    const Market = require("../renderer/market.js");
    assert.equal(NEWS_LEAD, News.NEWS_RSS_LEAD);
    assert.equal(QUOTE_LEAD, Market.QUOTE_LEAD);
    assert.equal(LOOK_LEAD, Market.LOOK_LEAD);
    assert.equal(NEWS_HOST, "Google News");
    assert.equal(QUOTE_HOST, Market.QUOTE_HOST_NAME);
    assert.equal(TERMINAL_HOST, Market.TERMINAL_HOST_NAME);
    assert.equal(STOCK_HOST, Market.STOCK_HOST_NAME);
    assert.equal(mayFetch("news", News.NEWS_RSS_HONESTY, [NEWS]), true);
    assert.equal(mayFetch("news", News.NEWS_WIKI_HONESTY, [NEWS]), false);
    assert.equal(mayFetch("look", Market.QUOTE_LOOK, [GECKO]), true);
    for (const shown of [News.NEWS_RSS_HONESTY, Market.QUOTE_LOOK]) {
      assert.doesNotMatch(shown, /https request|as any client|rss feed|the (news|quote) host/);
    }
  });
});

describe("desktop main checks the line before those handlers fetch", () => {
  const main = fs.readFileSync(path.join(__dirname, "../main.cjs"), "utf8");
  const preload = fs.readFileSync(path.join(__dirname, "../preload.cjs"), "utf8");
  const pet = fs.readFileSync(path.join(__dirname, "../renderer/pet.js"), "utf8");

  function handler(name, next) {
    const start = main.indexOf(`ipcMain.handle("${name}"`);
    const end = next ? main.indexOf(`ipcMain.handle("${next}"`, start + 1) : main.length;
    assert.ok(start > 0, name);
    return main.slice(start, end);
  }

  it("gates radio, news, and quote handlers before fetch", () => {
    const radio = handler("radio-search", "news-topic");
    assert.ok(radio.indexOf("PlateNet.mayFetch") < radio.indexOf("fetchRadioJson"));
    const topic = handler("news-topic", "news-feed");
    assert.ok(topic.indexOf('mayFetch("news"') < topic.indexOf("fetchNewsRss"));
    const feed = handler("news-feed", "market-quote");
    assert.ok(feed.indexOf('mayFetch("news"') < feed.indexOf("fetchNewsRss"));
    const quote = handler("market-quote", "market-quotes");
    assert.ok(quote.indexOf("PlateNet.mayFetch") < quote.indexOf("fetchPlate("));
    const many = handler("market-quotes", "market-terminal");
    assert.ok(many.indexOf('mayFetch("quote"') < many.indexOf("fetchPlate("));
    const terminal = handler("market-terminal", "market-search");
    assert.ok(terminal.indexOf('mayFetch("terminal"') < terminal.indexOf("fetchPlate("));
    const search = handler("market-search", "nft-quote");
    assert.ok(search.indexOf('mayFetch("look"') < search.indexOf("fetchPlate("));
    const nft = handler("nft-quote", "license-status");
    assert.ok(nft.indexOf('mayFetch("quote"') < nft.indexOf("fetchPlate("));
    assert.doesNotMatch(handler("news-feed", "market-quote"), /newsUrl\(/);
    const license = main.slice(main.indexOf('ipcMain.handle("license-status"'));
    assert.doesNotMatch(license, /fetchNewsRss|fetchRadioJson|PlateNet\.mayFetch/);
  });

  it("sends the painted line on the IPC payload", () => {
    assert.match(preload, /radio-search", query, area, line/);
    assert.match(preload, /news-topic", query, line/);
    assert.match(preload, /market-quotes", ids, line/);
    assert.match(preload, /market-search", query, line/);
    assert.match(pet, /door\(\{ kind: "popular", line \}\)/);
    assert.match(pet, /legacyDoor\(topic\.query, line\)/);
    assert.match(pet, /marketQuotes\(geckoIds, line\)/);
    assert.match(pet, /marketTerminal\(row, line\)/);
    assert.match(pet, /door\(ticker, line\)/);
    assert.match(pet, /nftDoor\(nft, line\)/);
    assert.match(pet, /door\(q, area, line\)/);
    assert.match(pet, /door\(String\(typed \|\| ""\), lookLine\)/);
    const boot = pet.slice(pet.indexOf("window.PetRoster.loadHouseRoster"), pet.indexOf("bindGuiHarness"));
    assert.match(boot, /fetchNews\(\)/);
    assert.doesNotMatch(boot, /lookupRadio\(/);
  });
});
