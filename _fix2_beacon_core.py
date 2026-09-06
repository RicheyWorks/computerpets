from pathlib import Path
p = Path("_beacon_core.py")
t = p.read_text(encoding="utf-8")
fixes = [
(
'        "    frostOff: 2.96,\\n    frostOn: 3.12,\\n    frost: 2.64,\\n    frostHold: 5.48,\\n    frostOff: 2.96,\\n    sillHop:",',
'        "    frostOff: 2.96,\\n    alignOn: 3.04,\\n    align: 2.52,\\n    alignHold: 5.28,\\n    alignOff: 2.84,\\n    sillHop:",',
),
(
'        "  frostOff: 2.96,\\n  frostOn: 3.12,\\n  frost: 2.64,\\n  frostHold: 5.48,\\n  frostOff: 2.96,\\n  sillHop:",',
'        "  frostOff: 2.96,\\n  alignOn: 3.04,\\n  align: 2.52,\\n  alignHold: 5.28,\\n  alignOff: 2.84,\\n  sillHop:",',
),
(
't = once(t, "    MANY,\\n    SILL,", "    MANY,\\n    FROST,\\n    SILL,", "js export kind")',
't = once(t, "    FROST,\\n    SILL,", "    FROST,\\n    ALIGN,\\n    SILL,", "js export kind")',
),
]
for a,b in fixes:
    n = t.count(a)
    print("n", n, repr(a[:70]))
    if n != 1:
        raise SystemExit("fail")
    t = t.replace(a, b, 1)
p.write_text(t, encoding="utf-8")
print("fixed core")
