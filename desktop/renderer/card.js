/** Keeper-card desk controls. Same truth as the web card. Persist on the machine. */
(function (root) {
  if (!root.PetWeatherAreas && typeof require === "function") {
    try {
      root.PetWeatherAreas = require("./weather-areas.js");
    } catch {
      /* the overlay script tag loads weather-areas.js first */
    }
  }
  const STORE = "computerpets.card.v1";
  const MAX_LINES = 12;
  const LINE_CHARS = 140;

  const COLORS = [
    { id: "ink", name: "Ink" },
    { id: "blotter", name: "Blotter" },
    { id: "moss", name: "Moss" },
    { id: "ember", name: "Ember" },
    { id: "dusk", name: "Dusk" },
    { id: "frost", name: "Frost" },
  ];

  /** House-voice names. Rui prefers his cry; system speech is backup. */
  const VOICE_STYLES = [
    { id: "hearth", name: "Hearth", rate: 0.82, pitch: 0.88 },
    { id: "hush", name: "Hush", rate: 0.8, pitch: 1.02 },
    { id: "even", name: "Even", rate: 0.92, pitch: 1 },
    { id: "low", name: "Low", rate: 0.84, pitch: 0.76 },
    { id: "bright", name: "Bright", rate: 0.98, pitch: 1.1 },
  ];

  const MUTE_BUSES = ["talk", "special", "weather", "treats", "steps", "music"];
  const SOUND_BUS = {
    chirp: "talk",
    hop: "special",
    munch: "treats",
    rain: "weather",
    wind: "weather",
    step: "steps",
    voice: "talk",
    call: "talk",
    music: "music",
    radio: "music",
    sleep: "music",
  };

  const HUMAN_VOICE = /aria|jenny|guy|davis|natural|neural|online|samantha|daniel|karen|moira|zira|david|mark|hazel|susan|google us english|microsoft/i;
  const PREFER_VOICE = /neural|natural|online/i;
  const ROBOT_VOICE = /compact|bad news|good news|hysterical|zarvox|trinoids|boing|bubbles|albert|whisper|princess|junior|cellos|organ|bells|pipe|robot|novelty|eddy|reed|shelley|grandpa|grandma|superstar|bahh|deranged|wobble|kathy|fred|ralph|bruce|agnes|espeak|festival/i;

  const VOICE_TRUTH = "Rui, Soot, Wedge, Heart, Hook, Dee, Brick, Drake, Vee, Drum, Sip, Echo, Peck, Quill, Keel, Ember, Miso, Pip, Thimble, Clip, Whee, Ink, Coin, Rue, Wick, Burr, Floss, Bloom, Vesper, Nori, Saffron, Bandit, Jade, Bluff, Sash, Lula, Coral, Blush, Atlas, Cup, Sepia, Chamber, Pulse, Ochre, Tenant, Ledger, Anchor, Kite, Door, Felt, Vein, Fan, Mast, Disk, Moth, Arm, Snap, Well, Dew, Comb, Milk, Ghost, Spark, Dart, Twig, Column, Seven, Fold, Brood, Wax, Frill, Cap, Lattice, Horn, Ring, Mane, Puff, Flame, Starter, Pact, Gleam, Choir, Drift, Shard, Dusk, Knot, Brine, Beacon, Hush, Arca, Reed, Pebble, Eft, Dapple, Slip, Pinch, Whorl, Hinge, Latch, Prickle, Boot, Reach, Spot, Orb, Pane, Hold, Loom, and Leap talk with house cry first; system speech is the backup.";
  const QUIT_TRUTH = "Turns the overlay off. Start again with .\\desktop.ps1.";
  const SLEEP_WAKES = ["talk", "play", "eat", "seek", "leave", "enter", "call", "feed", "snack", "hide", "wander"];

  function blankMutes() {
    return { talk: false, special: false, weather: false, treats: false, steps: false, music: false };
  }

  function blankAlarm() {
    return { on: false, hour: 7, minute: 0, lineId: "", lastRingDay: "" };
  }

  function blankTimer() {
    return { running: false, remainingMs: 0, endsAt: 0, lineId: "", durationMs: 5 * 60 * 1000 };
  }

  function blankGuest() {
    return { volume: 80, lines: [], alarm: blankAlarm(), timer: blankTimer(), stepKind: "" };
  }

  function blankCard() {
    return {
      collapsed: true,
      color: "ink",
      voiceStyle: "hearth",
      mutes: blankMutes(),
      off: false,
      pets: {},
      weatherAreas: [],
      currentAreaId: null,
      weatherTab: "current",
      favoriteAreaIds: [],
      hereForecastAck: null,
      newsPrefs: [],
      currentNewsId: "world",
      newsTab: "popular",
      newsFavorites: [],
      marketTickers: [],
      currentTickerId: null,
      nftCollections: [],
      currentNftId: null,
      nftMarketplaces: [],
      marketCustomized: false,
      nftCustomized: false,
      marketplaceCustomized: false,
      favoriteTickerIds: [],
      favoriteNftIds: [],
      stepKind: "species",
      music: { plugin: "off", stationId: "", stationName: "", stationUrl: "", playing: false },
      sleepAid: { plugin: "off", playing: false },
    };
  }

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, Math.round(Number(n) || 0)));
  }

  function colorId(id) {
    return COLORS.some((c) => c.id === id) ? id : "ink";
  }

  function styleId(id) {
    return VOICE_STYLES.some((s) => s.id === id) ? id : "hearth";
  }

  function parseMutes(raw) {
    const next = blankMutes();
    if (!raw || typeof raw !== "object") return next;
    for (const bus of MUTE_BUSES) next[bus] = !!raw[bus];
    return next;
  }

  function parseAlarm(raw) {
    const next = blankAlarm();
    if (!raw || typeof raw !== "object") return next;
    next.on = !!raw.on;
    next.hour = clamp(raw.hour, 0, 23);
    next.minute = clamp(raw.minute, 0, 59);
    next.lineId = typeof raw.lineId === "string" ? raw.lineId : "";
    next.lastRingDay = typeof raw.lastRingDay === "string" ? raw.lastRingDay : "";
    return next;
  }

  function parseTimer(raw) {
    const next = blankTimer();
    if (!raw || typeof raw !== "object") return next;
    next.running = !!raw.running;
    next.remainingMs = Math.max(0, Math.round(Number(raw.remainingMs) || 0));
    next.endsAt = Math.max(0, Math.round(Number(raw.endsAt) || 0));
    next.lineId = typeof raw.lineId === "string" ? raw.lineId : "";
    next.durationMs = Math.max(1000, Math.round(Number(raw.durationMs) || next.durationMs));
    return next;
  }

  function parseLine(raw) {
    if (!raw || typeof raw !== "object") return null;
    const text = clipLine(raw.text);
    if (!text) return null;
    const id = typeof raw.id === "string" && raw.id ? raw.id : `l-${Math.abs(hash(text))}`;
    const kind = raw.kind === "do" ? "do" : "say";
    return { id, text, kind };
  }

  function parseGuest(raw) {
    const next = blankGuest();
    if (!raw || typeof raw !== "object") return next;
    next.volume = clamp(raw.volume, 0, 100);
    next.lines = Array.isArray(raw.lines) ? raw.lines.map(parseLine).filter(Boolean).slice(0, MAX_LINES) : [];
    next.alarm = parseAlarm(raw.alarm);
    next.timer = parseTimer(raw.timer);
    next.stepKind = typeof raw.stepKind === "string" ? raw.stepKind : "";
    return next;
  }

  function parseCard(raw) {
    const next = blankCard();
    if (!raw || typeof raw !== "object") return next;
    next.collapsed = !!raw.collapsed;
    next.color = colorId(raw.color);
    next.voiceStyle = styleId(raw.voiceStyle);
    next.mutes = parseMutes(raw.mutes);
    next.off = !!raw.off;
    next.pets = {};
    if (raw.pets && typeof raw.pets === "object") {
      for (const [key, value] of Object.entries(raw.pets)) {
        if (typeof key === "string" && key) next.pets[key] = parseGuest(value);
      }
    }
    const areas = root.PetWeatherAreas ? root.PetWeatherAreas.parseAreas(raw) : { areas: [], currentId: null, tab: "current", favoriteIds: [] };
    next.weatherAreas = areas.areas;
    next.currentAreaId = areas.currentId;
    next.weatherTab = areas.tab || "current";
    next.favoriteAreaIds = areas.favoriteIds || [];
    next.hereForecastAck = root.PetWeatherAreas && typeof root.PetWeatherAreas.stickHereForecastAck === "function"
      ? root.PetWeatherAreas.stickHereForecastAck(raw, raw.hereForecastAck)
      : null;
    const news = root.PetNews ? root.PetNews.parseNewsPrefs(raw) : { topics: [{ id: "world", name: "World", query: "" }], currentId: "world", tab: "popular", favorites: [] };
    next.newsPrefs = news.topics;
    next.currentNewsId = news.currentId;
    next.newsTab = news.tab || "popular";
    next.newsFavorites = news.favorites || [];
    const market = root.PetMarket
      ? root.PetMarket.parseMarket(raw)
      : { tickers: [], currentId: null, nfts: [], currentNftId: null, marketplaces: [] };
    next.marketTickers = market.tickers;
    next.currentTickerId = market.currentId;
    next.nftCollections = market.nfts || [];
    next.currentNftId = market.currentNftId || null;
    next.nftMarketplaces = market.marketplaces || [];
    next.marketCustomized = !!raw.marketCustomized || !!raw.tickersCustomized;
    next.nftCustomized = !!raw.nftCustomized || !!raw.nftsCustomized;
    next.marketplaceCustomized = !!raw.marketplaceCustomized || !!raw.nftMarketplaceCustomized;
    next.favoriteTickerIds = Array.isArray(raw.favoriteTickerIds) ? raw.favoriteTickerIds.filter((x) => typeof x === "string" && x).slice(0, 24) : [];
    next.favoriteNftIds = Array.isArray(raw.favoriteNftIds) ? raw.favoriteNftIds.filter((x) => typeof x === "string" && x).slice(0, 24) : [];
    next.stepKind = root.PetHouseSounds ? root.PetHouseSounds.parseStep(raw.stepKind) : "species";
    next.music = root.PetHouseMusic ? root.PetHouseMusic.parseMusic(raw.music) : { plugin: "off", stationId: "", stationName: "", stationUrl: "", playing: false };
    next.sleepAid = root.PetHouseSleep ? root.PetHouseSleep.parseSleepAid(raw.sleepAid) : { plugin: "off", playing: false };
    return next;
  }

  function hash(text) {
    let n = 0;
    for (let i = 0; i < text.length; i++) n = (n * 31 + text.charCodeAt(i)) | 0;
    return n;
  }

  function clipLine(text) {
    return String(text || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, LINE_CHARS);
  }

  function guestOf(card, key) {
    const house = parseCard(card);
    return parseGuest(house.pets[key]);
  }

  function setGuest(card, key, patch) {
    const house = parseCard(card);
    house.pets[key] = parseGuest({ ...guestOf(house, key), ...(patch || {}) });
    return house;
  }

  function addLine(card, key, text, kind) {
    const clipped = clipLine(text);
    if (!clipped) return parseCard(card);
    const guest = guestOf(card, key);
    const line = {
      id: `l-${Date.now().toString(36)}-${Math.abs(hash(clipped)).toString(36)}`,
      text: clipped,
      kind: kind === "do" ? "do" : "say",
    };
    guest.lines = [...guest.lines, line].slice(-MAX_LINES);
    return setGuest(card, key, guest);
  }

  function removeLine(card, key, id) {
    const guest = guestOf(card, key);
    guest.lines = guest.lines.filter((line) => line.id !== id);
    return setGuest(card, key, guest);
  }

  function lineById(card, key, id) {
    return guestOf(card, key).lines.find((line) => line.id === id) || null;
  }

  function dayKey(now = Date.now()) {
    const d = new Date(now);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function alarmDue(alarm, now = Date.now()) {
    const a = parseAlarm(alarm);
    if (!a.on) return false;
    const d = new Date(now);
    if (dayKey(now) === a.lastRingDay) return false;
    return d.getHours() === a.hour && d.getMinutes() === a.minute;
  }

  function markAlarmRang(alarm, now = Date.now()) {
    const a = parseAlarm(alarm);
    a.lastRingDay = dayKey(now);
    return a;
  }

  function startTimer(timer, durationMs, now = Date.now()) {
    const t = parseTimer(timer);
    const ms = Math.max(1000, Math.round(durationMs || t.durationMs || 60_000));
    t.running = true;
    t.durationMs = ms;
    t.remainingMs = ms;
    t.endsAt = now + ms;
    return t;
  }

  function stopTimer(timer, now = Date.now()) {
    const t = parseTimer(timer);
    if (t.running && t.endsAt) t.remainingMs = Math.max(0, t.endsAt - now);
    t.running = false;
    t.endsAt = 0;
    return t;
  }

  function timerTick(timer, now = Date.now()) {
    const t = parseTimer(timer);
    if (!t.running) return { timer: t, rang: false };
    const left = Math.max(0, t.endsAt - now);
    t.remainingMs = left;
    if (left <= 0) {
      t.running = false;
      t.endsAt = 0;
      t.remainingMs = 0;
      return { timer: t, rang: true };
    }
    return { timer: t, rang: false };
  }

  function formatRemain(ms) {
    const total = Math.max(0, Math.round(ms / 1000));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function voiceStyleOf(id) {
    return VOICE_STYLES.find((s) => s.id === id) || VOICE_STYLES[0];
  }

  function voiceScore(voice) {
    const name = (voice && voice.name) || "";
    if (ROBOT_VOICE.test(name)) return -100;
    let score = 0;
    if (PREFER_VOICE.test(name)) score += 50;
    if (HUMAN_VOICE.test(name)) score += 20;
    const lang = (voice && voice.lang) || "";
    if (/en[-_]?US|English \(United States\)|Google US English/i.test(name + " " + lang)) score += 10;
    return score;
  }

  function pickSystemVoice(voices, styleId) {
    const list = Array.isArray(voices) ? voices.filter((v) => v && (v.name || v.voiceURI)) : [];
    if (!list.length) return null;
    const ranked = list
      .map((v) => ({ v, score: voiceScore(v) }))
      .filter((row) => row.score > -100)
      .sort((a, b) => b.score - a.score);
    if (ranked.length) return ranked[0].v;
    const pool = list.filter((v) => !ROBOT_VOICE.test(v.name || ""));
    return pool[0] || list[0] || null;
  }

  function prefersHouseCry(key) {
    return key === "red_panda" || key === "crow" || key === "raven" || key === "barn_owl" || key === "red_tail" || key === "chickadee" || key === "robin" || key === "mallard" || key === "canada_goose" || key === "pileated" || key === "hummingbird" || key === "budgie" || key === "penguin" || key === "parrot" || key === "toucan" || key === "iguana" || key === "phoenix" || key === "cat" || key === "dog" || key === "rabbit" || key === "hamster" || key === "guinea_pig" || key === "turtle" || key === "goldfish" || key === "fox" || key === "ferret" || key === "hedgehog" || key === "chinchilla" || key === "axolotl" || key === "dragon" || key === "ball_python" || key === "corn_snake" || key === "kingsnake" || key === "green_tree_python" || key === "hognose" || key === "garter" || key === "boa" || key === "milk_snake" || key === "rosy_boa" || key === "carpet_python" || key === "octopus" || key === "cuttlefish" || key === "nautilus" || key === "moon_jelly" || key === "sea_star" || key === "hermit_crab" || key === "horseshoe_crab" || key === "seahorse" || key === "manta" || key === "moray" || key === "moss" || key === "maidenhair" || key === "ginkgo" || key === "oak" || key === "water_lily" || key === "orchid" || key === "saguaro" || key === "venus_flytrap" || key === "pitcher" || key === "sundew" || key === "honeybee" || key === "monarch" || key === "bumblebee" || key === "sweat_bee" || key === "honey_drone" || key === "carpenter_bee" || key === "mason_bee" || key === "leafcutter" || key === "stingless" || key === "mining_bee" || key === "honey_queen" || key === "luna" || key === "firefly" || key === "darner" || key === "stick" || key === "carpenter_ant" || key === "ladybird" || key === "mantis" || key === "cicada" || key === "honeycomb" || key === "oyster" || key === "fly_agaric" || key === "morel" || key === "chanterelle" || key === "turkey_tail" || key === "lions_mane" || key === "puffball" || key === "chicken_of_woods" || key === "yeast" || key === "lichen" || key === "photovore" || key === "choir" || key === "nimbus" || key === "silica" || key === "terminator" || key === "nexus" || key === "halovore" || key === "magneton" || key === "umbral" || key === "cyst" || key === "frog" || key === "toad" || key === "newt" || key === "salamander" || key === "caecilian" || key === "crayfish" || key === "pond_snail" || key === "mussel" || key === "leech" || key === "stickleback" || key === "paramecium" || key === "amoeba" || key === "euglena" || key === "volvox" || key === "diatom" || key === "kelp" || key === "chlamydomonas" || key === "stentor" || key === "coli" || key === "haloarchaea" || key === "orb_weaver" || key === "jumping_spider" || key === "wolf_spider" || key === "tarantula" || key === "widow" || key === "harvestman" || key === "scorpion" || key === "vinegaroon" || key === "tick" || key === "solifuge" || key === "deer" || key === "bat" || key === "squirrel" || key === "otter" || key === "raccoon" || key === "skunk" || key === "opossum" || key === "beaver" || key === "porcupine" || key === "black_bear" || key === "capybara" || key === "gecko" || key === "anole" || key === "skink" || key === "chameleon" || key === "horned_lizard" || key === "alligator" || key === "crocodile" || key === "snapper" || key === "box_turtle" || key === "tuatara" || key === "bass" || key === "brook_trout" || key === "catfish" || key === "bluegill" || key === "perch" || key === "pike" || key === "walleye" || key === "paddlefish" || key === "lamprey" || key === "american_eel" || key === "house_centipede" || key === "millipede" || key === "pillbug" || key === "earthworm" || key === "velvet_worm" || key === "springtail" || key === "tardigrade" || key === "planarian" || key === "nematode" || key === "amphipod" || key === "fiddler_crab" || key === "ghost_crab" || key === "limpet" || key === "barnacle" || key === "chiton" || key === "periwinkle" || key === "sand_dollar" || key === "sea_urchin" || key === "knobbed_whelk" || key === "lugworm" || key === "field_cricket" || key === "katydid" || key === "grasshopper" || key === "swallowtail" || key === "jewelwing" || key === "lacewing" || key === "earwig" || key === "acorn_weevil" || key === "click_beetle" || key === "robber_fly" || key === "sloth" || key === "lemur" || key === "gibbon" || key === "kinkajou" || key === "colugo" || key === "flying_squirrel" || key === "howler" || key === "tarsier" || key === "potto" || key === "koala" || key === "brain_coral" || key === "anemone" || key === "clownfish" || key === "parrotfish" || key === "cleaner_shrimp" || key === "sea_cucumber" || key === "lionfish" || key === "giant_clam" || key === "eagle_ray" || key === "grouper" || key === "cyber_dragon" || key === "volt_dragon" || key === "trace_dragon" || key === "flux_dragon" || key === "spark_dragon" || key === "ion_dragon" || key === "gauss_dragon" || key === "relay_dragon" || key === "fuse_dragon" || key === "ground_dragon";
  }

  function speakOpts(styleId, volume) {
    const style = voiceStyleOf(styleId);
    const soft = style.id === "hearth" ? 0.92 : 1;
    return {
      rate: style.rate,
      pitch: style.pitch,
      volume: (clamp(volume, 0, 100) / 100) * soft,
    };
  }

  function busOf(kindName) {
    return SOUND_BUS[kindName] || null;
  }

  function isMuted(mutes, kindName) {
    const bus = busOf(kindName);
    if (!bus) return false;
    return !!parseMutes(mutes)[bus];
  }

  function sleepHolds(asleep, cmd) {
    if (!asleep) return false;
    return SLEEP_WAKES.indexOf(cmd) < 0;
  }

  function wanderWhileAsleep(asleep) {
    if (!asleep) return null;
    return { cmd: "sleep", pose: "sleep" };
  }

  function readRaw() {
    if (root.desk && root.desk.cardGet) {
      try {
        return root.desk.cardGet();
      } catch {
        /* fall through */
      }
    }
    try {
      if (!root.localStorage) return null;
      return JSON.parse(root.localStorage.getItem(STORE) || "null");
    } catch {
      return null;
    }
  }

  function load() {
    const raw = readRaw();
    const card = parseCard(raw);
    const areas = root.PetWeatherAreas;
    if (raw && areas && typeof areas.storedLivePinNeedsFuzz === "function" && areas.storedLivePinNeedsFuzz(raw)) {
      return save(card);
    }
    return card;
  }

  function save(next) {
    const card = parseCard(next);
    if (root.desk && root.desk.cardSet) root.desk.cardSet(card);
    try {
      root.localStorage.setItem(STORE, JSON.stringify(card));
    } catch {
      /* ignore */
    }
    return card;
  }

  const api = {
    STORE,
    MAX_LINES,
    LINE_CHARS,
    COLORS,
    VOICE_STYLES,
    MUTE_BUSES,
    SOUND_BUS,
    VOICE_TRUTH,
    QUIT_TRUTH,
    SLEEP_WAKES,
    blankCard,
    blankGuest,
    blankAlarm,
    blankTimer,
    parseCard,
    parseGuest,
    guestOf,
    setGuest,
    addLine,
    removeLine,
    lineById,
    clipLine,
    alarmDue,
    markAlarmRang,
    dayKey,
    startTimer,
    stopTimer,
    timerTick,
    formatRemain,
    voiceStyleOf,
    pickSystemVoice,
    prefersHouseCry,
    speakOpts,
    busOf,
    isMuted,
    sleepHolds,
    wanderWhileAsleep,
    load,
    save,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetCard = api;
})(typeof window !== "undefined" ? window : globalThis);
