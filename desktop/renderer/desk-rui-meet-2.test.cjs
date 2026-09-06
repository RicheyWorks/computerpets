const assert = require("node:assert/strict");
const { existsSync, readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const Call = require("./call-guests.js");
const WP = require("./window-play.js");

const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const calledSrc = readFileSync(join(__dirname, "..", "..", "web", "src", "components", "desk", "called-guests.tsx"), "utf8");
const roster = require("./roster.json");

const WIN = { id: "hw", x: 360, y: 80, width: 640, height: 420 };
const WORK = { width: 1400, height: 800, floorLift: 0 };

function stepUntil(guest, flags, want, n, width) {
  let g = guest;
  for (let i = 0; i < n && g.phase !== want; i++) g = Call.stepCalled(g, 0.05, width || 800, flags);
  return g;
}

test("Pip notices Rui on the floor, not a bird-fly copy", () => {
  assert.equal(Call.MEET_DOG_KEY, "dog");
  assert.equal(Call.matchCall("Pip", roster)[0], "dog");
  const sit = ["sprites/dog/sit/1.png"];
  const walk = ["sprites/dog/walk/1.png"];
  for (const name of sit.concat(walk)) assert.equal(existsSync(join(__dirname, name)), true);
  const flags = { hostKey: "red_panda", hostX: 200, hostFacing: 1, hostLift: 0 };
  assert.equal(Call.shouldMeetRui("dog", flags), true);
  assert.equal(Call.shouldPerchCalled("dog", { ...flags, hostSleeping: true }), false);
  let pip = Call.beginCalled("dog", 800, 0, 1);
  pip = Call.stepCalled(pip, 0.05, 800, flags);
  assert.equal(pip.phase, "approach-meet");
  assert.equal(pip.meetKind, "rui");
  assert.equal(pip.lift || 0, 0);
  pip = Call.stepCalled(pip, 0.08, 800, flags);
  assert.equal(pip.lift || 0, 0);
  pip = stepUntil(pip, flags, "meet", 40);
  assert.equal(pip.phase, "meet");
  assert.equal(pip.lift || 0, 0);
  const hold = Call.meetPoint(flags, "dog");
  assert.ok(Math.abs(pip.x - hold.x) < 2);
  assert.notEqual(pip.x, 200 + 36);
  assert.equal(Call.tellLine(pip), Call.PIP_RUI_LINE);
  pip = Call.stepCalled(pip, 2, 800, flags);
  assert.equal(pip.phase, "leave");
});

test("Soot notices Rui as a roost hop, not a robin shoulder perch", () => {
  assert.equal(Call.MEET_CROW_KEY, "crow");
  assert.equal(Call.matchCall("Soot", roster)[0], "crow");
  const sit = ["sprites/crow/sit/1.png"];
  const walk = ["sprites/crow/walk/1.png"];
  for (const name of sit.concat(walk)) assert.equal(existsSync(join(__dirname, name)), true);
  const flags = { hostKey: "red_panda", hostX: 200, hostFacing: 1, hostLift: 0, hostSleeping: true };
  assert.equal(Call.shouldMeetRui("crow", flags), true);
  assert.equal(Call.shouldPerchCalled("crow", flags), false);
  const shoulder = Call.perchPoint(200, 1, 0);
  let soot = Call.beginCalled("crow", 800, 0, 1);
  soot = Call.stepCalled(soot, 0.05, 800, flags);
  assert.equal(soot.phase, "approach-meet");
  assert.equal(soot.meetKind, "rui");
  assert.notEqual(soot.phase, "approach-perch");
  soot = Call.stepCalled(soot, 0.08, 800, flags);
  assert.ok((soot.lift || 0) > 0, "crow hops toward Rui");
  soot = stepUntil(soot, flags, "meet", 40);
  assert.equal(soot.phase, "meet");
  assert.notEqual(soot.phase, "perch");
  const hold = Call.meetPoint(flags, "crow");
  assert.ok(Math.abs(soot.x - hold.x) < 2);
  assert.notEqual(Math.round(soot.lift || 0), shoulder.lift);
  assert.equal(Call.tellLine(soot), Call.SOOT_RUI_LINE);
  const src = Call.poseSrc({ ...soot, frame: 0 }, { sit, walk, idle: [] });
  assert.ok(src.includes("crow/sit/"));
});

test("Miso notices Pip already on the desk; HouseVisit is not a reliable called peer", () => {
  const flags = {
    hostKey: "red_panda",
    hostX: 80,
    hostFacing: 1,
    hostLift: 0,
    peers: [{ key: "dog", x: 400, lift: 0, phase: "stay" }],
  };
  assert.equal(Call.shouldMeetPeer("cat", flags), true);
  assert.equal(Call.shouldMeetRui("cat", flags), false);
  assert.equal(Call.shouldMeetPeer("chickadee", flags), false);
  let miso = Call.beginCalled("cat", 800, 0, 1);
  miso = Call.stepCalled(miso, 0.05, 800, flags);
  assert.equal(miso.phase, "approach-meet");
  assert.equal(miso.meetKind, "peer");
  miso = stepUntil(miso, flags, "meet", 40);
  assert.equal(miso.phase, "meet");
  assert.ok(Math.abs(miso.x - 448) < 2);
  assert.equal(miso.lift || 0, 0);
  assert.notEqual(Math.round(miso.x), 80 - 52);
  assert.equal(Call.tellLine(miso), Call.CAT_PIP_LINE);
  miso = Call.stepCalled(miso, 2, 800, flags);
  assert.equal(miso.phase, "leave");
  const pile = {
    ...flags,
    peers: [
      { key: "dog", x: 400, lift: 0, phase: "stay" },
      { key: "robin", x: 300, lift: 0, phase: "stay" },
      { key: "chickadee", x: 336, lift: 8, phase: "meet" },
    ],
  };
  assert.equal(Call.shouldMeetPeer("cat", pile), false);
});

test("Soot sits a drip-cap bound, not sill or the reserved caw playFor", () => {
  assert.equal(WP.playFor("crow"), "caw");
  const cap = Call.windowCapBound(WIN, WORK);
  const sill = Call.windowSitBound(WIN, WORK);
  assert.ok(cap);
  assert.equal(cap.kind, "drip-cap");
  assert.notEqual(cap.kind, "sill");
  assert.notEqual(cap.kind, "ledge");
  assert.notEqual(cap.kind, "cache");
  assert.notEqual(cap.kind, "pull");
  assert.notEqual(cap.kind, "caw");
  assert.ok(cap.lift > sill.lift);
  const flags = { hostKey: "red_panda", hostX: 200, hostFacing: 1, hostLift: 0, capBound: cap };
  assert.equal(Call.shouldSitBound("crow", flags), true);
  assert.equal(Call.shouldSitBound("cat", flags), false);
  let soot = Call.beginCalled("crow", 800, 0, 1);
  soot = stepUntil(soot, flags, "meet", 40);
  assert.equal(soot.phase, "meet");
  soot = Call.stepCalled(soot, 2, 800, flags);
  assert.equal(soot.phase, "approach-bound");
  soot = stepUntil(soot, flags, "bound", 40);
  assert.equal(soot.phase, "bound");
  assert.ok(Math.abs(soot.x - cap.x) < 2);
  assert.ok(Math.abs((soot.lift || 0) - cap.lift) < 2);
  assert.equal(Call.tellLine(soot), Call.SOOT_CAP_LINE);
  const sit = ["sprites/crow/sit/1.png"];
  assert.ok(Call.poseSrc(soot, { sit, walk: ["w.png"] }).includes("crow/sit/"));
});

test("hide/click/robin and first meets from 470/471 still hold", () => {
  const flags = { hostKey: "red_panda", hostX: 200, hostFacing: 1, hostLift: 0 };
  assert.equal(Call.shouldMeetRui("chickadee", flags), true);
  assert.equal(Call.shouldMeetRui("cat", flags), true);
  let dee = stepUntil(Call.beginCalled("chickadee", 800, 0, 1), flags, "meet", 40);
  assert.equal(dee.phase, "meet");
  assert.equal(Call.tellLine(dee), Call.DEE_RUI_LINE);
  let miso = stepUntil(Call.beginCalled("cat", 800, 0, 1), flags, "meet", 40);
  assert.equal(miso.phase, "meet");
  assert.equal(miso.lift || 0, 0);
  const perchFlags = { hostKey: "red_panda", hostSleeping: true, hostX: 200, hostFacing: 1, hostLift: 0 };
  let robin = stepUntil(Call.beginCalled("robin", 800, 0, 1), perchFlags, "perch", 40);
  assert.equal(robin.phase, "perch");
  assert.equal(require("./roster.json").length, 220);
  assert.match(petSrc, /firstCapBound/);
  assert.match(calledSrc, /firstCapBound/);
});
