# -*- coding: utf-8 -*-
"""Apply Gleam (photovore) thirst leftover — first far den window-play."""
from pathlib import Path

HERE = Path(__file__).resolve().parent
# When run from ComputerPets root, blobs live beside this script.
BLOB = HERE if (HERE / "thirst_fns.js").exists() else Path(".")

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, got {n}\nOLD START: {old[:220]!r}")
    return text.replace(old, new, 1)

HEADER_OLD = "This is the leftover after Starter. This is the tenth leftover of the fungi den and closes fungi ten. Others walk a sill. */"
HEADER_NEW = (
    "This is the leftover after Starter. This is the tenth leftover of the fungi den and closes fungi ten. "
    "Gleam thirsts a bright pane as lamp glass: walk onto the pane, sit the bright lamp glass, thirst once, sit the wavelength drink, then leave. "
    "Pact still owns plaque. Starter still owns bloom. Flame still owns drip. Puff still owns cloud. Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. "
    "Pebble still owns puff. Floss still owns dust. Tun still owns dry. "
    "This is the leftover after Pact. This is the first leftover of the far den. Others walk a sill. */"
)
HEADER_OLD_TS = "This is the leftover after Starter. This is the tenth leftover of the fungi den and closes fungi ten. Others walk a sill. Same map as desktop `window-play.js`. */"
HEADER_NEW_TS = (
    "This is the leftover after Starter. This is the tenth leftover of the fungi den and closes fungi ten. "
    "Gleam thirsts a bright pane as lamp glass: walk onto the pane, sit the bright lamp glass, thirst once, sit the wavelength drink, then leave. "
    "Pact still owns plaque. Starter still owns bloom. Flame still owns drip. Puff still owns cloud. Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. "
    "Pebble still owns puff. Floss still owns dust. Tun still owns dry. "
    "This is the leftover after Pact. This is the first leftover of the far den. Others walk a sill. Same map as desktop `window-play.js`. */"
)

THIRST_FNS = (BLOB / "thirst_fns.js").read_text(encoding="utf-8")
JS_TICK = (BLOB / "js_tick.js").read_text(encoding="utf-8")
JS_PICK = (BLOB / "js_pick.js").read_text(encoding="utf-8")
TS_PICK = (BLOB / "ts_pick.js").read_text(encoding="utf-8")

TS_THIRST_FNS = "\n".join(
    (line[2:] if line.startswith("  ") else line) for line in THIRST_FNS.splitlines(True)
).replace("function thirst", "export function thirst")

TS_TICK = "\n".join(
    (line[2:] if line.startswith("  ") else line) for line in JS_TICK.splitlines(True)
)

def patch_js(t):
    t = once(t, HEADER_OLD, HEADER_NEW, "js header")
    t = once(t, '  const PLAQUE = "plaque";\n  const SILL = "sill";', '  const PLAQUE = "plaque";\n  const THIRST = "thirst";\n  const SILL = "sill";', "js const")
    t = once(t, "    plaqueOff: 2.59,\n    sillHop:", "    plaqueOff: 2.59,\n    thirstOn: 2.69,\n    thirst: 2.14,\n    thirstHold: 4.52,\n    thirstOff: 2.56,\n    sillHop:", "js dur")
    t = once(t, '    if (key === "lichen") return PLAQUE;\n    return SILL;', '    if (key === "lichen") return PLAQUE;\n    if (key === "photovore") return THIRST;\n    return SILL;', "js playFor")
    t = once(t, "    if (kind === PLAQUE) return w.width >= 188 && w.height >= 168;\n    return w.width >= 180 && w.height >= 70;", "    if (kind === PLAQUE) return w.width >= 188 && w.height >= 168;\n    if (kind === THIRST) return w.width >= 190 && w.height >= 170;\n    return w.width >= 180 && w.height >= 70;", "js size")
    old_pick = (
        '        leave: "plaqued",\n'
        '        spin: "none",\n'
        '      };\n'
        '    }\n'
        '\n'
        '\n'
        '        if (kind === WRAP) {'
    )
    new_pick = (
        '        leave: "plaqued",\n'
        '        spin: "none",\n'
        '      };\n'
        '    }\n'
        + JS_PICK +
        '        if (kind === WRAP) {'
    )
    t = once(t, old_pick, new_pick, "js pick")
    old_refit = (
        '    if (target.kind === PLAQUE) {\n'
        '      const hold = plaquePoint(win, sprite, work);\n'
        '      return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '    }\n'
        '    if (target.kind === BURY) {'
    )
    new_refit = (
        '    if (target.kind === PLAQUE) {\n'
        '      const hold = plaquePoint(win, sprite, work);\n'
        '      return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '    }\n'
        '    if (target.kind === THIRST) {\n'
        '      const hold = thirstPoint(win, sprite, work);\n'
        '      return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '    }\n'
        '    if (target.kind === BURY) {'
    )
    t = once(t, old_refit, new_refit, "js refit")
    old_app = (
        '        if (target.kind === PLAQUE) {\n'
        '          return goPhase(next, "plaque-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '        }\n'
        '        if (target.kind === WRAP) {'
    )
    new_app = (
        '        if (target.kind === PLAQUE) {\n'
        '          return goPhase(next, "plaque-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '        }\n'
        '        if (target.kind === THIRST) {\n'
        '          return goPhase(next, "thirst-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '        }\n'
        '        if (target.kind === WRAP) {'
    )
    t = once(t, old_app, new_app, "js approach")
    t = once(t, "  function beginPlay(target, petX) {", THIRST_FNS + "  function beginPlay(target, petX) {", "js fns")
    old_tick = (
        '    if (next.phase === "plaque-off") {\n'
        '      const u = next.t / DUR.plaqueOff;\n'
        '      const pose = plaqueOffPath(Math.min(1, u), next.from, next.to);\n'
        '      next.x = pose.x;\n'
        '      next.lift = pose.lift;\n'
        '      next.rot = pose.rot;\n'
        '      next.anim = "walk";\n'
        '      next.facing = target.landX >= target.holdX ? 1 : -1;\n'
        '      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);\n'
        '      return next;\n'
        '    }\n'
        '\n'
        '\n'
        '    if (next.phase === "sill-hop") {'
    )
    new_tick = (
        '    if (next.phase === "plaque-off") {\n'
        '      const u = next.t / DUR.plaqueOff;\n'
        '      const pose = plaqueOffPath(Math.min(1, u), next.from, next.to);\n'
        '      next.x = pose.x;\n'
        '      next.lift = pose.lift;\n'
        '      next.rot = pose.rot;\n'
        '      next.anim = "walk";\n'
        '      next.facing = target.landX >= target.holdX ? 1 : -1;\n'
        '      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);\n'
        '      return next;\n'
        '    }\n'
        + JS_TICK +
        '    if (next.phase === "sill-hop") {'
    )
    t = once(t, old_tick, new_tick, "js tick")
    t = once(t, "    PLAQUE,\n    IGNORE,", "    PLAQUE,\n    THIRST,\n    IGNORE,", "js export kind")
    t = once(t, "    plaqueOffPath,\n    pickTarget,", "    plaqueOffPath,\n    thirstPoint,\n    thirstFace,\n    thirstOnPath,\n    thirstPath,\n    thirstHoldPath,\n    thirstOffPath,\n    pickTarget,", "js export fns")
    return t

def patch_ts(t):
    t = once(t, HEADER_OLD_TS, HEADER_NEW_TS, "ts header")
    t = once(t, 'export const PLAQUE = "plaque";\nexport const SILL = "sill";', 'export const PLAQUE = "plaque";\nexport const THIRST = "thirst";\nexport const SILL = "sill";', "ts const")
    t = once(t, "  plaqueOff: 2.59,\n  sillHop:", "  plaqueOff: 2.59,\n  thirstOn: 2.69,\n  thirst: 2.14,\n  thirstHold: 4.52,\n  thirstOff: 2.56,\n  sillHop:", "ts dur")
    t = once(t, "typeof PLAQUE | typeof SILL | typeof IGNORE;", "typeof PLAQUE | typeof THIRST | typeof SILL | typeof IGNORE;", "ts kind")
    t = once(t, '  | "plaque-off"\n  | "sill-hop"', '  | "plaque-off"\n  | "thirst-on"\n  | "thirst"\n  | "thirst-hold"\n  | "thirst-off"\n  | "sill-hop"', "ts phase")
    t = once(t, '| "sporedish" | "warmwood" | "yeastfilm" | "barkstone";', '| "sporedish" | "warmwood" | "yeastfilm" | "barkstone" | "lampglass";', "ts side")
    t = once(t, '| "clouded" | "dripped" | "bloomed" | "plaqued";', '| "clouded" | "dripped" | "bloomed" | "plaqued" | "thirsted";', "ts leave")
    t = once(t, '  if (key === "lichen") return PLAQUE;\n  return SILL;', '  if (key === "lichen") return PLAQUE;\n  if (key === "photovore") return THIRST;\n  return SILL;', "ts playFor")
    t = once(t, "  if (kind === PLAQUE) return w.width >= 188 && w.height >= 168;\n    return w.width >= 180 && w.height >= 70;", "  if (kind === PLAQUE) return w.width >= 188 && w.height >= 168;\n  if (kind === THIRST) return w.width >= 190 && w.height >= 170;\n    return w.width >= 180 && w.height >= 70;", "ts size")
    old_pick = (
        '      leave: "plaqued",\n'
        '      spin: "none",\n'
        '    };\n'
        '  }\n'
        '\n'
        '\n'
        '  if (kind === WRAP) {'
    )
    new_pick = (
        '      leave: "plaqued",\n'
        '      spin: "none",\n'
        '    };\n'
        '  }\n'
        + TS_PICK +
        '  if (kind === WRAP) {'
    )
    t = once(t, old_pick, new_pick, "ts pick")
    old_refit = (
        '  if (target.kind === PLAQUE) {\n'
        '    const hold = plaquePoint(win, sprite, work);\n'
        '    return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '  }\n'
        '  if (target.kind === BURY) {'
    )
    new_refit = (
        '  if (target.kind === PLAQUE) {\n'
        '    const hold = plaquePoint(win, sprite, work);\n'
        '    return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '  }\n'
        '  if (target.kind === THIRST) {\n'
        '    const hold = thirstPoint(win, sprite, work);\n'
        '    return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '  }\n'
        '  if (target.kind === BURY) {'
    )
    t = once(t, old_refit, new_refit, "ts refit")
    old_app = (
        '      if (target.kind === PLAQUE) {\n'
        '        return goPhase(next, "plaque-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '      }\n'
        '      if (target.kind === WRAP) {'
    )
    new_app = (
        '      if (target.kind === PLAQUE) {\n'
        '        return goPhase(next, "plaque-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '      }\n'
        '      if (target.kind === THIRST) {\n'
        '        return goPhase(next, "thirst-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '      }\n'
        '      if (target.kind === WRAP) {'
    )
    t = once(t, old_app, new_app, "ts approach")
    t = once(t, "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {", TS_THIRST_FNS + "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {", "ts fns")
    tick_old = (
        '  if (next.phase === "plaque-off") {\n'
        '\n'
        '    const u = next.t / DUR.plaqueOff;\n'
        '\n'
        '    const pose = plaqueOffPath(Math.min(1, u), next.from, next.to);\n'
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
    )
    t = once(t, tick_old + '  if (next.phase === "sill-hop") {', tick_old + TS_TICK + '  if (next.phase === "sill-hop") {', "ts tick")
    return t

js_path = Path("desktop/renderer/window-play.js")
ts_path = Path("web/src/lib/pets/window-play.ts")
js = js_path.read_text(encoding="utf-8")
ts = ts_path.read_text(encoding="utf-8")
js2 = patch_js(js)
ts2 = patch_ts(ts)
js_path.write_text(js2, encoding="utf-8", newline="\n")
ts_path.write_text(ts2, encoding="utf-8", newline="\n")
print("JS", len(js), "->", len(js2), "delta", len(js2) - len(js))
print("TS", len(ts), "->", len(ts2), "delta", len(ts2) - len(ts))
print("THIRST", "const THIRST" in js2, "export const THIRST" in ts2)
print("photovore", 'key === "photovore") return THIRST' in js2, 'key === "photovore") return THIRST' in ts2)
print("lampglass", js2.count("lampglass"), ts2.count("lampglass"))
print("far den", "first leftover of the far den" in js2)
