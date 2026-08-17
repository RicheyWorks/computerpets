const assert = require("node:assert/strict");
const { test } = require("node:test");
const G = require("./gait.js");

test("walkSpeed ease-out is not linear", () => {
  const base = 100;
  const near = G.walkSpeed(14, 1, base);
  const linearNear = (14 / 56) * base;
  assert.equal(G.walkSpeed(56, 1, base), base);
  assert.ok(near < linearNear - 1);
});

test("a reverse target does not flip facing on frame 0", () => {
  assert.equal(G.facingAfter(1, 80, 10, 0, 0.23), 1);
  assert.equal(G.facingAfter(-1, 10, 80, 0, 0.23), -1);
  assert.equal(G.facingAfter(1, 80, 10, 0.23, 0.23), -1);
});

test("snakes and turtles turn longer and overshoot less", () => {
  assert.equal(G.isCrawlKey("ball_python"), true);
  assert.equal(G.isCrawlKey("dog"), false);
  assert.equal(G.turnHoldS({ crawl: true }), 0.35);
  assert.equal(G.overshootPx({ crawl: true }), 4);
  assert.equal(G.overshootPx({ hop: 30, walk: 122 }), 7);
});
