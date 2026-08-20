import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalogSrc = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");
const visitorSrc = readFileSync(join(root, "src/lib/pets/visitor.ts"), "utf8");
const rosterSrc = readFileSync(join(root, "src/lib/pets/roster.ts"), "utf8");
const pySrc = readFileSync(join(root, "../client/tests/test_visitor.py"), "utf8");

const KEYS = [...catalogSrc.matchAll(/\{ key: "([a-z0-9_]+)"/g)].map((m) => m[1]);

function civilDay(year, month, day) {
  return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
}

function todaysVisitor(hostKey, year, month, day) {
  const others = KEYS.filter((key) => key !== hostKey);
  return others[Math.abs(civilDay(year, month, day) + hostKey.length) % others.length];
}

test("today's visitor walks two hundred minus the host", () => {
  assert.equal(KEYS.length, 200);
  assert.match(visitorSrc, /LIVING_KINDS\.filter\(\(k\) => k\.key !== hostKey\)/);
  assert.match(visitorSrc, /Math\.abs\(day \+ hostKey\.length\) % others\.length/);
  assert.match(rosterSrc, /\.\.\.SHORE_ROSTER/);
  assert.match(rosterSrc, /\.\.\.MEADOW_ROSTER/);
  assert.equal(todaysVisitor("red_panda", 2026, 8, 17), "flying_squirrel");
  assert.notEqual(todaysVisitor("red_panda", 2026, 8, 17), "red_panda");
});

test("the house pins match the blotter after the canopy", () => {
  // Same civil days as client/tests/test_visitor.py. A leftover that adds a den must move both.
  assert.equal(todaysVisitor("red_panda", 2026, 8, 17), "flying_squirrel");
  assert.equal(todaysVisitor("ball_python", 2026, 8, 17), "tarsier");
  assert.equal(todaysVisitor("red_panda", 2026, 1, 1), "tardigrade");
  assert.equal(todaysVisitor("red_panda", 2024, 6, 9), "gibbon");
  assert.match(pySrc, /todays_visitor\("red_panda", now\)\.key == "flying_squirrel"/);
  assert.match(pySrc, /todays_visitor\("ball_python", now\)\.key == "tarsier"/);
  assert.match(pySrc, /Glide may call/);
  assert.doesNotMatch(pySrc, /turkey_tail/);
  assert.doesNotMatch(pySrc, /Ring may call/);
  assert.doesNotMatch(pySrc, /Pebble may call/);
});

test("every living kind keeps a visit line", () => {
  for (const key of KEYS) {
    assert.match(visitorSrc, new RegExp(`^  ${key}: "`, "m"), key);
  }
  assert.match(visitorSrc, /fiddler_crab: "I waved\. Then I left the marsh\."/);
  assert.match(visitorSrc, /field_cricket: "I sang\. Then I left the grass\."/);
  assert.match(visitorSrc, /sloth: "I hung\. Then I left the bough\."/);
  assert.match(visitorSrc, /koala: "I chewed\. Then I left the gum\."/);
  assert.match(visitorSrc, /I came\. I saw the lamp\. I left\./);
});
