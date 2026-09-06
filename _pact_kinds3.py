import re, pathlib
js = pathlib.Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# constants at top
m = re.search(r"const SPRITE[\s\S]{0,8000}?function ", js)
print(m.group(0)[:6000] if m else "no")
print("====")
# find BLOOM / yeast related
for name in ["BLOOM","YEAST","DRIP","CLOUD","TEETH","ZONES","FORK","HOLLOW","WARTS","SHELF","PACT","LICHEN","CRUST","PLAQUE","STAIN","PAINT"]:
    print(name, [line.strip() for line in js.splitlines() if name in line][:3])
