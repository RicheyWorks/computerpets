/** Keeper-card desk controls. Same truth as the overlay card. Persist on the machine. */
import { parseAreas, stickHereForecastAck, storedLivePinNeedsFuzz, type HereForecastAck } from "./weather-areas.ts";
import { parseNewsPrefs } from "./news.ts";
import { parseMarket } from "./market.ts";
import { parseStep } from "./house-sounds.ts";
import { parseMusic } from "./house-music.ts";
import { parseSleepAid } from "./house-sleep.ts";

export const CARD_STORE = "computerpets.card.v1";
export const MAX_LINES = 12;
export const LINE_CHARS = 140;

export const CARD_COLORS = [
  { id: "ink" as const, name: "Ink" },
  { id: "blotter" as const, name: "Blotter" },
  { id: "moss" as const, name: "Moss" },
  { id: "ember" as const, name: "Ember" },
  { id: "dusk" as const, name: "Dusk" },
  { id: "frost" as const, name: "Frost" },
];

/** House-voice names. Rui prefers his cry; system speech is backup. */
export const VOICE_STYLES = [
  { id: "hearth" as const, name: "Hearth", rate: 0.82, pitch: 0.88 },
  { id: "hush" as const, name: "Hush", rate: 0.8, pitch: 1.02 },
  { id: "even" as const, name: "Even", rate: 0.92, pitch: 1 },
  { id: "low" as const, name: "Low", rate: 0.84, pitch: 0.76 },
  { id: "bright" as const, name: "Bright", rate: 0.98, pitch: 1.1 },
];

export const MUTE_BUSES = ["talk", "special", "weather", "treats", "steps", "music"] as const;
export const SOUND_BUS = {
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
} as const;

const HUMAN_VOICE = /aria|jenny|guy|davis|natural|neural|online|samantha|daniel|karen|moira|zira|david|mark|hazel|susan|google us english|microsoft/i;
const PREFER_VOICE = /neural|natural|online/i;
const ROBOT_VOICE = /compact|bad news|good news|hysterical|zarvox|trinoids|boing|bubbles|albert|whisper|princess|junior|cellos|organ|bells|pipe|robot|novelty|eddy|reed|shelley|grandpa|grandma|superstar|bahh|deranged|wobble|kathy|fred|ralph|bruce|agnes|espeak|festival/i;

export const VOICE_TRUTH = "Rui, Soot, Wedge, Heart, Hook, Dee, Brick, Drake, Vee, Drum, Sip, Echo, Peck, Quill, Keel, Ember, Miso, Pip, Thimble, Clip, Whee, Ink, Coin, Rue, Wick, Burr, Floss, Bloom, Vesper, Nori, Saffron, Bandit, Jade, Bluff, Sash, Lula, Coral, Blush, Atlas, Cup, Sepia, Chamber, Pulse, Ochre, Tenant, Ledger, Anchor, Kite, Door, Felt, Vein, Fan, Mast, Disk, Moth, Arm, Snap, Well, Dew, Comb, Milk, Ghost, Spark, Dart, Twig, Column, Seven, Fold, Brood, Wax, Frill, Cap, Lattice, Horn, Ring, Mane, Puff, Flame, Starter, Pact, Gleam, Choir, Drift, Shard, Dusk, Knot, Brine, Beacon, Hush, Arca, Reed, Pebble, Eft, Dapple, Slip, Pinch, Whorl, Hinge, Latch, Prickle, Boot, Reach, Spot, Orb, Pane, Hold, Loom, and Leap talk with house cry first; system speech is the backup.";
export const QUIT_TRUTH = "Turns the overlay off. Start again with .\\desktop.ps1.";
export const SLEEP_WAKES = ["talk", "play", "eat", "seek", "leave", "enter", "call", "feed", "snack", "hide", "wander"] as const;

export type CardColorId = (typeof CARD_COLORS)[number]["id"];
export type VoiceStyleId = (typeof VOICE_STYLES)[number]["id"];
export type MuteBus = (typeof MUTE_BUSES)[number];
export type SoundKind = keyof typeof SOUND_BUS;
export type SavedKind = "say" | "do";

export type SavedLine = { id: string; text: string; kind: SavedKind };
export type CardAlarm = { on: boolean; hour: number; minute: number; lineId: string; lastRingDay: string };
export type CardTimer = { running: boolean; remainingMs: number; endsAt: number; lineId: string; durationMs: number };
export type CardGuest = { volume: number; lines: SavedLine[]; alarm: CardAlarm; timer: CardTimer; stepKind: string };
export type CardMutes = Record<MuteBus, boolean>;
export type CardPrefs = {
  collapsed: boolean;
  color: CardColorId;
  voiceStyle: VoiceStyleId;
  mutes: CardMutes;
  off: boolean;
  pets: Record<string, CardGuest>;
  weatherAreas: Array<{ id: string; name: string; query: string; lat: number; lon: number }>;
  currentAreaId: string | null;
  weatherTab: string;
  favoriteAreaIds: string[];
  hereForecastAck: HereForecastAck | null;
  newsPrefs: Array<{ id: string; name: string; query: string }>;
  currentNewsId: string;
  newsTab: string;
  newsFavorites: Array<{ id: string; kind: string; title: string; url: string; summary: string; topicId: string; query: string }>;
  marketTickers: Array<{ id: string; symbol: string; kind: "stock" | "crypto"; geckoId: string; name: string; platform?: string; address?: string }>;
  currentTickerId: string | null;
  nftCollections: Array<{ id: string; geckoId: string; name: string; symbol: string }>;
  currentNftId: string | null;
  nftMarketplaces: Array<{ id: string; name: string; url: string; note: string }>;
  marketCustomized: boolean;
  nftCustomized: boolean;
  marketplaceCustomized: boolean;
  favoriteTickerIds: string[];
  favoriteNftIds: string[];
  stepKind: string;
  music: { plugin: string; stationId: string; stationName: string; stationUrl: string; playing: boolean };
  sleepAid: { plugin: string; playing: boolean };
};

export function blankMutes(): CardMutes {
  return { talk: false, special: false, weather: false, treats: false, steps: false, music: false };
}

export function blankAlarm(): CardAlarm {
  return { on: false, hour: 7, minute: 0, lineId: "", lastRingDay: "" };
}

export function blankTimer(): CardTimer {
  return { running: false, remainingMs: 0, endsAt: 0, lineId: "", durationMs: 5 * 60 * 1000 };
}

export function blankGuest(): CardGuest {
  return { volume: 80, lines: [], alarm: blankAlarm(), timer: blankTimer(), stepKind: "" };
}

export function blankCard(): CardPrefs {
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
    newsPrefs: [{ id: "world", name: "World", query: "" }],
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

function clamp(n: unknown, a: number, b: number) {
  return Math.max(a, Math.min(b, Math.round(Number(n) || 0)));
}

function colorId(id: unknown): CardColorId {
  return CARD_COLORS.some((c) => c.id === id) ? (id as CardColorId) : "ink";
}

function styleId(id: unknown): VoiceStyleId {
  return VOICE_STYLES.some((s) => s.id === id) ? (id as VoiceStyleId) : "hearth";
}

export function parseMutes(raw: unknown): CardMutes {
  const next = blankMutes();
  if (!raw || typeof raw !== "object") return next;
  const o = raw as Record<string, unknown>;
  for (const bus of MUTE_BUSES) next[bus] = !!o[bus];
  return next;
}

export function parseAlarm(raw: unknown): CardAlarm {
  const next = blankAlarm();
  if (!raw || typeof raw !== "object") return next;
  const o = raw as Record<string, unknown>;
  next.on = !!o.on;
  next.hour = clamp(o.hour, 0, 23);
  next.minute = clamp(o.minute, 0, 59);
  next.lineId = typeof o.lineId === "string" ? o.lineId : "";
  next.lastRingDay = typeof o.lastRingDay === "string" ? o.lastRingDay : "";
  return next;
}

export function parseTimer(raw: unknown): CardTimer {
  const next = blankTimer();
  if (!raw || typeof raw !== "object") return next;
  const o = raw as Record<string, unknown>;
  next.running = !!o.running;
  next.remainingMs = Math.max(0, Math.round(Number(o.remainingMs) || 0));
  next.endsAt = Math.max(0, Math.round(Number(o.endsAt) || 0));
  next.lineId = typeof o.lineId === "string" ? o.lineId : "";
  next.durationMs = Math.max(1000, Math.round(Number(o.durationMs) || next.durationMs));
  return next;
}

function hash(text: string) {
  let n = 0;
  for (let i = 0; i < text.length; i++) n = (n * 31 + text.charCodeAt(i)) | 0;
  return n;
}

export function clipLine(text: unknown) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, LINE_CHARS);
}

function parseLine(raw: unknown): SavedLine | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const text = clipLine(o.text);
  if (!text) return null;
  const id = typeof o.id === "string" && o.id ? o.id : `l-${Math.abs(hash(text))}`;
  const kind: SavedKind = o.kind === "do" ? "do" : "say";
  return { id, text, kind };
}

export function parseGuest(raw: unknown): CardGuest {
  const next = blankGuest();
  if (!raw || typeof raw !== "object") return next;
  const o = raw as Record<string, unknown>;
  next.volume = clamp(o.volume, 0, 100);
  next.lines = Array.isArray(o.lines) ? o.lines.map(parseLine).filter((line): line is SavedLine => !!line).slice(0, MAX_LINES) : [];
  next.alarm = parseAlarm(o.alarm);
  next.timer = parseTimer(o.timer);
  next.stepKind = typeof o.stepKind === "string" ? o.stepKind : "";
  return next;
}

export function parseCard(raw: unknown): CardPrefs {
  const next = blankCard();
  if (!raw || typeof raw !== "object") return next;
  const o = raw as Record<string, unknown>;
  next.collapsed = !!o.collapsed;
  next.color = colorId(o.color);
  next.voiceStyle = styleId(o.voiceStyle);
  next.mutes = parseMutes(o.mutes);
  next.off = !!o.off;
  next.pets = {};
  if (o.pets && typeof o.pets === "object") {
    for (const [key, value] of Object.entries(o.pets as Record<string, unknown>)) {
      if (key) next.pets[key] = parseGuest(value);
    }
  }
  const areas = parseAreas(o);
  next.weatherAreas = areas.areas;
  next.currentAreaId = areas.currentId;
  next.weatherTab = areas.tab || "current";
  next.favoriteAreaIds = areas.favoriteIds || [];
  next.hereForecastAck = stickHereForecastAck(o, o.hereForecastAck);
  const news = parseNewsPrefs(o);
  next.newsPrefs = news.topics;
  next.currentNewsId = news.currentId;
  next.newsTab = news.tab || "popular";
  next.newsFavorites = news.favorites || [];
  const market = parseMarket(o);
  next.marketTickers = market.tickers;
  next.currentTickerId = market.currentId;
  next.nftCollections = market.nfts || [];
  next.currentNftId = market.currentNftId || null;
  next.nftMarketplaces = market.marketplaces || [];
  next.marketCustomized = !!o.marketCustomized || !!o.tickersCustomized;
  next.nftCustomized = !!o.nftCustomized || !!o.nftsCustomized;
  next.marketplaceCustomized = !!o.marketplaceCustomized || !!o.nftMarketplaceCustomized;
  next.favoriteTickerIds = Array.isArray(o.favoriteTickerIds) ? o.favoriteTickerIds.filter((x): x is string => typeof x === "string" && !!x).slice(0, 24) : [];
  next.favoriteNftIds = Array.isArray(o.favoriteNftIds) ? o.favoriteNftIds.filter((x): x is string => typeof x === "string" && !!x).slice(0, 24) : [];
  next.stepKind = parseStep(o.stepKind);
  next.music = parseMusic(o.music);
  next.sleepAid = parseSleepAid(o.sleepAid);
  return next;
}

export function guestOf(card: unknown, key: string): CardGuest {
  const house = parseCard(card);
  return parseGuest(house.pets[key]);
}

export function setGuest(card: unknown, key: string, patch: Partial<CardGuest>): CardPrefs {
  const house = parseCard(card);
  house.pets[key] = parseGuest({ ...guestOf(house, key), ...patch });
  return house;
}

export function addLine(card: unknown, key: string, text: unknown, kind: SavedKind = "say"): CardPrefs {
  const clipped = clipLine(text);
  if (!clipped) return parseCard(card);
  const guest = guestOf(card, key);
  const line: SavedLine = {
    id: `l-${Date.now().toString(36)}-${Math.abs(hash(clipped)).toString(36)}`,
    text: clipped,
    kind: kind === "do" ? "do" : "say",
  };
  guest.lines = [...guest.lines, line].slice(-MAX_LINES);
  return setGuest(card, key, guest);
}

export function removeLine(card: unknown, key: string, id: string): CardPrefs {
  const guest = guestOf(card, key);
  guest.lines = guest.lines.filter((line) => line.id !== id);
  return setGuest(card, key, guest);
}

export function lineById(card: unknown, key: string, id: string): SavedLine | null {
  return guestOf(card, key).lines.find((line) => line.id === id) ?? null;
}

export function dayKey(now = Date.now()) {
  const d = new Date(now);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** The latest alarm moment at or before now: today's, or yesterday's while today's is still ahead. */
export function alarmMoment(alarm: unknown, now = Date.now()) {
  const a = parseAlarm(alarm);
  const d = new Date(now);
  const today = new Date(d.getFullYear(), d.getMonth(), d.getDate(), a.hour, a.minute, 0, 0).getTime();
  if (today <= now) return today;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1, a.hour, a.minute, 0, 0).getTime();
}

/**
 * The alarm moment to ring now, or 0. It rings in its own minute, and a moment that passed
 * since the last look (a background tab, a slow tick, a sleeping computer) rings once, late.
 * Once a day: the day of the moment is kept as lastRingDay.
 */
export function alarmCatch(alarm: unknown, now = Date.now(), since = now) {
  const a = parseAlarm(alarm);
  if (!a.on) return 0;
  const moment = alarmMoment(a, now);
  if (dayKey(moment) === a.lastRingDay) return 0;
  if (now - moment < 60_000 || moment > since) return moment;
  return 0;
}

export function alarmDue(alarm: unknown, now = Date.now(), since = now) {
  return alarmCatch(alarm, now, since) > 0;
}

export function markAlarmRang(alarm: unknown, now = Date.now()): CardAlarm {
  const a = parseAlarm(alarm);
  a.lastRingDay = dayKey(now);
  return a;
}

export function startTimer(timer: unknown, durationMs: number, now = Date.now()): CardTimer {
  const t = parseTimer(timer);
  const ms = Math.max(1000, Math.round(durationMs || t.durationMs || 60_000));
  t.running = true;
  t.durationMs = ms;
  t.remainingMs = ms;
  t.endsAt = now + ms;
  return t;
}

export function stopTimer(timer: unknown, now = Date.now()): CardTimer {
  const t = parseTimer(timer);
  if (t.running && t.endsAt) t.remainingMs = Math.max(0, t.endsAt - now);
  t.running = false;
  t.endsAt = 0;
  return t;
}

export function timerTick(timer: unknown, now = Date.now()) {
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

export type ClockTick = {
  alarm: CardAlarm;
  timer: CardTimer;
  rang: "alarm" | "timer" | "";
  lineId: string;
  lateMs: number;
  changed: boolean;
};

/**
 * One look at the keeper clock. since is the last look, so an alarm minute that passed between
 * looks still rings once, and a timer rings when it ends. lateMs is how long after its moment it rang.
 */
export function clockTick(guest: unknown, now = Date.now(), since = now): ClockTick {
  const g = guest && typeof guest === "object" ? (guest as { alarm?: unknown; timer?: unknown }) : {};
  const alarm = parseAlarm(g.alarm);
  const timer = parseTimer(g.timer);
  const moment = alarmCatch(alarm, now, since);
  if (moment) {
    return { alarm: markAlarmRang(alarm, moment), timer, rang: "alarm", lineId: alarm.lineId, lateMs: Math.max(0, now - moment), changed: true };
  }
  if (!timer.running) return { alarm, timer, rang: "", lineId: "", lateMs: 0, changed: false };
  const endsAt = timer.endsAt;
  const tick = timerTick(timer, now);
  if (!tick.rang) return { alarm, timer: tick.timer, rang: "", lineId: "", lateMs: 0, changed: true };
  return { alarm, timer: tick.timer, rang: "timer", lineId: timer.lineId, lateMs: Math.max(0, now - endsAt), changed: true };
}

export function formatRemain(ms: number) {
  const total = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function voiceStyleOf(id: unknown) {
  return VOICE_STYLES.find((s) => s.id === id) ?? VOICE_STYLES[0]!;
}

function voiceScore(voice: { name?: string; lang?: string }) {
  const name = voice.name || "";
  if (ROBOT_VOICE.test(name)) return -100;
  let score = 0;
  if (PREFER_VOICE.test(name)) score += 50;
  if (HUMAN_VOICE.test(name)) score += 20;
  const lang = voice.lang || "";
  if (/en[-_]?US|English \(United States\)|Google US English/i.test(`${name} ${lang}`)) score += 10;
  return score;
}

export function pickSystemVoice(voices: Array<{ name?: string; voiceURI?: string; lang?: string }> | null | undefined) {
  const list = Array.isArray(voices) ? voices.filter((v) => v && (v.name || v.voiceURI)) : [];
  if (!list.length) return null;
  const ranked = list
    .map((v) => ({ v, score: voiceScore(v) }))
    .filter((row) => row.score > -100)
    .sort((a, b) => b.score - a.score);
  if (ranked.length) return ranked[0]!.v;
  const pool = list.filter((v) => !ROBOT_VOICE.test(v.name || ""));
  return pool[0] ?? list[0] ?? null;
}

export function prefersHouseCry(key: string | undefined | null) {
  return key === "red_panda" || key === "crow" || key === "raven" || key === "barn_owl" || key === "red_tail" || key === "chickadee" || key === "robin" || key === "mallard" || key === "canada_goose" || key === "pileated" || key === "hummingbird" || key === "budgie" || key === "penguin" || key === "parrot" || key === "toucan" || key === "iguana" || key === "phoenix" || key === "cat" || key === "dog" || key === "rabbit" || key === "hamster" || key === "guinea_pig" || key === "turtle" || key === "goldfish" || key === "fox" || key === "ferret" || key === "hedgehog" || key === "chinchilla" || key === "axolotl" || key === "dragon" || key === "ball_python" || key === "corn_snake" || key === "kingsnake" || key === "green_tree_python" || key === "hognose" || key === "garter" || key === "boa" || key === "milk_snake" || key === "rosy_boa" || key === "carpet_python" || key === "octopus" || key === "cuttlefish" || key === "nautilus" || key === "moon_jelly" || key === "sea_star" || key === "hermit_crab" || key === "horseshoe_crab" || key === "seahorse" || key === "manta" || key === "moray" || key === "moss" || key === "maidenhair" || key === "ginkgo" || key === "oak" || key === "water_lily" || key === "orchid" || key === "saguaro" || key === "venus_flytrap" || key === "pitcher" || key === "sundew" || key === "honeybee" || key === "monarch" || key === "bumblebee" || key === "sweat_bee" || key === "honey_drone" || key === "carpenter_bee" || key === "mason_bee" || key === "leafcutter" || key === "stingless" || key === "mining_bee" || key === "honey_queen" || key === "luna" || key === "firefly" || key === "darner" || key === "stick" || key === "carpenter_ant" || key === "ladybird" || key === "mantis" || key === "cicada" || key === "honeycomb" || key === "oyster" || key === "fly_agaric" || key === "morel" || key === "chanterelle" || key === "turkey_tail" || key === "lions_mane" || key === "puffball" || key === "chicken_of_woods" || key === "yeast" || key === "lichen" || key === "photovore" || key === "choir" || key === "nimbus" || key === "silica" || key === "terminator" || key === "nexus" || key === "halovore" || key === "magneton" || key === "umbral" || key === "cyst" || key === "frog" || key === "toad" || key === "newt" || key === "salamander" || key === "caecilian" || key === "crayfish" || key === "pond_snail" || key === "mussel" || key === "leech" || key === "stickleback" || key === "paramecium" || key === "amoeba" || key === "euglena" || key === "volvox" || key === "diatom" || key === "kelp" || key === "chlamydomonas" || key === "stentor" || key === "coli" || key === "haloarchaea" || key === "orb_weaver" || key === "jumping_spider" || key === "wolf_spider" || key === "tarantula" || key === "widow" || key === "harvestman" || key === "scorpion" || key === "vinegaroon" || key === "tick" || key === "solifuge" || key === "deer" || key === "bat" || key === "squirrel" || key === "otter" || key === "raccoon" || key === "skunk" || key === "opossum" || key === "beaver" || key === "porcupine" || key === "black_bear" || key === "capybara" || key === "gecko" || key === "anole" || key === "skink" || key === "chameleon" || key === "horned_lizard" || key === "alligator" || key === "crocodile" || key === "snapper" || key === "box_turtle" || key === "tuatara" || key === "bass" || key === "brook_trout" || key === "catfish" || key === "bluegill" || key === "perch" || key === "pike" || key === "walleye" || key === "paddlefish" || key === "lamprey" || key === "american_eel" || key === "house_centipede" || key === "millipede" || key === "pillbug" || key === "earthworm" || key === "velvet_worm" || key === "springtail" || key === "tardigrade" || key === "planarian" || key === "nematode" || key === "amphipod" || key === "fiddler_crab" || key === "ghost_crab" || key === "limpet" || key === "barnacle" || key === "chiton" || key === "periwinkle" || key === "sand_dollar" || key === "sea_urchin" || key === "knobbed_whelk" || key === "lugworm" || key === "field_cricket" || key === "katydid" || key === "grasshopper" || key === "swallowtail" || key === "jewelwing" || key === "lacewing" || key === "earwig" || key === "acorn_weevil" || key === "click_beetle" || key === "robber_fly" || key === "sloth" || key === "lemur" || key === "gibbon" || key === "kinkajou" || key === "colugo" || key === "flying_squirrel" || key === "howler" || key === "tarsier" || key === "potto" || key === "koala" || key === "brain_coral" || key === "anemone" || key === "clownfish" || key === "parrotfish" || key === "cleaner_shrimp" || key === "sea_cucumber" || key === "lionfish" || key === "giant_clam" || key === "eagle_ray" || key === "grouper" || key === "cyber_dragon" || key === "volt_dragon" || key === "trace_dragon" || key === "flux_dragon" || key === "spark_dragon" || key === "ion_dragon" || key === "gauss_dragon" || key === "relay_dragon" || key === "fuse_dragon" || key === "ground_dragon";
}

export function speakOpts(styleId: unknown, volume: number) {
  const style = voiceStyleOf(styleId);
  const soft = style.id === "hearth" ? 0.92 : 1;
  return {
    rate: style.rate,
    pitch: style.pitch,
    volume: (clamp(volume, 0, 100) / 100) * soft,
  };
}

export function busOf(kindName: string): MuteBus | null {
  return (SOUND_BUS as Record<string, MuteBus>)[kindName] ?? null;
}

export function isMuted(mutes: unknown, kindName: string) {
  const bus = busOf(kindName);
  if (!bus) return false;
  return !!parseMutes(mutes)[bus];
}

export function sleepHolds(asleep: boolean | undefined, cmd: string) {
  if (!asleep) return false;
  return !(SLEEP_WAKES as readonly string[]).includes(cmd);
}

export function wanderWhileAsleep(asleep: boolean | undefined) {
  if (!asleep) return null;
  return { cmd: "sleep" as const, pose: "sleep" as const };
}

export function loadCard(): CardPrefs {
  if (typeof window === "undefined") return blankCard();
  try {
    const raw = JSON.parse(window.localStorage.getItem(CARD_STORE) || "null");
    const card = parseCard(raw);
    if (raw && storedLivePinNeedsFuzz(raw)) return saveCard(card);
    return card;
  } catch {
    return blankCard();
  }
}

export function saveCard(next: unknown): CardPrefs {
  const card = parseCard(next);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(CARD_STORE, JSON.stringify(card));
    } catch {
      /* ignore */
    }
  }
  return card;
}
