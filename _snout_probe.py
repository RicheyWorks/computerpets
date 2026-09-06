from pathlib import Path
h = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
i = h.find('test("Forceps leftover')
print(h[i:i+2800])
print("====")
for needle in ["acorn_weevil", "Snout", "Click", "next leftover", "click_beetle", "carpenter_bee", "oak"]:
    idx = 0
    n = 0
    while n < 8:
        j = h.find(needle, idx)
        if j < 0:
            break
        print(needle, repr(h[max(0,j-70):j+110].replace("\n"," | ")))
        idx = j + 1
        n += 1
