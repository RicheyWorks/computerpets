from pathlib import Path
ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

def load(path):
    raw = path.read_bytes()
    file_nl = "\r\n" if b"\r\n" in raw else "\n"
    text = raw.decode("utf-8")
    if text.startswith("\ufeff"):
        text = text.lstrip("\ufeff")
    return text.replace("\r\n", "\n"), file_nl

def save(path, text, file_nl):
    if not text.endswith("\n"):
        text += "\n"
    path.write_bytes(text.replace("\n", file_nl).encode("utf-8"))

MJS = r'''
test("the demo window plate walks Comb waggle the same way", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /playFor/);
  assert.match(readFileSync(join(root, "src/lib/pets/insects.ts"), "utf8"), /key: "honeybee"[\s\S]{0,80}slug: "comb"/);
  assert.equal(P.playFor("honeybee"), "waggle");
  const target = P.pickTarget([WIN], 80, "honeybee", WORK, 176);
  assert.ok(target);
  assert.equal(target.kind, "waggle");
  assert.equal(target.side, "waxdish");
  assert.equal(target.leave, "waggled");
  assert.equal(Overlay.playFor("honeybee"), "waggle");
  assert.equal(P.WAGGLE, "waggle");
  assert.equal(Overlay.WAGGLE, "waggle");
  assert.notEqual(P.playFor("honeybee"), "comb");
  assert.notEqual(P.playFor("honeybee"), "drone");
  assert.notEqual(P.playFor("honeybee"), "lay");
  assert.notEqual(P.playFor("honeybee"), "draw");
  assert.notEqual(P.playFor("honeybee"), "sip");
  assert.equal(P.playFor("honey_drone"), "drone");
  assert.equal(Overlay.playFor("honey_drone"), "drone");
  assert.equal(P.playFor("honey_queen"), "lay");
  assert.equal(Overlay.playFor("honey_queen"), "lay");
  assert.equal(P.playFor("honeycomb"), "draw");
  assert.equal(Overlay.playFor("honeycomb"), "draw");
  assert.equal(P.playFor("hummingbird"), "sip");
  assert.equal(Overlay.playFor("hummingbird"), "sip");
  assert.equal(P.playFor("lugworm"), "castings");
  assert.equal(Overlay.playFor("lugworm"), "castings");
  assert.equal(P.playFor("fiddler_crab"), "signal");
  assert.equal(Overlay.playFor("fiddler_crab"), "signal");
  assert.equal(P.playFor("sand_dollar"), "flat");
  assert.equal(Overlay.playFor("sand_dollar"), "flat");
  assert.equal(P.playFor("monarch"), "sill");
  assert.equal(P.DUR.waggleOn, Overlay.DUR.waggleOn);
  assert.equal(P.DUR.waggle, Overlay.DUR.waggle);
  assert.equal(P.DUR.waggleHold, Overlay.DUR.waggleHold);
  assert.equal(P.DUR.waggleOff, Overlay.DUR.waggleOff);
  assert.ok(P.DUR.waggleOn !== Overlay.DUR.castingsOn);
  assert.ok(P.DUR.waggleOn !== Overlay.DUR.droneOn);
  assert.ok(P.DUR.waggleOn !== Overlay.DUR.signalOn);
  assert.ok(P.DUR.waggleOn !== Overlay.DUR.flatOn);
  const dish = P.wagglePoint(WIN, 176, WORK);
  const deskDish = Overlay.wagglePoint(WIN, Overlay.SPRITE, WORK);
  const marsh = P.signalPoint(WIN, 176, WORK);
  const plate = P.flatPoint(WIN, 176, WORK);
  const sandFoot = P.castingsPoint(WIN, 176, WORK);
  assert.ok(Math.abs(dish.x - deskDish.x) < 1);
  assert.ok(Math.abs(dish.lift - deskDish.lift) < 1);
  assert.ok(dish.lift > 20, "wax dish, the pan");
  assert.ok(Math.abs(dish.x - marsh.x) > 8, "not Wave signal");
  assert.ok(Math.abs(dish.x - plate.x) > 8, "not Token flat");
  assert.ok(Math.abs(dish.lift - sandFoot.lift) > 8, "not Heap castings");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 160, height: 70 }], 80, "honeybee", WORK, 176);
  assert.equal(tiny, null, "a real sill pan");
  const okPan = P.pickTarget([{ id: "pan", x: 200, y: 80, width: 190, height: 184 }], 80, "honeybee", WORK, 176);
  assert.ok(okPan, "a real sill pan as a wax dish");
  const walkOn = P.waggleOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  const deskWalk = Overlay.waggleOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  assert.equal(walkOn.x, deskWalk.x);
  assert.equal(walkOn.lift, deskWalk.lift);
  const pulse = P.wagglePath(0.5);
  const deskPulse = Overlay.wagglePath(0.5);
  assert.equal(pulse.x, deskPulse.x);
  assert.ok(pulse.lift > 1, "a waggle dance, the play");
  assert.ok(pulse.rot !== P.signalPath(0.5).rot, "waggle, not a signal");
  assert.ok(pulse.rot !== P.flatPath(0.5).rot, "waggle, not a flat");
  assert.ok(pulse.rot !== P.castingsPath(0.5).rot, "waggle, not castings");
  assert.ok(pulse.rot !== P.dronePath(0.5).rot, "waggle, not a drone");
  assert.ok(pulse.rot !== P.layPath(0.5).rot, "waggle, not a lay");
  assert.ok(pulse.rot !== P.drawPath(0.5).rot, "waggle, not a draw");
  const hold = P.waggleHoldPath(0.5);
  const deskHold = Overlay.waggleHoldPath(0.5);
  assert.equal(hold.x, deskHold.x);
  assert.equal(hold.lift, deskHold.lift);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, 176, { cmd: "idle" });
    if (play.phase === "waggle") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "waggle-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "waggle-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift + 3.3)) < 3, "she holds the waggle after the dance on the pan");
    }
  }
  assert.ok(seen.has("waggle-on"));
  assert.ok(seen.has("waggle"));
  assert.ok(seen.has("waggle-hold"));
  assert.ok(seen.has("waggle-off"));
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
});
'''

p = ROOT / "web" / "scripts" / "window-play.test.mjs"
text, nl = load(p)
if "Comb waggle the same way" in text:
    raise SystemExit("mjs already has Comb tests")
text = text.rstrip() + "\n" + MJS
save(p, text, nl)
print("mjs tests appended")
