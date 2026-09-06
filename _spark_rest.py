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

house, nl = load("desktop/renderer/leftover-house.test.cjs")
house = must_replace(
    house,
    "Ghost leftover weeks a lamp-side glass as lamp dusk; third leftover of the remaining hive den done; shore ten is closed; next leftover is Spark;",
    "Spark leftover glows a lower sash light as ink dusk; fourth leftover of the remaining hive den done; Ghost leftover still weeks a lamp-side glass as lamp dusk; third leftover of the remaining hive den done; shore ten is closed; next leftover is Dart;",
    "house title",
)
house = must_replace(
    house,
    '  assert.equal(WP.playFor("firefly"), "sill");\n});',
    '''  assert.equal(WP.playFor("firefly"), "glow");
  assert.equal(WP.GLOW, "glow");
  assert.notEqual(WP.playFor("firefly"), "spark");
  assert.notEqual(WP.playFor("firefly"), "crackle");
  assert.notEqual(WP.playFor("firefly"), "flash");
  assert.notEqual(WP.playFor("firefly"), "kindle");
  assert.notEqual(WP.playFor("firefly"), "week");
  assert.notEqual(WP.playFor("firefly"), "dusk");
  assert.notEqual(WP.playFor("firefly"), "sill");
  assert.equal(WP.playFor("spark_dragon"), "crackle");
  assert.equal(WP.CRACKLE, "crackle");
  assert.equal(WP.playFor("luna"), "week");
  assert.equal(WP.playFor("anole"), "flash");
  assert.equal(WP.playFor("phoenix"), "kindle");
  assert.equal(WP.playFor("walleye"), "dusk");
  assert.equal(WP.playFor("honeybee"), "waggle");
  assert.equal(WP.playFor("monarch"), "weed");
  assert.equal(WP.playFor("mallard"), "tip");
  assert.equal(WP.playFor("solifuge"), "run");
  assert.equal(WP.playFor("darner"), "sill");
});''',
    "house firefly glow",
)
save("desktop/renderer/leftover-house.test.cjs", house, nl)
print("house ok")

mjs, nl = load("web/scripts/window-play.test.mjs")
mjs = replace_all(mjs, 'assert.equal(P.playFor("firefly"), "sill");', 'assert.equal(P.playFor("darner"), "sill");', "mjs firefly sill pins", 3)

MJS_TEST = r'''
test("the demo window plate walks Spark the firefly glow the same way", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /playFor/);
  assert.match(readFileSync(join(root, "src/lib/pets/insects.ts"), "utf8"), /key: "firefly"[\s\S]{0,80}slug: "spark"/);
  assert.equal(P.playFor("firefly"), "glow");
  const target = P.pickTarget([WIN], 80, "firefly", WORK, 176);
  assert.ok(target);
  assert.equal(target.kind, "glow");
  assert.equal(target.side, "inkdusk");
  assert.equal(target.leave, "glowed");
  assert.equal(Overlay.playFor("firefly"), "glow");
  assert.equal(P.GLOW, "glow");
  assert.equal(Overlay.GLOW, "glow");
  assert.notEqual(P.playFor("firefly"), "spark");
  assert.notEqual(P.playFor("firefly"), "crackle");
  assert.notEqual(P.playFor("firefly"), "flash");
  assert.notEqual(P.playFor("firefly"), "kindle");
  assert.notEqual(P.playFor("firefly"), "week");
  assert.notEqual(P.playFor("firefly"), "dusk");
  assert.equal(P.playFor("spark_dragon"), "crackle");
  assert.equal(Overlay.playFor("spark_dragon"), "crackle");
  assert.equal(P.playFor("luna"), "week");
  assert.equal(Overlay.playFor("luna"), "week");
  assert.equal(P.playFor("anole"), "flash");
  assert.equal(P.playFor("phoenix"), "kindle");
  assert.equal(P.playFor("walleye"), "dusk");
  assert.equal(P.playFor("mallard"), "tip");
  assert.equal(P.playFor("solifuge"), "run");
  assert.equal(P.playFor("darner"), "sill");
  assert.equal(P.DUR.glowOn, Overlay.DUR.glowOn);
  assert.equal(P.DUR.glow, Overlay.DUR.glow);
  assert.equal(P.DUR.glowHold, Overlay.DUR.glowHold);
  assert.equal(P.DUR.glowOff, Overlay.DUR.glowOff);
  assert.ok(P.DUR.glowOn !== Overlay.DUR.weekOn);
  assert.ok(P.DUR.glowOn !== Overlay.DUR.duskOn);
  assert.ok(P.DUR.glowOn !== Overlay.DUR.flashOn);
  assert.ok(P.DUR.glowOn !== Overlay.DUR.crackleOn);
  const light = P.glowPoint(WIN, 176, WORK);
  const deskLight = Overlay.glowPoint(WIN, Overlay.SPRITE, WORK);
  const dish = P.tipPoint(WIN, 176, WORK);
  const dry = P.runPoint(WIN, 176, WORK);
  const glass = P.weekPoint(WIN, 176, WORK);
  assert.ok(Math.abs(light.x - deskLight.x) < 1);
  assert.ok(Math.abs(light.lift - deskLight.lift) < 1);
  assert.ok(light.lift > 8, "ink dusk, the lower sash light");
  assert.ok(Math.abs(light.lift - dish.lift) < 8, "same sash-light family as Drake");
  assert.ok(Math.abs(light.x - dish.x) > 12, "not Drake tip");
  assert.ok(Math.abs(light.lift - dry.lift) > 8, "not Gale run");
  assert.ok(Math.abs(light.x - glass.x) > 20 || Math.abs(light.lift - glass.lift) > 8, "not Ghost week");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 160, height: 70 }], 80, "firefly", WORK, 176);
  assert.equal(tiny, null, "a real lower sash light");
  const okLight = P.pickTarget([{ id: "light", x: 200, y: 80, width: 189, height: 173 }], 80, "firefly", WORK, 176);
  assert.ok(okLight, "a real lower sash light as ink dusk");
  const walkOn = P.glowOnPath(0.25, { x: 40, lift: 0 }, { x: light.x, lift: light.lift });
  const deskWalk = Overlay.glowOnPath(0.25, { x: 40, lift: 0 }, { x: light.x, lift: light.lift });
  assert.equal(walkOn.x, deskWalk.x);
  assert.equal(walkOn.lift, deskWalk.lift);
  const pulse = P.glowPath(0.5);
  const deskPulse = Overlay.glowPath(0.5);
  assert.equal(pulse.x, deskPulse.x);
  assert.ok(pulse.lift > 1, "sit the glow, the play");
  assert.ok(pulse.rot !== P.tipPath(0.5).rot, "glow, not a tip");
  assert.ok(pulse.rot !== P.runPath(0.5).rot, "glow, not a run");
  assert.ok(pulse.rot !== P.weekPath(0.5).rot, "glow, not a week");
  assert.ok(pulse.rot !== P.duskPath(0.5).rot, "glow, not a dusk");
  assert.ok(pulse.rot !== P.flashPath(0.5).rot, "glow, not a flash");
  const hold = P.glowHoldPath(0.5);
  const deskHold = Overlay.glowHoldPath(0.5);
  assert.equal(hold.x, deskHold.x);
  assert.equal(hold.lift, deskHold.lift);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, 176, { cmd: "idle" });
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
  }
  assert.ok(seen.has("glow-on"));
  assert.ok(seen.has("glow"));
  assert.ok(seen.has("glow-hold"));
  assert.ok(seen.has("glow-off"));
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
});
'''

mjs = mjs.rstrip() + "\n" + MJS_TEST
save("web/scripts/window-play.test.mjs", mjs, nl)
print("mjs ok")
