from pathlib import Path
ts_path = Path("web/src/lib/pets/window-play.ts")
ts = ts_path.read_text(encoding="utf-8")
old = '''      if (target.kind === PAPILLAE) {
        return goPhase(next, "papillae-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {'''
new = '''      if (target.kind === PAPILLAE) {
        return goPhase(next, "papillae-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === RAYS) {
        return goPhase(next, "rays-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {'''
if old not in ts:
    raise SystemExit("approach marker missing")
if "target.kind === RAYS) {\n        return goPhase(next, \"rays-on\"" in ts:
    print("already present")
else:
    ts = ts.replace(old, new, 1)
    ts_path.write_text(ts, encoding="utf-8")
    print("fixed approach")
# verify phase exists
assert 'next.phase === "rays-on"' in ts_path.read_text(encoding="utf-8")
print("phase ok")
