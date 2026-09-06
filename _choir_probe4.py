from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# extract thirst block (from thirstPoint through thirstOffPath)
start = js.find("function thirstPoint")
end = js.find("function ", start + 10)
# find last thirst function end
idx = js.find("function thirstOffPath")
i = js.find("{", idx)
depth=0
for j in range(i,len(js)):
    if js[j]=="{": depth+=1
    elif js[j]=="}":
        depth-=1
        if depth==0:
            end=j+1
            break
block = js[start:end]
Path("thirst_fns.js").write_text(block, encoding="utf-8")
print("thirst block chars", len(block))
print(block[:2500])
print("\n---HOLD/OFF---\n")
print(block[-1500:])
