import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const L = await import(join(root, "src/lib/pets/live.ts"));
const living = await import(join(root, "src/lib/pets/living.ts"));

const livePageSrc = readFileSync(join(root, "src/routes/live.tsx"), "utf8");
const liveSrc = readFileSync(join(root, "src/components/desk/live-stage.tsx"), "utf8");
const deskSrc = readFileSync(join(root, "src/components/desk/desk-stage.tsx"), "utf8");
const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const demoSrc = readFileSync(join(root, "src/components/desk/demo-stage.tsx"), "utf8");
const hatchSrc = readFileSync(join(root, "src/routes/hatch.tsx"), "utf8");
const nestSrc = readFileSync(join(root, "src/routes/nest.tsx"), "utf8");
const kennelSrc = readFileSync(join(root, "src/routes/collection.tsx"), "utf8");
const catalogSrc = readFileSync(join(root, "src/routes/catalog.tsx"), "utf8");
const petSrc = readFileSync(join(root, "src/routes/pets.$key.tsx"), "utf8");
const speciesSrc = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");
const careSrc = readFileSync(join(root, "src/lib/pets/care.ts"), "utf8");
const C = await import(join(root, "src/lib/pets/care.ts"));

test("?pet=cup sits Cup; a key and a slug sit that kind", () => {
  assert.equal(L.sitLiveKind("cup")?.key, "octopus");
  assert.equal(L.sitLiveKind("cup")?.slug, "cup");
  assert.equal(L.sitLiveKind("octopus")?.key, "octopus");
  assert.equal(L.sitLiveKind("rui")?.key, "red_panda");
  assert.equal(L.sitLiveKind("red_panda")?.key, "red_panda");
  assert.equal(L.sitLiveKind("dog")?.key, "dog");
  assert.equal(L.sitLiveKind("pip")?.key, "dog");
  assert.match(livePageSrc, /sitLiveKind\(pet\)/);
  assert.match(livePageSrc, /z\.union\(\[z\.string\(\), z\.array\(z\.string\(\)\)\]\)/);
});

test("an array-shaped pet sits the first real kind, not silent Rui", () => {
  assert.equal(L.sitLiveKind(["cup", "dog"])?.key, "octopus");
  assert.equal(L.sitLiveKind(["ghost", "cup"])?.key, "octopus");
  assert.equal(L.sitLiveKind(["", "dog"])?.key, "dog");
  assert.equal(L.sitLiveKind(["nope", "also-nope"]), undefined);
  assert.notEqual(L.sitLiveKind(["ghost", "cup"])?.key, living.RED_PANDA_KIND.key);
});

test("an unknown name is not a Rui ask; no one asked stays unset", () => {
  assert.equal(L.sitLiveKind("ghost"), undefined);
  assert.equal(L.sitLiveKind("not-a-guest"), undefined);
  assert.equal(L.sitLiveKind(""), undefined);
  assert.equal(L.sitLiveKind("   "), undefined);
  assert.equal(L.sitLiveKind(undefined), undefined);
  assert.equal(L.sitLiveKind(null), undefined);
  assert.equal(L.sitLiveKind([]), undefined);
  assert.notEqual(L.sitLiveKind("ghost"), living.RED_PANDA_KIND);
  assert.equal(L.sitLiveKind("rui")?.key, "red_panda");
  assert.match(liveSrc, /if \(initial\) \{\s*setKind\(initial\)/s);
  assert.match(liveSrc, /livingByKey\(loadActiveKindKey\(\)\)/);
});

test("live is still one walker; persistLocal stays the desk default", () => {
  assert.match(liveSrc, /<CompanionRoom/);
  assert.equal(liveSrc.match(/<CompanionRoom/g)?.length, 1);
  assert.doesNotMatch(liveSrc, /LIVING_KINDS\.map/);
  assert.doesNotMatch(liveSrc, /<option/);
  assert.doesNotMatch(liveSrc, /<select/);
  assert.doesNotMatch(liveSrc, /persistLocal=\{false\}/);
  assert.doesNotMatch(livePageSrc, /sitDeskGuest/);
  assert.doesNotMatch(liveSrc, /sitDeskGuest/);
  assert.doesNotMatch(livePageSrc, /getSanctuary/);
  assert.doesNotMatch(liveSrc, /getSanctuary/);
  assert.doesNotMatch(livePageSrc, /livingBySlug\(pet\) \?\? livingByKey\(pet\)/);
});

test("adult Luna still does not eat; prior leftovers stay", () => {
  const now = 1_700_000_000_000;
  const DAY = 86400000;
  const grownBorn = now - 2 * DAY;
  const adult = { ...C.blankCare(grownBorn), hunger: 40, bornAt: grownBorn, lastTick: now };
  assert.equal(C.adultLuna("luna", adult, now), true);
  assert.equal(C.applyFeedFor("luna", adult, now).hunger, 40);
  assert.equal([...speciesSrc.matchAll(/\{ key: "/g)].length, 80);
  assert.match(careSrc, /packLine/);
  assert.match(roomSrc, /tickCare/);
  assert.match(demoSrc, /persistLocal=\{false\}/);
  assert.match(hatchSrc, /persistLocal=\{false\}/);
  assert.match(nestSrc, /persistLocal=\{false\}/);
  assert.match(kennelSrc, /persistLocal=\{false\}/);
  assert.match(catalogSrc, /persistLocal=\{false\}/);
  assert.match(petSrc, /persistLocal=\{false\}/);
  assert.doesNotMatch(deskSrc, /persistLocal=\{false\}/);
  assert.doesNotMatch(liveSrc, /persistLocal=\{false\}/);
});
