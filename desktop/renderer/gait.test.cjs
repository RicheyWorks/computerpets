const assert = require("node:assert/strict");
const { test } = require("node:test");
const G = require("./gait.js");

test("walkSpeed ease-out is not linear", () => {
  const base = 100;
  const near = G.walkSpeed(24, 1, base);
  const linearNear = (24 / 56) * base;
  assert.equal(G.walkSpeed(56, 1, base), base);
  assert.ok(near > 30);
  assert.ok(near < linearNear - 1);
});

test("hide tucks at the ribbon edge; call-back still comes from off-stage", () => {
  assert.equal(G.leaveTarget(80, 800), -200);
  assert.equal(G.leaveTarget(600, 800), 812);
  assert.equal(G.hideTuck(80, 800, 176, 16), 16);
  assert.equal(G.hideTuck(600, 800, 176, 16), 608);
  assert.equal(G.enterSpawn(800, 176, 20, true), -176);
  assert.equal(G.enterSpawn(800, 176, 20, false), 780);
  assert.equal(G.enterSit(800, 176, 20, 0), 80);
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
