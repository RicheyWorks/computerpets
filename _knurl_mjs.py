from pathlib import Path

ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

def sub_once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit("%s: expected 1 occurrence, found %d" % (label, n))
    return text.replace(old, new, 1)

MJS_TEST = r'''
test("the demo window plate walks Knurl knobs the same way", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /playFor/);
  assert.match(readFileSync(join(root, "src/lib/pets/shore.ts"), "utf8"), /key: "knobbed_whelk"[\s\S]{0,80}slug: "knurl"/);
  assert.equal(P.playFor("knobbed_whelk"), "knobs");
  const target = P.pickTarget([WIN], 80, "knobbed_whelk", WORK, 176);
  assert.ok(target);
  assert.equal(target.kind, "knobs");
  assert.equal(target.side, "wrackdish");
  assert.equal(target.leave, "knobbed");
  assert.equal(Overlay.playFor("knobbed_whelk"), "knobs");
  assert.equal(P.KNOBS, "knobs");
  assert.equal(Overlay.KNOBS, "knobs");
  assert.notEqual(P.playFor("knobbed_whelk"), "knurl");
  assert.notEqual(P.playFor("knobbed_whelk"), "knob");
  assert.notEqual(P.playFor("knobbed_whelk"), "hunt");
  assert.notEqual(P.playFor("knobbed_whelk"), "rasp");
  assert.notEqual(P.playFor("knobbed_whelk"), "rock");
  assert.equal(P.playFor("hermit_crab"), "knob");
  assert.equal(Overlay.playFor("hermit_crab"), "knob");
  assert.equal(P.playFor("house_centipede"), "hunt");
  assert.equal(Overlay.playFor("house_centipede"), "hunt");
  assert.equal(P.playFor("pond_snail"), "rasp");
  assert.equal(Overlay.playFor("pond_snail"), "rasp");
  assert.equal(P.playFor("periwinkle"), "rock");
  assert.equal(Overlay.playFor("periwinkle"), "rock");
  assert.equal(P.playFor("sea_urchin"), "spines");
  assert.equal(Overlay.playFor("sea_urchin"), "spines");
  assert.equal(P.playFor("sand_dollar"), "flat");
  assert.equal(Overlay.playFor("sand_dollar"), "flat");
  assert.equal(P.playFor("chiton"), "eight");
  assert.equal(Overlay.playFor("chiton"), "eight");
  assert.equal(P.playFor("barnacle"), "cirri");
  assert.equal(Overlay.playFor("barnacle"), "cirri");
  assert.equal(P.playFor("limpet"), "clamp");
  assert.equal(Overlay.playFor("limpet"), "clamp");
  assert.equal(P.playFor("ghost_crab"), "sand");
  assert.equal(Overlay.playFor("ghost_crab"), "sand");
  assert.equal(P.playFor("fiddler_crab"), "signal");
  assert.equal(Overlay.playFor("fiddler_crab"), "signal");
  assert.equal(P.playFor("lugworm"), "sill");
  assert.equal(P.DUR.knobsOn, Overlay.DUR.knobsOn);
  assert.equal(P.DUR.knobs, Overlay.DUR.knobs);
  assert.equal(P.DUR.knobsHold, Overlay.DUR.knobsHold);
  assert.equal(P.DUR.knobsOff, Overlay.DUR.knobsOff);
  assert.ok(P.DUR.knobsOn !== Overlay.DUR.spinesOn);
  assert.ok(P.DUR.knobsOn !== Overlay.DUR.sandOn);
  assert.ok(P.DUR.knobsOn !== Overlay.DUR.rollOn);
  assert.ok(P.DUR.knobsOn !== Overlay.DUR.rockOn);
  const dish = P.knobsPoint(WIN, 176, WORK);
  const deskDish = Overlay.knobsPoint(WIN, Overlay.SPRITE, WORK);
  const sand = P.sandPoint(WIN, 176, WORK);
  const roll = P.rollPoint(WIN, 176, WORK);
  const band = P.bandPoint(WIN, 176, WORK);
  const bury = P.buryPoint(WIN, 176, WORK);
  const pool = P.spinesPoint(WIN, 176, WORK);
  assert.ok(Math.abs(dish.x - deskDish.x) < 1);
  assert.ok(Math.abs(dish.lift - deskDish.lift) < 1);
  assert.ok(Math.abs(dish.lift - sand.lift) < 2, "same window stool as Pale, different pose");
  assert.ok(Math.abs(dish.x - sand.x) > 8, "not Pale sand");
  assert.ok(Math.abs(dish.x - roll.x) > 8 || Math.abs(dish.lift - roll.lift) > 8, "not Armor roll");
  assert.ok(Math.abs(dish.x - band.x) > 8 || Math.abs(dish.lift - band.lift) > 8, "not Cast band");
  assert.ok(Math.abs(dish.x - bury.x) > 8 || Math.abs(dish.lift - bury.lift) > 8, "not Cache bury");
  assert.ok(dish.lift > 16, "wrack dish, the stool");
  assert.ok(Math.abs(dish.x - pool.x) > 8 || Math.abs(dish.lift - pool.lift) > 8, "not Thorn spines");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "knobbed_whelk", WORK, 176);
  assert.equal(tiny, null, "a real window stool");
  const okStool = P.pickTarget([{ id: "stool", x: 200, y: 80, width: 193, height: 160 }], 80, "knobbed_whelk", WORK, 176);
  assert.ok(okStool, "a real window stool as a wrack dish");
  const walkOn = P.knobsOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  const deskWalk = Overlay.knobsOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  assert.equal(walkOn.x, deskWalk.x);
  assert.equal(walkOn.lift, deskWalk.lift);
  const pulse = P.knobsPath(0.5);
  const deskPulse = Overlay.knobsPath(0.5);
  assert.equal(pulse.x, deskPulse.x);
  assert.ok(pulse.lift < 0, "a knobs sit, the play");
  assert.ok(pulse.rot !== P.sandPath(0.5).rot, "knobs, not a sand");
  assert.ok(pulse.rot !== P.rollPath(0.5).rot, "knobs, not a roll");
  assert.ok(pulse.rot !== P.spinesPath(0.5).rot, "knobs, not spines");
  assert.ok(pulse.rot !== P.rockPath(0.5).rot, "knobs, not a rock");
  const hold = P.knobsHoldPath(0.5);
  const deskHold = Overlay.knobsHoldPath(0.5);
  assert.equal(hold.x, deskHold.x);
  assert.equal(hold.lift, deskHold.lift);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, 176, { cmd: "idle" });
    if (play.phase === "knobs") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "knobs-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "knobs-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift - 3.5)) < 3, "she holds the knobs after the sit on the stool");
    }
  }
  assert.ok(seen.has("knobs-on"));
  assert.ok(seen.has("knobs"));
  assert.ok(seen.has("knobs-hold"));
  assert.ok(seen.has("knobs-off"));
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
});
'''

p = ROOT / "web" / "scripts" / "window-play.test.mjs"
t = p.read_text(encoding="utf-8")
t = sub_once(
    t,
    '  assert.equal(P.playFor("knobbed_whelk"), "sill");',
    '  assert.equal(P.playFor("lugworm"), "sill");',
    "mjs thorn next-sill pin",
)
if not t.endswith("\n"):
    t += "\n"
t = t + MJS_TEST
p.write_text(t, encoding="utf-8", newline="\n")
print("mjs tests ok")
