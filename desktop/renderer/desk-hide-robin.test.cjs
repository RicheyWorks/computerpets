const assert = require("node:assert/strict");
const { readFileSync, existsSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const D = require("./desk.js");
const Gait = require("./gait.js");
const Life = require("./life.js");
const Call = require("./call-guests.js");
const Choice = require("./choice.js");

const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const cssSrc = readFileSync(join(__dirname, "styles.css"), "utf8");
const htmlSrc = readFileSync(join(__dirname, "index.html"), "utf8");
const livingSrc = readFileSync(join(__dirname, "..", "..", "web", "src", "components", "desk", "living-pet.tsx"), "utf8");
const calledSrc = readFileSync(join(__dirname, "..", "..", "web", "src", "components", "desk", "called-guests.tsx"), "utf8");

test("hidden Rui still has a click hit; hide does not eat the click", () => {
  const pet = { id: "pet", dataset: {} };
  const faded = { pointerEvents: "none", visibility: "visible", display: "block", opacity: "0" };
  assert.equal(D.hitAllows(pet, faded), true);
  assert.equal(D.hitAllows({ id: "choice" }, faded), true);
  assert.equal(D.hitAllows({ id: "weather-plate" }, faded), false);
  assert.equal(D.hitAllows({ id: "weather-plate", dataset: {} }, { pointerEvents: "auto", visibility: "visible", display: "block", opacity: "1" }), true);
  assert.equal(
    D.cursorHits({ x: 40, y: 500 }, [{ x: 16, y: 400, width: 176, height: 176 }]),
    true,
  );
  assert.match(cssSrc, /#pet\.hidden[\s\S]{0,80}pointer-events:\s*auto/);
  assert.match(cssSrc, /#pet\.hidden[\s\S]{0,80}opacity:\s*0\.22/);
  assert.doesNotMatch(cssSrc, /#pet\.hidden[\s\S]{0,80}pointer-events:\s*none/);
  assert.match(petSrc, /hitAllows/);
  assert.match(htmlSrc, /id="pet"[^>]*data-hit/);
  assert.match(livingSrc, /pointerEvents: "auto"/);
  assert.match(livingSrc, /opacity: hidden \? 0\.22 : 1/);
  assert.doesNotMatch(livingSrc, /pointerEvents: hidden \? "none"/);
});

test("ribbon hide tucks on the floor and call still walks him back", () => {
  assert.equal(Gait.hideTuck(80, 800, 176, 16), 16);
  assert.equal(Gait.hideTuck(600, 800, 176, 16), 608);
  assert.ok(Gait.hideTuck(80, 800, 176, 16) >= 0);
  assert.ok(Gait.hideTuck(600, 800, 176, 16) + 176 <= 800);
  assert.equal(Gait.leaveTarget(80, 800, 176), -200);
  assert.match(petSrc, /PetGait\.hideTuck/);
  assert.match(petSrc, /I went where the ribbon goes/);
  assert.match(livingSrc, /hideTuck/);
  const trait = { extra: { hide: ["I went where the ribbon goes."] } };
  const hidden = { ...Life.blank(), hidden: true, mood: 50, bond: 10 };
  const stuck = Life.act(hidden, trait, "play", Date.now(), "red_panda");
  assert.equal(stuck.life.hidden, true);
  assert.equal(stuck.cmd, "idle");
  const back = Life.act(hidden, trait, "call", Date.now(), "red_panda");
  assert.equal(back.life.hidden, false);
  assert.equal(back.cmd, "enter");
  assert.deepEqual(Choice.guestMarks({ hidden: true }).map((m) => m.id), ["talk", "special", "call"]);
  assert.match(petSrc, /openKeeperCard/);
  assert.match(petSrc, /openChoice/);
});

test("robin draw uses one real sit or walk frame, not two empty rects, and perch does not despawn", () => {
  const sit = ["sprites/robin/sit/1.png", "sprites/robin/sit/2.png", "sprites/robin/sit/3.png", "sprites/robin/sit/4.png"];
  const walk = ["sprites/robin/walk/1.png", "sprites/robin/walk/2.png", "sprites/robin/walk/3.png", "sprites/robin/walk/4.png", "sprites/robin/walk/5.png", "sprites/robin/walk/6.png"];
  const idle = ["sprites/robin/idle/1.png"];
  for (const name of sit.concat(walk.slice(0, 1))) {
    assert.equal(existsSync(join(__dirname, name)), true);
  }
  const perched = { key: "robin", phase: "perch", frame: 0 };
  const frames = Call.poseFrames(perched, { sit, walk, idle });
  assert.deepEqual(frames, sit);
  const src = Call.poseSrc({ ...perched, frame: 7 }, { sit, walk, idle });
  assert.equal(src, sit[7 % sit.length]);
  assert.ok(src.includes("robin/sit/"));
  assert.notEqual(src, "");
  const walking = Call.poseSrc({ key: "robin", phase: "in", frame: 0 }, { sit, walk, idle });
  assert.equal(walking, walk[0]);

  const img = { src: "", dataset: {}, style: {}, setAttribute(name, value) { this[name] = value; }, getAttribute(name) { return this[name] || ""; } };
  assert.equal(Call.assignSrc(img, src), true);
  assert.equal(Call.assignSrc(img, src), false);
  assert.equal(Call.assignSrc(img, ""), false);
  assert.notEqual(img.src, "");
  assert.notEqual(img.src, "sprites/robin/walk/1.png");

  const flags = { hostKey: "red_panda", hostSleeping: true, hostX: 200, hostFacing: 1, hostLift: 0 };
  let robin = Call.beginCalled("robin", 800, 0, 1);
  robin = Call.stepCalled(robin, 0.05, 800, flags);
  for (let i = 0; i < 40 && robin.phase !== "perch"; i++) robin = Call.stepCalled(robin, 0.05, 800, flags);
  assert.equal(robin.phase, "perch");
  robin = Call.stepCalled(robin, 30, 800, flags);
  assert.equal(robin.phase, "perch");
  assert.notEqual(robin.phase, "gone");
  assert.ok(Call.poseSrc(robin, { sit, walk, idle }).includes("/sit/"));
  assert.match(calledSrc, /getAttribute\("src"\)/);
  assert.match(calledSrc, /poseFrames/);
  assert.doesNotMatch(calledSrc, /if \(hidden \|\| !list\.length\)/);
});
