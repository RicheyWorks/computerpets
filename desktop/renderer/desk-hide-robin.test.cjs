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
  assert.deepEqual(Choice.guestMarks({ hidden: true }).map((m) => m.id), ["talk", "special", "call", "close", "exit"]);
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
  assert.equal(Call.assignSrc(img, src), false);
  assert.equal(Call.assignSrc(img, ""), false);
  assert.equal(img.src, "");
  assert.equal(img.dataset.surface, "refused");
  assert.equal(img.dataset.frame, undefined);

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

test("Rui idle is the house routine, not a parked sit_hold on an open card", () => {
  assert.match(petSrc, /if \(cardOpen\(\) && \(sim\.cmd === "wander"/);
  assert.doesNotMatch(petSrc, /if \(false && cardOpen\(\)/);
  assert.doesNotMatch(petSrc, /if \(cardOpen\(\)\) \{\s*issue\("idle"\)/);
  assert.match(livingSrc, /if \(cardRef\.current && \(cmd === "wander"/);
  assert.doesNotMatch(livingSrc, /if \(false && cardRef\.current/);
  assert.match(petSrc, /life\.energy < 8 && roll < 0\.7\)\) issue\("wander"\)/);
  assert.match(petSrc, /startAct\(window\.PetEthogram\.pickAct/);
});

test("already-sat meet guests can spawn visible on the live overlay", () => {
  assert.equal(Call.nextAutoMeet([], "red_panda"), "chickadee");
  assert.ok(Call.AUTO_MEET_KEYS.includes("cat"));
  assert.ok(Call.AUTO_MEET_KEYS.includes("dog"));
  assert.match(petSrc, /nextAutoMeet/);
  assert.match(petSrc, /spawnCalled\(\[next\]\)/);
  const img = { style: {}, src: "", setAttribute(n, v) { this[n] = v; this.src = n === "src" ? v : this.src; } };
  assert.equal(Call.destFit(img), true);
  assert.equal(Call.assignSrc(img, "sprites/cat/walk/1.png"), false);
  assert.equal(img.src, "");
});


test("fresh launch walks Rui; hide is only the Hide click; click-on-Rui does not hide", () => {
  assert.equal(Life.bootCmd("red_panda"), "wander");
  assert.notEqual(Life.bootCmd("red_panda"), "hide");
  assert.notEqual(Life.bootCmd("red_panda"), "sit");
  const tucked = Life.revealOnBoot({ hidden: true, asleep: true, sleepHeld: true, mood: 40 });
  assert.equal(tucked.hidden, false);
  assert.equal(tucked.asleep, false);
  const store = {
    data: Object.create(null),
    getItem(k) { return this.data[k] || null; },
    setItem(k, v) { this.data[k] = v; },
  };
  const prev = typeof localStorage === "undefined" ? null : localStorage;
  global.localStorage = store;
  store.setItem("computerpets.desktop.life.v2.red_panda", JSON.stringify({ hidden: true, hunger: 70, mood: 70, energy: 70 }));
  const loaded = Life.load("red_panda");
  assert.equal(loaded.hidden, false);
  Life.save("red_panda", { ...loaded, hidden: true });
  const again = JSON.parse(store.getItem("computerpets.desktop.life.v2.red_panda"));
  assert.equal(again.hidden, false);
  if (prev) global.localStorage = prev;
  else delete global.localStorage;
  assert.match(petSrc, /PetLife\.bootCmd/);
  assert.match(petSrc, /PetLife\.revealOnBoot/);
  assert.match(petSrc, /issue\(boot\)/);
  assert.match(petSrc, /kind\.key === "red_panda"/);
  assert.match(petSrc, /if \(cmd === "hide"\)/);
  assert.match(petSrc, /if \(lift\.kind === "tap"\) \{\s*openKeeperCard/);
  assert.doesNotMatch(petSrc, /if \(lift\.kind === "tap"\)[\s\S]{0,120}handle\("hide"\)/);
  assert.match(livingSrc, /if \(cardRef\.current && \(cmd === "wander"/);
  assert.doesNotMatch(livingSrc, /if \(false && cardRef\.current/);
});
