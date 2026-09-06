from pathlib import Path
mjs = Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
i = mjs.find('playFor("photovore"), "sill"')
print("mjs leftover:", repr(mjs[i-80:i+80]))
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
print("cjs photovore sill", cjs.count('playFor("photovore"), "sill"'))
print("cjs choir sill", cjs.count('playFor("choir"), "sill"'))
# mjs other guests / sill walker using photovore for pick
for needle in ["photovore"]:
    pass
# find tests that expect sill phases with photovore
idx=0
while True:
    j=mjs.find("photovore", idx)
    if j<0: break
    line=mjs[:j].count("\n")+1
    ctx=mjs[max(0,j-70):j+50].replace("\n"," | ")
    if "thirst" in mjs[max(0,j-300):j+100] or "Gleam" in mjs[max(0,j-900):j]:
        idx=j+1; continue
    if "Overlay.playFor" in ctx and "thirst" in mjs[j:j+40]:
        idx=j+1; continue
    print(f"mjs @{line}: {ctx}")
    idx=j+1
