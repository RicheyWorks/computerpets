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
const R = require("./ribbon.js");
const T = require("./rui-tricks.js");
const C = require("./card.js");

test("overlay leftover sits weather, news, Sip, ribbon, and the card buses", () => {
  assert.match(htmlSrc, /id="weather-plate"/);
  assert.match(htmlSrc, /id="news-plate"/);
  assert.match(htmlSrc, /id="bird"/);
  assert.match(htmlSrc, /Call Sip/);
  assert.match(htmlSrc, /media-src 'self' https: http: blob:/);
  assert.match(htmlSrc, /weather-areas\.js/);
  assert.ok(htmlSrc.indexOf("weather-areas.js") < htmlSrc.indexOf("card.js"));
  assert.ok(htmlSrc.indexOf("house-sounds.js") < htmlSrc.indexOf("card.js"));
  assert.match(styleSrc, /\.desk-plate/);
  assert.match(styleSrc, /#hud[\s\S]*overflow-y:\s*auto/);
  assert.match(styleSrc, /#choice[\s\S]*overflow-y:\s*auto/);
  assert.match(styleSrc, /#bird\.show/);
  assert.match(petSrc, /callSip/);
  assert.match(petSrc, /spawnCalled/);
  assert.match(petSrc, /setFocusable/);
  assert.doesNotMatch(petSrc, /hid a ribbon/);
  assert.match(petSrc, /stealDeskRibbon/);
  assert.match(petSrc, /playWindows/);
  assert.match(petSrc, /PetRuiTricks/);
  assert.match(petSrc, /beginHappy/);
  assert.match(petSrc, /ruiSleepBout/);
  assert.match(petSrc, /hostSleeping/);
  assert.match(readFileSync(join(__dirname, "rui-tricks.js"), "utf8"), /HAPPY\s*=/);
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
  assert.equal(T.SLEEP_HOLD_FRAME, 1);
  assert.ok(T.LIE_HOLD >= 8);
  assert.equal(R.RIBBON_SPECIAL, "I found a ribbon. It was not lost. It is now safer.");
  assert.equal(T.TRICK_KEY, "red_panda");
  assert.equal(existsSync(join(__dirname, "sounds", "hummingbird.wav")), true);
  assert.equal(existsSync(join(__dirname, "sounds", "house-loop.wav")), true);
});
