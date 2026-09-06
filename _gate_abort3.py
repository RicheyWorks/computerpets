from pathlib import Path
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
i = cjs.find("Veil leftover rays")
j = cjs.find("Gate leftover mantles")
chunk = cjs[i:j]
for line in chunk.splitlines():
    if "shouldAbort" in line or "canStart" in line:
        print(line)
print("---gate---")
g = cjs[j:j+8000]
for line in g.splitlines():
    if "shouldAbort" in line or "canStart" in line:
        print(line)
