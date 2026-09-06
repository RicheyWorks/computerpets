from pathlib import Path
# find scripts that insert QUIET
hits=[]
for p in Path(".").glob("_*.py"):
    try:
        t=p.read_text(encoding="utf-8", errors="replace")
    except Exception:
        continue
    if 'QUIET = "quiet"' in t or "quietPoint" in t and "once(" in t and "umbral" in t:
        hits.append((p.name, len(t), "QUIET" in t, "once(" in t))
print("hits", hits)
# also check frost_fns / align_fns style for quiet
for p in ["frost_fns.js","align_fns.js","js_tick_beacon.js","js_pick_beacon.js"]:
    t=Path(p).read_text(encoding="utf-8")
    print("====", p, "====")
    print(t[:400])
