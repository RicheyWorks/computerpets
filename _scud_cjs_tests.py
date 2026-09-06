from pathlib import Path

def load(p):
    b = Path(p).read_bytes()
    crlf = b"\r\n" in b
    t = b.decode("utf-8").replace("\r\n", "\n")
    return t, crlf

def save(p, t, crlf):
    if crlf:
        t = t.replace("\n", "\r\n")
    Path(p).write_bytes(t.encode("utf-8"))

CJS = r'''
test("Scud sides a window well as a side pool: walk into the well, swim the side, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("amphipod"), "side");
  assert.equal(P.SIDE, "side");
  assert.equal(P.playFor("nematode"), "thrash");
  assert.equal(P.THRASH, "thrash");
  assert.equal(P.playFor("ferret"), "thread");
  assert.equal(P.THREAD, "thread");
  assert.equal(P.playFor("planarian"), "split");
  assert.equal(P.playFor("tardigrade"), "dry");
  assert.equal(P.playFor("springtail"), "spring");
  assert.equal(P.playFor("pillbug"), "roll");
  assert.equal(P.playFor("american_eel"), "go");
  assert.equal(P.playFor("catfish"), "barbel");
  assert.equal(P.playFor("snapper"), "snap");
  assert.equal(P.playFor("horned_lizard"), "crown");
  assert.equal(P.playFor("black_bear"), "browse");
  assert.equal(P.playFor("fiddler_crab"), "sill");
  assert.notEqual(P.playFor("amphipod"), "scud");
  assert.notEqual(P.playFor("amphipod"), "thrash");
  assert.notEqual(P.playFor("amphipod"), "roll");
  assert.notEqual(P.playFor("amphipod"), "go");
  assert.notEqual(P.playFor("amphipod"), "barbel");
  assert.notEqual(P.playFor("amphipod"), "snap");
  assert.notEqual(P.playFor("amphipod"), "sill");
  assert.equal(P.DUR.thrashOn, 2.31, "Thread thrash durations stay");
  assert.equal(P.DUR.goOn, 1.71, "Silver go durations stay");
  assert.equal(P.DUR.threadOn, 0.44, "Wick thread durations stay");
  assert.equal(P.DUR.rollOn, 1.91, "Armor roll durations stay");
  assert.equal(P.DUR.barbelOn, 1.47, "Whisk barbel durations stay");
  const target = P.pickTarget([WIN], 80, "amphipod", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "side");
  assert.equal(target.side, "sidepool");
  assert.equal(target.leave, "sides");
  assert.notEqual(target.kind, "scud");
  assert.notEqual(target.kind, "thrash");
  assert.notEqual(target.kind, "roll");
  assert.notEqual(target.kind, "go");
  assert.notEqual(target.kind, "barbel");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift > 16, "she sides a window well as a side pool, not the floor");
  assert.ok(P.DUR.sideHold > P.DUR.side, "the hold is the sit after; the side is the tell");
  assert.ok(P.DUR.sideOn > 1.0, "a walk into the well, not the side");
  assert.ok(P.DUR.sideOn !== P.DUR.thrashOn);
  assert.ok(P.DUR.sideOn !== P.DUR.goOn);
  assert.ok(P.DUR.sideOn !== P.DUR.rollOn);
  assert.ok(P.DUR.sideOn !== P.DUR.barbelOn);
  assert.ok(P.DUR.sideOn !== P.DUR.snapOn);
  assert.ok(P.DUR.sideOn !== P.DUR.threadOn);
  assert.ok(P.DUR.sideOn !== P.DUR.sillHop);
  assert.ok(P.DUR.side !== P.DUR.thrash);
  assert.ok(P.DUR.side !== P.DUR.go);
  assert.ok(P.DUR.side !== P.DUR.roll);
  assert.ok(P.DUR.sideHold !== P.DUR.thrashHold);
  assert.ok(P.DUR.sideHold !== P.DUR.goHold);
  assert.ok(P.DUR.sideOff !== P.DUR.goOff);
  assert.ok(P.DUR.sideOff !== P.DUR.sillDown);
  const pool = P.sidePoint(WIN, P.SPRITE, WORK);
  const hole = P.goPoint(WIN, P.SPRITE, WORK);
  const run = P.barbelPoint(WIN, P.SPRITE, WORK);
  const bowl = P.snapPoint(WIN, P.SPRITE, WORK);
  const tray = P.crownPoint(WIN, P.SPRITE, WORK);
  const den = P.browsePoint(WIN, P.SPRITE, WORK);
  const rebate = P.thrashPoint(WIN, P.SPRITE, WORK);
  const plates = P.rollPoint(WIN, P.SPRITE, WORK);
  assert.ok(pool.lift > 16, "the window well as a side pool, not the floor");
  assert.ok(Math.abs(pool.lift - hole.lift) < 2, "the same window well Silver goes; the pose is a side");
  assert.ok(Math.abs(pool.x - hole.x) > 8, "not Silver's window-well go");
  assert.ok(Math.abs(pool.lift - run.lift) < 2, "the same window well Whisk barbels; the pose is a side");
  assert.ok(Math.abs(pool.x - run.x) > 8, "not Whisk's window-well barbel");
  assert.ok(Math.abs(pool.lift - bowl.lift) < 2, "the same window well Beak snaps; the pose is a side");
  assert.ok(Math.abs(pool.x - bowl.x) > 8, "not Beak's window-well snap");
  assert.ok(Math.abs(pool.lift - tray.lift) < 2, "the same window well Spike crowns; the pose is a side");
  assert.ok(Math.abs(pool.x - tray.x) > 8, "not Spike's window-well crown");
  assert.ok(Math.abs(pool.lift - den.lift) < 2, "the same window well Coal browses; the pose is a side");
  assert.ok(Math.abs(pool.x - den.x) > 8, "not Coal's window-well browse");
  assert.ok(Math.abs(pool.x - rebate.x) > 8 || Math.abs(pool.lift - rebate.lift) > 8, "not Thread's glazing-rebate thrash");
  assert.ok(Math.abs(pool.x - plates.x) > 8 || Math.abs(pool.lift - plates.lift) > 8, "not Armor's window-stool roll");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "amphipod", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real window well, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 200, height: 80 }], 80, "amphipod", WORK, P.SPRITE);
  assert.equal(short, null, "a real window well, not a short sash");
  const thin = P.pickTarget([{ id: "thin", x: 200, y: 80, width: 178, height: 160 }], 80, "amphipod", WORK, P.SPRITE);
  assert.equal(thin, null, "Scud needs Silver, Whisk, Beak, Spike, and Coal's real window well, not a shallower mouth");
  const well = P.pickTarget([{ id: "well", x: 200, y: 80, width: 178, height: 162 }], 80, "amphipod", WORK, P.SPRITE);
  assert.ok(well, "a real window well as a side pool");
  const silverOk = P.pickTarget([{ id: "well", x: 200, y: 80, width: 178, height: 162 }], 80, "american_eel", WORK, P.SPRITE);
  assert.ok(silverOk, "Silver still takes the well");
  const whiskOk = P.pickTarget([{ id: "well", x: 200, y: 80, width: 178, height: 162 }], 80, "catfish", WORK, P.SPRITE);
  assert.ok(whiskOk, "Whisk still takes the well");
  const beakOk = P.pickTarget([{ id: "well", x: 200, y: 80, width: 178, height: 162 }], 80, "snapper", WORK, P.SPRITE);
  assert.ok(beakOk, "Beak still takes the well");
  const threadOk = P.pickTarget([{ id: "rebate", x: 200, y: 80, width: 192, height: 198 }], 80, "nematode", WORK, P.SPRITE);
  assert.ok(threadOk, "Thread still takes the rebate");
  const walkOn = P.sideOnPath(0.25, { x: 40, lift: 0 }, { x: pool.x, lift: pool.lift });
  const goOn = P.goOnPath(0.25, { x: 40, lift: 0 }, { x: pool.x, lift: pool.lift });
  const barbelOn = P.barbelOnPath(0.25, { x: 40, lift: 0 }, { x: pool.x, lift: pool.lift });
  const snapOn = P.snapOnPath(0.25, { x: 40, lift: 0 }, { x: pool.x, lift: pool.lift });
  const thrashOn = P.thrashOnPath(0.25, { x: 40, lift: 0 }, { x: pool.x, lift: pool.lift });
  assert.ok(walkOn.lift > 0, "she walks into the well as a side pool");
  assert.ok(walkOn.rot !== goOn.rot, "a walk into the well, not Silver go");
  assert.ok(walkOn.rot !== barbelOn.rot, "a walk into the well, not Whisk barbel");
  assert.ok(walkOn.rot !== snapOn.rot, "a walk into the well, not Beak snap");
  assert.ok(walkOn.rot !== thrashOn.rot, "a walk into the well, not Thread thrash");
  const swim = P.sidePath(0.5);
  const going = P.goPath(0.5);
  const taste = P.barbelPath(0.5);
  const hook = P.snapPath(0.5);
  const round = P.thrashPath(0.5);
  const platesPose = P.rollPath(0.5);
  assert.ok(Math.abs(swim.rot) > 70, "she swims on her side; the side is the tell");
  assert.ok(swim.rot !== going.rot, "a side, not a go");
  assert.ok(swim.rot !== taste.rot, "a side, not a barbel");
  assert.ok(swim.rot !== hook.rot, "a side, not a snap");
  assert.ok(swim.rot !== round.rot, "a side, not a thrash");
  assert.ok(swim.rot !== platesPose.rot, "a side, not a roll");
  const hold = P.sideHoldPath(0.5);
  assert.ok(Math.abs(hold.rot - 86.4) < 0.2, "she holds after the side, on her side");
  assert.ok(Math.abs(hold.x - 3.2) < 0.2, "she stays in the side pool");
  assert.ok(hold.lift < -4, "a sit in the pool after the side");
  const off0 = P.sideOffPath(0, { x: pool.x, lift: pool.lift, rot: 86.4 }, { x: pool.x + 65, lift: 0 });
  const offMid = P.sideOffPath(0.5, { x: pool.x, lift: pool.lift, rot: 86.4 }, { x: pool.x + 65, lift: 0 });
  const off1 = P.sideOffPath(1, { x: pool.x, lift: pool.lift, rot: 86.4 }, { x: pool.x + 65, lift: 0 });
  assert.ok(Math.abs(off0.x - pool.x) < 2);
  assert.ok(Math.abs(offMid.x - pool.x) > 8, "a walk leave off the side pool");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "go");
    assert.notEqual(play.phase, "barbel");
    assert.notEqual(play.phase, "thrash");
    assert.notEqual(play.phase, "roll");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "side") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "side-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "side-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift - 4.4)) < 3, "she holds the sit on her side in the pool");
    }
    if (play.phase === "side-off") {
      assert.equal(play.anim, "walk");
    }
  }
  assert.ok(seen.has("side-on"));
  assert.ok(seen.has("side"));
  assert.ok(seen.has("side-hold"));
  assert.ok(seen.has("side-off"));
  assert.ok(!seen.has("go"), "Scud never uses Silver go");
  assert.ok(!seen.has("barbel"), "Scud never uses Whisk barbel");
  assert.ok(!seen.has("thrash"), "Scud never uses Thread thrash");
  assert.ok(!seen.has("roll"), "Scud never uses Armor roll");
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});
test("a moved window refits Scud's side-pool side; sleep, card, and hide abort; Scud never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "amphipod", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "side"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "side");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "side");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "side-off");
  assert.equal(play.abort, true);
});
'''

t, crlf = load("desktop/renderer/window-play.test.cjs")
if "Scud sides a window well as a side pool" in t:
    raise SystemExit("cjs already has Scud test")
if not t.endswith("\n"):
    t += "\n"
t += CJS
save("desktop/renderer/window-play.test.cjs", t, crlf)
print("cjs tests appended")
