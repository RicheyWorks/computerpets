# -*- coding: utf-8 -*-
from pathlib import Path

HERE = Path(r"C:\Users\730ri\projects\ComputerPets")

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit("%s: expected 1, got %d\nOLD START: %r" % (label, n, old[:320]))
    return text.replace(old, new, 1)

HEADER_OLD = "This is the leftover after Shard. This is the fifth leftover of the far den. Others walk a sill. */"
HEADER_NEW = (
    "This is the leftover after Shard. This is the fifth leftover of the far den. "
    "Knot manys a window stool as a paperweight: walk onto the stool, sit the colony, then leave. "
    "Dusk still owns rim. Snap still owns count. "
    "This is the leftover after Dusk. This is the sixth leftover of the far den. Others walk a sill. */"
)
HEADER_OLD_TS = "This is the leftover after Shard. This is the fifth leftover of the far den. Others walk a sill. Same map as desktop `window-play.js`. */"
HEADER_NEW_TS = (
    "This is the leftover after Shard. This is the fifth leftover of the far den. "
    "Knot manys a window stool as a paperweight: walk onto the stool, sit the colony, then leave. "
    "Dusk still owns rim. Snap still owns count. "
    "This is the leftover after Dusk. This is the sixth leftover of the far den. Others walk a sill. Same map as desktop `window-play.js`. */"
)

MANY_FNS = (HERE / "many_fns.js").read_text(encoding="utf-8")
if MANY_FNS.startswith("\ufeff"):
    MANY_FNS = MANY_FNS.lstrip("\ufeff")
if not MANY_FNS.endswith("\n"):
    MANY_FNS += "\n"
JS_TICK = (HERE / "js_tick_knot.js").read_text(encoding="utf-8")
if JS_TICK.startswith("\ufeff"):
    JS_TICK = JS_TICK.lstrip("\ufeff")
JS_PICK = (HERE / "js_pick_knot.js").read_text(encoding="utf-8")
if JS_PICK.startswith("\ufeff"):
    JS_PICK = JS_PICK.lstrip("\ufeff")
TS_PICK = (HERE / "ts_pick_knot.js").read_text(encoding="utf-8")
if TS_PICK.startswith("\ufeff"):
    TS_PICK = TS_PICK.lstrip("\ufeff")

TS_MANY_FNS = "\n".join(
    (("export " + line[2:]) if line.startswith("  function ") else (line[2:] if line.startswith("  ") else line))
    for line in MANY_FNS.splitlines(True)
)
TS_MANY_FNS = TS_MANY_FNS.replace("export function manyPoint(win, sprite, work)", "export function manyPoint(win: DeskWindow, sprite: number | undefined, work: WorkSpace)")
TS_MANY_FNS = TS_MANY_FNS.replace("export function manyFace(target)", "export function manyFace(target: PlayTarget)")
TS_MANY_FNS = TS_MANY_FNS.replace("export function manyOnPath(u, from, to)", "export function manyOnPath(u: number, from: PlayPoint, to: PlayPoint)")
TS_MANY_FNS = TS_MANY_FNS.replace("export function manyPath(u)", "export function manyPath(u: number)")
TS_MANY_FNS = TS_MANY_FNS.replace("export function manyHoldPath(u)", "export function manyHoldPath(u: number)")
TS_MANY_FNS = TS_MANY_FNS.replace("export function manyOffPath(u, from, to)", "export function manyOffPath(u: number, from: PlayPoint, to: PlayPoint)")
if not TS_MANY_FNS.endswith("\n"):
    TS_MANY_FNS += "\n"

TS_TICK = "\n".join(
    (line[2:] if line.startswith("    ") else (line[2:] if line.startswith("  ") else line))
    for line in JS_TICK.splitlines(True)
)

def patch_js(t):
    t = once(t, HEADER_OLD, HEADER_NEW, "js header")
    t = once(
        t,
        '  const RIM = "rim";\n  const SILL = "sill";',
        '  const RIM = "rim";\n  const MANY = "many";\n  const SILL = "sill";',
        "js const",
    )
    t = once(
        t,
        "    rimOff: 2.64,\n    sillHop:",
        "    rimOff: 2.64,\n    manyOn: 2.87,\n    many: 2.38,\n    manyHold: 5.06,\n    manyOff: 2.71,\n    sillHop:",
        "js dur",
    )
    t = once(
        t,
        '    if (key === "terminator") return RIM;\n    return SILL;',
        '    if (key === "terminator") return RIM;\n    if (key === "nexus") return MANY;\n    return SILL;',
        "js playFor",
    )
    t = once(
        t,
        "    if (kind === RIM) return w.width >= 204 && w.height >= 224;\n    return w.width >= 180 && w.height >= 70;",
        "    if (kind === RIM) return w.width >= 204 && w.height >= 224;\n    if (kind === MANY) return w.width >= 194 && w.height >= 162;\n    return w.width >= 180 && w.height >= 70;",
        "js size",
    )
    old_pick = (
        '        leave: "rimmed",\n'
        '        spin: "none",\n'
        '      };\n'
        '    }\n'
        '        if (kind === WRAP) {'
    )
    new_pick = (
        '        leave: "rimmed",\n'
        '        spin: "none",\n'
        '      };\n'
        '    }\n'
        '\n'
        + JS_PICK
        + '        if (kind === WRAP) {'
    )
    t = once(t, old_pick, new_pick, "js pick")
    t = once(
        t,
        '    if (target.kind === RIM) {\n'
        '      const hold = rimPoint(win, sprite, work);\n'
        '      return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '    }\n'
        '    if (target.kind === BURY) {',
        '    if (target.kind === RIM) {\n'
        '      const hold = rimPoint(win, sprite, work);\n'
        '      return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '    }\n'
        '    if (target.kind === MANY) {\n'
        '      const hold = manyPoint(win, sprite, work);\n'
        '      return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '    }\n'
        '    if (target.kind === BURY) {',
        "js refit",
    )
    t = once(
        t,
        '        if (target.kind === RIM) {\n'
        '          return goPhase(next, "rim-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '        }\n'
        '        if (target.kind === WRAP) {',
        '        if (target.kind === RIM) {\n'
        '          return goPhase(next, "rim-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '        }\n'
        '        if (target.kind === MANY) {\n'
        '          return goPhase(next, "many-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '        }\n'
        '        if (target.kind === WRAP) {',
        "js approach",
    )
    t = once(t, "  function beginPlay(target, petX) {", MANY_FNS + "  function beginPlay(target, petX) {", "js fns")
    old_tick = (
        '    if (next.phase === "rim-off") {\n'
        '      const u = next.t / DUR.rimOff;\n'
        '      const pose = rimOffPath(Math.min(1, u), next.from, next.to);\n'
        '      next.x = pose.x;\n'
        '      next.lift = pose.lift;\n'
        '      next.rot = pose.rot;\n'
        '      next.anim = "walk";\n'
        '      next.facing = target.landX >= target.holdX ? 1 : -1;\n'
        '      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);\n'
        '      return next;\n'
        '    }\n'
        '    if (next.phase === "sill-hop") {'
    )
    new_tick = (
        '    if (next.phase === "rim-off") {\n'
        '      const u = next.t / DUR.rimOff;\n'
        '      const pose = rimOffPath(Math.min(1, u), next.from, next.to);\n'
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
    t = once(t, "    RIM,\n    SILL,", "    RIM,\n    MANY,\n    SILL,", "js export kind")
    t = once(
        t,
        "    rimOffPath,\n    pickTarget,",
        "    rimOffPath,\n    manyPoint,\n    manyFace,\n    manyOnPath,\n    manyPath,\n    manyHoldPath,\n    manyOffPath,\n    pickTarget,",
        "js export fns",
    )
    return t

def patch_ts(t):
    t = once(t, HEADER_OLD_TS, HEADER_NEW_TS, "ts header")
    t = once(
        t,
        'export const RIM = "rim";\nexport const SILL = "sill";',
        'export const RIM = "rim";\nexport const MANY = "many";\nexport const SILL = "sill";',
        "ts const",
    )
    t = once(
        t,
        "  rimOff: 2.64,\n  sillHop:",
        "  rimOff: 2.64,\n  manyOn: 2.87,\n  many: 2.38,\n  manyHold: 5.06,\n  manyOff: 2.71,\n  sillHop:",
        "ts dur",
    )
    t = once(
        t,
        "typeof RIM | typeof SILL | typeof IGNORE;",
        "typeof RIM | typeof MANY | typeof SILL | typeof IGNORE;",
        "ts kind",
    )
    t = once(
        t,
        '  | "rim-off"\n  | "sill-hop"',
        '  | "rim-off"\n  | "many-on"\n  | "many"\n  | "many-hold"\n  | "many-off"\n  | "sill-hop"',
        "ts phase",
    )
    t = once(
        t,
        '| "barkstone" | "lampglass" | "blotterair" | "methanebowl" | "inkstone" | "lampedge";',
        '| "barkstone" | "lampglass" | "blotterair" | "methanebowl" | "inkstone" | "lampedge" | "paperweight";',
        "ts side",
    )
    t = once(
        t,
        '| "plaqued" | "thirsted" | "chorded" | "floated" | "faceted" | "rimmed";',
        '| "plaqued" | "thirsted" | "chorded" | "floated" | "faceted" | "rimmed" | "manyed";',
        "ts leave",
    )
    t = once(
        t,
        '  if (key === "terminator") return RIM;\n  return SILL;',
        '  if (key === "terminator") return RIM;\n  if (key === "nexus") return MANY;\n  return SILL;',
        "ts playFor",
    )
    t = once(
        t,
        "  if (kind === RIM) return w.width >= 204 && w.height >= 224;\n    return w.width >= 180 && w.height >= 70;",
        "  if (kind === RIM) return w.width >= 204 && w.height >= 224;\n  if (kind === MANY) return w.width >= 194 && w.height >= 162;\n    return w.width >= 180 && w.height >= 70;",
        "ts size",
    )
    old_pick = (
        '      leave: "rimmed",\n'
        '      spin: "none",\n'
        '    };\n'
        '  }\n'
        '  if (kind === WRAP) {'
    )
    new_pick = (
        '      leave: "rimmed",\n'
        '      spin: "none",\n'
        '    };\n'
        '  }\n'
        '\n'
        + TS_PICK
        + '  if (kind === WRAP) {'
    )
    t = once(t, old_pick, new_pick, "ts pick")
    t = once(
        t,
        '  if (target.kind === RIM) {\n'
        '    const hold = rimPoint(win, sprite, work);\n'
        '    return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '  }\n'
        '  if (target.kind === BURY) {',
        '  if (target.kind === RIM) {\n'
        '    const hold = rimPoint(win, sprite, work);\n'
        '    return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '  }\n'
        '  if (target.kind === MANY) {\n'
        '    const hold = manyPoint(win, sprite, work);\n'
        '    return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '  }\n'
        '  if (target.kind === BURY) {',
        "ts refit",
    )
    t = once(
        t,
        '      if (target.kind === RIM) {\n'
        '        return goPhase(next, "rim-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '      }\n'
        '      if (target.kind === WRAP) {',
        '      if (target.kind === RIM) {\n'
        '        return goPhase(next, "rim-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '      }\n'
        '      if (target.kind === MANY) {\n'
        '        return goPhase(next, "many-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '      }\n'
        '      if (target.kind === WRAP) {',
        "ts approach",
    )
    t = once(
        t,
        "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {",
        TS_MANY_FNS + "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {",
        "ts fns",
    )
    old_tick = (
        '  if (next.phase === "rim-off") {\n'
        '\n'
        '    const u = next.t / DUR.rimOff;\n'
        '\n'
        '    const pose = rimOffPath(Math.min(1, u), next.from, next.to);\n'
        '\n'
        '    next.x = pose.x;\n'
        '\n'
        '    next.lift = pose.lift;\n'
        '\n'
        '    next.rot = pose.rot;\n'
        '\n'
        '    next.anim = "walk";\n'
        '\n'
        '    next.facing = target.landX >= target.holdX ? 1 : -1;\n'
        '\n'
        '    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);\n'
        '\n'
        '    return next;\n'
        '\n'
        '  }\n'
        '  if (next.phase === "sill-hop") {'
    )
    new_tick = (
        '  if (next.phase === "rim-off") {\n'
        '\n'
        '    const u = next.t / DUR.rimOff;\n'
        '\n'
        '    const pose = rimOffPath(Math.min(1, u), next.from, next.to);\n'
        '\n'
        '    next.x = pose.x;\n'
        '\n'
        '    next.lift = pose.lift;\n'
        '\n'
        '    next.rot = pose.rot;\n'
        '\n'
        '    next.anim = "walk";\n'
        '\n'
        '    next.facing = target.landX >= target.holdX ? 1 : -1;\n'
        '\n'
        '    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);\n'
        '\n'
        '    return next;\n'
        '\n'
        '  }\n'
        '\n'
        + TS_TICK
        + '  if (next.phase === "sill-hop") {'
    )
    t = once(t, old_tick, new_tick, "ts tick")
    return t

js_path = HERE / "desktop" / "renderer" / "window-play.js"
ts_path = HERE / "web" / "src" / "lib" / "pets" / "window-play.ts"
js = js_path.read_text(encoding="utf-8")
ts = ts_path.read_text(encoding="utf-8")
js2 = patch_js(js)
ts2 = patch_ts(ts)
js_path.write_text(js2, encoding="utf-8", newline="\n")
ts_path.write_text(ts2, encoding="utf-8", newline="\n")
print("patched js", len(js2) - len(js))
print("patched ts", len(ts2) - len(ts))
