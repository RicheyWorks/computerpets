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
    'const target = P.pickTarget([WIN], 80, "ladybird", WORK, P.SPRITE);',
    'const target = P.pickTarget([WIN], 80, "mantis", WORK, P.SPRITE);',
    "cjs generic sill pin",
)
cjs = replace_all(
    cjs,
    'assert.equal(P.playFor("ladybird"), "sill");',
    'assert.equal(P.playFor("mantis"), "sill");',
    "cjs ladybird sill pins",
    7,
)

CJS_TESTS = r'''
test("Seven spots a window-box leaf as a leaf dish: walk onto the leaf, sit the spot, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("ladybird"), "spot");
  assert.equal(P.SPOT, "spot");
  assert.notEqual(P.playFor("ladybird"), "seven");
  assert.notEqual(P.playFor("ladybird"), "hunt");
  assert.notEqual(P.playFor("ladybird"), "count");
  assert.notEqual(P.playFor("ladybird"), "nest");
  assert.notEqual(P.playFor("ladybird"), "freeze");
  assert.notEqual(P.playFor("ladybird"), "hawk");
  assert.notEqual(P.playFor("ladybird"), "bore");
  assert.notEqual(P.playFor("ladybird"), "trail");
  assert.notEqual(P.playFor("ladybird"), "lady");
  assert.notEqual(P.playFor("ladybird"), "aphid");
  assert.notEqual(P.playFor("ladybird"), "beetle");
  assert.notEqual(P.playFor("ladybird"), "sill");
  assert.equal(P.playFor("house_centipede"), "hunt");
  assert.equal(P.HUNT, "hunt");
  assert.equal(P.playFor("leafcutter_bee"), "snip");
  assert.equal(P.SNIP, "snip");
  assert.equal(P.playFor("bumblebee"), "forage");
  assert.equal(P.FORAGE, "forage");
  assert.equal(P.playFor("hummingbird"), "sip");
  assert.equal(P.playFor("honeybee"), "waggle");
  assert.equal(P.WAGGLE, "waggle");
  assert.equal(P.playFor("carpenter_ant"), "nest");
  assert.equal(P.NEST, "nest");
  assert.equal(P.playFor("mantis"), "sill");
  assert.equal(P.DUR.nestOn, 2.84, "Column nest durations stay");
  assert.equal(P.DUR.huntOn, P.DUR.huntOn, "Haste hunt durations stay");
  assert.equal(P.DUR.snipOn, P.DUR.snipOn, "Disc snip durations stay");
  const target = P.pickTarget([WIN], 80, "ladybird", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "spot");
  assert.equal(target.side, "leafdish");
  assert.equal(target.leave, "spotted");
  assert.notEqual(target.kind, "seven");
  assert.notEqual(target.kind, "hunt");
  assert.notEqual(target.kind, "count");
  assert.notEqual(target.kind, "nest");
  assert.notEqual(target.kind, "freeze");
  assert.notEqual(target.kind, "hawk");
  assert.notEqual(target.kind, "bore");
  assert.notEqual(target.kind, "trail");
  assert.notEqual(target.kind, "lady");
  assert.notEqual(target.kind, "aphid");
  assert.notEqual(target.kind, "beetle");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift > 8, "she spots a window-box leaf as a leaf dish, not the floor");
  assert.ok(P.DUR.spotHold > P.DUR.spot * 0.9, "the hold is the spot; seven stays the count");
  assert.ok(P.DUR.spotOn > 1.0, "a walk onto the leaf, not the spot");
  assert.ok(P.DUR.spotOn !== P.DUR.huntOn);
  assert.ok(P.DUR.spotOn !== P.DUR.snipOn);
  assert.ok(P.DUR.spotOn !== P.DUR.forageOn);
  assert.ok(P.DUR.spotOn !== P.DUR.sipOn);
  assert.ok(P.DUR.spotOn !== P.DUR.waggleOn);
  assert.ok(P.DUR.spotOn !== P.DUR.nestOn);
  assert.ok(P.DUR.spotOn !== P.DUR.sillHop);
  assert.ok(P.DUR.spot !== P.DUR.hunt);
  assert.ok(P.DUR.spot !== P.DUR.snip);
  assert.ok(P.DUR.spot !== P.DUR.forage);
  assert.ok(P.DUR.spotHold !== P.DUR.huntHold);
  assert.ok(P.DUR.spotHold !== P.DUR.snipHold);
  assert.ok(P.DUR.spotOff !== P.DUR.huntOff);
  assert.ok(P.DUR.spotOff !== P.DUR.sillDown);
  const dish = P.spotPoint(WIN, P.SPRITE, WORK);
  const snip = P.snipPoint(WIN, P.SPRITE, WORK);
  const forage = P.foragePoint(WIN, P.SPRITE, WORK);
  const sip = P.sipPoint(WIN, P.SPRITE, WORK);
  const hunt = P.huntPoint(WIN, P.SPRITE, WORK);
  const waggle = P.wagglePoint(WIN, P.SPRITE, WORK);
  assert.ok(dish.lift > 8, "the window-box leaf as a leaf dish, not the floor");
  assert.ok(Math.abs(dish.x - snip.x) > 20 || Math.abs(dish.lift - snip.lift) > 4, "not Disc's window-box leaf foliage snip");
  assert.ok(Math.abs(dish.x - forage.x) > 20 || Math.abs(dish.lift - forage.lift) > 4, "not Thrum's window-box meadow forage");
  assert.ok(Math.abs(dish.x - sip.x) > 20 || Math.abs(dish.lift - sip.lift) > 4, "not Sip's window-box bloom sip");
  assert.ok(Math.abs(dish.x - hunt.x) > 20 || Math.abs(dish.lift - hunt.lift) > 4, "not Haste's sash-jamb crack hunt");
  assert.ok(Math.abs(dish.x - waggle.x) > 20 || Math.abs(dish.lift - waggle.lift) > 4, "not Comb's sill-pan wax waggle");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "ladybird", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real window-box leaf, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 180, height: 160 }], 80, "ladybird", WORK, P.SPRITE);
  assert.equal(short, null, "a real window-box leaf, not a short sash");
  const thin = P.pickTarget([{ id: "thin", x: 200, y: 80, width: 186, height: 168 }], 80, "ladybird", WORK, P.SPRITE);
  assert.equal(thin, null, "a real window-box leaf, not a thinner pane");
  const okSpot = P.pickTarget([{ id: "spot", x: 200, y: 80, width: 186, height: 170 }], 80, "ladybird", WORK, P.SPRITE);
  assert.ok(okSpot, "a real window-box leaf as a leaf dish");
  const discOk = P.pickTarget([{ id: "snip", x: 200, y: 80, width: 190, height: 166 }], 80, "leafcutter_bee", WORK, P.SPRITE);
  assert.ok(discOk, "Disc still takes a foliage leaf");
  const sevenNo = P.pickTarget([{ id: "snip", x: 200, y: 80, width: 190, height: 166 }], 80, "ladybird", WORK, P.SPRITE);
  assert.equal(sevenNo, null, "Seven needs a taller leaf dish, not Disc's snip gate");
  const walkOn = P.spotOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  const snipOn = P.snipOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  const forageOn = P.forageOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  const huntOn = P.huntOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  const waggleOn = P.waggleOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  assert.ok(walkOn.lift > 0, "she walks onto the leaf as a leaf dish");
  assert.ok(walkOn.rot !== snipOn.rot, "a walk onto the leaf, not Disc snip");
  assert.ok(walkOn.rot !== forageOn.rot, "a walk onto the leaf, not Thrum forage");
  assert.ok(walkOn.rot !== huntOn.rot, "a walk onto the leaf, not Haste hunt");
  assert.ok(walkOn.rot !== waggleOn.rot, "a walk onto the leaf, not Comb waggle");
  const spotPose = P.spotPath(0.5);
  const snipPose = P.snipPath(0.5);
  const foragePose = P.foragePath(0.5);
  const huntPose = P.huntPath(0.5);
  const wagglePose = P.wagglePath(0.5);
  assert.ok(Math.abs(spotPose.rot) > 6, "she sits the spot; seven is the tell");
  assert.ok(spotPose.rot !== snipPose.rot, "spot, not a snip");
  assert.ok(spotPose.rot !== foragePose.rot, "spot, not a forage");
  assert.ok(spotPose.rot !== huntPose.rot, "spot, not a hunt");
  assert.ok(spotPose.rot !== wagglePose.rot, "spot, not a waggle");
  const hold = P.spotHoldPath(0.5);
  assert.ok(Math.abs(hold.rot - 12.8) < 0.2, "she holds after the spot, spot still the tell");
  assert.ok(Math.abs(hold.x - 1.8) < 0.4, "she stays on the window-box leaf dish");
  assert.ok(hold.lift > 0.5, "furniture until she walks after the spot");
  const off0 = P.spotOffPath(0, { x: dish.x, lift: dish.lift, rot: 12.8 }, { x: dish.x + 50, lift: 0 });
  const offMid = P.spotOffPath(0.5, { x: dish.x, lift: dish.lift, rot: 12.8 }, { x: dish.x + 50, lift: 0 });
  const off1 = P.spotOffPath(1, { x: dish.x, lift: dish.lift, rot: 12.8 }, { x: dish.x + 50, lift: 0 });
  assert.ok(Math.abs(off0.x - dish.x) < 2);
  assert.ok(Math.abs(offMid.x - dish.x) > 8, "a walk leave off the window-box leaf");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "hunt");
    assert.notEqual(play.phase, "snip");
    assert.notEqual(play.phase, "forage");
    assert.notEqual(play.phase, "sip");
    assert.notEqual(play.phase, "waggle");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "spot") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "spot-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "spot-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift + 0.9)) < 3, "she holds the spot after the sit on the leaf");
    }
    if (play.phase === "spot-off") {
      assert.equal(play.anim, "walk");
    }
  }
  assert.ok(seen.has("spot-on"));
  assert.ok(seen.has("spot"));
  assert.ok(seen.has("spot-hold"));
  assert.ok(seen.has("spot-off"));
  assert.ok(!seen.has("hunt"), "Seven never uses Haste hunt");
  assert.ok(!seen.has("snip"), "Seven never uses Disc snip");
  assert.ok(!seen.has("forage"), "Seven never uses Thrum forage");
  assert.ok(!seen.has("sip"), "Seven never uses Sip sip");
  assert.ok(!seen.has("waggle"), "Seven never uses Comb waggle");
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});
test("a moved window refits Seven's leaf-dish spot; sleep, card, and hide abort; Seven never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "ladybird", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "spot"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "spot");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "spot");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "spot-off");
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
    "Column leftover nests a sash stile as a timber gallery; seventh leftover of the remaining hive den done; Twig leftover still freezes a sash muntin as a pencil stem; sixth leftover of the remaining hive den done; Dart leftover still hawks a lamp-side air as prey air; fifth leftover of the remaining hive den done; Spark leftover still glows a lower sash light as ink dusk; fourth leftover of the remaining hive den done; Ghost leftover still weeks a lamp-side glass as lamp dusk; third leftover of the remaining hive den done; shore ten is closed; next leftover is Seven;",
    "Seven leftover spots a window-box leaf as a leaf dish; eighth leftover of the remaining hive den done; Column leftover still nests a sash stile as a timber gallery; seventh leftover of the remaining hive den done; Twig leftover still freezes a sash muntin as a pencil stem; sixth leftover of the remaining hive den done; Dart leftover still hawks a lamp-side air as prey air; fifth leftover of the remaining hive den done; Spark leftover still glows a lower sash light as ink dusk; fourth leftover of the remaining hive den done; Ghost leftover still weeks a lamp-side glass as lamp dusk; third leftover of the remaining hive den done; shore ten is closed; next leftover is Fold;",
    "house title",
)
house = must_replace(
    house,
    '''  assert.equal(WP.playFor("carpenter_ant"), "nest");
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
    '''  assert.equal(WP.playFor("carpenter_ant"), "nest");
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
  assert.equal(WP.playFor("ladybird"), "spot");
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
  assert.equal(WP.playFor("leafcutter_bee"), "snip");
  assert.equal(WP.playFor("bumblebee"), "forage");
  assert.equal(WP.playFor("hummingbird"), "sip");
  assert.equal(WP.playFor("honeybee"), "waggle");
  assert.equal(WP.playFor("mantis"), "sill");
});''',
    "house seven spot",
)
save("desktop/renderer/leftover-house.test.cjs", house, hnl)
print("house ok")

mjs, mnl = load("web/scripts/window-play.test.mjs")
mjs = replace_all(
    mjs,
    'assert.equal(P.playFor("ladybird"), "sill");',
    'assert.equal(P.playFor("mantis"), "sill");',
    "mjs ladybird sill pins",
    7,
)

MJS_TEST = r'''
test("the demo window plate walks Seven spot the same way", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /playFor/);
  assert.match(readFileSync(join(root, "src/lib/pets/insects.ts"), "utf8"), /key: "ladybird"[\s\S]{0,80}slug: "seven"/);
  assert.equal(P.playFor("ladybird"), "spot");
  const target = P.pickTarget([WIN], 80, "ladybird", WORK, 176);
  assert.ok(target);
  assert.equal(target.kind, "spot");
  assert.equal(target.side, "leafdish");
  assert.equal(target.leave, "spotted");
  assert.equal(Overlay.playFor("ladybird"), "spot");
  assert.equal(P.SPOT, "spot");
  assert.equal(Overlay.SPOT, "spot");
  assert.notEqual(P.playFor("ladybird"), "seven");
  assert.notEqual(P.playFor("ladybird"), "hunt");
  assert.notEqual(P.playFor("ladybird"), "count");
  assert.notEqual(P.playFor("ladybird"), "nest");
  assert.notEqual(P.playFor("ladybird"), "freeze");
  assert.notEqual(P.playFor("ladybird"), "hawk");
  assert.notEqual(P.playFor("ladybird"), "bore");
  assert.notEqual(P.playFor("ladybird"), "trail");
  assert.notEqual(P.playFor("ladybird"), "lady");
  assert.notEqual(P.playFor("ladybird"), "aphid");
  assert.notEqual(P.playFor("ladybird"), "beetle");
  assert.equal(P.playFor("house_centipede"), "hunt");
  assert.equal(Overlay.playFor("house_centipede"), "hunt");
  assert.equal(P.playFor("leafcutter_bee"), "snip");
  assert.equal(Overlay.playFor("leafcutter_bee"), "snip");
  assert.equal(P.playFor("bumblebee"), "forage");
  assert.equal(P.playFor("hummingbird"), "sip");
  assert.equal(P.playFor("honeybee"), "waggle");
  assert.equal(P.playFor("carpenter_ant"), "nest");
  assert.equal(P.playFor("mantis"), "sill");
  assert.equal(P.DUR.spotOn, Overlay.DUR.spotOn);
  assert.equal(P.DUR.spot, Overlay.DUR.spot);
  assert.equal(P.DUR.spotHold, Overlay.DUR.spotHold);
  assert.equal(P.DUR.spotOff, Overlay.DUR.spotOff);
  assert.ok(P.DUR.spotOn !== Overlay.DUR.huntOn);
  assert.ok(P.DUR.spotOn !== Overlay.DUR.snipOn);
  assert.ok(P.DUR.spotOn !== Overlay.DUR.forageOn);
  assert.ok(P.DUR.spotOn !== Overlay.DUR.waggleOn);
  assert.ok(P.DUR.spotOn !== Overlay.DUR.nestOn);
  const dish = P.spotPoint(WIN, 176, WORK);
  const deskDish = Overlay.spotPoint(WIN, Overlay.SPRITE, WORK);
  const snip = P.snipPoint(WIN, 176, WORK);
  const hunt = P.huntPoint(WIN, 176, WORK);
  const waggle = P.wagglePoint(WIN, 176, WORK);
  assert.ok(Math.abs(dish.x - deskDish.x) < 1);
  assert.ok(Math.abs(dish.lift - deskDish.lift) < 1);
  assert.ok(dish.lift > 8, "leaf dish, the window-box leaf");
  assert.ok(Math.abs(dish.x - snip.x) > 20 || Math.abs(dish.lift - snip.lift) > 4, "not Disc snip");
  assert.ok(Math.abs(dish.x - hunt.x) > 20 || Math.abs(dish.lift - hunt.lift) > 4, "not Haste hunt");
  assert.ok(Math.abs(dish.x - waggle.x) > 20 || Math.abs(dish.lift - waggle.lift) > 4, "not Comb waggle");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 160, height: 70 }], 80, "ladybird", WORK, 176);
  assert.equal(tiny, null, "a real window-box leaf");
  const okSpot = P.pickTarget([{ id: "spot", x: 200, y: 80, width: 186, height: 170 }], 80, "ladybird", WORK, 176);
  assert.ok(okSpot, "a real window-box leaf as a leaf dish");
  const walkOn = P.spotOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  const deskWalk = Overlay.spotOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  assert.ok(Math.abs(walkOn.x - deskWalk.x) < 1);
  assert.ok(Math.abs(walkOn.rot - deskWalk.rot) < 0.01);
  const spotPose = P.spotPath(0.5);
  const deskSpot = Overlay.spotPath(0.5);
  assert.ok(Math.abs(spotPose.rot - deskSpot.rot) < 0.01);
  assert.ok(Math.abs(spotPose.rot) > 6, "spot is the tell");
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, 176, { cmd: "idle" });
  }
  assert.ok(seen.has("spot-on"));
  assert.ok(seen.has("spot"));
  assert.ok(seen.has("spot-hold"));
  assert.ok(seen.has("spot-off"));
  assert.equal(play.phase, "done");
  let desk = Overlay.beginPlay(Overlay.pickTarget([WIN], 80, "ladybird", WORK, Overlay.SPRITE), 80);
  const deskSeen = new Set();
  for (let i = 0; i < 2400 && desk.phase !== "done"; i++) {
    deskSeen.add(desk.phase);
    desk = Overlay.stepPlay(desk, 0.05, { x: desk.x, lift: desk.lift }, [WIN, WIN_B], WORK, Overlay.SPRITE, { cmd: "idle" });
  }
  assert.ok(deskSeen.has("spot-on"));
  assert.ok(deskSeen.has("spot"));
  assert.ok(deskSeen.has("spot-hold"));
  assert.ok(deskSeen.has("spot-off"));
  assert.equal(desk.phase, "done");
});
'''

if not mjs.rstrip().endswith("});"):
    raise SystemExit("mjs tail unexpected: " + repr(mjs.rstrip()[-40:]))
mjs = mjs.rstrip() + "\n" + MJS_TEST
save("web/scripts/window-play.test.mjs", mjs, mnl)
print("mjs ok")
