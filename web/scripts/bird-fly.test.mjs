import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const F = await import(join(root, "src/lib/pets/bird-fly.ts"));
const Overlay = createRequire(import.meta.url)(join(root, "../desktop/renderer/bird-fly.js"));

test("Sip is the house bird and she stays long enough to see", () => {
  assert.equal(F.FLY_BIRD_KEY, "hummingbird");
  assert.equal(F.FLY_BIRD_NAME, "Sip");
  assert.equal(F.FLY_BIRD_SLUG, "sip");
  assert.ok(F.MIN_STAY_S >= 24);
  assert.equal(Overlay.FLY_BIRD_KEY, "hummingbird");
  assert.equal(Overlay.MIN_STAY_S, F.MIN_STAY_S);
});

test("a fly-by enters, hovers, cruises, and calls", () => {
  let fly = F.beginFly(800, 480, true);
  assert.equal(fly.phase, "enter");
  assert.equal(F.shouldCall(fly), false);
  fly.callAt = 0;
  assert.equal(F.shouldCall(fly), true);
  fly = F.markCalled(fly);
  assert.equal(F.shouldCall(fly), false);
  fly = F.stepFly(fly, 1.2, 800, 480);
  assert.equal(fly.phase, "hover");
  fly = F.stepFly(fly, 2.3, 800, 480);
  assert.equal(fly.phase, "cruise");
  assert.equal(F.stillVisible(fly), true);
  const hidden = F.stepFly(fly, 0.1, 800, 480, { hidden: true });
  assert.equal(hidden.phase, "done");
});
