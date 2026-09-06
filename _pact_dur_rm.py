from pathlib import Path
rm = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
for i,line in enumerate(rm.splitlines()):
    if any(k in line.lower() for k in ["photovore","gleam","alien","after pact","fungi/cellar","next leftover is"]):
        print(f"{i+1}:{line[:240]}")
# also dump Dur section for bloom
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
idx = js.find("bloomOn")
print("bloomOn contexts:")
for i,l in enumerate(js.splitlines()):
    if "bloom" in l and ("DUR" in l or "bloomOn" in l or "bloomHold" in l or "bloomOff" in l):
        if i < 600 or "DUR" in l or "bloomOn:" in l:
            print(f"{i+1}:{l[:140]}")
