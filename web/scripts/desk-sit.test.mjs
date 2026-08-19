import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const D = await import(join(root, "src/lib/pets/desk.ts"));
const C = await import(join(root, "src/lib/pets/care.ts"));

const indexSrc = readFileSync(join(root, "src/routes/index.tsx"), "utf8");
const deskSrc = readFileSync(join(root, "src/components/desk/desk-stage.tsx"), "utf8");
const liveSrc = readFileSync(join(root, "src/components/desk/live-stage.tsx"), "utf8");
const livePageSrc = readFileSync(join(root, "src/routes/live.tsx"), "utf8");
const actionsSrc = readFileSync(join(root, "src/lib/pets/actions.ts"), "utf8");
const petSrc = readFileSync(join(root, "src/routes/pets.$key.tsx"), "utf8");
const kennelSrc = readFileSync(join(root, "src/routes/collection.tsx"), "utf8");
const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const demoSrc = readFileSync(join(root, "src/components/desk/demo-stage.tsx"), "utf8");
const hatchSrc = readFileSync(join(root, "src/routes/hatch.tsx"), "utf8");
const nestSrc = readFileSync(join(root, "src/routes/nest.tsx"), "utf8");
const catalogSrc = readFileSync(join(root, "src/routes/catalog.tsx"), "utf8");
const speciesSrc = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");
const talkSrc = readFileSync(join(root, "src/lib/pets/talk.ts"), "utf8");
const careSrc = readFileSync(join(root, "src/lib/pets/care.ts"), "utf8");
const clutchSrc = readFileSync(join(root, "src/lib/pets/clutch.ts"), "utf8");
const arriveSrc = readFileSync(join(root, "src/lib/pets/arrive.ts"), "utf8");
const playSrc = readFileSync(join(root, "src/lib/pets/play.ts"), "utf8");
const livingSrc = readFileSync(join(root, "src/components/desk/living-pet.tsx"), "utf8");

const now = 1_700_000_000_000;
const DAY = 86400000;

function guest(over = {}) {
  return {
    id: "guest",
    name: "Guest",
    species_key: "dog",
    is_active: false,
    departed: false,
    ...over,
  };
}

test("two dogs, older is_active: desk sits the older (name + petId)", () => {
  const newer = guest({ id: "pup", name: "Pip", is_active: false });
  const older = guest({ id: "kept", name: "Willow", is_active: true });
  const pets = [newer, older];
  const sit = D.sitDeskGuest(pets, "dog");
  assert.equal(sit?.name, "Willow");
  assert.equal(sit?.id, "kept");
  assert.notEqual(sit?.id, newer.id);
  assert.notEqual(sit?.name, newer.name);
});

test("newest-only find is gone; care writes the kept guest's id", () => {
  assert.match(indexSrc, /sitDeskGuest\(data\.pets, kind\.key\)/);
  assert.match(indexSrc, /setPetId\(mine\.id\)/);
  assert.match(indexSrc, /setName\(mine\.name\)/);
  assert.match(indexSrc, /petId, action/);
  assert.match(indexSrc, /careForPet/);
  assert.match(indexSrc, /onCare=/);
  assert.doesNotMatch(indexSrc, /data\.pets\.find\(\(p\) => p\.species_key === kind\.key\)/);
  assert.doesNotMatch(indexSrc, /species_key === kind\.key/);
});

test("no is_active of that kind still sits a living one", () => {
  const cat = guest({ id: "moth", name: "Moth", species_key: "cat", is_active: true });
  const dog = guest({ id: "rook", name: "Rook", species_key: "dog", is_active: false });
  const sit = D.sitDeskGuest([cat, dog], "dog");
  assert.equal(sit?.id, "rook");
  assert.equal(sit?.name, "Rook");
  assert.equal(sit?.species_key, "dog");
});

test("unsigned / no sanctuary still uses livingByKey", () => {
  assert.equal(D.sitDeskGuest([], "dog"), null);
  assert.equal(D.sitDeskGuest(null, "dog"), null);
  assert.equal(D.sitDeskGuest(undefined, "dog"), null);
  assert.match(indexSrc, /livingByKey\(key\)/);
  assert.match(indexSrc, /loadActiveKindKey/);
  assert.match(indexSrc, /saveActiveKindKey/);
  assert.match(indexSrc, /fromSearch/);
  assert.match(indexSrc, /<SignedOut>/);
  assert.match(indexSrc, /<DeskStage kind=\{desk\.kind\} onSelectKind=\{desk\.select\} \/>/);
  assert.match(indexSrc, /pet: z\.string\(\)\.optional\(\)/);
});

test("kennel setActivePet still marks one; live search-param stays a kind", () => {
  assert.match(actionsSrc, /export const setActivePet/);
  assert.match(actionsSrc, /set is_active = false where user_id/);
  assert.match(actionsSrc, /set is_active = true/);
  assert.match(petSrc, /setActivePet\(\{ data: \{ petId: pet\.id \} \}\)/);
  assert.match(kennelSrc, /pets\.find\(\(p\) => p\.is_active\)/);
  assert.match(livePageSrc, /pet: z\.string\(\)\.optional\(\)/);
  assert.match(livePageSrc, /livingBySlug\(pet\) \?\? livingByKey\(pet\)/);
  assert.doesNotMatch(livePageSrc, /sitDeskGuest/);
  assert.doesNotMatch(liveSrc, /sitDeskGuest/);
});

test("adult Luna still does not eat; sanctuary, talk keeper, clutch-once, walk-to-treat, play-one-hop, desk time, rooms stay", () => {
  const grownBorn = now - 2 * DAY;
  const adult = { ...C.blankCare(grownBorn), hunger: 40, bornAt: grownBorn, lastTick: now };
  assert.equal(C.adultLuna("luna", adult, now), true);
  assert.equal(C.applyFeedFor("luna", adult, now).hunger, 40);
  assert.equal([...speciesSrc.matchAll(/\{ key: "/g)].length, 80);
  assert.match(careSrc, /packLine/);
  assert.match(talkSrc, /bindTalkSpend/);
  assert.match(talkSrc, /optionalAuthMiddleware/);
  assert.match(clutchSrc, /claim\(/);
  assert.match(arriveSrc, /walkLand/);
  assert.match(livingSrc, /walkLand/);
  assert.match(playSrc, /playClaim/);
  assert.match(playSrc, /One hop/);
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
