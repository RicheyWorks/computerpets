# -*- coding: utf-8 -*-
"""Cap leftover tests + leftover-house. Retarget sill pin to morel. Do not implement Lattice."""
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

def mr(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit("%s count=%s" % (label, n))
    return text.replace(old, new, 1)

CJS = r'''
test("Cap warts a window apron as a moss cup: walk onto the apron, sit, wart once, sit the cup, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("fly_agaric"), "warts");
  assert.equal(P.WARTS, "warts");
  assert.notEqual(P.playFor("fly_agaric"), "cap");
  assert.notEqual(P.playFor("fly_agaric"), "fly_agaric");
  assert.notEqual(P.playFor("fly_agaric"), "shelf");
  assert.notEqual(P.playFor("fly_agaric"), "spot");
  assert.notEqual(P.playFor("fly_agaric"), "spots");
  assert.notEqual(P.playFor("fly_agaric"), "ring");
  assert.notEqual(P.playFor("fly_agaric"), "flush");
  assert.notEqual(P.playFor("fly_agaric"), "red");
  assert.notEqual(P.playFor("fly_agaric"), "seize");
  assert.notEqual(P.playFor("fly_agaric"), "toadstool");
  assert.notEqual(P.playFor("fly_agaric"), "honk");
  assert.notEqual(P.playFor("fly_agaric"), "loop");
  assert.notEqual(P.playFor("fly_agaric"), "grip");
  assert.notEqual(P.playFor("fly_agaric"), "sill");
  assert.equal(P.playFor("oyster"), "shelf");
  assert.equal(P.SHELF, "shelf");
  assert.equal(P.playFor("ladybird"), "spot");
  assert.equal(P.playFor("cuttlefish"), "flush");
  assert.equal(P.playFor("robber_fly"), "seize");
  assert.equal(P.playFor("lamprey"), "ring");
  assert.equal(P.playFor("morel"), "sill");
  const target = P.pickTarget([WIN], 80, "fly_agaric", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "warts");
  assert.equal(target.side, "mosscup");
  assert.equal(target.leave, "warted");
  assert.notEqual(target.kind, "shelf");
  assert.notEqual(target.kind, "cap");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift >= 0, "she warts a window apron as a moss cup");
  assert.ok(P.DUR.wartsHold > P.DUR.warts * 1.2, "the hold is the sit; warts is the tell");
  assert.ok(P.DUR.wartsOn > 1.0, "a walk onto the apron, not the cup");
  assert.ok(P.DUR.wartsOn !== P.DUR.shelfOn);
  assert.ok(P.DUR.wartsOn !== P.DUR.seizeOn);
  assert.ok(P.DUR.wartsOn !== P.DUR.honkOn);
  assert.ok(P.DUR.wartsOn !== P.DUR.loopOn);
  assert.ok(P.DUR.wartsOn !== P.DUR.gripOn);
  assert.ok(P.DUR.wartsOn !== P.DUR.jumpOn);
  assert.ok(P.DUR.wartsOn !== P.DUR.sillHop);
  assert.ok(P.DUR.warts !== P.DUR.shelf);
  assert.ok(P.DUR.warts !== P.DUR.spot);
  assert.ok(P.DUR.wartsHold !== P.DUR.shelfHold);
  assert.ok(P.DUR.wartsOff !== P.DUR.shelfOff);
  const cup = P.wartsPoint(WIN, P.SPRITE, WORK);
  const timber = P.shelfPoint(WIN, P.SPRITE, WORK);
  const perch = P.seizePoint(WIN, P.SPRITE, WORK);
  const honk = P.honkPoint(WIN, P.SPRITE, WORK);
  const grip = P.gripPoint(WIN, P.SPRITE, WORK);
  assert.ok(cup.lift >= 0, "the window apron as a moss cup, not the sky");
  assert.ok(Math.abs(cup.x - timber.x) > 12 || Math.abs(cup.lift - timber.lift) > 2, "not Frill's timber-shelf shelf");
  assert.ok(Math.abs(cup.x - perch.x) > 12 || Math.abs(cup.lift - perch.lift) > 2, "not Rob's grass-perch seize");
  assert.ok(Math.abs(cup.x - honk.x) > 8 || Math.abs(cup.lift - honk.lift) > 1, "not Vee's blotter-green honk");
  assert.ok(Math.abs(cup.x - grip.x) > 8 || Math.abs(cup.lift - grip.lift) > 1, "not Clasp's blotter-hem grip");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "fly_agaric", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real window apron, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 184, height: 146 }], 80, "fly_agaric", WORK, P.SPRITE);
  assert.equal(short, null, "a real moss cup, not a thinner apron");
  const okWarts = P.pickTarget([{ id: "warts", x: 200, y: 80, width: 186, height: 148 }], 80, "fly_agaric", WORK, P.SPRITE);
  assert.ok(okWarts, "a real window apron as a moss cup");
  const shelfOk = P.pickTarget([{ id: "shelf", x: 200, y: 80, width: 188, height: 204 }], 80, "oyster", WORK, P.SPRITE);
  assert.ok(shelfOk, "Frill still takes a timber shelf");
  const walkOn = P.wartsOnPath(0.25, { x: 40, lift: 0 }, { x: cup.x, lift: cup.lift });
  const shelfOn = P.shelfOnPath(0.25, { x: 40, lift: 0 }, { x: cup.x, lift: cup.lift });
  assert.ok(walkOn.lift >= 0, "she walks onto the apron as a moss cup");
  assert.ok(walkOn.rot !== shelfOn.rot, "a walk onto the apron, not Frill shelf");
  const wartsPose = P.wartsPath(0.3);
  const shelfPose = P.shelfPath(0.3);
  assert.ok(Math.abs(wartsPose.x) > 0.2 || Math.abs(wartsPose.rot) > 1, "she warts once; warts is the tell");
  assert.ok(wartsPose.rot !== shelfPose.rot, "warts, not shelf");
  const hold = P.wartsHoldPath(0.5);
  assert.ok(Math.abs(hold.rot + 2.6) < 0.2, "she holds the sit on the cup");
  assert.ok(Math.abs(hold.x - 0.23) < 0.05, "she stays on the moss cup");
  assert.ok(hold.lift < 2, "sit on the apron, not a wart peak");
  const off0 = P.wartsOffPath(0, { x: cup.x, lift: cup.lift + 0.67, rot: -2.6 }, { x: cup.x + 50, lift: 0 });
  const offMid = P.wartsOffPath(0.5, { x: cup.x, lift: cup.lift + 0.67, rot: -2.6 }, { x: cup.x + 50, lift: 0 });
  const off1 = P.wartsOffPath(1, { x: cup.x, lift: cup.lift + 0.67, rot: -2.6 }, { x: cup.x + 50, lift: 0 });
  assert.ok(Math.abs(off0.x - cup.x) < 2);
  assert.ok(Math.abs(offMid.x - cup.x) > 8, "a walk leave off the moss cup");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "shelf");
    assert.notEqual(play.phase, "honk");
    assert.notEqual(play.phase, "loop");
    assert.notEqual(play.phase, "grip");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "warts") {
      assert.ok(play.lift !== undefined, "she warts on the window apron");
    }
  }
  assert.ok(seen.has("warts-on"));
  assert.ok(seen.has("warts"));
  assert.ok(seen.has("warts-hold"));
  assert.ok(seen.has("warts-off"));
  assert.ok(seen.has("approach") || seen.has("walk") || seen.has("land"));
  assert.equal(windowIds.size, 1, "one window; bounds-only");
  assert.equal(play.phase, "done");
});

test("a moved window refits Cap's moss-cup warts; sleep, card, and hide abort; Cap never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "fly_agaric", WORK, P.SPRITE);
  assert.ok(target);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "warts"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "warts");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "warts");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved window apron");
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "warts-off");
  assert.equal(play.abort, true);
});
'''

MJS = r'''
test("Cap warts a window apron as a moss cup: walk onto the apron, sit, wart once, sit the cup, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("fly_agaric"), "warts");
  assert.equal(P.WARTS, "warts");
  assert.notEqual(P.playFor("fly_agaric"), "cap");
  assert.notEqual(P.playFor("fly_agaric"), "shelf");
  assert.notEqual(P.playFor("fly_agaric"), "spot");
  assert.notEqual(P.playFor("fly_agaric"), "sill");
  assert.equal(P.playFor("oyster"), "shelf");
  assert.equal(P.SHELF, "shelf");
  assert.equal(P.playFor("morel"), "sill");
  assert.equal(Overlay.playFor("fly_agaric"), "warts");
  const target = P.pickTarget([WIN], 80, "fly_agaric", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "warts");
  assert.equal(target.side, "mosscup");
  assert.equal(target.leave, "warted");
  assert.ok(target.holdLift >= 0);
  assert.ok(P.DUR.wartsHold > P.DUR.warts * 1.2);
  assert.ok(P.DUR.wartsOn !== P.DUR.shelfOn);
  assert.ok(P.DUR.warts !== P.DUR.shelf);
  const cup = P.wartsPoint(WIN, P.SPRITE, WORK);
  const timber = P.shelfPoint(WIN, P.SPRITE, WORK);
  assert.ok(Math.abs(cup.x - timber.x) > 12 || Math.abs(cup.lift - timber.lift) > 2);
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "fly_agaric", WORK, P.SPRITE);
  assert.equal(tiny, null);
  const okWarts = P.pickTarget([{ id: "warts", x: 200, y: 80, width: 186, height: 148 }], 80, "fly_agaric", WORK, P.SPRITE);
  assert.ok(okWarts);
  const wartsPose = P.wartsPath(0.3);
  assert.ok(Math.abs(wartsPose.x) > 0.2 || Math.abs(wartsPose.rot) > 1);
  const hold = P.wartsHoldPath(0.5);
  assert.ok(Math.abs(hold.rot + 2.6) < 0.2);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "shelf");
    assert.notEqual(play.phase, "honk");
    assert.notEqual(play.phase, "grip");
  }
  assert.ok(seen.has("warts-on"));
  assert.ok(seen.has("warts"));
  assert.ok(seen.has("warts-hold"));
  assert.ok(seen.has("warts-off"));
  assert.equal(play.phase, "done");
});

test("a moved window refits Cap's moss-cup warts; sleep, card, and hide abort", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  const target = P.pickTarget([WIN], 200, "fly_agaric", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "warts"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "warts");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "warts");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "warts-off");
  assert.equal(play.abort, true);
});

test("the overlay window plate walks Cap warts the same way", () => {
  assert.equal(Overlay.playFor("fly_agaric"), "warts");
  assert.equal(P.playFor("fly_agaric"), "warts");
  const target = P.pickTarget([WIN], 80, "fly_agaric", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "warts");
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.ok(seen.has("warts"));
  assert.equal(play.phase, "done");
});
'''

cjs, nl = load("desktop/renderer/window-play.test.cjs")
cjs = cjs.replace('P.pickTarget([WIN], 80, "fly_agaric", WORK, P.SPRITE)', 'P.pickTarget([WIN], 80, "morel", WORK, P.SPRITE)')
n = cjs.count('assert.equal(P.playFor("fly_agaric"), "sill");')
print("cjs fly sill pins", n)
if n:
    cjs = cjs.replace('assert.equal(P.playFor("fly_agaric"), "sill");', 'assert.equal(P.playFor("morel"), "sill");')
marker = 'assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved sash stile");'
idx = cjs.find(marker)
if idx < 0:
    raise SystemExit("MISSING frill refit marker")
end = cjs.find("assert.equal(play.abort, true);\n});", idx)
if end < 0:
    raise SystemExit("MISSING frill refit end")
end = end + len("assert.equal(play.abort, true);\n});")
cjs = cjs[:end] + "\n" + CJS + cjs[end:]
save("desktop/renderer/window-play.test.cjs", cjs, nl)
print("ok cjs")

mjs, mnl = load("web/scripts/window-play.test.mjs")
n = mjs.count('assert.equal(P.playFor("fly_agaric"), "sill");')
print("mjs fly sill pins", n)
if n:
    mjs = mjs.replace('assert.equal(P.playFor("fly_agaric"), "sill");', 'assert.equal(P.playFor("morel"), "sill");')
demo = mjs.find('test("the demo window plate walks Frill shelf the same way"')
if demo < 0:
    raise SystemExit("MISSING mjs frill demo")
end = mjs.find('assert.equal(play.phase, "done");\n});', demo)
if end < 0:
    raise SystemExit("MISSING mjs frill demo end")
end = end + len('assert.equal(play.phase, "done");\n});')
mjs = mjs[:end] + "\n" + MJS + mjs[end:]
save("web/scripts/window-play.test.mjs", mjs, mnl)
print("ok mjs")

house, hnl = load("desktop/renderer/leftover-house.test.cjs")
house = mr(
    house,
    'test("Frill leftover shelves a sash stile as a timber shelf; first leftover of the fungi den done; ',
    'test("Cap leftover warts a window apron as a moss cup; second leftover of the fungi den done; Frill leftover still shelves a sash stile as a timber shelf; first leftover of the fungi den done; ',
    "house title",
)
n = house.count("next leftover is Cap;")
print("house next Cap", n)
if n != 1:
    raise SystemExit("house next leftover Cap count")
house = house.replace("next leftover is Cap;", "next leftover is Lattice;", 1)
n = house.count('assert.equal(WP.playFor("fly_agaric"), "sill");')
print("house fly sill", n)
if n:
    house = house.replace('assert.equal(WP.playFor("fly_agaric"), "sill");', 'assert.equal(WP.playFor("morel"), "sill");')
ctx = '  assert.equal(WP.playFor("maidenhair"), "unfurl");\n  assert.equal(WP.playFor("morel"), "sill");\n'
if ctx not in house:
    idx = house.find('assert.equal(WP.playFor("maidenhair")')
    print(repr(house[idx:idx+400]) if idx>=0 else "no maidenhair")
    raise SystemExit("house frill tail ctx missing")
new_end = (
    '  assert.equal(WP.playFor("maidenhair"), "unfurl");\n\n'
    '  assert.equal(WP.playFor("fly_agaric"), "warts");\n'
    '  assert.equal(WP.WARTS, "warts");\n'
    '  assert.notEqual(WP.playFor("fly_agaric"), "cap");\n'
    '  assert.notEqual(WP.playFor("fly_agaric"), "shelf");\n'
    '  assert.notEqual(WP.playFor("fly_agaric"), "spot");\n'
    '  assert.notEqual(WP.playFor("fly_agaric"), "sill");\n'
    '  assert.equal(WP.playFor("oyster"), "shelf");\n'
    '  assert.equal(WP.SHELF, "shelf");\n'
    '  assert.equal(WP.playFor("ladybird"), "spot");\n'
    '  assert.equal(WP.playFor("cuttlefish"), "flush");\n'
    '  assert.equal(WP.playFor("robber_fly"), "seize");\n'
    '  assert.equal(WP.playFor("lamprey"), "ring");\n'
    '  assert.equal(WP.playFor("morel"), "sill");\n'
)
house = mr(house, ctx, new_end, "house cap asserts")
save("desktop/renderer/leftover-house.test.cjs", house, hnl)
print("ok house")
