from pathlib import Path
ts_path = Path("web/src/lib/pets/window-play.ts")
ts = ts_path.read_text(encoding="utf-8")
old = '''      if (target.kind === RAYS) {
        return goPhase(next, "rays-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {'''
new = '''      if (target.kind === RAYS) {
        return goPhase(next, "rays-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === MANTLE) {
        return goPhase(next, "mantle-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {'''
if old not in ts:
    raise SystemExit("still missing")
ts = ts.replace(old, new, 1)
ts_path.write_text(ts, encoding="utf-8")
print("ok", ts.count("mantle-on"), ts.count("target.kind === MANTLE"))
