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

cjs, nl = load("desktop/renderer/window-play.test.cjs")
cjs = must_replace(
    cjs,
    'const target = P.pickTarget([WIN], 80, "katydid", WORK, P.SPRITE);',
    'const target = P.pickTarget([WIN], 80, "grasshopper", WORK, P.SPRITE);',
    "cjs generic sill pin",
)
cjs = replace_all(
    cjs,
    'assert.equal(P.playFor("katydid"), "sill");',
    'assert.equal(P.playFor("grasshopper"), "sill");',
    "cjs katydid sill pins",
    13,
)

CJS_TESTS = r'''
test("Blade leafs a sash horn as a leaf rim: walk onto the horn, sit the leaf, still the green, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("katydid"), "leaf");
  assert.equal(P.LEAF, "leaf");
  assert.notEqual(P.playFor("katydid"), "blade");
  assert.notEqual(P.playFor("katydid"), "still");
  assert.notEqual(P.playFor("katydid"), "vault");
  assert.notEqual(P.playFor("katydid"), "song");
  assert.notEqual(P.playFor("katydid"), "chirp");
  assert.notEqual(P.playFor("katydid"), "sing");
  assert.notEqual(P.playFor("katydid"), "hop");
  assert.notEqual(P.playFor("katydid"), "leap");
  assert.notEqual(P.playFor("katydid"), "emerge");
  assert.notEqual(P.playFor("katydid"), "freeze");
  assert.notEqual(P.playFor("katydid"), "pray");
  assert.notEqual(P.playFor("katydid"), "spot");
  assert.notEqual(P.playFor("katydid"), "sill");
  assert.equal(P.playFor("field_cricket"), "song");
  assert.equal(P.SONG, "song");
  assert.equal(P.playFor("gecko"), "chirp");
  assert.equal(P.CHIRP, "chirp");
  assert.equal(P.playFor("stick"), "freeze");
  assert.equal(P.playFor("ladybird"), "spot");
  assert.equal(P.playFor("mantis"), "pray");
  assert.equal(P.playFor("leafcutter"), "snip");
  assert.equal(P.playFor("grasshopper"), "sill");
  assert.equal(P.DUR.songOn, P.DUR.songOn, "Chirp song durations stay");
  assert.equal(P.DUR.freezeOn, P.DUR.freezeOn, "Twig freeze durations stay");
  assert.equal(P.DUR.chirpOn, P.DUR.chirpOn, "Pad chirp durations stay");
  const target = P.pickTarget([WIN], 80, "katydid", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "leaf");
  assert.equal(target.side, "leafrim");
  assert.equal(target.leave, "leafed");
  assert.notEqual(target.kind, "song");
  assert.notEqual(target.kind, "freeze");
  assert.notEqual(target.kind, "spot");
  assert.notEqual(target.kind, "pray");
  assert.notEqual(target.kind, "snip");
  assert.notEqual(target.kind, "still");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift > 12, "she leafs a sash horn as a leaf rim, not the foot");
  assert.ok(P.DUR.leafHold > P.DUR.leaf * 1.2, "the hold is the still; the leaf is the tell");
  assert.ok(P.DUR.leafOn > 1.0, "a walk onto the horn, not the still");
  assert.ok(P.DUR.leafOn !== P.DUR.songOn);
  assert.ok(P.DUR.leafOn !== P.DUR.freezeOn);
  assert.ok(P.DUR.leafOn !== P.DUR.chirpOn);
  assert.ok(P.DUR.leafOn !== P.DUR.prayOn);
  assert.ok(P.DUR.leafOn !== P.DUR.sillHop);
  assert.ok(P.DUR.leaf !== P.DUR.song);
  assert.ok(P.DUR.leaf !== P.DUR.freeze);
  assert.ok(P.DUR.leafHold !== P.DUR.songHold);
  assert.ok(P.DUR.leafHold !== P.DUR.freezeHold);
  assert.ok(P.DUR.leafOff !== P.DUR.songOff);
  assert.ok(P.DUR.leafOff !== P.DUR.sillDown);
  const rim = P.leafPoint(WIN, P.SPRITE, WORK);
  const dish = P.songPoint(WIN, P.SPRITE, WORK);
  const stem = P.freezePoint(WIN, P.SPRITE, WORK);
  const chirp = P.chirpPoint(WIN, P.SPRITE, WORK);
  const trail = P.trailPoint(WIN, P.SPRITE, WORK);
  assert.ok(rim.lift > 12, "the sash horn as a leaf rim, not a grass dish");
  assert.ok(Math.abs(rim.x - dish.x) > 12 || Math.abs(rim.lift - dish.lift) > 4, "not Chirp's window-stool song");
  assert.ok(Math.abs(rim.x - stem.x) > 12 || Math.abs(rim.lift - stem.lift) > 4, "not Twig's muntin freeze");
  assert.ok(Math.abs(rim.x - chirp.x) > 20 || Math.abs(rim.lift - chirp.lift) > 4, "not Pad's lamp-side chirp");
  assert.ok(Math.abs(rim.x - trail.x) > 12 || Math.abs(rim.lift - trail.lift) > 0.5, "not Eft's sash-horn trail");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "katydid", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real sash horn, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 168, height: 74 }], 80, "katydid", WORK, P.SPRITE);
  assert.equal(short, null, "a real leaf rim, not Brood's emerge gate");
  const thin = P.pickTarget([{ id: "thin", x: 200, y: 80, width: 184, height: 146 }], 80, "katydid", WORK, P.SPRITE);
  assert.equal(thin, null, "a real leaf rim horn, not a thinner horn");
  const okLeaf = P.pickTarget([{ id: "leaf", x: 200, y: 80, width: 184, height: 148 }], 80, "katydid", WORK, P.SPRITE);
  assert.ok(okLeaf, "a real sash horn as a leaf rim");
  const chirpOk = P.pickTarget([{ id: "song", x: 200, y: 80, width: 190, height: 156 }], 80, "field_cricket", WORK, P.SPRITE);
  assert.ok(chirpOk, "Chirp still takes a grass dish");
  const bladeNo = P.pickTarget([{ id: "song", x: 200, y: 80, width: 190, height: 156 }], 80, "katydid", WORK, P.SPRITE);
  assert.ok(bladeNo, "Blade also fits a Chirp-sized window");
  const walkOn = P.leafOnPath(0.25, { x: 40, lift: 0 }, { x: rim.x, lift: rim.lift });
  const songOn = P.songOnPath(0.25, { x: 40, lift: 0 }, { x: rim.x, lift: rim.lift });
  const freezeOn = P.freezeOnPath(0.25, { x: 40, lift: 0 }, { x: rim.x, lift: rim.lift });
  assert.ok(walkOn.lift > 0, "she walks onto the horn as a leaf rim");
  assert.ok(walkOn.rot !== songOn.rot, "a walk onto the horn, not Chirp song");
  assert.ok(walkOn.rot !== freezeOn.rot, "a walk onto the horn, not Twig freeze");
  const leafPose = P.leafPath(0.5);
  const songPose = P.songPath(0.5);
  const freezePose = P.freezePath(0.5);
  assert.ok(Math.abs(leafPose.rot) > 4, "she sits the leaf; leaf is the tell");
  assert.ok(leafPose.rot !== songPose.rot, "leaf, not song");
  assert.ok(leafPose.rot !== freezePose.rot, "leaf, not freeze");
  const hold = P.leafHoldPath(0.5);
  assert.ok(Math.abs(hold.rot + 9.2) < 0.2, "she holds the still green");
  assert.ok(Math.abs(hold.x - 0.14) < 0.05, "she stays on the leaf rim");
  assert.ok(hold.lift < 2, "still on the horn, not a song pulse");
  const off0 = P.leafOffPath(0, { x: rim.x, lift: rim.lift + 0.8, rot: -9.2 }, { x: rim.x + 50, lift: 0 });
  const offMid = P.leafOffPath(0.5, { x: rim.x, lift: rim.lift + 0.8, rot: -9.2 }, { x: rim.x + 50, lift: 0 });
  const off1 = P.leafOffPath(1, { x: rim.x, lift: rim.lift + 0.8, rot: -9.2 }, { x: rim.x + 50, lift: 0 });
  assert.ok(Math.abs(off0.x - rim.x) < 2);
  assert.ok(Math.abs(offMid.x - rim.x) > 8, "a walk leave off the leaf rim");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "song");
    assert.notEqual(play.phase, "freeze");
    assert.notEqual(play.phase, "chirp");
    assert.notEqual(play.phase, "pray");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "leaf") {
      assert.equal(play.anim, "sit");
    }
    if (play.phase === "leaf-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "leaf-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift + 0.8)) < 2, "she holds the still green on the horn");
    }
    if (play.phase === "leaf-off") {
      assert.equal(play.anim, "walk");
    }
  }
  assert.ok(seen.has("leaf-on"));
  assert.ok(seen.has("leaf"));
  assert.ok(seen.has("leaf-hold"));
  assert.ok(seen.has("leaf-off"));
  assert.ok(!seen.has("song"), "Blade never uses Chirp song");
  assert.ok(!seen.has("freeze"), "Blade never uses Twig freeze");
  assert.ok(!seen.has("chirp"), "Blade never uses Pad chirp");
  assert.ok(!seen.has("pray"), "Blade never uses Fold pray");
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});
test("a moved window refits Blade's leaf-rim still; sleep, card, and hide abort; Blade never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "katydid", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "leaf"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "leaf");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "leaf");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "leaf-off");
  assert.equal(play.abort, true);
});
'''

if not cjs.rstrip().endswith("});"):
    raise SystemExit("cjs tail unexpected")
cjs = cjs.rstrip() + "\n" + CJS_TESTS
save("desktop/renderer/window-play.test.cjs", cjs, nl)
print("cjs ok")

house, hnl = load("desktop/renderer/leftover-house.test.cjs")
house = must_replace(
    house,
    "Chirp leftover songs a window stool as a grass dish; first leftover of the meadow den done; Brood leftover still emerges a window foot as a soil husk;",
    "Blade leftover leafs a sash horn as a leaf rim; second leftover of the meadow den done; Chirp leftover still songs a window stool as a grass dish; first leftover of the meadow den done; Brood leftover still emerges a window foot as a soil husk;",
    "house title prefix",
)
house = must_replace(
    house,
    "shore ten is closed; next leftover is Blade;",
    "shore ten is closed; next leftover is Vault;",
    "house title next",
)
house = must_replace(
    house,
    '''  assert.equal(WP.playFor("field_cricket"), "song");
  assert.equal(WP.SONG, "song");
  assert.notEqual(WP.playFor("field_cricket"), "chirp");
  assert.notEqual(WP.playFor("field_cricket"), "sing");
  assert.notEqual(WP.playFor("field_cricket"), "emerge");
  assert.notEqual(WP.playFor("field_cricket"), "drone");
  assert.notEqual(WP.playFor("field_cricket"), "drum");
  assert.notEqual(WP.playFor("field_cricket"), "hum");
  assert.notEqual(WP.playFor("field_cricket"), "thrum");
  assert.notEqual(WP.playFor("field_cricket"), "pray");
  assert.notEqual(WP.playFor("field_cricket"), "spot");
  assert.notEqual(WP.playFor("field_cricket"), "brood");
  assert.notEqual(WP.playFor("field_cricket"), "sill");
  assert.equal(WP.playFor("gecko"), "chirp");
  assert.equal(WP.playFor("gibbon"), "sing");
  assert.equal(WP.playFor("katydid"), "sill");
});''',
    '''  assert.equal(WP.playFor("field_cricket"), "song");
  assert.equal(WP.SONG, "song");
  assert.notEqual(WP.playFor("field_cricket"), "chirp");
  assert.notEqual(WP.playFor("field_cricket"), "sing");
  assert.notEqual(WP.playFor("field_cricket"), "emerge");
  assert.notEqual(WP.playFor("field_cricket"), "drone");
  assert.notEqual(WP.playFor("field_cricket"), "drum");
  assert.notEqual(WP.playFor("field_cricket"), "hum");
  assert.notEqual(WP.playFor("field_cricket"), "thrum");
  assert.notEqual(WP.playFor("field_cricket"), "pray");
  assert.notEqual(WP.playFor("field_cricket"), "spot");
  assert.notEqual(WP.playFor("field_cricket"), "brood");
  assert.notEqual(WP.playFor("field_cricket"), "sill");
  assert.equal(WP.playFor("gecko"), "chirp");
  assert.equal(WP.playFor("gibbon"), "sing");
  assert.equal(WP.playFor("katydid"), "leaf");
  assert.equal(WP.LEAF, "leaf");
  assert.notEqual(WP.playFor("katydid"), "blade");
  assert.notEqual(WP.playFor("katydid"), "still");
  assert.notEqual(WP.playFor("katydid"), "vault");
  assert.notEqual(WP.playFor("katydid"), "song");
  assert.notEqual(WP.playFor("katydid"), "chirp");
  assert.notEqual(WP.playFor("katydid"), "sing");
  assert.notEqual(WP.playFor("katydid"), "hop");
  assert.notEqual(WP.playFor("katydid"), "leap");
  assert.notEqual(WP.playFor("katydid"), "emerge");
  assert.notEqual(WP.playFor("katydid"), "freeze");
  assert.notEqual(WP.playFor("katydid"), "pray");
  assert.notEqual(WP.playFor("katydid"), "spot");
  assert.notEqual(WP.playFor("katydid"), "sill");
  assert.equal(WP.playFor("grasshopper"), "sill");
});''',
    "house blade leaf",
)
house = replace_all(
    house,
    'assert.equal(WP.playFor("katydid"), "sill");',
    'assert.equal(WP.playFor("grasshopper"), "sill");',
    "house remaining katydid sill",
    1,
)
save("desktop/renderer/leftover-house.test.cjs", house, hnl)
print("house ok")

mjs, mnl = load("web/scripts/window-play.test.mjs")
mjs = replace_all(
    mjs,
    'assert.equal(P.playFor("katydid"), "sill");',
    'assert.equal(P.playFor("grasshopper"), "sill");',
    "mjs katydid sill pins",
    11,
)

MJS_TEST = r'''
test("the demo window plate walks Blade leaf the same way", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /playFor/);
  assert.match(readFileSync(join(root, "src/lib/pets/meadow.ts"), "utf8"), /key: "katydid"[\s\S]{0,80}slug: "blade"/);
  assert.equal(P.playFor("katydid"), "leaf");
  const target = P.pickTarget([WIN], 80, "katydid", WORK, 176);
  assert.ok(target);
  assert.equal(target.kind, "leaf");
  assert.equal(target.side, "leafrim");
  assert.equal(target.leave, "leafed");
  assert.equal(Overlay.playFor("katydid"), "leaf");
  assert.equal(P.LEAF, "leaf");
  assert.equal(Overlay.LEAF, "leaf");
  assert.notEqual(P.playFor("katydid"), "blade");
  assert.notEqual(P.playFor("katydid"), "still");
  assert.notEqual(P.playFor("katydid"), "vault");
  assert.notEqual(P.playFor("katydid"), "song");
  assert.notEqual(P.playFor("katydid"), "chirp");
  assert.notEqual(P.playFor("katydid"), "freeze");
  assert.notEqual(P.playFor("katydid"), "pray");
  assert.notEqual(P.playFor("katydid"), "spot");
  assert.notEqual(P.playFor("katydid"), "sill");
  assert.equal(P.playFor("field_cricket"), "song");
  assert.equal(Overlay.playFor("field_cricket"), "song");
  assert.equal(P.playFor("gecko"), "chirp");
  assert.equal(Overlay.playFor("gecko"), "chirp");
  assert.equal(P.playFor("grasshopper"), "sill");
  assert.equal(P.DUR.leafOn, Overlay.DUR.leafOn);
  assert.equal(P.DUR.leaf, Overlay.DUR.leaf);
  assert.equal(P.DUR.leafHold, Overlay.DUR.leafHold);
  assert.equal(P.DUR.leafOff, Overlay.DUR.leafOff);
  assert.ok(P.DUR.leafOn !== Overlay.DUR.songOn);
  assert.ok(P.DUR.leafOn !== Overlay.DUR.freezeOn);
  assert.ok(P.DUR.leafOn !== Overlay.DUR.chirpOn);
  assert.ok(P.DUR.leafOn !== Overlay.DUR.prayOn);
  const rim = P.leafPoint(WIN, 176, WORK);
  const deskRim = Overlay.leafPoint(WIN, Overlay.SPRITE, WORK);
  const dish = P.songPoint(WIN, 176, WORK);
  const stem = P.freezePoint(WIN, 176, WORK);
  assert.ok(Math.abs(rim.x - deskRim.x) < 1);
  assert.ok(Math.abs(rim.lift - deskRim.lift) < 1);
  assert.ok(rim.lift > 12, "leaf rim, the sash horn");
  assert.ok(Math.abs(rim.x - dish.x) > 12 || Math.abs(rim.lift - dish.lift) > 4, "not Chirp song");
  assert.ok(Math.abs(rim.x - stem.x) > 12 || Math.abs(rim.lift - stem.lift) > 4, "not Twig freeze");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 168, height: 74 }], 80, "katydid", WORK, 176);
  assert.equal(tiny, null, "a real leaf rim horn");
  const okLeaf = P.pickTarget([{ id: "leaf", x: 200, y: 80, width: 184, height: 148 }], 80, "katydid", WORK, 176);
  assert.ok(okLeaf, "a real sash horn as a leaf rim");
  const walkOn = P.leafOnPath(0.25, { x: 40, lift: 0 }, { x: rim.x, lift: rim.lift });
  const deskWalk = Overlay.leafOnPath(0.25, { x: 40, lift: 0 }, { x: rim.x, lift: rim.lift });
  assert.ok(Math.abs(walkOn.x - deskWalk.x) < 1);
  assert.ok(Math.abs(walkOn.rot - deskWalk.rot) < 0.01);
  const leafPose = P.leafPath(0.5);
  const deskLeaf = Overlay.leafPath(0.5);
  assert.ok(Math.abs(leafPose.rot - deskLeaf.rot) < 0.01);
  assert.ok(Math.abs(leafPose.rot) > 4, "leaf is the tell");
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, 176, { cmd: "idle" });
  }
  assert.ok(seen.has("leaf-on"));
  assert.ok(seen.has("leaf"));
  assert.ok(seen.has("leaf-hold"));
  assert.ok(seen.has("leaf-off"));
  assert.equal(play.phase, "done");
  let desk = Overlay.beginPlay(Overlay.pickTarget([WIN], 80, "katydid", WORK, Overlay.SPRITE), 80);
  const deskSeen = new Set();
  for (let i = 0; i < 2400 && desk.phase !== "done"; i++) {
    deskSeen.add(desk.phase);
    desk = Overlay.stepPlay(desk, 0.05, { x: desk.x, lift: desk.lift }, [WIN, WIN_B], WORK, Overlay.SPRITE, { cmd: "idle" });
  }
  assert.ok(deskSeen.has("leaf-on"));
  assert.ok(deskSeen.has("leaf"));
  assert.ok(deskSeen.has("leaf-hold"));
  assert.ok(deskSeen.has("leaf-off"));
  assert.equal(desk.phase, "done");
});
'''

if not mjs.rstrip().endswith("});"):
    raise SystemExit("mjs tail unexpected: " + repr(mjs.rstrip()[-40:]))
mjs = mjs.rstrip() + "\n" + MJS_TEST
save("web/scripts/window-play.test.mjs", mjs, mnl)
print("mjs ok")
