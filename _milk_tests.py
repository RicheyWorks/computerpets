# Milk leftover tests — do not commit
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
        raise SystemExit("%s: expected 1, got %d for %r" % (label, n, old[:160]))
    return text.replace(old, new, 1)

CJS = r'''
test("Milk weeds a window-box as a milkweed cup: walk onto the box, sit the weed, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("monarch"), "weed");
  assert.equal(P.WEED, "weed");
  assert.notEqual(P.playFor("monarch"), "milk");
  assert.notEqual(P.playFor("monarch"), "gold");
  assert.notEqual(P.playFor("monarch"), "snip");
  assert.notEqual(P.playFor("monarch"), "sip");
  assert.notEqual(P.playFor("monarch"), "wrap");
  assert.notEqual(P.playFor("monarch"), "waggle");
  assert.notEqual(P.playFor("monarch"), "forage");
  assert.notEqual(P.playFor("monarch"), "sill");
  assert.equal(P.playFor("honeybee"), "waggle");
  assert.equal(P.WAGGLE, "waggle");
  assert.equal(P.playFor("hummingbird"), "sip");
  assert.equal(P.SIP, "sip");
  assert.equal(P.playFor("kinkajou"), "wrap");
  assert.equal(P.WRAP, "wrap");
  assert.equal(P.playFor("leafcutter"), "snip");
  assert.equal(P.SNIP, "snip");
  assert.equal(P.playFor("ginkgo"), "gold");
  assert.equal(P.GOLD, "gold");
  assert.equal(P.playFor("honey_drone"), "drone");
  assert.equal(P.DRONE, "drone");
  assert.equal(P.playFor("honey_queen"), "lay");
  assert.equal(P.LAY, "lay");
  assert.equal(P.playFor("honeycomb"), "draw");
  assert.equal(P.DRAW, "draw");
  assert.equal(P.playFor("lugworm"), "castings");
  assert.equal(P.CASTINGS, "castings");
  assert.equal(P.playFor("bumblebee"), "forage");
  assert.equal(P.playFor("luna"), "sill");
  assert.equal(P.DUR.waggleOn, 3.15, "Comb waggle durations stay");
  assert.equal(P.DUR.castingsOn, 3.08, "Heap castings durations stay");
  const target = P.pickTarget([WIN], 80, "monarch", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "weed");
  assert.equal(target.side, "milkweedcup");
  assert.equal(target.leave, "weeded");
  assert.notEqual(target.kind, "milk");
  assert.notEqual(target.kind, "gold");
  assert.notEqual(target.kind, "snip");
  assert.notEqual(target.kind, "sip");
  assert.notEqual(target.kind, "wrap");
  assert.notEqual(target.kind, "waggle");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift > 8, "she weeds a window-box as a milkweed cup, not the floor");
  assert.ok(P.DUR.weedHold > P.DUR.weed, "the hold is the sit after; the weed is the tell");
  assert.ok(P.DUR.weedOn > 1.0, "a walk onto the box, not the weed");
  assert.ok(P.DUR.weedOn !== P.DUR.waggleOn);
  assert.ok(P.DUR.weedOn !== P.DUR.sipOn);
  assert.ok(P.DUR.weedOn !== P.DUR.wrapOn);
  assert.ok(P.DUR.weedOn !== P.DUR.snipOn);
  assert.ok(P.DUR.weedOn !== P.DUR.forageOn);
  assert.ok(P.DUR.weedOn !== P.DUR.goldOn);
  assert.ok(P.DUR.weedOn !== P.DUR.sillHop);
  assert.ok(P.DUR.weed !== P.DUR.waggle);
  assert.ok(P.DUR.weed !== P.DUR.sip);
  assert.ok(P.DUR.weedHold !== P.DUR.waggleHold);
  assert.ok(P.DUR.weedHold !== P.DUR.wrapHold);
  assert.ok(P.DUR.weedOff !== P.DUR.waggleOff);
  assert.ok(P.DUR.weedOff !== P.DUR.sipOff);
  assert.ok(P.DUR.weedOff !== P.DUR.sillDown);
  const cup = P.weedPoint(WIN, P.SPRITE, WORK);
  const nectar = P.sipPoint(WIN, P.SPRITE, WORK);
  const bloom = P.wrapPoint(WIN, P.SPRITE, WORK);
  const foliage = P.snipPoint(WIN, P.SPRITE, WORK);
  const meadow = P.foragePoint(WIN, P.SPRITE, WORK);
  const dish = P.wagglePoint(WIN, P.SPRITE, WORK);
  const autumn = P.goldPoint(WIN, P.SPRITE, WORK);
  const edge = P.mouthPoint(WIN, P.SPRITE, WORK);
  const reed = P.billPoint(WIN, P.SPRITE, WORK);
  assert.ok(cup.lift > 8, "the window-box as a milkweed cup, not the floor");
  assert.ok(Math.abs(cup.lift - bloom.lift) < 8, "same window-box furniture family as Wrist");
  assert.ok(Math.abs(cup.x - bloom.x) > 20, "same window-box, not Wrist wrap spot");
  assert.ok(Math.abs(cup.lift - nectar.lift) > 8, "same window-box family, not Sip hover sip");
  assert.ok(Math.abs(cup.x - nectar.x) > 8, "same window-box, not Sip sip spot");
  assert.ok(Math.abs(cup.x - foliage.x) > 20 || Math.abs(cup.lift - foliage.lift) > 8, "not Disc window-box snip");
  assert.ok(Math.abs(cup.x - meadow.x) > 20, "same window-box, not Thrum forage spot");
  assert.ok(Math.abs(cup.x - dish.x) > 8 || Math.abs(cup.lift - dish.lift) > 8, "not Comb sill-pan waggle");
  assert.ok(Math.abs(cup.x - autumn.x) > 8 || Math.abs(cup.lift - autumn.lift) > 8, "not Fan lamp-side gold");
  assert.ok(Math.abs(cup.x - edge.x) > 20, "same window-box, not Lunge weed-edge mouth");
  assert.ok(Math.abs(cup.x - reed.x) > 20, "same window-box, not Lance reed ambush");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "monarch", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real window-box, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 180, height: 80 }], 80, "monarch", WORK, P.SPRITE);
  assert.equal(short, null, "a real window-box, not a short sash");
  const thin = P.pickTarget([{ id: "thin", x: 200, y: 80, width: 193, height: 160 }], 80, "monarch", WORK, P.SPRITE);
  assert.equal(thin, null, "a real window-box, not a thinner box");
  const box = P.pickTarget([{ id: "box", x: 200, y: 80, width: 193, height: 169 }], 80, "monarch", WORK, P.SPRITE);
  assert.ok(box, "a real window-box as a milkweed cup");
  const sipOk = P.pickTarget([{ id: "box", x: 200, y: 80, width: 193, height: 169 }], 80, "hummingbird", WORK, P.SPRITE);
  assert.ok(sipOk, "Sip still takes the window-box");
  const wrapOk = P.pickTarget([{ id: "box", x: 200, y: 80, width: 193, height: 169 }], 80, "kinkajou", WORK, P.SPRITE);
  assert.ok(wrapOk, "Wrist still takes the window-box");
  const combPan = P.pickTarget([{ id: "pan", x: 200, y: 80, width: 190, height: 184 }], 80, "honeybee", WORK, P.SPRITE);
  assert.ok(combPan, "Comb still takes the sill pan");
  const walkOn = P.weedOnPath(0.25, { x: 40, lift: 0 }, { x: cup.x, lift: cup.lift });
  const sipOn = P.sipOnPath(0.25, { x: 40, lift: 0 }, { x: cup.x, lift: cup.lift });
  const wrapOn = P.wrapOnPath(0.25, { x: 40, lift: 0 }, { x: cup.x, lift: cup.lift });
  const snipOn = P.snipOnPath(0.25, { x: 40, lift: 0 }, { x: cup.x, lift: cup.lift });
  const forageOn = P.forageOnPath(0.25, { x: 40, lift: 0 }, { x: cup.x, lift: cup.lift });
  const waggleOn = P.waggleOnPath(0.25, { x: 40, lift: 0 }, { x: cup.x, lift: cup.lift });
  assert.ok(walkOn.lift > 0, "she walks onto the box as a milkweed cup");
  assert.ok(walkOn.rot !== sipOn.rot, "a walk onto the box, not Sip sip");
  assert.ok(walkOn.rot !== wrapOn.rot, "a walk onto the box, not Wrist wrap");
  assert.ok(walkOn.rot !== snipOn.rot, "a walk onto the box, not Disc snip");
  assert.ok(walkOn.rot !== forageOn.rot, "a walk onto the box, not Thrum forage");
  assert.ok(walkOn.rot !== waggleOn.rot, "a walk onto the box, not Comb waggle");
  const milkPose = P.weedPath(0.5);
  const sipPose = P.sipPath(0.5);
  const wrapPose = P.wrapPath(0.5);
  const snipPose = P.snipPath(0.5);
  const foragePose = P.foragePath(0.5);
  const wagglePose = P.wagglePath(0.5);
  const goldPose = P.goldPath(0.5);
  const mouthPose = P.mouthPath(0.5);
  assert.ok(milkPose.lift > 1, "she sits the weed; a lift, then the blotter again");
  assert.ok(milkPose.rot !== sipPose.rot, "weed, not a sip");
  assert.ok(milkPose.rot !== wrapPose.rot, "weed, not a wrap");
  assert.ok(milkPose.rot !== snipPose.rot, "weed, not a snip");
  assert.ok(milkPose.rot !== foragePose.rot, "weed, not a forage");
  assert.ok(milkPose.rot !== wagglePose.rot, "weed, not a waggle");
  assert.ok(milkPose.rot !== goldPose.rot, "weed, not gold");
  assert.ok(milkPose.rot !== mouthPose.rot, "weed, not a mouth");
  const hold = P.weedHoldPath(0.5);
  assert.ok(Math.abs(hold.rot - 6.6) < 0.2, "she holds after the weed, weed still the tell");
  assert.ok(Math.abs(hold.x - 0.4) < 0.2, "she stays on the milkweed cup");
  assert.ok(hold.lift > 1, "a sit-hold on the box after the weed");
  const off0 = P.weedOffPath(0, { x: cup.x, lift: cup.lift, rot: 6.6 }, { x: cup.x + 50, lift: 0 });
  const offMid = P.weedOffPath(0.5, { x: cup.x, lift: cup.lift, rot: 6.6 }, { x: cup.x + 50, lift: 0 });
  const off1 = P.weedOffPath(1, { x: cup.x, lift: cup.lift, rot: 6.6 }, { x: cup.x + 50, lift: 0 });
  assert.ok(Math.abs(off0.x - cup.x) < 2);
  assert.ok(Math.abs(offMid.x - cup.x) > 8, "a walk leave off the milkweed cup");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "waggle");
    assert.notEqual(play.phase, "sip");
    assert.notEqual(play.phase, "wrap");
    assert.notEqual(play.phase, "snip");
    assert.notEqual(play.phase, "forage");
    assert.notEqual(play.phase, "gold");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "weed") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "weed-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "weed-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift + 1.8)) < 3, "she holds the weed after the sit on the cup");
    }
    if (play.phase === "weed-off") {
      assert.equal(play.anim, "walk");
    }
  }
  assert.ok(seen.has("weed-on"));
  assert.ok(seen.has("weed"));
  assert.ok(seen.has("weed-hold"));
  assert.ok(seen.has("weed-off"));
  assert.ok(!seen.has("waggle"), "Milk never uses Comb waggle");
  assert.ok(!seen.has("sip"), "Milk never uses Sip sip");
  assert.ok(!seen.has("wrap"), "Milk never uses Wrist wrap");
  assert.ok(!seen.has("snip"), "Milk never uses Disc snip");
  assert.ok(!seen.has("forage"), "Milk never uses Thrum forage");
  assert.ok(!seen.has("gold"), "Milk never uses Fan gold");
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});
test("a moved window refits Milk's milkweed-cup weed; sleep, card, and hide abort; Milk never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "monarch", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "weed"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "weed");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "weed");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "weed-off");
  assert.equal(play.abort, true);
});
'''

MJS = r'''
test("the demo window plate walks Milk weed the same way", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /playFor/);
  assert.match(readFileSync(join(root, "src/lib/pets/insects.ts"), "utf8"), /key: "monarch"[\s\S]{0,80}slug: "milk"/);
  assert.equal(P.playFor("monarch"), "weed");
  const target = P.pickTarget([WIN], 80, "monarch", WORK, 176);
  assert.ok(target);
  assert.equal(target.kind, "weed");
  assert.equal(target.side, "milkweedcup");
  assert.equal(target.leave, "weeded");
  assert.equal(Overlay.playFor("monarch"), "weed");
  assert.equal(P.WEED, "weed");
  assert.equal(Overlay.WEED, "weed");
  assert.notEqual(P.playFor("monarch"), "milk");
  assert.notEqual(P.playFor("monarch"), "gold");
  assert.notEqual(P.playFor("monarch"), "snip");
  assert.notEqual(P.playFor("monarch"), "sip");
  assert.notEqual(P.playFor("monarch"), "wrap");
  assert.notEqual(P.playFor("monarch"), "waggle");
  assert.equal(P.playFor("honeybee"), "waggle");
  assert.equal(Overlay.playFor("honeybee"), "waggle");
  assert.equal(P.playFor("hummingbird"), "sip");
  assert.equal(Overlay.playFor("hummingbird"), "sip");
  assert.equal(P.playFor("kinkajou"), "wrap");
  assert.equal(Overlay.playFor("kinkajou"), "wrap");
  assert.equal(P.playFor("leafcutter"), "snip");
  assert.equal(Overlay.playFor("leafcutter"), "snip");
  assert.equal(P.playFor("ginkgo"), "gold");
  assert.equal(Overlay.playFor("ginkgo"), "gold");
  assert.equal(P.playFor("honey_drone"), "drone");
  assert.equal(P.playFor("honey_queen"), "lay");
  assert.equal(P.playFor("honeycomb"), "draw");
  assert.equal(P.playFor("lugworm"), "castings");
  assert.equal(P.playFor("luna"), "sill");
  assert.equal(P.DUR.weedOn, Overlay.DUR.weedOn);
  assert.equal(P.DUR.weed, Overlay.DUR.weed);
  assert.equal(P.DUR.weedHold, Overlay.DUR.weedHold);
  assert.equal(P.DUR.weedOff, Overlay.DUR.weedOff);
  assert.ok(P.DUR.weedOn !== Overlay.DUR.waggleOn);
  assert.ok(P.DUR.weedOn !== Overlay.DUR.sipOn);
  assert.ok(P.DUR.weedOn !== Overlay.DUR.wrapOn);
  const cup = P.weedPoint(WIN, 176, WORK);
  const deskCup = Overlay.weedPoint(WIN, Overlay.SPRITE, WORK);
  const nectar = P.sipPoint(WIN, 176, WORK);
  const bloom = P.wrapPoint(WIN, 176, WORK);
  const dish = P.wagglePoint(WIN, 176, WORK);
  assert.ok(Math.abs(cup.x - deskCup.x) < 1);
  assert.ok(Math.abs(cup.lift - deskCup.lift) < 1);
  assert.ok(cup.lift > 8, "milkweed cup, the box");
  assert.ok(Math.abs(cup.x - nectar.x) > 8, "not Sip sip");
  assert.ok(Math.abs(cup.x - bloom.x) > 8, "not Wrist wrap");
  assert.ok(Math.abs(cup.lift - dish.lift) > 8, "not Comb waggle");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 160, height: 70 }], 80, "monarch", WORK, 176);
  assert.equal(tiny, null, "a real window-box");
  const okBox = P.pickTarget([{ id: "box", x: 200, y: 80, width: 193, height: 169 }], 80, "monarch", WORK, 176);
  assert.ok(okBox, "a real window-box as a milkweed cup");
  const walkOn = P.weedOnPath(0.25, { x: 40, lift: 0 }, { x: cup.x, lift: cup.lift });
  const deskWalk = Overlay.weedOnPath(0.25, { x: 40, lift: 0 }, { x: cup.x, lift: cup.lift });
  assert.equal(walkOn.x, deskWalk.x);
  assert.equal(walkOn.lift, deskWalk.lift);
  const pulse = P.weedPath(0.5);
  const deskPulse = Overlay.weedPath(0.5);
  assert.equal(pulse.x, deskPulse.x);
  assert.ok(pulse.lift > 1, "sit the weed, the play");
  assert.ok(pulse.rot !== P.sipPath(0.5).rot, "weed, not a sip");
  assert.ok(pulse.rot !== P.wrapPath(0.5).rot, "weed, not a wrap");
  assert.ok(pulse.rot !== P.snipPath(0.5).rot, "weed, not a snip");
  assert.ok(pulse.rot !== P.wagglePath(0.5).rot, "weed, not a waggle");
  assert.ok(pulse.rot !== P.goldPath(0.5).rot, "weed, not gold");
  const hold = P.weedHoldPath(0.5);
  const deskHold = Overlay.weedHoldPath(0.5);
  assert.equal(hold.x, deskHold.x);
  assert.equal(hold.lift, deskHold.lift);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, 176, { cmd: "idle" });
    if (play.phase === "weed") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "weed-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "weed-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift + 1.8)) < 3, "she holds the weed after the sit on the cup");
    }
  }
  assert.ok(seen.has("weed-on"));
  assert.ok(seen.has("weed"));
  assert.ok(seen.has("weed-hold"));
  assert.ok(seen.has("weed-off"));
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
});
'''

# cjs append + pin moves
p = ROOT / "desktop" / "renderer" / "window-play.test.cjs"
text, nl = load(p)
if "Milk weeds a window-box as a milkweed cup" in text:
    raise SystemExit("cjs already has Milk tests")
text = once(
    text,
    'const target = P.pickTarget([WIN], 80, "monarch", WORK, P.SPRITE);',
    'const target = P.pickTarget([WIN], 80, "luna", WORK, P.SPRITE);',
    "cjs generic sill guest",
)
text = once(
    text,
    '  assert.equal(P.playFor("monarch"), "sill");',
    '  assert.equal(P.playFor("luna"), "sill");',
    "cjs Comb monarch pin",
)
text = text.rstrip() + "\n" + CJS
save(p, text, nl)
print("cjs tests ok")

# mjs append + pin
p = ROOT / "web" / "scripts" / "window-play.test.mjs"
text, nl = load(p)
if "Milk weed the same way" in text:
    raise SystemExit("mjs already has Milk tests")
text = once(
    text,
    '  assert.equal(P.playFor("monarch"), "sill");',
    '  assert.equal(P.playFor("luna"), "sill");',
    "mjs Comb monarch pin",
)
text = text.rstrip() + "\n" + MJS
save(p, text, nl)
print("mjs tests ok")

# leftover-house
p = ROOT / "desktop" / "renderer" / "leftover-house.test.cjs"
text, nl = load(p)
text = once(
    text,
    'test("Comb leftover waggles a sill pan as a wax dish; first leftover of the remaining hive den done; shore ten is closed; next leftover is Milk; ',
    'test("Milk leftover weeds a window-box as a milkweed cup; second leftover of the remaining hive den done; shore ten is closed; next leftover is Ghost; Comb leftover still waggles a sill pan as a wax dish; first leftover of the remaining hive den done; ',
    "house title",
)
text = once(
    text,
    '''  assert.equal(WP.playFor("honeybee"), "waggle");
  assert.equal(WP.WAGGLE, "waggle");
  assert.notEqual(WP.playFor("honeybee"), "comb");
  assert.notEqual(WP.playFor("honeybee"), "drone");
  assert.notEqual(WP.playFor("honeybee"), "lay");
  assert.notEqual(WP.playFor("honeybee"), "draw");
  assert.notEqual(WP.playFor("honeybee"), "sip");
  assert.notEqual(WP.playFor("honeybee"), "sill");
  assert.equal(WP.playFor("lugworm"), "castings");
  assert.equal(WP.playFor("honey_drone"), "drone");
  assert.equal(WP.playFor("honey_queen"), "lay");
  assert.equal(WP.playFor("honeycomb"), "draw");
  assert.equal(WP.playFor("hummingbird"), "sip");
  assert.equal(WP.playFor("fiddler_crab"), "signal");
  assert.equal(WP.playFor("sand_dollar"), "flat");
  assert.equal(WP.playFor("monarch"), "sill");
});
''',
    '''  assert.equal(WP.playFor("honeybee"), "waggle");
  assert.equal(WP.WAGGLE, "waggle");
  assert.notEqual(WP.playFor("honeybee"), "comb");
  assert.notEqual(WP.playFor("honeybee"), "drone");
  assert.notEqual(WP.playFor("honeybee"), "lay");
  assert.notEqual(WP.playFor("honeybee"), "draw");
  assert.notEqual(WP.playFor("honeybee"), "sip");
  assert.notEqual(WP.playFor("honeybee"), "sill");
  assert.equal(WP.playFor("lugworm"), "castings");
  assert.equal(WP.playFor("honey_drone"), "drone");
  assert.equal(WP.playFor("honey_queen"), "lay");
  assert.equal(WP.playFor("honeycomb"), "draw");
  assert.equal(WP.playFor("hummingbird"), "sip");
  assert.equal(WP.playFor("fiddler_crab"), "signal");
  assert.equal(WP.playFor("sand_dollar"), "flat");
  assert.equal(WP.playFor("monarch"), "weed");
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
    "house monarch pin",
)
save(p, text, nl)
print("house tests ok")
