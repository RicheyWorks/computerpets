from pathlib import Path

ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

HEADER_ADD = (
    " Cement stays a sash stile as a stone rim: walk onto the stile, kick the cirri, then leave."
    " Cone still owns clamp. Pale still owns sand. Dam still gnaws."
    " This is the fourth shore leftover."
)

CJS_TESTS = r'''
test("Cement stays a sash stile as a stone rim: walk onto the stile, kick the cirri, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("barnacle"), "cirri");
  assert.equal(P.CIRRI, "cirri");
  assert.notEqual(P.playFor("barnacle"), "cement");
  assert.notEqual(P.playFor("barnacle"), "clamp");
  assert.notEqual(P.playFor("barnacle"), "sand");
  assert.notEqual(P.playFor("barnacle"), "gnaw");
  assert.notEqual(P.playFor("barnacle"), "velvet");
  assert.notEqual(P.playFor("barnacle"), "glue");
  assert.notEqual(P.playFor("barnacle"), "sill");
  assert.equal(P.playFor("limpet"), "clamp");
  assert.equal(P.CLAMP, "clamp");
  assert.equal(P.playFor("ghost_crab"), "sand");
  assert.equal(P.SAND, "sand");
  assert.equal(P.playFor("fiddler_crab"), "signal");
  assert.equal(P.SIGNAL, "signal");
  assert.equal(P.playFor("box_turtle"), "shut");
  assert.equal(P.SHUT, "shut");
  assert.equal(P.playFor("pond_snail"), "rasp");
  assert.equal(P.RASP, "rasp");
  assert.equal(P.playFor("beaver"), "gnaw");
  assert.equal(P.GNAW, "gnaw");
  assert.equal(P.playFor("velvet_worm"), "velvet");
  assert.equal(P.VELVET, "velvet");
  assert.equal(P.playFor("chiton"), "sill");
  assert.equal(P.DUR.clampOn, 2.59, "Cone clamp durations stay");
  assert.equal(P.DUR.sandOn, 2.52, "Pale sand durations stay");
  assert.equal(P.DUR.signalOn, 2.45, "Wave signal durations stay");
  assert.equal(P.DUR.shutOn, 1.47, "Lid shut durations stay");
  assert.equal(P.DUR.raspOn, 2.69, "Whorl rasp durations stay");
  assert.equal(P.DUR.gnawOn, 1.19, "Dam gnaw durations stay");
  assert.equal(P.DUR.velvetOn, 2.04, "Jet velvet durations stay");
  const target = P.pickTarget([WIN], 80, "barnacle", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "cirri");
  assert.equal(target.side, "stonerim");
  assert.equal(target.leave, "stays");
  assert.notEqual(target.kind, "cement");
  assert.notEqual(target.kind, "clamp");
  assert.notEqual(target.kind, "gnaw");
  assert.notEqual(target.kind, "velvet");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift > 28, "she stays a sash stile as a stone rim, not the floor");
  assert.ok(P.DUR.cirriHold > P.DUR.cirri, "the hold is the stay after; the cirri kick is the play");
  assert.ok(P.DUR.cirriOn > 1.0, "a walk onto the stile, not the kick");
  assert.ok(P.DUR.cirriOn !== P.DUR.clampOn);
  assert.ok(P.DUR.cirriOn !== P.DUR.gnawOn);
  assert.ok(P.DUR.cirriOn !== P.DUR.velvetOn);
  assert.ok(P.DUR.cirriOn !== P.DUR.sandOn);
  assert.ok(P.DUR.cirriOn !== P.DUR.sillHop);
  assert.ok(P.DUR.cirri !== P.DUR.clamp);
  assert.ok(P.DUR.cirri !== P.DUR.gnaw);
  assert.ok(P.DUR.cirri !== P.DUR.velvet);
  assert.ok(P.DUR.cirriHold !== P.DUR.clampHold);
  assert.ok(P.DUR.cirriHold !== P.DUR.gnawHold);
  assert.ok(P.DUR.cirriOff !== P.DUR.clampOff);
  assert.ok(P.DUR.cirriOff !== P.DUR.sillDown);
  const stile = P.cirriPoint(WIN, P.SPRITE, WORK);
  const lodge = P.gnawPoint(WIN, P.SPRITE, WORK);
  const wood = P.velvetPoint(WIN, P.SPRITE, WORK);
  const rim = P.clampPoint(WIN, P.SPRITE, WORK);
  const rasp = P.raspPoint(WIN, P.SPRITE, WORK);
  const sand = P.sandPoint(WIN, P.SPRITE, WORK);
  const wave = P.signalPoint(WIN, P.SPRITE, WORK);
  assert.ok(stile.lift > 28, "the sash stile as a stone rim, not the floor");
  assert.ok(Math.abs(stile.x - lodge.x) < 2, "the same sash stile Dam gnaws; the pose is a cirri stay");
  assert.ok(Math.abs(stile.x - wood.x) < 2, "the same sash stile Jet glues; the pose is a cirri stay");
  assert.ok(Math.abs(stile.lift - lodge.lift) > 8, "not Dam's lodge-cup gnaw");
  assert.ok(Math.abs(stile.lift - wood.lift) > 8, "not Jet's wet-wood velvet");
  assert.ok(Math.abs(stile.x - rim.x) > 8 || Math.abs(stile.lift - rim.lift) > 8, "not Cone's glass-rim clamp");
  assert.ok(Math.abs(stile.x - rasp.x) > 8 || Math.abs(stile.lift - rasp.lift) > 8, "not Whorl's glass-rim rasp");
  assert.ok(Math.abs(stile.x - sand.x) > 8 || Math.abs(stile.lift - sand.lift) > 8, "not Pale's window-stool sand");
  assert.ok(Math.abs(stile.x - wave.x) > 8 || Math.abs(stile.lift - wave.lift) > 8, "not Wave's sill-pan signal");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "barnacle", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real sash stile, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 191, height: 80 }], 80, "barnacle", WORK, P.SPRITE);
  assert.equal(short, null, "a real sash stile, not a short sash");
  const thin = P.pickTarget([{ id: "thin", x: 200, y: 80, width: 191, height: 215 }], 80, "barnacle", WORK, P.SPRITE);
  assert.equal(thin, null, "Cement needs Dam's real sash stile, not a shallower mouth");
  const stone = P.pickTarget([{ id: "stile", x: 200, y: 80, width: 191, height: 216 }], 80, "barnacle", WORK, P.SPRITE);
  assert.ok(stone, "a real sash stile as a stone rim");
  const damOk = P.pickTarget([{ id: "stile", x: 200, y: 80, width: 191, height: 216 }], 80, "beaver", WORK, P.SPRITE);
  assert.ok(damOk, "Dam still takes the stile");
  const jetOk = P.pickTarget([{ id: "stile", x: 200, y: 80, width: 191, height: 216 }], 80, "velvet_worm", WORK, P.SPRITE);
  assert.ok(jetOk, "Jet still takes the stile");
  const coneOk = P.pickTarget([{ id: "rim", x: 200, y: 80, width: 184, height: 178 }], 80, "limpet", WORK, P.SPRITE);
  assert.ok(coneOk, "Cone still takes the glass rim");
  const paleOk = P.pickTarget([{ id: "stool", x: 200, y: 80, width: 192, height: 158 }], 80, "ghost_crab", WORK, P.SPRITE);
  assert.ok(paleOk, "Pale still takes the stool");
  const walkOn = P.cirriOnPath(0.25, { x: 40, lift: 0 }, { x: stile.x, lift: stile.lift });
  const clampOn = P.clampOnPath(0.25, { x: 40, lift: 0 }, { x: stile.x, lift: stile.lift });
  const gnawOn = P.gnawOnPath(0.25, { x: 40, lift: 0 }, { x: stile.x, lift: stile.lift });
  const velvetOn = P.velvetOnPath(0.25, { x: 40, lift: 0 }, { x: stile.x, lift: stile.lift });
  const sandOn = P.sandOnPath(0.25, { x: 40, lift: 0 }, { x: stile.x, lift: stile.lift });
  assert.ok(walkOn.lift > 0, "she walks onto the stile as a stone rim");
  assert.ok(walkOn.rot !== clampOn.rot, "a walk onto the stile, not Cone clamp");
  assert.ok(walkOn.rot !== gnawOn.rot, "a walk onto the stile, not Dam gnaw");
  assert.ok(walkOn.rot !== velvetOn.rot, "a walk onto the stile, not Jet velvet");
  assert.ok(walkOn.rot !== sandOn.rot, "a walk onto the stile, not Pale sand");
  const pulse = P.cirriPath(0.5);
  const clampPose = P.clampPath(0.5);
  const gnawPose = P.gnawPath(0.5);
  const velvetPose = P.velvetPath(0.5);
  const sandPose = P.sandPath(0.5);
  const raspPose = P.raspPath(0.5);
  assert.ok(pulse.lift > 0, "she kicks the cirri; the stay is the tell");
  assert.ok(pulse.rot > 8, "the cirri kick");
  assert.ok(pulse.rot !== clampPose.rot, "a cirri, not a clamp");
  assert.ok(pulse.rot !== gnawPose.rot, "a cirri, not a gnaw");
  assert.ok(pulse.rot !== velvetPose.rot, "a cirri, not a velvet");
  assert.ok(pulse.rot !== sandPose.rot, "a cirri, not a sand");
  assert.ok(pulse.rot !== raspPose.rot, "a cirri, not a rasp");
  const hold = P.cirriHoldPath(0.5);
  assert.ok(Math.abs(hold.rot - 6.1) < 0.2, "she holds after the kick, stay still the tell");
  assert.ok(Math.abs(hold.x - 0.4) < 0.2, "she stays on the stone rim");
  assert.ok(hold.lift < 0, "a sit-hold on the stile after the cirri kick");
  const off0 = P.cirriOffPath(0, { x: stile.x, lift: stile.lift, rot: 6.1 }, { x: stile.x + 50, lift: 0 });
  const offMid = P.cirriOffPath(0.5, { x: stile.x, lift: stile.lift, rot: 6.1 }, { x: stile.x + 50, lift: 0 });
  const off1 = P.cirriOffPath(1, { x: stile.x, lift: stile.lift, rot: 6.1 }, { x: stile.x + 50, lift: 0 });
  assert.ok(Math.abs(off0.x - stile.x) < 2);
  assert.ok(Math.abs(offMid.x - stile.x) > 8, "a walk leave off the stone rim");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "clamp");
    assert.notEqual(play.phase, "gnaw");
    assert.notEqual(play.phase, "velvet");
    assert.notEqual(play.phase, "sand");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "cirri") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "cirri-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "cirri-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift - 1.6)) < 3, "she holds the stay after the cirri kick on the stile");
    }
    if (play.phase === "cirri-off") {
      assert.equal(play.anim, "walk");
    }
  }
  assert.ok(seen.has("cirri-on"));
  assert.ok(seen.has("cirri"));
  assert.ok(seen.has("cirri-hold"));
  assert.ok(seen.has("cirri-off"));
  assert.ok(!seen.has("clamp"), "Cement never uses Cone clamp");
  assert.ok(!seen.has("gnaw"), "Cement never uses Dam gnaw");
  assert.ok(!seen.has("velvet"), "Cement never uses Jet velvet");
  assert.ok(!seen.has("sand"), "Cement never uses Pale sand");
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});
test("a moved window refits Cement's stone-rim cirri; sleep, card, and hide abort; Cement never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "barnacle", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "cirri"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "cirri");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "cirri");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "cirri-off");
  assert.equal(play.abort, true);
});
'''

MJS_TESTS = r'''
test("the demo window plate walks Cement cirri the same way", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /playFor/);
  assert.match(readFileSync(join(root, "src/lib/pets/shore.ts"), "utf8"), /key: "barnacle"[\s\S]{0,80}slug: "cement"/);
  assert.equal(P.playFor("barnacle"), "cirri");
  const target = P.pickTarget([WIN], 80, "barnacle", WORK, 176);
  assert.ok(target);
  assert.equal(target.kind, "cirri");
  assert.equal(target.side, "stonerim");
  assert.equal(target.leave, "stays");
  assert.equal(Overlay.playFor("barnacle"), "cirri");
  assert.equal(P.CIRRI, "cirri");
  assert.equal(Overlay.CIRRI, "cirri");
  assert.notEqual(P.playFor("barnacle"), "cement");
  assert.notEqual(P.playFor("barnacle"), "clamp");
  assert.notEqual(P.playFor("barnacle"), "sand");
  assert.equal(P.playFor("limpet"), "clamp");
  assert.equal(Overlay.playFor("limpet"), "clamp");
  assert.equal(P.playFor("ghost_crab"), "sand");
  assert.equal(Overlay.playFor("ghost_crab"), "sand");
  assert.equal(P.playFor("fiddler_crab"), "signal");
  assert.equal(Overlay.playFor("fiddler_crab"), "signal");
  assert.equal(P.playFor("beaver"), "gnaw");
  assert.equal(P.playFor("velvet_worm"), "velvet");
  assert.equal(P.playFor("chiton"), "sill");
  assert.equal(P.DUR.cirriOn, Overlay.DUR.cirriOn);
  assert.equal(P.DUR.cirri, Overlay.DUR.cirri);
  assert.equal(P.DUR.cirriHold, Overlay.DUR.cirriHold);
  assert.equal(P.DUR.cirriOff, Overlay.DUR.cirriOff);
  assert.ok(P.DUR.cirriOn !== Overlay.DUR.clampOn);
  assert.ok(P.DUR.cirriOn !== Overlay.DUR.gnawOn);
  assert.ok(P.DUR.cirriOn !== Overlay.DUR.velvetOn);
  const stile = P.cirriPoint(WIN, 176, WORK);
  const deskStile = Overlay.cirriPoint(WIN, Overlay.SPRITE, WORK);
  const lodge = P.gnawPoint(WIN, 176, WORK);
  const wood = P.velvetPoint(WIN, 176, WORK);
  const rim = P.clampPoint(WIN, 176, WORK);
  const sand = P.sandPoint(WIN, 176, WORK);
  assert.ok(Math.abs(stile.x - deskStile.x) < 1);
  assert.ok(Math.abs(stile.lift - deskStile.lift) < 1);
  assert.ok(Math.abs(stile.x - lodge.x) < 2, "same stile family as Dam, different pose");
  assert.ok(Math.abs(stile.x - wood.x) < 2, "same stile family as Jet, different pose");
  assert.ok(Math.abs(stile.lift - lodge.lift) > 8, "not Dam gnaw");
  assert.ok(Math.abs(stile.lift - wood.lift) > 8, "not Jet velvet");
  assert.ok(stile.lift > 28, "stone rim, the stile");
  assert.ok(Math.abs(stile.x - rim.x) > 8 || Math.abs(stile.lift - rim.lift) > 8, "not Cone clamp");
  assert.ok(Math.abs(stile.x - sand.x) > 8 || Math.abs(stile.lift - sand.lift) > 8, "not Pale sand");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "barnacle", WORK, 176);
  assert.equal(tiny, null, "a real sash stile");
  const okStile = P.pickTarget([{ id: "stile", x: 200, y: 80, width: 191, height: 216 }], 80, "barnacle", WORK, 176);
  assert.ok(okStile, "a real sash stile as a stone rim");
  const walkOn = P.cirriOnPath(0.25, { x: 40, lift: 0 }, { x: stile.x, lift: stile.lift });
  const deskWalk = Overlay.cirriOnPath(0.25, { x: 40, lift: 0 }, { x: stile.x, lift: stile.lift });
  assert.equal(walkOn.x, deskWalk.x);
  assert.equal(walkOn.lift, deskWalk.lift);
  const pulse = P.cirriPath(0.5);
  const deskPulse = Overlay.cirriPath(0.5);
  assert.equal(pulse.x, deskPulse.x);
  assert.ok(pulse.lift > 0, "a cirri kick, the play");
  assert.ok(pulse.rot !== P.clampPath(0.5).rot, "a cirri, not a clamp");
  assert.ok(pulse.rot !== P.gnawPath(0.5).rot, "a cirri, not a gnaw");
  assert.ok(pulse.rot !== P.velvetPath(0.5).rot, "a cirri, not a velvet");
  const hold = P.cirriHoldPath(0.5);
  const deskHold = Overlay.cirriHoldPath(0.5);
  assert.equal(hold.x, deskHold.x);
  assert.equal(hold.lift, deskHold.lift);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, 176, { cmd: "idle" });
    if (play.phase === "cirri") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "cirri-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "cirri-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift - 1.6)) < 3, "she holds the stay after the cirri kick on the stile");
    }
  }
  assert.ok(seen.has("cirri-on"));
  assert.ok(seen.has("cirri"));
  assert.ok(seen.has("cirri-hold"));
  assert.ok(seen.has("cirri-off"));
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
});
'''

CEMENT_ROADMAP = (
    "- [x] Cement (`barnacle` / `cement`) stays a real sash stile as a stone rim: walk onto the stile "
    "(the stile — the same furniture family Dam gnaws as a lodge cup and Jet glues as wet wood, not Dam's gnaw, "
    "not Jet's velvet, not Cone's glass-rim clamp, not Whorl's glass-rim rasp, not Pale's window-stool sand), "
    "kick the cirri (the tell — she stays; she kicks the cirri; an acorn barnacle; a crustacean; not a limpet, "
    "not Cone; not a crab; named: Cement. The stay is the tell. Hours: On the stone. Hello: \"I sat the stone. Hello.\" "
    "Ambient: \"I sit. Then I kick the cirri. Then I sit.\" Temperament: cemented.), then leave. One window. "
    "The cirri is the tell — not Cone's `clamp`. Not Dam's `gnaw`. Not Jet's `velvet`. Not Pale's `sand`. "
    "Not Wave's `signal`. Not Lid's `shut`. Not Whorl's `rasp`. playFor(\"barnacle\") returns `cirri` "
    "(not `cement`, not `clamp`, not `sand`, not `gnaw`). Cone (`limpet`) still owns `clamp`. "
    "Pale (`ghost_crab`) still owns `sand`. Wave (`fiddler_crab`) still owns `signal`. "
    "Lid (`box_turtle`) still owns `shut`. Whorl (`pond_snail`) still owns `rasp`. "
    "Dam (`beaver`) still owns `gnaw`. Jet (`velvet_worm`) still owns `velvet`. Same `playFor` door. "
    "`/demo/cement` lockstep. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. "
    "Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. "
    "Fourth shore leftover. Next leftover is Mail. Do not start Mail.\n"
)

def sub_once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1 occurrence, found {n}")
    return text.replace(old, new, 1)

def sub_all(text, old, new, label):
    n = text.count(old)
    if n == 0:
        raise SystemExit(f"{label}: found 0")
    print(f"{label}: {n}")
    return text.replace(old, new)

def patch_cjs():
    p = ROOT / "desktop" / "renderer" / "window-play.test.cjs"
    t = p.read_text(encoding="utf-8")
    t = t.replace('P.pickTarget([WIN], 80, "barnacle", WORK, P.SPRITE);', 'P.pickTarget([WIN], 80, "chiton", WORK, P.SPRITE);')
    t = t.replace('assert.equal(P.playFor("barnacle"), "sill");', 'assert.equal(P.playFor("barnacle"), "cirri");')
    if not t.rstrip().endswith("});"):
        raise SystemExit("cjs: unexpected ending")
    t = t.rstrip() + "\n" + CJS_TESTS
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched cjs")

def patch_mjs():
    p = ROOT / "web" / "scripts" / "window-play.test.mjs"
    t = p.read_text(encoding="utf-8")
    t = t.replace('assert.equal(P.playFor("barnacle"), "sill");', 'assert.equal(P.playFor("barnacle"), "cirri");')
    t = t.rstrip() + "\n" + MJS_TESTS
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched mjs")

def patch_house():
    p = ROOT / "desktop" / "renderer" / "leftover-house.test.cjs"
    t = p.read_text(encoding="utf-8")
    t = sub_once(
        t,
        'test("Cone leftover clamps a glass rim as a rock rim; third shore leftover done; next leftover is Cement; ',
        'test("Cement leftover stays a sash stile as a stone rim; fourth shore leftover done; next leftover is Mail; Cone leftover still clamps a glass rim as a rock rim; third shore leftover done; ',
        "house title",
    )
    t = sub_once(
        t,
        '''  assert.equal(WP.playFor("barnacle"), "sill");
  assert.equal(WP.playFor("honeybee"), "sill");
''',
        '''  assert.equal(WP.playFor("barnacle"), "cirri");
  assert.notEqual(WP.playFor("barnacle"), "cement");
  assert.notEqual(WP.playFor("barnacle"), "clamp");
  assert.notEqual(WP.playFor("barnacle"), "sand");
  assert.equal(WP.playFor("limpet"), "clamp");
  assert.equal(WP.playFor("ghost_crab"), "sand");
  assert.equal(WP.playFor("fiddler_crab"), "signal");
  assert.equal(WP.playFor("chiton"), "sill");
  assert.equal(WP.playFor("honeybee"), "sill");
''',
        "house barnacle pin",
    )
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched house")

def patch_docs():
    for rel in ["README.md", "desktop/README.md", "docs/ARCHITECTURE.md"]:
        p = ROOT.joinpath(*rel.split("/"))
        t = p.read_text(encoding="utf-8")
        if "This is the third shore leftover." not in t:
            raise SystemExit(f"{rel}: missing Cone leftover sentence")
        if "This is the fourth shore leftover." in t:
            print(f"{rel}: already has Cement")
            continue
        t = t.replace("This is the third shore leftover.", "This is the third shore leftover." + HEADER_ADD, 1)
        p.write_text(t, encoding="utf-8", newline="\n")
        print(f"patched {rel}")

    p = ROOT / "docs" / "ARCHITECTURE.md"
    t = p.read_text(encoding="utf-8")
    t = sub_once(
        t,
        "2026-09-01 (Cone clamps a glass rim as a rock rim; third shore leftover done; next leftover is Cement; catalog stays 220; clamp is the tell; Pale still owns sand; Wave still owns signal; Lid still owns shut; Whorl still rasps; Tenant still owns knob)",
        "2026-09-01 (Cement stays a sash stile as a stone rim; fourth shore leftover done; next leftover is Mail; catalog stays 220; cirri is the tell; Cone still owns clamp; Pale still owns sand; Wave still owns signal; Lid still owns shut; Whorl still rasps; Dam still gnaws; Jet still owns velvet)",
        "architecture last updated",
    )
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched architecture last updated")

    p = ROOT / "docs" / "ROADMAP.md"
    t = p.read_text(encoding="utf-8")
    t = sub_all(
        t,
        "Cone is done. Third shore leftover done. Next leftover is Cement. Do not start Cement.",
        "Cone is done. Third shore leftover done. Cement is done. Fourth shore leftover done. Next leftover is Mail. Do not start Mail.",
        "roadmap next leftover",
    )
    t = sub_once(
        t,
        "Catalog stays 220. Third shore leftover. Next leftover is Cement. Do not start Cement.",
        "Catalog stays 220. Third shore leftover. Cement is done. Fourth shore leftover done. Next leftover is Mail. Do not start Mail.\n" + CEMENT_ROADMAP,
        "roadmap Cone item + Cement item",
    )
    t = sub_once(
        t,
        "**Last Updated:** 2026-09-01 (Phase 6 leftover: Cone clamps a glass rim as a rock rim; third shore leftover done; next leftover is Cement; catalog stays 220; clamp is the tell; Pale still owns sand; Wave still owns signal; Lid still owns shut; Whorl still rasps; Tenant still owns knob)",
        "**Last Updated:** 2026-09-01 (Phase 6 leftover: Cement stays a sash stile as a stone rim; fourth shore leftover done; next leftover is Mail; catalog stays 220; cirri is the tell; Cone still owns clamp; Pale still owns sand; Wave still owns signal; Lid still owns shut; Whorl still rasps; Dam still gnaws; Jet still owns velvet)",
        "roadmap last updated",
    )
    if "Next leftover is Cement." in t:
        raise SystemExit("roadmap still names Cement as next leftover")
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched roadmap")

if __name__ == "__main__":
    patch_cjs()
    patch_mjs()
    patch_house()
    patch_docs()
    print("tests docs ok")