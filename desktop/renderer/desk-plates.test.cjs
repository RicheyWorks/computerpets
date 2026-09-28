const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const P = require("./desk-plates.js");
const Weather = require("./weather-areas.js");
const News = require("./news.js");
const Market = require("./market.js");

const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const htmlSrc = readFileSync(join(__dirname, "index.html"), "utf8");
const cssSrc = readFileSync(join(__dirname, "styles.css"), "utf8");
const houseSrc = readFileSync(join(__dirname, "desk-house.js"), "utf8");

function store() {
  return {
    data: Object.create(null),
    getItem(k) { return this.data[k] || null; },
    setItem(k, v) { this.data[k] = v; },
  };
}

test("Weather, News, Quotes plates drag, recolor, and remember the spot", () => {
  assert.deepEqual(P.PLATE_KEYS, ["weather", "news", "market"]);
  assert.equal(P.PLATE_NAMES.market, "Quotes");
  assert.match(htmlSrc, /id="weather-plate"/);
  assert.match(htmlSrc, /id="news-plate"/);
  assert.match(htmlSrc, /id="market-plate"/);
  assert.match(htmlSrc, /desk-plates\.js/);
  assert.match(htmlSrc, /Plate color/);
  assert.match(cssSrc, /--plate-bg/);
  assert.match(cssSrc, /--plate-fg/);
  assert.match(petSrc, /PetDeskPlates/);
  assert.match(petSrc, /sitPlates/);
  assert.match(petSrc, /bindPlateToggleDrag/);
  assert.match(petSrc, /plateSkipToggle/);

  const mem = store();
  const plates = P.loadPlates(800, 480, mem);
  assert.equal(plates.length, 3);
  assert.equal(plates[0].key, "weather");
  assert.equal(plates[2].key, "market");
  assert.equal(plates[2].bg, P.DEFAULT_COLORS.bg);

  let quotes = P.beginDrag(plates[2], plates[2].x + 4, plates[2].y + 4);
  assert.equal(quotes.dragging, true);
  quotes = P.moveDrag(quotes, 420, 260, 800, 480);
  assert.ok(Math.abs(quotes.x - (420 - 4)) < 3);
  quotes = P.endDrag(quotes);
  assert.equal(quotes.dragging, false);
  quotes = P.setColors(quotes, { bg: "#2a1814", fg: "#f5e6d8", muted: "#c49070" });
  assert.equal(quotes.bg, "#2a1814");
  P.savePlates([plates[0], plates[1], quotes], mem);
  const again = P.loadPlates(800, 480, mem);
  assert.ok(Math.abs(again[2].x - quotes.x) < 1);
  assert.equal(again[2].bg, "#2a1814");
  assert.equal(again[2].fg, "#f5e6d8");
  const sw = P.applySwatch(again[2], "frost");
  assert.equal(sw.bg, "#1a2228");
  assert.equal(P.clickMoved(2, 2), false);
  assert.equal(P.clickMoved(20, 0), true);
  const style = P.paintStyle(sw);
  assert.equal(style["--plate-bg"], "#1a2228");
  assert.match(style.left, /px/);
});

test("plateLine helpers still speak for weather, news, and quotes", () => {
  assert.match(houseSrc, /paintWeather/);
  assert.match(houseSrc, /paintNews/);
  assert.match(houseSrc, /paintMarket/);
  const weatherLine = Weather.plateLine({ areas: [], currentId: null }, null, false);
  assert.equal(typeof weatherLine, "string");
  assert.ok(weatherLine.length);
  const newsLine = News.newsLine([], false);
  assert.equal(typeof newsLine, "string");
  const marketLine = Market.plateLine({ tickers: [], currentId: null }, null, false);
  assert.equal(typeof marketLine, "string");
  assert.ok(marketLine.length);
});

test("collapsed plate headers read as Weather, News, Quotes — click to open, drag to move", () => {
  assert.match(htmlSrc, /desk-plate-chip/);
  assert.match(htmlSrc, /Weather — click to open, drag to move/);
  assert.match(htmlSrc, /News — click to open, drag to move/);
  assert.match(htmlSrc, /Quotes — click to open, drag to move/);
  assert.match(htmlSrc, /aria-controls="weather-body"/);
  assert.match(htmlSrc, /aria-controls="news-body"/);
  assert.match(htmlSrc, /aria-controls="market-body"/);
  assert.match(cssSrc, /\.desk-plate-chip/);
  assert.match(cssSrc, /\.desk-plate-grip/);
  assert.match(petSrc, /aria-expanded", open/);
});

test("floor mess and gifts name themselves for a stranger", () => {
  assert.match(petSrc, /Clean mess/);
  assert.match(petSrc, /Pick up gift/);
  assert.match(petSrc, /Pick up shed/);
  assert.match(cssSrc, /\.gift-dot::before/);
  assert.match(cssSrc, /\.mess-dot::after/);
  assert.match(cssSrc, /border-radius:\s*65% 40% 55% 45%/);
});


test("Quotes expansion carries crypto list customize and shared plate styles", () => {
  const house = Market.parseMarket({});
  assert.ok(house.tickers.some((t) => t.symbol === "ETH"));
  assert.ok(house.marketplaces.some((m) => m.id === "opensea"));
  assert.match(htmlSrc, /data-market-pane="coins"/);
  assert.match(htmlSrc, /data-market-pane="nfts"/);
  assert.match(htmlSrc, /nft-marketplaces/);
  assert.ok(htmlSrc.includes(`placeholder="${require("./market.js").MARKET_PLACEHOLDER}"`));
  assert.doesNotMatch(htmlSrc, /pump mint|mint or contract|honest offline|needs a key/);
  assert.match(cssSrc, /\.market-pane/);
  assert.match(cssSrc, /--plate-bg/);
  const mem = store();
  let plates = P.loadPlates(800, 480, mem);
  plates[2] = P.applySwatch(plates[2], "dusk");
  P.savePlates(plates, mem);
  const again = P.loadPlates(800, 480, mem);
  assert.equal(again[2].bg, "#1a1828");
});

test("the overlay's plates start where they always did; keepOff (the web /demo room's panel, rail, header) is opt-in", () => {
  // The overlay (pet.js) passes no keepOff, so a bare screen's spots are unchanged.
  for (const [w, h] of [[800, 480], [1280, 800], [1920, 1080]]) {
    const spots = P.PLATE_KEYS.map((k) => P.defaultSpot(k, w, h));
    assert.deepEqual(spots.map((s) => [s.x, s.y]), [
      [Math.min(Math.max(w * 0.04, 8), w - 296), Math.min(Math.max(h * 0.08, 8), h - 52)],
      [Math.min(Math.max(w - 288 - w * 0.08, 8), w - 296), Math.min(Math.max(h * 0.08, 8), h - 52)],
      [Math.min(Math.max(w * 0.04, 8), w - 296), Math.min(Math.max(h * 0.38, 8), h - 52)],
    ]);
    assert.deepEqual(P.loadPlates(w, h, store()).map((s) => [s.x, s.y]), spots.map((s) => [s.x, s.y]));
  }
  assert.doesNotMatch(petSrc, /loadPlates\([^)]*,[^)]*,[^)]*,/);
  // With keepOff: clear of the left panel, the right rail and the header, news under weather when there is no room.
  const keep = { left: 352, right: 208, top: 57 };
  const [weather, news, market] = P.PLATE_KEYS.map((k) => P.defaultSpot(k, 1024, 768, keep));
  assert.equal(weather.x, 352 + P.KEEP_GAP);
  assert.equal(market.x, 352 + P.KEEP_GAP);
  assert.ok(news.x + 288 <= 1024 - 208 - P.KEEP_GAP);
  assert.equal(news.y, weather.y + 44 + 8);
  for (const p of [weather, news, market]) assert.ok(p.y >= 57 + 8);
  // A moved plate keeps its spot either way.
  const mem = store();
  mem.setItem(P.STORE, JSON.stringify([{ key: "news", x: 30, y: 40 }]));
  assert.deepEqual([P.loadPlates(1024, 768, mem, keep)[1].x, P.loadPlates(1024, 768, mem, keep)[1].y], [30, 40]);
});
