from pathlib import Path
t = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
i = t.find("const WIN")
print(t[i:i+250])
print("--- WORK ---")
j = t.find("const WORK")
print(t[j:j+120])
# WindowPlayKind WARTS
t2 = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
i3 = t2.find("typeof WARTS")
print("KIND AROUND WARTS", t2[i3-40:i3+80])
# how tests are run
pkg = Path("desktop/package.json")
if pkg.exists():
    print("desktop pkg leftover", "leftover" in pkg.read_text(encoding="utf-8"))
