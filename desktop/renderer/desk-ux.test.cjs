const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const Life = require("./life.js");
const Choice = require("./choice.js");
const Call = require("./call-guests.js");

const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const mainSrc = readFileSync(join(__dirname, "..", "main.cjs"), "utf8");
const preloadSrc = readFileSync(join(__dirname, "..", "preload.cjs"), "utf8");
const cssSrc = readFileSync(join(__dirname, "styles.css"), "utf8");

test("life alerts carry need ids and map to care commands", () => {
  const now = Date.now();
  const cooled = now - 21 * 60 * 1000;
  function sample(patch) {
    const life = Object.assign(Life.blank(now), patch, { lastNotify: cooled });
    return Life.alerts(life, "Rui", now);
  }
  assert.equal(sample({ sick: true }).need, "sick");
  assert.equal(Life.careForNeed("sick"), "medicine");
  assert.equal(sample({ sick: false, hunger: 10 }).need, "hunger");
  assert.equal(Life.careForNeed("hunger"), "feed");
  assert.equal(sample({ hunger: 50, hygiene: 10 }).need, "hygiene");
  assert.equal(Life.careForNeed("hygiene"), "bath");
  assert.equal(sample({ hygiene: 50, mess: [{}, {}] }).need, "mess");
  assert.equal(Life.careForNeed("mess"), "clean");
  assert.equal(sample({ mess: [], hidden: true }).need, "hidden");
  assert.equal(Life.careForNeed("hidden"), "call");
});

test("notify IPC payload and click open-care wiring", () => {
  assert.match(preloadSrc, /typeof title === "object"/);
  assert.match(mainSrc, /note\.on\("click"/);
  assert.match(mainSrc, /PetCard\.noteCommand\(payload, currentKey\)/);
  assert.match(mainSrc, /webContents\.send\("command", click\)/);
  assert.match(petSrc, /function openCareFromNotify/);
  assert.match(petSrc, /cmd\.type === "open-care"/);
  assert.match(petSrc, /desk\?\.notify\(\{[\s\S]*need:/);
  assert.match(cssSrc, /data-need-focus/);
});

test("called guest tap opens choice marks, not dismiss-only", () => {
  assert.match(petSrc, /onPress:/);
  assert.doesNotMatch(petSrc, /onDismiss:\s*\(g\)\s*=>\s*\{\s*Object\.assign\(g,\s*G\.dismissCalled/);
  assert.match(petSrc, /openChoice\(\{\s*role:\s*"called"/);
  assert.match(petSrc, /Send home|role === "called"/);
  const marks = Choice.guestMarks({ role: "called", walking: false }).map((m) => m.id);
  assert.deepEqual(marks, ["talk", "treat", "play", "walk", "send", "close", "exit"]);
  assert.equal(Choice.guestPick("send"), "send");
});

test("called guests drag-place and stay until walk", () => {
  let g = Call.beginCalled("chickadee", 800, 0, 1);
  g = Call.placeCalled(g, 320, 800);
  assert.equal(g.placed, true);
  assert.equal(g.phase, "stay");
  assert.equal(g.x, 320);
  const stayed = Call.stepCalled(g, 5, 800, {});
  assert.equal(stayed.phase, "stay");
  assert.equal(stayed.x, 320);
  assert.equal(stayed.placed, true);
  assert.match(petSrc, /calledPress/);
  assert.match(petSrc, /placeCalled/);
  assert.equal(Call.clickMoved(9, 0), true);
  assert.equal(Call.clickMoved(2, 2), false);
});

test("visit tap opens guest marks and supports drag place", () => {
  const marks = Choice.guestMarks({ role: "visit" }).map((m) => m.id);
  assert.deepEqual(marks, ["talk", "treat", "play", "walk", "send", "close", "exit"]);
  assert.match(petSrc, /visitPress/);
  assert.match(petSrc, /openChoice\(\{\s*role:\s*"visit"/);
  assert.match(petSrc, /visit\.placed = true/);
});
