from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# frostPoint and manyPoint for stool x fractions
for name in ["frostPoint","manyPoint","mastPoint","bankPoint","chirpPoint","cachePoint"]:
    i=js.find(f"function {name}")
    if i<0: continue
    chunk=js[i:i+450]
    print("====", name, "====")
    print(chunk)
    print()
# ROADMAP Arca / next after Hush
rm=Path("docs/ROADMAP.md").read_text(encoding="utf-8")
for i,l in enumerate(rm.splitlines(),1):
    if "Arca" in l or "Boot" in l or "cyst" in l or "paramecium" in l or ("Hush" in l and ("cool" in l or "quiet" in l or "[x]" in l or "[ ]" in l)):
        print(f"RM{i}:{l[:220]}")
