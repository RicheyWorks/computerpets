p = r"desktop\renderer\leftover-house.test.cjs"
lines = open(p, encoding="utf-8").read().splitlines()
print("TOTAL", len(lines))
for i, l in enumerate(lines, 1):
    low = l.lower()
    if "lugworm" in low or "heap" in low or "generic" in low or "next leftover" in low or "playfor(\"sill" in low:
        print(f"{i}:{l[:300]}")
