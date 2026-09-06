from pathlib import Path
cjs=Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
mjs=Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
h=Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
print("lichen sill cjs", cjs.count('playFor("lichen"), "sill"'))
print("lichen sill mjs", mjs.count('playFor("lichen"), "sill"'))
print("lichen sill house", h.count('playFor("lichen"), "sill"'))
print("branch ok")
