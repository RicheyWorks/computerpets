from pathlib import Path

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, got {n}\nOLD: {old[:160]!r}")
    return text.replace(old, new, 1)

def alln(text, old, new, expected, label):
    n = text.count(old)
    if n != expected:
        raise SystemExit(f"{label}: expected {expected}, got {n}")
    return text.replace(old, new)

CJS_TESTS = r'''
test("Lattice hollows a sash well as leaf mold: walk into the well, sit the hollow, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("morel"), "hollow");
  assert.equal(P.HOLLOW, "hollow");
  assert.notEqual(P.playFor("morel"), "lattice");
  assert.notEqual(P.playFor("morel"), "morel");
  assert.notEqual(P.playFor("morel"), "lean");
  assert.notEqual(P.playFor("morel"), "warts");
  assert.notEqual(P.playFor("morel"), "shelf");
  assert.notEqual(P.playFor("morel"), "cover");
  assert.notEqual(P.playFor("morel"), "kick");
  assert.notEqual(P.playFor("morel"), "bun");
  assert.notEqual(P.playFor("morel"), "pits");
  assert.notEqual(P.playFor("morel"), "sill");
  assert.equal(P.playFor("fly_agaric"), "warts");
  assert.equal(P.WARTS, "warts");
  assert.equal(P.playFor("oyster"), "shelf");
  assert.equal(P.SHELF, "shelf");
  assert.equal(P.playFor("moss"), "lean");
  assert.equal(P.LEAN, "lean");
  assert.equal(P.playFor("salamander"), "cover");
  assert.equal(P.playFor("tarantula"), "kick");
  assert.equal(P.playFor("ball_python"), "bun");
  assert.equal(P.playFor("darner"), "hawk");
  assert.equal(P.HAWK, "hawk");
  assert.equal(P.playFor("chanterelle"), "sill");
  const target = P.pickTarget([WIN], 80, "morel", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "hollow");
  assert.equal(target.side, "leafmold");
  assert.equal(target.leave, "hollowed");
  assert.notEqual(target.kind, "kick");
  assert.notEqual(target.kind, "bun");
  assert.notEqual(target.kind, "warts");
  assert.notEqual(target.kind, "shelf");
  assert.notEqual(target.kind, "cover");
  assert.notEqual(target.kind, "lean");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift >= 0, "she hollows a sash well as leaf mold");
  assert.ok(P.DUR.hollowHold > P.DUR.hollow * 1.2, "the hold is the sit; hollow is the tell");
  assert.ok(P.DUR.hollowOn > 1.0, "a walk into the well, not the kick");
  assert.ok(P.DUR.hollowOn !== P.DUR.kickOn);
  assert.ok(P.DUR.hollowOn !== P.DUR.bunOn);
  assert.ok(P.DUR.hollowOn !== P.DUR.wartsOn);
  assert.ok(P.DUR.hollowOn !== P.DUR.shelfOn);
  assert.ok(P.DUR.hollowOn !== P.DUR.leanOn);
  assert.ok(P.DUR.hollowOn !== P.DUR.sillHop);
  assert.ok(P.DUR.hollow !== P.DUR.kick);
  assert.ok(P.DUR.hollow !== P.DUR.warts);
  assert.ok(P.DUR.hollowHold !== P.DUR.kickHold);
  assert.ok(P.DUR.hollowOff !== P.DUR.wartsOff);
  const well = P.hollowPoint(WIN, P.SPRITE, WORK);
  const kick = P.kickPoint(WIN, P.SPRITE, WORK);
  const bun = P.bunPoint(WIN, P.SPRITE, WORK);
  const cup = P.wartsPoint(WIN, P.SPRITE, WORK);
  const timber = P.shelfPoint(WIN, P.SPRITE, WORK);
  const cover = P.coverPoint(WIN, P.SPRITE, WORK);
  assert.ok(well.lift >= 0, "the sash well as leaf mold, not the sky");
  assert.ok(Math.abs(well.x - kick.x) > 8 || Math.abs(well.lift - kick.lift) > 1, "not Velvet's silk-burrow kick");
  assert.ok(Math.abs(well.x - bun.x) > 8 || Math.abs(well.lift - bun.lift) > 1, "not Nori's inkwell bun");
  assert.ok(Math.abs(well.x - cup.x) > 8 || Math.abs(well.lift - cup.lift) > 1, "not Cap's moss-cup warts");
  assert.ok(Math.abs(well.x - timber.x) > 8 || Math.abs(well.lift - timber.lift) > 1, "not Frill's timber-shelf shelf");
  assert.ok(Math.abs(well.x - cover.x) > 8 || Math.abs(well.lift - cover.lift) > 1, "not Dapple's window-well cover");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "morel", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real sash well, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 178, height: 198 }], 80, "morel", WORK, P.SPRITE);
  assert.equal(short, null, "a real sash well, not a thinner well");
  const okHollow = P.pickTarget([{ id: "hollow", x: 200, y: 80, width: 180, height: 200 }], 80, "morel", WORK, P.SPRITE);
  assert.ok(okHollow, "a real sash well as leaf mold");
  const apronOnly = P.pickTarget([{ id: "apron", x: 200, y: 80, width: 186, height: 148 }], 80, "morel", WORK, P.SPRITE);
  assert.equal(apronOnly, null, "Cap's moss-cup apron is not Lattice's sash well");
  const wartsOk = P.pickTarget([{ id: "warts", x: 200, y: 80, width: 186, height: 148 }], 80, "fly_agaric", WORK, P.SPRITE);
  assert.ok(wartsOk, "Cap still takes a moss cup");
  const walkOn = P.hollowOnPath(0.25, { x: 40, lift: 0 }, { x: well.x, lift: well.lift });
  const kickOn = P.kickOnPath(0.25, { x: 40, lift: 0 }, { x: well.x, lift: well.lift });
  assert.ok(walkOn.lift >= 0, "she walks into the well as leaf mold");
  assert.ok(walkOn.rot !== kickOn.rot, "a walk into the well, not Velvet kick");
  const hollowPose = P.hollowPath(0.3);
  const kickPose = P.kickPath(0.3);
  const wartsPose = P.wartsPath(0.3);
  assert.ok(Math.abs(hollowPose.lift) > 0.5 || Math.abs(hollowPose.rot) > 1, "she sits the hollow; hollow is the tell");
  assert.ok(hollowPose.rot !== kickPose.rot, "hollow, not kick");
  assert.ok(hollowPose.rot !== wartsPose.rot, "hollow, not warts");
  const hold = P.hollowHoldPath(0.5);
  assert.ok(Math.abs(hold.rot - 2.65) < 0.2, "she holds the sit in the hollow");
  assert.ok(Math.abs(hold.x - 0.14) < 0.05, "she stays in the sash well");
  assert.ok(hold.lift < 0, "sit the hollow, a sink, not a kick peak");
  const off0 = P.hollowOffPath(0, { x: well.x, lift: well.lift - 2.17, rot: 2.65 }, { x: well.x + 50, lift: 0 });
  const offMid = P.hollowOffPath(0.5, { x: well.x, lift: well.lift - 2.17, rot: 2.65 }, { x: well.x + 50, lift: 0 });
  const off1 = P.hollowOffPath(1, { x: well.x, lift: well.lift - 2.17, rot: 2.65 }, { x: well.x + 50, lift: 0 });
  assert.ok(Math.abs(off0.x - well.x) < 2);
  assert.ok(Math.abs(offMid.x - well.x) > 8, "a walk leave out of the sash well");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "kick");
    assert.notEqual(play.phase, "warts");
    assert.notEqual(play.phase, "shelf");
    assert.notEqual(play.phase, "cover");
    assert.notEqual(play.phase, "lean");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "hollow") {
      assert.ok(play.lift !== undefined, "she hollows in the sash well");
    }
  }
  assert.ok(seen.has("hollow-on"));
  assert.ok(seen.has("hollow"));
  assert.ok(seen.has("hollow-hold"));
  assert.ok(seen.has("hollow-off"));
  assert.ok(seen.has("approach") || seen.has("walk") || seen.has("land"));
  assert.equal(windowIds.size, 1, "one window; bounds-only");
  assert.equal(play.phase, "done");
});

test("a moved window refits Lattice's sash-well hollow; sleep, card, and hide abort; Lattice never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "morel", WORK, P.SPRITE);
  assert.ok(target);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "hollow"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "hollow");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "hollow");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved sash well");
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "hollow-off");
  assert.equal(play.abort, true);
});
'''

MJS_TESTS = r'''
test("Lattice hollows a sash well as leaf mold: walk into the well, sit the hollow, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("morel"), "hollow");
  assert.equal(P.HOLLOW, "hollow");
  assert.notEqual(P.playFor("morel"), "lattice");
  assert.notEqual(P.playFor("morel"), "lean");
  assert.notEqual(P.playFor("morel"), "warts");
  assert.notEqual(P.playFor("morel"), "shelf");
  assert.notEqual(P.playFor("morel"), "sill");
  assert.equal(P.playFor("fly_agaric"), "warts");
  assert.equal(P.WARTS, "warts");
  assert.equal(P.playFor("oyster"), "shelf");
  assert.equal(P.SHELF, "shelf");
  assert.equal(P.playFor("moss"), "lean");
  assert.equal(P.playFor("darner"), "hawk");
  assert.equal(P.playFor("chanterelle"), "sill");
  assert.equal(Overlay.playFor("morel"), "hollow");
  const target = P.pickTarget([WIN], 80, "morel", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "hollow");
  assert.equal(target.side, "leafmold");
  assert.equal(target.leave, "hollowed");
  assert.ok(target.holdLift >= 0);
  assert.ok(P.DUR.hollowHold > P.DUR.hollow * 1.2);
  assert.ok(P.DUR.hollowOn !== P.DUR.kickOn);
  assert.ok(P.DUR.hollow !== P.DUR.warts);
  const well = P.hollowPoint(WIN, P.SPRITE, WORK);
  const kick = P.kickPoint(WIN, P.SPRITE, WORK);
  assert.ok(Math.abs(well.x - kick.x) > 8 || Math.abs(well.lift - kick.lift) > 1);
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "morel", WORK, P.SPRITE);
  assert.equal(tiny, null);
  const okHollow = P.pickTarget([{ id: "hollow", x: 200, y: 80, width: 180, height: 200 }], 80, "morel", WORK, P.SPRITE);
  assert.ok(okHollow);
  const hollowPose = P.hollowPath(0.3);
  assert.ok(Math.abs(hollowPose.lift) > 0.5 || Math.abs(hollowPose.rot) > 1);
  const hold = P.hollowHoldPath(0.5);
  assert.ok(Math.abs(hold.rot - 2.65) < 0.2);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "kick");
    assert.notEqual(play.phase, "warts");
    assert.notEqual(play.phase, "shelf");
  }
  assert.ok(seen.has("hollow-on"));
  assert.ok(seen.has("hollow"));
  assert.ok(seen.has("hollow-hold"));
  assert.ok(seen.has("hollow-off"));
  assert.equal(play.phase, "done");
});

test("a moved window refits Lattice's sash-well hollow; sleep, card, and hide abort", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  const target = P.pickTarget([WIN], 200, "morel", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "hollow"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "hollow");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "hollow");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "hollow-off");
  assert.equal(play.abort, true);
});

test("the overlay window plate walks Lattice hollow the same way", () => {
  assert.equal(Overlay.playFor("morel"), "hollow");
  assert.equal(P.playFor("morel"), "hollow");
  const target = P.pickTarget([WIN], 80, "morel", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "hollow");
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.ok(seen.has("hollow"));
  assert.equal(play.phase, "done");
});
'''

# cjs
cjs_path = Path("desktop/renderer/window-play.test.cjs")
cjs = cjs_path.read_text(encoding="utf-8")
cjs = alln(cjs, 'P.playFor("morel"), "sill"', 'P.playFor("chanterelle"), "sill"', 24, "cjs morel sill")
cjs = once(cjs, 'P.pickTarget([WIN], 80, "morel", WORK, P.SPRITE)', 'P.pickTarget([WIN], 80, "chanterelle", WORK, P.SPRITE)', "cjs sill pick")
cjs = cjs.rstrip() + "\n" + CJS_TESTS + "\n"
cjs_path.write_text(cjs, encoding="utf-8", newline="\n")
print("cjs tests ok")

# mjs
mjs_path = Path("web/scripts/window-play.test.mjs")
mjs = mjs_path.read_text(encoding="utf-8")
mjs = alln(mjs, 'P.playFor("morel"), "sill"', 'P.playFor("chanterelle"), "sill"', 24, "mjs morel sill")
mjs = mjs.rstrip() + "\n" + MJS_TESTS + "\n"
mjs_path.write_text(mjs, encoding="utf-8", newline="\n")
print("mjs tests ok")

# leftover-house
house_path = Path("desktop/renderer/leftover-house.test.cjs")
house = house_path.read_text(encoding="utf-8")
house = once(
    house,
    'test("Cap leftover warts a window apron as a moss cup; second leftover of the fungi den done;',
    'test("Lattice leftover hollows a sash well as leaf mold; third leftover of the fungi den done; Cap leftover still warts a window apron as a moss cup; second leftover of the fungi den done;',
    "house title",
)
house = once(house, "next leftover is Lattice;", "next leftover is Horn;", "house next")
house = alln(house, 'WP.playFor("morel"), "sill"', 'WP.playFor("chanterelle"), "sill"', 2, "house morel sill")
house = once(
    house,
    '''  assert.equal(WP.playFor("caecilian"), "ring");
  assert.equal(WP.playFor("chanterelle"), "sill");
});''',
    '''  assert.equal(WP.playFor("caecilian"), "ring");
  assert.equal(WP.playFor("morel"), "hollow");
  assert.equal(WP.HOLLOW, "hollow");
  assert.notEqual(WP.playFor("morel"), "lattice");
  assert.notEqual(WP.playFor("morel"), "lean");
  assert.notEqual(WP.playFor("morel"), "warts");
  assert.notEqual(WP.playFor("morel"), "shelf");
  assert.notEqual(WP.playFor("morel"), "sill");
  assert.equal(WP.playFor("fly_agaric"), "warts");
  assert.equal(WP.WARTS, "warts");
  assert.equal(WP.playFor("oyster"), "shelf");
  assert.equal(WP.playFor("moss"), "lean");
  assert.equal(WP.playFor("salamander"), "cover");
  assert.equal(WP.playFor("tarantula"), "kick");
  assert.equal(WP.playFor("darner"), "hawk");
  assert.equal(WP.playFor("chanterelle"), "sill");
});''',
    "house end asserts",
)
house_path.write_text(house, encoding="utf-8", newline="\n")
print("house tests ok")
print("morel sill remaining cjs", cjs.count('playFor("morel"), "sill"'), "mjs", mjs.count('playFor("morel"), "sill"'), "house", house.count('playFor("morel"), "sill"'))
print("morel hollow cjs", cjs.count('playFor("morel"), "hollow"'), "house", house.count('playFor("morel"), "hollow"'))
