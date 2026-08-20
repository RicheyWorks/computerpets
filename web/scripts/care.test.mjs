import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const C = await import(join(root, "src/lib/pets/care.ts"));
const Hours = await import(join(root, "src/lib/pets/hours.ts"));
const G = await import(join(root, "src/lib/pets/genetics.ts"));

const actionsSrc = readFileSync(join(root, "src/lib/pets/actions.ts"), "utf8");
const nestSrc = readFileSync(join(root, "src/routes/nest.tsx"), "utf8");
const kennelSrc = readFileSync(join(root, "src/routes/collection.tsx"), "utf8");
const petSrc = readFileSync(join(root, "src/routes/pets.$key.tsx"), "utf8");
const cardSrc = readFileSync(join(root, "src/components/pet-card.tsx"), "utf8");
const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const migration = readFileSync(join(root, "migrations/0004_quiet_end.sql"), "utf8");
const lineMigration = readFileSync(join(root, "migrations/0005_line.sql"), "utf8");

const DAY = 86400000;
const now = 1_700_000_000_000;

function guest(over = {}, born = now) {
  return {
    ...C.blankCare(born),
    ...over,
    bornAt: born,
    lastTick: over.lastTick ?? born,
  };
}

function rowOf(stats, line = C.packLine(stats)) {
  return {
    hunger: stats.hunger,
    mood: stats.mood,
    energy: stats.energy,
    health: stats.health,
    hygiene: stats.hygiene,
    bornAt: stats.bornAt,
    lastTick: stats.lastTick,
    line,
  };
}

test("health at the floor for the stretch sets a departure", () => {
  const stats = guest({ health: 0, hunger: 8, hygiene: 8 });
  const floorSince = now - C.FLOOR_STRETCH_MS;
  const tick = C.tickSanctuary("dog", stats, now, floorSince, now);
  assert.ok(tick.departedAt);
  assert.ok(tick.verb);
  assert.equal(tick.stats.health, 0);
  assert.equal(G.departVerb("dog"), "left");
});

test("already spent at last tick, stretch elapsed in one visit, they leave", () => {
  const last = now - C.FLOOR_STRETCH_MS;
  const tick = C.tickSanctuary("dog", guest({ health: 0, hunger: 5, lastTick: last }), last, null, now);
  assert.ok(tick.departedAt);
  assert.ok(!Number.isNaN(tick.departedAt));
});

test("recovering health before the stretch keeps them", () => {
  const floorSince = now - 60 * 60 * 1000;
  const critical = C.tickSanctuary("dog", guest({ health: 0, hunger: 8, hygiene: 8 }), now, floorSince, now);
  assert.equal(critical.departedAt, null);
  assert.ok(critical.floorSince);

  const saved = C.applySanctuaryCare("medicine", "dog", critical.stats, now);
  assert.ok(saved.stats.health > C.HEALTH_FLOOR);

  const later = now + 60_000;
  const tick = C.tickSanctuary(
    "dog",
    { ...saved.stats, hunger: 80, hygiene: 80, lastTick: now },
    now,
    null,
    later,
  );
  assert.equal(tick.departedAt, null);
  assert.equal(tick.floorSince, null);
});

test("feed / clean / rest lift a guest still in the stretch", () => {
  const down = guest({ health: 0, hunger: 10, hygiene: 10 });
  assert.ok(C.applySanctuaryCare("feed", "dog", down, now).stats.health > 0);
  assert.ok(C.applySanctuaryCare("clean", "dog", down, now).stats.health > 0);
  assert.ok(C.applySanctuaryCare("rest", "dog", down, now).stats.health > 0);
});

test("luna: adult feed does not fill hunger; after a week she spends", () => {
  const grownAt = now;
  const grownBorn = now - 2 * DAY;
  const adult = guest({ hunger: 40, health: 88 }, grownBorn);
  const fed = C.applySanctuaryCare("feed", "luna", adult, grownAt);
  assert.equal(fed.stats.hunger, 40);
  assert.match(fed.note ?? "", /does not eat/);

  const kit = guest({ hunger: 40 }, now);
  const kitFed = C.applySanctuaryCare("feed", "luna", kit, now);
  assert.ok(kitFed.stats.hunger > 40);

  const week = C.tickSanctuary(
    "luna",
    guest({ health: 90, hunger: 70, lastTick: now }, now - C.LUNA_SPAN_MS),
    now,
    null,
    now,
  );
  assert.ok(week.departedAt);
  assert.equal(week.verb, "spent");

  const midweek = C.tickSanctuary(
    "luna",
    guest({ health: 90, hunger: 70, lastTick: now }, now - 3 * DAY),
    now,
    null,
    now,
  );
  assert.equal(midweek.departedAt, null);
});

test("hatchling canPair is false; yeast waits until grown; dog × oyster still fails", () => {
  const kit = G.canPair("dog", "dog", { a: { stage: "hatchling" }, b: { stage: "grown" } });
  assert.equal(kit.ok, false);

  const yeastKit = G.canPair("yeast", null, { a: { stage: "hatchling" } });
  assert.equal(yeastKit.ok, false);

  const yeastGrown = G.canPair("yeast", null, { a: { stage: "grown" } });
  assert.equal(yeastGrown.ok, true);
  assert.equal(yeastGrown.path.verb, "split");

  const pair = G.canPair("dog", "dog", { a: { stage: "grown" }, b: { stage: "elder" } });
  assert.equal(pair.ok, true);

  const no = G.canPair("dog", "oyster");
  assert.equal(no.ok, false);
});

test("species-true depart verbs stay quiet", () => {
  assert.equal(G.departVerb("dog"), "left");
  assert.equal(G.departVerb("ball_python"), "went still");
  assert.equal(G.departVerb("goldfish"), "went still");
  assert.equal(G.departVerb("oak"), "wilted");
  assert.equal(G.departVerb("oyster"), "dried");
  assert.equal(G.departVerb("luna"), "spent");
  assert.equal(G.departVerb("honeybee"), "spent");
  assert.equal(G.departVerb("yeast"), "went sour");
  assert.equal(G.departVerb("lichen"), "the pact thinned");
  assert.equal(G.departVerb("photovore"), "went dark");
  assert.equal(G.departVerb("umbral"), "cooled");
  assert.equal(G.departVerb("cyst"), "opened");
  assert.match(G.departLine("Ghost", "luna"), /spent/);
  assert.match(G.departLine("Pact", "lichen"), /pact thinned/);
});

test("the desk ages from lastTick; saveCare keeps the window", () => {
  const day = new Date(2023, 10, 14, 14, 0, 0).getTime();
  const hours = 3 * 3600 * 1000;
  const then = day - hours;
  const prior = guest({ hunger: 78, lastTick: then }, then);
  const live = C.tickCare("dog", prior, day);
  assert.equal(live.hunger, 28);
  assert.ok(live.mood < prior.mood);
  assert.ok(live.energy < prior.energy);
  assert.ok(live.hygiene < prior.hygiene);
  assert.equal(live.lastTick, day);

  const mem = new Map();
  globalThis.localStorage = {
    getItem: (k) => (mem.has(k) ? mem.get(k) : null),
    setItem: (k, v) => {
      mem.set(k, String(v));
    },
    removeItem: (k) => {
      mem.delete(k);
    },
    clear: () => mem.clear(),
  };

  C.saveCare("computerpets.desk.dog.v1", prior);
  const stored = JSON.parse(mem.get("computerpets.desk.dog.v1"));
  assert.equal(stored.lastTick, then);
  assert.equal(stored.hunger, 78);

  const loaded = C.loadCare("computerpets.desk.dog.v1", undefined, "dog", day);
  assert.equal(loaded.hunger, 28);
  assert.equal(loaded.lastTick, day);
});

test("night slows hunger and restores energy the way the overlay already does", () => {
  const night = new Date(2023, 10, 14, 23, 0, 0).getTime();
  const then = night - 3 * 3600 * 1000;
  const prior = guest({ hunger: 78, energy: 40, lastTick: then }, then);
  const live = C.tickCare("dog", prior, night);
  assert.equal(live.hunger, 56);
  assert.ok(live.energy > prior.energy);
  assert.equal(C.DESK_TEND.map((m) => m.action).join(" "), "rest clean bath medicine praise");
  assert.deepEqual(Hours.restWindow("goldfish"), [23, 5]);
  assert.deepEqual(Hours.restWindow("ferret"), [10, 17]);
  assert.equal(Hours.isRestingHour("dog", 23), true);
  assert.equal(Hours.isRestingHour("dog", 14), false);
});

test("adult Luna still does not eat, and a desk tick does not empty her", () => {
  const grownBorn = now - 2 * DAY;
  const adult = guest({ hunger: 40, lastTick: now - 3 * 3600 * 1000 }, grownBorn);
  assert.equal(C.adultLuna("luna", adult, now), true);
  assert.equal(C.applyFeedFor("luna", adult, now).hunger, 40);
  const aged = C.tickCare("luna", adult, now);
  assert.equal(aged.hunger, 40);
  assert.ok(aged.mood < adult.mood);
});

test("sanctuary persists health and the floor stretch; kennel and nest show the stage", () => {
  assert.match(migration, /health/);
  assert.match(migration, /hygiene/);
  assert.match(migration, /floor_since/);
  assert.match(actionsSrc, /persistTick/);
  assert.match(actionsSrc, /tickSanctuary/);
  assert.match(actionsSrc, /floor_since/);
  assert.match(actionsSrc, /health = \$\{/);
  assert.match(actionsSrc, /applySanctuaryCare/);
  assert.doesNotMatch(actionsSrc, /0x[a-fA-F0-9]{40}/);
  assert.match(kennelSrc, /left\.join/);
  assert.match(kennelSrc, /Neglect can close a line/);
  assert.match(cardSrc, /pet\.stage/);
  assert.match(nestSrc, /pet\.stage/);
  assert.match(nestSrc, /A hatchling cannot pair/);
  assert.match(nestSrc, /Grown and elder may sit/);
  assert.match(petSrc, /Health/);
  assert.match(petSrc, /Medicine/);
  assert.doesNotMatch(nestSrc, /skull/i);
  assert.doesNotMatch(kennelSrc, /\+50 XP/);
  assert.doesNotMatch(petSrc, /game over/i);
});

test("a missing sanctuary line hydrates as New / empty blotter", () => {
  const seed = C.seedCareFromRow(
    { hunger: 78, mood: 74, energy: 80, health: 92, hygiene: 86, bornAt: now, lastTick: now, line: null },
    now,
  );
  assert.equal(seed.bond, 18);
  assert.equal(seed.sick, false);
  assert.deepEqual(seed.mess, []);
  assert.deepEqual(seed.gifts, []);
  assert.equal(seed.shedAt, 0);
});

test("bond raised by care is still there after persist + hydrate", () => {
  const seed = C.seedCareFromRow(
    { hunger: 78, mood: 74, energy: 80, health: 92, hygiene: 86, bornAt: now, lastTick: now },
    now,
  );
  const fed = C.applySanctuaryCare("feed", "dog", seed, now).stats;
  const played = C.applySanctuaryCare("play", "dog", fed, now).stats;
  assert.ok(played.bond > seed.bond);
  const reloaded = C.seedCareFromRow(rowOf(played), now);
  assert.equal(reloaded.bond, played.bond);
  assert.equal(reloaded.hunger, played.hunger);
  assert.equal(reloaded.mood, played.mood);
});

test("mess, gifts, sick, and shedAt survive persist + hydrate", () => {
  const lived = guest({
    bond: 40,
    sick: true,
    mess: [{ id: 1, x: 22 }],
    gifts: [{ id: 2, x: 40, kind: "shed" }],
    shedAt: now - 1000,
  });
  const reloaded = C.seedCareFromRow(rowOf(lived), now);
  assert.equal(reloaded.sick, true);
  assert.equal(reloaded.bond, 40);
  assert.equal(reloaded.mess.length, 1);
  assert.equal(reloaded.gifts[0]?.kind, "shed");
  assert.equal(reloaded.shedAt, now - 1000);
});

test("a tick that adds mess or flips sick is not wiped on the next read", () => {
  const prior = guest({ health: 20, hygiene: 10, hunger: 8, mess: [], sick: false, lastTick: now });
  const later = now + 3 * 60 * 1000;
  const orig = Math.random;
  Math.random = () => 0;
  const tick = C.tickSanctuary("dog", prior, now, null, later);
  Math.random = orig;
  assert.equal(tick.stats.sick, true);
  assert.ok(tick.stats.mess.length >= 1);
  const again = C.seedCareFromRow(rowOf(tick.stats), later);
  assert.equal(again.sick, true);
  assert.equal(again.mess.length, tick.stats.mess.length);
  const reread = C.tickSanctuary("dog", again, later, tick.floorSince, later);
  assert.equal(reread.stats.sick, true);
  assert.equal(reread.stats.mess.length, tick.stats.mess.length);
});

test("a shed clock survives persist + hydrate so a snake can leave the hatch coat", () => {
  const snake = guest({ shedAt: 0 });
  const shed = C.applySanctuaryCare("shed", "ball_python", snake, now).stats;
  assert.equal(shed.shedAt, now);
  const reloaded = C.seedCareFromRow(rowOf(shed), now);
  assert.equal(reloaded.shedAt, now);
  const tooSoon = C.applySanctuaryCare("shed", "ball_python", reloaded, now + 60_000).stats;
  assert.equal(tooSoon.shedAt, now);
});

test("the sanctuary writes the line; kennel guest rooms seed it", () => {
  assert.match(lineMigration, /companion_pets add column if not exists line/);
  assert.match(actionsSrc, /seedCareFromRow/);
  assert.match(actionsSrc, /packLine/);
  assert.match(actionsSrc, /line = \$\{line\}/);
  assert.match(actionsSrc, /bond: stats\.bond/);
  assert.match(actionsSrc, /shedAt: stats\.shedAt/);
  assert.match(actionsSrc, /"shed"/);
  assert.match(petSrc, /seed=\{normalizeCare\(pet\)\}/);
  assert.match(petSrc, /return normalizeCare\(next\)/);
  assert.match(kennelSrc, /seed=\{walker \? normalizeCare\(walker\) : undefined\}/);
  assert.match(kennelSrc, /return normalizeCare\(next\)/);
  assert.match(roomSrc, /persistLocal \? mergePersist\(statsRef\.current, remote\) : normalizeCare\(remote\)/);
  assert.match(roomSrc, /onCare && !persistLocal/);
  assert.match(roomSrc, /persist\("shed"\)/);
  assert.doesNotMatch(actionsSrc, /bond: 18,/);
  assert.doesNotMatch(actionsSrc, /shedAt: 0,/);
});
