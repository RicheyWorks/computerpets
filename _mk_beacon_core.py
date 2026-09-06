from pathlib import Path

src = Path("_brine_core.py").read_text(encoding="utf-8")
t = src

t = t.replace('HERE / "frost_fns.js"', 'HERE / "align_fns.js"')
t = t.replace('HERE / "js_tick_brine.js"', 'HERE / "js_tick_beacon.js"')
t = t.replace('HERE / "js_pick_brine.js"', 'HERE / "js_pick_beacon.js"')
t = t.replace('HERE / "ts_pick_brine.js"', 'HERE / "ts_pick_beacon.js"')

old_h = (
'HEADER_OLD = (\n'
'    "This is the leftover after Dusk. This is the sixth leftover of the far den. Others walk a sill. */"\n'
')\n'
'HEADER_NEW = (\n'
'    "This is the leftover after Dusk. This is the sixth leftover of the far den. "\n'
'    "Brine frosts a window stool as a salt dish: walk onto the stool, sit the frost, then leave. "\n'
'    "Knot still owns many. Tun still owns dry. Sheen still owns lick. "\n'
'    "This is the leftover after Knot. This is the seventh leftover of the far den. Others walk a sill. */"\n'
')\n'
'HEADER_OLD_TS = (\n'
'    "This is the leftover after Dusk. This is the sixth leftover of the far den. Others walk a sill. Same map as desktop `window-play.js`. */"\n'
')\n'
'HEADER_NEW_TS = (\n'
'    "This is the leftover after Dusk. This is the sixth leftover of the far den. "\n'
'    "Brine frosts a window stool as a salt dish: walk onto the stool, sit the frost, then leave. "\n'
'    "Knot still owns many. Tun still owns dry. Sheen still owns lick. "\n'
'    "This is the leftover after Knot. This is the seventh leftover of the far den. Others walk a sill. Same map as desktop `window-play.js`. */"\n'
')'
)
new_h = (
'HEADER_OLD = (\n'
'    "This is the leftover after Knot. This is the seventh leftover of the far den. Others walk a sill. */"\n'
')\n'
'HEADER_NEW = (\n'
'    "This is the leftover after Knot. This is the seventh leftover of the far den. "\n'
'    "Beacon aligns a sash parting bead as a ruler line: walk onto the bead, sit the north, then leave. "\n'
'    "Brine still owns frost. Flux still owns field. Bandit still owns inspect. Anchor still owns hitch. Stem still owns stilt. "\n'
'    "This is the leftover after Brine. This is the eighth leftover of the far den. Others walk a sill. */"\n'
')\n'
'HEADER_OLD_TS = (\n'
'    "This is the leftover after Knot. This is the seventh leftover of the far den. Others walk a sill. Same map as desktop `window-play.js`. */"\n'
')\n'
'HEADER_NEW_TS = (\n'
'    "This is the leftover after Knot. This is the seventh leftover of the far den. "\n'
'    "Beacon aligns a sash parting bead as a ruler line: walk onto the bead, sit the north, then leave. "\n'
'    "Brine still owns frost. Flux still owns field. Bandit still owns inspect. Anchor still owns hitch. Stem still owns stilt. "\n'
'    "This is the leftover after Brine. This is the eighth leftover of the far den. Others walk a sill. Same map as desktop `window-play.js`. */"\n'
')'
)
assert t.count(old_h) == 1, "header block"
t = t.replace(old_h, new_h)

t = t.replace("FROST_FNS", "ALIGN_FNS")
t = t.replace("TS_FROST_FNS", "TS_ALIGN_FNS")

# Protect previous-guest (MANY/many) tokens
t = t.replace("DUR.manyOff", "DUR.__POFF__")
t = t.replace("manyOffPath", "__POFFP__")
t = t.replace('"many-off"', '"__POPH__"')
t = t.replace("manyPoint", "__PPT__")
t = t.replace('"many-on"', '"__PON__"')
t = t.replace("target.kind === MANY", "target.kind === __PK__")
t = t.replace("kind === MANY", "kind === __PK__")
t = t.replace("return MANY", "return __PK__")
t = t.replace("typeof MANY", "typeof __PK__")
t = t.replace('const MANY = "many"', 'const __PK__ = "frost"')
t = t.replace('export const MANY = "many"', 'export const __PK__ = "frost"')
t = t.replace("    MANY,\n", "    __PK__,\n")
t = t.replace(" MANY |", " __PK__ |")
t = t.replace('| "manyed"', '| "__PLV__"')
t = t.replace('leave: "manyed"', 'leave: "__PLV__"')
t = t.replace("manyOff: 2.71", "__PDUR__: 2.96")
t = t.replace(">= 194 && w.height >= 162", ">= 196 && w.height >= 164")
t = t.replace('"nexus"', '"halovore"')

# Rename new-guest frost -> align
pairs = [
    ("frostPoint", "alignPoint"),
    ("frostFace", "alignFace"),
    ("frostOnPath", "alignOnPath"),
    ("frostPath", "alignPath"),
    ("frostHoldPath", "alignHoldPath"),
    ("frostOffPath", "alignOffPath"),
    ('const FROST = "frost"', 'const ALIGN = "align"'),
    ('export const FROST = "frost"', 'export const ALIGN = "align"'),
    ("return FROST", "return ALIGN"),
    ("target.kind === FROST", "target.kind === ALIGN"),
    ("kind === FROST", "kind === ALIGN"),
    ("typeof FROST", "typeof ALIGN"),
    ("    FROST,\n", "    ALIGN,\n"),
    (" FROST |", " ALIGN |"),
    ('goPhase(next, "frost-on"', 'goPhase(next, "align-on"'),
    ('| "frost-on"\n  | "frost"\n  | "frost-hold"\n  | "frost-off"',
     '| "align-on"\n  | "align"\n  | "align-hold"\n  | "align-off"'),
    ('leave: "frosted"', 'leave: "aligned"'),
    ('| "frosted"', '| "aligned"'),
    ("frostOn: 3.12,\n    frost: 2.64,\n    frostHold: 5.48,\n    frostOff: 2.96",
     "alignOn: 3.04,\n    align: 2.52,\n    alignHold: 5.28,\n    alignOff: 2.84"),
    ("frostOn: 3.12,\n  frost: 2.64,\n  frostHold: 5.48,\n  frostOff: 2.96",
     "alignOn: 3.04,\n  align: 2.52,\n  alignHold: 5.28,\n  alignOff: 2.84"),
    (">= 196 && w.height >= 164", ">= 172 && w.height >= 212"),  # will hit both size gates - fix below
    ('"halovore") return ALIGN', '"magneton") return ALIGN'),
]
for a, b in pairs:
    t = t.replace(a, b)

# Size gate: previous should stay 196/164, new 172/212.
# Both became 172/212. Fix previous (__PK__) size back.
t = t.replace(
    "if (kind === __PK__) return w.width >= 172 && w.height >= 212",
    "if (kind === __PK__) return w.width >= 196 && w.height >= 164",
)

# Side labels: brine old ends paperweight; brine new paperweight|saltdish
# After frost->align, saltdish still there as NEW side. Change NEW to add rulerline and OLD to saltdish.
# Current new string should still have paperweight | saltdish
assert t.count('| "methanebowl" | "inkstone" | "lampedge" | "paperweight" | "saltdish";') == 1
assert t.count('| "methanebowl" | "inkstone" | "lampedge" | "paperweight";') == 1
t = t.replace(
    '| "methanebowl" | "inkstone" | "lampedge" | "paperweight" | "saltdish";',
    '| "inkstone" | "lampedge" | "paperweight" | "saltdish" | "rulerline";',
)
t = t.replace(
    '| "methanebowl" | "inkstone" | "lampedge" | "paperweight";',
    '| "inkstone" | "lampedge" | "paperweight" | "saltdish";',
)

# Leave verbs old/new: old was manyed-> __PLV__; new was frosted->aligned
# Old once string should use frosted; restore __PLV__ -> frosted
t = t.replace("__PLV__", "frosted")

# Restore previous-guest markers to FROST
t = t.replace("DUR.__POFF__", "DUR.frostOff")
t = t.replace("__POFFP__", "frostOffPath")
t = t.replace('"__POPH__"', '"frost-off"')
t = t.replace("__PPT__", "frostPoint")
t = t.replace('"__PON__"', '"frost-on"')
t = t.replace("__PK__", "FROST")
t = t.replace("__PDUR__", "frostOff")

# playFor old string still: if halovore return FROST; return SILL - good
# playFor new: if halovore return FROST; if magneton return ALIGN - need to fix
# After nexus->halovore and FROST->ALIGN on return FROST in new string:
# old: if (key === "halovore") return FROST; return SILL;  GOOD
# new was: if nexus return MANY; if halovore return FROST
# after: if halovore return FROST; if magneton return ALIGN  -- wait
# Original new: nexus MANY; halovore FROST
# After nexus->halovore: halovore MANY; then MANY->__PK__->FROST: halovore FROST
# Then return FROST -> return ALIGN on the SECOND one... both return FROST would become ALIGN!
# Problem: "return FROST" replace hit both after restore.

# Check playFor lines
for i,l in enumerate(t.splitlines(),1):
    if "halovore" in l or "magneton" in l or "return FROST" in l or "return ALIGN" in l:
        if "HEADER" not in l and "Beacon" not in l:
            print(f"PF {i}:{l}")

Path("_beacon_core.py").write_text(t, encoding="utf-8")
print("wrote bytes", len(t))
