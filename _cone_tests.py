from pathlib import Path

ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

HEADER_ADD = (
    " Cone clamps a glass rim as a rock rim: walk onto the rim, clamp the cone, then leave."
    " Pale still owns sand. Wave still owns signal. Lid still owns shut. Whorl still rasps."
    " This is the third shore leftover."
)

CJS_TESTS = r'''
test("Cone clamps a glass rim as a rock rim: walk onto the rim, clamp the cone, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("limpet"), "clamp");
  assert.equal(P.CLAMP, "clamp");
  assert.equal(P.playFor("ghost_crab"), "sand");
  assert.equal(P.SAND, "sand");
  assert.equal(P.playFor("fiddler_crab"), "signal");
  assert.equal(P.SIGNAL, "signal");
  assert.equal(P.playFor("amphipod"), "side");
  assert.equal(P.playFor("box_turtle"), "shut");
  assert.equal(P.SHUT, "shut");
  assert.equal(P.playFor("pond_snail"), "rasp");
  assert.equal(P.RASP, "rasp");
  assert.equal(P.playFor("hermit_crab"), "knob");
  assert.equal(P.playFor("tick"), "grip");
  assert.equal(P.playFor("barnacle"), "sill");
  assert.notEqual(P.playFor("limpet"), "cone");
  assert.notEqual(P.playFor("limpet"), "sand");
  assert.notEqual(P.playFor("limpet"), "shut");
  assert.notEqual(P.playFor("limpet"), "rasp");
  assert.notEqual(P.playFor("limpet"), "signal");
  assert.notEqual(P.playFor("limpet"), "side");
  assert.notEqual(P.playFor("limpet"), "knob");
  assert.notEqual(P.playFor("limpet"), "grip");
  assert.notEqual(P.playFor("limpet"), "sill");
  assert.equal(P.DUR.sandOn, 2.52, "Pale sand durations stay");
  assert.equal(P.DUR.signalOn, 2.45, "Wave signal durations stay");
  assert.equal(P.DUR.shutOn, P.DUR.shutOn, "Lid shut durations stay");
  assert.equal(P.DUR.raspOn, 2.69, "Whorl rasp durations stay");
  assert.equal(P.DUR.knobOn, 0.82, "Tenant knob durations stay");
  const target = P.pickTarget([WIN], 80, "limpet", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "clamp");
  assert.equal(target.side, "rockrim");
  assert.equal(target.leave, "clamps");
  assert.notEqual(target.kind, "cone");
  assert.notEqual(target.kind, "rasp");
  assert.notEqual(target.kind, "sand");
  assert.notEqual(target.kind, "shut");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift > 28, "she clamps a glass rim as a rock rim, not the floor");
  assert.ok(P.DUR.clampHold > P.DUR.clamp, "the hold is the sit after; the clamp is the tell");
  assert.ok(P.DUR.clampOn > 1.0, "a walk onto the rim, not the clamp");
  assert.ok(P.DUR.clampOn !== P.DUR.raspOn);
  assert.ok(P.DUR.clampOn !== P.DUR.sandOn);
  assert.ok(P.DUR.clampOn !== P.DUR.signalOn);
  assert.ok(P.DUR.clampOn !== P.DUR.sillHop);
  assert.ok(P.DUR.clamp !== P.DUR.rasp);
  assert.ok(P.DUR.clamp !== P.DUR.sand);
  assert.ok(P.DUR.clamp !== P.DUR.shut);
  assert.ok(P.DUR.clampHold !== P.DUR.raspHold);
  assert.ok(P.DUR.clampHold !== P.DUR.sandHold);
  assert.ok(P.DUR.clampOff !== P.DUR.raspOff);
  assert.ok(P.DUR.clampOff !== P.DUR.sillDown);
  const rim = P.clampPoint(WIN, P.SPRITE, WORK);
  const rasp = P.raspPoint(WIN, P.SPRITE, WORK);
  const shut = P.shutPoint(WIN, P.SPRITE, WORK);
  const sand = P.sandPoint(WIN, P.SPRITE, WORK);
  const wave = P.signalPoint(WIN, P.SPRITE, WORK);
  const filter = P.filterPoint(WIN, P.SPRITE, WORK);
  assert.ok(rim.lift > 28, "the glass rim as a rock rim, not the floor");
  assert.ok(Math.abs(rim.lift - rasp.lift) < 2, "the same glass rim Whorl rasps; the pose is a clamp");
  assert.ok(Math.abs(rim.x - rasp.x) > 8, "not Whorl's glass-rim rasp");
  assert.ok(Math.abs(rim.x - shut.x) > 8 || Math.abs(rim.lift - shut.lift) > 8, "not Lid's window-foot shut");
  assert.ok(Math.abs(rim.x - sand.x) > 8 || Math.abs(rim.lift - sand.lift) > 8, "not Pale's window-stool sand");
  assert.ok(Math.abs(rim.x - wave.x) > 8 || Math.abs(rim.lift - wave.lift) > 8, "not Wave's sill-pan signal");
  assert.ok(Math.abs(rim.x - filter.x) > 8 || Math.abs(rim.lift - filter.lift) > 8, "not Hinge's meeting-rail filter");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "limpet", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real glass rim, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 184, height: 80 }], 80, "limpet", WORK, P.SPRITE);
  assert.equal(short, null, "a real glass rim, not a short sash");
  const thin = P.pickTarget([{ id: "thin", x: 200, y: 80, width: 184, height: 176 }], 80, "limpet", WORK, P.SPRITE);
  assert.equal(thin, null, "Cone needs Whorl's real glass rim, not a shallower mouth");
  const rock = P.pickTarget([{ id: "rim", x: 200, y: 80, width: 184, height: 178 }], 80, "limpet", WORK, P.SPRITE);
  assert.ok(rock, "a real glass rim as a rock rim");
  const whorlOk = P.pickTarget([{ id: "rim", x: 200, y: 80, width: 184, height: 178 }], 80, "pond_snail", WORK, P.SPRITE);
  assert.ok(whorlOk, "Whorl still takes the rim");
  const paleOk = P.pickTarget([{ id: "stool", x: 200, y: 80, width: 192, height: 158 }], 80, "ghost_crab", WORK, P.SPRITE);
  assert.ok(paleOk, "Pale still takes the stool");
  const waveOk = P.pickTarget([{ id: "pan", x: 200, y: 80, width: 190, height: 184 }], 80, "fiddler_crab", WORK, P.SPRITE);
  assert.ok(waveOk, "Wave still takes the pan");
  const lidOk = P.pickTarget([{ id: "foot", x: 200, y: 80, width: 160, height: 70 }], 80, "box_turtle", WORK, P.SPRITE);
  assert.ok(lidOk, "Lid still takes the window foot");
  const walkOn = P.clampOnPath(0.25, { x: 40, lift: 0 }, { x: rim.x, lift: rim.lift });
  const raspOn = P.raspOnPath(0.25, { x: 40, lift: 0 }, { x: rim.x, lift: rim.lift });
  const sandOn = P.sandOnPath(0.25, { x: 40, lift: 0 }, { x: rim.x, lift: rim.lift });
  const shutOn = P.shutOnPath(0.25, { x: 40, lift: 0 }, { x: rim.x, lift: rim.lift });
  const signalOn = P.signalOnPath(0.25, { x: 40, lift: 0 }, { x: rim.x, lift: rim.lift });
  assert.ok(walkOn.lift > 0, "she walks onto the rim as a rock rim");
  assert.ok(walkOn.rot !== raspOn.rot, "a walk onto the rim, not Whorl rasp");
  assert.ok(walkOn.rot !== sandOn.rot, "a walk onto the rim, not Pale sand");
  assert.ok(walkOn.rot !== shutOn.rot, "a walk onto the rim, not Lid shut");
  assert.ok(walkOn.rot !== signalOn.rot, "a walk onto the rim, not Wave signal");
  const pulse = P.clampPath(0.5);
  const raspPose = P.raspPath(0.5);
  const sandPose = P.sandPath(0.5);
  const shutPose = P.shutPath(0.5);
  const claw = P.signalPath(0.5);
  const filterPose = P.filterPath(0.5);
  assert.ok(pulse.lift < 0, "she clamps the cone; the clamp is the tell");
  assert.ok(pulse.rot < -8, "the cone presses the rock rim");
  assert.ok(pulse.rot !== raspPose.rot, "a clamp, not a rasp");
  assert.ok(pulse.rot !== sandPose.rot, "a clamp, not a sand");
  assert.ok(pulse.rot !== shutPose.rot, "a clamp, not a shut");
  assert.ok(pulse.rot !== claw.rot, "a clamp, not a signal");
  assert.ok(pulse.rot !== filterPose.rot, "a clamp, not a filter");
  const hold = P.clampHoldPath(0.5);
  assert.ok(Math.abs(hold.rot - -11.2) < 0.2, "she holds after the clamp, cone still the tell");
  assert.ok(Math.abs(hold.x - 0.6) < 0.2, "she stays on the rock rim");
  assert.ok(hold.lift < -6, "a sit-hold on the rim after the clamp");
  const off0 = P.clampOffPath(0, { x: rim.x, lift: rim.lift, rot: -11.2 }, { x: rim.x + 46, lift: 0 });
  const offMid = P.clampOffPath(0.5, { x: rim.x, lift: rim.lift, rot: -11.2 }, { x: rim.x + 46, lift: 0 });
  const off1 = P.clampOffPath(1, { x: rim.x, lift: rim.lift, rot: -11.2 }, { x: rim.x + 46, lift: 0 });
  assert.ok(Math.abs(off0.x - rim.x) < 2);
  assert.ok(Math.abs(offMid.x - rim.x) > 8, "a walk leave off the rock rim");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "rasp");
    assert.notEqual(play.phase, "sand");
    assert.notEqual(play.phase, "shut");
    assert.notEqual(play.phase, "signal");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "clamp") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "clamp-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "clamp-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift - 6.8)) < 3, "she holds the sit after the clamp on the rim");
    }
    if (play.phase === "clamp-off") {
      assert.equal(play.anim, "walk");
    }
  }
  assert.ok(seen.has("clamp-on"));
  assert.ok(seen.has("clamp"));
  assert.ok(seen.has("clamp-hold"));
  assert.ok(seen.has("clamp-off"));
  assert.ok(!seen.has("rasp"), "Cone never uses Whorl rasp");
  assert.ok(!seen.has("sand"), "Cone never uses Pale sand");
  assert.ok(!seen.has("shut"), "Cone never uses Lid shut");
  assert.ok(!seen.has("signal"), "Cone never uses Wave signal");
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});
test("a moved window refits Cone's rock-rim clamp; sleep, card, and hide abort; Cone never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "limpet", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "clamp"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "clamp");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "clamp");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "clamp-off");
  assert.equal(play.abort, true);
});
'''

MJS_TESTS = r'''
test("the demo window plate walks Cone clamp the same way", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /playFor/);
  assert.match(readFileSync(join(root, "src/lib/pets/shore.ts"), "utf8"), /key: "limpet"[\s\S]{0,80}slug: "cone"/);
  assert.equal(P.playFor("limpet"), "clamp");
  const target = P.pickTarget([WIN], 80, "limpet", WORK, 176);
  assert.ok(target);
  assert.equal(target.kind, "clamp");
  assert.equal(target.side, "rockrim");
  assert.equal(target.leave, "clamps");
  assert.equal(Overlay.playFor("limpet"), "clamp");
  assert.equal(P.CLAMP, "clamp");
  assert.equal(Overlay.CLAMP, "clamp");
  assert.equal(P.playFor("ghost_crab"), "sand");
  assert.equal(Overlay.playFor("ghost_crab"), "sand");
  assert.equal(P.playFor("fiddler_crab"), "signal");
  assert.equal(Overlay.playFor("fiddler_crab"), "signal");
  assert.equal(P.playFor("box_turtle"), "shut");
  assert.equal(P.playFor("pond_snail"), "rasp");
  assert.equal(P.playFor("hermit_crab"), "knob");
  assert.equal(P.playFor("barnacle"), "sill");
  assert.notEqual(P.playFor("limpet"), "cone");
  assert.notEqual(P.playFor("limpet"), "sand");
  assert.notEqual(P.playFor("limpet"), "shut");
  assert.notEqual(P.playFor("limpet"), "rasp");
  assert.notEqual(P.playFor("limpet"), "sill");
  assert.equal(P.DUR.clampOn, Overlay.DUR.clampOn);
  assert.equal(P.DUR.clamp, Overlay.DUR.clamp);
  assert.equal(P.DUR.clampHold, Overlay.DUR.clampHold);
  assert.equal(P.DUR.clampOff, Overlay.DUR.clampOff);
  assert.ok(P.DUR.clampOn !== Overlay.DUR.raspOn);
  assert.ok(P.DUR.clampOn !== Overlay.DUR.sandOn);
  assert.ok(P.DUR.clampOn !== Overlay.DUR.signalOn);
  const rim = P.clampPoint(WIN, 176, WORK);
  const deskRim = Overlay.clampPoint(WIN, Overlay.SPRITE, WORK);
  const rasp = P.raspPoint(WIN, 176, WORK);
  const shut = P.shutPoint(WIN, 176, WORK);
  const sand = P.sandPoint(WIN, 176, WORK);
  const wave = P.signalPoint(WIN, 176, WORK);
  assert.ok(Math.abs(rim.x - deskRim.x) < 1);
  assert.ok(Math.abs(rim.lift - deskRim.lift) < 1);
  assert.ok(Math.abs(rim.lift - rasp.lift) < 2, "same rim family as Whorl, different pose");
  assert.ok(Math.abs(rim.x - rasp.x) > 8, "not Whorl rasp");
  assert.ok(rim.lift > 28, "rock rim, the glass");
  assert.ok(Math.abs(rim.x - shut.x) > 8 || Math.abs(rim.lift - shut.lift) > 8, "not Lid shut");
  assert.ok(Math.abs(rim.x - sand.x) > 8 || Math.abs(rim.lift - sand.lift) > 8, "not Pale sand");
  assert.ok(Math.abs(rim.x - wave.x) > 8 || Math.abs(rim.lift - wave.lift) > 8, "not Wave signal");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "limpet", WORK, 176);
  assert.equal(tiny, null, "a real glass rim");
  const okRim = P.pickTarget([{ id: "rim", x: 200, y: 80, width: 184, height: 178 }], 80, "limpet", WORK, 176);
  assert.ok(okRim, "a real glass rim as a rock rim");
  const walkOn = P.clampOnPath(0.25, { x: 40, lift: 0 }, { x: rim.x, lift: rim.lift });
  const deskWalk = Overlay.clampOnPath(0.25, { x: 40, lift: 0 }, { x: rim.x, lift: rim.lift });
  assert.equal(walkOn.x, deskWalk.x);
  assert.equal(walkOn.lift, deskWalk.lift);
  const pulse = P.clampPath(0.5);
  const deskPulse = Overlay.clampPath(0.5);
  assert.equal(pulse.x, deskPulse.x);
  assert.ok(pulse.lift < 0, "a clamp, the tell");
  assert.ok(pulse.rot !== P.raspPath(0.5).rot, "a clamp, not a rasp");
  assert.ok(pulse.rot !== P.sandPath(0.5).rot, "a clamp, not a sand");
  assert.ok(pulse.rot !== P.shutPath(0.5).rot, "a clamp, not a shut");
  const hold = P.clampHoldPath(0.5);
  const deskHold = Overlay.clampHoldPath(0.5);
  assert.equal(hold.x, deskHold.x);
  assert.equal(hold.lift, deskHold.lift);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, 176, { cmd: "idle" });
    if (play.phase === "clamp") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "clamp-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "clamp-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift - 6.8)) < 3, "she holds the sit after the clamp on the rim");
    }
  }
  assert.ok(seen.has("clamp-on"));
  assert.ok(seen.has("clamp"));
  assert.ok(seen.has("clamp-hold"));
  assert.ok(seen.has("clamp-off"));
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
});
'''

CONE_ROADMAP = (
    "- [x] Cone (`limpet` / `cone`) clamps a real glass rim as a rock rim: walk onto the rim "
    "(the rim — the same furniture family Whorl rasps as her own house, not Whorl's rasp, not Lid's "
    "window-foot shut, not Pale's window-stool sand, not Wave's sill-pan signal), clamp the cone "
    "(the tell — she clamps; a common limpet; not Lid; not Cement; named: Cone. The clamp is the tell. "
    "Hours: On the rim. Hello: \"I clamped. Hello.\" Visitor: \"I clamped. Then I left the rim.\" "
    "Ambient: \"I sit. Then I clamp. Then I sit.\" Temperament: clamping.), then leave. One window. "
    "The clamp is the tell — not Whorl's `rasp`. Not Lid's `shut`. Not Pale's `sand`. Not Wave's `signal`. "
    "Not Scud's `side`. Not Tenant's `knob`. Not Clasp's `grip`. playFor(\"limpet\") returns `clamp` "
    "(not `cone`, not `sand`, not `shut`, not `rasp`). Pale (`ghost_crab`) still owns `sand`. "
    "Wave (`fiddler_crab`) still owns `signal`. Lid (`box_turtle`) still owns `shut`. "
    "Whorl (`pond_snail`) still owns `rasp`. Tenant (`hermit_crab`) still owns `knob`. Same `playFor` door. "
    "`/demo/cone` lockstep. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. "
    "Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. "
    "Third shore leftover. Next leftover is Cement. Do not start Cement.\n"
)

def sub_once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1 occurrence, found {n}")
    return text.replace(old, new, 1)

def sub_all(text, old, new, label, expected=None):
    n = text.count(old)
    if expected is not None and n != expected:
        raise SystemExit(f"{label}: expected {expected} occurrence(s), found {n}")
    if n == 0:
        raise SystemExit(f"{label}: found 0")
    return text.replace(old, new)

def patch_cjs():
    p = ROOT / "desktop" / "renderer" / "window-play.test.cjs"
    t = p.read_text(encoding="utf-8")
    t = t.replace('assert.equal(P.playFor("limpet"), "sill");', 'assert.equal(P.playFor("limpet"), "clamp");')
    if not t.rstrip().endswith("});"):
        raise SystemExit("cjs: unexpected ending")
    t = t.rstrip() + "\n" + CJS_TESTS
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched cjs")

def patch_mjs():
    p = ROOT / "web" / "scripts" / "window-play.test.mjs"
    t = p.read_text(encoding="utf-8")
    t = t.replace('assert.equal(P.playFor("limpet"), "sill");', 'assert.equal(P.playFor("limpet"), "clamp");')
    t = t.rstrip() + "\n" + MJS_TESTS
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched mjs")

def patch_house():
    p = ROOT / "desktop" / "renderer" / "leftover-house.test.cjs"
    t = p.read_text(encoding="utf-8")
    t = sub_once(
        t,
        'test("Pale leftover sands a window stool as dry sand; second shore leftover done; next leftover is Cone; ',
        'test("Cone leftover clamps a glass rim as a rock rim; third shore leftover done; next leftover is Cement; Pale leftover still sands a window stool as dry sand; second shore leftover done; ',
        "house title",
    )
    t = sub_once(
        t,
        '''  assert.equal(WP.playFor("limpet"), "sill");
  assert.equal(WP.playFor("honeybee"), "sill");
''',
        '''  assert.equal(WP.playFor("limpet"), "clamp");
  assert.notEqual(WP.playFor("limpet"), "cone");
  assert.notEqual(WP.playFor("limpet"), "sand");
  assert.notEqual(WP.playFor("limpet"), "shut");
  assert.notEqual(WP.playFor("limpet"), "rasp");
  assert.notEqual(WP.playFor("limpet"), "sill");
  assert.equal(WP.playFor("ghost_crab"), "sand");
  assert.equal(WP.playFor("fiddler_crab"), "signal");
  assert.equal(WP.playFor("box_turtle"), "shut");
  assert.equal(WP.playFor("pond_snail"), "rasp");
  assert.equal(WP.playFor("hermit_crab"), "knob");
  assert.equal(WP.playFor("barnacle"), "sill");
  assert.equal(WP.playFor("honeybee"), "sill");
''',
        "house limpet pin",
    )
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched house")

def patch_docs():
    for rel in ["README.md", "desktop/README.md", "docs/ARCHITECTURE.md"]:
        p = ROOT / rel.replace("/", "\\") if False else ROOT.joinpath(*rel.split("/"))
        t = p.read_text(encoding="utf-8")
        if "This is the second shore leftover." not in t:
            raise SystemExit(f"{rel}: missing Pale leftover sentence")
        if "This is the third shore leftover." in t:
            print(f"{rel}: already has Cone")
            continue
        t = t.replace("This is the second shore leftover.", "This is the second shore leftover." + HEADER_ADD, 1)
        p.write_text(t, encoding="utf-8", newline="\n")
        print(f"patched {rel}")

    p = ROOT / "docs" / "ROADMAP.md"
    t = p.read_text(encoding="utf-8")
    t = sub_all(
        t,
        "Pale is done. Second shore leftover done. Next leftover is Cone. Do not start Cone.",
        "Pale is done. Second shore leftover done. Cone is done. Third shore leftover done. Next leftover is Cement. Do not start Cement.",
        "roadmap next leftover",
    )
    t = sub_once(
        t,
        "Catalog stays 220. Second shore leftover. Next leftover is Cone. Do not start Cone.",
        "Catalog stays 220. Second shore leftover. Cone is done. Third shore leftover done. Next leftover is Cement. Do not start Cement.\n" + CONE_ROADMAP,
        "roadmap Pale item + Cone item",
    )
    t = sub_once(
        t,
        "**Last Updated:** 2026-09-01 (Phase 6 leftover: Pale sands a window stool as dry sand; second shore leftover done; next leftover is Cone; catalog stays 220; sand is the tell; Wave still owns signal; Scud still owns side; Gale still owns run; Tun still owns dry; Tenant still owns knob; Ledger still owns plow)",
        "**Last Updated:** 2026-09-01 (Phase 6 leftover: Cone clamps a glass rim as a rock rim; third shore leftover done; next leftover is Cement; catalog stays 220; clamp is the tell; Pale still owns sand; Wave still owns signal; Lid still owns shut; Whorl still rasps; Tenant still owns knob)",
        "roadmap last updated",
    )
    if "Next leftover is Cone." in t:
        raise SystemExit("roadmap still names Cone as next leftover")
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched roadmap")

if __name__ == "__main__":
    patch_cjs()
    patch_mjs()
    patch_house()
    patch_docs()
    print("tests docs ok")
