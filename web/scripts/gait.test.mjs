import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const gaitSrc = readFileSync(join(root, "src/lib/pets/gait.ts"), "utf8");
const livingSrc = readFileSync(join(root, "src/components/desk/living-pet.tsx"), "utf8");
const require = createRequire(import.meta.url);
const G = require(join(root, "../desktop/renderer/gait.js"));

test("living desk dropped the linear rail", () => {
  assert.match(gaitSrc, /ACCEL_S = 0\.4/);
  assert.match(gaitSrc, /function smoothstep/);
  assert.match(gaitSrc, /TURN_SNAKE_S = 0\.35/);
  assert.match(livingSrc, /turnHoldS/);
  assert.match(livingSrc, /settleOffset/);
  assert.match(livingSrc, /aimAt/);
  assert.doesNotMatch(gaitSrc, /age \/ 0\.28/);
  assert.doesNotMatch(livingSrc, /remaining < 56 \? remaining \/ 56/);
  assert.doesNotMatch(livingSrc, /s\.facing = s\.target >= s\.x \? 1 : -1/);
});

test("walkSpeed ease-out is not linear", () => {
  const base = 100;
  const near = G.walkSpeed(24, 1, base);
  const mid = G.walkSpeed(28, 1, base);
  const far = G.walkSpeed(56, 1, base);
  assert.equal(far, base);
  assert.ok(Math.abs(mid - 50) < 0.01);
  assert.ok(near < (24 / 56) * base - 1, "smoothstep is slower than linear in the last yards");
  assert.ok(near > 30);
  assert.ok(G.walkSpeed(56, 0, base) < G.walkSpeed(56, 0.2, base));
  assert.ok(G.walkSpeed(56, 0.2, base) < G.walkSpeed(56, 0.4, base));
});

test("a reverse target does not flip facing on frame 0", () => {
  assert.equal(G.facingAfter(1, 100, 20, 0, G.TURN_S), 1);
  assert.equal(G.facingAfter(1, 100, 20, G.TURN_S / 2, G.TURN_S), 1);
  assert.equal(G.facingAfter(1, 100, 20, G.TURN_S, G.TURN_S), -1);
  assert.equal(G.turnHoldS({ crawl: true }), G.TURN_SNAKE_S);
  assert.ok(G.turnHoldS({ hop: 3, walk: 26 }) > G.TURN_S);
});
