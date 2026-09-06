from pathlib import Path
# find hush core-like scripts that do once() patches for quiet
for name in ["_p_ts.py","_p_state.py","_p_dur.py","_p_mjs.py","_p_house.py","_hush_ts.py","_hush_pick.py"]:
    p=Path(name)
    if not p.exists():
        print(name, "missing"); continue
    t=p.read_text(encoding="utf-8", errors="replace")
    print("====", name, "len", len(t), "====")
    print(t[:500])
    print()
