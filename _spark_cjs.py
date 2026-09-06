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
    n = text.count(old)
    if n != 1:
        raise SystemExit("COUNT %s for %s" % (n, label))
    return text.replace(old, new, 1)

def replace_all(text, old, new, label, expect):
    n = text.count(old)
    if n != expect:
        raise SystemExit("COUNT %s want %s for %s" % (n, expect, label))
    return text.replace(old, new)

cjs, nl = load("desktop/renderer/window-play.test.cjs")
cjs = must_replace(
    cjs,
    'const target = P.pickTarget([WIN], 80, "firefly", WORK, P.SPRITE);',
    'const target = P.pickTarget([WIN], 80, "darner", WORK, P.SPRITE);',
    "cjs generic sill pin",
)
cjs = replace_all(cjs, 'assert.equal(P.playFor("firefly"), "sill");', 'assert.equal(P.playFor("darner"), "sill");', "cjs firefly sill pins", 3)

CJS_TESTS = r'''
test("Spark the firefly glows a lower sash light as ink dusk: walk onto the light, sit the glow, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("firefly"), "glow");
  assert.equal(P.GLOW, "glow");
  assert.notEqual(P.playFor("firefly"), "spark");
  assert.notEqual(P.playFor("firefly"), "crackle");
  assert.notEqual(P.playFor("firefly"), "flash");
  assert.notEqual(P.playFor("firefly"), "kindle");
  assert.notEqual(P.playFor("firefly"), "week");
  assert.notEqual(P.playFor("firefly"), "dusk");
  assert.notEqual(P.playFor("firefly"), "tip");
  assert.notEqual(P.playFor("firefly"), "run");
  assert.notEqual(P.playFor("firefly"), "sill");
  assert.equal(P.playFor("spark_dragon"), "crackle");
  assert.equal(P.CRACKLE, "crackle");
  assert.equal(P.playFor("luna"), "week");
  assert.equal(P.WEEK, "week");
  assert.equal(P.playFor("anole"), "flash");
  assert.equal(P.FLASH, "flash");
  assert.equal(P.playFor("phoenix"), "kindle");
  assert.equal(P.KINDLE, "kindle");
  assert.equal(P.playFor("walleye"), "dusk");
  assert.equal(P.DUSK, "dusk");
  assert.equal(P.playFor("mallard"), "tip");
  assert.equal(P.playFor("solifuge"), "run");
  assert.equal(P.playFor("honeybee"), "waggle");
  assert.equal(P.playFor("monarch"), "weed");
  assert.equal(P.playFor("darner"), "sill");
  assert.equal(P.DUR.weekOn, 3.41, "Ghost week durations stay");
  assert.equal(P.DUR.duskOn, 1.54, "Night dusk durations stay");
  assert.equal(P.DUR.weedOn, 3.22, "Milk weed durations stay");
  const target = P.pickTarget([WIN], 80, "firefly", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "glow");
  assert.equal(target.side, "inkdusk");
  assert.equal(target.leave, "glowed");
  assert.notEqual(target.kind, "spark");
  assert.notEqual(target.kind, "crackle");
  assert.notEqual(target.kind, "flash");
  assert.notEqual(target.kind, "kindle");
  assert.notEqual(target.kind, "week");
  assert.notEqual(target.kind, "dusk");
  assert.notEqual(target.kind, "tip");
  assert.notEqual(target.kind, "run");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift > 8, "she glows a lower sash light as ink dusk, not the floor");
  assert.ok(P.DUR.glowHold > P.DUR.glow, "the hold is the sit after; the glow is the tell");
  assert.ok(P.DUR.glowOn > 1.0, "a walk onto the light, not the glow");
  assert.ok(P.DUR.glowOn !== P.DUR.weekOn);
  assert.ok(P.DUR.glowOn !== P.DUR.duskOn);
  assert.ok(P.DUR.glowOn !== P.DUR.flashOn);
  assert.ok(P.DUR.glowOn !== P.DUR.kindleOn);
  assert.ok(P.DUR.glowOn !== P.DUR.crackleOn);
  assert.ok(P.DUR.glowOn !== P.DUR.tipOn);
  assert.ok(P.DUR.glowOn !== P.DUR.runOn);
  assert.ok(P.DUR.glowOn !== P.DUR.sillHop);
  assert.ok(P.DUR.glow !== P.DUR.week);
  assert.ok(P.DUR.glow !== P.DUR.dusk);
  assert.ok(P.DUR.glow !== P.DUR.flash);
  assert.ok(P.DUR.glowHold !== P.DUR.weekHold);
  assert.ok(P.DUR.glowHold !== P.DUR.duskHold);
  assert.ok(P.DUR.glowOff !== P.DUR.weekOff);
  assert.ok(P.DUR.glowOff !== P.DUR.duskOff);
  assert.ok(P.DUR.glowOff !== P.DUR.sillDown);
  const light = P.glowPoint(WIN, P.SPRITE, WORK);
  const dish = P.tipPoint(WIN, P.SPRITE, WORK);
  const dry = P.runPoint(WIN, P.SPRITE, WORK);
  const glass = P.weekPoint(WIN, P.SPRITE, WORK);
  const stile = P.duskPoint(WIN, P.SPRITE, WORK);
  const vine = P.flashPoint(WIN, P.SPRITE, WORK);
  const ash = P.kindlePoint(WIN, P.SPRITE, WORK);
  const pane = P.slidePoint(WIN, P.SPRITE, WORK);
  assert.ok(light.lift > 8, "the lower sash light as ink dusk, not the floor");
  assert.ok(Math.abs(light.lift - dish.lift) < 8, "same sash-light family as Drake; she glows, she does not tip");
  assert.ok(Math.abs(light.x - dish.x) > 12, "same lower sash light as Drake, not Drake's ink-dish tip spot");
  assert.ok(Math.abs(light.lift - dry.lift) > 8, "lower sash light, not Gale's higher sash-light run");
  assert.ok(Math.abs(light.x - glass.x) > 20 || Math.abs(light.lift - glass.lift) > 8, "not Ghost's lamp-side glass week");
  assert.ok(Math.abs(light.x - stile.x) > 20 || Math.abs(light.lift - stile.lift) > 8, "not Night's lamp-side stile dusk");
  assert.ok(Math.abs(light.x - vine.x) > 20 || Math.abs(light.lift - vine.lift) > 8, "not Wink's sash-stile flash");
  assert.ok(Math.abs(light.x - ash.x) > 8 || Math.abs(light.lift - ash.lift) > 8, "not Ember's kindle");
  assert.ok(Math.abs(light.x - pane.x) > 8 || Math.abs(light.lift - pane.lift) > 8, "not Slick's pane slide");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "firefly", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real lower sash light, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 180, height: 80 }], 80, "firefly", WORK, P.SPRITE);
  assert.equal(short, null, "a real lower sash light, not a short sash");
  const thin = P.pickTarget([{ id: "thin", x: 200, y: 80, width: 189, height: 170 }], 80, "firefly", WORK, P.SPRITE);
  assert.equal(thin, null, "a real lower sash light, not a thinner pane");
  const okLight = P.pickTarget([{ id: "light", x: 200, y: 80, width: 189, height: 173 }], 80, "firefly", WORK, P.SPRITE);
  assert.ok(okLight, "a real lower sash light as ink dusk");
  const drakeOk = P.pickTarget([{ id: "dish", x: 200, y: 80, width: 188, height: 172 }], 80, "mallard", WORK, P.SPRITE);
  assert.ok(drakeOk, "Drake still takes the lower sash light");
  const ghostNo = P.pickTarget([{ id: "light", x: 200, y: 80, width: 189, height: 173 }], 80, "luna", WORK, P.SPRITE);
  assert.equal(ghostNo, null, "Ghost still needs a lamp-side glass, not this sash-light gate");
  const walkOn = P.glowOnPath(0.25, { x: 40, lift: 0 }, { x: light.x, lift: light.lift });
  const tipOn = P.tipOnPath(0.25, { x: 40, lift: 0 }, { x: light.x, lift: light.lift });
  const runOn = P.runOnPath(0.25, { x: 40, lift: 0 }, { x: light.x, lift: light.lift });
  const weekOn = P.weekOnPath(0.25, { x: 40, lift: 0 }, { x: light.x, lift: light.lift });
  const duskOn = P.duskOnPath(0.25, { x: 40, lift: 0 }, { x: light.x, lift: light.lift });
  const flashOn = P.flashOnPath(0.25, { x: 40, lift: 0 }, { x: light.x, lift: light.lift });
  assert.ok(walkOn.lift > 0, "she walks onto the light as ink dusk");
  assert.ok(walkOn.rot !== tipOn.rot, "a walk onto the light, not Drake tip");
  assert.ok(walkOn.rot !== runOn.rot, "a walk onto the light, not Gale run");
  assert.ok(walkOn.rot !== weekOn.rot, "a walk onto the light, not Ghost week");
  assert.ok(walkOn.rot !== duskOn.rot, "a walk onto the light, not Night dusk");
  assert.ok(walkOn.rot !== flashOn.rot, "a walk onto the light, not Wink flash");
  const sparkPose = P.glowPath(0.5);
  const tipPose = P.tipPath(0.5);
  const runPose = P.runPath(0.5);
  const weekPose = P.weekPath(0.5);
  const duskPose = P.duskPath(0.5);
  const flashPose = P.flashPath(0.5);
  const kindlePose = P.kindlePath(0.5);
  assert.ok(sparkPose.lift > 1, "she sits the glow; a flash, then another");
  assert.ok(sparkPose.rot !== tipPose.rot, "glow, not a tip");
  assert.ok(sparkPose.rot !== runPose.rot, "glow, not a run");
  assert.ok(sparkPose.rot !== weekPose.rot, "glow, not a week");
  assert.ok(sparkPose.rot !== duskPose.rot, "glow, not a dusk");
  assert.ok(sparkPose.rot !== flashPose.rot, "glow, not a flash");
  assert.ok(sparkPose.rot !== kindlePose.rot, "glow, not a kindle");
  const hold = P.glowHoldPath(0.5);
  assert.ok(Math.abs(hold.rot - 3.2) < 0.2, "she holds after the glow, glow still the tell");
  assert.ok(Math.abs(hold.x - 0.9) < 0.2, "she stays on the lower sash light");
  assert.ok(hold.lift > 1, "a sit-hold on the light after the glow");
  const off0 = P.glowOffPath(0, { x: light.x, lift: light.lift, rot: 3.2 }, { x: light.x + 50, lift: 0 });
  const offMid = P.glowOffPath(0.5, { x: light.x, lift: light.lift, rot: 3.2 }, { x: light.x + 50, lift: 0 });
  const off1 = P.glowOffPath(1, { x: light.x, lift: light.lift, rot: 3.2 }, { x: light.x + 50, lift: 0 });
  assert.ok(Math.abs(off0.x - light.x) < 2);
  assert.ok(Math.abs(offMid.x - light.x) > 8, "a walk leave off the lower sash light");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "week");
    assert.notEqual(play.phase, "dusk");
    assert.notEqual(play.phase, "flash");
    assert.notEqual(play.phase, "kindle");
    assert.notEqual(play.phase, "crackle");
    assert.notEqual(play.phase, "tip");
    assert.notEqual(play.phase, "run");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "glow") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "glow-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "glow-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift + 4.4)) < 3, "she holds the glow after the sit on the light");
    }
    if (play.phase === "glow-off") {
      assert.equal(play.anim, "walk");
    }
  }
  assert.ok(seen.has("glow-on"));
  assert.ok(seen.has("glow"));
  assert.ok(seen.has("glow-hold"));
  assert.ok(seen.has("glow-off"));
  assert.ok(!seen.has("week"), "Spark the firefly never uses Ghost week");
  assert.ok(!seen.has("dusk"), "Spark the firefly never uses Night dusk");
  assert.ok(!seen.has("flash"), "Spark the firefly never uses Wink flash");
  assert.ok(!seen.has("kindle"), "Spark the firefly never uses Ember kindle");
  assert.ok(!seen.has("crackle"), "Spark the firefly never uses the dragon crackle");
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});
test("a moved window refits Spark the firefly's ink-dusk glow; sleep, card, and hide abort; Spark never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "firefly", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "glow"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "glow");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "glow");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "glow-off");
  assert.equal(play.abort, true);
});
'''

if not cjs.rstrip().endswith("});"):
    raise SystemExit("cjs tail unexpected")
cjs = cjs.rstrip() + "\n" + CJS_TESTS
save("desktop/renderer/window-play.test.cjs", cjs, nl)
print("cjs ok")
