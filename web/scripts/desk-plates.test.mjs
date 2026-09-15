import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const Overlay = createRequire(import.meta.url)(join(root, "../desktop/renderer/desk-plates.js"));
const P = await import(pathToFileURL(join(root, "src/lib/pets/desk-plates.ts")).href);
const deskSrc = readFileSync(join(root, "src/components/desk/desk-plates.tsx"), "utf8");
const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const Market = await import(pathToFileURL(join(root, "src/lib/pets/market.ts")).href);
const Weather = await import(pathToFileURL(join(root, "src/lib/pets/weather-areas.ts")).href);
const News = await import(pathToFileURL(join(root, "src/lib/pets/news.ts")).href);

test("/demo Weather News Quotes plates drag and recolor lockstep with overlay", () => {
  assert.deepEqual([...P.PLATE_KEYS], Overlay.PLATE_KEYS);
  assert.equal(P.PLATE_NAMES.market, "Quotes");
  assert.equal(P.STORE, Overlay.STORE);
  const store = {
    data: Object.create(null),
    getItem(k) { return this.data[k] || null; },
    setItem(k, v) { this.data[k] = v; },
  };
  const plates = P.loadPlates(800, 480, store);
  assert.equal(plates.length, 3);
  let quotes = P.beginDrag(plates[2], plates[2].x + 4, plates[2].y + 4);
  quotes = P.moveDrag(quotes, 400, 240, 800, 480);
  quotes = P.endDrag(quotes);
  quotes = P.setColors(quotes, { bg: "#1a2a1c", fg: "#e8f0e4", muted: "#8aaa80" });
  P.savePlates([plates[0], plates[1], quotes], store);
  const again = P.loadPlates(800, 480, store);
  assert.equal(again[2].bg, "#1a2a1c");
  assert.ok(Math.abs(again[2].x - quotes.x) < 1);
  assert.equal(P.clickMoved(2, 1), Overlay.clickMoved(2, 1));
  assert.match(deskSrc, /usePlateChrome/);
  assert.match(deskSrc, /Plate color/);
  assert.match(deskSrc, /beginDrag/);
  assert.match(roomSrc, /DeskWeatherPlate/);
  assert.match(roomSrc, /DeskNewsPlate/);
  assert.match(roomSrc, /DeskMarketPlate/);
});

test("plateLine helpers still work on the web house", () => {
  assert.equal(typeof Weather.plateLine({ areas: [], currentId: null }, null, false), "string");
  assert.equal(typeof News.newsLine([], false), "string");
  assert.equal(typeof Market.plateLine({ tickers: [], currentId: null }, null, false), "string");
});

test("Quotes crypto + NFT panes lockstep with overlay market helpers", () => {
  const house = Market.parseMarket({});
  assert.deepEqual(house.tickers.slice(0, 3).map((t) => t.symbol), ["ETH", "DOGE", "XLM"]);
  assert.ok(Market.detectContract("So11111111111111111111111111111111111111112"));
  assert.ok(house.marketplaces.some((m) => m.id === "blur"));
  assert.ok(house.marketplaces.some((m) => m.id === "robinhood-nft"));
  assert.match(deskSrc, /Add a coin/);
  assert.match(deskSrc, /Marketplaces/);
  assert.match(deskSrc, /pump mint|contract/);
  const OverlayMarket = createRequire(import.meta.url)(join(root, "../desktop/renderer/market.js"));
  assert.deepEqual(
    Market.DEFAULT_MARKETPLACES.slice().sort(),
    OverlayMarket.DEFAULT_MARKETPLACES.slice().sort(),
  );
  assert.equal(Market.MAX_TICKERS, OverlayMarket.MAX_TICKERS);
  assert.equal(typeof Market.pickBestSearchCoin, "function");
  assert.equal(typeof OverlayMarket.pickBestSearchCoin, "function");
  assert.equal(Market.classify("AAPL").kind, "stock");
  assert.equal(Market.classify("BTC").kind, "crypto");
  assert.equal(OverlayMarket.classify("AAPL").kind, "stock");
  assert.equal(OverlayMarket.classify("BTC").kind, "crypto");
  // Bare unknown tickers guess stock; Coins Add forces crypto via kind/search.
  assert.equal(Market.classify("PEPE").kind, "stock");
  assert.equal(OverlayMarket.classify("WIF").kind, "stock");

});
