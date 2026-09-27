const assert = require("node:assert/strict");
const { readdirSync, readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");

// Desktop twin of web/scripts/trick-names-unique.test.mjs: no two guests may
// share an idle trick name or a feed-happy thank-you name in the overlay.

function readNames() {
  const out = { TRICKS: new Map(), HAPPY: new Map() };
  let modules = 0;
  for (const file of readdirSync(__dirname).filter((f) => f.endsWith("-tricks.js")).sort()) {
    const guest = file.slice(0, -"-tricks.js".length);
    const src = readFileSync(join(__dirname, file), "utf8");
    let found = false;
    for (const m of src.matchAll(/const (TRICKS|HAPPY) = \[([^\]]*)\]/g)) {
      found = true;
      for (const n of m[2].matchAll(/"([^"]+)"/g)) {
        const owners = out[m[1]].get(n[1]) || [];
        owners.push(guest);
        out[m[1]].set(n[1], owners);
      }
    }
    if (found) modules += 1;
  }
  return { ...out, modules };
}

function shared(map) {
  return [...map].filter(([, owners]) => owners.length > 1).map(([name, owners]) => `${name}: ${owners.join(", ")}`);
}

test("every desktop trick module is scanned", () => {
  const { modules } = readNames();
  assert.ok(modules >= 220, `expected at least 220 trick modules, scanned ${modules}`);
});

test("no overlay trick name is shared by two guests", () => {
  assert.deepEqual(shared(readNames().TRICKS), []);
});

test("no overlay thank-you name is shared by two guests", () => {
  assert.deepEqual(shared(readNames().HAPPY), []);
});