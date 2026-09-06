import re, pathlib
js = pathlib.Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# find yeast block
idx = js.find("yeast")
print("first yeast at", idx)
print(js[idx-200:idx+800] if idx>=0 else "none")
print("--- kind patterns ---")
for m in re.finditer(r"kind\s*[:=]\s*['\"]([^'\"]+)['\"]", js):
    pass
kinds = sorted(set(re.findall(r"kind\s*[:=]\s*['\"]([^'\"]+)['\"]", js)))
print("kinds", len(kinds))
print("\n".join(kinds[-40:]))
print("sample kinds", kinds[:20])
# also look for return { kind
kinds2 = sorted(set(re.findall(r"\bkind:\s*['\"]([a-z_]+)['\"]", js)))
print("kinds2", len(kinds2), kinds2[:10])
# playFor returns
print("--- playFor yeast ---")
m = re.search(r"function playFor.*?yeast.*?return", js, re.S)
