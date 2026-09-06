from pathlib import Path
import re
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
# find side and leave unions
for m in re.finditer(r'lampglass[^;]{0,120}', ts):
    print("side-ish:", m.group(0)[:120])
for m in re.finditer(r'thirsted[^;]{0,80}', ts):
    print("leave-ish:", m.group(0)[:100])
for m in re.finditer(r'typeof THIRST[^;]+;', ts):
    print("kind union:", m.group(0)[:200])
for m in re.finditer(r'"thirst-off"[^\n]+', ts):
    print("phase:", m.group(0)[:120])
# beginPlay
i = ts.find("export function beginPlay")
print("beginPlay:", ts[i:i+80])
# THIRST size in ts
i = ts.find("kind === THIRST")
print("size contexts:")
while i != -1:
    print(repr(ts[i:i+100]))
    i = ts.find("kind === THIRST", i+1)
