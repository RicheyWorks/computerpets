from pathlib import Path
ts=Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
# find all target.kind === RAYS
idx=0
while True:
    i=ts.find("RAYS", idx)
    if i<0: break
    print(i, repr(ts[max(0,i-60):i+80]).replace("\n","\\n"))
    idx=i+4
    if idx>0 and i>500000: 
        pass
print("--- approach block ---")
i=ts.find('target.kind === PAPILLAE')
# find within stepPlay approach - there may be multiple
while i>=0:
    ctx=ts[i-100:i+450]
    if "papillae-on" in ctx or "goPhase" in ctx:
        print("FOUND approach-like at", i)
        print(ctx)
        print("====")
    i=ts.find('target.kind === PAPILLAE', i+1)
