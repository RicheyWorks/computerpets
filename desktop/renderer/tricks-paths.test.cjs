"use strict";

// Every overlay trick module, walked the way pet.js walks it: start a trick and a thank-you, step them
// to the end, and stop them early (sleep, hide, leave, a command, the card, window play). A thrown
// ReferenceError here used to escape pet.js `tick`, which schedules its next frame only at its end, so
// the whole overlay stopped. 76 modules carried a broken shorthand (`abort`, `happy`, `fromX` with no
// value in scope); this keeps them honest. No type-checker reads desktop JS, so this test is that check.

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");

const files = fs.readdirSync(__dirname).filter((n) => n.endsWith("-tricks.js") && n !== "ground-tricks.js").sort();
const STOPS = [{ asleep: true }, { hidden: true }, { leaving: true }, { cmd: "sleep" }, { cmd: "talk" }, { card: true }, { windowPlay: true }];
const finite = (o) => Object.entries(o || {}).filter(([, v]) => typeof v === "number" && !Number.isFinite(v)).map(([k]) => k);

test("there is one overlay trick module per catalog guest", () => {
  assert.equal(files.length, 221);
});

test("every trick starts, runs to the end, and stops early without throwing", () => {
  const bad = [];
  for (const f of files) {
    const M = require(path.join(__dirname, f));
    for (const k of M.TRICKS || []) {
      try {
        let tr = M.beginTrick(k, 100, 1);
        if (tr.fromX !== undefined && tr.fromX !== 100) bad.push(`${f} ${k} fromX ${tr.fromX}`);
        let n = 0;
        while (tr.phase !== "done" && n < 1000) {
          tr = M.stepTrick(tr, 0.05, {});
          if (finite(tr).length) { bad.push(`${f} ${k} ${finite(tr)} not a number`); break; }
          n++;
        }
        if (tr.phase !== "done") bad.push(`${f} ${k} never ends`);
        if (M.DUR && !(M.DUR[k] > 0)) bad.push(`${f} DUR has no ${k}`);
        for (const stop of STOPS) {
          const out = M.stepTrick(M.beginTrick(k, 100, 1), 0.05, stop);
          if (out.abort !== undefined && out.abort !== true) bad.push(`${f} ${k} abort ${out.abort}`);
        }
      } catch (err) {
        bad.push(`${f} ${k}: ${err.name} ${err.message}`);
      }
    }
  }
  assert.deepEqual(bad, []);
});

test("every thank-you starts, runs to the end, and stops early without throwing", () => {
  const bad = [];
  for (const f of files) {
    const M = require(path.join(__dirname, f));
    for (const k of M.HAPPY || []) {
      try {
        let h = M.beginHappy(k, 100, 1);
        if (h.happy !== true) bad.push(`${f} ${k} happy ${h.happy}`);
        if (h.fromX !== undefined && h.fromX !== 100) bad.push(`${f} ${k} fromX ${h.fromX}`);
        let n = 0;
        while (h.phase !== "done" && n < 1000) {
          h = M.stepHappy(h, 0.05, {});
          if (finite(h).length) { bad.push(`${f} ${k} ${finite(h)} not a number`); break; }
          n++;
        }
        if (h.phase !== "done") bad.push(`${f} ${k} never ends`);
        if (M.HAPPY_DUR && !(M.HAPPY_DUR[k] > 0)) bad.push(`${f} HAPPY_DUR has no ${k}`);
        for (const stop of STOPS) {
          const out = M.stepHappy(M.beginHappy(k, 100, 1), 0.05, stop);
          if (out.abort !== undefined && out.abort !== true) bad.push(`${f} ${k} abort ${out.abort}`);
        }
      } catch (err) {
        bad.push(`${f} ${k}: ${err.name} ${err.message}`);
      }
    }
    if (M.startThankYou && M.TRICK_KEY) {
      try {
        M.startThankYou(M.TRICK_KEY, null, 100, 1, { cmd: "idle" });
      } catch (err) {
        bad.push(`${f} startThankYou: ${err.name} ${err.message}`);
      }
    }
  }
  assert.deepEqual(bad, []);
});

test("every pose gives numbers across a long hold", () => {
  const bad = [];
  for (const f of files) {
    const M = require(path.join(__dirname, f));
    for (const [name, fn] of Object.entries(M)) {
      if (typeof fn !== "function" || !/Pose$/.test(name)) continue;
      for (let t = 0; t <= 14; t += 0.37) {
        const out = fn(t, 100, 1);
        if (out && typeof out === "object" && finite(out).length) {
          bad.push(`${f} ${name} t=${t.toFixed(2)} ${finite(out)}`);
          break;
        }
      }
    }
  }
  assert.deepEqual(bad, []);
});

test("the four thank-yous and the one trick the type work found now finish with real numbers", () => {
  const cases = [
    ["choir-tricks.js", "motetPose", "motet"],
    ["nimbus-tricks.js", "fogbowPose", "fogbow"],
    ["gecko-tricks.js", "denspadPose", "denspad"],
    ["gecko-tricks.js", "inkpadPose", "inkpad"],
  ];
  for (const [f, pose, key] of cases) {
    const M = require(path.join(__dirname, f));
    assert.ok(M.HAPPY_DUR[key] > 0, `${f} HAPPY_DUR.${key}`);
    const mid = M[pose](M.HAPPY_DUR[key] / 2);
    assert.ok(Number.isFinite(mid.lift) && Number.isFinite(mid.rot), `${f} ${pose} mid`);
  }
  const Morel = require(path.join(__dirname, "morel-tricks.js"));
  assert.equal(Morel.DUR.costa, 1.68);
  assert.equal("stipe" in Morel.DUR, false);
  let tr = Morel.beginTrick("costa", 100, 1);
  let steps = 0;
  while (tr.phase !== "done" && steps < 200) {
    tr = Morel.stepTrick(tr, 0.05, {});
    steps++;
  }
  assert.equal(tr.phase, "done");
  assert.ok(steps <= Math.ceil(Morel.DUR.costa / 0.05) + 1, `costa took ${steps} steps`);
});
