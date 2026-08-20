import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const nest = await import(join(root, "src/lib/pets/pedigree.ts"));
const petSrc = readFileSync(join(root, "src/routes/pets.$key.tsx"), "utf8");
const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const demoSrc = readFileSync(join(root, "src/components/desk/demo-stage.tsx"), "utf8");
const demoPageSrc = readFileSync(join(root, "src/routes/demo.$slug.tsx"), "utf8");
const meetSrc = readFileSync(join(root, "src/routes/meet.tsx"), "utf8");
const cardSrc = readFileSync(join(root, "src/components/pet-card.tsx"), "utf8");
const kennelSrc = readFileSync(join(root, "src/routes/collection.tsx"), "utf8");
const hatchSrc = readFileSync(join(root, "src/routes/hatch.tsx"), "utf8");
const nestSrc = readFileSync(join(root, "src/routes/nest.tsx"), "utf8");
const deskSrc = readFileSync(join(root, "src/components/desk/desk-stage.tsx"), "utf8");
const shellSrc = readFileSync(join(root, "src/components/app-shell.tsx"), "utf8");

const genes = {
  eyes: ["A", "a"],
  band: ["B", "B"],
  mask: ["m", "m"],
  aura: ["L", "s"],
};

const looks = { eyes: "frost", mark: "banded", aura: "dustlit", genes };

test("living pet page mounts the blotter room", () => {
  assert.match(petSrc, /CompanionRoom/);
  assert.match(petSrc, /persistLocal=\{false\}/);
  assert.match(petSrc, /onCare=\{persistCare\}/);
  assert.match(petSrc, /careForPet/);
  assert.match(petSrc, /stage=\{pet\.stage\}/);
  assert.match(roomSrc, /LivingPet/);
  assert.match(roomSrc, /BlotterMarks/);
  assert.match(roomSrc, /stage=\{age\}/);
  assert.match(roomSrc, /kind=\{kind\.key\}/);
});

test("signed-out guest is a door, not a stuck pulse", () => {
  const pendingAt = petSrc.search(/if \(isPending\)/);
  const doorAt = petSrc.indexOf("if (!user) return <RedirectToSignIn");
  const loadPulseAt = petSrc.search(/if \(pet === undefined\)/);
  assert.doesNotMatch(petSrc, /isPending \|\| pet === undefined/);
  assert.ok(pendingAt >= 0, "auth pending still pulses");
  assert.ok(doorAt > pendingAt, "the door opens after pending, not after a forever load");
  assert.ok(loadPulseAt > doorAt, "a keeper may still pulse while the guest loads");
  assert.match(petSrc, /RedirectToSignIn/);
  assert.match(petSrc, /getSanctuary/);
  assert.match(petSrc, /CompanionRoom/);
  assert.match(petSrc, /persistLocal=\{false\}/);
  assert.match(petSrc, /onCare=\{persistCare\}/);
  assert.match(petSrc, /Token not in this kennel/);
  assert.match(petSrc, /if \(gone\)/);
});

test("nest origin shows a parent line when parent ids are present", () => {
  const phrase = nest.originPhrase(
    { origin: "nest", parent_a: "a", parent_b: "b", ...looks },
    [
      { id: "a", name: "Willow" },
      { id: "b", name: "Pip" },
    ],
  );
  assert.equal(phrase.kind, "nest");
  assert.equal(phrase.lead, "Of Willow and Pip");
  assert.equal(phrase.parents.length, 2);
  assert.equal(phrase.parents[0]?.inHouse, true);
  assert.match(phrase.wear, /frost eyes/);
  assert.match(phrase.wear, /Aa/);
  assert.match(petSrc, /originPhrase/);
  assert.match(petSrc, /PedigreeLead/);
});

test("hatch origin does not invent parents", () => {
  const phrase = nest.originPhrase(
    { origin: "hatch", parent_a: "a", parent_b: "b", ...looks },
    [
      { id: "a", name: "Willow" },
      { id: "b", name: "Pip" },
    ],
  );
  assert.equal(phrase.kind, "hatch");
  assert.equal(phrase.lead, "Drawn at the hatchery");
  assert.equal(phrase.parents.length, 0);
  assert.doesNotMatch(phrase.lead, /Willow|Pip/);
});

test("departed page does not mount a walking pet", () => {
  const livingAt = petSrc.indexOf("<CompanionRoom");
  const goneAt = petSrc.indexOf("if (gone)");
  assert.ok(goneAt >= 0);
  assert.ok(livingAt > goneAt);
  const goneBlock = petSrc.slice(goneAt, livingAt);
  assert.match(goneBlock, /paper-card/);
  assert.match(goneBlock, /Back to kennel/);
  assert.match(goneBlock, /farewell/);
  assert.doesNotMatch(goneBlock, /CompanionRoom/);
  assert.doesNotMatch(goneBlock, /LivingPet/);
  assert.doesNotMatch(petSrc, /<LivingPet/);
});

test("the kennel is a room with one walker", () => {
  assert.match(kennelSrc, /CompanionRoom/);
  assert.match(kennelSrc, /persistLocal=\{false\}/);
  assert.match(kennelSrc, /guestKey=\{walker \? `kennel-\$\{walker\.id\}` : "kennel"\}/);
  assert.match(kennelSrc, /The kennel is a room/);
  assert.match(kennelSrc, /The cards stay paper/);
  assert.match(kennelSrc, /The guests you keep/);
  assert.match(kennelSrc, /The hatchery is open/);
  assert.doesNotMatch(kennelSrc, /Held tokens/);
  assert.doesNotMatch(kennelSrc, /LivingPet/);
  assert.doesNotMatch(kennelSrc, /pets\.map\(\(pet\) => \(\s*<LivingPet/);
  assert.doesNotMatch(kennelSrc, /token_id/);
});

test("care on the kennel walker persists only that living guest", () => {
  assert.match(kennelSrc, /onCare=\{walker \? persistCare : undefined\}/);
  assert.match(kennelSrc, /careForPet/);
  assert.match(kennelSrc, /petId: walkerId/);
  assert.match(kennelSrc, /is_active/);
  assert.match(kennelSrc, /RED_PANDA_KIND/);
  assert.match(kennelSrc, /livingByKey/);
  assert.match(kennelSrc, /seed=\{walker \? normalizeCare\(walker\) : undefined\}/);
  assert.match(kennelSrc, /return normalizeCare\(next\)/);
  assert.match(petSrc, /seed=\{normalizeCare\(pet\)\}/);
  assert.match(petSrc, /return normalizeCare\(next\)/);
});

test("kennel cards stay paper and still open the guest room", () => {
  assert.match(cardSrc, /The kennel guest is a room/);
  assert.match(cardSrc, /from the nest/);
  assert.match(cardSrc, /lookHint/);
  assert.match(cardSrc, /pet\.stage/);
  assert.match(cardSrc, /to="\/pets\/\$key"/);
  assert.doesNotMatch(cardSrc, /LivingPet/);
  assert.doesNotMatch(cardSrc, /pet\.token_id/);
  assert.match(kennelSrc, /<PetCard pet=\{pet\} \/>/);
});

test("meet and demo stay the public door", () => {
  assert.match(meetSrc, /Watch Rui/);
  assert.match(meetSrc, /One hundred eighty guests walk the blotter/);
  assert.match(demoPageSrc, /DemoStage/);
  assert.match(demoSrc, /CompanionRoom/);
  assert.match(demoSrc, /persistLocal=\{false\}/);
  assert.doesNotMatch(demoSrc, /LIVING_KINDS\.map/);
  assert.doesNotMatch(roomSrc, /LIVING_KINDS\.map/);
});

test("hatch, nest, and desk stay on the same blotter", () => {
  assert.match(hatchSrc, /persistLocal=\{false\}/);
  assert.match(nestSrc, /persistLocal=\{false\}/);
  assert.match(deskSrc, /CompanionRoom/);
  assert.match(shellSrc, /pathname === "\/collection"/);
  assert.match(shellSrc, /pathname === "\/catalog"/);
});
