# -*- coding: utf-8 -*-
"""Apply Nimbus (nimbus) float leftover — third far den window-play."""
from pathlib import Path

HERE = Path(__file__).resolve().parent
BLOB = HERE if (HERE / "float_fns.js").exists() else Path(".")

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, got {n}\nOLD START: {old[:240]!r}")
    return text.replace(old, new, 1)

HEADER_OLD = (
    "This is the leftover after Gleam. This is the second leftover of the far den. Others walk a sill. */"
)
HEADER_NEW = (
    "This is the leftover after Gleam. This is the second leftover of the far den. "
    "Nimbus floats a mid pane as a methane bowl: walk onto the pane, sit the methane-bowl membrane, float once, sit the cold, then leave. "
    "Choir still owns chord. Gleam still owns thirst. Pact still owns plaque. Starter still owns bloom. Flame still owns drip. Puff still owns cloud. Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. "
    "Pebble still owns puff. Floss still owns dust. Tun still owns dry. "
    "This is the leftover after Choir. This is the third leftover of the far den. Others walk a sill. */"
)
HEADER_OLD_TS = (
    "This is the leftover after Gleam. This is the second leftover of the far den. Others walk a sill. Same map as desktop `window-play.js`. */"
)
HEADER_NEW_TS = (
    "This is the leftover after Gleam. This is the second leftover of the far den. "
    "Nimbus floats a mid pane as a methane bowl: walk onto the pane, sit the methane-bowl membrane, float once, sit the cold, then leave. "
    "Choir still owns chord. Gleam still owns thirst. Pact still owns plaque. Starter still owns bloom. Flame still owns drip. Puff still owns cloud. Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. "
    "Pebble still owns puff. Floss still owns dust. Tun still owns dry. "
    "This is the leftover after Choir. This is the third leftover of the far den. Others walk a sill. Same map as desktop `window-play.js`. */"
)

FLOAT_FNS = (BLOB / "float_fns.js").read_text(encoding="utf-8")
if FLOAT_FNS.startswith("\ufeff"):
    FLOAT_FNS = FLOAT_FNS.lstrip("\ufeff")
if not FLOAT_FNS.endswith("\n"):
    FLOAT_FNS += "\n"
JS_TICK = (BLOB / "js_tick_nimbus.js").read_text(encoding="utf-8")
if JS_TICK.startswith("\ufeff"):
    JS_TICK = JS_TICK.lstrip("\ufeff")
JS_PICK = (BLOB / "js_pick_nimbus.js").read_text(encoding="utf-8")
if JS_PICK.startswith("\ufeff"):
    JS_PICK = JS_PICK.lstrip("\ufeff")
TS_PICK = (BLOB / "ts_pick_nimbus.js").read_text(encoding="utf-8")
if TS_PICK.startswith("\ufeff"):
    TS_PICK = TS_PICK.lstrip("\ufeff")

TS_FLOAT_FNS = "\n".join(
    (line[2:] if line.startswith("  ") else line) for line in FLOAT_FNS.splitlines(True)
).replace("function float", "export function float")
if not TS_FLOAT_FNS.endswith("\n"):
    TS_FLOAT_FNS += "\n"

TS_TICK = "\n".join(
    (line[2:] if line.startswith("  ") else line) for line in JS_TICK.splitlines(True)
)

def patch_js(t):
    t = once(t, HEADER_OLD, HEADER_NEW, "js header")
    t = once(
        t,
        '  const CHORD = "chord";\n  const SILL = "sill";',
        '  const CHORD = "chord";\n  const FLOAT = "float";\n  const SILL = "sill";',
        "js const",
    )
    t = once(
        t,
        "    chordOff: 2.61,\n    sillHop:",
        "    chordOff: 2.61,\n    floatOn: 2.74,\n    float: 2.22,\n    floatHold: 4.64,\n    floatOff: 2.64,\n    sillHop:",
        "js dur",
    )
    t = once(
        t,
        '    if (key === "choir") return CHORD;\n    return SILL;',
        '    if (key === "choir") return CHORD;\n    if (key === "nimbus") return FLOAT;\n    return SILL;',
        "js playFor",
    )
    t = once(
        t,
        "    if (kind === CHORD) return w.width >= 192 && w.height >= 172;\n    return w.width >= 180 && w.height >= 70;",
        "    if (kind === CHORD) return w.width >= 192 && w.height >= 172;\n    if (kind === FLOAT) return w.width >= 194 && w.height >= 174;\n    return w.width >= 180 && w.height >= 70;",
        "js size",
    )
    old_pick = (
        '        leave: "chorded",\n'
        '        spin: "none",\n'
        '      };\n'
        '    }\n'
        '\n'
        '        if (kind === WRAP) {'
    )
    new_pick = (
        '        leave: "chorded",\n'
        '        spin: "none",\n'
        '      };\n'
        '    }\n'
        + JS_PICK
        + '        if (kind === WRAP) {'
    )
    t = once(t, old_pick, new_pick, "js pick")
    old_refit = (
        '    if (target.kind === CHORD) {\n'
        '      const hold = chordPoint(win, sprite, work);\n'
        '      return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '    }\n'
        '    if (target.kind === BURY) {'
    )
    new_refit = (
        '    if (target.kind === CHORD) {\n'
        '      const hold = chordPoint(win, sprite, work);\n'
        '      return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '    }\n'
        '    if (target.kind === FLOAT) {\n'
        '      const hold = floatPoint(win, sprite, work);\n'
        '      return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '    }\n'
        '    if (target.kind === BURY) {'
    )
    t = once(t, old_refit, new_refit, "js refit")
    old_app = (
        '        if (target.kind === CHORD) {\n'
        '          return goPhase(next, "chord-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '        }\n'
        '        if (target.kind === WRAP) {'
    )
    new_app = (
        '        if (target.kind === CHORD) {\n'
        '          return goPhase(next, "chord-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '        }\n'
        '        if (target.kind === FLOAT) {\n'
        '          return goPhase(next, "float-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '        }\n'
        '        if (target.kind === WRAP) {'
    )
    t = once(t, old_app, new_app, "js approach")
    t = once(t, "  function beginPlay(target, petX) {", FLOAT_FNS + "  function beginPlay(target, petX) {", "js fns")
    old_tick = (
        '    if (next.phase === "chord-off") {\n'
        '      const u = next.t / DUR.chordOff;\n'
        '      const pose = chordOffPath(Math.min(1, u), next.from, next.to);\n'
        '      next.x = pose.x;\n'
        '      next.lift = pose.lift;\n'
        '      next.rot = pose.rot;\n'
        '      next.anim = "walk";\n'
        '      next.facing = target.landX >= target.holdX ? 1 : -1;\n'
        '      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);\n'
        '      return next;\n'
        '    }\n'
        '\n'
        '    if (next.phase === "sill-hop") {'
    )
    new_tick = (
        '    if (next.phase === "chord-off") {\n'
        '      const u = next.t / DUR.chordOff;\n'
        '      const pose = chordOffPath(Math.min(1, u), next.from, next.to);\n'
        '      next.x = pose.x;\n'
        '      next.lift = pose.lift;\n'
        '      next.rot = pose.rot;\n'
        '      next.anim = "walk";\n'
        '      next.facing = target.landX >= target.holdX ? 1 : -1;\n'
        '      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);\n'
        '      return next;\n'
        '    }\n'
        + JS_TICK
        + '    if (next.phase === "sill-hop") {'
    )
    t = once(t, old_tick, new_tick, "js tick")
    t = once(t, "    CHORD,\n    IGNORE,", "    CHORD,\n    FLOAT,\n    IGNORE,", "js export kind")
    t = once(
        t,
        "    chordOffPath,\n    pickTarget,",
        "    chordOffPath,\n    floatPoint,\n    floatFace,\n    floatOnPath,\n    floatPath,\n    floatHoldPath,\n    floatOffPath,\n    pickTarget,",
        "js export fns",
    )
    return t

def patch_ts(t):
    t = once(t, HEADER_OLD_TS, HEADER_NEW_TS, "ts header")
    t = once(
        t,
        'export const CHORD = "chord";\nexport const SILL = "sill";',
        'export const CHORD = "chord";\nexport const FLOAT = "float";\nexport const SILL = "sill";',
        "ts const",
    )
    t = once(
        t,
        "  chordOff: 2.61,\n  sillHop:",
        "  chordOff: 2.61,\n  floatOn: 2.74,\n  float: 2.22,\n  floatHold: 4.64,\n  floatOff: 2.64,\n  sillHop:",
        "ts dur",
    )
    t = once(
        t,
        "typeof CHORD | typeof SILL | typeof IGNORE;",
        "typeof CHORD | typeof FLOAT | typeof SILL | typeof IGNORE;",
        "ts kind",
    )
    t = once(
        t,
        '  | "chord-off"\n  | "sill-hop"',
        '  | "chord-off"\n  | "float-on"\n  | "float"\n  | "float-hold"\n  | "float-off"\n  | "sill-hop"',
        "ts phase",
    )
    t = once(
        t,
        '| "barkstone" | "lampglass" | "blotterair";',
        '| "barkstone" | "lampglass" | "blotterair" | "methanebowl";',
        "ts side",
    )
    t = once(
        t,
        '| "plaqued" | "thirsted" | "chorded";',
        '| "plaqued" | "thirsted" | "chorded" | "floated";',
        "ts leave",
    )
    t = once(
        t,
        '  if (key === "choir") return CHORD;\n  return SILL;',
        '  if (key === "choir") return CHORD;\n  if (key === "nimbus") return FLOAT;\n  return SILL;',
        "ts playFor",
    )
    t = once(
        t,
        "  if (kind === CHORD) return w.width >= 192 && w.height >= 172;\n    return w.width >= 180 && w.height >= 70;",
        "  if (kind === CHORD) return w.width >= 192 && w.height >= 172;\n  if (kind === FLOAT) return w.width >= 194 && w.height >= 174;\n    return w.width >= 180 && w.height >= 70;",
        "ts size",
    )
    old_pick = (
        '      leave: "chorded",\n'
        '      spin: "none",\n'
        '    };\n'
        '  }\n'
        '\n'
        '  if (kind === WRAP) {'
    )
    new_pick = (
        '      leave: "chorded",\n'
        '      spin: "none",\n'
        '    };\n'
        '  }\n'
        + TS_PICK
        + '  if (kind === WRAP) {'
    )
    t = once(t, old_pick, new_pick, "ts pick")
    old_refit = (
        '  if (target.kind === CHORD) {\n'
        '    const hold = chordPoint(win, sprite, work);\n'
        '    return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '  }\n'
        '  if (target.kind === BURY) {'
    )
    new_refit = (
        '  if (target.kind === CHORD) {\n'
        '    const hold = chordPoint(win, sprite, work);\n'
        '    return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '  }\n'
        '  if (target.kind === FLOAT) {\n'
        '    const hold = floatPoint(win, sprite, work);\n'
        '    return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '  }\n'
        '  if (target.kind === BURY) {'
    )
    t = once(t, old_refit, new_refit, "ts refit")
    old_app = (
        '      if (target.kind === CHORD) {\n'
        '        return goPhase(next, "chord-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '      }\n'
        '      if (target.kind === WRAP) {'
    )
    new_app = (
        '      if (target.kind === CHORD) {\n'
        '        return goPhase(next, "chord-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '      }\n'
        '      if (target.kind === FLOAT) {\n'
        '        return goPhase(next, "float-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '      }\n'
        '      if (target.kind === WRAP) {'
    )
    t = once(t, old_app, new_app, "ts approach")
    # insert float fns before beginPlay
    # find export function beginPlay
    t = once(t, "export function beginPlay(target: PlayTarget, petX?: number)", TS_FLOAT_FNS + "export function beginPlay(target: PlayTarget, petX?: number)", "ts fns")
    old_tick = (
        '  if (next.phase === "chord-off") {\n'
        '    const u = next.t / DUR.chordOff;\n'
        '    const pose = chordOffPath(Math.min(1, u), next.from, next.to);\n'
        '    next.x = pose.x;\n'
        '    next.lift = pose.lift;\n'
        '    next.rot = pose.rot;\n'
        '    next.anim = "walk";\n'
        '    next.facing = target.landX >= target.holdX ? 1 : -1;\n'
        '    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);\n'
        '    return next;\n'
        '  }\n'
        '\n'
        '  if (next.phase === "sill-hop") {'
    )
    new_tick = (
        '  if (next.phase === "chord-off") {\n'
        '    const u = next.t / DUR.chordOff;\n'
        '    const pose = chordOffPath(Math.min(1, u), next.from, next.to);\n'
        '    next.x = pose.x;\n'
        '    next.lift = pose.lift;\n'
        '    next.rot = pose.rot;\n'
        '    next.anim = "walk";\n'
        '    next.facing = target.landX >= target.holdX ? 1 : -1;\n'
        '    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);\n'
        '    return next;\n'
        '  }\n'
        + TS_TICK
        + '  if (next.phase === "sill-hop") {'
    )
    t = once(t, old_tick, new_tick, "ts tick")
    return t

js_path = Path("desktop/renderer/window-play.js")
ts_path = Path("web/src/lib/pets/window-play.ts")
js_path.write_text(patch_js(js_path.read_text(encoding="utf-8")), encoding="utf-8", newline="\n")
ts_path.write_text(patch_ts(ts_path.read_text(encoding="utf-8")), encoding="utf-8", newline="\n")
print("core patched")
