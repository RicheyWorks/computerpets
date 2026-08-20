import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const C = await import(join(root, "src/lib/pets/clutch.ts"));
const Care = await import(join(root, "src/lib/pets/care.ts"));
const G = await import(join(root, "src/lib/pets/genetics.ts"));

const clutchSrc = readFileSync(join(root, "src/lib/pets/clutch.ts"), "utf8");
const actionsSrc = readFileSync(join(root, "src/lib/pets/actions.ts"), "utf8");
const nestSrc = readFileSync(join(root, "src/routes/nest.tsx"), "utf8");
const hatchSrc = readFileSync(join(root, "src/routes/hatch.tsx"), "utf8");
const kennelSrc = readFileSync(join(root, "src/routes/collection.tsx"), "utf8");
const catalogPageSrc = readFileSync(join(root, "src/routes/catalog.tsx"), "utf8");
const petSrc = readFileSync(join(root, "src/routes/pets.$key.tsx"), "utf8");
const demoSrc = readFileSync(join(root, "src/components/desk/demo-stage.tsx"), "utf8");
const deskSrc = readFileSync(join(root, "src/components/desk/desk-stage.tsx"), "utf8");
const liveSrc = readFileSync(join(root, "src/components/desk/live-stage.tsx"), "utf8");
const talkSrc = readFileSync(join(root, "src/lib/pets/talk.ts"), "utf8");
const speciesSrc = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");
const careSrc = readFileSync(join(root, "src/lib/pets/care.ts"), "utf8");

const now = Date.parse("2026-08-19T12:00:00Z");
const genes = G.emptyGenotype("dog");
const brood = JSON.stringify([{ name: "Rook kit", genotype: genes }]);

function clutch(over = {}) {
  return {
    id: "clutch-1",
    user_id: "keeper",
    species_key: "dog",
    parent_a: "parent-a",
    parent_b: "parent-b",
    due_at: new Date(now - 1000).toISOString(),
    brood,
    resolved_at: null,
    ...over,
  };
}

function memoryDesk(rows) {
  const pets = [];
  return {
    pets,
    rows,
    async listOpen(userId) {
      return rows.filter((c) => c.user_id === userId && !c.resolved_at).map((c) => ({ ...c }));
    },
    async claim(id, userId) {
      const row = rows.find((c) => c.id === id && c.user_id === userId && !c.resolved_at);
      if (!row) return null;
      row.resolved_at = new Date(now).toISOString();
      return { ...row };
    },
    async livingInHouse(userId) {
      return pets.some((p) => p.userId === userId);
    },
    async mintNestChild(opts) {
      const guest = { id: `nest-${pets.length + 1}`, origin: "nest", ...opts };
      pets.push(guest);
      return guest;
    },
  };
}

test("claiming the same due clutch twice mints the brood only once", async () => {
  const row = clutch();
  const desk = memoryDesk([row]);
  const first = await C.hatchDueClutches("keeper", desk, now);
  const second = await C.hatchDueClutches("keeper", desk, now);
  assert.equal(first.length, 1);
  assert.equal(second.length, 0);
  assert.equal(desk.pets.length, 1);
  assert.equal(desk.pets[0].name, "Rook kit");
  assert.equal(desk.pets[0].origin, "nest");
  assert.equal(desk.pets[0].speciesKey, "dog");
  assert.deepEqual(desk.pets[0].genotype, genes);
  assert.equal(desk.pets[0].parentA, "parent-a");
  assert.equal(desk.pets[0].parentB, "parent-b");
  assert.ok(row.resolved_at);
});

test("two sits at the same moment produce one nest, not two copies", async () => {
  const row = clutch();
  const desk = memoryDesk([row]);
  const [a, b] = await Promise.all([
    C.hatchDueClutches("keeper", desk, now),
    C.hatchDueClutches("keeper", desk, now),
  ]);
  assert.equal(a.length + b.length, 1);
  assert.equal(desk.pets.length, 1);
  assert.equal(desk.pets[0].name, "Rook kit");
  assert.ok(row.resolved_at);
});

test("a clutch that is not due stays unresolved", async () => {
  const row = clutch({ due_at: new Date(now + 60 * 60 * 1000).toISOString() });
  const desk = memoryDesk([row]);
  const minted = await C.hatchDueClutches("keeper", desk, now);
  assert.equal(minted.length, 0);
  assert.equal(row.resolved_at, null);
  assert.equal(desk.pets.length, 0);
  assert.equal(C.isClutchDue(row.due_at, now), false);
});

test("empty brood does not mint guests and does not stay an open hatch", async () => {
  const row = clutch({ brood: "[]" });
  const desk = memoryDesk([row]);
  const minted = await C.hatchDueClutches("keeper", desk, now);
  assert.equal(minted.length, 0);
  assert.equal(desk.pets.length, 0);
  assert.ok(row.resolved_at);
});

test("unparseable brood does not mint guests and does not stay an open hatch", async () => {
  const row = clutch({ brood: "not a brood" });
  const desk = memoryDesk([row]);
  const minted = await C.hatchDueClutches("keeper", desk, now);
  assert.equal(minted.length, 0);
  assert.equal(desk.pets.length, 0);
  assert.ok(row.resolved_at);
  assert.deepEqual(C.parseBrood("{"), []);
  assert.deepEqual(C.parseBrood('"hello"'), []);
  assert.deepEqual(C.parseBrood([{ name: "Ghost" }]), []);
});

test("a NaN / unreadable due_at does not hatch as if it were due now", async () => {
  const row = clutch({ due_at: "not-a-date" });
  const desk = memoryDesk([row]);
  const minted = await C.hatchDueClutches("keeper", desk, now);
  assert.equal(minted.length, 0);
  assert.equal(row.resolved_at, null);
  assert.equal(C.isClutchDue("not-a-date", now), false);
  assert.equal(C.isClutchDue(Number.NaN, now), false);
  assert.equal(C.isClutchDue(new Date(Number.NaN), now), false);
  assert.equal(Number.isNaN(Date.parse("not-a-date")), true);
  assert.equal(Number.isNaN(Date.parse("not-a-date")) && !(Date.parse("not-a-date") > now), true);
});

test("an already-resolved clutch stays resolved and does not mint again", async () => {
  const row = clutch({ resolved_at: "2026-08-01T00:00:00.000Z" });
  const desk = memoryDesk([row]);
  const minted = await C.hatchDueClutches("keeper", desk, now);
  assert.equal(minted.length, 0);
  assert.equal(row.resolved_at, "2026-08-01T00:00:00.000Z");
  assert.equal(desk.pets.length, 0);
});

test("the house claims the clutch before the children land", () => {
  assert.match(clutchSrc, /Claim each due clutch, then mint/);
  assert.match(actionsSrc, /hatchDueClutches/);
  assert.match(actionsSrc, /resolveDueClutches/);
  assert.match(actionsSrc, /getSanctuary/);
  assert.match(actionsSrc, /await resolveDueClutches\(context\.userId\)/);
  assert.match(actionsSrc, /returning \*/);
  assert.match(actionsSrc, /resolved_at is null/);
  assert.match(actionsSrc, /origin: "nest"/);
  assert.match(actionsSrc, /isClutchDue/);
  assert.doesNotMatch(clutchSrc, /shop/);
  assert.doesNotMatch(clutchSrc, /SKU/);
  assert.doesNotMatch(actionsSrc, /0x[a-fA-F0-9]{40}/);
});

test("the nest room still waits; sanctuary, talk keeper, desk time, and rooms stay", () => {
  assert.match(nestSrc, /duePhrase\(c\.due_at\)/);
  assert.match(nestSrc, /A wait/);
  assert.match(nestSrc, /persistLocal=\{false\}/);
  assert.match(hatchSrc, /persistLocal=\{false\}/);
  assert.match(kennelSrc, /persistLocal=\{false\}/);
  assert.match(catalogPageSrc, /persistLocal=\{false\}/);
  assert.match(petSrc, /persistLocal=\{false\}/);
  assert.match(demoSrc, /persistLocal=\{false\}/);
  assert.doesNotMatch(deskSrc, /persistLocal=\{false\}/);
  assert.doesNotMatch(liveSrc, /persistLocal=\{false\}/);
  assert.match(talkSrc, /bindTalkSpend/);
  assert.match(talkSrc, /optionalAuthMiddleware/);
  assert.match(careSrc, /packLine/);
  assert.match(actionsSrc, /seedCareFromRow/);
  assert.match(actionsSrc, /packLine/);
  assert.equal([...speciesSrc.matchAll(/\{ key: "/g)].length, 190);
  const grownBorn = now - 2 * 86400000;
  const adult = { ...Care.blankCare(grownBorn), hunger: 40, bornAt: grownBorn, lastTick: now };
  assert.equal(Care.adultLuna("luna", adult, now), true);
  assert.equal(Care.applyFeedFor("luna", adult, now).hunger, 40);
});
