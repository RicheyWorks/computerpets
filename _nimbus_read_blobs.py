import pathlib
# rest of choir_core
t = pathlib.Path("_choir_core.py").read_text(encoding="utf-8")
print(t[5000:11000])
print("====BLOB FILES====")
for name in ["chord_fns.js","js_tick_choir.js","js_pick_choir.js","ts_pick_choir.js","_choir_cjs_block.txt","_choir_mjs_block.txt"]:
    p=pathlib.Path(name)
    print(f"\n---- {name} len={p.stat().st_size if p.exists() else 'MISS'} ----")
    if p.exists():
        print(p.read_text(encoding="utf-8")[:3500])
