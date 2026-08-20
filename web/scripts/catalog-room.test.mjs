import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalogSrc = readFileSync(join(root, "src/routes/catalog.tsx"), "utf8");
const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const shellSrc = readFileSync(join(root, "src/components/app-shell.tsx"), "utf8");
const cardSrc = readFileSync(join(root, "src/components/pet-card.tsx"), "utf8");
const hatchSrc = readFileSync(join(root, "src/routes/hatch.tsx"), "utf8");
const nestSrc = readFileSync(join(root, "src/routes/nest.tsx"), "utf8");
const kennelSrc = readFileSync(join(root, "src/routes/collection.tsx"), "utf8");
const deskSrc = readFileSync(join(root, "src/components/desk/desk-stage.tsx"), "utf8");
const liveSrc = readFileSync(join(root, "src/components/desk/live-stage.tsx"), "utf8");
const demoSrc = readFileSync(join(root, "src/components/desk/demo-stage.tsx"), "utf8");
const demoPageSrc = readFileSync(join(root, "src/routes/demo.$slug.tsx"), "utf8");
const meetSrc = readFileSync(join(root, "src/routes/meet.tsx"), "utf8");

test("the shelf is a room with one house walker", () => {
  assert.match(catalogSrc, /CompanionRoom/);
  assert.match(catalogSrc, /RED_PANDA_KIND/);
  assert.match(catalogSrc, /persistLocal=\{false\}/);
  assert.match(catalogSrc, /guestKey="shelf"/);
  assert.match(catalogSrc, /The shelf is a room/);
  assert.match(catalogSrc, /The hundred and fifty sit by den, not by rarity/);
  assert.match(catalogSrc, /The hundred/);
  assert.match(catalogSrc, /on their shelves/i);
  assert.doesNotMatch(catalogSrc, /onCare/);
  assert.doesNotMatch(catalogSrc, /careForPet/);
  assert.doesNotMatch(catalogSrc, /LivingPet/);
  assert.doesNotMatch(catalogSrc, /LIVING_KINDS\.map/);
  assert.match(roomSrc, /LivingPet/);
  assert.match(roomSrc, /BlotterMarks/);
  assert.match(shellSrc, /pathname === "\/catalog"/);
});

test("shelves are rooms, not rarity tiers", () => {
  assert.match(catalogSrc, /ROOMS/);
  assert.match(catalogSrc, /guestsIn/);
  assert.doesNotMatch(catalogSrc, /ORDER/);
  assert.doesNotMatch(catalogSrc, /LEGENDARY/);
  assert.doesNotMatch(catalogSrc, /UNCOMMON/);
  assert.doesNotMatch(catalogSrc, /s\.rarity === rarity/);
  assert.doesNotMatch(catalogSrc, /type Rarity/);
  assert.match(cardSrc, /RarityBadge/);
});

test("catalog still links living kinds to the demo room", () => {
  assert.match(catalogSrc, /<SpeciesCard/);
  assert.match(catalogSrc, /to=\{`\/demo\/\$\{kind\.slug\}`\}/);
  assert.match(cardSrc, /to=\{demoSlug \? "\/demo\/\$slug"/);
  assert.doesNotMatch(catalogSrc, /<LivingPet/);
  assert.doesNotMatch(catalogSrc, /LivingPet/);
});

test("hatch, nest, kennel, desk, live, meet, and demo stay", () => {
  assert.match(hatchSrc, /persistLocal=\{false\}/);
  assert.match(nestSrc, /persistLocal=\{false\}/);
  assert.match(kennelSrc, /CompanionRoom/);
  assert.match(kennelSrc, /persistLocal=\{false\}/);
  assert.match(deskSrc, /CompanionRoom/);
  assert.match(liveSrc, /CompanionRoom/);
  assert.match(meetSrc, /Watch Rui/);
  assert.match(meetSrc, /One hundred fifty guests walk the blotter/);
  assert.match(demoPageSrc, /DemoStage/);
  assert.match(demoSrc, /CompanionRoom/);
  assert.match(demoSrc, /persistLocal=\{false\}/);
});
