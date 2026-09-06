from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
lines = js.splitlines()
for pat in ["const FLOAT", "const DAUB", "const TEETH", "floatOn:", "daubOn:", "teethOn:",
            "function floatPoint", "function daubPoint", "function teethPoint",
            'return TEETH', 'return DAUB', 'return FLOAT',
            "Nimbus floats", "Mortar", "Mane teeth", "if (kind === FLOAT)", "if (kind === DAUB)", "if (kind === TEETH)"]:
    hits = [i+1 for i,l in enumerate(lines) if pat in l]
    print(pat, hits[:8])
# find teeth and daub keys
import re
print("TEETH keys", re.findall(r'if \(key === "([^"]+)"\) return TEETH', js))
print("DAUB keys", re.findall(r'if \(key === "([^"]+)"\) return DAUB', js))
print("FLOAT keys", re.findall(r'if \(key === "([^"]+)"\) return FLOAT', js))
# dump floatOff duration context
idx = js.find("floatOff:")
print("DUR float block:\n", js[idx-80:idx+120])
# dump size gates for DAUB TEETH FLOAT
for kind in ["DAUB", "TEETH", "FLOAT", "TEETH"]:
    m = re.search(rf'if \(kind === {kind}\) return[^\n]+', js)
    print(m.group(0) if m else f"no {kind} size")
