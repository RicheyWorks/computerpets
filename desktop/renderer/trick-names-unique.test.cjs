const assert = require("node:assert/strict");
const { readdirSync, readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");

// Desktop twin of web/scripts/trick-names-unique.test.mjs: no two guests may
// share an idle trick name or a feed-happy thank-you name in the overlay, even
// across the two kinds, and no ethogram *_soft name may sit in two guests' rows.

function readNames() {
  const out = { TRICKS: new Map(), HAPPY: new Map(), ALL: new Map() };
  let modules = 0;
  for (const file of readdirSync(__dirname).filter((f) => f.endsWith("-tricks.js")).sort()) {
    const guest = file.slice(0, -"-tricks.js".length);
    const src = readFileSync(join(__dirname, file), "utf8");
    let found = false;
    for (const m of src.matchAll(/const (TRICKS|HAPPY) = \[([^\]]*)\]/g)) {
      found = true;
      for (const n of m[2].matchAll(/"([^"]+)"/g)) {
        for (const map of [out[m[1]], out.ALL]) {
          const owners = map.get(n[1]) || [];
          if (!owners.includes(guest)) owners.push(guest);
          map.set(n[1], owners);
        }
      }
    }
    if (found) modules += 1;
  }
  return { ...out, modules };
}

function readSofts() {
  const src = readFileSync(join(__dirname, "ethogram.js"), "utf8");
  const softs = new Map();
  let rows = 0;
  for (const line of src.split(/\r?\n/)) {
    const row = line.match(/^\s*"?([a-z_]+)"?: \[(A\(.*)\],?\s*$/);
    if (!row) continue;
    rows += 1;
    for (const a of row[2].matchAll(/A\("([a-z_]+_soft)"/g)) {
      const owners = softs.get(a[1]) || [];
      if (!owners.includes(row[1])) owners.push(row[1]);
      softs.set(a[1], owners);
    }
  }
  return { softs, rows };
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

test("no overlay name is used by two guests across tricks and thank-yous combined", () => {
  assert.deepEqual(shared(readNames().ALL), []);
});

test("no overlay ethogram *_soft name sits in two guests' rows", () => {
  const { softs, rows } = readSofts();
  assert.ok(rows >= 220, `expected at least 220 ethogram rows, scanned ${rows}`);
  assert.deepEqual(shared(softs), []);
});