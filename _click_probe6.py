from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
for name in ["flipPoint","flipOnPath","flipPath","flipHoldPath","flipOffPath","jumpPoint","jumpPath","jumpOnPath",
             'key === "snapper"','key === "hognose"','key === "firefly"','key === "venus_flytrap"',
             "DUR.flipOn","DUR.jumpOn","DUR.snapOn","flipOn:","jumpOn:","snapOn:",
             "CLICK,","FLIP,","export.*FLIP"]:
    print(name, "->", js.count(name) if not name.startswith("export") else "n/a")
# find snap/hognose/firefly playFor
import re
for key in ["snapper","venus_flytrap","hognose","firefly","bluff"]:
    m=re.search(rf'if \(key === "{key}"\) return ([A-Z_]+);', js)
    print(key, "=>", m.group(1) if m else "MISSING")
# exports
for fn in ["flipPoint","jumpPoint","FLIP","CLICK","SNAP","JUMP","GLOW"]:
    print("export", fn, js.count("    %s," % fn) or js.count("    %s\n" % fn))
