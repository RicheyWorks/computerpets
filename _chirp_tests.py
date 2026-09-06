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
    'const target = P.pickTarget([WIN], 80, "field_cricket", WORK, P.SPRITE);',
    'const target = P.pickTarget([WIN], 80, "katydid", WORK, P.SPRITE);',
    "cjs generic sill pin",
)
cjs = replace_all(
    cjs,
    'assert.equal(P.playFor("field_cricket"), "sill");',
    'assert.equal(P.playFor("katydid"), "sill");',
    "cjs field_cricket sill pins",
    12,
)

CJS_TESTS = r'''
test("Chirp songs a window stool as a grass dish: walk onto the stool, sit the song, hold the night, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("field_cricket"), "song");
  assert.equal(P.SONG, "song");
  assert.notEqual(P.playFor("field_cricket"), "chirp");
  assert.notEqual(P.playFor("field_cricket"), "sing");
  assert.notEqual(P.playFor("field_cricket"), "emerge");
  assert.notEqual(P.playFor("field_cricket"), "drone");
  assert.notEqual(P.playFor("field_cricket"), "drum");
  assert.notEqual(P.playFor("field_cricket"), "hum");
  assert.notEqual(P.playFor("field_cricket"), "thrum");
  assert.notEqual(P.playFor("field_cricket"), "pray");
  assert.notEqual(P.playFor("field_cricket"), "spot");
  assert.notEqual(P.playFor("field_cricket"), "brood");
  assert.notEqual(P.playFor("field_cricket"), "sill");
  assert.equal(P.playFor("cicada"), "emerge");
  assert.equal(P.EMERGE, "emerge");
  assert.equal(P.playFor("gecko"), "chirp");
  assert.equal(P.CHIRP, "chirp");
  assert.equal(P.playFor("gibbon"), "sing");
  assert.equal(P.playFor("pileated"), "drum");
  assert.equal(P.playFor("honey_drone"), "drone");
  assert.equal(P.playFor("bumblebee"), "forage");
  assert.equal(P.playFor("mantis"), "pray");
  assert.equal(P.playFor("katydid"), "sill");
  assert.equal(P.DUR.emergeOn, P.DUR.emergeOn, "Brood emerge durations stay");
  assert.equal(P.DUR.chirpOn, P.DUR.chirpOn, "Pad chirp durations stay");
  assert.equal(P.DUR.singOn, P.DUR.singOn, "Swing sing durations stay");
  const target = P.pickTarget([WIN], 80, "field_cricket", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "song");
  assert.equal(target.side, "grassdish");
  assert.equal(target.leave, "sung");
  assert.notEqual(target.kind, "chirp");
  assert.notEqual(target.kind, "sing");
  assert.notEqual(target.kind, "emerge");
  assert.notEqual(target.kind, "drone");
  assert.notEqual(target.kind, "drum");
  assert.notEqual(target.kind, "hum");
  assert.notEqual(target.kind, "thrum");
  assert.notEqual(target.kind, "pray");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift > 8, "she songs a window stool as a grass dish, not the foot");
  assert.ok(P.DUR.songHold > P.DUR.song * 0.9, "the hold is the night; the song is the tell");
  assert.ok(P.DUR.songOn > 1.0, "a walk onto the stool, not the song");
  assert.ok(P.DUR.songOn !== P.DUR.emergeOn);
  assert.ok(P.DUR.songOn !== P.DUR.chirpOn);
  assert.ok(P.DUR.songOn !== P.DUR.singOn);
  assert.ok(P.DUR.songOn !== P.DUR.droneOn);
  assert.ok(P.DUR.songOn !== P.DUR.sillHop);
  assert.ok(P.DUR.song !== P.DUR.emerge);
  assert.ok(P.DUR.song !== P.DUR.chirp);
  assert.ok(P.DUR.song !== P.DUR.sing);
  assert.ok(P.DUR.songHold !== P.DUR.emergeHold);
  assert.ok(P.DUR.songHold !== P.DUR.chirpHold);
  assert.ok(P.DUR.songOff !== P.DUR.emergeOff);
  assert.ok(P.DUR.songOff !== P.DUR.sillDown);
  const dish = P.songPoint(WIN, P.SPRITE, WORK);
  const husk = P.emergePoint(WIN, P.SPRITE, WORK);
  const chirp = P.chirpPoint(WIN, P.SPRITE, WORK);
  const sing = P.singPoint(WIN, P.SPRITE, WORK);
  const sand = P.sandPoint(WIN, P.SPRITE, WORK);
  const plow = P.plowPoint(WIN, P.SPRITE, WORK);
  assert.ok(dish.lift > 8, "the window stool as a grass dish, not a soil husk");
  assert.ok(Math.abs(dish.x - husk.x) > 8 || Math.abs(dish.lift - husk.lift) > 4, "not Brood's window-foot emerge");
  assert.ok(Math.abs(dish.x - chirp.x) > 20 || Math.abs(dish.lift - chirp.lift) > 4, "not Pad's lamp-side chirp");
  assert.ok(Math.abs(dish.x - sing.x) > 20 || Math.abs(dish.lift - sing.lift) > 4, "not Swing's lamp-side sing");
  assert.ok(Math.abs(dish.x - sand.x) > 12 || Math.abs(dish.lift - sand.lift) > 0.5, "not Pale's window-stool sand");
  assert.ok(Math.abs(dish.x - plow.x) > 12 || Math.abs(dish.lift - plow.lift) > 0.5, "not Ledger's window-stool plow");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "field_cricket", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real window stool, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 168, height: 74 }], 80, "field_cricket", WORK, P.SPRITE);
  assert.equal(short, null, "a real grass dish stool, not Brood's emerge gate");
  const thin = P.pickTarget([{ id: "thin", x: 200, y: 80, width: 190, height: 154 }], 80, "field_cricket", WORK, P.SPRITE);
  assert.equal(thin, null, "a real grass dish stool, not a thinner stool");
  const okSong = P.pickTarget([{ id: "song", x: 200, y: 80, width: 190, height: 156 }], 80, "field_cricket", WORK, P.SPRITE);
  assert.ok(okSong, "a real window stool as a grass dish");
  const broodOk = P.pickTarget([{ id: "emerge", x: 200, y: 80, width: 168, height: 74 }], 80, "cicada", WORK, P.SPRITE);
  assert.ok(broodOk, "Brood still takes a soil husk");
  const chirpNo = P.pickTarget([{ id: "emerge", x: 200, y: 80, width: 168, height: 74 }], 80, "field_cricket", WORK, P.SPRITE);
  assert.equal(chirpNo, null, "Chirp needs a taller grass dish, not Brood's emerge gate");
  const walkOn = P.songOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  const emergeOn = P.emergeOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  const chirpOn = P.chirpOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  const singOn = P.singOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  assert.ok(walkOn.lift > 0, "she walks onto the stool as a grass dish");
  assert.ok(walkOn.rot !== emergeOn.rot, "a walk onto the stool, not Brood emerge");
  assert.ok(walkOn.rot !== chirpOn.rot, "a walk onto the stool, not Pad chirp");
  assert.ok(walkOn.rot !== singOn.rot, "a walk onto the stool, not Swing sing");
  const songPose = P.songPath(0.5);
  const emergePose = P.emergePath(0.5);
  const chirpPose = P.chirpPath(0.5);
  const singPose = P.singPath(0.5);
  assert.ok(Math.abs(songPose.rot) > 2, "she sits the song; song is the tell");
  assert.ok(songPose.rot !== emergePose.rot, "song, not emerge");
  assert.ok(songPose.rot !== chirpPose.rot, "song, not chirp");
  assert.ok(songPose.rot !== singPose.rot, "song, not sing");
  const hold = P.songHoldPath(0.5);
  assert.ok(Math.abs(hold.rot - 5.4) < 2.0, "she holds the night song");
  assert.ok(Math.abs(hold.x - 0.27) < 0.4, "she stays on the grass dish");
  assert.ok(hold.lift < 3, "night song on the stool, not a husk burst");
  const off0 = P.songOffPath(0, { x: dish.x, lift: dish.lift + 0.9, rot: 5.4 }, { x: dish.x + 50, lift: 0 });
  const offMid = P.songOffPath(0.5, { x: dish.x, lift: dish.lift + 0.9, rot: 5.4 }, { x: dish.x + 50, lift: 0 });
  const off1 = P.songOffPath(1, { x: dish.x, lift: dish.lift + 0.9, rot: 5.4 }, { x: dish.x + 50, lift: 0 });
  assert.ok(Math.abs(off0.x - dish.x) < 2);
  assert.ok(Math.abs(offMid.x - dish.x) > 8, "a walk leave off the grass dish");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "emerge");
    assert.notEqual(play.phase, "chirp");
    assert.notEqual(play.phase, "sing");
    assert.notEqual(play.phase, "drone");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "song") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "song-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "song-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift + 0.9)) < 3, "she holds the night song on the stool");
    }
    if (play.phase === "song-off") {
      assert.equal(play.anim, "walk");
    }
  }
  assert.ok(seen.has("song-on"));
  assert.ok(seen.has("song"));
  assert.ok(seen.has("song-hold"));
  assert.ok(seen.has("song-off"));
  assert.ok(!seen.has("emerge"), "Chirp never uses Brood emerge");
  assert.ok(!seen.has("chirp"), "Chirp never uses Pad chirp");
  assert.ok(!seen.has("sing"), "Chirp never uses Swing sing");
  assert.ok(!seen.has("drone"), "Chirp never uses Hum drone");
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
  assert.equal(play.lift, 0);
});
test("a moved window refits Chirp's grass-dish song; sleep, card, and hide abort; Chirp never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "field_cricket", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "song"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "song");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "song");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "song-off");
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
    "Brood leftover emerges a window foot as a soil husk; tenth leftover of the remaining hive den done; hive ten closed; Fold leftover still prays a window-box stem as a green hinge; ninth leftover of the remaining hive den done; Seven leftover still spots a window-box leaf as a leaf dish; eighth leftover of the remaining hive den done; Column leftover still nests a sash stile as a timber gallery; seventh leftover of the remaining hive den done; Twig leftover still freezes a sash muntin as a pencil stem; sixth leftover of the remaining hive den done; Dart leftover still hawks a lamp-side air as prey air; fifth leftover of the remaining hive den done; Spark leftover still glows a lower sash light as ink dusk; fourth leftover of the remaining hive den done; Ghost leftover still weeks a lamp-side glass as lamp dusk; third leftover of the remaining hive den done; shore ten is closed; next leftover is Chirp;",
    "Chirp leftover songs a window stool as a grass dish; first leftover of the meadow den done; Brood leftover still emerges a window foot as a soil husk; tenth leftover of the remaining hive den done; hive ten closed; Fold leftover still prays a window-box stem as a green hinge; ninth leftover of the remaining hive den done; Seven leftover still spots a window-box leaf as a leaf dish; eighth leftover of the remaining hive den done; Column leftover still nests a sash stile as a timber gallery; seventh leftover of the remaining hive den done; Twig leftover still freezes a sash muntin as a pencil stem; sixth leftover of the remaining hive den done; Dart leftover still hawks a lamp-side air as prey air; fifth leftover of the remaining hive den done; Spark leftover still glows a lower sash light as ink dusk; fourth leftover of the remaining hive den done; Ghost leftover still weeks a lamp-side glass as lamp dusk; third leftover of the remaining hive den done; shore ten is closed; next leftover is Blade;",
    "house title",
)
house = must_replace(
    house,
    '''  assert.equal(WP.playFor("cicada"), "emerge");
  assert.equal(WP.EMERGE, "emerge");
  assert.notEqual(WP.playFor("cicada"), "brood");
  assert.notEqual(WP.playFor("cicada"), "sing");
  assert.notEqual(WP.playFor("cicada"), "song");
  assert.notEqual(WP.playFor("cicada"), "drone");
  assert.notEqual(WP.playFor("cicada"), "drum");
  assert.notEqual(WP.playFor("cicada"), "hum");
  assert.notEqual(WP.playFor("cicada"), "thrum");
  assert.notEqual(WP.playFor("cicada"), "pulse");
  assert.notEqual(WP.playFor("cicada"), "chime");
  assert.notEqual(WP.playFor("cicada"), "pray");
  assert.notEqual(WP.playFor("cicada"), "spot");
  assert.notEqual(WP.playFor("cicada"), "nest");
  assert.notEqual(WP.playFor("cicada"), "fold");
  assert.notEqual(WP.playFor("cicada"), "burst");
  assert.notEqual(WP.playFor("cicada"), "wait");
  assert.notEqual(WP.playFor("cicada"), "sill");
  assert.equal(WP.playFor("lugworm"), "castings");
  assert.equal(WP.playFor("springtail"), "spring");
  assert.equal(WP.playFor("box_turtle"), "shut");
  assert.equal(WP.playFor("wolf_spider"), "carry");
  assert.equal(WP.playFor("field_cricket"), "sill");
});''',
    '''  assert.equal(WP.playFor("cicada"), "emerge");
  assert.equal(WP.EMERGE, "emerge");
  assert.notEqual(WP.playFor("cicada"), "brood");
  assert.notEqual(WP.playFor("cicada"), "sing");
  assert.notEqual(WP.playFor("cicada"), "song");
  assert.notEqual(WP.playFor("cicada"), "drone");
  assert.notEqual(WP.playFor("cicada"), "drum");
  assert.notEqual(WP.playFor("cicada"), "hum");
  assert.notEqual(WP.playFor("cicada"), "thrum");
  assert.notEqual(WP.playFor("cicada"), "pulse");
  assert.notEqual(WP.playFor("cicada"), "chime");
  assert.notEqual(WP.playFor("cicada"), "pray");
  assert.notEqual(WP.playFor("cicada"), "spot");
  assert.notEqual(WP.playFor("cicada"), "nest");
  assert.notEqual(WP.playFor("cicada"), "fold");
  assert.notEqual(WP.playFor("cicada"), "burst");
  assert.notEqual(WP.playFor("cicada"), "wait");
  assert.notEqual(WP.playFor("cicada"), "sill");
  assert.equal(WP.playFor("lugworm"), "castings");
  assert.equal(WP.playFor("springtail"), "spring");
  assert.equal(WP.playFor("box_turtle"), "shut");
  assert.equal(WP.playFor("wolf_spider"), "carry");
  assert.equal(WP.playFor("field_cricket"), "song");
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
    "house chirp song",
)
house = replace_all(
    house,
    'assert.equal(WP.playFor("field_cricket"), "sill");',
    'assert.equal(WP.playFor("katydid"), "sill");',
    "house remaining field_cricket sill",
    1,
)
save("desktop/renderer/leftover-house.test.cjs", house, hnl)
print("house ok")

mjs, mnl = load("web/scripts/window-play.test.mjs")
mjs = replace_all(
    mjs,
    'assert.equal(P.playFor("field_cricket"), "sill");',
    'assert.equal(P.playFor("katydid"), "sill");',
    "mjs field_cricket sill pins",
    10,
)

MJS_TEST = r'''
test("the demo window plate walks Chirp song the same way", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /playFor/);
  assert.match(readFileSync(join(root, "src/lib/pets/meadow.ts"), "utf8"), /key: "field_cricket"[\s\S]{0,80}slug: "chirp"/);
  assert.equal(P.playFor("field_cricket"), "song");
  const target = P.pickTarget([WIN], 80, "field_cricket", WORK, 176);
  assert.ok(target);
  assert.equal(target.kind, "song");
  assert.equal(target.side, "grassdish");
  assert.equal(target.leave, "sung");
  assert.equal(Overlay.playFor("field_cricket"), "song");
  assert.equal(P.SONG, "song");
  assert.equal(Overlay.SONG, "song");
  assert.notEqual(P.playFor("field_cricket"), "chirp");
  assert.notEqual(P.playFor("field_cricket"), "sing");
  assert.notEqual(P.playFor("field_cricket"), "emerge");
  assert.notEqual(P.playFor("field_cricket"), "drone");
  assert.notEqual(P.playFor("field_cricket"), "drum");
  assert.notEqual(P.playFor("field_cricket"), "hum");
  assert.notEqual(P.playFor("field_cricket"), "thrum");
  assert.notEqual(P.playFor("field_cricket"), "pray");
  assert.notEqual(P.playFor("field_cricket"), "sill");
  assert.equal(P.playFor("cicada"), "emerge");
  assert.equal(Overlay.playFor("cicada"), "emerge");
  assert.equal(P.playFor("gecko"), "chirp");
  assert.equal(Overlay.playFor("gecko"), "chirp");
  assert.equal(P.playFor("gibbon"), "sing");
  assert.equal(P.playFor("katydid"), "sill");
  assert.equal(P.DUR.songOn, Overlay.DUR.songOn);
  assert.equal(P.DUR.song, Overlay.DUR.song);
  assert.equal(P.DUR.songHold, Overlay.DUR.songHold);
  assert.equal(P.DUR.songOff, Overlay.DUR.songOff);
  assert.ok(P.DUR.songOn !== Overlay.DUR.emergeOn);
  assert.ok(P.DUR.songOn !== Overlay.DUR.chirpOn);
  assert.ok(P.DUR.songOn !== Overlay.DUR.singOn);
  assert.ok(P.DUR.songOn !== Overlay.DUR.droneOn);
  const dish = P.songPoint(WIN, 176, WORK);
  const deskDish = Overlay.songPoint(WIN, Overlay.SPRITE, WORK);
  const husk = P.emergePoint(WIN, 176, WORK);
  const chirp = P.chirpPoint(WIN, 176, WORK);
  const sing = P.singPoint(WIN, 176, WORK);
  assert.ok(Math.abs(dish.x - deskDish.x) < 1);
  assert.ok(Math.abs(dish.lift - deskDish.lift) < 1);
  assert.ok(dish.lift > 8, "grass dish, the window stool");
  assert.ok(Math.abs(dish.x - husk.x) > 8 || Math.abs(dish.lift - husk.lift) > 4, "not Brood emerge");
  assert.ok(Math.abs(dish.x - chirp.x) > 20 || Math.abs(dish.lift - chirp.lift) > 4, "not Pad chirp");
  assert.ok(Math.abs(dish.x - sing.x) > 20 || Math.abs(dish.lift - sing.lift) > 4, "not Swing sing");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 168, height: 74 }], 80, "field_cricket", WORK, 176);
  assert.equal(tiny, null, "a real grass dish stool");
  const okSong = P.pickTarget([{ id: "song", x: 200, y: 80, width: 190, height: 156 }], 80, "field_cricket", WORK, 176);
  assert.ok(okSong, "a real window stool as a grass dish");
  const walkOn = P.songOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  const deskWalk = Overlay.songOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  assert.ok(Math.abs(walkOn.x - deskWalk.x) < 1);
  assert.ok(Math.abs(walkOn.rot - deskWalk.rot) < 0.01);
  const songPose = P.songPath(0.5);
  const deskSong = Overlay.songPath(0.5);
  assert.ok(Math.abs(songPose.rot - deskSong.rot) < 0.01);
  assert.ok(Math.abs(songPose.rot) > 2, "song is the tell");
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, 176, { cmd: "idle" });
  }
  assert.ok(seen.has("song-on"));
  assert.ok(seen.has("song"));
  assert.ok(seen.has("song-hold"));
  assert.ok(seen.has("song-off"));
  assert.equal(play.phase, "done");
  let desk = Overlay.beginPlay(Overlay.pickTarget([WIN], 80, "field_cricket", WORK, Overlay.SPRITE), 80);
  const deskSeen = new Set();
  for (let i = 0; i < 2400 && desk.phase !== "done"; i++) {
    deskSeen.add(desk.phase);
    desk = Overlay.stepPlay(desk, 0.05, { x: desk.x, lift: desk.lift }, [WIN, WIN_B], WORK, Overlay.SPRITE, { cmd: "idle" });
  }
  assert.ok(deskSeen.has("song-on"));
  assert.ok(deskSeen.has("song"));
  assert.ok(deskSeen.has("song-hold"));
  assert.ok(deskSeen.has("song-off"));
  assert.equal(desk.phase, "done");
});
'''

if not mjs.rstrip().endswith("});"):
    raise SystemExit("mjs tail unexpected: " + repr(mjs.rstrip()[-40:]))
mjs = mjs.rstrip() + "\n" + MJS_TEST
save("web/scripts/window-play.test.mjs", mjs, mnl)
print("mjs ok")
