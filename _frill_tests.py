# -*- coding: utf-8 -*-
"""Add Frill shelf tests; retarget sill pin to fly_agaric; update leftover-house."""
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
test("Frill shelves a sash stile as a timber shelf: walk onto the stile, sit, lean then bracket again, sit the shelf, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("oyster"), "shelf");
  assert.equal(P.SHELF, "shelf");
  assert.notEqual(P.playFor("oyster"), "frill");
  assert.notEqual(P.playFor("oyster"), "oyster");
  assert.notEqual(P.playFor("oyster"), "gold");
  assert.notEqual(P.playFor("oyster"), "flush");
  assert.notEqual(P.playFor("oyster"), "seize");
  assert.notEqual(P.playFor("oyster"), "fan");
  assert.notEqual(P.playFor("oyster"), "lean");
  assert.notEqual(P.playFor("oyster"), "fold");
  assert.notEqual(P.playFor("oyster"), "seed");
  assert.notEqual(P.playFor("oyster"), "bore");
  assert.notEqual(P.playFor("oyster"), "unfurl");
  assert.notEqual(P.playFor("oyster"), "plant");
  assert.notEqual(P.playFor("oyster"), "sill");
  assert.equal(P.playFor("robber_fly"), "seize");
  assert.equal(P.SEIZE, "seize");
  assert.equal(P.playFor("ginkgo"), "gold");
  assert.equal(P.playFor("moss"), "lean");
  assert.equal(P.playFor("bat"), "fold");
  assert.equal(P.playFor("oak"), "seed");
  assert.equal(P.playFor("carpenter_bee"), "bore");
  assert.equal(P.playFor("fly_agaric"), "sill");
  const target = P.pickTarget([WIN], 80, "oyster", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "shelf");
  assert.equal(target.side, "timbershelf");
  assert.equal(target.leave, "shelved");
  assert.notEqual(target.kind, "seize");
  assert.notEqual(target.kind, "gold");
  assert.notEqual(target.kind, "lean");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift >= 0, "she shelves a sash stile as a timber shelf");
  assert.ok(P.DUR.shelfHold > P.DUR.shelf * 1.2, "the hold is the sit; the shelf is the tell");
  assert.ok(P.DUR.shelfOn > 1.0, "a walk onto the stile, not the shelf");
  assert.ok(P.DUR.shelfOn !== P.DUR.seizeOn);
  assert.ok(P.DUR.shelfOn !== P.DUR.goldOn);
  assert.ok(P.DUR.shelfOn !== P.DUR.leanOn);
  assert.ok(P.DUR.shelfOn !== P.DUR.boreOn);
  assert.ok(P.DUR.shelfOn !== P.DUR.sillHop);
  assert.ok(P.DUR.shelf !== P.DUR.seize);
  assert.ok(P.DUR.shelf !== P.DUR.gold);
  assert.ok(P.DUR.shelf !== P.DUR.lean);
  assert.ok(P.DUR.shelfHold !== P.DUR.seizeHold);
  assert.ok(P.DUR.shelfOff !== P.DUR.seizeOff);
  const timber = P.shelfPoint(WIN, P.SPRITE, WORK);
  const perch = P.seizePoint(WIN, P.SPRITE, WORK);
  const gold = P.goldPoint(WIN, P.SPRITE, WORK);
  const lean = P.leanPoint(WIN, P.SPRITE, WORK);
  const bore = P.borePoint(WIN, P.SPRITE, WORK);
  assert.ok(timber.lift >= 0, "the sash stile as a timber shelf, not the sky");
  assert.ok(Math.abs(timber.x - perch.x) > 12 || Math.abs(timber.lift - perch.lift) > 2, "not Rob's grass-perch seize");
  assert.ok(Math.abs(timber.x - gold.x) > 20 || Math.abs(timber.lift - gold.lift) > 20, "not Fan's lamp-side gold");
  assert.ok(Math.abs(timber.x - lean.x) > 12 || Math.abs(timber.lift - lean.lift) > 2, "not Felt's meeting-rail lean");
  assert.ok(Math.abs(timber.x - bore.x) > 20 || Math.abs(timber.lift - bore.lift) > 8, "not Auger's stile bore");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "oyster", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real sash stile, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 184, height: 152 }], 80, "oyster", WORK, P.SPRITE);
  assert.equal(short, null, "a real timber shelf, not Rob's seize gate");
  const thin = P.pickTarget([{ id: "thin", x: 200, y: 80, width: 188, height: 200 }], 80, "oyster", WORK, P.SPRITE);
  assert.equal(thin, null, "a real timber-shelf stile, not a thinner stile");
  const okShelf = P.pickTarget([{ id: "shelf", x: 200, y: 80, width: 188, height: 204 }], 80, "oyster", WORK, P.SPRITE);
  assert.ok(okShelf, "a real sash stile as a timber shelf");
  const seizeOk = P.pickTarget([{ id: "seize", x: 200, y: 80, width: 184, height: 152 }], 80, "robber_fly", WORK, P.SPRITE);
  assert.ok(seizeOk, "Rob still takes a grass perch");
  const walkOn = P.shelfOnPath(0.25, { x: 40, lift: 0 }, { x: timber.x, lift: timber.lift });
  const seizeOn = P.seizeOnPath(0.25, { x: 40, lift: 0 }, { x: timber.x, lift: timber.lift });
  assert.ok(walkOn.lift >= 0, "she walks onto the stile as a timber shelf");
  assert.ok(walkOn.rot !== seizeOn.rot, "a walk onto the stile, not Rob seize");
  const shelfPose = P.shelfPath(0.3);
  const seizePose = P.seizePath(0.3);
  const leanPose = P.leanPath ? P.leanPath(0.3) : { rot: 999 };
  assert.ok(Math.abs(shelfPose.x) > 1 || Math.abs(shelfPose.rot) > 2, "she shelves with a lean-then-bracket; shelf is the tell");
  assert.ok(shelfPose.rot !== seizePose.rot, "shelf, not seize");
  assert.ok(shelfPose.x !== seizePose.x, "a bracket lean, not a seize dart");
  const hold = P.shelfHoldPath(0.5);
  assert.ok(Math.abs(hold.rot + 3.5) < 0.2, "she holds the sit on the shelf");
  assert.ok(Math.abs(hold.x - 1.15) < 0.05, "she stays on the timber shelf");
  assert.ok(hold.lift < 2, "sit on the stile, not a lean peak");
  const off0 = P.shelfOffPath(0, { x: timber.x, lift: timber.lift + 0.62, rot: -3.5 }, { x: timber.x + 50, lift: 0 });
  const offMid = P.shelfOffPath(0.5, { x: timber.x, lift: timber.lift + 0.62, rot: -3.5 }, { x: timber.x + 50, lift: 0 });
  const off1 = P.shelfOffPath(1, { x: timber.x, lift: timber.lift + 0.62, rot: -3.5 }, { x: timber.x + 50, lift: 0 });
  assert.ok(Math.abs(off0.x - timber.x) < 2);
  assert.ok(Math.abs(offMid.x - timber.x) > 8, "a walk leave off the timber shelf");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "seize");
    assert.notEqual(play.phase, "gold");
    assert.notEqual(play.phase, "lean");
    assert.notEqual(play.phase, "bore");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "shelf") {
      assert.ok(play.lift !== undefined, "she shelves on the sash stile");
    }
  }
  assert.ok(seen.has("shelf-on"));
  assert.ok(seen.has("shelf"));
  assert.ok(seen.has("shelf-hold"));
  assert.ok(seen.has("shelf-off"));
  assert.ok(seen.has("approach") || seen.has("walk") || seen.has("land"));
  assert.equal(windowIds.size, 1, "one window; bounds-only");
  assert.equal(play.phase, "done");
});

test("a moved window refits Frill's timber-shelf shelf; sleep, card, and hide abort; Frill never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "oyster", WORK, P.SPRITE);
  assert.ok(target);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "shelf"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "shelf");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "shelf");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved sash stile");
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "shelf-off");
  assert.equal(play.abort, true);
});
'''

MJS = r'''
test("Frill shelves a sash stile as a timber shelf: walk onto the stile, sit, lean then bracket again, sit the shelf, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("oyster"), "shelf");
  assert.equal(P.SHELF, "shelf");
  assert.notEqual(P.playFor("oyster"), "frill");
  assert.notEqual(P.playFor("oyster"), "gold");
  assert.notEqual(P.playFor("oyster"), "seize");
  assert.notEqual(P.playFor("oyster"), "lean");
  assert.notEqual(P.playFor("oyster"), "sill");
  assert.equal(P.playFor("robber_fly"), "seize");
  assert.equal(P.SEIZE, "seize");
  assert.equal(P.playFor("ginkgo"), "gold");
  assert.equal(P.playFor("moss"), "lean");
  assert.equal(P.playFor("fly_agaric"), "sill");
  assert.equal(Overlay.playFor("oyster"), "shelf");
  const target = P.pickTarget([WIN], 80, "oyster", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "shelf");
  assert.equal(target.side, "timbershelf");
  assert.equal(target.leave, "shelved");
  assert.ok(target.holdLift >= 0);
  assert.ok(P.DUR.shelfHold > P.DUR.shelf * 1.2);
  assert.ok(P.DUR.shelfOn !== P.DUR.seizeOn);
  assert.ok(P.DUR.shelf !== P.DUR.seize);
  const timber = P.shelfPoint(WIN, P.SPRITE, WORK);
  const perch = P.seizePoint(WIN, P.SPRITE, WORK);
  assert.ok(Math.abs(timber.x - perch.x) > 12 || Math.abs(timber.lift - perch.lift) > 2);
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "oyster", WORK, P.SPRITE);
  assert.equal(tiny, null);
  const okShelf = P.pickTarget([{ id: "shelf", x: 200, y: 80, width: 188, height: 204 }], 80, "oyster", WORK, P.SPRITE);
  assert.ok(okShelf);
  const shelfPose = P.shelfPath(0.3);
  assert.ok(Math.abs(shelfPose.x) > 1 || Math.abs(shelfPose.rot) > 2);
  const hold = P.shelfHoldPath(0.5);
  assert.ok(Math.abs(hold.rot + 3.5) < 0.2);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "seize");
    assert.notEqual(play.phase, "gold");
    assert.notEqual(play.phase, "lean");
  }
  assert.ok(seen.has("shelf-on"));
  assert.ok(seen.has("shelf"));
  assert.ok(seen.has("shelf-hold"));
  assert.ok(seen.has("shelf-off"));
  assert.equal(play.phase, "done");
});

test("a moved window refits Frill's timber-shelf shelf; sleep, card, and hide abort", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  const target = P.pickTarget([WIN], 200, "oyster", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "shelf"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "shelf");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "shelf");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "shelf-off");
  assert.equal(play.abort, true);
});

test("the demo window plate walks Frill shelf the same way", () => {
  assert.equal(Overlay.playFor("oyster"), "shelf");
  assert.equal(P.playFor("oyster"), "shelf");
  const target = P.pickTarget([WIN], 80, "oyster", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "shelf");
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.ok(seen.has("shelf"));
  assert.equal(play.phase, "done");
});
'''

# Verify catalog keys for forbidden-kind owners
fungi = open("web/src/lib/pets/catalog.ts", encoding="utf-8").read() if False else ""
# quick key check via fungi roster already known: ginkgo=Fan, moss=Felt, sugar_glider=Cape, squirrel=Mast, carpenter_bee=Auger
# Confirm from playFor existing returns in tests
cjs0 = open("desktop/renderer/window-play.test.cjs", encoding="utf-8").read()
for needle in ['playFor("ginkgo")', 'playFor("moss")', 'playFor("bat")', 'playFor("oak")', 'playFor("carpenter_bee")']:
    print(needle, needle in cjs0 or needle.replace('playFor', 'P.playFor') in cjs0)

# probe keys from js playFor
js = open("desktop/renderer/window-play.js", encoding="utf-8").read()
for key in ["ginkgo", "moss", "sugar_glider", "squirrel", "carpenter_bee", "lichen", "liverwort"]:
    i = js.find('key === "%s"' % key)
    print(key, "playFor", i)

# --- CJS ---
cjs, nl = load("desktop/renderer/window-play.test.cjs")
# retarget generic sill pin oyster -> fly_agaric
cjs = replace_all(
    cjs,
    'const target = P.pickTarget([WIN], 80, "oyster", WORK, P.SPRITE);',
    'const target = P.pickTarget([WIN], 80, "fly_agaric", WORK, P.SPRITE);',
    "cjs generic sill pin",
)
n = cjs.count('assert.equal(P.playFor("oyster"), "sill");')
print("cjs oyster sill pins", n)
cjs = replace_all(
    cjs,
    'assert.equal(P.playFor("oyster"), "sill");',
    'assert.equal(P.playFor("fly_agaric"), "sill");',
    "cjs sill pins",
    n,
)
# insert after Rob refit test
marker = 'test("a moved window refits Rob\'s grass-perch seize; sleep, card, and hide abort; Rob never starts asleep"'
idx = cjs.find(marker)
if idx < 0:
    raise SystemExit("MISSING rob refit marker")
end = cjs.find("assert.equal(play.abort, true);\n});", idx)
if end < 0:
    raise SystemExit("MISSING rob refit end")
end = end + len("assert.equal(play.abort, true);\n});")
cjs = cjs[:end] + "\n" + CJS + cjs[end:]
save("desktop/renderer/window-play.test.cjs", cjs, nl)
print("ok cjs")

# --- MJS ---
mjs, mnl = load("web/scripts/window-play.test.mjs")
n = mjs.count('assert.equal(P.playFor("oyster"), "sill");')
print("mjs oyster sill pins", n)
if n:
    mjs = replace_all(
        mjs,
        'assert.equal(P.playFor("oyster"), "sill");',
        'assert.equal(P.playFor("fly_agaric"), "sill");',
        "mjs sill pins",
        n,
    )
demo = mjs.find('test("the demo window plate walks Rob seize the same way"')
if demo < 0:
    raise SystemExit("MISSING mjs rob demo")
end = mjs.find('assert.equal(play.phase, "done");\n});', demo)
if end < 0:
    raise SystemExit("MISSING mjs rob demo end")
end = end + len('assert.equal(play.phase, "done");\n});')
mjs = mjs[:end] + "\n" + MJS + mjs[end:]
save("web/scripts/window-play.test.mjs", mjs, mnl)
print("ok mjs")
