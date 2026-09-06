# -*- coding: utf-8 -*-
from pathlib import Path

HERE = Path(r"C:\Users\730ri\projects\ComputerPets")

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit("%s: expected 1, got %d\nOLD START: %r" % (label, n, old[:280]))
    return text.replace(old, new, 1)

TEST_BLOCK = r'''
test("Dusk leftover rims a lamp-side stile as a lamp-edge: walk onto the stile, sit the rim, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("terminator"), "rim");
  assert.equal(P.RIM, "rim");
  assert.notEqual(P.playFor("terminator"), "dusk");
  assert.notEqual(P.playFor("terminator"), "week");
  assert.notEqual(P.playFor("terminator"), "creep");
  assert.notEqual(P.playFor("terminator"), "facet");
  assert.notEqual(P.playFor("terminator"), "float");
  assert.notEqual(P.playFor("terminator"), "terminator");
  assert.notEqual(P.playFor("terminator"), "thirst");
  assert.notEqual(P.playFor("terminator"), "chord");
  assert.notEqual(P.playFor("terminator"), "ledge");
  assert.notEqual(P.playFor("terminator"), "sill");
  assert.equal(P.playFor("silica"), "facet");
  assert.equal(P.FACET, "facet");
  assert.equal(P.playFor("walleye"), "dusk");
  assert.equal(P.DUSK, "dusk");
  assert.equal(P.playFor("luna"), "week");
  assert.equal(P.WEEK, "week");
  assert.equal(P.playFor("nimbus"), "float");
  assert.equal(P.FLOAT, "float");
  assert.equal(P.playFor("potto"), "creep");
  assert.equal(P.CREEP, "creep");
  assert.equal(P.playFor("photovore"), "thirst");
  assert.equal(P.playFor("choir"), "chord");
  assert.equal(P.playFor("nexus"), "sill");
  const target = P.pickTarget([WIN], 80, "terminator", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "rim");
  assert.equal(target.side, "lampedge");
  assert.equal(target.leave, "rimmed");
  assert.notEqual(target.kind, "dusk");
  assert.notEqual(target.kind, "week");
  assert.notEqual(target.kind, "facet");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift >= 0, "it rims a lamp-side stile as a lamp-edge");
  assert.ok(P.DUR.rimHold > P.DUR.rim * 1.2, "the hold is the sit; rim is the tell");
  assert.ok(P.DUR.rimOn > 1.0, "a walk onto the stile, not a cling");
  assert.ok(P.DUR.rimOn !== P.DUR.duskOn);
  assert.ok(P.DUR.rimOn !== P.DUR.facetOn);
  assert.ok(P.DUR.rimOn !== P.DUR.floatOn);
  assert.ok(P.DUR.rimOn !== P.DUR.weekOn);
  assert.ok(P.DUR.rimOn !== P.DUR.thirstOn);
  assert.ok(P.DUR.rimOn !== P.DUR.sillHop);
  assert.ok(P.DUR.rim !== P.DUR.dusk);
  assert.ok(P.DUR.rim !== P.DUR.facet);
  assert.ok(P.DUR.rimHold !== P.DUR.duskHold);
  assert.ok(P.DUR.rimOff !== P.DUR.duskOff);
  const rim = P.rimPoint(WIN, P.SPRITE, WORK);
  const dusk = P.duskPoint(WIN, P.SPRITE, WORK);
  const week = P.weekPoint(WIN, P.SPRITE, WORK);
  const ink = P.facetPoint(WIN, P.SPRITE, WORK);
  const bowl = P.floatPoint(WIN, P.SPRITE, WORK);
  const glass = P.thirstPoint(WIN, P.SPRITE, WORK);
  const ledge = P.ledgePoint(WIN, P.SPRITE, WORK);
  assert.ok(rim.lift >= 0, "the lamp-side stile as a lamp-edge, not the sky");
  assert.ok(Math.abs(rim.x - dusk.x) > 0.5 || Math.abs(rim.lift - dusk.lift) > 1, "not Night's dusk-run tapetum");
  assert.ok(Math.abs(rim.x - week.x) > 8 || Math.abs(rim.lift - week.lift) > 1, "not Ghost's lamp-side glass week");
  assert.ok(Math.abs(rim.x - ink.x) > 8 || Math.abs(rim.lift - ink.lift) > 1, "not Shard's sash-gap inkstone");
  assert.ok(Math.abs(rim.x - bowl.x) > 8 || Math.abs(rim.lift - bowl.lift) > 1, "not Nimbus methane bowl");
  assert.ok(Math.abs(rim.x - glass.x) > 8 || Math.abs(rim.lift - glass.lift) > 1, "not Gleam lamp glass");
  assert.ok(Math.abs(rim.x - ledge.x) > 8 || Math.abs(rim.lift - ledge.lift) > 1, "not Miso's top ledge");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "terminator", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real lamp-side stile, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 202, height: 222 }], 80, "terminator", WORK, P.SPRITE);
  assert.equal(short, null, "a real lamp-side stile, not a thinner frame");
  const okRim = P.pickTarget([{ id: "rim", x: 200, y: 80, width: 204, height: 224 }], 80, "terminator", WORK, P.SPRITE);
  assert.ok(okRim, "a real lamp-side stile as a lamp-edge");
  const duskOk = P.pickTarget([{ id: "dusk", x: 200, y: 80, width: 204, height: 224 }], 80, "walleye", WORK, P.SPRITE);
  assert.ok(duskOk, "Night still takes a lamp-side stile dusk run");
  const weekOk = P.pickTarget([{ id: "week", x: 200, y: 80, width: 200, height: 200 }], 80, "luna", WORK, P.SPRITE);
  assert.ok(weekOk, "Ghost still takes lamp-side glass");
  const facetOk = P.pickTarget([{ id: "facet", x: 200, y: 80, width: 188, height: 198 }], 80, "silica", WORK, P.SPRITE);
  assert.ok(facetOk, "Shard still takes a sash-gap inkstone");
  const floatOk = P.pickTarget([{ id: "float", x: 200, y: 80, width: 194, height: 174 }], 80, "nimbus", WORK, P.SPRITE);
  assert.ok(floatOk, "Nimbus still takes a methane-bowl pane");
  const walkOn = P.rimOnPath(0.25, { x: 40, lift: 0 }, { x: rim.x, lift: rim.lift });
  const duskOn = P.duskOnPath(0.25, { x: 40, lift: 0 }, { x: rim.x, lift: rim.lift });
  assert.ok(walkOn.lift >= 0, "it walks onto the lamp-side stile as a lamp-edge");
  assert.ok(walkOn.rot !== duskOn.rot, "a walk onto the rim, not Night dusk");
  const rimPose = P.rimPath(0.3);
  const duskPose = P.duskPath(0.3);
  const weekPose = P.weekPath(0.3);
  const facetPose = P.facetPath(0.3);
  const floatPose = P.floatPath(0.3);
  assert.ok(Math.abs(rimPose.lift) > 0.2 || Math.abs(rimPose.rot) > 0.8, "it rims once; rim is the tell");
  assert.ok(rimPose.rot !== duskPose.rot, "rim, not dusk");
  assert.ok(rimPose.rot !== weekPose.rot, "rim, not week");
  assert.ok(rimPose.rot !== facetPose.rot, "rim, not facet");
  assert.ok(rimPose.rot !== floatPose.rot, "rim, not float");
  const hold = P.rimHoldPath(0.5);
  assert.ok(Math.abs(hold.rot - 3.3) < 0.2, "it holds the sit on the rim");
  assert.ok(Math.abs(hold.x - 1.65) < 0.05, "it stays on the rim");
  assert.ok(hold.lift > 0, "sit the rim of the stile, not a gap sink");
  const off0 = P.rimOffPath(0, { x: rim.x, lift: rim.lift + 1.12, rot: 3.3 }, { x: rim.x + 50, lift: 0 });
  const offMid = P.rimOffPath(0.5, { x: rim.x, lift: rim.lift + 1.12, rot: 3.3 }, { x: rim.x + 50, lift: 0 });
  const off1 = P.rimOffPath(1, { x: rim.x, lift: rim.lift + 1.12, rot: 3.3 }, { x: rim.x + 50, lift: 0 });
  assert.ok(Math.abs(off0.x - rim.x) < 2);
  assert.ok(Math.abs(offMid.x - rim.x) > 8, "a walk leave off the lamp-edge");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "dusk");
    assert.notEqual(play.phase, "week");
    assert.notEqual(play.phase, "facet");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "rim") {
      assert.ok(play.lift !== undefined, "it rims on the lamp-side stile");
    }
  }
  assert.ok(seen.has("rim-on"));
  assert.ok(seen.has("rim"));
  assert.ok(seen.has("rim-hold"));
  assert.ok(seen.has("rim-off"));
  assert.ok(seen.has("approach") || seen.has("walk") || seen.has("land"));
  assert.equal(windowIds.size, 1, "one window; bounds-only");
  assert.equal(play.phase, "done");
});

test("a moved window refits Dusk's lamp-edge rim; sleep, card, and hide abort; Dusk never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "terminator", WORK, P.SPRITE);
  assert.ok(target);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "rim"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "rim");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "rim");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved lamp-edge");
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "rim-off");
  assert.equal(play.abort, true);
});
'''

def pin_generic(text, label):
    old = 'playFor("terminator"), "sill"'
    new = 'playFor("nexus"), "sill"'
    n = text.count(old)
    if n < 1:
        raise SystemExit("%s: no terminator sill pins" % label)
    text = text.replace(old, new)
    print(label, "sill pins", n)
    old_pick = 'pickTarget([WIN], 80, "terminator"'
    new_pick = 'pickTarget([WIN], 80, "nexus"'
    n2 = text.count(old_pick)
    if n2:
        text = text.replace(old_pick, new_pick)
        print(label, "other-guests picks", n2)
    return text

def append_tests(path):
    text = path.read_text(encoding="utf-8")
    text = pin_generic(text, path.name)
    marker = 'test("a moved window refits Shard\'s inkstone facet; sleep, card, and hide abort; Shard never starts asleep"'
    if marker not in text:
        raise SystemExit("%s: shard abort test missing" % path.name)
    if 'test("Dusk leftover rims a lamp-side stile as a lamp-edge' in text:
        print(path.name, "dusk tests already")
        return
    idx = text.rfind(marker)
    end = text.find("});", idx)
    if end < 0:
        raise SystemExit("%s: shard abort test end missing" % path.name)
    end += 3
    text = text[:end] + "\n" + TEST_BLOCK + text[end:]
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
    'test("Shard leftover facets a sash gap as an inkstone; fourth leftover of the far den done;',
    'test("Dusk leftover rims a lamp-side stile as a lamp-edge; fifth leftover of the far den done; Shard leftover still facets a sash gap as an inkstone; fourth leftover of the far den done;',
    "house title start",
)
n_next = ht.count("next leftover is Dusk")
if n_next != 1:
    raise SystemExit("house next leftover is Dusk: expected 1, got %d" % n_next)
ht = ht.replace("next leftover is Dusk", "next leftover is Knot")
ht = pin_generic(ht, "leftover-house")
dusk_asserts = (
    '  assert.equal(WP.playFor("terminator"), "rim");\n'
    '  assert.equal(WP.RIM, "rim");\n'
    '  assert.notEqual(WP.playFor("terminator"), "dusk");\n'
    '  assert.notEqual(WP.playFor("terminator"), "week");\n'
    '  assert.notEqual(WP.playFor("terminator"), "creep");\n'
    '  assert.notEqual(WP.playFor("terminator"), "facet");\n'
    '  assert.notEqual(WP.playFor("terminator"), "float");\n'
    '  assert.notEqual(WP.playFor("terminator"), "terminator");\n'
    '  assert.notEqual(WP.playFor("terminator"), "sill");\n'
    '  assert.equal(WP.playFor("walleye"), "dusk");\n'
    '  assert.equal(WP.playFor("silica"), "facet");\n'
)
silica_block = '  assert.equal(WP.playFor("silica"), "facet");\n  assert.equal(WP.FACET, "facet");'
ht = once(ht, silica_block, dusk_asserts + silica_block, "house dusk asserts")
house.write_text(ht, encoding="utf-8", newline="\n")
print("leftover-house updated")