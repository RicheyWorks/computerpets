// The #1557 audit, fixed (PR after #1557): a rested pet slept on at energy 100 until someone woke it; the talk pose
// was held 13-30 s by house chatter after the pet's own line ended; a window play took the pet and the ribbon it
// carried off the left edge (x = -109); Minds Save said "Saved" for a key the AI website refused; the volume slider
// said "Voice" but set every sound of that one pet; at the right edge the card stood 323 px from its pet.
"use strict";
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");
const K = require("./keeper.js");
const Life = require("./life.js");

const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const htmlSrc = readFileSync(join(__dirname, "index.html"), "utf8");
const settingsSrc = readFileSync(join(__dirname, "settings.html"), "utf8");
const MIND_SRC = readFileSync(join(__dirname, "mind.js"), "utf8");
const mainSrc = readFileSync(join(__dirname, "..", "main.cjs"), "utf8");
const preloadSrc = readFileSync(join(__dirname, "..", "preload.cjs"), "utf8");
const WEB = join(__dirname, "..", "..", "web", "src");
const careSrc = readFileSync(join(WEB, "lib", "pets", "care.ts"), "utf8");
const plainSrc = readFileSync(join(WEB, "lib", "plain-error.ts"), "utf8");
const testLineSrc = readFileSync(join(WEB, "lib", "ai", "test-line.ts"), "utf8");
const webCardSrc = readFileSync(join(WEB, "components", "desk", "keeper-card.tsx"), "utf8");

const TRAIT = { extra: {}, hungerH: 6, energyH: 9, hygieneH: 14, hardy: 0.8, social: 1, messy: 0.4, sleepStart: 22, sleepEnd: 6 };
const DAY = new Date(2023, 10, 14, 14, 0, 0).getTime();
const NIGHT = new Date(2023, 10, 14, 23, 30, 0).getTime();

function fnSrc(name) {
  const at = petSrc.indexOf(`function ${name}(`);
  assert.ok(at >= 0, name);
  const end = petSrc.indexOf("\n}\n", at);
  return petSrc.slice(at, end + 2);
}

test("a pet put to bed wakes by itself once fully rested; the web keeps the same rule", () => {
  // The drive: Rest at noon, energy 100 by the next tick, and the pet slept on (sleepHeld held while it was fed).
  const rested = Life.act({ ...Life.blank(DAY), energy: 70, hunger: 70, lastTick: DAY }, TRAIT, "rest", DAY, "fox");
  assert.equal(rested.life.asleep, true);
  assert.equal(rested.life.energy, 100);
  const next = Life.decay(rested.life, TRAIT, DAY + 5_600, "fox");
  assert.equal(next.life.asleep, false, "fully rested: awake");
  assert.equal(next.life.sleepHeld, false);
  assert.equal(Life.wanderWhileAsleep(next.life), null, "the wander tick moves it again");
  // Not yet rested: it sleeps on, and gains energy.
  const tired = Life.act({ ...Life.blank(DAY), energy: 20, hunger: 70, lastTick: DAY }, TRAIT, "rest", DAY, "fox");
  const before = tired.life.energy;
  const still = Life.decay(tired.life, TRAIT, DAY + 20 * 60_000, "fox");
  assert.equal(still.life.asleep, true);
  assert.ok(still.life.energy > before);
  // Night sleep is the clock's, not this rule's: a rested pet still sleeps at night.
  const night = Life.decay({ ...Life.blank(NIGHT), energy: 100, hunger: 70, lastTick: NIGHT - 5_600 }, TRAIT, NIGHT, "fox");
  assert.equal(night.life.asleep, true);
  // Same number and rule on the web (scripts/rest-wake.test.mjs runs both).
  assert.equal(Life.REST_WAKE_ENERGY, 100);
  assert.equal(Number(/export const REST_WAKE_ENERGY = (\d+);/.exec(careSrc)[1]), Life.REST_WAKE_ENERGY);
  assert.match(careSrc, /const held = !!s\.asleep && !s\.sick && !s\.hidden && s\.hunger >= 12 && s\.energy < REST_WAKE_ENERGY;/);
});

test("the talk pose ends with the pet's own line, not with the house chatter after it", () => {
  // The drive: the pet said its line (4.2 s) and a robin's song and a guest's line kept the bubble up, so the
  // 5.6 s tick (which waits for the bubble) left the pet in the talk pose for 13-30 s.
  let clock = 0;
  const ctx = {
    performance: { now: () => clock },
    sim: { order: 0, cmd: "idle" },
    speechUntil: 0,
    talkPoseUntil: 0,
    hudUntil: 0,
    kind: null,
    card: {},
    window: {},
    bubbleText: { textContent: "" },
    bubble: { classList: { add() {}, remove() {} } },
    speakText() {},
  };
  vm.createContext(ctx);
  vm.runInContext(`${fnSrc("say")}\n${fnSrc("issue")}\nvar api = { say, issue, get: () => ({ speechUntil, talkPoseUntil, cmd: sim.cmd }) };`.replace(/\blet /g, "var "), ctx);
  vm.runInContext("var speechUntil = 0, talkPoseUntil = 0, hudUntil = 0;", ctx);
  ctx.api.say("my own line");
  ctx.api.issue("talk");
  assert.equal(ctx.api.get().talkPoseUntil, 4200);
  clock = 1500;
  ctx.api.say("a robin's song", 9000); // house chatter: say() without a talk of its own
  clock = 4300;
  const s = ctx.api.get();
  assert.ok(clock < s.speechUntil, "the bubble is still up (the old tick waited for it)");
  assert.equal(K.talkPoseOver({ cmd: s.cmd, now: clock, until: s.talkPoseUntil }), true, "but the pose is over");
  assert.equal(K.talkPoseOver({ cmd: "talk", now: 4100, until: 4200 }), false);
  assert.equal(K.talkPoseOver({ cmd: "idle", now: 9000, until: 4200 }), false);
  assert.equal(K.talkPoseOver({ cmd: "talk", now: 9000, until: 0 }), false, "no line, no end");
  ctx.api.issue("wander");
  assert.equal(ctx.api.get().talkPoseUntil, 0);
  // The frame ends it; a mind's talk lasts until its answer, then as long as that line.
  assert.match(petSrc, /if \(now > speechUntil\) bubble\.classList\.remove\("open"\);\n\s+if \(window\.PetKeeper\?\.talkPoseOver\?\.\(\{ cmd: sim\.cmd, now, until: talkPoseUntil \}\)\) issue\("idle"\);/);
  assert.match(fnSrc("askMind"), /issue\("talk"\);\n(\s+\/\/[^\n]*\n)*\s+talkPoseUntil = performance\.now\(\) \+/);
  assert.match(fnSrc("askMind"), /say\(reply\.text, replyHold\(reply\.text\)\);\n\s+if \(sim\.cmd === "talk"\) talkPoseUntil = speechUntil;/);
});

test("a window play keeps the pet and the ribbon it carries on the screen", () => {
  // The drive: a play on a window past the left edge put the pet at x = -109.
  assert.equal(K.keepOnScreen({ x: -109, w: 176, width: 2560 }), 0);
  assert.equal(K.keepOnScreen({ x: 2500, w: 176, width: 2560 }), 2384);
  assert.equal(K.keepOnScreen({ x: 900, w: 176, width: 2560 }), 900, "on the screen: untouched");
  assert.equal(K.keepOnScreen({ x: NaN, w: 176, width: 2560 }), 0);
  assert.equal(K.keepOnScreen({ x: 50, w: 176, width: 100 }), 0, "a screen narrower than the pet");
  // The ribbon rides 38 px ahead of the pet; at the left edge facing left that was x = -38.
  const R = require("./ribbon.js");
  const carried = { carried: true, x: 0 };
  assert.equal(R.carryX(carried, 0, -1), -38);
  assert.equal(K.keepOnScreen({ x: R.carryX(carried, 0, -1), w: 24, width: 2560 }), 0);
  assert.match(petSrc, /sim\.x = window\.PetKeeper\?\.keepOnScreen \? window\.PetKeeper\.keepOnScreen\(\{ x: sim\.play\.x, w: BASE, width \}\) : sim\.play\.x;/);
  const lure = fnSrc("paintLure");
  assert.match(lure, /x = R\.carryX\(mark, sim\.x, sim\.facing\);\n(\s+\/\/[^\n]*\n)*\s+if \(mark\.carried && window\.PetKeeper\?\.keepOnScreen\) \{/);
  // The drawn (tilted) box is what stays on: how far the tilt reaches left of the box comes off first.
  assert.match(lure, /x = window\.PetKeeper\.keepOnScreen\(\{ x: x - reach, w: r\.width \|\| lureEl\.offsetWidth \|\| 24, width: window\.innerWidth \}\) \+ reach;/);
  // The ribbon's own rules (what it costs, where it rides) are unchanged.
  assert.match(readFileSync(join(__dirname, "ribbon.js"), "utf8"), /return petX \+ facing \* 38;/);
});

function loadMind(fetchImpl) {
  const calls = [];
  const store = () => ({ getItem: () => null, setItem: () => {}, removeItem: () => {} });
  const window = {
    PetWeatherAreas: require("./weather-areas.js"),
    localStorage: store(),
    sessionStorage: store(),
    URL,
    URLSearchParams,
    AbortController,
    setTimeout,
    clearTimeout,
    fetch: async (url, init) => {
      calls.push({ url: String(url), auth: init && init.headers ? init.headers.Authorization : "" });
      return fetchImpl(url, init);
    },
  };
  window.window = window;
  vm.runInContext(MIND_SRC, vm.createContext(window));
  return { M: window.PetMind, calls };
}

test("Minds Save tests the key the way the web's Test this mind does, in the web's words", async () => {
  const { M, calls } = loadMind(async () => ({ ok: false, status: 401, json: async () => ({}) }));
  // The pet's own binding is house lines; the test asks the mind the House window just saved (ctx.bind).
  await M.save({ default: { plugin: "local" }, voice: "browser", pets: {} });
  const bind = { plugin: "xai", apiKey: "stand-in-key-not-real" };
  const shown = M.talkHonesty(bind);
  const refused = await M.run({ bind, species: "red_panda", name: "Ember", hunger: 40, mood: 50, energy: 60, system: "Be small.", message: "Hello. Who are you?", fallback: "", shown });
  assert.equal(calls.length, 1);
  assert.match(calls[0].url, /^https:\/\/api\.x\.ai\//);
  assert.equal(refused.problem, "key");
  // The web: `The mind did not answer. ${MIND_LINES[kind]} House lines will.` (plain-error.ts mindProblem).
  const tpl = /return `The mind did not answer\. \$\{MIND_LINES\[mindProblemKind\(err\)\]\} House lines will\.`;/.exec(plainSrc);
  assert.ok(tpl, "the web's mindProblem words");
  assert.equal(M.mindTestLine(refused, "xAI"), `The mind did not answer. ${M.MIND_LINES.key} House lines will.`);
  assert.equal(M.mindTestLine({ source: "local", problem: "busy" }, "xAI"), `The mind did not answer. ${M.MIND_LINES.busy} House lines will.`);
  // A good answer: the web's `${picked.name}: “${res.text}”`.
  assert.match(testLineSrc, /if \(res\.source !== "local"\) return `\$\{picked\.name\}: \$\{said\}`;/);
  assert.equal(M.mindTestLine({ source: "xai", text: "Hello, keeper." }, "xAI"), "xAI: \u201cHello, keeper.\u201d");
  assert.equal(M.mindTestLine({ source: "local", text: "" }, "xAI"), M.MIND_UNTESTED, "not asked is not a pass");
  // Nothing leaves without the line in view.
  const held = await M.run({ bind, species: "red_panda", fallback: "", shown: "" });
  assert.equal(calls.length, 1);
  assert.equal(M.mindTestLine(held, "xAI"), M.MIND_UNTESTED);
});

test("the House window asks through main; the overlay asks the mind; the House window still has no fetch", () => {
  assert.match(settingsSrc, /connect-src 'none'/, "the House window stays without a fetch of its own");
  assert.match(settingsSrc, /<p class="hint" id="mindNet" hidden><\/p>\n\s+<button id="save" type="button">Use for all pets<\/button>\n\s+<p class="ok" id="ok"><\/p>\n\s+<p class="ok" id="mindTest"><\/p>/);
  assert.match(settingsSrc, /okLine\.textContent = kept === "none"[^\n]*\n\s+await testSaved\(\);/);
  const t = settingsSrc.slice(settingsSrc.indexOf("async function testSaved()"), settingsSrc.indexOf('document.getElementById("save").addEventListener'));
  assert.ok(t.indexOf("netInView()") < t.indexOf("window.desk.mindTest("), "the line is in view before the test is asked");
  assert.match(t, /window\.desk\.mindTest\(mindNet\.textContent \|\| ""\)/);
  assert.match(t, /window\.PetMind\.mindTestLine\(reply, p\.name\)/);
  assert.match(preloadSrc, /mindTest: \(line\) => ipcRenderer\.invoke\("mind-test"/);
  assert.match(preloadSrc, /ipcRenderer\.on\("mind-test-run", wrapped\)/);
  assert.match(mainSrc, /ipcMain\.handle\("mind-test", \(e, line\) => \{\n\s+if \(!settingsWin \|\| settingsWin\.isDestroyed\(\) \|\| e\.sender !== settingsWin\.webContents\)/);
  assert.match(mainSrc, /ipcMain\.on\("mind-test-done", \(e, id, reply\) => \{\n\s+if \(!win \|\| win\.isDestroyed\(\) \|\| e\.sender !== win\.webContents\) return;/);
  assert.match(petSrc, /window\.desk\?\.onMindTest\?\.\(async \(line\) => \{[\s\S]{0,700}shown: line,/);
});

test("the volume slider says it is this pet's, on the desktop and the web alike", () => {
  // It said "Voice" and set every sound of the pet shown (voice, cries, steps, music, sleep sounds), for that pet only.
  const desk = /<label class="keeper-volume" data-hit>\n\s+([^\n<]+)\n\s+<input id="hud-volume"/.exec(htmlSrc);
  const web = /<label className="keeper-volume">\n\s+([^\n<{]+)\n\s+<input/.exec(webCardSrc);
  assert.ok(desk && web);
  assert.equal(desk[1].trim(), "Volume for this pet");
  assert.equal(web[1].trim(), desk[1].trim());
  // It really is per pet on both: the pet's own guest settings.
  assert.match(petSrc, /card = window\.PetCard\.setGuest\(card, kind\.key, \{ volume: Number\(hudVolume\.value\) \}\);/);
  assert.match(webCardSrc, /write\(setGuest\(card, guestKey, \{ volume: Number\(e\.target\.value\) \}\)\)/);
});

test("at the right edge the card stays by its pet and off the plate", () => {
  // The drive: the news plate (right 8%, 288 wide) at 2067..2355 and the pet at 2382..2530; the card went to
  // 1745..2059, 323 px from the pet. Now it stays at the wanted spot and is made shorter under the plate.
  const news = { left: 2067, top: 111, right: 2355, bottom: 420 };
  const spot = K.cardSpotNearPet({ x: 2238, w: 314, h: 900, bottom: 1214, plates: [news], width: 2560, petLeft: 2382, petRight: 2530 });
  assert.equal(spot.x, 2238);
  assert.equal(spot.maxH, 1214 - (420 + 8));
  assert.ok(1214 - spot.maxH >= news.bottom, "the card's top is under the plate");
  // Near a clear spot within reach, it moves there as before (the first-run weather plate case).
  const plates = [{ left: 102, top: 111, right: 392, bottom: 150 }];
  assert.deepEqual(K.cardSpotNearPet({ x: 177, w: 314, h: 1196, bottom: 1214, plates, width: 2560, petLeft: 80, petRight: 256 }), { x: 400, maxH: 0 });
  // No plate in the way: untouched.
  assert.deepEqual(K.cardSpotNearPet({ x: 900, w: 314, h: 600, bottom: 1214, plates, width: 2560, petLeft: 800, petRight: 976 }), { x: 900, maxH: 0 });
  // A plate reaching too far down (less than minH left): the far clear spot, as before.
  const tall = { left: 2067, top: 111, right: 2355, bottom: 1100 };
  assert.deepEqual(K.cardSpotNearPet({ x: 2238, w: 314, h: 900, bottom: 1214, plates: [tall], width: 2560, petLeft: 2382, petRight: 2530 }), { x: 2067 - 8 - 314, maxH: 0 });
  // pet.js caps the card's height (less its 31 of padding and border) and lets go of the cap otherwise.
  assert.match(petSrc, /const cardCap = cardMaxH \? `\$\{Math\.max\(0, cardMaxH - 31\)\}px` : "";\n\s+if \(hud\.style\.maxHeight !== cardCap\) hud\.style\.maxHeight = cardCap;/);
});
