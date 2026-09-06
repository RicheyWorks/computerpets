# -*- coding: utf-8 -*-
"""Apply Frill shelf leftover across window-play.js (mirror Rob #510)."""
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

HEADER_OLD_TAIL = (
    " Rob seizes a window stool as a grass perch: walk onto the stool, sit, seize once, sit the perch, then leave. "
    "Click still owns right. Relay still owns click. Haste still owns hunt. Dart still owns hawk. Sip still owns sip. Thrum still owns forage. Spine still owns bristle. Hook still owns soar. Leap still owns pounce. Hum still owns drone. "
    "This is the tenth leftover of the meadow den and closes meadow ten. Others walk a sill. */"
)

HEADER_NEW_TAIL = (
    " Rob seizes a window stool as a grass perch: walk onto the stool, sit, seize once, sit the perch, then leave. "
    "Click still owns right. Relay still owns click. Haste still owns hunt. Dart still owns hawk. Sip still owns sip. Thrum still owns forage. Spine still owns bristle. Hook still owns soar. Leap still owns pounce. Hum still owns drone. "
    "This is the tenth leftover of the meadow den and closes meadow ten. "
    "Frill shelves a sash stile as a timber shelf: walk onto the stile, sit, lean then bracket again, sit the shelf, then leave. "
    "Rob still owns seize. Fan still owns gold. Felt still owns lean. Cape still owns fold. Mast still owns seed. Auger still owns bore. Vein still owns unfurl. "
    "This is the first leftover of the fungi den. Others walk a sill. */"
)

SHELF_FNS = r'''
  function shelfPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 9;
    const span = Math.max(0, win.width - size - pad * 2);
    // left sash stile — timber the bracket shelves; not Auger's far bore, not Felt's meeting rail
    const x = win.x + pad + span * 0.035;
    const timber = Math.max(98, win.height * 0.41);
    const gripY = win.y + timber;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 36, maxLift) };
  }

  function shelfFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function shelfOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.42) * 0.72;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 1.35 * (1 - ease) + stride * 0.05,
    };
  }

  function shelfPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.16) {
      const s = t / 0.16;
      const ease = s * s * (3 - 2 * s);
      // lean from the timber — not Felt's blotter lean, not Fan's gold, not Vein's unfurl
      return { x: ease * 0.55, lift: ease * 0.42, rot: ease * -8.2 };
    }
    if (t < 0.48) {
      const s = (t - 0.16) / 0.32;
      const wave = Math.sin(s * Math.PI);
      // lean then begin the bracket — layers on the grain; shelf is the tell
      return { x: 0.55 + wave * 5.8, lift: 0.42 + wave * 1.55, rot: -8.2 + wave * -4.4 };
    }
    if (t < 0.78) {
      const s = (t - 0.48) / 0.3;
      const ease = s * s * (3 - 2 * s);
      // bracket again — a shelf that eats the dead wood; decomposer, not a plant
      return { x: 6.35 - ease * 5.2, lift: 1.97 - ease * 1.35, rot: -12.6 + ease * 9.1 };
    }
    return { x: 1.15, lift: 0.62, rot: -3.5 };
  }

  function shelfHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.07;
    // sit the timber shelf; papers are a forest begun
    return { x: 1.15, lift: 0.62 + hush, rot: -3.5 };
  }

  function shelfOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.36) * 0.88;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : -3.5) * (1 - ease),
    };
  }

'''

def patch_js():
    text, nl = load("desktop/renderer/window-play.js")
    text = must_replace(text, HEADER_OLD_TAIL, HEADER_NEW_TAIL, "js header")
    text = must_replace(
        text,
        '  const SEIZE = "seize";\n  const SILL = "sill";',
        '  const SEIZE = "seize";\n  const SHELF = "shelf";\n  const SILL = "sill";',
        "js SHELF const",
    )
    text = must_replace(
        text,
        "    seizeOn: 2.58,\n    seize: 1.68,\n    seizeHold: 4.05,\n    seizeOff: 2.48,",
        "    seizeOn: 2.58,\n    seize: 1.68,\n    seizeHold: 4.05,\n    seizeOff: 2.48,\n    shelfOn: 2.72,\n    shelf: 2.05,\n    shelfHold: 4.35,\n    shelfOff: 2.62,",
        "js DUR shelf",
    )
    text = must_replace(
        text,
        '    if (key === "robber_fly") return SEIZE;\n    return SILL;',
        '    if (key === "robber_fly") return SEIZE;\n    if (key === "oyster") return SHELF;\n    return SILL;',
        "js playFor oyster",
    )
    text = must_replace(
        text,
        "    if (kind === SEIZE) return w.width >= 184 && w.height >= 152;",
        "    if (kind === SEIZE) return w.width >= 184 && w.height >= 152;\n    if (kind === SHELF) return w.width >= 188 && w.height >= 204;",
        "js size gate",
    )
    seize_pick = """    if (kind === SEIZE) {
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
    shelf_pick = seize_pick + """

    if (kind === SHELF) {
      const hold = shelfPoint(best, size, work);
      const approachOff = hold.x < workW / 2 ? -28 : 28;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 32 : -32;
      return {
        id: best.id,
        kind,
        side: "timbershelf",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "shelved",
        spin: "none",
      };
    }"""
    text = must_replace(text, seize_pick, shelf_pick, "js pickTarget SHELF")

    seize_refit = """    if (target.kind === SEIZE) {
      const hold = seizePoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }"""
    shelf_refit = seize_refit + """

    if (target.kind === SHELF) {
      const hold = shelfPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }"""
    text = must_replace(text, seize_refit, shelf_refit, "js refit SHELF")

    text = must_replace(
        text,
        "  function beginPlay(target, petX) {",
        SHELF_FNS + "  function beginPlay(target, petX) {",
        "js shelf fns",
    )

    seize_approach = """        if (target.kind === SEIZE) {
          return goPhase(next, "seize-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }"""
    shelf_approach = seize_approach + """

        if (target.kind === SHELF) {
          return goPhase(next, "shelf-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }"""
    text = must_replace(text, seize_approach, shelf_approach, "js approach SHELF")

    seize_phases = """    if (next.phase === "seize-on") {
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

    shelf_phases = seize_phases + """

    if (next.phase === "shelf-on") {
      const face = shelfFace(target);
      const u = next.t / DUR.shelfOn;
      const pose = shelfOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot * face;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "shelf", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "shelf") {
      const face = shelfFace(target);
      const pose = shelfPath(Math.min(1, next.t / DUR.shelf));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.shelf) {
        return goPhase(next, "shelf-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "shelf-hold") {
      const face = shelfFace(target);
      const pose = shelfHoldPath(Math.min(1, next.t / DUR.shelfHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.shelfHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = shelfHoldPath(1);
        return goPhase(next, "shelf-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "shelf-off") {
      const u = next.t / DUR.shelfOff;
      const pose = shelfOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }"""
    text = must_replace(text, seize_phases, shelf_phases, "js shelf phases")

    text = must_replace(
        text,
        "    SEIZE,\n    IGNORE,",
        "    SEIZE,\n    SHELF,\n    IGNORE,",
        "js SHELF export const",
    )
    text = must_replace(
        text,
        "    seizePoint,\n    seizeFace,\n    seizeOnPath,\n    seizePath,\n    seizeHoldPath,\n    seizeOffPath,\n    pickTarget,",
        "    seizePoint,\n    seizeFace,\n    seizeOnPath,\n    seizePath,\n    seizeHoldPath,\n    seizeOffPath,\n    shelfPoint,\n    shelfFace,\n    shelfOnPath,\n    shelfPath,\n    shelfHoldPath,\n    shelfOffPath,\n    pickTarget,",
        "js shelf fn exports",
    )
    save("desktop/renderer/window-play.js", text, nl)
    print("ok js")

patch_js()
print("core js done")
