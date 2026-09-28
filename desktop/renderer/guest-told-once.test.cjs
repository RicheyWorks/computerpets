"use strict";
// A called guest tells its line once per visit. Each new approach used to clear `told`, so a guest who walked back
// to the pet (the pet hid and came back, or a peer came and went) said the same line again: Dee at 0.1 s and
// again at 7.6 s. The line picker's 60 s window stays as a backstop; this is the root fix.
const test = require("node:test");
const assert = require("node:assert/strict");
const Call = require("./call-guests.js");

const HOST = { hostKey: "red_panda", hostX: 200, hostFacing: 1, hostLift: 0 };
const AWAY = { ...HOST, hidden: true };

function run(guest, flags, steps) {
  let g = guest;
  let tells = 0;
  const lines = [];
  for (let i = 0; i < steps; i += 1) {
    g = Call.stepCalled(g, 0.05, 800, flags);
    if (Call.shouldTell(g)) {
      tells += 1;
      lines.push(Call.tellLine(g));
      g = Call.markTold(g);
    }
  }
  return { g, tells, lines };
}

for (const key of ["chickadee", "cat"]) {
  test(`${key}: meets the pet, the pet hides and comes back, the guest re-approaches but tells only once`, () => {
    let visit = run(Call.beginCalled(key, 800, 0, 1), HOST, 16);
    assert.equal(visit.g.phase, "meet");
    assert.equal(visit.tells, 1);
    const first = visit.lines[0];
    assert.ok(first.length > 0);
    visit = run(visit.g, AWAY, 1);
    assert.equal(visit.g.phase, "stay", "the pet hid, so the guest stays");
    const back = run(visit.g, HOST, 1);
    assert.equal(back.g.phase, "approach-meet", "the guest walks back to the pet");
    assert.equal(back.g.told, true, "the approach keeps told");
    const again = run(back.g, HOST, 20);
    assert.equal(again.tells, 0, "no second tell this visit");
  });
}

test("a new visit tells again (a fresh walker starts untold)", () => {
  const one = run(Call.beginCalled("chickadee", 800, 0, 1), HOST, 16);
  const two = run(Call.beginCalled("chickadee", 800, 0, 1), HOST, 16);
  assert.equal(one.tells, 1);
  assert.equal(two.tells, 1);
  assert.deepEqual(two.lines, [Call.DEE_RUI_LINE]);
});

test("no approach clears told any more", () => {
  const src = require("node:fs").readFileSync(require("node:path").join(__dirname, "call-guests.js"), "utf8");
  assert.doesNotMatch(src, /told: false/);
});
