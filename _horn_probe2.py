from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
print("JS leftover after Cap", js.count("This is the leftover after Cap"))
print("TS leftover after Cap", ts.count("This is the leftover after Cap"))
print("JS third leftover", js.count("third leftover of the fungi den"))
print("TS third leftover", ts.count("third leftover of the fungi den"))
i = ts.find("fungi den")
print("TS fungi den snippets:")
idx = 0
while True:
    i = ts.find("fungi den", idx)
    if i < 0: break
    print(repr(ts[max(0,i-80):i+80]))
    idx = i+1
    if idx > 5000: break
print("--- JS header end ---")
print(repr(js[:js.find("*/")+2][-250:]))
print("--- TS header end ---")
print(repr(ts[:ts.find("*/")+2][-250:]))
print("JS already FORK?", "const FORK" in js)
print("TS already FORK?", "export const FORK" in ts)
