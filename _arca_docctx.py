from pathlib import Path
for f in ["README.md","desktop/README.md"]:
    t=Path(f).read_text(encoding="utf-8")
    i=t.find("Hush")
    print("====", f, i, "====")
    print(t[i-80:i+220])
    print()
# ROADMAP hush full line + what follows
rm=Path("docs/ROADMAP.md").read_text(encoding="utf-8")
for i,l in enumerate(rm.splitlines(),1):
    if i in (423,424,425,435,436,454,455,456):
        print(f"{i}:{l[:240]}")
