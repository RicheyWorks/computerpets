from pathlib import Path
ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")
out = Path(r"C:\Users\730ri\projects\ComputerPets\_milk_extract4.txt")
lines = []
ts = (ROOT / "web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
js = (ROOT / "desktop/renderer/window-play.js").read_text(encoding="utf-8")
arch = (ROOT / "docs/ARCHITECTURE.md").read_text(encoding="utf-8")
readme = (ROOT / "README.md").read_text(encoding="utf-8")
mjs = (ROOT / "web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
cjs = (ROOT / "desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")

# side union waxdish
i = ts.find("waxdish")
lines.append("===== ts waxdish =====")
lines.append("idx %s LINE %s" % (i, ts.count("\n",0,i)+1 if i>=0 else "?"))
lines.append(ts[max(0,i-200):i+200] if i>=0 else "MISSING")

i = ts.find("waggled")
lines.append("\n===== ts waggled leave =====")
lines.append(ts[max(0,i-200):i+250] if i>=0 else "MISSING")

# PlayPhase around waggle
i = ts.find('| "waggle-on"')
lines.append("\n===== PlayPhase waggle =====")
lines.append(ts[i-80:i+180])

# ARCH other guests
for needle in ["Other guests walk a sill", "remaining hive", "first leftover of the remaining"]:
    i = arch.find(needle)
    lines.append("\n===== ARCH %r idx=%s =====" % (needle, i))
    if i>=0:
        lines.append(arch[max(0,i-180):i+400])

i = readme.find("Other guests walk a sill")
lines.append("\n===== README other guests =====")
lines.append(readme[max(0,i-250):i+200] if i>=0 else "MISSING")

# mjs monarch
idx=0
n=0
lines.append("\n===== mjs monarch =====")
while True:
    i = mjs.find("monarch", idx)
    if i<0: break
    n+=1
    lines.append("L%d: %s" % (mjs.count("\n",0,i)+1, mjs[max(0,i-60):i+80].replace("\n"," | ")))
    idx=i+7
lines.append("total %d" % n)

# ts pick WAGGLE, size WAGGLE, refit WAGGLE
i = ts.find("if (kind === WAGGLE)")
lines.append("\n===== ts size/pick WAGGLE =====")
# all
idx=0
while True:
    i = ts.find("if (kind === WAGGLE)", idx)
    if i<0: break
    lines.append("L%d: %s" % (ts.count("\n",0,i)+1, ts[i:i+280].replace("\n"," | ")))
    idx=i+10

i = ts.find("if (target.kind === WAGGLE)")
idx=0
lines.append("\n===== ts target.kind WAGGLE =====")
while True:
    i = ts.find("if (target.kind === WAGGLE)", idx)
    if i<0: break
    lines.append("L%d: %s" % (ts.count("\n",0,i)+1, ts[i:i+240].replace("\n"," | ")))
    idx=i+10

# sip size tiny tests
i = cjs.find("a real window-box")
lines.append("\n===== cjs real window-box =====")
idx=0
n=0
while True:
    i = cjs.find("a real window-box", idx)
    if i<0: break
    n+=1
    lines.append("L%d: %s" % (cjs.count("\n",0,i)+1, cjs[max(0,i-180):i+80].replace("\n"," | ")))
    idx=i+10
    if n>8: break

# Wrist wrap size
i = cjs.find("Wrist wraps")
chunk = cjs[i:i+4000] if i>=0 else ""
j = chunk.find("tiny")
lines.append("\n===== Wrist tiny =====")
lines.append(chunk[max(0,j-200):j+250] if j>=0 else "no tiny in first 4000")
j = chunk.find("width: 193")
lines.append("width 193: %s" % (chunk[max(0,j-80):j+160].replace("\n"," | ") if j>=0 else "none"))

out.write_text("\n".join(lines), encoding="utf-8")
print("wrote", out.stat().st_size)
