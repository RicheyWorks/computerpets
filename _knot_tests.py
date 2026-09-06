# -*- coding: utf-8 -*-
from pathlib import Path

HERE = Path(r"C:\Users\730ri\projects\ComputerPets")

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit("%s: expected 1, got %d\nOLD START: %r" % (label, n, old[:280]))
    return text.replace(old, new, 1)

TEST_BLOCK = r'''
test("Knot leftover manys a window stool as a paperweight: walk onto the stool, sit the colony, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("nexus"), "many");
  assert.equal(P.MANY, "many");
  assert.notEqual(P.playFor("nexus"), "knot");
  assert.notEqual(P.playFor("nexus"), "nexus");
  assert.notEqual(P.playFor("nexus"), "count");
  assert.notEqual(P.playFor("nexus"), "rim");
  assert.notEqual(P.playFor("nexus"), "dusk");
  assert.notEqual(P.playFor("nexus"), "week");
  assert.notEqual(P.playFor("nexus"), "facet");
  assert.notEqual(P.playFor("nexus"), "float");
  assert.notEqual(P.playFor("nexus"), "bury");
  assert.notEqual(P.playFor("nexus"), "sill");
  assert.equal(P.playFor("terminator"), "rim");
  assert.equal(P.RIM, "rim");
  assert.equal(P.playFor("venus_flytrap"), "count");
  assert.equal(P.COUNT, "count");
  assert.equal(P.playFor("squirrel"), "bury");
  assert.equal(P.BURY, "bury");
  assert.equal(P.playFor("walleye"), "dusk");
  assert.equal(P.DUSK, "dusk");
  assert.equal(P.playFor("silica"), "facet");
  assert.equal(P.FACET, "facet");
  assert.equal(P.playFor("nimbus"), "float");
  assert.equal(P.FLOAT, "float");
  assert.equal(P.playFor("halovore"), "sill");
  const target = P.pickTarget([WIN], 80, "nexus", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "many");
  assert.equal(target.side, "paperweight");
  assert.equal(target.leave, "manyed");
  assert.notEqual(target.kind, "knot");
  assert.notEqual(target.kind, "nexus");
  assert.notEqual(target.kind, "count");
  assert.notEqual(target.kind, "rim");
  assert.notEqual(target.kind, "bury");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift >= 0, "it manys a window stool as a paperweight");
  assert.ok(P.DUR.manyHold > P.DUR.many * 1.2, "the hold is the sit; many is the tell");
  assert.ok(P.DUR.manyOn > 1.0, "a walk onto the stool, not a cling");
  assert.ok(P.DUR.manyOn !== P.DUR.rimOn);
  assert.ok(P.DUR.manyOn !== P.DUR.countOn);
  assert.ok(P.DUR.manyOn !== P.DUR.buryOn);
  assert.ok(P.DUR.manyOn !== P.DUR.duskOn);
  assert.ok(P.DUR.manyOn !== P.DUR.facetOn);
  assert.ok(P.DUR.manyOn !== P.DUR.floatOn);
  assert.ok(P.DUR.manyOn !== P.DUR.sillHop);
  assert.ok(P.DUR.many !== P.DUR.rim);
  assert.ok(P.DUR.many !== P.DUR.count);
  assert.ok(P.DUR.many !== P.DUR.bury);
  assert.ok(P.DUR.manyHold !== P.DUR.rimHold);
  assert.ok(P.DUR.manyOff !== P.DUR.rimOff);
  const many = P.manyPoint(WIN, P.SPRITE, WORK);
  const bury = P.buryPoint(WIN, P.SPRITE, WORK);
  const count = P.countPoint(WIN, P.SPRITE, WORK);
  const rim = P.rimPoint(WIN, P.SPRITE, WORK);
  const dusk = P.duskPoint(WIN, P.SPRITE, WORK);
  const ink = P.facetPoint(WIN, P.SPRITE, WORK);
  const bowl = P.floatPoint(WIN, P.SPRITE, WORK);
  assert.ok(many.lift >= 0, "the window stool as a paperweight, not the sky");
  assert.ok(Math.abs(many.x - bury.x) > 8 || Math.abs(many.lift - bury.lift) > 1, "not Cache oak-dish bury");
  assert.ok(Math.abs(many.x - count.x) > 8 || Math.abs(many.lift - count.lift) > 1, "not Snap meeting-rail count");
  assert.ok(Math.abs(many.x - rim.x) > 8 || Math.abs(many.lift - rim.lift) > 1, "not Dusk lamp-edge stile");
  assert.ok(Math.abs(many.x - dusk.x) > 8 || Math.abs(many.lift - dusk.lift) > 1, "not Night dusk-run");
  assert.ok(Math.abs(many.x - ink.x) > 8 || Math.abs(many.lift - ink.lift) > 1, "not Shard sash-gap inkstone");
  assert.ok(Math.abs(many.x - bowl.x) > 8 || Math.abs(many.lift - bowl.lift) > 1, "not Nimbus methane bowl");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "nexus", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real window stool, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 192, height: 160 }], 80, "nexus", WORK, P.SPRITE);
  assert.equal(short, null, "a real window stool, not a thinner frame");
  const okMany = P.pickTarget([{ id: "many", x: 200, y: 80, width: 194, height: 162 }], 80, "nexus", WORK, P.SPRITE);
  assert.ok(okMany, "a real window stool as a paperweight");
  const buryOk = P.pickTarget([{ id: "bury", x: 200, y: 80, width: 194, height: 162 }], 80, "squirrel", WORK, P.SPRITE);
  assert.ok(buryOk, "Cache still takes an oak-dish stool");
  const countOk = P.pickTarget([{ id: "count", x: 200, y: 80, width: 188, height: 202 }], 80, "venus_flytrap", WORK, P.SPRITE);
  assert.ok(countOk, "Snap still takes a meeting-rail wetland cup");
  const rimOk = P.pickTarget([{ id: "rim", x: 200, y: 80, width: 204, height: 224 }], 80, "terminator", WORK, P.SPRITE);
  assert.ok(rimOk, "Dusk still takes a lamp-side stile lamp-edge");
  const duskOk = P.pickTarget([{ id: "dusk", x: 200, y: 80, width: 204, height: 224 }], 80, "walleye", WORK, P.SPRITE);
  assert.ok(duskOk, "Night still takes a lamp-side stile dusk run");
  const facetOk = P.pickTarget([{ id: "facet", x: 200, y: 80, width: 188, height: 198 }], 80, "silica", WORK, P.SPRITE);
  assert.ok(facetOk, "Shard still takes a sash-gap inkstone");
  const floatOk = P.pickTarget([{ id: "float", x: 200, y: 80, width: 194, height: 174 }], 80, "nimbus", WORK, P.SPRITE);
  assert.ok(floatOk, "Nimbus still takes a methane-bowl pane");
  const walkOn = P.manyOnPath(0.25, { x: 40, lift: 0 }, { x: many.x, lift: many.lift });
  const buryOn = P.buryOnPath(0.25, { x: 40, lift: 0 }, { x: many.x, lift: many.lift });
  assert.ok(walkOn.lift >= 0, "it walks onto the window stool as a paperweight");
  assert.ok(walkOn.rot !== buryOn.rot, "a walk onto the paperweight, not Cache bury");
  const manyPose = P.manyPath(0.3);
  const buryPose = P.buryPath(0.3);
  const countPose = P.countPath(0.3);
  const rimPose = P.rimPath(0.3);
  const duskPose = P.duskPath(0.3);
  const facetPose = P.facetPath(0.3);
  const floatPose = P.floatPath(0.3);
  assert.ok(Math.abs(manyPose.lift) > 0.2 || Math.abs(manyPose.rot) > 0.8, "it manys once; many is the tell");
  assert.ok(manyPose.rot !== buryPose.rot, "many, not bury");
  assert.ok(manyPose.rot !== countPose.rot, "many, not count");
  assert.ok(manyPose.rot !== rimPose.rot, "many, not rim");
  assert.ok(manyPose.rot !== duskPose.rot, "many, not dusk");
  assert.ok(manyPose.rot !== facetPose.rot, "many, not facet");
  assert.ok(manyPose.rot !== floatPose.rot, "many, not float");
  const hold = P.manyHoldPath(0.5);
  assert.ok(Math.abs(hold.rot - 2.9) < 0.2, "it holds the sit on the paperweight");
  assert.ok(Math.abs(hold.x - 1.28) < 0.05, "it stays on the paperweight");
  assert.ok(hold.lift > 0, "sit the colony of the stool, not a bury sink");
  const off0 = P.manyOffPath(0, { x: many.x, lift: many.lift + 0.88, rot: 2.9 }, { x: many.x + 50, lift: 0 });
  const offMid = P.manyOffPath(0.5, { x: many.x, lift: many.lift + 0.88, rot: 2.9 }, { x: many.x + 50, lift: 0 });
  const off1 = P.manyOffPath(1, { x: many.x, lift: many.lift + 0.88, rot: 2.9 }, { x: many.x + 50, lift: 0 });
  assert.ok(Math.abs(off0.x - many.x) < 2);
  assert.ok(Math.abs(offMid.x - many.x) > 8, "a walk leave off the paperweight");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "bury");
    assert.notEqual(play.phase, "count");
    assert.notEqual(play.phase, "rim");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "many") {
      assert.ok(play.lift !== undefined, "it manys on the window stool");
    }
  }
  assert.ok(seen.has("many-on"));
  assert.ok(seen.has("many"));
  assert.ok(seen.has("many-hold"));
  assert.ok(seen.has("many-off"));
  assert.ok(seen.has("approach") || seen.has("walk") || seen.has("land"));
  assert.equal(windowIds.size, 1, "one window; bounds-only");
  assert.equal(play.phase, "done");
});

test("a moved window refits Knot's paperweight many; sleep, card, and hide abort; Knot never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "nexus", WORK, P.SPRITE);
  assert.ok(target);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "many"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "many");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "many");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved paperweight");
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "many-off");
  assert.equal(play.abort, true);
});
'''

def pin_generic(text, label):
    old = 'playFor("nexus"), "sill"'
    new = 'playFor("halovore"), "sill"'
    n = text.count(old)
    if n < 1:
        raise SystemExit("%s: no nexus sill pins" % label)
    text = text.replace(old, new)
    print(label, "sill pins", n)
    old_pick = 'pickTarget([WIN], 80, "nexus"'
    new_pick = 'pickTarget([WIN], 80, "halovore"'
    n2 = text.count(old_pick)
    if n2:
        text = text.replace(old_pick, new_pick)
        print(label, "other-guests picks", n2)
    return text

def append_tests(path):
    text = path.read_text(encoding="utf-8")
    text = pin_generic(text, path.name)
    if 'test("Knot leftover manys a window stool as a paperweight' in text:
        print(path.name, "knot tests already")
        return
    text = text.rstrip() + "\n" + TEST_BLOCK
    if not text.endswith("\n"):
        text += "\n"
    path.write_text(text, encoding="utf-8", newline="\n")
    print(path.name, "tests appended")

cjs = HERE / "desktop" / "renderer" / "window-play.test.cjs"
mjs = HERE / "web" / "scripts" / "window-play.test.mjs"
append_tests(cjs)
append_tests(mjs)

house = HERE / "desktop" / "renderer" / "leftover-house.test.cjs"
ht = house.read_text(encoding="utf-8")
ht = once(
    ht,
    'test("Dusk leftover rims a lamp-side stile as a lamp-edge; fifth leftover of the far den done;',
    'test("Knot leftover manys a window stool as a paperweight; sixth leftover of the far den done; Dusk leftover still rims a lamp-side stile as a lamp-edge; fifth leftover of the far den done;',
    "house title start",
)
n_next = ht.count("next leftover is Knot")
if n_next != 1:
    raise SystemExit("house next leftover is Knot: expected 1, got %d" % n_next)
ht = ht.replace("next leftover is Knot", "next leftover is Brine")
ht = pin_generic(ht, "leftover-house")
knot_asserts = (
    '  assert.equal(WP.playFor("nexus"), "many");\n'
    '  assert.equal(WP.MANY, "many");\n'
    '  assert.notEqual(WP.playFor("nexus"), "knot");\n'
    '  assert.notEqual(WP.playFor("nexus"), "nexus");\n'
    '  assert.notEqual(WP.playFor("nexus"), "count");\n'
    '  assert.notEqual(WP.playFor("nexus"), "rim");\n'
    '  assert.notEqual(WP.playFor("nexus"), "dusk");\n'
    '  assert.notEqual(WP.playFor("nexus"), "sill");\n'
    '  assert.equal(WP.playFor("venus_flytrap"), "count");\n'
    '  assert.equal(WP.playFor("terminator"), "rim");\n'
)
term_block = '  assert.equal(WP.playFor("terminator"), "rim");\n  assert.equal(WP.RIM, "rim");'
ht = once(ht, term_block, knot_asserts + term_block, "house knot asserts")
house.write_text(ht, encoding="utf-8", newline="\n")
print("leftover-house updated")
