const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const G = require("./call-guests.js");
const roster = require("./roster.json");

const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const htmlSrc = readFileSync(join(__dirname, "index.html"), "utf8");
const styleSrc = readFileSync(join(__dirname, "styles.css"), "utf8");
const mainSrc = readFileSync(join(__dirname, "..", "main.cjs"), "utf8");
const preloadSrc = readFileSync(join(__dirname, "..", "preload.cjs"), "utf8");

test("Call matches a name, a group string, and a den picker", () => {
  assert.equal(roster.length, 220);
  assert.deepEqual(G.matchCall("Rui", roster), ["red_panda"]);
  assert.deepEqual(G.matchCall("Sip", roster), ["hummingbird"]);
  assert.deepEqual(G.matchCall("Miso", roster), ["cat"]);
  const plants = G.matchCall("plant", roster);
  assert.equal(plants.length, 10);
  assert.ok(plants.includes("moss"));
  assert.ok(plants.includes("sundew"));
  assert.ok(!plants.includes("kelp"));
  const garden = G.callKeys("", roster, "garden");
  assert.deepEqual(garden, plants);
  assert.equal(G.matchCall("no-such-guest", roster).length, 0);
  assert.equal(G.CALL_EMPTY, "no guest from that look-up");
});

test("called guests walk, stay, and can be dismissed", () => {
  const walk = G.beginCalled("cat", 800, 0, 1);
  assert.equal(walk.phase, "in");
  const later = G.stepCalled(walk, 2, 800);
  assert.ok(G.stillVisible(later));
  const gone = G.dismissCalled(later);
  assert.equal(gone.dismissed, true);
  assert.equal(gone.phase, "leave");
  assert.deepEqual(G.walkersOf(["hummingbird", "cat"], "red_panda"), ["cat"]);
  assert.equal(G.shouldFly(["hummingbird", "moss"], "red_panda"), true);
});

test("overlay Call sits the card and the floor, and click-through does not eat type-in", () => {
  assert.match(htmlSrc, /Call Sip/);
  assert.match(htmlSrc, /id="hud-call-q"/);
  assert.match(htmlSrc, /id="hud-call-pick"/);
  assert.match(htmlSrc, /id="hud-call-group"/);
  assert.match(htmlSrc, /id="called"/);
  assert.match(htmlSrc, /call-guests\.js/);
  assert.match(petSrc, /setFocusable/);
  assert.match(petSrc, /openKeeperCard/);
  assert.match(petSrc, /spawnCalled/);
  assert.match(styleSrc, /#hud\[data-collapsed="1"\][\s\S]*display:\s*none/);
  assert.match(styleSrc, /input[\s\S]*user-select:\s*text/);
  assert.match(preloadSrc, /setFocusable/);
  assert.match(mainSrc, /set-focusable/);
  assert.match(mainSrc, /sandbox:\s*true/);
  assert.match(mainSrc, /contextIsolation:\s*true/);
  assert.match(mainSrc, /nodeIntegration:\s*false/);
  assert.doesNotMatch(petSrc, /hid a ribbon/);
});
