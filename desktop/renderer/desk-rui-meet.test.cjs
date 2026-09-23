const assert = require("node:assert/strict");
const { existsSync, readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const D = require("./desk.js");
const Gait = require("./gait.js");
const Call = require("./call-guests.js");
const Choice = require("./choice.js");

const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const cssSrc = readFileSync(join(__dirname, "styles.css"), "utf8");
const livingSrc = readFileSync(join(__dirname, "..", "..", "web", "src", "components", "desk", "living-pet.tsx"), "utf8");
const calledSrc = readFileSync(join(__dirname, "..", "..", "web", "src", "components", "desk", "called-guests.tsx"), "utf8");

const WIN = { id: "hw", x: 360, y: 80, width: 640, height: 420 };
const WORK = { width: 1400, height: 800, floorLift: 0 };

function stepUntil(guest, flags, want, n, width) {
  let g = guest;
  for (let i = 0; i < n && g.phase !== want; i++) g = Call.stepCalled(g, 0.05, width || 800, flags);
  return g;
}

test("Dee notices Rui, hop-steps in, sits a real frame, then leaves", () => {
  assert.equal(Call.MEET_DEE_KEY, "chickadee");
  assert.equal(Call.matchCall("Dee", require("./roster.json"))[0], "chickadee");
  const sit = ["sprites/chickadee/sit/1.png", "sprites/chickadee/sit/2.png", "sprites/chickadee/sit/3.png", "sprites/chickadee/sit/4.png"];
  const walk = ["sprites/chickadee/walk/1.png", "sprites/chickadee/walk/2.png"];
  for (const name of sit) assert.equal(existsSync(join(__dirname, name)), true);
  const flags = { hostKey: "red_panda", hostX: 200, hostFacing: 1, hostLift: 0 };
  assert.equal(Call.shouldMeetRui("chickadee", flags), true);
  assert.equal(Call.shouldMeetRui("robin", flags), false);
  let dee = Call.beginCalled("chickadee", 800, 0, 1);
  dee = Call.stepCalled(dee, 0.05, 800, flags);
  assert.equal(dee.phase, "approach-meet");
  assert.equal(dee.meetKind, "rui");
  dee = Call.stepCalled(dee, 0.08, 800, flags);
  assert.ok((dee.lift || 0) > 0, "hop-step lifts off the floor");
  dee = stepUntil(dee, flags, "meet", 40);
  assert.equal(dee.phase, "meet");
  const src = Call.poseSrc({ ...dee, frame: 0 }, { sit, walk, idle: [] });
  assert.ok(src.includes("chickadee/sit/"));
  assert.notEqual(src, "");
  const img = { src: "", dataset: {}, setAttribute(name, value) { this[name] = value; }, getAttribute(name) { return this[name] || ""; } };
  assert.equal(Call.assignSrc(img, src), false);
  assert.equal(img.src, "");
  assert.equal(img.dataset.surface, "refused");
  assert.equal(Call.shouldTell(dee), true);
  assert.equal(Call.tellLine(dee), Call.DEE_RUI_LINE);
  dee = Call.stepCalled(dee, 2, 800, flags);
  assert.equal(dee.phase, "leave");
});

test("Miso notices Rui on the floor, not a bird-fly copy", () => {
  assert.equal(Call.MEET_CAT_KEY, "cat");
  assert.equal(Call.matchCall("Miso", require("./roster.json"))[0], "cat");
  const flags = { hostKey: "red_panda", hostX: 200, hostFacing: 1, hostLift: 0 };
  assert.equal(Call.shouldMeetRui("cat", flags), true);
  let miso = Call.beginCalled("cat", 800, 0, 1);
  miso = Call.stepCalled(miso, 0.05, 800, flags);
  assert.equal(miso.phase, "approach-meet");
  assert.equal(miso.meetKind, "rui");
  assert.equal(miso.lift || 0, 0);
  miso = stepUntil(miso, flags, "meet", 40);
  assert.equal(miso.phase, "meet");
  assert.equal(miso.lift || 0, 0);
  const hold = Call.meetPoint(flags, "cat");
  assert.ok(Math.abs(miso.x - hold.x) < 2);
  assert.notEqual(miso.x, 200 + 36);
  assert.equal(Call.tellLine(miso), Call.CAT_RUI_LINE);
});

test("Dee notices the robin, not a three-guest pile-on", () => {
  const flags = {
    hostKey: "red_panda",
    hostX: 80,
    hostFacing: 1,
    hostLift: 0,
    peers: [{ key: "robin", x: 400, lift: 0, phase: "stay" }],
  };
  assert.equal(Call.shouldMeetPeer("chickadee", flags), true);
  assert.equal(Call.shouldMeetRui("chickadee", flags), false);
  let dee = Call.beginCalled("chickadee", 800, 0, 1);
  dee = Call.stepCalled(dee, 0.05, 800, flags);
  assert.equal(dee.phase, "approach-meet");
  assert.equal(dee.meetKind, "peer");
  dee = stepUntil(dee, flags, "meet", 40);
  assert.equal(dee.phase, "meet");
  assert.ok(Math.abs(dee.x - 436) < 2);
  assert.notEqual(Math.round(dee.x), 80 + 44);
  assert.equal(Call.tellLine(dee), Call.DEE_ROBIN_LINE);
  dee = Call.stepCalled(dee, 2, 800, flags);
  assert.equal(dee.phase, "leave");
});

test("Miso sits a window sill bound, not ledge or pull or cache", () => {
  const bound = Call.windowSitBound(WIN, WORK);
  assert.ok(bound);
  assert.equal(bound.kind, "sill");
  assert.notEqual(bound.kind, "ledge");
  assert.notEqual(bound.kind, "cache");
  assert.notEqual(bound.kind, "pull");
  assert.ok(bound.lift > 0);
  const flags = { hostKey: "red_panda", hostX: 200, hostFacing: 1, hostLift: 0, windowBound: bound };
  assert.equal(Call.shouldSitBound("cat", flags), true);
  assert.equal(Call.shouldSitBound("chickadee", flags), false);
  let miso = Call.beginCalled("cat", 800, 0, 1);
  miso = stepUntil(miso, flags, "meet", 40);
  assert.equal(miso.phase, "meet");
  miso = Call.stepCalled(miso, 2, 800, flags);
  assert.equal(miso.phase, "approach-bound");
  miso = stepUntil(miso, flags, "bound", 40);
  assert.equal(miso.phase, "bound");
  assert.ok(Math.abs(miso.x - bound.x) < 2);
  assert.ok(Math.abs((miso.lift || 0) - bound.lift) < 2);
  assert.equal(Call.tellLine(miso), Call.CAT_SILL_LINE);
  const sit = ["sprites/cat/sit/1.png"];
  assert.ok(Call.poseSrc(miso, { sit, walk: ["w.png"] }).includes("cat/sit/"));
});

test("hide, hidden click, and robin perch from 470 still hold", () => {
  const faded = { pointerEvents: "none", visibility: "visible", display: "block", opacity: "0" };
  assert.equal(D.hitAllows({ id: "pet", dataset: {} }, faded), true);
  assert.match(cssSrc, /#pet\.hidden[\s\S]{0,80}pointer-events:\s*auto/);
  assert.match(cssSrc, /#pet\.hidden[\s\S]{0,80}opacity:\s*0\.22/);
  assert.match(livingSrc, /opacity: hidden \? 0\.22 : 1/);
  assert.equal(Gait.hideTuck(80, 800, 176, 16), 16);
  assert.match(petSrc, /PetGait\.hideTuck/);
  assert.deepEqual(Choice.guestMarks({ hidden: true }).map((m) => m.id), ["talk", "special", "call", "close", "exit"]);
  const sit = ["sprites/robin/sit/1.png", "sprites/robin/sit/2.png"];
  const walk = ["sprites/robin/walk/1.png"];
  const perched = { key: "robin", phase: "perch", frame: 0 };
  assert.deepEqual(Call.poseFrames(perched, { sit, walk, idle: [] }), sit);
  const flags = { hostKey: "red_panda", hostSleeping: true, hostX: 200, hostFacing: 1, hostLift: 0 };
  let robin = Call.beginCalled("robin", 800, 0, 1);
  robin = stepUntil(robin, flags, "perch", 40);
  assert.equal(robin.phase, "perch");
  robin = Call.stepCalled(robin, 30, 800, flags);
  assert.equal(robin.phase, "perch");
  assert.match(calledSrc, /poseFrames/);
  assert.doesNotMatch(calledSrc, /if \(hidden \|\| !list\.length\)/);
});

test("overlay Call still paints one real frame and keeps guests when Rui hides", () => {
  assert.match(petSrc, /shouldTell/);
  assert.match(petSrc, /firstWindowBound/);
  assert.match(calledSrc, /shouldTell/);
  assert.match(calledSrc, /firstWindowBound/);
  assert.equal(require("./roster.json").length, 221);
});
