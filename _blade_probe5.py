from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# find CHIRP export and const
i = js.find('const CHIRP')
print("const CHIRP", repr(js[i:i+40]) if i>=0 else None)
# module.exports block near end
j = js.rfind("CHIRP")
print("last CHIRP", j, repr(js[j-40:j+40]))
# find still owner
import re
for m in re.finditer(r'return STILL;', js):
    print("STILL at", m.start(), repr(js[m.start()-80:m.start()+20]))
for m in re.finditer(r'if \(key === "[^"]+"\) return STILL;', js):
    print(m.group(0))
# line 32097 of test
lines = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8").splitlines()
for n in range(32090, 32105):
    print(f"{n+1}:{lines[n]}")
