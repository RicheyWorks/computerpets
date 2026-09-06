# -*- coding: utf-8 -*-
"""Apply Choir (choir) chord leftover — second far den window-play."""
from pathlib import Path

HERE = Path(__file__).resolve().parent
BLOB = HERE if (HERE / "chord_fns.js").exists() else Path(".")

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, got {n}\nOLD START: {old[:240]!r}")
    return text.replace(old, new, 1)

HEADER_OLD = (
    "This is the leftover after Pact. This is the first leftover of the far den. Others walk a sill. */"
)
HEADER_NEW = (
    "This is the leftover after Pact. This is the first leftover of the far den. "
    "Choir chords a mid pane as blotter air: walk onto the pane, sit the blotter-air membrane, chord once, sit the overtone, then leave. "
    "Gleam still owns thirst. Pact still owns plaque. Starter still owns bloom. Flame still owns drip. Puff still owns cloud. Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. "
    "Pebble still owns puff. Floss still owns dust. Tun still owns dry. "
    "This is the leftover after Gleam. This is the second leftover of the far den. Others walk a sill. */"
)
HEADER_OLD_TS = (
    "This is the leftover after Pact. This is the first leftover of the far den. Others walk a sill. Same map as desktop `window-play.js`. */"
)
HEADER_NEW_TS = (
    "This is the leftover after Pact. This is the first leftover of the far den. "
    "Choir chords a mid pane as blotter air: walk onto the pane, sit the blotter-air membrane, chord once, sit the overtone, then leave. "
    "Gleam still owns thirst. Pact still owns plaque. Starter still owns bloom. Flame still owns drip. Puff still owns cloud. Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. "
    "Pebble still owns puff. Floss still owns dust. Tun still owns dry. "
    "This is the leftover after Gleam. This is the second leftover of the far den. Others walk a sill. Same map as desktop `window-play.js`. */"
)

CHORD_FNS = (BLOB / "chord_fns.js").read_text(encoding="utf-8")
if not CHORD_FNS.endswith("\n"):
    CHORD_FNS += "\n"
JS_TICK = (BLOB / "js_tick_choir.js").read_text(encoding="utf-8")
JS_PICK = (BLOB / "js_pick_choir.js").read_text(encoding="utf-8")
TS_PICK = (BLOB / "ts_pick_choir.js").read_text(encoding="utf-8")

TS_CHORD_FNS = "\n".join(
    (line[2:] if line.startswith("  ") else line) for line in CHORD_FNS.splitlines(True)
).replace("function chord", "export function chord")
if not TS_CHORD_FNS.endswith("\n"):
    TS_CHORD_FNS += "\n"

TS_TICK = "\n".join(
    (line[2:] if line.startswith("  ") else line) for line in JS_TICK.splitlines(True)
)

def patch_js(t):
    t = once(t, HEADER_OLD, HEADER_NEW, "js header")
    t = once(
        t,
        '  const THIRST = "thirst";\n  const SILL = "sill";',
        '  const THIRST = "thirst";\n  const CHORD = "chord";\n  const SILL = "sill";',
        "js const",
    )
    t = once(
        t,
        "    thirstOff: 2.56,\n    sillHop:",
        "    thirstOff: 2.56,\n    chordOn: 2.71,\n    chord: 2.18,\n    chordHold: 4.58,\n    chordOff: 2.61,\n    sillHop:",
        "js dur",
    )
    t = once(
        t,
        '    if (key === "photovore") return THIRST;\n    return SILL;',
        '    if (key === "photovore") return THIRST;\n    if (key === "choir") return CHORD;\n    return SILL;',
        "js playFor",
    )
    t = once(
        t,
        "    if (kind === THIRST) return w.width >= 190 && w.height >= 170;\n    return w.width >= 180 && w.height >= 70;",
        "    if (kind === THIRST) return w.width >= 190 && w.height >= 170;\n    if (kind === CHORD) return w.width >= 192 && w.height >= 172;\n    return w.width >= 180 && w.height >= 70;",
        "js size",
    )
    old_pick = (
        '        leave: "thirsted",\n'
        '        spin: "none",\n'
        '      };\n'
        '    }\n'
        '\n'
        '        if (kind === WRAP) {'
    )
    new_pick = (
        '        leave: "thirsted",\n'
        '        spin: "none",\n'
        '      };\n'
        '    }\n'
        + JS_PICK
        + '        if (kind === WRAP) {'
    )
    t = once(t, old_pick, new_pick, "js pick")
    old_refit = (
        '    if (target.kind === THIRST) {\n'
        '      const hold = thirstPoint(win, sprite, work);\n'
        '      return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '    }\n'
        '    if (target.kind === BURY) {'
    )
    new_refit = (
        '    if (target.kind === THIRST) {\n'
        '      const hold = thirstPoint(win, sprite, work);\n'
        '      return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '    }\n'
        '    if (target.kind === CHORD) {\n'
        '      const hold = chordPoint(win, sprite, work);\n'
        '      return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '    }\n'
        '    if (target.kind === BURY) {'
    )
    t = once(t, old_refit, new_refit, "js refit")
    old_app = (
        '        if (target.kind === THIRST) {\n'
        '          return goPhase(next, "thirst-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '        }\n'
        '        if (target.kind === WRAP) {'
    )
    new_app = (
        '        if (target.kind === THIRST) {\n'
        '          return goPhase(next, "thirst-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '        }\n'
        '        if (target.kind === CHORD) {\n'
        '          return goPhase(next, "chord-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '        }\n'
        '        if (target.kind === WRAP) {'
    )
    t = once(t, old_app, new_app, "js approach")
    t = once(t, "  function beginPlay(target, petX) {", CHORD_FNS + "  function beginPlay(target, petX) {", "js fns")
    old_tick = (
        '    if (next.phase === "thirst-off") {\n'
        '      const u = next.t / DUR.thirstOff;\n'
        '      const pose = thirstOffPath(Math.min(1, u), next.from, next.to);\n'
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
        '    if (next.phase === "thirst-off") {\n'
        '      const u = next.t / DUR.thirstOff;\n'
        '      const pose = thirstOffPath(Math.min(1, u), next.from, next.to);\n'
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
    t = once(t, "    THIRST,\n    IGNORE,", "    THIRST,\n    CHORD,\n    IGNORE,", "js export kind")
    t = once(
        t,
        "    thirstOffPath,\n    pickTarget,",
        "    thirstOffPath,\n    chordPoint,\n    chordFace,\n    chordOnPath,\n    chordPath,\n    chordHoldPath,\n    chordOffPath,\n    pickTarget,",
        "js export fns",
    )
    return t

def patch_ts(t):
    t = once(t, HEADER_OLD_TS, HEADER_NEW_TS, "ts header")
    t = once(
        t,
        'export const THIRST = "thirst";\nexport const SILL = "sill";',
        'export const THIRST = "thirst";\nexport const CHORD = "chord";\nexport const SILL = "sill";',
        "ts const",
    )
    t = once(
        t,
        "  thirstOff: 2.56,\n  sillHop:",
        "  thirstOff: 2.56,\n  chordOn: 2.71,\n  chord: 2.18,\n  chordHold: 4.58,\n  chordOff: 2.61,\n  sillHop:",
        "ts dur",
    )
    t = once(
        t,
        "typeof THIRST | typeof SILL | typeof IGNORE;",
        "typeof THIRST | typeof CHORD | typeof SILL | typeof IGNORE;",
        "ts kind",
    )
    t = once(
        t,
        '  | "thirst-off"\n  | "sill-hop"',
        '  | "thirst-off"\n  | "chord-on"\n  | "chord"\n  | "chord-hold"\n  | "chord-off"\n  | "sill-hop"',
        "ts phase",
    )
    t = once(
        t,
        '| "barkstone" | "lampglass";',
        '| "barkstone" | "lampglass" | "blotterair";',
        "ts side",
    )
    t = once(
        t,
        '| "plaqued" | "thirsted";',
        '| "plaqued" | "thirsted" | "chorded";',
        "ts leave",
    )
    t = once(
        t,
        '  if (key === "photovore") return THIRST;\n  return SILL;',
        '  if (key === "photovore") return THIRST;\n  if (key === "choir") return CHORD;\n  return SILL;',
        "ts playFor",
    )
    t = once(
        t,
        "  if (kind === THIRST) return w.width >= 190 && w.height >= 170;\n    return w.width >= 180 && w.height >= 70;",
        "  if (kind === THIRST) return w.width >= 190 && w.height >= 170;\n  if (kind === CHORD) return w.width >= 192 && w.height >= 172;\n    return w.width >= 180 && w.height >= 70;",
        "ts size",
    )
    old_pick = (
        '      leave: "thirsted",\n'
        '      spin: "none",\n'
        '    };\n'
        '  }\n'
        '\n'
        '  if (kind === WRAP) {'
    )
    new_pick = (
        '      leave: "thirsted",\n'
        '      spin: "none",\n'
        '    };\n'
        '  }\n'
        + TS_PICK
        + '  if (kind === WRAP) {'
    )
    t = once(t, old_pick, new_pick, "ts pick")
    old_refit = (
        '  if (target.kind === THIRST) {\n'
        '    const hold = thirstPoint(win, sprite, work);\n'
        '    return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '  }\n'
        '  if (target.kind === BURY) {'
    )
    new_refit = (
        '  if (target.kind === THIRST) {\n'
        '    const hold = thirstPoint(win, sprite, work);\n'
        '    return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '  }\n'
        '  if (target.kind === CHORD) {\n'
        '    const hold = chordPoint(win, sprite, work);\n'
        '    return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '  }\n'
        '  if (target.kind === BURY) {'
    )
    t = once(t, old_refit, new_refit, "ts refit")
    old_app = (
        '      if (target.kind === THIRST) {\n'
        '        return goPhase(next, "thirst-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '      }\n'
        '      if (target.kind === WRAP) {'
    )
    new_app = (
        '      if (target.kind === THIRST) {\n'
        '        return goPhase(next, "thirst-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '      }\n'
        '      if (target.kind === CHORD) {\n'
        '        return goPhase(next, "chord-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '      }\n'
        '      if (target.kind === WRAP) {'
    )
    t = once(t, old_app, new_app, "ts approach")
    t = once(
        t,
        "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {",
        TS_CHORD_FNS + "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {",
        "ts fns",
    )
    tick_old = (
        '  if (next.phase === "thirst-off") {\n'
        '\n'
        '    const u = next.t / DUR.thirstOff;\n'
        '\n'
        '    const pose = thirstOffPath(Math.min(1, u), next.from, next.to);\n'
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
if "const CHORD" in js or 'key === "choir") return CHORD' in js:
    raise SystemExit("JS already patched?")
js2 = patch_js(js)
ts2 = patch_ts(ts)
js_path.write_text(js2, encoding="utf-8", newline="\n")
ts_path.write_text(ts2, encoding="utf-8", newline="\n")
print("JS", len(js), "->", len(js2), "delta", len(js2) - len(js))
print("TS", len(ts), "->", len(ts2), "delta", len(ts2) - len(ts))
print("CHORD", "const CHORD" in js2, "export const CHORD" in ts2)
print("choir", 'key === "choir") return CHORD' in js2, 'key === "choir") return CHORD' in ts2)
print("blotterair", js2.count("blotterair"), ts2.count("blotterair"))
print("second far", "second leftover of the far den" in js2)
