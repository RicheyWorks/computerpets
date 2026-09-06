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
    "Seven spots a window-box leaf as a leaf dish: walk onto the leaf, sit the spot, then leave. "
    "Haste still owns hunt. Disc still owns snip. Thrum still owns forage. Sip still owns sip. Comb still owns waggle. "
    "This is the eighth leftover of the remaining hive den."
)
HEADER_NEW = HEADER + (
    " Fold prays a window-box stem as a green hinge: walk onto the stem, sit the pray, then leave. "
    "Cape still owns fold. Bat still owns fold. Stem still owns stilt. Twig still owns freeze. Still still owns creep. "
    "Hang still owns reach. Snap still owns count. Haste still owns hunt. Seven still owns spot. "
    "This is the ninth leftover of the remaining hive den."
)

js, nl = load("desktop/renderer/window-play.js")
js = must_replace(js, HEADER, HEADER_NEW, "js header")
js = must_replace(
    js,
    '  const SPOT = "spot";\n  const SILL = "sill";',
    '  const SPOT = "spot";\n  const PRAY = "pray";\n  const SILL = "sill";',
    "js PRAY const",
)
js = must_replace(
    js,
    "    spotOff: 2.28,\n    sillHop: 0.38,",
    "    spotOff: 2.28,\n    prayOn: 2.96,\n    pray: 3.28,\n    prayHold: 4.06,\n    prayOff: 2.42,\n    sillHop: 0.38,",
    "js DUR",
)
js = must_replace(
    js,
    '    if (key === "ladybird") return SPOT;\n    return SILL;',
    '    if (key === "ladybird") return SPOT;\n    if (key === "mantis") return PRAY;\n    return SILL;',
    "js playFor",
)
js = must_replace(
    js,
    "    if (kind === SPOT) return w.width >= 186 && w.height >= 170;\n    return w.width >= 180 && w.height >= 70;",
    "    if (kind === SPOT) return w.width >= 186 && w.height >= 170;\n    if (kind === PRAY) return w.width >= 184 && w.height >= 178;\n    return w.width >= 180 && w.height >= 70;",
    "js size gate",
)
js = must_replace(
    js,
    '        leave: "spotted",\n        spin: "none",\n      };\n    }\n\n\n\n        if (kind === WRAP) {',
    '        leave: "spotted",\n        spin: "none",\n      };\n    }\n\n    if (kind === PRAY) {\n      const hold = prayPoint(best, size, work);\n      const approachOff = hold.x < workW / 2 ? -44 : 44;\n      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));\n      const away = hold.x < workW / 2 ? 36 : -36;\n      return {\n        id: best.id,\n        kind,\n        side: "greenhinge",\n        holdX: hold.x,\n        holdLift: hold.lift,\n        approachX,\n        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),\n        leave: "prayed",\n        spin: "none",\n      };\n    }\n\n\n\n        if (kind === WRAP) {',
    "js pickTarget",
)
js = must_replace(
    js,
    "    if (target.kind === SPOT) {\n      const hold = spotPoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === BURY) {",
    "    if (target.kind === SPOT) {\n      const hold = spotPoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === PRAY) {\n      const hold = prayPoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === BURY) {",
    "js refit",
)
js = must_replace(
    js,
    '        if (target.kind === SPOT) {\n          return goPhase(next, "spot-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === WRAP) {',
    '        if (target.kind === SPOT) {\n          return goPhase(next, "spot-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === PRAY) {\n          return goPhase(next, "pray-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === WRAP) {',
    "js approach",
)
js = must_replace(js, "    SPOT,\n    IGNORE,", "    SPOT,\n    PRAY,\n    IGNORE,", "js api PRAY")
js = must_replace(
    js,
    "    spotOffPath,\n    pickTarget,",
    "    spotOffPath,\n    prayPoint,\n    prayFace,\n    prayOnPath,\n    prayPath,\n    prayHoldPath,\n    prayOffPath,\n    pickTarget,",
    "js api pray paths",
)

PRAY_FUNCS_JS = """
  function prayPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 42;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.58;
    const stem = Math.max(54, size * 0.36);
    const gripY = win.y + win.height - stem;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 22, maxLift) };
  }

  function prayFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function prayOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 2.08) * 1.36;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 3.62 * (1 - ease) + stride * 0.14,
    };
  }

  function prayPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.34) {
      const s = t / 0.34;
      const ease = s * s * (3 - 2 * s);
      return { x: ease * 0.7, lift: ease * 5.4, rot: ease * 18.8 };
    }
    if (t < 0.70) {
      const s = (t - 0.34) / 0.36;
      const ease = s * s * (3 - 2 * s);
      const hinge = Math.sin(s * Math.PI * 1.6) * 0.35;
      return { x: 0.7 + hinge, lift: 5.4 + ease * 1.2, rot: 18.8 + ease * 7.4 };
    }
    return { x: 0.55, lift: 6.6, rot: 26.2 };
  }

  function prayHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const watch = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.2) * 0.16;
    return { x: 0.55 + watch, lift: 6.6, rot: 26.2 };
  }

  function prayOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.94) * 1.48;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : 26.2) * (1 - ease),
    };
  }


"""

js = must_replace(js, "  function beginPlay(target, petX) {", PRAY_FUNCS_JS + "  function beginPlay(target, petX) {", "js pray funcs")

TICK_JS = '''
    if (next.phase === "pray-on") {
      const face = prayFace(target);
      const u = next.t / DUR.prayOn;
      const pose = prayOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "pray", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "pray") {
      const face = prayFace(target);
      const pose = prayPath(Math.min(1, next.t / DUR.pray));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.pray) {
        return goPhase(next, "pray-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "pray-hold") {
      const face = prayFace(target);
      const pose = prayHoldPath(Math.min(1, next.t / DUR.prayHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.prayHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = prayHoldPath(1);
        return goPhase(next, "pray-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "pray-off") {
      const u = next.t / DUR.prayOff;
      const pose = prayOffPath(Math.min(1, u), next.from, next.to);
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
