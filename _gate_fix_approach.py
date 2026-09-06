from pathlib import Path
ts_path = Path("web/src/lib/pets/window-play.ts")
ts = ts_path.read_text(encoding="utf-8")
# find RAYS approach goPhase and insert MANTLE after it
old = '''    if (target.kind === RAYS) {
      return goPhase(next, "rays-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
    }
    if (target.kind === WRAP) {'''
new = '''    if (target.kind === RAYS) {
      return goPhase(next, "rays-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
    }
    if (target.kind === MANTLE) {
      return goPhase(next, "mantle-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
    }
    if (target.kind === WRAP) {'''
if old not in ts:
    # show nearby
    i = ts.find('rays-on')
    print("marker missing; context:")
    print(repr(ts[i-80:i+300]))
    raise SystemExit(1)
ts = ts.replace(old, new, 1)
ts_path.write_text(ts, encoding="utf-8")
print("TS approach wired", ts.count('mantle-on'))
