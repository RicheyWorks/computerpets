import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const C = await import(join(root, "src/lib/pets/care.ts"));
const G = await import(join(root, "src/lib/pets/genetics.ts"));

const actionsSrc = readFileSync(join(root, "src/lib/pets/actions.ts"), "utf8");
const nestSrc = readFileSync(join(root, "src/routes/nest.tsx"), "utf8");
const kennelSrc = readFileSync(join(root, "src/routes/collection.tsx"), "utf8");
const petSrc = readFileSync(join(root, "src/routes/pets.$key.tsx"), "utf8");
const cardSrc = readFileSync(join(root, "src/components/pet-card.tsx"), "utf8");
const migration = readFileSync(join(root, "migrations/0004_quiet_end.sql"), "utf8");

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
