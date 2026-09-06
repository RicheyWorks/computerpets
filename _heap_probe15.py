mjs = open(r"web\scripts\window-play.test.mjs", encoding="utf-8").read().splitlines()
for i,l in enumerate(mjs):
    if "lugworm" in l or "other guests do not clone" in l or "walk a sill" in l:
        print(f"{i+1}:{l[:220]}")
print("--- mjs Knurl test full start")
for i in range(17764, 17875):
    print(f"{i+1}:{mjs[i][:200]}")
