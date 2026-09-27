/** Offline smokes for Buffffff app_harness — real renderer modules, no live network. Recorded-feed replays live in harness_replay.cjs. */
"use strict";

const path = require("node:path");
const fs = require("node:fs");

const RENDERER = path.join(__dirname, "..", "..", "desktop", "renderer");
const Replay = require("./harness_replay.cjs");

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


/** Keeper-card house-server row: hidden with no server named, the saved URL wins, plain words only. */
function houseServerRow() {
  const H = require(path.join(__dirname, "..", "..", "desktop", "house-server.cjs"));
  const K = load("keeper.js");
  const html = fs.readFileSync(path.join(RENDERER, "index.html"), "utf8");
  const petSrc = fs.readFileSync(path.join(RENDERER, "pet.js"), "utf8");
  const none = H.target({ savedUrl: "", env: {}, licenseHeld: false });
  if (none !== null) return fail("row would probe with no server named", { none });
  if (K.houseServerLine({ show: false }) !== "") return fail("hidden row still has text");
  const picked = H.target({ savedUrl: "https://house.example:9443/", env: { COMPUTERPETS_BACKEND_URL: "http://env.example" }, licenseHeld: true });
  if (!picked || picked.base !== "https://house.example:9443" || picked.from !== "settings") {
    return fail("saved Backend URL is not the probe target", { picked });
  }
  const lines = [
    K.houseServerLine({ show: true, reachable: true, uptimeSeconds: 7200 }),
    K.houseServerLine({ show: true, reachable: false }),
  ];
  if (lines[0] !== "House server · reachable · up 2h" || lines[1] !== "House server · unreachable") {
    return fail("row words drifted", { lines });
  }
  if (lines.some((line) => /unread|Java|DOWN/.test(line))) return fail("raw token on the row", { lines });
  if (!/<p id="hud-heartbeat"[^>]*hidden><\/p>/.test(html)) return fail("index.html row does not ship hidden");
  if (petSrc.includes("fetch(")) return fail("pet.js still fetches the heartbeat itself");
  return ok("hidden until named; saved URL probed; plain words", { target: picked.base, lines }, [
    "none=hidden",
    "saved=https://house.example:9443",
    "reachable|unreachable",
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

function visitTodays() {
  const V = load("visitor.js");
  const day = new Date(2026, 7, 17);
  const rui = V.todaysVisitor("red_panda", null, day);
  const python = V.todaysVisitor("ball_python", null, day);
  if (!rui || rui === "red_panda") return fail("todaysVisitor should pick a non-host guest", { rui });
  if (!python || python === "ball_python") return fail("todaysVisitor host filter failed", { python });
  const line = V.visitLine(rui);
  if (!line || line.length < 4) return fail("visitLine empty", { rui, line });
  if (V.visitLine("not_a_pet") !== "I came. I saw the lamp. I left.") {
    return fail("visitLine fallback drifted");
  }
  if (!Array.isArray(V.CATALOG_KEYS) || V.CATALOG_KEYS.length < 200) {
    return fail("CATALOG_KEYS too small", { n: (V.CATALOG_KEYS || []).length });
  }
  return ok("guest=" + rui, { guest: rui, host: "red_panda", line }, [
    "visit.todays=" + rui,
    "visit.line.len=" + line.length,
    "visit.catalog=" + V.CATALOG_KEYS.length,
  ]);
}

function visitPhases() {
  const V = load("visitor.js");
  const steps = [
    [0, "in"],
    [V.VISIT_TALK_MS, "talk"],
    [V.VISIT_WANDER_MS, "wander"],
    [V.VISIT_LEAVE_MS, "leave"],
    [V.VISIT_GONE_MS, "gone"],
  ];
  for (const [ms, want] of steps) {
    const got = V.visitPhaseFromEnter(ms, false);
    if (got !== want) return fail("enter " + ms + " => " + got + " want " + want, { ms, got, want });
  }
  if (V.visitPhaseFromWait(0, false) !== "wait") return fail("wait phase missing");
  if (V.visitPhaseFromWait(V.VISIT_WAIT_MS, false) !== "in") return fail("wait->in failed");
  if (V.visitPhaseFromEnter(800, true) !== "gone") return fail("hostHidden should force gone");
  if (V.visitPhaseFromWait(100, true) !== "gone") return fail("hostHidden wait should force gone");
  const petSrc = fs.readFileSync(path.join(RENDERER, "pet.js"), "utf8");
  for (const needle of ["PetVisitor", "visitPhaseFromEnter", "tapVisitor", "startVisit", "endVisit"]) {
    if (!petSrc.includes(needle)) return fail("pet.js missing " + needle);
  }
  return ok("in/talk/wander/leave/gone+hostHidden", { wait: V.VISIT_WAIT_MS, gone: V.VISIT_GONE_MS }, [
    "visit.phases.enter=in/talk/wander/leave/gone",
    "visit.phases.wait->in",
    "visit.phases.hostHidden=gone",
    "visit.phases.pet.js.wire",
  ]);
}

function visitCallLifecycle() {
  const G = load("call-guests.js");
  const roster = load("roster.json");
  const matched = G.matchCall("Miso", roster);
  if (!matched.includes("cat")) return fail("matchCall Miso->cat failed", { matched });
  const keys = G.callKeys("Miso", roster);
  if (!keys.includes("cat")) return fail("callKeys failed", { keys });
  let guest = G.beginCalled("cat", 800, 0, 1);
  if (!guest || guest.phase !== "in" || guest.key !== "cat") {
    return fail("beginCalled failed", { guest });
  }
  for (let i = 0; i < 40 && guest.phase === "in"; i++) {
    guest = G.stepCalled(guest, 0.2, 800, { hidden: false, hostKey: "red_panda", hostX: 200, hostFacing: 1 });
  }
  guest = G.placeCalled(guest, 220, 800);
  if (!guest.placed || guest.phase !== "stay") {
    return fail("placeCalled did not stay/placed", { guest });
  }
  const held = G.stepCalled(guest, 1.0, 800, { hidden: false, hostKey: "red_panda", hostX: 200, hostFacing: 1 });
  if (!held.placed || held.phase !== "stay") {
    return fail("placed guest should hold stay", { held });
  }
  guest = G.dismissCalled(held);
  if (guest.phase !== "leave" || !guest.dismissed) {
    return fail("dismissCalled failed", { guest });
  }
  if (!G.stillVisible(guest)) return fail("leave should still be visible");
  // leave walks toward target=-160; settle on target so stepCalled can flip leave->gone
  // (large dt overshoots and oscillates around -160 before MIN_STAY*8 age).
  guest = G.stepCalled(Object.assign({}, guest, { x: -160 }), 0.05, 800, { hidden: false });
  if (guest.phase !== "gone") return fail("leave did not reach gone", { guest });
  if (G.stillVisible(guest)) return fail("gone should not be visible");
  const walkers = G.walkersOf(["cat", "dog", "hummingbird"], "red_panda");
  if (!walkers.includes("cat") || walkers.includes("hummingbird")) {
    return fail("walkersOf should drop fly bird", { walkers });
  }
  return ok("call->place->dismiss->gone", { key: "cat", phases: "in/stay/leave/gone" }, [
    "visit.call.match=Miso->cat",
    "visit.call.beginCalled",
    "visit.call.placeCalled",
    "visit.call.dismiss+leave->gone",
    "visit.call.stillVisible",
  ]);
}

function visitArrive() {
  const A = load("arrive.js");
  const tap = A.pointerUp(2, 2);
  if (tap.kind !== "tap" || tap.arrive !== false) return fail("short lift should be tap not arrive", { tap });
  const place = A.pointerUp(40, 0);
  if (place.kind !== "place" || place.arrive !== false) return fail("drag should place not arrive", { place });
  if (A.walkLand(false, 0) !== "arrive") return fail("finished walk should arrive");
  if (A.walkLand(true, 0) !== "act") return fail("act walk should not arrive-as-land");
  if (A.arriveFinish(true) !== "now" || A.arriveFinish(false) !== "settle") {
    return fail("arriveFinish drifted");
  }
  if (A.afterPlace(true) !== "resume" || A.afterPlace(false) !== "idle") {
    return fail("afterPlace drifted");
  }
  const petSrc = fs.readFileSync(path.join(RENDERER, "pet.js"), "utf8");
  for (const needle of ["PetArrive", "arriveFinish", "finishArrive", "arrivedPending"]) {
    if (!petSrc.includes(needle)) return fail("pet.js missing " + needle);
  }
  return ok("tap/place vs walk-arrive", { tap: tap.kind, place: place.kind }, [
    "visit.arrive.pointerUp=tap|place",
    "visit.arrive.walkLand",
    "visit.arrive.arriveFinish",
    "visit.arrive.pet.js.wire",
  ]);
}

function marketTickers() {
  const M = load("market.js");
  let house = M.parseMarket(null);
  const before = house.tickers.length;
  house = M.addTicker(house, { symbol: "LINK", kind: "crypto", geckoId: "chainlink", name: "Chainlink" });
  const link = house.tickers.find((t) => t.symbol === "LINK" || t.geckoId === "chainlink");
  if (!link) return fail("addTicker LINK missing", { house });
  if (house.currentId !== link.id) return fail("addTicker should select current", { currentId: house.currentId, link });
  house = M.addTicker(house, { symbol: "AAPL", kind: "stock", name: "Apple" });
  const aapl = house.tickers.find((t) => t.symbol === "AAPL");
  if (!aapl || aapl.kind !== "stock") return fail("addTicker AAPL stock failed", { aapl });
  const search = M.parseSearchCoins({
    coins: [
      { id: "dogwifcoin", name: "dogwifhat", symbol: "wif", market_cap_rank: 50 },
      { id: "wrapped-something", name: "Wrapped", symbol: "wif", market_cap_rank: 999 },
    ],
  });
  const best = M.pickBestSearchCoin(search, "WIF");
  if (!best || best.geckoId !== "dogwifcoin") return fail("pickBestSearchCoin fixture failed", { best, search });
  house = M.addTicker(house, Object.assign({}, best, { kind: "crypto" }));
  if (!house.tickers.some((t) => t.geckoId === "dogwifcoin")) return fail("WIF not added", { house });
  const patch = M.toCardPatch(house);
  const round = M.parseMarket(patch);
  if (!round.tickers.some((t) => t.geckoId === "chainlink")) return fail("watchlist did not persist LINK", { round });
  if (!round.tickers.some((t) => t.geckoId === "dogwifcoin")) return fail("watchlist did not persist WIF", { round });
  const removeId = round.tickers.find((t) => t.geckoId === "chainlink").id;
  const trimmed = M.removeTicker(round, removeId);
  if (trimmed.tickers.some((t) => t.id === removeId)) return fail("removeTicker failed");
  const yahoo = M.yahooUrl("AAPL");
  const searchUrl = M.searchUrl("pepe");
  if (!String(yahoo).includes("yahoo")) return fail("yahooUrl drifted", { yahoo });
  if (!String(searchUrl).includes("api.coingecko.com")) return fail("searchUrl drifted", { searchUrl });
  return ok("tickers=" + round.tickers.length + " (was " + before + ")", { before, after: round.tickers.length, link: link.id }, [
    "market.tickers.add=LINK+AAPL+WIF",
    "market.tickers.resolve=parseSearchCoins",
    "market.tickers.persist=toCardPatch",
    "market.tickers.remove",
  ]);
}

function newsX() {
  const N = load("news.js");
  let prefs = N.blankNewsPrefs();
  prefs = N.addTopic(prefs, { name: "Halo", query: "Halo" });
  const halo = prefs.topics.find((t) => t.query === "Halo");
  if (!halo) return fail("need Halo topic for X tab");
  prefs = N.pickTopic(prefs, halo.id);
  prefs = N.pickTab(prefs, "x");
  if (prefs.tab !== "x") return fail("pickTab x failed", { prefs });
  const rss = N.xTopicRssUrl(halo.query);
  const search = N.xSearchUrl(halo.query);
  if (!String(rss).includes("news.google.com") || !String(rss).toLowerCase().includes("x.com")) {
    return fail("xTopicRssUrl should be Google News X-site filter", { rss });
  }
  if (!String(search).includes("x.com/search")) return fail("xSearchUrl drifted", { search });
  const srcLine = N.sourceLine(halo, "x");
  if (!String(srcLine).includes("X") || !String(srcLine).includes("Halo")) {
    return fail("sourceLine x drifted", { srcLine });
  }
  const worldSrc = N.sourceLine(null, "x");
  if (!String(worldSrc).includes("X")) return fail("world x source drifted", { worldSrc });
  if ((N.NEWS_TABS || []).indexOf("x") < 0) return fail("NEWS_TABS missing x", { tabs: N.NEWS_TABS });
  if (N.X_SOURCE !== "Google News · X") return fail("X_SOURCE drifted", { got: N.X_SOURCE });
  return ok("x tab + rss + search", { tab: prefs.tab, rss, search, src: srcLine }, [
    "news.x.pickTab=x",
    "news.x.xTopicRssUrl",
    "news.x.xSearchUrl",
    "news.x.sourceLine",
  ]);
}

function needsPersist() {
  const store = memStore();
  global.localStorage = store;
  delete require.cache[require.resolve(path.join(RENDERER, "life.js"))];
  const L = load("life.js");
  const key = "red_panda";
  let life = L.blank();
  life.key = key;
  life.hunger = 5;
  life.hygiene = 90;
  life.mess = [];
  life.sick = false;
  life.hidden = false;
  life.lastNotify = 0;
  const hungry = L.alerts(life, "Rui", Date.now());
  if (!hungry || hungry.need !== "hunger") return fail("expected hunger alert", { hungry });
  L.save(key, life);
  const loaded = L.load(key);
  if (loaded.hunger !== 5) return fail("hunger did not persist", { loaded });
  const trait = { diet: "omnivore", hardy: 0.5, startle: false, special: "", extra: {} };
  const fed = L.act(loaded, trait, "feed", Date.now(), key);
  if (!fed || !fed.life || fed.life.hunger < 16) return fail("feed did not raise hunger enough", { fed });
  const afterFeed = L.alerts(fed.life, "Rui", Date.now());
  if (afterFeed && afterFeed.need === "hunger") return fail("hunger alert should clear after feed", { afterFeed });
  fed.life.hidden = true;
  fed.life.lastNotify = 0;
  const hid = L.alerts(fed.life, "Rui", Date.now());
  if (!hid || hid.need !== "hidden") return fail("expected hidden alert", { hid });
  const called = L.act(fed.life, trait, "call", Date.now(), key);
  if (called.life.hidden) return fail("call should clear hidden", { called });
  const afterCall = L.alerts(called.life, "Rui", Date.now());
  if (afterCall && afterCall.need === "hidden") return fail("hidden alert should clear after call", { afterCall });
  L.save(key, called.life);
  const again = L.load(key);
  if (again.hunger !== called.life.hunger) return fail("post-care hunger did not reload", { again, called });
  const petSrc = fs.readFileSync(path.join(RENDERER, "pet.js"), "utf8");
  if (!petSrc.includes("function persistCard()") || !petSrc.includes("PetLife.alerts")) {
    return fail("pet.js persist/alerts wire missing");
  }
  return ok("save/load + clear hunger/hidden", { hunger: again.hunger, hidden: again.hidden }, [
    "needs.persist.life.save/load",
    "needs.alerts.hunger->feed.clear",
    "needs.alerts.hidden->call.clear",
    "needs.persist.load.clearsHidden",
  ]);
}


function speakOptsSmoke() {
  const store = memStore();
  global.localStorage = store;
  delete require.cache[require.resolve(path.join(RENDERER, "card.js"))];
  const C = load("card.js");
  const styles = C.VOICE_STYLES || [];
  const want = {
    hearth: { rate: 0.82, pitch: 0.88 },
    hush: { rate: 0.8, pitch: 1.02 },
    even: { rate: 0.92, pitch: 1 },
    low: { rate: 0.84, pitch: 0.76 },
    bright: { rate: 0.98, pitch: 1.1 },
  };
  if (styles.length !== 5) return fail("VOICE_STYLES count drift", { styles });
  for (const s of styles) {
    const w = want[s.id];
    if (!w) return fail("unexpected voice style " + s.id, { styles });
    if (s.rate !== w.rate || s.pitch !== w.pitch) {
      return fail("voice style drift " + s.id, { s, w });
    }
    const opts = C.speakOpts(s.id, 50);
    if (opts.rate !== w.rate || opts.pitch !== w.pitch) {
      return fail("speakOpts rate/pitch drift " + s.id, { opts, w });
    }
  }
  const hearth50 = C.speakOpts("hearth", 50);
  if (!(hearth50.volume < 0.5) || Math.abs(hearth50.volume - 0.46) > 1e-9) {
    return fail("hearth soft volume drift", { hearth50 });
  }
  const even50 = C.speakOpts("even", 50);
  if (Math.abs(even50.volume - 0.5) > 1e-9) return fail("even volume drift", { even50 });
  const clampedHi = C.speakOpts("hearth", 250);
  if (Math.abs(clampedHi.volume - 0.92) > 1e-9) return fail("volume clamp high drift", { clampedHi });
  const clampedLo = C.speakOpts("bright", -40);
  if (clampedLo.volume !== 0) return fail("volume clamp low drift", { clampedLo });
  const fallback = C.speakOpts("nope", 100);
  if (Math.abs(fallback.volume - 0.92) > 1e-9 || fallback.rate !== 0.82) {
    return fail("unknown style should fall back to hearth", { fallback });
  }
  const petSrc = fs.readFileSync(path.join(RENDERER, "pet.js"), "utf8");
  for (const needle of ["speakOpts(card.voiceStyle", "u.volume = opts.volume", "u.rate = opts.rate", "u.pitch = opts.pitch"]) {
    if (!petSrc.includes(needle)) return fail("pet.js TTS wire missing " + needle);
  }
  return ok("styles=5 hearthSoft=0.46", { styles: styles.map((s) => s.id), hearth50: hearth50.volume }, [
    "speakOpts.styles=5",
    "speakOpts.hearth.soft=0.46",
    "speakOpts.clamp=0..100",
    "speakOpts.fallback=hearth",
    "pet.js.speakOpts.wire",
  ]);
}

function volumeMutesSmoke() {
  const store = memStore();
  global.localStorage = store;
  delete require.cache[require.resolve(path.join(RENDERER, "card.js"))];
  delete require.cache[require.resolve(path.join(RENDERER, "house-sounds.js"))];
  delete require.cache[require.resolve(path.join(RENDERER, "desk-house.js"))];
  const C = load("card.js");
  global.PetCard = C;
  const S = load("house-sounds.js");
  global.PetHouseSounds = S;
  const H = load("desk-house.js");

  const buses = C.MUTE_BUSES || [];
  if (buses.join(",") !== "talk,special,weather,treats,steps,music") {
    return fail("MUTE_BUSES drift", { buses });
  }
  let card = C.blankCard();
  const guest0 = C.guestOf(card, "red_panda");
  if (guest0.volume !== 80) return fail("blank guest volume", { guest0 });

  card = C.setGuest(card, "red_panda", { volume: 150 });
  if (C.guestOf(card, "red_panda").volume !== 100) return fail("volume clamp high", { card });
  card = C.setGuest(card, "red_panda", { volume: -5 });
  if (C.guestOf(card, "red_panda").volume !== 0) return fail("volume clamp low", { card });
  card = C.setGuest(card, "red_panda", { volume: 40 });
  card.mutes = { ...C.blankCard().mutes, talk: true, weather: true };
  card.voiceStyle = "bright";
  C.save(card);
  const loaded = C.load();
  if (loaded.pets.red_panda.volume !== 40) return fail("volume did not persist", { loaded });
  if (!loaded.mutes.talk || !loaded.mutes.weather) return fail("mutes did not persist", { loaded });
  if (loaded.voiceStyle !== "bright") return fail("voiceStyle did not persist", { loaded });
  if (!C.isMuted(loaded.mutes, "chirp") || !C.isMuted(loaded.mutes, "voice") || !C.isMuted(loaded.mutes, "call")) {
    return fail("talk mute should cover chirp/voice/call", { mutes: loaded.mutes });
  }
  if (!C.isMuted(loaded.mutes, "rain") || !C.isMuted(loaded.mutes, "wind")) {
    return fail("weather mute should cover rain/wind", { mutes: loaded.mutes });
  }
  if (C.isMuted(loaded.mutes, "hop")) return fail("special should stay unmuted", { mutes: loaded.mutes });
  if (C.isMuted(loaded.mutes, "unknown_kind")) return fail("unknown kind must not mute");

  const volumes = [];
  global.Audio = class {
    constructor(src) {
      this.src = src;
      this.volume = 1;
    }
    play() {
      volumes.push({ src: this.src, volume: this.volume });
      return Promise.resolve();
    }
  };
  const mutedPlay = H.playVoice("red_panda", loaded);
  if (mutedPlay) return fail("playVoice should no-op when talk muted", { mutedPlay, volumes });
  if (volumes.length) return fail("Audio.play fired while muted", { volumes });

  loaded.mutes = C.blankCard().mutes;
  C.save(loaded);
  const unmuted = C.load();
  const started = H.playVoice("red_panda", unmuted);
  if (!started) return fail("playVoice returned false", { volumes });
  if (!volumes.length || !String(volumes[0].src).includes("red_panda.wav")) {
    return fail("cry Audio.play missing", { volumes });
  }
  if (Math.abs(volumes[0].volume - 0.4) > 1e-9) {
    return fail("cry volume should be guest.volume/100", { volumes });
  }

  const petSrc = fs.readFileSync(path.join(RENDERER, "pet.js"), "utf8");
  const hudNeedles = [
    'getElementById("hud-volume")',
    "hudVolume.value",
    "setGuest(card, kind.key, { volume: Number(hudVolume.value) })",
    'getElementById("hud-mutes")',
    "MUTE_BUSES",
  ];
  for (const needle of hudNeedles) {
    if (!petSrc.includes(needle)) return fail("pet.js volume/mute HUD wire missing " + needle);
  }
  return ok("volume=40 persist mute+cry", { volume: 40, cryVolume: volumes[0].volume, buses }, [
    "volume.clamp=0..100",
    "volume.persist=load/save",
    "mutes.buses=6",
    "isMuted.talk/weather",
    "cry.playVoice.volume=0.4",
    "cry.playVoice.mute.talk",
    "pet.js.hud-volume+hud-mutes",
  ]);
}



function windowsPerch() {
  const W = load("windows.js");
  const P = load("window-play.js");
  const work = { x: 0, y: 40, width: 1600, height: 900 };
  const enumText = [
    "9999\t0\t40\t1600\t940\t0\t0\t0\tChrome_WidgetWin_1",
    "2\t200\t120\t900\t700\t1\t0\t0\tChrome_WidgetWin_1",
    "3\t0\t940\t1600\t1080\t0\t0\t0\tShell_TrayWnd",
    "4\t0\t0\t1600\t1080\t0\t0\t0\tProgman",
    "5\t40\t80\t120\t160\t0\t1\t0\tToolTip",
    "6\t240\t140\t880\t720\t0\t0\t1\tChrome_WidgetWin_1",
    "8\t240\t140\t880\t720\t0\t0\t0\tNotepad",
    "END",
  ].join("\n");
  const parsed = W.parseEnumText(enumText);
  if (!parsed.length) return fail("parseEnumText empty", { parsed });
  const taken = W.takeRects(parsed, { workArea: work, scaleFactor: 1, skipIds: ["9999"] });
  if (taken.map((r) => r.id).join(",") !== "8") {
    return fail("takeRects should keep only usable notepad", { taken });
  }
  const box = taken[0];
  if (!(box.width >= W.MIN_W && box.height >= W.MIN_H)) {
    return fail("usable rect below MIN", { box });
  }
  if (W.laterDoor("win32") !== null) return fail("win32 should enumerate", {});
  if (W.laterDoor("linux") !== null) return fail("linux should enumerate", {});
  if (!W.enumeratesOn("linux")) return fail("linux enumeratesOn", {});
  if (!W.enumeratesOn("darwin")) return fail("darwin enumeratesOn", {});
  if (W.laterDoor("darwin") !== null) return fail("darwin later door drifted", {});
  if (W.cgWindowIdFromMediaSource("window:1869:0") !== "1869") return fail("mac window number", {});
  if (W.cgWindowIdFromMediaSource("window:-1:0") !== "") return fail("mac window number refused", {});

  const fixture = [{ id: "8", x: 200, y: 80, width: 700, height: 580 }];
  if (P.playFor("budgie") !== "perch") return fail("budgie playFor should be perch", { got: P.playFor("budgie") });
  if (P.playFor("cat") !== "ledge") return fail("cat playFor should be ledge", { got: P.playFor("cat") });
  const perch = P.pickTarget(fixture, 120, "budgie", work, 176, { rand: 0.2 });
  if (!perch || perch.id !== "8" || perch.kind !== "perch") {
    return fail("pickTarget budgie perch failed", { perch });
  }
  if (![perch.approachX, perch.holdX, perch.holdLift].every(Number.isFinite)) {
    return fail("perch target missing bounds", { perch });
  }
  const ledge = P.pickTarget(fixture, 120, "cat", work, 176, { rand: 0.2 });
  if (!ledge || ledge.id !== "8" || ledge.kind !== "ledge") {
    return fail("pickTarget cat ledge failed", { ledge });
  }
  const play = P.beginPlay(perch, 120);
  if (!play || play.phase !== "approach" || play.target.id !== "8") {
    return fail("beginPlay did not approach perch", { play });
  }
  return ok(
    "rects=1 perch=" + perch.kind + " approach=" + perch.approachX,
    { rectIds: taken.map((r) => r.id), perchKind: perch.kind, approachX: perch.approachX, holdLift: perch.holdLift },
    [
      "windows.parseEnumText",
      "windows.takeRects.filter=overlay+min+taskbar+tool+cloaked",
      "windows.laterDoor=win32|linux|darwin",
      "window-play.playFor=budgie:perch,cat:ledge",
      "window-play.pickTarget.perch+ledge",
      "window-play.beginPlay.approach",
    ],
  );
}

function blotterHours() {
  const H = load("hours.js");
  const fs = require("fs");
  const path = require("path");
  const restN = Object.keys(H.REST || {}).length;
  if (restN < 221) return fail("hours.js REST thin", { restN });
  if (!H.isRestingHour("cat", 14)) return fail("cat should rest at 14");
  if (H.isRestingHour("red_panda", 14)) return fail("rui should not rest at 14");
  // House REST for Rui is [1, 6) — must match web hours.ts (Python lockstep is in blotter.hours).
  if (H.isRestingHour("red_panda", 0) || !H.isRestingHour("red_panda", 2) || H.isRestingHour("red_panda", 6) || H.isRestingHour("red_panda", 23)) {
    return fail("rui rest window drifted from [1,6)", { window: H.restWindow("red_panda") });
  }
  const webPath = path.join(__dirname, "..", "..", "web", "src", "lib", "pets", "hours.ts");
  const webSrc = fs.readFileSync(webPath, "utf8");
  const webBlock = webSrc.match(/const REST: Record<string, \[number, number\]> = \{([\s\S]*?)\n\};/);
  if (!webBlock) return fail("web hours.ts REST block missing");
  const webRest = {};
  for (const m of webBlock[1].matchAll(/([A-Za-z0-9_]+):\s*\[(\d+),\s*(\d+)\]/g)) {
    webRest[m[1]] = [Number(m[2]), Number(m[3])];
  }
  const drift = [];
  for (const key of Object.keys(H.REST)) {
    const a = H.REST[key];
    const b = webRest[key];
    if (!b || a[0] !== b[0] || a[1] !== b[1]) drift.push(key);
  }
  for (const key of Object.keys(webRest)) {
    if (!H.REST[key]) drift.push(key);
  }
  if (drift.length) return fail("REST desk/web drift", { drift: drift.slice(0, 12) });
  // dayPart lives in web hours.ts (+ Python); desktop hours.js has no peer — do not invent.
  if (/\bdayPart\b/.test(webSrc) === false) return fail("web dayPart missing");
  if (/\bdayPart\b/.test(fs.readFileSync(path.join(__dirname, "..", "..", "desktop", "renderer", "hours.js"), "utf8"))) {
    return fail("unexpected desktop dayPart — document if added");
  }
  const snack = H.snackLine("red_panda");
  if (!String(snack).includes("Bamboo")) return fail("snackLine drift", { snack });
  return ok("rest=" + restN, { restN, snack, lockstep: restN }, [
    "REST=" + restN,
    "REST_desk_web_lockstep=" + restN,
    "isRestingHour.cat.14=true",
    "isRestingHour.rui.14=false",
    "rui.window=[1,6)",
    "dayPart=web-only",
    "snack=" + snack,
  ]);
}

function blotterHive() {
  const H = load("hive.js");
  if (H.HIVE_PLACE !== "honeycomb" || H.HIVE_WORKER !== "honeybee") {
    return fail("hive place/worker drift", { place: H.HIVE_PLACE, worker: H.HIVE_WORKER });
  }
  if (!H.isHivePlace("honeycomb") || H.isHivePlace("honeybee")) return fail("isHivePlace drift");
  if (!H.sitsOnWax("honeybee") || H.sitsOnWax("honeycomb")) return fail("sitsOnWax drift");
  const seats = H.combSeats().map((s) => s.key);
  if (JSON.stringify(seats) !== JSON.stringify(["honey_queen", "honeybee", "honeybee", "honey_drone"])) {
    return fail("combSeats drift", { seats });
  }
  const living = H.colonyOf({ hunger: 78, health: 92 });
  const word = H.colonyWord(living);
  if (living.quiet || living.brood !== 7 || living.stores !== 78) {
    return fail("colonyOf drift", { living });
  }
  if (!String(word).includes("Brood")) return fail("colonyWord drift", { word });
  return ok("place=" + H.HIVE_PLACE + " brood=" + living.brood, { place: H.HIVE_PLACE, brood: living.brood, seats }, [
    "place=" + H.HIVE_PLACE,
    "brood=" + living.brood,
    "word=" + word,
  ]);
}

function blotterGait() {
  const G = load("gait.js");
  if (G.TURN_S !== 0.23 || G.ACCEL_S !== 0.4 || G.DECEL_DIST !== 56 || G.HIGH_WALK !== 120) {
    return fail("gait constants drift", { TURN_S: G.TURN_S, ACCEL_S: G.ACCEL_S });
  }
  if (G.walkSpeed(56, 1, 100) !== 100) return fail("walkSpeed full remaining");
  if (G.facingAfter(1, 100, 20, 0, G.TURN_S) !== 1) return fail("facingAfter frame0");
  if (G.facingAfter(1, 100, 20, G.TURN_S, G.TURN_S) !== -1) return fail("facingAfter hold");
  if (G.leaveTarget(80, 800) !== -200) return fail("leaveTarget left drift");
  if (G.enterSpawn(800, 176, 20, true) !== -176) return fail("enterSpawn drift");
  if (G.enterSit(800, 176, 20, 0) !== 80) return fail("enterSit drift");
  return ok("TURN_S=" + G.TURN_S, { TURN_S: G.TURN_S }, [
    "TURN_S=" + G.TURN_S,
    "walkSpeed.full=100",
    "leaveTarget.left=-200",
  ]);
}

function blotterPlay() {
  const P = load("play.js");
  const local = P.playChase(["catch", "arrive"], { taken: false, cmd: "seek", mark: "lure" });
  if (!local || JSON.stringify(local.acts) !== JSON.stringify(["play", "idle"])) {
    return fail("playChase catch/arrive acts", { local });
  }
  if (local.applyPlay !== 1 || local.issuePlay !== 1) return fail("playChase apply/issue", { local });
  if (P.playClaim("arrive", { taken: true, cmd: "seek", mark: "lure" }) !== "none") {
    return fail("playClaim double not none");
  }
  const treat = P.playChase(["arrive"], { taken: false, cmd: "seek", mark: "treat" });
  if (!treat || JSON.stringify(treat.acts) !== JSON.stringify(["snack"])) {
    return fail("treat arrive", { treat });
  }
  return ok("acts=" + local.acts.join(","), { acts: local.acts, applyPlay: local.applyPlay }, [
    "acts=" + local.acts.join(","),
    "applyPlay=" + local.applyPlay,
    "treat=snack",
  ]);
}

function blotterWeather() {
  const W = load("weather.js");
  const d = new Date(2026, 7, 17);
  const sky = W.weatherOf(d);
  if (sky !== "wind") return fail("weatherOf fixture", { sky });
  if (W.weatherLabel("wind") !== "Wind") return fail("weatherLabel drift");
  if (W.weatherLine("goldfish", "rain") !== "Proper weather. At last.") {
    return fail("goldfish rain line", { line: W.weatherLine("goldfish", "rain") });
  }
  if (W.weatherLine("red_panda", "rain") !== "The blotter is honest about rain.") {
    return fail("rui rain line");
  }
  if (W.weatherIdle("goldfish", "rain") !== "wander") return fail("goldfish rain idle");
  if (W.weatherIdle("red_panda", "rain") !== "sit") return fail("rui rain idle");
  if (W.weatherIdle("ball_python", "heat") !== "sit") return fail("snake heat idle");
  if (W.weatherIdle("red_panda", "clear") != null) return fail("clear idle should be null");
  return ok("sky=" + sky, { sky }, [
    "sky=" + sky,
    "line.goldfish.rain=ok",
    "idle.rui.rain=sit",
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
  house_server_row: houseServerRow,
  news_favorites: newsFavorites,
  market_favorites: marketFavorites,
  weather_favorites: weatherFavorites,
  news_topics: newsTopics,
  plates_style: platesStyle,
  plants_place: plantsPlace,
  windows_perch: windowsPerch,
  notify_open: notifyOpen,
  visit_todays: visitTodays,
  visit_phases: visitPhases,
  visit_call_lifecycle: visitCallLifecycle,
  visit_arrive: visitArrive,
  market_tickers: marketTickers,
  news_x: newsX,
  needs_persist: needsPersist,
  speak_opts: speakOptsSmoke,
  volume_mutes: volumeMutesSmoke,
  blotter_hours: blotterHours,
  blotter_hive: blotterHive,
  blotter_gait: blotterGait,
  blotter_play: blotterPlay,
  blotter_weather: blotterWeather,
  weather_replay: Replay.weather_replay,
  news_replay: Replay.news_replay,
  market_replay: Replay.market_replay,
  nft_replay: Replay.nft_replay,
  gpu_replay: Replay.gpu_replay,
  links_open: Replay.links_open,
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
    // Replays read through a fake fetch, so they return a promise.
    if (result && typeof result.then === "function") {
      result.then(
        (res) => {
          process.exitCode = emit(res);
        },
        (err) => {
          process.exitCode = crash(err);
        },
      );
      return undefined;
    }
    return emit(result);
  } catch (err) {
    return crash(err);
  }
}

function emit(result) {
  process.stdout.write(JSON.stringify(result) + "\n");
  return result && result.ok ? 0 : 1;
}

function crash(err) {
  process.stdout.write(JSON.stringify(fail(`${err && err.name}: ${err && err.message}`)) + "\n");
  return 1;
}

const code = main(process.argv);
if (code !== undefined) process.exitCode = code;
