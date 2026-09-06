from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
i = js.find("return MOUNT")
print(js[max(0,i-100):i+20])
# moth key in catalog
for p in Path("web/src/lib/pets").glob("*.ts"):
    t = p.read_text(encoding="utf-8")
    if 'slug: "moth"' in t or 'name: "Moth"' in t:
        i = t.find("Moth")
        print(p.name, t[max(0,i-60):i+80])
# fix roadmap ladybug -> ladybird
road = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
print("ladybug count", road.count("ladybug"))
print("ladybird count", road.count("ladybird"))
print("Seven still owns", "Seven (`ladybug`)" in road, "Seven (`ladybird`)" in road)
