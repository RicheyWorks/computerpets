import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const meetSrc = readFileSync(join(root, "src/routes/meet.tsx"), "utf8");
const demoPageSrc = readFileSync(join(root, "src/routes/demo.$slug.tsx"), "utf8");
const demoSrc = readFileSync(join(root, "src/components/desk/demo-stage.tsx"), "utf8");
const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const rosterSrc = readFileSync(join(root, "src/lib/pets/roster.ts"), "utf8");
const seaSrc = readFileSync(join(root, "src/lib/pets/sea.ts"), "utf8");

test("meet says one hundred sixty, not Fifty", () => {
  assert.doesNotMatch(meetSrc, /\bFifty\b/);
  assert.match(meetSrc, /One hundred sixty guests walk the blotter/);
  assert.match(meetSrc, /Watch Rui/);
  assert.match(meetSrc, /HouseFloor/);
  assert.match(meetSrc, /DenCabinet/);
});

test("demo still mounts a known slug — rui and cup", () => {
  assert.match(rosterSrc, /slug:\s*"rui"/);
  assert.match(seaSrc, /slug:\s*"cup"/);
  assert.match(demoPageSrc, /livingBySlug/);
  assert.match(demoPageSrc, /DemoStage/);
  assert.match(demoPageSrc, /createFileRoute\("\/demo\/\$slug"\)/);
  assert.match(demoSrc, /CompanionRoom/);
  assert.match(demoSrc, /persistLocal=\{false\}/);
  assert.match(roomSrc, /LivingPet/);
  assert.match(roomSrc, /SpeciesPlaque/);
  assert.match(roomSrc, /kind=\{kind\.key\}/);
  assert.doesNotMatch(demoSrc, /LIVING_KINDS\.map/);
  assert.doesNotMatch(roomSrc, /LIVING_KINDS\.map/);
});
