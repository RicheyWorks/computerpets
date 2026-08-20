import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const nestSrc = readFileSync(join(root, "src/routes/nest.tsx"), "utf8");
const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const shellSrc = readFileSync(join(root, "src/components/app-shell.tsx"), "utf8");
const loginSrc = readFileSync(join(root, "src/routes/login.tsx"), "utf8");
const hatchSrc = readFileSync(join(root, "src/routes/hatch.tsx"), "utf8");
const demoSrc = readFileSync(join(root, "src/components/desk/demo-stage.tsx"), "utf8");
const demoPageSrc = readFileSync(join(root, "src/routes/demo.$slug.tsx"), "utf8");
const meetSrc = readFileSync(join(root, "src/routes/meet.tsx"), "utf8");
const petSrc = readFileSync(join(root, "src/routes/pets.$key.tsx"), "utf8");
const kennelSrc = readFileSync(join(root, "src/routes/collection.tsx"), "utf8");
const catalogSrc = readFileSync(join(root, "src/routes/catalog.tsx"), "utf8");

test("nest page mounts the blotter room and does not persist a stray companion", () => {
  assert.match(nestSrc, /CompanionRoom/);
  assert.match(nestSrc, /persistLocal=\{false\}/);
  assert.match(nestSrc, /livingByKey/);
  assert.match(nestSrc, /RED_PANDA_KIND/);
  assert.match(nestSrc, /guestKey=\{walker \? `nest-\$\{walker\.id\}` : "nest"\}/);
  assert.match(roomSrc, /LivingPet/);
  assert.match(roomSrc, /BlotterMarks/);
  assert.doesNotMatch(nestSrc, /onCare/);
  assert.doesNotMatch(nestSrc, /careForPet/);
  assert.match(shellSrc, /pathname === "\/nest"/);
});

test("the square stays paper when a pair is seated", () => {
  assert.match(nestSrc, /function PunnettCard/);
  assert.match(nestSrc, /<table/);
  assert.match(nestSrc, /punnettMono/);
  assert.match(nestSrc, /punnettDihybridMark/);
  assert.match(nestSrc, /The square/);
  assert.match(nestSrc, /Recessives hide/);
  assert.doesNotMatch(nestSrc, /The genes will sort themselves/);
});

test("pairing still walks to the guest room or speaks a wait", () => {
  assert.match(nestSrc, /useNavigate/);
  assert.match(nestSrc, /result\.pets\[0\]/);
  assert.match(nestSrc, /to: "\/pets\/\$key"/);
  assert.match(nestSrc, /params: \{ key: first\.id \}/);
  assert.match(nestSrc, /duePhrase/);
  assert.match(nestSrc, /duePhrase\(c\.due_at\)/);
  assert.match(nestSrc, /A wait/);
  assert.doesNotMatch(nestSrc, /toLocaleString/);
  assert.match(nestSrc, /A hatchling cannot pair/);
  assert.match(nestSrc, /canPair/);
});

test("login is a door, not a shop", () => {
  assert.doesNotMatch(loginSrc, /Sign in to hatch/);
  assert.doesNotMatch(loginSrc, /ember/);
  assert.match(loginSrc, /Sit, hatch, nest/);
});

test("meet, demo, hatch, kennel, and kennel-guest rooms stay", () => {
  assert.match(meetSrc, /Watch Rui/);
  assert.match(meetSrc, /One hundred ninety guests walk the blotter/);
  assert.match(demoPageSrc, /DemoStage/);
  assert.match(demoSrc, /CompanionRoom/);
  assert.match(demoSrc, /persistLocal=\{false\}/);
  assert.match(hatchSrc, /CompanionRoom/);
  assert.match(hatchSrc, /persistLocal=\{false\}/);
  assert.match(kennelSrc, /CompanionRoom/);
  assert.match(kennelSrc, /persistLocal=\{false\}/);
  assert.match(catalogSrc, /CompanionRoom/);
  assert.match(catalogSrc, /persistLocal=\{false\}/);
  assert.match(petSrc, /CompanionRoom/);
  assert.match(petSrc, /onCare=\{persistCare\}/);
});
