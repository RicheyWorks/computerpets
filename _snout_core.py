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
    "Forceps cercis a window stool as a bark dish: walk onto the stool, sit, raise the cerci once, sit the dish, then leave. "
    "Lace still owns net. Jewel still owns black. Fold still owns pray. Pinch still owns claw. Barb still owns raise. "
    "This is the seventh leftover of the meadow den."
)
HEADER_NEW = HEADER + (
    " Snout drills a window stool as an acorn cup: walk onto the stool, sit, drill once, sit the cup, then leave. "
    "Forceps still owns cerci. Mast still owns seed. Auger still owns bore. Dee still owns cache. Cup still owns lid. "
    "This is the eighth leftover of the meadow den."
)

DRILL_FNS = """
  function drillPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 34;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.34;
    const cup = Math.max(20, size * 0.13);
    const gripY = win.y + win.height - cup;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 16, maxLift) };
  }

  function drillFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function drillOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.76) * 1.08;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 1.92 * (1 - ease) + stride * 0.08,
    };
  }

  function drillPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.14) {
      const s = t / 0.14;
      const ease = s * s * (3 - 2 * s);
      return { x: ease * 0.06, lift: ease * 0.28, rot: ease * -2.2 };
    }
    if (t < 0.56) {
      const s = (t - 0.14) / 0.42;
      const grind = Math.sin(s * Math.PI * 3.2);
      // snout drills the acorn cup — not Auger bore, not Mast seed, not Forceps cerci, not a bee
      return { x: 0.06 + grind * 0.18, lift: 0.28 - Math.abs(grind) * 1.84, rot: -2.2 + grind * 7.6 };
    }
    if (t < 0.8) {
      const s = (t - 0.56) / 0.24;
      const ease = s * s * (3 - 2 * s);
      return { x: 0.06 + ease * 0.08, lift: -1.56 + ease * 2.22, rot: 5.4 - ease * 7.2 };
    }
    return { x: 0.14, lift: 0.66, rot: -1.8 };
  }

  function drillHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.08;
    return { x: 0.14, lift: 0.66 + hush, rot: -1.8 };
  }

  function drillOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.58) * 1.1;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : -1.8) * (1 - ease),
    };
  }

"""

DRILL_PHASES = """
    if (next.phase === "drill-on") {
      const face = drillFace(target);
      const u = next.t / DUR.drillOn;
      const pose = drillOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot * face;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "drill", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "drill") {
      const face = drillFace(target);
      const pose = drillPath(Math.min(1, next.t / DUR.drill));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.drill) {
        return goPhase(next, "drill-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "drill-hold") {
      const face = drillFace(target);
      const pose = drillHoldPath(Math.min(1, next.t / DUR.drillHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.drillHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = drillHoldPath(1);
        return goPhase(next, "drill-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "drill-off") {
      const u = next.t / DUR.drillOff;
      const pose = drillOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

"""

js, nl = load("desktop/renderer/window-play.js")
js = must_replace(js, HEADER, HEADER_NEW, "js header")
js = must_replace(js, '  const CERCI = "cerci";\n  const SILL = "sill";', '  const CERCI = "cerci";\n  const DRILL = "drill";\n  const SILL = "sill";', "js DRILL const")
js = must_replace(js, "    cerciOff: 2.52,\n    sillHop: 0.38,", "    cerciOff: 2.52,\n    drillOn: 2.72,\n    drill: 2.48,\n    drillHold: 3.92,\n    drillOff: 2.58,\n    sillHop: 0.38,", "js DUR")
js = must_replace(js, '    if (key === "earwig") return CERCI;\n    return SILL;', '    if (key === "earwig") return CERCI;\n    if (key === "acorn_weevil") return DRILL;\n    return SILL;', "js playFor")
js = must_replace(js, "    if (kind === CERCI) return w.width >= 188 && w.height >= 154;\n    return w.width >= 180 && w.height >= 70;", "    if (kind === CERCI) return w.width >= 188 && w.height >= 154;\n    if (kind === DRILL) return w.width >= 186 && w.height >= 150;\n    return w.width >= 180 && w.height >= 70;", "js size gate")

PICK_OLD = """    if (kind === CERCI) {
      const hold = cerciPoint(best, size, work);
      const approachOff = hold.x < workW / 2 ? -36 : 36;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 30 : -30;
      return {
        id: best.id,
        kind,
        side: "paperbark",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "cercied",
        spin: "none",
      };
    }
"""

PICK_NEW = PICK_OLD + """
    if (kind === DRILL) {
      const hold = drillPoint(best, size, work);
      const approachOff = hold.x < workW / 2 ? -34 : 34;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 28 : -28;
      return {
        id: best.id,
        kind,
        side: "acorncup",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "drilled",
        spin: "none",
      };
    }
"""
js = must_replace(js, PICK_OLD, PICK_NEW, "js pick DRILL")

REFIT_OLD = """    if (target.kind === CERCI) {
      const hold = cerciPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {
"""
REFIT_NEW = """    if (target.kind === CERCI) {
      const hold = cerciPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === DRILL) {
      const hold = drillPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {
"""
js = must_replace(js, REFIT_OLD, REFIT_NEW, "js refit DRILL")

GO_OLD = """        if (target.kind === CERCI) {
          return goPhase(next, "cerci-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WRAP) {
"""
GO_NEW = """        if (target.kind === CERCI) {
          return goPhase(next, "cerci-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === DRILL) {
          return goPhase(next, "drill-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WRAP) {
"""
js = must_replace(js, GO_OLD, GO_NEW, "js goPhase DRILL")

marker = "  function beginPlay(target, petX) {"
if js.count(marker) != 1:
    raise SystemExit("beginPlay count %s" % js.count(marker))
js = js.replace(marker, DRILL_FNS + marker, 1)

phase_marker = '    if (next.phase === "sill-hop") {'
if js.count(phase_marker) != 1:
    raise SystemExit("sill-hop count %s" % js.count(phase_marker))
js = js.replace(phase_marker, DRILL_PHASES + phase_marker, 1)

js = must_replace(js, "    NET,\n    CERCI,\n    IGNORE,", "    NET,\n    CERCI,\n    DRILL,\n    IGNORE,", "js export DRILL")
js = must_replace(
    js,
    "    cerciOffPath,\n    pickTarget,",
    "    cerciOffPath,\n    drillPoint,\n    drillFace,\n    drillOnPath,\n    drillPath,\n    drillHoldPath,\n    drillOffPath,\n    pickTarget,",
    "js export drill fns",
)

save("desktop/renderer/window-play.js", js, nl)
print("ok js")
