from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
for i,line in enumerate(js.splitlines(),1):
    if "COOL" in line or "coolPoint" in line or "umbral" in line or "cooled" in line or "lampshadow" in line or "cool-on" in line or "coolOn" in line:
        if len(line)<200:
            print(f"{i}: {line}")
        else:
            print(f"{i}: {line[:180]}...")
print("--- header end ---")
hdr=js[:js.find("*/")+2]
print(hdr[-400:])
print("--- wait free ---")
import re
vals=re.findall(r'const [A-Z_]+ = "([a-z-]+)"', js)
print("wait" in vals, "cool" in vals)
