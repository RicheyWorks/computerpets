from pathlib import Path
import re
js=Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# DUR leaf and black
for k in ["leafOn","leaf","leafHold","leafOff","blackOn","black","blackHold","blackOff","tailsOn","hawkOn","foldOn","prayOn"]:
    m=re.search(rf"{k}:\s*([0-9.]+)", js)
    print(k, m.group(1) if m else None)
# how card abort works - search cmd card
idx=js.find('cmd === "card"')
print("card idx", idx)
print(js[idx-200:idx+400] if idx>=0 else "none")
# banner abort test end
cjs=Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
idx=cjs.find("refits Banner")
print("---BANNER ABORT---")
print(cjs[idx:idx+1200])
