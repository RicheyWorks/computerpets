from pathlib import Path
import re
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")

# pick quiet block
i = js.find("if (kind === QUIET)")
print("pick quiet blocks:")
idx=0
while True:
    j=js.find("if (kind === QUIET)", idx)
    if j<0: break
    print("---", j)
    print(js[j:j+550])
    print()
    idx=j+1

# stepPlay quiet phases
print("==== quiet phase in step ====")
for m in re.finditer(r'.{0,40}quiet-on|quiet-hold|quiet-off|phase === "quiet".{0,80}', js):
    s=m.group(0)
    if "DUR" in s or "quietOn" in s or 'phase === "quiet"' in s or "quiet-on" in s:
        print(repr(s[:120]))
