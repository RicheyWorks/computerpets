from pathlib import Path
import re
for p in ["README.md","desktop/README.md","docs/ARCHITECTURE.md","docs/ROADMAP.md"]:
    t=Path(p).read_text(encoding="utf-8")
    print("====", p, "====")
    # last lines with Banner or Jewel or meadow
    hits=[]
    for i,line in enumerate(t.splitlines(),1):
        if any(k in line for k in ["Banner","Jewel","swallowtail","meadow den","blossom dish","next leftover","2026-09-02","2026-09-01"]):
            hits.append((i,line.strip()[:200]))
    for i,line in hits[-12:]:
        print(f"{i}:{line}")
house=Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
print("==== HOUSE TITLE ====")
for m in re.finditer(r'test\("([^"]{80,})"', house):
    s=m.group(1)
    if "Banner" in s or "Vault" in s or "meadow" in s:
        print(s[:300])
        print("...TAIL...", s[-250:])
        print("LEN", len(s))
print("==== jewelwing count", house.count('playFor("jewelwing")'))
print("swallowtail tails", house.count('playFor("swallowtail"), "tails"'))
print("swallowtail sill", house.count('playFor("swallowtail"), "sill"'))
