from pathlib import Path
rm=Path("docs/ROADMAP.md").read_text(encoding="utf-8")
for i,l in enumerate(rm.splitlines(),1):
    if "Nimbus (`nimbus`" in l and l.strip().startswith("-"):
        print(i, l[:500])
    if "Choir (`choir`" in l and l.strip().startswith("- [x]"):
        print("CHOIR", i)
