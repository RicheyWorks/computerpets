import re, pathlib
js = pathlib.Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
kinds = set(re.findall(r'return\s+"([a-z_]+)"', js))
kinds |= set(re.findall(r"return\s+'([a-z_]+)'", js))
kinds |= set(re.findall(r'kind:\s*"([a-z_]+)"', js))
kinds |= set(re.findall(r"kind:\s*'([a-z_]+)'", js))
print("count", len(kinds))
print("\n".join(sorted(kinds)))
# also dump playFor function
m = re.search(r"function playFor\([^)]*\)\s*\{(.{0,8000}?)\}", js, re.S)
if m:
    print("---playFor---")
    print(m.group(0)[:4000])
