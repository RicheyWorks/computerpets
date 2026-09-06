from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
for name in ["coverPoint","kickPoint","bunPoint","wartsPoint","shelfPoint","leanPoint","hollowPoint"]:
    print(name, "js export", f"    {name}," in js or f"export function {name}" in js, "ts", f"export function {name}" in ts)
print("LEAN export", "    LEAN," in js)
print("DUR.leanOn", "leanOn:" in js)
