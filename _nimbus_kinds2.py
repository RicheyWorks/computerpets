import re, pathlib
js = pathlib.Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
consts = re.findall(r'const\s+([A-Z][A-Z0-9_]*)\s*=\s*"([a-z_]+)"', js)
print("const kinds", len(consts))
for name, val in consts:
    print(f"{name}={val}")
# also check _kinds_unique or _all_kinds
for p in ["_kinds_unique.txt", "_all_kinds.txt"]:
    path = pathlib.Path(p)
    if path.exists():
        print("---", p, "---")
        print(path.read_text(encoding="utf-8")[:4000])
