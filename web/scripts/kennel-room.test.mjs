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

test("kennel cards hint the room without walking sprites", () => {
  assert.match(cardSrc, /The kennel guest is a room/);
  assert.match(cardSrc, /from the nest/);
  assert.match(cardSrc, /lookHint/);
  assert.match(cardSrc, /pet\.stage/);
  assert.doesNotMatch(cardSrc, /LivingPet/);
  assert.doesNotMatch(cardSrc, /pet\.token_id/);
  assert.match(kennelSrc, /The kennel guest is a room/);
  assert.doesNotMatch(kennelSrc, /Held tokens/);
});

test("meet and demo stay the public door", () => {
  assert.match(meetSrc, /Watch Rui/);
  assert.match(meetSrc, /Eighty guests walk the blotter/);
  assert.match(demoPageSrc, /DemoStage/);
  assert.match(demoSrc, /CompanionRoom/);
  assert.doesNotMatch(demoSrc, /LIVING_KINDS\.map/);
  assert.doesNotMatch(roomSrc, /LIVING_KINDS\.map/);
});
