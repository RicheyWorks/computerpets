import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const G = await import(join(root, "src/lib/pets/genetics.ts"));
const nestLib = await import(join(root, "src/lib/pets/pedigree.ts"));
const nestPage = readFileSync(join(root, "src/routes/nest.tsx"), "utf8");
const hatchPage = readFileSync(join(root, "src/routes/hatch.tsx"), "utf8");
const shell = readFileSync(join(root, "src/components/app-shell.tsx"), "utf8");
const migration = readFileSync(join(root, "migrations/0003_nest.sql"), "utf8");
const quiet = readFileSync(join(root, "migrations/0004_quiet_end.sql"), "utf8");

test("nest cost is honest and smaller than a legendary draw", () => {
  assert.equal(G.NEST_COST_SINGLE, 3);
  assert.equal(G.NEST_COST_CLUTCH, 5);
  assert.ok(G.NEST_COST_CLUTCH < 32);
  assert.ok(G.nestPath("dog", 2).cost < 32);
  assert.ok(G.nestPath("ball_python", 2).cost < 32);
});

test("species-true verbs: seed, spore, clutch, brood, egg, wait", () => {
  assert.equal(G.nestPath("oak", 2).verb, "seed");
  assert.equal(G.nestPath("oyster", 2).verb, "spore");
  assert.equal(G.nestPath("ball_python", 2).verb, "clutch");
  assert.equal(G.nestPath("ball_python", 2).count, 3);
  assert.equal(G.nestPath("seahorse", 2).verb, "brood");
  assert.ok(G.nestPath("seahorse", 2).waitMs > 0);
  assert.equal(G.nestPath("luna", 2).verb, "egg");
  assert.equal(G.nestPath("cyst", 2).verb, "wait");
  assert.ok(G.nestPath("cyst", 2).waitMs >= 24 * 60 * 60 * 1000);
});

test("the nest page is a blotter card, not a sim dump", () => {
  assert.match(nestPage, /Two of a kind/);
  assert.match(nestPage, /The square/);
  assert.doesNotMatch(nestPage, /\+50 XP/);
  assert.doesNotMatch(nestPage, /mega-evolution/i);
  assert.match(hatchPage, /Or pair two you already keep/);
  assert.match(shell, /to: "\/nest"/);
  assert.match(migration, /companion_clutches/);
  assert.match(migration, /genotype/);
  assert.match(quiet, /floor_since/);
  assert.match(nestPage, /Grown and elder may sit/);
  assert.match(nestPage, /Neglect can close a line/);
});

test("an immediate nest child takes the keeper to the guest room", () => {
  assert.match(nestPage, /useNavigate/);
  assert.match(nestPage, /result\.pets\[0\]/);
  assert.match(nestPage, /to: "\/pets\/\$key"/);
  assert.match(nestPage, /params: \{ key: first\.id \}/);
});

test("a waiting clutch speaks a wait, a verb, and a due that is not ISO", () => {
  const now = Date.parse("2026-08-18T12:00:00Z");
  assert.equal(nestLib.duePhrase(now - 1000, now), "due now");
  assert.equal(nestLib.duePhrase(now + 20 * 60 * 1000, now), "due this hour");
  assert.equal(nestLib.duePhrase(now + 30 * 60 * 1000, now), "due this hour");
  assert.equal(nestLib.duePhrase(now + 8 * 60 * 60 * 1000, now), "due today");
  assert.equal(nestLib.duePhrase(now + 24 * 60 * 60 * 1000, now), "due tomorrow");
  assert.equal(nestLib.duePhrase(now + 4 * 24 * 60 * 60 * 1000, now), "due in a few days");
  assert.match(nestPage, /A wait/);
  assert.match(nestPage, /duePhrase\(c\.due_at\)/);
  assert.doesNotMatch(nestPage, /toLocaleString/);
  assert.doesNotMatch(nestPage, /due_at\)\.toISOString/);
});
