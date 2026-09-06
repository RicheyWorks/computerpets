# Ghost leftover tests — do not commit
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

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit("%s: expected 1, got %d for %r" % (label, n, old[:180]))
    return text.replace(old, new, 1)

print("tests helpers ok")

CJS = r'''
test("Ghost weeks a lamp-side glass as lamp dusk: walk onto the glass, sit the week, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("luna"), "week");
  assert.equal(P.WEEK, "week");
  assert.notEqual(P.playFor("luna"), "ghost");
  assert.notEqual(P.playFor("luna"), "dusk");
  assert.notEqual(P.playFor("luna"), "mount");
  assert.notEqual(P.playFor("luna"), "weed");
  assert.notEqual(P.playFor("luna"), "web");
  assert.notEqual(P.playFor("luna"), "gold");
  assert.notEqual(P.playFor("luna"), "waggle");
  assert.notEqual(P.playFor("luna"), "sip");
  assert.notEqual(P.playFor("luna"), "sand");
  assert.notEqual(P.playFor("luna"), "run");
  assert.notEqual(P.playFor("luna"), "sill");
  assert.equal(P.playFor("monarch"), "weed");
  assert.equal(P.WEED, "weed");
  assert.equal(P.playFor("walleye"), "dusk");
  assert.equal(P.DUSK, "dusk");
  assert.equal(P.playFor("orchid"), "mount");
  assert.equal(P.MOUNT, "mount");
  assert.equal(P.playFor("orb_weaver"), "web");
  assert.equal(P.WEB, "web");
  assert.equal(P.playFor("honeybee"), "waggle");
  assert.equal(P.WAGGLE, "waggle");
  assert.equal(P.playFor("ginkgo"), "gold");
  assert.equal(P.GOLD, "gold");
  assert.equal(P.playFor("ghost_crab"), "sand");
  assert.equal(P.SAND, "sand");
  assert.equal(P.playFor("solifuge"), "run");
  assert.equal(P.playFor("gecko"), "chirp");
  assert.equal(P.playFor("firefly"), "sill");
  assert.equal(P.DUR.weedOn, 3.22, "Milk weed durations stay");
  assert.equal(P.DUR.waggleOn, 3.15, "Comb waggle durations stay");
  assert.equal(P.DUR.duskOn, 1.54, "Night dusk durations stay");
  const target = P.pickTarget([WIN], 80, "luna", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "week");
  assert.equal(target.side, "lampdusk");
  assert.equal(target.leave, "weeked");
  assert.notEqual(target.kind, "ghost");
  assert.notEqual(target.kind, "dusk");
  assert.notEqual(target.kind, "mount");
  assert.notEqual(target.kind, "weed");
  assert.notEqual(target.kind, "web");
  assert.notEqual(target.kind, "gold");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift > 8, "she weeks a lamp-side glass as lamp dusk, not the floor");
  assert.ok(P.DUR.weekHold > P.DUR.week, "the hold is the sit after; the week is the tell");
  assert.ok(P.DUR.weekOn > 1.0, "a walk onto the glass, not the week");
  assert.ok(P.DUR.weekOn !== P.DUR.weedOn);
  assert.ok(P.DUR.weekOn !== P.DUR.duskOn);
  assert.ok(P.DUR.weekOn !== P.DUR.mountOn);
  assert.ok(P.DUR.weekOn !== P.DUR.webOn);
  assert.ok(P.DUR.weekOn !== P.DUR.goldOn);
  assert.ok(P.DUR.weekOn !== P.DUR.waggleOn);
  assert.ok(P.DUR.weekOn !== P.DUR.sillHop);
  assert.ok(P.DUR.week !== P.DUR.weed);
  assert.ok(P.DUR.week !== P.DUR.dusk);
  assert.ok(P.DUR.week !== P.DUR.mount);
  assert.ok(P.DUR.week !== P.DUR.web);
  assert.ok(P.DUR.weekHold !== P.DUR.weedHold);
  assert.ok(P.DUR.weekHold !== P.DUR.duskHold);
  assert.ok(P.DUR.weekOff !== P.DUR.weedOff);
  assert.ok(P.DUR.weekOff !== P.DUR.duskOff);
  assert.ok(P.DUR.weekOff !== P.DUR.sillDown);
  const glass = P.weekPoint(WIN, P.SPRITE, WORK);
  const hub = P.webPoint(WIN, P.SPRITE, WORK);
  const stile = P.duskPoint(WIN, P.SPRITE, WORK);
  const bark = P.mountPoint(WIN, P.SPRITE, WORK);
  const cup = P.weedPoint(WIN, P.SPRITE, WORK);
  const autumn = P.goldPoint(WIN, P.SPRITE, WORK);
  const plaster = P.chirpPoint(WIN, P.SPRITE, WORK);
  const dish = P.wagglePoint(WIN, P.SPRITE, WORK);
  assert.ok(glass.lift > 8, "the lamp-side glass as lamp dusk, not the floor");
  assert.ok(Math.abs(glass.x - hub.x) > 12 || Math.abs(glass.lift - hub.lift) > 12, "same lamp-side glass family as Loom, she weeks, she does not web");
  assert.ok(Math.abs(glass.lift - hub.lift) > 20, "not Loom's top-corner hub");
  assert.ok(Math.abs(glass.x - stile.x) > 20, "glass, not Night's lamp-side stile dusk");
  assert.ok(Math.abs(glass.x - bark.x) > 20 || Math.abs(glass.lift - bark.lift) > 8, "not Moth's window-jamb mount");
  assert.ok(Math.abs(glass.x - cup.x) > 20 || Math.abs(glass.lift - cup.lift) > 8, "not Milk's window-box weed");
  assert.ok(Math.abs(glass.x - autumn.x) > 8 || Math.abs(glass.lift - autumn.lift) > 8, "not Fan lamp-side gold");
  assert.ok(Math.abs(glass.x - plaster.x) > 8 || Math.abs(glass.lift - plaster.lift) > 8, "not Pad lamp-side jamb chirp");
  assert.ok(Math.abs(glass.x - dish.x) > 8 || Math.abs(glass.lift - dish.lift) > 8, "not Comb sill-pan waggle");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "luna", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real lamp-side glass, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 180, height: 80 }], 80, "luna", WORK, P.SPRITE);
  assert.equal(short, null, "a real lamp-side glass, not a short sash");
  const thin = P.pickTarget([{ id: "thin", x: 200, y: 80, width: 200, height: 190 }], 80, "luna", WORK, P.SPRITE);
  assert.equal(thin, null, "a real lamp-side glass, not a thinner pane");
  const pane = P.pickTarget([{ id: "pane", x: 200, y: 80, width: 200, height: 200 }], 80, "luna", WORK, P.SPRITE);
  assert.ok(pane, "a real lamp-side glass as lamp dusk");
  const loomOk = P.pickTarget([{ id: "pane", x: 200, y: 80, width: 200, height: 200 }], 80, "orb_weaver", WORK, P.SPRITE);
  assert.ok(loomOk, "Loom still takes the lamp-side glass");
  const milkOk = P.pickTarget([{ id: "box", x: 200, y: 80, width: 193, height: 169 }], 80, "monarch", WORK, P.SPRITE);
  assert.ok(milkOk, "Milk still takes the window-box");
  const nightNo = P.pickTarget([{ id: "pane", x: 200, y: 80, width: 200, height: 200 }], 80, "walleye", WORK, P.SPRITE);
  assert.equal(nightNo, null, "Night still needs a lamp-side stile, not this glass gate");
  const walkOn = P.weekOnPath(0.25, { x: 40, lift: 0 }, { x: glass.x, lift: glass.lift });
  const webOn = P.webOnPath(0.25, { x: 40, lift: 0 }, { x: glass.x, lift: glass.lift });
  const duskOn = P.duskOnPath(0.25, { x: 40, lift: 0 }, { x: glass.x, lift: glass.lift });
  const mountOn = P.mountOnPath(0.25, { x: 40, lift: 0 }, { x: glass.x, lift: glass.lift });
  const weedOn = P.weedOnPath(0.25, { x: 40, lift: 0 }, { x: glass.x, lift: glass.lift });
  const goldOn = P.goldOnPath(0.25, { x: 40, lift: 0 }, { x: glass.x, lift: glass.lift });
  assert.ok(walkOn.lift > 0, "she walks onto the glass as lamp dusk");
  assert.ok(walkOn.rot !== webOn.rot, "a walk onto the glass, not Loom web");
  assert.ok(walkOn.rot !== duskOn.rot, "a walk onto the glass, not Night dusk");
  assert.ok(walkOn.rot !== mountOn.rot, "a walk onto the glass, not Moth mount");
  assert.ok(walkOn.rot !== weedOn.rot, "a walk onto the glass, not Milk weed");
  assert.ok(walkOn.rot !== goldOn.rot, "a walk onto the glass, not Fan gold");
  const ghostPose = P.weekPath(0.5);
  const webPose = P.webPath(0.5);
  const duskPose = P.duskPath(0.5);
  const mountPose = P.mountPath(0.5);
  const weedPose = P.weedPath(0.5);
  const goldPose = P.goldPath(0.5);
  const wagglePose = P.wagglePath(0.5);
  assert.ok(ghostPose.lift > 1, "she sits the week; a drift, athletic for a week");
  assert.ok(ghostPose.rot !== webPose.rot, "week, not a web");
  assert.ok(ghostPose.rot !== duskPose.rot, "week, not a dusk");
  assert.ok(ghostPose.rot !== mountPose.rot, "week, not a mount");
  assert.ok(ghostPose.rot !== weedPose.rot, "week, not a weed");
  assert.ok(ghostPose.rot !== goldPose.rot, "week, not gold");
  assert.ok(ghostPose.rot !== wagglePose.rot, "week, not a waggle");
  const hold = P.weekHoldPath(0.5);
  assert.ok(Math.abs(hold.rot - 4.2) < 0.2, "she holds after the week, week still the tell");
  assert.ok(Math.abs(hold.x - 1.3) < 0.2, "she stays on the lamp-side glass");
  assert.ok(hold.lift > 1, "a sit-hold on the glass after the week");
  const off0 = P.weekOffPath(0, { x: glass.x, lift: glass.lift, rot: 4.2 }, { x: glass.x + 50, lift: 0 });
  const offMid = P.weekOffPath(0.5, { x: glass.x, lift: glass.lift, rot: 4.2 }, { x: glass.x + 50, lift: 0 });
  const off1 = P.weekOffPath(1, { x: glass.x, lift: glass.lift, rot: 4.2 }, { x: glass.x + 50, lift: 0 });
  assert.ok(Math.abs(off0.x - glass.x) < 2);
  assert.ok(Math.abs(offMid.x - glass.x) > 8, "a walk leave off the lamp-side glass");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "weed");
    assert.notEqual(play.phase, "dusk");
    assert.notEqual(play.phase, "mount");
    assert.notEqual(play.phase, "web");
    assert.notEqual(play.phase, "gold");
    assert.notEqual(play.phase, "waggle");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "week") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "week-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "week-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift + 2.5)) < 3, "she holds the week after the sit on the glass");
    }
    if (play.phase === "week-off") {
      assert.equal(play.anim, "walk");
    }
  }
  assert.ok(seen.has("week-on"));
  assert.ok(seen.has("week"));
  assert.ok(seen.has("week-hold"));
  assert.ok(seen.has("week-off"));
  assert.ok(!seen.has("weed"), "Ghost never uses Milk weed");
  assert.ok(!seen.has("dusk"), "Ghost never uses Night dusk");
  assert.ok(!seen.has("mount"), "Ghost never uses Moth mount");
  assert.ok(!seen.has("web"), "Ghost never uses Loom web");
  assert.ok(!seen.has("gold"), "Ghost never uses Fan gold");
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});
test("a moved window refits Ghost's lamp-dusk week; sleep, card, and hide abort; Ghost never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "luna", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "week"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "week");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "week");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "week-off");
  assert.equal(play.abort, true);
});
'''

print("cjs body ok")

MJS = r'''
test("the demo window plate walks Ghost week the same way", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /playFor/);
  assert.match(readFileSync(join(root, "src/lib/pets/insects.ts"), "utf8"), /key: "luna"[\s\S]{0,80}slug: "ghost"/);
  assert.equal(P.playFor("luna"), "week");
  const target = P.pickTarget([WIN], 80, "luna", WORK, 176);
  assert.ok(target);
  assert.equal(target.kind, "week");
  assert.equal(target.side, "lampdusk");
  assert.equal(target.leave, "weeked");
  assert.equal(Overlay.playFor("luna"), "week");
  assert.equal(P.WEEK, "week");
  assert.equal(Overlay.WEEK, "week");
  assert.notEqual(P.playFor("luna"), "ghost");
  assert.notEqual(P.playFor("luna"), "dusk");
  assert.notEqual(P.playFor("luna"), "mount");
  assert.notEqual(P.playFor("luna"), "weed");
  assert.notEqual(P.playFor("luna"), "web");
  assert.notEqual(P.playFor("luna"), "gold");
  assert.equal(P.playFor("monarch"), "weed");
  assert.equal(Overlay.playFor("monarch"), "weed");
  assert.equal(P.playFor("walleye"), "dusk");
  assert.equal(Overlay.playFor("walleye"), "dusk");
  assert.equal(P.playFor("orchid"), "mount");
  assert.equal(Overlay.playFor("orchid"), "mount");
  assert.equal(P.playFor("orb_weaver"), "web");
  assert.equal(Overlay.playFor("orb_weaver"), "web");
  assert.equal(P.playFor("honeybee"), "waggle");
  assert.equal(P.playFor("ginkgo"), "gold");
  assert.equal(P.playFor("ghost_crab"), "sand");
  assert.equal(P.playFor("firefly"), "sill");
  assert.equal(P.DUR.weekOn, Overlay.DUR.weekOn);
  assert.equal(P.DUR.week, Overlay.DUR.week);
  assert.equal(P.DUR.weekHold, Overlay.DUR.weekHold);
  assert.equal(P.DUR.weekOff, Overlay.DUR.weekOff);
  assert.ok(P.DUR.weekOn !== Overlay.DUR.weedOn);
  assert.ok(P.DUR.weekOn !== Overlay.DUR.duskOn);
  assert.ok(P.DUR.weekOn !== Overlay.DUR.mountOn);
  assert.ok(P.DUR.weekOn !== Overlay.DUR.webOn);
  const glass = P.weekPoint(WIN, 176, WORK);
  const deskGlass = Overlay.weekPoint(WIN, Overlay.SPRITE, WORK);
  const hub = P.webPoint(WIN, 176, WORK);
  const stile = P.duskPoint(WIN, 176, WORK);
  const cup = P.weedPoint(WIN, 176, WORK);
  assert.ok(Math.abs(glass.x - deskGlass.x) < 1);
  assert.ok(Math.abs(glass.lift - deskGlass.lift) < 1);
  assert.ok(glass.lift > 8, "lamp dusk, the glass");
  assert.ok(Math.abs(glass.lift - hub.lift) > 20, "not Loom web");
  assert.ok(Math.abs(glass.x - stile.x) > 20, "not Night dusk");
  assert.ok(Math.abs(glass.x - cup.x) > 20 || Math.abs(glass.lift - cup.lift) > 8, "not Milk weed");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 160, height: 70 }], 80, "luna", WORK, 176);
  assert.equal(tiny, null, "a real lamp-side glass");
  const okGlass = P.pickTarget([{ id: "pane", x: 200, y: 80, width: 200, height: 200 }], 80, "luna", WORK, 176);
  assert.ok(okGlass, "a real lamp-side glass as lamp dusk");
  const walkOn = P.weekOnPath(0.25, { x: 40, lift: 0 }, { x: glass.x, lift: glass.lift });
  const deskWalk = Overlay.weekOnPath(0.25, { x: 40, lift: 0 }, { x: glass.x, lift: glass.lift });
  assert.equal(walkOn.x, deskWalk.x);
  assert.equal(walkOn.lift, deskWalk.lift);
  const pulse = P.weekPath(0.5);
  const deskPulse = Overlay.weekPath(0.5);
  assert.equal(pulse.x, deskPulse.x);
  assert.ok(pulse.lift > 1, "sit the week, the play");
  assert.ok(pulse.rot !== P.webPath(0.5).rot, "week, not a web");
  assert.ok(pulse.rot !== P.duskPath(0.5).rot, "week, not a dusk");
  assert.ok(pulse.rot !== P.mountPath(0.5).rot, "week, not a mount");
  assert.ok(pulse.rot !== P.weedPath(0.5).rot, "week, not a weed");
  assert.ok(pulse.rot !== P.goldPath(0.5).rot, "week, not gold");
  const hold = P.weekHoldPath(0.5);
  const deskHold = Overlay.weekHoldPath(0.5);
  assert.equal(hold.x, deskHold.x);
  assert.equal(hold.lift, deskHold.lift);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, 176, { cmd: "idle" });
    if (play.phase === "week") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "week-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "week-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift + 2.5)) < 3, "she holds the week after the sit on the glass");
    }
  }
  assert.ok(seen.has("week-on"));
  assert.ok(seen.has("week"));
  assert.ok(seen.has("week-hold"));
  assert.ok(seen.has("week-off"));
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
});
'''

# cjs append + pin moves
p = ROOT / "desktop" / "renderer" / "window-play.test.cjs"
text, nl = load(p)
if "Ghost weeks a lamp-side glass as lamp dusk" in text:
    raise SystemExit("cjs already has Ghost tests")
text = once(
    text,
    'const target = P.pickTarget([WIN], 80, "luna", WORK, P.SPRITE);',
    'const target = P.pickTarget([WIN], 80, "firefly", WORK, P.SPRITE);',
    "cjs generic sill guest",
)
text = once(
    text,
    '  assert.equal(P.playFor("luna"), "sill");\n  assert.equal(P.DUR.castingsOn, 3.08, "Heap castings durations stay");',
    '  assert.equal(P.playFor("firefly"), "sill");\n  assert.equal(P.DUR.castingsOn, 3.08, "Heap castings durations stay");',
    "cjs Comb luna pin",
)
text = once(
    text,
    '  assert.equal(P.playFor("luna"), "sill");\n  assert.equal(P.DUR.waggleOn, 3.15, "Comb waggle durations stay");',
    '  assert.equal(P.playFor("firefly"), "sill");\n  assert.equal(P.DUR.waggleOn, 3.15, "Comb waggle durations stay");',
    "cjs Milk luna pin",
)
text = text.rstrip() + "\n" + CJS
save(p, text, nl)
print("cjs tests ok")

# mjs append + pin
p = ROOT / "web" / "scripts" / "window-play.test.mjs"
text, nl = load(p)
if "Ghost week the same way" in text:
    raise SystemExit("mjs already has Ghost tests")
text = once(
    text,
    '  assert.equal(P.playFor("luna"), "sill");\n  assert.equal(P.DUR.waggleOn, Overlay.DUR.waggleOn);',
    '  assert.equal(P.playFor("firefly"), "sill");\n  assert.equal(P.DUR.waggleOn, Overlay.DUR.waggleOn);',
    "mjs Comb luna pin",
)
text = once(
    text,
    '  assert.equal(P.playFor("luna"), "sill");\n  assert.equal(P.DUR.weedOn, Overlay.DUR.weedOn);',
    '  assert.equal(P.playFor("firefly"), "sill");\n  assert.equal(P.DUR.weedOn, Overlay.DUR.weedOn);',
    "mjs Milk luna pin",
)
text = text.rstrip() + "\n" + MJS
save(p, text, nl)
print("mjs tests ok")

# leftover-house
p = ROOT / "desktop" / "renderer" / "leftover-house.test.cjs"
text, nl = load(p)
text = once(
    text,
    'test("Milk leftover weeds a window-box as a milkweed cup; second leftover of the remaining hive den done; shore ten is closed; next leftover is Ghost; ',
    'test("Ghost leftover weeks a lamp-side glass as lamp dusk; third leftover of the remaining hive den done; shore ten is closed; next leftover is Spark; Milk leftover still weeds a window-box as a milkweed cup; second leftover of the remaining hive den done; ',
    "house title",
)
text = once(
    text,
    '''  assert.equal(WP.playFor("monarch"), "weed");
  assert.equal(WP.WEED, "weed");
  assert.notEqual(WP.playFor("monarch"), "milk");
  assert.notEqual(WP.playFor("monarch"), "gold");
  assert.notEqual(WP.playFor("monarch"), "snip");
  assert.notEqual(WP.playFor("monarch"), "sip");
  assert.notEqual(WP.playFor("monarch"), "wrap");
  assert.notEqual(WP.playFor("monarch"), "waggle");
  assert.notEqual(WP.playFor("monarch"), "sill");
  assert.equal(WP.playFor("honeybee"), "waggle");
  assert.equal(WP.playFor("kinkajou"), "wrap");
  assert.equal(WP.playFor("leafcutter"), "snip");
  assert.equal(WP.playFor("ginkgo"), "gold");
  assert.equal(WP.playFor("luna"), "sill");
});
''',
    '''  assert.equal(WP.playFor("monarch"), "weed");
  assert.equal(WP.WEED, "weed");
  assert.notEqual(WP.playFor("monarch"), "milk");
  assert.notEqual(WP.playFor("monarch"), "gold");
  assert.notEqual(WP.playFor("monarch"), "snip");
  assert.notEqual(WP.playFor("monarch"), "sip");
  assert.notEqual(WP.playFor("monarch"), "wrap");
  assert.notEqual(WP.playFor("monarch"), "waggle");
  assert.notEqual(WP.playFor("monarch"), "sill");
  assert.equal(WP.playFor("honeybee"), "waggle");
  assert.equal(WP.playFor("kinkajou"), "wrap");
  assert.equal(WP.playFor("leafcutter"), "snip");
  assert.equal(WP.playFor("ginkgo"), "gold");
  assert.equal(WP.playFor("luna"), "week");
  assert.equal(WP.WEEK, "week");
  assert.notEqual(WP.playFor("luna"), "ghost");
  assert.notEqual(WP.playFor("luna"), "dusk");
  assert.notEqual(WP.playFor("luna"), "mount");
  assert.notEqual(WP.playFor("luna"), "weed");
  assert.notEqual(WP.playFor("luna"), "web");
  assert.notEqual(WP.playFor("luna"), "gold");
  assert.notEqual(WP.playFor("luna"), "sill");
  assert.equal(WP.playFor("monarch"), "weed");
  assert.equal(WP.playFor("walleye"), "dusk");
  assert.equal(WP.playFor("orchid"), "mount");
  assert.equal(WP.playFor("orb_weaver"), "web");
  assert.equal(WP.playFor("honeybee"), "waggle");
  assert.equal(WP.playFor("ginkgo"), "gold");
  assert.equal(WP.playFor("ghost_crab"), "sand");
  assert.equal(WP.playFor("firefly"), "sill");
});
''',
    "house luna pin",
)
save(p, text, nl)
print("house tests ok")
