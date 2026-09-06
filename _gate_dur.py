from pathlib import Path
for rel in ["desktop/renderer/window-play.js", "web/src/lib/pets/window-play.ts"]:
    p = Path(rel)
    t = p.read_text(encoding="utf-8")
    for key in ["papillaeOn", "mantleOn", "raysOn", "stationOn", "mantle:", "mantleHold", "mantleOff"]:
        for line in t.splitlines():
            if key in line and ":" in line and ("DUR" in t[max(0,t.find(line)-40):t.find(line)+80] or line.strip().startswith(key.split(":")[0]) or line.strip().startswith(key)):
                s = line.strip()
                if s.startswith(key) or s.startswith(key.split(":")[0]):
                    print(rel, s)
