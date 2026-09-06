p = r"desktop\renderer\window-play.test.cjs"
lines = open(p, encoding="utf-8").read().splitlines()
print("TOTAL", len(lines))
for i,l in enumerate(lines,1):
    if "knobs" in l.lower() or "knurl" in l.lower() or "knobbed" in l.lower() or "lugworm" in l.lower() or "heap" in l.lower():
        print(f"{i}:{l[:220]}")
