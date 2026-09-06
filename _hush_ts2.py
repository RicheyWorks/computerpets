from pathlib import Path
import re
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
# PlayPhase - find align parts
for needle in ['| "align-on"', '| "align"', '| "align-hold"', '| "align-off"', '| "frost-off"', '| "sill-hop"']:
    i = ts.find(needle)
    print(repr(needle), i)
    if i>=0:
        print(ts[i-40:i+80])
# side type
for needle in ["rulerline", "saltdish", "lampedge", "PlayTarget", "side:"]:
    pass
m = re.search(r'side\?:?\s*([\s\S]{0,200}?)[;,\n]', ts)
# find union containing rulerline
i = ts.find('"rulerline"')
print("rulerline context", ts[i-200:i+80])
i = ts.find('"aligned"')
print("aligned context", ts[i-200:i+80])
i = ts.find("typeof ALIGN")
print("kind context", ts[i-120:i+80])
