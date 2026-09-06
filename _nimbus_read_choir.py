import pathlib
# read choir core / docs / tests scripts partially
for name in ["_choir_core.py","_choir_docs.py","_choir_tests.py","_choir_pr_body.md","_gleam_core.py"]:
    p = pathlib.Path(name)
    if not p.exists():
        print("MISSING", name); continue
    t = p.read_text(encoding="utf-8", errors="ignore")
    print("====", name, "len", len(t), "====")
    print(t[:5000])
    print("...\n")
