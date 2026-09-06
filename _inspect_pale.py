from pathlib import Path
p = Path(r"desktop/renderer/window-play.js")
lines = p.read_text(encoding="utf-8").splitlines()
needles = ("const SIGNAL", "const PLOW", "const STORE", "const DIG", "const BURY", "const RUN", "const SAND", 'kind === PLOW', 'kind === STORE', 'kind === DIG', 'kind === BURY', 'kind === RUN', 'kind === SAND', '=== "sand"', "function plowPoint", "function storePoint", "function buryPoint", "function digPoint", "function runPoint", "function sprayPoint")
for i,l in enumerate(lines,1):
    if any(n in l for n in needles):
        print(f"{i}:{l[:180]}")
