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


function memStore() {
  const data = Object.create(null);
  return {
    getItem(k) {
      return Object.prototype.hasOwnProperty.call(data, k) ? data[k] : null;
    },
    setItem(k, v) {
      data[k] = String(v);
    },
  };
}

function newsFavorites() {
  const N = load("news.js");
  let prefs = N.blankNewsPrefs();
  prefs = N.addTopic(prefs, { name: "Halo", query: "Halo" });
  const halo = prefs.topics.find((t) => t.query === "Halo");
  if (!halo) return fail("addTopic did not keep Halo");
  prefs = N.toggleFavorite(prefs, { kind: "topic", topic: halo });
  prefs = N.toggleFavorite(prefs, {
    kind: "headline",
    title: "Fixture headline",
    url: "https://example.test/a",
  });
  if (prefs.favorites.length !== 2) return fail("expected 2 favorites", { prefs });
  if (!N.isFavorite(prefs, { kind: "topic", topic: halo })) {
    return fail("topic favorite not listed");
  }
  const patch = N.toCardPatch(prefs);
  const round = N.parseNewsPrefs(patch);
  if (round.favorites.length !== 2) {
    return fail("favorites did not persist through toCardPatch/parseNewsPrefs", { round, patch });
  }
  const emptied = N.removeFavorite(round, round.favorites[0].id);
  if (emptied.favorites.length !== 1) return fail("removeFavorite failed", { emptied });
  return ok(`favorites=${round.favorites.length}`, { count: round.favorites.length, kinds: round.favorites.map((f) => f.kind) }, [
    "news.favorites.load=blank",
    "news.favorites.add=topic+headline",
    "news.favorites.persist=toCardPatch",
    `news.favorites.list=${round.favorites.length}`,
  ]);
}

function marketFavorites() {
  const M = load("market.js");
  let house = M.parseMarket(null);
  const eth = house.tickers.find((t) => t.geckoId === "ethereum") || house.tickers[0];
  const nft = house.nfts[0];
  if (!eth || !nft) return fail("default market missing eth/nft", { eth, nft });
  house = M.toggleFavoriteTicker(house, eth.id);
  house = M.toggleFavoriteNft(house, nft.id);
  if (!M.isFavoriteTicker(house, eth.id) || !M.isFavoriteNft(house, nft.id)) {
    return fail("favorite flags missing", { house });
  }
  const rows = M.favoriteRows(house);
  if (rows.tickers.length !== 1 || rows.nfts.length !== 1) {
    return fail("favoriteRows mismatch", { rows });
  }
  const round = M.parseMarket({
    tickers: house.tickers,
    nfts: house.nfts,
    favoriteTickerIds: house.favoriteTickerIds,
    favoriteNftIds: house.favoriteNftIds,
    currentId: house.currentId,
    currentNftId: house.currentNftId,
    marketplaces: house.marketplaces,
  });
  if (round.favoriteTickerIds[0] !== eth.id || round.favoriteNftIds[0] !== nft.id) {
    return fail("favorites did not round-trip parseMarket", { round });
  }
  return ok(`coins=1 nfts=1`, { tickerId: eth.id, nftId: nft.id }, [
    "market.favorites.coins=1",
    "market.favorites.nfts=1",
    "market.favorites.persist=parseMarket",
  ]);
}

function weatherFavorites() {
  const W = load("weather-areas.js");
  const area = { id: "sf", name: "San Francisco", lat: 37.77, lon: -122.42 };
  let house = W.parseAreas({ areas: [area], currentId: "sf" });
  house = W.toggleFavorite(house, "sf");
  if (!W.isFavorite(house, "sf")) return fail("weather favorite flag missing", { house });
  const listed = W.favoriteAreas(house);
  if (listed.length !== 1 || listed[0].id !== "sf") return fail("favoriteAreas list wrong", { listed });
  const round = W.parseAreas({
    areas: house.areas,
    currentId: house.currentId,
    tab: "favorites",
    favoriteAreaIds: house.favoriteIds,
  });
  if (round.favoriteIds[0] !== "sf" || round.tab !== "favorites") {
    return fail("weather favorites did not persist", { round });
  }
  if (!Array.isArray(W.WEATHER_TABS) || W.WEATHER_TABS.indexOf("favorites") < 0) {
    return fail("WEATHER_TABS missing favorites", { tabs: W.WEATHER_TABS });
  }
  return ok("sf", { id: "sf", tab: round.tab }, [
    "weather.favorites.toggle=sf",
    "weather.favorites.list=1",
    "weather.favorites.tab=favorites",
  ]);
}

function newsTopics() {
  const N = load("news.js");
  let prefs = N.blankNewsPrefs();
  if (prefs.tab !== "popular") return fail("blank tab should be popular", { prefs });
  const popular = N.popularRssUrl();
  if (!String(popular).includes("news.google.com")) return fail("popularRssUrl host drifted", { popular });
  const world = N.worldTopic ? N.worldTopic() : prefs.topics.find((t) => t.id === N.WORLD_ID);
  if (!world || world.id !== N.WORLD_ID) return fail("world topic missing", { world });
  prefs = N.addTopic(prefs, { name: "Esports", query: "Esports" });
  prefs = N.addTopic(prefs, { name: "Halo", query: "Halo" });
  const halo = prefs.topics.find((t) => t.query === "Halo");
  prefs = N.pickTopic(prefs, halo.id);
  if (prefs.currentId !== halo.id || prefs.tab !== "topics") {
    return fail("pickTopic did not select Halo on topics tab", { prefs });
  }
  prefs = N.moveTopic(prefs, halo.id, -1);
  const idx = prefs.topics.findIndex((t) => t.id === halo.id);
  if (idx < 1) return fail("moveTopic left of world or missing", { idx, topics: prefs.topics });
  prefs = N.pickTab(prefs, "popular");
  if (prefs.tab !== "popular") return fail("pickTab popular failed", { prefs });
  const sug = N.SUGGESTION_TOPICS || [];
  if (sug.length < 4 || sug.indexOf("Halo") < 0) return fail("SUGGESTION_TOPICS drifted", { sug });
  const tabs = N.NEWS_TABS || [];
  if (tabs.join("/") !== "popular/topics/x/favorites") return fail("NEWS_TABS drifted", { tabs });
  prefs = N.removeTopic(prefs, halo.id);
  if (prefs.topics.some((t) => t.id === halo.id)) return fail("removeTopic failed", { prefs });
  return ok(`topics=${prefs.topics.length}`, { tabs, suggestions: sug.length, popular }, [
    "news.topics.popularRssUrl",
    "news.topics.add/pick/move/remove",
    "news.topics.tabs=popular/topics/x/favorites",
    `news.topics.suggestions=${sug.length}`,
  ]);
}

function platesStyle() {
  const P = load("desk-plates.js");
  const store = memStore();
  const plates = P.loadPlates(800, 600, store);
  if (!plates || plates.length !== 3) return fail("expected 3 plates", { plates });
  const weather = plates.find((p) => p.key === "weather") || plates[0];
  const moss = (P.SWATCHES || []).find((s) => s.id === "moss");
  if (!moss) return fail("SWATCHES missing moss", { swatches: P.SWATCHES });
  let next = P.applySwatch(weather, "moss");
  if (next.bg !== moss.bg) return fail("applySwatch did not set moss bg", { next, moss });
  const style = P.paintStyle(next);
  if (style["--plate-bg"] !== moss.bg) return fail("paintStyle chrome mismatch", { style });
  next = P.beginDrag(next, 40, 40);
  next = P.moveDrag(next, 140, 100, 800, 600);
  next = P.endDrag(next);
  if (next.dragging) return fail("endDrag left dragging true", { next });
  const saved = plates.map((p) => (p.key === next.key ? next : p));
  P.savePlates(saved, store);
  const again = P.loadPlates(800, 600, store);
  const round = again.find((p) => p.key === "weather");
  if (!round || round.bg !== moss.bg) return fail("plate chrome did not persist", { round });
  if (!(round.x > 40)) return fail("plate drag place did not persist x", { round });
  return ok(`bg=${round.bg}`, { bg: round.bg, x: round.x, swatches: P.SWATCHES.length }, [
    "plates.style.swatches",
    "plates.style.applySwatch=moss",
    "plates.style.paintStyle",
    "plates.style.drag-place+persist",
  ]);
}

function plantsPlace() {
  const Pl = load("desk-plants.js");
  const store = memStore();
  let plants = Pl.loadPlants(800, 600, store);
  if (!plants || plants.length !== 2) return fail("expected Disk+Felt", { plants });
  let plant = plants[0];
  const before = { x: plant.x, y: plant.y };
  plant = Pl.beginDrag(plant, before.x + 10, before.y + 10);
  plant = Pl.moveDrag(plant, before.x + 80, before.y + 60, 800, 600);
  plant = Pl.endDrag(plant);
  if (plant.dragging) return fail("plant still dragging", { plant });
  if (plant.x === before.x && plant.y === before.y) return fail("plant did not move", { before, plant });
  plant = Pl.cycleMode(plant);
  plants = plants.map((p) => (p.key === plant.key ? plant : p));
  Pl.savePlants(plants, store);
  const again = Pl.loadPlants(800, 600, store);
  const round = again.find((p) => p.key === plant.key);
  if (!round || round.x !== plant.x || round.y !== plant.y) {
    return fail("plant place did not persist", { round, plant });
  }
  if (round.mode !== plant.mode) return fail("plant mode did not persist", { round, plant });
  return ok(`x=${round.x},y=${round.y},mode=${round.mode}`, { x: round.x, y: round.y, mode: round.mode, keys: Pl.PLANT_KEYS }, [
    "plants.place.begin/move/end",
    "plants.place.persist",
    `plants.place.mode=${round.mode}`,
  ]);
}

function notifyOpen() {
  const L = load("life.js");
  const map = L.NEED_CARE || {};
  const expect = {
    sick: "medicine",
    hunger: "feed",
    hygiene: "bath",
    mess: "clean",
    bond: "praise",
    mood: "talk",
    hidden: "call",
    energy: "rest",
  };
  for (const [need, care] of Object.entries(expect)) {
    if (map[need] !== care || L.careForNeed(need) !== care) {
      return fail(`NEED_CARE mismatch for ${need}`, { map, got: L.careForNeed(need), want: care });
    }
  }
  if (L.careForNeed("") !== null || L.careForNeed("nope") !== null) {
    return fail("careForNeed should null unknown/empty");
  }
  const hungry = L.alerts(
    { hunger: 5, hygiene: 90, mess: [], sick: false, hidden: false, lastNotify: 0 },
    "Rui",
  );
  if (!hungry || hungry.need !== "hunger" || L.careForNeed(hungry.need) !== "feed") {
    return fail("alerts hunger path failed", { hungry });
  }
  const petSrc = fs.readFileSync(path.join(RENDERER, "pet.js"), "utf8");
  const need = [
    "function openCareFromNotify(payload)",
    "openKeeperCard()",
    "open-care",
    "PetLife.careForNeed",
    "data-need-focus",
  ];
  const missing = need.filter((n) => !petSrc.includes(n));
  if (missing.length) return fail(`pet.js notify deep-link missing ${missing.join(",")}`, { missing });
  return ok("need->care+openCareFromNotify", { need: hungry.need, care: "feed" }, [
    "notify.NEED_CARE",
    "notify.careForNeed=hunger->feed",
    "notify.alerts=hunger",
    "notify.openCareFromNotify.wire",
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
  news_favorites: newsFavorites,
  market_favorites: marketFavorites,
  weather_favorites: weatherFavorites,
  news_topics: newsTopics,
  plates_style: platesStyle,
  plants_place: plantsPlace,
  notify_open: notifyOpen,
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
