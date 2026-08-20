import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const H = await import(join(root, "src/lib/pets/hive.ts"));
const C = await import(join(root, "src/lib/pets/care.ts"));
const Clutch = await import(join(root, "src/lib/pets/clutch.ts"));
const G = await import(join(root, "src/lib/pets/genetics.ts"));

const hiveSrc = readFileSync(join(root, "src/lib/pets/hive.ts"), "utf8");
const denSrc = readFileSync(join(root, "src/components/desk/hive-den.tsx"), "utf8");
const pageSrc = readFileSync(join(root, "src/routes/hive.tsx"), "utf8");
const careSrc = readFileSync(join(root, "src/lib/pets/care.ts"), "utf8");
const livingSrc = readFileSync(join(root, "src/components/desk/living-pet.tsx"), "utf8");
const gardenSrc = readFileSync(join(root, "src/components/desk/garden-den.tsx"), "utf8");
const cellarSrc = readFileSync(join(root, "src/components/desk/cellar-den.tsx"), "utf8");
const farSrc = readFileSync(join(root, "src/components/desk/far-den.tsx"), "utf8");
const seaSrc = readFileSync(join(root, "src/components/desk/sea-den.tsx"), "utf8");
const nestSrc = readFileSync(join(root, "src/routes/nest.tsx"), "utf8");
const speciesSrc = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");
const beeSrc = readFileSync(join(root, "src/lib/pets/bees.ts"), "utf8");
const insectSrc = readFileSync(join(root, "src/lib/pets/insects.ts"), "utf8");
const roomsSrc = readFileSync(join(root, "src/lib/pets/rooms.ts"), "utf8");

const now = 1_700_000_000_000;

test("Wax is the place; Comb, Keep, Hum, and a worker sit on it", () => {
  assert.equal(H.HIVE_PLACE, "honeycomb");
  assert.equal(H.HIVE_WORKER, "honeybee");
  assert.deepEqual([...H.HIVE_SITTERS], ["honeybee", "honey_queen", "honey_drone"]);
  assert.equal(H.isHivePlace("honeycomb"), true);
  assert.equal(H.isHivePlace("honeybee"), false);
  assert.equal(H.sitsOnWax("honeybee"), true);
  assert.equal(H.sitsOnWax("honey_queen"), true);
  assert.equal(H.sitsOnWax("honey_drone"), true);
  assert.equal(H.sitsOnWax("honeycomb"), false);
  assert.equal(H.sitsOnWax("bumblebee"), false);
  const seats = H.combSeats();
  assert.deepEqual(
    seats.map((s) => s.key),
    ["honey_queen", "honeybee", "honeybee", "honey_drone"],
  );
  assert.ok(seats.every((s) => s.lift > 0));
  assert.ok(seats.some((s) => s.seat === "worker"));
});

test("walkers stay on the wood; Wax and sitters keep the comb", () => {
  const keys = [
    "honeybee",
    "monarch",
    "bumblebee",
    "honey_queen",
    "honey_drone",
    "honeycomb",
    "mason_bee",
  ];
  assert.deepEqual(H.hiveWalkers(keys), ["monarch", "bumblebee", "mason_bee"]);
});

test("brood and stores are a reading of the sanctuary line", () => {
  const fresh = C.blankCare(now);
  const living = H.colonyOf({ ...fresh, hunger: 78, health: 92 });
  assert.equal(living.quiet, false);
  assert.equal(living.stores, 78);
  assert.equal(living.brood, 7);
  assert.match(H.colonyWord(living), /Brood in some cells/);

  const named = H.colonyOf({ ...fresh, hunger: 40, health: 50, brood: 3, stores: 40 });
  assert.equal(named.brood, 3);
  assert.equal(named.stores, 40);

  const empty = H.colonyOf({ ...fresh, hunger: 8, health: 0, brood: 0, stores: 8 });
  assert.equal(empty.quiet, true);
  assert.equal(H.colonyWord(empty), "The line went quieter.");
});

test("packLine / seedCareFromRow keep brood and stores on the same line", () => {
  const stamped = H.stampColony({ ...C.blankCare(now), hunger: 78, health: 92 });
  assert.equal(stamped.brood, 7);
  assert.equal(stamped.stores, 78);
  const packed = C.packLine(stamped);
  assert.match(packed, /"brood":7/);
  assert.match(packed, /"stores":78/);
  const dog = C.packLine(C.blankCare(now));
  assert.doesNotMatch(dog, /"brood"/);
  assert.doesNotMatch(dog, /"stores"/);

  const reloaded = C.seedCareFromRow(
    {
      hunger: 78,
      mood: 74,
      energy: 80,
      health: 92,
      hygiene: 86,
      bornAt: now,
      lastTick: now,
      line: packed,
    },
    now,
  );
  assert.equal(reloaded.brood, 7);
  assert.equal(reloaded.stores, 78);
  assert.equal(reloaded.bond, 18);

  const oldWax = C.seedCareFromRow(
    { hunger: 64, mood: 70, energy: 80, health: 50, hygiene: 80, bornAt: now, lastTick: now, line: null },
    now,
  );
  const derived = H.colonyOf(oldWax);
  assert.equal(derived.stores, 64);
  assert.equal(derived.brood, 4);
});

test("nectar fills stores; a tick stamps the colony; neglect can go quiet", () => {
  const seed = H.stampColony({ ...C.blankCare(now), hunger: 40, health: 50 });
  const fed = C.applySanctuaryCare("feed", "honeycomb", seed, now).stats;
  assert.ok(fed.stores > seed.stores);
  assert.equal(fed.stores, fed.hunger);
  assert.ok(typeof fed.brood === "number");

  const later = now + 3 * 3600 * 1000;
  const aged = C.tickCare("honeycomb", { ...fed, lastTick: now }, later);
  assert.ok(aged.stores < fed.stores);
  assert.equal(aged.stores, aged.hunger);
  assert.ok(typeof aged.brood === "number");

  const floorSince = now - C.FLOOR_STRETCH_MS;
  const gone = C.tickSanctuary(
    "honeycomb",
    { ...C.blankCare(now), health: 0, hunger: 8, hygiene: 8, brood: 0, stores: 8 },
    now,
    floorSince,
    now,
  );
  assert.ok(gone.departedAt);
  assert.equal(gone.verb, "gone");
  assert.equal(G.departVerb("honeycomb"), "went quiet");
  assert.equal(G.departLine("Wax", "honeycomb"), "Wax went quiet.");
});

test("the nest still keeps one; Wax still broods alone", async () => {
  const wax = G.canPair("honeycomb", null, { a: { stage: "grown" } });
  assert.equal(wax.ok, true);
  assert.equal(wax.path.verb, "brood");
  const genes = G.emptyGenotype("honeycomb");
  const brood = JSON.stringify([{ name: "Wax's brood", genotype: genes }]);
  const nowMs = Date.parse("2026-08-19T12:00:00Z");
  const emptyHouse = {
    pets: [],
    rows: [
      {
        id: "clutch-wax",
        user_id: "keeper",
        species_key: "honeycomb",
        parent_a: "wax-1",
        parent_b: null,
        due_at: new Date(nowMs - 1000).toISOString(),
        brood,
        resolved_at: null,
      },
    ],
    async listOpen(userId) {
      return this.rows.filter((c) => c.user_id === userId && !c.resolved_at).map((c) => ({ ...c }));
    },
    async claim(id, userId) {
      const row = this.rows.find((c) => c.id === id && c.user_id === userId && !c.resolved_at);
      if (!row) return null;
      row.resolved_at = new Date(nowMs).toISOString();
      return { ...row };
    },
    async livingInHouse() {
      return this.pets.length > 0;
    },
    async mintNestChild(opts) {
      const guest = { id: `nest-${this.pets.length + 1}`, ...opts };
      this.pets.push(guest);
      return guest;
    },
  };
  const first = await Clutch.hatchDueClutches("keeper", emptyHouse, nowMs);
  assert.equal(first.length, 1);
  assert.equal(first[0].makeActive, true);
  assert.equal(first[0].speciesKey, "honeycomb");

  const occupied = {
    ...emptyHouse,
    pets: [{ userId: "keeper" }],
    rows: [
      {
        id: "clutch-wax-2",
        user_id: "keeper",
        species_key: "honeycomb",
        parent_a: "wax-1",
        parent_b: null,
        due_at: new Date(nowMs - 1000).toISOString(),
        brood,
        resolved_at: null,
      },
    ],
  };
  const second = await Clutch.hatchDueClutches("keeper", occupied, nowMs);
  assert.equal(second.length, 1);
  assert.equal(second[0].makeActive, false);
});

test("the hive den is a living comb, not only ten sprites", () => {
  assert.match(denSrc, /HIVE_PLACE/);
  assert.match(denSrc, /combSeats/);
  assert.match(denSrc, /colonyOf/);
  assert.match(denSrc, /Nectar/);
  assert.match(denSrc, /Tend/);
  assert.match(denSrc, /lift=\{seat\.lift\}/);
  assert.match(livingSrc, /lift\?: number/);
  assert.match(pageSrc, /The comb sits\. The line stays/);
  assert.match(pageSrc, /Neglect can go quiet/);
  assert.match(pageSrc, /The nest still keeps one/);
  assert.match(pageSrc, /It is not a shop/);
  assert.match(roomsSrc, /The hive keeps a line/);
  assert.match(nestSrc, /Neglect can close a line/);
  assert.match(careSrc, /stampHiveLine/);
  assert.match(hiveSrc, /companion_pets\.line/);
  assert.match(hiveSrc, /not a shop/);
  assert.doesNotMatch(denSrc, /SKU/);
  assert.doesNotMatch(pageSrc, /\/pond/);
});

test("other dens stay; catalog is one hundred; Comb stays Comb", () => {
  assert.match(gardenSrc, /LivingBlotter/);
  assert.match(cellarSrc, /LivingBlotter/);
  assert.match(farSrc, /LivingBlotter/);
  assert.match(seaSrc, /LivingBlotter/);
  assert.doesNotMatch(gardenSrc, /combSeats/);
  assert.doesNotMatch(cellarSrc, /combSeats/);
  assert.equal([...speciesSrc.matchAll(/\{ key: "/g)].length, 100);
  assert.match(insectSrc, /slug:\s*"comb"/);
  assert.match(beeSrc, /slug:\s*"wax"/);
  assert.doesNotMatch(beeSrc, /key:\s*"honeybee"/);
  assert.doesNotMatch(hiveSrc, /amphibian/i);
  assert.doesNotMatch(denSrc, /pond/i);
});
