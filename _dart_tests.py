from pathlib import Path

def load(p):
    raw = Path(p).read_bytes()
    nl = "\r\n" if b"\r\n" in raw else "\n"
    text = raw.decode("utf-8")
    if text.startswith("\ufeff"):
        text = text[1:]
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    return text, nl

def save(p, text, nl):
    if nl != "\n":
        text = text.replace("\n", nl)
    Path(p).write_bytes(text.encode("utf-8"))

def must_replace(text, old, new, label):
    if old not in text:
        raise SystemExit("MISSING: " + label)
    n = text.count(old)
    if n != 1:
        raise SystemExit("COUNT %s for %s" % (n, label))
    return text.replace(old, new, 1)

def replace_all(text, old, new, label, expect):
    n = text.count(old)
    if n != expect:
        raise SystemExit("COUNT %s want %s for %s" % (n, expect, label))
    return text.replace(old, new)

cjs, nl = load("desktop/renderer/window-play.test.cjs")
cjs = must_replace(
    cjs,
    'const target = P.pickTarget([WIN], 80, "darner", WORK, P.SPRITE);',
    'const target = P.pickTarget([WIN], 80, "stick", WORK, P.SPRITE);',
    "cjs generic sill pin",
)
cjs = replace_all(cjs, 'assert.equal(P.playFor("darner"), "sill");', 'assert.equal(P.playFor("stick"), "sill");', "cjs darner sill pins", 4)

CJS_TESTS = r'''
test("Dart hawks a lamp-side air as prey air: walk into the air, sit the hawk, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("darner"), "hawk");
  assert.equal(P.HAWK, "hawk");
  assert.notEqual(P.playFor("darner"), "dart");
  assert.notEqual(P.playFor("darner"), "hunt");
  assert.notEqual(P.playFor("darner"), "soar");
  assert.notEqual(P.playFor("darner"), "glow");
  assert.notEqual(P.playFor("darner"), "sip");
  assert.notEqual(P.playFor("darner"), "week");
  assert.notEqual(P.playFor("darner"), "sill");
  assert.equal(P.playFor("red_tail"), "soar");
  assert.equal(P.SOAR, "soar");
  assert.equal(P.playFor("house_centipede"), "hunt");
  assert.equal(P.HUNT, "hunt");
  assert.equal(P.playFor("firefly"), "glow");
  assert.equal(P.GLOW, "glow");
  assert.equal(P.playFor("spark_dragon"), "crackle");
  assert.equal(P.playFor("luna"), "week");
  assert.equal(P.playFor("hummingbird"), "sip");
  assert.equal(P.playFor("stick"), "sill");
  assert.equal(P.DUR.glowOn, 3.48, "Spark glow durations stay");
  assert.equal(P.DUR.soarOn, 1.62, "Hook soar durations stay");
  assert.equal(P.DUR.huntOn, 2.86, "Haste hunt durations stay");
  const target = P.pickTarget([WIN], 80, "darner", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "hawk");
  assert.equal(target.side, "preyair");
  assert.equal(target.leave, "hawked");
  assert.notEqual(target.kind, "dart");
  assert.notEqual(target.kind, "hunt");
  assert.notEqual(target.kind, "soar");
  assert.notEqual(target.kind, "glow");
  assert.notEqual(target.kind, "sip");
  assert.notEqual(target.kind, "week");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift > 8, "he hawks a lamp-side air as prey air, not the floor");
  assert.ok(P.DUR.hawkHold > P.DUR.hawk, "the hold is the sit after; the hawk is the tell");
  assert.ok(P.DUR.hawkOn > 1.0, "a walk into the air, not the hawk");
  assert.ok(P.DUR.hawkOn !== P.DUR.glowOn);
  assert.ok(P.DUR.hawkOn !== P.DUR.soarOn);
  assert.ok(P.DUR.hawkOn !== P.DUR.huntOn);
  assert.ok(P.DUR.hawkOn !== P.DUR.sipOn);
  assert.ok(P.DUR.hawkOn !== P.DUR.weekOn);
  assert.ok(P.DUR.hawkOn !== P.DUR.sillHop);
  assert.ok(P.DUR.hawk !== P.DUR.glow);
  assert.ok(P.DUR.hawk !== P.DUR.soar);
  assert.ok(P.DUR.hawk !== P.DUR.hunt);
  assert.ok(P.DUR.hawkHold !== P.DUR.glowHold);
  assert.ok(P.DUR.hawkHold !== P.DUR.soarHold);
  assert.ok(P.DUR.hawkOff !== P.DUR.glowOff);
  assert.ok(P.DUR.hawkOff !== P.DUR.soarOff);
  assert.ok(P.DUR.hawkOff !== P.DUR.sillDown);
  const air = P.hawkPoint(WIN, P.SPRITE, WORK);
  const light = P.glowPoint(WIN, P.SPRITE, WORK);
  const stile = P.soarPoint(WIN, P.SPRITE, WORK);
  const crack = P.huntPoint(WIN, P.SPRITE, WORK);
  const glass = P.weekPoint(WIN, P.SPRITE, WORK);
  const bloom = P.sipPoint(WIN, P.SPRITE, WORK);
  const sun = P.warmPoint(WIN, P.SPRITE, WORK);
  assert.ok(air.lift > 8, "the lamp-side air as prey air, not the floor");
  assert.ok(Math.abs(air.lift - light.lift) > 8, "lamp-side air, not Spark's lower sash glow");
  assert.ok(Math.abs(air.x - stile.x) > 20 || Math.abs(air.lift - stile.lift) > 8, "not Hook's lamp-post stile soar");
  assert.ok(Math.abs(air.x - crack.x) > 20 || Math.abs(air.lift - crack.lift) > 8, "not Haste's sash-jamb hunt");
  assert.ok(Math.abs(air.x - glass.x) > 12 || Math.abs(air.lift - glass.lift) > 8, "not Ghost's lamp-side glass week");
  assert.ok(Math.abs(air.lift - bloom.lift) > 8, "not Sip's window-box bloom");
  assert.ok(Math.abs(air.lift - sun.lift) > 8, "mid air, not Sun's upper sash sit");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "darner", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real lamp-side air, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 180, height: 180 }], 80, "darner", WORK, P.SPRITE);
  assert.equal(short, null, "a real lamp-side air, not a short sash");
  const thin = P.pickTarget([{ id: "thin", x: 200, y: 80, width: 200, height: 208 }], 80, "darner", WORK, P.SPRITE);
  assert.equal(thin, null, "a real lamp-side air, not a thinner pane");
  const okAir = P.pickTarget([{ id: "air", x: 200, y: 80, width: 200, height: 210 }], 80, "darner", WORK, P.SPRITE);
  assert.ok(okAir, "a real lamp-side air as prey air");
  const sparkOk = P.pickTarget([{ id: "light", x: 200, y: 80, width: 189, height: 173 }], 80, "firefly", WORK, P.SPRITE);
  assert.ok(sparkOk, "Spark still takes the lower sash light");
  const dartNo = P.pickTarget([{ id: "light", x: 200, y: 80, width: 189, height: 173 }], 80, "darner", WORK, P.SPRITE);
  assert.equal(dartNo, null, "Dart needs taller lamp-side air, not Spark's sash-light gate");
  const walkOn = P.hawkOnPath(0.25, { x: 40, lift: 0 }, { x: air.x, lift: air.lift });
  const glowOn = P.glowOnPath(0.25, { x: 40, lift: 0 }, { x: air.x, lift: air.lift });
  const soarOn = P.soarOnPath(0.25, { x: 40, lift: 0 }, { x: air.x, lift: air.lift });
  const huntOn = P.huntOnPath(0.25, { x: 40, lift: 0 }, { x: air.x, lift: air.lift });
  const sipOn = P.sipOnPath(0.25, { x: 40, lift: 0 }, { x: air.x, lift: air.lift });
  assert.ok(walkOn.lift > 0, "he walks into the air as prey air");
  assert.ok(walkOn.rot !== glowOn.rot, "a walk into the air, not Spark glow");
  assert.ok(walkOn.rot !== soarOn.rot, "a walk into the air, not Hook soar");
  assert.ok(walkOn.rot !== huntOn.rot, "a walk into the air, not Haste hunt");
  assert.ok(walkOn.rot !== sipOn.rot, "a walk into the air, not Sip sip");
  const hawkPose = P.hawkPath(0.5);
  const glowPose = P.glowPath(0.5);
  const soarPose = P.soarPath(0.5);
  const huntPose = P.huntPath(0.5);
  const sipPose = P.sipPath(0.5);
  const weekPose = P.weekPath(0.5);
  assert.ok(hawkPose.lift > 1, "he sits the hawk; a patrol, then a stoop");
  assert.ok(hawkPose.rot !== glowPose.rot, "hawk, not a glow");
  assert.ok(hawkPose.rot !== soarPose.rot, "hawk, not a soar");
  assert.ok(hawkPose.rot !== huntPose.rot, "hawk, not a hunt");
  assert.ok(hawkPose.rot !== sipPose.rot, "hawk, not a sip");
  assert.ok(hawkPose.rot !== weekPose.rot, "hawk, not a week");
  const hold = P.hawkHoldPath(0.5);
  assert.ok(Math.abs(hold.rot - -2.6) < 0.2, "he holds after the hawk, hawk still the tell");
  assert.ok(Math.abs(hold.x - 5.8) < 0.2, "he stays in the lamp-side air");
  assert.ok(hold.lift > 1, "a sit-hold in the air after the hawk");
  const off0 = P.hawkOffPath(0, { x: air.x, lift: air.lift, rot: -2.6 }, { x: air.x + 50, lift: 0 });
  const offMid = P.hawkOffPath(0.5, { x: air.x, lift: air.lift, rot: -2.6 }, { x: air.x + 50, lift: 0 });
  const off1 = P.hawkOffPath(1, { x: air.x, lift: air.lift, rot: -2.6 }, { x: air.x + 50, lift: 0 });
  assert.ok(Math.abs(off0.x - air.x) < 2);
  assert.ok(Math.abs(offMid.x - air.x) > 8, "a walk leave out of the lamp-side air");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "glow");
    assert.notEqual(play.phase, "soar");
    assert.notEqual(play.phase, "hunt");
    assert.notEqual(play.phase, "sip");
    assert.notEqual(play.phase, "week");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "hawk") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "hawk-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "hawk-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift + 8.4)) < 3, "he holds the hawk after the sit in the air");
    }
    if (play.phase === "hawk-off") {
      assert.equal(play.anim, "walk");
    }
  }
  assert.ok(seen.has("hawk-on"));
  assert.ok(seen.has("hawk"));
  assert.ok(seen.has("hawk-hold"));
  assert.ok(seen.has("hawk-off"));
  assert.ok(!seen.has("glow"), "Dart never uses Spark glow");
  assert.ok(!seen.has("soar"), "Dart never uses Hook soar");
  assert.ok(!seen.has("hunt"), "Dart never uses Haste hunt");
  assert.ok(!seen.has("sip"), "Dart never uses Sip sip");
  assert.ok(!seen.has("week"), "Dart never uses Ghost week");
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});
test("a moved window refits Dart's prey-air hawk; sleep, card, and hide abort; Dart never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "darner", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "hawk"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "hawk");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "hawk");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "hawk-off");
  assert.equal(play.abort, true);
});
'''

if not cjs.rstrip().endswith("});"):
    raise SystemExit("cjs tail unexpected")
cjs = cjs.rstrip() + "\n" + CJS_TESTS
save("desktop/renderer/window-play.test.cjs", cjs, nl)
print("cjs ok")

house, hnl = load("desktop/renderer/leftover-house.test.cjs")
house = must_replace(
    house,
    "Spark leftover glows a lower sash light as ink dusk; fourth leftover of the remaining hive den done; Ghost leftover still weeks a lamp-side glass as lamp dusk; third leftover of the remaining hive den done; shore ten is closed; next leftover is Dart;",
    "Dart leftover hawks a lamp-side air as prey air; fifth leftover of the remaining hive den done; Spark leftover still glows a lower sash light as ink dusk; fourth leftover of the remaining hive den done; Ghost leftover still weeks a lamp-side glass as lamp dusk; third leftover of the remaining hive den done; shore ten is closed; next leftover is Twig;",
    "house title",
)
house = must_replace(
    house,
    '''  assert.equal(WP.playFor("darner"), "sill");
});''',
    '''  assert.equal(WP.playFor("darner"), "hawk");
  assert.equal(WP.HAWK, "hawk");
  assert.notEqual(WP.playFor("darner"), "dart");
  assert.notEqual(WP.playFor("darner"), "hunt");
  assert.notEqual(WP.playFor("darner"), "soar");
  assert.notEqual(WP.playFor("darner"), "glow");
  assert.notEqual(WP.playFor("darner"), "sip");
  assert.notEqual(WP.playFor("darner"), "sill");
  assert.equal(WP.playFor("red_tail"), "soar");
  assert.equal(WP.SOAR, "soar");
  assert.equal(WP.playFor("house_centipede"), "hunt");
  assert.equal(WP.HUNT, "hunt");
  assert.equal(WP.playFor("firefly"), "glow");
  assert.equal(WP.GLOW, "glow");
  assert.equal(WP.playFor("spark_dragon"), "crackle");
  assert.equal(WP.playFor("luna"), "week");
  assert.equal(WP.playFor("hummingbird"), "sip");
  assert.equal(WP.playFor("stick"), "sill");
});''',
    "house darner hawk",
)
save("desktop/renderer/leftover-house.test.cjs", house, hnl)
print("house ok")

mjs, mnl = load("web/scripts/window-play.test.mjs")
mjs = replace_all(mjs, 'assert.equal(P.playFor("darner"), "sill");', 'assert.equal(P.playFor("stick"), "sill");', "mjs darner sill pins", 4)

MJS_TEST = r'''
test("the demo window plate walks Dart hawk the same way", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /playFor/);
  assert.match(readFileSync(join(root, "src/lib/pets/insects.ts"), "utf8"), /key: "darner"[\s\S]{0,80}slug: "dart"/);
  assert.equal(P.playFor("darner"), "hawk");
  const target = P.pickTarget([WIN], 80, "darner", WORK, 176);
  assert.ok(target);
  assert.equal(target.kind, "hawk");
  assert.equal(target.side, "preyair");
  assert.equal(target.leave, "hawked");
  assert.equal(Overlay.playFor("darner"), "hawk");
  assert.equal(P.HAWK, "hawk");
  assert.equal(Overlay.HAWK, "hawk");
  assert.notEqual(P.playFor("darner"), "dart");
  assert.notEqual(P.playFor("darner"), "hunt");
  assert.notEqual(P.playFor("darner"), "soar");
  assert.notEqual(P.playFor("darner"), "glow");
  assert.notEqual(P.playFor("darner"), "sip");
  assert.equal(P.playFor("red_tail"), "soar");
  assert.equal(Overlay.playFor("red_tail"), "soar");
  assert.equal(P.playFor("house_centipede"), "hunt");
  assert.equal(Overlay.playFor("house_centipede"), "hunt");
  assert.equal(P.playFor("firefly"), "glow");
  assert.equal(Overlay.playFor("firefly"), "glow");
  assert.equal(P.playFor("spark_dragon"), "crackle");
  assert.equal(P.playFor("luna"), "week");
  assert.equal(P.playFor("hummingbird"), "sip");
  assert.equal(P.playFor("stick"), "sill");
  assert.equal(P.DUR.hawkOn, Overlay.DUR.hawkOn);
  assert.equal(P.DUR.hawk, Overlay.DUR.hawk);
  assert.equal(P.DUR.hawkHold, Overlay.DUR.hawkHold);
  assert.equal(P.DUR.hawkOff, Overlay.DUR.hawkOff);
  assert.ok(P.DUR.hawkOn !== Overlay.DUR.glowOn);
  assert.ok(P.DUR.hawkOn !== Overlay.DUR.soarOn);
  assert.ok(P.DUR.hawkOn !== Overlay.DUR.huntOn);
  assert.ok(P.DUR.hawkOn !== Overlay.DUR.sipOn);
  const air = P.hawkPoint(WIN, 176, WORK);
  const deskAir = Overlay.hawkPoint(WIN, Overlay.SPRITE, WORK);
  const light = P.glowPoint(WIN, 176, WORK);
  const stile = P.soarPoint(WIN, 176, WORK);
  const glass = P.weekPoint(WIN, 176, WORK);
  assert.ok(Math.abs(air.x - deskAir.x) < 1);
  assert.ok(Math.abs(air.lift - deskAir.lift) < 1);
  assert.ok(air.lift > 8, "prey air, the lamp-side air");
  assert.ok(Math.abs(air.lift - light.lift) > 8, "not Spark glow");
  assert.ok(Math.abs(air.x - stile.x) > 20 || Math.abs(air.lift - stile.lift) > 8, "not Hook soar");
  assert.ok(Math.abs(air.x - glass.x) > 12 || Math.abs(air.lift - glass.lift) > 8, "not Ghost week");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 160, height: 70 }], 80, "darner", WORK, 176);
  assert.equal(tiny, null, "a real lamp-side air");
  const okAir = P.pickTarget([{ id: "air", x: 200, y: 80, width: 200, height: 210 }], 80, "darner", WORK, 176);
  assert.ok(okAir, "a real lamp-side air as prey air");
  const walkOn = P.hawkOnPath(0.25, { x: 40, lift: 0 }, { x: air.x, lift: air.lift });
  const deskWalk = Overlay.hawkOnPath(0.25, { x: 40, lift: 0 }, { x: air.x, lift: air.lift });
  assert.equal(walkOn.x, deskWalk.x);
  assert.equal(walkOn.lift, deskWalk.lift);
  const pulse = P.hawkPath(0.5);
  const deskPulse = Overlay.hawkPath(0.5);
  assert.equal(pulse.x, deskPulse.x);
  assert.ok(pulse.lift > 1, "sit the hawk, the play");
  assert.ok(pulse.rot !== P.glowPath(0.5).rot, "hawk, not a glow");
  assert.ok(pulse.rot !== P.soarPath(0.5).rot, "hawk, not a soar");
  assert.ok(pulse.rot !== P.huntPath(0.5).rot, "hawk, not a hunt");
  assert.ok(pulse.rot !== P.sipPath(0.5).rot, "hawk, not a sip");
  assert.ok(pulse.rot !== P.weekPath(0.5).rot, "hawk, not a week");
  const hold = P.hawkHoldPath(0.5);
  const deskHold = Overlay.hawkHoldPath(0.5);
  assert.equal(hold.x, deskHold.x);
  assert.equal(hold.lift, deskHold.lift);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, 176, { cmd: "idle" });
    if (play.phase === "hawk") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "hawk-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "hawk-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift + 8.4)) < 3, "he holds the hawk after the sit in the air");
    }
  }
  assert.ok(seen.has("hawk-on"));
  assert.ok(seen.has("hawk"));
  assert.ok(seen.has("hawk-hold"));
  assert.ok(seen.has("hawk-off"));
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
});
'''

mjs = mjs.rstrip() + "\n" + MJS_TEST
save("web/scripts/window-play.test.mjs", mjs, mnl)
print("mjs ok")
