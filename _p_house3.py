from pathlib import Path
house=Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
print("next leftover is Dusk", "next leftover is Dusk" in house.splitlines()[18])
# show silica assert block
lines=house.splitlines()
for i in range(1695, 1765):
    print(f"{i+1}:{lines[i]}")
# check title has next leftover is Dusk
t=lines[18]
idx=t.find("next leftover")
print("title next:", t[idx:idx+40] if idx>=0 else "NONE")
