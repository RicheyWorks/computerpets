p = r"web\src\lib\pets\window-play.ts"
lines = open(p, encoding="utf-8").read().splitlines()
print("TOTAL", len(lines))
for i,l in enumerate(lines,1):
    if "KNOBS" in l or "knobsOn" in l or "knobbed_whelk" in l or "function knobs" in l or "export const KNOBS" in l or "const KNOBS" in l:
        if "knobs" in l.lower() or "KNOBS" in l:
            print(f"{i}:{l[:180]}")
