import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const deskSrc = readFileSync(join(root, "src/components/desk/desk-stage.tsx"), "utf8");
const liveSrc = readFileSync(join(root, "src/components/desk/live-stage.tsx"), "utf8");
const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const indexSrc = readFileSync(join(root, "src/routes/index.tsx"), "utf8");
const hatchSrc = readFileSync(join(root, "src/routes/hatch.tsx"), "utf8");
const nestSrc = readFileSync(join(root, "src/routes/nest.tsx"), "utf8");
const petSrc = readFileSync(join(root, "src/routes/pets.$key.tsx"), "utf8");
const kennelSrc = readFileSync(join(root, "src/routes/collection.tsx"), "utf8");
const catalogSrc = readFileSync(join(root, "src/routes/catalog.tsx"), "utf8");
const meetSrc = readFileSync(join(root, "src/routes/meet.tsx"), "utf8");
const demoSrc = readFileSync(join(root, "src/components/desk/demo-stage.tsx"), "utf8");
const demoPageSrc = readFileSync(join(root, "src/routes/demo.$slug.tsx"), "utf8");

test("the desk mounts the same blotter room", () => {
  assert.match(deskSrc, /CompanionRoom/);
  assert.match(deskSrc, /typedTalk/);
  assert.match(deskSrc, /journal/);
  assert.match(roomSrc, /LivingPet/);
  assert.match(roomSrc, /BlotterMarks/);
  assert.match(roomSrc, /RoomWash/);
  assert.match(roomSrc, /DenCabinet/);
  assert.doesNotMatch(deskSrc, /LIVING_KINDS\.map/);
  assert.doesNotMatch(deskSrc, /<option/);
  assert.doesNotMatch(deskSrc, /<select/);
});

test("live is the phone of the same house", () => {
  assert.match(liveSrc, /CompanionRoom/);
  assert.match(liveSrc, /phone/);
  assert.match(liveSrc, /Add to Home Screen/);
  assert.match(liveSrc, /isStandalone/);
  assert.match(liveSrc, /onSelectKind/);
  assert.doesNotMatch(liveSrc, /LIVING_KINDS\.map/);
  assert.doesNotMatch(liveSrc, /<option/);
  assert.doesNotMatch(liveSrc, /<select/);
});

test("keeper persist and typed talk stay on the desk", () => {
  assert.match(indexSrc, /sitDeskGuest/);
  assert.match(indexSrc, /careForPet/);
  assert.match(indexSrc, /onCare=/);
  assert.match(deskSrc, /onCare=\{onCare\}/);
  assert.match(deskSrc, /typedTalk/);
  assert.match(roomSrc, /Say something to/);
  assert.match(roomSrc, /applyBath/);
  assert.match(roomSrc, /applyPraise/);
  assert.match(roomSrc, /pickMess/);
  assert.match(deskSrc, /label: "Bath"/);
  assert.match(deskSrc, /label: "Praise"/);
});

test("the desk keeps time; a demo does not write the desk key", () => {
  assert.match(roomSrc, /tickCare/);
  assert.match(roomSrc, /loadCare\(kind\.localKey, seed \?\? \{ hunger: 78, mood: 80, energy: 82 \}, kind\.key\)/);
  assert.match(roomSrc, /if \(!persistLocal\) return;/);
  assert.match(roomSrc, /applyFeedFor/);
  assert.match(roomSrc, /setInterval/);
  assert.match(deskSrc, /CompanionRoom/);
  assert.match(liveSrc, /CompanionRoom/);
  assert.doesNotMatch(deskSrc, /persistLocal=\{false\}/);
  assert.doesNotMatch(liveSrc, /persistLocal=\{false\}/);
  assert.match(demoSrc, /persistLocal=\{false\}/);
  assert.doesNotMatch(demoSrc, /persistLocal=\{true\}/);
});

test("hatch, nest, kennel, and kennel-guest rooms stay", () => {
  assert.match(hatchSrc, /persistLocal=\{false\}/);
  assert.match(nestSrc, /persistLocal=\{false\}/);
  assert.match(kennelSrc, /CompanionRoom/);
  assert.match(kennelSrc, /persistLocal=\{false\}/);
  assert.match(catalogSrc, /CompanionRoom/);
  assert.match(catalogSrc, /persistLocal=\{false\}/);
  assert.match(petSrc, /onCare=\{persistCare\}/);
  assert.match(demoPageSrc, /DemoStage/);
  assert.match(demoSrc, /CompanionRoom/);
  assert.match(demoSrc, /persistLocal=\{false\}/);
});

test("meet still says Watch Rui and one hundred", () => {
  assert.match(meetSrc, /Watch Rui/);
  assert.match(meetSrc, /One hundred/);
});
