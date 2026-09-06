from pathlib import Path
t = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# find export return block
idx = t.find("    BURY,")
print("BURY, count", t.count("    BURY,"))
idx = t.find("const BURY")
print("const BURY", repr(t[idx:idx+40]) if idx>=0 else None)
# how does test load P?
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
print(cjs[:800])
# knot test BURY line
for i,l in enumerate(cjs.splitlines()):
    if 'P.BURY' in l and 'Knot leftover' in '\n'.join(cjs.splitlines()[max(0,i-40):i+1]):
        print('knot context', i+1, l)
        break
print('P.BURY lines', [ (i+1,l) for i,l in enumerate(cjs.splitlines()) if 'P.BURY' in l ][-5:])
