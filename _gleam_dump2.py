from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")

def around(needle, before=200, after=800):
    i = js.find(needle)
    print(f"\n===== {needle!r} @ {i} =====")
    print(js[max(0,i-before):i+after])

# pickTarget PLAQUE branch
around("kind === PLAQUE", 80, 600)
# also second occurrence
idxs=[]
start=0
while True:
    j=js.find("kind === PLAQUE", start)
    if j<0: break
    idxs.append(j); start=j+1
print("PLAQUE idxs", idxs)
for j in idxs:
    print(f"\n----- at {j} -----")
    print(js[j-120:j+700])
