const assert = require("node:assert/strict");
const { existsSync, readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");

const htmlSrc = readFileSync(join(__dirname, "index.html"), "utf8");
const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const styleSrc = readFileSync(join(__dirname, "styles.css"), "utf8");
const D = require("./desk.js");
const F = require("./bird-fly.js");
const S = require("./house-sounds.js");
const M = require("./house-music.js");
const Sleep = require("./house-sleep.js");
const R = require("./ribbon.js");
const T = require("./rui-tricks.js");
const C = require("./card.js");
const WP = require("./window-play.js");

test("Ink leftover basks on a window rail; Whee still wheeks; Clip still stashes; Thimble still thumps; Pip still watches; Miso still sits a ledge", () => {
  assert.equal(WP.playFor("turtle"), "bask");
  assert.equal(WP.playFor("guinea_pig"), "wheek");
  assert.equal(WP.playFor("hamster"), "stash");
  assert.equal(WP.playFor("rabbit"), "thump");
  assert.equal(WP.playFor("dog"), "watch");
  assert.equal(WP.playFor("cat"), "ledge");
  assert.equal(WP.playFor("ground_dragon"), "earth");
  assert.equal(WP.playFor("fuse_dragon"), "hold");
  assert.equal(WP.playFor("relay_dragon"), "click");
  assert.equal(WP.playFor("gauss_dragon"), "orbit");
  assert.equal(WP.playFor("ion_dragon"), "charge");
  assert.equal(WP.playFor("red_panda"), "cling-dive");
  assert.equal(WP.playFor("gecko"), "sill");
  assert.equal(WP.playFor("goldfish"), "sill");
});

test("overlay leftover sits weather, news, Sip, ribbon, and the card buses", () => {
  assert.match(htmlSrc, /id="weather-plate"/);
  assert.match(htmlSrc, /id="news-plate"/);
  assert.match(htmlSrc, /id="market-plate"/);
  assert.match(htmlSrc, /id="weather-q"/);
  assert.match(htmlSrc, /id="weather-lookup"/);
  assert.match(htmlSrc, /id="weather-here"/);
  assert.match(htmlSrc, /id="hud-radio-q"/);
  assert.match(htmlSrc, /id="news-q"/);
  assert.match(htmlSrc, /id="market-q"/);
  assert.match(htmlSrc, /market\.js/);
  assert.ok(htmlSrc.indexOf("market.js") < htmlSrc.indexOf("card.js"));
  assert.match(htmlSrc, /id="bird"/);
  assert.match(htmlSrc, /Call Sip/);
  assert.match(htmlSrc, /media-src 'self' https: http: blob:/);
  assert.match(htmlSrc, /weather-areas\.js/);
  assert.ok(htmlSrc.indexOf("weather-areas.js") < htmlSrc.indexOf("card.js"));
  assert.ok(htmlSrc.indexOf("house-sounds.js") < htmlSrc.indexOf("card.js"));
  assert.ok(htmlSrc.indexOf("house-sleep.js") < htmlSrc.indexOf("card.js"));
  assert.match(htmlSrc, /id="hud-sleep"/);
  assert.match(styleSrc, /\.desk-plate/);
  assert.match(styleSrc, /#hud[\s\S]*overflow-y:\s*auto/);
  assert.match(styleSrc, /#choice[\s\S]*overflow-y:\s*auto/);
  assert.match(styleSrc, /#bird\.show/);
  assert.match(petSrc, /callSip/);
  assert.match(petSrc, /spawnCalled/);
  assert.match(petSrc, /syncCalledPaint/);
  assert.doesNotMatch(petSrc, /calledRoot\.replaceChildren\(\)/);
  assert.match(petSrc, /setFocusable/);
  assert.match(petSrc, /pointerdown/);
  assert.match(petSrc, /closest\("input, textarea, select"\)/);
  assert.doesNotMatch(petSrc, /setFocusable\([\s\S]{0,80}hud-line-text/);
  assert.doesNotMatch(petSrc, /setFocusable\([\s\S]{0,80}hud-call-q/);
  assert.match(petSrc, /startThankYou|applyThankYou/);
  assert.match(petSrc, /TYPE_A_CITY|type a city/);
  assert.doesNotMatch(petSrc, /fetch\(N\.newsUrl\(\), \{ cache: "no-store"/);
  assert.doesNotMatch(petSrc, /hid a ribbon/);
  assert.match(petSrc, /stealDeskRibbon/);
  assert.match(petSrc, /playWindows/);
  assert.match(petSrc, /PetRuiTricks/);
  assert.match(petSrc, /ruiSleepBout/);
  assert.match(petSrc, /hostSleeping/);
  const tricksSrc = readFileSync(join(__dirname, "rui-tricks.js"), "utf8");
  assert.match(tricksSrc, /HAPPY\s*=/);
  const happyStart = tricksSrc.slice(tricksSrc.indexOf("function happyCanStart"), tricksSrc.indexOf("function happyShouldAbort"));
  assert.doesNotMatch(happyStart, /windowPlay/);
  assert.doesNotMatch(happyStart, /state\.card/);
  assert.match(tricksSrc, /function startThankYou/);
  assert.match(tricksSrc, /wantsThankYou/);
  assert.match(readFileSync(join(__dirname, "bird-fly.js"), "utf8"), /PERCH_HOST|approach-perch/);
  assert.match(petSrc, /PetDeskHouse\.playStep/);
  assert.deepEqual(C.MUTE_BUSES, ["talk", "special", "weather", "treats", "steps", "music"]);
});

test("call-guests sits on the leftover rooms, not invented dens", () => {
  const rooms = readFileSync(join(__dirname, "..", "..", "web", "src", "lib", "pets", "rooms.ts"), "utf8");
  const overlay = readFileSync(join(__dirname, "call-guests.js"), "utf8");
  const web = readFileSync(join(__dirname, "..", "..", "web", "src", "lib", "pets", "call-guests.ts"), "utf8");
  assert.match(rooms, /id: "garden"/);
  assert.match(rooms, /id: "roost"/);
  assert.match(overlay, /id: "garden"/);
  assert.match(overlay, /aliases: \["garden", "plant"/);
  assert.match(web, /id: "garden"/);
  assert.match(web, /aliases: \["garden", "plant"/);
  assert.match(overlay, /function matchCall/);
  assert.match(web, /export function matchCall/);
  assert.doesNotMatch(web, /from "\.\/rooms"/);
});

test("the tray pins Rui, Sip, and the grid ten", () => {
  assert.deepEqual(D.deskPicks(), [
    "red_panda",
    "hummingbird",
    "cyber_dragon",
    "volt_dragon",
    "trace_dragon",
    "flux_dragon",
    "spark_dragon",
    "ion_dragon",
    "gauss_dragon",
    "relay_dragon",
    "fuse_dragon",
    "ground_dragon",
  ]);
  assert.equal(D.deskPicks().length, 12);
  assert.equal(D.deskPicks()[1], "hummingbird");
  assert.equal(F.FLY_BIRD_KEY, "hummingbird");
  assert.ok(F.MIN_STAY_S >= 24);
  assert.deepEqual(S.VOICE_KEYS, ["red_panda", "hummingbird", "cat", "dog", "chickadee"]);
  assert.equal(S.stepDefault("red_panda"), "soft");
  assert.equal(M.RADIO_CANT_REACH, "can't reach");
  assert.equal(M.RADIO_EMPTY, "no station from that look-up");
  assert.equal(M.RADIO_LABEL, "Radio station");
  assert.equal(M.RADIO_LOCAL, "Local");
  assert.match(M.RADIO_UA, /ComputerPets/);
  assert.equal(M.parseRadioQuery("KEXP").call, "kexp");
  assert.equal(M.parseRadioQuery("KEXP").city, "");
  assert.match(M.radioSearchUrl("KEXP"), /name=KEXP/);
  assert.equal(M.parseRadioQuery("portland").city, "Portland");
  assert.ok(M.radioSearchUrls("portland").some((u) => /city=Portland|name=Portland/.test(u)));
  assert.equal(T.SLEEP_HOLD_FRAME, 1);
  assert.ok(T.nextTrickWait(true, 0, "lie") >= 48);
  assert.ok(T.LIE_HOLD >= 8);
  assert.equal(R.RIBBON_SPECIAL, "I found a ribbon. It was not lost. It is now safer.");
  assert.equal(T.TRICK_KEY, "red_panda");
  assert.equal(existsSync(join(__dirname, "sounds", "hummingbird.wav")), true);
  assert.equal(existsSync(join(__dirname, "sounds", "house-loop.wav")), true);
  assert.equal(existsSync(join(__dirname, "sounds", "sleep-rain.ogg")), true);
  assert.equal(Sleep.SLEEP_AID_PLUGINS[0].name, "Off");
  assert.equal(Sleep.SLEEP_AID_PLUGINS[1].name, "Rain and thunder");
  assert.equal(Sleep.SLEEP_AID_LICENSE, "CC0 · house-made");
});

function oggDurationSeconds(buf, rate = 22050) {
  let last = 0n;
  for (let i = 0; i < buf.length - 27; i++) {
    if (buf[i] === 0x4f && buf[i + 1] === 0x67 && buf[i + 2] === 0x67 && buf[i + 3] === 0x53) {
      const granule = buf.readBigUInt64LE(i + 6);
      if (granule > last) last = granule;
    }
  }
  return Number(last) / rate;
}

test("Sleep aid Off vs Rain and thunder starts, loops, and stops on mute", () => {
  assert.deepEqual(Sleep.SLEEP_AID_PLUGINS.map((p) => p.id), ["off", "rain"]);
  assert.equal(Sleep.shouldPlay({ plugin: "rain", playing: true }, { music: false }), true);
  assert.equal(Sleep.shouldPlay({ plugin: "rain", playing: true }, { music: true }), false);
  assert.equal(Sleep.shouldPlay({ plugin: "off", playing: false }, { music: false }), false);
  const makeAudio = (src) => {
    const node = { src, loop: false, volume: 1, paused: true, plays: 0, dataset: {} };
    node.play = () => {
      node.paused = false;
      node.plays += 1;
      return Promise.resolve();
    };
    node.pause = () => {
      node.paused = true;
    };
    return node;
  };
  const on = Sleep.applySleepAid(null, { plugin: "rain", playing: true }, { music: false }, 0.8, { makeAudio });
  assert.equal(on.loop, true);
  assert.equal(on.src, "sounds/sleep-rain.ogg");
  assert.equal(on.paused, false);
  const muted = Sleep.applySleepAid(on, { plugin: "rain", playing: true }, { music: true }, 0.8, { makeAudio });
  assert.equal(muted, null);
  assert.equal(on.paused, true);
  const off = Sleep.applySleepAid(makeAudio("x"), { plugin: "off", playing: false }, { music: false }, 0.8, { makeAudio });
  assert.equal(off, null);
  const buf = readFileSync(join(__dirname, "sounds", "sleep-rain.ogg"));
  const dur = oggDurationSeconds(buf);
  assert.ok(dur >= 170 && dur <= 195, `sleep-rain duration ${dur}`);
  assert.match(petSrc, /function sitSleepAid/);
  assert.match(petSrc, /sitSleepAid\(\)/);
  assert.equal(C.parseCard({}).sleepAid.plugin, "off");
  assert.equal(C.parseCard({ sleepAid: { plugin: "rain", playing: true } }).sleepAid.playing, true);
  assert.match(readFileSync(join(__dirname, "..", "main.cjs"), "utf8"), /sandbox:\s*true/);
});

const News = require("./news.js");
const Market = require("./market.js");

test("news topics and quotes persist on the leftover card", () => {
  const world = News.currentTopic(News.blankNewsPrefs());
  assert.equal(world.id, "world");
  assert.equal(world.name, "World");
  let prefs = News.addTopic(News.blankNewsPrefs(), { name: "marijuana news", query: "marijuana news" });
  assert.equal(News.currentTopic(prefs).query, "marijuana news");
  assert.match(News.topicRssUrl("Tacoma crime"), /news\.google\.com/);
  const card = C.parseCard({ newsPrefs: prefs.topics, currentNewsId: prefs.currentId, marketTickers: [{ symbol: "AAPL" }, { symbol: "BTC" }] });
  assert.equal(card.currentNewsId, prefs.currentId);
  assert.ok(card.newsPrefs.some((t) => t.query === "marijuana news"));
  assert.equal(card.marketTickers.length, 2);
  assert.equal(Market.classify("AAPL").kind, "stock");
  assert.equal(Market.classify("BTC").kind, "crypto");
  assert.match(Market.yahooUrl("AAPL"), /query1\.finance\.yahoo\.com/);
  assert.match(Market.geckoUrl("bitcoin"), /api\.coingecko\.com/);
  assert.equal(Market.parseYahoo({ chart: { result: [{ meta: { regularMarketPrice: 12.5, shortName: "Apple", currency: "USD" } }] } }).price, 12.5);
  assert.equal(Market.parseGecko({ bitcoin: { usd: 64000 } }, "bitcoin").price, 64000);
});
