from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
print("choir playFor lines:")
for i,line in enumerate(js.splitlines(),1):
    if "choir" in line.lower() or "CHORD" in line and ("const" in line or "return" in line or "playFor" in line or "IGNORE" in line):
        if "choir" in line or "CHORD" in line:
            print(f"{i}:{line}")
# check api export
i = js.find("const api")
print("\napi snippet:")
print(js[i:i+500] if i>=0 else "no api")
# find module export object with CHORD
i = js.find("CHORD,")
print("\nCHORD export contexts:")
while i != -1:
    print(repr(js[i-40:i+60]))
    i = js.find("CHORD,", i+1)
