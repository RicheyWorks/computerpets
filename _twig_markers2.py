from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
idx = js.find('leave: "hawked"')
print(repr(js[idx:idx+180]))
print("---")
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
idx = ts.find('leave: "hawked"')
print(repr(ts[idx:idx+180]))
print("---API---")
idx = js.find("hawkOffPath,\n    pickTarget")
print(repr(js[idx-80:idx+80]))
idx = js.find("HAWK,\n    IGNORE")
print(repr(js[idx-40:idx+40]))
# docs
for p in ["README.md","desktop/README.md","docs/ARCHITECTURE.md","docs/ROADMAP.md"]:
    t=Path(p).read_text(encoding="utf-8")
    print(p, "Dart hawks" in t, "next leftover is Twig" in t, "Do not start Twig" in t)
# find last roadmap line
arch=Path("docs/ARCHITECTURE.md").read_text(encoding="utf-8")
for line in arch.splitlines():
    if "2026-09-01" in line and "Dart" in line:
        print("ARCH:", line[:220])
road=Path("docs/ROADMAP.md").read_text(encoding="utf-8")
for line in road.splitlines():
    if "2026-09-01" in line and "Dart" in line:
        print("ROAD:", line[:240])
print("Dart is done count", road.count("Dart is done"))
print("Next leftover is Twig count", road.count("Next leftover is Twig. Do not start Twig."))
