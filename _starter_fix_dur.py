from pathlib import Path
for p in [Path("desktop/renderer/window-play.js"), Path("web/src/lib/pets/window-play.ts")]:
    t = p.read_text(encoding="utf-8")
    n = t.count("bloomOn: 2.61")
    t = t.replace("bloomOn: 2.61", "bloomOn: 2.67")
    p.write_text(t, encoding="utf-8", newline="\n")
    print(p, n)
