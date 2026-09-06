# -*- coding: utf-8 -*-
"""Apply Rod (coli) tumble leftover window-play mirroring Bell/trumpet pattern."""
from pathlib import Path

ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

ROD_HEADER = (
    "Rod tumbles a sill pan as a broth cup: walk onto the pan, sit the tumble, then leave. "
    "Bell still owns trumpet. Spin still owns two. Hold still owns holdfast. "
    "Starter still owns bloom. Gale still owns run. "
    "This is the leftover after Bell. This is the ninth leftover of the well den. "
    "Next leftover is Rose. Others walk a sill."
)

OLD_NEXT = "Next leftover is Rod. Others walk a sill."
# Bell header ends with that; docs may use "next leftover is Rod"

TUMBLE_FNS = r'''
  function tumblePoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 48;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.42;
    // sill pan as a broth cup — sit the tumble on the pan; she tumbles, she does not run/bloom/trumpet/two/holdfast; tumble is the tell
    // not Gale dry-dish run, not Starter yeast-film bloom, not Bell trumpet-rim trumpet, not Spin wet-plate two, not Hold cold-hold holdfast, not Orb green-bowl sphere, not Well bog-cup fill
    const pan = Math.max(68, size * 0.38);
    const gripY = win.y + win.height - pan;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 28, maxLift) };
  }

  function tumbleFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function tumbleOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.66) * 2.04;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 3.22 * (1 - ease) + stride * 0.08,
    };
  }

  function tumblePath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.28) {
      const s = t / 0.28;
      const ease = s * s * (3 - 2 * s);
      // walk onto the pan — take the broth cup; the tumble; not Gale run, not Starter bloom, not Bell trumpet
      return { x: ease * 0.28, lift: ease * 1.8, rot: ease * 5.6 };
    }
    if (t < 0.72) {
      const s = (t - 0.28) / 0.44;
      // sit the tumble once — reverse / reorient (chemotaxis); she tumbles, she does not run/bloom/trumpet; tumble is the tell
      const flare = Math.sin(s * Math.PI);
      return { x: 0.28 + flare * 1.05, lift: 1.8 + flare * 0.85, rot: 5.6 + s * 26 };
    }
    if (t < 0.90) {
      const s = (t - 0.72) / 0.18;
      const ease = s * s * (3 - 2 * s);
      // remain a rod / review the broth
      return { x: 0.28 + ease * 0.08, lift: 1.8 + ease * 0.28, rot: 5.6 + ease * 7.0 };
    }
    return { x: 0.36, lift: 2.08, rot: 12.6 };
  }

  function tumbleHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.34;
    // sit the tumble on the sill pan as a broth cup; she tumbles, she does not run
    return { x: 0.36, lift: 2.08 + hush, rot: 12.6 };
  }

  function tumbleOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.48) * 1.76;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : 12.6) * (1 - ease),
    };
  }

'''

TUMBLE_PHASES = r'''
    if (next.phase === "tumble-on") {
      const face = tumbleFace(target);
      const u = next.t / DUR.tumbleOn;
      const pose = tumbleOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot * face;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "tumble", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "tumble") {
      const face = tumbleFace(target);
      const pose = tumblePath(Math.min(1, next.t / DUR.tumble));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.tumble) {
        return goPhase(next, "tumble-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "tumble-hold") {
      const face = tumbleFace(target);
      const pose = tumbleHoldPath(Math.min(1, next.t / DUR.tumbleHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.tumbleHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = tumbleHoldPath(1);
        return goPhase(next, "tumble-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "tumble-off") {
      const u = next.t / DUR.tumbleOff;
      const pose = tumbleOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }
'''

PICK_BLOCK = r'''    if (kind === TUMBLE) {
      const hold = tumblePoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -66 : 66;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 60 : -60;
      return {
        id: best.id,
        kind,
        side: "brothcup",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "tumbled",
        spin: "none",
      };
    }
'''

REFIT_BLOCK = r'''    if (target.kind === TUMBLE) {
      const hold = tumblePoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
'''

APPROACH_BLOCK = r'''        if (target.kind === TUMBLE) {
          return goPhase(next, "tumble-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
'''

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
  const wellOk = P.pickTarget([{ id: "well", x: 200, y: 80, width: 190, height: 184 }], 80, "sundew", WORK, P.SPRITE);
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

def patch_js(text: str) -> str:
    assert OLD_NEXT in text, "header next-Rod marker missing"
    text = text.replace(OLD_NEXT, ROD_HEADER, 1)

    old = '  const TRUMPET = "trumpet";\n'
    new = '  const TRUMPET = "trumpet";\n  const TUMBLE = "tumble";\n'
    assert old in text
    text = text.replace(old, new, 1)

    old = "    trumpetOff: 3.14,\n"
    new = "    trumpetOff: 3.14,\n    tumbleOn: 3.18,\n    tumble: 2.96,\n    tumbleHold: 5.72,\n    tumbleOff: 3.08,\n"
    assert old in text
    text = text.replace(old, new, 1)

    old = '    if (key === "stentor") return TRUMPET;\n'
    new = '    if (key === "stentor") return TRUMPET;\n    if (key === "coli") return TUMBLE;\n'
    assert old in text
    text = text.replace(old, new, 1)

    old = "    if (kind === TRUMPET) return w.width >= 184 && w.height >= 178;\n"
    new = "    if (kind === TRUMPET) return w.width >= 184 && w.height >= 178;\n    if (kind === TUMBLE) return w.width >= 192 && w.height >= 186;\n"
    assert old in text
    text = text.replace(old, new, 1)

    # pickTarget after TRUMPET block — find leave trumpeted block end
    marker = '        leave: "trumpeted",\n        spin: "none",\n      };\n'
    assert marker in text
    text = text.replace(marker, marker + PICK_BLOCK, 1)

    marker = "    if (target.kind === TRUMPET) {\n      const hold = trumpetPoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n"
    assert marker in text
    text = text.replace(marker, marker + REFIT_BLOCK, 1)

    # insert functions after trumpetOffPath
    marker = "  function trumpetOffPath(u, from, to) {"
    i = text.find(marker)
    assert i >= 0
    # find end of trumpetOffPath function (closing brace at column 2)
    j = text.find("\n  function ", i + 10)
    assert j > i
    text = text[:j] + "\n" + TUMBLE_FNS + text[j:]

    marker = '        if (target.kind === TRUMPET) {\n          return goPhase(next, "trumpet-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n'
    assert marker in text
    text = text.replace(marker, marker + APPROACH_BLOCK, 1)

    # phases: insert before sill-hop, fixing the glued brace
    glued = '    }    if (next.phase === "sill-hop") {'
    assert glued in text
    text = text.replace(glued, "    }\n" + TUMBLE_PHASES + "\n    if (next.phase === \"sill-hop\") {", 1)

    old = "    TRUMPET,\n"
    new = "    TRUMPET,\n    TUMBLE,\n"
    assert old in text
    text = text.replace(old, new, 1)

    old = "    trumpetOffPath,    pickTarget,"
    new = "    trumpetOffPath,\n    tumblePoint,\n    tumbleFace,\n    tumbleOnPath,\n    tumblePath,\n    tumbleHoldPath,\n    tumbleOffPath,\n    pickTarget,"
    if old not in text:
        old = "    trumpetOffPath,\n    pickTarget,"
        new = "    trumpetOffPath,\n    tumblePoint,\n    tumbleFace,\n    tumbleOnPath,\n    tumblePath,\n    tumbleHoldPath,\n    tumbleOffPath,\n    pickTarget,"
    assert old in text, repr(text[text.find("trumpetOffPath"):text.find("trumpetOffPath")+80])
    text = text.replace(old, new, 1)
    return text

def patch_ts(text: str) -> str:
    # header: docs-style next leftover may differ — window-play.ts uses same long header
    if OLD_NEXT in text:
        text = text.replace(OLD_NEXT, ROD_HEADER, 1)
    else:
        # TS may say "Next leftover is Rod. Others walk a sill." same
        raise SystemExit("TS header marker missing")

    old = 'export const TRUMPET = "trumpet";\n'
    new = 'export const TRUMPET = "trumpet";\nexport const TUMBLE = "tumble";\n'
    assert old in text
    text = text.replace(old, new, 1)

    old = "  trumpetOff: 3.14,\n"
    new = "  trumpetOff: 3.14,\n  tumbleOn: 3.18,\n  tumble: 2.96,\n  tumbleHold: 5.72,\n  tumbleOff: 3.08,\n"
    assert old in text
    text = text.replace(old, new, 1)

    old = '  if (key === "stentor") return TRUMPET;\n'
    new = '  if (key === "stentor") return TRUMPET;\n  if (key === "coli") return TUMBLE;\n'
    assert old in text
    text = text.replace(old, new, 1)

    old = "  if (kind === TRUMPET) return w.width >= 184 && w.height >= 178;\n"
    new = "  if (kind === TRUMPET) return w.width >= 184 && w.height >= 178;\n  if (kind === TUMBLE) return w.width >= 192 && w.height >= 186;\n"
    assert old in text
    text = text.replace(old, new, 1)

    # type unions
    old = "typeof TRUMPET | typeof SILL | typeof IGNORE;"
    new = "typeof TRUMPET | typeof TUMBLE | typeof SILL | typeof IGNORE;"
    assert old in text
    text = text.replace(old, new, 1)

    old = '| "trumpetrim";'
    new = '| "trumpetrim" | "brothcup";'
    assert old in text
    text = text.replace(old, new, 1)

    old = '| "trumpeted";'
    new = '| "trumpeted" | "tumbled";'
    assert old in text
    text = text.replace(old, new, 1)

    old = '| "trumpet-off"\n  | "sill-hop"'
    new = '| "trumpet-off"\n  | "tumble-on"\n  | "tumble"\n  | "tumble-hold"\n  | "tumble-off"\n  | "sill-hop"'
    assert old in text
    text = text.replace(old, new, 1)

    marker = '        leave: "trumpeted",\n        spin: "none",\n      };\n'
    assert marker in text
    # TS pick may use slightly different indent — check
    text = text.replace(marker, marker + PICK_BLOCK.replace("kind === TUMBLE", "kind === TUMBLE"), 1)

    marker = "    if (target.kind === TRUMPET) {\n      const hold = trumpetPoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n"
    if marker not in text:
        marker = "  if (target.kind === TRUMPET) {\n    const hold = trumpetPoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n"
        refit = REFIT_BLOCK.replace("    if", "  if").replace("\n      ", "\n    ").replace("\n    }", "\n  }")
        # simpler: build matching indent
        refit = (
            "  if (target.kind === TUMBLE) {\n"
            "    const hold = tumblePoint(win, sprite, work);\n"
            "    return { ...target, holdX: hold.x, holdLift: hold.lift };\n"
            "  }\n"
        )
        assert marker in text
        text = text.replace(marker, marker + refit, 1)
    else:
        text = text.replace(marker, marker + REFIT_BLOCK, 1)

    # functions — TS may use export function or plain function
    marker = "function trumpetOffPath(u: number, from:"
    i = text.find(marker)
    if i < 0:
        marker = "function trumpetOffPath(u,"
        i = text.find(marker)
    assert i >= 0, "trumpetOffPath not found in TS"
    # find next function after trumpetOffPath
    j = text.find("\nfunction ", i + 10)
    if j < 0:
        j = text.find("\nexport function ", i + 10)
    assert j > i
    # Adapt TUMBLE_FNS for TS: add types lightly by keeping JS style if file mixes
    # Check if trumpetPoint has types
    sample = text[text.find("function trumpetPoint"):text.find("function trumpetPoint")+120]
    if ": number" in sample or "win:" in sample:
        # typed — convert tumble fns
        tumble_ts = TUMBLE_FNS
        # Use same untyped style as neighboring if trumpet is untyped-ish
        # Read trumpetFace signature
        pass
    text = text[:j] + "\n" + TUMBLE_FNS + text[j:]

    # approach
    marker = '        if (target.kind === TRUMPET) {\n          return goPhase(next, "trumpet-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n'
    if marker not in text:
        marker = '      if (target.kind === TRUMPET) {\n        return goPhase(next, "trumpet-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n      }\n'
        approach = (
            '      if (target.kind === TUMBLE) {\n'
            '        return goPhase(next, "tumble-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
            '      }\n'
        )
        assert marker in text
        text = text.replace(marker, marker + approach, 1)
    else:
        text = text.replace(marker, marker + APPROACH_BLOCK, 1)

    # phases before sill-hop
    glued = None
    for cand in [
        '    }    if (next.phase === "sill-hop") {',
        '  }    if (next.phase === "sill-hop") {',
        '    }\n    if (next.phase === "sill-hop") {',
        '  }\n  if (next.phase === "sill-hop") {',
    ]:
        if cand in text and "trumpet-off" in text[text.find(cand)-400:text.find(cand)]:
            # verify near trumpet-off
            idx = text.find('if (next.phase === "trumpet-off")')
            sill = text.find(cand, idx)
            if sill > idx:
                glued = cand
                break
    if glued is None:
        # find trumpet-off end then sill-hop
        idx = text.find('if (next.phase === "trumpet-off")')
        sill = text.find('if (next.phase === "sill-hop")', idx)
        assert sill > idx
        # insert before sill
        # detect indent of sill line
        line_start = text.rfind("\n", 0, sill) + 1
        indent = text[line_start:sill]
        phases = TUMBLE_PHASES
        if indent == "  ":
            phases = TUMBLE_PHASES.replace("\n    ", "\n  ")
        text = text[:line_start] + phases + "\n" + text[line_start:]
    else:
        idx = text.find('if (next.phase === "trumpet-off")')
        pos = text.find(glued, idx)
        if glued.startswith("    }    "):
            text = text[:pos] + "    }\n" + TUMBLE_PHASES + "\n    if (next.phase === \"sill-hop\") {" + text[pos+len(glued):]
        elif glued.startswith("  }    "):
            phases = TUMBLE_PHASES.replace("\n    ", "\n  ")
            text = text[:pos] + "  }\n" + phases + "\n  if (next.phase === \"sill-hop\") {" + text[pos+len(glued):]
        elif glued == '    }\n    if (next.phase === "sill-hop") {':
            text = text[:pos] + "    }\n" + TUMBLE_PHASES + "\n    if (next.phase === \"sill-hop\") {" + text[pos+len(glued):]
        else:
            phases = TUMBLE_PHASES.replace("\n    ", "\n  ")
            text = text[:pos] + "  }\n" + phases + "\n  if (next.phase === \"sill-hop\") {" + text[pos+len(glued):]

    # exports — TS may export individually or as object
    if "trumpetOffPath," in text and "tumbleOffPath" not in text:
        old = "trumpetOffPath,"
        # find last occurrence near exports
        # safer: replace export list if exists
        i = text.rfind("trumpetOffPath")
        # check context
        ctx = text[i:i+40]
        if "trumpetOffPath," in text[i:i+20]:
            text = text[:i] + "trumpetOffPath,\n  tumblePoint,\n  tumbleFace,\n  tumbleOnPath,\n  tumblePath,\n  tumbleHoldPath,\n  tumbleOffPath," + text[i+len("trumpetOffPath,"):]
        elif "export {" in text[max(0,i-200):i]:
            text = text[:i] + "trumpetOffPath,\n  tumblePoint,\n  tumbleFace,\n  tumbleOnPath,\n  tumblePath,\n  tumbleHoldPath,\n  tumbleOffPath" + text[i+len("trumpetOffPath"):]
    
    # Also export const TUMBLE already added. Ensure TUMBLE in any re-export list
    if "\n  TRUMPET,\n" in text and "\n  TUMBLE,\n" not in text:
        text = text.replace("\n  TRUMPET,\n", "\n  TRUMPET,\n  TUMBLE,\n", 1)
    return text

def patch_cjs_tests(text: str) -> str:
    # move generic sill pin from coli to haloarchaea
    text = text.replace('P.pickTarget([WIN], 80, "coli"', 'P.pickTarget([WIN], 80, "haloarchaea"', 1)
    # Bell test still asserts coli sill — change those to haloarchaea / tumble where appropriate
    # There are two playFor("coli"), "sill" — one in Spin section (~whip) and one in Bell tests
    # Replace ALL remaining coli sill with: first keep Bell's assert becoming tumble via new tests;
    # Bell block has assert.equal(P.playFor("coli"), "sill") — change to haloarchaea
    text = text.replace('assert.equal(P.playFor("coli"), "sill");', 'assert.equal(P.playFor("haloarchaea"), "sill");')
    # Also Bell test had assert coli sill after leaf — already replaced
    if not text.rstrip().endswith("\n"):
        text += "\n"
    text = text.rstrip() + "\n" + CJS_TESTS
    return text

def patch_mjs_tests(text: str) -> str:
    # mjs likely mirrors cjs with import style — adapt CJS_TESTS
    mjs = CJS_TESTS
    # Check if mjs uses P. or imported names
    if "playFor(" in text and "P.playFor" not in text[:5000]:
        # may use bare imports
        sample = text[text.find("Bell leftover"):text.find("Bell leftover")+200] if "Bell leftover" in text else ""
        pass
    # Look at how Bell test is written
    if 'P.playFor("stentor")' in text:
        text = text.replace('P.pickTarget([WIN], 80, "coli"', 'P.pickTarget([WIN], 80, "haloarchaea"', 1)
        text = text.replace('assert.equal(P.playFor("coli"), "sill");', 'assert.equal(P.playFor("haloarchaea"), "sill");')
        if not text.rstrip().endswith("\n"):
            text += "\n"
        text = text.rstrip() + "\n" + CJS_TESTS
    else:
        # adapt to non-P style if needed
        raise SystemExit("unexpected mjs style")
    return text

HOUSE_TITLE_PREFIX = (
    'test("Rod leftover tumbles a sill pan as a broth cup; ninth leftover of the well den done; '
    'Bell leftover still trumpets a sash horn as a trumpet rim; eighth leftover of the well den done; '
)

def patch_house(text: str) -> str:
    old_start = 'test("Bell leftover trumpets a sash horn as a trumpet rim; eighth leftover of the well den done; '
    assert old_start in text
    text = text.replace(old_start, HOUSE_TITLE_PREFIX, 1)
    text = text.replace("next leftover is Rod;", "next leftover is Rose;", 1)
    # playFor asserts at end of house test
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
    assert old in text, "house playFor block missing"
    text = text.replace(old, new, 1)
    return text

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

def patch_docs_readme(path: Path, text: str) -> str:
    # Long README paragraphs: replace "Next leftover is Rod." trail after Bell sentence
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
    if needle in text:
        text = text.replace(needle, repl, 1)
    else:
        # try shorter
        if "Next leftover is Rod." in text:
            # insert Rod sentence before Next leftover is Rod and retarget
            text = text.replace(
                "Next leftover is Rod.",
                "Rod tumbles a sill pan as a broth cup: walk onto the pan, sit the tumble, then leave. "
                "Bell still owns trumpet. Spin still owns two. Hold still owns holdfast. "
                "Starter still owns bloom. Gale still owns run. "
                "This is the leftover after Bell. Ninth leftover of the well den. Next leftover is Rose.",
                1,
            )
    return text

def patch_arch(text: str) -> str:
    old = (
        "| **Last Updated** | 2026-09-02 (Bell leftover trumpets a sash horn as a trumpet rim; eighth leftover of the well den done; "
    )
    new = (
        "| **Last Updated** | 2026-09-02 (Rod leftover tumbles a sill pan as a broth cup; ninth leftover of the well den done; "
        "Bell leftover still trumpets a sash horn as a trumpet rim; eighth leftover of the well den done; "
    )
    assert old in text
    text = text.replace(old, new, 1)
    text = text.replace("next leftover is Rod;", "next leftover is Rose;", 1)
    # also may say "next leftover is Rod;" in the long cell — already one replace
    # update tell phrase if present
    text = text.replace("; cool is the tell;", "; tumble is the tell;", 1)
    return text

def patch_roadmap(text: str) -> str:
    # Insert Rod checkbox after Bell checkbox
    bell_line_start = text.find("- [x] Bell (`stentor`")
    assert bell_line_start >= 0
    # find end of Bell line (next newline starting with - or **)
    nl = text.find("\n", bell_line_start)
    # Bell is one long line
    text = text[: nl + 1] + ROADMAP_ITEM + text[nl + 1 :]
    # Update Spin line "Next leftover is Rod" -> Rose already done via Bell; Spin may say Next leftover is Rod
    text = text.replace("Next leftover is Rod (`coli`). Do not start Rod.", "Next leftover is Rose (`haloarchaea`). Do not start Rose.")
    # Last Updated footer
    old = "**Last Updated:** 2026-09-02 (Phase 6 leftover: Bell leftover trumpets a sash horn as a trumpet rim; eighth leftover of the well den done; "
    new = "**Last Updated:** 2026-09-02 (Phase 6 leftover: Rod leftover tumbles a sill pan as a broth cup; ninth leftover of the well den done; Bell leftover still trumpets a sash horn as a trumpet rim; eighth leftover of the well den done; "
    assert old in text
    text = text.replace(old, new, 1)
    text = text.replace("next leftover is Rod;", "next leftover is Rose;", 1)
    text = text.replace("; cool is the tell;", "; tumble is the tell;", 1)
    return text

def main():
    js_path = ROOT / "desktop/renderer/window-play.js"
    ts_path = ROOT / "web/src/lib/pets/window-play.ts"
    cjs_path = ROOT / "desktop/renderer/window-play.test.cjs"
    mjs_path = ROOT / "web/scripts/window-play.test.mjs"
    house_path = ROOT / "desktop/renderer/leftover-house.test.cjs"
    readme = ROOT / "README.md"
    desk_readme = ROOT / "desktop/README.md"
    arch = ROOT / "docs/ARCHITECTURE.md"
    road = ROOT / "docs/ROADMAP.md"

    js = patch_js(js_path.read_text(encoding="utf-8"))
    js_path.write_text(js, encoding="utf-8", newline="\n")
    print("patched JS")

    ts = patch_ts(ts_path.read_text(encoding="utf-8"))
    ts_path.write_text(ts, encoding="utf-8", newline="\n")
    print("patched TS")

    cjs = patch_cjs_tests(cjs_path.read_text(encoding="utf-8"))
    cjs_path.write_text(cjs, encoding="utf-8", newline="\n")
    print("patched CJS tests")

    mjs = patch_mjs_tests(mjs_path.read_text(encoding="utf-8"))
    mjs_path.write_text(mjs, encoding="utf-8", newline="\n")
    print("patched MJS tests")

    house = patch_house(house_path.read_text(encoding="utf-8"))
    house_path.write_text(house, encoding="utf-8", newline="\n")
    print("patched leftover-house")

    for p, fn in [(readme, patch_docs_readme), (desk_readme, patch_docs_readme)]:
        t = fn(p, p.read_text(encoding="utf-8"))
        p.write_text(t, encoding="utf-8", newline="\n")
        print("patched", p.name)

    a = patch_arch(arch.read_text(encoding="utf-8"))
    arch.write_text(a, encoding="utf-8", newline="\n")
    print("patched ARCH")

    r = patch_roadmap(road.read_text(encoding="utf-8"))
    road.write_text(r, encoding="utf-8", newline="\n")
    print("patched ROADMAP")

    # quick sanity
    assert 'playFor("coli")' in cjs or "coli\") return TUMBLE" in js
    assert "const TUMBLE" in js or 'TUMBLE = "tumble"' in js
    assert 'if (key === "coli") return TUMBLE' in js
    assert 'if (key === "coli") return TUMBLE' in ts
    print("sanity ok")

if __name__ == "__main__":
    main()
