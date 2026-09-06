from pathlib import Path
ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

CJS_TESTS = r'''
test("Mail plates a meeting rail as a tide rock: walk onto the rail, plate the eight, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("chiton"), "eight");
  assert.equal(P.EIGHT, "eight");
  assert.notEqual(P.playFor("chiton"), "mail");
  assert.notEqual(P.playFor("chiton"), "cirri");
  assert.notEqual(P.playFor("chiton"), "clamp");
  assert.notEqual(P.playFor("chiton"), "rasp");
  assert.notEqual(P.playFor("chiton"), "roll");
  assert.notEqual(P.playFor("chiton"), "sill");
  assert.equal(P.playFor("barnacle"), "cirri");
  assert.equal(P.CIRRI, "cirri");
  assert.equal(P.playFor("limpet"), "clamp");
  assert.equal(P.CLAMP, "clamp");
  assert.equal(P.playFor("ghost_crab"), "sand");
  assert.equal(P.SAND, "sand");
  assert.equal(P.playFor("fiddler_crab"), "signal");
  assert.equal(P.SIGNAL, "signal");
  assert.equal(P.playFor("box_turtle"), "shut");
  assert.equal(P.SHUT, "shut");
  assert.equal(P.playFor("pond_snail"), "rasp");
  assert.equal(P.RASP, "rasp");
  assert.equal(P.playFor("pillbug"), "roll");
  assert.equal(P.ROLL, "roll");
  assert.equal(P.playFor("periwinkle"), "sill");
  assert.equal(P.DUR.cirriOn, 2.66, "Cement cirri durations stay");
  assert.equal(P.DUR.clampOn, 2.59, "Cone clamp durations stay");
  assert.equal(P.DUR.sandOn, 2.52, "Pale sand durations stay");
  assert.equal(P.DUR.signalOn, 2.45, "Wave signal durations stay");
  assert.equal(P.DUR.shutOn, 1.47, "Lid shut durations stay");
  assert.equal(P.DUR.raspOn, 2.69, "Whorl rasp durations stay");
  assert.equal(P.DUR.rollOn, 1.93, "Armor roll durations stay");
  const target = P.pickTarget([WIN], 80, "chiton", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "eight");
  assert.equal(target.side, "tiderock");
  assert.equal(target.leave, "plated");
  assert.notEqual(target.kind, "mail");
  assert.notEqual(target.kind, "cirri");
  assert.notEqual(target.kind, "clamp");
  assert.notEqual(target.kind, "rasp");
  assert.notEqual(target.kind, "roll");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift > 28, "she plates a meeting rail as a tide rock, not the floor");
  assert.ok(P.DUR.eightHold > P.DUR.eight, "the hold is the plate after; the eight is the play");
  assert.ok(P.DUR.eightOn > 1.0, "a walk onto the rail, not the plate");
  assert.ok(P.DUR.eightOn !== P.DUR.cirriOn);
  assert.ok(P.DUR.eightOn !== P.DUR.clampOn);
  assert.ok(P.DUR.eightOn !== P.DUR.markOn);
  assert.ok(P.DUR.eightOn !== P.DUR.barredOn);
  assert.ok(P.DUR.eightOn !== P.DUR.leanOn);
  assert.ok(P.DUR.eightOn !== P.DUR.countOn);
  assert.ok(P.DUR.eightOn !== P.DUR.rollOn);
  assert.ok(P.DUR.eightOn !== P.DUR.sillHop);
  assert.ok(P.DUR.eight !== P.DUR.cirri);
  assert.ok(P.DUR.eight !== P.DUR.clamp);
  assert.ok(P.DUR.eight !== P.DUR.rasp);
  assert.ok(P.DUR.eight !== P.DUR.roll);
  assert.ok(P.DUR.eightHold !== P.DUR.cirriHold);
  assert.ok(P.DUR.eightHold !== P.DUR.clampHold);
  assert.ok(P.DUR.eightOff !== P.DUR.cirriOff);
  assert.ok(P.DUR.eightOff !== P.DUR.sillDown);
  const rail = P.eightPoint(WIN, P.SPRITE, WORK);
  const mark = P.markPoint(WIN, P.SPRITE, WORK);
  const barred = P.barredPoint(WIN, P.SPRITE, WORK);
  const lean = P.leanPoint(WIN, P.SPRITE, WORK);
  const count = P.countPoint(WIN, P.SPRITE, WORK);
  const stile = P.cirriPoint(WIN, P.SPRITE, WORK);
  const rim = P.clampPoint(WIN, P.SPRITE, WORK);
  const rasp = P.raspPoint(WIN, P.SPRITE, WORK);
  const roll = P.rollPoint(WIN, P.SPRITE, WORK);
  const sand = P.sandPoint(WIN, P.SPRITE, WORK);
  assert.ok(rail.lift > 28, "the meeting rail as a tide rock, not the floor");
  assert.ok(Math.abs(rail.lift - mark.lift) < 4, "the same meeting rail Speck marks; the pose is eight plates");
  assert.ok(Math.abs(rail.lift - barred.lift) < 4, "the same meeting rail Bar bars; the pose is eight plates");
  assert.ok(Math.abs(rail.x - mark.x) > 8, "not Speck's mark");
  assert.ok(Math.abs(rail.x - barred.x) > 8, "not Bar's barred");
  assert.ok(Math.abs(rail.x - lean.x) > 8, "not Felt's lean");
  assert.ok(Math.abs(rail.x - count.x) > 8, "not Snap's count");
  assert.ok(Math.abs(rail.x - stile.x) > 8 || Math.abs(rail.lift - stile.lift) > 8, "not Cement's sash-stile cirri");
  assert.ok(Math.abs(rail.x - rim.x) > 8 || Math.abs(rail.lift - rim.lift) > 8, "not Cone's glass-rim clamp");
  assert.ok(Math.abs(rail.x - rasp.x) > 8 || Math.abs(rail.lift - rasp.lift) > 8, "not Whorl's glass-rim rasp");
  assert.ok(Math.abs(rail.x - roll.x) > 8 || Math.abs(rail.lift - roll.lift) > 8, "not Armor's window-stool roll");
  assert.ok(Math.abs(rail.x - sand.x) > 8 || Math.abs(rail.lift - sand.lift) > 8, "not Pale's window-stool sand");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "chiton", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real meeting rail, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 195, height: 80 }], 80, "chiton", WORK, P.SPRITE);
  assert.equal(short, null, "a real meeting rail, not a short sash");
  const thin = P.pickTarget([{ id: "thin", x: 200, y: 80, width: 195, height: 192 }], 80, "chiton", WORK, P.SPRITE);
  assert.equal(thin, null, "Mail needs a real meeting rail, not a shallower mouth");
  const rock = P.pickTarget([{ id: "rail", x: 200, y: 80, width: 195, height: 193 }], 80, "chiton", WORK, P.SPRITE);
  assert.ok(rock, "a real meeting rail as a tide rock");
  const speckOk = P.pickTarget([{ id: "rail", x: 200, y: 80, width: 190, height: 188 }], 80, "brook_trout", WORK, P.SPRITE);
  assert.ok(speckOk, "Speck still takes the meeting rail");
  const barOk = P.pickTarget([{ id: "rail", x: 200, y: 80, width: 192, height: 190 }], 80, "perch", WORK, P.SPRITE);
  assert.ok(barOk, "Bar still takes the meeting rail");
  const cementOk = P.pickTarget([{ id: "stile", x: 200, y: 80, width: 191, height: 216 }], 80, "barnacle", WORK, P.SPRITE);
  assert.ok(cementOk, "Cement still takes the stile");
  const coneOk = P.pickTarget([{ id: "rim", x: 200, y: 80, width: 184, height: 178 }], 80, "limpet", WORK, P.SPRITE);
  assert.ok(coneOk, "Cone still takes the glass rim");
  const armorOk = P.pickTarget([{ id: "stool", x: 200, y: 80, width: 186, height: 176 }], 80, "pillbug", WORK, P.SPRITE);
  assert.ok(armorOk, "Armor still takes the stool");
  const walkOn = P.eightOnPath(0.25, { x: 40, lift: 0 }, { x: rail.x, lift: rail.lift });
  const cirriOn = P.cirriOnPath(0.25, { x: 40, lift: 0 }, { x: rail.x, lift: rail.lift });
  const clampOn = P.clampOnPath(0.25, { x: 40, lift: 0 }, { x: rail.x, lift: rail.lift });
  const markOn = P.markOnPath(0.25, { x: 40, lift: 0 }, { x: rail.x, lift: rail.lift });
  const barredOn = P.barredOnPath(0.25, { x: 40, lift: 0 }, { x: rail.x, lift: rail.lift });
  const rollOn = P.rollOnPath(0.25, { x: 40, lift: 0 }, { x: rail.x, lift: rail.lift });
  assert.ok(walkOn.lift > 0, "she walks onto the rail as a tide rock");
  assert.ok(walkOn.rot !== cirriOn.rot, "a walk onto the rail, not Cement cirri");
  assert.ok(walkOn.rot !== clampOn.rot, "a walk onto the rail, not Cone clamp");
  assert.ok(walkOn.rot !== markOn.rot, "a walk onto the rail, not Speck mark");
  assert.ok(walkOn.rot !== barredOn.rot, "a walk onto the rail, not Bar barred");
  assert.ok(walkOn.rot !== rollOn.rot, "a walk onto the rail, not Armor roll");
  const pulse = P.eightPath(0.5);
  const cirriPose = P.cirriPath(0.5);
  const clampPose = P.clampPath(0.5);
  const raspPose = P.raspPath(0.5);
  const rollPose = P.rollPath(0.5);
  const markPose = P.markPath(0.5);
  const barredPose = P.barredPath(0.5);
  assert.ok(pulse.lift < 0, "she plates the eight; the eight are the tell");
  assert.ok(pulse.rot < -8, "the eight plates");
  assert.ok(pulse.rot !== cirriPose.rot, "an eight, not a cirri");
  assert.ok(pulse.rot !== clampPose.rot, "an eight, not a clamp");
  assert.ok(pulse.rot !== raspPose.rot, "an eight, not a rasp");
  assert.ok(pulse.rot !== rollPose.rot, "an eight, not a roll");
  assert.ok(pulse.rot !== markPose.rot, "an eight, not a mark");
  assert.ok(pulse.rot !== barredPose.rot, "an eight, not a barred");
  const hold = P.eightHoldPath(0.5);
  assert.ok(Math.abs(hold.rot - -5.1) < 0.2, "she holds after the plate, eight still the tell");
  assert.ok(Math.abs(hold.x - 0.8) < 0.2, "she stays on the tide rock");
  assert.ok(hold.lift < 0, "a sit-hold on the rail after the eight plates");
  const off0 = P.eightOffPath(0, { x: rail.x, lift: rail.lift, rot: -5.1 }, { x: rail.x + 50, lift: 0 });
  const offMid = P.eightOffPath(0.5, { x: rail.x, lift: rail.lift, rot: -5.1 }, { x: rail.x + 50, lift: 0 });
  const off1 = P.eightOffPath(1, { x: rail.x, lift: rail.lift, rot: -5.1 }, { x: rail.x + 50, lift: 0 });
  assert.ok(Math.abs(off0.x - rail.x) < 2);
  assert.ok(Math.abs(offMid.x - rail.x) > 8, "a walk leave off the tide rock");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "cirri");
    assert.notEqual(play.phase, "clamp");
    assert.notEqual(play.phase, "rasp");
    assert.notEqual(play.phase, "roll");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "eight") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "eight-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "eight-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift - 4.2)) < 3, "she holds the plates after the eight on the rail");
    }
    if (play.phase === "eight-off") {
      assert.equal(play.anim, "walk");
    }
  }
  assert.ok(seen.has("eight-on"));
  assert.ok(seen.has("eight"));
  assert.ok(seen.has("eight-hold"));
  assert.ok(seen.has("eight-off"));
  assert.ok(!seen.has("cirri"), "Mail never uses Cement cirri");
  assert.ok(!seen.has("clamp"), "Mail never uses Cone clamp");
  assert.ok(!seen.has("rasp"), "Mail never uses Whorl rasp");
  assert.ok(!seen.has("roll"), "Mail never uses Armor roll");
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});
test("a moved window refits Mail's tide-rock eight; sleep, card, and hide abort; Mail never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "chiton", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "eight"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "eight");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "eight");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "eight-off");
  assert.equal(play.abort, true);
});
'''

open(ROOT / "_mail_cjs_tests.txt", "w", encoding="utf-8", newline="\n").write(CJS_TESTS)
print("wrote cjs tests fragment")
