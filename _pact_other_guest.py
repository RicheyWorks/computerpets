from pathlib import Path
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
idx = cjs.find('test("other guests do not clone')
print(cjs[idx:idx+350])
# all pickTarget lichen 80
import re
for m in re.finditer(r'pickTarget\(\[WIN\], 80, "([^"]+)"', cjs):
    if m.start() < 2000 or "lichen" in m.group(0) or "photovore" in m.group(0):
        line = cjs.count("\n", 0, m.start()) + 1
        if line < 1200 or "lichen" in m.group(0) or (line > 34700):
            print(line, m.group(0))
# specifically find wrong first replace
print("--- first 80 pickTargets ---")
for i,m in enumerate(re.finditer(r'pickTarget\(\[WIN\], 80, "([^"]+)"', cjs)):
    if i < 5:
        print(cjs.count("\n", 0, m.start())+1, m.group(1))
