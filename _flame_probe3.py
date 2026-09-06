from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
needle = 'next.phase === "cloud-off"'
print("count", js.count(needle))
i = js.find(needle)
print(repr(js[i:i+600]))
# also check what follows cloud-off return next
j = js.find("sill-hop", i)
print("sill-hop after", j - i)
print(repr(js[j-80:j+40]))
