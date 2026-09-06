from pathlib import Path

# ========== _lace_cjs_tests.txt ==========
Path("_lace_cjs_tests.txt").write_text(r'''test("Lace nets a window stool as a leaf dish: walk onto the stool, sit, lace once, sit the dish, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("lacewing"), "net");
  assert.equal(P.NET, "net");
  assert.notEqual(P.playFor("lacewing"), "lace");
  assert.notEqual(P.playFor("lacewing"), "week");
  assert.notEqual(P.playFor("lacewing"), "mount");
  assert.notEqual(P.playFor("lacewing"), "gold");
  assert.notEqual(P.playFor("lacewing"), "black");
  assert.notEqual(P.playFor("lacewing"), "hawk");
  assert.notEqual(P.playFor("lacewing"), "tails");
  assert.notEqual(P.playFor("lacewing"), "jump");
  assert.notEqual(P.playFor("lacewing"), "leaf");
  assert.notEqual(P.playFor("lacewing"), "song");
  assert.notEqual(P.playFor("lacewing"), "thread");
  assert.notEqual(P.playFor("lacewing"), "hunt");
  assert.notEqual(P.playFor("lacewing"), "spot");
  assert.notEqual(P.playFor("lacewing"), "vein");
  assert.notEqual(P.playFor("lacewing"), "unfurl");
  assert.notEqual(P.playFor("lacewing"), "sill");
  assert.equal(P.playFor("jewelwing"), "black");
  assert.equal(P.BLACK, "black");
  assert.equal(P.playFor("swallowtail"), "tails");
  assert.equal(P.TAILS, "tails");
  assert.equal(P.playFor("luna"), "week");
  assert.equal(P.WEEK, "week");
  assert.equal(P.playFor("moth"), "mount");
  assert.equal(P.playFor("darner"), "hawk");
  assert.equal(P.playFor("grasshopper"), "jump");
  assert.equal(P.playFor("katydid"), "leaf");
  assert.equal(P.playFor("field_cricket"), "song");
  assert.equal(P.playFor("earwig"), "sill");
  const target = P.pickTarget([WIN], 80, "lacewing", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "net");
  assert.equal(target.side, "leafdish");
  assert.equal(target.leave, "laced");
  assert.notEqual(target.kind, "black");
  assert.notEqual(target.kind, "week");
  assert.notEqual(target.kind, "mount");
  assert.notEqual(target.kind, "spot");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift >= 0, "she nets a window stool as a leaf dish");
  assert.ok(P.DUR.netHold > P.DUR.net * 1.2, "the hold is the sit; the net is the tell");
  assert.ok(P.DUR.netOn > 1.0, "a walk onto the stool, not the lace");
  assert.ok(P.DUR.netOn !== P.DUR.blackOn);
  assert.ok(P.DUR.netOn !== P.DUR.tailsOn);
  assert.ok(P.DUR.netOn !== P.DUR.weekOn);
  assert.ok(P.DUR.netOn !== P.DUR.mountOn);
  assert.ok(P.DUR.netOn !== P.DUR.spotOn);
  assert.ok(P.DUR.netOn !== P.DUR.jumpOn);
  assert.ok(P.DUR.netOn !== P.DUR.leafOn);
  assert.ok(P.DUR.netOn !== P.DUR.songOn);
  assert.ok(P.DUR.netOn !== P.DUR.sillHop);
  assert.ok(P.DUR.net !== P.DUR.black);
  assert.ok(P.DUR.net !== P.DUR.tails);
  assert.ok(P.DUR.net !== P.DUR.week);
  assert.ok(P.DUR.netHold !== P.DUR.blackHold);
  assert.ok(P.DUR.netHold !== P.DUR.tailsHold);
  assert.ok(P.DUR.netOff !== P.DUR.blackOff);
  assert.ok(P.DUR.netOff !== P.DUR.tailsOff);
  const dish = P.netPoint(WIN, P.SPRITE, WORK);
  const jewel = P.blackPoint(WIN, P.SPRITE, WORK);
  const blossom = P.tailsPoint(WIN, P.SPRITE, WORK);
  const dusk = P.weekPoint(WIN, P.SPRITE, WORK);
  const bark = P.mountPoint(WIN, P.SPRITE, WORK);
  const spots = P.spotPoint(WIN, P.SPRITE, WORK);
  const grass = P.songPoint(WIN, P.SPRITE, WORK);
  assert.ok(dish.lift >= 0, "the window stool as a leaf dish, not the sky");
  assert.ok(Math.abs(dish.x - jewel.x) > 12 || Math.abs(dish.lift - jewel.lift) > 4, "not Jewel's glass-rim black");
  assert.ok(Math.abs(dish.x - blossom.x) > 12 || Math.abs(dish.lift - blossom.lift) > 2, "not Banner's stool tails x");
  assert.ok(Math.abs(dish.x - dusk.x) > 12 || Math.abs(dish.lift - dusk.lift) > 4, "not Ghost's lamp-side week");
  assert.ok(Math.abs(dish.x - bark.x) > 12 || Math.abs(dish.lift - bark.lift) > 4, "not Moth's jamb mount");
  assert.ok(Math.abs(dish.x - spots.x) > 12 || Math.abs(dish.lift - spots.lift) > 2, "not Seven's window-box-leaf spot");
  assert.ok(Math.abs(dish.x - grass.x) > 12 || Math.abs(dish.lift - grass.lift) > 2, "not Chirp's window-stool song x");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "lacewing", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real window stool, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 168, height: 74 }], 80, "lacewing", WORK, P.SPRITE);
  assert.equal(short, null, "a real leaf dish, not Brood's emerge gate");
  const thin = P.pickTarget([{ id: "thin", x: 200, y: 80, width: 190, height: 150 }], 80, "lacewing", WORK, P.SPRITE);
  assert.equal(thin, null, "a real leaf-dish stool, not a thinner stool");
  const okNet = P.pickTarget([{ id: "net", x: 200, y: 80, width: 190, height: 152 }], 80, "lacewing", WORK, P.SPRITE);
  assert.ok(okNet, "a real window stool as a leaf dish");
  const blackOk = P.pickTarget([{ id: "black", x: 200, y: 80, width: 184, height: 156 }], 80, "jewelwing", WORK, P.SPRITE);
  assert.ok(blackOk, "Jewel still takes a stream jewel");
  const tailsOk = P.pickTarget([{ id: "tails", x: 200, y: 80, width: 186, height: 150 }], 80, "swallowtail", WORK, P.SPRITE);
  assert.ok(tailsOk, "Banner still takes a blossom dish");
  const weekOk = P.pickTarget([{ id: "week", x: 200, y: 80, width: 200, height: 210 }], 80, "luna", WORK, P.SPRITE);
  assert.ok(weekOk, "Ghost still takes lamp dusk");
  const walkOn = P.netOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  const blackOn = P.blackOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  const tailsOn = P.tailsOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  assert.ok(walkOn.lift >= 0, "she walks onto the stool as a leaf dish");
  assert.ok(walkOn.rot !== blackOn.rot, "a walk onto the stool, not Jewel black");
  assert.ok(walkOn.rot !== tailsOn.rot, "a walk onto the stool, not Banner tails");
  const netPose = P.netPath(0.4);
  const blackPose = P.blackPath(0.4);
  const weekPose = P.weekPath(0.4);
  assert.ok(netPose.lift > 0.5, "she laces; net is the tell");
  assert.ok(netPose.lift < blackPose.lift + 0.01 || netPose.rot !== blackPose.rot, "a lace net, not a jewel fold");
  assert.ok(netPose.rot !== weekPose.rot, "net, not week");
  const hold = P.netHoldPath(0.5);
  assert.ok(Math.abs(hold.rot + 2.1) < 0.2, "she holds the sit on the dish");
  assert.ok(Math.abs(hold.x - 0.18) < 0.05, "she stays on the leaf dish");
  assert.ok(hold.lift < 2, "sit on the stool, not a lace pulse");
  const off0 = P.netOffPath(0, { x: dish.x, lift: dish.lift + 0.48, rot: -2.1 }, { x: dish.x + 50, lift: 0 });
  const offMid = P.netOffPath(0.5, { x: dish.x, lift: dish.lift + 0.48, rot: -2.1 }, { x: dish.x + 50, lift: 0 });
  const off1 = P.netOffPath(1, { x: dish.x, lift: dish.lift + 0.48, rot: -2.1 }, { x: dish.x + 50, lift: 0 });
  assert.ok(Math.abs(off0.x - dish.x) < 2);
  assert.ok(Math.abs(offMid.x - dish.x) > 8, "a walk leave off the leaf dish");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "black");
    assert.notEqual(play.phase, "tails");
    assert.notEqual(play.phase, "week");
    assert.notEqual(play.phase, "mount");
    assert.notEqual(play.phase, "spot");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "net") {
      assert.ok(play.lift >= 0, "she laces on the window stool");
    }
  }
  assert.ok(seen.has("net-on"));
  assert.ok(seen.has("net"));
  assert.ok(seen.has("net-hold"));
  assert.ok(seen.has("net-off"));
  assert.ok(seen.has("approach") || seen.has("walk") || seen.has("land"));
  assert.equal(windowIds.size, 1, "one window; bounds-only");
  assert.equal(play.phase, "done");
});

test("a moved window refits Lace's leaf-dish net; sleep, card, and hide abort; Lace never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  const target = P.pickTarget([WIN], 200, "lacewing", WORK, P.SPRITE);
  assert.ok(target);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "net"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "net");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "net");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved window stool");
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "net-off");
  play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 400 && play.phase !== "net-hold"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "card" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "net-off" || play.abort === true);
  play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 200 && play.phase === "approach"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "hide" });
  assert.equal(play.abort, true);
});
''', encoding="utf-8")
print("wrote cjs tests", Path("_lace_cjs_tests.txt").stat().st_size)
