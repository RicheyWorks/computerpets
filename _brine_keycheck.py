# -*- coding: utf-8 -*-
from pathlib import Path
import re
t = Path(r"desktop/renderer/window-play.js").read_text(encoding="utf-8")
for pat in ["return LICK", "return DRY", "return SAND", "return DIG"]:
    for m in re.finditer(r'if \(key === "([^"]+)"\) %s;' % pat, t):
        print(pat, m.group(1))
for label in ["DRY", "LICK", "SAND", "DIG"]:
    m = re.search(r"kind === %s\) return w\.width >= (\d+) && w\.height >= (\d+)" % label, t)
    print("size", label, m.groups() if m else None)
print("DRY const", "const DRY" in t)
print("LICK const", "const LICK" in t)
print("dur dryOn", "dryOn:" in t, "lickOn:" in t, "sandOn:" in t)
# exports
for name in ["dryPoint", "lickPoint", "sandPoint", "digPoint", "dryPath", "lickPath", "sandPath"]:
    print(name, name in t)
