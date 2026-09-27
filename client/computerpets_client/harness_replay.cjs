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
// A small DOM: enough for desk-house paint (ids, text nodes, elements, children).
// It has no HTML parser on purpose. Any write to innerHTML / outerHTML /
// insertAdjacentHTML is recorded as a sink, and every replay requires none.
// ---------------------------------------------------------------------------

const SINKS = [];

class FakeText {
  constructor(text) {
    this.nodeType = 3;
    this.data = text == null ? "" : String(text);
  }
  get textContent() {
    return this.data;
  }
}

class FakeEl {
  constructor(tag, id) {
    this.nodeType = 1;
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
  }
  set textContent(value) {
    this.children = [];
    const text = value == null ? "" : String(value);
    if (text) this.children.push(new FakeText(text));
  }
  get textContent() {
    return this.children.map((c) => c.textContent).join("");
  }
  set innerHTML(value) {
    SINKS.push({ id: this.id || this.tagName.toLowerCase(), sink: "innerHTML", value: String(value) });
    this.children = [new FakeText(value)];
  }
  get innerHTML() {
    return "";
  }
  set outerHTML(value) {
    SINKS.push({ id: this.id || this.tagName.toLowerCase(), sink: "outerHTML", value: String(value) });
  }
  insertAdjacentHTML(_where, value) {
    SINKS.push({ id: this.id || this.tagName.toLowerCase(), sink: "insertAdjacentHTML", value: String(value) });
  }
  setAttribute(name, value) {
    this.attrs[name] = String(value);
  }
  getAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this.attrs, name) ? this.attrs[name] : null;
  }
  appendChild(node) {
    this.children.push(typeof node === "string" ? new FakeText(node) : node);
    return node;
  }
  append(...nodes) {
    nodes.forEach((n) => this.appendChild(n));
  }
  replaceChildren(...nodes) {
    this.children = [];
    nodes.forEach((n) => this.appendChild(n));
  }
  querySelectorAll() {
    return [];
  }
  addEventListener() {}
}

function installDom(ids) {
  SINKS.length = 0;
  const byId = new Map();
  ids.forEach((id) => byId.set(id, new FakeEl("div", id)));
  global.document = {
    getElementById: (id) => byId.get(id) || null,
    createElement: (tag) => new FakeEl(tag),
    createTextNode: (text) => new FakeText(text),
  };
  return byId;
}

function walk(node, visit) {
  if (!node || node.nodeType !== 1) return;
  node.children.forEach((child) => {
    if (child && child.nodeType === 1) {
      visit(child);
      walk(child, visit);
    }
  });
}

const BLOCKS = new Set(["P", "LI", "UL", "DIV", "H4", "BR"]);

/** The words a keeper sees, one space between blocks (roughly innerText). */
function shown(node) {
  function text(n) {
    if (!n) return "";
    if (n.nodeType === 3) return n.data;
    const inner = n.children.map(text).join("");
    return BLOCKS.has(n.tagName) ? ` ${inner} ` : inner;
  }
  return text(node).replace(/\s+/g, " ").trim();
}

function tagsOf(node) {
  const out = new Set();
  walk(node, (n) => out.add(n.tagName.toLowerCase()));
  return Array.from(out).sort();
}

function hrefsOf(node) {
  const out = [];
  walk(node, (n) => {
    if (n.tagName === "A") out.push(String(n.href || ""));
  });
  return out;
}

function sinksIn(label, bad) {
  if (SINKS.length) {
    bad.push(`${label} wrote markup through ${SINKS.map((s) => `${s.id}.${s.sink}`).join(", ")}`);
    SINKS.length = 0;
  }
}

const JUNK = /\bNaN\b|\bundefined\b|\[object Object\]|\bnull\b/;

function junkIn(label, text, bad) {
  if (JUNK.test(String(text))) bad.push(`${label} shows junk: ${String(text).slice(0, 160)}`);
}

/** Tags the plate paints itself. Anything else came from the feed. */
function strayTags(label, node, allowed, bad) {
  const extra = tagsOf(node).filter((t) => allowed.indexOf(t) === -1);
  if (extra.length) bad.push(`${label} carries feed markup <${extra.join(">, <")}>`);
}

/**
 * Hostile feed words. Each replay sends these through the real parse and paint and
 * requires them on the plate as letters, with no <img> or <script> element made.
 */
const HOSTILE_IMG = "<img src=x onerror=alert(1)>";
const HOSTILE_SCRIPT = "<script>alert(1)</script>";
const HOSTILE_SCRIPT_XML = "&lt;script&gt;alert(1)&lt;/script&gt;";
const HOSTILE_TAGS = ["img", "script", "iframe", "svg", "style", "object", "embed"];

function noHostileElements(label, node, bad) {
  const made = tagsOf(node).filter((t) => HOSTILE_TAGS.indexOf(t) !== -1);
  if (made.length) bad.push(`${label} made a <${made.join(">, <")}> element from feed words`);
}

function showsLiterally(label, node, words, bad) {
  const text = shown(node);
  words.forEach((w) => {
    if (text.indexOf(w) === -1) bad.push(`${label} did not show ${JSON.stringify(w)} as letters`);
  });
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
const WEATHER_TAGS = ["button", "li", "p", "ul"];

/** WMO codes the forecast replay pins, with the word each must show. */
const WMO_CASES = [
  [0, "Clear"],
  [1, "Mostly clear"],
  [2, "Partly cloudy"],
  [3, "Overcast"],
  [45, "Fog"],
  [61, "Rain"],
  [71, "Snow"],
  [95, "Thunderstorm"],
];

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
  const body = shown(dom.get("weather-live"));
  // The saved forecast is WMO 3 (overcast) now and for two days, then 51 (drizzle).
  const expectPlate = "Seattle · Overcast · 8°";
  if (plate !== expectPlate) bad.push(`plate line ${JSON.stringify(plate)} != ${JSON.stringify(expectPlate)}`);
  const want = [
    "Seattle. Overcast · 8°. Open-Meteo.",
    "2026-09-27 · overcast · 17°",
    "2026-09-28 · overcast · 18°",
    "2026-09-29 · drizzle · 15°",
  ];
  want.forEach((w) => {
    if (body.indexOf(w) === -1) bad.push(`weather body is missing ${JSON.stringify(w)}`);
  });
  if (/\bClear\b|\bclear\b/.test(plate + " " + body.replace(/Seattle\b/, ""))) bad.push("an overcast forecast still reads clear");
  if (live && live.sky !== "clear") bad.push(`overcast should keep the calm art sky, got ${live.sky}`);
  if (go.calls.length !== 1 || go.calls[0] !== url) bad.push(`forecast fetch calls ${JSON.stringify(go.calls)}`);
  if (url.indexOf("latitude=47.6&longitude=-122.3") === -1) bad.push(`forecast url lost the typed place: ${url}`);
  strayTags("weather plate", dom.get("weather-live"), WEATHER_TAGS, bad);
  junkIn("weather plate", plate + " " + body, bad);

  // Each pinned WMO code, through the same parse and paint.
  const saved = fixtureJson("forecast-seattle.json");
  const words = [];
  for (const [code, word] of WMO_CASES) {
    const copy = JSON.parse(JSON.stringify(saved));
    copy.current.weather_code = code;
    copy.daily.weather_code = [code, code, code];
    const goCode = fakeFetch([{ match: (u) => hostOf(u) === "api.open-meteo.com", body: copy }]);
    const codeLive = A.parseForecast(await A.readForecast(line, url, goCode));
    H.paintWeather(card, codeLive, false);
    const codePlate = dom.get("weather-line").textContent;
    const codeBody = shown(dom.get("weather-live"));
    if (codePlate !== `Seattle · ${word} · 8°`) bad.push(`WMO ${code} plate ${JSON.stringify(codePlate)}`);
    if (codeBody.indexOf(`2026-09-27 · ${word.toLowerCase()} · 17°`) === -1) bad.push(`WMO ${code} day row is missing ${word.toLowerCase()}`);
    words.push(`${code}=${word}`);
  }

  // A hostile place name from a geocode answer is letters on the plate, not an element.
  const hostile = A.parseGeocode({ results: [{ name: HOSTILE_IMG, admin1: HOSTILE_SCRIPT, country: "US", latitude: 47.6, longitude: -122.3 }] });
  const hostileArea = hostile && hostile[0];
  if (!hostileArea) bad.push("parseGeocode dropped the hostile place instead of keeping it as words");
  else {
    const hostileCard = { weatherAreas: [hostileArea], weatherTab: "current" };
    H.paintWeather(hostileCard, live, false);
    const box = dom.get("weather-live");
    noHostileElements("weather plate", box, bad);
    showsLiterally("weather plate", box, [HOSTILE_IMG], bad);
    if (dom.get("weather-line").textContent.indexOf(HOSTILE_IMG) !== 0) bad.push("weather plate line lost the hostile place's letters");
    H.paintWeather({ ...hostileCard, weatherTab: "favorites", weatherFavoriteIds: [hostileArea.id] }, live, false);
    noHostileElements("weather favorites", box, bad);
  }

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
  if (/\d°/.test(shown(dom.get("weather-live")))) bad.push("failed forecast still paints a temperature");
  sinksIn("weather plate", bad);

  const trace = [
    `forecast.url=${url}`,
    `plate=${plate}`,
    `daily=${live && live.daily ? live.daily.length : 0}`,
    `wmo=${words.join(",")}`,
    "hostile place=letters",
    `unread=${miss}`,
  ];
  if (bad.length) return fail(bad.join("; "), { plate, body }, trace);
  return ok(plate, { plate, body, url, wmo: words, sinks: 0 }, trace);
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
  const box = dom.get("news-live");
  const plate = dom.get("news-line").textContent;
  const body = shown(box);
  if (plate !== expect.first) bad.push(`${label}: plate line ${JSON.stringify(plate)} != ${JSON.stringify(expect.first)}`);
  expect.shows.forEach((w) => {
    if (body.indexOf(w) === -1) bad.push(`${label}: plate is missing ${JSON.stringify(w)}`);
  });
  (expect.hides || []).forEach((w) => {
    if (body.indexOf(w) !== -1) bad.push(`${label}: plate shows ${JSON.stringify(w)}`);
  });
  strayTags(`${label} plate`, box, NEWS_TAGS, bad);
  noHostileElements(`${label} plate`, box, bad);
  const hrefs = hrefsOf(box);
  if (hrefs.length !== expect.links.length) bad.push(`${label}: ${hrefs.length} links painted, ${expect.links.length} expected`);
  hrefs.forEach((h, i) => {
    if (h !== expect.links[i]) bad.push(`${label}: link ${i} is ${JSON.stringify(h.slice(0, 60))}, expected ${JSON.stringify(String(expect.links[i]).slice(0, 60))}`);
    if (!/^https:\/\//.test(h)) bad.push(`${label}: link ${i} is not a web page`);
  });
  junkIn(`${label} plate`, plate + " " + body, bad);
  sinksIn(`${label} plate`, bad);
  return { plate, count: items.length, box };
}

/** One RSS item whose title, source, and link are hostile. */
function hostileRss() {
  return [
    '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>replay</title>',
    `<item><title>${HOSTILE_IMG}</title><link>javascript:alert(1)</link><source url="https://example.test">${HOSTILE_SCRIPT_XML}</source></item>`,
    `<item><title>${HOSTILE_SCRIPT_XML}</title><link>https://news.example.test/a?b=1&amp;c=2</link><source url="https://example.test">Plain source</source></item>`,
    "</channel></rss>",
  ].join("");
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
      hides: ["&amp;amp;", "&amp;"],
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

  // Hostile RSS: <img onerror> and &lt;script&gt; stay letters; javascript: gets no link.
  const evil = await replayNewsTab(
    ctx,
    "hostile rss",
    { newsTab: "popular" },
    { match: (u) => u === N.popularRssUrl(), body: hostileRss() },
    {
      kind: "rss",
      url: N.popularRssUrl(),
      first: HOSTILE_IMG,
      shows: [HOSTILE_IMG, HOSTILE_SCRIPT, "Plain source"],
      links: ["https://news.example.test/a?b=1&c=2"],
    },
  );
  showsLiterally("hostile rss plate", evil.box, [HOSTILE_IMG, HOSTILE_SCRIPT], bad);

  // Hostile Wikipedia: the title stays letters, story markup is stripped, a javascript: page is not linked.
  const evilWiki = {
    news: [
      {
        story: `${HOSTILE_IMG}A plain story.${HOSTILE_SCRIPT_XML}`,
        links: [{ normalizedtitle: HOSTILE_SCRIPT, content_urls: { desktop: { page: "javascript:alert(1)" } } }],
      },
    ],
  };
  const evilWorld = await replayNewsTab(
    ctx,
    "hostile wiki",
    worldCard,
    { match: (u) => hostOf(u) === "en.wikipedia.org", body: evilWiki },
    {
      kind: "wiki",
      first: HOSTILE_SCRIPT,
      shows: [HOSTILE_SCRIPT, "A plain story."],
      hides: ["onerror"],
      links: [`https://en.wikipedia.org/wiki/${encodeURIComponent(HOSTILE_SCRIPT.replace(/ /g, "_"))}`],
    },
  );
  showsLiterally("hostile wiki plate", evilWorld.box, [HOSTILE_SCRIPT], bad);

  // A saved favorite with a hostile title and a javascript: link.
  const favCard = N.toCardPatch(
    N.pickTab(N.addFavorite(N.blankNewsPrefs(), { kind: "headline", title: HOSTILE_IMG, url: "javascript:alert(1)", summary: HOSTILE_SCRIPT }), "favorites"),
  );
  H.paintNews([], false, favCard);
  const favBox = dom.get("news-live");
  noHostileElements("news favorites", favBox, bad);
  showsLiterally("news favorites", favBox, [HOSTILE_IMG], bad);
  if (hrefsOf(favBox).length) bad.push("news favorites linked a javascript: url");
  sinksIn("news favorites", bad);
  trace.push("hostile rss/wiki/favorite=letters, no element, no javascript: link");

  if (bad.length) return fail(bad.join("; "), {}, trace);
  return ok(`popular=${pop.count} topic=${topic.count} world=${world.count}`, { hostile: "letters", sinks: 0 }, trace);
}

// ---------------------------------------------------------------------------
// Coins, stock, NFT
// ---------------------------------------------------------------------------

const MARKET_IDS = ["market-line", "market-live", "market-net", "nft-live", "market-favorites"];
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
  const box = dom.get("market-live");
  const body = shown(box);
  if (go.calls.length !== 1 || go.calls[0] !== RECORDED_GECKO_URL) bad.push(`coin fetch calls ${JSON.stringify(go.calls)}`);
  if (plate !== "ETH · 2708.39") bad.push(`coin plate line ${JSON.stringify(plate)}`);
  ["ETH · 2708.39", "DOGE · 0.0977", "XLM · 0.2171", "BTC · 84787.00", "ADA · 0.2558", "XRP · 1.54"].forEach((w) => {
    if (body.indexOf(w) === -1) bad.push(`coin plate is missing ${JSON.stringify(w)}`);
  });
  // The saved response has no entry for this coin. The row must wait, not invent a price.
  if (body.indexOf("SOL · …") === -1) bad.push("a coin missing from the response did not read …");
  strayTags("coin plate", box, MARKET_TAGS, bad);
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
  if (shown(box).indexOf("AAPL · 341.07") === -1) bad.push("stock row is missing AAPL · 341.07");
  junkIn("stock plate", stockPlate + " " + shown(box), bad);
  trace.push(`stock=${stockPlate}`);

  // A hostile coin name kept on the card (a coin search answer) paints as letters.
  const evilHouse = M.addTicker(house, { symbol: HOSTILE_IMG, kind: "crypto", name: HOSTILE_SCRIPT, geckoId: "evil-coin" });
  const kept = evilHouse.tickers.find((r) => r.geckoId === "evil-coin");
  const evilHouseFav = kept && M.toggleFavoriteTicker ? M.toggleFavoriteTicker(evilHouse, kept.id) : evilHouse;
  H.paintMarket(M.toCardPatch(evilHouseFav), live, false, { coinLives: lives, nftLive: null, nftUnread: false });
  noHostileElements("coin plate", box, bad);
  noHostileElements("coin favorites", dom.get("market-favorites"), bad);
  if (kept) showsLiterally("coin plate", box, [kept.symbol], bad);
  sinksIn("market plate", bad);
  trace.push(`hostile coin kept as ${JSON.stringify(kept ? kept.symbol : null)}; no element`);

  if (bad.length) return fail(bad.join("; "), { plate, body }, trace);
  return ok(`${plate}; ${stockPlate}`, { plate, stockPlate, sinks: 0 }, trace);
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
  const box = dom.get("nft-live");
  const shownText = shown(box);
  if (go.calls.length !== 1 || go.calls[0] !== url) bad.push(`nft fetch calls ${JSON.stringify(go.calls)}`);
  if (shownText !== "CryptoPunks. Floor $91246.00. CoinGecko.") bad.push(`nft plate ${JSON.stringify(shownText)}`);
  strayTags("nft plate", box, ["p"], bad);
  junkIn("nft plate", shownText, bad);

  // A hostile native currency symbol from the feed (no USD floor) paints as letters.
  const evil = fixtureJson("nft-cryptopunks.json");
  delete evil.floor_price.usd;
  evil.native_currency_symbol = HOSTILE_IMG;
  const goEvil = fakeFetch([{ match: (u) => u === url, body: evil }]);
  const evilLive = M.parseNftLive(await M.readNft(line, nft.geckoId, goEvil));
  H.paintMarket(card, null, false, { coinLives: {}, nftLive: evilLive, nftUnread: false });
  noHostileElements("nft plate", box, bad);
  if (evilLive) showsLiterally("nft plate", box, [evilLive.nativeSymbol], bad);
  else bad.push("parseNftLive dropped a floor with a hostile symbol");

  // A failed read says so and keeps the number off the plate.
  const down = fakeFetch([{ match: () => true, fail: true }]);
  let nftUnread = false;
  try {
    await M.readNft(line, nft.geckoId, down);
  } catch {
    nftUnread = true;
  }
  H.paintMarket(card, null, false, { coinLives: {}, nftLive: null, nftUnread });
  const miss = shown(box);
  if (miss !== "PUNK · can't reach") bad.push(`failed nft read shows ${JSON.stringify(miss)}`);
  sinksIn("nft plate", bad);
  const trace = [`nft.url=${url}`, `nft=${shownText}`, `hostile symbol=${evilLive ? evilLive.nativeSymbol : "dropped"}`, `unread=${miss}`];
  if (bad.length) return fail(bad.join("; "), { shown: shownText }, trace);
  return ok(shownText, { shown: shownText, url, sinks: 0 }, trace);
}

// ---------------------------------------------------------------------------
// Links: painted news links through the main-process seal (presence/open-link.cjs)
// ---------------------------------------------------------------------------

/** Links a plate must never hand to the browser. */
const REFUSED_LINKS = [
  "javascript:alert(1)",
  "data:text/html,<b>x</b>",
  "file:///C:/Windows/win.ini",
  "blob:https://example.test/1",
  "about:blank",
  "chrome://settings",
  "vbscript:msgbox(1)",
  "mailto:keeper@example.test",
  "ftp://example.test/a",
  "//example.test/a",
  "./Tilcayo",
  "https://user:pass@example.test/",
];

/** A stand-in webContents: records handlers so the replay can click and navigate. */
function fakeContents() {
  const on = {};
  const perms = {};
  return {
    on: (name, fn) => {
      on[name] = fn;
    },
    setWindowOpenHandler: (fn) => {
      on.open = fn;
    },
    session: {
      setPermissionRequestHandler: (fn) => {
        perms.request = fn;
      },
      setPermissionCheckHandler: (fn) => {
        perms.check = fn;
      },
    },
    handlers: on,
    perms,
  };
}

async function linksOpen() {
  const dom = installDom(NEWS_IDS);
  const { N, H } = loadPlates();
  const Presence = require(path.join(DESKTOP, "presence.cjs"));
  const OpenLink = require(path.join(DESKTOP, "presence", "open-link.cjs"));
  const bad = [];

  // Paint the saved Popular RSS, the saved Wikipedia featured feed, and one hostile item.
  const painted = [];
  function paint(label, items, card) {
    H.paintNews(items, false, card);
    walk(dom.get("news-live"), (n) => {
      if (n.tagName !== "A") return;
      const href = String(n.href || "");
      const want = OpenLink.linkHostLine(href);
      if (!want) bad.push(`${label}: painted a link the browser would refuse`);
      if (n.title !== want) bad.push(`${label}: link title ${JSON.stringify(n.title)}, expected ${JSON.stringify(want)}`);
      painted.push(href);
    });
  }
  paint("popular", N.parseRss(fixture("news-popular.rss")), { newsTab: "popular" });
  paint("world", N.parseNews(fixtureJson("news-featured.json")), N.toCardPatch(N.pickTab(N.blankNewsPrefs(), "topics")));
  paint("hostile rss", N.parseRss(hostileRss()), { newsTab: "popular" });
  const wikiLinks = painted.filter((h) => hostOf(h) === "en.wikipedia.org").length;
  if (painted.length !== 6 || wikiLinks !== 2) bad.push(`painted ${painted.length} links (${wikiLinks} Wikipedia), expected 6 (2 Wikipedia)`);

  // Seal a stand-in contents the way main.cjs seals the overlay.
  const opened = [];
  const logs = [];
  let windows = 0;
  const contents = fakeContents();
  OpenLink.sealContents(contents, {
    presence: Presence,
    openExternal: (url) => {
      opened.push(url);
      return Promise.resolve();
    },
    log: (line) => logs.push(line),
    sealed: new WeakSet(),
  });
  const h = contents.handlers;
  if (typeof h.open !== "function") bad.push("no window-open handler was set");
  const answers = [];
  const click = (url) => {
    const answer = h.open ? h.open({ url, disposition: "foreground-tab" }) : null;
    answers.push(answer && answer.action);
    if (answer && answer.action === "allow") windows += 1;
  };
  painted.forEach(click);
  if (!same(opened, painted)) bad.push(`openExternal got ${JSON.stringify(opened.map(hostOf))}, expected the ${painted.length} painted links`);
  const before = opened.length;
  REFUSED_LINKS.forEach(click);
  if (opened.length !== before) bad.push(`a refused link reached openExternal: ${JSON.stringify(opened.slice(before))}`);
  const refusedLogs = logs.filter((line) => /^\[links\] refused /.test(line));
  if (refusedLogs.length !== REFUSED_LINKS.length) bad.push(`${refusedLogs.length} refusals logged, expected ${REFUSED_LINKS.length}`);
  if (logs.some((line) => /alert|win\.ini|keeper@|pass@/.test(line))) bad.push("a refusal log carried the link itself");
  if (answers.some((a) => a !== "deny")) bad.push(`a window-open answer was not deny: ${JSON.stringify(answers)}`);

  // The overlay never navigates, not even to a painted web page.
  let navigated = 0;
  ["will-navigate", "will-redirect", "will-frame-navigate"].forEach((name) => {
    if (typeof h[name] !== "function") {
      bad.push(`${name} is not refused`);
      return;
    }
    painted.concat(REFUSED_LINKS).forEach((url) => {
      let prevented = false;
      h[name]({ preventDefault: () => (prevented = true) }, url);
      if (!prevented) navigated += 1;
    });
  });
  if (navigated) bad.push(`${navigated} navigations were not prevented`);
  let granted = 0;
  contents.perms.request(null, "media", (yes) => (granted += yes ? 1 : 0));
  if (granted || contents.perms.check(null, "media")) bad.push("a permission was granted to the overlay");
  sinksIn("links", bad);

  const detail = `${opened.length} painted links to the browser, ${REFUSED_LINKS.length} refused, 0 windows`;
  const trace = [
    `painted=${painted.length} wikipedia=${wikiLinks}`,
    `opened=${opened.map(hostOf).join(",")}`,
    `refused=${refusedLogs.length} answers=${Array.from(new Set(answers)).join(",")}`,
    `navigated=${navigated} windows=${windows}`,
  ];
  const extras = { painted: painted.length, opened: opened.length, refused: refusedLogs.length, windows, navigated };
  if (bad.length) return fail(bad.join("; "), extras, trace);
  return ok(detail, extras, trace);
}

// ---------------------------------------------------------------------------
// GPU sense: saved probe output through desktop gpu-sense.cjs read()
// ---------------------------------------------------------------------------

const GPU_CASES = [
  { file: "gpu-win-nvidia.txt", platform: "win32" },
  { file: "gpu-win-pdh.txt", platform: "win32" },
  { file: "gpu-win-two-adapters.txt", platform: "win32" },
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
  links_open: linksOpen,
  shown,
  WMO_CASES,
  HOSTILE_IMG,
  HOSTILE_SCRIPT,
  GPU_CASES,
  REFUSED_LINKS,
  GPU_NOW,
};