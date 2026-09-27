import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

// Every guest's idle trick names and feed-happy thank-you names must be its own.
// When two guests shared a name (veil, rosette, eyespot, band; pearl, candela,
// gracilis), the earliest owner kept it and the later guest got a species-true
// rename. This test fails if any trick name or any happy name is ever shared again.

const petsDir = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "lib", "pets");

function readNames() {
  const out = { TRICKS: new Map(), HAPPY: new Map() };
  let modules = 0;
  for (const file of readdirSync(petsDir).filter((f) => f.endsWith("-tricks.ts")).sort()) {
    const guest = file.slice(0, -"-tricks.ts".length);
    const src = readFileSync(join(petsDir, file), "utf8");
    let found = false;
    for (const m of src.matchAll(/export const (TRICKS|HAPPY) = \[([^\]]*)\]/g)) {
      found = true;
      for (const n of m[2].matchAll(/"([^"]+)"/g)) {
        const owners = out[m[1]].get(n[1]) ?? [];
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

test("every web trick module is scanned", () => {
  const { modules, TRICKS, HAPPY } = readNames();
  assert.ok(modules >= 220, `expected at least 220 trick modules, scanned ${modules}`);
  assert.ok(TRICKS.size >= 1000);
  assert.ok(HAPPY.size >= 600);
});

test("no idle trick name is shared by two guests", () => {
  assert.deepEqual(shared(readNames().TRICKS), []);
});

test("no feed-happy thank-you name is shared by two guests", () => {
  assert.deepEqual(shared(readNames().HAPPY), []);
});

test("earliest owners keep the formerly shared names; later guests carry the renames", () => {
  const { TRICKS, HAPPY } = readNames();
  const keep = { veil: "octopus", rosette: "sundew", eyespot: "euglena", band: "kingsnake" };
  for (const [name, guest] of Object.entries(keep)) assert.deepEqual(TRICKS.get(name), [guest]);
  const renamed = { flake: "fly_agaric", tier: "chicken_of_woods", tornusflash: "swallowtail", zonate: "turkey_tail" };
  for (const [name, guest] of Object.entries(renamed)) assert.deepEqual(TRICKS.get(name), [guest]);
  const keepHappy = { pearl: "nautilus", candela: "firefly", gracilis: "scorpion" };
  for (const [name, guest] of Object.entries(keepHappy)) assert.deepEqual(HAPPY.get(name), [guest]);
  const renamedHappy = { amabilis: "orchid", lambert: "photovore", mutabilis: "euglena" };
  for (const [name, guest] of Object.entries(renamedHappy)) assert.deepEqual(HAPPY.get(name), [guest]);
});