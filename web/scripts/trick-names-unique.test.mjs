import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

// Every guest's idle trick names and feed-happy thank-you names must be its own,
// across both kinds: a name used as one guest's trick may not be another guest's
// thank-you. When two guests shared a name, the earliest owner kept it and the
// later guest got a species-true rename. Ethogram *_soft names follow the same
// rule: no soft may sit in two guests' rows.

const petsDir = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "lib", "pets");

function readNames() {
  const out = { TRICKS: new Map(), HAPPY: new Map(), ALL: new Map() };
  let modules = 0;
  for (const file of readdirSync(petsDir).filter((f) => f.endsWith("-tricks.ts")).sort()) {
    const guest = file.slice(0, -"-tricks.ts".length);
    const src = readFileSync(join(petsDir, file), "utf8");
    let found = false;
    for (const m of src.matchAll(/export const (TRICKS|HAPPY) = \[([^\]]*)\]/g)) {
      found = true;
      for (const n of m[2].matchAll(/"([^"]+)"/g)) {
        for (const map of [out[m[1]], out.ALL]) {
          const owners = map.get(n[1]) ?? [];
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
  const src = readFileSync(join(petsDir, "ethogram.ts"), "utf8");
  const softs = new Map();
  const holds = new Map();
  let rows = 0;
  for (const line of src.split(/\r?\n/)) {
    const row = line.match(/^\s*"?([a-z_]+)"?: \[(A\(.*)\],?\s*$/);
    if (!row) continue;
    rows += 1;
    for (const a of row[2].matchAll(/A\("([a-z_]+_soft)"/g)) {
      const owners = softs.get(a[1]) ?? [];
      if (!owners.includes(row[1])) owners.push(row[1]);
      softs.set(a[1], owners);
    }
    for (const h of row[2].matchAll(/A\("([a-z_]+)", "sit_hold"/g)) {
      const owners = holds.get(h[1]) ?? [];
      if (!owners.includes(row[1])) owners.push(row[1]);
      holds.set(h[1], owners);
    }
  }
  return { softs, holds, rows };
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

test("no name is used by two guests across tricks and thank-yous combined", () => {
  assert.deepEqual(shared(readNames().ALL), []);
});

test("no ethogram *_soft name sits in two guests' rows", () => {
  const { softs, rows } = readSofts();
  assert.ok(rows >= 220, `expected at least 220 ethogram rows, scanned ${rows}`);
  assert.ok(softs.size >= 1000);
  assert.deepEqual(shared(softs), []);
});

test("earliest owners keep the formerly shared names; later guests carry the renames", () => {
  const { ALL } = readNames();
  const keep = {
    veil: "octopus", rosette: "sundew", eyespot: "euglena", band: "kingsnake",
    pearl: "nautilus", candela: "firefly", gracilis: "scorpion",
    bark: "chinchilla", press: "iguana", lumen: "moon_jelly", bead: "moss", pipe: "seahorse", soft: "hedgehog",
  };
  const renamed = {
    flake: "fly_agaric", tier: "chicken_of_woods", tornusflash: "swallowtail", zonate: "turkey_tail",
    amabilis: "orchid", lambert: "photovore", mutabilis: "euglena",
    epiphyte: "orchid", adhere: "sea_star", fluence: "photovore", hemolymph: "ladybird", tooting: "honey_queen", tender: "chicken_of_woods",
  };
  for (const [name, guest] of Object.entries({ ...keep, ...renamed })) assert.deepEqual(ALL.get(name), [guest], name);
  const { softs } = readSofts();
  assert.deepEqual(softs.get("bulb_soft"), ["fly_agaric"]);
  assert.deepEqual(softs.get("stipe_soft"), ["maidenhair"]);
  for (const [soft, guest] of Object.entries({ fluence_soft: "photovore", tooting_soft: "honey_queen", tender_soft: "chicken_of_woods" })) {
    assert.deepEqual(softs.get(soft), [guest], soft);
  }
});

test("no ethogram long-hold (sit_hold) name sits in two guests' rows", () => {
  const { holds } = readSofts();
  assert.ok(holds.size >= 200);
  assert.deepEqual(shared(holds), []);
});
