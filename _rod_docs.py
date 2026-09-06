# -*- coding: utf-8 -*-
from pathlib import Path
ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

CJS_TESTS = r'''
test("Rod leftover tumbles a sill pan as a broth cup: walk onto the pan, sit the tumble, then leave", () => {
  const WIN_B = { id: "pw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("coli"), "tumble");
  assert.equal(P.TUMBLE, "tumble");
  assert.notEqual(P.playFor("coli"), "rod");
  assert.notEqual(P.playFor("coli"), "coli");
  assert.notEqual(P.playFor("coli"), "run");
  assert.notEqual(P.playFor("coli"), "bloom");
  assert.notEqual(P.playFor("coli"), "trumpet");
  assert.notEqual(P.playFor("coli"), "two");
  assert.notEqual(P.playFor("coli"), "holdfast");
  assert.notEqual(P.playFor("coli"), "house");
  assert.notEqual(P.playFor("coli"), "sphere");
  assert.notEqual(P.playFor("coli"), "sill");
  assert.equal(P.playFor("stentor"), "trumpet");
  assert.equal(P.TRUMPET, "trumpet");
  assert.equal(P.playFor("chlamydomonas"), "two");
  assert.equal(P.TWO, "two");
  assert.equal(P.playFor("kelp"), "holdfast");
  assert.equal(P.HOLDFAST, "holdfast");
  assert.equal(P.playFor("yeast"), "bloom");
  assert.equal(P.BLOOM, "bloom");
  assert.equal(P.playFor("solifuge"), "run");
  assert.equal(P.RUN, "run");
  assert.equal(P.playFor("volvox"), "sphere");
  assert.equal(P.SPHERE, "sphere");
  assert.equal(P.playFor("diatom"), "house");
  assert.equal(P.HOUSE, "house");
  assert.equal(P.playFor("haloarchaea"), "sill");
  const target = P.pickTarget([WIN], 80, "coli", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "tumble");
  assert.equal(target.side, "brothcup");
  assert.equal(target.leave, "tumbled");
  assert.notEqual(target.kind, "run");
  assert.notEqual(target.kind, "bloom");
  assert.notEqual(target.kind, "trumpet");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift > 8, "it tumbles a sill pan as a broth cup");
  assert.ok(P.DUR.tumbleHold > P.DUR.tumble * 1.2, "the hold is the sit; tumble is the tell");
  assert.ok(P.DUR.tumbleOn > 1.0, "a walk onto the pan, not a cling");
  assert.ok(P.DUR.tumbleOn !== P.DUR.runOn);
  assert.ok(P.DUR.tumbleOn !== P.DUR.bloomOn);
  assert.ok(P.DUR.tumbleOn !== P.DUR.trumpetOn);
  assert.ok(P.DUR.tumbleOn !== P.DUR.twoOn);
  assert.ok(P.DUR.tumbleOn !== P.DUR.sillHop);
  assert.ok(P.DUR.tumble !== P.DUR.run);
  assert.ok(P.DUR.tumble !== P.DUR.bloom);
  assert.ok(P.DUR.tumbleHold !== P.DUR.trumpetHold);
  assert.ok(P.DUR.tumbleOff !== P.DUR.trumpetOff);
  const tumble = P.tumblePoint(WIN, P.SPRITE, WORK);
  const trumpet = P.trumpetPoint(WIN, P.SPRITE, WORK);
  const sphere = P.spherePoint(WIN, P.SPRITE, WORK);
  const fill = P.fillPoint(WIN, P.SPRITE, WORK);
  const two = P.twoPoint(WIN, P.SPRITE, WORK);
  const holdfast = P.holdfastPoint(WIN, P.SPRITE, WORK);
  const house = P.housePoint(WIN, P.SPRITE, WORK);
  const run = P.runPoint(WIN, P.SPRITE, WORK);
  const bloom = P.bloomPoint(WIN, P.SPRITE, WORK);
  assert.ok(tumble.lift > 8, "the sill pan as a broth cup, not the sky");
  assert.ok(Math.abs(tumble.lift - sphere.lift) < 8, "a real sill pan, Orb's furniture family");
  assert.ok(Math.abs(tumble.x - sphere.x) > 8, "not Orb green-bowl sphere");
  assert.ok(Math.abs(tumble.x - fill.x) > 8 || Math.abs(tumble.lift - fill.lift) > 1, "not Well bog-cup fill");
  assert.ok(Math.abs(tumble.x - trumpet.x) > 8 || Math.abs(tumble.lift - trumpet.lift) > 1, "not Bell trumpet-rim trumpet");
  assert.ok(Math.abs(tumble.x - two.x) > 8 || Math.abs(tumble.lift - two.lift) > 1, "not Spin wet-plate two");
  assert.ok(Math.abs(tumble.x - holdfast.x) > 8 || Math.abs(tumble.lift - holdfast.lift) > 1, "not Hold cold-hold holdfast");
  assert.ok(Math.abs(tumble.x - house.x) > 8 || Math.abs(tumble.lift - house.lift) > 1, "not Pane silica-dish house");
  assert.ok(Math.abs(tumble.x - run.x) > 8 || Math.abs(tumble.lift - run.lift) > 1, "not Gale dry-dish run");
  assert.ok(Math.abs(tumble.x - bloom.x) > 8 || Math.abs(tumble.lift - bloom.lift) > 1, "not Starter yeast-film bloom");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "coli", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real sill pan, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 180, height: 80 }], 80, "coli", WORK, P.SPRITE);
  assert.equal(short, null, "a real sill pan, not a short pane");
  const thin = P.pickTarget([{ id: "thin", x: 200, y: 80, width: 192, height: 185 }], 80, "coli", WORK, P.SPRITE);
  assert.equal(thin, null, "a real sill pan, not a shorter pan");
  const okTumble = P.pickTarget([{ id: "tumble", x: 200, y: 80, width: 192, height: 186 }], 80, "coli", WORK, P.SPRITE);
  assert.ok(okTumble, "a real sill pan as a broth cup");
  const shortW = P.pickTarget([{ id: "shortW", x: 200, y: 80, width: 191, height: 186 }], 80, "coli", WORK, P.SPRITE);
  assert.equal(shortW, null, "a real sill pan, not a thinner pan");
  const orbOk = P.pickTarget([{ id: "orb", x: 200, y: 80, width: 190, height: 184 }], 80, "volvox", WORK, P.SPRITE);
  assert.ok(orbOk, "Orb still takes a sill pan");
  const wellOk = P.pickTarget([{ id: "well", x: 200, y: 80, width: 190, height: 184 }], 80, "pitcher", WORK, P.SPRITE);
  assert.ok(wellOk, "Well still takes a sill pan");
  const bellOk = P.pickTarget([{ id: "bell", x: 200, y: 80, width: 184, height: 178 }], 80, "stentor", WORK, P.SPRITE);
  assert.ok(bellOk, "Bell still takes a sash horn");
  const spinOk = P.pickTarget([{ id: "two", x: 200, y: 80, width: 185, height: 172 }], 80, "chlamydomonas", WORK, P.SPRITE);
  assert.ok(spinOk, "Spin still takes a sill wash");
  const walkOn = P.tumbleOnPath(0.25, { x: 40, lift: 0 }, { x: tumble.x, lift: tumble.lift });
  const trumpetOn = P.trumpetOnPath(0.25, { x: 40, lift: 0 }, { x: trumpet.x, lift: trumpet.lift });
  const runOn = P.runOnPath(0.25, { x: 40, lift: 0 }, { x: run.x, lift: run.lift });
  assert.ok(walkOn.lift >= 0, "it walks onto the sill pan as a broth cup");
  assert.ok(walkOn.rot !== trumpetOn.rot, "a walk onto the pan, not Bell trumpet");
  assert.ok(walkOn.rot !== runOn.rot, "a walk onto the pan, not Gale run");
  const tumblePose = P.tumblePath(0.3);
  const trumpetPose = P.trumpetPath(0.3);
  const bloomPose = P.bloomPath(0.3);
  const runPose = P.runPath(0.3);
  const twoPose = P.twoPath(0.3);
  const spherePose = P.spherePath(0.3);
  assert.ok(Math.abs(tumblePose.lift) > 0.15 || Math.abs(tumblePose.rot) > 0.8, "it tumbles once; tumble is the tell");
  assert.ok(tumblePose.rot !== trumpetPose.rot, "tumble, not trumpet");
  assert.ok(tumblePose.rot !== bloomPose.rot, "tumble, not bloom");
  assert.ok(tumblePose.rot !== runPose.rot, "tumble, not run");
  assert.ok(tumblePose.rot !== twoPose.rot, "tumble, not two");
  assert.ok(tumblePose.rot !== spherePose.rot, "tumble, not sphere");
  const hold = P.tumbleHoldPath(0.5);
  assert.ok(Math.abs(hold.rot - 12.6) < 0.2, "it holds the sit on the broth cup");
  assert.ok(Math.abs(hold.x - 0.36) < 0.05, "it stays on the sill pan");
  assert.ok(hold.lift > 0, "sit the tumble, not a run");
  const off0 = P.tumbleOffPath(0, { x: tumble.x, lift: tumble.lift + 2.08, rot: 12.6 }, { x: tumble.x + 50, lift: 0 });
  const offMid = P.tumbleOffPath(0.5, { x: tumble.x, lift: tumble.lift + 2.08, rot: 12.6 }, { x: tumble.x + 50, lift: 0 });
  const off1 = P.tumbleOffPath(1, { x: tumble.x, lift: tumble.lift + 2.08, rot: 12.6 }, { x: tumble.x + 50, lift: 0 });
  assert.ok(Math.abs(off0.x - tumble.x) < 2);
  assert.ok(Math.abs(offMid.x - tumble.x) > 8, "a walk leave off the broth cup");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "run");
    assert.notEqual(play.phase, "bloom");
    assert.notEqual(play.phase, "trumpet");
    assert.notEqual(play.phase, "two");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "tumble") {
      assert.ok(play.lift !== undefined, "it tumbles on the broth cup");
    }
  }
  assert.ok(seen.has("tumble-on"));
  assert.ok(seen.has("tumble"));
  assert.ok(seen.has("tumble-hold"));
  assert.ok(seen.has("tumble-off"));
  assert.ok(seen.has("approach") || seen.has("walk") || seen.has("land"));
  assert.equal(windowIds.size, 1, "one window; bounds-only");
  assert.equal(play.phase, "done");
});

test("a moved window refits Rod's broth-cup tumble; sleep, card, and hide abort; Rod never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "coli", WORK, P.SPRITE);
  assert.ok(target);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "tumble"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "tumble");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "tumble");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved broth cup");
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "tumble-off");
  assert.equal(play.abort, true);
});
'''

# --- CJS ---
cjs_path = ROOT / "desktop/renderer/window-play.test.cjs"
text = cjs_path.read_text(encoding="utf-8")
assert "Rod leftover tumbles" not in text
text = text.replace('P.pickTarget([WIN], 80, "coli"', 'P.pickTarget([WIN], 80, "haloarchaea"', 1)
text = text.replace('assert.equal(P.playFor("coli"), "sill");', 'assert.equal(P.playFor("haloarchaea"), "sill");')
text = text.rstrip() + "\n" + CJS_TESTS
cjs_path.write_text(text, encoding="utf-8", newline="\n")
print("CJS ok")

# --- MJS ---
mjs_path = ROOT / "web/scripts/window-play.test.mjs"
text = mjs_path.read_text(encoding="utf-8")
assert "Rod leftover tumbles" not in text
# check style
if 'P.playFor("stentor")' in text:
    text = text.replace('P.pickTarget([WIN], 80, "coli"', 'P.pickTarget([WIN], 80, "haloarchaea"', 1)
    text = text.replace('assert.equal(P.playFor("coli"), "sill");', 'assert.equal(P.playFor("haloarchaea"), "sill");')
    text = text.rstrip() + "\n" + CJS_TESTS
else:
    raise SystemExit("mjs unexpected")
mjs_path.write_text(text, encoding="utf-8", newline="\n")
print("MJS ok")

# --- house ---
house_path = ROOT / "desktop/renderer/leftover-house.test.cjs"
text = house_path.read_text(encoding="utf-8")
old_start = 'test("Bell leftover trumpets a sash horn as a trumpet rim; eighth leftover of the well den done; '
new_start = (
    'test("Rod leftover tumbles a sill pan as a broth cup; ninth leftover of the well den done; '
    'Bell leftover still trumpets a sash horn as a trumpet rim; eighth leftover of the well den done; '
)
assert old_start in text
text = text.replace(old_start, new_start, 1)
text = text.replace("next leftover is Rod;", "next leftover is Rose;", 1)
old = '''  assert.equal(WP.playFor("stentor"), "trumpet");
  assert.equal(WP.TRUMPET, "trumpet");
  assert.notEqual(WP.playFor("stentor"), "bell");
  assert.notEqual(WP.playFor("stentor"), "stentor");
  assert.notEqual(WP.playFor("stentor"), "two");
  assert.notEqual(WP.playFor("stentor"), "holdfast");
  assert.notEqual(WP.playFor("stentor"), "house");
  assert.notEqual(WP.playFor("stentor"), "sphere");
  assert.notEqual(WP.playFor("stentor"), "many");
  assert.notEqual(WP.playFor("stentor"), "sill");
  assert.equal(WP.playFor("chlamydomonas"), "two");
  assert.equal(WP.playFor("kelp"), "holdfast");
  assert.equal(WP.playFor("nexus"), "many");
  assert.equal(WP.playFor("coli"), "sill");
'''
new = '''  assert.equal(WP.playFor("coli"), "tumble");
  assert.equal(WP.TUMBLE, "tumble");
  assert.notEqual(WP.playFor("coli"), "rod");
  assert.notEqual(WP.playFor("coli"), "coli");
  assert.notEqual(WP.playFor("coli"), "run");
  assert.notEqual(WP.playFor("coli"), "bloom");
  assert.notEqual(WP.playFor("coli"), "trumpet");
  assert.notEqual(WP.playFor("coli"), "two");
  assert.notEqual(WP.playFor("coli"), "sill");
  assert.equal(WP.playFor("stentor"), "trumpet");
  assert.equal(WP.TRUMPET, "trumpet");
  assert.notEqual(WP.playFor("stentor"), "bell");
  assert.notEqual(WP.playFor("stentor"), "stentor");
  assert.notEqual(WP.playFor("stentor"), "two");
  assert.notEqual(WP.playFor("stentor"), "holdfast");
  assert.notEqual(WP.playFor("stentor"), "house");
  assert.notEqual(WP.playFor("stentor"), "sphere");
  assert.notEqual(WP.playFor("stentor"), "many");
  assert.notEqual(WP.playFor("stentor"), "sill");
  assert.equal(WP.playFor("chlamydomonas"), "two");
  assert.equal(WP.playFor("kelp"), "holdfast");
  assert.equal(WP.playFor("nexus"), "many");
  assert.equal(WP.playFor("haloarchaea"), "sill");
'''
assert old in text
text = text.replace(old, new, 1)
house_path.write_text(text, encoding="utf-8", newline="\n")
print("house ok")

# --- README / desktop README ---
for rel in ["README.md", "desktop/README.md"]:
    p = ROOT / rel
    t = p.read_text(encoding="utf-8")
    needle = (
        "Bell trumpets a sash horn as a trumpet rim: walk onto the horn, sit the trumpet, then leave. "
        "Spin still owns two. Hold still owns holdfast. Knot still owns many. "
        "This is the leftover after Spin. Eighth leftover of the well den. Next leftover is Rod."
    )
    repl = (
        "Bell trumpets a sash horn as a trumpet rim: walk onto the horn, sit the trumpet, then leave. "
        "Spin still owns two. Hold still owns holdfast. Knot still owns many. "
        "This is the leftover after Spin. Eighth leftover of the well den. "
        "Rod tumbles a sill pan as a broth cup: walk onto the pan, sit the tumble, then leave. "
        "Bell still owns trumpet. Spin still owns two. Hold still owns holdfast. "
        "Starter still owns bloom. Gale still owns run. "
        "This is the leftover after Bell. Ninth leftover of the well den. Next leftover is Rose."
    )
    if needle in t:
        t = t.replace(needle, repl, 1)
    elif "Next leftover is Rod." in t:
        t = t.replace(
            "Next leftover is Rod.",
            "Rod tumbles a sill pan as a broth cup: walk onto the pan, sit the tumble, then leave. "
            "Bell still owns trumpet. Spin still owns two. Hold still owns holdfast. "
            "Starter still owns bloom. Gale still owns run. "
            "This is the leftover after Bell. Ninth leftover of the well den. Next leftover is Rose.",
            1,
        )
    else:
        raise SystemExit(f"readme marker missing in {rel}")
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched", rel)

# --- ARCH ---
arch = ROOT / "docs/ARCHITECTURE.md"
t = arch.read_text(encoding="utf-8")
old = (
    "| **Last Updated** | 2026-09-02 (Bell leftover trumpets a sash horn as a trumpet rim; eighth leftover of the well den done; "
)
new = (
    "| **Last Updated** | 2026-09-02 (Rod leftover tumbles a sill pan as a broth cup; ninth leftover of the well den done; "
    "Bell leftover still trumpets a sash horn as a trumpet rim; eighth leftover of the well den done; "
)
assert old in t
t = t.replace(old, new, 1)
t = t.replace("next leftover is Rod;", "next leftover is Rose;", 1)
# only replace first cool is the tell if it's in Last Updated - careful
# Bell had cool is the tell from Hush era - change to tumble for Rod tip
if "; cool is the tell;" in t:
    t = t.replace("; cool is the tell;", "; tumble is the tell;", 1)
arch.write_text(t, encoding="utf-8", newline="\n")
print("arch ok")

# --- ROADMAP ---
road = ROOT / "docs/ROADMAP.md"
t = road.read_text(encoding="utf-8")
ROADMAP_ITEM = (
    "- [x] Rod (`coli` / `rod`) tumbles a real sill pan as a broth cup: walk onto the pan "
    "(sill pan — she tumbles, she does not run/bloom/trumpet; a rod bacterium; not Gale dry-dish run, "
    "not Starter yeast-film bloom, not Bell trumpet-rim trumpet, not Spin wet-plate two, not Hold cold-hold holdfast, "
    "not Orb green-bowl sphere, not Well bog-cup fill; sit the tumble; tumble as one name; the tumble is the tell; "
    "named: Rod / coli. The tumble is the tell. Hours: Broth of a cup. Hello: \"I tumbled. Hello.\" "
    "Play: \"A tumble. Review the broth.\" / \"I win by remaining a rod.\" Temperament catalog tumbling, kind tumble. "
    "Not rod as kind. Not coli as kind. Not run (Gale owns run). Not bloom (Starter owns bloom). "
    "Not trumpet (Bell owns trumpet). Not two (Spin owns two). Not holdfast (Hold owns holdfast). "
    "Same `playFor` door. No new `/demo` route. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. "
    "Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. "
    "Ninth leftover of the well den. Next leftover is Rose (`haloarchaea`). Do not start Rose.\n"
)
bell_line_start = t.find("- [x] Bell (`stentor`")
assert bell_line_start >= 0
nl = t.find("\n", bell_line_start)
t = t[: nl + 1] + ROADMAP_ITEM + t[nl + 1 :]
t = t.replace("Next leftover is Rod (`coli`). Do not start Rod.", "Next leftover is Rose (`haloarchaea`). Do not start Rose.")
old = "**Last Updated:** 2026-09-02 (Phase 6 leftover: Bell leftover trumpets a sash horn as a trumpet rim; eighth leftover of the well den done; "
new = "**Last Updated:** 2026-09-02 (Phase 6 leftover: Rod leftover tumbles a sill pan as a broth cup; ninth leftover of the well den done; Bell leftover still trumpets a sash horn as a trumpet rim; eighth leftover of the well den done; "
assert old in t
t = t.replace(old, new, 1)
t = t.replace("next leftover is Rod;", "next leftover is Rose;", 1)
if "; cool is the tell;" in t:
    t = t.replace("; cool is the tell;", "; tumble is the tell;", 1)
road.write_text(t, encoding="utf-8", newline="\n")
print("roadmap ok")
print("ALL DOCS/TESTS PATCHED")
