from pathlib import Path
t = Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
idx=0
while True:
    i=t.find("morel", idx)
    if i<0: break
    line=t[:i].count("\n")+1
    ctx=t[max(0,i-70):i+50].replace("\n"," | ")
    if "playFor" not in ctx:
        print(f"L{line}: {ctx}")
    idx=i+1
