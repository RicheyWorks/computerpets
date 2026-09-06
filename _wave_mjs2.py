from pathlib import Path
p = Path(r"C:\Users\730ri\projects\ComputerPets\web\scripts\window-play.test.mjs")
text = p.read_text(encoding="utf-8")
WAVE = r'''
test("the demo window plate walks Wave signal the same way", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /playFor/);
  assert.match(readFileSync(join(root, "src/lib/pets/shore.ts"), "utf8"), /key: "fiddler_crab"[\s\S]{0,80}slug: "wave"/);
  assert.equal(P.playFor("fiddler_crab"), "signal");
  const target = P.pickTarget([WIN], 80, "fiddler_crab", WORK, 176);
  assert.ok(target);
  assert.equal(target.kind, "signal");
  assert.equal(target.side, "marshdish");
  assert.equal(target.leave, "signals");
  assert.equal(Overlay.playFor("fiddler_crab"), "signal");
  assert.equal(P.SIGNAL, "signal");
  assert.equal(Overlay.SIGNAL, "signal");
  assert.equal(P.playFor("amphipod"), "side");
  assert.equal(Overlay.playFor("amphipod"), "side");
  assert.equal(P.playFor("nematode"), "thrash");
  assert.equal(P.playFor("ferret"), "thread");
  assert.equal(P.playFor("pillbug"), "roll");
  assert.equal(P.playFor("crayfish"), "claw");
  assert.equal(P.playFor("hermit_crab"), "knob");
  assert.equal(P.playFor("solifuge"), "run");
  assert.equal(P.playFor("ghost_crab"), "sill");
  assert.notEqual(P.playFor("fiddler_crab"), "wave");
  assert.notEqual(P.playFor("fiddler_crab"), "side");
  assert.notEqual(P.playFor("fiddler_crab"), "scud");
  assert.notEqual(P.playFor("fiddler_crab"), "claw");
  assert.notEqual(P.playFor("fiddler_crab"), "sill");
  assert.equal(P.DUR.signalOn, Overlay.DUR.signalOn);
  assert.equal(P.DUR.signal, Overlay.DUR.signal);
  assert.equal(P.DUR.signalHold, Overlay.DUR.signalHold);
  assert.equal(P.DUR.signalOff, Overlay.DUR.signalOff);
  assert.ok(P.DUR.signalOn !== Overlay.DUR.sideOn);
  assert.ok(P.DUR.signalOn !== Overlay.DUR.showOn);
  assert.ok(P.DUR.signalOn !== Overlay.DUR.clawOn);
  const dish = P.signalPoint(WIN, 176, WORK);
  const deskDish = Overlay.signalPoint(WIN, Overlay.SPRITE, WORK);
  const brackish = P.showPoint(WIN, 176, WORK);
  const bowl = P.rinsePoint(WIN, 176, WORK);
  const current = P.paddlePoint(WIN, 176, WORK);
  const pool = P.sidePoint(WIN, 176, WORK);
  assert.ok(Math.abs(dish.x - deskDish.x) < 1);
  assert.ok(Math.abs(dish.lift - deskDish.lift) < 1);
  assert.ok(Math.abs(dish.lift - brackish.lift) < 2, "same pan family as Jaw, different pose");
  assert.ok(Math.abs(dish.x - brackish.x) > 8, "not Jaw show");
  assert.ok(dish.lift > 28, "marsh dish, the pan");
  assert.ok(Math.abs(dish.x - bowl.x) > 8, "not Wash rinse");
  assert.ok(Math.abs(dish.x - current.x) > 8, "not Spoon paddle");
  assert.ok(Math.abs(dish.x - pool.x) > 8 || Math.abs(dish.lift - pool.lift) > 8, "not Scud side");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "fiddler_crab", WORK, 176);
  assert.equal(tiny, null, "a real sill pan");
  const okPan = P.pickTarget([{ id: "pan", x: 200, y: 80, width: 190, height: 184 }], 80, "fiddler_crab", WORK, 176);
  assert.ok(okPan, "a real sill pan as a marsh dish");
  const walkOn = P.signalOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  const deskWalk = Overlay.signalOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  assert.equal(walkOn.x, deskWalk.x);
  assert.equal(walkOn.lift, deskWalk.lift);
  const pulse = P.signalPath(0.5);
  const deskPulse = Overlay.signalPath(0.5);
  assert.equal(pulse.x, deskPulse.x);
  assert.ok(pulse.rot > 20, "a signal, the tell");
  assert.ok(pulse.rot !== P.showPath(0.5).rot, "a signal, not a show");
  assert.ok(pulse.rot !== P.sidePath(0.5).rot, "a signal, not a side");
  assert.ok(pulse.rot !== P.clawPath(0.5).rot, "a signal, not a claw");
  const hold = P.signalHoldPath(0.5);
  const deskHold = Overlay.signalHoldPath(0.5);
  assert.equal(hold.x, deskHold.x);
  assert.equal(hold.lift, deskHold.lift);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, 176, { cmd: "idle" });
    if (play.phase === "signal") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "signal-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "signal-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift + 4.6)) < 3, "she holds the sit after the claw signal on the pan");
    }
  }
  assert.ok(seen.has("signal-on"));
  assert.ok(seen.has("signal"));
  assert.ok(seen.has("signal-hold"));
  assert.ok(seen.has("signal-off"));
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
});
'''
p.write_text(text.rstrip() + "\n" + WAVE, encoding="utf-8", newline="\n")
print("mjs wave test ok")
