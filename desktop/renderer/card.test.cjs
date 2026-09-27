const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const C = require("./card.js");
const Life = require("./life.js");

const htmlSrc = readFileSync(join(__dirname, "index.html"), "utf8");
const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const lifeSrc = readFileSync(join(__dirname, "life.js"), "utf8");
const styleSrc = readFileSync(join(__dirname, "styles.css"), "utf8");
const mainSrc = readFileSync(join(__dirname, "..", "main.cjs"), "utf8");
const preloadSrc = readFileSync(join(__dirname, "..", "preload.cjs"), "utf8");
const webCard = readFileSync(join(__dirname, "..", "..", "web", "src", "lib", "pets", "card.ts"), "utf8");
const webKeeper = readFileSync(join(__dirname, "..", "..", "web", "src", "lib", "pets", "keeper.ts"), "utf8");
const cardSrc = readFileSync(join(__dirname, "..", "..", "web", "src", "components", "desk", "keeper-card.tsx"), "utf8");
const livingSrc = readFileSync(join(__dirname, "..", "..", "web", "src", "components", "desk", "living-pet.tsx"), "utf8");
const roomSrc = readFileSync(join(__dirname, "..", "..", "web", "src", "components", "desk", "companion-room.tsx"), "utf8");

test("the card law is the same house on overlay and desk", () => {
  assert.deepEqual(C.COLORS.map((c) => c.id), ["ink", "blotter", "moss", "ember", "dusk", "frost"]);
  assert.deepEqual(C.VOICE_STYLES.map((s) => s.id), ["hearth", "hush", "even", "low", "bright"]);
  assert.deepEqual(C.MUTE_BUSES, ["talk", "special", "weather", "treats", "steps", "music"]);
  assert.equal(C.VOICE_TRUTH, "Rui, Soot, Wedge, Heart, Hook, Dee, Brick, Drake, Vee, Drum, Sip, Echo, Peck, Quill, Keel, Ember, Miso, Pip, Thimble, Clip, Whee, Ink, Coin, Rue, Wick, Burr, Floss, Bloom, Vesper, Nori, Saffron, Bandit, Jade, Bluff, Sash, Lula, Coral, Blush, Atlas, Cup, Sepia, Chamber, Pulse, Ochre, Tenant, Ledger, Anchor, Kite, Door, Felt, Vein, Fan, Mast, Disk, Moth, Arm, Snap, Well, Dew, Comb, Milk, Ghost, Spark, Dart, Twig, Column, Seven, Fold, Brood, Wax, Frill, Cap, Lattice, Horn, Ring, Mane, Puff, Flame, Starter, Pact, Gleam, Choir, Drift, Shard, Dusk, Knot, Brine, Beacon, Hush, Arca, Reed, Pebble, Eft, Dapple, Slip, Pinch, Whorl, Hinge, Latch, Prickle, Boot, Reach, Spot, Orb, Pane, Hold, Loom, and Leap talk with house cry first; system speech is the backup.");
  assert.match(C.QUIT_TRUTH, /desktop\.ps1/);
  assert.equal(C.voiceStyleOf("hearth").rate, 0.82);
  assert.ok(C.speakOpts("hearth", 80).volume < 0.8);
  assert.ok(C.speakOpts("hearth", 80).volume > 0.7);
  assert.equal(C.speakOpts("even", 80).volume, 0.8);
  assert.equal(C.busOf("chirp"), "talk");
  assert.equal(C.busOf("hop"), "special");
  assert.equal(C.busOf("munch"), "treats");
  assert.equal(C.busOf("rain"), "weather");
  assert.equal(C.isMuted({ talk: true }, "chirp"), true);
  assert.equal(C.isMuted({ talk: true }, "hop"), false);
  assert.match(webCard, /VOICE_TRUTH/);
  assert.match(webCard, /hearth/);
  assert.match(webKeeper, /VOICE_TRUTH/);
  assert.match(cardSrc, /data-card="collapse"/);
  assert.match(cardSrc, /Mute \$\{bus\}/);
  assert.match(htmlSrc, /data-card="collapse"/);
  assert.match(htmlSrc, /card\.js/);
  assert.doesNotMatch(htmlSrc, /id="hud"[^>]*data-hit/);
});

test("a stored live pin is rounded when the card loads", () => {
  const mem = {};
  const prevStore = global.localStorage;
  const prevDesk = global.desk;
  global.desk = undefined;
  global.localStorage = {
    getItem(k) {
      return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null;
    },
    setItem(k, v) {
      mem[k] = String(v);
    },
  };
  mem[C.STORE] = JSON.stringify({
    weatherAreas: [{ id: "here", name: "This computer", query: "this computer", lat: 47.60621, lon: -122.33207 }],
    currentAreaId: "here",
  });
  const card = C.load();
  assert.equal(card.weatherAreas[0].id, "here");
  assert.equal(card.weatherAreas[0].lat, 47.6);
  assert.equal(card.weatherAreas[0].lon, -122.3);
  const saved = JSON.parse(mem[C.STORE]);
  assert.equal(saved.weatherAreas[0].lat, 47.6);
  assert.equal(saved.weatherAreas[0].lon, -122.3);
  mem[C.STORE] = JSON.stringify({
    weatherAreas: [{ id: "a-pdx", name: "Portland", query: "Portland", lat: 45.5231, lon: -122.6765 }],
    currentAreaId: "a-pdx",
  });
  const beforeTyped = mem[C.STORE];
  const typed = C.load();
  assert.equal(typed.weatherAreas[0].lat, 45.5231);
  assert.equal(typed.weatherAreas[0].lon, -122.6765);
  assert.equal(mem[C.STORE], beforeTyped);
  mem[C.STORE] = JSON.stringify({
    weatherAreas: [{ id: "here", name: "This computer", query: "this computer", lat: 47.6, lon: -122.3 }],
    currentAreaId: "here",
    hereForecastAck: { lat: 47.6, lon: -122.3 },
  });
  const acked = C.load();
  assert.deepEqual(acked.hereForecastAck, { lat: 47.6, lon: -122.3 });
  const preciseAck = C.parseCard({
    weatherAreas: [{ id: "here", name: "This computer", query: "this computer", lat: 47.6, lon: -122.3 }],
    currentAreaId: "here",
    hereForecastAck: { lat: 47.606, lon: -122.332 },
  });
  assert.equal(preciseAck.hereForecastAck, null);
  const moved = C.parseCard({
    weatherAreas: [
      { id: "here", name: "This computer", query: "this computer", lat: 47.6, lon: -122.3 },
      { id: "a-pdx", name: "Portland", query: "Portland", lat: 45.5, lon: -122.6 },
    ],
    currentAreaId: "a-pdx",
    hereForecastAck: { lat: 47.6, lon: -122.3 },
  });
  assert.equal(moved.hereForecastAck, null);
  if (prevStore === undefined) delete global.localStorage;
  else global.localStorage = prevStore;
  if (prevDesk === undefined) delete global.desk;
  else global.desk = prevDesk;
});

test("saved lines, alarm, and timer persist honestly", () => {
  let card = C.addLine(C.blankCard(), "red_panda", "A ribbon I was keeping.", "say");
  const guest = C.guestOf(card, "red_panda");
  assert.equal(guest.lines.length, 1);
  assert.equal(guest.lines[0].text, "A ribbon I was keeping.");
  assert.equal(guest.lines[0].kind, "say");
  card = C.addLine(card, "red_panda", "sit", "do");
  assert.equal(C.guestOf(card, "red_panda").lines.length, 2);
  const noon = new Date(2026, 7, 27, 7, 0, 5).getTime();
  assert.equal(C.alarmDue({ on: true, hour: 7, minute: 0, lastRingDay: "" }, noon), true);
  const rang = C.markAlarmRang({ on: true, hour: 7, minute: 0, lastRingDay: "" }, noon);
  assert.equal(C.alarmDue(rang, noon), false);
  const started = C.startTimer(C.blankTimer(), 5000, 1_000);
  assert.equal(started.running, true);
  assert.equal(started.endsAt, 6_000);
  assert.equal(C.timerTick(started, 3_000).rang, false);
  assert.equal(C.timerTick(started, 6_000).rang, true);
  assert.equal(C.formatRemain(90_000), "1:30");
  assert.match(mainSrc, /card\.json/);
  assert.match(mainSrc, /card-get/);
  assert.match(mainSrc, /quit-desk/);
  assert.match(preloadSrc, /cardGet/);
  assert.match(preloadSrc, /quit:/);
});

test("the keeper clock rings a passed alarm once and a timer on time, even while hidden", () => {
  const at = (d, h, m, s = 0) => new Date(2026, 8, d, h, m, s).getTime();
  const alarm = { on: true, hour: 7, minute: 0, lineId: "", lastRingDay: "" };
  // Its own minute still rings with no earlier look (the old contract).
  assert.equal(C.alarmCatch(alarm, at(27, 7, 0, 30)), at(27, 7, 0));
  // Hidden from 6:59:58 to 7:03:10: the minute passed between looks and rings once, late.
  assert.equal(C.alarmCatch(alarm, at(27, 7, 3, 10), at(27, 6, 59, 58)), at(27, 7, 0));
  assert.equal(C.alarmDue(alarm, at(27, 7, 3, 10)), false, "no earlier look, no catch-up");
  const rang = C.markAlarmRang(alarm, at(27, 7, 0));
  assert.equal(C.alarmCatch(rang, at(27, 7, 3, 11), at(27, 6, 0)), 0, "once a day");
  assert.equal(C.alarmCatch(rang, at(28, 7, 0, 1)), at(28, 7, 0), "next day rings again");
  // Setting the alarm to a time already gone today does not ring now.
  assert.equal(C.alarmCatch({ ...alarm, hour: 8 }, at(27, 9, 0, 30), at(27, 9, 0, 29)), 0);
  assert.equal(C.alarmCatch({ ...alarm, on: false }, at(27, 7, 3), at(27, 6, 59)), 0);
  // Across midnight: 23:59 passed while asleep rings once and keeps yesterday as its day.
  const late = { ...alarm, hour: 23, minute: 59 };
  const caught = C.alarmCatch(late, at(28, 0, 2), at(27, 23, 58, 30));
  assert.equal(caught, at(27, 23, 59));
  const marked = C.markAlarmRang(late, caught);
  assert.equal(marked.lastRingDay, "2026-09-27");
  assert.equal(C.alarmCatch(marked, at(28, 23, 59, 5)), at(28, 23, 59), "tonight still rings");

  // One-second looks through a hidden stretch: the alarm rings exactly once, in its minute.
  let guest = { alarm: { ...alarm, lineId: "l-1" }, timer: C.blankTimer() };
  let since = at(27, 6, 58);
  const rings = [];
  for (let now = since + 1000; now <= at(27, 7, 5); now += 1000) {
    const tick = C.clockTick(guest, now, since);
    since = now;
    if (tick.changed) guest = { ...guest, alarm: tick.alarm, timer: tick.timer };
    if (tick.rang) rings.push({ ...tick, now });
  }
  assert.equal(rings.length, 1);
  assert.equal(rings[0].rang, "alarm");
  assert.equal(rings[0].lineId, "l-1");
  assert.ok(rings[0].lateMs < 1000);

  // A slow look (a sleeping computer wakes at 7:40) still rings once, late.
  const slow = C.clockTick({ alarm, timer: C.blankTimer() }, at(27, 7, 40), at(27, 6, 50));
  assert.equal(slow.rang, "alarm");
  assert.equal(slow.lateMs, 40 * 60_000);

  // A timer rings on the look after it ends, and only once.
  let timer = C.startTimer(C.blankTimer(), 5000, 1_000);
  const quiet = C.clockTick({ alarm: C.blankAlarm(), timer }, 3_000, 2_000);
  assert.equal(quiet.rang, "");
  assert.equal(quiet.changed, true);
  assert.equal(quiet.timer.remainingMs, 3_000);
  const done = C.clockTick({ alarm: C.blankAlarm(), timer }, 6_400, 5_400);
  assert.equal(done.rang, "timer");
  assert.equal(done.lateMs, 400);
  assert.equal(done.timer.running, false);
  assert.equal(C.clockTick({ alarm: C.blankAlarm(), timer: done.timer }, 7_400, 6_400).changed, false);

  // The overlay keeps looking while hidden; only the weather sound waits for a visible window.
  const clockAt = petSrc.indexOf("let clockSince = Date.now();");
  assert.ok(clockAt > 0);
  const body = petSrc.slice(clockAt, petSrc.indexOf("}, 1000);", clockAt));
  assert.match(body, /clockTick\(cardGuest\(\), now, since\)/);
  assert.doesNotMatch(body, /if \(document\.hidden[^)]*\) return/);
  assert.match(body, /if \(!document\.hidden\) \{\s+const sky/);
  assert.match(body, /if \(document\.hidden\) window\.desk\?\.notify\(/);
  assert.match(cardSrc, /clockTick\(guestOf\(live, guestKey\), now, since\)/);
  assert.match(webCard, /export function clockTick/);
});

test("an asleep guest keeps the sleep pose until a real wake; Walk is a wake", () => {
  const life = { ...Life.blank(), asleep: true, sleepHeld: true, hunger: 70 };
  assert.equal(Life.sleepHolds(life, "wander"), false);
  assert.equal(Life.sleepHolds(life, "sit"), true);
  assert.equal(Life.sleepHolds(life, "idle"), true);
  assert.equal(Life.sleepHolds(life, "sleep"), true);
  assert.equal(Life.sleepHolds(life, "talk"), false);
  assert.equal(Life.sleepHolds(life, "call"), false);
  assert.deepEqual(Life.wanderWhileAsleep(life), { cmd: "sleep", pose: "sleep" });
  assert.equal(C.sleepHolds(true, "wander"), false);
  assert.deepEqual(C.wanderWhileAsleep(true), { cmd: "sleep", pose: "sleep" });
  assert.equal(C.wanderWhileAsleep(false), null);

  const trait = { extra: {}, hungerH: 6, energyH: 9, hygieneH: 14, hardy: 0.8, social: 1, messy: 0.4, sleepStart: 22, sleepEnd: 6 };
  const day = new Date(2023, 10, 14, 14, 0, 0).getTime();
  const rested = Life.act({ ...Life.blank(day), energy: 40, lastTick: day }, trait, "rest", day, "red_panda");
  assert.equal(rested.life.asleep, true);
  assert.equal(rested.life.sleepHeld, true);
  assert.equal(rested.cmd, "sleep");
  const later = Life.decay(rested.life, trait, day + 20_000, "red_panda");
  assert.equal(later.life.asleep, true);
  assert.deepEqual(Life.wanderWhileAsleep(later.life), { cmd: "sleep", pose: "sleep" });
  const hungry = Life.decay({ ...later.life, hunger: 8, lastTick: day }, trait, day + 40_000, "red_panda");
  assert.equal(hungry.life.asleep, false);

  assert.match(petSrc, /wanderWhileAsleep/);
  assert.match(petSrc, /sleepHolds/);
  assert.match(petSrc, /sim\.cmd === "sleep"/);
  assert.match(petSrc, /sim\.anim = "sleep"/);
  assert.match(petSrc, /desk\.quit/);
  assert.match(lifeSrc, /sleepHeld/);
  assert.match(livingSrc, /asleepRef\.current/);
  assert.match(livingSrc, /s\.anim = "sleep"/);
  assert.match(roomSrc, /wanderWhileAsleep/);
  assert.doesNotMatch(petSrc, /if \(sim\.cmd === "sit" \|\| sim\.cmd === "sleep"\)/);
  assert.match(styleSrc, /data-collapsed/);
  assert.match(styleSrc, /#hud\[data-collapsed="1"\][\s\S]*display:\s*none/);
  assert.match(styleSrc, /#hud[\s\S]*overflow-y:\s*auto/);
  assert.match(styleSrc, /#choice[\s\S]*overflow-y:\s*auto/);
  assert.match(petSrc, /openKeeperCard/);
  assert.match(petSrc, /collapseKeeperCard/);
  assert.match(petSrc, /cardOpen\(\)/);
  assert.match(petSrc, /card:\s*cardOpen\(\)/);
  assert.match(petSrc, /cardOpen\(\) && sim\.anim === "walk"/);
  assert.match(petSrc, /clingy && !cardOpen\(\)/);
  assert.match(petSrc, /desk\.radioSearch/);
  assert.match(petSrc, /desk\.newsTopic/);
  assert.match(petSrc, /desk\.marketQuote/);
  assert.match(livingSrc, /cardOpen/);
  assert.match(mainSrc, /radio-search/);
  assert.match(mainSrc, /news-topic/);
  assert.match(mainSrc, /market-quote/);
  assert.match(mainSrc, /RADIO_UA/);
  assert.match(mainSrc, /sandbox:\s*true/);
  assert.match(preloadSrc, /radioSearch/);
  assert.match(preloadSrc, /newsTopic/);
  assert.match(preloadSrc, /newsFeed/);
  assert.match(mainSrc, /news-feed/);
  assert.match(preloadSrc, /marketQuote/);
  assert.equal(C.blankCard().collapsed, true);
});

test("voice styles pick a human system voice and skip cartoon robots", () => {
  const voices = [
    { name: "Zarvox" },
    { name: "Microsoft David Desktop" },
    { name: "Microsoft Aria Online (Natural)" },
    { name: "Microsoft Zira Compact" },
    { name: "Bad News" },
  ];
  const picked = C.pickSystemVoice(voices, "hearth");
  assert.equal(picked.name, "Microsoft Aria Online (Natural)");
  assert.equal(C.pickSystemVoice([], "hearth"), null);
  assert.equal(C.prefersHouseCry("red_panda"), true);
  assert.equal(C.prefersHouseCry("crow"), true);
  assert.equal(C.prefersHouseCry("raven"), true);
  assert.equal(C.prefersHouseCry("barn_owl"), true);
  assert.equal(C.prefersHouseCry("red_tail"), true);
  assert.equal(C.prefersHouseCry("chickadee"), true);
  assert.equal(C.prefersHouseCry("robin"), true);
  assert.equal(C.prefersHouseCry("mallard"), true);
  assert.equal(C.prefersHouseCry("canada_goose"), true);
  assert.equal(C.prefersHouseCry("pileated"), true);
  assert.equal(C.prefersHouseCry("hummingbird"), true);
  assert.equal(C.prefersHouseCry("budgie"), true);
  assert.equal(C.prefersHouseCry("penguin"), true);
  assert.equal(C.prefersHouseCry("parrot"), true);
  assert.equal(C.prefersHouseCry("toucan"), true);
  assert.equal(C.prefersHouseCry("phoenix"), true);
  assert.equal(C.prefersHouseCry("cat"), true);
  assert.equal(C.prefersHouseCry("dog"), true);
  assert.equal(C.prefersHouseCry("rabbit"), true);
  assert.equal(C.prefersHouseCry("hamster"), true);
  assert.equal(C.prefersHouseCry("guinea_pig"), true);
  assert.equal(C.prefersHouseCry("turtle"), true);
  assert.equal(C.prefersHouseCry("goldfish"), true);
  assert.equal(C.prefersHouseCry("fox"), true);
  assert.equal(C.prefersHouseCry("ferret"), true);
  assert.equal(C.prefersHouseCry("hedgehog"), true);
  assert.equal(C.prefersHouseCry("chinchilla"), true);
  assert.equal(C.prefersHouseCry("axolotl"), true);
  assert.equal(C.prefersHouseCry("dragon"), true);
  assert.equal(C.prefersHouseCry("ball_python"), true);
  assert.equal(C.prefersHouseCry("corn_snake"), true);
  assert.equal(C.prefersHouseCry("kingsnake"), true);
  assert.equal(C.prefersHouseCry("green_tree_python"), true);
  assert.equal(C.prefersHouseCry("hognose"), true);
  assert.equal(C.prefersHouseCry("garter"), true);
  assert.equal(C.prefersHouseCry("boa"), true);
  assert.equal(C.prefersHouseCry("milk_snake"), true);
  assert.equal(C.prefersHouseCry("rosy_boa"), true);
  assert.equal(C.prefersHouseCry("carpet_python"), true);
  assert.equal(C.prefersHouseCry("octopus"), true);
  assert.equal(C.prefersHouseCry("cuttlefish"), true);
  assert.equal(C.prefersHouseCry("nautilus"), true);
  assert.equal(C.prefersHouseCry("moon_jelly"), true);
  assert.equal(C.prefersHouseCry("sea_star"), true);
  assert.equal(C.prefersHouseCry("hermit_crab"), true);
  assert.equal(C.prefersHouseCry("horseshoe_crab"), true);
  assert.equal(C.prefersHouseCry("seahorse"), true);
  assert.equal(C.prefersHouseCry("manta"), true);
  assert.equal(C.prefersHouseCry("moray"), true);
  assert.equal(C.prefersHouseCry("moss"), true);
  assert.equal(C.prefersHouseCry("maidenhair"), true);
  assert.equal(C.prefersHouseCry("ginkgo"), true);
  assert.equal(C.prefersHouseCry("oak"), true);
  assert.equal(C.prefersHouseCry("water_lily"), true);
  assert.equal(C.prefersHouseCry("orchid"), true);
  assert.equal(C.prefersHouseCry("saguaro"), true);
  assert.equal(C.prefersHouseCry("venus_flytrap"), true);
  assert.equal(C.prefersHouseCry("pitcher"), true);
  assert.equal(C.prefersHouseCry("sundew"), true);
  assert.equal(C.prefersHouseCry("honeybee"), true);
  assert.equal(C.prefersHouseCry("honey_drone"), true);
  assert.equal(C.prefersHouseCry("carpenter_bee"), true);
  assert.equal(C.prefersHouseCry("monarch"), true);
  assert.equal(C.prefersHouseCry("luna"), true);
  assert.equal(C.prefersHouseCry("firefly"), true);
  assert.equal(C.prefersHouseCry("darner"), true);
  assert.equal(C.prefersHouseCry("stick"), true);
  assert.equal(C.prefersHouseCry("carpenter_ant"), true);
  assert.equal(C.prefersHouseCry("ladybird"), true);
  assert.equal(C.prefersHouseCry("mantis"), true);
  assert.equal(C.prefersHouseCry("cicada"), true);
  assert.equal(C.prefersHouseCry("honeycomb"), true);
  assert.equal(C.prefersHouseCry("oyster"), true);
  assert.equal(C.prefersHouseCry("fly_agaric"), true);
  assert.equal(C.prefersHouseCry("morel"), true);
  assert.equal(C.prefersHouseCry("chanterelle"), true);
  assert.equal(C.prefersHouseCry("turkey_tail"), true);
  assert.equal(C.prefersHouseCry("lions_mane"), true);
  assert.equal(C.prefersHouseCry("terminator"), true);
  assert.equal(C.prefersHouseCry("nexus"), true);
  assert.equal(C.prefersHouseCry("halovore"), true);
  assert.equal(C.prefersHouseCry("magneton"), true);
assert.equal(C.prefersHouseCry("umbral"), true);
  assert.equal(C.prefersHouseCry("cyst"), true);
  assert.equal(C.prefersHouseCry("frog"), true);
assert.equal(C.prefersHouseCry("toad"), true);
assert.equal(C.prefersHouseCry("newt"), true);
assert.equal(C.prefersHouseCry("salamander"), true);
assert.equal(C.prefersHouseCry("caecilian"), true);
assert.equal(C.prefersHouseCry("crayfish"), true);
assert.equal(C.prefersHouseCry("pond_snail"), true);
  assert.equal(C.prefersHouseCry("mussel"), true);
  assert.equal(C.prefersHouseCry("leech"), true);
  assert.equal(C.prefersHouseCry("stickleback"), true);
  assert.equal(C.prefersHouseCry("paramecium"), true);
  assert.equal(C.prefersHouseCry("amoeba"), true);
  assert.equal(C.prefersHouseCry("euglena"), true);
  assert.equal(C.prefersHouseCry("volvox"), true);
  assert.equal(C.prefersHouseCry("diatom"), true);
  assert.equal(C.prefersHouseCry("kelp"), true);
  assert.equal(C.prefersHouseCry("coli"), true);
  assert.equal(C.prefersHouseCry("haloarchaea"), true);
  assert.equal(C.prefersHouseCry("orb_weaver"), true);
  assert.equal(C.prefersHouseCry("jumping_spider"), true);
  assert.equal(C.prefersHouseCry("wolf_spider"), true);
  assert.equal(C.prefersHouseCry("tarantula"), true);
  assert.equal(C.prefersHouseCry("widow"), true);
  assert.equal(C.prefersHouseCry("harvestman"), true);
  assert.equal(C.prefersHouseCry("scorpion"), true);
  assert.equal(C.prefersHouseCry("vinegaroon"), true);
  assert.equal(C.prefersHouseCry("tick"), true);
  assert.equal(C.prefersHouseCry("solifuge"), true);
  assert.equal(C.prefersHouseCry("deer"), true);
assert.equal(C.prefersHouseCry("bat"), true);
assert.equal(C.prefersHouseCry("squirrel"), true);
assert.equal(C.prefersHouseCry("otter"), true);
assert.equal(C.prefersHouseCry("raccoon"), true);
assert.equal(C.prefersHouseCry("skunk"), true);
assert.equal(C.prefersHouseCry("opossum"), true);
assert.equal(C.prefersHouseCry("beaver"), true);
assert.equal(C.prefersHouseCry("porcupine"), true);
assert.equal(C.prefersHouseCry("black_bear"), true);
assert.equal(C.prefersHouseCry("gecko"), true);
  assert.equal(C.prefersHouseCry("anole"), true);
assert.equal(C.prefersHouseCry("skink"), true);
assert.equal(C.prefersHouseCry("alligator"), true);
  assert.equal(C.prefersHouseCry("capybara"), true);
  assert.equal(C.prefersHouseCry("iguana"), true);
  assert.equal(C.prefersHouseCry("chameleon"), true);
  assert.equal(C.prefersHouseCry("horned_lizard"), true);
  assert.equal(C.prefersHouseCry("snapper"), true);
  assert.equal(C.prefersHouseCry("box_turtle"), true);
  // Jaw plays a Nile crocodile juvenile call (a genus relative; see docs/CRIES.md).
  assert.equal(C.prefersHouseCry("crocodile"), true);
  assert.equal(C.prefersHouseCry("not_a_pet"), false);
  assert.equal(C.prefersHouseCry("tuatara"), true);
  assert.equal(C.prefersHouseCry("bass"), true);
  assert.equal(C.prefersHouseCry("brook_trout"), true);
  assert.equal(C.prefersHouseCry("lamprey"), true);
  assert.equal(C.prefersHouseCry("american_eel"), true);
  assert.equal(C.prefersHouseCry("house_centipede"), true);
  assert.equal(C.prefersHouseCry("millipede"), true);
  assert.equal(C.prefersHouseCry("pillbug"), true);
  assert.equal(C.prefersHouseCry("earthworm"), true);
  assert.equal(C.prefersHouseCry("velvet_worm"), true);
assert.equal(C.prefersHouseCry("springtail"), true);
assert.equal(C.prefersHouseCry("tardigrade"), true);
assert.equal(C.prefersHouseCry("planarian"), true);
assert.equal(C.prefersHouseCry("nematode"), true);
assert.equal(C.prefersHouseCry("amphipod"), true);
assert.equal(C.prefersHouseCry("fiddler_crab"), true);
assert.equal(C.prefersHouseCry("ghost_crab"), true);
assert.equal(C.prefersHouseCry("limpet"), true);
assert.equal(C.prefersHouseCry("barnacle"), true);
assert.equal(C.prefersHouseCry("chiton"), true);
assert.equal(C.prefersHouseCry("periwinkle"), true);
assert.equal(C.prefersHouseCry("sand_dollar"), true);
assert.equal(C.prefersHouseCry("sea_urchin"), true);
assert.equal(C.prefersHouseCry("knobbed_whelk"), true);
assert.equal(C.prefersHouseCry("lugworm"), true);
assert.equal(C.prefersHouseCry("field_cricket"), true);
assert.equal(C.prefersHouseCry("katydid"), true);
assert.equal(C.prefersHouseCry("grasshopper"), true);
assert.equal(C.prefersHouseCry("swallowtail"), true);
assert.equal(C.prefersHouseCry("jewelwing"), true);
assert.equal(C.prefersHouseCry("lacewing"), true);
assert.equal(C.prefersHouseCry("earwig"), true);
assert.equal(C.prefersHouseCry("acorn_weevil"), true);
assert.equal(C.prefersHouseCry("click_beetle"), true);
assert.equal(C.prefersHouseCry("robber_fly"), true);
assert.equal(C.prefersHouseCry("sloth"), true);
assert.equal(C.prefersHouseCry("lemur"), true);
assert.equal(C.prefersHouseCry("gibbon"), true);
assert.equal(C.prefersHouseCry("kinkajou"), true);
assert.equal(C.prefersHouseCry("colugo"), true);
assert.equal(C.prefersHouseCry("flying_squirrel"), true);
assert.equal(C.prefersHouseCry("howler"), true);
assert.equal(C.prefersHouseCry("tarsier"), true);
assert.equal(C.prefersHouseCry("potto"), true);
assert.equal(C.prefersHouseCry("koala"), true);
  assert.equal(C.prefersHouseCry("giant_clam"), true);
  assert.equal(C.prefersHouseCry("eagle_ray"), true);
  assert.equal(C.prefersHouseCry("grouper"), true);
  assert.equal(C.prefersHouseCry("cyber_dragon"), true);
  assert.equal(C.prefersHouseCry("volt_dragon"), true);
  assert.equal(C.prefersHouseCry("trace_dragon"), true);
  assert.equal(C.prefersHouseCry("flux_dragon"), true);
  assert.equal(C.prefersHouseCry("spark_dragon"), true);
  assert.equal(C.prefersHouseCry("ion_dragon"), true);
  assert.equal(C.prefersHouseCry("gauss_dragon"), true);
  assert.equal(C.prefersHouseCry("chlamydomonas"), true);
  const hearth = C.speakOpts("hearth", 50);
  assert.ok(hearth.rate < 0.86);
  assert.ok(hearth.pitch < 0.95);
  assert.ok(hearth.volume < 0.5);
  assert.match(petSrc, /pickSystemVoice/);
  assert.match(petSrc, /speakOpts/);
  assert.match(petSrc, /prefersHouseCry/);
  assert.match(petSrc, /PetDeskHouse\.playVoice/);
  assert.match(petSrc, /speakText\(text\)/);
  assert.match(petSrc, /if \(!played\) speakText\(text\)/);
  assert.match(petSrc, /prefers && kindName === "chirp"/);
  assert.doesNotMatch(petSrc, /u\.rate = trait\?\.rate \?\? 0\.94/);
  const houseSrc = readFileSync(join(__dirname, "desk-house.js"), "utf8");
  assert.match(houseSrc, /function playVoice\(key, card, onFail\)/);
  assert.match(houseSrc, /started\.catch/);
  assert.match(mainSrc, /autoplay-policy/);
});
