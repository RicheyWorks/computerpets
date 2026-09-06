# -*- coding: utf-8 -*-
"""Apply Silica (silica) facet leftover — fourth far den window-play."""
from pathlib import Path

HERE = Path(__file__).resolve().parent
BLOB = HERE if (HERE / "facet_fns.js").exists() else Path(".")

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, got {n}\nOLD START: {old[:240]!r}")
    return text.replace(old, new, 1)

HEADER_OLD = (
    "This is the leftover after Choir. This is the third leftover of the far den. Others walk a sill. */"
)
HEADER_NEW = (
    "This is the leftover after Choir. This is the third leftover of the far den. "
    "Silica facets a cool pane as an inkstone: walk onto the pane, sit the inkstone face, facet once, sit the edge, then leave. "
    "Nimbus still owns float. Choir still owns chord. Gleam still owns thirst. Pact still owns plaque. Starter still owns bloom. Flame still owns drip. Puff still owns cloud. Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. "
    "Pebble still owns puff. Floss still owns dust. Tun still owns dry. "
    "This is the leftover after Nimbus. This is the fourth leftover of the far den. Others walk a sill. */"
)
HEADER_OLD_TS = (
    "This is the leftover after Choir. This is the third leftover of the far den. Others walk a sill. Same map as desktop `window-play.js`. */"
)
HEADER_NEW_TS = (
    "This is the leftover after Choir. This is the third leftover of the far den. "
    "Silica facets a cool pane as an inkstone: walk onto the pane, sit the inkstone face, facet once, sit the edge, then leave. "
    "Nimbus still owns float. Choir still owns chord. Gleam still owns thirst. Pact still owns plaque. Starter still owns bloom. Flame still owns drip. Puff still owns cloud. Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. "
    "Pebble still owns puff. Floss still owns dust. Tun still owns dry. "
    "This is the leftover after Nimbus. This is the fourth leftover of the far den. Others walk a sill. Same map as desktop `window-play.js`. */"
)

FACET_FNS = (BLOB / "facet_fns.js").read_text(encoding="utf-8")
if FACET_FNS.startswith("\ufeff"):
    FACET_FNS = FACET_FNS.lstrip("\ufeff")
if not FACET_FNS.endswith("\n"):
    FACET_FNS += "\n"
JS_TICK = (BLOB / "js_tick_silica.js").read_text(encoding="utf-8")
if JS_TICK.startswith("\ufeff"):
    JS_TICK = JS_TICK.lstrip("\ufeff")
JS_PICK = (BLOB / "js_pick_silica.js").read_text(encoding="utf-8")
if JS_PICK.startswith("\ufeff"):
    JS_PICK = JS_PICK.lstrip("\ufeff")
TS_PICK = (BLOB / "ts_pick_silica.js").read_text(encoding="utf-8")
if TS_PICK.startswith("\ufeff"):
    TS_PICK = TS_PICK.lstrip("\ufeff")

TS_FACET_FNS = "\n".join(
    (line[2:] if line.startswith("  ") else line) for line in FACET_FNS.splitlines(True)
).replace("function facet", "export function facet")
if not TS_FACET_FNS.endswith("\n"):
    TS_FACET_FNS += "\n"

TS_TICK = "\n".join(
    (line[2:] if line.startswith("  ") else line) for line in JS_TICK.splitlines(True)
)

def patch_js(t):
    t = once(t, HEADER_OLD, HEADER_NEW, "js header")
    t = once(
        t,
        '  const FLOAT = "float";\n  const SILL = "sill";',
        '  const FLOAT = "float";\n  const FACET = "facet";\n  const SILL = "sill";',
        "js const",
    )
    t = once(
        t,
        "    floatOff: 2.68,\n    sillHop:",
        "    floatOff: 2.68,\n    facetOn: 2.71,\n    facet: 2.19,\n    facetHold: 4.73,\n    facetOff: 2.57,\n    sillHop:",
        "js dur",
    )
    t = once(
        t,
        '    if (key === "nimbus") return FLOAT;\n    return SILL;',
        '    if (key === "nimbus") return FLOAT;\n    if (key === "silica") return FACET;\n    return SILL;',
        "js playFor",
    )
    t = once(
        t,
        "    if (kind === FLOAT) return w.width >= 194 && w.height >= 174;\n    return w.width >= 180 && w.height >= 70;",
        "    if (kind === FLOAT) return w.width >= 194 && w.height >= 174;\n    if (kind === FACET) return w.width >= 196 && w.height >= 176;\n    return w.width >= 180 && w.height >= 70;",
        "js size",
    )
    old_pick = (
        '        leave: "floated",\n'
        '        spin: "none",\n'
        '      };\n'
        '    }\n'
        '\n'
        '        if (kind === WRAP) {'
    )
    new_pick = (
        '        leave: "floated",\n'
        '        spin: "none",\n'
        '      };\n'
        '    }\n'
        + JS_PICK
        + '        if (kind === WRAP) {'
    )
    t = once(t, old_pick, new_pick, "js pick")
    old_refit = (
        '    if (target.kind === FLOAT) {\n'
        '      const hold = floatPoint(win, sprite, work);\n'
        '      return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '    }\n'
        '    if (target.kind === BURY) {'
    )
    new_refit = (
        '    if (target.kind === FLOAT) {\n'
        '      const hold = floatPoint(win, sprite, work);\n'
        '      return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '    }\n'
        '    if (target.kind === FACET) {\n'
        '      const hold = facetPoint(win, sprite, work);\n'
        '      return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '    }\n'
        '    if (target.kind === BURY) {'
    )
    t = once(t, old_refit, new_refit, "js refit")
    old_app = (
        '        if (target.kind === FLOAT) {\n'
        '          return goPhase(next, "float-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '        }\n'
        '        if (target.kind === WRAP) {'
    )
    new_app = (
        '        if (target.kind === FLOAT) {\n'
        '          return goPhase(next, "float-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '        }\n'
        '        if (target.kind === FACET) {\n'
        '          return goPhase(next, "facet-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '        }\n'
        '        if (target.kind === WRAP) {'
    )
    t = once(t, old_app, new_app, "js approach")
    t = once(t, "  function beginPlay(target, petX) {", FACET_FNS + "  function beginPlay(target, petX) {", "js fns")
    old_tick = (
        '    if (next.phase === "float-off") {\n'
        '      const u = next.t / DUR.floatOff;\n'
        '      const pose = floatOffPath(Math.min(1, u), next.from, next.to);\n'
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
        '    if (next.phase === "float-off") {\n'
        '      const u = next.t / DUR.floatOff;\n'
        '      const pose = floatOffPath(Math.min(1, u), next.from, next.to);\n'
        '      next.x = pose.x;\n'
        '      next.lift = pose.lift;\n'
        '      next.rot = pose.rot;\n'
        '      next.anim = "walk";\n'
        '      next.facing = target.landX >= target.holdX ? 1 : -1;\n'
        '      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);\n'
        '      return next;\n'
        '    }\n'
        '\n'
        + JS_TICK
        + '    if (next.phase === "sill-hop") {'
    )
    t = once(t, old_tick, new_tick, "js tick")
    t = once(t, "    FLOAT,\n    IGNORE,", "    FLOAT,\n    FACET,\n    IGNORE,", "js export kind")
    t = once(
        t,
        "    floatOffPath,\n    pickTarget,",
        "    floatOffPath,\n    facetPoint,\n    facetFace,\n    facetOnPath,\n    facetPath,\n    facetHoldPath,\n    facetOffPath,\n    pickTarget,",
        "js export fns",
    )
    return t

def patch_ts(t):
    t = once(t, HEADER_OLD_TS, HEADER_NEW_TS, "ts header")
    t = once(
        t,
        'export const FLOAT = "float";\nexport const SILL = "sill";',
        'export const FLOAT = "float";\nexport const FACET = "facet";\nexport const SILL = "sill";',
        "ts const",
    )
    t = once(
        t,
        "  floatOff: 2.68,\n  sillHop:",
        "  floatOff: 2.68,\n  facetOn: 2.71,\n  facet: 2.19,\n  facetHold: 4.73,\n  facetOff: 2.57,\n  sillHop:",
        "ts dur",
    )
    t = once(
        t,
        "typeof FLOAT | typeof SILL | typeof IGNORE;",
        "typeof FLOAT | typeof FACET | typeof SILL | typeof IGNORE;",
        "ts kind",
    )
    t = once(
        t,
        '  | "float-off"\n  | "sill-hop"',
        '  | "float-off"\n  | "facet-on"\n  | "facet"\n  | "facet-hold"\n  | "facet-off"\n  | "sill-hop"',
        "ts phase",
    )
    t = once(
        t,
        '| "barkstone" | "lampglass" | "blotterair" | "methanebowl";',
        '| "barkstone" | "lampglass" | "blotterair" | "methanebowl" | "inkstone";',
        "ts side",
    )
    t = once(
        t,
        '| "plaqued" | "thirsted" | "chorded" | "floated";',
        '| "plaqued" | "thirsted" | "chorded" | "floated" | "faceted";',
        "ts leave",
    )
    t = once(
        t,
        '  if (key === "nimbus") return FLOAT;\n  return SILL;',
        '  if (key === "nimbus") return FLOAT;\n  if (key === "silica") return FACET;\n  return SILL;',
        "ts playFor",
    )
    t = once(
        t,
        "  if (kind === FLOAT) return w.width >= 194 && w.height >= 174;\n    return w.width >= 180 && w.height >= 70;",
        "  if (kind === FLOAT) return w.width >= 194 && w.height >= 174;\n  if (kind === FACET) return w.width >= 196 && w.height >= 176;\n    return w.width >= 180 && w.height >= 70;",
        "ts size",
    )
    old_pick = (
        '      leave: "floated",\n'
        '      spin: "none",\n'
        '    };\n'
        '  }\n'
        '\n'
        '  if (kind === WRAP) {'
    )
    new_pick = (
        '      leave: "floated",\n'
        '      spin: "none",\n'
        '    };\n'
        '  }\n'
        + TS_PICK
        + '  if (kind === WRAP) {'
    )
    t = once(t, old_pick, new_pick, "ts pick")
    old_refit = (
        '  if (target.kind === FLOAT) {\n'
        '    const hold = floatPoint(win, sprite, work);\n'
        '    return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '  }\n'
        '  if (target.kind === BURY) {'
    )
    new_refit = (
        '  if (target.kind === FLOAT) {\n'
        '    const hold = floatPoint(win, sprite, work);\n'
        '    return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '  }\n'
        '  if (target.kind === FACET) {\n'
        '    const hold = facetPoint(win, sprite, work);\n'
        '    return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '  }\n'
        '  if (target.kind === BURY) {'
    )
    t = once(t, old_refit, new_refit, "ts refit")
    old_app = (
        '      if (target.kind === FLOAT) {\n'
        '        return goPhase(next, "float-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '      }\n'
        '      if (target.kind === WRAP) {'
    )
    new_app = (
        '      if (target.kind === FLOAT) {\n'
        '        return goPhase(next, "float-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '      }\n'
        '      if (target.kind === FACET) {\n'
        '        return goPhase(next, "facet-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '      }\n'
        '      if (target.kind === WRAP) {'
    )
    t = once(t, old_app, new_app, "ts approach")
    t = once(t, "export function beginPlay(target: PlayTarget | null | undefined, petX: number)", TS_FACET_FNS + "export function beginPlay(target: PlayTarget | null | undefined, petX: number)", "ts fns")
    old_tick = (
        '  if (next.phase === "float-off") {\n'
        '    const u = next.t / DUR.floatOff;\n'
        '    const pose = floatOffPath(Math.min(1, u), next.from, next.to);\n'
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
        '  if (next.phase === "float-off") {\n'
        '    const u = next.t / DUR.floatOff;\n'
        '    const pose = floatOffPath(Math.min(1, u), next.from, next.to);\n'
        '    next.x = pose.x;\n'
        '    next.lift = pose.lift;\n'
        '    next.rot = pose.rot;\n'
        '    next.anim = "walk";\n'
        '    next.facing = target.landX >= target.holdX ? 1 : -1;\n'
        '    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);\n'
        '    return next;\n'
        '  }\n'
        '\n'
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
