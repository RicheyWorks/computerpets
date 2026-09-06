from pathlib import Path
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
# find Starter test start
i = cjs.find('Starter blooms a damp pane')
print(cjs[i:i+900])
print("---CLING---")
# fix cling + any other yeast sill walkers that should be lichen
old = 'const target = P.pickTarget([WIN], 80, "yeast", WORK, P.SPRITE);'
# count yeast pickTarget for sill-style tests
import re
for m in re.finditer(r'pickTarget\(\[WIN\],\s*\d+,\s*"yeast"', cjs):
    ctx = cjs[max(0,m.start()-120):m.start()+80]
    print("YEAST PICK", repr(ctx.replace("\n"," "))[:160])
