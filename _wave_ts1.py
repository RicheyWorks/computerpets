from pathlib import Path
ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

def load(p):
    return (ROOT / p).read_text(encoding="utf-8")

def save(p, text):
    (ROOT / p).write_text(text, encoding="utf-8", newline="\n")

def must_replace(text, old, new, n=1):
    count = text.count(old)
    if count != n:
        raise SystemExit(f"expected {n} of marker, found {count}: {old[:160]!r}")
    return text.replace(old, new)

p = "web/src/lib/pets/window-play.ts"
ts = load(p)
ts = must_replace(ts,
    "This closes log ten. Others walk a sill. Same map as desktop `window-play.js`.",
    "This closes log ten. Wave signals a sill pan as a marsh dish: walk onto the pan, signal the big claw, then leave. Scud still owns side. Pinch still owns the claw. Tenant still owns knob. This opens shore ten. Others walk a sill. Same map as desktop `window-play.js`.")
ts = must_replace(ts, 'export const SIDE = "side";\nexport const SILL = "sill";', 'export const SIDE = "side";\nexport const SIGNAL = "signal";\nexport const SILL = "sill";')
ts = must_replace(ts,
    "  sideOn: 2.38,\n  side: 1.27,\n  sideHold: 2.67,\n  sideOff: 1.67,\n  sillHop: 0.38,",
    "  sideOn: 2.38,\n  side: 1.27,\n  sideHold: 2.67,\n  sideOff: 1.67,\n  signalOn: 2.45,\n  signal: 1.33,\n  signalHold: 2.75,\n  signalOff: 1.71,\n  sillHop: 0.38,")
ts = must_replace(ts, "typeof THRASH | typeof SIDE | typeof SILL | typeof IGNORE", "typeof THRASH | typeof SIDE | typeof SIGNAL | typeof SILL | typeof IGNORE")
ts = must_replace(ts,
    '  | "side-off"\n  | "sill-hop"',
    '  | "side-off"\n  | "signal-on"\n  | "signal"\n  | "signal-hold"\n  | "signal-off"\n  | "sill-hop"')
ts = must_replace(ts,
    '  if (key === "amphipod") return SIDE;\n  return SILL;',
    '  if (key === "amphipod") return SIDE;\n  if (key === "fiddler_crab") return SIGNAL;\n  return SILL;')
ts = must_replace(ts,
    "  if (kind === SIDE) return w.width >= 178 && w.height >= 162;\n    return w.width >= 180 && w.height >= 70;",
    "  if (kind === SIDE) return w.width >= 178 && w.height >= 162;\n  if (kind === SIGNAL) return w.width >= 190 && w.height >= 184;\n    return w.width >= 180 && w.height >= 70;")
save(p, ts)
print("ts constants ok")
