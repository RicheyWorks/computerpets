mjs = open(r"web\scripts\window-play.test.mjs", encoding="utf-8").read().splitlines()
print("lines", len(mjs))
for i,l in enumerate(mjs):
    if "knobs" in l.lower() or "knurl" in l.lower() or "knobbed" in l.lower() or "lugworm" in l.lower():
        print(f"{i+1}:{l[:200]}")
