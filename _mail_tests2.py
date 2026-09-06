from pathlib import Path
ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

MJS_TESTS = r'''
test("the demo window plate walks Mail eight the same way", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /playFor/);
  assert.match(readFileSync(join(root, "src/lib/pets/shore.ts"), "utf8"), /key: "chiton"[\s\S]{0,80}slug: "mail"/);
  assert.equal(P.playFor("chiton"), "eight");
  const target = P.pickTarget([WIN], 80, "chiton", WORK, 176);
  assert.ok(target);
  assert.equal(target.kind, "eight");
  assert.equal(target.side, "tiderock");
  assert.equal(target.leave, "plated");
  assert.equal(Overlay.playFor("chiton"), "eight");
  assert.equal(P.EIGHT, "eight");
  assert.equal(Overlay.EIGHT, "eight");
  assert.notEqual(P.playFor("chiton"), "mail");
  assert.notEqual(P.playFor("chiton"), "cirri");
  assert.notEqual(P.playFor("chiton"), "clamp");
  assert.notEqual(P.playFor("chiton"), "rasp");
  assert.notEqual(P.playFor("chiton"), "roll");
  assert.equal(P.playFor("barnacle"), "cirri");
  assert.equal(Overlay.playFor("barnacle"), "cirri");
  assert.equal(P.playFor("limpet"), "clamp");
  assert.equal(Overlay.playFor("limpet"), "clamp");
  assert.equal(P.playFor("ghost_crab"), "sand");
  assert.equal(Overlay.playFor("ghost_crab"), "sand");
  assert.equal(P.playFor("fiddler_crab"), "signal");
  assert.equal(Overlay.playFor("fiddler_crab"), "signal");
  assert.equal(P.playFor("pillbug"), "roll");
  assert.equal(P.playFor("periwinkle"), "sill");
  assert.equal(P.DUR.eightOn, Overlay.DUR.eightOn);
  assert.equal(P.DUR.eight, Overlay.DUR.eight);
  assert.equal(P.DUR.eightHold, Overlay.DUR.eightHold);
  assert.equal(P.DUR.eightOff, Overlay.DUR.eightOff);
  assert.ok(P.DUR.eightOn !== Overlay.DUR.cirriOn);
  assert.ok(P.DUR.eightOn !== Overlay.DUR.clampOn);
  assert.ok(P.DUR.eightOn !== Overlay.DUR.rollOn);
  const rail = P.eightPoint(WIN, 176, WORK);
  const deskRail = Overlay.eightPoint(WIN, Overlay.SPRITE, WORK);
  const mark = P.markPoint(WIN, 176, WORK);
  const barred = P.barredPoint(WIN, 176, WORK);
  const stile = P.cirriPoint(WIN, 176, WORK);
  const rim = P.clampPoint(WIN, 176, WORK);
  const roll = P.rollPoint(WIN, 176, WORK);
  assert.ok(Math.abs(rail.x - deskRail.x) < 1);
  assert.ok(Math.abs(rail.lift - deskRail.lift) < 1);
  assert.ok(Math.abs(rail.lift - mark.lift) < 4, "same meeting rail family as Speck, different pose");
  assert.ok(Math.abs(rail.lift - barred.lift) < 4, "same meeting rail family as Bar, different pose");
  assert.ok(Math.abs(rail.x - mark.x) > 8, "not Speck mark");
  assert.ok(Math.abs(rail.x - barred.x) > 8, "not Bar barred");
  assert.ok(rail.lift > 28, "tide rock, the rail");
  assert.ok(Math.abs(rail.x - stile.x) > 8 || Math.abs(rail.lift - stile.lift) > 8, "not Cement cirri");
  assert.ok(Math.abs(rail.x - rim.x) > 8 || Math.abs(rail.lift - rim.lift) > 8, "not Cone clamp");
  assert.ok(Math.abs(rail.x - roll.x) > 8 || Math.abs(rail.lift - roll.lift) > 8, "not Armor roll");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "chiton", WORK, 176);
  assert.equal(tiny, null, "a real meeting rail");
  const okRail = P.pickTarget([{ id: "rail", x: 200, y: 80, width: 195, height: 193 }], 80, "chiton", WORK, 176);
  assert.ok(okRail, "a real meeting rail as a tide rock");
  const walkOn = P.eightOnPath(0.25, { x: 40, lift: 0 }, { x: rail.x, lift: rail.lift });
  const deskWalk = Overlay.eightOnPath(0.25, { x: 40, lift: 0 }, { x: rail.x, lift: rail.lift });
  assert.equal(walkOn.x, deskWalk.x);
  assert.equal(walkOn.lift, deskWalk.lift);
  const pulse = P.eightPath(0.5);
  const deskPulse = Overlay.eightPath(0.5);
  assert.equal(pulse.x, deskPulse.x);
  assert.ok(pulse.lift < 0, "an eight plate, the play");
  assert.ok(pulse.rot !== P.cirriPath(0.5).rot, "an eight, not a cirri");
  assert.ok(pulse.rot !== P.clampPath(0.5).rot, "an eight, not a clamp");
  assert.ok(pulse.rot !== P.rollPath(0.5).rot, "an eight, not a roll");
  const hold = P.eightHoldPath(0.5);
  const deskHold = Overlay.eightHoldPath(0.5);
  assert.equal(hold.x, deskHold.x);
  assert.equal(hold.lift, deskHold.lift);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, 176, { cmd: "idle" });
    if (play.phase === "eight") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "eight-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "eight-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift - 4.2)) < 3, "she holds the plates after the eight on the rail");
    }
  }
  assert.ok(seen.has("eight-on"));
  assert.ok(seen.has("eight"));
  assert.ok(seen.has("eight-hold"));
  assert.ok(seen.has("eight-off"));
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
});
'''

MAIL_ROADMAP = (
    "- [x] Mail (`chiton` / `mail`) plates a real window meeting rail as a tide rock: walk onto the rail "
    "(the rail — the same furniture family Speck marks as a riffle cup, Bar bars as a weed rail, Felt leans as blotter felt, "
    "and Snap counts as a wetland cup, not Speck's mark, not Bar's barred, not Felt's lean, not Snap's count, "
    "not Cone's glass-rim clamp, not Cement's sash-stile cirri, not Whorl's glass-rim rasp, not Armor's window-stool roll), "
    "plate the eight (the tell — she plates; eight plates; a lined chiton; not a limpet, not Cone; not Armor, a pillbug who rolls; "
    "named: Mail. The eight are the tell. Hello: \"I plated. Hello.\" Ambient: \"I walk. Then I plate. Then I walk.\" "
    "Play: \"A graze. Review the plates.\" Temperament: plated.), then leave. One window. "
    "The eight is the tell — not Cone's `clamp`. Not Cement's `cirri`. Not Whorl's `rasp`. Not Armor's `roll`. "
    "Not Speck's `mark`. Not Bar's `barred`. Not Felt's `lean`. Not Snap's `count`. playFor(\"chiton\") returns `eight` "
    "(not `mail`, not `cirri`, not `clamp`, not `rasp`, not `roll`). Cement (`barnacle`) still owns `cirri`. "
    "Cone (`limpet`) still owns `clamp`. Pale (`ghost_crab`) still owns `sand`. Wave (`fiddler_crab`) still owns `signal`. "
    "Lid (`box_turtle`) still owns `shut`. Whorl (`pond_snail`) still owns `rasp`. Armor (`pillbug`) still owns `roll`. "
    "Same `playFor` door. `/demo/mail` lockstep. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. "
    "Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. "
    "Fifth shore leftover. Next leftover is Spire. Do not start Spire.\n"
)

open(ROOT / "_mail_mjs_tests.txt", "w", encoding="utf-8", newline="\n").write(MJS_TESTS)
open(ROOT / "_mail_roadmap.txt", "w", encoding="utf-8", newline="\n").write(MAIL_ROADMAP)
print("wrote mjs and roadmap fragments")
