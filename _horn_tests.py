from pathlib import Path

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, got {n}\nOLD: {old[:180]!r}")
    return text.replace(old, new, 1)

def alln(text, old, new, expected, label):
    n = text.count(old)
    if n != expected:
        raise SystemExit(f"{label}: expected {expected}, got {n}")
    return text.replace(old, new)

CJS_TESTS = r'''
test("Horn forks a sash drip as a moss rim: walk onto the drip, sit the fork, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("chanterelle"), "fork");
  assert.equal(P.FORK, "fork");
  assert.notEqual(P.playFor("chanterelle"), "horn");
  assert.notEqual(P.playFor("chanterelle"), "hollow");
  assert.notEqual(P.playFor("chanterelle"), "warts");
  assert.notEqual(P.playFor("chanterelle"), "shelf");
  assert.notEqual(P.playFor("chanterelle"), "ridge");
  assert.notEqual(P.playFor("chanterelle"), "flush");
  assert.notEqual(P.playFor("chanterelle"), "gold");
  assert.notEqual(P.playFor("chanterelle"), "glow");
  assert.notEqual(P.playFor("chanterelle"), "drink");
  assert.notEqual(P.playFor("chanterelle"), "sill");
  assert.equal(P.playFor("morel"), "hollow");
  assert.equal(P.HOLLOW, "hollow");
  assert.equal(P.playFor("fly_agaric"), "warts");
  assert.equal(P.WARTS, "warts");
  assert.equal(P.playFor("oyster"), "shelf");
  assert.equal(P.SHELF, "shelf");
  assert.equal(P.playFor("leech"), "drink");
  assert.equal(P.DRINK, "drink");
  assert.equal(P.playFor("ginkgo"), "gold");
  assert.equal(P.GOLD, "gold");
  assert.equal(P.playFor("firefly"), "glow");
  assert.equal(P.GLOW, "glow");
  assert.equal(P.playFor("cyber_dragon"), "ridge");
  assert.equal(P.RIDGE, "ridge");
  assert.equal(P.playFor("turkey_tail"), "sill");
  const target = P.pickTarget([WIN], 80, "chanterelle", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "fork");
  assert.equal(target.side, "mossrim");
  assert.equal(target.leave, "forked");
  assert.notEqual(target.kind, "drink");
  assert.notEqual(target.kind, "hollow");
  assert.notEqual(target.kind, "warts");
  assert.notEqual(target.kind, "shelf");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift >= 0, "she forks a sash drip as a moss rim");
  assert.ok(P.DUR.forkHold > P.DUR.fork * 1.2, "the hold is the sit; fork is the tell");
  assert.ok(P.DUR.forkOn > 1.0, "a walk onto the drip, not the drink");
  assert.ok(P.DUR.forkOn !== P.DUR.drinkOn);
  assert.ok(P.DUR.forkOn !== P.DUR.hollowOn);
  assert.ok(P.DUR.forkOn !== P.DUR.wartsOn);
  assert.ok(P.DUR.forkOn !== P.DUR.shelfOn);
  assert.ok(P.DUR.forkOn !== P.DUR.goldOn);
  assert.ok(P.DUR.forkOn !== P.DUR.glowOn);
  assert.ok(P.DUR.forkOn !== P.DUR.sillHop);
  assert.ok(P.DUR.fork !== P.DUR.drink);
  assert.ok(P.DUR.fork !== P.DUR.hollow);
  assert.ok(P.DUR.fork !== P.DUR.warts);
  assert.ok(P.DUR.forkHold !== P.DUR.drinkHold);
  assert.ok(P.DUR.forkOff !== P.DUR.hollowOff);
  const rim = P.forkPoint(WIN, P.SPRITE, WORK);
  const drip = P.drinkPoint(WIN, P.SPRITE, WORK);
  const well = P.hollowPoint(WIN, P.SPRITE, WORK);
  const cup = P.wartsPoint(WIN, P.SPRITE, WORK);
  const timber = P.shelfPoint(WIN, P.SPRITE, WORK);
  const horn = P.trailPoint(WIN, P.SPRITE, WORK);
  const glass = P.raspPoint(WIN, P.SPRITE, WORK);
  const cone = P.clampPoint(WIN, P.SPRITE, WORK);
  const jewel = P.blackPoint(WIN, P.SPRITE, WORK);
  assert.ok(rim.lift >= 0, "the sash drip as moss rim, not the sky");
  assert.ok(Math.abs(rim.lift - drip.lift) < 8, "same sash drip furniture family as Latch");
  assert.ok(Math.abs(rim.x - drip.x) > 20, "same drip, not Latch's drink spot");
  assert.ok(Math.abs(rim.x - well.x) > 8 || Math.abs(rim.lift - well.lift) > 1, "not Lattice's sash-well hollow");
  assert.ok(Math.abs(rim.x - cup.x) > 8 || Math.abs(rim.lift - cup.lift) > 1, "not Cap's moss-cup warts");
  assert.ok(Math.abs(rim.x - timber.x) > 8 || Math.abs(rim.lift - timber.lift) > 1, "not Frill's timber-shelf shelf");
  assert.ok(Math.abs(rim.x - horn.x) > 8 || Math.abs(rim.lift - horn.lift) > 1, "not Eft's sash-horn moss saucer");
  assert.ok(Math.abs(rim.x - glass.x) > 8 || Math.abs(rim.lift - glass.lift) > 1, "not Whorl's glass-rim rasp");
  assert.ok(Math.abs(rim.x - cone.x) > 8 || Math.abs(rim.lift - cone.lift) > 1, "not Cone's glass-rim clamp");
  assert.ok(Math.abs(rim.x - jewel.x) > 8 || Math.abs(rim.lift - jewel.lift) > 1, "not Jewel's glass-rim black");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "chanterelle", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real sash drip, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 193, height: 176 }], 80, "chanterelle", WORK, P.SPRITE);
  assert.equal(short, null, "a real sash drip, not a thinner drip");
  const shortH = P.pickTarget([{ id: "shortH", x: 200, y: 80, width: 194, height: 175 }], 80, "chanterelle", WORK, P.SPRITE);
  assert.equal(shortH, null, "a real sash drip, not a shorter drip");
  const okFork = P.pickTarget([{ id: "fork", x: 200, y: 80, width: 194, height: 176 }], 80, "chanterelle", WORK, P.SPRITE);
  assert.ok(okFork, "a real sash drip as moss rim");
  const wellOnly = P.pickTarget([{ id: "well", x: 200, y: 80, width: 180, height: 200 }], 80, "chanterelle", WORK, P.SPRITE);
  assert.equal(wellOnly, null, "Lattice's sash well is not Horn's sash drip");
  const drinkOk = P.pickTarget([{ id: "drip", x: 200, y: 80, width: 194, height: 176 }], 80, "leech", WORK, P.SPRITE);
  assert.ok(drinkOk, "Latch still takes a sash drip");
  const walkOn = P.forkOnPath(0.25, { x: 40, lift: 0 }, { x: rim.x, lift: rim.lift });
  const drinkOn = P.drinkOnPath(0.25, { x: 40, lift: 0 }, { x: rim.x, lift: rim.lift });
  assert.ok(walkOn.lift >= 0, "she walks onto the drip as moss rim");
  assert.ok(walkOn.rot !== drinkOn.rot, "a walk onto the drip, not Latch drink");
  const forkPose = P.forkPath(0.3);
  const drinkPose = P.drinkPath(0.3);
  const hollowPose = P.hollowPath(0.3);
  const wartsPose = P.wartsPath(0.3);
  assert.ok(Math.abs(forkPose.lift) > 0.5 || Math.abs(forkPose.rot) > 1, "she sits the fork; fork is the tell");
  assert.ok(forkPose.rot !== drinkPose.rot, "fork, not drink");
  assert.ok(forkPose.rot !== hollowPose.rot, "fork, not hollow");
  assert.ok(forkPose.rot !== wartsPose.rot, "fork, not warts");
  const hold = P.forkHoldPath(0.5);
  assert.ok(Math.abs(hold.rot - 2.2) < 0.2, "she holds the sit in the fork");
  assert.ok(Math.abs(hold.x - 0.18) < 0.05, "she stays on the moss rim");
  assert.ok(hold.lift < 0, "sit the fork, a rim sit, not a drink pulse");
  const off0 = P.forkOffPath(0, { x: rim.x, lift: rim.lift - 0.73, rot: 2.2 }, { x: rim.x + 50, lift: 0 });
  const offMid = P.forkOffPath(0.5, { x: rim.x, lift: rim.lift - 0.73, rot: 2.2 }, { x: rim.x + 50, lift: 0 });
  const off1 = P.forkOffPath(1, { x: rim.x, lift: rim.lift - 0.73, rot: 2.2 }, { x: rim.x + 50, lift: 0 });
  assert.ok(Math.abs(off0.x - rim.x) < 2);
  assert.ok(Math.abs(offMid.x - rim.x) > 8, "a walk leave off the sash drip");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "drink");
    assert.notEqual(play.phase, "hollow");
    assert.notEqual(play.phase, "warts");
    assert.notEqual(play.phase, "shelf");
    assert.notEqual(play.phase, "gold");
    assert.notEqual(play.phase, "glow");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "fork") {
      assert.ok(play.lift !== undefined, "she forks on the sash drip");
    }
  }
  assert.ok(seen.has("fork-on"));
  assert.ok(seen.has("fork"));
  assert.ok(seen.has("fork-hold"));
  assert.ok(seen.has("fork-off"));
  assert.ok(seen.has("approach") || seen.has("walk") || seen.has("land"));
  assert.equal(windowIds.size, 1, "one window; bounds-only");
  assert.equal(play.phase, "done");
});

test("a moved window refits Horn's sash-drip fork; sleep, card, and hide abort; Horn never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "chanterelle", WORK, P.SPRITE);
  assert.ok(target);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "fork"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "fork");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "fork");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved sash drip");
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "fork-off");
  assert.equal(play.abort, true);
});
'''

MJS_TESTS = r'''
test("Horn forks a sash drip as a moss rim: walk onto the drip, sit the fork, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("chanterelle"), "fork");
  assert.equal(P.FORK, "fork");
  assert.notEqual(P.playFor("chanterelle"), "horn");
  assert.notEqual(P.playFor("chanterelle"), "hollow");
  assert.notEqual(P.playFor("chanterelle"), "warts");
  assert.notEqual(P.playFor("chanterelle"), "shelf");
  assert.notEqual(P.playFor("chanterelle"), "ridge");
  assert.notEqual(P.playFor("chanterelle"), "flush");
  assert.notEqual(P.playFor("chanterelle"), "gold");
  assert.notEqual(P.playFor("chanterelle"), "glow");
  assert.notEqual(P.playFor("chanterelle"), "sill");
  assert.equal(P.playFor("morel"), "hollow");
  assert.equal(P.HOLLOW, "hollow");
  assert.equal(P.playFor("fly_agaric"), "warts");
  assert.equal(P.playFor("oyster"), "shelf");
  assert.equal(P.playFor("leech"), "drink");
  assert.equal(P.playFor("ginkgo"), "gold");
  assert.equal(P.playFor("firefly"), "glow");
  assert.equal(P.playFor("cyber_dragon"), "ridge");
  assert.equal(P.playFor("turkey_tail"), "sill");
  assert.equal(Overlay.playFor("chanterelle"), "fork");
  const target = P.pickTarget([WIN], 80, "chanterelle", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "fork");
  assert.equal(target.side, "mossrim");
  assert.equal(target.leave, "forked");
  assert.ok(target.holdLift >= 0);
  assert.ok(P.DUR.forkHold > P.DUR.fork * 1.2);
  assert.ok(P.DUR.forkOn !== P.DUR.drinkOn);
  assert.ok(P.DUR.fork !== P.DUR.hollow);
  const rim = P.forkPoint(WIN, P.SPRITE, WORK);
  const drip = P.drinkPoint(WIN, P.SPRITE, WORK);
  assert.ok(Math.abs(rim.lift - drip.lift) < 8);
  assert.ok(Math.abs(rim.x - drip.x) > 20);
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "chanterelle", WORK, P.SPRITE);
  assert.equal(tiny, null);
  const okFork = P.pickTarget([{ id: "fork", x: 200, y: 80, width: 194, height: 176 }], 80, "chanterelle", WORK, P.SPRITE);
  assert.ok(okFork);
  const forkPose = P.forkPath(0.3);
  assert.ok(Math.abs(forkPose.lift) > 0.5 || Math.abs(forkPose.rot) > 1);
  const hold = P.forkHoldPath(0.5);
  assert.ok(Math.abs(hold.rot - 2.2) < 0.2);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "drink");
    assert.notEqual(play.phase, "hollow");
    assert.notEqual(play.phase, "warts");
  }
  assert.ok(seen.has("fork-on"));
  assert.ok(seen.has("fork"));
  assert.ok(seen.has("fork-hold"));
  assert.ok(seen.has("fork-off"));
  assert.equal(play.phase, "done");
});

test("a moved window refits Horn's sash-drip fork; sleep, card, and hide abort", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  const target = P.pickTarget([WIN], 200, "chanterelle", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "fork"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "fork");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "fork");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "fork-off");
  assert.equal(play.abort, true);
});

test("the overlay window plate walks Horn fork the same way", () => {
  assert.equal(Overlay.playFor("chanterelle"), "fork");
  assert.equal(P.playFor("chanterelle"), "fork");
  const target = P.pickTarget([WIN], 80, "chanterelle", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "fork");
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.ok(seen.has("fork"));
  assert.equal(play.phase, "done");
});
'''

cjs_path = Path("desktop/renderer/window-play.test.cjs")
cjs = cjs_path.read_text(encoding="utf-8")
cjs = alln(cjs, 'P.playFor("chanterelle"), "sill"', 'P.playFor("turkey_tail"), "sill"', 25, "cjs chanterelle sill")
cjs = once(cjs, 'P.pickTarget([WIN], 80, "chanterelle", WORK, P.SPRITE)', 'P.pickTarget([WIN], 80, "turkey_tail", WORK, P.SPRITE)', "cjs sill pick")
cjs = cjs.rstrip() + "\n" + CJS_TESTS + "\n"
cjs_path.write_text(cjs, encoding="utf-8", newline="\n")
print("cjs tests ok")

mjs_path = Path("web/scripts/window-play.test.mjs")
mjs = mjs_path.read_text(encoding="utf-8")
mjs = alln(mjs, 'P.playFor("chanterelle"), "sill"', 'P.playFor("turkey_tail"), "sill"', 25, "mjs chanterelle sill")
mjs = mjs.rstrip() + "\n" + MJS_TESTS + "\n"
mjs_path.write_text(mjs, encoding="utf-8", newline="\n")
print("mjs tests ok")

house_path = Path("desktop/renderer/leftover-house.test.cjs")
house = house_path.read_text(encoding="utf-8")
house = once(
    house,
    'test("Lattice leftover hollows a sash well as leaf mold; third leftover of the fungi den done;',
    'test("Horn leftover forks a sash drip as a moss rim; fourth leftover of the fungi den done; Lattice leftover still hollows a sash well as leaf mold; third leftover of the fungi den done;',
    "house title",
)
house = once(house, "next leftover is Horn;", "next leftover is Ring;", "house next")
house = alln(house, 'WP.playFor("chanterelle"), "sill"', 'WP.playFor("turkey_tail"), "sill"', 2, "house chanterelle sill")
house = once(
    house,
    '''  assert.equal(WP.playFor("tarantula"), "kick");
  assert.equal(WP.playFor("darner"), "hawk");
  assert.equal(WP.playFor("turkey_tail"), "sill");
});''',
    '''  assert.equal(WP.playFor("tarantula"), "kick");
  assert.equal(WP.playFor("darner"), "hawk");
  assert.equal(WP.playFor("chanterelle"), "fork");
  assert.equal(WP.FORK, "fork");
  assert.notEqual(WP.playFor("chanterelle"), "horn");
  assert.notEqual(WP.playFor("chanterelle"), "hollow");
  assert.notEqual(WP.playFor("chanterelle"), "warts");
  assert.notEqual(WP.playFor("chanterelle"), "shelf");
  assert.notEqual(WP.playFor("chanterelle"), "ridge");
  assert.notEqual(WP.playFor("chanterelle"), "flush");
  assert.notEqual(WP.playFor("chanterelle"), "gold");
  assert.notEqual(WP.playFor("chanterelle"), "glow");
  assert.notEqual(WP.playFor("chanterelle"), "sill");
  assert.equal(WP.playFor("morel"), "hollow");
  assert.equal(WP.HOLLOW, "hollow");
  assert.equal(WP.playFor("fly_agaric"), "warts");
  assert.equal(WP.playFor("oyster"), "shelf");
  assert.equal(WP.playFor("leech"), "drink");
  assert.equal(WP.playFor("ginkgo"), "gold");
  assert.equal(WP.playFor("firefly"), "glow");
  assert.equal(WP.playFor("cyber_dragon"), "ridge");
  assert.equal(WP.playFor("turkey_tail"), "sill");
});''',
    "house end asserts",
)
house_path.write_text(house, encoding="utf-8", newline="\n")
print("house tests ok")
print("chanterelle sill remaining cjs", cjs.count('playFor("chanterelle"), "sill"'), "mjs", mjs.count('playFor("chanterelle"), "sill"'), "house", house.count('playFor("chanterelle"), "sill"'))
print("chanterelle fork cjs", cjs.count('playFor("chanterelle"), "fork"'), "house", house.count('playFor("chanterelle"), "fork"'))
print("turkey_tail sill cjs", cjs.count('playFor("turkey_tail"), "sill"'), "house", house.count('playFor("turkey_tail"), "sill"'))
print("next leftover is Ring", house.count("next leftover is Ring"))
