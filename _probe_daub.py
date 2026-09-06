from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# find second/third DAUB occurrence with hold =
idx = 0
hits=[]
while True:
    i = js.find("kind === DAUB", idx)
    if i<0: break
    hits.append(i)
    idx=i+1
print("DAUB hits", hits)
for i in hits:
    chunk=js[i:i+550]
    if "hold" in chunk or "side" in chunk:
        print("--- at", i)
        print(chunk[:550])
