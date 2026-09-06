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
    'const target = P.pickTarget([WIN], 80, "carpenter_ant", WORK, P.SPRITE);',
    'const target = P.pickTarget([WIN], 80, "ladybird", WORK, P.SPRITE);',
    "cjs generic sill pin",
)
cjs = replace_all(
    cjs,
    'assert.equal(P.playFor("carpenter_ant"), "sill");',
    'assert.equal(P.playFor("ladybird"), "sill");',
    "cjs carpenter sill pins",
    6,
)

CJS_TESTS = r'''
test("Column nests a sash stile as a timber gallery: walk onto the stile, sit the nest, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("carpenter_ant"), "nest");
  assert.equal(P.NEST, "nest");
  assert.notEqual(P.playFor("carpenter_ant"), "column");
  assert.notEqual(P.playFor("carpenter_ant"), "bore");
  assert.notEqual(P.playFor("carpenter_ant"), "trail");
  assert.notEqual(P.playFor("carpenter_ant"), "chew");
  assert.notEqual(P.playFor("carpenter_ant"), "scent");
  assert.notEqual(P.playFor("carpenter_ant"), "carry");
  assert.notEqual(P.playFor("carpenter_ant"), "glue");
  assert.notEqual(P.playFor("carpenter_ant"), "freeze");
  assert.notEqual(P.playFor("carpenter_ant"), "hawk");
  assert.notEqual(P.playFor("carpenter_ant"), "road");
  assert.notEqual(P.playFor("carpenter_ant"), "ant");
  assert.notEqual(P.playFor("carpenter_ant"), "sill");
  assert.equal(P.playFor("carpenter_bee"), "bore");
  assert.equal(P.BORE, "bore");
  assert.equal(P.playFor("beaver"), "gnaw");
  assert.equal(P.playFor("mining_bee"), "dig");
  assert.equal(P.DIG, "dig");
  assert.equal(P.playFor("stick"), "freeze");
  assert.equal(P.FREEZE, "freeze");
  assert.equal(P.playFor("darner"), "hawk");
  assert.equal(P.HAWK, "hawk");
  assert.equal(P.playFor("ladybird"), "sill");
  assert.equal(P.playFor("mantis"), "sill");
  assert.equal(P.DUR.freezeOn, 3.56, "Twig freeze durations stay");
  assert.equal(P.DUR.boreOn, 1.22, "Auger bore durations stay");
  assert.equal(P.DUR.digOn, 1.68, "Bank dig durations stay");
  const target = P.pickTarget([WIN], 80, "carpenter_ant", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "nest");
  assert.equal(target.side, "timbergallery");
  assert.equal(target.leave, "nested");
  assert.notEqual(target.kind, "column");
  assert.notEqual(target.kind, "bore");
  assert.notEqual(target.kind, "trail");
  assert.notEqual(target.kind, "chew");
  assert.notEqual(target.kind, "scent");
  assert.notEqual(target.kind, "carry");
  assert.notEqual(target.kind, "glue");
  assert.notEqual(target.kind, "freeze");
  assert.notEqual(target.kind, "hawk");
  assert.notEqual(target.kind, "road");
  assert.notEqual(target.kind, "ant");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift > 8, "she nests a sash stile as a timber gallery, not the floor");
  assert.ok(P.DUR.nestHold > P.DUR.nest * 0.9, "the hold is the nest; she does not eat the house");
  assert.ok(P.DUR.nestOn > 1.0, "a walk onto the stile, not the nest");
  assert.ok(P.DUR.nestOn !== P.DUR.boreOn);
  assert.ok(P.DUR.nestOn !== P.DUR.gnawOn);
  assert.ok(P.DUR.nestOn !== P.DUR.digOn);
  assert.ok(P.DUR.nestOn !== P.DUR.freezeOn);
  assert.ok(P.DUR.nestOn !== P.DUR.hawkOn);
  assert.ok(P.DUR.nestOn !== P.DUR.sillHop);
  assert.ok(P.DUR.nest !== P.DUR.bore);
  assert.ok(P.DUR.nest !== P.DUR.gnaw);
  assert.ok(P.DUR.nest !== P.DUR.dig);
  assert.ok(P.DUR.nestHold !== P.DUR.boreHold);
  assert.ok(P.DUR.nestHold !== P.DUR.digHold);
  assert.ok(P.DUR.nestOff !== P.DUR.boreOff);
  assert.ok(P.DUR.nestOff !== P.DUR.sillDown);
  const gallery = P.nestPoint(WIN, P.SPRITE, WORK);
  const bore = P.borePoint(WIN, P.SPRITE, WORK);
  const gnaw = P.gnawPoint(WIN, P.SPRITE, WORK);
  const dig = P.digPoint(WIN, P.SPRITE, WORK);
  const muntin = P.freezePoint(WIN, P.SPRITE, WORK);
  const air = P.hawkPoint(WIN, P.SPRITE, WORK);
  assert.ok(gallery.lift > 8, "the sash stile as a timber gallery, not the floor");
  assert.ok(Math.abs(gallery.x - bore.x) > 20 || Math.abs(gallery.lift - bore.lift) > 8, "not Auger's sash-stile timber hole bore");
  assert.ok(Math.abs(gallery.x - gnaw.x) > 20 || Math.abs(gallery.lift - gnaw.lift) > 8, "not Dam's sash-stile lodge gnaw");
  assert.ok(Math.abs(gallery.x - dig.x) > 20 || Math.abs(gallery.lift - dig.lift) > 8, "not Bank's stool sand-bank dig");
  assert.ok(Math.abs(gallery.x - muntin.x) > 20 || Math.abs(gallery.lift - muntin.lift) > 8, "not Twig's sash-muntin freeze");
  assert.ok(Math.abs(gallery.x - air.x) > 20 || Math.abs(gallery.lift - air.lift) > 8, "not Dart's lamp-side air hawk");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "carpenter_ant", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real sash stile, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 180, height: 180 }], 80, "carpenter_ant", WORK, P.SPRITE);
  assert.equal(short, null, "a real sash stile, not a short sash");
  const thin = P.pickTarget([{ id: "thin", x: 200, y: 80, width: 188, height: 198 }], 80, "carpenter_ant", WORK, P.SPRITE);
  assert.equal(thin, null, "a real sash stile, not a thinner pane");
  const okNest = P.pickTarget([{ id: "nest", x: 200, y: 80, width: 188, height: 200 }], 80, "carpenter_ant", WORK, P.SPRITE);
  assert.ok(okNest, "a real sash stile as a timber gallery");
  const augerOk = P.pickTarget([{ id: "bore", x: 200, y: 80, width: 160, height: 180 }], 80, "carpenter_bee", WORK, P.SPRITE);
  assert.ok(augerOk, "Auger still takes a timber stile");
  const columnNo = P.pickTarget([{ id: "bore", x: 200, y: 80, width: 160, height: 180 }], 80, "carpenter_ant", WORK, P.SPRITE);
  assert.equal(columnNo, null, "Column needs a taller stile gallery, not Auger's bore gate");
  const walkOn = P.nestOnPath(0.25, { x: 40, lift: 0 }, { x: gallery.x, lift: gallery.lift });
  const boreOn = P.boreOnPath(0.25, { x: 40, lift: 0 }, { x: gallery.x, lift: gallery.lift });
  const digOn = P.digOnPath(0.25, { x: 40, lift: 0 }, { x: gallery.x, lift: gallery.lift });
  const freezeOn = P.freezeOnPath(0.25, { x: 40, lift: 0 }, { x: gallery.x, lift: gallery.lift });
  const hawkOn = P.hawkOnPath(0.25, { x: 40, lift: 0 }, { x: gallery.x, lift: gallery.lift });
  assert.ok(walkOn.lift > 0, "she walks onto the stile as a timber gallery");
  assert.ok(walkOn.rot !== boreOn.rot, "a walk onto the stile, not Auger bore");
  assert.ok(walkOn.rot !== digOn.rot, "a walk onto the stile, not Bank dig");
  assert.ok(walkOn.rot !== freezeOn.rot, "a walk onto the stile, not Twig freeze");
  assert.ok(walkOn.rot !== hawkOn.rot, "a walk onto the stile, not Dart hawk");
  const nestPose = P.nestPath(0.5);
  const borePose = P.borePath(0.5);
  const digPose = P.digPath(0.5);
  const freezePose = P.freezePath(0.5);
  const hawkPose = P.hawkPath(0.5);
  assert.ok(Math.abs(nestPose.rot) > 6, "she sits the nest; she does not eat the house");
  assert.ok(nestPose.rot !== borePose.rot, "nest, not a bore");
  assert.ok(nestPose.rot !== digPose.rot, "nest, not a dig");
  assert.ok(nestPose.rot !== freezePose.rot, "nest, not a freeze");
  assert.ok(nestPose.rot !== hawkPose.rot, "nest, not a hawk");
  const hold = P.nestHoldPath(0.5);
  assert.ok(Math.abs(hold.rot - -14) < 0.2, "she holds after the nest, nest still the tell");
  assert.ok(Math.abs(hold.x - 1.2) < 0.4, "she stays on the sash stile gallery");
  assert.ok(hold.lift > 1, "furniture until she walks after the nest");
  const off0 = P.nestOffPath(0, { x: gallery.x, lift: gallery.lift, rot: -14 }, { x: gallery.x + 50, lift: 0 });
  const offMid = P.nestOffPath(0.5, { x: gallery.x, lift: gallery.lift, rot: -14 }, { x: gallery.x + 50, lift: 0 });
  const off1 = P.nestOffPath(1, { x: gallery.x, lift: gallery.lift, rot: -14 }, { x: gallery.x + 50, lift: 0 });
  assert.ok(Math.abs(off0.x - gallery.x) < 2);
  assert.ok(Math.abs(offMid.x - gallery.x) > 8, "a walk leave off the sash stile");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "bore");
    assert.notEqual(play.phase, "gnaw");
    assert.notEqual(play.phase, "dig");
    assert.notEqual(play.phase, "freeze");
    assert.notEqual(play.phase, "hawk");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "nest") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "nest-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "nest-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift + 1.8)) < 3, "she holds the nest after the sit on the stile");
    }
    if (play.phase === "nest-off") {
      assert.equal(play.anim, "walk");
    }
  }
  assert.ok(seen.has("nest-on"));
  assert.ok(seen.has("nest"));
  assert.ok(seen.has("nest-hold"));
  assert.ok(seen.has("nest-off"));
  assert.ok(!seen.has("bore"), "Column never uses Auger bore");
  assert.ok(!seen.has("gnaw"), "Column never uses Dam gnaw");
  assert.ok(!seen.has("dig"), "Column never uses Bank dig");
  assert.ok(!seen.has("freeze"), "Column never uses Twig freeze");
  assert.ok(!seen.has("hawk"), "Column never uses Dart hawk");
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});
test("a moved window refits Column's timber-gallery nest; sleep, card, and hide abort; Column never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "carpenter_ant", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "nest"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "nest");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "nest");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "nest-off");
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
    "Twig leftover freezes a sash muntin as a pencil stem; sixth leftover of the remaining hive den done; Dart leftover still hawks a lamp-side air as prey air; fifth leftover of the remaining hive den done; Spark leftover still glows a lower sash light as ink dusk; fourth leftover of the remaining hive den done; Ghost leftover still weeks a lamp-side glass as lamp dusk; third leftover of the remaining hive den done; shore ten is closed; next leftover is Column;",
    "Column leftover nests a sash stile as a timber gallery; seventh leftover of the remaining hive den done; Twig leftover still freezes a sash muntin as a pencil stem; sixth leftover of the remaining hive den done; Dart leftover still hawks a lamp-side air as prey air; fifth leftover of the remaining hive den done; Spark leftover still glows a lower sash light as ink dusk; fourth leftover of the remaining hive den done; Ghost leftover still weeks a lamp-side glass as lamp dusk; third leftover of the remaining hive den done; shore ten is closed; next leftover is Seven;",
    "house title",
)
house = must_replace(
    house,
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
  assert.equal(WP.playFor("carpenter_ant"), "nest");
  assert.equal(WP.NEST, "nest");
  assert.notEqual(WP.playFor("carpenter_ant"), "column");
  assert.notEqual(WP.playFor("carpenter_ant"), "bore");
  assert.notEqual(WP.playFor("carpenter_ant"), "trail");
  assert.notEqual(WP.playFor("carpenter_ant"), "chew");
  assert.notEqual(WP.playFor("carpenter_ant"), "scent");
  assert.notEqual(WP.playFor("carpenter_ant"), "carry");
  assert.notEqual(WP.playFor("carpenter_ant"), "glue");
  assert.notEqual(WP.playFor("carpenter_ant"), "freeze");
  assert.notEqual(WP.playFor("carpenter_ant"), "hawk");
  assert.notEqual(WP.playFor("carpenter_ant"), "road");
  assert.notEqual(WP.playFor("carpenter_ant"), "ant");
  assert.notEqual(WP.playFor("carpenter_ant"), "sill");
  assert.equal(WP.playFor("carpenter_bee"), "bore");
  assert.equal(WP.playFor("beaver"), "gnaw");
  assert.equal(WP.playFor("mining_bee"), "dig");
  assert.equal(WP.playFor("ladybird"), "sill");
});''',
    "house column nest",
)
save("desktop/renderer/leftover-house.test.cjs", house, hnl)
print("house ok")

mjs, mnl = load("web/scripts/window-play.test.mjs")
mjs = replace_all(
    mjs,
    'assert.equal(P.playFor("carpenter_ant"), "sill");',
    'assert.equal(P.playFor("ladybird"), "sill");',
    "mjs carpenter sill pins",
    6,
)

MJS_TEST = r'''
test("the demo window plate walks Column nest the same way", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /playFor/);
  assert.match(readFileSync(join(root, "src/lib/pets/insects.ts"), "utf8"), /key: "carpenter_ant"[\s\S]{0,80}slug: "column"/);
  assert.equal(P.playFor("carpenter_ant"), "nest");
  const target = P.pickTarget([WIN], 80, "carpenter_ant", WORK, 176);
  assert.ok(target);
  assert.equal(target.kind, "nest");
  assert.equal(target.side, "timbergallery");
  assert.equal(target.leave, "nested");
  assert.equal(Overlay.playFor("carpenter_ant"), "nest");
  assert.equal(P.NEST, "nest");
  assert.equal(Overlay.NEST, "nest");
  assert.notEqual(P.playFor("carpenter_ant"), "column");
  assert.notEqual(P.playFor("carpenter_ant"), "bore");
  assert.notEqual(P.playFor("carpenter_ant"), "trail");
  assert.notEqual(P.playFor("carpenter_ant"), "chew");
  assert.notEqual(P.playFor("carpenter_ant"), "scent");
  assert.notEqual(P.playFor("carpenter_ant"), "carry");
  assert.notEqual(P.playFor("carpenter_ant"), "glue");
  assert.notEqual(P.playFor("carpenter_ant"), "freeze");
  assert.notEqual(P.playFor("carpenter_ant"), "hawk");
  assert.notEqual(P.playFor("carpenter_ant"), "road");
  assert.notEqual(P.playFor("carpenter_ant"), "ant");
  assert.equal(P.playFor("carpenter_bee"), "bore");
  assert.equal(Overlay.playFor("carpenter_bee"), "bore");
  assert.equal(P.playFor("beaver"), "gnaw");
  assert.equal(Overlay.playFor("beaver"), "gnaw");
  assert.equal(P.playFor("mining_bee"), "dig");
  assert.equal(P.playFor("stick"), "freeze");
  assert.equal(P.playFor("darner"), "hawk");
  assert.equal(P.playFor("ladybird"), "sill");
  assert.equal(P.DUR.nestOn, Overlay.DUR.nestOn);
  assert.equal(P.DUR.nest, Overlay.DUR.nest);
  assert.equal(P.DUR.nestHold, Overlay.DUR.nestHold);
  assert.equal(P.DUR.nestOff, Overlay.DUR.nestOff);
  assert.ok(P.DUR.nestOn !== Overlay.DUR.boreOn);
  assert.ok(P.DUR.nestOn !== Overlay.DUR.digOn);
  assert.ok(P.DUR.nestOn !== Overlay.DUR.freezeOn);
  assert.ok(P.DUR.nestOn !== Overlay.DUR.hawkOn);
  const gallery = P.nestPoint(WIN, 176, WORK);
  const deskGallery = Overlay.nestPoint(WIN, Overlay.SPRITE, WORK);
  const bore = P.borePoint(WIN, 176, WORK);
  const muntin = P.freezePoint(WIN, 176, WORK);
  const air = P.hawkPoint(WIN, 176, WORK);
  assert.ok(Math.abs(gallery.x - deskGallery.x) < 1);
  assert.ok(Math.abs(gallery.lift - deskGallery.lift) < 1);
  assert.ok(gallery.lift > 8, "timber gallery, the sash stile");
  assert.ok(Math.abs(gallery.x - bore.x) > 20 || Math.abs(gallery.lift - bore.lift) > 8, "not Auger bore");
  assert.ok(Math.abs(gallery.x - muntin.x) > 20 || Math.abs(gallery.lift - muntin.lift) > 8, "not Twig freeze");
  assert.ok(Math.abs(gallery.x - air.x) > 20 || Math.abs(gallery.lift - air.lift) > 8, "not Dart hawk");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 160, height: 70 }], 80, "carpenter_ant", WORK, 176);
  assert.equal(tiny, null, "a real sash stile");
  const okNest = P.pickTarget([{ id: "nest", x: 200, y: 80, width: 188, height: 200 }], 80, "carpenter_ant", WORK, 176);
  assert.ok(okNest, "a real sash stile as a timber gallery");
  const walkOn = P.nestOnPath(0.25, { x: 40, lift: 0 }, { x: gallery.x, lift: gallery.lift });
  const deskWalk = Overlay.nestOnPath(0.25, { x: 40, lift: 0 }, { x: gallery.x, lift: gallery.lift });
  assert.equal(walkOn.x, deskWalk.x);
  assert.equal(walkOn.lift, deskWalk.lift);
  const pulse = P.nestPath(0.5);
  const deskPulse = Overlay.nestPath(0.5);
  assert.equal(pulse.x, deskPulse.x);
  assert.ok(Math.abs(pulse.rot) > 6, "sit the nest, the play");
  assert.ok(pulse.rot !== P.borePath(0.5).rot, "nest, not a bore");
  assert.ok(pulse.rot !== P.digPath(0.5).rot, "nest, not a dig");
  assert.ok(pulse.rot !== P.freezePath(0.5).rot, "nest, not a freeze");
  assert.ok(pulse.rot !== P.hawkPath(0.5).rot, "nest, not a hawk");
  const hold = P.nestHoldPath(0.5);
  const deskHold = Overlay.nestHoldPath(0.5);
  assert.equal(hold.x, deskHold.x);
  assert.equal(hold.lift, deskHold.lift);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, 176, { cmd: "idle" });
    if (play.phase === "nest") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "nest-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "nest-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift + 1.8)) < 3, "she holds the nest after the sit on the stile");
    }
  }
  assert.ok(seen.has("nest-on"));
  assert.ok(seen.has("nest"));
  assert.ok(seen.has("nest-hold"));
  assert.ok(seen.has("nest-off"));
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
});
'''

mjs = mjs.rstrip() + "\n" + MJS_TEST
save("web/scripts/window-play.test.mjs", mjs, mnl)
print("mjs ok")
