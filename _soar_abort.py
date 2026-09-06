from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
i = js.find("function shouldAbort")
print(js[i:i+2500])
print("====MANTLE IN ABORT====")
idx=0
while True:
  j = js.find("mantle", idx)
  if j<0: break
  # only near shouldAbort
  if abs(j-i)<5000 or (j>i and j<i+8000):
    ls=js.rfind("\n",0,j)+1; le=js.find("\n",j)
    print(js[ls:le][:200])
  idx=j+6
  if idx>i+15000: break
