from pathlib import Path
for p in ["desktop/renderer/window-play.test.cjs", "web/scripts/window-play.test.mjs", "desktop/renderer/leftover-house.test.cjs"]:
    t = Path(p).read_text(encoding="utf-8")
    print("====", p)
    idx = 0
    while True:
        i = t.find('chanterelle', idx)
        if i < 0: break
        line = t[:i].count("\n")+1
        snippet = t[max(0,i-40):i+50].replace("\n", " | ")
        if "sill" in t[max(0,i-20):i+40]:
            print(f"  L{line}: {snippet}")
        idx = i+1
