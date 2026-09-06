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
    'const target = P.pickTarget([WIN], 80, "mantis", WORK, P.SPRITE);',
    'const target = P.pickTarget([WIN], 80, "cicada", WORK, P.SPRITE);',
    "cjs generic sill pin",
)
cjs = replace_all(
    cjs,
    'assert.equal(P.playFor("mantis"), "sill");',
    'assert.equal(P.playFor("cicada"), "sill");',
    "cjs mantis sill pins",
    10,
)

CJS_TESTS = r'''
test("Fold prays a window-box stem as a green hinge: walk onto the stem, sit the pray, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("mantis"), "pray");
  assert.equal(P.PRAY, "pray");
  assert.notEqual(P.playFor("mantis"), "fold");
  assert.notEqual(P.playFor("mantis"), "hunt");
  assert.notEqual(P.playFor("mantis"), "spot");
  assert.notEqual(P.playFor("mantis"), "nest");
  assert.notEqual(P.playFor("mantis"), "freeze");
  assert.notEqual(P.playFor("mantis"), "hawk");
  assert.notEqual(P.playFor("mantis"), "snap");
  assert.notEqual(P.playFor("mantis"), "still");
  assert.notEqual(P.playFor("mantis"), "strike");
  assert.notEqual(P.playFor("mantis"), "trap");
  assert.notEqual(P.playFor("mantis"), "wait");
  assert.notEqual(P.playFor("mantis"), "sill");
  assert.equal(P.playFor("bat"), "fold");
  assert.equal(P.playFor("harvestman"), "stilt");
  assert.equal(P.STILT, "stilt");
  assert.equal(P.playFor("stick"), "freeze");
  assert.equal(P.FREEZE, "freeze");
  assert.equal(P.playFor("potto"), "creep");
  assert.equal(P.CREEP, "creep");
  assert.equal(P.playFor("sloth"), "reach");
  assert.equal(P.playFor("venus_flytrap"), "count");
  assert.equal(P.playFor("house_centipede"), "hunt");
  assert.equal(P.HUNT, "hunt");
  assert.equal(P.playFor("ladybird"), "spot");
  assert.equal(P.SPOT, "spot");
  assert.equal(P.playFor("cicada"), "sill");
  assert.equal(P.DUR.spotOn, 3.12, "Seven spot durations stay");
  assert.equal(P.DUR.freezeOn, P.DUR.freezeOn, "Twig freeze durations stay");
  assert.equal(P.DUR.stiltOn, P.DUR.stiltOn, "Stem stilt durations stay");
  const target = P.pickTarget([WIN], 80, "mantis", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "pray");
  assert.equal(target.side, "greenhinge");
  assert.equal(target.leave, "prayed");
  assert.notEqual(target.kind, "fold");
  assert.notEqual(target.kind, "hunt");
  assert.notEqual(target.kind, "spot");
  assert.notEqual(target.kind, "nest");
  assert.notEqual(target.kind, "freeze");
  assert.notEqual(target.kind, "hawk");
  assert.notEqual(target.kind, "snap");
  assert.notEqual(target.kind, "still");
  assert.notEqual(target.kind, "strike");
  assert.notEqual(target.kind, "trap");
  assert.notEqual(target.kind, "wait");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift > 8, "she prays a window-box stem as a green hinge, not the floor");
  assert.ok(P.DUR.prayHold > P.DUR.pray * 0.9, "the hold is the pray; prayer is a trap");
  assert.ok(P.DUR.prayOn > 1.0, "a walk onto the stem, not the pray");
  assert.ok(P.DUR.prayOn !== P.DUR.spotOn);
  assert.ok(P.DUR.prayOn !== P.DUR.freezeOn);
  assert.ok(P.DUR.prayOn !== P.DUR.stiltOn);
  assert.ok(P.DUR.prayOn !== P.DUR.huntOn);
  assert.ok(P.DUR.prayOn !== P.DUR.creepOn);
  assert.ok(P.DUR.prayOn !== P.DUR.sillHop);
  assert.ok(P.DUR.pray !== P.DUR.spot);
  assert.ok(P.DUR.pray !== P.DUR.freeze);
  assert.ok(P.DUR.pray !== P.DUR.stilt);
  assert.ok(P.DUR.prayHold !== P.DUR.spotHold);
  assert.ok(P.DUR.prayHold !== P.DUR.freezeHold);
  assert.ok(P.DUR.prayOff !== P.DUR.spotOff);
  assert.ok(P.DUR.prayOff !== P.DUR.sillDown);
  const hinge = P.prayPoint(WIN, P.SPRITE, WORK);
  const spot = P.spotPoint(WIN, P.SPRITE, WORK);
  const freeze = P.freezePoint(WIN, P.SPRITE, WORK);
  const stilt = P.stiltPoint(WIN, P.SPRITE, WORK);
  const hunt = P.huntPoint(WIN, P.SPRITE, WORK);
  const creep = P.creepPoint(WIN, P.SPRITE, WORK);
  assert.ok(hinge.lift > 8, "the window-box stem as a green hinge, not the floor");
  assert.ok(Math.abs(hinge.x - spot.x) > 20 || Math.abs(hinge.lift - spot.lift) > 4, "not Seven's window-box leaf dish spot");
  assert.ok(Math.abs(hinge.x - freeze.x) > 20 || Math.abs(hinge.lift - freeze.lift) > 4, "not Twig's sash muntin freeze");
  assert.ok(Math.abs(hinge.x - stilt.x) > 20 || Math.abs(hinge.lift - stilt.lift) > 4, "not Stem's parting-bead stilt");
  assert.ok(Math.abs(hinge.x - hunt.x) > 20 || Math.abs(hinge.lift - hunt.lift) > 4, "not Haste's sash-jamb hunt");
  assert.ok(Math.abs(hinge.x - creep.x) > 20 || Math.abs(hinge.lift - creep.lift) > 4, "not Still's parting-bead creep");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "mantis", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real window-box stem, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 180, height: 170 }], 80, "mantis", WORK, P.SPRITE);
  assert.equal(short, null, "a real window-box stem, not a short sash");
  const thin = P.pickTarget([{ id: "thin", x: 200, y: 80, width: 184, height: 176 }], 80, "mantis", WORK, P.SPRITE);
  assert.equal(thin, null, "a real window-box stem, not a thinner pane");
  const okPray = P.pickTarget([{ id: "pray", x: 200, y: 80, width: 184, height: 178 }], 80, "mantis", WORK, P.SPRITE);
  assert.ok(okPray, "a real window-box stem as a green hinge");
  const sevenOk = P.pickTarget([{ id: "spot", x: 200, y: 80, width: 186, height: 170 }], 80, "ladybird", WORK, P.SPRITE);
  assert.ok(sevenOk, "Seven still takes a leaf dish");
  const foldNo = P.pickTarget([{ id: "spot", x: 200, y: 80, width: 186, height: 170 }], 80, "mantis", WORK, P.SPRITE);
  assert.equal(foldNo, null, "Fold needs a taller green hinge, not Seven's spot gate");
  const walkOn = P.prayOnPath(0.25, { x: 40, lift: 0 }, { x: hinge.x, lift: hinge.lift });
  const spotOn = P.spotOnPath(0.25, { x: 40, lift: 0 }, { x: hinge.x, lift: hinge.lift });
  const freezeOn = P.freezeOnPath(0.25, { x: 40, lift: 0 }, { x: hinge.x, lift: hinge.lift });
  const stiltOn = P.stiltOnPath(0.25, { x: 40, lift: 0 }, { x: hinge.x, lift: hinge.lift });
  const huntOn = P.huntOnPath(0.25, { x: 40, lift: 0 }, { x: hinge.x, lift: hinge.lift });
  assert.ok(walkOn.lift > 0, "she walks onto the stem as a green hinge");
  assert.ok(walkOn.rot !== spotOn.rot, "a walk onto the stem, not Seven spot");
  assert.ok(walkOn.rot !== freezeOn.rot, "a walk onto the stem, not Twig freeze");
  assert.ok(walkOn.rot !== stiltOn.rot, "a walk onto the stem, not Stem stilt");
  assert.ok(walkOn.rot !== huntOn.rot, "a walk onto the stem, not Haste hunt");
  const prayPose = P.prayPath(0.5);
  const spotPose = P.spotPath(0.5);
  const freezePose = P.freezePath(0.5);
  const stiltPose = P.stiltPath(0.5);
  const huntPose = P.huntPath(0.5);
  assert.ok(Math.abs(prayPose.rot) > 10, "she sits the pray; prayer is the tell");
  assert.ok(prayPose.rot !== spotPose.rot, "pray, not a spot");
  assert.ok(prayPose.rot !== freezePose.rot, "pray, not a freeze");
  assert.ok(prayPose.rot !== stiltPose.rot, "pray, not a stilt");
  assert.ok(prayPose.rot !== huntPose.rot, "pray, not a hunt");
  const hold = P.prayHoldPath(0.5);
  assert.ok(Math.abs(hold.rot - 26.2) < 0.2, "she holds after the pray, pray still the tell");
  assert.ok(Math.abs(hold.x - 0.55) < 0.4, "she stays on the window-box stem hinge");
  assert.ok(hold.lift > 5, "furniture until she walks after the pray");
  const off0 = P.prayOffPath(0, { x: hinge.x, lift: hinge.lift, rot: 26.2 }, { x: hinge.x + 50, lift: 0 });
  const offMid = P.prayOffPath(0.5, { x: hinge.x, lift: hinge.lift, rot: 26.2 }, { x: hinge.x + 50, lift: 0 });
  const off1 = P.prayOffPath(1, { x: hinge.x, lift: hinge.lift, rot: 26.2 }, { x: hinge.x + 50, lift: 0 });
  assert.ok(Math.abs(off0.x - hinge.x) < 2);
  assert.ok(Math.abs(offMid.x - hinge.x) > 8, "a walk leave off the window-box stem");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "fold");
    assert.notEqual(play.phase, "spot");
    assert.notEqual(play.phase, "freeze");
    assert.notEqual(play.phase, "stilt");
    assert.notEqual(play.phase, "hunt");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "pray") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "pray-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "pray-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift + 6.6)) < 3, "she holds the pray after the sit on the stem");
    }
    if (play.phase === "pray-off") {
      assert.equal(play.anim, "walk");
    }
  }
  assert.ok(seen.has("pray-on"));
  assert.ok(seen.has("pray"));
  assert.ok(seen.has("pray-hold"));
  assert.ok(seen.has("pray-off"));
  assert.ok(!seen.has("fold"), "Fold never uses bat fold");
  assert.ok(!seen.has("spot"), "Fold never uses Seven spot");
  assert.ok(!seen.has("freeze"), "Fold never uses Twig freeze");
  assert.ok(!seen.has("stilt"), "Fold never uses Stem stilt");
  assert.ok(!seen.has("hunt"), "Fold never uses Haste hunt");
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});
test("a moved window refits Fold's green-hinge pray; sleep, card, and hide abort; Fold never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "mantis", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "pray"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "pray");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "pray");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "pray-off");
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
    "Seven leftover spots a window-box leaf as a leaf dish; eighth leftover of the remaining hive den done; Column leftover still nests a sash stile as a timber gallery; seventh leftover of the remaining hive den done; Twig leftover still freezes a sash muntin as a pencil stem; sixth leftover of the remaining hive den done; Dart leftover still hawks a lamp-side air as prey air; fifth leftover of the remaining hive den done; Spark leftover still glows a lower sash light as ink dusk; fourth leftover of the remaining hive den done; Ghost leftover still weeks a lamp-side glass as lamp dusk; third leftover of the remaining hive den done; shore ten is closed; next leftover is Fold;",
    "Fold leftover prays a window-box stem as a green hinge; ninth leftover of the remaining hive den done; Seven leftover still spots a window-box leaf as a leaf dish; eighth leftover of the remaining hive den done; Column leftover still nests a sash stile as a timber gallery; seventh leftover of the remaining hive den done; Twig leftover still freezes a sash muntin as a pencil stem; sixth leftover of the remaining hive den done; Dart leftover still hawks a lamp-side air as prey air; fifth leftover of the remaining hive den done; Spark leftover still glows a lower sash light as ink dusk; fourth leftover of the remaining hive den done; Ghost leftover still weeks a lamp-side glass as lamp dusk; third leftover of the remaining hive den done; shore ten is closed; next leftover is Brood;",
    "house title",
)
house = must_replace(
    house,
    '''  assert.equal(WP.playFor("ladybird"), "spot");
  assert.equal(WP.SPOT, "spot");
  assert.notEqual(WP.playFor("ladybird"), "seven");
  assert.notEqual(WP.playFor("ladybird"), "hunt");
  assert.notEqual(WP.playFor("ladybird"), "count");
  assert.notEqual(WP.playFor("ladybird"), "nest");
  assert.notEqual(WP.playFor("ladybird"), "freeze");
  assert.notEqual(WP.playFor("ladybird"), "hawk");
  assert.notEqual(WP.playFor("ladybird"), "bore");
  assert.notEqual(WP.playFor("ladybird"), "trail");
  assert.notEqual(WP.playFor("ladybird"), "lady");
  assert.notEqual(WP.playFor("ladybird"), "aphid");
  assert.notEqual(WP.playFor("ladybird"), "beetle");
  assert.notEqual(WP.playFor("ladybird"), "sill");
  assert.equal(WP.playFor("house_centipede"), "hunt");
  assert.equal(WP.playFor("leafcutter"), "snip");
  assert.equal(WP.playFor("bumblebee"), "forage");
  assert.equal(WP.playFor("hummingbird"), "sip");
  assert.equal(WP.playFor("honeybee"), "waggle");
  assert.equal(WP.playFor("mantis"), "sill");
});''',
    '''  assert.equal(WP.playFor("ladybird"), "spot");
  assert.equal(WP.SPOT, "spot");
  assert.notEqual(WP.playFor("ladybird"), "seven");
  assert.notEqual(WP.playFor("ladybird"), "hunt");
  assert.notEqual(WP.playFor("ladybird"), "count");
  assert.notEqual(WP.playFor("ladybird"), "nest");
  assert.notEqual(WP.playFor("ladybird"), "freeze");
  assert.notEqual(WP.playFor("ladybird"), "hawk");
  assert.notEqual(WP.playFor("ladybird"), "bore");
  assert.notEqual(WP.playFor("ladybird"), "trail");
  assert.notEqual(WP.playFor("ladybird"), "lady");
  assert.notEqual(WP.playFor("ladybird"), "aphid");
  assert.notEqual(WP.playFor("ladybird"), "beetle");
  assert.notEqual(WP.playFor("ladybird"), "sill");
  assert.equal(WP.playFor("house_centipede"), "hunt");
  assert.equal(WP.playFor("leafcutter"), "snip");
  assert.equal(WP.playFor("bumblebee"), "forage");
  assert.equal(WP.playFor("hummingbird"), "sip");
  assert.equal(WP.playFor("honeybee"), "waggle");
  assert.equal(WP.playFor("mantis"), "pray");
  assert.equal(WP.PRAY, "pray");
  assert.notEqual(WP.playFor("mantis"), "fold");
  assert.notEqual(WP.playFor("mantis"), "hunt");
  assert.notEqual(WP.playFor("mantis"), "spot");
  assert.notEqual(WP.playFor("mantis"), "nest");
  assert.notEqual(WP.playFor("mantis"), "freeze");
  assert.notEqual(WP.playFor("mantis"), "hawk");
  assert.notEqual(WP.playFor("mantis"), "snap");
  assert.notEqual(WP.playFor("mantis"), "still");
  assert.notEqual(WP.playFor("mantis"), "strike");
  assert.notEqual(WP.playFor("mantis"), "trap");
  assert.notEqual(WP.playFor("mantis"), "wait");
  assert.notEqual(WP.playFor("mantis"), "sill");
  assert.equal(WP.playFor("bat"), "fold");
  assert.equal(WP.playFor("harvestman"), "stilt");
  assert.equal(WP.playFor("stick"), "freeze");
  assert.equal(WP.playFor("potto"), "creep");
  assert.equal(WP.playFor("cicada"), "sill");
});''',
    "house fold pray",
)
# also fix the earlier mantis sill pin in Twig/Column section
house = replace_all(
    house,
    'assert.equal(WP.playFor("mantis"), "sill");',
    'assert.equal(WP.playFor("cicada"), "sill");',
    "house remaining mantis sill",
    1,
)
save("desktop/renderer/leftover-house.test.cjs", house, hnl)
print("house ok")

mjs, mnl = load("web/scripts/window-play.test.mjs")
mjs = replace_all(
    mjs,
    'assert.equal(P.playFor("mantis"), "sill");',
    'assert.equal(P.playFor("cicada"), "sill");',
    "mjs mantis sill pins",
    8,
)

MJS_TEST = r'''
test("the demo window plate walks Fold pray the same way", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /playFor/);
  assert.match(readFileSync(join(root, "src/lib/pets/insects.ts"), "utf8"), /key: "mantis"[\s\S]{0,80}slug: "fold"/);
  assert.equal(P.playFor("mantis"), "pray");
  const target = P.pickTarget([WIN], 80, "mantis", WORK, 176);
  assert.ok(target);
  assert.equal(target.kind, "pray");
  assert.equal(target.side, "greenhinge");
  assert.equal(target.leave, "prayed");
  assert.equal(Overlay.playFor("mantis"), "pray");
  assert.equal(P.PRAY, "pray");
  assert.equal(Overlay.PRAY, "pray");
  assert.notEqual(P.playFor("mantis"), "fold");
  assert.notEqual(P.playFor("mantis"), "hunt");
  assert.notEqual(P.playFor("mantis"), "spot");
  assert.notEqual(P.playFor("mantis"), "nest");
  assert.notEqual(P.playFor("mantis"), "freeze");
  assert.notEqual(P.playFor("mantis"), "hawk");
  assert.notEqual(P.playFor("mantis"), "snap");
  assert.notEqual(P.playFor("mantis"), "still");
  assert.notEqual(P.playFor("mantis"), "strike");
  assert.notEqual(P.playFor("mantis"), "trap");
  assert.notEqual(P.playFor("mantis"), "wait");
  assert.equal(P.playFor("bat"), "fold");
  assert.equal(Overlay.playFor("bat"), "fold");
  assert.equal(P.playFor("ladybird"), "spot");
  assert.equal(Overlay.playFor("ladybird"), "spot");
  assert.equal(P.playFor("stick"), "freeze");
  assert.equal(P.playFor("harvestman"), "stilt");
  assert.equal(P.playFor("house_centipede"), "hunt");
  assert.equal(P.playFor("cicada"), "sill");
  assert.equal(P.DUR.prayOn, Overlay.DUR.prayOn);
  assert.equal(P.DUR.pray, Overlay.DUR.pray);
  assert.equal(P.DUR.prayHold, Overlay.DUR.prayHold);
  assert.equal(P.DUR.prayOff, Overlay.DUR.prayOff);
  assert.ok(P.DUR.prayOn !== Overlay.DUR.spotOn);
  assert.ok(P.DUR.prayOn !== Overlay.DUR.freezeOn);
  assert.ok(P.DUR.prayOn !== Overlay.DUR.stiltOn);
  assert.ok(P.DUR.prayOn !== Overlay.DUR.huntOn);
  const hinge = P.prayPoint(WIN, 176, WORK);
  const deskHinge = Overlay.prayPoint(WIN, Overlay.SPRITE, WORK);
  const spot = P.spotPoint(WIN, 176, WORK);
  const freeze = P.freezePoint(WIN, 176, WORK);
  const stilt = P.stiltPoint(WIN, 176, WORK);
  assert.ok(Math.abs(hinge.x - deskHinge.x) < 1);
  assert.ok(Math.abs(hinge.lift - deskHinge.lift) < 1);
  assert.ok(hinge.lift > 8, "green hinge, the window-box stem");
  assert.ok(Math.abs(hinge.x - spot.x) > 20 || Math.abs(hinge.lift - spot.lift) > 4, "not Seven spot");
  assert.ok(Math.abs(hinge.x - freeze.x) > 20 || Math.abs(hinge.lift - freeze.lift) > 4, "not Twig freeze");
  assert.ok(Math.abs(hinge.x - stilt.x) > 20 || Math.abs(hinge.lift - stilt.lift) > 4, "not Stem stilt");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 160, height: 70 }], 80, "mantis", WORK, 176);
  assert.equal(tiny, null, "a real window-box stem");
  const okPray = P.pickTarget([{ id: "pray", x: 200, y: 80, width: 184, height: 178 }], 80, "mantis", WORK, 176);
  assert.ok(okPray, "a real window-box stem as a green hinge");
  const walkOn = P.prayOnPath(0.25, { x: 40, lift: 0 }, { x: hinge.x, lift: hinge.lift });
  const deskWalk = Overlay.prayOnPath(0.25, { x: 40, lift: 0 }, { x: hinge.x, lift: hinge.lift });
  assert.ok(Math.abs(walkOn.x - deskWalk.x) < 1);
  assert.ok(Math.abs(walkOn.rot - deskWalk.rot) < 0.01);
  const prayPose = P.prayPath(0.5);
  const deskPray = Overlay.prayPath(0.5);
  assert.ok(Math.abs(prayPose.rot - deskPray.rot) < 0.01);
  assert.ok(Math.abs(prayPose.rot) > 10, "pray is the tell");
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, 176, { cmd: "idle" });
  }
  assert.ok(seen.has("pray-on"));
  assert.ok(seen.has("pray"));
  assert.ok(seen.has("pray-hold"));
  assert.ok(seen.has("pray-off"));
  assert.equal(play.phase, "done");
  let desk = Overlay.beginPlay(Overlay.pickTarget([WIN], 80, "mantis", WORK, Overlay.SPRITE), 80);
  const deskSeen = new Set();
  for (let i = 0; i < 2400 && desk.phase !== "done"; i++) {
    deskSeen.add(desk.phase);
    desk = Overlay.stepPlay(desk, 0.05, { x: desk.x, lift: desk.lift }, [WIN, WIN_B], WORK, Overlay.SPRITE, { cmd: "idle" });
  }
  assert.ok(deskSeen.has("pray-on"));
  assert.ok(deskSeen.has("pray"));
  assert.ok(deskSeen.has("pray-hold"));
  assert.ok(deskSeen.has("pray-off"));
  assert.equal(desk.phase, "done");
});
'''

if not mjs.rstrip().endswith("});"):
    raise SystemExit("mjs tail unexpected: " + repr(mjs.rstrip()[-40:]))
mjs = mjs.rstrip() + "\n" + MJS_TEST
save("web/scripts/window-play.test.mjs", mjs, mnl)
print("mjs ok")
