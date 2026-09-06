from pathlib import Path
house = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
for s in ["puffball", "chicken", "CLOUD", "yeast", "Starter", "Flame"]:
    print(s, house.count(s))
idx = 0
while True:
    i = house.find("puffball", idx)
    if i < 0:
        break
    print(repr(house[max(0, i - 50) : i + 90]))
    idx = i + 1
i = house.find("Puff leftover")
j = house.find('");', i)
print("TITLE TAIL", repr(house[j - 350 : j + 3]))
i = house.find("chicken_of_woods")
print("CHICKEN CTX", repr(house[i - 40 : i + 80]))
