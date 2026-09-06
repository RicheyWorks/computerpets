from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
import re
# kinds as const X = "y"
kinds = sorted(set(re.findall(r'const ([A-Z_]+) = "([a-z_]+)"', js)))
print("const kinds:")
for a,b in kinds:
    print(f"  {a} = {b}")
print("count", len(kinds))
# also kind comparisons
print("\nplay kinds in unions/ifs:")
for m in re.findall(r'=== "([a-z_]+)"', js):
    pass
used = sorted(set(re.findall(r'(?:kind|play|phase)[^;\n]{0,40}"([a-z_]{3,})"', js)))
print(used[:50])
