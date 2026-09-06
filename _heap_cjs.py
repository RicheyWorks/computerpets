from pathlib import Path

ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, found {n}\nMARKER={old[:240]!r}")
    return text.replace(old, new, 1)

CJS_HEAP = r'''
test("Heap castings a window foot as wet sand: walk onto the foot, sit the castings, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("lugworm"), "castings");
  assert.equal(P.CASTINGS, "castings");
  assert.notEqual(P.playFor("lugworm"), "heap");
  assert.notEqual(P.playFor("lugworm"), "band");
  assert.notEqual(P.playFor("lugworm"), "drink");
  assert.notEqual(P.playFor("lugworm"), "knobs");
  assert.notEqual(P.playFor("lugworm"), "shut");
  assert.notEqual(P.playFor("lugworm"), "stamp");
  assert.notEqual(P.playFor("lugworm"), "spring");
  assert.notEqual(P.playFor("lugworm"), "sand");
  assert.notEqual(P.playFor("lugworm"), "flat");
  assert.notEqual(P.playFor("lugworm"), "sill");
  assert.equal(P.playFor("earthworm"), "band");
  assert.equal(P.BAND, "band");
  assert.equal(P.playFor("leech"), "drink");
  assert.equal(P.DRINK, "drink");
  assert.equal(P.playFor("knobbed_whelk"), "knobs");
  assert.equal(P.KNOBS, "knobs");
  assert.equal(P.playFor("sea_urchin"), "spines");
  assert.equal(P.SPINES, "spines");
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
  assert.equal(P.playFor("box_turtle"), "shut");
  assert.equal(P.playFor("skunk"), "stamp");
  assert.equal(P.playFor("honeybee"), "sill");
  assert.equal(P.DUR.knobsOn, 3.01, "Knurl knobs durations stay");
  assert.equal(P.DUR.spinesOn, 2.94, "Thorn spines durations stay");
  assert.equal(P.DUR.flatOn, 2.87, "Token flat durations stay");
  assert.equal(P.DUR.rockOn, 2.80, "Spire rock durations stay");
  assert.equal(P.DUR.eightOn, 2.73, "Mail eight durations stay");
  assert.equal(P.DUR.cirriOn, 2.66, "Cement cirri durations stay");
  assert.equal(P.DUR.clampOn, 2.59, "Cone clamp durations stay");
  assert.equal(P.DUR.sandOn, 2.52, "Pale sand durations stay");
  assert.equal(P.DUR.signalOn, 2.45, "Wave signal durations stay");
  const target = P.pickTarget([WIN], 80, "lugworm", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "castings");
  assert.equal(target.side, "wetsand");
  assert.equal(target.leave, "heaped");
  assert.notEqual(target.kind, "heap");
  assert.notEqual(target.kind, "band");
  assert.notEqual(target.kind, "drink");
  assert.notEqual(target.kind, "knobs");
  assert.notEqual(target.kind, "shut");
  assert.notEqual(target.kind, "stamp");
  assert.notEqual(target.kind, "sand");
  assert.notEqual(target.kind, "flat");
  assert.notEqual(target.kind, "sill");
  assert.ok(Math.abs(target.holdLift) < 1, "she castings a window foot as wet sand, the floor");
  assert.ok(P.DUR.castingsHold > P.DUR.castings, "the hold is the sit after; the castings are the tell");
  assert.ok(P.DUR.castingsOn > 1.0, "a walk onto the foot, not the castings");
  assert.ok(P.DUR.castingsOn !== P.DUR.knobsOn);
  assert.ok(P.DUR.castingsOn !== P.DUR.bandOn);
  assert.ok(P.DUR.castingsOn !== P.DUR.drinkOn);
  assert.ok(P.DUR.castingsOn !== P.DUR.shutOn);
  assert.ok(P.DUR.castingsOn !== P.DUR.stampOn);
  assert.ok(P.DUR.castingsOn !== P.DUR.sandOn);
  assert.ok(P.DUR.castingsOn !== P.DUR.flatOn);
  assert.ok(P.DUR.castingsOn !== P.DUR.sillHop);
  assert.ok(P.DUR.castings !== P.DUR.knobs);
  assert.ok(P.DUR.castings !== P.DUR.band);
  assert.ok(P.DUR.castings !== P.DUR.sand);
  assert.ok(P.DUR.castingsHold !== P.DUR.knobsHold);
  assert.ok(P.DUR.castingsHold !== P.DUR.shutHold);
  assert.ok(P.DUR.castingsOff !== P.DUR.knobsOff);
  assert.ok(P.DUR.castingsOff !== P.DUR.sillDown);
  const sandFoot = P.castingsPoint(WIN, P.SPRITE, WORK);
  const leaf = P.shutPoint(WIN, P.SPRITE, WORK);
  const duff = P.stampPoint(WIN, P.SPRITE, WORK);
  const cup = P.springPoint(WIN, P.SPRITE, WORK);
  const tray = P.bandPoint(WIN, P.SPRITE, WORK);
  const blotter = P.drinkPoint(WIN, P.SPRITE, WORK);
  const dish = P.knobsPoint(WIN, P.SPRITE, WORK);
  const dry = P.sandPoint(WIN, P.SPRITE, WORK);
  const plate = P.flatPoint(WIN, P.SPRITE, WORK);
  assert.ok(Math.abs(sandFoot.lift) < 1, "the window foot as wet sand, the floor");
  assert.ok(Math.abs(sandFoot.x - leaf.x) > 8, "same window-foot family as Lid; the pose is castings, not a shut");
  assert.ok(Math.abs(sandFoot.lift - leaf.lift) < 1, "same floor foot as Lid's leaf dish");
  assert.ok(Math.abs(sandFoot.x - duff.x) > 8, "same window-foot family as Stripe; the pose is castings, not a stamp");
  assert.ok(Math.abs(sandFoot.lift - duff.lift) < 1, "same floor foot as Stripe's duff dish");
  assert.ok(Math.abs(sandFoot.x - cup.x) > 8 || Math.abs(sandFoot.lift - cup.lift) > 8, "not Hop window-foot spring");
  assert.ok(Math.abs(sandFoot.x - tray.x) > 8 || Math.abs(sandFoot.lift - tray.lift) > 8, "not Cast window-stool band");
  assert.ok(Math.abs(sandFoot.x - blotter.x) > 8 || Math.abs(sandFoot.lift - blotter.lift) > 8, "not Latch sash-drip drink");
  assert.ok(Math.abs(sandFoot.x - dish.x) > 8 || Math.abs(sandFoot.lift - dish.lift) > 8, "not Knurl window-stool knobs");
  assert.ok(Math.abs(sandFoot.x - dry.x) > 8 || Math.abs(sandFoot.lift - dry.lift) > 8, "not Pale window-stool sand");
  assert.ok(Math.abs(sandFoot.x - plate.x) > 8 || Math.abs(sandFoot.lift - plate.lift) > 8, "not Token sill-pan flat");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "lugworm", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real window foot, not a thin strip");
  const okFoot = P.pickTarget([{ id: "foot", x: 200, y: 80, width: 160, height: 70 }], 80, "lugworm", WORK, P.SPRITE);
  assert.ok(okFoot, "a real window foot as wet sand");
  const lidOk = P.pickTarget([{ id: "foot", x: 200, y: 80, width: 160, height: 70 }], 80, "box_turtle", WORK, P.SPRITE);
  assert.ok(lidOk, "Lid still takes the foot");
  const stripeOk = P.pickTarget([{ id: "foot", x: 200, y: 80, width: 160, height: 70 }], 80, "skunk", WORK, P.SPRITE);
  assert.ok(stripeOk, "Stripe still takes the foot");
  const knurlOk = P.pickTarget([{ id: "stool", x: 200, y: 80, width: 193, height: 160 }], 80, "knobbed_whelk", WORK, P.SPRITE);
  assert.ok(knurlOk, "Knurl still takes the stool");
  const castOk = P.pickTarget([{ id: "tray", x: 200, y: 80, width: 194, height: 162 }], 80, "earthworm", WORK, P.SPRITE);
  assert.ok(castOk, "Cast still takes the stool");
  const paleOk = P.pickTarget([{ id: "sand", x: 200, y: 80, width: 192, height: 158 }], 80, "ghost_crab", WORK, P.SPRITE);
  assert.ok(paleOk, "Pale still takes the stool");
  const walkOn = P.castingsOnPath(0.25, { x: 40, lift: 0 }, { x: sandFoot.x, lift: sandFoot.lift });
  const shutOn = P.shutOnPath(0.25, { x: 40, lift: 0 }, { x: sandFoot.x, lift: sandFoot.lift });
  const stampOn = P.stampOnPath(0.25, { x: 40, lift: 0 }, { x: sandFoot.x, lift: sandFoot.lift });
  const knobsOn = P.knobsOnPath(0.25, { x: 40, lift: 0 }, { x: sandFoot.x, lift: sandFoot.lift });
  const bandOn = P.bandOnPath(0.25, { x: 40, lift: 0 }, { x: sandFoot.x, lift: sandFoot.lift });
  assert.ok(Math.abs(walkOn.lift) < 1, "she walks onto the foot as wet sand");
  assert.ok(walkOn.rot !== shutOn.rot, "a walk onto the foot, not Lid shut");
  assert.ok(walkOn.rot !== stampOn.rot, "a walk onto the foot, not Stripe stamp");
  assert.ok(walkOn.rot !== knobsOn.rot, "a walk onto the foot, not Knurl knobs");
  assert.ok(walkOn.rot !== bandOn.rot, "a walk onto the foot, not Cast band");
  const heapPose = P.castingsPath(0.5);
  const shutPose = P.shutPath(0.5);
  const stampPose = P.stampPath(0.5);
  const knobsPose = P.knobsPath(0.5);
  const bandPose = P.bandPath(0.5);
  const drinkPose = P.drinkPath(0.5);
  const sandPose = P.sandPath(0.5);
  assert.ok(heapPose.lift < 0, "she sits the castings; the castings are the tell");
  assert.ok(heapPose.rot > 3, "castings on the wet sand");
  assert.ok(heapPose.rot !== shutPose.rot, "castings, not a shut");
  assert.ok(heapPose.rot !== stampPose.rot, "castings, not a stamp");
  assert.ok(heapPose.rot !== knobsPose.rot, "castings, not knobs");
  assert.ok(heapPose.rot !== bandPose.rot, "castings, not a band");
  assert.ok(heapPose.rot !== drinkPose.rot, "castings, not a drink");
  assert.ok(heapPose.rot !== sandPose.rot, "castings, not a sand");
  const hold = P.castingsHoldPath(0.5);
  assert.ok(Math.abs(hold.rot - 5.4) < 0.2, "she holds after the castings, castings still the tell");
  assert.ok(Math.abs(hold.x - 0.38) < 0.2, "she stays on the wet sand");
  assert.ok(hold.lift < 0, "a sit-hold on the foot after the castings");
  const off0 = P.castingsOffPath(0, { x: sandFoot.x, lift: sandFoot.lift, rot: 5.4 }, { x: sandFoot.x + 50, lift: 0 });
  const offMid = P.castingsOffPath(0.5, { x: sandFoot.x, lift: sandFoot.lift, rot: 5.4 }, { x: sandFoot.x + 50, lift: 0 });
  const off1 = P.castingsOffPath(1, { x: sandFoot.x, lift: sandFoot.lift, rot: 5.4 }, { x: sandFoot.x + 50, lift: 0 });
  assert.ok(Math.abs(off0.x - sandFoot.x) < 2);
  assert.ok(Math.abs(offMid.x - sandFoot.x) > 8, "a walk leave off the wet sand");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "band");
    assert.notEqual(play.phase, "drink");
    assert.notEqual(play.phase, "knobs");
    assert.notEqual(play.phase, "shut");
    assert.notEqual(play.phase, "stamp");
    assert.notEqual(play.phase, "sand");
    assert.notEqual(play.phase, "flat");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "castings") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "castings-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "castings-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift - 2.8)) < 3, "she holds the castings after the sit on the foot");
    }
    if (play.phase === "castings-off") {
      assert.equal(play.anim, "walk");
    }
  }
  assert.ok(seen.has("castings-on"));
  assert.ok(seen.has("castings"));
  assert.ok(seen.has("castings-hold"));
  assert.ok(seen.has("castings-off"));
  assert.ok(!seen.has("band"), "Heap never uses Cast band");
  assert.ok(!seen.has("drink"), "Heap never uses Latch drink");
  assert.ok(!seen.has("knobs"), "Heap never uses Knurl knobs");
  assert.ok(!seen.has("shut"), "Heap never uses Lid shut");
  assert.ok(!seen.has("stamp"), "Heap never uses Stripe stamp");
  assert.ok(!seen.has("sand"), "Heap never uses Pale sand");
  assert.ok(!seen.has("flat"), "Heap never uses Token flat");
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});
test("a moved window refits Heap's wet-sand castings; sleep, card, and hide abort; Heap never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "lugworm", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "castings"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "castings");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "castings");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "castings-off");
  assert.equal(play.abort, true);
});
'''

p = ROOT / "desktop" / "renderer" / "window-play.test.cjs"
t = p.read_text(encoding="utf-8")
t = once(t,
    'test("other guests do not clone Rui\'s cling — they walk a sill and hop down", () => {\n  const target = P.pickTarget([WIN], 80, "lugworm", WORK, P.SPRITE);',
    'test("other guests do not clone Rui\'s cling — they walk a sill and hop down", () => {\n  const target = P.pickTarget([WIN], 80, "honeybee", WORK, P.SPRITE);',
    "cjs generic sill")
t = once(t,
    '  assert.equal(P.playFor("lugworm"), "sill");\n  assert.equal(P.DUR.flatOn, 2.87, "Token flat durations stay");',
    '  assert.equal(P.playFor("honeybee"), "sill");\n  assert.equal(P.DUR.flatOn, 2.87, "Token flat durations stay");',
    "cjs thorn pin")
t = once(t,
    '  assert.equal(P.playFor("lugworm"), "sill");\n  assert.equal(P.DUR.spinesOn, 2.94, "Thorn spines durations stay");',
    '  assert.equal(P.playFor("honeybee"), "sill");\n  assert.equal(P.DUR.spinesOn, 2.94, "Thorn spines durations stay");',
    "cjs knurl pin")
if not t.endswith("\n"):
    t += "\n"
t = t + CJS_HEAP
p.write_text(t, encoding="utf-8", newline="\n")
print("patched window-play.test.cjs", "lugworm", t.count("lugworm"), "honeybee sill", t.count('playFor("honeybee"), "sill"'))
