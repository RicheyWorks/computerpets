import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const A = await import(join(root, "src/lib/pets/arrive.ts"));
const P = await import(join(root, "src/lib/pets/play.ts"));

const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const livingSrc = readFileSync(join(root, "src/components/desk/living-pet.tsx"), "utf8");
const demoSrc = readFileSync(join(root, "src/components/desk/demo-stage.tsx"), "utf8");
const demoPageSrc = readFileSync(join(root, "src/routes/demo.$slug.tsx"), "utf8");

function lureSeek() {
  return { taken: false, cmd: "seek", mark: "lure" };
}

function onUpSrc() {
  const start = livingSrc.indexOf("const onUp");
  const end = livingSrc.indexOf("root.addEventListener");
  return livingSrc.slice(start, end);
}

test("the demo is a room; the guest is already walking", () => {
  assert.match(demoPageSrc, /DemoStage/);
  assert.match(demoSrc, /CompanionRoom/);
  assert.match(demoSrc, /persistLocal=\{false\}/);
  assert.match(roomSrc, /LivingPet/);
  assert.match(roomSrc, /dropTreatAt/);
  assert.doesNotMatch(demoSrc, /BrowserWindow|setIgnoreMouseEvents|overlay/);
});

test("the demo room walks to the treat", () => {
  assert.match(roomSrc, /function dropTreatAt/);
  assert.match(roomSrc, /setMark\(\{ kind: "treat"/);
  assert.match(roomSrc, /issue\("seek"\)/);
  const arrived = roomSrc.slice(roomSrc.indexOf("onArrived="), roomSrc.indexOf("onTap="));
  assert.match(arrived, /act === "snack"/);
  assert.match(arrived, /applySnack/);
  assert.match(arrived, /issue\("eat"\)/);
  assert.match(livingSrc, /cmd === "seek"/);
  assert.match(livingSrc, /walkLand/);
  assert.match(livingSrc, /finishArrive/);
});

test("play on the demo is one hop", () => {
  const catchThenArrive = P.playChase(["catch", "arrive"], lureSeek());
  assert.deepEqual(catchThenArrive.acts, ["play", "idle"]);
  assert.equal(catchThenArrive.applyPlay, 1);
  assert.equal(catchThenArrive.issuePlay, 1);

  const arriveThenCatch = P.playChase(["arrive", "catch"], lureSeek());
  assert.deepEqual(arriveThenCatch.acts, ["play", "none"]);
  assert.equal(arriveThenCatch.applyPlay, 1);
  assert.equal(arriveThenCatch.issuePlay, 1);

  assert.match(roomSrc, /playClaim\("catch"/);
  assert.match(roomSrc, /playClaim\("arrive"/);
  const arrived = roomSrc.slice(roomSrc.indexOf("onArrived="), roomSrc.indexOf("onTap="));
  assert.equal([...arrived.matchAll(/issue\("play"\)/g)].length, 1);
});

test("a drag on the demo living pet does not arrive", () => {
  const tap = A.pointerUp(3, 4);
  assert.equal(tap.kind, "tap");
  assert.equal(tap.arrive, false);
  const drag = A.pointerUp(40, 12);
  assert.equal(drag.kind, "place");
  assert.equal(drag.arrive, false);

  const lift = onUpSrc();
  assert.match(lift, /pointerUp/);
  assert.match(lift, /afterPlace/);
  assert.doesNotMatch(lift, /arrivedRef/);
  assert.match(livingSrc, /walkLand/);
  assert.match(livingSrc, /finishArrive/);
});
