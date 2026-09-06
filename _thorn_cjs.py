from pathlib import Path

ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

def sub_once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1 occurrence, found {n}")
    return text.replace(old, new, 1)

CJS_TEST = r'''
test("Thorn spines a window well as a tide pool: walk into the well, sit the spines, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("sea_urchin"), "spines");
  assert.equal(P.SPINES, "spines");
  assert.notEqual(P.playFor("sea_urchin"), "thorn");
  assert.notEqual(P.playFor("sea_urchin"), "spine");
  assert.notEqual(P.playFor("sea_urchin"), "bristle");
  assert.notEqual(P.playFor("sea_urchin"), "ball");
  assert.notEqual(P.playFor("sea_urchin"), "crown");
  assert.notEqual(P.playFor("sea_urchin"), "flat");
  assert.notEqual(P.playFor("sea_urchin"), "side");
  assert.notEqual(P.playFor("sea_urchin"), "snap");
  assert.notEqual(P.playFor("sea_urchin"), "sill");
  assert.equal(P.playFor("porcupine"), "bristle");
  assert.equal(P.BRISTLE, "bristle");
  assert.equal(P.playFor("hedgehog"), "ball");
  assert.equal(P.BALL, "ball");
  assert.equal(P.playFor("horned_lizard"), "crown");
  assert.equal(P.CROWN, "crown");
  assert.equal(P.playFor("sand_dollar"), "flat");
  assert.equal(P.FLAT, "flat");
  assert.equal(P.playFor("periwinkle"), "rock");
  assert.equal(P.ROCK, "rock");
  assert.equal(P.playFor("chiton"), "eight");
  assert.equal(P.EIGHT, "eight");
  assert.equal(P.playFor("barnacle"), "cirri");
  assert.equal(P.CIRRI, "cirri");
  assert.equal(P.playFor("limpet"), "clamp");
  assert.equal(P.CLAMP, "clamp");
  assert.equal(P.playFor("ghost_crab"), "sand");
  assert.equal(P.SAND, "sand");
  assert.equal(P.playFor("fiddler_crab"), "signal");
  assert.equal(P.SIGNAL, "signal");
  assert.equal(P.playFor("amphipod"), "side");
  assert.equal(P.SIDE, "side");
  assert.equal(P.playFor("snapper"), "snap");
  assert.equal(P.SNAP, "snap");
  assert.equal(P.playFor("knobbed_whelk"), "sill");
  assert.equal(P.DUR.flatOn, 2.87, "Token flat durations stay");
  assert.equal(P.DUR.rockOn, 2.80, "Spire rock durations stay");
  assert.equal(P.DUR.eightOn, 2.73, "Mail eight durations stay");
  assert.equal(P.DUR.cirriOn, 2.66, "Cement cirri durations stay");
  assert.equal(P.DUR.clampOn, 2.59, "Cone clamp durations stay");
  assert.equal(P.DUR.sandOn, 2.52, "Pale sand durations stay");
  assert.equal(P.DUR.signalOn, 2.45, "Wave signal durations stay");
  assert.equal(P.DUR.sideOn, 2.38, "Scud side durations stay");
  assert.equal(P.DUR.crownOn, P.DUR.crownOn, "Spike crown durations stay");
  const target = P.pickTarget([WIN], 80, "sea_urchin", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "spines");
  assert.equal(target.side, "tidepool");
  assert.equal(target.leave, "spined");
  assert.notEqual(target.kind, "thorn");
  assert.notEqual(target.kind, "spine");
  assert.notEqual(target.kind, "bristle");
  assert.notEqual(target.kind, "ball");
  assert.notEqual(target.kind, "crown");
  assert.notEqual(target.kind, "flat");
  assert.notEqual(target.kind, "side");
  assert.notEqual(target.kind, "snap");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift > 16, "she spines a window well as a tide pool, not the floor");
  assert.ok(P.DUR.spinesHold > P.DUR.spines, "the hold is the sit after; the spines are the tell");
  assert.ok(P.DUR.spinesOn > 1.0, "a walk into the well, not the spines");
  assert.ok(P.DUR.spinesOn !== P.DUR.flatOn);
  assert.ok(P.DUR.spinesOn !== P.DUR.sideOn);
  assert.ok(P.DUR.spinesOn !== P.DUR.crownOn);
  assert.ok(P.DUR.spinesOn !== P.DUR.snapOn);
  assert.ok(P.DUR.spinesOn !== P.DUR.ballOn);
  assert.ok(P.DUR.spinesOn !== P.DUR.bristleOn);
  assert.ok(P.DUR.spinesOn !== P.DUR.sillHop);
  assert.ok(P.DUR.spines !== P.DUR.flat);
  assert.ok(P.DUR.spines !== P.DUR.side);
  assert.ok(P.DUR.spines !== P.DUR.crown);
  assert.ok(P.DUR.spinesHold !== P.DUR.flatHold);
  assert.ok(P.DUR.spinesHold !== P.DUR.sideHold);
  assert.ok(P.DUR.spinesOff !== P.DUR.flatOff);
  assert.ok(P.DUR.spinesOff !== P.DUR.sillDown);
  const pool = P.spinesPoint(WIN, P.SPRITE, WORK);
  const side = P.sidePoint(WIN, P.SPRITE, WORK);
  const tray = P.crownPoint(WIN, P.SPRITE, WORK);
  const bowl = P.snapPoint(WIN, P.SPRITE, WORK);
  const hole = P.goPoint(WIN, P.SPRITE, WORK);
  const run = P.barbelPoint(WIN, P.SPRITE, WORK);
  const den = P.browsePoint(WIN, P.SPRITE, WORK);
  const plate = P.flatPoint(WIN, P.SPRITE, WORK);
  const ball = P.ballPoint(WIN, P.SPRITE, WORK);
  const pine = P.bristlePoint(WIN, P.SPRITE, WORK);
  assert.ok(pool.lift > 16, "the window well as a tide pool, not the floor");
  assert.ok(Math.abs(pool.lift - side.lift) < 2, "the same window well Scud sides; the pose is spines");
  assert.ok(Math.abs(pool.x - side.x) > 8, "not Scud's window-well side");
  assert.ok(Math.abs(pool.lift - tray.lift) < 2, "the same window well Spike crowns; the pose is spines");
  assert.ok(Math.abs(pool.x - tray.x) > 8, "not Spike's window-well crown");
  assert.ok(Math.abs(pool.lift - bowl.lift) < 2, "the same window well Beak snaps; the pose is spines");
  assert.ok(Math.abs(pool.x - bowl.x) > 8, "not Beak's window-well snap");
  assert.ok(Math.abs(pool.lift - hole.lift) < 2, "the same window well Silver goes; the pose is spines");
  assert.ok(Math.abs(pool.x - hole.x) > 8, "not Silver's window-well go");
  assert.ok(Math.abs(pool.lift - run.lift) < 2, "the same window well Whisk barbels; the pose is spines");
  assert.ok(Math.abs(pool.x - run.x) > 8, "not Whisk's window-well barbel");
  assert.ok(Math.abs(pool.lift - den.lift) < 2, "the same window well Coal browses; the pose is spines");
  assert.ok(Math.abs(pool.x - den.x) > 8, "not Coal's window-well browse");
  assert.ok(Math.abs(pool.x - plate.x) > 8 || Math.abs(pool.lift - plate.lift) > 8, "not Token's sill-pan flat");
  assert.ok(Math.abs(pool.x - ball.x) > 8 || Math.abs(pool.lift - ball.lift) > 8, "not Burr's ball");
  assert.ok(Math.abs(pool.x - pine.x) > 8 || Math.abs(pool.lift - pine.lift) > 8, "not Spine's jamb bristle");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "sea_urchin", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real window well, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 200, height: 80 }], 80, "sea_urchin", WORK, P.SPRITE);
  assert.equal(short, null, "a real window well, not a short sash");
  const thin = P.pickTarget([{ id: "thin", x: 200, y: 80, width: 178, height: 160 }], 80, "sea_urchin", WORK, P.SPRITE);
  assert.equal(thin, null, "Thorn needs a real window well, not a shallower mouth");
  const well = P.pickTarget([{ id: "well", x: 200, y: 80, width: 178, height: 162 }], 80, "sea_urchin", WORK, P.SPRITE);
  assert.ok(well, "a real window well as a tide pool");
  const scudOk = P.pickTarget([{ id: "well", x: 200, y: 80, width: 178, height: 162 }], 80, "amphipod", WORK, P.SPRITE);
  assert.ok(scudOk, "Scud still takes the well");
  const spikeOk = P.pickTarget([{ id: "well", x: 200, y: 80, width: 178, height: 162 }], 80, "horned_lizard", WORK, P.SPRITE);
  assert.ok(spikeOk, "Spike still takes the well");
  const beakOk = P.pickTarget([{ id: "well", x: 200, y: 80, width: 178, height: 162 }], 80, "snapper", WORK, P.SPRITE);
  assert.ok(beakOk, "Beak still takes the well");
  const tokenOk = P.pickTarget([{ id: "pan", x: 200, y: 80, width: 190, height: 184 }], 80, "sand_dollar", WORK, P.SPRITE);
  assert.ok(tokenOk, "Token still takes the pan");
  const walkOn = P.spinesOnPath(0.25, { x: 40, lift: 0 }, { x: pool.x, lift: pool.lift });
  const sideOn = P.sideOnPath(0.25, { x: 40, lift: 0 }, { x: pool.x, lift: pool.lift });
  const crownOn = P.crownOnPath(0.25, { x: 40, lift: 0 }, { x: pool.x, lift: pool.lift });
  const snapOn = P.snapOnPath(0.25, { x: 40, lift: 0 }, { x: pool.x, lift: pool.lift });
  const flatOn = P.flatOnPath(0.25, { x: 40, lift: 0 }, { x: pool.x, lift: pool.lift });
  assert.ok(walkOn.lift > 0, "she walks into the well as a tide pool");
  assert.ok(walkOn.rot !== sideOn.rot, "a walk into the well, not Scud side");
  assert.ok(walkOn.rot !== crownOn.rot, "a walk into the well, not Spike crown");
  assert.ok(walkOn.rot !== snapOn.rot, "a walk into the well, not Beak snap");
  assert.ok(walkOn.rot !== flatOn.rot, "a walk into the well, not Token flat");
  const pulse = P.spinesPath(0.5);
  const sidePose = P.sidePath(0.5);
  const crownPose = P.crownPath(0.5);
  const snapPose = P.snapPath(0.5);
  const flatPose = P.flatPath(0.5);
  const ballPose = P.ballPath(0.5);
  const bristlePose = P.bristlePath(0.5);
  assert.ok(pulse.lift < 0, "she sits the spines; the spines are the tell");
  assert.ok(pulse.rot > 12, "spines on the tide pool");
  assert.ok(pulse.rot !== sidePose.rot, "spines, not a side");
  assert.ok(pulse.rot !== crownPose.rot, "spines, not a crown");
  assert.ok(pulse.rot !== snapPose.rot, "spines, not a snap");
  assert.ok(pulse.rot !== flatPose.rot, "spines, not a flat");
  assert.ok(pulse.rot !== ballPose.rot, "spines, not a ball");
  assert.ok(pulse.rot !== bristlePose.rot, "spines, not a bristle");
  const hold = P.spinesHoldPath(0.5);
  assert.ok(Math.abs(hold.rot - 14.8) < 0.2, "she holds after the spines, spines still the tell");
  assert.ok(Math.abs(hold.x - 0.8) < 0.2, "she stays on the tide pool");
  assert.ok(hold.lift < 0, "a sit-hold in the well after the spines");
  const off0 = P.spinesOffPath(0, { x: pool.x, lift: pool.lift, rot: 14.8 }, { x: pool.x + 50, lift: 0 });
  const offMid = P.spinesOffPath(0.5, { x: pool.x, lift: pool.lift, rot: 14.8 }, { x: pool.x + 50, lift: 0 });
  const off1 = P.spinesOffPath(1, { x: pool.x, lift: pool.lift, rot: 14.8 }, { x: pool.x + 50, lift: 0 });
  assert.ok(Math.abs(off0.x - pool.x) < 2);
  assert.ok(Math.abs(offMid.x - pool.x) > 8, "a walk leave off the tide pool");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "side");
    assert.notEqual(play.phase, "crown");
    assert.notEqual(play.phase, "snap");
    assert.notEqual(play.phase, "flat");
    assert.notEqual(play.phase, "ball");
    assert.notEqual(play.phase, "bristle");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "spines") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "spines-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "spines-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift - 4.4)) < 3, "she holds the spines after the sit in the well");
    }
    if (play.phase === "spines-off") {
      assert.equal(play.anim, "walk");
    }
  }
  assert.ok(seen.has("spines-on"));
  assert.ok(seen.has("spines"));
  assert.ok(seen.has("spines-hold"));
  assert.ok(seen.has("spines-off"));
  assert.ok(!seen.has("side"), "Thorn never uses Scud side");
  assert.ok(!seen.has("crown"), "Thorn never uses Spike crown");
  assert.ok(!seen.has("snap"), "Thorn never uses Beak snap");
  assert.ok(!seen.has("flat"), "Thorn never uses Token flat");
  assert.ok(!seen.has("ball"), "Thorn never uses Burr ball");
  assert.ok(!seen.has("bristle"), "Thorn never uses Spine bristle");
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});
test("a moved window refits Thorn's tide-pool spines; sleep, card, and hide abort; Thorn never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "sea_urchin", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "spines"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "spines");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "spines");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "spines-off");
  assert.equal(play.abort, true);
});
'''

def patch_cjs():
    p = ROOT / "desktop" / "renderer" / "window-play.test.cjs"
    t = p.read_text(encoding="utf-8")
    t = sub_once(
        t,
        '  const target = P.pickTarget([WIN], 80, "sea_urchin", WORK, P.SPRITE);',
        '  const target = P.pickTarget([WIN], 80, "knobbed_whelk", WORK, P.SPRITE);',
        "cjs generic sill walk",
    )
    n = t.count('assert.equal(P.playFor("sea_urchin"), "sill");')
    if n < 1:
        raise SystemExit(f"cjs sea_urchin sill pins: expected at least 1, found {n}")
    t = t.replace('assert.equal(P.playFor("sea_urchin"), "sill");', 'assert.equal(P.playFor("sea_urchin"), "spines");')
    if not t.endswith("\n"):
        t += "\n"
    t = t + CJS_TEST
    p.write_text(t, encoding="utf-8", newline="\n")
    print("cjs tests ok")

if __name__ == "__main__":
    patch_cjs()
