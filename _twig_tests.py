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
    'const target = P.pickTarget([WIN], 80, "stick", WORK, P.SPRITE);',
    'const target = P.pickTarget([WIN], 80, "carpenter_ant", WORK, P.SPRITE);',
    "cjs generic sill pin",
)
cjs = replace_all(cjs, 'assert.equal(P.playFor("stick"), "sill");', 'assert.equal(P.playFor("carpenter_ant"), "sill");', "cjs stick sill pins", 5)

CJS_TESTS = r'''
test("Twig freezes a sash muntin as a pencil stem: walk onto the muntin, sit the freeze, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("stick"), "freeze");
  assert.equal(P.FREEZE, "freeze");
  assert.notEqual(P.playFor("stick"), "twig");
  assert.notEqual(P.playFor("stick"), "stick");
  assert.notEqual(P.playFor("stick"), "still");
  assert.notEqual(P.playFor("stick"), "fold");
  assert.notEqual(P.playFor("stick"), "hang");
  assert.notEqual(P.playFor("stick"), "creep");
  assert.notEqual(P.playFor("stick"), "glue");
  assert.notEqual(P.playFor("stick"), "sill");
  assert.equal(P.playFor("potto"), "creep");
  assert.equal(P.CREEP, "creep");
  assert.equal(P.playFor("sloth"), "reach");
  assert.equal(P.playFor("harvestman"), "stilt");
  assert.equal(P.STILT, "stilt");
  assert.equal(P.playFor("seahorse"), "hitch");
  assert.equal(P.HITCH, "hitch");
  assert.equal(P.playFor("oak"), "seed");
  assert.equal(P.SEED, "seed");
  assert.equal(P.playFor("opossum"), "still");
  assert.equal(P.playFor("stickleback"), "glue");
  assert.equal(P.playFor("mantis"), "sill");
  assert.equal(P.playFor("darner"), "hawk");
  assert.equal(P.playFor("carpenter_ant"), "sill");
  assert.equal(P.DUR.hawkOn, 3.22, "Dart hawk durations stay");
  assert.equal(P.DUR.creepOn, 1.73, "Still creep durations stay");
  assert.equal(P.DUR.reachOn, 1.61, "Hang reach durations stay");
  const target = P.pickTarget([WIN], 80, "stick", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "freeze");
  assert.equal(target.side, "pencilstem");
  assert.equal(target.leave, "froze");
  assert.notEqual(target.kind, "twig");
  assert.notEqual(target.kind, "stick");
  assert.notEqual(target.kind, "still");
  assert.notEqual(target.kind, "fold");
  assert.notEqual(target.kind, "hang");
  assert.notEqual(target.kind, "creep");
  assert.notEqual(target.kind, "glue");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift > 8, "she freezes a sash muntin as a pencil stem, not the floor");
  assert.ok(P.DUR.freezeHold > P.DUR.freeze * 0.7, "the hold is furniture until she walks; the freeze is the tell");
  assert.ok(P.DUR.freezeOn > 1.0, "a walk onto the muntin, not the freeze");
  assert.ok(P.DUR.freezeOn !== P.DUR.creepOn);
  assert.ok(P.DUR.freezeOn !== P.DUR.reachOn);
  assert.ok(P.DUR.freezeOn !== P.DUR.stiltOn);
  assert.ok(P.DUR.freezeOn !== P.DUR.hitchOn);
  assert.ok(P.DUR.freezeOn !== P.DUR.hawkOn);
  assert.ok(P.DUR.freezeOn !== P.DUR.sillHop);
  assert.ok(P.DUR.freeze !== P.DUR.creep);
  assert.ok(P.DUR.freeze !== P.DUR.reach);
  assert.ok(P.DUR.freeze !== P.DUR.stilt);
  assert.ok(P.DUR.freezeHold !== P.DUR.creepHold);
  assert.ok(P.DUR.freezeHold !== P.DUR.reachHold);
  assert.ok(P.DUR.freezeOff !== P.DUR.creepOff);
  assert.ok(P.DUR.freezeOff !== P.DUR.sillDown);
  const muntin = P.freezePoint(WIN, P.SPRITE, WORK);
  const bead = P.creepPoint(WIN, P.SPRITE, WORK);
  const soffit = P.reachPoint(WIN, P.SPRITE, WORK);
  const stemBead = P.stiltPoint(WIN, P.SPRITE, WORK);
  const hitchBead = P.hitchPoint(WIN, P.SPRITE, WORK);
  const stool = P.seedPoint(WIN, P.SPRITE, WORK);
  const air = P.hawkPoint(WIN, P.SPRITE, WORK);
  assert.ok(muntin.lift > 8, "the sash muntin as a pencil stem, not the floor");
  assert.ok(Math.abs(muntin.x - bead.x) > 20 || Math.abs(muntin.lift - bead.lift) > 8, "not Still's sash parting-bead creep");
  assert.ok(Math.abs(muntin.x - soffit.x) > 20 || Math.abs(muntin.lift - soffit.lift) > 8, "not Hang's transom soffit reach");
  assert.ok(Math.abs(muntin.x - stemBead.x) > 20 || Math.abs(muntin.lift - stemBead.lift) > 8, "not Stem's parting-bead stilt");
  assert.ok(Math.abs(muntin.x - hitchBead.x) > 20 || Math.abs(muntin.lift - hitchBead.lift) > 8, "not Anchor's parting-bead hitch");
  assert.ok(Math.abs(muntin.lift - stool.lift) > 8, "not Mast's stool seed");
  assert.ok(Math.abs(muntin.x - air.x) > 20 || Math.abs(muntin.lift - air.lift) > 8, "not Dart's lamp-side air hawk");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "stick", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real sash muntin, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 180, height: 160 }], 80, "stick", WORK, P.SPRITE);
  assert.equal(short, null, "a real sash muntin, not a short sash");
  const thin = P.pickTarget([{ id: "thin", x: 200, y: 80, width: 196, height: 186 }], 80, "stick", WORK, P.SPRITE);
  assert.equal(thin, null, "a real sash muntin, not a thinner pane");
  const okStem = P.pickTarget([{ id: "stem", x: 200, y: 80, width: 196, height: 188 }], 80, "stick", WORK, P.SPRITE);
  assert.ok(okStem, "a real sash muntin as a pencil stem");
  const stillOk = P.pickTarget([{ id: "bead", x: 200, y: 80, width: 180, height: 208 }], 80, "potto", WORK, P.SPRITE);
  assert.ok(stillOk, "Still still takes the sash parting bead");
  const twigNo = P.pickTarget([{ id: "bead", x: 200, y: 80, width: 180, height: 208 }], 80, "stick", WORK, P.SPRITE);
  assert.equal(twigNo, null, "Twig needs a taller muntin pane, not Still's bead gate");
  const walkOn = P.freezeOnPath(0.25, { x: 40, lift: 0 }, { x: muntin.x, lift: muntin.lift });
  const creepOn = P.creepOnPath(0.25, { x: 40, lift: 0 }, { x: muntin.x, lift: muntin.lift });
  const reachOn = P.reachOnPath(0.25, { x: 40, lift: 0 }, { x: muntin.x, lift: muntin.lift });
  const stiltOn = P.stiltOnPath(0.25, { x: 40, lift: 0 }, { x: muntin.x, lift: muntin.lift });
  const hawkOn = P.hawkOnPath(0.25, { x: 40, lift: 0 }, { x: muntin.x, lift: muntin.lift });
  assert.ok(walkOn.lift > 0, "she walks onto the muntin as a pencil stem");
  assert.ok(walkOn.rot !== creepOn.rot, "a walk onto the muntin, not Still creep");
  assert.ok(walkOn.rot !== reachOn.rot, "a walk onto the muntin, not Hang reach");
  assert.ok(walkOn.rot !== stiltOn.rot, "a walk onto the muntin, not Stem stilt");
  assert.ok(walkOn.rot !== hawkOn.rot, "a walk onto the muntin, not Dart hawk");
  const freezePose = P.freezePath(0.5);
  const creepPose = P.creepPath(0.5);
  const reachPose = P.reachPath(0.5);
  const stiltPose = P.stiltPath(0.5);
  const hawkPose = P.hawkPath(0.5);
  assert.ok(Math.abs(freezePose.rot) > 10, "she sits the freeze; a stick that agreed to be an insect");
  assert.ok(freezePose.rot !== creepPose.rot, "freeze, not a creep");
  assert.ok(freezePose.rot !== reachPose.rot, "freeze, not a reach");
  assert.ok(freezePose.rot !== stiltPose.rot, "freeze, not a stilt");
  assert.ok(freezePose.rot !== hawkPose.rot, "freeze, not a hawk");
  const hold = P.freezeHoldPath(0.5);
  assert.ok(Math.abs(hold.rot - -24) < 0.2, "she holds after the freeze, freeze still the tell");
  assert.ok(Math.abs(hold.x - 0.4) < 0.2, "she stays on the sash muntin");
  assert.ok(hold.lift > 1, "furniture until she walks after the freeze");
  const off0 = P.freezeOffPath(0, { x: muntin.x, lift: muntin.lift, rot: -24 }, { x: muntin.x + 50, lift: 0 });
  const offMid = P.freezeOffPath(0.5, { x: muntin.x, lift: muntin.lift, rot: -24 }, { x: muntin.x + 50, lift: 0 });
  const off1 = P.freezeOffPath(1, { x: muntin.x, lift: muntin.lift, rot: -24 }, { x: muntin.x + 50, lift: 0 });
  assert.ok(Math.abs(off0.x - muntin.x) < 2);
  assert.ok(Math.abs(offMid.x - muntin.x) > 8, "a walk leave off the sash muntin");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "creep");
    assert.notEqual(play.phase, "reach");
    assert.notEqual(play.phase, "stilt");
    assert.notEqual(play.phase, "hitch");
    assert.notEqual(play.phase, "hawk");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "freeze") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "freeze-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "freeze-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift + 2.8)) < 3, "she holds the freeze after the sit on the muntin");
    }
    if (play.phase === "freeze-off") {
      assert.equal(play.anim, "walk");
    }
  }
  assert.ok(seen.has("freeze-on"));
  assert.ok(seen.has("freeze"));
  assert.ok(seen.has("freeze-hold"));
  assert.ok(seen.has("freeze-off"));
  assert.ok(!seen.has("creep"), "Twig never uses Still creep");
  assert.ok(!seen.has("reach"), "Twig never uses Hang reach");
  assert.ok(!seen.has("stilt"), "Twig never uses Stem stilt");
  assert.ok(!seen.has("hitch"), "Twig never uses Anchor hitch");
  assert.ok(!seen.has("hawk"), "Twig never uses Dart hawk");
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});
test("a moved window refits Twig's pencil-stem freeze; sleep, card, and hide abort; Twig never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "stick", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "freeze"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "freeze");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "freeze");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "freeze-off");
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
    "Dart leftover hawks a lamp-side air as prey air; fifth leftover of the remaining hive den done; Spark leftover still glows a lower sash light as ink dusk; fourth leftover of the remaining hive den done; Ghost leftover still weeks a lamp-side glass as lamp dusk; third leftover of the remaining hive den done; shore ten is closed; next leftover is Twig;",
    "Twig leftover freezes a sash muntin as a pencil stem; sixth leftover of the remaining hive den done; Dart leftover still hawks a lamp-side air as prey air; fifth leftover of the remaining hive den done; Spark leftover still glows a lower sash light as ink dusk; fourth leftover of the remaining hive den done; Ghost leftover still weeks a lamp-side glass as lamp dusk; third leftover of the remaining hive den done; shore ten is closed; next leftover is Column;",
    "house title",
)
house = must_replace(
    house,
    '''  assert.equal(WP.playFor("stick"), "sill");
});''',
    '''  assert.equal(WP.playFor("stick"), "freeze");
  assert.equal(WP.FREEZE, "freeze");
  assert.notEqual(WP.playFor("stick"), "twig");
  assert.notEqual(WP.playFor("stick"), "stick");
  assert.notEqual(WP.playFor("stick"), "still");
  assert.notEqual(WP.playFor("stick"), "fold");
  assert.notEqual(WP.playFor("stick"), "hang");
  assert.notEqual(WP.playFor("stick"), "creep");
  assert.notEqual(WP.playFor("stick"), "glue");
  assert.notEqual(WP.playFor("stick"), "sill");
  assert.equal(WP.playFor("potto"), "creep");
  assert.equal(WP.CREEP, "creep");
  assert.equal(WP.playFor("sloth"), "reach");
  assert.equal(WP.playFor("harvestman"), "stilt");
  assert.equal(WP.STILT, "stilt");
  assert.equal(WP.playFor("seahorse"), "hitch");
  assert.equal(WP.HITCH, "hitch");
  assert.equal(WP.playFor("oak"), "seed");
  assert.equal(WP.playFor("opossum"), "still");
  assert.equal(WP.playFor("stickleback"), "glue");
  assert.equal(WP.playFor("mantis"), "sill");
  assert.equal(WP.playFor("darner"), "hawk");
  assert.equal(WP.playFor("carpenter_ant"), "sill");
});''',
    "house stick freeze",
)
save("desktop/renderer/leftover-house.test.cjs", house, hnl)
print("house ok")

mjs, mnl = load("web/scripts/window-play.test.mjs")
mjs = replace_all(mjs, 'assert.equal(P.playFor("stick"), "sill");', 'assert.equal(P.playFor("carpenter_ant"), "sill");', "mjs stick sill pins", 5)

MJS_TEST = r'''
test("the demo window plate walks Twig freeze the same way", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /playFor/);
  assert.match(readFileSync(join(root, "src/lib/pets/insects.ts"), "utf8"), /key: "stick"[\s\S]{0,80}slug: "twig"/);
  assert.equal(P.playFor("stick"), "freeze");
  const target = P.pickTarget([WIN], 80, "stick", WORK, 176);
  assert.ok(target);
  assert.equal(target.kind, "freeze");
  assert.equal(target.side, "pencilstem");
  assert.equal(target.leave, "froze");
  assert.equal(Overlay.playFor("stick"), "freeze");
  assert.equal(P.FREEZE, "freeze");
  assert.equal(Overlay.FREEZE, "freeze");
  assert.notEqual(P.playFor("stick"), "twig");
  assert.notEqual(P.playFor("stick"), "stick");
  assert.notEqual(P.playFor("stick"), "still");
  assert.notEqual(P.playFor("stick"), "fold");
  assert.notEqual(P.playFor("stick"), "hang");
  assert.notEqual(P.playFor("stick"), "creep");
  assert.notEqual(P.playFor("stick"), "glue");
  assert.equal(P.playFor("potto"), "creep");
  assert.equal(Overlay.playFor("potto"), "creep");
  assert.equal(P.playFor("sloth"), "reach");
  assert.equal(Overlay.playFor("sloth"), "reach");
  assert.equal(P.playFor("harvestman"), "stilt");
  assert.equal(P.playFor("seahorse"), "hitch");
  assert.equal(P.playFor("oak"), "seed");
  assert.equal(P.playFor("darner"), "hawk");
  assert.equal(P.playFor("carpenter_ant"), "sill");
  assert.equal(P.DUR.freezeOn, Overlay.DUR.freezeOn);
  assert.equal(P.DUR.freeze, Overlay.DUR.freeze);
  assert.equal(P.DUR.freezeHold, Overlay.DUR.freezeHold);
  assert.equal(P.DUR.freezeOff, Overlay.DUR.freezeOff);
  assert.ok(P.DUR.freezeOn !== Overlay.DUR.creepOn);
  assert.ok(P.DUR.freezeOn !== Overlay.DUR.reachOn);
  assert.ok(P.DUR.freezeOn !== Overlay.DUR.stiltOn);
  assert.ok(P.DUR.freezeOn !== Overlay.DUR.hawkOn);
  const muntin = P.freezePoint(WIN, 176, WORK);
  const deskMuntin = Overlay.freezePoint(WIN, Overlay.SPRITE, WORK);
  const bead = P.creepPoint(WIN, 176, WORK);
  const soffit = P.reachPoint(WIN, 176, WORK);
  const air = P.hawkPoint(WIN, 176, WORK);
  assert.ok(Math.abs(muntin.x - deskMuntin.x) < 1);
  assert.ok(Math.abs(muntin.lift - deskMuntin.lift) < 1);
  assert.ok(muntin.lift > 8, "pencil stem, the sash muntin");
  assert.ok(Math.abs(muntin.x - bead.x) > 20 || Math.abs(muntin.lift - bead.lift) > 8, "not Still creep");
  assert.ok(Math.abs(muntin.x - soffit.x) > 20 || Math.abs(muntin.lift - soffit.lift) > 8, "not Hang reach");
  assert.ok(Math.abs(muntin.x - air.x) > 20 || Math.abs(muntin.lift - air.lift) > 8, "not Dart hawk");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 160, height: 70 }], 80, "stick", WORK, 176);
  assert.equal(tiny, null, "a real sash muntin");
  const okStem = P.pickTarget([{ id: "stem", x: 200, y: 80, width: 196, height: 188 }], 80, "stick", WORK, 176);
  assert.ok(okStem, "a real sash muntin as a pencil stem");
  const walkOn = P.freezeOnPath(0.25, { x: 40, lift: 0 }, { x: muntin.x, lift: muntin.lift });
  const deskWalk = Overlay.freezeOnPath(0.25, { x: 40, lift: 0 }, { x: muntin.x, lift: muntin.lift });
  assert.equal(walkOn.x, deskWalk.x);
  assert.equal(walkOn.lift, deskWalk.lift);
  const pulse = P.freezePath(0.5);
  const deskPulse = Overlay.freezePath(0.5);
  assert.equal(pulse.x, deskPulse.x);
  assert.ok(Math.abs(pulse.rot) > 10, "sit the freeze, the play");
  assert.ok(pulse.rot !== P.creepPath(0.5).rot, "freeze, not a creep");
  assert.ok(pulse.rot !== P.reachPath(0.5).rot, "freeze, not a reach");
  assert.ok(pulse.rot !== P.stiltPath(0.5).rot, "freeze, not a stilt");
  assert.ok(pulse.rot !== P.hawkPath(0.5).rot, "freeze, not a hawk");
  const hold = P.freezeHoldPath(0.5);
  const deskHold = Overlay.freezeHoldPath(0.5);
  assert.equal(hold.x, deskHold.x);
  assert.equal(hold.lift, deskHold.lift);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, 176, { cmd: "idle" });
    if (play.phase === "freeze") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "freeze-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "freeze-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift + 2.8)) < 3, "she holds the freeze after the sit on the muntin");
    }
  }
  assert.ok(seen.has("freeze-on"));
  assert.ok(seen.has("freeze"));
  assert.ok(seen.has("freeze-hold"));
  assert.ok(seen.has("freeze-off"));
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
});
'''

mjs = mjs.rstrip() + "\n" + MJS_TEST
save("web/scripts/window-play.test.mjs", mjs, mnl)
print("mjs ok")
