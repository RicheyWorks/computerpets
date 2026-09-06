from pathlib import Path

ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

def sub_once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1 occurrence, found {n}")
    return text.replace(old, new, 1)

MJS_TEST = r'''
test("the demo window plate walks Thorn spines the same way", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /playFor/);
  assert.match(readFileSync(join(root, "src/lib/pets/shore.ts"), "utf8"), /key: "sea_urchin"[\s\S]{0,80}slug: "thorn"/);
  assert.equal(P.playFor("sea_urchin"), "spines");
  const target = P.pickTarget([WIN], 80, "sea_urchin", WORK, 176);
  assert.ok(target);
  assert.equal(target.kind, "spines");
  assert.equal(target.side, "tidepool");
  assert.equal(target.leave, "spined");
  assert.equal(Overlay.playFor("sea_urchin"), "spines");
  assert.equal(P.SPINES, "spines");
  assert.equal(Overlay.SPINES, "spines");
  assert.notEqual(P.playFor("sea_urchin"), "thorn");
  assert.notEqual(P.playFor("sea_urchin"), "spine");
  assert.notEqual(P.playFor("sea_urchin"), "bristle");
  assert.notEqual(P.playFor("sea_urchin"), "ball");
  assert.notEqual(P.playFor("sea_urchin"), "crown");
  assert.notEqual(P.playFor("sea_urchin"), "flat");
  assert.equal(P.playFor("porcupine"), "bristle");
  assert.equal(Overlay.playFor("porcupine"), "bristle");
  assert.equal(P.playFor("hedgehog"), "ball");
  assert.equal(Overlay.playFor("hedgehog"), "ball");
  assert.equal(P.playFor("horned_lizard"), "crown");
  assert.equal(Overlay.playFor("horned_lizard"), "crown");
  assert.equal(P.playFor("sand_dollar"), "flat");
  assert.equal(Overlay.playFor("sand_dollar"), "flat");
  assert.equal(P.playFor("periwinkle"), "rock");
  assert.equal(Overlay.playFor("periwinkle"), "rock");
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
  assert.equal(P.playFor("amphipod"), "side");
  assert.equal(Overlay.playFor("amphipod"), "side");
  assert.equal(P.playFor("knobbed_whelk"), "sill");
  assert.equal(P.DUR.spinesOn, Overlay.DUR.spinesOn);
  assert.equal(P.DUR.spines, Overlay.DUR.spines);
  assert.equal(P.DUR.spinesHold, Overlay.DUR.spinesHold);
  assert.equal(P.DUR.spinesOff, Overlay.DUR.spinesOff);
  assert.ok(P.DUR.spinesOn !== Overlay.DUR.flatOn);
  assert.ok(P.DUR.spinesOn !== Overlay.DUR.sideOn);
  assert.ok(P.DUR.spinesOn !== Overlay.DUR.crownOn);
  assert.ok(P.DUR.spinesOn !== Overlay.DUR.snapOn);
  const pool = P.spinesPoint(WIN, 176, WORK);
  const deskPool = Overlay.spinesPoint(WIN, Overlay.SPRITE, WORK);
  const side = P.sidePoint(WIN, 176, WORK);
  const tray = P.crownPoint(WIN, 176, WORK);
  const bowl = P.snapPoint(WIN, 176, WORK);
  const plate = P.flatPoint(WIN, 176, WORK);
  const ball = P.ballPoint(WIN, 176, WORK);
  const pine = P.bristlePoint(WIN, 176, WORK);
  assert.ok(Math.abs(pool.x - deskPool.x) < 1);
  assert.ok(Math.abs(pool.lift - deskPool.lift) < 1);
  assert.ok(Math.abs(pool.lift - side.lift) < 2, "same window well as Scud, different pose");
  assert.ok(Math.abs(pool.x - side.x) > 8, "not Scud side");
  assert.ok(Math.abs(pool.lift - tray.lift) < 2, "same window well as Spike, different pose");
  assert.ok(Math.abs(pool.x - tray.x) > 8, "not Spike crown");
  assert.ok(Math.abs(pool.lift - bowl.lift) < 2, "same window well as Beak, different pose");
  assert.ok(Math.abs(pool.x - bowl.x) > 8, "not Beak snap");
  assert.ok(pool.lift > 16, "tide pool, the well");
  assert.ok(Math.abs(pool.x - plate.x) > 8 || Math.abs(pool.lift - plate.lift) > 8, "not Token flat");
  assert.ok(Math.abs(pool.x - ball.x) > 8 || Math.abs(pool.lift - ball.lift) > 8, "not Burr ball");
  assert.ok(Math.abs(pool.x - pine.x) > 8 || Math.abs(pool.lift - pine.lift) > 8, "not Spine bristle");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "sea_urchin", WORK, 176);
  assert.equal(tiny, null, "a real window well");
  const okWell = P.pickTarget([{ id: "well", x: 200, y: 80, width: 178, height: 162 }], 80, "sea_urchin", WORK, 176);
  assert.ok(okWell, "a real window well as a tide pool");
  const walkOn = P.spinesOnPath(0.25, { x: 40, lift: 0 }, { x: pool.x, lift: pool.lift });
  const deskWalk = Overlay.spinesOnPath(0.25, { x: 40, lift: 0 }, { x: pool.x, lift: pool.lift });
  assert.equal(walkOn.x, deskWalk.x);
  assert.equal(walkOn.lift, deskWalk.lift);
  const pulse = P.spinesPath(0.5);
  const deskPulse = Overlay.spinesPath(0.5);
  assert.equal(pulse.x, deskPulse.x);
  assert.ok(pulse.lift < 0, "a spines sit, the play");
  assert.ok(pulse.rot !== P.sidePath(0.5).rot, "spines, not a side");
  assert.ok(pulse.rot !== P.crownPath(0.5).rot, "spines, not a crown");
  assert.ok(pulse.rot !== P.snapPath(0.5).rot, "spines, not a snap");
  assert.ok(pulse.rot !== P.flatPath(0.5).rot, "spines, not a flat");
  const hold = P.spinesHoldPath(0.5);
  const deskHold = Overlay.spinesHoldPath(0.5);
  assert.equal(hold.x, deskHold.x);
  assert.equal(hold.lift, deskHold.lift);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, 176, { cmd: "idle" });
    if (play.phase === "spines") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "spines-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "spines-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift - 4.4)) < 3, "she holds the spines after the sit in the well");
    }
  }
  assert.ok(seen.has("spines-on"));
  assert.ok(seen.has("spines"));
  assert.ok(seen.has("spines-hold"));
  assert.ok(seen.has("spines-off"));
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
});
'''

def patch_mjs():
    p = ROOT / "web" / "scripts" / "window-play.test.mjs"
    t = p.read_text(encoding="utf-8")
    n = t.count('assert.equal(P.playFor("sea_urchin"), "sill");')
    if n < 1:
        raise SystemExit(f"mjs sea_urchin sill pins: expected at least 1, found {n}")
    t = t.replace('assert.equal(P.playFor("sea_urchin"), "sill");', 'assert.equal(P.playFor("sea_urchin"), "spines");')
    if not t.endswith("\n"):
        t += "\n"
    t = t + MJS_TEST
    p.write_text(t, encoding="utf-8", newline="\n")
    print("mjs tests ok")

def patch_house():
    p = ROOT / "desktop" / "renderer" / "leftover-house.test.cjs"
    t = p.read_text(encoding="utf-8")
    t = sub_once(
        t,
        "Token leftover flats a sill pan as a sand plate; seventh shore leftover done; next leftover is Thorn; ",
        "Thorn leftover spines a window well as a tide pool; eighth shore leftover done; next leftover is Knurl; Token leftover still flats a sill pan as a sand plate; seventh shore leftover done; ",
        "house test name",
    )
    t = sub_once(
        t,
        '''  assert.equal(WP.playFor("sand_dollar"), "flat");
  assert.equal(WP.FLAT, "flat");
  assert.notEqual(WP.playFor("sand_dollar"), "token");
  assert.notEqual(WP.playFor("sand_dollar"), "bury");
  assert.notEqual(WP.playFor("sand_dollar"), "sand");
  assert.notEqual(WP.playFor("sand_dollar"), "circle");
  assert.notEqual(WP.playFor("sand_dollar"), "open");
  assert.notEqual(WP.playFor("sand_dollar"), "reef");
  assert.notEqual(WP.playFor("sand_dollar"), "sill");
  assert.equal(WP.playFor("periwinkle"), "rock");
  assert.equal(WP.playFor("chiton"), "eight");
  assert.equal(WP.playFor("ghost_crab"), "sand");
  assert.equal(WP.playFor("squirrel"), "bury");
  assert.equal(WP.playFor("barnacle"), "cirri");
  assert.equal(WP.playFor("limpet"), "clamp");
  assert.equal(WP.playFor("fiddler_crab"), "signal");
  assert.equal(WP.playFor("goldfish"), "circle");
  assert.equal(WP.playFor("water_lily"), "open");
  assert.equal(WP.playFor("sea_star"), "reef");
  assert.equal(WP.playFor("sea_urchin"), "sill");
  assert.equal(WP.playFor("honeybee"), "sill");
''',
        '''  assert.equal(WP.playFor("sand_dollar"), "flat");
  assert.equal(WP.FLAT, "flat");
  assert.notEqual(WP.playFor("sand_dollar"), "token");
  assert.notEqual(WP.playFor("sand_dollar"), "bury");
  assert.notEqual(WP.playFor("sand_dollar"), "sand");
  assert.notEqual(WP.playFor("sand_dollar"), "circle");
  assert.notEqual(WP.playFor("sand_dollar"), "open");
  assert.notEqual(WP.playFor("sand_dollar"), "reef");
  assert.notEqual(WP.playFor("sand_dollar"), "sill");
  assert.equal(WP.playFor("periwinkle"), "rock");
  assert.equal(WP.playFor("chiton"), "eight");
  assert.equal(WP.playFor("ghost_crab"), "sand");
  assert.equal(WP.playFor("squirrel"), "bury");
  assert.equal(WP.playFor("barnacle"), "cirri");
  assert.equal(WP.playFor("limpet"), "clamp");
  assert.equal(WP.playFor("fiddler_crab"), "signal");
  assert.equal(WP.playFor("goldfish"), "circle");
  assert.equal(WP.playFor("water_lily"), "open");
  assert.equal(WP.playFor("sea_star"), "reef");
  assert.equal(WP.playFor("sea_urchin"), "spines");
  assert.equal(WP.SPINES, "spines");
  assert.notEqual(WP.playFor("sea_urchin"), "thorn");
  assert.notEqual(WP.playFor("sea_urchin"), "spine");
  assert.notEqual(WP.playFor("sea_urchin"), "bristle");
  assert.notEqual(WP.playFor("sea_urchin"), "ball");
  assert.notEqual(WP.playFor("sea_urchin"), "crown");
  assert.notEqual(WP.playFor("sea_urchin"), "flat");
  assert.notEqual(WP.playFor("sea_urchin"), "sill");
  assert.equal(WP.playFor("sand_dollar"), "flat");
  assert.equal(WP.playFor("periwinkle"), "rock");
  assert.equal(WP.playFor("porcupine"), "bristle");
  assert.equal(WP.playFor("hedgehog"), "ball");
  assert.equal(WP.playFor("horned_lizard"), "crown");
  assert.equal(WP.playFor("knobbed_whelk"), "sill");
  assert.equal(WP.playFor("honeybee"), "sill");
''',
        "house pins",
    )
    p.write_text(t, encoding="utf-8", newline="\n")
    print("house ok")

if __name__ == "__main__":
    patch_mjs()
    patch_house()
    print("mjs+house ok")
