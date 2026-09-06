from pathlib import Path
import re
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
for line in ts.splitlines():
    if "methanebowl" in line or "woodwound" in line or '"cell"' in line or "inkstone" in line:
        if len(line) < 400:
            print(line)
        else:
            print(line[:350]+"...")
# header first lines
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
print("JS HDR:", js.splitlines()[0][:300])
print("TS HDR:", ts.splitlines()[0][:300])
# docs current nimbus lines
for p in ["README.md","desktop/README.md","docs/ARCHITECTURE.md","docs/ROADMAP.md"]:
    t=Path(p).read_text(encoding="utf-8")
    for i,l in enumerate(t.splitlines(),1):
        if "Nimbus" in l or "next leftover is Silica" in l or "Silica" in l and "leftover" in l.lower():
            print(f"{p}:{i}:{l[:180]}")
