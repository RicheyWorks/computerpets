from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
checks = [
    'const BLACK = "black";',
    'const SILL = "sill";',
    'blackOff: 2.38,',
    'sillHop: 0.38,',
    'if (key === "jewelwing") return BLACK;',
    'return SILL;',
    'if (kind === BLACK) return w.width >= 184 && w.height >= 156;',
    'side: "streamjewel"',
    'leave: "jewelled"',
    'if (target.kind === BLACK) {',
    'black-on',
    'function beginPlay(target, petX)',
    'if (next.phase === "sill-hop")',
    'TAILS,\n    BLACK,\n    IGNORE',
    'blackOffPath,\n    pickTarget',
    # header end about Jewel
]
for c in checks:
    print(repr(c), "->", js.count(c))
# find Jewel header snippet
i = js.find("Jewel blacks")
print("jewel header:", js[i:i+450] if i>=0 else "MISSING")
# playFor lacewing
i = js.find('lacewing')
print("lacewing refs:", js.count("lacewing"))
print(js[max(0,i-80):i+80] if i>=0 else "")
# casement leaf / pebble puff point
for name in ["casement", "puffPoint", "leafPoint", "songPoint", "weekPoint", "spotPoint", "mountPoint", "raspPoint", "blackPoint"]:
    print(name, js.count(name))
