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
    "This is the leftover after Knot. This is the seventh leftover of the far den. Others walk a sill. */"
)
HEADER_NEW = (
    "This is the leftover after Knot. This is the seventh leftover of the far den. "
    "Beacon aligns a sash parting bead as a ruler line: walk onto the bead, sit the north, then leave. "
    "Brine still owns frost. Flux still owns field. Bandit still owns inspect. Anchor still owns hitch. Stem still owns stilt. "
    "This is the leftover after Brine. This is the eighth leftover of the far den. Others walk a sill. */"
)
HEADER_OLD_TS = (
    "This is the leftover after Knot. This is the seventh leftover of the far den. Others walk a sill. Same map as desktop `window-play.js`. */"
)
HEADER_NEW_TS = (
    "This is the leftover after Knot. This is the seventh leftover of the far den. "
    "Beacon aligns a sash parting bead as a ruler line: walk onto the bead, sit the north, then leave. "
    "Brine still owns frost. Flux still owns field. Bandit still owns inspect. Anchor still owns hitch. Stem still owns stilt. "
    "This is the leftover after Brine. This is the eighth leftover of the far den. Others walk a sill. Same map as desktop `window-play.js`. */"
)

ALIGN_FNS = strip_bom((HERE / "align_fns.js").read_text(encoding="utf-8"))
if not ALIGN_FNS.endswith("\n"):
    ALIGN_FNS += "\n"
JS_TICK = strip_bom((HERE / "js_tick_beacon.js").read_text(encoding="utf-8"))
if not JS_TICK.endswith("\n"):
    JS_TICK += "\n"
JS_PICK = strip_bom((HERE / "js_pick_beacon.js").read_text(encoding="utf-8"))
if not JS_PICK.endswith("\n"):
    JS_PICK += "\n"
TS_PICK = strip_bom((HERE / "ts_pick_beacon.js").read_text(encoding="utf-8"))
if not TS_PICK.endswith("\n"):
    TS_PICK += "\n"

TS_ALIGN_FNS = "\n".join(
    (("export " + line[2:]) if line.startswith("  function ") else (line[2:] if line.startswith("  ") else line))
    for line in ALIGN_FNS.splitlines(True)
)
TS_ALIGN_FNS = TS_ALIGN_FNS.replace(
    "export function alignPoint(win, sprite, work)",
    "export function alignPoint(win: DeskWindow, sprite: number | undefined, work: WorkSpace)",
)
TS_ALIGN_FNS = TS_ALIGN_FNS.replace(
    "export function alignFace(target)",
    "export function alignFace(target: PlayTarget)",
)
TS_ALIGN_FNS = TS_ALIGN_FNS.replace(
    "export function alignOnPath(u, from, to)",
    "export function alignOnPath(u: number, from: PlayPoint, to: PlayPoint)",
)
TS_ALIGN_FNS = TS_ALIGN_FNS.replace(
    "export function alignPath(u)",
    "export function alignPath(u: number)",
)
TS_ALIGN_FNS = TS_ALIGN_FNS.replace(
    "export function alignHoldPath(u)",
    "export function alignHoldPath(u: number)",
)
TS_ALIGN_FNS = TS_ALIGN_FNS.replace(
    "export function alignOffPath(u, from, to)",
    "export function alignOffPath(u: number, from: PlayPoint, to: PlayPoint)",
)
if not TS_ALIGN_FNS.endswith("\n"):
    TS_ALIGN_FNS += "\n"

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
        '  const FROST = "frost";\n  const SILL = "sill";',
        '  const FROST = "frost";\n  const ALIGN = "align";\n  const SILL = "sill";',
        "js const",
    )
    t = once(
        t,
        "    frostOff: 2.96,\n    sillHop:",
        "    frostOff: 2.96,\n    alignOn: 3.04,\n    align: 2.52,\n    alignHold: 5.28,\n    alignOff: 2.84,\n    sillHop:",
        "js dur",
    )
    t = once(
        t,
        '    if (key === "halovore") return FROST;\n    return SILL;',
        '    if (key === "halovore") return FROST;\n    if (key === "magneton") return ALIGN;\n    return SILL;',
        "js playFor",
    )
    t = once(
        t,
        "    if (kind === FROST) return w.width >= 196 && w.height >= 164;\n    return w.width >= 180 && w.height >= 70;",
        "    if (kind === FROST) return w.width >= 196 && w.height >= 164;\n    if (kind === ALIGN) return w.width >= 172 && w.height >= 212;\n    return w.width >= 180 && w.height >= 70;",
        "js size",
    )
    old_pick = (
        '        leave: "frosted",\n'
        '        spin: "none",\n'
        '      };\n'
        '    }\n'
        '        if (kind === WRAP) {'
    )
    new_pick = (
        '        leave: "frosted",\n'
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
        '    if (target.kind === FROST) {\n'
        '      const hold = frostPoint(win, sprite, work);\n'
        '      return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '    }\n'
        '    if (target.kind === BURY) {',
        '    if (target.kind === FROST) {\n'
        '      const hold = frostPoint(win, sprite, work);\n'
        '      return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '    }\n'
        '    if (target.kind === ALIGN) {\n'
        '      const hold = alignPoint(win, sprite, work);\n'
        '      return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '    }\n'
        '    if (target.kind === BURY) {',
        "js refit",
    )
    t = once(
        t,
        '        if (target.kind === FROST) {\n'
        '          return goPhase(next, "frost-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '        }\n'
        '        if (target.kind === WRAP) {',
        '        if (target.kind === FROST) {\n'
        '          return goPhase(next, "frost-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '        }\n'
        '        if (target.kind === ALIGN) {\n'
        '          return goPhase(next, "align-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '        }\n'
        '        if (target.kind === WRAP) {',
        "js approach",
    )
    t = once(t, "  function beginPlay(target, petX) {", ALIGN_FNS + "  function beginPlay(target, petX) {", "js fns")
    old_tick = (
        '    if (next.phase === "frost-off") {\n'
        '      const u = next.t / DUR.frostOff;\n'
        '      const pose = frostOffPath(Math.min(1, u), next.from, next.to);\n'
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
        '    if (next.phase === "frost-off") {\n'
        '      const u = next.t / DUR.frostOff;\n'
        '      const pose = frostOffPath(Math.min(1, u), next.from, next.to);\n'
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
    t = once(t, "    FROST,\n    SILL,", "    FROST,\n    ALIGN,\n    SILL,", "js export kind")
    t = once(
        t,
        "    frostOffPath,\n    pickTarget,",
        "    frostOffPath,\n    alignPoint,\n    alignFace,\n    alignOnPath,\n    alignPath,\n    alignHoldPath,\n    alignOffPath,\n    pickTarget,",
        "js export fns",
    )
    return t

def patch_ts(t):
    t = once(t, HEADER_OLD_TS, HEADER_NEW_TS, "ts header")
    t = once(
        t,
        'export const FROST = "frost";\nexport const SILL = "sill";',
        'export const FROST = "frost";\nexport const ALIGN = "align";\nexport const SILL = "sill";',
        "ts const",
    )
    t = once(
        t,
        "  frostOff: 2.96,\n  sillHop:",
        "  frostOff: 2.96,\n  alignOn: 3.04,\n  align: 2.52,\n  alignHold: 5.28,\n  alignOff: 2.84,\n  sillHop:",
        "ts dur",
    )
    t = once(
        t,
        "typeof FROST | typeof SILL | typeof IGNORE;",
        "typeof FROST | typeof ALIGN | typeof SILL | typeof IGNORE;",
        "ts kind",
    )
    t = once(
        t,
        '  | "frost-off"\n  | "sill-hop"',
        '  | "frost-off"\n  | "frost-on"\n  | "frost"\n  | "frost-hold"\n  | "frost-off"\n  | "sill-hop"',
        "ts phase",
    )
    t = once(
        t,
        '| "inkstone" | "lampedge" | "paperweight" | "saltdish";',
        '| "inkstone" | "lampedge" | "paperweight" | "saltdish" | "rulerline";',
        "ts side",
    )
    t = once(
        t,
        '| "floated" | "faceted" | "rimmed" | "manyed" | "frosted";',
        '| "floated" | "faceted" | "rimmed" | "manyed" | "frosted" | "aligned";',
        "ts leave",
    )
    t = once(
        t,
        '  if (key === "halovore") return FROST;\n  return SILL;',
        '  if (key === "halovore") return FROST;\n  if (key === "magneton") return ALIGN;\n  return SILL;',
        "ts playFor",
    )
    t = once(
        t,
        "  if (kind === FROST) return w.width >= 196 && w.height >= 164;\n    return w.width >= 180 && w.height >= 70;",
        "  if (kind === FROST) return w.width >= 196 && w.height >= 164;\n  if (kind === ALIGN) return w.width >= 172 && w.height >= 212;\n    return w.width >= 180 && w.height >= 70;",
        "ts size",
    )
    old_pick = (
        '      leave: "frosted",\n'
        '      spin: "none",\n'
        '    };\n'
        '  }\n'
        '  if (kind === WRAP) {'
    )
    new_pick = (
        '      leave: "frosted",\n'
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
        '  if (target.kind === FROST) {\n'
        '    const hold = frostPoint(win, sprite, work);\n'
        '    return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '  }\n'
        '  if (target.kind === BURY) {',
        '  if (target.kind === FROST) {\n'
        '    const hold = frostPoint(win, sprite, work);\n'
        '    return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '  }\n'
        '  if (target.kind === ALIGN) {\n'
        '    const hold = alignPoint(win, sprite, work);\n'
        '    return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '  }\n'
        '  if (target.kind === BURY) {',
        "ts refit",
    )
    t = once(
        t,
        '      if (target.kind === FROST) {\n'
        '        return goPhase(next, "frost-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '      }\n'
      '      if (target.kind === WRAP) {',
        '      if (target.kind === FROST) {\n'
        '        return goPhase(next, "frost-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '      }\n'
        '      if (target.kind === ALIGN) {\n'
        '        return goPhase(next, "align-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '      }\n'
        '      if (target.kind === WRAP) {',
        "ts approach",
    )
    t = once(
        t,
        "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {",
        TS_ALIGN_FNS + "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {",
        "ts fns",
    )
    old_tick_blank = (
        '  if (next.phase === "frost-off") {\n'
        '\n'
        '    const u = next.t / DUR.frostOff;\n'
        '\n'
        '    const pose = frostOffPath(Math.min(1, u), next.from, next.to);\n'
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
    old_tick_mid = (
        '  if (next.phase === "frost-off") {\n'
        '\n'
        '    const u = next.t / DUR.frostOff;\n'
        '\n'
        '    const pose = frostOffPath(Math.min(1, u), next.from, next.to);\n'
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
    old_tick_tight = (
        '  if (next.phase === "frost-off") {\n'
        '    const u = next.t / DUR.frostOff;\n'
        '    const pose = frostOffPath(Math.min(1, u), next.from, next.to);\n'
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
    elif old_tick_mid in t:
        new_tick = old_tick_mid[: -len(sill_anchor)] + "\n" + TS_TICK + sill_anchor
        t = once(t, old_tick_mid, new_tick, "ts tick mid")
    elif old_tick_tight in t:
        new_tick = old_tick_tight[: -len(sill_anchor)] + "\n" + TS_TICK + sill_anchor
        t = once(t, old_tick_tight, new_tick, "ts tick tight")
    else:
        idx = t.find('if (next.phase === "frost-off")')
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
