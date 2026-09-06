import re
js=open("desktop/renderer/window-play.js",encoding="utf-8").read()
for pat in ["QUIET","quietPoint","quietOn","umbral","cyst","paramecium","quieted","lampshadow","waited","WAIT ="]:
    print(pat, js.count(pat))
kinds=re.findall(r'const ([A-Z_]+) = "([a-z-]+)"', js)
vals=[v for k,v in kinds]
print("wait free?", "wait" not in vals)
print("cool free?", "cool" not in vals)
print("last kinds", kinds[-10:])
idx=js.find("function quietPoint")
print("quietPoint at", idx)
print(js[idx:idx+1200])
