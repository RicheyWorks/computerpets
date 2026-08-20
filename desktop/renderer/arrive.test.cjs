const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const A = require("./arrive.js");

const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");

function onUpSrc() {
  const start = petSrc.indexOf('window.addEventListener("pointerup"');
  const end = petSrc.indexOf('window.addEventListener("pointercancel"');
  return petSrc.slice(start, end);
}

test("a drag-end does not arrive; a tap talks and does not arrive", () => {
  const tap = A.pointerUp(3, 4);
  assert.equal(tap.kind, "tap");
  assert.equal(tap.arrive, false);

  const edge = A.pointerUp(7, 0);
  assert.equal(edge.kind, "tap");
  assert.equal(edge.arrive, false);

  const drag = A.pointerUp(40, 12);
  assert.equal(drag.kind, "place");
  assert.equal(drag.arrive, false);

  const exact = A.pointerUp(A.TAP_PX, 0);
  assert.equal(exact.kind, "place");
  assert.equal(exact.arrive, false);

  const lift = onUpSrc();
  assert.match(lift, /pointerUp/);
  assert.match(lift, /afterPlace/);
  assert.doesNotMatch(lift, /applyArrive/);
  assert.doesNotMatch(lift, /issue\("eat"\)/);
  assert.doesNotMatch(lift, /issue\("play"\)/);
  assert.doesNotMatch(petSrc, /Math\.hypot\([^)]+\) < 8/);
});

test("a finished walk or seek still arrives; leave arrives when they walk off", () => {
  assert.equal(A.walkLand(true, 0), "act");
  assert.equal(A.walkLand(false, 2), "pause");
  assert.equal(A.walkLand(false, 0), "arrive");
  assert.equal(A.arriveFinish(true), "now");
  assert.equal(A.arriveFinish(false), "settle");

  assert.match(petSrc, /walkLand/);
  assert.match(petSrc, /finishArrive/);
  assert.match(petSrc, /arriveFinish/);
  assert.match(petSrc, /sim\.settle === 0 && sim\.arrivedPending/);
});

test("a place on the work area keeps the walk to the mark", () => {
  assert.equal(A.afterPlace(true), "resume");
  assert.equal(A.afterPlace(false), "idle");
  const lift = onUpSrc();
  assert.match(lift, /afterPlace/);
  assert.match(lift, /aimAt/);
  assert.match(lift, /arrivedPending = false/);
  assert.doesNotMatch(lift, /issue\("idle"\)/);
});
