from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# find ALL yeast / playFor returns near fungi
idx = js.find("function playFor")
print(js[idx:idx+1200])
print("---")
print("yeast BLOOM count", js.count('key === "yeast") return BLOOM'))
print("BLOOM const", 'const BLOOM = "bloom"' in js)
# cling test - which guest
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
i = cjs.find('other guests do not clone Rui')
print(cjs[i:i+800])
