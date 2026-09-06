from pathlib import Path
# How did hush move the pin? Check if umbral sill remains anywhere
for f in ["desktop/renderer/window-play.test.cjs","web/scripts/window-play.test.mjs","desktop/renderer/leftover-house.test.cjs"]:
    t=Path(f).read_text(encoding="utf-8")
    print(f, "umbral sill", t.count('playFor("umbral"), "sill"'), "umbral cool", t.count('playFor("umbral"), "cool"'))
# other guests test
cjs=Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
i=cjs.find('other guests do not clone')
print(cjs[i:i+500])
# count pickTarget cyst vs how silica/terminator were handled historically  
print("pickTarget cyst", cjs.count('80, "cyst"'))
print("pickTarget paramecium", cjs.count("paramecium"))
