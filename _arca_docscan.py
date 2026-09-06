from pathlib import Path
for f in ["README.md","desktop/README.md","docs/ARCHITECTURE.md","docs/ROADMAP.md"]:
    t=Path(f).read_text(encoding="utf-8")
    print("====", f, "====")
    for i,l in enumerate(t.splitlines(),1):
        if "Hush" in l or ("far den" in l.lower() and ("Last Updated" in l or "Phase 6" in l or "ninth" in l)):
            print(f"{i}:{l[:220]}")
