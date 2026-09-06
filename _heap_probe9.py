js = open(r"desktop\renderer\window-play.js", encoding="utf-8").read().splitlines()
for i,l in enumerate(js):
    if "function springPoint" in l:
        print("--- springPoint", i+1)
        for j in range(i, min(i+12, len(js))):
            print(js[j])
        break
# hop tests size
lines = open(r"desktop\renderer\window-play.test.cjs", encoding="utf-8").read().splitlines()
for i,l in enumerate(lines):
    if 27138 <= i+1 <= 27280:
        if "width" in l or "holdLift" in l or "tiny" in l or "short" in l or "stamp" in l or "shut" in l or "lift" in l:
            print(f"{i+1}:{l[:200]}")
