from pathlib import Path

ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

HEADER_OLD = (
    "Half splits a meeting-rail underside as a stream stone: walk onto the underside, sit the split (she halves), then leave. "
    "Tun still owns dry. Hop still owns spring. This is the eighth log leftover."
)
HEADER_NEW = (
    HEADER_OLD
    + " Thread thrashes a glazing rebate as a soil film: walk into the rebate, thrash the round, then leave. "
    + "Wick still owns thread. Half still owns split. Tun still owns dry. This is the ninth log leftover."
)

THRASH_FUNCS = '''
  function thrashPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 38;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.78;
    const rebate = Math.max(148, win.height * 0.61);
    const gripY = win.y + rebate;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 36, maxLift) };
  }

  function thrashFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function thrashOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const wriggle = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 4.6) * 1.7;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + wriggle,
      rot: (toX >= fromX ? 1 : -1) * 6.2 * (1 - ease) + wriggle * 0.55,
    };
  }

  function thrashPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.22) {
      const s = t / 0.22;
      const ease = s * s * (3 - 2 * s);
      return { x: ease * 0.35, lift: ease * 0.45, rot: ease * 5.6 };
    }
    if (t < 0.84) {
      const s = (t - 0.22) / 0.62;
      const wave = Math.sin(s * Math.PI * 3.2);
      return { x: 0.35 + wave * 5.4, lift: 0.45 + Math.abs(wave) * 0.85, rot: 5.6 + wave * 16.8 };
    }
    return { x: 0.35, lift: 0.5, rot: 4.8 };
  }

  function thrashHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const wait = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.18;
    return { x: 0.35, lift: 0.5 + wait, rot: 4.8 };
  }

  function thrashOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease,
      rot: (from && from.rot != null ? from.rot : 4.8) * (1 - ease),
    };
  }

'''

THRASH_TICKS = '''
    if (next.phase === "thrash-on") {
      const face = thrashFace(target);
      const u = next.t / DUR.thrashOn;
      const pose = thrashOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "thrash", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "thrash") {
      const face = thrashFace(target);
      const pose = thrashPath(Math.min(1, next.t / DUR.thrash));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.thrash) {
        return goPhase(next, "thrash-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "thrash-hold") {
      const face = thrashFace(target);
      const pose = thrashHoldPath(Math.min(1, next.t / DUR.thrashHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.thrashHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = thrashHoldPath(1);
        return goPhase(next, "thrash-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "thrash-off") {
      const u = next.t / DUR.thrashOff;
      const pose = thrashOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

'''

THRASH_PICK = '''
    if (kind === THRASH) {
      const hold = thrashPoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -70 : 70;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 63 : -63;
      return {
        id: best.id,
        kind,
        side: "soilfilm",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "round",
        spin: "none",
      };
    }
'''

def sub_once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1 occurrence, found {n}\nOLD: {old[:120]!r}")
    return text.replace(old, new, 1)

def insert_after_split_pick(text, path):
    marker = '        leave: "stone",\n        spin: "none",\n      };\n    }'
    start = 0
    found = None
    while True:
        i = text.find(marker, start)
        if i < 0:
            break
        after = text[i + len(marker): i + len(marker) + 120]
        if "kind === WRAP" in after:
            found = i
            break
        start = i + 1
    if found is None:
        raise SystemExit(f"{path}: SPLIT pick block before WRAP not found")
    insert_at = found + len(marker)
    return text[:insert_at] + "\n" + THRASH_PICK + text[insert_at:]

def patch_play(path, ts=False):
    p = ROOT / path
    text = p.read_text(encoding="utf-8")
    text = sub_once(text, HEADER_OLD, HEADER_NEW, f"{path} header")
    if ts:
        text = sub_once(text, 'export const SPLIT = "split";', 'export const SPLIT = "split";\nexport const THRASH = "thrash";', f"{path} const")
        text = sub_once(text, '  if (key === "planarian") return SPLIT;', '  if (key === "planarian") return SPLIT;\n  if (key === "nematode") return THRASH;', f"{path} playFor")
        text = sub_once(text, "typeof DRY | typeof SPLIT | typeof SILL", "typeof DRY | typeof SPLIT | typeof THRASH | typeof SILL", f"{path} kind union")
        text = sub_once(text, '  | "split-off"\n  | "sill-hop"', '  | "split-off"\n  | "thrash-on"\n  | "thrash"\n  | "thrash-hold"\n  | "thrash-off"\n  | "sill-hop"', f"{path} phases")
        text = sub_once(text, '| "wetwood" | "mossfilm";', '| "wetwood" | "mossfilm" | "streamstone" | "soilfilm";', f"{path} side")
        text = sub_once(text, '| "headglue" | "film";', '| "headglue" | "film" | "round";', f"{path} leave")
        text = sub_once(text, "        if (target.kind === SPLIT) {\n          return goPhase(next, \"split-on\", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, \"walk\", dir);\n        }", "        if (target.kind === SPLIT) {\n          return goPhase(next, \"split-on\", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, \"walk\", dir);\n        }\n        if (target.kind === THRASH) {\n          return goPhase(next, \"thrash-on\", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, \"walk\", dir);\n        }", f"{path} goPhase")
    else:
        text = sub_once(text, '  const SPLIT = "split";', '  const SPLIT = "split";\n  const THRASH = "thrash";', f"{path} const")
        text = sub_once(text, '    if (key === "planarian") return SPLIT;', '    if (key === "planarian") return SPLIT;\n    if (key === "nematode") return THRASH;', f"{path} playFor")
        text = sub_once(text, "        if (target.kind === SPLIT) {\n          return goPhase(next, \"split-on\", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, \"walk\", dir);\n        }", "        if (target.kind === SPLIT) {\n          return goPhase(next, \"split-on\", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, \"walk\", dir);\n        }\n        if (target.kind === THRASH) {\n          return goPhase(next, \"thrash-on\", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, \"walk\", dir);\n        }", f"{path} goPhase")
        text = sub_once(text, "    SPLIT,\n    IGNORE,", "    SPLIT,\n    THRASH,\n    IGNORE,", f"{path} export kind")
    text = sub_once(text, "    splitOff: 1.59,", "    splitOff: 1.59,\n    thrashOn: 2.31,\n    thrash: 1.21,\n    thrashHold: 2.59,\n    thrashOff: 1.63,", f"{path} DUR")
    text = sub_once(text, "    if (kind === SPLIT) return w.width >= 193 && w.height >= 200;", "    if (kind === SPLIT) return w.width >= 193 && w.height >= 200;\n    if (kind === THRASH) return w.width >= 192 && w.height >= 198;", f"{path} size")
    text = insert_after_split_pick(text, path)
    text = sub_once(
        text,
        "    if (target.kind === SPLIT) {\n      const hold = splitPoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }",
        "    if (target.kind === SPLIT) {\n      const hold = splitPoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === THRASH) {\n      const hold = thrashPoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }",
        f"{path} refit",
    )
    split_end = """      rot: (from && from.rot != null ? from.rot : 1.6) * (1 - ease),
    };
  }

  function beginPlay(target, petX) {"""
    if split_end not in text:
        raise SystemExit(f"{path}: splitOffPath end / beginPlay marker missing")
    text = sub_once(text, split_end, """      rot: (from && from.rot != null ? from.rot : 1.6) * (1 - ease),
    };
  }
""" + THRASH_FUNCS + """  function beginPlay(target, petX) {""", f"{path} funcs")
    sill_hop = '    if (next.phase === "sill-hop") {'
    # insert ticks before sill-hop, after split-off block. Unique: split-off then sill-hop
    split_off_end = '''    if (next.phase === "split-off") {
      const u = next.t / DUR.splitOff;
      const pose = splitOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "sill-hop") {'''
    if split_off_end not in text:
        raise SystemExit(f"{path}: split-off / sill-hop marker missing")
    text = sub_once(text, split_off_end, split_off_end.replace('    if (next.phase === "sill-hop") {', THRASH_TICKS + '    if (next.phase === "sill-hop") {'), f"{path} ticks")
    text = sub_once(
        text,
        "    splitOffPath,",
        "    splitOffPath,\n    thrashPoint,\n    thrashFace,\n    thrashOnPath,\n    thrashPath,\n    thrashHoldPath,\n    thrashOffPath,",
        f"{path} export paths",
    )
    p.write_text(text, encoding="utf-8")
    print("patched", path)

if __name__ == "__main__":
    patch_play("desktop/renderer/window-play.js", ts=False)
    patch_play("web/src/lib/pets/window-play.ts", ts=True)
