from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
print("JS PLAQUE", "const PLAQUE" in js, "lichen map", 'lichen") return PLAQUE' in js)
print("TS PLAQUE", "export const PLAQUE" in ts, "lichen map", 'lichen") return PLAQUE' in ts)
# dump bloom-off region exact whitespace in ts
i = ts.find('if (next.phase === "bloom-off")')
print("TS bloom-off idx", i)
print(repr(ts[i:i+450]))
i2 = ts.find('if (next.phase === "sill-hop")')
print("TS sill-hop idx", i2)
print(repr(ts[i2-40:i2+40]))
