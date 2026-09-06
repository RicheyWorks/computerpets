# -*- coding: utf-8 -*-
from pathlib import Path

HERE = Path(r"C:\Users\730ri\projects\ComputerPets")

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit("%s: expected 1, got %d\nOLD START: %r" % (label, n, old[:280]))
    return text.replace(old, new, 1)

TEST_BLOCK = r'''
test("Brine leftover frosts a window stool as a salt dish: walk onto the stool, sit the frost, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("halovore"), "frost");
  assert.equal(P.FROST, "frost");
  assert.notEqual(P.playFor("halovore"), "dry");
  assert.notEqual(P.playFor("halovore"), "brine");
  assert.notEqual(P.playFor("halovore"), "halovore");
  assert.notEqual(P.playFor("halovore"), "lick");
  assert.notEqual(P.playFor("halovore"), "many");
  assert.notEqual(P.playFor("halovore"), "sand");
  assert.notEqual(P.playFor("halovore"), "dig");
  assert.notEqual(P.playFor("halovore"), "bury");
  assert.notEqual(P.playFor("halovore"), "sill");
  assert.equal(P.playFor("nexus"), "many");
  assert.equal(P.MANY, "many");
  assert.equal(P.playFor("tardigrade"), "dry");
  assert.equal(P.DRY, "dry");
  assert.equal(P.playFor("sweat_bee"), "lick");
  assert.equal(P.LICK, "lick");
  assert.equal(P.playFor("terminator"), "rim");
  assert.equal(P.RIM, "rim");
  assert.equal(P.playFor("venus_flytrap"), "count");
  assert.equal(P.COUNT, "count");
  assert.equal(P.playFor("squirrel"), "bury");
  assert.equal(P.BURY, "bury");
  assert.equal(P.playFor("magneton"), "sill");
  const target = P.pickTarget([WIN], 80, "halovore", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "frost");
  assert.equal(target.side, "saltdish");
  assert.equal(target.leave, "frosted");
  assert.notEqual(target.kind, "dry");
  assert.notEqual(target.kind, "lick");
  assert.notEqual(target.kind, "many");
  assert.notEqual(target.kind, "sand");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift >= 0, "it frosts a window stool as a salt dish");
  assert.ok(P.DUR.frostHold > P.DUR.frost * 1.2, "the hold is the sit; frost is the tell");
  assert.ok(P.DUR.frostOn > 1.0, "a walk onto the stool, not a cling");
  assert.ok(P.DUR.frostOn !== P.DUR.manyOn);
  assert.ok(P.DUR.frostOn !== P.DUR.dryOn);
  assert.ok(P.DUR.frostOn !== P.DUR.lickOn);
  assert.ok(P.DUR.frostOn !== P.DUR.sandOn);
  assert.ok(P.DUR.frostOn !== P.DUR.buryOn);
  assert.ok(P.DUR.frostOn !== P.DUR.sillHop);
  assert.ok(P.DUR.frost !== P.DUR.many);
  assert.ok(P.DUR.frost !== P.DUR.dry);
  assert.ok(P.DUR.frost !== P.DUR.lick);
  assert.ok(P.DUR.frostHold !== P.DUR.manyHold);
  assert.ok(P.DUR.frostOff !== P.DUR.manyOff);
  const frost = P.frostPoint(WIN, P.SPRITE, WORK);
  const many = P.manyPoint(WIN, P.SPRITE, WORK);
  const dry = P.dryPoint(WIN, P.SPRITE, WORK);
  const lick = P.lickPoint(WIN, P.SPRITE, WORK);
  const sand = P.sandPoint(WIN, P.SPRITE, WORK);
  const dig = P.digPoint(WIN, P.SPRITE, WORK);
  const bury = P.buryPoint(WIN, P.SPRITE, WORK);
  assert.ok(frost.lift >= 0, "the window stool as a salt dish, not the sky");
  assert.ok(Math.abs(frost.x - many.x) > 8 || Math.abs(frost.lift - many.lift) > 1, "not Knot paperweight many");
  assert.ok(Math.abs(frost.x - dry.x) > 8 || Math.abs(frost.lift - dry.lift) > 1, "not Tun dry moss-film");
  assert.ok(Math.abs(frost.x - lick.x) > 8 || Math.abs(frost.lift - lick.lift) > 1, "not Sheen salt-glass lick");
  assert.ok(Math.abs(frost.x - sand.x) > 8 || Math.abs(frost.lift - sand.lift) > 1, "not Pale dry-sand stool");
  assert.ok(Math.abs(frost.x - dig.x) > 8 || Math.abs(frost.lift - dig.lift) > 1, "not Bank sand-bank dig");
  assert.ok(Math.abs(frost.x - bury.x) > 8 || Math.abs(frost.lift - bury.lift) > 1, "not Cache oak-dish bury");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "halovore", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real window stool, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 194, height: 162 }], 80, "halovore", WORK, P.SPRITE);
  assert.equal(short, null, "a real window stool, not a thinner frame");
  const okFrost = P.pickTarget([{ id: "frost", x: 200, y: 80, width: 196, height: 164 }], 80, "halovore", WORK, P.SPRITE);
  assert.ok(okFrost, "a real window stool as a salt dish");
  const manyOk = P.pickTarget([{ id: "many", x: 200, y: 80, width: 194, height: 162 }], 80, "nexus", WORK, P.SPRITE);
  assert.ok(manyOk, "Knot still takes a paperweight stool");
  const dryOk = P.pickTarget([{ id: "dry", x: 200, y: 80, width: 196, height: 188 }], 80, "tardigrade", WORK, P.SPRITE);
  assert.ok(dryOk, "Tun still takes a moss-film pane");
  const lickOk = P.pickTarget([{ id: "lick", x: 200, y: 80, width: 192, height: 188 }], 80, "sweat_bee", WORK, P.SPRITE);
  assert.ok(lickOk, "Sheen still takes a salt-glass pane");
  const walkOn = P.frostOnPath(0.25, { x: 40, lift: 0 }, { x: frost.x, lift: frost.lift });
  const manyOn = P.manyOnPath(0.25, { x: 40, lift: 0 }, { x: frost.x, lift: frost.lift });
  assert.ok(walkOn.lift >= 0, "it walks onto the window stool as a salt dish");
  assert.ok(walkOn.rot !== manyOn.rot, "a walk onto the salt dish, not Knot many");
  const frostPose = P.frostPath(0.3);
  const manyPose = P.manyPath(0.3);
  const dryPose = P.dryPath(0.3);
  const lickPose = P.lickPath(0.3);
  const sandPose = P.sandPath(0.3);
  assert.ok(Math.abs(frostPose.lift) > 0.2 || Math.abs(frostPose.rot) > 0.8, "it frosts once; frost is the tell");
  assert.ok(frostPose.rot !== manyPose.rot, "frost, not many");
  assert.ok(frostPose.rot !== dryPose.rot, "frost, not dry");
  assert.ok(frostPose.rot !== lickPose.rot, "frost, not lick");
  assert.ok(frostPose.rot !== sandPose.rot, "frost, not sand");
  const hold = P.frostHoldPath(0.5);
  assert.ok(Math.abs(hold.rot - 2.25) < 0.2, "it holds the sit on the salt dish");
  assert.ok(Math.abs(hold.x - 1.07) < 0.05, "it stays on the salt dish");
  assert.ok(hold.lift > 0, "sit the frost of the stool, not a bury sink");
  const off0 = P.frostOffPath(0, { x: frost.x, lift: frost.lift + 0.77, rot: 2.25 }, { x: frost.x + 50, lift: 0 });
  const offMid = P.frostOffPath(0.5, { x: frost.x, lift: frost.lift + 0.77, rot: 2.25 }, { x: frost.x + 50, lift: 0 });
  const off1 = P.frostOffPath(1, { x: frost.x, lift: frost.lift + 0.77, rot: 2.25 }, { x: frost.x + 50, lift: 0 });
  assert.ok(Math.abs(off0.x - frost.x) < 2);
  assert.ok(Math.abs(offMid.x - frost.x) > 8, "a walk leave off the salt dish");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "many");
    assert.notEqual(play.phase, "dry");
    assert.notEqual(play.phase, "lick");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "frost") {
      assert.ok(play.lift !== undefined, "it frosts on the window stool");
    }
  }
  assert.ok(seen.has("frost-on"));
  assert.ok(seen.has("frost"));
  assert.ok(seen.has("frost-hold"));
  assert.ok(seen.has("frost-off"));
  assert.ok(seen.has("approach") || seen.has("walk") || seen.has("land"));
  assert.equal(windowIds.size, 1, "one window; bounds-only");
  assert.equal(play.phase, "done");
});

test("a moved window refits Brine's salt-dish frost; sleep, card, and hide abort; Brine never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "halovore", WORK, P.SPRITE);
  assert.ok(target);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "frost"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "frost");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "frost");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved salt dish");
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "frost-off");
  assert.equal(play.abort, true);
});
'''

def pin_generic(text, label):
    old = 'playFor("halovore"), "sill"'
    new = 'playFor("magneton"), "sill"'
    n = text.count(old)
    if n < 1:
        raise SystemExit("%s: no halovore sill pins" % label)
    text = text.replace(old, new)
    print(label, "sill pins", n)
    old_pick = 'pickTarget([WIN], 80, "halovore"'
    new_pick = 'pickTarget([WIN], 80, "magneton"'
    n2 = text.count(old_pick)
    if n2:
        text = text.replace(old_pick, new_pick)
        print(label, "other-guests picks", n2)
    return text

def append_tests(path):
    text = path.read_text(encoding="utf-8")
    text = pin_generic(text, path.name)
    if 'test("Brine leftover frosts a window stool as a salt dish' in text:
        print(path.name, "brine tests already")
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
    'test("Knot leftover manys a window stool as a paperweight; sixth leftover of the far den done;',
    'test("Brine leftover frosts a window stool as a salt dish; seventh leftover of the far den done; Knot leftover still manys a window stool as a paperweight; sixth leftover of the far den done;',
    "house title start",
)
n_next = ht.count("next leftover is Brine")
if n_next != 1:
    raise SystemExit("house next leftover is Brine: expected 1, got %d" % n_next)
ht = ht.replace("next leftover is Brine", "next leftover is Beacon")
ht = pin_generic(ht, "leftover-house")
brine_asserts = (
    '  assert.equal(WP.playFor("halovore"), "frost");\n'
    '  assert.equal(WP.FROST, "frost");\n'
    '  assert.notEqual(WP.playFor("halovore"), "dry");\n'
    '  assert.notEqual(WP.playFor("halovore"), "brine");\n'
    '  assert.notEqual(WP.playFor("halovore"), "halovore");\n'
    '  assert.notEqual(WP.playFor("halovore"), "lick");\n'
    '  assert.notEqual(WP.playFor("halovore"), "many");\n'
    '  assert.notEqual(WP.playFor("halovore"), "sill");\n'
    '  assert.equal(WP.playFor("nexus"), "many");\n'
    '  assert.equal(WP.playFor("tardigrade"), "dry");\n'
    '  assert.equal(WP.playFor("magneton"), "sill");\n'
)
nexus_block = '  assert.equal(WP.playFor("nexus"), "many");\n  assert.equal(WP.MANY, "many");'
ht = once(ht, nexus_block, brine_asserts + nexus_block, "house brine asserts")
house.write_text(ht, encoding="utf-8", newline="\n")
print("leftover-house updated")
