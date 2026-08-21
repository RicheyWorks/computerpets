const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const V = require("./visitor.js");

const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const htmlSrc = readFileSync(join(__dirname, "index.html"), "utf8");
const cssSrc = readFileSync(join(__dirname, "styles.css"), "utf8");
const webVisitor = readFileSync(join(__dirname, "..", "..", "web", "src", "lib", "pets", "visitor.ts"), "utf8");
const catalogSrc = readFileSync(join(__dirname, "..", "..", "web", "src", "lib", "pets", "catalog.ts"), "utf8");
const CATALOG = [...catalogSrc.matchAll(/\{ key: "([a-z0-9_]+)"/g)].map((m) => m[1]);

test("the overlay keeps the house visit clock", () => {
  assert.equal(V.VISIT_WAIT_MS, 7500);
  assert.equal(V.VISIT_TALK_MS, 1600);
  assert.equal(V.VISIT_WANDER_MS, 5200);
  assert.equal(V.VISIT_LEAVE_MS, 14000);
  assert.equal(V.VISIT_GONE_MS, 18500);
  assert.equal(V.visitPhaseFromEnter(0), "in");
  assert.equal(V.visitPhaseFromEnter(1599), "in");
  assert.equal(V.visitPhaseFromEnter(1600), "talk");
  assert.equal(V.visitPhaseFromEnter(5200), "wander");
  assert.equal(V.visitPhaseFromEnter(14000), "leave");
  assert.equal(V.visitPhaseFromEnter(18500), "gone");
  assert.equal(V.visitPhaseFromWait(0), "wait");
  assert.equal(V.visitPhaseFromWait(7500), "in");
  assert.equal(V.visitPhaseFromWait(9100), "talk");
  assert.equal(V.visitPhaseFromEnter(800, true), "gone");
  assert.equal(CATALOG.length, 210);
});

test("the overlay caller is today's guest, not the living sit", () => {
  assert.deepEqual(V.CATALOG_KEYS, CATALOG);
  assert.equal(V.todaysVisitor("red_panda", null, new Date(2026, 7, 17)), "cat");
  assert.equal(V.todaysVisitor("ball_python", null, new Date(2026, 7, 17)), "dog");
  assert.notEqual(V.todaysVisitor("red_panda", null, new Date(2026, 7, 17)), "red_panda");
  assert.equal(V.visitLine("axolotl"), "I grew a little more present. Then less.");
  assert.equal(V.visitLine("chickadee"), "I deeed. Then I left the cup.");
  assert.equal(V.visitLine("grouper"), "I sat the hole. Then I left the dish.");
  assert.equal(V.visitLine("not_a_pet"), "I came. I saw the lamp. I left.");
});

test("every overlay visit line is the house copy", () => {
  for (const key of CATALOG) {
    assert.equal(typeof V.VISIT_LINE[key], "string", key);
    assert.match(webVisitor, new RegExp(`^  ${key}: "`, "m"), key);
    assert.equal(V.visitLine(key), webVisitor.match(new RegExp(`^  ${key}: "([^"]+)"`, "m"))[1], key);
  }
});

test("the overlay walks the house call, and a tap says the visit line", () => {
  assert.match(htmlSrc, /visitor\.js/);
  assert.match(htmlSrc, /id="guest"[^>]*data-hit/);
  assert.match(cssSrc, /#guest\.show[\s\S]*pointer-events: auto/);
  assert.match(petSrc, /PetVisitor/);
  assert.match(petSrc, /visitPhaseFromEnter/);
  assert.match(petSrc, /tapVisitor/);
  assert.match(petSrc, /VISIT_WAIT_MS/);
  assert.doesNotMatch(petSrc, /const VISIT_LINE = \{/);
  assert.doesNotMatch(petSrc, /age > 18000/);
  assert.doesNotMatch(petSrc, /age > 13500/);
  assert.doesNotMatch(petSrc, /I came\. I left\./);
});
