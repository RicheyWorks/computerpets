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
    "Twig freezes a sash muntin as a pencil stem: walk onto the muntin, sit the freeze, then leave. "
    "Still still owns creep. Hang still owns reach. Stem still owns stilt. Anchor still owns hitch. "
    "This is the sixth leftover of the remaining hive den."
)
HEADER_NEW = HEADER + (
    " Column nests a sash stile as a timber gallery: walk onto the stile, sit the nest, then leave. "
    "Auger still owns bore. Dam still owns gnaw. Bank still owns dig. Twig still owns freeze. Dart still owns hawk. "
    "This is the seventh leftover of the remaining hive den."
)

js, nl = load("desktop/renderer/window-play.js")
js = must_replace(js, HEADER, HEADER_NEW, "js header")
js = must_replace(
    js,
    '  const FREEZE = "freeze";\n  const SILL = "sill";',
    '  const FREEZE = "freeze";\n  const NEST = "nest";\n  const SILL = "sill";',
    "js NEST const",
)
js = must_replace(
    js,
    "    freezeOff: 2.74,\n    sillHop: 0.38,",
    "    freezeOff: 2.74,\n    nestOn: 2.84,\n    nest: 3.66,\n    nestHold: 4.22,\n    nestOff: 2.18,\n    sillHop: 0.38,",
    "js DUR",
)
js = must_replace(
    js,
    '    if (key === "stick") return FREEZE;\n    return SILL;',
    '    if (key === "stick") return FREEZE;\n    if (key === "carpenter_ant") return NEST;\n    return SILL;',
    "js playFor",
)
js = must_replace(
    js,
    "    if (kind === FREEZE) return w.width >= 196 && w.height >= 188;\n    return w.width >= 180 && w.height >= 70;",
    "    if (kind === FREEZE) return w.width >= 196 && w.height >= 188;\n    if (kind === NEST) return w.width >= 188 && w.height >= 200;\n    return w.width >= 180 && w.height >= 70;",
    "js size gate",
)
js = must_replace(
    js,
    '        leave: "froze",\n        spin: "none",\n      };\n    }\n\n\n\n        if (kind === WRAP) {',
    '        leave: "froze",\n        spin: "none",\n      };\n    }\n\n    if (kind === NEST) {\n      const hold = nestPoint(best, size, work);\n      const approachOff = hold.x < workW / 2 ? -48 : 48;\n      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));\n      const away = hold.x < workW / 2 ? 40 : -40;\n      return {\n        id: best.id,\n        kind,\n        side: "timbergallery",\n        holdX: hold.x,\n        holdLift: hold.lift,\n        approachX,\n        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),\n        leave: "nested",\n        spin: "none",\n      };\n    }\n\n\n\n        if (kind === WRAP) {',
    "js pickTarget",
)
js = must_replace(
    js,
    "    if (target.kind === FREEZE) {\n      const hold = freezePoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === BURY) {",
    "    if (target.kind === FREEZE) {\n      const hold = freezePoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === NEST) {\n      const hold = nestPoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === BURY) {",
    "js refit",
)
js = must_replace(
    js,
    '        if (target.kind === FREEZE) {\n          return goPhase(next, "freeze-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === WRAP) {',
    '        if (target.kind === FREEZE) {\n          return goPhase(next, "freeze-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === NEST) {\n          return goPhase(next, "nest-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === WRAP) {',
    "js approach",
)
js = must_replace(js, "    FREEZE,\n    IGNORE,", "    FREEZE,\n    NEST,\n    IGNORE,", "js api NEST")
js = must_replace(
    js,
    "    freezeOffPath,\n    pickTarget,",
    "    freezeOffPath,\n    nestPoint,\n    nestFace,\n    nestOnPath,\n    nestPath,\n    nestHoldPath,\n    nestOffPath,\n    pickTarget,",
    "js api nest paths",
)

NEST_FUNCS_JS = """
  function nestPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const span = Math.max(0, win.width - size);
    const x = win.x + span * 0.14;
    const gallery = Math.max(48, win.height * 0.38);
    const gripY = win.y + gallery + win.height * 0.08;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 40, maxLift) };
  }

  function nestFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function nestOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 2.08) * 1.42;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 3.18 * (1 - ease) + stride * 0.12,
    };
  }

  function nestPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.28) {
      const s = t / 0.28;
      const ease = s * s * (3 - 2 * s);
      return { x: ease * 1.6, lift: ease * 2.2, rot: ease * -9.4 };
    }
    if (t < 0.62) {
      const s = (t - 0.28) / 0.34;
      const ease = s * s * (3 - 2 * s);
      const grain = Math.sin(s * Math.PI * 2.4) * 0.9;
      return { x: 1.6 + grain, lift: 2.2 - ease * 0.4, rot: -9.4 + ease * -4.6 };
    }
    return { x: 1.2, lift: 1.8, rot: -14 };
  }

  function nestHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const scent = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.6) * 0.22;
    return { x: 1.2 + scent, lift: 1.8, rot: -14 };
  }

  function nestOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.92) * 1.68;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : -14) * (1 - ease),
    };
  }


"""

js = must_replace(js, "  function beginPlay(target, petX) {", NEST_FUNCS_JS + "  function beginPlay(target, petX) {", "js nest funcs")

TICK_JS = '''
    if (next.phase === "nest-on") {
      const face = nestFace(target);
      const u = next.t / DUR.nestOn;
      const pose = nestOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "nest", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "nest") {
      const face = nestFace(target);
      const pose = nestPath(Math.min(1, next.t / DUR.nest));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.nest) {
        return goPhase(next, "nest-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "nest-hold") {
      const face = nestFace(target);
      const pose = nestHoldPath(Math.min(1, next.t / DUR.nestHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.nestHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = nestHoldPath(1);
        return goPhase(next, "nest-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "nest-off") {
      const u = next.t / DUR.nestOff;
      const pose = nestOffPath(Math.min(1, u), next.from, next.to);
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
