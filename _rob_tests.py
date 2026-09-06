# -*- coding: utf-8 -*-
"""Add Rob seize tests; retarget sill pin to oyster; update leftover-house."""
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
    if text.count(old) != 1:
        raise SystemExit("COUNT %s for %s" % (text.count(old), label))
    return text.replace(old, new, 1)

def replace_all(text, old, new, label, expect=None):
    n = text.count(old)
    if expect is not None and n != expect:
        raise SystemExit("COUNT %s want %s for %s" % (n, expect, label))
    if n == 0:
        raise SystemExit("MISSING: " + label)
    return text.replace(old, new)

CJS = r'''
test("Rob seizes a window stool as a grass perch: walk onto the stool, sit, seize once, sit the perch, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("robber_fly"), "seize");
  assert.equal(P.SEIZE, "seize");
  assert.notEqual(P.playFor("robber_fly"), "rob");
  assert.notEqual(P.playFor("robber_fly"), "hunt");
  assert.notEqual(P.playFor("robber_fly"), "hawk");
  assert.notEqual(P.playFor("robber_fly"), "perch");
  assert.notEqual(P.playFor("robber_fly"), "bristle");
  assert.notEqual(P.playFor("robber_fly"), "pounce");
  assert.notEqual(P.playFor("robber_fly"), "sip");
  assert.notEqual(P.playFor("robber_fly"), "forage");
  assert.notEqual(P.playFor("robber_fly"), "thrum");
  assert.notEqual(P.playFor("robber_fly"), "right");
  assert.notEqual(P.playFor("robber_fly"), "drone");
  assert.notEqual(P.playFor("robber_fly"), "ambush");
  assert.notEqual(P.playFor("robber_fly"), "stoop");
  assert.notEqual(P.playFor("robber_fly"), "sill");
  assert.equal(P.playFor("click_beetle"), "right");
  assert.equal(P.RIGHT, "right");
  assert.equal(P.playFor("relay_dragon"), "click");
  assert.equal(P.CLICK, "click");
  assert.equal(P.playFor("house_centipede"), "hunt");
  assert.equal(P.playFor("darner"), "hawk");
  assert.equal(P.playFor("hummingbird"), "sip");
  assert.equal(P.playFor("bumblebee"), "forage");
  assert.equal(P.playFor("porcupine"), "bristle");
  assert.equal(P.playFor("red_tail"), "soar");
  assert.equal(P.playFor("jumping_spider"), "pounce");
  assert.equal(P.playFor("honey_drone"), "drone");
  assert.equal(P.playFor("oyster"), "sill");
  const target = P.pickTarget([WIN], 80, "robber_fly", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "seize");
  assert.equal(target.side, "grassperch");
  assert.equal(target.leave, "seized");
  assert.notEqual(target.kind, "hunt");
  assert.notEqual(target.kind, "hawk");
  assert.notEqual(target.kind, "right");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift >= 0, "she seizes a window stool as a grass perch");
  assert.ok(P.DUR.seizeHold > P.DUR.seize * 1.2, "the hold is the sit; the seize is the tell");
  assert.ok(P.DUR.seizeOn > 1.0, "a walk onto the stool, not the seize");
  assert.ok(P.DUR.seizeOn !== P.DUR.rightOn);
  assert.ok(P.DUR.seizeOn !== P.DUR.huntOn);
  assert.ok(P.DUR.seizeOn !== P.DUR.hawkOn);
  assert.ok(P.DUR.seizeOn !== P.DUR.sipOn);
  assert.ok(P.DUR.seizeOn !== P.DUR.forageOn);
  assert.ok(P.DUR.seizeOn !== P.DUR.sillHop);
  assert.ok(P.DUR.seize !== P.DUR.right);
  assert.ok(P.DUR.seize !== P.DUR.hunt);
  assert.ok(P.DUR.seize !== P.DUR.hawk);
  assert.ok(P.DUR.seizeHold !== P.DUR.rightHold);
  assert.ok(P.DUR.seizeOff !== P.DUR.rightOff);
  const perch = P.seizePoint(WIN, P.SPRITE, WORK);
  const plate = P.rightPoint(WIN, P.SPRITE, WORK);
  const song = P.songPoint(WIN, P.SPRITE, WORK);
  const hunt = P.huntPoint(WIN, P.SPRITE, WORK);
  const hawk = P.hawkPoint(WIN, P.SPRITE, WORK);
  assert.ok(perch.lift >= 0, "the window stool as a grass perch, not the sky");
  assert.ok(Math.abs(perch.x - plate.x) > 12 || Math.abs(perch.lift - plate.lift) > 2, "not Click's bark-plate right");
  assert.ok(Math.abs(perch.x - song.x) > 12 || Math.abs(perch.lift - song.lift) > 2, "not Chirp's grass-dish song");
  assert.ok(Math.abs(perch.x - hunt.x) > 20 || Math.abs(perch.lift - hunt.lift) > 20, "not Haste's crack hunt");
  assert.ok(Math.abs(perch.x - hawk.x) > 20 || Math.abs(perch.lift - hawk.lift) > 20, "not Dart's prey-air hawk");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "robber_fly", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real window stool, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 168, height: 74 }], 80, "robber_fly", WORK, P.SPRITE);
  assert.equal(short, null, "a real grass perch, not Brood's emerge gate");
  const thin = P.pickTarget([{ id: "thin", x: 200, y: 80, width: 184, height: 150 }], 80, "robber_fly", WORK, P.SPRITE);
  assert.equal(thin, null, "a real grass-perch stool, not a thinner stool");
  const okSeize = P.pickTarget([{ id: "seize", x: 200, y: 80, width: 184, height: 152 }], 80, "robber_fly", WORK, P.SPRITE);
  assert.ok(okSeize, "a real window stool as a grass perch");
  const rightOk = P.pickTarget([{ id: "right", x: 200, y: 80, width: 184, height: 152 }], 80, "click_beetle", WORK, P.SPRITE);
  assert.ok(rightOk, "Click still takes a bark plate");
  const walkOn = P.seizeOnPath(0.25, { x: 40, lift: 0 }, { x: perch.x, lift: perch.lift });
  const rightOn = P.rightOnPath(0.25, { x: 40, lift: 0 }, { x: perch.x, lift: perch.lift });
  assert.ok(walkOn.lift >= 0, "she walks onto the stool as a grass perch");
  assert.ok(walkOn.rot !== rightOn.rot, "a walk onto the stool, not Click right");
  const seizePose = P.seizePath(0.3);
  const rightPose = P.rightPath(0.3);
  const huntPose = P.huntPath ? P.huntPath(0.3) : { rot: 999 };
  assert.ok(Math.abs(seizePose.x) > 4 || Math.abs(seizePose.rot) > 2, "she seizes with a take; seize is the tell");
  assert.ok(seizePose.rot !== rightPose.rot, "seize, not right");
  assert.ok(seizePose.x !== rightPose.x, "a dart take, not a righting click");
  const hold = P.seizeHoldPath(0.5);
  assert.ok(Math.abs(hold.rot + 2.4) < 0.2, "she holds the sit on the perch");
  assert.ok(Math.abs(hold.x - 0.28) < 0.05, "she stays on the grass perch");
  assert.ok(hold.lift < 2, "sit on the stool, not a seize dart");
  const off0 = P.seizeOffPath(0, { x: perch.x, lift: perch.lift + 0.75, rot: -2.4 }, { x: perch.x + 50, lift: 0 });
  const offMid = P.seizeOffPath(0.5, { x: perch.x, lift: perch.lift + 0.75, rot: -2.4 }, { x: perch.x + 50, lift: 0 });
  const off1 = P.seizeOffPath(1, { x: perch.x, lift: perch.lift + 0.75, rot: -2.4 }, { x: perch.x + 50, lift: 0 });
  assert.ok(Math.abs(off0.x - perch.x) < 2);
  assert.ok(Math.abs(offMid.x - perch.x) > 8, "a walk leave off the grass perch");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "right");
    assert.notEqual(play.phase, "hunt");
    assert.notEqual(play.phase, "hawk");
    assert.notEqual(play.phase, "sip");
    assert.notEqual(play.phase, "forage");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "seize") {
      assert.ok(play.lift !== undefined, "she seizes on the window stool");
    }
  }
  assert.ok(seen.has("seize-on"));
  assert.ok(seen.has("seize"));
  assert.ok(seen.has("seize-hold"));
  assert.ok(seen.has("seize-off"));
  assert.ok(seen.has("approach") || seen.has("walk") || seen.has("land"));
  assert.equal(windowIds.size, 1, "one window; bounds-only");
  assert.equal(play.phase, "done");
});

test("a moved window refits Rob's grass-perch seize; sleep, card, and hide abort; Rob never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "robber_fly", WORK, P.SPRITE);
  assert.ok(target);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "seize"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "seize");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "seize");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved window stool");
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "seize-off");
  assert.equal(play.abort, true);
});
'''

MJS = r'''
test("Rob seizes a window stool as a grass perch: walk onto the stool, sit, seize once, sit the perch, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("robber_fly"), "seize");
  assert.equal(P.SEIZE, "seize");
  assert.notEqual(P.playFor("robber_fly"), "rob");
  assert.notEqual(P.playFor("robber_fly"), "hunt");
  assert.notEqual(P.playFor("robber_fly"), "hawk");
  assert.notEqual(P.playFor("robber_fly"), "right");
  assert.notEqual(P.playFor("robber_fly"), "sill");
  assert.equal(P.playFor("click_beetle"), "right");
  assert.equal(P.RIGHT, "right");
  assert.equal(P.playFor("relay_dragon"), "click");
  assert.equal(P.CLICK, "click");
  assert.equal(P.playFor("house_centipede"), "hunt");
  assert.equal(P.playFor("darner"), "hawk");
  assert.equal(P.playFor("oyster"), "sill");
  assert.equal(Overlay.playFor("robber_fly"), "seize");
  const target = P.pickTarget([WIN], 80, "robber_fly", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "seize");
  assert.equal(target.side, "grassperch");
  assert.equal(target.leave, "seized");
  assert.ok(target.holdLift >= 0);
  assert.ok(P.DUR.seizeHold > P.DUR.seize * 1.2);
  assert.ok(P.DUR.seizeOn !== P.DUR.rightOn);
  assert.ok(P.DUR.seize !== P.DUR.right);
  const perch = P.seizePoint(WIN, P.SPRITE, WORK);
  const plate = P.rightPoint(WIN, P.SPRITE, WORK);
  assert.ok(Math.abs(perch.x - plate.x) > 12 || Math.abs(perch.lift - plate.lift) > 2);
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "robber_fly", WORK, P.SPRITE);
  assert.equal(tiny, null);
  const okSeize = P.pickTarget([{ id: "seize", x: 200, y: 80, width: 184, height: 152 }], 80, "robber_fly", WORK, P.SPRITE);
  assert.ok(okSeize);
  const seizePose = P.seizePath(0.3);
  assert.ok(Math.abs(seizePose.x) > 4 || Math.abs(seizePose.rot) > 2);
  const hold = P.seizeHoldPath(0.5);
  assert.ok(Math.abs(hold.rot + 2.4) < 0.2);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "right");
    assert.notEqual(play.phase, "hunt");
    assert.notEqual(play.phase, "hawk");
  }
  assert.ok(seen.has("seize-on"));
  assert.ok(seen.has("seize"));
  assert.ok(seen.has("seize-hold"));
  assert.ok(seen.has("seize-off"));
  assert.equal(play.phase, "done");
});

test("a moved window refits Rob's grass-perch seize; sleep, card, and hide abort", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  const target = P.pickTarget([WIN], 200, "robber_fly", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "seize"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "seize");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "seize");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "seize-off");
  assert.equal(play.abort, true);
});

test("the demo window plate walks Rob seize the same way", () => {
  assert.equal(Overlay.playFor("robber_fly"), "seize");
  assert.equal(P.playFor("robber_fly"), "seize");
  const target = P.pickTarget([WIN], 80, "robber_fly", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "seize");
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.ok(seen.has("seize"));
  assert.equal(play.phase, "done");
});
'''

# --- CJS ---
cjs, nl = load("desktop/renderer/window-play.test.cjs")
cjs = must_replace(
    cjs,
    'const target = P.pickTarget([WIN], 80, "robber_fly", WORK, P.SPRITE);',
    'const target = P.pickTarget([WIN], 80, "oyster", WORK, P.SPRITE);',
    "cjs generic sill pin",
)
n = cjs.count('assert.equal(P.playFor("robber_fly"), "sill");')
print("cjs robber_fly sill pins", n)
cjs = replace_all(
    cjs,
    'assert.equal(P.playFor("robber_fly"), "sill");',
    'assert.equal(P.playFor("oyster"), "sill");',
    "cjs sill pins",
    n,
)
# insert after Click refit test
marker = 'test("a moved window refits Click\'s bark-plate right; sleep, card, and hide abort; Click never starts asleep"'
idx = cjs.find(marker)
if idx < 0:
    raise SystemExit("MISSING click refit marker")
end = cjs.find("assert.equal(play.abort, true);\n});", idx)
if end < 0:
    raise SystemExit("MISSING click refit end")
end = end + len("assert.equal(play.abort, true);\n});")
cjs = cjs[:end] + "\n" + CJS + cjs[end:]
save("desktop/renderer/window-play.test.cjs", cjs, nl)
print("ok cjs")

# --- MJS ---
mjs, mnl = load("web/scripts/window-play.test.mjs")
n = mjs.count('assert.equal(P.playFor("robber_fly"), "sill");')
print("mjs robber_fly sill pins", n)
if n:
    mjs = replace_all(
        mjs,
        'assert.equal(P.playFor("robber_fly"), "sill");',
        'assert.equal(P.playFor("oyster"), "sill");',
        "mjs sill pins",
        n,
    )
# insert after demo Click test
demo = mjs.find('test("the demo window plate walks Click right the same way"')
if demo < 0:
    raise SystemExit("MISSING mjs click demo")
end = mjs.find('assert.equal(play.phase, "done");\n});', demo)
if end < 0:
    raise SystemExit("MISSING mjs click demo end")
end = end + len('assert.equal(play.phase, "done");\n});')
mjs = mjs[:end] + "\n" + MJS + mjs[end:]
save("web/scripts/window-play.test.mjs", mjs, mnl)
print("ok mjs")
