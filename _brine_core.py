# -*- coding: utf-8 -*-
from pathlib import Path

HERE = Path(r"C:\Users\730ri\projects\ComputerPets")

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit("%s: expected 1, got %d\nOLD START: %r" % (label, n, old[:320]))
    return text.replace(old, new, 1)

def strip_bom(s):
    if s.startswith("\ufeff"):
        s = s.lstrip("\ufeff")
    return s

HEADER_OLD = (
    "This is the leftover after Dusk. This is the sixth leftover of the far den. Others walk a sill. */"
)
HEADER_NEW = (
    "This is the leftover after Dusk. This is the sixth leftover of the far den. "
    "Brine frosts a window stool as a salt dish: walk onto the stool, sit the frost, then leave. "
    "Knot still owns many. Tun still owns dry. Sheen still owns lick. "
    "This is the leftover after Knot. This is the seventh leftover of the far den. Others walk a sill. */"
)
HEADER_OLD_TS = (
    "This is the leftover after Dusk. This is the sixth leftover of the far den. Others walk a sill. Same map as desktop `window-play.js`. */"
)
HEADER_NEW_TS = (
    "This is the leftover after Dusk. This is the sixth leftover of the far den. "
    "Brine frosts a window stool as a salt dish: walk onto the stool, sit the frost, then leave. "
    "Knot still owns many. Tun still owns dry. Sheen still owns lick. "
    "This is the leftover after Knot. This is the seventh leftover of the far den. Others walk a sill. Same map as desktop `window-play.js`. */"
)

FROST_FNS = strip_bom((HERE / "frost_fns.js").read_text(encoding="utf-8"))
if not FROST_FNS.endswith("\n"):
    FROST_FNS += "\n"
JS_TICK = strip_bom((HERE / "js_tick_brine.js").read_text(encoding="utf-8"))
if not JS_TICK.endswith("\n"):
    JS_TICK += "\n"
JS_PICK = strip_bom((HERE / "js_pick_brine.js").read_text(encoding="utf-8"))
if not JS_PICK.endswith("\n"):
    JS_PICK += "\n"
TS_PICK = strip_bom((HERE / "ts_pick_brine.js").read_text(encoding="utf-8"))
if not TS_PICK.endswith("\n"):
    TS_PICK += "\n"

TS_FROST_FNS = "\n".join(
    (("export " + line[2:]) if line.startswith("  function ") else (line[2:] if line.startswith("  ") else line))
    for line in FROST_FNS.splitlines(True)
)
TS_FROST_FNS = TS_FROST_FNS.replace(
    "export function frostPoint(win, sprite, work)",
    "export function frostPoint(win: DeskWindow, sprite: number | undefined, work: WorkSpace)",
)
TS_FROST_FNS = TS_FROST_FNS.replace(
    "export function frostFace(target)",
    "export function frostFace(target: PlayTarget)",
)
TS_FROST_FNS = TS_FROST_FNS.replace(
    "export function frostOnPath(u, from, to)",
    "export function frostOnPath(u: number, from: PlayPoint, to: PlayPoint)",
)
TS_FROST_FNS = TS_FROST_FNS.replace(
    "export function frostPath(u)",
    "export function frostPath(u: number)",
)
TS_FROST_FNS = TS_FROST_FNS.replace(
    "export function frostHoldPath(u)",
    "export function frostHoldPath(u: number)",
)
TS_FROST_FNS = TS_FROST_FNS.replace(
    "export function frostOffPath(u, from, to)",
    "export function frostOffPath(u: number, from: PlayPoint, to: PlayPoint)",
)
if not TS_FROST_FNS.endswith("\n"):
    TS_FROST_FNS += "\n"

TS_TICK = "\n".join(
    (line[2:] if line.startswith("    ") else (line[2:] if line.startswith("  ") else line))
    for line in JS_TICK.splitlines(True)
)
if not TS_TICK.endswith("\n"):
    TS_TICK += "\n"

def patch_js(t):
    t = once(t, HEADER_OLD, HEADER_NEW, "js header")
    t = once(
        t,
        '  const MANY = "many";\n  const SILL = "sill";',
        '  const MANY = "many";\n  const FROST = "frost";\n  const SILL = "sill";',
        "js const",
    )
    t = once(
        t,
        "    manyOff: 2.71,\n    sillHop:",
        "    manyOff: 2.71,\n    frostOn: 3.12,\n    frost: 2.64,\n    frostHold: 5.48,\n    frostOff: 2.96,\n    sillHop:",
        "js dur",
    )
    t = once(
        t,
        '    if (key === "nexus") return MANY;\n    return SILL;',
        '    if (key === "nexus") return MANY;\n    if (key === "halovore") return FROST;\n    return SILL;',
        "js playFor",
    )
    t = once(
        t,
        "    if (kind === MANY) return w.width >= 194 && w.height >= 162;\n    return w.width >= 180 && w.height >= 70;",
        "    if (kind === MANY) return w.width >= 194 && w.height >= 162;\n    if (kind === FROST) return w.width >= 196 && w.height >= 164;\n    return w.width >= 180 && w.height >= 70;",
        "js size",
    )
    old_pick = (
        '        leave: "manyed",\n'
        '        spin: "none",\n'
        '      };\n'
        '    }\n'
        '        if (kind === WRAP) {'
    )
    new_pick = (
        '        leave: "manyed",\n'
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
        '    if (target.kind === MANY) {\n'
        '      const hold = manyPoint(win, sprite, work);\n'
        '      return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '    }\n'
        '    if (target.kind === BURY) {',
        '    if (target.kind === MANY) {\n'
        '      const hold = manyPoint(win, sprite, work);\n'
        '      return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '    }\n'
        '    if (target.kind === FROST) {\n'
        '      const hold = frostPoint(win, sprite, work);\n'
        '      return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '    }\n'
        '    if (target.kind === BURY) {',
        "js refit",
    )
    t = once(
        t,
        '        if (target.kind === MANY) {\n'
        '          return goPhase(next, "many-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '        }\n'
        '        if (target.kind === WRAP) {',
        '        if (target.kind === MANY) {\n'
        '          return goPhase(next, "many-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '        }\n'
        '        if (target.kind === FROST) {\n'
        '          return goPhase(next, "frost-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '        }\n'
        '        if (target.kind === WRAP) {',
        "js approach",
    )
    t = once(t, "  function beginPlay(target, petX) {", FROST_FNS + "  function beginPlay(target, petX) {", "js fns")
    old_tick = (
        '    if (next.phase === "many-off") {\n'
        '      const u = next.t / DUR.manyOff;\n'
        '      const pose = manyOffPath(Math.min(1, u), next.from, next.to);\n'
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
        '    if (next.phase === "many-off") {\n'
        '      const u = next.t / DUR.manyOff;\n'
        '      const pose = manyOffPath(Math.min(1, u), next.from, next.to);\n'
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
    t = once(t, "    MANY,\n    SILL,", "    MANY,\n    FROST,\n    SILL,", "js export kind")
    t = once(
        t,
        "    manyOffPath,\n    pickTarget,",
        "    manyOffPath,\n    frostPoint,\n    frostFace,\n    frostOnPath,\n    frostPath,\n    frostHoldPath,\n    frostOffPath,\n    pickTarget,",
        "js export fns",
    )
    return t

def patch_ts(t):
    t = once(t, HEADER_OLD_TS, HEADER_NEW_TS, "ts header")
    t = once(
        t,
        'export const MANY = "many";\nexport const SILL = "sill";',
        'export const MANY = "many";\nexport const FROST = "frost";\nexport const SILL = "sill";',
        "ts const",
    )
    t = once(
        t,
        "  manyOff: 2.71,\n  sillHop:",
        "  manyOff: 2.71,\n  frostOn: 3.12,\n  frost: 2.64,\n  frostHold: 5.48,\n  frostOff: 2.96,\n  sillHop:",
        "ts dur",
    )
    t = once(
        t,
        "typeof MANY | typeof SILL | typeof IGNORE;",
        "typeof MANY | typeof FROST | typeof SILL | typeof IGNORE;",
        "ts kind",
    )
    t = once(
        t,
        '  | "many-off"\n  | "sill-hop"',
        '  | "many-off"\n  | "frost-on"\n  | "frost"\n  | "frost-hold"\n  | "frost-off"\n  | "sill-hop"',
        "ts phase",
    )
    t = once(
        t,
        '| "methanebowl" | "inkstone" | "lampedge" | "paperweight";',
        '| "methanebowl" | "inkstone" | "lampedge" | "paperweight" | "saltdish";',
        "ts side",
    )
    t = once(
        t,
        '| "floated" | "faceted" | "rimmed" | "manyed";',
        '| "floated" | "faceted" | "rimmed" | "manyed" | "frosted";',
        "ts leave",
    )
    t = once(
        t,
        '  if (key === "nexus") return MANY;\n  return SILL;',
        '  if (key === "nexus") return MANY;\n  if (key === "halovore") return FROST;\n  return SILL;',
        "ts playFor",
    )
    t = once(
        t,
        "  if (kind === MANY) return w.width >= 194 && w.height >= 162;\n    return w.width >= 180 && w.height >= 70;",
        "  if (kind === MANY) return w.width >= 194 && w.height >= 162;\n  if (kind === FROST) return w.width >= 196 && w.height >= 164;\n    return w.width >= 180 && w.height >= 70;",
        "ts size",
    )
    old_pick = (
        '      leave: "manyed",\n'
        '      spin: "none",\n'
        '    };\n'
        '  }\n'
        '  if (kind === WRAP) {'
    )
    new_pick = (
        '      leave: "manyed",\n'
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
        '  if (target.kind === MANY) {\n'
        '    const hold = manyPoint(win, sprite, work);\n'
        '    return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '  }\n'
        '  if (target.kind === BURY) {',
        '  if (target.kind === MANY) {\n'
        '    const hold = manyPoint(win, sprite, work);\n'
        '    return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '  }\n'
        '  if (target.kind === FROST) {\n'
        '    const hold = frostPoint(win, sprite, work);\n'
        '    return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '  }\n'
        '  if (target.kind === BURY) {',
        "ts refit",
    )
    t = once(
        t,
        '      if (target.kind === MANY) {\n'
        '        return goPhase(next, "many-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '      }\n'
      '      if (target.kind === WRAP) {',
        '      if (target.kind === MANY) {\n'
        '        return goPhase(next, "many-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '      }\n'
        '      if (target.kind === FROST) {\n'
        '        return goPhase(next, "frost-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '      }\n'
        '      if (target.kind === WRAP) {',
        "ts approach",
    )
    t = once(
        t,
        "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {",
        TS_FROST_FNS + "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {",
        "ts fns",
    )
    old_tick_blank = (
        '  if (next.phase === "many-off") {\n'
        '\n'
        '    const u = next.t / DUR.manyOff;\n'
        '\n'
        '    const pose = manyOffPath(Math.min(1, u), next.from, next.to);\n'
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
        '  if (next.phase === "sill-hop") {'
    )
    old_tick_tight = (
        '  if (next.phase === "many-off") {\n'
        '    const u = next.t / DUR.manyOff;\n'
        '    const pose = manyOffPath(Math.min(1, u), next.from, next.to);\n'
        '    next.x = pose.x;\n'
        '    next.lift = pose.lift;\n'
        '    next.rot = pose.rot;\n'
        '    next.anim = "walk";\n'
        '    next.facing = target.landX >= target.holdX ? 1 : -1;\n'
        '    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);\n'
        '    return next;\n'
        '  }\n'
        '  if (next.phase === "sill-hop") {'
    )
    sill_anchor = '  if (next.phase === "sill-hop") {'
    if old_tick_blank in t:
        new_tick = old_tick_blank[: -len(sill_anchor)] + "\n" + TS_TICK + sill_anchor
        t = once(t, old_tick_blank, new_tick, "ts tick blank")
    elif old_tick_tight in t:
        new_tick = old_tick_tight[: -len(sill_anchor)] + "\n" + TS_TICK + sill_anchor
        t = once(t, old_tick_tight, new_tick, "ts tick tight")
    else:
        idx = t.find('if (next.phase === "many-off")')
        raise SystemExit("ts tick: neither blank nor tight matched\n" + repr(t[idx:idx+500]))
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
