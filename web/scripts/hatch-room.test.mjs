import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const hatchSrc = readFileSync(join(root, "src/routes/hatch.tsx"), "utf8");
const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const shellSrc = readFileSync(join(root, "src/components/app-shell.tsx"), "utf8");
const kennelSrc = readFileSync(join(root, "src/routes/collection.tsx"), "utf8");
const cardSrc = readFileSync(join(root, "src/components/pet-card.tsx"), "utf8");
const nestSrc = readFileSync(join(root, "src/routes/nest.tsx"), "utf8");
const catalogSrc = readFileSync(join(root, "src/routes/catalog.tsx"), "utf8");
const demoSrc = readFileSync(join(root, "src/components/desk/demo-stage.tsx"), "utf8");
const demoPageSrc = readFileSync(join(root, "src/routes/demo.$slug.tsx"), "utf8");
const meetSrc = readFileSync(join(root, "src/routes/meet.tsx"), "utf8");
const petSrc = readFileSync(join(root, "src/routes/pets.$key.tsx"), "utf8");

test("hatch page mounts the blotter room with a house walker", () => {
  assert.match(hatchSrc, /CompanionRoom/);
  assert.match(hatchSrc, /RED_PANDA_KIND/);
  assert.match(hatchSrc, /persistLocal=\{false\}/);
  assert.match(hatchSrc, /guestKey="hatchery"/);
  assert.match(hatchSrc, /label: busy \? "Drawing…" : "Draw"/);
  assert.match(hatchSrc, /paper-card/);
  assert.match(roomSrc, /LivingPet/);
  assert.match(roomSrc, /BlotterMarks/);
  assert.doesNotMatch(hatchSrc, /onCare/);
  assert.doesNotMatch(hatchSrc, /careForPet/);
  assert.doesNotMatch(hatchSrc, /RARITY_WEIGHT/);
  assert.match(shellSrc, /pathname === "\/hatch"/);
  assert.match(shellSrc, /pathname === "\/collection"/);
});

test("hatch toast and copy do not print token_id", () => {
  assert.doesNotMatch(hatchSrc, /token_id/);
  assert.match(hatchSrc, /The draw landed/);
  assert.match(hatchSrc, /to: "\/pets\/\$key"/);
  assert.match(hatchSrc, /Or pair two you already keep/);
});

test("kennel is a kennel, not held tokens", () => {
  assert.doesNotMatch(kennelSrc, /Held tokens/);
  assert.match(kennelSrc, /The guests you keep/);
  assert.match(kennelSrc, /The kennel is a room/);
  assert.match(kennelSrc, /CompanionRoom/);
  assert.match(kennelSrc, /persistLocal=\{false\}/);
  assert.doesNotMatch(cardSrc, /pet\.token_id/);
  assert.match(cardSrc, /lookHint/);
  assert.match(cardSrc, /from the nest/);
  assert.match(cardSrc, /pet\.stage/);
  assert.doesNotMatch(cardSrc, /LivingPet/);
});

test("nest pair with an immediate child navigates to the guest room", () => {
  assert.match(nestSrc, /useNavigate/);
  assert.match(nestSrc, /result\.pets\[0\]/);
  assert.match(nestSrc, /to: "\/pets\/\$key"/);
  assert.match(nestSrc, /duePhrase/);
  assert.doesNotMatch(nestSrc, /toLocaleString/);
});

test("catalog is a shelf, not a prospectus", () => {
  assert.match(catalogSrc, /CompanionRoom/);
  assert.match(catalogSrc, /persistLocal=\{false\}/);
  assert.match(catalogSrc, /The hundred/);
  assert.match(catalogSrc, /on their shelves/);
  assert.match(catalogSrc, /The shelf is a room/);
  assert.doesNotMatch(catalogSrc, /license service/);
  assert.doesNotMatch(catalogSrc, /Wire keys/);
  assert.doesNotMatch(catalogSrc, /wire keys/);
  assert.doesNotMatch(catalogSrc, /ORDER/);
  assert.doesNotMatch(catalogSrc, /LEGENDARY/);
  assert.match(catalogSrc, /to="\/study"/);
  assert.match(catalogSrc, /to="\/snakes"/);
  assert.match(catalogSrc, /to="\/far"/);
  assert.match(catalogSrc, /to="\/pond"/);
  assert.match(catalogSrc, /to="\/well"/);
  assert.match(catalogSrc, /to="\/roost"/);
  assert.match(catalogSrc, /to="\/corner"/);
  assert.match(catalogSrc, /to="\/wood"/);
  assert.match(catalogSrc, /to="\/stone"/);
  assert.match(catalogSrc, /to="\/creek"/);
});

test("meet, demo, and kennel-guest rooms stay", () => {
  assert.match(meetSrc, /Watch Rui/);
  assert.match(meetSrc, /One hundred sixty guests walk the blotter/);
  assert.match(demoPageSrc, /DemoStage/);
  assert.match(demoSrc, /CompanionRoom/);
  assert.match(demoSrc, /persistLocal=\{false\}/);
  assert.match(petSrc, /CompanionRoom/);
  assert.match(petSrc, /onCare=\{persistCare\}/);
});
