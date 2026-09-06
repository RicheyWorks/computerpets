from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
print("lacewing ->", end=" ")
i = js.find('key === "lacewing"')
print(js[i:i+40] if i>=0 else "MISSING")
i = js.find('key === "moth"')
print("moth ->", js[i:i+40] if i>=0 else "MISSING")
i = js.find("return SPOT")
print("spot context", js[max(0,i-60):i+15])
for p in Path("web/src/lib/pets").glob("*.ts"):
    t = p.read_text(encoding="utf-8")
    if 'slug: "seven"' in t:
        print("seven file", p)
        i = t.find('slug: "seven"')
        print(t[i-80:i+100])
