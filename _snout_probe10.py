from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
i = js.find("const DUR")
# print a chunk around seed/bore/cache/lid
for k in ["seedOn", "boreOn", "cacheOn", "lidOn", "seed:", "bore:", "cache:", "lid:"]:
    print(k, js.find(k))
# show DUR object slice with those
import re
m = re.search(r"seedOn:\s*[\d.]+", js)
print("seedOn line", m.group(0) if m else None)
m = re.search(r"boreOn:\s*[\d.]+", js)
print("boreOn line", m.group(0) if m else None)
m = re.search(r"cacheOn:\s*[\d.]+", js)
print("cacheOn", m.group(0) if m else None)
m = re.search(r"lidOn:\s*[\d.]+", js)
print("lidOn", m.group(0) if m else None)
# also boreOnPath seedOnPath
print("boreOnPath", "function boreOnPath" in js)
print("seedOnPath", "function seedOnPath" in js)
print("cachePoint", "function cachePoint" in js)
print("lidPoint", "function lidPoint" in js)
# check DUR seedHold boreHold seedOff boreOff
for k in ["seedHold", "boreHold", "seedOff", "boreOff", "cacheHold", "lidHold"]:
    print(k, bool(re.search(rf"{k}:\s*[\d.]+", js)))
