from pathlib import Path
import re
g = Path("web/src/lib/pets/meadow.ts").read_text(encoding="utf-8")
print("=== meadow.ts len", len(g))
# print lines with guest keys
for i, line in enumerate(g.splitlines(), 1):
    if re.search(r"click_beetle|field_cricket|grasshopper|katydid|firefly|earwig|acorn_weevil|lacewing|mantis|ladybug|cicada", line, re.I):
        print(f"{i}:{line[:160]}")
print("--- guide ---")
guide = Path("web/src/lib/pets/meadow-guide.ts").read_text(encoding="utf-8")
idx = guide.find("click_beetle")
print(guide[max(0, idx-500): idx+500] if idx >= 0 else "no click_beetle")
print("--- roster meadow ---")
roster = Path("desktop/renderer/roster.json").read_text(encoding="utf-8")
idx = roster.find("click_beetle")
print(roster[max(0, idx-300): idx+400] if idx >= 0 else "no")
