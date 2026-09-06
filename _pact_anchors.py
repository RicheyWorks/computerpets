from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")

def show(label, text, needle, before=80, after=120):
    i = text.find(needle)
    print(f"\n== {label} {needle!r} @ {i} ==")
    if i < 0:
        return
    print(repr(text[max(0,i-before):i+after]))

for label, text in [("JS", js), ("TS", ts)]:
    show(label, text, 'const BLOOM = "bloom";')
    show(label, text, "bloomOff:")
    show(label, text, 'if (key === "yeast") return BLOOM;')
    show(label, text, "if (kind === BLOOM) return w.width")
    show(label, text, 'leave: "bloomed"')
    show(label, text, "if (target.kind === BLOOM)")
    show(label, text, 'goPhase(next, "bloom-on"')
    show(label, text, 'phase === "bloom-off"')
    show(label, text, "BLOOM,\n")
    show(label, text, "bloomOffPath,\n")

# header end
idx = js.find("ninth leftover of the fungi den. Others walk a sill.")
print("\nHEADER TAIL JS", repr(js[idx:idx+80]))
idx = ts.find("ninth leftover of the fungi den. Others walk a sill.")
print("HEADER TAIL TS", repr(ts[idx:idx+120]))

# side/leave unions in ts
import re
for pat in [r'\| "yeastfilm"[^;]*;', r'\| "bloomed"[^;]*;']:
    m = re.search(pat, ts)
    print(pat, m.group(0) if m else None)

# frill/flame points for contrast
for name in ["shelfPoint", "dripPoint", "bloomPoint"]:
    i = js.find(f"function {name}")
    print(f"\n{name}:\n{js[i:i+450]}")
