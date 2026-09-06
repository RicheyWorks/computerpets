# -*- coding: utf-8 -*-
"""Apply Rob seize leftover across house files (mirror Click #509)."""
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

def replace_all(text, old, new, label, expect=None):
    n = text.count(old)
    if expect is not None and n != expect:
        raise SystemExit("COUNT %s want %s for %s" % (n, expect, label))
    if n == 0:
        raise SystemExit("MISSING: " + label)
    return text.replace(old, new)

HEADER_OLD_TAIL = (
    " Click rights a window stool as a bark plate: walk onto the stool, sit, right once, sit the plate, then leave. "
    "Snout still owns drill. Relay still owns click. Snap still owns count. Bluff still owns flip. Spark the firefly still owns glow. "
    "This is the ninth leftover of the meadow den. Others walk a sill. */"
)

HEADER_NEW_TAIL = (
    " Click rights a window stool as a bark plate: walk onto the stool, sit, right once, sit the plate, then leave. "
    "Snout still owns drill. Relay still owns click. Snap still owns count. Bluff still owns flip. Spark the firefly still owns glow. "
    "This is the ninth leftover of the meadow den. "
    "Rob seizes a window stool as a grass perch: walk onto the stool, sit, seize once, sit the perch, then leave. "
    "Click still owns right. Relay still owns click. Haste still owns hunt. Dart still owns hawk. Sip still owns sip. Thrum still owns forage. Spine still owns bristle. Hook still owns soar. Leap still owns pounce. Hum still owns drone. "
    "This is the tenth leftover of the meadow den and closes meadow ten. Others walk a sill. */"
)

SEIZE_FNS = r'''
  function seizePoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 31;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.55;
    const perch = Math.max(17, size * 0.115);
    const gripY = win.y + win.height - perch;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 16, maxLift) };
  }

  function seizeFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function seizeOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.74) * 1.08;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 1.9 * (1 - ease) + stride * 0.08,
    };
  }

  function seizePath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.14) {
      const s = t / 0.14;
      const ease = s * s * (3 - 2 * s);
      // lean from the grass perch — not Haste's crack, not Dart's air, not Hook's stoop
      return { x: ease * 0.08, lift: ease * 0.35, rot: ease * -6.5 };
    }
    if (t < 0.42) {
      const s = (t - 0.14) / 0.28;
      const dart = Math.sin(s * Math.PI);
      // seize the take once — not hunt, not hawk, not pounce, not sip, not forage, not right
      return { x: 0.08 + dart * 18.4, lift: 0.35 + dart * 3.6, rot: -6.5 + dart * 9.2 };
    }
    if (t < 0.72) {
      const s = (t - 0.42) / 0.3;
      const ease = s * s * (3 - 2 * s);
      return { x: 18.48 - ease * 18.2, lift: 3.95 - ease * 3.2, rot: 2.7 - ease * 5.1 };
    }
    return { x: 0.28, lift: 0.75, rot: -2.4 };
  }

  function seizeHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.09;
    return { x: 0.28, lift: 0.75 + hush, rot: -2.4 };
  }

  function seizeOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.48) * 1.1;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : -2.4) * (1 - ease),
    };
  }

'''

def patch_js():
    text, nl = load("desktop/renderer/window-play.js")
    text = must_replace(text, HEADER_OLD_TAIL, HEADER_NEW_TAIL, "js header")
    text = must_replace(
        text,
        '  const RIGHT = "right";\n  const SILL = "sill";',
        '  const RIGHT = "right";\n  const SEIZE = "seize";\n  const SILL = "sill";',
        "js SEIZE const",
    )
    text = must_replace(
        text,
        "    rightOn: 2.64,\n    right: 1.92,\n    rightHold: 4.16,\n    rightOff: 2.56,",
        "    rightOn: 2.64,\n    right: 1.92,\n    rightHold: 4.16,\n    rightOff: 2.56,\n    seizeOn: 2.58,\n    seize: 1.68,\n    seizeHold: 4.05,\n    seizeOff: 2.48,",
        "js DUR seize",
    )
    text = must_replace(
        text,
        '    if (key === "click_beetle") return RIGHT;\n    return SILL;',
        '    if (key === "click_beetle") return RIGHT;\n    if (key === "robber_fly") return SEIZE;\n    return SILL;',
        "js playFor robber_fly",
    )
    text = must_replace(
        text,
        "    if (kind === RIGHT) return w.width >= 184 && w.height >= 152;",
        "    if (kind === RIGHT) return w.width >= 184 && w.height >= 152;\n    if (kind === SEIZE) return w.width >= 184 && w.height >= 152;",
        "js size gate",
    )
    # pickTarget block after RIGHT
    right_pick = """    if (kind === RIGHT) {
      const hold = rightPoint(best, size, work);
      const approachOff = hold.x < workW / 2 ? -32 : 32;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 26 : -26;
      return {
        id: best.id,
        kind,
        side: "barkplate",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "righted",
        spin: "none",
      };
    }"""
    seize_pick = right_pick + """

    if (kind === SEIZE) {
      const hold = seizePoint(best, size, work);
      const approachOff = hold.x < workW / 2 ? -30 : 30;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 28 : -28;
      return {
        id: best.id,
        kind,
        side: "grassperch",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "seized",
        spin: "none",
      };
    }"""
    text = must_replace(text, right_pick, seize_pick, "js pickTarget SEIZE")

    right_refit = """    if (target.kind === RIGHT) {
      const hold = rightPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }"""
    seize_refit = right_refit + """

    if (target.kind === SEIZE) {
      const hold = seizePoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }"""
    text = must_replace(text, right_refit, seize_refit, "js refit SEIZE")

    # insert functions before beginPlay
    text = must_replace(
        text,
        "  function beginPlay(target, petX) {",
        SEIZE_FNS + "  function beginPlay(target, petX) {",
        "js seize fns",
    )

    # approach branch
    right_approach = """        if (target.kind === RIGHT) {
          return goPhase(next, "right-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }"""
    seize_approach = right_approach + """

        if (target.kind === SEIZE) {
          return goPhase(next, "seize-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }"""
    text = must_replace(text, right_approach, seize_approach, "js approach SEIZE")

    right_phases = """    if (next.phase === "right-on") {
      const face = rightFace(target);
      const u = next.t / DUR.rightOn;
      const pose = rightOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot * face;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "right", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "right") {
      const face = rightFace(target);
      const pose = rightPath(Math.min(1, next.t / DUR.right));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.right) {
        return goPhase(next, "right-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "right-hold") {
      const face = rightFace(target);
      const pose = rightHoldPath(Math.min(1, next.t / DUR.rightHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.rightHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = rightHoldPath(1);
        return goPhase(next, "right-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "right-off") {
      const u = next.t / DUR.rightOff;
      const pose = rightOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }"""

    seize_phases = right_phases + """

    if (next.phase === "seize-on") {
      const face = seizeFace(target);
      const u = next.t / DUR.seizeOn;
      const pose = seizeOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot * face;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "seize", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "seize") {
      const face = seizeFace(target);
      const pose = seizePath(Math.min(1, next.t / DUR.seize));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.seize) {
        return goPhase(next, "seize-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "seize-hold") {
      const face = seizeFace(target);
      const pose = seizeHoldPath(Math.min(1, next.t / DUR.seizeHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.seizeHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = seizeHoldPath(1);
        return goPhase(next, "seize-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "seize-off") {
      const u = next.t / DUR.seizeOff;
      const pose = seizeOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }"""
    text = must_replace(text, right_phases, seize_phases, "js seize phases")

    text = must_replace(
        text,
        "    RIGHT,\n    IGNORE,",
        "    RIGHT,\n    SEIZE,\n    IGNORE,",
        "js SEIZE export const",
    )
    text = must_replace(
        text,
        "    drillOffPath,\n    rightPoint,\n    rightFace,\n    rightOnPath,\n    rightPath,\n    rightHoldPath,\n    rightOffPath,\n    pickTarget,",
        "    drillOffPath,\n    rightPoint,\n    rightFace,\n    rightOnPath,\n    rightPath,\n    rightHoldPath,\n    rightOffPath,\n    seizePoint,\n    seizeFace,\n    seizeOnPath,\n    seizePath,\n    seizeHoldPath,\n    seizeOffPath,\n    pickTarget,",
        "js seize fn exports",
    )
    save("desktop/renderer/window-play.js", text, nl)
    print("ok js")

patch_js()
print("core js done")
