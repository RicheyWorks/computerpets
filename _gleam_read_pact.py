from pathlib import Path
for name in ["_pact_core.py","_pact_tests.py","_pact_docs.py","_pact_ts_types.py","_starter_core.py"]:
    p=Path(name)
    if p.exists():
        t=p.read_text(encoding="utf-8", errors="replace")
        print(f"===== {name} size={len(t)} =====")
        print(t[:2500])
        print("...\n")
