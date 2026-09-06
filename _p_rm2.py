from pathlib import Path
rm=Path("docs/ROADMAP.md").read_text(encoding="utf-8")
for i,l in enumerate(rm.splitlines(),1):
    if "Nimbus" in l:
        print(i, l[:250])
