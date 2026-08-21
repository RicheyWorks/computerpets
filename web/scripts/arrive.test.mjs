import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const A = await import(join(root, "src/lib/pets/arrive.ts"));
const C = await import(join(root, "src/lib/pets/care.ts"));

const livingSrc = readFileSync(join(root, "src/components/desk/living-pet.tsx"), "utf8");
const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const speciesSrc = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");
const talkSrc = readFileSync(join(root, "src/lib/pets/talk.ts"), "utf8");
const careSrc = readFileSync(join(root, "src/lib/pets/care.ts"), "utf8");
const clutchSrc = readFileSync(join(root, "src/lib/pets/clutch.ts"), "utf8");
const deskSrc = readFileSync(join(root, "src/components/desk/desk-stage.tsx"), "utf8");
const liveSrc = readFileSync(join(root, "src/components/desk/live-stage.tsx"), "utf8");
const demoSrc = readFileSync(join(root, "src/components/desk/demo-stage.tsx"), "utf8");
const hatchSrc = readFileSync(join(root, "src/routes/hatch.tsx"), "utf8");
const nestSrc = readFileSync(join(root, "src/routes/nest.tsx"), "utf8");
const kennelSrc = readFileSync(join(root, "src/routes/collection.tsx"), "utf8");
const catalogSrc = readFileSync(join(root, "src/routes/catalog.tsx"), "utf8");
const petSrc = readFileSync(join(root, "src/routes/pets.$key.tsx"), "utf8");

const now = 1_700_000_000_000;
const DAY = 86400000;

function onUpSrc() {
  const start = livingSrc.indexOf("const onUp");
  const end = livingSrc.indexOf("root.addEventListener");
  return livingSrc.slice(start, end);
}

test("a drag-end does not arrive; a tap is a choice and does not arrive", () => {
  const tap = A.pointerUp(3, 4);
  assert.equal(tap.kind, "tap");
  assert.equal(tap.arrive, false);

  const edge = A.pointerUp(7, 0);
  assert.equal(edge.kind, "tap");
  assert.equal(edge.arrive, false);

  const drag = A.pointerUp(40, 12);
  assert.equal(drag.kind, "place");
  assert.equal(drag.arrive, false);

  const exact = A.pointerUp(A.TAP_PX, 0);
  assert.equal(exact.kind, "place");
  assert.equal(exact.arrive, false);

  const lift = onUpSrc();
  assert.match(lift, /pointerUp/);
  assert.match(lift, /tapRef\.current/);
  assert.doesNotMatch(lift, /arrivedRef/);
  assert.doesNotMatch(livingSrc, /Math\.hypot\([^)]+\) < 8/);
});

test("a finished walk or seek still arrives; leave arrives when they walk off", () => {
  assert.equal(A.walkLand(true, 0), "act");
  assert.equal(A.walkLand(false, 2), "pause");
  assert.equal(A.walkLand(false, 0), "arrive");
  assert.equal(A.arriveFinish(true), "now");
  assert.equal(A.arriveFinish(false), "settle");

  assert.match(livingSrc, /walkLand/);
  assert.match(livingSrc, /finishArrive/);
  assert.match(livingSrc, /arriveFinish/);
  assert.match(livingSrc, /s\.settle === 0 && s\.arrivedPending/);
  assert.equal([...livingSrc.matchAll(/arrivedRef\.current\?\.\(\)/g)].length, 3);
  assert.match(livingSrc, /if \(!s\.act\) arrivedRef\.current\?\.\(\)/);
});

test("a place on the wood keeps the walk to the mark", () => {
  assert.equal(A.afterPlace(true), "resume");
  assert.equal(A.afterPlace(false), "idle");
  const lift = onUpSrc();
  assert.match(lift, /afterPlace/);
  assert.match(lift, /aimAt/);
  assert.match(lift, /arrivedPending = false/);
  assert.match(livingSrc, /walkSpeed/);
  assert.match(livingSrc, /turnHoldS/);
  assert.match(livingSrc, /settleOffset/);
});

test("CompanionRoom still eats after a seek, hides after a leave, and picks mess by hand", () => {
  const arrived = roomSrc.slice(roomSrc.indexOf("onArrived="), roomSrc.indexOf("onTap="));
  assert.match(roomSrc, /command=\{order\.cmd\}/);
  assert.match(arrived, /playClaim\("arrive"/);
  assert.match(arrived, /act === "snack"/);
  assert.match(arrived, /applySnack/);
  assert.match(arrived, /issue\("eat"\)/);
  assert.match(arrived, /act === "hide"/);
  assert.match(arrived, /applyHide/);
  assert.doesNotMatch(arrived, /pickMess/);
  assert.doesNotMatch(arrived, /pickGift/);
  assert.match(roomSrc, /pickMess/);
  assert.match(roomSrc, /pickGift/);
  assert.match(roomSrc, /guestTap\(\)/);
  assert.match(roomSrc, /setChoiceOpen/);
  assert.doesNotMatch(roomSrc, /onTap=\{\(\) => void talk\(\)\}/);
});

test("adult Luna still does not eat; sanctuary, talk keeper, clutch-once, desk time, rooms stay", () => {
  const grownBorn = now - 2 * DAY;
  const adult = { ...C.blankCare(grownBorn), hunger: 40, bornAt: grownBorn, lastTick: now };
  assert.equal(C.adultLuna("luna", adult, now), true);
  assert.equal(C.applyFeedFor("luna", adult, now).hunger, 40);
  assert.equal([...speciesSrc.matchAll(/\{ key: "/g)].length, 210);
  assert.match(talkSrc, /bindTalkSpend/);
  assert.match(talkSrc, /optionalAuthMiddleware/);
  assert.match(careSrc, /packLine/);
  assert.match(clutchSrc, /claim\(/);
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
