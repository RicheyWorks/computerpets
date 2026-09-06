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
    "Ghost weeks a lamp-side glass as lamp dusk: walk onto the glass, sit the week, then leave. "
    "Night still owns dusk. Moth still owns mount. Milk still owns weed. "
    "This is the third leftover of the remaining hive den."
)
HEADER_NEW = HEADER + (
    " Spark the firefly glows a lower sash light as ink dusk: walk onto the light, sit the glow, then leave. "
    "The dragon Spark still crackles an edge. Wink still owns flash. Ghost still owns week. "
    "This is the fourth leftover of the remaining hive den."
)

js, nl = load("desktop/renderer/window-play.js")
js = must_replace(js, HEADER, HEADER_NEW, "js header")
js = must_replace(js, '  const WEEK = "week";\n  const SILL = "sill";', '  const WEEK = "week";\n  const GLOW = "glow";\n  const SILL = "sill";', "js GLOW const")
js = must_replace(js, "    weekOff: 2.58,\n    sillHop: 0.38,", "    weekOff: 2.58,\n    glowOn: 3.48,\n    glow: 2.26,\n    glowHold: 3.91,\n    glowOff: 2.65,\n    sillHop: 0.38,", "js DUR")
js = must_replace(js, '    if (key === "luna") return WEEK;\n    return SILL;', '    if (key === "luna") return WEEK;\n    if (key === "firefly") return GLOW;\n    return SILL;', "js playFor")
js = must_replace(js, "    if (kind === WEEK) return w.width >= 200 && w.height >= 200;\n    return w.width >= 180 && w.height >= 70;", "    if (kind === WEEK) return w.width >= 200 && w.height >= 200;\n    if (kind === GLOW) return w.width >= 189 && w.height >= 173;\n    return w.width >= 180 && w.height >= 70;", "js size gate")
js = must_replace(
    js,
    '        leave: "weeked",\n        spin: "none",\n      };\n    }\n\n\n\n        if (kind === WRAP) {',
    '        leave: "weeked",\n        spin: "none",\n      };\n    }\n\n    if (kind === GLOW) {\n      const hold = glowPoint(best, size, work);\n      const approachOff = hold.x < workW / 2 ? -55 : 55;\n      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));\n      const away = hold.x < workW / 2 ? 46 : -46;\n      return {\n        id: best.id,\n        kind,\n        side: "inkdusk",\n        holdX: hold.x,\n        holdLift: hold.lift,\n        approachX,\n        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),\n        leave: "glowed",\n        spin: "none",\n      };\n    }\n\n\n\n        if (kind === WRAP) {',
    "js pickTarget",
)
js = must_replace(
    js,
    "    if (target.kind === WEEK) {\n      const hold = weekPoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === BURY) {",
    "    if (target.kind === WEEK) {\n      const hold = weekPoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === GLOW) {\n      const hold = glowPoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === BURY) {",
    "js refit",
)
js = must_replace(
    js,
    '        if (target.kind === WEEK) {\n          return goPhase(next, "week-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === WRAP) {',
    '        if (target.kind === WEEK) {\n          return goPhase(next, "week-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === GLOW) {\n          return goPhase(next, "glow-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === WRAP) {',
    "js approach",
)
js = must_replace(js, "    WEEK,\n    IGNORE,", "    WEEK,\n    GLOW,\n    IGNORE,", "js api GLOW")
js = must_replace(
    js,
    "    weekOffPath,\n    pickTarget,",
    "    weekOffPath,\n    glowPoint,\n    glowFace,\n    glowOnPath,\n    glowPath,\n    glowHoldPath,\n    glowOffPath,\n    pickTarget,",
    "js api glow paths",
)

GLOW_FUNCS_JS = """
  function glowPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 34;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.49;
    const dusk = Math.max(92, win.height * 0.58);
    const gripY = win.y + dusk;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 28, maxLift) };
  }

  function glowFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function glowOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 2.16) * 2.68;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 2.74 * (1 - ease) + stride * 0.11,
    };
  }

  function glowPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.28) {
      const s = t / 0.28;
      const ease = s * s * (3 - 2 * s);
      return { x: ease * 0.7, lift: ease * 7.2, rot: ease * 2.6 };
    }
    if (t < 0.52) {
      const s = (t - 0.28) / 0.24;
      const ease = s * s * (3 - 2 * s);
      return { x: 0.7, lift: 7.2 - ease * 3.4, rot: 2.6 };
    }
    if (t < 0.80) {
      const s = (t - 0.52) / 0.28;
      const flash = Math.sin(s * Math.PI);
      return { x: 0.7 + flash * 0.4, lift: 3.8 + flash * 5.6, rot: 2.6 + flash * 1.2 };
    }
    return { x: 0.9, lift: 4.4, rot: 3.2 };
  }

  function glowHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.34;
    return { x: 0.9, lift: 4.4 + hush, rot: 3.2 };
  }

  function glowOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.72) * 2.28;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : 3.2) * (1 - ease),
    };
  }


"""

js = must_replace(js, "  function beginPlay(target, petX) {", GLOW_FUNCS_JS + "  function beginPlay(target, petX) {", "js glow funcs")

TICK_JS = '''
    if (next.phase === "glow-on") {
      const face = glowFace(target);
      const u = next.t / DUR.glowOn;
      const pose = glowOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "glow", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "glow") {
      const face = glowFace(target);
      const pose = glowPath(Math.min(1, next.t / DUR.glow));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.glow) {
        return goPhase(next, "glow-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "glow-hold") {
      const face = glowFace(target);
      const pose = glowHoldPath(Math.min(1, next.t / DUR.glowHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.glowHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = glowHoldPath(1);
        return goPhase(next, "glow-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "glow-off") {
      const u = next.t / DUR.glowOff;
      const pose = glowOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

'''

js = must_replace(js, '    if (next.phase === "sill-hop") {', TICK_JS + '    if (next.phase === "sill-hop") {', "js tick")
save("desktop/renderer/window-play.js", js, nl)
print("js ok")
