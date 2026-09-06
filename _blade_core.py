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

HEADER = (
    "Chirp songs a window stool as a grass dish: walk onto the stool, sit the song, hold the night, then leave. "
    "Brood still owns emerge. Gecko still owns chirp. Swing still owns sing. Drum still owns drum. Hum still owns drone. Thrum still owns forage. "
    "This is the first leftover of the meadow den."
)
HEADER_NEW = HEADER + (
    " Blade leafs a casement leaf as a leaf rim: walk onto the leaf, sit the leaf wings, then leave. "
    "Grin still owns still. Chirp still owns song. This is the second meadow leftover."
)

js, nl = load("desktop/renderer/window-play.js")
js = must_replace(js, HEADER, HEADER_NEW, "js header")
js = must_replace(
    js,
    '  const SONG = "song";\n  const SILL = "sill";',
    '  const SONG = "song";\n  const LEAF = "leaf";\n  const SILL = "sill";',
    "js LEAF const",
)
js = must_replace(
    js,
    "    songOff: 2.34,\n    sillHop: 0.38,",
    "    songOff: 2.34,\n    leafOn: 2.74,\n    leaf: 2.28,\n    leafHold: 3.66,\n    leafOff: 2.18,\n    sillHop: 0.38,",
    "js DUR",
)
js = must_replace(
    js,
    '    if (key === "field_cricket") return SONG;\n    return SILL;',
    '    if (key === "field_cricket") return SONG;\n    if (key === "katydid") return LEAF;\n    return SILL;',
    "js playFor",
)
js = must_replace(
    js,
    "    if (kind === SONG) return w.width >= 190 && w.height >= 156;\n    return w.width >= 180 && w.height >= 70;",
    "    if (kind === SONG) return w.width >= 190 && w.height >= 156;\n    if (kind === LEAF) return w.width >= 172 && w.height >= 156;\n    return w.width >= 180 && w.height >= 70;",
    "js size gate",
)
js = must_replace(
    js,
    '        leave: "sung",\n        spin: "none",\n      };\n    }\n\n\n\n        if (kind === WRAP) {',
    '        leave: "sung",\n        spin: "none",\n      };\n    }\n\n    if (kind === LEAF) {\n      const hold = leafPoint(best, size, work);\n      const approachOff = hold.x < workW / 2 ? -48 : 48;\n      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));\n      const away = hold.x < workW / 2 ? 42 : -42;\n      return {\n        id: best.id,\n        kind,\n        side: "leafrim",\n        holdX: hold.x,\n        holdLift: hold.lift,\n        approachX,\n        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),\n        leave: "leafed",\n        spin: "none",\n      };\n    }\n\n\n\n        if (kind === WRAP) {',
    "js pickTarget",
)
js = must_replace(
    js,
    "    if (target.kind === SONG) {\n      const hold = songPoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === BURY) {",
    "    if (target.kind === SONG) {\n      const hold = songPoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === LEAF) {\n      const hold = leafPoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === BURY) {",
    "js refit",
)
js = must_replace(
    js,
    '        if (target.kind === SONG) {\n          return goPhase(next, "song-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === WRAP) {',
    '        if (target.kind === SONG) {\n          return goPhase(next, "song-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === LEAF) {\n          return goPhase(next, "leaf-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === WRAP) {',
    "js approach",
)
js = must_replace(js, "    SONG,\n    IGNORE,", "    SONG,\n    LEAF,\n    IGNORE,", "js api LEAF")
js = must_replace(
    js,
    "    songOffPath,\n    pickTarget,",
    "    songOffPath,\n    leafPoint,\n    leafFace,\n    leafOnPath,\n    leafPath,\n    leafHoldPath,\n    leafOffPath,\n    pickTarget,",
    "js api leaf paths",
)

LEAF_FUNCS_JS = """
  function leafPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 30;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.47;
    const leaf = Math.max(78, size * 0.48);
    const gripY = win.y + win.height - leaf;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 22, maxLift) };
  }

  function leafFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function leafOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.92) * 1.12;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 1.85 * (1 - ease) + stride * 0.07,
    };
  }

  function leafPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.34) {
      const s = t / 0.34;
      const ease = s * s * (3 - 2 * s);
      return { x: ease * 0.08, lift: ease * 0.35, rot: ease * -6.4 };
    }
    if (t < 0.72) {
      const s = (t - 0.34) / 0.38;
      const ease = s * s * (3 - 2 * s);
      const wing = Math.sin(s * Math.PI) * 1.6;
      return { x: 0.08 + ease * 0.06 + wing * 0.02, lift: 0.35 + ease * 0.2, rot: -6.4 + ease * 4.8 + wing };
    }
    return { x: 0.14, lift: 0.55, rot: -1.6 };
  }

  function leafHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const green = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.7) * 0.55;
    return { x: 0.14 + green * 0.02, lift: 0.55 + Math.abs(green) * 0.05, rot: -1.6 + green };
  }

  function leafOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.7) * 1.08;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : -1.6) * (1 - ease),
    };
  }


"""

js = must_replace(js, "  function beginPlay(target, petX) {", LEAF_FUNCS_JS + "  function beginPlay(target, petX) {", "js leaf funcs")

TICK_JS = """
    if (next.phase === "leaf-on") {
      const face = leafFace(target);
      const u = next.t / DUR.leafOn;
      const pose = leafOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "leaf", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "leaf") {
      const face = leafFace(target);
      const pose = leafPath(Math.min(1, next.t / DUR.leaf));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.leaf) {
        return goPhase(next, "leaf-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "leaf-hold") {
      const face = leafFace(target);
      const pose = leafHoldPath(Math.min(1, next.t / DUR.leafHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.leafHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = leafHoldPath(1);
        return goPhase(next, "leaf-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "leaf-off") {
      const u = next.t / DUR.leafOff;
      const pose = leafOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

"""

js = must_replace(js, '    if (next.phase === "sill-hop") {', TICK_JS + '    if (next.phase === "sill-hop") {', "js tick")
save("desktop/renderer/window-play.js", js, nl)
print("js ok")
