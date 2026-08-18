import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const G = await import(join(root, "src/lib/pets/genetics.ts"));
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
