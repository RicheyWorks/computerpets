import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const P = await import(join(root, "src/lib/pets/play.ts"));
const C = await import(join(root, "src/lib/pets/care.ts"));

const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const blotterSrc = readFileSync(join(root, "src/components/desk/blotter.tsx"), "utf8");
const livingSrc = readFileSync(join(root, "src/components/desk/living-pet.tsx"), "utf8");
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

function lureSeek() {
  return { taken: false, cmd: "seek", mark: "lure" };
}

test("one lure chase finishes play once; catch then arrive does not double", () => {
  const sameTick = P.playHop(lureSeek(), "catch");
  assert.equal(sameTick.act, "play");
  assert.equal(sameTick.applyPlay, 1);
  assert.equal(sameTick.issuePlay, 1);
  assert.equal(P.playClaim("arrive", { taken: true, cmd: "seek", mark: null }), "none");
  assert.equal(P.playClaim("arrive", { taken: true, cmd: "seek", mark: "lure" }), "none");

  const local = P.playChase(["catch", "arrive"], lureSeek());
  assert.deepEqual(local.acts, ["play", "idle"]);
  assert.equal(local.applyPlay, 1);
  assert.equal(local.persistPlay, 0);
  assert.equal(local.issuePlay, 1);
  assert.equal(local.taken, true);
  assert.equal(local.mark, null);
  assert.equal(local.cmd, "idle");

  const remote = P.playChase(["catch", "arrive"], lureSeek(), true);
  assert.deepEqual(remote.acts, ["play", "idle"]);
  assert.equal(remote.applyPlay, 0);
  assert.equal(remote.persistPlay, 1);
  assert.equal(remote.issuePlay, 1);

  const start = { ...C.blankCare(now), mood: 40, bond: 10, hunger: 70, energy: 70 };
  const once = C.applyPlay(start);
  const twice = C.applyPlay(once);
  assert.ok(twice.mood > once.mood);
  assert.ok(twice.bond > once.bond);
  assert.equal(local.applyPlay, 1);
  assert.equal(once.mood, C.applyPlay(start).mood);
  assert.equal(once.bond, C.applyPlay(start).bond);
});

test("arrive then catch is the same hop, not a second play", () => {
  const local = P.playChase(["arrive", "catch"], lureSeek());
  assert.deepEqual(local.acts, ["play", "none"]);
  assert.equal(local.applyPlay, 1);
  assert.equal(local.persistPlay, 0);
  assert.equal(local.issuePlay, 1);

  const remote = P.playChase(["arrive", "catch"], lureSeek(), true);
  assert.deepEqual(remote.acts, ["play", "none"]);
  assert.equal(remote.applyPlay, 0);
  assert.equal(remote.persistPlay, 1);
  assert.equal(remote.issuePlay, 1);

  assert.equal(P.playClaim("catch", { taken: true, cmd: "seek", mark: "lure" }), "none");
  assert.equal(P.playClaim("arrive", { taken: true, cmd: "seek", mark: "lure" }), "none");
});

test("treat seek still snacks; hide still hides; a catch is not a snack", () => {
  const treat = P.playChase(["arrive"], { taken: false, cmd: "seek", mark: "treat" });
  assert.deepEqual(treat.acts, ["snack"]);
  assert.equal(treat.applyPlay, 0);
  assert.equal(treat.issuePlay, 0);
  assert.equal(treat.issueEat, 1);
  assert.equal(treat.cmd, "eat");

  assert.equal(P.playClaim("catch", { taken: false, cmd: "seek", mark: "treat" }), "none");
  assert.equal(P.playClaim("arrive", { taken: false, cmd: "leave", mark: null }), "hide");
  assert.equal(P.playClaim("arrive", { taken: false, cmd: "play", mark: null }), "idle");
});

test("CompanionRoom claims play once; blotter catch and flee stay", () => {
  const arrived = roomSrc.slice(roomSrc.indexOf("onArrived="), roomSrc.indexOf("onTap="));
  const catchFn = roomSrc.slice(roomSrc.indexOf("async function catchLure"), roomSrc.indexOf("function fleeLure"));
  assert.match(roomSrc, /playClaim/);
  assert.match(catchFn, /playClaim\("catch"/);
  assert.match(arrived, /playClaim\("arrive"/);
  assert.match(catchFn, /takenRef\.current = true/);
  assert.match(arrived, /takenRef\.current = true/);
  assert.match(catchFn, /issue\("play"\)/);
  assert.match(arrived, /issue\("play"\)/);
  assert.equal([...catchFn.matchAll(/issue\("play"\)/g)].length, 1);
  assert.equal([...arrived.matchAll(/issue\("play"\)/g)].length, 1);
  assert.match(arrived, /act === "snack"/);
  assert.match(arrived, /applySnack/);
  assert.match(arrived, /issue\("eat"\)/);
  assert.match(arrived, /act === "hide"/);
  assert.match(arrived, /applyHide/);
  assert.match(roomSrc, /function fleeLure/);
  assert.match(roomSrc, /hops: 1/);
  assert.match(roomSrc, /onCatchLure=\{\(\) => void catchLure\(\)\}/);
  assert.match(roomSrc, /onFlee=\{fleeLure\}/);
  assert.match(blotterSrc, /onCatchLure\(\)/);
  assert.match(blotterSrc, /onFlee\(randomLureX\(\)\)/);
  assert.match(blotterSrc, /\(mark\.hops \?\? 0\) > 0/);
});

test("drag-end still does not arrive; a walk to the mark still does", () => {
  const start = livingSrc.indexOf("const onUp");
  const end = livingSrc.indexOf("root.addEventListener");
  const lift = livingSrc.slice(start, end);
  assert.match(lift, /pointerUp/);
  assert.doesNotMatch(lift, /arrivedRef/);
  assert.match(livingSrc, /walkLand/);
  assert.match(livingSrc, /finishArrive/);
});

test("adult Luna still does not eat; sanctuary, talk keeper, clutch-once, desk time, rooms stay", () => {
  const grownBorn = now - 2 * DAY;
  const adult = { ...C.blankCare(grownBorn), hunger: 40, bornAt: grownBorn, lastTick: now };
  assert.equal(C.adultLuna("luna", adult, now), true);
  assert.equal(C.applyFeedFor("luna", adult, now).hunger, 40);
  assert.equal([...speciesSrc.matchAll(/\{ key: "/g)].length, 120);
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
