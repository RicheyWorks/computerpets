from pathlib import Path
ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

def load(p):
    return (ROOT / p).read_text(encoding="utf-8")

def save(p, text):
    (ROOT / p).write_text(text, encoding="utf-8", newline="\n")

def must_replace(text, old, new, n=1):
    count = text.count(old)
    if count != n:
        raise SystemExit(f"expected {n} of marker, found {count}: {old[:160]!r}")
    return text.replace(old, new)

# generic sill walker uses Pale now
p = "desktop/renderer/window-play.test.cjs"
cjs = load(p)
cjs = must_replace(cjs,
    '  const target = P.pickTarget([WIN], 80, "fiddler_crab", WORK, P.SPRITE);',
    '  const target = P.pickTarget([WIN], 80, "ghost_crab", WORK, P.SPRITE);')
cjs = must_replace(cjs,
    '  assert.equal(P.playFor("fiddler_crab"), "sill");',
    '  assert.equal(P.playFor("fiddler_crab"), "signal");')

WAVE = r'''
test("Wave signals a sill pan as a marsh dish: walk onto the pan, signal the big claw, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("fiddler_crab"), "signal");
  assert.equal(P.SIGNAL, "signal");
  assert.equal(P.playFor("amphipod"), "side");
  assert.equal(P.SIDE, "side");
  assert.equal(P.playFor("nematode"), "thrash");
  assert.equal(P.THRASH, "thrash");
  assert.equal(P.playFor("ferret"), "thread");
  assert.equal(P.THREAD, "thread");
  assert.equal(P.playFor("pillbug"), "roll");
  assert.equal(P.playFor("crayfish"), "claw");
  assert.equal(P.playFor("hermit_crab"), "knob");
  assert.equal(P.playFor("solifuge"), "run");
  assert.equal(P.playFor("crocodile"), "show");
  assert.equal(P.playFor("raccoon"), "rinse");
  assert.equal(P.playFor("paddlefish"), "paddle");
  assert.equal(P.playFor("ghost_crab"), "sill");
  assert.notEqual(P.playFor("fiddler_crab"), "wave");
  assert.notEqual(P.playFor("fiddler_crab"), "side");
  assert.notEqual(P.playFor("fiddler_crab"), "scud");
  assert.notEqual(P.playFor("fiddler_crab"), "claw");
  assert.notEqual(P.playFor("fiddler_crab"), "show");
  assert.notEqual(P.playFor("fiddler_crab"), "rinse");
  assert.notEqual(P.playFor("fiddler_crab"), "paddle");
  assert.notEqual(P.playFor("fiddler_crab"), "sill");
  assert.equal(P.DUR.sideOn, 2.38, "Scud side durations stay");
  assert.equal(P.DUR.thrashOn, 2.31, "Thread thrash durations stay");
  assert.equal(P.DUR.rollOn, 1.91, "Armor roll durations stay");
  assert.equal(P.DUR.clawOn, 1.73, "Pinch claw durations stay");
  assert.equal(P.DUR.knobOn, 0.82, "Tenant knob durations stay");
  assert.equal(P.DUR.runOn, 0.44, "Gale run durations stay");
  const target = P.pickTarget([WIN], 80, "fiddler_crab", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "signal");
  assert.equal(target.side, "marshdish");
  assert.equal(target.leave, "signals");
  assert.notEqual(target.kind, "wave");
  assert.notEqual(target.kind, "side");
  assert.notEqual(target.kind, "scud");
  assert.notEqual(target.kind, "claw");
  assert.notEqual(target.kind, "show");
  assert.notEqual(target.kind, "rinse");
  assert.notEqual(target.kind, "paddle");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift > 28, "she signals a sill pan as a marsh dish, not the floor");
  assert.ok(P.DUR.signalHold > P.DUR.signal, "the hold is the sit after; the signal is the tell");
  assert.ok(P.DUR.signalOn > 1.0, "a walk onto the pan, not the signal");
  assert.ok(P.DUR.signalOn !== P.DUR.sideOn);
  assert.ok(P.DUR.signalOn !== P.DUR.showOn);
  assert.ok(P.DUR.signalOn !== P.DUR.rinseOn);
  assert.ok(P.DUR.signalOn !== P.DUR.paddleOn);
  assert.ok(P.DUR.signalOn !== P.DUR.clawOn);
  assert.ok(P.DUR.signalOn !== P.DUR.knobOn);
  assert.ok(P.DUR.signalOn !== P.DUR.runOn);
  assert.ok(P.DUR.signalOn !== P.DUR.sillHop);
  assert.ok(P.DUR.signal !== P.DUR.side);
  assert.ok(P.DUR.signal !== P.DUR.claw);
  assert.ok(P.DUR.signal !== P.DUR.show);
  assert.ok(P.DUR.signalHold !== P.DUR.sideHold);
  assert.ok(P.DUR.signalHold !== P.DUR.clawHold);
  assert.ok(P.DUR.signalOff !== P.DUR.sideOff);
  assert.ok(P.DUR.signalOff !== P.DUR.sillDown);
  const dish = P.signalPoint(WIN, P.SPRITE, WORK);
  const brackish = P.showPoint(WIN, P.SPRITE, WORK);
  const bowl = P.rinsePoint(WIN, P.SPRITE, WORK);
  const current = P.paddlePoint(WIN, P.SPRITE, WORK);
  const pool = P.sidePoint(WIN, P.SPRITE, WORK);
  const pebble = P.clawPoint(WIN, P.SPRITE, WORK);
  const shell = P.knobPoint(WIN, P.SPRITE, WORK);
  assert.ok(dish.lift > 28, "the sill pan as a marsh dish, not the floor");
  assert.ok(Math.abs(dish.lift - brackish.lift) < 2, "the same sill pan Jaw shows; the pose is a signal");
  assert.ok(Math.abs(dish.x - brackish.x) > 8, "not Jaw's sill-pan show");
  assert.ok(Math.abs(dish.lift - bowl.lift) < 2, "the same sill pan Wash rinses; the pose is a signal");
  assert.ok(Math.abs(dish.x - bowl.x) > 8, "not Wash's sill-pan rinse");
  assert.ok(Math.abs(dish.lift - current.lift) < 2, "the same sill pan Spoon paddles; the pose is a signal");
  assert.ok(Math.abs(dish.x - current.x) > 8, "not Spoon's sill-pan paddle");
  assert.ok(Math.abs(dish.x - pool.x) > 8 || Math.abs(dish.lift - pool.lift) > 8, "not Scud's window-well side");
  assert.ok(Math.abs(dish.x - pebble.x) > 8 || Math.abs(dish.lift - pebble.lift) > 8, "not Pinch's sill-wash claw");
  assert.ok(Math.abs(dish.x - shell.x) > 8 || Math.abs(dish.lift - shell.lift) > 8, "not Tenant's sash-lift knob");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "fiddler_crab", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real sill pan, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 200, height: 80 }], 80, "fiddler_crab", WORK, P.SPRITE);
  assert.equal(short, null, "a real sill pan, not a short sash");
  const thin = P.pickTarget([{ id: "thin", x: 200, y: 80, width: 190, height: 182 }], 80, "fiddler_crab", WORK, P.SPRITE);
  assert.equal(thin, null, "Wave needs Jaw, Wash, and Spoon's real sill pan, not a shallower mouth");
  const pan = P.pickTarget([{ id: "pan", x: 200, y: 80, width: 190, height: 184 }], 80, "fiddler_crab", WORK, P.SPRITE);
  assert.ok(pan, "a real sill pan as a marsh dish");
  const jawOk = P.pickTarget([{ id: "pan", x: 200, y: 80, width: 190, height: 184 }], 80, "crocodile", WORK, P.SPRITE);
  assert.ok(jawOk, "Jaw still takes the pan");
  const washOk = P.pickTarget([{ id: "pan", x: 200, y: 80, width: 190, height: 184 }], 80, "raccoon", WORK, P.SPRITE);
  assert.ok(washOk, "Wash still takes the pan");
  const spoonOk = P.pickTarget([{ id: "pan", x: 200, y: 80, width: 190, height: 184 }], 80, "paddlefish", WORK, P.SPRITE);
  assert.ok(spoonOk, "Spoon still takes the pan");
  const scudOk = P.pickTarget([{ id: "well", x: 200, y: 80, width: 178, height: 162 }], 80, "amphipod", WORK, P.SPRITE);
  assert.ok(scudOk, "Scud still takes the well");
  const walkOn = P.signalOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  const showOn = P.showOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  const rinseOn = P.rinseOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  const paddleOn = P.paddleOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  const sideOn = P.sideOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  const clawOn = P.clawOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  assert.ok(walkOn.lift > 0, "she walks onto the pan as a marsh dish");
  assert.ok(walkOn.rot !== showOn.rot, "a walk onto the pan, not Jaw show");
  assert.ok(walkOn.rot !== rinseOn.rot, "a walk onto the pan, not Wash rinse");
  assert.ok(walkOn.rot !== paddleOn.rot, "a walk onto the pan, not Spoon paddle");
  assert.ok(walkOn.rot !== sideOn.rot, "a walk onto the pan, not Scud side");
  assert.ok(walkOn.rot !== clawOn.rot, "a walk onto the pan, not Pinch claw");
  const pulse = P.signalPath(0.5);
  const tooth = P.showPath(0.5);
  const dunk = P.rinsePath(0.5);
  const sieve = P.paddlePath(0.5);
  const swim = P.sidePath(0.5);
  const rake = P.clawPath(0.5);
  assert.ok(pulse.rot > 20, "she signals the big claw; the signal is the tell");
  assert.ok(pulse.lift > 0, "the claw lifts; a signal, not a pinch of lunch");
  assert.ok(pulse.rot !== tooth.rot, "a signal, not a show");
  assert.ok(pulse.rot !== dunk.rot, "a signal, not a rinse");
  assert.ok(pulse.rot !== sieve.rot, "a signal, not a paddle");
  assert.ok(pulse.rot !== swim.rot, "a signal, not a side");
  assert.ok(pulse.rot !== rake.rot, "a signal, not a claw");
  const hold = P.signalHoldPath(0.5);
  assert.ok(Math.abs(hold.rot - 27.2) < 0.2, "she holds after the signal, claw still the tell");
  assert.ok(Math.abs(hold.x - 0.8) < 0.2, "she stays on the marsh dish");
  assert.ok(hold.lift > 4, "a sit on the pan after the signal");
  const off0 = P.signalOffPath(0, { x: dish.x, lift: dish.lift, rot: 27.2 }, { x: dish.x + 67, lift: 0 });
  const offMid = P.signalOffPath(0.5, { x: dish.x, lift: dish.lift, rot: 27.2 }, { x: dish.x + 67, lift: 0 });
  const off1 = P.signalOffPath(1, { x: dish.x, lift: dish.lift, rot: 27.2 }, { x: dish.x + 67, lift: 0 });
  assert.ok(Math.abs(off0.x - dish.x) < 2);
  assert.ok(Math.abs(offMid.x - dish.x) > 8, "a walk leave off the marsh dish");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "show");
    assert.notEqual(play.phase, "rinse");
    assert.notEqual(play.phase, "paddle");
    assert.notEqual(play.phase, "side");
    assert.notEqual(play.phase, "claw");
    assert.notEqual(play.phase, "sill-walk");
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
    if (play.phase === "signal-off") {
      assert.equal(play.anim, "walk");
    }
  }
  assert.ok(seen.has("signal-on"));
  assert.ok(seen.has("signal"));
  assert.ok(seen.has("signal-hold"));
  assert.ok(seen.has("signal-off"));
  assert.ok(!seen.has("show"), "Wave never uses Jaw show");
  assert.ok(!seen.has("rinse"), "Wave never uses Wash rinse");
  assert.ok(!seen.has("paddle"), "Wave never uses Spoon paddle");
  assert.ok(!seen.has("side"), "Wave never uses Scud side");
  assert.ok(!seen.has("claw"), "Wave never uses Pinch claw");
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});
test("a moved window refits Wave's marsh-dish signal; sleep, card, and hide abort; Wave never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "fiddler_crab", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "signal"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "signal");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "signal");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "signal-off");
  assert.equal(play.abort, true);
});
'''

if not cjs.rstrip().endswith("});"):
    raise SystemExit("cjs end unexpected")
# append after last test
cjs = cjs.rstrip() + "\n" + WAVE
save(p, cjs)
print("cjs tests ok")
