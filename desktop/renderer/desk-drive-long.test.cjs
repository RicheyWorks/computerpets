// What the longer first-run drive found past the first minute (PR after #1556): a Talk from the menu left for the
// mind's website while the card (and the line naming that website) was folded away; a refused key answered with a
// house line and said nothing, so it looked like the mind had answered; the held card stood wherever a walk began,
// a screen away from the pet by the end of a long one.
"use strict";
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");
const K = require("./keeper.js");

const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const htmlSrc = readFileSync(join(__dirname, "index.html"), "utf8");
const MIND_SRC = readFileSync(join(__dirname, "mind.js"), "utf8");
const WEB_PLAIN = join(__dirname, "..", "..", "web", "src", "lib", "plain-error.ts");

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
      calls.push(String(url));
      return fetchImpl(url, init);
    },
  };
  window.window = window;
  vm.runInContext(MIND_SRC, vm.createContext(window));
  return { M: window.PetMind, calls };
}

async function xaiTalk(fetchImpl) {
  const { M, calls } = loadMind(fetchImpl);
  await M.save({ default: { plugin: "xai", apiKey: "stand-in-key-not-real" }, voice: "browser", pets: {} });
  const bind = M.binding("red_panda");
  const reply = await M.run({
    species: "red_panda",
    name: "Ember",
    hunger: 40,
    mood: 50,
    energy: 60,
    system: "Be small.",
    fallback: "house line",
    lineInView: true,
    shown: M.talkHonesty(bind),
  });
  return { M, calls, reply };
}

test("a refused key still gets a house line, and the reply says why", async () => {
  // The drive: xAI with a stand-in key, api.x.ai answered 401, and the pet said a house line with nothing on the
  // card. run() swallowed every failure into { text: fallback, source: "local" }.
  const refused = await xaiTalk(async () => ({ ok: false, status: 401, json: async () => ({ error: "bad key" }) }));
  assert.equal(refused.calls.length, 1);
  assert.equal(refused.reply.text, "house line");
  assert.equal(refused.reply.source, "local");
  assert.equal(refused.reply.problem, "key");
  assert.equal(
    refused.M.talkProblemLine(refused.reply.problem),
    "The mind did not answer, so that was a house line. The AI website did not accept your key. Check your key for that AI website.",
  );
  const busy = await xaiTalk(async () => ({ ok: false, status: 429, json: async () => ({}) }));
  assert.equal(busy.reply.problem, "busy");
  const down = await xaiTalk(async () => ({ ok: false, status: 503, json: async () => ({}) }));
  assert.equal(down.reply.problem, "server");
  const gone = await xaiTalk(async () => {
    throw new TypeError("Failed to fetch");
  });
  assert.equal(gone.reply.problem, "unreachable");
  const empty = await xaiTalk(async () => ({ ok: true, status: 200, json: async () => ({ choices: [] }) }));
  assert.equal(empty.reply.problem, "empty");
  const fine = await xaiTalk(async () => ({ ok: true, status: 200, json: async () => ({ choices: [{ message: { content: "hi from the mind" } }] }) }));
  assert.equal(fine.reply.text, "hi from the mind");
  assert.equal(fine.reply.problem, undefined);
  assert.equal(fine.M.talkProblemLine(undefined), "");
});

test("a talk that never left carries no problem line", async () => {
  const { M, calls } = loadMind(async () => ({ ok: true, json: async () => ({}) }));
  const house = await M.run({ species: "red_panda", fallback: "house line", lineInView: true, shown: "" });
  assert.deepEqual(JSON.parse(JSON.stringify(house)), { text: "house line", source: "local" }, "House lines are not a failure");
  await M.save({ default: { plugin: "xai", apiKey: "stand-in-key-not-real" }, voice: "browser", pets: {} });
  const held = await M.run({ species: "red_panda", fallback: "house line", lineInView: false, shown: "" });
  assert.equal(calls.length, 0);
  assert.equal(held.problem, undefined, "held back for the line is not the mind failing");
});

test("the desktop's talk failure words are the web's own", () => {
  const { M } = loadMind(async () => ({ ok: true, json: async () => ({}) }));
  const web = readFileSync(WEB_PLAIN, "utf8");
  const block = /export const MIND_LINES = \{([\s\S]*?)\} as const;/.exec(web);
  assert.ok(block, "web MIND_LINES");
  const lines = {};
  for (const m of block[1].matchAll(/^\s+(\w+): "((?:[^"\\]|\\.)*)",$/gm)) lines[m[1]] = m[2];
  assert.deepEqual(JSON.parse(JSON.stringify(M.MIND_LINES)), lines);
  const mind = /mind: "((?:[^"\\]|\\.)*)"/.exec(/export const TALK_LINES = \{([\s\S]*?)\} as const;/.exec(web)[1]);
  assert.equal(M.TALK_MIND_LINE, mind[1]);
  // The card shows it under the talk line, and a good answer clears it.
  assert.match(htmlSrc, /<p id="hud-talk-net" class="keeper-truth" hidden><\/p>\n\s+<p id="hud-talk-why" class="keeper-truth" role="status" hidden><\/p>/);
  assert.match(petSrc, /say\(reply\.text, replyHold\(reply\.text\)\);\n(?:\s+if \(sim\.cmd === "talk"\) talkPoseUntil = speechUntil;\n)?\s+paintTalkWhy\(reply && reply\.problem && window\.PetMind\.talkProblemLine \? window\.PetMind\.talkProblemLine\(reply\.problem\) : ""\);/);
});

test("a talk leaves for the website only while its line is really in view", () => {
  // The drive: card folded, Talk from the menu, and the request reached api.x.ai at 429 ms while the line had no
  // box at all (getClientRects empty). talkLineInView looked only at el.hidden.
  const card = { left: 1000, top: 18, right: 1320, bottom: 900 };
  assert.equal(K.lineShows({ left: 1016, top: 600, right: 1300, bottom: 640 }, card, 2560, 1392), true);
  assert.equal(K.lineShows({ left: 0, top: 0, right: 0, bottom: 0 }, card, 2560, 1392), false, "a folded card: no box");
  assert.equal(K.lineShows({ left: 1016, top: 1100, right: 1300, bottom: 1140 }, card, 2560, 1392), false, "scrolled out of the card");
  assert.equal(K.lineShows({ left: 1016, top: 600, right: 1300, bottom: 640 }, null, 2560, 1392), false);
  assert.match(petSrc, /function talkLineInView\(\) \{[\s\S]{0,400}return lineOnCard\(el\);\n\}/);
  assert.match(petSrc, /function lineOnCard\(el\) \{\n\s+if \(!el \|\| el\.hidden \|\| !hud \|\| card\.collapsed \|\| !hud\.classList\.contains\("show"\)\) return false;/);
  assert.match(petSrc, /function talkShown\(\) \{\n[^\n]*\n[^\n]*!lineOnCard\(el\)\) return "";/);
  // A menu Talk opens the card so the line can show, and the line scrolls into the card's view before it leaves.
  assert.match(petSrc, /talkAsked = true;\n\s+pendingTalk = result;\n(\s+\/\/[^\n]*\n)*\s+openKeeperCard\(\);\n\s+paintHud\(\);\n(\s+\/\/[^\n]*\n)*\s+setTimeout\(\(\) => \{\n\s+if \(pendingTalk\) paintHud\(\);\n\s+\}, CARD_FADE_MS \+ 20\);/);
  // Nor while the card is still fading in (160 ms in styles.css).
  assert.match(petSrc, /if \(performance\.now\(\) - cardShownAt < CARD_FADE_MS\) return false;/);
  assert.match(petSrc, /if \(!hud\.classList\.contains\("show"\)\) cardShownAt = performance\.now\(\);/);
  assert.match(petSrc, /if \(line && pendingTalk && typeof el\.scrollIntoView === "function"\) el\.scrollIntoView\(\{ block: "nearest" \}\);/);
});

test("a card opened from the menu counts as a press, so it does not fold on the pet's next step", () => {
  // The drive: Keeper card from the menu, the hello read, and the card folded as soon as the pet wandered (a care
  // press right after it missed). cardFoldsOnWalk measures from the last press; opening was not one.
  assert.match(petSrc, /function openKeeperCard\(\) \{\n\s+if \(!card\.collapsed\) return;\n\s+card\.collapsed = false;\n(\s+\/\/[^\n]*\n)*\s+lastCardPress = performance\.now\(\);/);
  assert.equal(K.cardFoldsOnWalk({ helloUnread: false, sinceLastPress: 200 }), false, "just opened: holds");
  assert.equal(K.cardFoldsOnWalk({ helloUnread: false, sinceLastPress: K.CARD_PRESS_HOLD_MS + 1 }), true, "later it still folds on a walk");
});

test("the pet's own idle choices leave a Hide or Call back walk alone", () => {
  // The drive: menu Hide, the pet walking to the edge, and 30 s later it was wandering at 323 with leaving still set;
  // the 5.6 s idle chooser skipped Feed's walk (seek, eat) but issued wander over leave and enter.
  assert.equal(K.keeperWalkOn({ cmd: "leave", target: 16 }), true);
  assert.equal(K.keeperWalkOn({ cmd: "enter", target: 432 }), true);
  assert.equal(K.keeperWalkOn({ cmd: "leave", target: null }), false, "arrived: the chooser may go on");
  for (const cmd of ["wander", "idle", "sit", "talk", "seek"]) assert.equal(K.keeperWalkOn({ cmd, target: 500 }), false, cmd);
  const tick = petSrc.slice(petSrc.indexOf("setInterval(() => {\n  if (document.hidden || !kind || !life) return;\n  tickLife();"));
  const guard = tick.indexOf("if (window.PetKeeper?.keeperWalkOn?.({ cmd: sim.cmd, target: sim.target })) return;");
  assert.ok(guard > 0 && guard < tick.indexOf('issue("wander")'), "the guard comes before the chooser issues anything");
});

test("the held card is on a leash: a long walk pulls it along instead of leaving it behind", () => {
  // The drive: card held at 1242 while the pet walked on; the gap passed 300 px and kept growing.
  const w = 314;
  const a = K.cardHeldSpot({ open: true, walking: true, held: null, x: 400, lift: 3, petLeft: 300, petRight: 476, w, width: 2560 });
  assert.deepEqual([a.x, a.lift], [400, 3], "near the pet it holds still");
  const b = K.cardHeldSpot({ open: true, walking: true, held: a.held, x: 900, lift: 7, petLeft: 700, petRight: 876, w, width: 2560 });
  assert.deepEqual([b.x, b.lift], [400, 3], "a short walk: still held");
  const far = K.cardHeldSpot({ open: true, walking: true, held: b.held, x: 1900, lift: 7, petLeft: 1700, petRight: 1876, w, width: 2560 });
  assert.equal(far.x, 1700 - K.CARD_LEASH_PX - w, "pulled along, the leash's length from the pet");
  assert.equal(far.lift, 3);
  const back = K.cardHeldSpot({ open: true, walking: true, held: far.held, x: 100, lift: 0, petLeft: 20, petRight: 196, w, width: 2560 });
  assert.equal(back.x, 196 + K.CARD_LEASH_PX, "the other way, it trails on the pet's right");
  const edge = K.cardHeldSpot({ open: true, walking: true, held: { x: 1200, lift: 0 }, x: 2200, lift: 0, petLeft: 2380, petRight: 2556, w, width: 2560 });
  assert.ok(edge.x <= 2560 - w - 8 && edge.x >= 8, "never off the screen");
  assert.ok(K.CARD_LEASH_PX >= 80 && K.CARD_LEASH_PX <= 240);
  assert.match(petSrc, /petLeft: drawX,\n\s+petRight: drawX \+ BASE,\n\s+w: hudW,\n\s+width,\n\s+\}\);/);
  assert.match(petSrc, /if \(cardHeld && hudW && window\.PetKeeper\.cardSpotNearPet\) \{/);
});
