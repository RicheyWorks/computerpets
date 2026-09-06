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
    "Spark the firefly glows a lower sash light as ink dusk: walk onto the light, sit the glow, then leave. "
    "The dragon Spark still crackles an edge. Wink still owns flash. Ghost still owns week. "
    "This is the fourth leftover of the remaining hive den."
)
HEADER_NEW = HEADER + (
    " Dart hawks a lamp-side air as prey air: walk into the air, sit the hawk, then leave. "
    "Hook still owns soar. Haste still owns hunt. Spark the firefly still owns glow. "
    "This is the fifth leftover of the remaining hive den."
)

js, nl = load("desktop/renderer/window-play.js")
js = must_replace(js, HEADER, HEADER_NEW, "js header")
js = must_replace(js, '  const GLOW = "glow";\n  const SILL = "sill";', '  const GLOW = "glow";\n  const HAWK = "hawk";\n  const SILL = "sill";', "js HAWK const")
js = must_replace(js, "    glowOff: 2.65,\n    sillHop: 0.38,", "    glowOff: 2.65,\n    hawkOn: 3.22,\n    hawk: 2.48,\n    hawkHold: 3.64,\n    hawkOff: 2.41,\n    sillHop: 0.38,", "js DUR")
js = must_replace(js, '    if (key === "firefly") return GLOW;\n    return SILL;', '    if (key === "firefly") return GLOW;\n    if (key === "darner") return HAWK;\n    return SILL;', "js playFor")
js = must_replace(js, "    if (kind === GLOW) return w.width >= 189 && w.height >= 173;\n    return w.width >= 180 && w.height >= 70;", "    if (kind === GLOW) return w.width >= 189 && w.height >= 173;\n    if (kind === HAWK) return w.width >= 200 && w.height >= 210;\n    return w.width >= 180 && w.height >= 70;", "js size gate")
js = must_replace(
    js,
    '        leave: "glowed",\n        spin: "none",\n      };\n    }\n\n\n\n        if (kind === WRAP) {',
    '        leave: "glowed",\n        spin: "none",\n      };\n    }\n\n    if (kind === HAWK) {\n      const hold = hawkPoint(best, size, work);\n      const approachOff = hold.x < workW / 2 ? -58 : 58;\n      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));\n      const away = hold.x < workW / 2 ? 48 : -48;\n      return {\n        id: best.id,\n        kind,\n        side: "preyair",\n        holdX: hold.x,\n        holdLift: hold.lift,\n        approachX,\n        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),\n        leave: "hawked",\n        spin: "none",\n      };\n    }\n\n\n\n        if (kind === WRAP) {',
    "js pickTarget",
)
js = must_replace(
    js,
    "    if (target.kind === GLOW) {\n      const hold = glowPoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === BURY) {",
    "    if (target.kind === GLOW) {\n      const hold = glowPoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === HAWK) {\n      const hold = hawkPoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === BURY) {",
    "js refit",
)
js = must_replace(
    js,
    '        if (target.kind === GLOW) {\n          return goPhase(next, "glow-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === WRAP) {',
    '        if (target.kind === GLOW) {\n          return goPhase(next, "glow-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === HAWK) {\n          return goPhase(next, "hawk-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === WRAP) {',
    "js approach",
)
js = must_replace(js, "    GLOW,\n    IGNORE,", "    GLOW,\n    HAWK,\n    IGNORE,", "js api HAWK")
js = must_replace(
    js,
    "    glowOffPath,\n    pickTarget,",
    "    glowOffPath,\n    hawkPoint,\n    hawkFace,\n    hawkOnPath,\n    hawkPath,\n    hawkHoldPath,\n    hawkOffPath,\n    pickTarget,",
    "js api hawk paths",
)

HAWK_FUNCS_JS = """
  function hawkPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const dir = weekLampDir(win, work);
    const right = dir === 1;
    const airPad = Math.max(56, size * 0.34);
    const x = right ? win.x + win.width - size - airPad : win.x + airPad;
    const air = Math.max(78, win.height * 0.36);
    const gripY = win.y + air;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 34, maxLift) };
  }

  function hawkFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function hawkOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 2.34) * 3.12;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 3.18 * (1 - ease) + stride * 0.14,
    };
  }

  function hawkPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.24) {
      const s = t / 0.24;
      const ease = s * s * (3 - 2 * s);
      return { x: ease * 1.4, lift: ease * 9.6, rot: ease * -4.6 };
    }
    if (t < 0.50) {
      const s = (t - 0.24) / 0.26;
      const ease = s * s * (3 - 2 * s);
      return { x: 1.4 + ease * 7.2, lift: 9.6 - ease * 1.8, rot: -4.6 + ease * 2.8 };
    }
    if (t < 0.76) {
      const s = (t - 0.50) / 0.26;
      const snap = Math.sin(s * Math.PI);
      return { x: 8.6 - snap * 2.4, lift: 7.8 - snap * 6.8, rot: -1.8 + snap * 9.2 };
    }
    return { x: 5.8, lift: 8.4, rot: -2.6 };
  }

  function hawkHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.42;
    return { x: 5.8, lift: 8.4 + hush, rot: -2.6 };
  }

  function hawkOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.86) * 2.64;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : -2.6) * (1 - ease),
    };
  }


"""

js = must_replace(js, "  function beginPlay(target, petX) {", HAWK_FUNCS_JS + "  function beginPlay(target, petX) {", "js hawk funcs")

TICK_JS = '''
    if (next.phase === "hawk-on") {
      const face = hawkFace(target);
      const u = next.t / DUR.hawkOn;
      const pose = hawkOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "hawk", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "hawk") {
      const face = hawkFace(target);
      const pose = hawkPath(Math.min(1, next.t / DUR.hawk));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.hawk) {
        return goPhase(next, "hawk-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "hawk-hold") {
      const face = hawkFace(target);
      const pose = hawkHoldPath(Math.min(1, next.t / DUR.hawkHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.hawkHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = hawkHoldPath(1);
        return goPhase(next, "hawk-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "hawk-off") {
      const u = next.t / DUR.hawkOff;
      const pose = hawkOffPath(Math.min(1, u), next.from, next.to);
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
