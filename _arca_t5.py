from pathlib import Path
house = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
# find Arca context
i = house.find("Arca")
print("Arca ctx:\n", house[i-400:i+600])
print("====")
# find far den close / Hush ninth
i = house.find("ninth leftover of the far")
if i<0: i = house.find("Hush quiets")
print("far/hush:\n", house[max(0,i-200):i+900])
print("====")
# cyst contexts in house
idx=0
n=0
while n<5:
    j=house.find("cyst", idx)
    if j<0: break
    print(f"cyst@{j}:", house[j-80:j+120].replace("\n"," | "))
    idx=j+1; n+=1
