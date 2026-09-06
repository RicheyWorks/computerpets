from pathlib import Path
road = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
for needle in ["Snout", "Click", "Forceps", "meadow den", "acorn_weevil", "click_beetle", "Next leftover"]:
    idx = 0
    n = 0
    print("===", needle)
    while n < 8:
        j = road.find(needle, idx)
        if j < 0: break
        print(repr(road[max(0,j-80):j+200].replace("\n"," | ")))
        idx = j+1
        n += 1
