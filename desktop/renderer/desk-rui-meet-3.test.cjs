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

test("Thimble notices Rui on the floor with a thump hop, not a bird-fly copy", () => {
  assert.equal(Call.MEET_RABBIT_KEY, "rabbit");
  assert.equal(Call.matchCall("Thimble", roster)[0], "rabbit");
  const sit = ["sprites/rabbit/sit/1.png"];
  const walk = ["sprites/rabbit/walk/1.png"];
  for (const name of sit.concat(walk)) assert.equal(existsSync(join(__dirname, name)), true);
  const flags = { hostKey: "red_panda", hostX: 200, hostFacing: 1, hostLift: 0 };
  assert.equal(Call.shouldMeetRui("rabbit", flags), true);
  assert.equal(Call.shouldPerchCalled("rabbit", { ...flags, hostSleeping: true }), false);
  let thimble = Call.beginCalled("rabbit", 800, 0, 1);
  thimble = Call.stepCalled(thimble, 0.05, 800, flags);
  assert.equal(thimble.phase, "approach-meet");
  assert.equal(thimble.meetKind, "rui");
  thimble = Call.stepCalled(thimble, 0.08, 800, flags);
  assert.ok((thimble.lift || 0) > 0, "rabbit thumps toward Rui");
  thimble = stepUntil(thimble, flags, "meet", 40);
  assert.equal(thimble.phase, "meet");
  assert.equal(thimble.lift || 0, 0);
  const hold = Call.meetPoint(flags, "rabbit");
  assert.ok(Math.abs(thimble.x - hold.x) < 2);
  assert.notEqual(thimble.x, 200 + 36);
  assert.equal(Call.tellLine(thimble), Call.THIMBLE_RUI_LINE);
  thimble = Call.stepCalled(thimble, 2, 800, flags);
  assert.equal(thimble.phase, "leave");
});

test("Wedge notices Rui as a roost hop, not a robin perch or Soot hop", () => {
  assert.equal(Call.MEET_RAVEN_KEY, "raven");
  assert.equal(Call.matchCall("Wedge", roster)[0], "raven");
  const sit = ["sprites/raven/sit/1.png"];
  const walk = ["sprites/raven/walk/1.png"];
  for (const name of sit.concat(walk)) assert.equal(existsSync(join(__dirname, name)), true);
  const flags = { hostKey: "red_panda", hostX: 200, hostFacing: 1, hostLift: 0, hostSleeping: true };
  assert.equal(Call.shouldMeetRui("raven", flags), true);
  assert.equal(Call.shouldPerchCalled("raven", flags), false);
  const shoulder = Call.perchPoint(200, 1, 0);
  const crowHold = Call.meetPoint(flags, "crow");
  let wedge = Call.beginCalled("raven", 800, 0, 1);
  wedge = Call.stepCalled(wedge, 0.05, 800, flags);
  assert.equal(wedge.phase, "approach-meet");
  assert.equal(wedge.meetKind, "rui");
  assert.notEqual(wedge.phase, "approach-perch");
  wedge = Call.stepCalled(wedge, 0.08, 800, flags);
  assert.ok((wedge.lift || 0) > 0, "raven hops toward Rui");
  let soot = Call.beginCalled("crow", 800, 0, 1);
  soot = Call.stepCalled(soot, 0.05, 800, flags);
  soot = Call.stepCalled(soot, 0.08, 800, flags);
  assert.notEqual(Math.round(wedge.lift || 0), Math.round(soot.lift || 0));
  wedge = stepUntil(wedge, flags, "meet", 40);
  assert.equal(wedge.phase, "meet");
  assert.notEqual(wedge.phase, "perch");
  const hold = Call.meetPoint(flags, "raven");
  assert.ok(Math.abs(wedge.x - hold.x) < 2);
  assert.notEqual(Math.round(wedge.lift || 0), shoulder.lift);
  assert.notEqual(hold.lift, crowHold.lift);
  assert.equal(Call.tellLine(wedge), Call.WEDGE_RUI_LINE);
  assert.notEqual(Call.WEDGE_RUI_LINE, Call.SOOT_RUI_LINE);
  const src = Call.poseSrc({ ...wedge, frame: 0 }, { sit, walk, idle: [] });
  assert.ok(src.includes("raven/sit/"));
});

test("Thimble notices Pip already on the desk; not a three-guest pile-on", () => {
  const flags = {
    hostKey: "red_panda",
    hostX: 80,
    hostFacing: 1,
    hostLift: 0,
    peers: [{ key: "dog", x: 400, lift: 0, phase: "stay" }],
  };
  assert.equal(Call.shouldMeetPeer("rabbit", flags), true);
  assert.equal(Call.shouldMeetRui("rabbit", flags), false);
  assert.equal(Call.shouldMeetPeer("chickadee", flags), false);
  let thimble = Call.beginCalled("rabbit", 800, 0, 1);
  thimble = Call.stepCalled(thimble, 0.05, 800, flags);
  assert.equal(thimble.phase, "approach-meet");
  assert.equal(thimble.meetKind, "peer");
  thimble = stepUntil(thimble, flags, "meet", 40);
  assert.equal(thimble.phase, "meet");
  assert.ok(Math.abs(thimble.x - 448) < 2);
  assert.equal(thimble.lift || 0, 0);
  assert.notEqual(Math.round(thimble.x), 80 - 52);
  assert.equal(Call.tellLine(thimble), Call.THIMBLE_PIP_LINE);
  thimble = Call.stepCalled(thimble, 2, 800, flags);
  assert.equal(thimble.phase, "leave");
  const pile = {
    ...flags,
    peers: [
      { key: "dog", x: 400, lift: 0, phase: "stay" },
      { key: "cat", x: 448, lift: 0, phase: "meet" },
    ],
  };
  assert.equal(Call.shouldMeetPeer("rabbit", pile), false);
});

test("Wedge sits a high transom bound, not sill, drip-cap, or the reserved croak playFor", () => {
  assert.equal(WP.playFor("raven"), "croak");
  const transom = Call.windowTransomBound(WIN, WORK);
  const cap = Call.windowCapBound(WIN, WORK);
  const sill = Call.windowSitBound(WIN, WORK);
  assert.ok(transom);
  assert.equal(transom.kind, "transom");
  assert.notEqual(transom.kind, "sill");
  assert.notEqual(transom.kind, "drip-cap");
  assert.notEqual(transom.kind, "ledge");
  assert.notEqual(transom.kind, "croak");
  assert.ok(transom.lift > sill.lift);
  assert.notEqual(transom.x, cap.x);
  assert.notEqual(transom.lift, cap.lift);
  const flags = { hostKey: "red_panda", hostX: 200, hostFacing: 1, hostLift: 0, transomBound: transom };
  assert.equal(Call.shouldSitBound("raven", flags), true);
  assert.equal(Call.shouldSitBound("crow", flags), false);
  assert.equal(Call.shouldSitBound("cat", flags), false);
  let wedge = Call.beginCalled("raven", 800, 0, 1);
  wedge = stepUntil(wedge, flags, "meet", 40);
  assert.equal(wedge.phase, "meet");
  wedge = Call.stepCalled(wedge, 2, 800, flags);
  assert.equal(wedge.phase, "approach-bound");
  wedge = stepUntil(wedge, flags, "bound", 40);
  assert.equal(wedge.phase, "bound");
  assert.ok(Math.abs(wedge.x - transom.x) < 2);
  assert.ok(Math.abs((wedge.lift || 0) - transom.lift) < 2);
  assert.equal(Call.tellLine(wedge), Call.WEDGE_TRANSOM_LINE);
  const sit = ["sprites/raven/sit/1.png"];
  assert.ok(Call.poseSrc(wedge, { sit, walk: ["w.png"] }).includes("raven/sit/"));
});

test("hide/click/robin and first two meet leftovers still hold", () => {
  const flags = { hostKey: "red_panda", hostX: 200, hostFacing: 1, hostLift: 0 };
  assert.equal(Call.shouldMeetRui("chickadee", flags), true);
  assert.equal(Call.shouldMeetRui("cat", flags), true);
  assert.equal(Call.shouldMeetRui("dog", flags), true);
  assert.equal(Call.shouldMeetRui("crow", flags), true);
  let dee = stepUntil(Call.beginCalled("chickadee", 800, 0, 1), flags, "meet", 40);
  assert.equal(dee.phase, "meet");
  assert.equal(Call.tellLine(dee), Call.DEE_RUI_LINE);
  let miso = stepUntil(Call.beginCalled("cat", 800, 0, 1), flags, "meet", 40);
  assert.equal(miso.phase, "meet");
  assert.equal(miso.lift || 0, 0);
  let pip = stepUntil(Call.beginCalled("dog", 800, 0, 1), flags, "meet", 40);
  assert.equal(pip.phase, "meet");
  assert.equal(pip.lift || 0, 0);
  const perchFlags = { hostKey: "red_panda", hostSleeping: true, hostX: 200, hostFacing: 1, hostLift: 0 };
  let robin = stepUntil(Call.beginCalled("robin", 800, 0, 1), perchFlags, "perch", 40);
  assert.equal(robin.phase, "perch");
  let soot = stepUntil(Call.beginCalled("crow", 800, 0, 1), perchFlags, "meet", 40);
  assert.equal(soot.phase, "meet");
  assert.notEqual(soot.phase, "perch");
  assert.equal(require("./roster.json").length, 220);
  assert.match(petSrc, /firstTransomBound/);
  assert.match(calledSrc, /firstTransomBound/);
});
