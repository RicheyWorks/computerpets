from pathlib import Path
ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")
p = ROOT / "docs/ROADMAP.md"
t = p.read_text(encoding="utf-8")
old = "**Last Updated:** 2026-09-01 (Phase 6 leftover: Half splits a meeting-rail underside as a stream stone; eighth log leftover done; next leftover is Thread; catalog stays 220; split is the half tell; Tun still owns dry; Hop still owns spring; Jet still owns velvet; Felt still owns lean; Latch still owns drink)"
new = "**Last Updated:** 2026-09-01 (Phase 6 leftover: Thread thrashes a glazing rebate as a soil film; ninth log leftover done; next leftover is Scud; catalog stays 220; thrash is the round tell; Wick still owns thread; Half still owns split; Tun still owns dry; Hop still owns spring; Cast still owns band)"
if t.count(old) != 1:
    raise SystemExit(f"last updated count {t.count(old)}")
p.write_text(t.replace(old, new, 1), encoding="utf-8")
print("ok roadmap footer")

DESK_TEST = r'''
test("Thread thrashes a glazing rebate as a soil film: walk into the rebate, thrash the round, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("nematode"), "thrash");
  assert.equal(P.THRASH, "thrash");
  assert.equal(P.playFor("ferret"), "thread");
  assert.equal(P.THREAD, "thread");
  assert.equal(P.playFor("planarian"), "split");
  assert.equal(P.SPLIT, "split");
  assert.equal(P.playFor("tardigrade"), "dry");
  assert.equal(P.DRY, "dry");
  assert.equal(P.playFor("springtail"), "spring");
  assert.equal(P.playFor("earthworm"), "band");
  assert.equal(P.playFor("sundew"), "curl");
  assert.equal(P.playFor("amphipod"), "sill");
  assert.notEqual(P.playFor("nematode"), "thread");
  assert.notEqual(P.playFor("nematode"), "split");
  assert.notEqual(P.playFor("nematode"), "dry");
  assert.notEqual(P.playFor("nematode"), "sill");
  assert.notEqual(P.playFor("nematode"), "curl");
  assert.notEqual(P.playFor("nematode"), "band");
  assert.equal(P.DUR.splitOn, 2.24, "Half split durations stay");
  assert.equal(P.DUR.dryOn, 2.18, "Tun dry durations stay");
  assert.equal(P.DUR.threadOn, 0.44, "Wick thread durations stay");
  assert.equal(P.DUR.springOn, 2.11, "Hop spring durations stay");
  const target = P.pickTarget([WIN], 80, "nematode", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "thrash");
  assert.equal(target.side, "soilfilm");
  assert.equal(target.leave, "round");
  assert.notEqual(target.kind, "thread");
  assert.notEqual(target.kind, "split");
  assert.notEqual(target.kind, "dry");
  assert.notEqual(target.kind, "curl");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift > 30, "she thrashes a glazing rebate as a soil film");
  assert.ok(P.DUR.thrashHold > P.DUR.thrash, "the hold is the sit after; the thrash is the tell");
  assert.ok(P.DUR.thrashOn > 1.0, "a walk into the rebate, not the thrash");
  assert.ok(P.DUR.thrashOn !== P.DUR.splitOn);
  assert.ok(P.DUR.thrashOn !== P.DUR.dryOn);
  assert.ok(P.DUR.thrashOn !== P.DUR.threadOn);
  assert.ok(P.DUR.thrashOn !== P.DUR.sillHop);
  assert.ok(P.DUR.thrash !== P.DUR.split);
  assert.ok(P.DUR.thrash !== P.DUR.dry);
  assert.ok(P.DUR.thrashHold !== P.DUR.splitHold);
  assert.ok(P.DUR.thrashOff !== P.DUR.dryOff);
  assert.ok(P.DUR.thrashOff !== P.DUR.sillDown);
  const rebate = P.thrashPoint(WIN, P.SPRITE, WORK);
  const peat = P.curlPoint(WIN, P.SPRITE, WORK);
  const film = P.dryPoint(WIN, P.SPRITE, WORK);
  const stone = P.splitPoint(WIN, P.SPRITE, WORK);
  const gap = P.threadPoint(WIN, 0.5, P.SPRITE, WORK);
  const tray = P.bandPoint(WIN, P.SPRITE, WORK);
  assert.ok(rebate.lift > 30, "the glazing rebate as a soil film");
  assert.ok(Math.abs(rebate.x - peat.x) > 8, "same rebate family as Dew, different pose");
  assert.ok(Math.abs(rebate.lift - peat.lift) < 8, "a real glazing rebate, Dew's furniture family");
  assert.ok(Math.abs(rebate.x - film.x) > 8 || Math.abs(rebate.lift - film.lift) > 8, "not Tun pane moss film");
  assert.ok(Math.abs(rebate.x - stone.x) > 8 || Math.abs(rebate.lift - stone.lift) > 8, "not Half meeting-rail split");
  assert.ok(Math.abs(rebate.x - gap.x) > 8 || Math.abs(rebate.lift - gap.lift) > 8, "not Wick sash-sill thread");
  assert.ok(Math.abs(rebate.x - tray.x) > 8 || Math.abs(rebate.lift - tray.lift) > 8, "not Cast window-stool band");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "nematode", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real glazing rebate, not a thin strip");
  const foot = P.pickTarget([{ id: "foot", x: 200, y: 80, width: 160, height: 70 }], 80, "nematode", WORK, P.SPRITE);
  assert.equal(foot, null, "a real glazing rebate, not a window foot");
  const thinPane = P.pickTarget([{ id: "pane", x: 200, y: 80, width: 196, height: 188 }], 80, "nematode", WORK, P.SPRITE);
  assert.equal(thinPane, null, "a glazing rebate, not Tun's moss-film pane");
  const okRebate = P.pickTarget([{ id: "rebate", x: 200, y: 80, width: 192, height: 198 }], 80, "nematode", WORK, P.SPRITE);
  assert.ok(okRebate, "a real glazing rebate as a soil film");
  const dewOk = P.pickTarget([{ id: "peat", x: 200, y: 80, width: 192, height: 198 }], 80, "sundew", WORK, P.SPRITE);
  assert.ok(dewOk, "Dew still takes the rebate");
  const tunOk = P.pickTarget([{ id: "pane", x: 200, y: 80, width: 196, height: 188 }], 80, "tardigrade", WORK, P.SPRITE);
  assert.ok(tunOk, "Tun still takes the pane");
  const halfOk = P.pickTarget([{ id: "stone", x: 200, y: 80, width: 193, height: 200 }], 80, "planarian", WORK, P.SPRITE);
  assert.ok(halfOk, "Half still takes the underside");
  const walkOn = P.thrashOnPath(0.25, { x: 40, lift: 0 }, { x: rebate.x, lift: rebate.lift });
  const curlOn = P.curlOnPath(0.25, { x: 40, lift: 0 }, { x: rebate.x, lift: rebate.lift });
  const dryOn = P.dryOnPath(0.25, { x: 40, lift: 0 }, { x: rebate.x, lift: rebate.lift });
  const threadOn = P.threadOnPath(0.25, { x: 40, lift: 0 }, { x: rebate.x, lift: rebate.lift });
  assert.ok(walkOn.lift > 4, "she walks into the rebate as a soil film");
  assert.ok(walkOn.rot !== curlOn.rot, "a wriggle into the rebate, not Dew curl");
  assert.ok(walkOn.rot !== dryOn.rot, "a walk into the rebate, not Tun dry");
  assert.ok(walkOn.rot !== threadOn.rot, "a walk into the rebate, not Wick thread");
  const round = P.thrashPath(0.5);
  const curl = P.curlPath(0.5);
  const tun = P.dryPath(0.5);
  const half = P.splitPath(0.5);
  const wick = P.threadPath(0.5, { x: 0, lift: 0 }, { x: 10, lift: 0 });
  assert.ok(Math.abs(round.x) > 2, "she thrashes; the round is the tell");
  assert.ok(round.rot !== curl.rot, "a thrash, not Dew curl");
  assert.ok(round.rot !== tun.rot, "a thrash, not a dry");
  assert.ok(round.rot !== half.rot, "a thrash, not a split");
  assert.ok(round.rot !== wick.rot, "a thrash, not Wick thread");
  const hold = P.thrashHoldPath(0.5);
  assert.ok(Math.abs(hold.rot - 4.8) < 0.2, "she holds after the thrash, the round sits");
  assert.ok(Math.abs(hold.x - 0.35) < 0.2, "she stays on the soil film");
  assert.ok(hold.lift > 0.4 && hold.lift < 0.8, "a sit after the thrash");
  const off0 = P.thrashOffPath(0, { x: rebate.x, lift: rebate.lift, rot: 4.8 }, { x: rebate.x + 63, lift: 0 });
  const offMid = P.thrashOffPath(0.5, { x: rebate.x, lift: rebate.lift, rot: 4.8 }, { x: rebate.x + 63, lift: 0 });
  const off1 = P.thrashOffPath(1, { x: rebate.x, lift: rebate.lift, rot: 4.8 }, { x: rebate.x + 63, lift: 0 });
  assert.ok(Math.abs(off0.x - rebate.x) < 2);
  assert.ok(Math.abs(offMid.x - rebate.x) > 8, "a walk leave off the soil film");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "thread");
    assert.notEqual(play.phase, "split");
    assert.notEqual(play.phase, "dry");
    assert.notEqual(play.phase, "curl");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "thrash") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "thrash-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "thrash-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift + 0.5)) < 3, "she holds the sit on the soil film");
    }
    if (play.phase === "thrash-off") {
      assert.equal(play.anim, "walk");
    }
  }
  assert.ok(seen.has("thrash-on"));
  assert.ok(seen.has("thrash"));
  assert.ok(seen.has("thrash-hold"));
  assert.ok(seen.has("thrash-off"));
  assert.ok(!seen.has("thread"), "Thread never uses Wick thread");
  assert.ok(!seen.has("split"), "Thread never uses Half split");
  assert.ok(!seen.has("dry"), "Thread never uses Tun dry");
  assert.ok(!seen.has("curl"), "Thread never uses Dew curl");
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});
test("a moved window refits Thread's soil-film thrash; sleep, card, and hide abort; Thread never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "nematode", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "thrash"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "thrash");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "thrash");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "thrash-off");
  assert.equal(play.abort, true);
});
'''

desk = ROOT / "desktop/renderer/window-play.test.cjs"
desk.write_text(desk.read_text(encoding="utf-8").rstrip() + "\n" + DESK_TEST, encoding="utf-8")
print("ok desktop tests")

WEB_TEST = r'''
test("the demo window plate walks Thread thrash the same way", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /playFor/);
  assert.match(readFileSync(join(root, "src/lib/pets/log.ts"), "utf8"), /key: "nematode"[\s\S]{0,80}slug: "thread"/);
  assert.equal(P.playFor("nematode"), "thrash");
  const target = P.pickTarget([WIN], 80, "nematode", WORK, 176);
  assert.ok(target);
  assert.equal(target.kind, "thrash");
  assert.equal(target.side, "soilfilm");
  assert.equal(target.leave, "round");
  assert.equal(Overlay.playFor("nematode"), "thrash");
  assert.equal(P.THRASH, "thrash");
  assert.equal(Overlay.THRASH, "thrash");
  assert.equal(P.playFor("ferret"), "thread");
  assert.equal(Overlay.playFor("ferret"), "thread");
  assert.equal(P.playFor("planarian"), "split");
  assert.equal(Overlay.playFor("planarian"), "split");
  assert.equal(P.playFor("tardigrade"), "dry");
  assert.equal(Overlay.playFor("tardigrade"), "dry");
  assert.equal(P.playFor("amphipod"), "sill");
  assert.equal(Overlay.playFor("amphipod"), "sill");
  assert.notEqual(P.playFor("nematode"), "thread");
  assert.notEqual(P.playFor("nematode"), "split");
  assert.notEqual(P.playFor("nematode"), "dry");
  assert.notEqual(P.playFor("nematode"), "sill");
  assert.equal(P.DUR.thrashOn, Overlay.DUR.thrashOn);
  assert.equal(P.DUR.thrash, Overlay.DUR.thrash);
  assert.equal(P.DUR.thrashHold, Overlay.DUR.thrashHold);
  assert.equal(P.DUR.thrashOff, Overlay.DUR.thrashOff);
  assert.ok(P.DUR.thrashOn !== Overlay.DUR.splitOn);
  assert.ok(P.DUR.thrashOn !== Overlay.DUR.dryOn);
  assert.ok(P.DUR.thrashOn !== Overlay.DUR.threadOn);
  const rebate = P.thrashPoint(WIN, 176, WORK);
  const deskRebate = Overlay.thrashPoint(WIN, Overlay.SPRITE, WORK);
  const peat = P.curlPoint(WIN, 176, WORK);
  const film = P.dryPoint(WIN, 176, WORK);
  const stone = P.splitPoint(WIN, 176, WORK);
  assert.ok(Math.abs(rebate.x - deskRebate.x) < 1);
  assert.ok(Math.abs(rebate.lift - deskRebate.lift) < 1);
  assert.ok(Math.abs(rebate.x - peat.x) > 8, "same rebate family as Dew, different pose");
  assert.ok(rebate.lift > 30, "soil film, the rebate");
  assert.ok(Math.abs(rebate.x - film.x) > 8 || Math.abs(rebate.lift - film.lift) > 8, "not Tun dry");
  assert.ok(Math.abs(rebate.x - stone.x) > 8 || Math.abs(rebate.lift - stone.lift) > 8, "not Half split");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "nematode", WORK, 176);
  assert.equal(tiny, null, "a real glazing rebate");
  const okRebate = P.pickTarget([{ id: "rebate", x: 200, y: 80, width: 192, height: 198 }], 80, "nematode", WORK, 176);
  assert.ok(okRebate, "a real glazing rebate as a soil film");
  const walkOn = P.thrashOnPath(0.25, { x: 40, lift: 0 }, { x: rebate.x, lift: rebate.lift });
  const deskWalk = Overlay.thrashOnPath(0.25, { x: 40, lift: 0 }, { x: rebate.x, lift: rebate.lift });
  assert.equal(walkOn.x, deskWalk.x);
  assert.equal(walkOn.lift, deskWalk.lift);
  const round = P.thrashPath(0.5);
  const deskRound = Overlay.thrashPath(0.5);
  assert.equal(round.x, deskRound.x);
  assert.ok(round.rot !== P.curlPath(0.5).rot, "a thrash, not a curl");
  assert.ok(round.rot !== P.dryPath(0.5).rot, "a thrash, not a dry");
  assert.ok(round.rot !== P.splitPath(0.5).rot, "a thrash, not a split");
  const hold = P.thrashHoldPath(0.5);
  const deskHold = Overlay.thrashHoldPath(0.5);
  assert.equal(hold.x, deskHold.x);
  assert.equal(hold.lift, deskHold.lift);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, 176, { cmd: "idle" });
    if (play.phase === "thrash") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "thrash-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "thrash-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift + 0.5)) < 3, "she holds the sit on the soil film");
    }
  }
  assert.ok(seen.has("thrash-on"));
  assert.ok(seen.has("thrash"));
  assert.ok(seen.has("thrash-hold"));
  assert.ok(seen.has("thrash-off"));
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
});
'''

web = ROOT / "web/scripts/window-play.test.mjs"
web.write_text(web.read_text(encoding="utf-8").rstrip() + "\n" + WEB_TEST, encoding="utf-8")
print("ok web tests")
