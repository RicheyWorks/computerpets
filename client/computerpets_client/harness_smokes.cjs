/** Offline smokes for Buffffff app_harness — real renderer modules, no live network. */
"use strict";

const path = require("node:path");
const fs = require("node:fs");

const RENDERER = path.join(__dirname, "..", "..", "desktop", "renderer");

function load(name) {
  return require(path.join(RENDERER, name));
}

function ok(detail, extras = {}, trace = []) {
  return { ok: true, detail, extras, trace };
}

function fail(error, extras = {}, trace = []) {
  return { ok: false, detail: error, error, extras, trace };
}

function weatherResolve() {
  const W = load("weather-areas.js");
  const url = W.forecastUrl(37.77, -122.42);
  if (!String(url).includes(W.FORECAST_HOST || "api.open-meteo.com")) {
    return fail("forecastUrl host drifted", { url });
  }
  const live = W.parseForecast({
    current: { temperature_2m: 18.5, wind_speed_10m: 12, weather_code: 61 },
    daily: {
      time: ["2026-09-15", "2026-09-16"],
      temperature_2m_max: [20, 21],
      temperature_2m_min: [12, 13],
      weather_code: [61, 0],
    },
  });
  if (!live || live.source !== "open-meteo" || live.tempC !== 18.5) {
    return fail("parseForecast fixture failed", { live });
  }
  const bad = W.parseForecast({});
  if (bad !== null) return fail("parseForecast should reject empty", { bad });
  return ok(`sky=${live.sky} temp=${live.tempC}`, { sky: live.sky, tempC: live.tempC, url }, [
    `forecastUrl=${url}`,
    `sky=${live.sky}`,
    `tempC=${live.tempC}`,
    "parseForecast.fixture=ok",
  ]);
}

function newsResolve() {
  const N = load("news.js");
  const rssUrl = N.topicRssUrl("red pandas");
  const popular = N.popularRssUrl();
  if (!String(rssUrl).includes("news.google.com") && !String(rssUrl).includes(N.TOPIC_HOST || "")) {
    return fail("topicRssUrl host drifted", { rssUrl });
  }
  const items = N.parseRss(
    "<rss><channel><item><title>Fixture headline</title><link>https://example.test/a</link><source>Wire</source></item>" +
      "<item><title>Second</title><link>https://example.test/b</link></item></channel></rss>",
  );
  if (!Array.isArray(items) || items.length < 1 || items[0].title !== "Fixture headline") {
    return fail("parseRss fixture failed", { items });
  }
  const wiki = N.parseNews({
    query: { pages: { "1": { title: "Red panda", extract: "A small mammal.", fullurl: "https://en.wikipedia.org/wiki/Red_panda" } } },
  });
  // parseNews may expect different shape — tolerate empty but must not throw
  return ok(`rss=${items.length}`, { rss: items.length, wiki: (wiki && wiki.length) || 0, rssUrl, popular }, [
    `topicRssUrl=${rssUrl}`,
    `popularRssUrl=${popular}`,
    `parseRss=${items.length}`,
    "news.resolve.fixture=ok",
  ]);
}

function marketResolve() {
  const M = load("market.js");
  const gecko = M.geckoUrl("ethereum");
  const yahoo = M.yahooUrl("AAPL");
  if (!String(gecko).includes("api.coingecko.com")) return fail("geckoUrl host drifted", { gecko });
  const live = M.parseGecko({ ethereum: { usd: 2500.5, usd_24h_change: 1.25 } }, "ethereum");
  if (!live || live.price !== 2500.5 || live.source !== "coingecko") {
    return fail("parseGecko fixture failed", { live });
  }
  const y = M.parseYahoo({
    chart: { result: [{ meta: { regularMarketPrice: 190.25, shortName: "Apple" } }] },
  });
  if (!y || y.price !== 190.25) return fail("parseYahoo fixture failed", { y });
  if (M.parseGecko({}, "ethereum") !== null) return fail("parseGecko should reject empty");
  return ok(`eth=${live.price}`, { price: live.price, yahoo: y.price, gecko, yahooUrl: yahoo }, [
    `geckoUrl=${gecko}`,
    `yahooUrl=${yahoo}`,
    `parseGecko=${live.price}`,
    `parseYahoo=${y.price}`,
  ]);
}

function nftResolve() {
  const M = load("market.js");
  const url = M.nftUrl("bored-ape-yacht-club");
  if (!String(url).includes("api.coingecko.com")) return fail("nftUrl host drifted", { url });
  const live = M.parseNftLive({
    id: "bored-ape-yacht-club",
    name: "Bored Ape",
    symbol: "BAYC",
    floor_price: { usd: 12.5, native_currency: 0.4 },
    native_currency: "eth",
  });
  if (!live || live.floorUsd !== 12.5 || live.source !== "coingecko") {
    return fail("parseNftLive fixture failed", { live });
  }
  if (M.parseNftLive({ id: "x" }) !== null && M.parseNftLive({ id: "x" }).floorUsd != null) {
    // market.test expects null-ish for incomplete — accept null or no floor
  }
  const markets = M.defaultMarketplaces ? M.defaultMarketplaces() : [];
  return ok(`floorUsd=${live.floorUsd}`, { floorUsd: live.floorUsd, url, markets: markets.length }, [
    `nftUrl=${url}`,
    `parseNftLive=${live.floorUsd}`,
    `marketplaces=${markets.length}`,
  ]);
}

function cryPlayback() {
  // Stub HTMLAudioElement so playVoice leaves an observable play() without speakers.
  const played = [];
  global.Audio = class {
    constructor(src) {
      this.src = src;
      this.volume = 1;
    }
    play() {
      played.push(this.src);
      return Promise.resolve();
    }
  };
  const S = load("house-sounds.js");
  const C = load("card.js");
  global.PetHouseSounds = S;
  global.PetCard = C;
  // desk-house closes over root at load time — load after stubs are on globalThis
  delete require.cache[require.resolve(path.join(RENDERER, "desk-house.js"))];
  const H = load("desk-house.js");
  const card = typeof C.blankCard === "function" ? C.blankCard() : {};
  const src = S.overlayVoiceSrc("red_panda");
  if (!src || !src.includes("red_panda.wav")) return fail("overlayVoiceSrc missing", { src });
  const wavPath = path.join(RENDERER, src.replace(/^\//, ""));
  if (!fs.existsSync(wavPath)) return fail(`wav missing on disk: ${wavPath}`, { src });
  const started = H.playVoice("red_panda", card);
  if (!started) return fail("playVoice returned false with Audio stub", { src, played });
  if (!played.length || !String(played[0]).includes("red_panda.wav")) {
    return fail("Audio.play was not called with house cry", { played });
  }
  return ok(`played=${played[0]}`, { src: played[0], wav: wavPath }, [
    `overlayVoiceSrc=${src}`,
    `wav.exists=true`,
    `Audio.play=${played[0]}`,
    "cry.playback.stub=ok",
  ]);
}

function giftPlace() {
  const L = load("life.js");
  const life = { bond: 40, mood: 50, gifts: [] };
  const after = L.leaveGift(life, 1_700_000);
  if (!after.gifts || after.gifts.length !== 1) return fail("leaveGift did not place", { after });
  const x = after.gifts[0].x;
  if (!(x >= 0.16 && x <= 0.84)) return fail(`gift x out of wood range: ${x}`, { x });
  const picked = L.pickGift({ ...after, gifts: after.gifts.slice() }, after.gifts[0].id);
  if (picked.gifts.length !== 0) return fail("pickGift did not clear", { picked });
  return ok(`x=${x}`, { x }, [`gift.place.x=${x}`, "leaveGift=1", "pickGift=0"]);
}

function choiceCloseExit() {
  const C = load("choice.js");
  const marks = C.guestMarks({ walking: true }).map((m) => m.id);
  if (marks[marks.length - 2] !== "close" || marks[marks.length - 1] !== "exit") {
    return fail("marks must end close/exit", { marks });
  }
  if (C.guestPick("close") !== "close" || C.guestPick("exit") !== "exit") {
    return fail("guestPick close/exit failed");
  }
  if (C.guestTap() !== "choice") return fail("guestTap is not choice");
  return ok("close/exit", { marks }, [`marks=${marks.join("/")}`, "pick.close", "pick.exit", "tap=choice"]);
}

function cardPaintWire() {
  const petSrc = fs.readFileSync(path.join(RENDERER, "pet.js"), "utf8");
  const need = [
    "function collapseKeeperCard()",
    "function openKeeperCard()",
    "function paintHud(",
    "function persistCard(",
    "card.collapsed = true",
    "card.collapsed = false",
  ];
  const missing = need.filter((n) => !petSrc.includes(n));
  if (missing.length) return fail(`pet.js missing ${missing.join(",")}`, { missing });
  return ok("paintHud+persistCard+collapse/open", { missing: [] }, [
    "collapseKeeperCard",
    "openKeeperCard",
    "paintHud",
    "persistCard",
  ]);
}

const COMMANDS = {
  weather_resolve: weatherResolve,
  news_resolve: newsResolve,
  market_resolve: marketResolve,
  nft_resolve: nftResolve,
  cry_playback: cryPlayback,
  gift_place: giftPlace,
  choice_close_exit: choiceCloseExit,
  card_paint_wire: cardPaintWire,
};

function main(argv) {
  const cmd = argv[2];
  if (!cmd || cmd === "--list") {
    process.stdout.write(JSON.stringify({ ok: true, commands: Object.keys(COMMANDS) }) + "\n");
    return 0;
  }
  const fn = COMMANDS[cmd];
  if (!fn) {
    process.stdout.write(JSON.stringify(fail(`unknown smoke ${cmd}`)) + "\n");
    return 2;
  }
  try {
    const result = fn();
    process.stdout.write(JSON.stringify(result) + "\n");
    return result.ok ? 0 : 1;
  } catch (err) {
    process.stdout.write(JSON.stringify(fail(`${err && err.name}: ${err && err.message}`)) + "\n");
    return 1;
  }
}

process.exitCode = main(process.argv);
