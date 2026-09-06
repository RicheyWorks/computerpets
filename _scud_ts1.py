from pathlib import Path

def load(p):
    b = Path(p).read_bytes()
    crlf = b"\r\n" in b
    t = b.decode("utf-8").replace("\r\n", "\n")
    return t, crlf

def save(p, t, crlf):
    if crlf:
        t = t.replace("\n", "\r\n")
    Path(p).write_bytes(t.encode("utf-8"))

def once(t, old, new, label):
    n = t.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, found {n}\nOLD[:200]={old[:200]!r}")
    return t.replace(old, new, 1)

ts, crlf = load("web/src/lib/pets/window-play.ts")

HEADER_OLD = "Thread thrashes a glazing rebate as a soil film: walk into the rebate, thrash the round, then leave. Wick still owns thread. Half still owns split. Tun still owns dry. This is the ninth log leftover."
HEADER_ADD = " Scud sides a window well as a side pool: walk into the well, swim the side, then leave. Thread still owns thrash. Armor still owns roll. Silver still owns go. This closes log ten."
ts = once(ts, HEADER_OLD, HEADER_OLD + HEADER_ADD, "ts header")
ts = once(ts, 'export const THRASH = "thrash";\nexport const SILL = "sill";', 'export const THRASH = "thrash";\nexport const SIDE = "side";\nexport const SILL = "sill";', "ts SIDE const")
ts = once(
    ts,
    "  thrashOn: 2.31,\n  thrash: 1.21,\n  thrashHold: 2.59,\n  thrashOff: 1.63,\n  sillHop: 0.38,",
    "  thrashOn: 2.31,\n  thrash: 1.21,\n  thrashHold: 2.59,\n  thrashOff: 1.63,\n  sideOn: 2.38,\n  side: 1.27,\n  sideHold: 2.67,\n  sideOff: 1.67,\n  sillHop: 0.38,",
    "ts DUR",
)
ts = once(ts, "typeof SPLIT | typeof THRASH | typeof SILL", "typeof SPLIT | typeof THRASH | typeof SIDE | typeof SILL", "ts kind")
ts = once(
    ts,
    '  | "thrash-on"\n  | "thrash"\n  | "thrash-hold"\n  | "thrash-off"\n  | "sill-hop"',
    '  | "thrash-on"\n  | "thrash"\n  | "thrash-hold"\n  | "thrash-off"\n  | "side-on"\n  | "side"\n  | "side-hold"\n  | "side-off"\n  | "sill-hop"',
    "ts phase",
)
ts = once(ts, '"streamstone" | "soilfilm";', '"streamstone" | "soilfilm" | "sidepool";', "ts side union")
ts = once(ts, '"headglue" | "film" | "round";', '"headglue" | "film" | "round" | "sides";', "ts leave union")
ts = once(ts, '  if (key === "nematode") return THRASH;\n  return SILL;', '  if (key === "nematode") return THRASH;\n  if (key === "amphipod") return SIDE;\n  return SILL;', "ts playFor")
ts = once(
    ts,
    "  if (kind === THRASH) return w.width >= 192 && w.height >= 198;\n    return w.width >= 180 && w.height >= 70;",
    "  if (kind === THRASH) return w.width >= 192 && w.height >= 198;\n  if (kind === SIDE) return w.width >= 178 && w.height >= 162;\n    return w.width >= 180 && w.height >= 70;",
    "ts size",
)
ts = once(
    ts,
    '''      leave: "round",
      spin: "none",
    };
  }
  if (kind === WRAP) {''',
    '''      leave: "round",
      spin: "none",
    };
  }
  if (kind === SIDE) {
    const hold = sidePoint(best, size, work);
    const fromLeft = hold.x >= workW / 2;
    const approachOff = fromLeft ? -72 : 72;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 65 : -65;
    return {
      id: best.id,
      kind,
      side: "sidepool",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "sides",
      spin: "none",
    };
  }
  if (kind === WRAP) {''',
    "ts pick",
)
ts = once(
    ts,
    '''  if (target.kind === THRASH) {
    const hold = thrashPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''',
    '''  if (target.kind === THRASH) {
    const hold = thrashPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === SIDE) {
    const hold = sidePoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''',
    "ts refit",
)
print("ts mid ok")
save("web/src/lib/pets/window-play.ts", ts, crlf)
print("ts mid saved")
