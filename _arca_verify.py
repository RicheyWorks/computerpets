from pathlib import Path
import re
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
# verify uniqueness of wait kind
vals=re.findall(r'(?:const|export const) ([A-Z_]+) = "([a-z-]+)"', js+ts)
wait_vals=[(k,v) for k,v in vals if v=="wait"]
print("wait bindings", wait_vals)
print("closes far ten", "closes far ten" in js, "closes far ten" in ts)
print("wait-on phases", js.count("wait-on"), ts.count("wait-on"))
print("waitPoint fns", js.count("function waitPoint"), ts.count("function waitPoint"))
# kind union
i=ts.find('"cool"')
print("kind area", ts[i:i+80])
# PlayKind
m=re.search(r'type PlayKind[^;]+;', ts)
if m: print(m.group(0)[-120:])
