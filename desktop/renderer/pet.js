const BASE = 176;
const PAD = 16;
const STORE_KIND = "computerpets.desktop.kind.v1";
const FPS = { idle: 2.8, walk: 6.4, sit: 2.2, sleep: 1.8, talk: 4.6, eat: 3.8, play: 6.6 };
const ONCE = new Set(["eat", "play"]);

function pack(key) {
  const n = (anim, count) =>
    Array.from({ length: count }, (_, i) => `sprites/${key}/${anim}/${i + 1}.png`);
  return {
    idle: n("idle", 4),
    walk: n("walk", 6),
    sit: n("sit", key === "red_panda" ? 2 : 4),
    sleep: n("sleep", 4),
    talk: n("talk", 4),
    eat: n("eat", 4),
    play: n("play", 4),
  };
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)] ?? list[0];
}
function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

const pet = document.getElementById("pet");
let petSurface = null;
try {
  petSurface = window.PetSpriteSurface ? window.PetSpriteSurface.attach(pet) : null;
} catch {
  petSurface = null;
}

function paintPetFrame(src) {
  if (!petSurface || petSurface.ok !== true) {
    if (pet && pet.dataset) {
      pet.dataset.surface = "refused";
      delete pet.dataset.frame;
    }
    return;
  }
  petSurface.paint(src);
}

function paintActor(el, src, box) {
  if (!el || !src) return;
  const api = window.PetSpriteSurface;
  const css = api && api.BOX ? api.BOX[box] : 0;
  if (!api || typeof api.paintHeld !== "function" || !(css > 0)) {
    if (el.dataset) {
      el.dataset.surface = "refused";
      delete el.dataset.frame;
    }
    return;
  }
  api.paintHeld(el, src, { cssSize: css });
}
const guestEl = document.getElementById("guest");
const tongueEl = document.getElementById("tongue");
const shadow = document.getElementById("shadow");
const bubble = document.getElementById("bubble");
const bubbleText = document.getElementById("bubble-text");
const dustRoot = document.getElementById("dust");
const messRoot = document.getElementById("mess");
const giftRoot = document.getElementById("gifts");
const weatherRoot = document.getElementById("weather");
const treatEl = document.getElementById("treat");
const lureEl = document.getElementById("lure");
const birdEl = document.getElementById("bird");
const robinEl = document.getElementById("robin");
const plantsRoot = document.getElementById("plants");
const calledRoot = document.getElementById("called");
const weatherPlate = document.getElementById("weather-plate");
const newsPlate = document.getElementById("news-plate");
const marketPlate = document.getElementById("market-plate");
const hud = document.getElementById("hud");
const choiceEl = document.getElementById("choice");
const plantChoiceEl = document.getElementById("plant-choice");
const hudName = document.getElementById("hud-name");
const hudStage = document.getElementById("hud-stage");
const hudBondTitle = document.getElementById("hud-bond-title");
const hudVital = document.getElementById("hud-vital");
const hudHunger = document.getElementById("hud-hunger");
const hudRest = document.getElementById("hud-rest");
const hudBond = document.getElementById("hud-bond");
const hudHeartbeat = document.getElementById("hud-heartbeat");
const hudGpu = document.getElementById("hud-gpu");
const hudGpuLine = document.getElementById("hud-gpu-line");
const hudGpuSpark = document.getElementById("hud-gpu-spark");
const hudListener = document.getElementById("hud-listener");
const hudTruth = document.getElementById("hud-truth");
const hudCare = document.getElementById("hud-care");
const hudCollapse = document.getElementById("hud-collapse");
const firstHintEl = document.getElementById("first-hint");
const firstHintTitle = document.getElementById("first-hint-title");
const firstHintList = document.getElementById("first-hint-lines");
const firstHintOk = document.getElementById("first-hint-ok");
const hudBody = document.getElementById("hud-body");
const hudVolume = /** @type {HTMLInputElement | null} */ (document.getElementById("hud-volume"));
const hudColors = document.getElementById("hud-colors");
const hudVoices = document.getElementById("hud-voices");
const hudVoiceTruth = document.getElementById("hud-voice-truth");
const hudLineText = /** @type {HTMLInputElement | null} */ (document.getElementById("hud-line-text"));
const hudLines = document.getElementById("hud-lines");
const hudAlarmTime = /** @type {HTMLInputElement | null} */ (document.getElementById("hud-alarm-time"));
const hudAlarmOn = document.getElementById("hud-alarm-on");
const hudTimerMins = /** @type {HTMLInputElement | null} */ (document.getElementById("hud-timer-mins"));
const hudTimer = document.getElementById("hud-timer");
const hudTimerLeft = document.getElementById("hud-timer-left");
const hudMutes = document.getElementById("hud-mutes");
const hudSteps = document.getElementById("hud-steps");
const hudMusic = document.getElementById("hud-music");
const hudSleep = document.getElementById("hud-sleep");
const hudHouseMusic = document.getElementById("hud-house-music");
const hudCallBird = document.getElementById("hud-call-bird");
const hudCallPick = /** @type {HTMLSelectElement | null} */ (document.getElementById("hud-call-pick"));
const hudCallQ = /** @type {HTMLInputElement | null} */ (document.getElementById("hud-call-q"));
const hudCallGroup = /** @type {HTMLSelectElement | null} */ (document.getElementById("hud-call-group"));
const hudCallGo = document.getElementById("hud-call-go");
const hudCallTruth = document.getElementById("hud-call-truth");
const hudOff = document.getElementById("hud-off");
const hudOffTruth = document.getElementById("hud-off-truth");
const barHunger = document.getElementById("bar-hunger");
const barMood = document.getElementById("bar-mood");
const barEnergy = document.getElementById("bar-energy");
const barHygiene = document.getElementById("bar-hygiene");
const barBond = document.getElementById("bar-bond");
let houseServer = { show: false };
/** The named server that answered at least once this session; until then the row reads "not running (optional)". */
let houseServerSeenHost = null;
/** What the first-run hello last painted (title and lines), so a repaint does not rebuild it. */
let firstHintPainted = "";
let gpuSample = window.PetGpu ? window.PetGpu.UNREAD : { status: "unread" };
let gpuHistory = window.PetGpu ? window.PetGpu.emptyHistory() : [];
for (let i = 0; i < 12; i++) dustRoot.appendChild(document.createElement("span"));

let roster = [];
let kind = null;
let trait = null;
let life = null;

/**
 * The element under a DOM event that matches `sel`, or null. An event's target is typed EventTarget,
 * so this is the one place that treats it as an element.
 * @param {Event} e
 * @param {string} sel
 * @returns {HTMLElement | null}
 */
function closestTarget(e, sel) {
  const t = /** @type {any} */ (e && e.target);
  return t && typeof t.closest === "function" ? t.closest(sel) : null;
}

const sim = {
  x: 80,
  facing: 1,
  anim: "idle",
  frame: 0,
  acc: 0,
  target: null,
  hop: 0,
  land: 0,
  walkAge: 0,
  dragging: false,
  dragDx: 0,
  pointerStart: null,
  cursorX: null,
  dust: [],
  stepAcc: 0,
  lastOrder: -1,
  order: 0,
  cmd: "wander",
  bob: 0,
  turnHold: 0,
  pendingFacing: null,
  waypoints: [],
  pause: 0,
  settle: 0,
  settleDir: 1,
  overshoot: 0,
  poseHold: 0,
  pendingPose: null,
  shift: 0,
  shiftAge: 0,
  arrivedPending: false,
  act: null,
  actMotion: null,
  actT: 0,
  actHold: 0,
  actWait: 10 + Math.random() * 8,
  actWalk: false,
  play: null,
  playWait: 6 + Math.random() * 5,
  trick: null,
  trickWait: 3 + Math.random() * 3,
  lastTrick: null,
  happy: null,
  lastHappy: null,
  thankYou: false,
};

/** Real window rects from main. /demo draws a plate instead. */
let deskWindows = [];

let speechUntil = 0;
let clickable = false;
let hudUntil = 0;
let mark = null;
let taken = false;
let leaving = false;
let choiceOpen = false;
/** Where keyboard focus was when the choice menu opened; Escape or a keyboard pick puts it back. */
let choiceReturn = null;
let lureTimer = 0;
let card = window.PetCard ? window.PetCard.load() : { collapsed: true, color: "ink", voiceStyle: "hearth", mutes: {}, off: false, pets: {} };
let offArmed = false;
let voicesReady = [];
let liveSky = null;
let liveSkyKey = "";
let weatherFetchGen = 0;
let weatherUnread = false;
let newsItems = [];
let newsUnread = false;
let marketLive = null;
let marketUnread = false;
let marketCoinLives = {};
let nftLive = null;
let nftUnread = false;
let birdFly = null;
let birdAcc = 0;
let birdFrame = 0;
let sipSleepCalled = false;
let robinFly = null;
let robinAcc = 0;
let robinFrame = 0;
let deskPlants = [];
let plantAge = 0;
let plantDrag = null;
let calledPress = null;
let calledDrag = null;
let visitPress = null;
let visitDrag = null;
let choiceTarget = null;
let plantPress = null;
let plantChoiceKey = null;
let deskPlates = [];
let platePress = null;
let plateDrag = null;
let plateSkipToggle = false;
let houseBooted = false;
let autoMeetWait = 4.5;
let musicNode = null;
let streamAsked = false;
/** The keeper card holds keyboard focus (Tab reaches its controls) while it is open. */
let cardKeysOn = false;
/** Plates that join the card's Tab cycle, and the data keys of the card buttons a repaint rebuilds (declared before any paint). */
const KEY_PLATE_IDS = ["weather-plate", "news-plate", "market-plate"];
const REBUILT_KEYS = ["color", "voice", "bus", "step", "sleep", "linePlay", "lineDrop"];
let talkAsked = false;
let pendingTalk = null;
let sleepNode = null;
let lureDrag = null;

function liveOverride() {
  const A = window.PetWeatherAreas;
  if (!A) return null;
  const areas = A.parseAreas(card);
  return A.currentArea(areas) ? liveSky && liveSky.sky : null;
}

function skyOf(now) {
  return window.PetWeather?.weatherOf(now, liveOverride()) ?? "clear";
}

function playWindows() {
  const extra = window.PetDeskHouse && window.PetDeskHouse.weatherRect();
  const list = Array.isArray(deskWindows) ? deskWindows.slice() : [];
  if (extra && extra.width >= 8 && extra.height >= 8) {
    const i = list.findIndex((w) => w.id === extra.id);
    if (i >= 0) list[i] = extra;
    else list.push(extra);
  }
  return list;
}

function musicOn() {
  const M = window.PetHouseMusic;
  if (!M || !card || !card.music) return false;
  const music = M.parseMusic(card.music);
  if (music.plugin === "radio" && music.stationUrl && !streamAsked) return false;
  return !!(music.playing && music.plugin !== "off" && !(window.PetCard && window.PetCard.isMuted(card.mutes, "music")));
}

function cardOpen() {
  return !card.collapsed;
}

function applyThankYou() {
  const G = window.PetGroundTricks;
  const T = G && G.tricksFor ? G.tricksFor(kind && kind.key) : window.PetRuiTricks;
  if (!T?.startThankYou || !kind) return false;
  if (life?.asleep && window.PetLife?.wake) window.PetLife.wake(life);
  const thanks = T.startThankYou(kind.key, sim.lastHappy, sim.x, sim.facing, {
    asleep: false,
    hidden: !!life?.hidden,
    leaving,
    cmd: "idle",
  });
  if (!thanks) {
    sim.thankYou = false;
    return false;
  }
  sim.play = null;
  sim.trick = null;
  sim.happy = thanks.happy;
  sim.lastHappy = thanks.kind;
  sim.thankYou = false;
  return true;
}

function radioArea() {
  const A = window.PetWeatherAreas;
  if (!A) return null;
  return A.currentArea(A.parseAreas(card));
}

function fillRadioHits(list, truth, music, stations) {
  const M = window.PetHouseMusic;
  if (!M || !list || !truth) return;
  list.replaceChildren();
  truth.textContent = "";
  if (!stations.length) {
    truth.textContent = M.RADIO_EMPTY;
    return;
  }
  for (const st of stations) {
    const li = document.createElement("li");
    const pick = document.createElement("button");
    pick.type = "button";
    pick.textContent = st.name;
    pick.dataset.hit = "1";
    pick.dataset.on = music.stationId === st.id ? "1" : "0";
    pick.addEventListener("click", (ev) => {
      ev.stopPropagation();
      streamAsked = true;
      card.music = M.parseMusic({
        plugin: "radio",
        stationId: st.id,
        stationName: st.name,
        stationUrl: st.url,
        playing: true,
      });
      persistCard();
      sitMusic();
    });
    li.appendChild(pick);
    list.appendChild(li);
  }
}

function radioLineInView() {
  const form = document.getElementById("hud-radio-form");
  if (!form || form.hidden) return false;
  const el = document.getElementById("hud-radio-net");
  if (!el || el.hidden) return false;
  const M = window.PetHouseMusic;
  const need = M && M.radioHonesty ? M.radioHonesty() : "";
  if (!need) return false;
  return (el.textContent || "").indexOf(need) !== -1;
}

function lookupRadio(query, list, truth, music) {
  const M = window.PetHouseMusic;
  if (!M) return;
  const net = document.getElementById("hud-radio-net");
  const line = M.radioHonesty ? M.radioHonesty() : "";
  if (net && line) net.textContent = line;
  if (!M.radioMaySend || !M.radioMaySend(radioLineInView())) return;
  const area = radioArea();
  const q = String(query || "");
  const door = window.desk && window.desk.radioSearch;
  const work = door
    ? door(q, area, line).then((res) => {
        const row = fromDesk(res);
        if (row.held) return null;
        return Array.isArray(row.stations) ? row.stations : [];
      })
    : M.readRadioSearch
      ? M.readRadioSearch(line, q, area)
      : Promise.resolve(null);
  work
    .then((stations) => {
      if (stations == null) return;
      fillRadioHits(list, truth, music, stations || []);
    })
    .catch(() => {
      list.replaceChildren();
      truth.textContent = M.RADIO_CANT_REACH;
    });
}

function skyLabel(w) {
  return window.PetWeather?.weatherLabel(w) ?? "Clear";
}

function paintWeather() {
  if (!weatherRoot) return;
  const w = skyOf();
  weatherRoot.className = `weather weather-${w}`;
  weatherRoot.replaceChildren();
  if (w === "rain") {
    for (let i = 0; i < 16; i++) {
      const s = document.createElement("span");
      s.className = "wx-rain";
      s.style.left = `${4 + i * 6}%`;
      s.style.animationDelay = `${(i % 6) * 0.16}s`;
      weatherRoot.appendChild(s);
    }
  }
  if (w === "wind") {
    for (let i = 0; i < 7; i++) {
      const s = document.createElement("span");
      s.className = "wx-gust";
      s.style.top = `${16 + i * 10}%`;
      s.style.animationDelay = `${i * 0.35}s`;
      weatherRoot.appendChild(s);
    }
  }
}

function paintHousePlates() {
  const H = window.PetDeskHouse;
  if (!H) return;
  H.paintWeather(card, liveSky, weatherUnread);
  H.paintNews(newsItems, newsUnread, card);
  if (H.paintMarket) H.paintMarket(card, marketLive, marketUnread, { coinLives: marketCoinLives, nftLive, nftUnread });
}

function forecastLineInView() {
  const body = document.getElementById("weather-body");
  if (!body || body.hidden) return false;
  const A = window.PetWeatherAreas;
  if (!A) return false;
  const areas = A.parseAreas(card);
  return (areas.tab || "current") === "current";
}

function geocodeLineInView(id) {
  if (!forecastLineInView()) return false;
  const el = document.getElementById(id);
  if (!el || el.hidden) return false;
  const A = window.PetWeatherAreas;
  const need = A && A.GEOCODE_NET;
  if (!need) return false;
  return (el.textContent || "").indexOf(need) !== -1;
}

function fetchWeather() {
  const A = window.PetWeatherAreas;
  if (!A) return;
  const gen = ++weatherFetchGen;
  const gate = A.forecastGate(card, card.hereForecastAck);
  const net = document.getElementById("weather-forecast-net");
  if (net && A.forecastHonesty) net.textContent = A.forecastHonesty(gate);
  const key = gate && gate.area ? `${gate.area.id}:${gate.area.lat}:${gate.area.lon}` : "";
  if (!A.forecastMaySend(gate, forecastLineInView())) {
    if (!gate || gate.act !== "send" || liveSkyKey !== key) {
      liveSky = null;
      liveSkyKey = "";
      weatherUnread = false;
    }
    paintHousePlates();
    paintWeather();
    return;
  }
  const line = net ? net.textContent || "" : "";
  const url = A.forecastUrl(gate.area.lat, gate.area.lon);
  if (!url || !A.readForecast || !A.forecastMayLeave(line)) return;
  liveSky = null;
  liveSkyKey = "";
  weatherUnread = false;
  paintHousePlates();
  paintWeather();
  A.readForecast(line, url)
    .then((json) => {
      if (gen !== weatherFetchGen) return;
      if (json == null) {
        liveSky = null;
        liveSkyKey = "";
        weatherUnread = true;
        paintHousePlates();
        paintWeather();
        return;
      }
      liveSky = A.parseForecast(json);
      liveSkyKey = liveSky ? key : "";
      weatherUnread = !liveSky;
      paintHousePlates();
      paintWeather();
    })
    .catch(() => {
      if (gen !== weatherFetchGen) return;
      liveSky = null;
      liveSkyKey = "";
      weatherUnread = true;
      paintHousePlates();
      paintWeather();
    });
}

function plateLineInView(bodyId, lineId, need) {
  const body = document.getElementById(bodyId);
  if (!body || body.hidden) return false;
  const el = document.getElementById(lineId);
  if (!el || el.hidden) return false;
  if (!need) return false;
  return (el.textContent || "").indexOf(need) !== -1;
}

function fromDesk(res) {
  if (res && res.error === "unnamed") return { held: true };
  if (!res || res.ok === false) throw new Error("unread");
  return res;
}

function newsLineInView() {
  const N = window.PetNews;
  if (!N || !N.newsHonesty) return false;
  return plateLineInView("news-body", "news-net", N.newsHonesty(N.parseNewsPrefs(card)));
}

function fetchNews() {
  const N = window.PetNews;
  if (!N) return;
  const prefs = N.parseNewsPrefs(card);
  const topic = N.currentTopic(prefs);
  const tab = prefs.tab || "popular";
  const net = document.getElementById("news-net");
  const line = N.newsHonesty ? N.newsHonesty(prefs) : "";
  if (net) net.textContent = line;
  if (tab === "favorites") {
    newsUnread = false;
    paintHousePlates();
    return;
  }
  if (!N.newsMaySend || !N.newsMaySend(prefs, newsLineInView())) return;
  const door = window.desk && window.desk.newsFeed;
  const legacyDoor = window.desk && window.desk.newsTopic;
  function applyItems(items) {
    if (items && items.length) newsItems = items;
    newsUnread = !items || !items.length;
    paintHousePlates();
  }
  function fail() {
    newsUnread = !newsItems.length;
    paintHousePlates();
  }
  if (tab === "popular") {
    const url = N.popularRssUrl();
    const work = door
      ? door({ kind: "popular", line }).then((res) => {
          const row = fromDesk(res);
          if (row.held) return null;
          return Array.isArray(row.items) ? row.items : [];
        })
      : N.readRss(line, url).then((xml) => (xml == null ? null : N.parseRss(xml)));
    work.then((items) => { if (items == null) return; applyItems(items); }).catch(fail);
    return;
  }
  if (tab === "x") {
    const q = topic && topic.query ? topic.query : "news";
    const url = N.xTopicRssUrl(q);
    const work = door
      ? door({ kind: "x", query: q, line }).then((res) => {
          const row = fromDesk(res);
          if (row.held) return null;
          return Array.isArray(row.items) ? row.items : [];
        })
      : N.readRss(line, url).then((xml) => (xml == null ? null : N.parseRss(xml)));
    work.then((items) => { if (items == null) return; applyItems(items); }).catch(fail);
    return;
  }
  if (topic && topic.id !== N.WORLD_ID && topic.query) {
    const url = N.topicRssUrl(topic.query);
    if (!url) return;
    const work = door
      ? door({ kind: "topic", query: topic.query, line }).then((res) => {
          const row = fromDesk(res);
          if (row.held) return null;
          return Array.isArray(row.items) ? row.items : [];
        })
      : legacyDoor
        ? legacyDoor(topic.query, line).then((res) => {
            const row = fromDesk(res);
            if (row.held) return null;
            return Array.isArray(row.items) ? row.items : [];
          })
        : N.readRss(line, url).then((xml) => (xml == null ? null : N.parseRss(xml)));
    work.then((items) => { if (items == null) return; applyItems(items); }).catch(fail);
    return;
  }
  if (!N.readFeatured) return;
  N.readFeatured(line)
    .then((json) => {
      if (json == null) return;
      applyItems(N.parseNews(json));
    })
    .catch(fail);
}

function fetchMarket() {
  const M = window.PetMarket;
  if (!M) return;
  const house = M.parseMarket(card);
  // Persist seeded defaults once so customize sticks.
  if ((!card.marketTickers || !card.marketTickers.length) && house.tickers.length) {
    Object.assign(card, M.toCardPatch(house));
    persistCard();
  }
  const ticker = M.currentTicker(house);
  const nft = M.currentNft(house);
  if (!ticker && !nft) {
    marketLive = null;
    marketUnread = false;
    marketCoinLives = {};
    nftLive = null;
    nftUnread = false;
    paintHousePlates();
    return;
  }
  const net = document.getElementById("market-net");
  const line = M.quoteHonesty ? M.quoteHonesty(house) : "";
  if (net) net.textContent = line;
  if (!M.quoteMaySend || !M.quoteMaySend(house, plateLineInView("market-body", "market-net", line))) return;
  const door = window.desk && window.desk.marketQuote;
  const searchDoor = window.desk && window.desk.marketSearch;
  const nftDoor = window.desk && window.desk.nftQuote;

  const geckoIds = house.tickers.filter((r) => r.kind === "crypto" && r.geckoId && !r.address).map((r) => r.geckoId);
  const contracts = house.tickers.filter((r) => r.kind === "crypto" && r.address);

  function applyTickerLive(live) {
    if (live) marketLive = live;
    marketUnread = !live;
  }

  const jobs = [];

  if (geckoIds.length) {
    const work = door && window.desk.marketQuotes
      ? window.desk.marketQuotes(geckoIds, line).then((res) => {
          const row = fromDesk(res);
          if (row.held) return null;
          return row.lives || {};
        })
      : M.readGeckoMany(line, geckoIds).then((json) => (json == null ? null : M.parseGeckoMany(json)));
    jobs.push(
      work
        .then((lives) => {
          if (lives == null) return;
          marketCoinLives = { ...marketCoinLives, ...lives };
          if (ticker && ticker.geckoId && lives[ticker.geckoId]) applyTickerLive(lives[ticker.geckoId]);
          else if (ticker && ticker.kind === "crypto" && !ticker.address) marketUnread = true;
        })
        .catch(() => {
          if (ticker && ticker.geckoId) marketUnread = !marketLive;
        }),
    );
  }

  for (const row of contracts) {
    const work = door && window.desk.marketTerminal
      ? window.desk.marketTerminal(row, line).then((res) => {
          const rowRes = fromDesk(res);
          if (rowRes.held) return null;
          return rowRes.live || null;
        })
      : M.readTerminal(line, row.platform || "solana", row.address).then((json) =>
          json == null ? null : M.parseTerminalToken(json),
        );
    jobs.push(
      work
        .then((live) => {
          if (live == null) return;
          const key = row.platform + ":" + row.address;
          marketCoinLives[key] = live;
          marketCoinLives[row.address] = live;
          if (ticker && ticker.id === row.id) applyTickerLive(live);
        })
        .catch(() => {
          if (ticker && ticker.id === row.id) marketUnread = !marketLive;
        }),
    );
  }

  if (ticker && ticker.kind === "stock") {
    const work = door
      ? door(ticker, line).then((res) => {
          const row = fromDesk(res);
          if (row.held) return { held: true };
          return row.live || null;
        })
      : M.readYahoo(line, ticker.symbol).then((json) => {
          if (json == null) return { held: true };
          return M.parseYahoo(json);
        });
    jobs.push(
      work.then((live) => {
        if (live && live.held) return;
        applyTickerLive(live);
      }).catch(() => {
        marketUnread = !marketLive;
      }),
    );
  }

  if (nft) {
    const work = nftDoor
      ? nftDoor(nft, line).then((res) => {
          const row = fromDesk(res);
          if (row.held) return { held: true };
          return row.live || null;
        })
      : M.readNft(line, nft.geckoId).then((json) => {
          if (json == null) return { held: true };
          return M.parseNftLive(json);
        });
    jobs.push(
      work
        .then((live) => {
          if (live && live.held) return;
          if (live) nftLive = live;
          nftUnread = !live;
        })
        .catch(() => {
          nftUnread = !nftLive;
        }),
    );
  }

  Promise.allSettled(jobs).then(() => paintHousePlates());
}


function sitSleepAid() {
  const S = window.PetHouseSleep;
  if (!S) return;
  sleepNode = S.applySleepAid(sleepNode, card.sleepAid, card.mutes, cardGuest().volume / 100);
}

function talkBind() {
  if (!window.PetMind || !kind) return { plugin: "local" };
  return window.PetMind.binding(kind.key) || { plugin: "local" };
}

function paintTalkNet() {
  const el = document.getElementById("hud-talk-net");
  if (!el) return;
  const M = window.PetMind;
  const line = talkAsked && M && M.talkHonesty ? M.talkHonesty(talkBind()) : "";
  el.textContent = line || "";
  el.hidden = !line;
}

function talkLineInView() {
  const el = document.getElementById("hud-talk-net");
  if (!el || el.hidden || !talkAsked) return false;
  const M = window.PetMind;
  const line = M && M.talkHonesty ? M.talkHonesty(talkBind()) : "";
  if (!line) return false;
  return (el.textContent || "").indexOf(line) !== -1;
}

function talkShown() {
  const el = document.getElementById("hud-talk-net");
  if (!el || el.hidden || !talkAsked) return "";
  return el.textContent || "";
}

function flushTalk() {
  if (!pendingTalk) return;
  const M = window.PetMind;
  const bind = talkBind();
  if (M && M.talkMaySend && !M.talkMaySend(bind, talkLineInView())) return;
  const result = pendingTalk;
  pendingTalk = null;
  void askMind(result);
}

/**
 * The stream line the keeper can actually see: the owner's music block when it
 * shows, else the shared House music control. A line inside a hidden block
 * does not count.
 */
function streamLineEl() {
  const own = document.getElementById("hud-stream-net");
  if (own && hudMusic && !hudMusic.hidden) return own;
  const shared = document.getElementById("hud-house-stream-net");
  if (shared && hudHouseMusic && !hudHouseMusic.hidden) return shared;
  return null;
}

/**
 * Small house-wide Pause/Play for every guest whose card has no music block.
 * Hidden where the owner's block shows, so there is never a second control.
 */
function paintHouseMusic() {
  if (!hudHouseMusic) return;
  const M = window.PetHouseMusic;
  const music = M && card ? M.parseMusic(card.music) : null;
  const hint = document.getElementById("hud-house-music-hint");
  if (hint) {
    const line = kind && M && M.sharedMusicHint && music ? M.sharedMusicHint(kind.key, music) : "";
    hint.textContent = line;
    hint.hidden = !line;
  }
  const show = !!(kind && M && M.sharedMusicShows && music && M.sharedMusicShows(kind.key, music));
  hudHouseMusic.hidden = !show;
  if (!show) return;
  const toggle = M.houseMusicToggle(music, streamAsked);
  const btn = document.getElementById("hud-house-music-play");
  if (btn) {
    btn.textContent = toggle.label;
    btn.setAttribute("aria-pressed", toggle.audible ? "true" : "false");
  }
  const net = document.getElementById("hud-house-stream-net");
  if (net) {
    const line = streamAsked && M.streamHonesty ? M.streamHonesty(music) : "";
    net.textContent = line;
    net.hidden = !line;
  }
}

function streamLineInView() {
  const el = streamLineEl();
  if (!el || el.hidden || !streamAsked) return false;
  const M = window.PetHouseMusic;
  const line = M && M.streamHonesty ? M.streamHonesty(M.parseMusic(card.music)) : "";
  if (!line) return false;
  return (el.textContent || "").indexOf(line) !== -1;
}

function streamShown() {
  const el = streamLineEl();
  if (!el || el.hidden || !streamAsked) return "";
  return el.textContent || "";
}

function sitMusic() {
  const M = window.PetHouseMusic;
  const C = window.PetCard;
  if (!M) return;
  const music = M.parseMusic(card.music);
  const src = M.overlayPlaySrc(music);
  const stop = () => {
    if (musicNode) {
      musicNode.pause();
      musicNode.src = "";
      musicNode = null;
    }
  };
  if (!src || (C && C.isMuted(card.mutes, "music"))) {
    stop();
    return;
  }
  const remote = music.plugin === "radio" && /^https?:/i.test(src);
  if (remote) {
    const shown = streamShown();
    if (!M.streamMaySend || !M.streamMaySend(music, streamLineInView())) {
      stop();
      return;
    }
    if (musicNode && musicNode.dataset.src === src) {
      musicNode.volume = cardGuest().volume / 100;
      return;
    }
    if (musicNode) {
      musicNode.pause();
      musicNode.src = "";
    }
    const opened = M.openStationStream
      ? M.openStationStream(shown, music, src, (next) => new Audio(next))
      : null;
    if (!opened) {
      stop();
      return;
    }
    musicNode = opened;
    musicNode.dataset.src = src;
    musicNode.loop = false;
    musicNode.volume = cardGuest().volume / 100;
    void musicNode.play().catch(() => {
      /* honest: stream may not land */
    });
    return;
  }
  if (musicNode && musicNode.dataset.src === src) {
    musicNode.volume = cardGuest().volume / 100;
    return;
  }
  if (musicNode) {
    musicNode.pause();
    musicNode.src = "";
  }
  musicNode = new Audio(src);
  musicNode.dataset.src = src;
  musicNode.loop = card.music.plugin === "house";
  musicNode.volume = cardGuest().volume / 100;
  void musicNode.play().catch(() => {
    /* honest: stream may not land */
  });
}

function ruiSleepBout() {
  if (!kind || kind.key !== "red_panda") return false;
  if (life && life.hidden) return false;
  if (sim.trick && sim.trick.kind === "lie" && sim.trick.phase === "lie") return true;
  if (sim.anim === "sleep") return true;
  if (life && life.asleep) return true;
  return false;
}

function callRobin() {
  const R = window.PetRobinFly;
  if (!R || !robinEl) return;
  if (kind && kind.key === R.ROBIN_KEY) {
    robinFly = null;
    robinEl.classList.remove("show");
    return;
  }
  if (life && life.hidden) return;
  robinFly = R.beginRobinFly(window.innerWidth, window.innerHeight, true);
  robinAcc = 0;
  robinFrame = 0;
  const sprites = pack(R.ROBIN_KEY);
  const src = R.destSrc(robinFly, sprites);
  R.applyDest(robinEl);
  if (src) paintActor(robinEl, src, "brick");
  robinEl.classList.add("show");
}

function tickRobin(dt) {
  const R = window.PetRobinFly;
  if (!R || !robinEl) return;
  if (kind && kind.key === R.ROBIN_KEY) {
    robinFly = null;
    robinEl.classList.remove("show");
    return;
  }
  if (!robinFly) return;
  robinFly = R.stepRobinFly(robinFly, dt, window.innerWidth, window.innerHeight, {
    hidden: !!(life && life.hidden),
    hostKey: kind && kind.key,
    hostSleeping: ruiSleepBout(),
    hostX: sim.x,
    hostLift: sim.play ? sim.play.lift : sim.happy ? sim.happy.lift : sim.trick ? sim.trick.lift : 0,
    hostFacing: sim.facing,
  });
  if (!R.stillVisible(robinFly)) {
    robinFly = null;
    robinEl.classList.remove("show");
    return;
  }
  if (R.shouldSing(robinFly)) {
    say(R.ROBIN_SONG);
    robinFly = R.markSung(robinFly);
  }
  robinAcc += dt;
  const sprites = pack(R.ROBIN_KEY);
  if (robinAcc > 1 / 8) {
    robinAcc = 0;
    robinFrame = (robinFrame + 1) % 4;
  }
  robinFly.frame = robinFrame;
  const src = R.destSrc(robinFly, sprites);
  R.applyDest(robinEl);
  if (src) paintActor(robinEl, src, "brick");
  robinEl.classList.add("show");
  robinEl.style.transform = `translate3d(${robinFly.x}px, ${-robinFly.lift}px, 0) rotate(${robinFly.rot}deg) scale(${robinFly.facing}, ${robinFly.flap || 1})`;
}

function sitPlants() {
  const P = window.PetDeskPlants;
  if (!P || !plantsRoot) return;
  deskPlants = P.loadPlants(window.innerWidth, window.innerHeight);
  paintPlants();
}

function paintPlants() {
  const P = window.PetDeskPlants;
  if (!P || !plantsRoot) return;
  const windOn = skyOf() === "wind";
  const kids = Array.from(plantsRoot.querySelectorAll("[data-plant]"));
  const keep = Object.create(null);
  for (const plant of deskPlants) keep[plant.key] = plant;
  for (const el of kids) {
    const key = el.dataset && el.dataset.plant;
    if (!key || !keep[key]) el.remove();
  }
  for (const plant of deskPlants) {
    let node = kids.find((el) => el.dataset && el.dataset.plant === plant.key);
    if (!node) {
      node = document.createElement("canvas");
      node.className = "desk-plant";
      node.setAttribute("role", "img");
      node.setAttribute("aria-label", plant.name);
      node.dataset.hit = "1";
      node.dataset.plant = plant.key;
      node.dataset.surface = "pending";
      node.addEventListener("pointerdown", (e) => {
        if (e.button === 2) return;
        e.stopPropagation();
        node.setPointerCapture(e.pointerId);
        deskPlants = P.selectOnly(deskPlants, plant.key);
        plantPress = { key: plant.key, x: e.clientX, y: e.clientY };
        plantDrag = null;
        paintPlants();
      });
      plantsRoot.appendChild(node);
    }
    const src = P.plantSrc(plant.key, pack(plant.key));
    P.applyDest(node);
    if (src) paintActor(node, src, "plant");
    node.dataset.on = plant.selected ? "1" : "0";
    const lean = P.windLean(plantAge, windOn, plant.selected, plant.mode);
    node.style.transform = P.paintTransform(plant, lean);
  }
}

function plateEl(key) {
  if (key === "weather") return weatherPlate;
  if (key === "news") return newsPlate;
  if (key === "market") return marketPlate;
  return document.querySelector('[data-desk-plate="' + key + '"]');
}

function sitPlates() {
  const P = window.PetDeskPlates;
  if (!P) return;
  deskPlates = P.loadPlates(window.innerWidth, window.innerHeight);
  paintPlates();
}

function fillPlateColorUi(plate) {
  const P = window.PetDeskPlates;
  if (!P || !plate) return;
  const root = document.querySelector('[data-plate-colors="' + plate.key + '"]');
  if (!root) return;
  for (const input of root.querySelectorAll("[data-plate-color]")) {
    const which = input.getAttribute("data-plate-color");
    if (which === "bg") input.value = plate.bg;
    if (which === "fg") input.value = plate.fg;
    if (which === "muted") input.value = plate.muted;
  }
  const sw = root.querySelector('[data-plate-swatches="' + plate.key + '"]');
  if (sw && !sw.dataset.ready) {
    sw.dataset.ready = "1";
    for (const row of P.SWATCHES) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.hit = "1";
      btn.dataset.plateSwatch = row.id;
      btn.dataset.plateKey = plate.key;
      btn.title = row.name;
      btn.setAttribute("aria-label", row.name);
      btn.style.background = row.bg;
      sw.appendChild(btn);
    }
  }
}

function paintPlates() {
  const P = window.PetDeskPlates;
  if (!P) return;
  for (const plate of deskPlates) {
    const el = plateEl(plate.key);
    if (el) P.applyPaint(el, plate);
    fillPlateColorUi(plate);
  }
}

function persistPlateColors(key, patch) {
  const P = window.PetDeskPlates;
  if (!P || !key) return;
  deskPlates = P.savePlates(deskPlates.map((p) => (p.key === key ? P.setColors(p, patch) : p)));
  paintPlates();
}

function persistPlateSwatch(key, swatchId) {
  const P = window.PetDeskPlates;
  if (!P || !key) return;
  deskPlates = P.savePlates(deskPlates.map((p) => (p.key === key ? P.applySwatch(p, swatchId) : p)));
  paintPlates();
}
function tickPlants(dt) {
  const P = window.PetDeskPlants;
  if (!P || !plantsRoot) return;
  plantAge += Math.max(0, dt);
  if (!deskPlants.length) sitPlants();
  paintPlants();
}

function callSip() {
  const F = window.PetBirdFly;
  const H = window.PetDeskHouse;
  if (H) H.playVoice("hummingbird", card);
  if (!F || !birdEl) return;
  if (kind && kind.key === F.FLY_BIRD_KEY) {
    birdFly = null;
    birdEl.classList.remove("show");
    return;
  }
  if (life && life.hidden) return;
  birdFly = F.beginFly(window.innerWidth, window.innerHeight, true);
  birdAcc = 0;
  birdFrame = 0;
  birdEl.classList.add("show");
  const sprites = pack(F.FLY_BIRD_KEY);
  paintActor(birdEl, (sprites.play && sprites.play[0]) || sprites.idle[0], "sip");
  birdFly = F.markCalled(birdFly);
}

function collapseKeeperCard() {
  if (card.collapsed) return;
  card.collapsed = true;
  persistCard();
  paintHud();
}

function openKeeperCard() {
  if (!card.collapsed) return;
  card.collapsed = false;
  persistCard();
  paintHud();
  sim.target = null;
  sim.waypoints = [];
  sim.pause = 0;
  sim.turnHold = 0;
  sim.pendingFacing = null;
  if (sim.play && window.PetWindowPlay) {
    const work = { width: window.innerWidth, height: window.innerHeight, floorLift: 0 };
    sim.play = window.PetWindowPlay.stepPlay(
      sim.play,
      0,
      { x: sim.x, lift: sim.play.lift },
      playWindows(),
      work,
      BASE,
      { asleep: !!life?.asleep, hidden: !!life?.hidden, leaving, cmd: sim.cmd, card: true },
    );
    if (!sim.play || sim.play.phase === "done") sim.play = null;
  }
  if (sim.trick) {
    const T = (window.PetGroundTricks && window.PetGroundTricks.tricksFor)
      ? window.PetGroundTricks.tricksFor(kind && kind.key)
      : (kind && kind.key === (window.PetRuiTricks && window.PetRuiTricks.TRICK_KEY) ? window.PetRuiTricks : null);
    if (T && T.stepTrick) {
      sim.trick = T.stepTrick(sim.trick, 0, {
        asleep: !!life?.asleep,
        hidden: !!life?.hidden,
        leaving,
        cmd: sim.cmd,
        windowPlay: false,
        card: true,
      });
    }
    if (!sim.trick || sim.trick.phase === "done") sim.trick = null;
  }
  if (sim.anim === "walk" && !life?.asleep) sim.anim = "idle";
}

function callGuestsFromCard() {
  const G = window.PetCallGuests;
  if (!G) return;
  const typed = hudCallQ ? hudCallQ.value : "";
  const pick = hudCallPick && hudCallPick.value && hudCallPick.value !== typed ? hudCallPick.value : "";
  const groupId = hudCallGroup && hudCallGroup.value ? hudCallGroup.value : "";
  const query = typed || pick;
  const keys = G.callKeys(query, roster, groupId || null);
  if (hudCallTruth) hudCallTruth.textContent = keys.length ? "" : G.CALL_EMPTY;
  if (!keys.length) return;
  spawnCalled(keys);
}

function spawnCalled(keys) {
  const G = window.PetCallGuests;
  if (!G) return;
  const host = kind && kind.key;
  if (G.shouldFly(keys, host)) callSip();
  if (G.shouldRobinFly && G.shouldRobinFly(keys, host)) callRobin();
  const walkers = G.walkersOf(keys, host);
  const width = window.innerWidth;
  for (let i = 0; i < walkers.length; i++) {
    const key = walkers[i];
    if (called.some((c) => c.key === key && G.stillVisible(c))) continue;
    const row = roster.find((r) => r.key === key);
    if (!row) continue;
    called.push({ ...G.beginCalled(key, width, i, walkers.length), sprites: pack(key), name: row.name, frame: 0, acc: 0 });
  }
  paintCalled();
}

function calledFlags() {
  const G = window.PetCallGuests;
  const work = { width: window.innerWidth, height: window.innerHeight, floorLift: 0 };
  const bound = G && G.firstWindowBound ? G.firstWindowBound(playWindows(), work) : null;
  const cap = G && G.firstCapBound ? G.firstCapBound(playWindows(), work) : null;
  const transom = G && G.firstTransomBound ? G.firstTransomBound(playWindows(), work) : null;
  return {
    hidden: !!(life && life.hidden),
    hostKey: kind && kind.key,
    hostSleeping: ruiSleepBout(),
    hostX: sim.x,
    hostLift: sim.play ? sim.play.lift : sim.happy ? sim.happy.lift : sim.trick ? sim.trick.lift : 0,
    hostFacing: sim.facing,
    peers: called.map((c) => ({ key: c.key, x: c.x, lift: c.lift || 0, phase: c.phase })).concat(
      window.PetRobinFly && window.PetRobinFly.asPeer(robinFly) ? [window.PetRobinFly.asPeer(robinFly)] : [],
    ),
    windowBound: bound,
    capBound: cap,
    transomBound: transom,
    grassBound: window.PetDeskPlants && window.PetDeskPlants.firstGrassBound ? window.PetDeskPlants.firstGrassBound(deskPlants, work) : null,
  };
}

function paintCalled() {
  const G = window.PetCallGuests;
  if (!G || !calledRoot || !G.syncCalledPaint) return;
  G.syncCalledPaint(calledRoot, called, {
    frameOf: (g) => {
      const sprites = g.sprites || pack(g.key);
      return (G.poseFrames && G.poseFrames(g, sprites)) || (g.phase === "perch" || g.phase === "approach-perch" ? (sprites.sit && sprites.sit.length ? sprites.sit : sprites.idle) : sprites.walk || sprites.idle);
    },
    onPress: (g, e, img) => {
      if (e && e.button === 2) return;
      if (img && img.setPointerCapture && e && e.pointerId != null) {
        try { img.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
      }
      calledPress = { key: g.key, x: e.clientX, y: e.clientY, startX: g.x };
      calledDrag = null;
      closeChoice();
      setClickable(true);
    },
  });
}

function tickCalled(dt) {
  const G = window.PetCallGuests;
  if (!G || !calledRoot) return;
  const width = window.innerWidth;
  const flags = calledFlags();
  called = called.filter((g) => {
    const next = G.stepCalled(g, dt, width, flags);
    Object.assign(g, next);
    if (!G.stillVisible(g)) return false;
    g.acc = (g.acc || 0) + dt;
    const moving = Math.abs(g.target - g.x) > 2 && g.phase !== "perch" && g.phase !== "meet" && g.phase !== "bound";
    if (moving && g.acc > 1 / 6.4) {
      g.acc = 0;
      const sprites = g.sprites || pack(g.key);
      const frames = (G.poseFrames && G.poseFrames(g, sprites)) || sprites.walk || sprites.idle || [];
      g.frame = ((g.frame || 0) + 1) % Math.max(1, frames.length);
    }
    if (G.shouldSing && G.shouldSing(g)) {
      say(G.ROBIN_SONG);
      Object.assign(g, G.markSung(g));
    }
    if (G.shouldTell && G.shouldTell(g)) {
      const line = G.tellLine ? G.tellLine(g) : "";
      if (line) say(line);
      Object.assign(g, G.markTold(g));
    }
    return true;
  });
  paintCalled();
}

function tickBird(dt) {
  const F = window.PetBirdFly;
  if (!F || !birdEl) return;
  if (kind && kind.key === F.FLY_BIRD_KEY) {
    birdFly = null;
    birdEl.classList.remove("show");
    return;
  }
  const ruiSleep = ruiSleepBout();
  if (ruiSleep && !sipSleepCalled) {
    sipSleepCalled = true;
    if (!birdFly) callSip();
  }
  if (!ruiSleep) sipSleepCalled = false;
  if (!birdFly) return;
  birdFly = F.stepFly(birdFly, dt, window.innerWidth, window.innerHeight, {
    hidden: !!(life && life.hidden),
    hostKey: kind && kind.key,
    hostSleeping: ruiSleep,
    hostX: sim.x,
    hostLift: sim.play ? sim.play.lift : sim.happy ? sim.happy.lift : sim.trick ? sim.trick.lift : 0,
    hostFacing: sim.facing,
  });
  if (!F.stillVisible(birdFly)) {
    birdFly = null;
    birdEl.classList.remove("show");
    return;
  }
  if (F.shouldCall(birdFly)) {
    window.PetDeskHouse && window.PetDeskHouse.playVoice(F.FLY_BIRD_KEY, card);
    birdFly = F.markCalled(birdFly);
  }
  birdAcc += dt;
  const sprites = pack(F.FLY_BIRD_KEY);
  const frames = sprites.play && sprites.play.length ? sprites.play : sprites.idle;
  if (birdAcc > 1 / 8) {
    birdAcc = 0;
    birdFrame = (birdFrame + 1) % frames.length;
    paintActor(birdEl, frames[birdFrame], "sip");
  }
  birdEl.classList.add("show");
  birdEl.style.transform = `translate3d(${birdFly.x}px, ${-birdFly.lift}px, 0) rotate(${birdFly.rot}deg) scale(${birdFly.facing}, 1)`;
}

function paintLure() {
  if (!lureEl || !mark || mark.kind !== "lure") return;
  const R = window.PetRibbon;
  let x = mark.x;
  if (R && mark.carried) x = R.carryX(mark, sim.x, sim.facing);
  mark.x = x;
  lureEl.style.left = `${x}px`;
  lureEl.style.transform = "";
  lureEl.classList.toggle("carried", !!mark.carried);
}

function stealDeskRibbon() {
  const R = window.PetRibbon;
  if (!R || !mark || mark.kind !== "lure") return;
  const next = R.stealRibbon(mark, sim.x);
  mark = { ...mark, ...next, kind: "lure" };
  taken = true;
  window.clearTimeout(lureTimer);
  lureEl.classList.add("show");
  paintLure();
}

function persist() {
  if (kind && life) window.PetLife.save(kind.key, life);
}

// The main process probes the server the keeper named (house-server.cjs). No server named: the row stays hidden.
function readHouseServer() {
  if (!window.desk || typeof window.desk.houseServer !== "function") return;
  window.desk
    .houseServer()
    .then((state) => {
      houseServer = state && state.show === true ? state : { show: false };
      if (houseServer.show && houseServer.reachable === true) houseServerSeenHost = houseServer.host || "";
      paintHud();
    })
    .catch(() => {
      houseServer = { show: false };
      paintHud();
    });
}

if (hudCare) {
  hudCare.addEventListener("click", (e) => {
    const btn = closestTarget(e, "[data-care]");
    if (!btn) return;
    e.stopPropagation();
    const id = btn.getAttribute("data-care");
    if (id) handle(id);
  });
}
if (hudCollapse) {
  hudCollapse.addEventListener("click", (e) => {
    e.stopPropagation();
    card.collapsed = !card.collapsed;
    persistCard();
  });
}
if (hud) {
  hud.addEventListener("click", (e) => {
    const hit = closestTarget(e, "[data-care], [data-card], [data-first-hint], input, button, label");
    if (hit) return;
    if (card.collapsed) return;
    card.collapsed = true;
    persistCard();
  });
}
if (hudVolume) {
  hudVolume.addEventListener("input", (e) => {
    e.stopPropagation();
    if (!kind || !window.PetCard) return;
    card = window.PetCard.setGuest(card, kind.key, { volume: Number(hudVolume.value) });
    persistCard();
  });
}
if (hudLineText) {
  document.querySelectorAll("[data-card='save-say'], [data-card='save-do']").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!kind || !window.PetCard) return;
      const kindLine = btn.getAttribute("data-card") === "save-do" ? "do" : "say";
      card = window.PetCard.addLine(card, kind.key, hudLineText.value, kindLine);
      hudLineText.value = "";
      persistCard();
    });
  });
}
if (hudAlarmTime) {
  hudAlarmTime.addEventListener("change", (e) => {
    e.stopPropagation();
    if (!kind || !window.PetCard) return;
    const [h, m] = String(hudAlarmTime.value || "07:00").split(":");
    const guest = cardGuest();
    guest.alarm.hour = Number(h);
    guest.alarm.minute = Number(m);
    card = window.PetCard.setGuest(card, kind.key, guest);
    persistCard();
  });
}
if (hudAlarmOn) {
  hudAlarmOn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!kind || !window.PetCard) return;
    const guest = cardGuest();
    guest.alarm.on = !guest.alarm.on;
    card = window.PetCard.setGuest(card, kind.key, guest);
    persistCard();
  });
}
if (hudTimer) {
  hudTimer.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!kind || !window.PetCard) return;
    const guest = cardGuest();
    if (guest.timer.running) guest.timer = window.PetCard.stopTimer(guest.timer);
    else {
      const mins = Math.max(1, Number(hudTimerMins && hudTimerMins.value) || 5);
      guest.timer = window.PetCard.startTimer(guest.timer, mins * 60_000);
    }
    card = window.PetCard.setGuest(card, kind.key, guest);
    persistCard();
  });
}
if (hudOff) {
  hudOff.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!offArmed) {
      offArmed = true;
      paintCard();
      return;
    }
    if (window.desk && window.desk.quit) window.desk.quit();
    else window.close();
  });
}
if ("speechSynthesis" in window) {
  const refreshVoices = () => {
    voicesReady = window.speechSynthesis.getVoices() || [];
  };
  refreshVoices();
  window.speechSynthesis.addEventListener("voiceschanged", refreshVoices);
}
// A hidden overlay skips the house-server read; showing it again reads at once.
setInterval(() => {
  if (!document.hidden) readHouseServer();
}, 15_000);
readHouseServer();
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) readHouseServer();
});
if (window.desk && window.desk.onGpu && window.PetGpu) {
  window.desk.onGpu((raw) => {
    const now = Date.now();
    gpuSample = window.PetGpu.present(window.PetGpu.parseSample(raw), now);
    gpuHistory = window.PetGpu.remember(gpuHistory, gpuSample, now);
    paintHud();
  });
}
setInterval(() => {
  if (document.hidden || !window.PetGpu || !hudGpu) return;
  const now = Date.now();
  const next = window.PetGpu.present(gpuSample, now);
  const history = window.PetGpu.remember(gpuHistory, next, now);
  const spark = window.PetGpu.sparkline(history, next, now);
  const mark = spark.empty ? "empty" : "trail";
  const prev = hudGpuSpark ? hudGpuSpark.getAttribute("data-spark") : "";
  const changed = !gpuSample || next.status !== gpuSample.status || history.length !== gpuHistory.length || mark !== prev;
  gpuSample = next;
  gpuHistory = history;
  if (changed) paintHud();
}, 5000);

function cardGuest() {
  const C = window.PetCard;
  if (!C || !kind) return { volume: 80, lines: [], alarm: C ? C.blankAlarm() : null, timer: C ? C.blankTimer() : null };
  return C.guestOf(card, kind.key);
}

function persistCard() {
  const C = window.PetCard;
  if (!C) return;
  card = C.save(card);
  paintCard();
}

function speakText(text) {
  const C = window.PetCard;
  if (!text || !("speechSynthesis" in window)) return;
  if (C && C.isMuted(card.mutes, "chirp")) return;
  window.speechSynthesis.cancel();
  const guest = cardGuest();
  const opts = C ? C.speakOpts(card.voiceStyle, guest.volume) : { rate: 0.86, pitch: 0.9, volume: 0.8 };
  const u = new SpeechSynthesisUtterance(text);
  u.rate = opts.rate;
  u.pitch = opts.pitch;
  u.volume = opts.volume;
  const picked = C ? C.pickSystemVoice(voicesReady.length ? voicesReady : window.speechSynthesis.getVoices(), card.voiceStyle) : null;
  if (picked) u.voice = picked;
  window.speechSynthesis.speak(u);
}

function say(text, hold = 4200) {
  if (!text) return;
  bubbleText.textContent = text;
  bubble.classList.add("open");
  speechUntil = performance.now() + hold;
  const C = window.PetCard;
  if (kind && C && C.prefersHouseCry && C.prefersHouseCry(kind.key) && window.PetDeskHouse) {
    const played = window.PetDeskHouse.playVoice(kind.key, card, () => speakText(text));
    if (!played) speakText(text);
  } else {
    speakText(text);
  }
  hudUntil = performance.now() + hold;
}

function playHouseLine(line) {
  if (!line) return;
  if (line.kind === "do") {
    const verb = line.text.trim().toLowerCase();
    if (verb === "sit" || verb === "wander" || verb === "sleep" || verb === "idle") issue(verb);
    else if (verb === "talk" || verb === "feed" || verb === "play" || verb === "rest") handle(verb);
    else {
      say(line.text);
      issue("talk");
    }
    return;
  }
  say(line.text);
  issue("talk");
}

function issue(cmd) {
  sim.order += 1;
  sim.cmd = cmd;
}

function lineFrom(result) {
  if (result.line) return result.line;
  if (!kind || !result.useRoster) return null;
  const pack = kind.lines;
  if (result.useRoster === "hungry") return pick(pack.hungry);
  if (result.useRoster === "tired") return pick(pack.tired);
  if (result.useRoster === "feed") return pick(pack.feed);
  if (result.useRoster === "play") return pick(pack.play);
  if (result.useRoster === "rest") return pick(pack.rest);
  return pick(pack.ambient);
}

function paintHud() {
  if (!life || !kind) return;
  const K = window.PetKeeper;
  const meters = K ? K.meters(life) : { hunger: life.hunger, rest: life.energy, bond: life.bond, bondTitle: "New" };
  hudName.textContent = kind.name;
  paintFirstHint();
  if (hudStage) hudStage.textContent = life.stage;
  if (hudBondTitle) hudBondTitle.textContent = meters.bondTitle;
  const hive = window.PetHive && window.PetHive.isHivePlace(kind.key) ? window.PetHive.colonyOf(life, life.hidden) : null;
  const vital = hive
    ? `${window.PetHive.colonyWord(hive)} · Brood · ${hive.brood} · Stores · ${hive.stores}`
    : `${window.PetLife.vitals({ ...life, blue: window.PetLife.isBlue(life, kind.key) }, kind.key)} · ${skyLabel(skyOf())}${life.gifts?.length ? ` · ${life.gifts.length} gift${life.gifts.length > 1 ? "s" : ""}` : ""}`;
  hudVital.textContent = vital;
  if (hudHunger) hudHunger.textContent = String(meters.hunger);
  if (hudRest) hudRest.textContent = String(meters.rest);
  if (hudBond) hudBond.textContent = String(meters.bond);
  if (hudHeartbeat && K) {
    const seen = houseServerSeenHost != null && houseServerSeenHost === (houseServer.host || "");
    const serverLine = K.houseServerLine({ ...houseServer, seen });
    hudHeartbeat.hidden = !serverLine;
    hudHeartbeat.textContent = serverLine;
    hudHeartbeat.title = K.houseServerTitle(houseServer);
    hudHeartbeat.setAttribute("data-heartbeat", K.houseServerTone({ ...houseServer, seen }));
  }
  if (hudGpu && window.PetGpu) {
    const now = Date.now();
    gpuSample = window.PetGpu.present(gpuSample, now);
    gpuHistory = window.PetGpu.remember(gpuHistory, gpuSample, now);
    const line = window.PetGpu.gpuLine(gpuSample);
    if (hudGpuLine) hudGpuLine.textContent = line;
    else hudGpu.textContent = line;
    hudGpu.setAttribute("data-gpu", gpuSample.status || "unread");
    const spark = window.PetGpu.sparkline(gpuHistory, gpuSample, now);
    if (hudGpuSpark) {
      hudGpuSpark.setAttribute("data-spark", spark.empty ? "empty" : "trail");
      hudGpuSpark.replaceChildren();
      if (!spark.empty && spark.path) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", `0 0 ${window.PetGpu.SPARK_W} ${window.PetGpu.SPARK_H}`);
        svg.setAttribute("width", String(window.PetGpu.SPARK_W));
        svg.setAttribute("height", String(window.PetGpu.SPARK_H));
        svg.setAttribute("aria-hidden", "true");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", spark.path);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", spark.ink);
        path.setAttribute("stroke-width", "1");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");
        svg.appendChild(path);
        hudGpuSpark.appendChild(svg);
      }
    }
  }
  if (hudListener && window.PetListener) {
    const binding = window.PetMind && kind ? window.PetMind.binding(kind.key) : { plugin: "local" };
    const key = binding && typeof binding.apiKey === "string" ? binding.apiKey.trim() : "";
    const heard = window.PetListener.nameListener({
      door: "overlay",
      plugin: binding && binding.plugin,
      baseUrl: binding && binding.baseUrl,
      hasKey: key.length > 0,
    });
    hudListener.textContent = heard.line;
    hudListener.setAttribute("data-listener", heard.id);
  }
  if (hudTruth && K) hudTruth.textContent = K.careTruth();
  pet.classList.toggle("dull", !!(hive && hive.quiet));
  barHunger.style.setProperty("--w", `${life.hunger}%`);
  if (barMood) barMood.style.setProperty("--w", `${life.mood}%`);
  barEnergy.style.setProperty("--w", `${life.energy}%`);
  if (barHygiene) barHygiene.style.setProperty("--w", `${life.hygiene}%`);
  if (barBond) barBond.style.setProperty("--w", `${life.bond}%`);
  if (card.collapsed) hud.classList.remove("show");
  else hud.classList.add("show");
  paintCard();
  window.desk?.vitals({
    key: kind.key,
    name: kind.name,
    vital: window.PetLife.vitals(life, kind.key),
    hunger: life.hunger,
    sick: life.sick,
    hidden: life.hidden,
    mess: life.mess.length,
    stage: life.stage,
    bond: life.bond,
    verb: window.PetSpecial?.verbFor(kind.key) || "Special",
  });
}

/**
 * The one-time hello at the top of the keeper card (keeper.js firstHint). It is a labelled region with a
 * Got it button inside the card's Tab cycle; Got it saves firstHintSeen to card.json and it never returns.
 */
function paintFirstHint() {
  const K = window.PetKeeper;
  if (!firstHintEl || !K || !K.firstHint) return;
  const shows = K.firstHintShows(card);
  firstHintEl.hidden = !shows;
  if (!shows) {
    firstHintPainted = "";
    return;
  }
  const hint = K.firstHint(kind ? kind.name : "");
  const sig = [hint.title, ...hint.lines].join("|");
  if (sig === firstHintPainted) return;
  firstHintPainted = sig;
  if (firstHintTitle) firstHintTitle.textContent = hint.title;
  if (firstHintList) {
    firstHintList.replaceChildren(
      ...hint.lines.map((text) => {
        const li = document.createElement("li");
        li.textContent = text;
        return li;
      }),
    );
  }
  if (firstHintOk) firstHintOk.textContent = hint.ok;
}
if (firstHintOk) {
  firstHintOk.addEventListener("click", (e) => {
    e.stopPropagation();
    const hadFocus = document.activeElement === firstHintOk;
    card.firstHintSeen = true;
    persistCard();
    // The button is gone now; keyboard focus lands on the card's name button instead of nowhere.
    if (hadFocus && hudCollapse) hudCollapse.focus();
  });
}

function paintCard() {
  const C = window.PetCard;
  const K = window.PetKeeper;
  if (!hud || !C) return;
  const refocus = rebuiltFocus();
  const guest = cardGuest();
  hud.dataset.color = card.color || "ink";
  hud.dataset.collapsed = card.collapsed ? "1" : "0";
  hud.dataset.expanded = card.collapsed ? "0" : "1";
  if (card.collapsed) hud.removeAttribute("data-hit");
  else hud.dataset.hit = "1";
  if (card.collapsed) cardKeys(false);
  paintHouseMusic();
  if (hudCollapse) hudCollapse.setAttribute("aria-expanded", card.collapsed ? "false" : "true");
  paintFirstHint();
  if (hudVolume) hudVolume.value = String(guest.volume);
  if (hudVoiceTruth) hudVoiceTruth.textContent = (K && K.VOICE_TRUTH) || C.VOICE_TRUTH;
  if (hudOffTruth) hudOffTruth.textContent = (K && K.QUIT_TRUTH) || C.QUIT_TRUTH;
  if (hudOff) hudOff.textContent = offArmed ? "Off" : "Turn off";
  if (hudAlarmTime) {
    hudAlarmTime.value = `${String(guest.alarm.hour).padStart(2, "0")}:${String(guest.alarm.minute).padStart(2, "0")}`;
  }
  if (hudAlarmOn) {
    hudAlarmOn.textContent = guest.alarm.on ? "On" : "Off";
    hudAlarmOn.dataset.on = guest.alarm.on ? "1" : "0";
    hudAlarmOn.setAttribute("aria-label", guest.alarm.on ? "Alarm on" : "Alarm off");
    hudAlarmOn.setAttribute("aria-pressed", guest.alarm.on ? "true" : "false");
  }
  if (hudTimerMins && !guest.timer.running) hudTimerMins.value = String(Math.max(1, Math.round(guest.timer.durationMs / 60000)));
  if (hudTimer) hudTimer.textContent = guest.timer.running ? "Stop" : "Start";
  if (hudTimerLeft) hudTimerLeft.textContent = C.formatRemain(guest.timer.remainingMs);
  if (hudColors) {
    hudColors.replaceChildren();
    for (const color of C.COLORS) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = color.name;
      btn.dataset.hit = "1";
      btn.dataset.color = color.id;
      btn.dataset.on = card.color === color.id ? "1" : "0";
      btn.setAttribute("aria-pressed", card.color === color.id ? "true" : "false");
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        card.color = color.id;
        persistCard();
      });
      hudColors.appendChild(btn);
    }
  }
  if (hudVoices) {
    hudVoices.replaceChildren();
    for (const style of C.VOICE_STYLES) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = style.name;
      btn.dataset.hit = "1";
      btn.dataset.voice = style.id;
      btn.dataset.on = card.voiceStyle === style.id ? "1" : "0";
      btn.setAttribute("aria-pressed", card.voiceStyle === style.id ? "true" : "false");
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        card.voiceStyle = style.id;
        persistCard();
      });
      hudVoices.appendChild(btn);
    }
  }
  if (hudMutes) {
    hudMutes.replaceChildren();
    for (const bus of C.MUTE_BUSES) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = card.mutes[bus] ? `Muted ${bus}` : `Mute ${bus}`;
      btn.dataset.hit = "1";
      btn.dataset.bus = bus;
      btn.dataset.on = card.mutes[bus] ? "1" : "0";
      btn.setAttribute("aria-pressed", card.mutes[bus] ? "true" : "false");
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        card.mutes = { ...card.mutes, [bus]: !card.mutes[bus] };
        persistCard();
      });
      hudMutes.appendChild(btn);
    }
  }
  if (hudSteps && window.PetHouseSounds) {
    const S = window.PetHouseSounds;
    hudSteps.replaceChildren();
    const title = document.createElement("p");
    title.textContent = "Footsteps";
    hudSteps.appendChild(title);
    for (const step of S.STEP_KINDS) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = S.STEP_LABELS[step];
      btn.dataset.hit = "1";
      btn.dataset.step = step;
      btn.dataset.on = card.stepKind === step ? "1" : "0";
      btn.setAttribute("aria-pressed", card.stepKind === step ? "true" : "false");
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        card.stepKind = step;
        persistCard();
        if (step !== "mute") window.PetDeskHouse && window.PetDeskHouse.playStep(kind && kind.key, card);
      });
      hudSteps.appendChild(btn);
    }
    const truth = document.createElement("p");
    truth.className = "keeper-truth";
    truth.textContent = `Now ${S.STEP_LABELS[S.stepOf(card.stepKind, cardGuest().stepKind, kind && kind.key)]}. House-wide.`;
    hudSteps.appendChild(truth);
  }
  if (hudMusic && window.PetHouseMusic && kind && kind.key === "red_panda") {
    const M = window.PetHouseMusic;
    const music = M.parseMusic(card.music);
    hudMusic.hidden = false;
    const title = document.getElementById("hud-music-title");
    if (title) title.textContent = "Music · Rui";
    const plugins = document.getElementById("hud-music-plugins");
    if (plugins) {
      plugins.replaceChildren();
      for (const plugin of M.MUSIC_PLUGINS) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = plugin.name;
        btn.dataset.hit = "1";
        btn.dataset.on = music.plugin === plugin.id ? "1" : "0";
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const next = M.parseMusic({ ...music, plugin: plugin.id, playing: plugin.id !== "off" });
          if (next.plugin === "radio" && next.playing && next.stationUrl) streamAsked = true;
          card.music = next;
          persistCard();
          sitMusic();
        });
        plugins.appendChild(btn);
      }
    }
    const play = document.getElementById("hud-music-play");
    const remoteStream = music.plugin === "radio" && !!music.stationUrl;
    const audible = !!(music.playing && music.plugin !== "off" && (!remoteStream || streamAsked));
    if (play) {
      play.hidden = music.plugin === "off";
      play.textContent = audible ? "Pause" : "Play";
    }
    const streamEl = document.getElementById("hud-stream-net");
    if (streamEl) {
      const line = streamAsked && M.streamHonesty ? M.streamHonesty(music) : "";
      streamEl.textContent = line;
      streamEl.hidden = !line;
    }
    const license = document.getElementById("hud-music-license");
    if (license) {
      license.hidden = music.plugin !== "house";
      license.textContent = music.plugin === "house" ? M.HOUSE_LOOP_LICENSE : "";
    }
    const form = document.getElementById("hud-radio-form");
    const local = document.getElementById("hud-radio-local");
    if (form) form.hidden = music.plugin !== "radio";
    if (local) local.hidden = music.plugin !== "radio" || !radioArea();
    const now = document.getElementById("hud-music-now");
    if (now) now.textContent = music.plugin === "radio" && music.stationName ? `Now ${music.stationName}. No now-playing inventing.` : "";
  } else if (hudMusic) {
    hudMusic.hidden = true;
  }
  paintHouseMusic();
  if (hudSleep && window.PetHouseSleep) {
    const S = window.PetHouseSleep;
    const aid = S.parseSleepAid(card.sleepAid);
    hudSleep.replaceChildren();
    const title = document.createElement("p");
    title.textContent = S.SLEEP_AID_LABEL;
    hudSleep.appendChild(title);
    for (const plugin of S.SLEEP_AID_PLUGINS) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = plugin.name;
      btn.dataset.hit = "1";
      btn.dataset.sleep = plugin.id;
      btn.dataset.on = aid.plugin === plugin.id ? "1" : "0";
      btn.setAttribute("aria-pressed", aid.plugin === plugin.id ? "true" : "false");
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        card.sleepAid = S.parseSleepAid({ plugin: plugin.id, playing: plugin.id !== "off" });
        persistCard();
        sitSleepAid();
      });
      hudSleep.appendChild(btn);
    }
    if (aid.plugin === "rain") {
      const license = document.createElement("p");
      license.className = "keeper-truth";
      license.textContent = S.SLEEP_AID_LICENSE;
      hudSleep.appendChild(license);
    }
    const mute = document.createElement("p");
    mute.className = "keeper-truth";
    mute.textContent = S.SLEEP_AID_MUTE_TRUTH;
    hudSleep.appendChild(mute);
  }
  paintTalkNet();
  flushTalk();
  sitMusic();
  sitSleepAid();
  if (hudLines) {
    hudLines.replaceChildren();
    for (const line of guest.lines) {
      const li = document.createElement("li");
      const span = document.createElement("span");
      span.textContent = `${line.kind === "do" ? "Do" : "Say"} · ${line.text}`;
      const play = document.createElement("button");
      play.type = "button";
      play.textContent = "Play";
      play.dataset.hit = "1";
      play.dataset.linePlay = line.id;
      play.setAttribute("aria-label", `Play: ${line.text}`);
      play.addEventListener("click", (e) => {
        e.stopPropagation();
        playHouseLine(line);
      });
      const drop = document.createElement("button");
      drop.type = "button";
      drop.textContent = "Drop";
      drop.dataset.hit = "1";
      drop.dataset.lineDrop = line.id;
      drop.setAttribute("aria-label", `Drop: ${line.text}`);
      drop.addEventListener("click", (e) => {
        e.stopPropagation();
        card = C.removeLine(card, kind.key, line.id);
        persistCard();
      });
      li.append(span, play, drop);
      hudLines.appendChild(li);
    }
  }
  fillCallLists();
  refocusRebuilt(refocus);
}

function fillCallLists() {
  const G = window.PetCallGuests;
  if (!G || !roster.length) return;
  if (hudCallPick && !callFilled) {
    hudCallPick.replaceChildren();
    const blank = document.createElement("option");
    blank.value = "";
    blank.textContent = "Pick a guest";
    hudCallPick.appendChild(blank);
    const rows = roster
      .slice()
      .sort((a, b) => String(a.name).localeCompare(String(b.name)));
    for (const row of rows) {
      const opt = document.createElement("option");
      opt.value = row.name;
      opt.textContent = `${row.name} · ${row.speciesLabel || row.key}`;
      hudCallPick.appendChild(opt);
    }
  }
  if (hudCallGroup && hudCallGroup.options.length <= 1) {
    hudCallGroup.replaceChildren();
    const blank = document.createElement("option");
    blank.value = "";
    blank.textContent = "Pick a den";
    hudCallGroup.appendChild(blank);
    for (const group of G.groups()) {
      const opt = document.createElement("option");
      opt.value = group.id;
      opt.textContent = group.label;
      hudCallGroup.appendChild(opt);
    }
  }
  callFilled = true;
}

function paintMess() {
  if (!life) return;
  const width = window.innerWidth;
  messRoot.replaceChildren();
  for (const m of life.mess) {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "mess-dot";
    el.dataset.hit = "1";
    el.title = "Clean mess";
    el.setAttribute("aria-label", "Clean mess");
    el.style.transform = `translate3d(${m.x * (width - 40)}px, 0, 0) rotate(-8deg)`;
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      life.mess = life.mess.filter((x) => x.id !== m.id);
      life.hygiene = Math.min(100, life.hygiene + 10);
      persist();
      paintMess();
      paintHud();
    });
    messRoot.appendChild(el);
  }
  paintGifts();
}

function paintGifts() {
  if (!life || !giftRoot) return;
  const width = window.innerWidth;
  giftRoot.replaceChildren();
  for (const g of life.gifts || []) {
    const el = document.createElement("button");
    el.type = "button";
    const shed = g.kind === "shed";
    el.className = shed ? "shed-dot" : "gift-dot";
    el.dataset.hit = "1";
    el.title = shed ? "Pick up shed" : "Pick up gift";
    el.setAttribute("aria-label", shed ? "Pick up shed" : "Pick up gift");
    el.style.transform = `translate3d(${g.x * (width - 40)}px, 0, 0) rotate(${shed ? 8 : -12}deg)`;
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      window.PetLife.pickGift(life, g.id);
      persist();
      say(window.PetLife.giftLine(kind.key));
      paintGifts();
      paintHud();
    });
    giftRoot.appendChild(el);
  }
}

function maybeNotify() {
  if (!life || !kind) return;
  const alert = window.PetLife.alerts(life, kind.name);
  if (!alert) return;
  life.lastNotify = Date.now();
  persist();
  window.desk?.notify({
    title: alert.title,
    body: alert.body,
    key: kind.key,
    need: alert.need || "",
  });
}

function tickLife() {
  if (!life || !trait) return;
  const { grew } = window.PetLife.decay(life, trait, Date.now(), kind.key);
  if (grew) {
    say(life.stage === "grown" ? "I grew into the room." : "I have been here a long while.");
    window.desk?.notify(kind.name, life.stage === "grown" ? `${kind.name} grew up.` : `${kind.name} is an elder now.`);
  }
  persist();
  paintHud();
  paintMess();
  maybeNotify();
}

function playSound(kindName) {
  try {
    const C = window.PetCard;
    if (C && C.isMuted(card.mutes, kindName)) return;
    if (kindName === "step") {
      if (window.PetDeskHouse) window.PetDeskHouse.playStep(kind && kind.key, card);
      return;
    }
    if ((kindName === "chirp" || kindName === "voice" || kindName === "call") && kind && window.PetHouseSounds && window.PetHouseSounds.isVoiceKey(kind.key)) {
      const prefers = C && C.prefersHouseCry && C.prefersHouseCry(kind.key);
      // House-cry guests: say() owns cry + TTS backup. Skip anim chirp so debounce cannot eat the talk line.
      if (prefers && kindName === "chirp") return;
      if (window.PetDeskHouse) window.PetDeskHouse.playVoice(kind.key, card);
      return;
    }
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return;
    const ac = playSound.ctx || (playSound.ctx = new Ctor());
    void ac.resume();
    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    const vol = (cardGuest().volume / 100) * (kindName === "rain" || kindName === "wind" ? 0.018 : 0.03);
    const j = 0.92 + Math.random() * 0.16;
    if (kindName === "rain") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(220 * j, now);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.09);
      return;
    }
    if (kindName === "wind") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(180 * j, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.22);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
      osc.start(now);
      osc.stop(now + 0.26);
      return;
    }
    osc.type = kindName === "munch" ? "square" : "sine";
    osc.frequency.setValueAtTime((kindName === "step" ? 140 : kindName === "hop" ? 320 : 480) * j, now);
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.12);
  } catch {
    /* ignore */
  }
}

function puff(x, n = 4) {
  for (let i = 0; i < n; i++) {
    sim.dust.push({
      x: x + 60 + (Math.random() - 0.5) * 36,
      y: 8,
      vx: (Math.random() - 0.5) * 36,
      vy: -12 - Math.random() * 22,
      life: 0.45 + Math.random() * 0.25,
      size: 3 + Math.random() * 4,
    });
  }
  if (sim.dust.length > 18) sim.dust.splice(0, sim.dust.length - 18);
}

const TREAT_SHAPE = {
  red_panda: "bamboo",
  cat: "crumb",
  dog: "crumb",
  rabbit: "leaf",
  hamster: "seed",
  guinea_pig: "leaf",
  turtle: "leaf",
  goldfish: "flake",
  budgie: "seed",
  fox: "crumb",
  penguin: "pebble",
  parrot: "seed",
  ferret: "crumb",
  hedgehog: "crumb",
  chinchilla: "seed",
  axolotl: "flake",
  toucan: "leaf",
  iguana: "leaf",
  dragon: "ember",
  phoenix: "ember",
  ball_python: "crumb",
  corn_snake: "crumb",
  kingsnake: "egg",
  green_tree_python: "ember",
  hognose: "crumb",
  garter: "flake",
  boa: "crumb",
  milk_snake: "egg",
  rosy_boa: "crumb",
  carpet_python: "crumb",
  octopus: "crumb",
  cuttlefish: "crumb",
  nautilus: "crumb",
  moon_jelly: "flake",
  sea_star: "pebble",
  hermit_crab: "crumb",
  horseshoe_crab: "flake",
  seahorse: "flake",
  manta: "flake",
  moray: "crumb",
  moss: "flake",
  maidenhair: "flake",
  ginkgo: "leaf",
  oak: "leaf",
  water_lily: "flake",
  orchid: "flake",
  saguaro: "pebble",
  venus_flytrap: "crumb",
  pitcher: "crumb",
  sundew: "crumb",
  honeybee: "flake",
  monarch: "leaf",
  luna: "flake",
  firefly: "crumb",
  darner: "crumb",
  stick: "leaf",
  carpenter_ant: "flake",
  ladybird: "crumb",
  mantis: "crumb",
  cicada: "flake",
  oyster: "leaf",
  fly_agaric: "flake",
  morel: "flake",
  chanterelle: "flake",
  turkey_tail: "leaf",
  lions_mane: "leaf",
  puffball: "flake",
  chicken_of_woods: "leaf",
  yeast: "crumb",
  lichen: "flake",
  photovore: "flake",
  choir: "flake",
  nimbus: "flake",
  silica: "pebble",
  terminator: "ember",
  nexus: "crumb",
  halovore: "flake",
  magneton: "pebble",
  umbral: "flake",
  cyst: "crumb",
  frog: "crumb",
  toad: "crumb",
  newt: "flake",
  salamander: "flake",
  caecilian: "flake",
  crayfish: "crumb",
  pond_snail: "flake",
  mussel: "flake",
  leech: "flake",
  stickleback: "flake",
  paramecium: "flake",
  amoeba: "crumb",
  euglena: "flake",
  volvox: "flake",
  diatom: "pebble",
  kelp: "flake",
  chlamydomonas: "flake",
  stentor: "flake",
  coli: "crumb",
  haloarchaea: "flake",
  crow: "crumb",
  raven: "crumb",
  barn_owl: "crumb",
  red_tail: "crumb",
  chickadee: "seed",
  robin: "flake",
  mallard: "seed",
  canada_goose: "leaf",
  pileated: "crumb",
  hummingbird: "flake",
  orb_weaver: "crumb",
  jumping_spider: "crumb",
  wolf_spider: "crumb",
  tarantula: "crumb",
  widow: "crumb",
  harvestman: "crumb",
  scorpion: "crumb",
  vinegaroon: "crumb",
  tick: "flake",
  solifuge: "crumb",
  deer: "leaf",
  bat: "crumb",
  squirrel: "seed",
  otter: "crumb",
  raccoon: "crumb",
  skunk: "crumb",
  opossum: "crumb",
  beaver: "leaf",
  capybara: "leaf",
  porcupine: "leaf",
  black_bear: "leaf",
  gecko: "crumb",
  anole: "crumb",
  skink: "crumb",
  chameleon: "crumb",
  horned_lizard: "crumb",
  alligator: "crumb",
  crocodile: "crumb",
  snapper: "crumb",
  box_turtle: "crumb",
  tuatara: "crumb",
  bass: "flake",
  brook_trout: "flake",
  catfish: "crumb",
  bluegill: "flake",
  perch: "flake",
  pike: "crumb",
  walleye: "flake",
  paddlefish: "flake",
  lamprey: "pebble",
  american_eel: "crumb",
  house_centipede: "crumb",
  millipede: "leaf",
  pillbug: "leaf",
  earthworm: "leaf",
  velvet_worm: "crumb",
  springtail: "flake",
  tardigrade: "flake",
  planarian: "crumb",
  nematode: "flake",
  amphipod: "crumb",
  bumblebee: "flake",
  carpenter_bee: "flake",
  mason_bee: "flake",
  leafcutter: "flake",
  stingless: "flake",
  sweat_bee: "flake",
  mining_bee: "flake",
  honey_drone: "flake",
  honey_queen: "flake",
  honeycomb: "flake",
  fiddler_crab: "flake",
  ghost_crab: "crumb",
  limpet: "flake",
  barnacle: "flake",
  chiton: "flake",
  periwinkle: "flake",
  sand_dollar: "flake",
  sea_urchin: "leaf",
  knobbed_whelk: "crumb",
  lugworm: "pebble",
  field_cricket: "flake",
  katydid: "leaf",
  grasshopper: "leaf",
  swallowtail: "flake",
  jewelwing: "crumb",
  lacewing: "crumb",
  earwig: "crumb",
  acorn_weevil: "crumb",
  click_beetle: "crumb",
  robber_fly: "crumb",
  sloth: "leaf",
  lemur: "leaf",
  gibbon: "leaf",
  kinkajou: "flake",
  colugo: "leaf",
  flying_squirrel: "seed",
  howler: "leaf",
  tarsier: "crumb",
  potto: "flake",
  koala: "leaf",
  brain_coral: "flake",
  anemone: "flake",
  clownfish: "flake",
  parrotfish: "flake",
  cleaner_shrimp: "crumb",
  sea_cucumber: "pebble",
  lionfish: "crumb",
  giant_clam: "flake",
  eagle_ray: "crumb",
  grouper: "crumb",
  cyber_dragon: "flake",
  volt_dragon: "flake",
  trace_dragon: "flake",
  flux_dragon: "flake",
  spark_dragon: "flake",
  ion_dragon: "flake",
  gauss_dragon: "flake",
  relay_dragon: "flake",
  fuse_dragon: "flake",
  ground_dragon: "flake",
};

function placeMark(kindName, x, hops = 0, meal) {
  taken = false;
  mark = { kind: kindName, x, hops, meal: kindName === "treat" ? meal || "snack" : undefined };
  const el = kindName === "treat" ? treatEl : lureEl;
  const other = kindName === "treat" ? lureEl : treatEl;
  other.classList.remove("show");
  el.classList.add("show");
  if (kindName === "lure") {
    mark = window.PetRibbon ? { ...window.PetRibbon.blankRibbon(x), kind: "lure" } : { kind: "lure", x, hops };
    lureEl.style.left = `${x}px`;
    lureEl.style.transform = "";
    lureEl.classList.remove("carried");
  } else {
    el.style.transform = `translate3d(${x}px, 0, 0)`;
  }
  if (kindName === "treat") treatEl.dataset.shape = TREAT_SHAPE[kind?.key] || "crumb";
  window.clearTimeout(lureTimer);
  if (kindName === "lure" && hops === 0 && !(mark && mark.stolen)) {
    lureTimer = window.setTimeout(() => {
      if (!mark || mark.kind !== "lure" || mark.hops > 0) return;
      const width = window.innerWidth;
      placeMark("lure", 80 + Math.random() * Math.max(80, width - 200), 1);
      issue("seek");
    }, 2200);
  }
}

function clearMark() {
  mark = null;
  window.clearTimeout(lureTimer);
  treatEl.classList.remove("show");
  lureEl.classList.remove("show");
}

function applyCommand() {
  if (sim.dragging || !trait) return;
  if (life?.hidden && sim.cmd !== "enter") {
    sim.anim = "sit";
    sim.target = null;
    return;
  }
  if ((sim.cmd === "wander" || sim.cmd === "seek" || sim.cmd === "eat" || sim.cmd === "play" || sim.cmd === "talk" || sim.happy || sim.thankYou) && life?.asleep && window.PetLife?.wake) {
    window.PetLife.wake(life);
  }
  if (sim.happy && (sim.cmd === "wander" || sim.cmd === "idle")) {
    sim.lastOrder = sim.order;
    return;
  }
  // A wander or idle order does not cut off a meal or a pending thank-you. (The old test also asked about
  // "seek" and "eat" orders, but those can never be true once the order is wander or idle; tsc caught it.)
  if ((sim.anim === "eat" || sim.thankYou) && (sim.cmd === "wander" || sim.cmd === "idle")) {
    if (sim.thankYou && sim.anim !== "eat") {
      applyThankYou();
    }
    sim.lastOrder = sim.order;
    return;
  }
  if (window.PetLife?.sleepHolds(life, sim.cmd) || (life?.asleep && window.PetCard?.sleepHolds(true, sim.cmd))) {
    sim.anim = "sleep";
    sim.target = null;
    sim.waypoints = [];
    sim.pendingPose = null;
    sim.poseHold = 0;
    sim.pause = 0;
    if (sim.play && window.PetWindowPlay) {
      sim.play = window.PetWindowPlay.stepPlay(
        sim.play,
        0,
        { x: sim.x, lift: sim.play.lift },
      playWindows(),
      { width: window.innerWidth, height: window.innerHeight, floorLift: 0 },
      BASE,
      { asleep: true, hidden: !!life.hidden, leaving, cmd: "sleep", card: cardOpen() },
      );
    }
    return;
  }
  if (cardOpen() && (sim.cmd === "wander" || sim.cmd === "idle")) {
    sim.anim = life?.asleep ? "sleep" : "idle";
    sim.target = null;
    sim.waypoints = [];
    sim.pause = 0;
    sim.lastOrder = sim.order;
    return;
  }
  if (sim.play && (sim.cmd === "wander" || sim.cmd === "idle")) {
    sim.lastOrder = sim.order;
    return;
  }
  if (sim.order === sim.lastOrder || sim.cmd === "none") return;
  if (sim.act && (sim.cmd === "wander" || sim.cmd === "idle")) {
    sim.lastOrder = sim.order;
    return;
  }
  sim.lastOrder = sim.order;
  clearAct();
  if (sim.play && window.PetWindowPlay?.shouldAbort({
    asleep: !!life?.asleep,
    hidden: !!life?.hidden,
    leaving,
    cmd: sim.cmd,
    card: false,
  })) {
    sim.play = window.PetWindowPlay.stepPlay(
      sim.play,
      0,
      { x: sim.x, lift: sim.play.lift },
      playWindows(),
      { width: window.innerWidth, height: window.innerHeight, floorLift: 0 },
      BASE,
      { asleep: !!life?.asleep, hidden: !!life?.hidden, leaving, cmd: sim.cmd, card: false },
    );
  }
  const width = window.innerWidth;
  const max = Math.max(PAD, width - BASE - PAD);
  sim.poseHold = 0;
  sim.pendingPose = null;
  if (sim.cmd === "wander") {
    if (trait.wander < 0.1 && Math.random() > trait.wander * 8) {
      sim.anim = "sit";
      sim.target = null;
      return;
    }
    const p = gaitProfile();
    let next = PAD + Math.random() * Math.max(48, max - PAD);
    if (trait.clingy && sim.cursorX != null) next = clamp(sim.cursorX - BASE / 2, PAD, max);
    if (Math.abs(next - sim.x) < 50) next = clamp(sim.x + sim.facing * 120, PAD, max);
    sim.waypoints = [];
    const twoBeat = Math.random() < (p.low || p.crawl ? 0.7 : 0.42);
    if (twoBeat) {
      let second = PAD + Math.random() * Math.max(48, max - PAD);
      if (Math.abs(second - next) < 40) second = clamp(next + sim.facing * 80, PAD, max);
      sim.waypoints = [second];
    }
    aimAt(next);
    return;
  }
  if (sim.cmd === "seek" && mark && !mark.carried) {
    leaving = false;
    sim.waypoints = [];
    aimAt(clamp(mark.x - BASE * 0.4, PAD, max));
    return;
  }
  if (sim.cmd === "leave") {
    leaving = true;
    sim.waypoints = [];
    aimAt(window.PetGait.hideTuck(sim.x, width, BASE, PAD));
    return;
  }
  if (sim.cmd === "enter") {
    leaving = false;
    sim.waypoints = [];
    sim.x = window.PetGait.enterSpawn(width, BASE, PAD);
    aimAt(window.PetGait.enterSit(width, BASE, PAD));
    return;
  }
  if (sim.cmd === "play") {
    sim.hop = 1;
    sim.anim = "play";
    sim.target = null;
    sim.waypoints = [];
    sim.turnHold = 0;
    sim.pendingFacing = null;
    sim.frame = 0;
    sim.acc = 0;
    playSound("hop");
    return;
  }
  if (["eat", "talk", "idle", "sit", "sleep"].includes(sim.cmd)) {
    sim.target = null;
    sim.waypoints = [];
    sim.turnHold = 0;
    sim.pendingFacing = null;
    sim.frame = 0;
    sim.acc = 0;
    if (sim.cmd === "sleep") {
      sim.anim = "sleep";
      const hold = (window.PetGroundTricks?.sleepHoldFrame?.(kind.key, kind.sprites.sleep.length) ?? window.PetRuiTricks?.sleepHoldFrame?.(kind.key, kind.sprites.sleep.length));
      if (hold != null) sim.frame = hold;
    } else if (sim.cmd === "sit") {
      sim.poseHold = window.PetGait.POSE_HOLD_S;
      sim.pendingPose = sim.cmd;
      sim.anim = "idle";
    } else {
      sim.anim = sim.cmd;
    }
    if (sim.cmd === "eat") playSound("munch");
    if (sim.cmd === "talk") playSound("chirp");
  }
}

/** After Escape or a keyboard pick: focus goes back where it was, else to the open card's name. */
function returnChoiceFocus() {
  const back = choiceReturn;
  choiceReturn = null;
  if (back && back.isConnected && typeof back.focus === "function" && !(back.closest && back.closest("[hidden]"))) {
    back.focus();
    return;
  }
  if (!card.collapsed && hudCollapse) hudCollapse.focus();
}

if (choiceEl) {
  choiceEl.addEventListener("keydown", (e) => {
    const P = window.PetChoice;
    if (!choiceOpen || !P || !P.menuKey) return;
    const items = [...choiceEl.querySelectorAll('[role="menuitem"]')];
    const act = P.menuKey(e.key, items.indexOf(document.activeElement), items.length);
    // Escape is the document's dismiss key (below): it closes the menu and brings focus back.
    if (act == null || act === "close") return;
    e.preventDefault();
    items.forEach((btn, i) => {
      btn.tabIndex = i === act ? 0 : -1;
    });
    if (items[act]) items[act].focus();
  });
}

function closeChoice() {
  choiceOpen = false;
  choiceTarget = null;
  if (!choiceEl) return;
  choiceEl.classList.remove("show");
  choiceEl.replaceChildren();
}

function closePlantChoice() {
  plantChoiceKey = null;
  if (!plantChoiceEl) return;
  plantChoiceEl.classList.remove("show");
  plantChoiceEl.replaceChildren();
}

function openPlantChoice(key) {
  const P = window.PetDeskPlants;
  if (!P || !plantChoiceEl || !key) return;
  closeChoice();
  plantChoiceKey = key;
  const plant = deskPlants.find((p) => p.key === key);
  plantChoiceEl.replaceChildren();
  for (const mark of P.plantChoiceMarks()) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = mark.label;
    btn.dataset.hit = "1";
    btn.dataset.plantMode = mark.id;
    if (plant && plant.mode === mark.id) btn.dataset.on = "1";
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      deskPlants = P.savePlants(deskPlants.map((p) => (p.key === key ? P.setMode(p, mark.id) : p)));
      closePlantChoice();
      paintPlants();
    });
    plantChoiceEl.appendChild(btn);
  }
  if (plant) plantChoiceEl.style.transform = `translate3d(${plant.x}px, ${plant.y - 12}px, 0)`;
  plantChoiceEl.classList.add("show");
  setClickable(true);
}

﻿function choiceAnchorX(target) {
  if (!target || target.role === "host") return sim.x;
  if (target.role === "visit" && visit) return visit.x;
  if (target.role === "called" && target.key) {
    const g = called.find((c) => c.key === target.key);
    if (g) return g.x;
  }
  return sim.x;
}

function openChoice(target) {
  if (!choiceEl || !window.PetChoice || !kind) return;
  const next = target || { role: "host" };
  if (choiceOpen && choiceTarget && choiceTarget.role === next.role && choiceTarget.key === next.key) {
    closeChoice();
    return;
  }
  choiceTarget = next;
  const had = document.activeElement;
  choiceReturn = had && had !== document.body && !choiceEl.contains(had) ? had : null;
  const guest = next.role === "called" ? called.find((c) => c.key === next.key) : null;
  const walking =
    next.role === "host"
      ? sim.cmd === "wander" || sim.cmd === "seek" || sim.cmd === "play" || sim.cmd === "enter"
      : next.role === "visit"
        ? !!(visit && !visit.placed && visit.phase !== "talk")
        : !!(guest && (guest.phase === "wander" || guest.phase === "in") && !guest.placed);
  const marks = window.PetChoice.guestMarks({
    role: next.role === "host" ? undefined : next.role,
    hidden: !!(life && life.hidden),
    leaving,
    walking,
    gifts: (life && life.gifts && life.gifts.length) || 0,
    treatVerb: "Treat",
    specialVerb: window.PetSpecial?.verbFor(kind.key) || "Special",
  });
  choiceEl.replaceChildren();
  // A real menu, like the web sit menu: menuitem buttons, one Tab stop, arrows / Home / End walk it.
  marks.forEach((mark, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = mark.label;
    btn.dataset.hit = "1";
    btn.setAttribute("role", "menuitem");
    btn.tabIndex = i === 0 ? 0 : -1;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const keys = e.detail === 0;
      pickChoice(mark.id);
      if (keys) returnChoiceFocus();
    });
    choiceEl.appendChild(btn);
  });
  choiceEl.style.transform = `translate3d(${choiceAnchorX(next)}px, 0, 0)`;
  choiceEl.classList.add("show");
  choiceOpen = true;
  setClickable(true);
}

function pickGuestChoice(id) {
  const role = choiceTarget && choiceTarget.role;
  const key = choiceTarget && choiceTarget.key;
  closeChoice();
  if (id === "close") return;
  if (id === "exit") {
    collapseKeeperCard();
    return;
  }
  if (role === "visit") {
    if (!visit) return;
    if (id === "talk") {
      const law = visitLaw();
      if (law) say(law.visitLine(visit.key));
      visit.said = true;
      visit.tapped = true;
      return;
    }
    if (id === "treat" || id === "play") {
      say(id === "play" ? "A quick game. Then the desk again." : "A treat for the road.");
      visit.tapped = true;
      return;
    }
    if (id === "walk") {
      visit.placed = false;
      visit.tapped = false;
      visit.target = Math.max(80, window.innerWidth * (visit.x < window.innerWidth * 0.5 ? 0.72 : 0.28));
      return;
    }
    if (id === "sit") {
      visit.placed = true;
      visit.tapped = true;
      visit.target = visit.x;
      return;
    }
    if (id === "send") {
      endVisit();
      return;
    }
    return;
  }
  if (role === "called") {
    const G = window.PetCallGuests;
    const g = called.find((c) => c.key === key);
    if (!g || !G) return;
    if (id === "talk") {
      const line = (G.tellLine && G.tellLine(g)) || (g.name ? `${g.name} nods.` : "A nod.");
      say(line);
      return;
    }
    if (id === "treat" || id === "play") {
      say(id === "play" ? "A quick chase across the wood." : "Shared crumbs. Fair.");
      return;
    }
    if (id === "walk") {
      const w = window.innerWidth;
      const dest = 48 + Math.random() * Math.max(80, w - 200);
      Object.assign(g, { placed: false, phase: "wander", t: 0, target: dest, facing: dest >= g.x ? 1 : -1, lift: 0 });
      paintCalled();
      return;
    }
    if (id === "sit") {
      Object.assign(g, G.placeCalled(g, g.x, window.innerWidth));
      paintCalled();
      return;
    }
    if (id === "send") {
      Object.assign(g, G.dismissCalled(g));
      paintCalled();
      return;
    }
  }
}

function pickChoice(id) {
  if (choiceTarget && (choiceTarget.role === "called" || choiceTarget.role === "visit")) {
    pickGuestChoice(id);
    return;
  }
  const picked = window.PetChoice?.guestPick(id);
  closeChoice();
  if (!picked) return;
  // Close: dismiss menu only. Exit: leave pet care (collapse keeper card).
  if (picked === "close") return;
  if (picked === "exit") {
    collapseKeeperCard();
    return;
  }
  if (picked === "feed") handle("feed");
  else if (picked === "rest") handle("rest");
  else if (picked === "walk") {
    if (window.PetLife?.wake) window.PetLife.wake(life);
    issue("wander");
  }
  else if (picked === "sit") issue("sit");
  else if (picked === "talk") handle("talk");
  else if (picked === "treat") handle("snack");
  else if (picked === "play") handle("play");
  else if (picked === "special") handle("special");
  else if (picked === "hide") handle("hide");
  else if (picked === "call") handle("call");
  else if (picked === "pick") {
    const gift = life && life.gifts && life.gifts[0];
    if (!gift || !kind) return;
    window.PetLife.pickGift(life, gift.id);
    persist();
    say(window.PetLife.giftLine(kind.key));
    paintGifts();
    paintHud();
  }
}

/**
 * A keeper-clock notification was clicked: main has shown the overlay. The guest that rang comes back
 * and its saved line sits in the bubble again (words only; the ring already played). Care stays closed.
 */
function showClockNote(payload) {
  const key = payload && payload.key ? String(payload.key) : "";
  if (key && kind && key !== kind.key && roster.some((r) => r.key === key)) switchTo(key);
  const line = payload && typeof payload.line === "string" ? payload.line.trim() : "";
  if (!line) return;
  bubbleText.textContent = line;
  bubble.classList.add("open");
  speechUntil = performance.now() + 6000;
}

﻿function openCareFromNotify(payload) {
  const key = payload && payload.key ? String(payload.key) : "";
  const need = payload && payload.need ? String(payload.need) : "";
  if (key && kind && key !== kind.key && roster.some((r) => r.key === key)) {
    switchTo(key);
  }
  openKeeperCard();
  paintHud();
  const careId = window.PetLife && window.PetLife.careForNeed ? window.PetLife.careForNeed(need) : null;
  if (hudCare) {
    hudCare.querySelectorAll("[data-need-focus]").forEach((el) => el.removeAttribute("data-need-focus"));
    if (careId) {
      const btn = hudCare.querySelector(`[data-care="${careId}"]`);
      if (btn) {
        btn.setAttribute("data-need-focus", "1");
        if (btn.focus) btn.focus();
        try { btn.scrollIntoView({ block: "nearest", inline: "nearest" }); } catch (_) { /* ignore */ }
      }
      try { hudCare.scrollIntoView({ block: "nearest" }); } catch (_) { /* ignore */ }
    }
  }
  if (careId) handle(careId);
}

function handle(cmd) {
  if (!life || !trait || !kind) return;
  tickLife();
  if (cmd === "play") {
    if (life.hidden) return;
    if (window.PetLife?.wake) window.PetLife.wake(life);
    const width = window.innerWidth;
    placeMark("lure", 80 + Math.random() * Math.max(80, width - 200));
    say(trait.special === "bug" ? "There. A bug." : (window.PetRibbon && window.PetRibbon.RIBBON_CATCH) || "A ribbon. Catch it.");
    issue("seek");
    hudUntil = performance.now() + 5000;
    return;
  }
  if (cmd === "snack" || cmd === "feed") {
    if (life.hidden) return;
    if (window.PetLife?.wake) window.PetLife.wake(life);
    const width = window.innerWidth;
    placeMark("treat", 80 + Math.random() * Math.max(80, width - 200), 0, cmd === "feed" ? "feed" : "snack");
    issue("seek");
    hudUntil = performance.now() + 4000;
    return;
  }
  if (cmd === "hide") {
    if (life.hidden) return;
    if (window.PetLife?.wake) window.PetLife.wake(life);
    say(pick(trait.extra.hide || ["I went where the ribbon goes."]));
    leaving = true;
    issue("leave");
    hudUntil = performance.now() + 5000;
    return;
  }
  if (cmd === "special" && window.PetRibbon && window.PetRibbon.isRibbonSpecial(trait.special)) {
    if (life.hidden) return;
    if (window.PetLife?.wake) window.PetLife.wake(life);
    const width = window.innerWidth;
    placeMark("lure", 80 + Math.random() * Math.max(80, width - 200));
    say(window.PetRibbon.RIBBON_SPECIAL);
    issue("seek");
    hudUntil = performance.now() + 5000;
    return;
  }
  const result = window.PetLife.act(life, trait, cmd, Date.now(), kind.key);
  persist();
  if (cmd === "talk") {
    const M = window.PetMind;
    const bind = M && kind ? M.binding(kind.key) : { plugin: "local" };
    const cloud = M && M.talkHonesty ? M.talkHonesty(bind) : "";
    if (!cloud) {
      void askMind(result);
      return;
    }
    talkAsked = true;
    pendingTalk = result;
    paintHud();
    return;
  }
  if (cmd === "call") {
    leaving = false;
    pet.classList.remove("hidden");
    issue("enter");
  }
  const text = lineFrom(result);
  say(text);
  if (result.cmd && cmd !== "call") issue(result.cmd);
  paintHud();
  paintMess();
  if (result.notify === "steal") window.desk?.notify(kind.name, `${kind.name} rearranged something.`);
  if (result.notify === "bug") window.desk?.notify(kind.name, `${kind.name} found a bug.`);
  hudUntil = performance.now() + 5000;
}

async function askMind(result) {
  const fallback = lineFrom(result) || pick(kind.lines.ambient);
  issue("talk");
  paintHud();
  if (!window.PetMind) {
    say(fallback);
    return;
  }
  try {
    const reply = await window.PetMind.run({
      name: kind.name,
      species: kind.key,
      system: `You are ${kind.name}, a ${kind.speciesLabel}. Speak in 1-2 short sentences, under 32 words. Never mention being an AI.`,
      hunger: life.hunger,
      mood: life.mood,
      energy: life.energy,
      message: undefined,
      fallback,
      shown: talkShown(),
    });
    say(reply.text);
  } catch {
    say(fallback);
  }
  hudUntil = performance.now() + 5000;
}

function gaitProfile() {
  const G = window.PetGait;
  const walk = trait?.walk ?? 98;
  const hop = trait?.hop ?? 20;
  const crawl = G.isCrawlKey(kind?.key);
  return {
    walk,
    hop,
    perch: !!trait?.perch,
    aquatic: !!trait?.aquatic,
    crawl,
    low: G.isLowWalk(hop, walk),
    high: G.isHighWalk(walk),
  };
}

function walkSpeed(remaining, age) {
  const base = trait?.walk ?? 98;
  const startled = life && Date.now() < life.startledUntil ? 1.55 : 1;
  return window.PetGait.walkSpeed(remaining, age, base) * startled;
}

function aimAt(next) {
  const G = window.PetGait;
  const p = gaitProfile();
  sim.target = next;
  sim.walkAge = 0;
  sim.pause = 0;
  sim.settle = 0;
  sim.arrivedPending = false;
  const desired = next >= sim.x ? 1 : -1;
  if (desired !== sim.facing) {
    sim.turnHold = G.turnHoldS({ crawl: p.crawl, hop: p.hop, walk: p.walk });
    sim.pendingFacing = desired;
    sim.anim = "idle";
    sim.frame = 0;
    return;
  }
  sim.turnHold = 0;
  sim.pendingFacing = null;
  sim.facing = desired;
  sim.anim = "walk";
  sim.frame = 0;
}

function chaseOf() {
  return { taken, cmd: sim.cmd, mark: mark?.kind ?? null };
}

function applyArrive(via) {
  if (!life || !trait || !kind) return;
  const hop = window.PetPlay.playHop(chaseOf(), via);
  taken = hop.next.taken;
  if (hop.act === "hide") {
    life.hidden = true;
    persist();
    leaving = false;
    issue("idle");
    paintHud();
    return;
  }
  if (hop.act === "snack") {
    const care = mark?.meal === "feed" ? "feed" : "snack";
    clearMark();
    const prevBond = life.bond;
    const result = window.PetLife.act(life, trait, care, Date.now(), kind.key);
    persist();
    say(lineFrom(result) || window.PetLife.snackLine(kind.key));
    const title = window.PetLife.crossedBond(prevBond, life.bond);
    if (title) window.setTimeout(() => say(window.PetLife.BOND_LINE[title]), 900);
    if (hop.issueEat) {
      sim.thankYou = !!(window.PetGroundTricks && window.PetGroundTricks.wantsThankYou ? window.PetGroundTricks.wantsThankYou(kind.key) : (window.PetRuiTricks && window.PetRuiTricks.wantsThankYou && window.PetRuiTricks.wantsThankYou(kind.key)));
      issue("eat");
    }
    paintHud();
    return;
  }
  if (hop.act === "play") {
    const prevBond = life.bond;
    const result = window.PetLife.act(life, trait, "play", Date.now(), kind.key);
    persist();
    if (window.PetRibbon && window.PetRibbon.isRibbonSpecial(trait.special) && mark && mark.kind === "lure") {
      stealDeskRibbon();
      say(window.PetRibbon.RIBBON_SPECIAL);
    } else {
      clearMark();
      say(lineFrom(result) || pick(kind.lines.play));
    }
    const title = window.PetLife.crossedBond(prevBond, life.bond);
    if (title) window.setTimeout(() => say(window.PetLife.BOND_LINE[title]), 900);
    if (hop.issuePlay) issue("play");
    paintHud();
    return;
  }
  if (hop.act === "idle") issue("idle");
}

function finishArrive() {
  if (window.PetArrive.arriveFinish(leaving) === "now") {
    sim.x = sim.target ?? sim.x;
    sim.target = null;
    sim.anim = "idle";
    sim.frame = 0;
    applyArrive("arrive");
    return;
  }
  const p = gaitProfile();
  const dir = sim.target != null && sim.target >= sim.x ? 1 : sim.facing;
  sim.x = sim.target ?? sim.x;
  sim.target = null;
  sim.settle = 1;
  sim.settleDir = dir;
  sim.overshoot = window.PetGait.overshootPx({ crawl: p.crawl, hop: p.hop, walk: p.walk });
  sim.land = 1;
  sim.anim = "idle";
  sim.frame = 0;
  sim.arrivedPending = true;
  sim.actWait = window.PetEthogram.afterSettleWait(trait?.wander ?? 0.45);
}

function clearAct() {
  sim.act = null;
  sim.actMotion = null;
  sim.actT = 0;
  sim.actHold = 0;
  sim.actWalk = false;
}

function startAct(act) {
  if (!act) return;
  sim.act = act.name;
  sim.actMotion = act.motion;
  sim.actT = 0;
  sim.actHold = act.hold;
  sim.target = null;
  sim.waypoints = [];
  if (act.anim) {
    sim.anim = act.anim;
    sim.frame = 0;
    sim.acc = 0;
  }
  if (act.motion === "hop") {
    sim.hop = 1;
    sim.anim = "play";
    sim.frame = 0;
    playSound("hop");
  }
  if (act.anim === "talk") playSound("chirp");
  if (act.anim === "eat") playSound("munch");
  if (act.motion === "dart" || act.motion === "circle") {
    const max = Math.max(PAD, window.innerWidth - BASE - PAD);
    const dist = act.motion === "circle" ? 36 : 44 + Math.random() * 28;
    sim.actWalk = true;
    aimAt(clamp(sim.x + sim.facing * dist, PAD, max));
  }
}

function setClickable(next) {
  if (next === clickable) return;
  clickable = next;
  window.desk?.setClickable(next);
}

function hitRects() {
  return [...document.querySelectorAll("[data-hit]")].flatMap((el) => {
    const style = getComputedStyle(el);
    if (window.PetDesk && window.PetDesk.hitAllows) {
      if (!window.PetDesk.hitAllows(el, style)) return [];
    } else if (style.pointerEvents === "none" || style.visibility === "hidden" || style.display === "none" || Number(style.opacity) === 0) {
      return [];
    }
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return [];
    return [{ x: r.x, y: r.y, width: r.width, height: r.height }];
  });
}

function reportHits() {
  if (!window.PetDesk?.hitForward(window.desk?.platform)) return;
  const now = performance.now();
  if (now - reportHits.at < 80) return;
  reportHits.at = now;
  window.desk?.setHits(hitRects());
}
reportHits.at = 0;

function liftTapPx() {
  return window.PetDesk?.tapPx(window.desk?.platform) ?? window.PetArrive.TAP_PX;
}

function switchTo(key) {
  closeChoice();
  const next = roster.find((r) => r.key === key) ?? roster[0];
  const fromKey = kind && kind.key;
  const fromLife = life;
  kind = { ...next, sprites: pack(next.key) };
  trait = window.PET_TRAITS[next.key] || window.PET_TRAITS.red_panda;
  try {
    localStorage.setItem(STORE_KIND, next.key);
  } catch {
    /* ignore */
  }
  life = window.PetLife.switchGuest(fromKey, fromLife, next.key);
  const away = Date.now() - (life.lastTick || Date.now());
  window.PetLife.decay(life, trait, Date.now(), kind.key);
  if (!houseBooted && window.PetLife.revealOnBoot) {
    window.PetLife.revealOnBoot(life);
    houseBooted = true;
  } else if (next.key === "red_panda" && window.PetLife.revealOnBoot) {
    window.PetLife.revealOnBoot(life);
  }
  persist();
  sim.anim = "idle";
  sim.frame = 0;
  sim.target = null;
  sim.turnHold = 0;
  sim.pendingFacing = null;
  sim.waypoints = [];
  sim.pause = 0;
  sim.settle = 0;
  sim.poseHold = 0;
  sim.pendingPose = null;
  sim.arrivedPending = false;
  taken = false;
  clearAct();
  sim.actWait = 10 + Math.random() * 8;
  sim.play = null;
  sim.playWait = 6 + Math.random() * 5;
  sim.trick = null;
  sim.trickWait = 3 + Math.random() * 3;
  sim.happy = null;
  pet.classList.toggle("sick", !!life.sick);
  pet.classList.toggle("blue", !!(kind && window.PetLife.isBlue(life, kind.key)));
  pet.classList.toggle("hidden", !!life.hidden);
  const back = away > 24 * 60 * 1000
    ? away >= 20 * 3600000
      ? "You were gone a night. I kept the desk."
      : away >= 6 * 3600000
        ? "Hours. I sat in most of them."
        : away >= 3600000
          ? "You were elsewhere. I practiced waiting."
          : "Back. I noticed."
    : null;
  const skyTalk = window.PetWeather?.weatherLine(kind.key, skyOf());
  say(life.hidden ? pick(trait.extra.hide) : back || skyTalk || pick(next.lines.greet), 5000);
  if (!life.hidden) {
    const boot = window.PetLife.bootCmd ? window.PetLife.bootCmd(next.key) : "talk";
    issue(boot);
    if (next.key === "red_panda") {
      sim.playWait = 0.8;
      sim.trickWait = 2.2;
      sim.actWait = 16;
    }
  }
  paintHud();
  paintMess();
  for (const frames of Object.values(kind.sprites)) {
    for (const src of frames) {
      const img = new Image();
      img.src = src;
    }
  }
  if (guestEl) guestEl.classList.remove("show");
  visit = null;
  window.clearTimeout(startVisit.timer);
  startVisit.timer = window.setTimeout(startVisit, window.PetVisitor?.VISIT_WAIT_MS || 7500);
}

// One frame of the overlay. `tick` below is the loop: it schedules the next frame first and runs this
// through the frame guard (frame-guard.js), so a thrown error cannot stop the pets.
let lastTickAt = performance.now();
function tickFrame(now) {
  const dt = Math.min(0.08, (now - lastTickAt) / 1000);
  lastTickAt = now;
  if (!kind || !trait) return;
  const width = window.innerWidth;
  const maxX = Math.max(PAD, width - BASE - PAD);
  const scale = window.PetLife.sizeScale(life, trait);

  if (now > speechUntil) bubble.classList.remove("open");
  pet.classList.toggle("sick", !!life.sick);
  pet.classList.toggle("blue", !!(kind && window.PetLife.isBlue(life, kind.key)));
  pet.classList.toggle("hidden", !!life.hidden);

  if (sim.hop > 0) {
    const prev = sim.hop;
    sim.hop = Math.max(0, sim.hop - dt * 2.15);
    if (prev > 0 && sim.hop === 0) {
      sim.land = 1;
      puff(sim.x, 5);
    }
  }
  if (sim.land > 0) sim.land = Math.max(0, sim.land - dt * window.PetGait.LAND_DECAY);
  if (sim.settle > 0 && !sim.dragging) {
    sim.settle = Math.max(0, sim.settle - dt / window.PetGait.SETTLE_S);
    if (sim.settle === 0 && sim.arrivedPending) {
      sim.arrivedPending = false;
      applyArrive("arrive");
    }
  }
  sim.bob += dt * (trait.aquatic ? 2.4 : 1.2);

  if (!sim.dragging) {
    applyCommand();
    const p = gaitProfile();
    const work = { width, height: window.innerHeight, floorLift: 0 };
    const playFlags = {
      asleep: !!life?.asleep,
      hidden: !!life?.hidden,
      leaving,
      cmd: sim.cmd,
      card: cardOpen(),
    };
    const wins = playWindows();
    const T = (window.PetGroundTricks && window.PetGroundTricks.tricksFor)
      ? window.PetGroundTricks.tricksFor(kind && kind.key)
      : (kind && kind.key === (window.PetRuiTricks && window.PetRuiTricks.TRICK_KEY) ? window.PetRuiTricks : null);
    const trickFlags = {
      asleep: !!life?.asleep,
      hidden: !!life?.hidden,
      leaving,
      cmd: sim.cmd,
      windowPlay: !!sim.play,
      card: cardOpen(),
    };
    if (sim.happy && T && T.happyShouldAbort && T.happyShouldAbort({
      asleep: false,
      hidden: !!life?.hidden,
      leaving,
      cmd: sim.cmd,
    })) {
      sim.happy = T.stepHappy(sim.happy, 0, {
        asleep: false,
        hidden: !!life?.hidden,
        leaving,
        cmd: sim.cmd,
      });
    }
    if (sim.trick && T && T.shouldAbort(trickFlags)) {
      sim.trick = T.stepTrick(sim.trick, 0, trickFlags);
    }
    if (sim.happy && T && T.stepHappy) {
      sim.happy = T.stepHappy(sim.happy, dt, {
        asleep: false,
        hidden: !!life?.hidden,
        leaving,
        cmd: sim.cmd,
      });
      sim.x = sim.happy.x;
      if (!life?.asleep) sim.anim = sim.happy.anim;
      if (sim.happy.phase === "done") {
        sim.lastHappy = sim.happy.kind;
        sim.happy = null;
        sim.land = 1;
        sim.anim = life?.asleep ? "sleep" : cardOpen() ? "idle" : "idle";
      }
    } else if (sim.play && window.PetWindowPlay) {
      sim.play = window.PetWindowPlay.stepPlay(sim.play, dt, { x: sim.x, lift: sim.play.lift }, wins, work, BASE, playFlags);
      sim.x = sim.play.x;
      sim.facing = sim.play.facing;
      if (!life?.asleep) sim.anim = sim.play.anim;
      if (sim.play.phase === "done") {
        sim.play = null;
        sim.land = 1;
        sim.anim = life?.asleep ? "sleep" : "idle";
        sim.playWait = window.PetWindowPlay.nextPlayWait(true);
      }
    } else if (sim.trick && T) {
      sim.trick = T.stepTrick(sim.trick, dt, trickFlags);
      sim.x = sim.trick.x;
      if (!life?.asleep) sim.anim = sim.trick.anim;
      if (sim.trick.phase === "done") {
        sim.lastTrick = sim.trick.kind;
        sim.trick = null;
        sim.land = 1;
        sim.anim = life?.asleep ? "sleep" : "idle";
        sim.trickWait = T.nextTrickWait(true, undefined, sim.lastTrick);
      }
    } else if (
      window.PetWindowPlay &&
      !sim.act &&
      !sim.happy &&
      !leaving &&
      window.PetWindowPlay.canStart(playFlags) &&
      // No pet opts out of window play today (see pickTarget in window-play.js); the guard stays for one that does.
      /** @type {string} */ (window.PetWindowPlay.playFor(kind.key)) !== "ignore" &&
      wins.length
    ) {
      sim.playWait -= dt;
      if (sim.playWait <= 0) {
        const target = window.PetWindowPlay.pickTarget(wins, sim.x, kind.key, work, BASE);
        sim.play = window.PetWindowPlay.beginPlay(target, sim.x);
        if (sim.play) {
          clearAct();
          sim.target = null;
          sim.waypoints = [];
          sim.trick = null;
        }
        sim.playWait = window.PetWindowPlay.nextPlayWait(false);
      }
    } else if (
      T &&
      !sim.act &&
      !sim.happy &&
      !leaving &&
      T.canStart({
        asleep: !!life?.asleep,
        hidden: !!life?.hidden,
        leaving,
        cmd: sim.cmd,
        windowPlay: !!sim.play,
        card: cardOpen(),
      })
    ) {
      sim.trickWait -= dt;
      const musicWantsDance = musicOn() && !sim.trick && !sim.happy;
      if (sim.trickWait <= 0 || musicWantsDance) {
        sim.trick = T.beginTrick(T.pickTrick(undefined, musicOn(), sim.lastTrick), sim.x, sim.facing);
        if (sim.trick) {
          clearAct();
          sim.target = null;
          sim.waypoints = [];
        }
        sim.trickWait = T.nextTrickWait(false);
      }
    }
    if (sim.poseHold > 0) {
      sim.poseHold = Math.max(0, sim.poseHold - dt);
      if (sim.poseHold === 0 && sim.pendingPose) {
        sim.anim = sim.pendingPose;
        sim.pendingPose = null;
        sim.frame = 0;
        sim.acc = 0;
      }
    }
    if (sim.play || sim.trick || sim.happy) {
      /* window play or a ground trick owns the walk */
    } else if (sim.turnHold > 0) {
      sim.turnHold = Math.max(0, sim.turnHold - dt);
      if (sim.turnHold === 0 && sim.pendingFacing) {
        sim.facing = sim.pendingFacing;
        sim.pendingFacing = null;
        sim.anim = "walk";
        sim.frame = 0;
        sim.walkAge = 0;
      }
    } else if (sim.pause > 0) {
      sim.pause = Math.max(0, sim.pause - dt);
      if (life?.asleep) sim.anim = "sleep";
      else sim.anim = "idle";
      if (sim.pause === 0 && sim.waypoints.length && !life?.asleep) aimAt(sim.waypoints.shift());
    } else if (sim.anim === "walk" && sim.target != null && sim.turnHold <= 0) {
      const remaining = Math.abs(sim.target - sim.x);
      const dir = sim.target >= sim.x ? 1 : -1;
      sim.walkAge += dt;
      sim.x += dir * walkSpeed(remaining, sim.walkAge) * dt;
      sim.stepAcc += dt;
      const stepEvery = p.high ? window.PetGait.STEP_S_QUICK : p.crawl ? 0.32 : window.PetGait.STEP_S;
      if (sim.stepAcc > stepEvery) {
        sim.stepAcc = 0;
        if (!sim.play && !sim.trick && !life?.asleep) playSound("step");
        if (Math.random() < 0.45) puff(sim.x, 2);
      }
      if ((dir === 1 && sim.x >= sim.target) || (dir === -1 && sim.x <= sim.target)) {
        sim.x = sim.target;
        const land = window.PetArrive.walkLand(sim.actWalk, sim.waypoints.length);
        if (land === "act") {
          sim.target = null;
          sim.actWalk = false;
          sim.anim = sim.actMotion === "circle" ? "sit" : "idle";
          sim.frame = 0;
          sim.land = 0.4;
        } else if (land === "pause") {
          sim.target = null;
          sim.pause = window.PetGait.wanderPauseS();
          sim.anim = "idle";
          sim.frame = 0;
        } else {
          finishArrive();
        }
      }
    } else if (!sim.act && (sim.anim === "idle" || sim.anim === "sit") && sim.cursorX != null && Math.abs(sim.cursorX - (sim.x + BASE / 2)) > 36) {
      sim.facing = sim.cursorX >= sim.x + BASE / 2 ? 1 : -1;
    }
    if (trait.clingy && !cardOpen() && sim.cursorX != null && !life.hidden && !life.asleep && Math.random() < dt * 0.35) {
      const follow = clamp(sim.cursorX - BASE / 2, PAD, maxX);
      if (Math.abs(follow - sim.x) > 80) {
        sim.waypoints = [];
        aimAt(follow);
      }
    }
    if (sim.play || sim.trick || sim.happy) {
      /* window play or a ground trick owns the pose */
    } else if (sim.act) {
      sim.actT += dt;
      if (sim.actMotion === "stretch" && sim.actHold > 0 && sim.actT / sim.actHold > 0.55 && sim.anim === "sit") {
        sim.anim = "idle";
      }
      if (sim.actT >= sim.actHold && !sim.actWalk) {
        clearAct();
        sim.anim = "idle";
        sim.frame = 0;
      }
    } else if (
      !leaving &&
      !sim.play &&
      !sim.trick &&
      sim.target == null &&
      sim.turnHold <= 0 &&
      sim.pause <= 0 &&
      sim.settle <= 0 &&
      (sim.anim === "idle" || sim.anim === "sit") &&
      !life.hidden &&
      !life.asleep
    ) {
      sim.actWait -= dt;
      if (sim.actWait <= 0) {
        const hour = new Date().getHours();
        const night = hour < 5 || hour >= 21;
        startAct(window.PetEthogram.pickAct(kind?.key));
        sim.actWait = window.PetEthogram.nextActWait(trait?.wander ?? 0.45, !!trait?.nocturnal, night);
      }
    }
    if ((sim.anim === "idle" || sim.anim === "sit") && sim.shiftAge <= 0 && sim.actMotion !== "freeze" && Math.random() < dt * 0.45) {
      sim.shift = (1 + Math.random() * 2) * (Math.random() < 0.5 ? 1 : -1);
      sim.shiftAge = 0.85;
    }
    if (sim.shiftAge > 0) sim.shiftAge = Math.max(0, sim.shiftAge - dt);
    if (!leaving && !sim.play && !sim.trick) sim.x = clamp(sim.x, PAD, maxX);

    if (life?.asleep && !sim.happy && window.PetLife?.sleepHolds(life, sim.cmd)) {
      sim.anim = "sleep";
      const hold = (window.PetGroundTricks?.sleepHoldFrame?.(kind.key, kind.sprites.sleep.length) ?? window.PetRuiTricks?.sleepHoldFrame?.(kind.key, kind.sprites.sleep.length));
      if (hold != null) sim.frame = hold;
    }
    const fps = FPS[sim.anim] * (life.sick ? 0.75 : 1);
    if (fps > 0) {
      sim.acc += dt;
      const step = 1 / fps;
      while (sim.acc >= step) {
        sim.acc -= step;
        const frames = kind.sprites[sim.anim];
        const len = frames.length;
        if (sim.anim === "sleep") {
          const hold = T && T.sleepHoldFrame ? T.sleepHoldFrame(kind.key, len) : null;
          sim.frame = hold == null ? (sim.frame + 1) % len : hold;
        } else if (sim.anim === "sit") sim.frame = Math.min(len - 1, sim.frame + 1);
        else if (ONCE.has(sim.anim)) {
          if (sim.frame + 1 >= len) {
            const wasEat = sim.anim === "eat";
            sim.anim = "idle";
            sim.frame = 0;
            if (wasEat) applyThankYou();
            issue("idle");
          } else {
            sim.frame += 1;
            if (sim.anim === "eat" && sim.frame === 1) playSound("munch");
          }
        } else sim.frame = (sim.frame + 1) % len;
      }
    }
  }

  for (const d of sim.dust) {
    d.life -= dt;
    d.x += d.vx * dt;
    d.y += d.vy * dt;
    d.vy += 28 * dt;
  }
  sim.dust = sim.dust.filter((d) => d.life > 0);

  const frames = kind.sprites[sim.anim];
  const src = frames[Math.min(sim.frame, frames.length - 1)];
  paintPetFrame(src);

  const G = window.PetGait;
  const p = gaitProfile();
  const hopPx = sim.hop > 0 ? Math.sin(sim.hop * Math.PI) * (trait.hop || 20) : 0;
  const walkBob =
    sim.anim === "walk"
      ? p.crawl
        ? 0
        : p.perch
          ? Math.abs(Math.sin(sim.walkAge * 8)) * G.PERCH_STEP_PX
          : (trait.hop || 0) > G.HIGH_HOP
            ? Math.abs(Math.sin(sim.walkAge * 10)) * G.WALK_HOP_PX
            : 0
      : 0;
  const water = trait.aquatic ? Math.sin(sim.bob) * 6 : 0;
  const perch = trait.perch ? 18 : 0;
  const breathe =
    sim.anim === "idle" || sim.anim === "sit" || sim.anim === "sleep"
      ? 1 + Math.sin(now * (sim.anim === "sleep" ? 0.0032 : 0.0046)) * (sim.anim === "sleep" ? G.BREATHE_SLEEP : G.BREATHE_IDLE)
      : 1;
  const pose = sim.act ? window.PetEthogram.actPose(sim.actMotion, sim.actT, sim.actHold) : { dx: 0, dy: 0, rot: 0, stretch: 1, squat: 1 };
  const stretch = sim.hop > 0 ? 1 + Math.sin(sim.hop * Math.PI) * 0.09 : sim.land > 0 ? 1 - Math.sin(sim.land * Math.PI) * 0.08 : sim.act ? breathe * pose.stretch : breathe;
  const squat = sim.act && pose.squat !== 1 ? pose.squat : 2 - stretch;
  const sway = sim.anim === "walk" && p.crawl ? Math.sin(sim.walkAge * 5.5) * G.SWAY_PX : 0;
  const shiftX = sim.shiftAge > 0 ? sim.shift * Math.sin((1 - sim.shiftAge / 0.85) * Math.PI) : 0;
  const settleX = sim.settle > 0 ? G.settleOffset(sim.settle, sim.settleDir, sim.overshoot) : 0;
  const drawX = sim.x + sway + shiftX + settleX + pose.dx;
  const climbLift = sim.play ? sim.play.lift : sim.happy ? sim.happy.lift : sim.trick ? sim.trick.lift : 0;
  const climbRot = sim.play ? sim.play.rot : sim.happy ? sim.happy.rot : sim.trick ? sim.trick.rot : 0;
  const lift = hopPx + walkBob + water + perch + pose.dy + climbLift;
  pet.style.transformOrigin = sim.play && (sim.play.phase === "dive" || sim.play.phase === "leap" || sim.play.phase === "ridge-leap" || sim.play.phase === "ridge-off" || sim.play.phase === "coil-on" || sim.play.phase === "coil-off" || sim.play.phase === "path-on" || sim.play.phase === "path-off" || sim.play.phase === "field-on" || sim.play.phase === "field-off" || sim.play.phase === "crackle-on" || sim.play.phase === "crackle-hop" || sim.play.phase === "crackle-off" || sim.play.phase === "charge-on" || sim.play.phase === "charge-bolt" || sim.play.phase === "charge-off" || sim.play.phase === "orbit-on" || sim.play.phase === "orbit-off" || sim.play.phase === "click-on" || sim.play.phase === "click-hop" || sim.play.phase === "click-off" || sim.play.phase === "hold-on" || sim.play.phase === "hold-off" || sim.play.phase === "earth-on" || sim.play.phase === "earth-off" || sim.play.phase === "ledge-on" || sim.play.phase === "ledge-off" || sim.play.phase === "circle-on" || sim.play.phase === "circle-off") ? "center center" : "center bottom";
  pet.style.transform = `translate3d(${drawX}px, ${-lift}px, 0) rotate(${pose.rot + climbRot}deg) scale(${sim.facing * squat * scale}, ${stretch * scale})`;
  if (cardOpen() && sim.anim === "walk" && !sim.dragging) {
    collapseKeeperCard();
  }
  const shrink = 1 - hopPx / 90;
  shadow.style.transform = `translate3d(${drawX + 40}px, 0, 0) scale(${shrink * scale}, ${shrink})`;
  shadow.style.opacity = String((0.28 - hopPx / 90) * (life.hidden ? 0.2 : 1));
  const hudW = card.collapsed
    ? 0
    : (window.PetKeeper?.HUD_WIDTH ?? 280);
  const choiceW = choiceOpen && choiceEl ? Math.min(168, choiceEl.offsetWidth || 168) : 0;
  const cardLift = card.collapsed ? 0 : Math.min((hud.offsetHeight || 0) + 16, 220);
  const bx = clamp(drawX + BASE * 0.5 - 110, 10, Math.max(10, width - 230));
  bubble.style.transform = `translate3d(${bx}px, ${-lift - 10 - cardLift}px, 0)`;
  let choiceX = clamp(drawX - choiceW - 12, 8, Math.max(8, width - choiceW - 8));
  let cardX = clamp(drawX + BASE * 0.55, 8, Math.max(8, width - (hudW + 8)));
  if (!card.collapsed && choiceOpen && hudW && cardX < choiceX + choiceW + 8) {
    cardX = clamp(choiceX + choiceW + 8, 8, Math.max(8, width - (hudW + 8)));
  }
  if (choiceEl && choiceOpen) choiceEl.style.transform = `translate3d(${choiceX}px, 0, 0)`;
  hud.style.transform = `translate3d(${cardX}px, ${-lift}px, 0)`;
  if (tongueEl) {
    const flick = p.crawl && sim.actMotion === "tongue" ? window.PetEthogram.tongueFlick(sim.actT, sim.actHold) : 0;
    tongueEl.style.opacity = String(flick);
    tongueEl.style.transform = `translate3d(${drawX + BASE * 0.5 + sim.facing * 36 - 2}px, ${-(lift + 48)}px, 0) scale(${sim.facing}, 1)`;
  }

  const nodes = dustRoot.children;
  for (let i = 0; i < nodes.length; i++) {
    const el = nodes[i];
    const d = sim.dust[i];
    if (!d) {
      el.style.opacity = "0";
      continue;
    }
    el.style.opacity = String(Math.max(0, d.life * 1.4));
    el.style.width = `${d.size}px`;
    el.style.height = `${d.size}px`;
    el.style.transform = `translate3d(${d.x}px, ${d.y}px, 0)`;
  }

  frameGuard.step(() => tickVisit(dt, now, width), undefined, "visit guest");
  frameGuard.step(tickBird, dt, "bird");
  frameGuard.step(tickRobin, dt, "robin");
  frameGuard.step(tickPlants, dt, "plants");
  frameGuard.step(tickCalled, dt, "called guests");
  if (kind && kind.key === "red_panda" && !(life && life.hidden) && window.PetCallGuests && window.PetCallGuests.nextAutoMeet) {
    autoMeetWait -= dt;
    if (autoMeetWait <= 0) {
      autoMeetWait = 16;
      const next = window.PetCallGuests.nextAutoMeet(called.map((c) => c.key), kind.key);
      if (next) spawnCalled([next]);
    }
  }
  paintLure();
  reportHits();
}

// A frame error puts the host pet back to a safe idle (no trick, no thank-you, no window play).
// Guests, plants, and the visit only log: their next frame starts fresh.
function resetAfterFrameError(petKey) {
  if (kind && petKey === kind.key) window.PetFrameGuard.safeIdle(sim);
}
const frameGuard = window.PetFrameGuard.makeGuard({ reset: resetAfterFrameError });
const tick = window.PetFrameGuard.guardedLoop(tickFrame, (next) => requestAnimationFrame(next), frameGuard, () => (kind && kind.key) || "");

let visit = null;
let called = [];
let radioQ = "";
let callFilled = false;

function visitLaw() {
  return window.PetVisitor;
}

function endVisit() {
  if (guestEl) guestEl.classList.remove("show");
  visit = null;
}

function tapVisitor() {
  const law = visitLaw();
  if (!visit || !law) return false;
  openChoice({ role: "visit" });
  visit.said = true;
  visit.tapped = true;
  if (visit.sprites.talk) paintActor(guestEl, visit.sprites.talk[0], "guest");
  else paintActor(guestEl, visit.sprites.idle[0], "guest");
  return true;
}

function startVisit() {
  const law = visitLaw();
  const gKey = law && kind ? law.todaysVisitor(kind.key) : null;
  const g = gKey ? roster.find((r) => r.key === gKey) : null;
  if (!g || !guestEl || (life && life.hidden)) return;
  if (g.key === "robin") {
    callRobin();
    return;
  }
  const sprites = pack(g.key);
  visit = {
    key: g.key,
    name: g.name,
    sprites,
    x: window.innerWidth + 10,
    target: Math.max(80, window.innerWidth * 0.52),
    facing: -1,
    frame: 0,
    acc: 0,
    born: performance.now(),
    said: false,
    tapped: false,
    wandered: false,
    placed: false,
    phase: "in",
  };
  guestEl.classList.add("show");
  paintActor(guestEl, sprites.walk[0], "guest");
  if (window.PetCallGuests && window.PetCallGuests.destFit) window.PetCallGuests.destFit(guestEl);
}

function tickVisit(dt, now, width) {
  const law = visitLaw();
  if (!guestEl || !law) return;
  if (life && life.hidden) {
    if (guestEl.classList.contains("show")) guestEl.classList.remove("show");
    if (visit) visit.phase = law.visitPhaseFromEnter(now - visit.born, true);
    if (!visit || visit.phase === "gone") endVisit();
    return;
  }
  if (!visit) return;
  const age = now - visit.born;
  const phase = law.visitPhaseFromEnter(age);
  if (phase === "gone") {
    endVisit();
    return;
  }
  if (phase === "leave") {
    visit.target = -140;
    visit.tapped = false;
    visit.placed = false;
  } else if (visit.placed) {
    visit.target = visit.x;
  } else if (phase === "wander" && !visit.wandered) {
    visit.wandered = true;
    visit.target = Math.max(80, width * (visit.x < width * 0.5 ? 0.72 : 0.28));
  }
  if (phase === "talk" && !visit.said) {
    visit.said = true;
    say(law.visitLine(visit.key));
  }
  visit.phase = phase;
  const sitting = (visit.tapped || visit.placed) && phase !== "leave";
  const walking = !sitting && (phase === "in" || phase === "wander" || phase === "leave");
  const remaining = Math.abs(visit.target - visit.x);
  if (walking && remaining > 2) {
    visit.facing = visit.target >= visit.x ? 1 : -1;
    visit.x += visit.facing * 86 * dt;
    visit.acc += dt;
    if (visit.acc > 1 / 6.4) {
      visit.acc = 0;
      visit.frame = (visit.frame + 1) % visit.sprites.walk.length;
    }
    paintActor(guestEl, visit.sprites.walk[visit.frame], "guest");
  } else if (phase === "talk" || sitting) {
    paintActor(guestEl, visit.sprites.talk ? visit.sprites.talk[0] : visit.sprites.idle[0], "guest");
  } else if (phase !== "leave") {
    paintActor(guestEl, visit.sprites.idle[0], "guest");
  }
  guestEl.classList.add("show");
  guestEl.style.transform = `translate3d(${visit.x}px, 0, 0) scale(${visit.facing}, 1)`;
}

if (guestEl) {
  guestEl.addEventListener("pointerdown", (e) => {
    if (e.button === 2) return;
    if (!visit || !guestEl.classList.contains("show")) return;
    e.stopPropagation();
    try { guestEl.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
    visitPress = { x: e.clientX, y: e.clientY, startX: visit.x };
    visitDrag = null;
    closeChoice();
    setClickable(true);
  });
}

pet.addEventListener("pointerdown", (e) => {
  if (e.button === 2) return;
  if (window.PetDesk?.carePointer(e)) return;
  sim.dragging = true;
  sim.pointerStart = { x: e.clientX, y: e.clientY };
  sim.dragDx = e.clientX - sim.x;
  pet.setPointerCapture(e.pointerId);
  setClickable(true);
});
window.addEventListener("pointermove", (e) => {
  sim.cursorX = e.clientX;
  const over = closestTarget(e, "[data-hit]");
  setClickable(!!over || sim.dragging || !!plantDrag || !!plantPress || !!plantChoiceKey || !!plateDrag || !!platePress || !!calledPress || !!calledDrag || !!visitPress || !!visitDrag);
  if (plantPress && window.PetDeskPlants) {
    const P = window.PetDeskPlants;
    if (!plantDrag && P.clickMoved(e.clientX - plantPress.x, e.clientY - plantPress.y)) {
      deskPlants = deskPlants.map((p) => (p.key === plantPress.key ? P.beginDrag(p, plantPress.x, plantPress.y) : p));
      plantDrag = plantPress.key;
      closePlantChoice();
    }
    if (plantDrag) {
      deskPlants = deskPlants.map((p) => (p.key === plantDrag ? P.moveDrag(p, e.clientX, e.clientY, window.innerWidth, window.innerHeight) : p));
      paintPlants();
    }
  }
  if (platePress && window.PetDeskPlates) {
    const Pl = window.PetDeskPlates;
    if (!plateDrag && Pl.clickMoved(e.clientX - platePress.x, e.clientY - platePress.y)) {
      deskPlates = deskPlates.map((p) => (p.key === platePress.key ? Pl.beginDrag(p, platePress.x, platePress.y) : p));
      plateDrag = platePress.key;
      plateSkipToggle = true;
    }
    if (plateDrag) {
      const el = plateEl(plateDrag);
      const box = el ? el.getBoundingClientRect() : null;
      deskPlates = deskPlates.map((p) =>
        p.key === plateDrag
          ? Pl.moveDrag(p, e.clientX, e.clientY, window.innerWidth, window.innerHeight, box && box.width, box && box.height)
          : p,
      );
      paintPlates();
    }
  }
  if (calledPress && window.PetCallGuests) {
    const G = window.PetCallGuests;
    const moved = G.clickMoved
      ? G.clickMoved(e.clientX - calledPress.x, e.clientY - calledPress.y)
      : Math.abs(e.clientX - calledPress.x) > 8 || Math.abs(e.clientY - calledPress.y) > 8;
    if (!calledDrag && moved) {
      calledDrag = calledPress.key;
      closeChoice();
    }
    if (calledDrag) {
      const g = called.find((c) => c.key === calledDrag);
      if (g) {
        const maxX = Math.max(PAD, window.innerWidth - BASE - PAD);
        const dx = e.clientX - calledPress.x;
        g.x = clamp(calledPress.startX + dx, PAD, maxX);
        g.target = g.x;
        g.lift = 0;
        paintCalled();
      }
    }
  }
  if (visitPress && visit) {
    const P = window.PetDeskPlants;
    const moved = P && P.clickMoved
      ? P.clickMoved(e.clientX - visitPress.x, e.clientY - visitPress.y)
      : Math.abs(e.clientX - visitPress.x) > 8 || Math.abs(e.clientY - visitPress.y) > 8;
    if (!visitDrag && moved) {
      visitDrag = true;
      closeChoice();
    }
    if (visitDrag) {
      const maxX = Math.max(PAD, window.innerWidth - BASE - PAD);
      const dx = e.clientX - visitPress.x;
      visit.x = clamp(visitPress.startX + dx, PAD, maxX);
      visit.target = visit.x;
      if (guestEl) guestEl.style.transform = `translate3d(${visit.x}px, 0, 0) scale(${visit.facing}, 1)`;
    }
  }
  if (!sim.dragging) return;
  const maxX = Math.max(PAD, window.innerWidth - BASE - PAD);
  sim.x = clamp(e.clientX - sim.dragDx, PAD, maxX);
  if (sim.pointerStart && Math.abs(e.clientX - sim.pointerStart.x) > 10) {
    sim.facing = e.clientX >= sim.pointerStart.x ? 1 : -1;
  }
});
window.addEventListener("pointerup", (e) => {
  if (plantPress && window.PetDeskPlants) {
    const P = window.PetDeskPlants;
    if (plantDrag) {
      deskPlants = P.savePlants(deskPlants.map((p) => P.endDrag(p)));
    } else {
      openPlantChoice(plantPress.key);
    }
    plantPress = null;
    plantDrag = null;
    paintPlants();
  }
  if (platePress && window.PetDeskPlates) {
    const Pl = window.PetDeskPlates;
    if (plateDrag) {
      deskPlates = Pl.savePlates(deskPlates.map((p) => Pl.endDrag(p)));
      paintPlates();
    }
    platePress = null;
    plateDrag = null;
  }
  if (calledPress && window.PetCallGuests) {
    const G = window.PetCallGuests;
    const key = calledPress.key;
    if (calledDrag) {
      const g = called.find((c) => c.key === key);
      if (g && G.placeCalled) Object.assign(g, G.placeCalled(g, g.x, window.innerWidth));
      paintCalled();
    } else {
      openChoice({ role: "called", key });
    }
    calledPress = null;
    calledDrag = null;
  }
  if (visitPress) {
    if (visitDrag && visit) {
      visit.placed = true;
      visit.tapped = true;
      visit.target = visit.x;
    } else if (visit) {
      tapVisitor();
    }
    visitPress = null;
    visitDrag = null;
  }
  if (!sim.dragging) return;
  const start = sim.pointerStart;
  sim.dragging = false;
  sim.pointerStart = null;
  const dx = start ? e.clientX - start.x : 0;
  const dy = start ? e.clientY - start.y : 0;
  const lift = window.PetArrive.pointerUp(dx, dy, liftTapPx());
  if (lift.kind === "tap") {
    openKeeperCard();
    if (window.PetChoice?.guestTap() === "choice") openChoice({ role: "host" });
    return;
  }
  sim.land = 0.55;
  puff(sim.x, 3);
  sim.arrivedPending = false;
  sim.settle = 0;
  if (window.PetArrive.afterPlace(sim.target != null) === "resume" && sim.target != null) {
    aimAt(sim.target);
  } else {
    sim.anim = "idle";
  }
});
window.addEventListener("pointercancel", () => {
  if ((plantPress || plantDrag) && window.PetDeskPlants) {
    deskPlants = window.PetDeskPlants.savePlants(deskPlants.map((row) => window.PetDeskPlants.endDrag(row)));
    plantPress = null;
    plantDrag = null;
    paintPlants();
  }
  if ((platePress || plateDrag) && window.PetDeskPlates) {
    deskPlates = window.PetDeskPlates.savePlates(deskPlates.map((row) => window.PetDeskPlates.endDrag(row)));
    platePress = null;
    plateDrag = null;
    paintPlates();
  }
  if (calledPress || calledDrag) {
    calledPress = null;
    calledDrag = null;
  }
  if (visitPress || visitDrag) {
    visitPress = null;
    visitDrag = null;
  }
  sim.dragging = false;
  sim.pointerStart = null;
});
pet.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  window.desk?.openMenu(e.clientX, e.clientY);
});
lureEl.addEventListener("click", (e) => {
  e.stopPropagation();
  if (!mark || mark.kind !== "lure" || !life || !trait || !kind) return;
  if (lureDrag && lureDrag.moved) return;
  if (mark.carried && window.PetRibbon) {
    mark = { ...window.PetRibbon.dropRibbon(mark, mark.x), kind: "lure" };
    taken = false;
    paintLure();
    return;
  }
  const hop = window.PetPlay.playHop(chaseOf(), "catch");
  if (hop.act !== "play") return;
  taken = hop.next.taken;
  clearMark();
  const result = window.PetLife.act(life, trait, "play", Date.now(), kind.key);
  persist();
  say("You caught it first. I still win.");
  if (hop.issuePlay) issue("play");
  paintHud();
});
if (lureEl) {
  lureEl.addEventListener("pointerdown", (e) => {
    if (e.button === 2 || !mark || mark.kind !== "lure") return;
    e.stopPropagation();
    lureDrag = { id: e.pointerId, x: e.clientX, from: mark.x, moved: false };
    lureEl.setPointerCapture(e.pointerId);
    setClickable(true);
  });
  lureEl.addEventListener("pointermove", (e) => {
    if (!lureDrag || lureDrag.id !== e.pointerId || !mark || mark.kind !== "lure") return;
    const dx = e.clientX - lureDrag.x;
    if (Math.abs(dx) > 6) lureDrag.moved = true;
    if (!lureDrag.moved) return;
    if (mark.carried && window.PetRibbon) mark = { ...window.PetRibbon.dropRibbon(mark, mark.x), kind: "lure" };
    mark.x = clamp(lureDrag.from + dx, 24, window.innerWidth - 40);
    mark.hops = Math.max(mark.hops || 0, 1);
    taken = false;
    window.clearTimeout(lureTimer);
    paintLure();
    issue("seek");
  });
  lureEl.addEventListener("pointerup", (e) => {
    if (!lureDrag || lureDrag.id !== e.pointerId) return;
    window.setTimeout(() => {
      lureDrag = null;
    }, 0);
  });
  lureEl.addEventListener("pointercancel", () => {
    lureDrag = null;
  });
}
if (hudCallBird) {
  hudCallBird.addEventListener("click", (e) => {
    e.stopPropagation();
    callSip();
  });
}
if (hudCallGo) {
  hudCallGo.addEventListener("click", (e) => {
    e.stopPropagation();
    callGuestsFromCard();
  });
}
if (hudCallQ) {
  hudCallQ.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      callGuestsFromCard();
    }
  });
}
function fieldOf(el) {
  return el && el.closest && el.closest("input, textarea, select");
}
document.addEventListener("keydown", (e) => {
  const note = window.PetPresence && window.PetPresence.classifyKey ? window.PetPresence.classifyKey(e) : null;
  if (!note || note.record || note.field || note.toggle !== "dismiss") return;
  if (plantChoiceKey) {
    closePlantChoice();
    e.preventDefault();
    return;
  }
  if (choiceOpen) {
    const inMenu = !!(choiceEl && choiceEl.contains(document.activeElement));
    closeChoice();
    if (inMenu) returnChoiceFocus();
    e.preventDefault();
  }
});
document.addEventListener("pointerdown", (e) => {
  if (!fieldOf(e.target)) return;
  setClickable(true);
  window.desk?.setFocusable?.(true);
}, true);
document.addEventListener("focusin", (e) => {
  const field = fieldOf(e.target);
  if (!field) return;
  setClickable(true);
  window.desk?.setFocusable?.(true);
});
document.addEventListener("focusout", () => {
  window.setTimeout(() => {
    if (fieldOf(document.activeElement) || cardKeysOn) return;
    window.desk?.setFocusable?.(false);
  }, 0);
});

/** Controls in the open keeper card that Tab can reach, in page order. Hidden and disabled ones are skipped. */
function focusablesIn(root) {
  if (!root) return [];
  return [...root.querySelectorAll("button, input, select, textarea, a[href], [tabindex]")].filter((el) => {
    if (el.disabled || el.getAttribute("tabindex") === "-1") return false;
    if (el.closest("[hidden]")) return false;
    return el.getClientRects().length > 0;
  });
}

function hudFocusables() {
  if (!hud || card.collapsed) return [];
  return focusablesIn(hud);
}

/** The weather, news, and market plates that are on the glass now (a plate turned off has no box). */
function keyPlates() {
  return KEY_PLATE_IDS.map((id) => document.getElementById(id)).filter((plate) => plate && !plate.hidden && plate.getClientRects().length > 0);
}

/** Tab order while the card has the keyboard: the card's controls first, then each plate on the glass. */
function cardFocusables() {
  if (!hud || card.collapsed) return [];
  // An open choice menu is one Tab stop (its active item), ahead of the card.
  const out = choiceOpen && choiceEl ? focusablesIn(choiceEl) : [];
  out.push(...hudFocusables());
  for (const plate of keyPlates()) out.push(...focusablesIn(plate));
  return out;
}

function inCardOrPlate(el) {
  if (!el) return false;
  if (hud && hud.contains(el)) return true;
  return keyPlates().some((plate) => plate.contains(el));
}

function inPlate(el) {
  return !!el && keyPlates().some((plate) => plate.contains(el));
}

/** The card control that last had focus, so Escape from a plate goes back to it (else the card's first control). */
let lastCardFocus = null;
if (hud) hud.addEventListener("focusin", (e) => { lastCardFocus = e.target; });
function backToCard() {
  const list = hudFocusables();
  const land = lastCardFocus && list.includes(lastCardFocus) ? lastCardFocus : list[0];
  if (land) land.focus();
}

/**
 * A plate's tabs follow the tablist pattern: one tab stop (the picked tab; desk-house.js keeps tabindex),
 * Right / Left / Home / End move focus along the tabs, Enter or Space picks one. True when it handled the key.
 */
function plateTabKey(e) {
  const K = window.PetKeeper;
  const tab = closestTarget(e, '[role="tab"]');
  if (!tab || !K || !K.rovingIndex || !inPlate(tab)) return false;
  const list = tab.closest('[role="tablist"]');
  const tabs = list ? [...list.querySelectorAll('[role="tab"]')] : [];
  const next = K.rovingIndex(e.key, tabs.indexOf(tab), tabs.length);
  if (next < 0) return false;
  e.preventDefault();
  tabs[next].focus();
  return true;
}

/**
 * The card rebuilds its color, voice, mute, step, and sleep buttons on every paint. A keyboard press on
 * one of them would drop focus with the old button; this remembers which one had it and puts it back.
 */
function rebuiltFocus() {
  const el = document.activeElement;
  if (!el || !hud || !hud.contains(el) || el.tagName !== "BUTTON") return null;
  for (const k of REBUILT_KEYS) {
    if (el.dataset[k] == null) continue;
    // `at`: its place among its kind, so a Drop that removed its own line can land on the next one.
    const at = [...hud.querySelectorAll("button")].filter((b) => b.dataset[k] != null).indexOf(el);
    return { k, v: el.dataset[k], at };
  }
  return null;
}
function refocusRebuilt(was) {
  if (!was || !hud || card.collapsed) return;
  const active = document.activeElement;
  if (active && active.isConnected && hud.contains(active)) return;
  const same = [...hud.querySelectorAll("button")].filter((b) => b.dataset[was.k] != null);
  const again = same.find((b) => b.dataset[was.k] === was.v);
  if (again) {
    again.focus();
    return;
  }
  if (was.k !== "lineDrop") return;
  // The dropped line is gone: the line that slid up, else the one above, else the house-line field.
  const K = window.PetKeeper;
  const next = K && K.afterDrop ? K.afterDrop(was.at, same.length) : -1;
  const land = next >= 0 ? same[next] : document.getElementById("hud-line-text");
  if (land) land.focus();
}

/**
 * Keyboard for the keeper card. On: the overlay window may take focus (Tab walks the card's controls),
 * optionally landing on the first one. Off (the card closed): focus leaves the card and the overlay
 * goes back to not taking focus. Click-through is untouched either way (that is setClickable / hits).
 */
function cardKeys(on, opts) {
  if (on) {
    if (card.collapsed) return;
    cardKeysOn = true;
    window.desk?.setFocusable?.(true);
    if (opts && opts.focusFirst) {
      const first = hudFocusables()[0];
      if (first) first.focus();
    }
    return;
  }
  if (!cardKeysOn) return;
  cardKeysOn = false;
  const active = document.activeElement;
  if (inCardOrPlate(active) && typeof active.blur === "function") active.blur();
  if (!fieldOf(document.activeElement)) window.desk?.setFocusable?.(false);
}

if (hud) {
  // A click inside the open card hands it the keyboard too, so Tab and Escape work from there.
  hud.addEventListener("pointerdown", () => {
    if (!card.collapsed) cardKeys(true);
  }, true);
}
// With the card open, a click on a plate joins the same Tab cycle (a closed card leaves plates as they were).
for (const id of KEY_PLATE_IDS) {
  const plate = document.getElementById(id);
  if (!plate) continue;
  plate.addEventListener("pointerdown", () => {
    if (!card.collapsed) cardKeys(true);
  }, true);
}

// Escape closes the open keeper card (after a choice menu, which closes first; from a plate it first steps
// back to the card); Tab wraps inside it; arrow keys walk a plate's tabs.
document.addEventListener("keydown", (e) => {
  const K = window.PetKeeper;
  if (e.defaultPrevented || !K || !K.cardKey) return;
  const active = document.activeElement;
  const plate = inPlate(active) && !fieldOf(active);
  const act = K.cardKey({ key: e.key, cardOpen: !card.collapsed, menuOpen: !!(choiceOpen || plantChoiceKey), inPlate: plate });
  if (act === "card") {
    // Escape on a plate steps back to the card; the next Escape closes the card.
    e.preventDefault();
    backToCard();
    return;
  }
  if (act === "leave") {
    e.preventDefault();
    if (typeof active.blur === "function") active.blur();
    if (!fieldOf(document.activeElement)) window.desk?.setFocusable?.(false);
    return;
  }
  if (act === "close") {
    e.preventDefault();
    collapseKeeperCard();
    return;
  }
  if (plateTabKey(e)) return;
  if (act !== "tab" || !cardKeysOn) return;
  const list = cardFocusables();
  const next = K.tabWrap(list.length, list.indexOf(document.activeElement), e.shiftKey);
  if (next >= 0) {
    e.preventDefault();
    list[next].focus();
  }
});
const hudMusicPlay = document.getElementById("hud-music-play");
if (hudMusicPlay) {
  hudMusicPlay.addEventListener("click", (e) => {
    e.stopPropagation();
    const M = window.PetHouseMusic;
    if (!M) return;
    const music = M.parseMusic(card.music);
    const remoteStream = music.plugin === "radio" && !!music.stationUrl;
    const audible = !!(music.playing && music.plugin !== "off" && (!remoteStream || streamAsked));
    const next = M.parseMusic({ ...music, playing: !audible && music.plugin !== "off" });
    if (next.plugin === "radio" && next.playing && next.stationUrl) streamAsked = true;
    card.music = next;
    persistCard();
    sitMusic();
  });
}
const hudHouseMusicPlay = document.getElementById("hud-house-music-play");
if (hudHouseMusicPlay) {
  hudHouseMusicPlay.addEventListener("click", (e) => {
    e.stopPropagation();
    const M = window.PetHouseMusic;
    if (!M || !M.houseMusicToggle) return;
    const next = M.parseMusic(M.houseMusicToggle(M.parseMusic(card.music), streamAsked).next);
    if (next.plugin === "radio" && next.playing && next.stationUrl) streamAsked = true;
    card.music = next;
    persistCard();
    paintHouseMusic();
    sitMusic();
  });
}
const hudRadioForm = document.getElementById("hud-radio-form");
const hudRadioQ = document.getElementById("hud-radio-q");
const hudRadioTruth = document.getElementById("hud-radio-truth");
const hudRadioHits = document.getElementById("hud-radio-hits");
if (hudRadioQ) {
  hudRadioQ.addEventListener("input", () => {
    radioQ = hudRadioQ.value;
  });
}
if (hudRadioForm) {
  hudRadioForm.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const M = window.PetHouseMusic;
    if (!M || !hudRadioHits || !hudRadioTruth) return;
    radioQ = hudRadioQ ? hudRadioQ.value : radioQ;
    lookupRadio(radioQ, hudRadioHits, hudRadioTruth, M.parseMusic(card.music));
  });
}
const hudRadioLocal = document.getElementById("hud-radio-local");
if (hudRadioLocal) {
  hudRadioLocal.addEventListener("click", (e) => {
    e.stopPropagation();
    const M = window.PetHouseMusic;
    if (!M || !hudRadioHits || !hudRadioTruth) return;
    radioQ = "";
    if (hudRadioQ) hudRadioQ.value = "";
    lookupRadio("", hudRadioHits, hudRadioTruth, M.parseMusic(card.music));
  });
}
if (weatherPlate) {
  if (window.PetWeatherAreas && window.PetWeatherAreas.storedLivePinNeedsFuzz(card) && window.PetCard) {
    card = window.PetCard.parseCard(card);
    persistCard();
  }
  function applyWeatherHouse(house) {
    const A = window.PetWeatherAreas;
    const ack = A.stickHereForecastAck(house, card.hereForecastAck);
    Object.assign(card, A.toCardPatch(house));
    card.hereForecastAck = ack;
    persistCard();
    const savedTruth = document.getElementById("weather-saved-truth");
    if (savedTruth) savedTruth.textContent = "";
    fetchWeather();
  }
  weatherPlate.addEventListener("click", (e) => {
    const toggle = closestTarget(e, "#weather-toggle");
    if (toggle) {
      e.stopPropagation();
      if (plateSkipToggle) {
        plateSkipToggle = false;
        return;
      }
      const body = document.getElementById("weather-body");
      if (body) {
        body.hidden = !body.hidden;
        const open = !body.hidden;
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        if (open) fetchWeather();
        else paintHousePlates();
      }
      return;
    }
    if (!window.PetWeatherAreas) return;
    const tabBtn = closestTarget(e, "[data-weather-tab]");
    if (tabBtn) {
      e.stopPropagation();
      applyWeatherHouse(window.PetWeatherAreas.pickTab(card, tabBtn.getAttribute("data-weather-tab")));
      return;
    }
    const pick = closestTarget(e, "[data-area-pick]");
    if (pick) {
      e.stopPropagation();
      applyWeatherHouse(window.PetWeatherAreas.pickArea(card, pick.getAttribute("data-area-pick")));
      return;
    }
    const fav = closestTarget(e, "[data-area-fav]");
    if (fav) {
      e.stopPropagation();
      applyWeatherHouse(window.PetWeatherAreas.toggleFavorite(card, fav.getAttribute("data-area-fav")));
      return;
    }
    const del = closestTarget(e, "[data-area-del]");
    if (del) {
      e.stopPropagation();
      applyWeatherHouse(window.PetWeatherAreas.removeArea(card, del.getAttribute("data-area-del")));
      return;
    }
  });
  weatherPlate.addEventListener("submit", (e) => {
    if (!e.target || e.target.id !== "weather-add" || !window.PetWeatherAreas) return;
    e.preventDefault();
    e.stopPropagation();
    const A = window.PetWeatherAreas;
    const q = /** @type {HTMLInputElement | null} */ (document.getElementById("weather-q"));
    const hits = document.getElementById("weather-hits");
    if (!hits) return;
    const hitsSay = (text) => {
      const li = document.createElement("li");
      li.textContent = text;
      hits.replaceChildren(li);
    };
    const look = document.getElementById("weather-geocode-net");
    if (look && A.geocodeHonesty) look.textContent = A.geocodeHonesty("look");
    const shown = look ? look.textContent || "" : "";
    if (!A.geocodeMaySend("look", geocodeLineInView("weather-geocode-net"))) {
      hitsSay(A.TYPE_A_CITY);
      return;
    }
    const url = A.geocodeUrl(q && q.value);
    if (!url || !A.readGeocode) {
      hitsSay(A.TYPE_A_CITY);
      return;
    }
    A.readGeocode(shown, url)
      .then((json) => {
        if (json == null) {
          hitsSay(A.CANT_REACH);
          return;
        }
        const found = A.parseGeocode(json);
        hits.replaceChildren();
        if (!found.length) {
          hitsSay("No place from that look-up.");
          return;
        }
        for (const hit of found) {
          const li = document.createElement("li");
          const btn = document.createElement("button");
          btn.type = "button";
          btn.dataset.hit = "1";
          btn.textContent = `Add ${hit.name}`;
          btn.addEventListener("click", (ev) => {
            ev.stopPropagation();
            applyWeatherHouse(A.addArea(card, hit));
            hits.replaceChildren();
          });
          li.appendChild(btn);
          hits.appendChild(li);
        }
      })
      .catch(() => {
        hitsSay(A.CANT_REACH);
      });
  });
  function showHereAsk(on) {
    const ask = document.getElementById("weather-here-ask");
    if (ask) ask.hidden = !on;
    const line = document.getElementById("weather-here-ask-line");
    const A = window.PetWeatherAreas;
    if (line && A) line.textContent = A.HERE_ASK;
  }
  function keepTyped(gate) {
    const A = window.PetWeatherAreas;
    const truth = document.getElementById("weather-here-truth");
    showHereAsk(false);
    if (truth && A) truth.textContent = A.HERE_KEPT;
    if (!A || !gate || !gate.area) return;
    const current = A.currentArea(card);
    if (!current || current.id !== gate.area.id) applyWeatherHouse(A.pickArea(card, gate.area.id));
  }
  function sendLiveFix() {
    const A = window.PetWeatherAreas;
    const truth = document.getElementById("weather-here-truth");
    if (!A) {
      if (window.PetPresence && window.PetPresence.holdWeatherLocate) window.PetPresence.holdWeatherLocate();
      return;
    }
    function keepHere(area) {
      const house = A.addArea(card, area);
      card.hereForecastAck = A.ackSavedHere(house);
      applyWeatherHouse(house);
      if (truth) truth.textContent = A.HERE_SENT;
    }
    function failHere(line) {
      if (truth) truth.textContent = line;
    }
    function unnamed(lat, lon) {
      return { id: "here", name: "This computer", query: "this computer", lat, lon };
    }
    if (window.PetPresence && typeof window.PetPresence.ipPlace === "function" && window.PetPresence.ipPlace() != null) {
      if (window.PetPresence.holdWeatherLocate) window.PetPresence.holdWeatherLocate();
      failHere(A.HERE_FAIL);
      return;
    }
    const reader = window.PetPresence && window.PetPresence.readWeatherHere;
    const deskApi = window.desk;
    if (!navigator.geolocation || typeof reader !== "function") {
      if (window.PetPresence && window.PetPresence.holdWeatherLocate) window.PetPresence.holdWeatherLocate();
      failHere(A.HERE_FAIL);
      return;
    }
    reader(navigator.geolocation, {
      arm() {
        return deskApi && deskApi.armWeatherLocate ? deskApi.armWeatherLocate() : undefined;
      },
      clear() {
        return deskApi && deskApi.clearWeatherLocate ? deskApi.clearWeatherLocate() : undefined;
      },
    }).then((fix) => {
      if (!fix) {
        failHere(A.HERE_FAIL);
        return;
      }
      const place = A.sharePlace(fix.lat, fix.lon);
      if (!place) {
        failHere(A.HERE_FAIL);
        return;
      }
      const rev = document.getElementById("weather-reverse-net");
      if (rev && A.geocodeHonesty) rev.textContent = A.geocodeHonesty("reverse");
      const shown = rev ? rev.textContent || "" : "";
      if (!A.geocodeMaySend("reverse", geocodeLineInView("weather-reverse-net"))) {
        keepHere(unnamed(place.lat, place.lon));
        return;
      }
      const url = A.reverseUrl(place.lat, place.lon);
      if (!url || !A.readReverse) {
        keepHere(unnamed(place.lat, place.lon));
        return;
      }
      A.readReverse(shown, url)
        .then((json) => {
          if (json == null) {
            keepHere(unnamed(place.lat, place.lon));
            return;
          }
          const named = A.parseReverse(json);
          keepHere(
            named
              ? { id: "here", name: named.name, query: "this computer", lat: place.lat, lon: place.lon }
              : unnamed(place.lat, place.lon),
          );
        })
        .catch(() => keepHere(unnamed(place.lat, place.lon)));
    });
  }
  const savedYes = document.getElementById("weather-saved-yes");
  if (savedYes) {
    savedYes.addEventListener("click", (e) => {
      e.stopPropagation();
      const A = window.PetWeatherAreas;
      if (!A) return;
      const gate = A.forecastGate(card, card.hereForecastAck);
      if (gate.act !== "hold") return;
      const ack = A.ackSavedHere(card);
      if (!ack) return;
      card.hereForecastAck = ack;
      persistCard();
      const truth = document.getElementById("weather-saved-truth");
      if (truth) truth.textContent = A.SAVED_HERE_SENT;
      fetchWeather();
    });
  }
  const savedNo = document.getElementById("weather-saved-no");
  if (savedNo) {
    savedNo.addEventListener("click", (e) => {
      e.stopPropagation();
      const A = window.PetWeatherAreas;
      const truth = document.getElementById("weather-saved-truth");
      if (truth && A) truth.textContent = A.SAVED_HERE_HELD;
    });
  }
  const hereBtn = document.getElementById("weather-here");
  if (hereBtn) {
    hereBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const A = window.PetWeatherAreas;
      if (!A) return;
      const gate = A.locateGate(card, false);
      if (gate.act === "keep") {
        keepTyped(gate);
        return;
      }
      const truth = document.getElementById("weather-here-truth");
      if (truth) truth.textContent = "";
      showHereAsk(true);
    });
  }
  const hereYes = document.getElementById("weather-here-yes");
  if (hereYes) {
    hereYes.addEventListener("click", (e) => {
      e.stopPropagation();
      const A = window.PetWeatherAreas;
      if (!A) return;
      const gate = A.locateGate(card, true);
      if (gate.act !== "locate") {
        if (window.PetPresence && window.PetPresence.holdWeatherLocate) window.PetPresence.holdWeatherLocate();
        if (gate.act === "keep") keepTyped(gate);
        else showHereAsk(false);
        return;
      }
      showHereAsk(false);
      if (window.PetPresence && window.PetPresence.noteWeatherLocateYes) window.PetPresence.noteWeatherLocateYes();
      sendLiveFix();
    });
  }
  const hereNo = document.getElementById("weather-here-no");
  if (hereNo) {
    hereNo.addEventListener("click", (e) => {
      e.stopPropagation();
      const A = window.PetWeatherAreas;
      const truth = document.getElementById("weather-here-truth");
      if (window.PetPresence && window.PetPresence.holdWeatherLocate) window.PetPresence.holdWeatherLocate();
      showHereAsk(false);
      if (truth && A) truth.textContent = A.HERE_HELD;
    });
  }
}
if (newsPlate) {
  function applyNewsHouse(house) {
    Object.assign(card, window.PetNews.toCardPatch(house));
    persistCard();
    fetchNews();
  }
  newsPlate.addEventListener("click", (e) => {
    const toggle = closestTarget(e, "#news-toggle");
    if (toggle) {
      e.stopPropagation();
      if (plateSkipToggle) {
        plateSkipToggle = false;
        return;
      }
      const body = document.getElementById("news-body");
      if (body) {
        body.hidden = !body.hidden;
        const open = !body.hidden;
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        if (open) fetchNews();
        // Repaint either way: the header drops or brings back "open to see headlines".
        paintHousePlates();
      }
      return;
    }
    if (!window.PetNews) return;
    const tabBtn = closestTarget(e, "[data-news-tab]");
    if (tabBtn) {
      e.stopPropagation();
      applyNewsHouse(window.PetNews.pickTab(card, tabBtn.getAttribute("data-news-tab")));
      return;
    }
    const chip = closestTarget(e, "[data-news-chip]");
    if (chip) {
      e.stopPropagation();
      const name = chip.getAttribute("data-news-chip");
      applyNewsHouse(window.PetNews.addTopic(card, { name, query: name }));
      return;
    }
    const pick = closestTarget(e, "[data-news-pick]");
    if (pick) {
      e.stopPropagation();
      applyNewsHouse(window.PetNews.pickTopic(card, pick.getAttribute("data-news-pick")));
      return;
    }
    const del = closestTarget(e, "[data-news-del]");
    if (del) {
      e.stopPropagation();
      applyNewsHouse(window.PetNews.removeTopic(card, del.getAttribute("data-news-del")));
      return;
    }
    const move = closestTarget(e, "[data-news-move]");
    if (move) {
      e.stopPropagation();
      applyNewsHouse(window.PetNews.moveTopic(card, move.getAttribute("data-news-move"), Number(move.getAttribute("data-dir") || 1)));
      return;
    }
    const favTopic = closestTarget(e, "[data-news-fav-topic]");
    if (favTopic) {
      e.stopPropagation();
      const id = favTopic.getAttribute("data-news-fav-topic");
      const prefs = window.PetNews.parseNewsPrefs(card);
      const row = prefs.topics.find((t) => t.id === id);
      if (row) applyNewsHouse(window.PetNews.toggleFavorite(card, { kind: "topic", id: row.id, name: row.name, query: row.query }));
      return;
    }
    const favHeadline = closestTarget(e, "[data-news-fav-headline]");
    if (favHeadline) {
      e.stopPropagation();
      applyNewsHouse(
        window.PetNews.toggleFavorite(card, {
          kind: "headline",
          title: decodeURIComponent(favHeadline.getAttribute("data-news-fav-headline") || ""),
          url: decodeURIComponent(favHeadline.getAttribute("data-url") || ""),
          summary: decodeURIComponent(favHeadline.getAttribute("data-summary") || ""),
        }),
      );
      return;
    }
    const unfav = closestTarget(e, "[data-news-unfav]");
    if (unfav) {
      e.stopPropagation();
      applyNewsHouse(window.PetNews.removeFavorite(card, unfav.getAttribute("data-news-unfav")));
    }
  });
  newsPlate.addEventListener("submit", (e) => {
    if (!e.target || e.target.id !== "news-add" || !window.PetNews) return;
    e.preventDefault();
    e.stopPropagation();
    const q = /** @type {HTMLInputElement | null} */ (document.getElementById("news-q"));
    const text = q && q.value;
    if (!String(text || "").trim()) return;
    applyNewsHouse(window.PetNews.addTopic(card, { name: text, query: text }));
    if (q) q.value = "";
  });
}
if (marketPlate) {
  function applyMarketHouse(house) {
    Object.assign(card, window.PetMarket.toCardPatch(house));
    persistCard();
    fetchMarket();
  }
  marketPlate.addEventListener("click", (e) => {
    const toggle = closestTarget(e, "#market-toggle");
    if (toggle) {
      e.stopPropagation();
      if (plateSkipToggle) {
        plateSkipToggle = false;
        return;
      }
      const body = document.getElementById("market-body");
      if (body) {
        body.hidden = !body.hidden;
        const open = !body.hidden;
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        if (open) fetchMarket();
      }
      return;
    }
    if (!window.PetMarket) return;
    const pick = closestTarget(e, "[data-ticker-pick]");
    if (pick) {
      e.stopPropagation();
      applyMarketHouse(window.PetMarket.pickTicker(card, pick.getAttribute("data-ticker-pick")));
      return;
    }
    const tickerFav = closestTarget(e, "[data-ticker-fav]");
    if (tickerFav) {
      e.stopPropagation();
      applyMarketHouse(window.PetMarket.toggleFavoriteTicker(card, tickerFav.getAttribute("data-ticker-fav")));
      return;
    }
    const nftFav = closestTarget(e, "[data-nft-fav]");
    if (nftFav) {
      e.stopPropagation();
      applyMarketHouse(window.PetMarket.toggleFavoriteNft(card, nftFav.getAttribute("data-nft-fav")));
      return;
    }
    const del = closestTarget(e, "[data-ticker-del]");
    if (del) {
      e.stopPropagation();
      applyMarketHouse(window.PetMarket.removeTicker(card, del.getAttribute("data-ticker-del")));
      return;
    }
    const move = closestTarget(e, "[data-ticker-move]");
    if (move) {
      e.stopPropagation();
      applyMarketHouse(window.PetMarket.moveTicker(card, move.getAttribute("data-ticker-move"), Number(move.getAttribute("data-dir") || 1)));
      return;
    }
    const nftPick = closestTarget(e, "[data-nft-pick]");
    if (nftPick) {
      e.stopPropagation();
      applyMarketHouse(window.PetMarket.pickNft(card, nftPick.getAttribute("data-nft-pick")));
      return;
    }
    const nftDel = closestTarget(e, "[data-nft-del]");
    if (nftDel) {
      e.stopPropagation();
      applyMarketHouse(window.PetMarket.removeNft(card, nftDel.getAttribute("data-nft-del")));
      return;
    }
    const nftMove = closestTarget(e, "[data-nft-move]");
    if (nftMove) {
      e.stopPropagation();
      applyMarketHouse(window.PetMarket.moveNft(card, nftMove.getAttribute("data-nft-move"), Number(nftMove.getAttribute("data-dir") || 1)));
      return;
    }
    const mpDel = closestTarget(e, "[data-mp-del]");
    if (mpDel) {
      e.stopPropagation();
      applyMarketHouse(window.PetMarket.removeMarketplace(card, mpDel.getAttribute("data-mp-del")));
      return;
    }
    const mpMove = closestTarget(e, "[data-mp-move]");
    if (mpMove) {
      e.stopPropagation();
      applyMarketHouse(window.PetMarket.moveMarketplace(card, mpMove.getAttribute("data-mp-move"), Number(mpMove.getAttribute("data-dir") || 1)));
      return;
    }
    const mpAdd = closestTarget(e, "[data-mp-add]");
    if (mpAdd) {
      e.stopPropagation();
      applyMarketHouse(window.PetMarket.addMarketplace(card, mpAdd.getAttribute("data-mp-add")));
      return;
    }
    const hit = closestTarget(e, "[data-coin-hit]");
    if (hit) {
      e.stopPropagation();
      try {
        const raw = JSON.parse(hit.getAttribute("data-coin-hit") || "null");
        applyMarketHouse(window.PetMarket.addTicker(card, raw));
        const hits = document.getElementById("market-hits");
        if (hits) { hits.hidden = true; hits.replaceChildren(); }
      } catch {}
      return;
    }
    const nftHit = closestTarget(e, "[data-nft-hit]");
    if (nftHit) {
      e.stopPropagation();
      try {
        const raw = JSON.parse(nftHit.getAttribute("data-nft-hit") || "null");
        applyMarketHouse(window.PetMarket.addNft(card, raw));
        const hits = document.getElementById("nft-hits");
        if (hits) { hits.hidden = true; hits.replaceChildren(); }
      } catch {}
    }
  });
  marketPlate.addEventListener("submit", (e) => {
    if (!window.PetMarket) return;
    if (e.target && e.target.id === "market-add") {
      e.preventDefault();
      e.stopPropagation();
      const q = /** @type {HTMLInputElement | null} */ (document.getElementById("market-q"));
      const truth = document.getElementById("market-truth");
      const hits = document.getElementById("market-hits");
      const typed = q && q.value;
      const contract = window.PetMarket.detectContract(typed);
      // Coins pane forces crypto resolve even if classify once guessed stock.
      const next = contract
        ? window.PetMarket.parseTicker(typed)
        : window.PetMarket.parseTicker({ symbol: typed, kind: "crypto", query: typed });
      if (contract && next) {
        applyMarketHouse(window.PetMarket.addTicker(card, next));
        if (q) q.value = "";
        if (truth) truth.textContent = "";
        if (hits) { hits.hidden = true; hits.replaceChildren(); }
        return;
      }
      // Known majors (CRYPTO map) already carry geckoId — add immediately.
      if (next && next.geckoId) {
        applyMarketHouse(window.PetMarket.addTicker(card, next));
        if (q) q.value = "";
        if (truth) truth.textContent = "";
        if (hits) { hits.hidden = true; hits.replaceChildren(); }
        return;
      }
      // Free-typed new tickers (PEPE / WIF / …): CoinGecko search → best match → crypto watch list.
      const look = document.getElementById("market-look-net");
      const lookLine = window.PetMarket.QUOTE_LOOK || "";
      if (look && lookLine) look.textContent = lookLine;
      if (!window.PetMarket.quoteLookMaySend || !window.PetMarket.quoteLookMaySend(plateLineInView("market-body", "market-look-net", lookLine))) return;
      if (!window.PetMarket.searchUrl(typed)) {
        if (truth) truth.textContent = "type a coin, ticker, or contract";
        return;
      }
      if (truth) truth.textContent = window.PetMarket.SEARCHING || "searching…";
      const door = window.desk && window.desk.marketSearch;
      const work = door
        ? door(String(typed || ""), lookLine).then((res) => {
            const row = fromDesk(res);
            if (row.held) return null;
            return row;
          })
        : window.PetMarket.readQuoteSearch(lookLine, typed).then((json) =>
            json == null
              ? null
              : {
                  coins: window.PetMarket.parseSearchCoins(json),
                  nfts: window.PetMarket.parseSearchNfts(json),
                },
          );
      work
        .then((res) => {
          if (!res) return;
          const coins = res.coins || [];
          const best = window.PetMarket.pickBestSearchCoin
            ? window.PetMarket.pickBestSearchCoin(coins, typed)
            : coins[0] || null;
          if (!best) {
            if (truth) truth.textContent = "no coin from that look-up — try a mint or contract";
            if (hits) { hits.hidden = true; hits.replaceChildren(); }
            return;
          }
          applyMarketHouse(window.PetMarket.addTicker(card, { ...best, kind: "crypto" }));
          if (q) q.value = "";
          if (truth) truth.textContent = "";
          if (hits) {
            hits.hidden = false;
            hits.replaceChildren();
            for (const row of coins) {
              const li = document.createElement("li");
              const btn = document.createElement("button");
              btn.type = "button";
              btn.dataset.hit = "1";
              btn.dataset.coinHit = JSON.stringify(row);
              btn.textContent = (row.id === best.id ? "Added " : "Add ") + row.symbol + " · " + row.name;
              li.appendChild(btn);
              hits.appendChild(li);
            }
          }
        })
        .catch(() => {
          if (truth) truth.textContent = window.PetMarket.CANT_REACH;
        });
      return;
    }
    if (e.target && e.target.id === "nft-add") {
      e.preventDefault();
      e.stopPropagation();
      const q = /** @type {HTMLInputElement | null} */ (document.getElementById("nft-q"));
      const truth = document.getElementById("nft-truth");
      const hits = document.getElementById("nft-hits");
      const typed = q && q.value;
      const look = document.getElementById("market-look-net");
      const lookLine = window.PetMarket.QUOTE_LOOK || "";
      if (look && lookLine) look.textContent = lookLine;
      if (!window.PetMarket.quoteLookMaySend || !window.PetMarket.quoteLookMaySend(plateLineInView("market-body", "market-look-net", lookLine))) return;
      if (!window.PetMarket.searchUrl(typed)) {
        if (truth) truth.textContent = "type a collection name";
        return;
      }
      if (truth) truth.textContent = window.PetMarket.SEARCHING || "searching…";
      const door = window.desk && window.desk.marketSearch;
      const work = door
        ? door(String(typed || ""), lookLine).then((res) => {
            const row = fromDesk(res);
            if (row.held) return null;
            return row;
          })
        : window.PetMarket.readQuoteSearch(lookLine, typed).then((json) =>
            json == null
              ? null
              : {
                  coins: window.PetMarket.parseSearchCoins(json),
                  nfts: window.PetMarket.parseSearchNfts(json),
                },
          );
      work
        .then((res) => {
          if (!res) return;
          const nfts = res.nfts || [];
          if (!nfts.length) {
            // fall back: treat typed text as gecko id
            const direct = window.PetMarket.parseNftRow(typed);
            if (direct) {
              applyMarketHouse(window.PetMarket.addNft(card, direct));
              if (q) q.value = "";
              if (truth) truth.textContent = "";
              return;
            }
            if (truth) truth.textContent = "no collection from that look-up";
            if (hits) { hits.hidden = true; hits.replaceChildren(); }
            return;
          }
          if (truth) truth.textContent = "";
          if (!hits) return;
          hits.hidden = false;
          hits.replaceChildren();
          for (const row of nfts) {
            const li = document.createElement("li");
            const btn = document.createElement("button");
            btn.type = "button";
            btn.dataset.hit = "1";
            btn.dataset.nftHit = JSON.stringify(row);
            btn.textContent = "Add " + (row.symbol || row.name) + " · " + row.name;
            li.appendChild(btn);
            hits.appendChild(li);
          }
        })
        .catch(() => {
          if (truth) truth.textContent = window.PetMarket.CANT_REACH;
        });
    }
  });
}
function bindPlateToggleDrag(toggleId, key) {
  const toggle = document.getElementById(toggleId);
  if (!toggle) return;
  toggle.addEventListener("pointerdown", (e) => {
    if (e.button === 2) return;
    e.stopPropagation();
    try { toggle.setPointerCapture(e.pointerId); } catch {}
    platePress = { key, x: e.clientX, y: e.clientY };
    plateDrag = null;
    plateSkipToggle = false;
    setClickable(true);
  });
}
bindPlateToggleDrag("weather-toggle", "weather");
bindPlateToggleDrag("news-toggle", "news");
bindPlateToggleDrag("market-toggle", "market");
document.addEventListener("input", (e) => {
  const t = e.target;
  if (!t || !t.getAttribute || !t.getAttribute("data-plate-color")) return;
  const key = t.getAttribute("data-plate-key");
  const which = t.getAttribute("data-plate-color");
  if (!key || !which) return;
  persistPlateColors(key, { [which]: t.value });
});
document.addEventListener("click", (e) => {
  const sw = closestTarget(e, "[data-plate-swatch]");
  if (!sw) return;
  const key = sw.getAttribute("data-plate-key");
  const id = sw.getAttribute("data-plate-swatch");
  if (!key || !id) return;
  e.stopPropagation();
  persistPlateSwatch(key, id);
});
window.addEventListener("resize", () => {
  sim.x = clamp(sim.x, PAD, Math.max(PAD, window.innerWidth - BASE - PAD));
  paintMess();
  if (window.PetDeskPlates) {
    deskPlates = window.PetDeskPlates.loadPlates(window.innerWidth, window.innerHeight);
    paintPlates();
  }
});
document.addEventListener("visibilitychange", () => {
  tickLife();
});

window.desk?.onCommand((cmd) => {
  if (cmd && typeof cmd === "object" && cmd.type === "open-care") {
    openCareFromNotify(cmd);
    return;
  }
  if (cmd && typeof cmd === "object" && cmd.type === "clock-note") {
    showClockNote(cmd);
    return;
  }
  if (cmd && typeof cmd === "object" && cmd.type === "open-card") {
    // Tray or pet menu "Keeper card": open it and hand it the keyboard, focus on its first control.
    openKeeperCard();
    paintHud();
    cardKeys(true, { focusFirst: true });
    return;
  }
  handle(cmd);
});
window.desk?.onSwitch((key) => switchTo(key));
window.desk?.onWindows((list) => {
  deskWindows = Array.isArray(list) ? list : [];
});

setInterval(() => {
  if (document.hidden || !kind || !life) return;
  tickLife();
  if (performance.now() < speechUntil || life.hidden) return;
  const held = window.PetLife?.wanderWhileAsleep(life) || window.PetCard?.wanderWhileAsleep(life?.asleep);
  if (sim.play || sim.trick || sim.happy) return;
  if (sim.cmd === "seek" || sim.cmd === "eat" || sim.anim === "eat" || sim.thankYou) return;
  if (held) {
    issue(held.cmd);
    return;
  }
  const skyMood = window.PetWeather?.weatherIdle(kind.key, skyOf());
  if (skyMood && Math.random() < 0.45) {
    issue(skyMood);
    return;
  }
  const roll = Math.random();
  if (kind.key === "red_panda") {
    if (roll < (trait?.wander ?? 0.45) || (life.energy < 8 && roll < 0.7)) issue("wander");
    else if (roll < 0.84) issue("wander");
    else if (roll < 0.92 && trait?.special) handle("special");
    else {
      say(lineFrom({ useRoster: "ambient" }));
      issue("talk");
    }
    return;
  }
  if (roll < (trait?.wander ?? 0.45) || (life.energy < 8 && roll < 0.7)) issue("wander");
  else if (roll < 0.7) issue("sit");
  else if (roll < 0.84) issue("idle");
  else if (roll < 0.92 && trait?.special) handle("special");
  else {
    say(lineFrom({ useRoster: "ambient" }));
    issue("talk");
  }
}, 5600);
setInterval(() => {
  if (document.hidden) return;
  if (kind) tickLife();
}, 20_000);
setInterval(() => {
  if (document.hidden) return;
  fetchNews();
  fetchMarket();
}, 20 * 60 * 1000);
// The keeper clock keeps looking while the overlay is hidden (Hide the window, a tray click).
// clockSince is the last look, so an alarm minute that passed during a slow tick or a sleeping
// computer still rings once, and a timer rings when it ends. A hidden overlay also gets a notification.
let clockSince = Date.now();
setInterval(() => {
  if (!kind || !window.PetCard) return;
  const now = Date.now();
  const since = clockSince;
  clockSince = now;
  if (!document.hidden) {
    const sky = skyOf();
    if ((sky === "rain" || sky === "wind") && Math.random() < 0.55) playSound(sky);
  }
  const tick = window.PetCard.clockTick(cardGuest(), now, since);
  if (!tick.changed) return;
  card = window.PetCard.setGuest(card, kind.key, { alarm: tick.alarm, timer: tick.timer });
  persistCard();
  if (!tick.rang) return;
  const plain = tick.rang === "alarm" ? "The clock asked." : "The timer is done.";
  const named = window.PetCard.lineById(card, kind.key, tick.lineId);
  playHouseLine(named || { text: plain, kind: "say" });
  if (document.hidden) window.desk?.notify(window.PetCard.clockNote(tick.rang, kind.name, kind.key, named));
}, 1000);

window.PetRoster.loadHouseRoster(window.desk).then((opened) => {
  if (!opened.ok) {
    say("The house could not find the roster.");
    return;
  }
  roster = opened.roster;
  let start = "red_panda";
  try {
    start = localStorage.getItem(STORE_KIND) || start;
  } catch {
    /* ignore */
  }
  switchTo(start);
  paintWeather();
  fetchWeather();
  fetchNews();
  fetchMarket();
  sitMusic();
  sitSleepAid();
  sitPlants();
  sitPlates();
  if (!(kind && window.PetBirdFly && kind.key === window.PetBirdFly.FLY_BIRD_KEY)) callSip();
  if (!(kind && window.PetRobinFly && kind.key === window.PetRobinFly.ROBIN_KEY)) callRobin();
  requestAnimationFrame(tick);
});

/* Buffffff GUI harness — only when main loads index.html?gui_harness=1 */
(function bindGuiHarness() {
  try {
    if (!/[?&]gui_harness=1(?:&|$)/.test(String(location.search || ""))) return;
  } catch (_) {
    return;
  }
  function snapshot() {
    const dots = giftRoot ? giftRoot.querySelectorAll(".gift-dot, .shed-dot").length : 0;
    const choiceIds = choiceEl
      ? [...choiceEl.querySelectorAll("button")].map((b) => (b.textContent || "").trim().toLowerCase())
      : [];
    return {
      kind: kind ? kind.key : null,
      name: kind ? kind.name : null,
      petSrc: !!(pet && pet.dataset && pet.dataset.frame),
      petSurface: pet && pet.dataset ? pet.dataset.surface || "" : "",
      collapsed: !!(card && card.collapsed),
      hudShow: !!(hud && hud.classList.contains("show")),
      hudCollapsedAttr: hud ? hud.dataset.collapsed || "" : "",
      hudName: hudName ? String(hudName.textContent || "") : "",
      vital: hudVital ? String(hudVital.textContent || "") : "",
      gifts: life && life.gifts ? life.gifts.length : 0,
      giftDots: dots,
      choiceOpen: !!choiceOpen,
      choiceButtonCount: choiceEl ? choiceEl.querySelectorAll("button").length : 0,
      choiceHasClose: choiceIds.some((id) => id === "close"),
      choiceHasExit: choiceIds.some((id) => id === "exit"),
      hostX: Number.isFinite(sim.x) ? sim.x : null,
      hostHit: !!(pet && pet.hasAttribute("data-hit")),
      hostRect: (() => {
        if (!pet) return null;
        const r = pet.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      })(),
    };
  }
  window.PetGuiHarness = {
    snapshot,
    openHostChoice() {
      openKeeperCard();
      paintHud();
      openChoice({ role: "host" });
      return snapshot();
    },
    pick(id) {
      pickChoice(id);
      paintHud();
      return snapshot();
    },
    collapse() {
      collapseKeeperCard();
      paintHud();
      return snapshot();
    },
    openCard() {
      openKeeperCard();
      paintHud();
      return snapshot();
    },
    placeGift() {
      if (!life || !window.PetLife || !window.PetLife.leaveGift) return snapshot();
      if (life.bond < 25) life.bond = 40;
      if (!life.gifts) life.gifts = [];
      life = window.PetLife.leaveGift(life, Date.now());
      persist();
      paintGifts();
      paintHud();
      return snapshot();
    },
    placeHostAt(x) {
      const maxX = Math.max(PAD, window.innerWidth - BASE - PAD);
      const next = clamp(Number(x), PAD, maxX);
      sim.x = next;
      sim.target = null;
      sim.dragging = false;
      sim.pointerStart = null;
      sim.anim = "idle";
      sim.land = 0;
      sim.settle = 0;
      pet.style.transform = "translate3d(" + sim.x + "px, 0, 0) scale(" + (sim.facing || 1) + ", 1)";
      const snap = snapshot();
      const r = snap.hostRect;
      const hitOk = !!(snap.hostHit && r && r.width >= 2 && r.height >= 2);
      const near = !!(r && Math.abs(r.x - sim.x) < 48);
      return Object.assign(snap, {
        hostX: sim.x,
        hostHit: hitOk,
        hostNear: near,
        hostPlaced: hitOk && snap.hostX === next,
      });
    },
    clickGiftDot() {
      const el = giftRoot && giftRoot.querySelector(".gift-dot, .shed-dot");
      if (el) el.click();
      paintHud();
      return snapshot();
    },
  };
})();
