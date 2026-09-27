const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const S = require("./desk-spots.js");
const C = require("./card.js");
const Desk = require("./desk.js");

const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const htmlSrc = readFileSync(join(__dirname, "index.html"), "utf8");
const mainSrc = readFileSync(join(__dirname, "..", "main.cjs"), "utf8");

const A = "8f3c1a52-0d4e-4b7a-9c61-2e5d7f90ab01";
const B = "1b2c3d4e-5f60-4172-8394-a5b6c7d8e9f0";
const DAY = 24 * 60 * 60 * 1000;
const NOW = 1_800_000_000_000;
const here = (x, extra) => ({ x, width: 1920, min: 12, max: 1788, now: NOW, ...(extra || {}) });

function deskId(n) {
  return `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
}

test("an older card.json has no deskSpots and loads with an empty map; nothing else moves", () => {
  const old = { collapsed: true, color: "moss", voiceStyle: "hush", mutes: { talk: true }, off: false, pets: {} };
  const card = C.parseCard(old);
  assert.deepEqual(card.deskSpots, {});
  assert.equal(card.collapsed, true);
  assert.equal(card.color, "moss");
  assert.equal(card.voiceStyle, "hush");
  assert.deepEqual(C.parseCard(null).deskSpots, {});
  assert.deepEqual(C.blankCard().deskSpots, {});
});

test("deskSpots survive a card round trip; bad rows and bad ids are dropped", () => {
  const raw = {
    deskSpots: {
      [A.toUpperCase()]: { x: 400.4, w: 1920, at: NOW },
      ["{" + B + "}"]: { x: 90, w: 1920, at: NOW - DAY },
      "00000000-0000-0000-0000-000000000000": { x: 5, w: 1920, at: NOW },
      "not-a-desk": { x: 5, w: 1920, at: NOW },
      [deskId(1)]: { x: -3, w: 1920, at: NOW },
      [deskId(2)]: { x: 10, w: 0, at: NOW },
      [deskId(3)]: { x: "10", w: 1920, at: NOW },
      [deskId(4)]: null,
    },
  };
  const card = C.parseCard(raw);
  assert.deepEqual(Object.keys(card.deskSpots).sort(), [A, B].sort());
  assert.deepEqual(card.deskSpots[A], { x: 400, w: 1920, at: NOW });
  assert.deepEqual(C.parseCard(JSON.parse(JSON.stringify(card))).deskSpots, card.deskSpots);
  assert.deepEqual(S.parseSpots([1, 2, 3]), {});
  assert.deepEqual(S.parseSpots("x"), {});
});

test("leaving a desktop keeps the pet's spot there; coming back puts the pet there again", () => {
  let spots = {};
  const toB = S.arrive(spots, { from: A, to: B }, here(400));
  assert.deepEqual(toB.spots[A], { x: 400, w: 1920, at: NOW });
  assert.equal(toB.x, null, "B has no spot yet: the pet stays where it is");
  spots = toB.spots;
  const toA = S.arrive(spots, { from: B, to: A }, here(1500, { now: NOW + 5000 }));
  assert.equal(toA.x, 400, "back on A, the pet goes back to 400");
  assert.deepEqual(toA.spots[B], { x: 1500, w: 1920, at: NOW + 5000 });
  const toB2 = S.arrive(toA.spots, { from: A, to: B }, here(700, { now: NOW + 9000 }));
  assert.equal(toB2.x, 1500);
  assert.equal(toB2.spots[A].x, 700, "A keeps where the pet sat last");
});

test("a desktop with no spot falls back to where the pet already is", () => {
  const out = S.arrive({ [A]: { x: 300, w: 1920, at: NOW } }, { from: A, to: B }, here(640));
  assert.equal(out.x, null);
  assert.equal(S.spotFor(out.spots, B, here(640)), null);
  assert.equal(S.spotFor(out.spots, "", here(640)), null);
});

test("not a real move: same desktop, no target, or a bad id changes nothing", () => {
  const spots = { [A]: { x: 300, w: 1920, at: NOW } };
  assert.equal(S.arrive(spots, { from: A, to: A }, here(10)), null);
  assert.equal(S.arrive(spots, { from: A, to: "" }, here(10)), null);
  assert.equal(S.arrive(spots, { from: A, to: "nope" }, here(10)), null);
  assert.equal(S.arrive(spots, null, here(10)), null);
  const noFrom = S.arrive(spots, { from: "", to: A }, here(10));
  assert.equal(noFrom.x, 300);
  assert.deepEqual(noFrom.spots, spots, "no from: nothing is written");
  const noX = S.arrive(spots, { from: B, to: A }, here(NaN));
  assert.equal(noX.spots[B], undefined, "no live x: nothing is written for B");
});

test("a kept spot is scaled to a different overlay width and held inside the floor", () => {
  const spots = { [A]: { x: 960, w: 1920, at: NOW }, [B]: { x: 1900, w: 1920, at: NOW } };
  assert.equal(S.spotFor(spots, A, { width: 1280, min: 12, max: 1148 }), 640);
  assert.equal(S.spotFor(spots, B, { width: 1920, min: 12, max: 1788 }), 1788);
  assert.equal(S.spotFor(spots, A, { width: 1921, min: 12, max: 1789 }), 960, "a one-pixel change is not a rescale");
});

test("at most twelve desktops are kept, newest first; a desktop not seen for 90 days is dropped", () => {
  let spots = {};
  for (let i = 0; i < 20; i += 1) {
    spots = S.arrive(spots, { from: deskId(i), to: deskId(i + 1) }, here(100 + i, { now: NOW + i * 1000 })).spots;
  }
  const ids = Object.keys(spots);
  assert.equal(ids.length, S.MAX_DESKS);
  assert.equal(S.MAX_DESKS, 12);
  assert.ok(ids.includes(deskId(19)));
  assert.ok(!ids.includes(deskId(0)), "the oldest desktop went first");
  const stale = S.parseSpots({ [A]: { x: 1, w: 1920, at: NOW - 91 * DAY }, [B]: { x: 2, w: 1920, at: NOW - 89 * DAY } }, NOW);
  assert.deepEqual(Object.keys(stale), [B]);
  assert.equal(S.STALE_MS, 90 * DAY);
});

test("Mac, Linux, and follow off never get a desktop move, so the pet does what it did before", () => {
  assert.equal(Desk.desktopFollow("darwin"), false);
  assert.equal(Desk.desktopFollow("linux"), false);
  const start = mainSrc.indexOf("function startDesktopFollow()");
  const end = mainSrc.indexOf("function setDesktopFollow(");
  const body = mainSrc.slice(start, end);
  assert.match(body, /if \(!Desk\.desktopFollow\(process\.platform\) \|\| vdeskFollower\) return;/);
  assert.match(body, /"vdesk-arrive"/, "the only sender lives inside the Windows follower");
  assert.equal(mainSrc.split('"vdesk-arrive"').length - 1, 1);
  assert.match(petSrc, /if \(window\.desk && window\.desk\.onDeskArrive && window\.PetDeskSpots\)/);
});

test("the overlay keeps the spot in card.json and moves the pet only when it is free", () => {
  assert.ok(htmlSrc.indexOf('src="desk-spots.js"') > 0);
  assert.ok(htmlSrc.indexOf('src="desk-spots.js"') < htmlSrc.indexOf('src="card.js"'));
  assert.match(petSrc, /card\.deskSpots = out\.spots;\s*persistCard\(\);/);
  assert.match(petSrc, /deskSpotPending && !leaving && !sim\.play && !sim\.trick && !sim\.happy && !sim\.dragging/);
  assert.match(petSrc, /Date\.now\(\) > deskSpotPending\.until/);
  assert.equal(S.HOLD_MS, 10000);
});