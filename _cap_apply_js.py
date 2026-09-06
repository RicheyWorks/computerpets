# -*- coding: utf-8 -*-
"""Apply Cap warts leftover to window-play.js in one write (Auto-review test)."""
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

def mr(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit("%s count=%s" % (label, n))
    return text.replace(old, new, 1)

HEADER_OLD = (
    " Frill shelves a sash stile as a timber shelf: walk onto the stile, sit, lean then bracket again, sit the shelf, then leave. "
    "Rob still owns seize. Fan still owns gold. Felt still owns lean. Cape still owns fold. Mast still owns seed. Auger still owns bore. Vein still owns unfurl. "
    "This is the first leftover of the fungi den. Others walk a sill. */"
)

HEADER_NEW = (
    " Frill shelves a sash stile as a timber shelf: walk onto the stile, sit, lean then bracket again, sit the shelf, then leave. "
    "Rob still owns seize. Fan still owns gold. Felt still owns lean. Cape still owns fold. Mast still owns seed. Auger still owns bore. Vein still owns unfurl. "
    "This is the first leftover of the fungi den. "
    "Cap warts a window apron as a moss cup: walk onto the apron, sit, wart once, sit the cup, then leave. "
    "Frill still owns shelf. Seven still owns spot. Sepia still owns flush. Rob still owns seize. Slip still owns ring. "
    "This is the second leftover of the fungi den. Others walk a sill. */"
)

warts = Path("_cap_warts_fns.js").read_text(encoding="utf-8")
if not warts.endswith("\n"):
    warts += "\n"

WARTS_PHASES = """
    if (next.phase === "warts-on") {
      const face = wartsFace(target);
      const u = next.t / DUR.wartsOn;
      const pose = wartsOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot * face;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "warts", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "warts") {
      const face = wartsFace(target);
      const pose = wartsPath(Math.min(1, next.t / DUR.warts));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.warts) {
        return goPhase(next, "warts-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "warts-hold") {
      const face = wartsFace(target);
      const pose = wartsHoldPath(Math.min(1, next.t / DUR.wartsHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.wartsHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = wartsHoldPath(1);
        return goPhase(next, "warts-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "warts-off") {
      const u = next.t / DUR.wartsOff;
      const pose = wartsOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }
"""

text, nl = load("desktop/renderer/window-play.js")
text = mr(text, HEADER_OLD, HEADER_NEW, "header")
text = mr(
    text,
    '  const SHELF = "shelf";\n  const SILL = "sill";',
    '  const SHELF = "shelf";\n  const WARTS = "warts";\n  const SILL = "sill";',
    "const",
)
text = mr(
    text,
    "    shelfOn: 2.72,\n    shelf: 2.05,\n    shelfHold: 4.35,\n    shelfOff: 2.62,",
    "    shelfOn: 2.72,\n    shelf: 2.05,\n    shelfHold: 4.35,\n    shelfOff: 2.62,\n    wartsOn: 2.64,\n    warts: 1.88,\n    wartsHold: 4.18,\n    wartsOff: 2.55,",
    "dur",
)
text = mr(
    text,
    '    if (key === "oyster") return SHELF;\n    return SILL;',
    '    if (key === "oyster") return SHELF;\n    if (key === "fly_agaric") return WARTS;\n    return SILL;',
    "playFor",
)
text = mr(
    text,
    "    if (kind === SHELF) return w.width >= 188 && w.height >= 204;",
    "    if (kind === SHELF) return w.width >= 188 && w.height >= 204;\n    if (kind === WARTS) return w.width >= 186 && w.height >= 148;",
    "gate",
)

shelf_pick = """    if (kind === SHELF) {
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
warts_pick = shelf_pick + """

    if (kind === WARTS) {
      const hold = wartsPoint(best, size, work);
      const approachOff = hold.x < workW / 2 ? -30 : 30;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 30 : -30;
      return {
        id: best.id,
        kind,
        side: "mosscup",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "warted",
        spin: "none",
      };
    }"""
text = mr(text, shelf_pick, warts_pick, "pick")

shelf_refit = """    if (target.kind === SHELF) {
      const hold = shelfPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }"""
warts_refit = shelf_refit + """

    if (target.kind === WARTS) {
      const hold = wartsPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }"""
text = mr(text, shelf_refit, warts_refit, "refit")

text = mr(
    text,
    "  function beginPlay(target, petX) {",
    "\n" + warts + "  function beginPlay(target, petX) {",
    "fns",
)

shelf_approach = """        if (target.kind === SHELF) {
          return goPhase(next, "shelf-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }"""
warts_approach = shelf_approach + """

        if (target.kind === WARTS) {
          return goPhase(next, "warts-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }"""
text = mr(text, shelf_approach, warts_approach, "approach")

shelf_off_end = """    if (next.phase === "shelf-off") {
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
text = mr(text, shelf_off_end, shelf_off_end + "\n" + WARTS_PHASES, "phases")

text = mr(text, "    SHELF,\n    IGNORE,", "    SHELF,\n    WARTS,\n    IGNORE,", "export const")
text = mr(
    text,
    "    shelfPoint,\n    shelfFace,\n    shelfOnPath,\n    shelfPath,\n    shelfHoldPath,\n    shelfOffPath,\n    pickTarget,",
    "    shelfPoint,\n    shelfFace,\n    shelfOnPath,\n    shelfPath,\n    shelfHoldPath,\n    shelfOffPath,\n    wartsPoint,\n    wartsFace,\n    wartsOnPath,\n    wartsPath,\n    wartsHoldPath,\n    wartsOffPath,\n    pickTarget,",
    "export fns",
)

save("desktop/renderer/window-play.js", text, nl)
print("ok js cap warts")
