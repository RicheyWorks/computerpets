/**
 * Recorded-feed replay for app_harness. No network.
 *
 * Each replay hands a saved response (desktop/renderer/fixtures/replay/) to the real
 * read / parse / paint code through a fake fetch, then reads back the words a keeper
 * would see on the plate. The fake fetch records every URL, so a replay also proves
 * the plate asked the right host and nothing else.
 */
"use strict";

const path = require("node:path");
const fs = require("node:fs");
const { EventEmitter } = require("node:events");

const RENDERER = path.join(__dirname, "..", "..", "desktop", "renderer");
const DESKTOP = path.join(__dirname, "..", "..", "desktop");
const FIXTURES = path.join(RENDERER, "fixtures", "replay");

function fixture(name) {
  return fs.readFileSync(path.join(FIXTURES, name), "utf8");
}

function fixtureJson(name) {
  return JSON.parse(fixture(name));
}

function ok(detail, extras = {}, trace = []) {
  return { ok: true, detail, extras, trace };
}

function fail(error, extras = {}, trace = []) {
  return { ok: false, detail: error, error, extras, trace };
}

// ---------------------------------------------------------------------------
// A small DOM: enough for desk-house paint (ids, text, innerHTML, children).
// ---------------------------------------------------------------------------

class FakeEl {
  constructor(tag, id) {
    this.tagName = String(tag || "div").toUpperCase();
    this.id = id || "";
    this.children = [];
    this.dataset = {};
    this.attrs = {};
    this.hidden = false;
    this.disabled = false;
    this.className = "";
    this.type = "";
    this.title = "";
    this._text = "";
    this._html = null;
  }
  set textContent(value) {
    this._text = value == null ? "" : String(value);
    this._html = null;
    this.children = [];
  }
  get textContent() {
    if (this._html != null) return htmlText(this._html);
    return this._text + this.children.map((c) => c.textContent).join("");
  }
  set innerHTML(value) {
    this._html = value == null ? "" : String(value);
    this._text = "";
    this.children = [];
  }
  get innerHTML() {
    return this._html == null ? "" : this._html;
  }
  setAttribute(name, value) {
    this.attrs[name] = String(value);
  }
  getAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this.attrs, name) ? this.attrs[name] : null;
  }
  appendChild(node) {
    this._html = null;
    this.children.push(node);
    return node;
  }
  append(...nodes) {
    nodes.forEach((n) => this.appendChild(n));
  }
  replaceChildren(...nodes) {
    this._html = null;
    this._text = "";
    this.children = [];
    nodes.forEach((n) => this.appendChild(n));
  }
  querySelectorAll() {
    return [];
  }
  addEventListener() {}
}

function installDom(ids) {
  const byId = new Map();
  ids.forEach((id) => byId.set(id, new FakeEl("div", id)));
  global.document = {
    getElementById: (id) => byId.get(id) || null,
    createElement: (tag) => new FakeEl(tag),
  };
  return byId;
}

function decodeEntities(text) {
  return String(text)
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

/** The words a browser would show for this markup, one space between blocks. */
function htmlText(html) {
  return decodeEntities(
    String(html || "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<\/?(p|li|ul|div|br)\b[^>]*>/gi, " ")
      .replace(/<[^>]*>/g, ""),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function tagsOf(html) {
  const out = new Set();
  const re = /<\/?([a-zA-Z][a-zA-Z0-9]*)/g;
  let m;
  while ((m = re.exec(String(html || "")))) out.add(m[1].toLowerCase());
  return Array.from(out).sort();
}

function hrefsOf(html) {
  const out = [];
  const re = /<a\b[^>]*\bhref="([^"]*)"/gi;
  let m;
  while ((m = re.exec(String(html || "")))) out.push(m[1]);
  return out;
}

const JUNK = /\bNaN\b|\bundefined\b|\[object Object\]|\bnull\b/;

function junkIn(label, text, bad) {
  if (JUNK.test(String(text))) bad.push(`${label} shows junk: ${String(text).slice(0, 160)}`);
}

/** Tags the plate paints itself. Anything else came from the feed. */
function strayTags(label, html, allowed, bad) {
  const extra = tagsOf(html).filter((t) => allowed.indexOf(t) === -1);
  if (extra.length) bad.push(`${label} carries feed markup <${extra.join(">, <")}>`);
}

// ---------------------------------------------------------------------------
// Fake fetch that serves one saved body per URL test and records every call.
// ---------------------------------------------------------------------------

function fakeFetch(routes) {
  const calls = [];
  const go = (url) => {
    calls.push(String(url));
    const row = routes.find((r) => r.match(String(url)));
    if (!row) return Promise.reject(new Error(`replay has no saved response for ${url}`));
    if (row.fail) return Promise.reject(new Error("offline"));
    return Promise.resolve({
      ok: true,
      status: 200,
      json: async () => (typeof row.body === "string" ? JSON.parse(row.body) : row.body),
      text: async () => (typeof row.body === "string" ? row.body : JSON.stringify(row.body)),
    });
  };
  go.calls = calls;
  return go;
}

function hostOf(url) {
  try {
    return new URL(url).host;
  } catch {
    return "";
  }
}

/**
 * The overlay's main process reads the same hosts through IPC doors (news-feed,
 * market-quotes, market-quote, nft-quote). Those doors need Electron, but each one
 * parses the body as PlateFetch.parseJson + the same parse function. Parse the saved
 * body that way too and require the same result the plate painted.
 */
function doorParse(parse, text) {
  const PlateFetch = require(path.join(DESKTOP, "presence", "plate-fetch.cjs"));
  return parse(PlateFetch.parseJson(text));
}

function same(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function fresh(name) {
  const file = path.join(RENDERER, name);
  delete require.cache[require.resolve(file)];
  return require(file);
}

/** Load the modules the way the overlay does: globals first, then desk-house. */
function loadPlates() {
  const A = fresh("weather-areas.js");
  global.PetWeatherAreas = A;
  const N = fresh("news.js");
  const M = fresh("market.js");
  global.PetNews = N;
  global.PetMarket = M;
  const H = fresh("desk-house.js");
  return { A, N, M, H };
}

// ---------------------------------------------------------------------------
// Weather
// ---------------------------------------------------------------------------

const WEATHER_IDS = ["weather-line", "weather-body", "weather-live", "weather-forecast-net", "weather-current-panel"];

async function weatherReplay() {
  const dom = installDom(WEATHER_IDS);
  const { A, H } = loadPlates();
  const bad = [];
  const card = { weatherAreas: [{ name: "Seattle", query: "Seattle", lat: 47.6, lon: -122.3 }], weatherTab: "current" };
  const gate = A.forecastGate(card, card.hereForecastAck);
  if (!gate || gate.act !== "send") return fail("a typed area did not open the forecast gate", { gate });
  const net = dom.get("weather-forecast-net");
  net.textContent = A.forecastHonesty(gate);
  const line = net.textContent;
  if (!A.forecastMaySend(gate, true)) bad.push("forecastMaySend refused an open plate with the honesty line");
  if (!A.forecastMayLeave(line)) bad.push("forecastMayLeave refused the painted honesty line");
  const url = A.forecastUrl(gate.area.lat, gate.area.lon);
  const go = fakeFetch([{ match: (u) => hostOf(u) === "api.open-meteo.com", body: fixture("forecast-seattle.json") }]);

  // No honesty line: no fetch.
  const quiet = await A.readForecast("", url, go);
  if (quiet !== null || go.calls.length) bad.push("readForecast called fetch without the honesty line");

  const json = await A.readForecast(line, url, go);
  const live = A.parseForecast(json);
  H.paintWeather(card, live, false);
  const plate = dom.get("weather-line").textContent;
  const body = dom.get("weather-live").textContent;
  const expectPlate = "Seattle · Clear · 8°";
  if (plate !== expectPlate) bad.push(`plate line ${JSON.stringify(plate)} != ${JSON.stringify(expectPlate)}`);
  const want = [
    "Seattle. Clear · 8°. Open-Meteo.",
    "2026-09-27 · clear · 17°",
    "2026-09-28 · clear · 18°",
    "2026-09-29 · rain · 15°",
  ];
  want.forEach((w) => {
    if (body.indexOf(w) === -1) bad.push(`weather body is missing ${JSON.stringify(w)}`);
  });
  if (go.calls.length !== 1 || go.calls[0] !== url) bad.push(`forecast fetch calls ${JSON.stringify(go.calls)}`);
  if (url.indexOf("latitude=47.6&longitude=-122.3") === -1) bad.push(`forecast url lost the typed place: ${url}`);
  junkIn("weather plate", plate + " " + body, bad);

  // A failed read turns the plate to unread, with no number.
  const down = fakeFetch([{ match: () => true, fail: true }]);
  let unread = false;
  try {
    await A.readForecast(line, url, down);
  } catch {
    unread = true;
  }
  H.paintWeather(card, null, unread);
  const miss = dom.get("weather-line").textContent;
  if (miss !== "Seattle · unread") bad.push(`failed forecast shows ${JSON.stringify(miss)}`);
  if (/\d°/.test(dom.get("weather-live").textContent)) bad.push("failed forecast still paints a temperature");

  const trace = [`forecast.url=${url}`, `plate=${plate}`, `daily=${(live && live.daily ? live.daily.length : 0)}`, `unread=${miss}`];
  if (bad.length) return fail(bad.join("; "), { plate, body }, trace);
  return ok(plate, { plate, body, url }, trace);
}

// ---------------------------------------------------------------------------
// News
// ---------------------------------------------------------------------------

const NEWS_IDS = ["news-line", "news-live", "news-net"];
const NEWS_TAGS = ["a", "button", "li", "p", "ul"];

function rssLinks(xml) {
  const out = [];
  const re = /<item>[\s\S]*?<link>([\s\S]*?)<\/link>/g;
  let m;
  while ((m = re.exec(xml))) out.push(m[1].replace(/&amp;/g, "&").trim());
  return out;
}

async function replayNewsTab(ctx, label, card, route, expect) {
  const { N, H, dom, bad } = ctx;
  const prefs = N.parseNewsPrefs(card);
  const line = N.newsHonesty(prefs);
  dom.get("news-net").textContent = line;
  if (!N.newsMaySend(prefs, true)) bad.push(`${label}: newsMaySend refused an open plate with the honesty line`);
  const go = fakeFetch([route]);
  let items;
  if (expect.kind === "rss") {
    const url = expect.url;
    const quiet = await N.readRss("", url, go);
    if (quiet !== null || go.calls.length) bad.push(`${label}: readRss called fetch without the honesty line`);
    const xml = await N.readRss(line, url, go);
    items = N.parseRss(xml);
    // The news-feed door hands the raw body to the same parseRss.
    if (!same(N.parseRss(route.body), items)) bad.push(`${label}: the news-feed door would parse the saved feed differently`);
    if (go.calls.length !== 1 || go.calls[0] !== url) bad.push(`${label}: fetch calls ${JSON.stringify(go.calls)}`);
  } else {
    const quiet = await N.readFeatured("", go);
    if (quiet !== null || go.calls.length) bad.push(`${label}: readFeatured called fetch without the honesty line`);
    const json = await N.readFeatured(line, go);
    items = N.parseNews(json);
    const called = go.calls[0] || "";
    if (go.calls.length !== 1 || !/^https:\/\/en\.wikipedia\.org\/api\/rest_v1\/feed\/featured\/\d{4}\/\d{2}\/\d{2}$/.test(called)) {
      bad.push(`${label}: fetch calls ${JSON.stringify(go.calls)}`);
    }
  }
  H.paintNews(items, false, card);
  const plate = dom.get("news-line").textContent;
  const html = dom.get("news-live").innerHTML;
  const body = dom.get("news-live").textContent;
  if (plate !== expect.first) bad.push(`${label}: plate line ${JSON.stringify(plate)} != ${JSON.stringify(expect.first)}`);
  expect.shows.forEach((w) => {
    if (body.indexOf(w) === -1) bad.push(`${label}: plate is missing ${JSON.stringify(w)}`);
  });
  (expect.hides || []).forEach((w) => {
    if (body.indexOf(w) !== -1 || html.indexOf(w) !== -1) bad.push(`${label}: plate shows ${JSON.stringify(w)}`);
  });
  strayTags(`${label} plate`, html, NEWS_TAGS, bad);
  const hrefs = hrefsOf(html);
  if (hrefs.length !== expect.links.length) bad.push(`${label}: ${hrefs.length} links painted, ${expect.links.length} saved`);
  hrefs.forEach((h, i) => {
    if (h !== expect.links[i]) bad.push(`${label}: link ${i} is ${h.length} chars, saved link is ${String(expect.links[i]).length}`);
  });
  junkIn(`${label} plate`, plate + " " + body, bad);
  return { plate, count: items.length };
}

async function newsReplay() {
  const dom = installDom(NEWS_IDS);
  const { N, H } = loadPlates();
  const bad = [];
  const ctx = { N, H, dom, bad };
  const trace = [];

  const popularXml = fixture("news-popular.rss");
  const pop = await replayNewsTab(
    ctx,
    "popular",
    { newsTab: "popular" },
    { match: (u) => u === N.popularRssUrl(), body: popularXml },
    {
      kind: "rss",
      url: N.popularRssUrl(),
      first: "Heavy Rain and Wind Batter Northeast, Bringing Coastal Flooding - nytimes.com",
      shows: [
        "Google News · Popular",
        "Heavy Rain and Wind Batter Northeast, Bringing Coastal Flooding - nytimes.com",
        "Pope Leo draws 800,000 people to central Paris for open-air Mass on iconic square - AP New",
        "Hurricane Nolo expected to bring heavy rain as it skirts Hawaii’s Big Island - NBC News",
        "nytimes.com",
      ],
      links: rssLinks(popularXml),
    },
  );
  trace.push(`popular=${pop.count} first=${pop.plate}`);

  const topicXml = fixture("news-topic-red-pandas.rss");
  const topicCard = N.toCardPatch(N.pickTab(N.addTopic(N.blankNewsPrefs(), { name: "Red pandas", query: "red pandas" }), "topics"));
  const topic = await replayNewsTab(
    ctx,
    "topic",
    topicCard,
    { match: (u) => u === N.topicRssUrl("red pandas"), body: topicXml },
    {
      kind: "rss",
      url: N.topicRssUrl("red pandas"),
      first: "Urgent Appeal: Save red pandas - Fauna & Flora",
      shows: [
        "Google News · Red pandas",
        "Urgent Appeal: Save red pandas - Fauna & Flora",
        "SEE VIDEO: Seneca Park Zoo’s red pandas now sharing habitat - WHEC.com",
        "Fauna & Flora",
      ],
      hides: ["&amp;amp;"],
      links: rssLinks(topicXml),
    },
  );
  trace.push(`topic=${topic.count} first=${topic.plate}`);

  const worldCard = N.toCardPatch(N.pickTab(N.blankNewsPrefs(), "topics"));
  const featured = fixtureJson("news-featured.json");
  const world = await replayNewsTab(
    ctx,
    "world",
    worldCard,
    { match: (u) => hostOf(u) === "en.wikipedia.org", body: featured },
    {
      kind: "wiki",
      first: "Tilcayo",
      shows: [
        "Wikipedia In the news",
        "Tilcayo",
        "The tilcayo, a new species of tiger cat, is formally identified.",
        "78th Primetime Emmy Awards",
        "At the Primetime Emmy Awards, Widow's Bay wins Outstanding Comedy Series, and The Pitt wins Outstanding Drama Series.",
      ],
      hides: ["mw:WikiLink", "<!--", "./Tilcayo", "mwCg"],
      links: featured.news.map((n) => n.links[0].content_urls.desktop.page),
    },
  );
  trace.push(`world=${world.count} first=${world.plate}`);

  if (bad.length) return fail(bad.join("; "), {}, trace);
  return ok(`popular=${pop.count} topic=${topic.count} world=${world.count}`, {}, trace);
}

// ---------------------------------------------------------------------------
// Coins, stock, NFT
// ---------------------------------------------------------------------------

const MARKET_IDS = ["market-line", "market-live", "market-net", "nft-live"];
const MARKET_TAGS = ["li", "p", "span", "strong", "ul"];
const RECORDED_GECKO_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cdogecoin%2Cstellar%2Cbitcoin%2Csolana%2Ccardano%2Cripple&vs_currencies=usd&include_24hr_change=true";

async function marketReplay() {
  const dom = installDom(MARKET_IDS);
  const { M, H } = loadPlates();
  const bad = [];
  const trace = [];

  const house = M.parseMarket({});
  const card = M.toCardPatch(house);
  const line = M.quoteHonesty(house);
  dom.get("market-net").textContent = line;
  if (!M.quoteMaySend(house, true)) bad.push("quoteMaySend refused an open plate with the honesty line");
  const ids = house.tickers.filter((r) => r.kind === "crypto" && r.geckoId && !r.address).map((r) => r.geckoId);
  const go = fakeFetch([{ match: (u) => u === RECORDED_GECKO_URL, body: fixture("gecko-simple-price.json") }]);
  const quiet = await M.readGeckoMany("", ids, go);
  if (quiet !== null || go.calls.length) bad.push("readGeckoMany called fetch without the honesty line");
  const lives = M.parseGeckoMany(await M.readGeckoMany(line, ids, go));
  if (!same(doorParse(M.parseGeckoMany, fixture("gecko-simple-price.json")), lives)) {
    bad.push("the market-quotes door would parse the saved prices differently");
  }
  const ticker = M.currentTicker(house);
  const live = lives[ticker.geckoId] || null;
  H.paintMarket(card, live, false, { coinLives: lives, nftLive: null, nftUnread: false });
  const plate = dom.get("market-line").textContent;
  const html = dom.get("market-live").innerHTML;
  const body = dom.get("market-live").textContent;
  if (go.calls.length !== 1 || go.calls[0] !== RECORDED_GECKO_URL) bad.push(`coin fetch calls ${JSON.stringify(go.calls)}`);
  if (plate !== "ETH · 2708.39") bad.push(`coin plate line ${JSON.stringify(plate)}`);
  ["ETH · 2708.39", "DOGE · 0.0977", "XLM · 0.2171", "BTC · 84787.00", "ADA · 0.2558", "XRP · 1.54"].forEach((w) => {
    if (body.indexOf(w) === -1) bad.push(`coin plate is missing ${JSON.stringify(w)}`);
  });
  // The saved response has no entry for this coin. The row must wait, not invent a price.
  if (body.indexOf("SOL · …") === -1) bad.push("a coin missing from the response did not read …");
  strayTags("coin plate", html, MARKET_TAGS, bad);
  junkIn("coin plate", plate + " " + body, bad);
  trace.push(`coins=${Object.keys(lives).length} plate=${plate}`, "missing coin=…");

  // A stock as the current ticker reads Yahoo, and the coin list still reads CoinGecko.
  const stockHouse = M.addTicker(house, { symbol: "AAPL", kind: "stock", name: "Apple" });
  const stockCard = M.toCardPatch(stockHouse);
  const stockLine = M.quoteHonesty(stockHouse);
  const yahooUrl = M.yahooUrl("AAPL");
  const goStock = fakeFetch([{ match: (u) => u === yahooUrl, body: fixture("yahoo-aapl.json") }]);
  const stockLive = M.parseYahoo(await M.readYahoo(stockLine, "AAPL", goStock));
  if (!same(doorParse(M.parseYahoo, fixture("yahoo-aapl.json")), stockLive)) {
    bad.push("the market-quote door would parse the saved stock differently");
  }
  H.paintMarket(stockCard, stockLive, false, { coinLives: lives, nftLive: null, nftUnread: false });
  const stockPlate = dom.get("market-line").textContent;
  if (goStock.calls.length !== 1 || goStock.calls[0] !== yahooUrl) bad.push(`stock fetch calls ${JSON.stringify(goStock.calls)}`);
  if (stockPlate !== "AAPL · 341.07") bad.push(`stock plate line ${JSON.stringify(stockPlate)}`);
  if (dom.get("market-live").textContent.indexOf("AAPL · 341.07") === -1) bad.push("stock row is missing AAPL · 341.07");
  junkIn("stock plate", stockPlate + " " + dom.get("market-live").textContent, bad);
  trace.push(`stock=${stockPlate}`);

  if (bad.length) return fail(bad.join("; "), { plate, body }, trace);
  return ok(`${plate}; ${stockPlate}`, { plate, stockPlate }, trace);
}

async function nftReplay() {
  const dom = installDom(MARKET_IDS);
  const { M, H } = loadPlates();
  const bad = [];
  const house = M.parseMarket({});
  const card = M.toCardPatch(house);
  const line = M.quoteHonesty(house);
  const nft = M.currentNft(house);
  if (!nft || nft.geckoId !== "cryptopunks") return fail("default NFT is not cryptopunks", { nft });
  const url = M.nftUrl(nft.geckoId);
  const go = fakeFetch([{ match: (u) => u === url, body: fixture("nft-cryptopunks.json") }]);
  const quiet = await M.readNft("", nft.geckoId, go);
  if (quiet !== null || go.calls.length) bad.push("readNft called fetch without the honesty line");
  const nftLive = M.parseNftLive(await M.readNft(line, nft.geckoId, go));
  if (!same(doorParse(M.parseNftLive, fixture("nft-cryptopunks.json")), nftLive)) {
    bad.push("the nft-quote door would parse the saved floor differently");
  }
  H.paintMarket(card, null, false, { coinLives: {}, nftLive, nftUnread: false });
  const shown = dom.get("nft-live").textContent;
  if (go.calls.length !== 1 || go.calls[0] !== url) bad.push(`nft fetch calls ${JSON.stringify(go.calls)}`);
  if (shown !== "CryptoPunks. Floor $91246.00. CoinGecko.") bad.push(`nft plate ${JSON.stringify(shown)}`);
  strayTags("nft plate", dom.get("nft-live").innerHTML, ["p"], bad);
  junkIn("nft plate", shown, bad);

  // A failed read says so and keeps the number off the plate.
  const down = fakeFetch([{ match: () => true, fail: true }]);
  let nftUnread = false;
  try {
    await M.readNft(line, nft.geckoId, down);
  } catch {
    nftUnread = true;
  }
  H.paintMarket(card, null, false, { coinLives: {}, nftLive: null, nftUnread });
  const miss = dom.get("nft-live").textContent;
  if (miss !== "PUNK · can't reach") bad.push(`failed nft read shows ${JSON.stringify(miss)}`);
  const trace = [`nft.url=${url}`, `nft=${shown}`, `unread=${miss}`];
  if (bad.length) return fail(bad.join("; "), { shown }, trace);
  return ok(shown, { shown, url }, trace);
}

// ---------------------------------------------------------------------------
// GPU sense: saved probe output through desktop gpu-sense.cjs read()
// ---------------------------------------------------------------------------

const GPU_CASES = [
  { file: "gpu-win-nvidia.txt", platform: "win32" },
  { file: "gpu-win-pdh.txt", platform: "win32" },
  { file: "gpu-linux-amdgpu.txt", platform: "linux" },
  { file: "gpu-mac-ioaccelerator.txt", platform: "darwin" },
  { file: "gpu-linux-absent.txt", platform: "linux" },
];
const GPU_NOW = 1790000000000;

function fakeSpawn(text, seen) {
  return (command, args) => {
    seen.push([command].concat(args || []).join(" "));
    const child = new EventEmitter();
    child.stdout = new EventEmitter();
    child.stdout.setEncoding = () => {};
    child.stderr = new EventEmitter();
    child.kill = () => {};
    setImmediate(() => {
      child.stdout.emit("data", text);
      child.emit("exit", 0);
    });
    return child;
  };
}

async function gpuReplay() {
  const Sense = require(path.join(DESKTOP, "gpu-sense.cjs"));
  const Gpu = require(path.join(RENDERER, "gpu.js"));
  const rows = [];
  const bad = [];
  for (const row of GPU_CASES) {
    const seen = [];
    const sample = await Sense.read({ platform: row.platform, nowMs: GPU_NOW, spawn: fakeSpawn(fixture(row.file), seen) });
    const line = Gpu.gpuLine(Gpu.present(sample, GPU_NOW));
    const script = row.platform === "win32" ? "gpu-probe.ps1" : row.platform === "darwin" ? "gpu-probe-mac.sh" : "gpu-probe.sh";
    if (seen.length !== 1 || seen[0].indexOf(script) === -1) bad.push(`${row.file}: probe ran ${JSON.stringify(seen)}`);
    junkIn(row.file, line, bad);
    rows.push({ file: row.file, platform: row.platform, status: sample.status, source: sample.source, line });
  }
  const trace = rows.map((r) => `${r.file}=${r.line}`);
  if (bad.length) return fail(bad.join("; "), { rows }, trace);
  return ok(`${rows.length} probe replays`, { rows }, trace);
}

module.exports = {
  weather_replay: weatherReplay,
  news_replay: newsReplay,
  market_replay: marketReplay,
  nft_replay: nftReplay,
  gpu_replay: gpuReplay,
  htmlText,
  GPU_CASES,
  GPU_NOW,
};