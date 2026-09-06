from pathlib import Path
import re
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
# find Hush describe/test blocks
idxs = [m.start() for m in re.finditer(r"Hush|umbral|quiet", cjs)]
print("matches", len(idxs))
# find the big Hush test section - look for test("Hush
for m in re.finditer(r'test\("([^"]*(?:Hush|umbral|quiet|Quiet)[^"]*)"', cjs):
    print(m.group(1)[:100])
print("--- sill pin ---")
for m in re.finditer(r'test\("([^"]*(?:sill|pin|generic)[^"]*)"', cjs):
    if "umbral" in m.group(1).lower() or "cyst" in m.group(1).lower() or "paramecium" in m.group(1).lower() or "Hush" in m.group(1) or "Boot" in m.group(1) or "Arca" in m.group(1) or "magneton" in m.group(1) or "Beacon" in m.group(1):
        print(m.group(1))
# find playFor tests mentioning umbral
for m in re.finditer(r'.{0,80}umbral.{0,80}', cjs):
    print("CTX:", m.group(0).replace("\n"," ")[:160])
