from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
print("JS BLOOM", "const BLOOM" in js, "yeast BLOOM", 'yeast") return BLOOM' in js)
print("TS BLOOM", "export const BLOOM" in ts, "yeast BLOOM", 'yeast") return BLOOM' in ts)
print("JS bloom-on phase", 'phase === "bloom-on"' in js)
print("TS bloom-on phase", 'phase === "bloom-on"' in ts)
# find drip-off to sill-hop in ts
i = ts.find('phase === "drip-off"')
j = ts.find('phase === "sill-hop"', i)
print("TS drip-off idx", i, "sill-hop", j)
print(repr(ts[i:j+40]) if i>=0 else "missing")
# check if js was written (partial) - git status
