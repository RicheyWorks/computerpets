from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
print("HEADER:", js[:600].replace("\n", " | "))
print("---")
for s in [
    'const MANTLE', 'const SILL', 'const SPOT =', 'const SOAR =',
    'mantleOff:', 'sillHop:', 'giant_clam', 'eagle_ray', 'grouper',
    'Next leftover', 'function chordPoint', 'function floatPoint', 'function thirstPoint',
    'leave: "mantled"', 'if (kind === MANTLE)', 'mantlePoint',
    'RAYS,\n    MANTLE,\n    SILL', 'mantleOffPath,\n    pickTarget',
]:
    i = js.find(s)
    print(repr(s), "->", i)
    if i >= 0:
        line_start = js.rfind("\n", 0, i) + 1
        line_end = js.find("\n", i)
        print("  ", js[line_start:line_end][:200])
