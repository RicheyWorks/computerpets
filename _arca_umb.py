from pathlib import Path
for f in ["desktop/renderer/window-play.test.cjs","web/scripts/window-play.test.mjs","desktop/renderer/leftover-house.test.cjs"]:
    t=Path(f).read_text(encoding="utf-8")
    idx=0
    while True:
        i=t.find('playFor("umbral"), "sill"', idx)
        if i<0: break
        print(f, repr(t[i-40:i+50]))
        idx=i+1
