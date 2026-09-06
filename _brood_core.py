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
    "Fold prays a window-box stem as a green hinge: walk onto the stem, sit the pray, then leave. "
    "Cape still owns fold. Bat still owns fold. Stem still owns stilt. Twig still owns freeze. Still still owns creep. "
    "Hang still owns reach. Snap still owns count. Haste still owns hunt. Seven still owns spot. "
    "This is the ninth leftover of the remaining hive den."
)
HEADER_NEW = HEADER + (
    " Brood emerges a window foot as a soil husk: walk onto the foot, sit, burst, sit the husk, then leave. "
    "Heap still owns castings. Hop still owns spring. Lid still owns shut. Prowl still owns carry. "
    "Fold still owns pray. Seven still owns spot. Drum still owns drum. Hum still owns drone. Thrum still owns forage. "
    "This is the tenth leftover of the remaining hive den and closes hive ten."
)

js, nl = load("desktop/renderer/window-play.js")
js = must_replace(js, HEADER, HEADER_NEW, "js header")
js = must_replace(
    js,
    '  const PRAY = "pray";\n  const SILL = "sill";',
    '  const PRAY = "pray";\n  const EMERGE = "emerge";\n  const SILL = "sill";',
    "js EMERGE const",
)
js = must_replace(
    js,
    "    prayOff: 2.42,\n    sillHop: 0.38,",
    "    prayOff: 2.42,\n    emergeOn: 3.05,\n    emerge: 2.74,\n    emergeHold: 3.88,\n    emergeOff: 2.51,\n    sillHop: 0.38,",
    "js DUR",
)
js = must_replace(
    js,
    '    if (key === "mantis") return PRAY;\n    return SILL;',
    '    if (key === "mantis") return PRAY;\n    if (key === "cicada") return EMERGE;\n    return SILL;',
    "js playFor",
)
js = must_replace(
    js,
    "    if (kind === PRAY) return w.width >= 184 && w.height >= 178;\n    return w.width >= 180 && w.height >= 70;",
    "    if (kind === PRAY) return w.width >= 184 && w.height >= 178;\n    if (kind === EMERGE) return w.width >= 168 && w.height >= 74;\n    return w.width >= 180 && w.height >= 70;",
    "js size gate",
)
js = must_replace(
    js,
    '        leave: "prayed",\n        spin: "none",\n      };\n    }\n\n\n\n        if (kind === WRAP) {',
    '        leave: "prayed",\n        spin: "none",\n      };\n    }\n\n    if (kind === EMERGE) {\n      const hold = emergePoint(best, size, work);\n      const approachOff = hold.x < workW / 2 ? -40 : 40;\n      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));\n      const away = hold.x < workW / 2 ? 34 : -34;\n      return {\n        id: best.id,\n        kind,\n        side: "soilhusk",\n        holdX: hold.x,\n        holdLift: hold.lift,\n        approachX,\n        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),\n        leave: "emerged",\n        spin: "none",\n      };\n    }\n\n\n\n        if (kind === WRAP) {',
    "js pickTarget",
)
js = must_replace(
    js,
    "    if (target.kind === PRAY) {\n      const hold = prayPoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === BURY) {",
    "    if (target.kind === PRAY) {\n      const hold = prayPoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === EMERGE) {\n      const hold = emergePoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === BURY) {",
    "js refit",
)
js = must_replace(
    js,
    '        if (target.kind === PRAY) {\n          return goPhase(next, "pray-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === WRAP) {',
    '        if (target.kind === PRAY) {\n          return goPhase(next, "pray-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === EMERGE) {\n          return goPhase(next, "emerge-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === WRAP) {',
    "js approach",
)
js = must_replace(js, "    PRAY,\n    IGNORE,", "    PRAY,\n    EMERGE,\n    IGNORE,", "js api EMERGE")
js = must_replace(
    js,
    "    prayOffPath,\n    pickTarget,",
    "    prayOffPath,\n    emergePoint,\n    emergeFace,\n    emergeOnPath,\n    emergePath,\n    emergeHoldPath,\n    emergeOffPath,\n    pickTarget,",
    "js api emerge paths",
)

EMERGE_FUNCS_JS = """
  function emergePoint(win, sprite, _work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 28;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.44;
    return { x, lift: 0 };
  }

  function emergeFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function emergeOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.88) * 1.12;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 2.48 * (1 - ease) + stride * 0.11,
    };
  }

  function emergePath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.30) {
      const s = t / 0.30;
      const ease = s * s * (3 - 2 * s);
      return { x: ease * 0.2, lift: ease * 0.4, rot: ease * -2.4 };
    }
    if (t < 0.68) {
      const s = (t - 0.30) / 0.38;
      const ease = s * s * (3 - 2 * s);
      const burst = Math.sin(s * Math.PI) * 4.8;
      return { x: 0.2 + ease * 0.35, lift: 0.4 + ease * 7.2 + burst * 0.15, rot: -2.4 + ease * 14.6 };
    }
    return { x: 0.42, lift: 7.6, rot: 12.2 };
  }

  function emergeHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const relic = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 0.9) * 0.12;
    return { x: 0.42 + relic, lift: 7.6, rot: 12.2 };
  }

  function emergeOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.76) * 1.22;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : 12.2) * (1 - ease),
    };
  }


"""

js = must_replace(js, "  function beginPlay(target, petX) {", EMERGE_FUNCS_JS + "  function beginPlay(target, petX) {", "js emerge funcs")

TICK_JS = '''
    if (next.phase === "emerge-on") {
      const face = emergeFace(target);
      const u = next.t / DUR.emergeOn;
      const pose = emergeOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "emerge", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "emerge") {
      const face = emergeFace(target);
      const pose = emergePath(Math.min(1, next.t / DUR.emerge));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.emerge) {
        return goPhase(next, "emerge-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "emerge-hold") {
      const face = emergeFace(target);
      const pose = emergeHoldPath(Math.min(1, next.t / DUR.emergeHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.emergeHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = emergeHoldPath(1);
        return goPhase(next, "emerge-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "emerge-off") {
      const u = next.t / DUR.emergeOff;
      const pose = emergeOffPath(Math.min(1, u), next.from, next.to);
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
