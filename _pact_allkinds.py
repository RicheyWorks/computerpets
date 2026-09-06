import re, pathlib
js = pathlib.Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
consts = re.findall(r'const ([A-Z_]+) = "([a-z_]+)";', js)
print("CONSTS", len(consts))
for a,b in consts:
    print(f"{a}={b}")
print("--- unique values ---")
vals = sorted(set(b for a,b in consts))
print(len(vals), vals)
