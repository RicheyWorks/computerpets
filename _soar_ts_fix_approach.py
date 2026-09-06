from pathlib import Path
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
old = '''      if (target.kind === MANTLE) {
        return goPhase(next, "mantle-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {'''
new = '''      if (target.kind === MANTLE) {
        return goPhase(next, "mantle-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === SPOTS) {
        return goPhase(next, "spots-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {'''
if old not in ts:
  raise SystemExit("marker missing")
ts = ts.replace(old, new, 1)
Path("web/src/lib/pets/window-play.ts").write_text(ts, encoding="utf-8")
print("patched approach")
print("spots-on now", 'goPhase(next, "spots-on"' in ts)
