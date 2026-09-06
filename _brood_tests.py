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
    'const target = P.pickTarget([WIN], 80, "cicada", WORK, P.SPRITE);',
    'const target = P.pickTarget([WIN], 80, "field_cricket", WORK, P.SPRITE);',
    "cjs generic sill pin",
)
cjs = replace_all(
    cjs,
    'assert.equal(P.playFor("cicada"), "sill");',
    'assert.equal(P.playFor("field_cricket"), "sill");',
    "cjs cicada sill pins",
    11,
)

CJS_TESTS = r'''
test("Brood emerges a window foot as a soil husk: walk onto the foot, sit, burst, sit the husk, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("cicada"), "emerge");
  assert.equal(P.EMERGE, "emerge");
  assert.notEqual(P.playFor("cicada"), "brood");
  assert.notEqual(P.playFor("cicada"), "sing");
  assert.notEqual(P.playFor("cicada"), "song");
  assert.notEqual(P.playFor("cicada"), "drone");
  assert.notEqual(P.playFor("cicada"), "drum");
  assert.notEqual(P.playFor("cicada"), "hum");
  assert.notEqual(P.playFor("cicada"), "thrum");
  assert.notEqual(P.playFor("cicada"), "pulse");
  assert.notEqual(P.playFor("cicada"), "chime");
  assert.notEqual(P.playFor("cicada"), "pray");
  assert.notEqual(P.playFor("cicada"), "spot");
  assert.notEqual(P.playFor("cicada"), "nest");
  assert.notEqual(P.playFor("cicada"), "fold");
  assert.notEqual(P.playFor("cicada"), "burst");
  assert.notEqual(P.playFor("cicada"), "wait");
  assert.notEqual(P.playFor("cicada"), "sill");
  assert.equal(P.playFor("lugworm"), "castings");
  assert.equal(P.CASTINGS, "castings");
  assert.equal(P.playFor("springtail"), "spring");
  assert.equal(P.playFor("box_turtle"), "shut");
  assert.equal(P.playFor("wolf_spider"), "carry");
  assert.equal(P.playFor("mantis"), "pray");
  assert.equal(P.PRAY, "pray");
  assert.equal(P.playFor("ladybird"), "spot");
  assert.equal(P.playFor("bat"), "fold");
  assert.equal(P.playFor("pileated"), "drum");
  assert.equal(P.playFor("honey_drone"), "drone");
  assert.equal(P.playFor("bumblebee"), "forage");
  assert.equal(P.playFor("field_cricket"), "sill");
  assert.equal(P.DUR.prayOn, P.DUR.prayOn, "Fold pray durations stay");
  assert.equal(P.DUR.castingsOn, P.DUR.castingsOn, "Heap castings durations stay");
  assert.equal(P.DUR.springOn, P.DUR.springOn, "Hop spring durations stay");
  const target = P.pickTarget([WIN], 80, "cicada", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "emerge");
  assert.equal(target.side, "soilhusk");
  assert.equal(target.leave, "emerged");
  assert.notEqual(target.kind, "brood");
  assert.notEqual(target.kind, "sing");
  assert.notEqual(target.kind, "song");
  assert.notEqual(target.kind, "drone");
  assert.notEqual(target.kind, "drum");
  assert.notEqual(target.kind, "hum");
  assert.notEqual(target.kind, "thrum");
  assert.notEqual(target.kind, "pray");
  assert.notEqual(target.kind, "spot");
  assert.notEqual(target.kind, "castings");
  assert.notEqual(target.kind, "spring");
  assert.notEqual(target.kind, "shut");
  assert.notEqual(target.kind, "carry");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift < 2, "she emerges a window foot as a soil husk, not a stem");
  assert.ok(P.DUR.emergeHold > P.DUR.emerge * 0.9, "the hold is the husk; sit, burst, sit");
  assert.ok(P.DUR.emergeOn > 1.0, "a walk onto the foot, not the burst");
  assert.ok(P.DUR.emergeOn !== P.DUR.prayOn);
  assert.ok(P.DUR.emergeOn !== P.DUR.castingsOn);
  assert.ok(P.DUR.emergeOn !== P.DUR.springOn);
  assert.ok(P.DUR.emergeOn !== P.DUR.spotOn);
  assert.ok(P.DUR.emergeOn !== P.DUR.sillHop);
  assert.ok(P.DUR.emerge !== P.DUR.pray);
  assert.ok(P.DUR.emerge !== P.DUR.castings);
  assert.ok(P.DUR.emerge !== P.DUR.spring);
  assert.ok(P.DUR.emergeHold !== P.DUR.prayHold);
  assert.ok(P.DUR.emergeHold !== P.DUR.castingsHold);
  assert.ok(P.DUR.emergeOff !== P.DUR.prayOff);
  assert.ok(P.DUR.emergeOff !== P.DUR.sillDown);
  const husk = P.emergePoint(WIN, P.SPRITE, WORK);
  const castings = P.castingsPoint(WIN, P.SPRITE, WORK);
  const spring = P.springPoint(WIN, P.SPRITE, WORK);
  const shut = P.shutPoint(WIN, P.SPRITE, WORK);
  const pray = P.prayPoint(WIN, P.SPRITE, WORK);
  const spot = P.spotPoint(WIN, P.SPRITE, WORK);
  assert.ok(husk.lift < 2, "the window foot as a soil husk, not a hinge");
  assert.ok(Math.abs(husk.x - castings.x) > 12 || Math.abs(husk.lift - castings.lift) > 0.5, "not Heap's window-foot castings");
  assert.ok(Math.abs(husk.x - spring.x) > 12 || Math.abs(husk.lift - spring.lift) > 0.5, "not Hop's window-foot spring");
  assert.ok(Math.abs(husk.x - shut.x) > 8 || Math.abs(husk.lift - shut.lift) > 0.5, "not Lid's window-foot shut");
  assert.ok(Math.abs(husk.x - pray.x) > 20 || Math.abs(husk.lift - pray.lift) > 4, "not Fold's window-box stem pray");
  assert.ok(Math.abs(husk.x - spot.x) > 20 || Math.abs(husk.lift - spot.lift) > 4, "not Seven's window-box leaf spot");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "cicada", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real window foot, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 160, height: 70 }], 80, "cicada", WORK, P.SPRITE);
  assert.equal(short, null, "a real window foot soil husk, not Heap's castings gate");
  const thin = P.pickTarget([{ id: "thin", x: 200, y: 80, width: 168, height: 72 }], 80, "cicada", WORK, P.SPRITE);
  assert.equal(thin, null, "a real window foot soil husk, not a thinner foot");
  const okEmerge = P.pickTarget([{ id: "emerge", x: 200, y: 80, width: 168, height: 74 }], 80, "cicada", WORK, P.SPRITE);
  assert.ok(okEmerge, "a real window foot as a soil husk");
  const heapOk = P.pickTarget([{ id: "cast", x: 200, y: 80, width: 160, height: 70 }], 80, "lugworm", WORK, P.SPRITE);
  assert.ok(heapOk, "Heap still takes wet sand castings");
  const broodNo = P.pickTarget([{ id: "cast", x: 200, y: 80, width: 160, height: 70 }], 80, "cicada", WORK, P.SPRITE);
  assert.equal(broodNo, null, "Brood needs a taller soil husk, not Heap's castings gate");
  const walkOn = P.emergeOnPath(0.25, { x: 40, lift: 0 }, { x: husk.x, lift: husk.lift });
  const castOn = P.castingsOnPath(0.25, { x: 40, lift: 0 }, { x: husk.x, lift: husk.lift });
  const springOn = P.springOnPath(0.25, { x: 40, lift: 0 }, { x: husk.x, lift: husk.lift });
  const prayOn = P.prayOnPath(0.25, { x: 40, lift: 0 }, { x: husk.x, lift: husk.lift });
  assert.ok(Math.abs(walkOn.rot) >= 0, "she walks onto the foot as a soil husk");
  assert.ok(walkOn.rot !== castOn.rot, "a walk onto the foot, not Heap castings");
  assert.ok(walkOn.rot !== springOn.rot, "a walk onto the foot, not Hop spring");
  assert.ok(walkOn.rot !== prayOn.rot, "a walk onto the foot, not Fold pray");
  const emergePose = P.emergePath(0.5);
  const castPose = P.castingsPath(0.5);
  const springPose = P.springPath(0.5);
  const prayPose = P.prayPath(0.5);
  assert.ok(Math.abs(emergePose.lift) > 2, "she sits then bursts; emerge is the tell");
  assert.ok(emergePose.rot !== castPose.rot, "emerge, not castings");
  assert.ok(emergePose.rot !== springPose.rot, "emerge, not spring");
  assert.ok(emergePose.rot !== prayPose.rot, "emerge, not pray");
  const hold = P.emergeHoldPath(0.5);
  assert.ok(Math.abs(hold.rot - 12.2) < 0.2, "she holds after the burst, husk still the tell");
  assert.ok(Math.abs(hold.x - 0.42) < 0.4, "she stays on the window-foot soil husk");
  assert.ok(hold.lift > 5, "relic after the burst, not the floor alone");
  const off0 = P.emergeOffPath(0, { x: husk.x, lift: husk.lift + 7.6, rot: 12.2 }, { x: husk.x + 50, lift: 0 });
  const offMid = P.emergeOffPath(0.5, { x: husk.x, lift: husk.lift + 7.6, rot: 12.2 }, { x: husk.x + 50, lift: 0 });
  const off1 = P.emergeOffPath(1, { x: husk.x, lift: husk.lift + 7.6, rot: 12.2 }, { x: husk.x + 50, lift: 0 });
  assert.ok(Math.abs(off0.x - husk.x) < 2);
  assert.ok(Math.abs(offMid.x - husk.x) > 8, "a walk leave off the window foot");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "pray");
    assert.notEqual(play.phase, "spot");
    assert.notEqual(play.phase, "castings");
    assert.notEqual(play.phase, "spring");
    assert.notEqual(play.phase, "drum");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "emerge") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "emerge-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "emerge-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift + 7.6)) < 3, "she holds the husk after the burst on the foot");
    }
    if (play.phase === "emerge-off") {
      assert.equal(play.anim, "walk");
    }
  }
  assert.ok(seen.has("emerge-on"));
  assert.ok(seen.has("emerge"));
  assert.ok(seen.has("emerge-hold"));
  assert.ok(seen.has("emerge-off"));
  assert.ok(!seen.has("pray"), "Brood never uses Fold pray");
  assert.ok(!seen.has("spot"), "Brood never uses Seven spot");
  assert.ok(!seen.has("castings"), "Brood never uses Heap castings");
  assert.ok(!seen.has("spring"), "Brood never uses Hop spring");
  assert.ok(!seen.has("drum"), "Brood never uses Drum drum");
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});
test("a moved window refits Brood's soil-husk emerge; sleep, card, and hide abort; Brood never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "cicada", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "emerge"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "emerge");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "emerge");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "emerge-off");
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
    "Fold leftover prays a window-box stem as a green hinge; ninth leftover of the remaining hive den done; Seven leftover still spots a window-box leaf as a leaf dish; eighth leftover of the remaining hive den done; Column leftover still nests a sash stile as a timber gallery; seventh leftover of the remaining hive den done; Twig leftover still freezes a sash muntin as a pencil stem; sixth leftover of the remaining hive den done; Dart leftover still hawks a lamp-side air as prey air; fifth leftover of the remaining hive den done; Spark leftover still glows a lower sash light as ink dusk; fourth leftover of the remaining hive den done; Ghost leftover still weeks a lamp-side glass as lamp dusk; third leftover of the remaining hive den done; shore ten is closed; next leftover is Brood;",
    "Brood leftover emerges a window foot as a soil husk; tenth leftover of the remaining hive den done; hive ten closed; Fold leftover still prays a window-box stem as a green hinge; ninth leftover of the remaining hive den done; Seven leftover still spots a window-box leaf as a leaf dish; eighth leftover of the remaining hive den done; Column leftover still nests a sash stile as a timber gallery; seventh leftover of the remaining hive den done; Twig leftover still freezes a sash muntin as a pencil stem; sixth leftover of the remaining hive den done; Dart leftover still hawks a lamp-side air as prey air; fifth leftover of the remaining hive den done; Spark leftover still glows a lower sash light as ink dusk; fourth leftover of the remaining hive den done; Ghost leftover still weeks a lamp-side glass as lamp dusk; third leftover of the remaining hive den done; shore ten is closed; next leftover is Chirp;",
    "house title",
)
house = must_replace(
    house,
    '''  assert.equal(WP.playFor("mantis"), "pray");
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
    '''  assert.equal(WP.playFor("mantis"), "pray");
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
  assert.equal(WP.playFor("cicada"), "emerge");
  assert.equal(WP.EMERGE, "emerge");
  assert.notEqual(WP.playFor("cicada"), "brood");
  assert.notEqual(WP.playFor("cicada"), "sing");
  assert.notEqual(WP.playFor("cicada"), "song");
  assert.notEqual(WP.playFor("cicada"), "drone");
  assert.notEqual(WP.playFor("cicada"), "drum");
  assert.notEqual(WP.playFor("cicada"), "hum");
  assert.notEqual(WP.playFor("cicada"), "thrum");
  assert.notEqual(WP.playFor("cicada"), "pulse");
  assert.notEqual(WP.playFor("cicada"), "chime");
  assert.notEqual(WP.playFor("cicada"), "pray");
  assert.notEqual(WP.playFor("cicada"), "spot");
  assert.notEqual(WP.playFor("cicada"), "nest");
  assert.notEqual(WP.playFor("cicada"), "fold");
  assert.notEqual(WP.playFor("cicada"), "burst");
  assert.notEqual(WP.playFor("cicada"), "wait");
  assert.notEqual(WP.playFor("cicada"), "sill");
  assert.equal(WP.playFor("lugworm"), "castings");
  assert.equal(WP.playFor("springtail"), "spring");
  assert.equal(WP.playFor("box_turtle"), "shut");
  assert.equal(WP.playFor("wolf_spider"), "carry");
  assert.equal(WP.playFor("field_cricket"), "sill");
});''',
    "house brood emerge",
)
house = replace_all(
    house,
    'assert.equal(WP.playFor("cicada"), "sill");',
    'assert.equal(WP.playFor("field_cricket"), "sill");',
    "house remaining cicada sill",
    1,
)
save("desktop/renderer/leftover-house.test.cjs", house, hnl)
print("house ok")

mjs, mnl = load("web/scripts/window-play.test.mjs")
mjs = replace_all(
    mjs,
    'assert.equal(P.playFor("cicada"), "sill");',
    'assert.equal(P.playFor("field_cricket"), "sill");',
    "mjs cicada sill pins",
    9,
)

MJS_TEST = r'''
test("the demo window plate walks Brood emerge the same way", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /playFor/);
  assert.match(readFileSync(join(root, "src/lib/pets/insects.ts"), "utf8"), /key: "cicada"[\s\S]{0,80}slug: "brood"/);
  assert.equal(P.playFor("cicada"), "emerge");
  const target = P.pickTarget([WIN], 80, "cicada", WORK, 176);
  assert.ok(target);
  assert.equal(target.kind, "emerge");
  assert.equal(target.side, "soilhusk");
  assert.equal(target.leave, "emerged");
  assert.equal(Overlay.playFor("cicada"), "emerge");
  assert.equal(P.EMERGE, "emerge");
  assert.equal(Overlay.EMERGE, "emerge");
  assert.notEqual(P.playFor("cicada"), "brood");
  assert.notEqual(P.playFor("cicada"), "sing");
  assert.notEqual(P.playFor("cicada"), "song");
  assert.notEqual(P.playFor("cicada"), "drone");
  assert.notEqual(P.playFor("cicada"), "drum");
  assert.notEqual(P.playFor("cicada"), "hum");
  assert.notEqual(P.playFor("cicada"), "thrum");
  assert.notEqual(P.playFor("cicada"), "pray");
  assert.notEqual(P.playFor("cicada"), "spot");
  assert.notEqual(P.playFor("cicada"), "burst");
  assert.notEqual(P.playFor("cicada"), "wait");
  assert.equal(P.playFor("mantis"), "pray");
  assert.equal(Overlay.playFor("mantis"), "pray");
  assert.equal(P.playFor("bat"), "fold");
  assert.equal(Overlay.playFor("bat"), "fold");
  assert.equal(P.playFor("ladybird"), "spot");
  assert.equal(P.playFor("lugworm"), "castings");
  assert.equal(P.playFor("springtail"), "spring");
  assert.equal(P.playFor("field_cricket"), "sill");
  assert.equal(P.DUR.emergeOn, Overlay.DUR.emergeOn);
  assert.equal(P.DUR.emerge, Overlay.DUR.emerge);
  assert.equal(P.DUR.emergeHold, Overlay.DUR.emergeHold);
  assert.equal(P.DUR.emergeOff, Overlay.DUR.emergeOff);
  assert.ok(P.DUR.emergeOn !== Overlay.DUR.prayOn);
  assert.ok(P.DUR.emergeOn !== Overlay.DUR.castingsOn);
  assert.ok(P.DUR.emergeOn !== Overlay.DUR.springOn);
  assert.ok(P.DUR.emergeOn !== Overlay.DUR.spotOn);
  const husk = P.emergePoint(WIN, 176, WORK);
  const deskHusk = Overlay.emergePoint(WIN, Overlay.SPRITE, WORK);
  const castings = P.castingsPoint(WIN, 176, WORK);
  const spring = P.springPoint(WIN, 176, WORK);
  const pray = P.prayPoint(WIN, 176, WORK);
  assert.ok(Math.abs(husk.x - deskHusk.x) < 1);
  assert.ok(Math.abs(husk.lift - deskHusk.lift) < 1);
  assert.ok(husk.lift < 2, "soil husk, the window foot");
  assert.ok(Math.abs(husk.x - castings.x) > 12 || Math.abs(husk.lift - castings.lift) > 0.5, "not Heap castings");
  assert.ok(Math.abs(husk.x - spring.x) > 12 || Math.abs(husk.lift - spring.lift) > 0.5, "not Hop spring");
  assert.ok(Math.abs(husk.x - pray.x) > 20 || Math.abs(husk.lift - pray.lift) > 4, "not Fold pray");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 160, height: 70 }], 80, "cicada", WORK, 176);
  assert.equal(tiny, null, "a real window foot soil husk");
  const okEmerge = P.pickTarget([{ id: "emerge", x: 200, y: 80, width: 168, height: 74 }], 80, "cicada", WORK, 176);
  assert.ok(okEmerge, "a real window foot as a soil husk");
  const walkOn = P.emergeOnPath(0.25, { x: 40, lift: 0 }, { x: husk.x, lift: husk.lift });
  const deskWalk = Overlay.emergeOnPath(0.25, { x: 40, lift: 0 }, { x: husk.x, lift: husk.lift });
  assert.ok(Math.abs(walkOn.x - deskWalk.x) < 1);
  assert.ok(Math.abs(walkOn.rot - deskWalk.rot) < 0.01);
  const emergePose = P.emergePath(0.5);
  const deskEmerge = Overlay.emergePath(0.5);
  assert.ok(Math.abs(emergePose.rot - deskEmerge.rot) < 0.01);
  assert.ok(Math.abs(emergePose.lift) > 2, "emerge is the tell");
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, 176, { cmd: "idle" });
  }
  assert.ok(seen.has("emerge-on"));
  assert.ok(seen.has("emerge"));
  assert.ok(seen.has("emerge-hold"));
  assert.ok(seen.has("emerge-off"));
  assert.equal(play.phase, "done");
  let desk = Overlay.beginPlay(Overlay.pickTarget([WIN], 80, "cicada", WORK, Overlay.SPRITE), 80);
  const deskSeen = new Set();
  for (let i = 0; i < 2400 && desk.phase !== "done"; i++) {
    deskSeen.add(desk.phase);
    desk = Overlay.stepPlay(desk, 0.05, { x: desk.x, lift: desk.lift }, [WIN, WIN_B], WORK, Overlay.SPRITE, { cmd: "idle" });
  }
  assert.ok(deskSeen.has("emerge-on"));
  assert.ok(deskSeen.has("emerge"));
  assert.ok(deskSeen.has("emerge-hold"));
  assert.ok(deskSeen.has("emerge-off"));
  assert.equal(desk.phase, "done");
});
'''

if not mjs.rstrip().endswith("});"):
    raise SystemExit("mjs tail unexpected: " + repr(mjs.rstrip()[-40:]))
mjs = mjs.rstrip() + "\n" + MJS_TEST
save("web/scripts/window-play.test.mjs", mjs, mnl)
print("mjs ok")
