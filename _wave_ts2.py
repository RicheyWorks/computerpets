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
'''  if (kind === SIDE) {
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
''',
'''  if (kind === SIDE) {
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
  if (kind === SIGNAL) {
    const hold = signalPoint(best, size, work);
    const fromLeft = hold.x >= workW / 2;
    const approachOff = fromLeft ? -74 : 74;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 67 : -67;
    return {
      id: best.id,
      kind,
      side: "marshdish",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "signals",
      spin: "none",
    };
  }
''')
ts = must_replace(ts,
'''  if (target.kind === SIDE) {
    const hold = sidePoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {
''',
'''  if (target.kind === SIDE) {
    const hold = sidePoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === SIGNAL) {
    const hold = signalPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {
''')
ts = must_replace(ts,
'''      if (target.kind === SIDE) {
        return goPhase(next, "side-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {
''',
'''      if (target.kind === SIDE) {
        return goPhase(next, "side-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === SIGNAL) {
        return goPhase(next, "signal-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {
''')
save(p, ts)
print("ts pick/refit/approach ok")
