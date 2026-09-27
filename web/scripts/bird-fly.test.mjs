import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const F = await import(pathToFileURL(join(root, "src/lib/pets/bird-fly.ts")).href);
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

test("when Rui sleeps Sip comes over and perches — she does not cruise off", () => {
  assert.equal(F.PERCH_HOST, "red_panda");
  assert.equal(F.shouldPerch({ hostKey: "red_panda", hostSleeping: true }), true);
  assert.equal(F.shouldPerch({ hostKey: "red_panda", hostSleeping: false }), false);
  assert.equal(F.shouldPerch({ hostKey: "flux_dragon", hostSleeping: true }), false);
  assert.equal(Overlay.shouldPerch({ hostKey: "red_panda", hostSleeping: true }), true);
  const hold = F.perchPoint(200, 1, 0);
  const deskHold = Overlay.perchPoint(200, 1, 0);
  assert.equal(hold.x, deskHold.x);
  assert.equal(hold.lift, deskHold.lift);
  assert.ok(hold.lift >= 28 && hold.lift <= 52, "the perch sits his back, not a mid-air hover");
  let fly = F.beginFly(800, 480, true);
  fly = F.stepFly(fly, 0.2, 800, 480, { hostKey: "red_panda", hostSleeping: true, hostX: 200, hostFacing: 1, hostLift: 0 });
  assert.equal(fly.phase, "approach-perch");
  for (let i = 0; i < 40 && fly.phase !== "perch"; i++) {
    fly = F.stepFly(fly, 0.05, 800, 480, { hostKey: "red_panda", hostSleeping: true, hostX: 200, hostFacing: 1, hostLift: 0 });
  }
  assert.equal(fly.phase, "perch");
  const parked = fly;
  fly = F.stepFly(fly, 3, 800, 480, { hostKey: "red_panda", hostSleeping: true, hostX: 200, hostFacing: 1, hostLift: 0 });
  assert.equal(fly.phase, "perch");
  assert.ok(Math.abs(fly.x - parked.x) < 8, "a chill is not a cruise");
  fly = F.stepFly(fly, 0.1, 800, 480, { hostKey: "red_panda", hostSleeping: false, hostX: 200, hostFacing: 1, hostLift: 0 });
  assert.equal(fly.phase, "lift");
});

test("cruise cannot finish a sleep perch — MIN_STAY does not vanish Sip", () => {
  let fly = F.beginFly(800, 480, true);
  fly.age = F.MIN_STAY_S * 3;
  fly = F.stepFly(fly, 1.2, 800, 480);
  assert.equal(fly.phase, "hover");
  fly = F.stepFly(fly, 2.3, 800, 480);
  assert.equal(fly.phase, "cruise");
  fly.age = F.MIN_STAY_S * 3;
  fly.t = 99;
  const flags = { hostKey: "red_panda", hostSleeping: true, hostX: 200, hostFacing: 1, hostLift: 0 };
  fly = F.stepFly(fly, 0.05, 800, 480, flags);
  assert.notEqual(fly.phase, "done");
  assert.ok(fly.phase === "approach-perch" || fly.phase === "perch");
});
