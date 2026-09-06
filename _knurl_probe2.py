from pathlib import Path
p = Path(r"C:\Users\730ri\projects\ComputerPets\web\scripts\window-play.test.mjs")
t = p.read_text(encoding="utf-8")
for needle in ["they walk a sill", "other guests do not clone", "walk a sill and hop"]:
    print(needle, t.count(needle))
# leftover-house honeybee
h = Path(r"C:\Users\730ri\projects\ComputerPets\desktop\renderer\leftover-house.test.cjs")
ht = h.read_text(encoding="utf-8")
print("house knobbed", ht.count("knobbed_whelk"))
print("house lugworm", ht.count("lugworm"))
print("house honeybee", ht.count("honeybee"))
idx = 0
while True:
    i = ht.find("knobbed_whelk", idx)
    if i < 0:
        break
    print("H", ht[max(0,i-60):i+70].replace("\n"," | "))
    idx = i+1
