from pathlib import Path

ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

def sub_once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit("%s: expected 1 occurrence, found %d" % (label, n))
    return text.replace(old, new, 1)

CJS_TEST = r'''
test("Knurl knobs a window stool as a wrack dish: walk onto the stool, sit the knobs, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("knobbed_whelk"), "knobs");
  assert.equal(P.KNOBS, "knobs");
  assert.notEqual(P.playFor("knobbed_whelk"), "knurl");
  assert.notEqual(P.playFor("knobbed_whelk"), "knob");
  assert.notEqual(P.playFor("knobbed_whelk"), "hunt");
  assert.notEqual(P.playFor("knobbed_whelk"), "rasp");
  assert.notEqual(P.playFor("knobbed_whelk"), "rock");
  assert.notEqual(P.playFor("knobbed_whelk"), "spines");
  assert.notEqual(P.playFor("knobbed_whelk"), "sand");
  assert.notEqual(P.playFor("knobbed_whelk"), "roll");
  assert.notEqual(P.playFor("knobbed_whelk"), "band");
  assert.notEqual(P.playFor("knobbed_whelk"), "bury");
  assert.notEqual(P.playFor("knobbed_whelk"), "sill");
  assert.equal(P.playFor("hermit_crab"), "knob");
  assert.equal(P.KNOB, "knob");
  assert.equal(P.playFor("house_centipede"), "hunt");
  assert.equal(P.HUNT, "hunt");
  assert.equal(P.playFor("pond_snail"), "rasp");
  assert.equal(P.RASP, "rasp");
  assert.equal(P.playFor("periwinkle"), "rock");
  assert.equal(P.ROCK, "rock");
  assert.equal(P.playFor("sea_urchin"), "spines");
  assert.equal(P.SPINES, "spines");
  assert.equal(P.playFor("sand_dollar"), "flat");
  assert.equal(P.FLAT, "flat");
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
  assert.equal(P.playFor("pillbug"), "roll");
  assert.equal(P.ROLL, "roll");
  assert.equal(P.playFor("earthworm"), "band");
  assert.equal(P.BAND, "band");
  assert.equal(P.playFor("squirrel"), "bury");
  assert.equal(P.BURY, "bury");
  assert.equal(P.playFor("lugworm"), "sill");
  assert.equal(P.DUR.spinesOn, 2.94, "Thorn spines durations stay");
  assert.equal(P.DUR.flatOn, 2.87, "Token flat durations stay");
  assert.equal(P.DUR.rockOn, 2.80, "Spire rock durations stay");
  assert.equal(P.DUR.eightOn, 2.73, "Mail eight durations stay");
  assert.equal(P.DUR.cirriOn, 2.66, "Cement cirri durations stay");
  assert.equal(P.DUR.clampOn, 2.59, "Cone clamp durations stay");
  assert.equal(P.DUR.sandOn, 2.52, "Pale sand durations stay");
  assert.equal(P.DUR.signalOn, 2.45, "Wave signal durations stay");
  const target = P.pickTarget([WIN], 80, "knobbed_whelk", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "knobs");
  assert.equal(target.side, "wrackdish");
  assert.equal(target.leave, "knobbed");
  assert.notEqual(target.kind, "knurl");
  assert.notEqual(target.kind, "knob");
  assert.notEqual(target.kind, "hunt");
  assert.notEqual(target.kind, "rasp");
  assert.notEqual(target.kind, "rock");
  assert.notEqual(target.kind, "spines");
  assert.notEqual(target.kind, "sand");
  assert.notEqual(target.kind, "roll");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift > 16, "she knobs a window stool as a wrack dish, not the floor");
  assert.ok(P.DUR.knobsHold > P.DUR.knobs, "the hold is the sit after; the knobs are the tell");
  assert.ok(P.DUR.knobsOn > 1.0, "a walk onto the stool, not the knobs");
  assert.ok(P.DUR.knobsOn !== P.DUR.spinesOn);
  assert.ok(P.DUR.knobsOn !== P.DUR.sandOn);
  assert.ok(P.DUR.knobsOn !== P.DUR.rollOn);
  assert.ok(P.DUR.knobsOn !== P.DUR.bandOn);
  assert.ok(P.DUR.knobsOn !== P.DUR.buryOn);
  assert.ok(P.DUR.knobsOn !== P.DUR.knobOn);
  assert.ok(P.DUR.knobsOn !== P.DUR.huntOn);
  assert.ok(P.DUR.knobsOn !== P.DUR.raspOn);
  assert.ok(P.DUR.knobsOn !== P.DUR.rockOn);
  assert.ok(P.DUR.knobsOn !== P.DUR.sillHop);
  assert.ok(P.DUR.knobs !== P.DUR.spines);
  assert.ok(P.DUR.knobs !== P.DUR.sand);
  assert.ok(P.DUR.knobs !== P.DUR.roll);
  assert.ok(P.DUR.knobsHold !== P.DUR.spinesHold);
  assert.ok(P.DUR.knobsHold !== P.DUR.sandHold);
  assert.ok(P.DUR.knobsOff !== P.DUR.spinesOff);
  assert.ok(P.DUR.knobsOff !== P.DUR.sillDown);
  const dish = P.knobsPoint(WIN, P.SPRITE, WORK);
  const sand = P.sandPoint(WIN, P.SPRITE, WORK);
  const roll = P.rollPoint(WIN, P.SPRITE, WORK);
  const band = P.bandPoint(WIN, P.SPRITE, WORK);
  const bury = P.buryPoint(WIN, P.SPRITE, WORK);
  const pool = P.spinesPoint(WIN, P.SPRITE, WORK);
  const knob = P.knobPoint(WIN, P.SPRITE, WORK);
  const hunt = P.huntPoint(WIN, P.SPRITE, WORK);
  const rock = P.rockPoint(WIN, P.SPRITE, WORK);
  const rasp = P.raspPoint(WIN, P.SPRITE, WORK);
  assert.ok(dish.lift > 16, "the window stool as a wrack dish, not the floor");
  assert.ok(Math.abs(dish.lift - sand.lift) < 2, "the same window stool Pale sands; the pose is knobs");
  assert.ok(Math.abs(dish.x - sand.x) > 8, "not Pale's window-stool sand");
  assert.ok(Math.abs(dish.x - roll.x) > 8 || Math.abs(dish.lift - roll.lift) > 8, "not Armor's window-stool roll");
  assert.ok(Math.abs(dish.x - band.x) > 8 || Math.abs(dish.lift - band.lift) > 8, "not Cast's window-stool band");
  assert.ok(Math.abs(dish.x - bury.x) > 8 || Math.abs(dish.lift - bury.lift) > 8, "not Cache's window-stool bury");
  assert.ok(Math.abs(dish.x - pool.x) > 8 || Math.abs(dish.lift - pool.lift) > 8, "not Thorn's window-well spines");
  assert.ok(Math.abs(dish.x - knob.x) > 8 || Math.abs(dish.lift - knob.lift) > 8, "not Tenant's sash-lift knob");
  assert.ok(Math.abs(dish.x - hunt.x) > 8 || Math.abs(dish.lift - hunt.lift) > 8, "not Haste's sash-jamb hunt");
  assert.ok(Math.abs(dish.x - rock.x) > 8 || Math.abs(dish.lift - rock.lift) > 8, "not Spire's sash-jamb rock");
  assert.ok(Math.abs(dish.x - rasp.x) > 8 || Math.abs(dish.lift - rasp.lift) > 8, "not Whorl's glass-rim rasp");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "knobbed_whelk", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real window stool, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 200, height: 80 }], 80, "knobbed_whelk", WORK, P.SPRITE);
  assert.equal(short, null, "a real window stool, not a short sash");
  const thin = P.pickTarget([{ id: "thin", x: 200, y: 80, width: 193, height: 158 }], 80, "knobbed_whelk", WORK, P.SPRITE);
  assert.equal(thin, null, "Knurl needs a real window stool, not a shallower dish");
  const stool = P.pickTarget([{ id: "stool", x: 200, y: 80, width: 193, height: 160 }], 80, "knobbed_whelk", WORK, P.SPRITE);
  assert.ok(stool, "a real window stool as a wrack dish");
  const paleOk = P.pickTarget([{ id: "sand", x: 200, y: 80, width: 192, height: 158 }], 80, "ghost_crab", WORK, P.SPRITE);
  assert.ok(paleOk, "Pale still takes the stool");
  const armorOk = P.pickTarget([{ id: "roll", x: 200, y: 80, width: 194, height: 162 }], 80, "pillbug", WORK, P.SPRITE);
  assert.ok(armorOk, "Armor still takes the stool");
  const castOk = P.pickTarget([{ id: "band", x: 200, y: 80, width: 194, height: 162 }], 80, "earthworm", WORK, P.SPRITE);
  assert.ok(castOk, "Cast still takes the stool");
  const cacheOk = P.pickTarget([{ id: "bury", x: 200, y: 80, width: 194, height: 162 }], 80, "squirrel", WORK, P.SPRITE);
  assert.ok(cacheOk, "Cache still takes the stool");
  const thornOk = P.pickTarget([{ id: "well", x: 200, y: 80, width: 178, height: 162 }], 80, "sea_urchin", WORK, P.SPRITE);
  assert.ok(thornOk, "Thorn still takes the well");
  const walkOn = P.knobsOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  const sandOn = P.sandOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  const rollOn = P.rollOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  const spinesOn = P.spinesOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  const rockOn = P.rockOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  assert.ok(walkOn.lift > 0, "she walks onto the stool as a wrack dish");
  assert.ok(walkOn.rot !== sandOn.rot, "a walk onto the stool, not Pale sand");
  assert.ok(walkOn.rot !== rollOn.rot, "a walk onto the stool, not Armor roll");
  assert.ok(walkOn.rot !== spinesOn.rot, "a walk onto the stool, not Thorn spines");
  assert.ok(walkOn.rot !== rockOn.rot, "a walk onto the stool, not Spire rock");
  const pulse = P.knobsPath(0.5);
  const sandPose = P.sandPath(0.5);
  const rollPose = P.rollPath(0.5);
  const bandPose = P.bandPath(0.5);
  const spinesPose = P.spinesPath(0.5);
  const rockPose = P.rockPath(0.5);
  const raspPose = P.raspPath(0.5);
  assert.ok(pulse.lift < 0, "she sits the knobs; the knobs are the tell");
  assert.ok(pulse.rot > 8, "knobs on the wrack dish");
  assert.ok(pulse.rot !== sandPose.rot, "knobs, not a sand");
  assert.ok(pulse.rot !== rollPose.rot, "knobs, not a roll");
  assert.ok(pulse.rot !== bandPose.rot, "knobs, not a band");
  assert.ok(pulse.rot !== spinesPose.rot, "knobs, not spines");
  assert.ok(pulse.rot !== rockPose.rot, "knobs, not a rock");
  assert.ok(pulse.rot !== raspPose.rot, "knobs, not a rasp");
  const hold = P.knobsHoldPath(0.5);
  assert.ok(Math.abs(hold.rot - 11.2) < 0.2, "she holds after the knobs, knobs still the tell");
  assert.ok(Math.abs(hold.x - 0.6) < 0.2, "she stays on the wrack dish");
  assert.ok(hold.lift < 0, "a sit-hold on the stool after the knobs");
  const off0 = P.knobsOffPath(0, { x: dish.x, lift: dish.lift, rot: 11.2 }, { x: dish.x + 50, lift: 0 });
  const offMid = P.knobsOffPath(0.5, { x: dish.x, lift: dish.lift, rot: 11.2 }, { x: dish.x + 50, lift: 0 });
  const off1 = P.knobsOffPath(1, { x: dish.x, lift: dish.lift, rot: 11.2 }, { x: dish.x + 50, lift: 0 });
  assert.ok(Math.abs(off0.x - dish.x) < 2);
  assert.ok(Math.abs(offMid.x - dish.x) > 8, "a walk leave off the wrack dish");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "sand");
    assert.notEqual(play.phase, "roll");
    assert.notEqual(play.phase, "band");
    assert.notEqual(play.phase, "bury");
    assert.notEqual(play.phase, "spines");
    assert.notEqual(play.phase, "knob");
    assert.notEqual(play.phase, "hunt");
    assert.notEqual(play.phase, "rasp");
    assert.notEqual(play.phase, "rock");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "knobs") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "knobs-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "knobs-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift - 3.5)) < 3, "she holds the knobs after the sit on the stool");
    }
    if (play.phase === "knobs-off") {
      assert.equal(play.anim, "walk");
    }
  }
  assert.ok(seen.has("knobs-on"));
  assert.ok(seen.has("knobs"));
  assert.ok(seen.has("knobs-hold"));
  assert.ok(seen.has("knobs-off"));
  assert.ok(!seen.has("sand"), "Knurl never uses Pale sand");
  assert.ok(!seen.has("roll"), "Knurl never uses Armor roll");
  assert.ok(!seen.has("band"), "Knurl never uses Cast band");
  assert.ok(!seen.has("bury"), "Knurl never uses Cache bury");
  assert.ok(!seen.has("spines"), "Knurl never uses Thorn spines");
  assert.ok(!seen.has("knob"), "Knurl never uses Tenant knob");
  assert.ok(!seen.has("hunt"), "Knurl never uses Haste hunt");
  assert.ok(!seen.has("rasp"), "Knurl never uses Whorl rasp");
  assert.ok(!seen.has("rock"), "Knurl never uses Spire rock");
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});
test("a moved window refits Knurl's wrack-dish knobs; sleep, card, and hide abort; Knurl never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "knobbed_whelk", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "knobs"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "knobs");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "knobs");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "knobs-off");
  assert.equal(play.abort, true);
});
'''

p = ROOT / "desktop" / "renderer" / "window-play.test.cjs"
t = p.read_text(encoding="utf-8")
t = sub_once(
    t,
    '  const target = P.pickTarget([WIN], 80, "knobbed_whelk", WORK, P.SPRITE);',
    '  const target = P.pickTarget([WIN], 80, "lugworm", WORK, P.SPRITE);',
    "cjs generic sill guest",
)
t = sub_once(
    t,
    '  assert.equal(P.playFor("knobbed_whelk"), "sill");',
    '  assert.equal(P.playFor("lugworm"), "sill");',
    "cjs thorn next-sill pin",
)
if not t.endswith("\n"):
    t += "\n"
t = t + CJS_TEST
p.write_text(t, encoding="utf-8", newline="\n")
print("cjs tests ok")
