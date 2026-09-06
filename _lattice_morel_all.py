from pathlib import Path
for p in ["desktop/renderer/window-play.test.cjs","web/scripts/window-play.test.mjs","desktop/renderer/leftover-house.test.cjs"]:
    t = Path(p).read_text(encoding="utf-8")
    print(p, "morel", t.count("morel"), "chanterelle", t.count("chanterelle"))
    idx=0
    while True:
        i=t.find("morel", idx)
        if i<0: break
        line=t[:i].count("\n")+1
        print(f"  L{line}: {t[i-50:i+40].replace(chr(10),' | ')}")
        idx=i+1
