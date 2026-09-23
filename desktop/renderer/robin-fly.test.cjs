const assert = require("node:assert/strict");
const { existsSync, readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const R = require("./robin-fly.js");
const G = require("./call-guests.js");

const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const htmlSrc = readFileSync(join(__dirname, "index.html"), "utf8");
const cssSrc = readFileSync(join(__dirname, "styles.css"), "utf8");
const calledSrc = readFileSync(join(__dirname, "..", "..", "web", "src", "components", "desk", "called-guests.tsx"), "utf8");
const visitSrc = readFileSync(join(__dirname, "..", "..", "web", "src", "components", "desk", "house-visit.tsx"), "utf8");

const sit = ["sprites/robin/sit/1.png", "sprites/robin/sit/2.png", "sprites/robin/sit/3.png", "sprites/robin/sit/4.png"];
const play = ["sprites/robin/play/1.png", "sprites/robin/play/2.png", "sprites/robin/play/3.png", "sprites/robin/play/4.png"];
const idle = ["sprites/robin/idle/1.png"];
const walk = ["sprites/robin/walk/1.png"];

test("robin dest loads one real frame, not an empty src or two dest rects", () => {
  for (const name of sit.concat(play)) {
    assert.equal(existsSync(join(__dirname, name)), true);
  }
  const fly = R.beginRobinFly(800, 480, true);
  const src = R.destSrc(fly, { play, sit, idle, walk });
  assert.notEqual(src, "");
  assert.ok(src.includes("robin/play/"));
  const stay = { ...fly, phase: "stay", frame: 0 };
  const parked = R.destSrc(stay, { play, sit, idle, walk });
  assert.ok(parked.includes("robin/sit/"));
  assert.notEqual(parked, "");
  const img = { src: "", style: {}, setAttribute(n, v) { this[n] = v; } };
  assert.equal(R.applyDest(img), true);
  assert.equal(img.style.objectFit, "contain");
  assert.equal(img.style.objectPosition, "bottom");
  assert.equal(img.style.border, "0");
  assert.equal(img.width, String(R.DEST_PX));
  assert.match(htmlSrc, /id="robin"/);
  assert.equal((htmlSrc.match(/id="robin"/g) || []).length, 1);
  assert.match(cssSrc, /#robin[\s\S]{0,160}object-fit:\s*contain/);
  assert.match(cssSrc, /#robin[\s\S]{0,400}border:\s*0/);
  assert.match(petSrc, /PetRobinFly/);
  assert.match(petSrc, /callRobin\(\)/);
  assert.deepEqual(G.walkersOf(["hummingbird", "robin", "cat"], "red_panda"), ["cat"]);
  assert.doesNotMatch(visitSrc, /if \(hidden \|\| phase === "wait" \|\| phase === "gone"\) return null;/);
  assert.match(visitSrc, /guest\.key === ROBIN_KEY/);
  assert.match(calledSrc, /paintCalledFrame/);
  assert.doesNotMatch(calledSrc, /<img/);
});

test("robin flies, flaps, lands, stays, sings, and leaves", () => {
  let fly = R.beginRobinFly(800, 480, true);
  assert.equal(fly.phase, "enter");
  assert.equal(R.isFlying(fly.phase), true);
  assert.ok(R.wingBeat(0.2, fly.phase) < 1);
  assert.equal(R.wingBeat(0.2, "stay"), 1);
  for (let i = 0; i < 80 && fly.phase === "enter"; i++) fly = R.stepRobinFly(fly, 0.05, 800, 480, {});
  assert.equal(fly.phase, "cruise");
  for (let i = 0; i < 80 && fly.phase === "cruise"; i++) fly = R.stepRobinFly(fly, 0.05, 800, 480, {});
  assert.equal(fly.phase, "land");
  for (let i = 0; i < 40 && fly.phase === "land"; i++) fly = R.stepRobinFly(fly, 0.05, 800, 480, {});
  assert.equal(fly.phase, "stay");
  assert.equal(fly.lift, 0);
  assert.equal(R.shouldSing(fly), true);
  fly = R.markSung(fly);
  assert.equal(R.shouldSing(fly), false);
  fly = R.stepRobinFly(fly, R.MIN_STAY_S + 0.05, 800, 480, {});
  assert.equal(fly.phase, "leave");
  for (let i = 0; i < 40 && fly.phase === "leave"; i++) fly = R.stepRobinFly(fly, 0.05, 800, 480, {});
  assert.equal(fly.phase, "done");
  assert.equal(R.stillVisible(fly), false);
});
