from pathlib import Path
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
# cyst context
i = cjs.find("cyst")
print("cyst ctx:", repr(cjs[i-200:i+200]))
print("====")
# find sill key arrays
import re
# look for arrays that include umbral or cyst as sill keys
for m in re.finditer(r'(sillKeys|SILL_KEYS|sillGuests|genericSill|stillSill)[^\n]{0,200}', cjs):
    print(m.group(0)[:200])
# find "umbral" near array of keys
idx = 0
while True:
    j = cjs.find('"umbral"', idx)
    if j<0: break
    print("umbral@", j, repr(cjs[max(0,j-120):j+80]))
    idx = j+1
    if idx > 5: 
        # only first few
        if idx > 300000: break
print("==== hush block head ====")
print(Path("_hush_cjs_block.txt").read_text(encoding="utf-8")[:3000])
