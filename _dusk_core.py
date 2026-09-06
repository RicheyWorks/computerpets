# -*- coding: utf-8 -*-
from pathlib import Path

HERE = Path(r"C:\Users\730ri\projects\ComputerPets")

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit("%s: expected 1, got %d\nOLD START: %r" % (label, n, old[:320]))
    return text.replace(old, new, 1)

HEADER_OLD = "This is the leftover after Nimbus. This is the fourth leftover of the far den. Others walk a sill. */"
HEADER_NEW = (
    "This is the leftover after Nimbus. This is the fourth leftover of the far den. "
    "Dusk rims a lamp-side stile as a lamp-edge: walk onto the stile, sit the rim, then leave. "
    "Night still owns dusk. Shard still owns facet. "
    "This is the leftover after Shard. This is the fifth leftover of the far den. Others walk a sill. */"
)
HEADER_OLD_TS = "This is the leftover after Nimbus. This is the fourth leftover of the far den. Others walk a sill. Same map as desktop `window-play.js`. */"
HEADER_NEW_TS = (
    "This is the leftover after Nimbus. This is the fourth leftover of the far den. "
    "Dusk rims a lamp-side stile as a lamp-edge: walk onto the stile, sit the rim, then leave. "
    "Night still owns dusk. Shard still owns facet. "
    "This is the leftover after Shard. This is the fifth leftover of the far den. Others walk a sill. Same map as desktop `window-play.js`. */"
)

RIM_FNS = (HERE / "rim_fns.js").read_text(encoding="utf-8")
if RIM_FNS.startswith("\ufeff"):
    RIM_FNS = RIM_FNS.lstrip("\ufeff")
if not RIM_FNS.endswith("\n"):
    RIM_FNS += "\n"
JS_TICK = (HERE / "js_tick_dusk.js").read_text(encoding="utf-8")
if JS_TICK.startswith("\ufeff"):
    JS_TICK = JS_TICK.lstrip("\ufeff")
JS_PICK = (HERE / "js_pick_dusk.js").read_text(encoding="utf-8")
if JS_PICK.startswith("\ufeff"):
    JS_PICK = JS_PICK.lstrip("\ufeff")
TS_PICK = (HERE / "ts_pick_dusk.js").read_text(encoding="utf-8")
if TS_PICK.startswith("\ufeff"):
    TS_PICK = TS_PICK.lstrip("\ufeff")

TS_RIM_FNS = "\n".join(
    (("export " + line[2:]) if line.startswith("  function ") else (line[2:] if line.startswith("  ") else line))
    for line in RIM_FNS.splitlines(True)
)
TS_RIM_FNS = TS_RIM_FNS.replace("export function rimPoint(win, sprite, work)", "export function rimPoint(win: DeskWindow, sprite: number | undefined, work: WorkSpace)")
TS_RIM_FNS = TS_RIM_FNS.replace("export function rimFace(target)", "export function rimFace(target: PlayTarget)")
TS_RIM_FNS = TS_RIM_FNS.replace("export function rimOnPath(u, from, to)", "export function rimOnPath(u: number, from: PlayPoint, to: PlayPoint)")
TS_RIM_FNS = TS_RIM_FNS.replace("export function rimPath(u)", "export function rimPath(u: number)")
TS_RIM_FNS = TS_RIM_FNS.replace("export function rimHoldPath(u)", "export function rimHoldPath(u: number)")
TS_RIM_FNS = TS_RIM_FNS.replace("export function rimOffPath(u, from, to)", "export function rimOffPath(u: number, from: PlayPoint, to: PlayPoint)")
if not TS_RIM_FNS.endswith("\n"):
    TS_RIM_FNS += "\n"

TS_TICK = "\n".join(
    (line[2:] if line.startswith("    ") else (line[2:] if line.startswith("  ") else line))
    for line in JS_TICK.splitlines(True)
)

def patch_js(t):
    t = once(t, HEADER_OLD, HEADER_NEW, "js header")
    t = once(
        t,
        '  const FACET = "facet";\n  const SILL = "sill";',
        '  const FACET = "facet";\n  const RIM = "rim";\n  const SILL = "sill";',
        "js const",
    )
    t = once(
        t,
        "    facetOff: 2.61,\n    sillHop:",
        "    facetOff: 2.61,\n    rimOn: 2.83,\n    rim: 2.31,\n    rimHold: 4.92,\n    rimOff: 2.64,\n    sillHop:",
        "js dur",
    )
    t = once(
        t,
        '    if (key === "silica") return FACET;\n    return SILL;',
        '    if (key === "silica") return FACET;\n    if (key === "terminator") return RIM;\n    return SILL;',
        "js playFor",
    )
    t = once(
        t,
        "    if (kind === FACET) return w.width >= 188 && w.height >= 198;\n    return w.width >= 180 && w.height >= 70;",
        "    if (kind === FACET) return w.width >= 188 && w.height >= 198;\n    if (kind === RIM) return w.width >= 204 && w.height >= 224;\n    return w.width >= 180 && w.height >= 70;",
        "js size",
    )
    old_pick = (
        '        leave: "faceted",\n'
        '        spin: "none",\n'
        '      };\n'
        '    }\n'
        '\n'
        '        if (kind === WRAP) {'
    )
    new_pick = (
        '        leave: "faceted",\n'
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
        '    if (target.kind === FACET) {\n'
        '      const hold = facetPoint(win, sprite, work);\n'
        '      return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '    }\n'
        '    if (target.kind === BURY) {',
        '    if (target.kind === FACET) {\n'
        '      const hold = facetPoint(win, sprite, work);\n'
        '      return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '    }\n'
        '    if (target.kind === RIM) {\n'
        '      const hold = rimPoint(win, sprite, work);\n'
        '      return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '    }\n'
        '    if (target.kind === BURY) {',
        "js refit",
    )
    t = once(
        t,
        '        if (target.kind === FACET) {\n'
        '          return goPhase(next, "facet-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '        }\n'
        '        if (target.kind === WRAP) {',
        '        if (target.kind === FACET) {\n'
        '          return goPhase(next, "facet-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '        }\n'
        '        if (target.kind === RIM) {\n'
        '          return goPhase(next, "rim-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '        }\n'
        '        if (target.kind === WRAP) {',
        "js approach",
    )
    t = once(t, "  function beginPlay(target, petX) {", RIM_FNS + "  function beginPlay(target, petX) {", "js fns")
    old_tick = (
        '    if (next.phase === "facet-off") {\n'
        '      const u = next.t / DUR.facetOff;\n'
        '      const pose = facetOffPath(Math.min(1, u), next.from, next.to);\n'
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
        '    if (next.phase === "facet-off") {\n'
        '      const u = next.t / DUR.facetOff;\n'
        '      const pose = facetOffPath(Math.min(1, u), next.from, next.to);\n'
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
    t = once(t, "    FACET,\n    SILL,", "    FACET,\n    RIM,\n    SILL,", "js export kind")
    t = once(
        t,
        "    facetOffPath,\n    pickTarget,",
        "    facetOffPath,\n    rimPoint,\n    rimFace,\n    rimOnPath,\n    rimPath,\n    rimHoldPath,\n    rimOffPath,\n    pickTarget,",
        "js export fns",
    )
    return t

def patch_ts(t):
    t = once(t, HEADER_OLD_TS, HEADER_NEW_TS, "ts header")
    t = once(
        t,
        'export const FACET = "facet";\nexport const SILL = "sill";',
        'export const FACET = "facet";\nexport const RIM = "rim";\nexport const SILL = "sill";',
        "ts const",
    )
    t = once(
        t,
        "  facetOff: 2.61,\n  sillHop:",
        "  facetOff: 2.61,\n  rimOn: 2.83,\n  rim: 2.31,\n  rimHold: 4.92,\n  rimOff: 2.64,\n  sillHop:",
        "ts dur",
    )
    t = once(
        t,
        "typeof FACET | typeof SILL | typeof IGNORE;",
        "typeof FACET | typeof RIM | typeof SILL | typeof IGNORE;",
        "ts kind",
    )
    t = once(
        t,
        '  | "facet-off"\n  | "sill-hop"',
        '  | "facet-off"\n  | "rim-on"\n  | "rim"\n  | "rim-hold"\n  | "rim-off"\n  | "sill-hop"',
        "ts phase",
    )
    t = once(
        t,
        '| "barkstone" | "lampglass" | "blotterair" | "methanebowl" | "inkstone";',
        '| "barkstone" | "lampglass" | "blotterair" | "methanebowl" | "inkstone" | "lampedge";',
        "ts side",
    )
    t = once(
        t,
        '| "plaqued" | "thirsted" | "chorded" | "floated" | "faceted";',
        '| "plaqued" | "thirsted" | "chorded" | "floated" | "faceted" | "rimmed";',
        "ts leave",
    )
    t = once(
        t,
        '  if (key === "silica") return FACET;\n  return SILL;',
        '  if (key === "silica") return FACET;\n  if (key === "terminator") return RIM;\n  return SILL;',
        "ts playFor",
    )
    t = once(
        t,
        "  if (kind === FACET) return w.width >= 188 && w.height >= 198;\n    return w.width >= 180 && w.height >= 70;",
        "  if (kind === FACET) return w.width >= 188 && w.height >= 198;\n  if (kind === RIM) return w.width >= 204 && w.height >= 224;\n    return w.width >= 180 && w.height >= 70;",
        "ts size",
    )
    old_pick = (
        '      leave: "faceted",\n'
        '      spin: "none",\n'
        '    };\n'
        '  }\n'
        '\n'
        '  if (kind === WRAP) {'
    )
    new_pick = (
        '      leave: "faceted",\n'
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
        '  if (target.kind === FACET) {\n'
        '    const hold = facetPoint(win, sprite, work);\n'
        '    return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '  }\n'
        '  if (target.kind === BURY) {',
        '  if (target.kind === FACET) {\n'
        '    const hold = facetPoint(win, sprite, work);\n'
        '    return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '  }\n'
        '  if (target.kind === RIM) {\n'
        '    const hold = rimPoint(win, sprite, work);\n'
        '    return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '  }\n'
        '  if (target.kind === BURY) {',
        "ts refit",
    )
    t = once(
        t,
        '      if (target.kind === FACET) {\n'
        '        return goPhase(next, "facet-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '      }\n'
        '      if (target.kind === WRAP) {',
        '      if (target.kind === FACET) {\n'
        '        return goPhase(next, "facet-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '      }\n'
        '      if (target.kind === RIM) {\n'
        '        return goPhase(next, "rim-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '      }\n'
        '      if (target.kind === WRAP) {',
        "ts approach",
    )
    t = once(
        t,
        "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {",
        TS_RIM_FNS + "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {",
        "ts fns",
    )
    old_tick = (
        '  if (next.phase === "facet-off") {\n'
        '\n'
        '    const u = next.t / DUR.facetOff;\n'
        '\n'
        '    const pose = facetOffPath(Math.min(1, u), next.from, next.to);\n'
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
        '\n'
        '  if (next.phase === "sill-hop") {'
    )
    new_tick = (
        '  if (next.phase === "facet-off") {\n'
        '\n'
        '    const u = next.t / DUR.facetOff;\n'
        '\n'
        '    const pose = facetOffPath(Math.min(1, u), next.from, next.to);\n'
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