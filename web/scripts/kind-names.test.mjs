import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

// One kind name per pet across the site catalog, the site companion roster, and the overlay roster
// (client/tests/test_roster.py holds the Python blotter and the backend to the same names).
const ROOT = join(import.meta.dirname, "..", "..");
const read = (...p) => readFileSync(join(ROOT, ...p), "utf8");

test("every kind name matches across web catalog, web roster and overlay roster, for all 221", () => {
  const overlay = new Map(JSON.parse(read("desktop", "renderer", "roster.json")).map((r) => [r.key, r.speciesLabel]));
  const roster = new Map(JSON.parse(read("web", "public", "companion-roster.json")).map((r) => [r.key, r.speciesLabel]));
  const catalog = new Map(
    [...read("web", "src", "lib", "pets", "catalog.ts").matchAll(/\{ key: "([a-z0-9_]+)", displayName: "([^"]+)"/g)].map((m) => [m[1], m[2]]),
  );
  assert.equal(overlay.size, 221);
  assert.equal(roster.size, 221);
  assert.equal(catalog.size, 221);
  const drift = [];
  for (const [key, name] of overlay) {
    if (roster.get(key) !== name || catalog.get(key) !== name) drift.push({ key, overlay: name, roster: roster.get(key), catalog: catalog.get(key) });
  }
  assert.deepEqual(drift, []);
});
