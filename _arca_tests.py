# -*- coding: utf-8 -*-
from pathlib import Path

HERE = Path(r"C:\Users\730ri\projects\ComputerPets")

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit("%s: expected 1, got %d\nOLD: %r" % (label, n, old[:200]))
    return text.replace(old, new, 1)

ARCA_TEST = r'''test("Arca leftover waits a window stool as a damp blotter: walk onto the stool, sit the wait, then leave", () => {
  const WIN_B = { id: "aw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("cyst"), "wait");
  assert.equal(P.WAIT, "wait");
  assert.notEqual(P.playFor("cyst"), "reef");
  assert.notEqual(P.playFor("cyst"), "drink");
  assert.notEqual(P.playFor("cyst"), "loop");
  assert.notEqual(P.playFor("cyst"), "emerge");
  assert.notEqual(P.playFor("cyst"), "lean");
  assert.notEqual(P.playFor("cyst"), "unfurl");
  assert.notEqual(P.playFor("cyst"), "frost");
  assert.notEqual(P.playFor("cyst"), "many");
  assert.notEqual(P.playFor("cyst"), "cool");
  assert.notEqual(P.playFor("cyst"), "arca");
  assert.notEqual(P.playFor("cyst"), "cyst");
  assert.notEqual(P.playFor("cyst"), "sill");
  assert.equal(P.playFor("umbral"), "cool");
  assert.equal(P.COOL, "cool");
  assert.equal(P.playFor("starfish"), "reef");
  assert.equal(P.REEF, "reef");
  assert.equal(P.playFor("mussel"), "drink");
  assert.equal(P.DRINK, "drink");
  assert.equal(P.playFor("slug"), "loop");
  assert.equal(P.LOOP, "loop");
  assert.equal(P.playFor("cicada"), "emerge");
  assert.equal(P.EMERGE, "emerge");
  assert.equal(P.playFor("paramecium"), "sill");
  const target = P.pickTarget([WIN], 80, "cyst", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "wait");
  assert.equal(target.side, "dampblotter");
  assert.equal(target.leave, "waited");
  assert.notEqual(target.kind, "reef");
  assert.notEqual(target.kind, "drink");
  assert.notEqual(target.kind, "loop");
  assert.notEqual(target.kind, "emerge");
  assert.notEqual(target.kind, "cool");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift >= 0, "it waits a window stool as a damp blotter");
  assert.ok(P.DUR.waitHold > P.DUR.wait * 1.2, "the hold is the sit; wait is the tell");
  assert.ok(P.DUR.waitOn > 1.0, "a walk onto the stool, not a cling");
  assert.ok(P.DUR.waitOn !== P.DUR.coolOn);
  assert.ok(P.DUR.waitOn !== P.DUR.frostOn);
  assert.ok(P.DUR.waitOn !== P.DUR.reefOn);
  assert.ok(P.DUR.waitOn !== P.DUR.drinkOn);
  assert.ok(P.DUR.waitOn !== P.DUR.loopOn);
  assert.ok(P.DUR.waitOn !== P.DUR.sillHop);
  assert.ok(P.DUR.wait !== P.DUR.cool);
  assert.ok(P.DUR.wait !== P.DUR.frost);
  assert.ok(P.DUR.waitHold !== P.DUR.coolHold);
  assert.ok(P.DUR.waitOff !== P.DUR.coolOff);
  const wait = P.waitPoint(WIN, P.SPRITE, WORK);
  const reef = P.reefPoint(WIN, P.SPRITE, WORK);
  const drink = P.drinkPoint(WIN, P.SPRITE, WORK);
  const loop = P.loopPoint(WIN, P.SPRITE, WORK);
  const emerge = P.emergePoint(WIN, P.SPRITE, WORK);
  const frost = P.frostPoint(WIN, P.SPRITE, WORK);
  const cool = P.coolPoint(WIN, P.SPRITE, WORK);
  assert.ok(wait.lift >= 0, "the window stool as a damp blotter, not the sky");
  assert.ok(Math.abs(wait.x - reef.x) > 8 || Math.abs(wait.lift - reef.lift) > 1, "not Ochre pane reef");
  assert.ok(Math.abs(wait.x - drink.x) > 8 || Math.abs(wait.lift - drink.lift) > 1, "not Latch drip drink");
  assert.ok(Math.abs(wait.x - loop.x) > 8 || Math.abs(wait.lift - loop.lift) > 1, "not Lula apron loop");
  assert.ok(Math.abs(wait.x - emerge.x) > 8 || Math.abs(wait.lift - emerge.lift) > 1, "not Brood emerge");
  assert.ok(Math.abs(wait.x - frost.x) > 8 || Math.abs(wait.lift - frost.lift) > 1, "not Brine salt-dish frost");
  assert.ok(Math.abs(wait.x - cool.x) > 8 || Math.abs(wait.lift - cool.lift) > 1, "not Hush lamp-shadow cool");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "cyst", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real stool blotter, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 194, height: 162 }], 80, "cyst", WORK, P.SPRITE);
  assert.equal(short, null, "a real stool blotter, not a thinner frame");
  const okWait = P.pickTarget([{ id: "wait", x: 200, y: 80, width: 196, height: 164 }], 80, "cyst", WORK, P.SPRITE);
  assert.ok(okWait, "a real window stool as a damp blotter");
  const coolOk = P.pickTarget([{ id: "cool", x: 200, y: 80, width: 198, height: 188 }], 80, "umbral", WORK, P.SPRITE);
  assert.ok(coolOk, "Hush still takes a lamp-shadow pane");
  const frostOk = P.pickTarget([{ id: "frost", x: 200, y: 80, width: 196, height: 164 }], 80, "halovore", WORK, P.SPRITE);
  assert.ok(frostOk, "Brine still takes a salt-dish stool");
  const walkOn = P.waitOnPath(0.25, { x: 40, lift: 0 }, { x: wait.x, lift: wait.lift });
  const frostOn = P.frostOnPath(0.25, { x: 40, lift: 0 }, { x: wait.x, lift: wait.lift });
  assert.ok(walkOn.lift >= 0, "it walks onto the window stool as a damp blotter");
  assert.ok(walkOn.rot !== frostOn.rot, "a walk onto the damp blotter, not Brine frost");
  const waitPose = P.waitPath(0.3);
  const reefPose = P.reefPath(0.3);
  const coolPose = P.coolPath(0.3);
  const frostPose = P.frostPath(0.3);
  assert.ok(Math.abs(waitPose.lift) > 0.2 || Math.abs(waitPose.rot) > 0.8, "it waits once; wait is the tell");
  assert.ok(waitPose.rot !== reefPose.rot, "wait, not reef");
  assert.ok(waitPose.rot !== coolPose.rot, "wait, not cool");
  assert.ok(waitPose.rot !== frostPose.rot, "wait, not frost");
  const hold = P.waitHoldPath(0.5);
  assert.ok(Math.abs(hold.rot - 1.73) < 0.2, "it holds the sit on the damp blotter");
  assert.ok(Math.abs(hold.x - 0.88) < 0.05, "it stays on the stool blotter");
  assert.ok(hold.lift > 0, "sit the sealed wait, not a bury sink");
  const off0 = P.waitOffPath(0, { x: wait.x, lift: wait.lift + 0.64, rot: 1.73 }, { x: wait.x + 50, lift: 0 });
  const offMid = P.waitOffPath(0.5, { x: wait.x, lift: wait.lift + 0.64, rot: 1.73 }, { x: wait.x + 50, lift: 0 });
  const off1 = P.waitOffPath(1, { x: wait.x, lift: wait.lift + 0.64, rot: 1.73 }, { x: wait.x + 50, lift: 0 });
  assert.ok(Math.abs(off0.x - wait.x) < 2);
  assert.ok(Math.abs(offMid.x - wait.x) > 8, "a walk leave off the damp blotter");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "reef");
    assert.notEqual(play.phase, "drink");
    assert.notEqual(play.phase, "cool");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "wait") {
      assert.ok(play.lift !== undefined, "it waits on the damp blotter");
    }
  }
  assert.ok(seen.has("wait-on"));
  assert.ok(seen.has("wait"));
  assert.ok(seen.has("wait-hold"));
  assert.ok(seen.has("wait-off"));
  assert.ok(seen.has("approach") || seen.has("walk") || seen.has("land"));
  assert.equal(windowIds.size, 1, "one window; bounds-only");
  assert.equal(play.phase, "done");
});

test("a moved window refits Arca's damp-blotter wait; sleep, card, and hide abort; Arca never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "cyst", WORK, P.SPRITE);
  assert.ok(target);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "wait"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "wait");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "wait");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved damp blotter");
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "wait-off");
  assert.equal(play.abort, true);
});
'''

def patch_tests(path, use_p=True):
    t = path.read_text(encoding="utf-8")
    # move pin cyst sill -> paramecium sill (equal asserts only)
    old_pin = 'assert.equal(P.playFor("cyst"), "sill");' if use_p else 'assert.equal(WP.playFor("cyst"), "sill");'
    new_pin = 'assert.equal(P.playFor("paramecium"), "sill");' if use_p else 'assert.equal(WP.playFor("paramecium"), "sill");'
    # for cjs/mjs use P; house uses WP - handled by caller
    count = t.count('assert.equal(P.playFor("cyst"), "sill");')
    if use_p:
        if count < 1:
            raise SystemExit("%s: no cyst sill pins" % path)
        t = t.replace('assert.equal(P.playFor("cyst"), "sill");', 'assert.equal(P.playFor("paramecium"), "sill");')
        print(path.name, "moved", count, "cyst->paramecium sill pins")
    # generic sill walker pickTarget
    if 'pickTarget([WIN], 80, "cyst"' in t:
        t = once(t, 'pickTarget([WIN], 80, "cyst"', 'pickTarget([WIN], 80, "paramecium"', "sill walker")
        print(path.name, "sill walker -> paramecium")
    # append Arca tests before EOF (after Hush block)
    if 'test("Arca leftover waits' not in t:
        # insert after Hush abort test end - after last hush test
        marker = 'test("a moved window refits Hush'
        i = t.find(marker)
        if i < 0:
            raise SystemExit("hush abort test missing in %s" % path)
        # find end of that test (closing });\n after)
        j = t.find("\n});\n", i)
        if j < 0:
            raise SystemExit("hush abort end missing")
        j = j + len("\n});\n")
        t = t[:j] + "\n" + ARCA_TEST + t[j:]
        print(path.name, "appended Arca tests")
    path.write_text(t, encoding="utf-8", newline="\n")

def patch_house():
    path = HERE / "desktop/renderer/leftover-house.test.cjs"
    t = path.read_text(encoding="utf-8")
    # title
    old_title_start = 'test("Hush leftover cools a lamp-side pane as a lamp shadow; ninth leftover of the far den done;'
    i = t.find(old_title_start)
    if i < 0:
        raise SystemExit("house title missing")
    # find end of title string
    j = t.find('") {\n', i)
    old_title = t[i:j+1]  # through closing quote before ) {
    # Build new title - Arca tenth closes far ten; Hush still cools; next Boot
    # Keep the long chain but prepend Arca and bump Hush to still
    rest = old_title[len('test("'):-1]  # inside quotes
    # rest starts with Hush leftover cools...
    new_inside = (
        "Arca leftover waits a window stool as a damp blotter; tenth leftover of the far den done and closes far ten; "
        "Hush leftover still cools a lamp-side pane as a lamp shadow; ninth leftover of the far den done; "
        + rest[len("Hush leftover cools a lamp-side pane as a lamp shadow; ninth leftover of the far den done; "):]
    )
    # Fix stale "next leftover is Arca" if present inside
    new_inside = new_inside.replace("next leftover is Arca;", "next leftover is Boot;")
    new_title = 'test("' + new_inside + '"'
    t = once(t, old_title, new_title, "house title")
    # pin moves
    count = t.count('assert.equal(WP.playFor("cyst"), "sill");')
    t = t.replace('assert.equal(WP.playFor("cyst"), "sill");', 'assert.equal(WP.playFor("paramecium"), "sill");')
    print("house moved", count, "pins")
    # add cyst wait asserts near umbral cool block
    old = (
        '  assert.equal(WP.playFor("umbral"), "cool");\n'
        '  assert.equal(WP.COOL, "cool");\n'
    )
    new = (
        '  assert.equal(WP.playFor("umbral"), "cool");\n'
        '  assert.equal(WP.COOL, "cool");\n'
        '  assert.equal(WP.playFor("cyst"), "wait");\n'
        '  assert.equal(WP.WAIT, "wait");\n'
        '  assert.notEqual(WP.playFor("cyst"), "reef");\n'
        '  assert.notEqual(WP.playFor("cyst"), "drink");\n'
        '  assert.notEqual(WP.playFor("cyst"), "loop");\n'
        '  assert.notEqual(WP.playFor("cyst"), "emerge");\n'
        '  assert.notEqual(WP.playFor("cyst"), "cool");\n'
        '  assert.notEqual(WP.playFor("cyst"), "sill");\n'
        '  assert.equal(WP.playFor("paramecium"), "sill");\n'
    )
    t = once(t, old, new, "house arca kind")
    path.write_text(t, encoding="utf-8", newline="\n")
    print("house patched")

def main():
    patch_tests(HERE / "desktop/renderer/window-play.test.cjs", use_p=True)
    patch_tests(HERE / "web/scripts/window-play.test.mjs", use_p=True)
    patch_house()

if __name__ == "__main__":
    main()
