from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
i = js.find("function puffPoint")
print(js[i:i+500])
print("---leafPoint---")
i = js.find("function leafPoint")
print(js[i:i+500])
print("---spotPoint---")
i = js.find("function spotPoint")
print(js[i:i+500])
print("---weekPoint---")
i = js.find("function weekPoint")
print(js[i:i+500])
print("---docs---")
for p in ["docs/ROADMAP.md", "docs/ARCHITECTURE.md", "README.md"]:
    t = Path(p).read_text(encoding="utf-8")
    for needle in ["next leftover is Lace", "Next leftover is Lace", "Jewel blacks", "Do not start Lace", "Forceps"]:
        print(p, needle, t.count(needle))
