from pathlib import Path

ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, found {n}\nMARKER={old[:240]!r}")
    return text.replace(old, new, 1)

MJS_HEAP = r'''
test("the demo window plate walks Heap castings the same way", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /playFor/);
  assert.match(readFileSync(join(root, "src/lib/pets/shore.ts"), "utf8"), /key: "lugworm"[\s\S]{0,80}slug: "heap"/);
  assert.equal(P.playFor("lugworm"), "castings");
  const target = P.pickTarget([WIN], 80, "lugworm", WORK, 176);
  assert.ok(target);
  assert.equal(target.kind, "castings");
  assert.equal(target.side, "wetsand");
  assert.equal(target.leave, "heaped");
  assert.equal(Overlay.playFor("lugworm"), "castings");
  assert.equal(P.CASTINGS, "castings");
  assert.equal(Overlay.CASTINGS, "castings");
  assert.notEqual(P.playFor("lugworm"), "heap");
  assert.notEqual(P.playFor("lugworm"), "band");
  assert.notEqual(P.playFor("lugworm"), "drink");
  assert.notEqual(P.playFor("lugworm"), "knobs");
  assert.equal(P.playFor("earthworm"), "band");
  assert.equal(Overlay.playFor("earthworm"), "band");
  assert.equal(P.playFor("leech"), "drink");
  assert.equal(Overlay.playFor("leech"), "drink");
  assert.equal(P.playFor("knobbed_whelk"), "knobs");
  assert.equal(Overlay.playFor("knobbed_whelk"), "knobs");
  assert.equal(P.playFor("sea_urchin"), "spines");
  assert.equal(Overlay.playFor("sea_urchin"), "spines");
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
  assert.equal(P.playFor("honeybee"), "sill");
  assert.equal(P.DUR.castingsOn, Overlay.DUR.castingsOn);
  assert.equal(P.DUR.castings, Overlay.DUR.castings);
  assert.equal(P.DUR.castingsHold, Overlay.DUR.castingsHold);
  assert.equal(P.DUR.castingsOff, Overlay.DUR.castingsOff);
  assert.ok(P.DUR.castingsOn !== Overlay.DUR.knobsOn);
  assert.ok(P.DUR.castingsOn !== Overlay.DUR.bandOn);
  assert.ok(P.DUR.castingsOn !== Overlay.DUR.sandOn);
  assert.ok(P.DUR.castingsOn !== Overlay.DUR.shutOn);
  const sandFoot = P.castingsPoint(WIN, 176, WORK);
  const deskFoot = Overlay.castingsPoint(WIN, Overlay.SPRITE, WORK);
  const leaf = P.shutPoint(WIN, 176, WORK);
  const duff = P.stampPoint(WIN, 176, WORK);
  const tray = P.bandPoint(WIN, 176, WORK);
  const dish = P.knobsPoint(WIN, 176, WORK);
  const dry = P.sandPoint(WIN, 176, WORK);
  assert.ok(Math.abs(sandFoot.x - deskFoot.x) < 1);
  assert.ok(Math.abs(sandFoot.lift - deskFoot.lift) < 1);
  assert.ok(Math.abs(sandFoot.lift) < 1, "wet sand, the foot");
  assert.ok(Math.abs(sandFoot.x - leaf.x) > 8, "not Lid shut");
  assert.ok(Math.abs(sandFoot.x - duff.x) > 8, "not Stripe stamp");
  assert.ok(Math.abs(sandFoot.x - tray.x) > 8 || Math.abs(sandFoot.lift - tray.lift) > 8, "not Cast band");
  assert.ok(Math.abs(sandFoot.x - dish.x) > 8 || Math.abs(sandFoot.lift - dish.lift) > 8, "not Knurl knobs");
  assert.ok(Math.abs(sandFoot.x - dry.x) > 8 || Math.abs(sandFoot.lift - dry.lift) > 8, "not Pale sand");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "lugworm", WORK, 176);
  assert.equal(tiny, null, "a real window foot");
  const okFoot = P.pickTarget([{ id: "foot", x: 200, y: 80, width: 160, height: 70 }], 80, "lugworm", WORK, 176);
  assert.ok(okFoot, "a real window foot as wet sand");
  const walkOn = P.castingsOnPath(0.25, { x: 40, lift: 0 }, { x: sandFoot.x, lift: sandFoot.lift });
  const deskWalk = Overlay.castingsOnPath(0.25, { x: 40, lift: 0 }, { x: sandFoot.x, lift: sandFoot.lift });
  assert.equal(walkOn.x, deskWalk.x);
  assert.equal(walkOn.lift, deskWalk.lift);
  const pulse = P.castingsPath(0.5);
  const deskPulse = Overlay.castingsPath(0.5);
  assert.equal(pulse.x, deskPulse.x);
  assert.ok(pulse.lift < 0, "a castings sit, the play");
  assert.ok(pulse.rot !== P.shutPath(0.5).rot, "castings, not a shut");
  assert.ok(pulse.rot !== P.stampPath(0.5).rot, "castings, not a stamp");
  assert.ok(pulse.rot !== P.knobsPath(0.5).rot, "castings, not knobs");
  assert.ok(pulse.rot !== P.bandPath(0.5).rot, "castings, not a band");
  const hold = P.castingsHoldPath(0.5);
  const deskHold = Overlay.castingsHoldPath(0.5);
  assert.equal(hold.x, deskHold.x);
  assert.equal(hold.lift, deskHold.lift);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, 176, { cmd: "idle" });
    if (play.phase === "castings") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "castings-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "castings-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift - 2.8)) < 3, "she holds the castings after the sit on the foot");
    }
  }
  assert.ok(seen.has("castings-on"));
  assert.ok(seen.has("castings"));
  assert.ok(seen.has("castings-hold"));
  assert.ok(seen.has("castings-off"));
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
});
'''

p = ROOT / "web" / "scripts" / "window-play.test.mjs"
t = p.read_text(encoding="utf-8")
t = once(t,
    '  assert.equal(P.playFor("lugworm"), "sill");\n  assert.equal(P.DUR.knobsOn, Overlay.DUR.knobsOn);',
    '  assert.equal(P.playFor("honeybee"), "sill");\n  assert.equal(P.DUR.knobsOn, Overlay.DUR.knobsOn);',
    "mjs knurl pin")
# remaining lugworm sill pin
n = t.count('assert.equal(P.playFor("lugworm"), "sill");')
print("remaining lugworm sill", n)
if n == 1:
    t = once(t,
        'assert.equal(P.playFor("lugworm"), "sill");',
        'assert.equal(P.playFor("honeybee"), "sill");',
        "mjs other pin")
elif n != 0:
    raise SystemExit(f"unexpected remaining lugworm sill {n}")
if not t.endswith("\n"):
    t += "\n"
t = t + MJS_HEAP
p.write_text(t, encoding="utf-8", newline="\n")
print("patched window-play.test.mjs")
