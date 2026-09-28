// A called guest tells its line once per visit on the web desk. Each new approach used to clear `told`, so a guest
// who walked back to the pet (the pet hid and came back, or a peer came and went) said the same line again (Dee at
// 0.1 s and again at 7.6 s). The line picker's 60 s window stays as a backstop; this is the root fix.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as Call from "../src/lib/pets/call-guests.ts";

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
    visit = run(visit.g, AWAY, 1);
    assert.equal(visit.g.phase, "stay");
    const back = run(visit.g, HOST, 1);
    assert.equal(back.g.phase, "approach-meet");
    assert.equal(back.g.told, true);
    assert.equal(run(back.g, HOST, 20).tells, 0);
  });
}

test("a new visit tells again, and web and overlay agree step for step", async () => {
  const { createRequire } = await import("node:module");
  const Overlay = createRequire(import.meta.url)("../../desktop/renderer/call-guests.js");
  const script = (M) => {
    const out = [];
    let g = M.beginCalled("chickadee", 800, 0, 1);
    for (const [flags, n] of [[HOST, 16], [AWAY, 1], [HOST, 21]]) {
      for (let i = 0; i < n; i += 1) {
        g = M.stepCalled(g, 0.05, 800, flags);
        if (M.shouldTell(g)) {
          out.push(M.tellLine(g));
          g = M.markTold(g);
        }
      }
    }
    return out;
  };
  assert.deepEqual(script(Call), [Call.DEE_RUI_LINE]);
  assert.deepEqual(script(Overlay), script(Call));
  assert.doesNotMatch(readFileSync(join(import.meta.dirname, "..", "src", "lib", "pets", "call-guests.ts"), "utf8"), /told: false/);
});
