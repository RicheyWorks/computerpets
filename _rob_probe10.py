from pathlib import Path
# read bootstrap scripts - they show all patch sites
for name in ["_click_bootstrap1.py","_click_bootstrap2.py","_click_bootstrap3.py","_click_bootstrap4.py","_click_bootstrap5.py","_click_docs.py","_click_tests.py","_click_ts.py","_click_core.py"]:
    t = Path(name).read_text(encoding="utf-8")
    print("====", name, "len", len(t), "====")
    # print first 40 lines of structure (defs / comments)
    for i,line in enumerate(t.splitlines()[:35]):
        print(f"{i+1}:{line[:120]}")
    print()
