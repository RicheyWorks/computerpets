from pathlib import Path
import re

p = Path("_beacon_core.py")
t = p.read_text(encoding="utf-8")

# blob sources
t = t.replace("frost_fns.js", "align_fns.js")
t = t.replace("js_tick_brine.js", "js_tick_beacon.js")
t = t.replace("js_pick_brine.js", "js_pick_beacon.js")
t = t.replace("ts_pick_brine.js", "ts_pick_beacon.js")
t = t.replace("FROST_FNS", "ALIGN_FNS")
t = t.replace("TS_FROST_FNS", "TS_ALIGN_FNS")
t = t.replace("frostPoint", "alignPoint")
t = t.replace("frostFace", "alignFace")
t = t.replace("frostOnPath", "alignOnPath")
t = t.replace("frostPath", "alignPath")
t = t.replace("frostHoldPath", "alignHoldPath")
t = t.replace("frostOffPath", "alignOffPath")

# headers
t = re.sub(
    r"HEADER_OLD = \(.*?\)\nHEADER_NEW = \(.*?\)\nHEADER_OLD_TS = \(.*?\)\nHEADER_NEW_TS = \(.*?\)\n",
    (
        "HEADER_OLD = (\n"
        '    "This is the leftover after Knot. This is the seventh leftover of the far den. Others walk a sill. */"\n'
        ")\n"
        "HEADER_NEW = (\n"
        '    "This is the leftover after Knot. This is the seventh leftover of the far den. "\n'
        '    "Beacon aligns a sash parting bead as a ruler line: walk onto the bead, sit the north, then leave. "\n'
        '    "Brine still owns frost. Flux still owns field. Bandit still owns inspect. Anchor still owns hitch. Stem still owns stilt. "\n'
        '    "This is the leftover after Brine. This is the eighth leftover of the far den. Others walk a sill. */"\n'
        ")\n"
        "HEADER_OLD_TS = (\n"
        '    "This is the leftover after Knot. This is the seventh leftover of the far den. Others walk a sill. Same map as desktop `window-play.js`. */"\n'
        ")\n"
        "HEADER_NEW = PLACEHOLDER_REMOVE\n"
    ),
    t,
    count=1,
    flags=re.S,
)
# fix botched - redo properly
t = re.sub(
    r"HEADER_OLD = \(.*?\)\nHEADER_NEW = \(.*?\)\nHEADER_OLD_TS = \(.*?\)\nHEADER_NEW = PLACEHOLDER_REMOVE\n",
    (
        "HEADER_OLD = (\n"
        '    "This is the leftover after Knot. This is the seventh leftover of the far den. Others walk a sill. */"\n'
        ")\n"
        "HEADER_NEW = (\n"
        '    "This is the leftover after Knot. This is the seventh leftover of the far den. "\n'
        '    "Beacon aligns a sash parting bead as a ruler line: walk onto the bead, sit the north, then leave. "\n'
        '    "Brine still owns frost. Flux still owns field. Bandit still owns inspect. Anchor still owns hitch. Stem still owns stilt. "\n'
        '    "This is the leftover after Brine. This is the eighth leftover of the far den. Others walk a sill. */"\n'
        ")\n"
        "HEADER_OLD_TS = (\n"
        '    "This is the leftover after Knot. This is the seventh leftover of the far den. Others walk a sill. Same map as desktop `window-play.js`. */"\n'
        ")\n"
        "HEADER_NEW_TS = (\n"
        '    "This is the leftover after Knot. This is the seventh leftover of the far den. "\n'
        '    "Beacon aligns a sash parting bead as a ruler line: walk onto the bead, sit the north, then leave. "\n'
        '    "Brine still owns frost. Flux still owns field. Bandit still owns inspect. Anchor still owns hitch. Stem still owns stilt. "\n'
        '    "This is the leftover after Brine. This is the eighth leftover of the far den. Others walk a sill. Same map as desktop `window-play.js`. */"\n'
        ")\n"
    ),
    t,
    count=1,
    flags=re.S,
)

def once_replace(text, old, new, label):
    n = text.count(old)
    print(label, n)
    if n != 1:
        raise SystemExit("bad " + label)
    return text.replace(old, new, 1)

# js/ts const insert: MANY->ALIGN was wrong; need FROST->ALIGN
t = once_replace(
    t,
    '  const MANY = "many";\\n  const ALIGN = "align";\\n  const SILL = "sill";',
    '  const FROST = "frost";\\n  const ALIGN = "align";\\n  const SILL = "sill";',
    "js const new",
)
t = once_replace(
    t,
    '  const MANY = "many";\\n  const SILL = "sill";',
    '  const FROST = "frost";\\n  const SILL = "sill";',
    "js const old",
)
t = once_replace(
    t,
    'export const MANY = "many";\\nexport const ALIGN = "align";\\nexport const SILL = "sill";',
    'export const FROST = "frost";\\nexport const ALIGN = "align";\\nexport const SILL = "sill";',
    "ts const new",
)
t = once_replace(
    t,
    'export const MANY = "many";\\nexport const SILL = "sill";',
    'export const FROST = "frost";\\nexport const SILL = "sill";',
    "ts const old",
)

# dur
t = once_replace(
    t,
    "    manyOff: 2.71,\\n    alignOn: 3.12,\\n    align: 2.64,\\n    alignHold: 5.48,\\n    alignOff: 2.96,\\n    sillHop:",
    "    frostOff: 2.96,\\n    alignOn: 3.04,\\n    align: 2.52,\\n    alignHold: 5.28,\\n    alignOff: 2.84,\\n    sillHop:",
    "js dur new",
)
t = once_replace(
    t,
    "    manyOff: 2.71,\\n    sillHop:",
    "    frostOff: 2.96,\\n    sillHop:",
    "js dur old",
)
t = once_replace(
    t,
    "  manyOff: 2.71,\\n  alignOn: 3.12,\\n  align: 2.64,\\n  alignHold: 5.48,\\n  alignOff: 2.96,\\n  sillHop:",
    "  frostOff: 2.96,\\n  alignOn: 3.04,\\n  align: 2.52,\\n  alignHold: 5.28,\\n  alignOff: 2.84,\\n  sillHop:",
    "ts dur new",
)
t = once_replace(
    t,
    "  manyOff: 2.71,\\n  sillHop:",
    "  frostOff: 2.96,\\n  sillHop:",
    "ts dur old",
)

# playFor
t = once_replace(
    t,
    '    if (key === "nexus") return MANY;\\n    if (key === "halovore") return ALIGN;\\n    return SILL;',
    '    if (key === "halovore") return FROST;\\n    if (key === "magneton") return ALIGN;\\n    return SILL;',
    "js pf new",
)
t = once_replace(
    t,
    '    if (key === "nexus") return MANY;\\n    return SILL;',
    '    if (key === "halovore") return FROST;\\n    return SILL;',
    "js pf old",
)
t = once_replace(
    t,
    '  if (key === "nexus") return MANY;\\n  if (key === "halovore") return ALIGN;\\n  return SILL;',
    '  if (key === "halovore") return FROST;\\n  if (key === "magneton") return ALIGN;\\n  return SILL;',
    "ts pf new",
)
t = once_replace(
    t,
    '  if (key === "nexus") return MANY;\\n  return SILL;',
    '  if (key === "halovore") return FROST;\\n  return SILL;',
    "ts pf old",
)

# size
t = once_replace(
    t,
    "    if (kind === MANY) return w.width >= 194 && w.height >= 162;\\n    if (kind === ALIGN) return w.width >= 196 && w.height >= 164;\\n    return w.width >= 180 && w.height >= 70;",
    "    if (kind === FROST) return w.width >= 196 && w.height >= 164;\\n    if (kind === ALIGN) return w.width >= 172 && w.height >= 212;\\n    return w.width >= 180 && w.height >= 70;",
    "js size new",
)
t = once_replace(
    t,
    "    if (kind === MANY) return w.width >= 194 && w.height >= 162;\\n    return w.width >= 180 && w.height >= 70;",
    "    if (kind === FROST) return w.width >= 196 && w.height >= 164;\\n    return w.width >= 180 && w.height >= 70;",
    "js size old",
)
t = once_replace(
    t,
    "  if (kind === MANY) return w.width >= 194 && w.height >= 162;\\n  if (kind === ALIGN) return w.width >= 196 && w.height >= 164;\\n    return w.width >= 180 && w.height >= 70;",
    "  if (kind === FROST) return w.width >= 196 && w.height >= 164;\\n  if (kind === ALIGN) return w.width >= 172 && w.height >= 212;\\n    return w.width >= 180 && w.height >= 70;",
    "ts size new",
)
t = once_replace(
    t,
    "  if (kind === MANY) return w.width >= 194 && w.height >= 162;\\n    return w.width >= 180 && w.height >= 70;",
    "  if (kind === FROST) return w.width >= 196 && w.height >= 164;\\n    return w.width >= 180 && w.height >= 70;",
    "ts size old",
)

# leave in pick anchors
t = t.replace('leave: "manyed"', 'leave: "frosted"')

# refit MANY -> FROST
t = t.replace("target.kind === MANY", "target.kind === FROST")
t = t.replace("manyPoint(win, sprite, work)", "frostPoint(win, sprite, work)")
t = t.replace('goPhase(next, "many-on"', 'goPhase(next, "frost-on"')

# exports
t = once_replace(t, "    MANY,\\n    ALIGN,\\n    SILL,", "    FROST,\\n    ALIGN,\\n    SILL,", "js exp new")
t = once_replace(t, "    MANY,\\n    SILL,", "    FROST,\\n    SILL,", "js exp old")
t = once_replace(t, "    manyOffPath,\\n    alignPoint,", "    frostOffPath,\\n    alignPoint,", "js exp fns")

# ts kind/phase/side/leave
t = once_replace(
    t,
    "typeof MANY | typeof ALIGN | typeof SILL | typeof IGNORE;",
    "typeof FROST | typeof ALIGN | typeof SILL | typeof IGNORE;",
    "ts kind new",
)
t = once_replace(
    t,
    "typeof MANY | typeof SILL | typeof IGNORE;",
    "typeof FROST | typeof SILL | typeof IGNORE;",
    "ts kind old",
)
t = once_replace(
    t,
    '  | "many-off"\\n  | "align-on"',
    '  | "frost-off"\\n  | "align-on"',
    "ts phase new",
)
t = once_replace(
    t,
    '  | "many-off"\\n  | "sill-hop"',
    '  | "frost-off"\\n  | "sill-hop"',
    "ts phase old",
)
t = once_replace(
    t,
    '| "methanebowl" | "inkstone" | "lampedge" | "paperweight";',
    '| "inkstone" | "lampedge" | "paperweight" | "saltdish";',
    "ts side old",
)
t = once_replace(
    t,
    '| "inkstone" | "lampedge" | "paperweight" | "saltdish";',
    '| "inkstone" | "lampedge" | "paperweight" | "saltdish" | "rulerline";',
    "ts side new",
)
t = once_replace(
    t,
    '| "floated" | "faceted" | "rimmed" | "manyed";',
    '| "faceted" | "rimmed" | "manyed" | "frosted";',
    "ts leave old",
)
t = once_replace(
    t,
    '| "faceted" | "rimmed" | "manyed" | "frosted";',
    '| "faceted" | "rimmed" | "manyed" | "frosted" | "aligned";',
    "ts leave new",
)

# tick anchors many-off -> frost-off (but keep align tick from JS_TICK)
# Careful: align phases in JS_TICK file use align-*; the OLD anchor in core uses many-off
t = t.replace('next.phase === "many-off"', 'next.phase === "frost-off"')
t = t.replace("DUR.manyOff", "DUR.frostOff")
t = t.replace("manyOffPath", "frostOffPath")

p.write_text(t, encoding="utf-8")
print("wrote", len(t))
# sanity
bad = []
for k in ["return MANY", 'const MANY', "manyPoint", "many-on", "manyOff", "halovore\") return ALIGN", "nexus"]:
    if k in t:
        bad.append(k)
print("bad leftovers", bad)
print("magneton", t.count("magneton"))
print("ALIGN", t.count("ALIGN"))
print("frostPoint", t.count("frostPoint"))
print("alignPoint", t.count("alignPoint"))
