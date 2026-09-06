from pathlib import Path
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
for phase in ["cloud-off", "drip-hold", "drip-on", "teeth-off", "sill-hop"]:
    i = ts.find(f'phase === "{phase}"')
    print(phase, i, repr(ts[i:i+120].replace("\n","\\n")[:120]) if i>=0 else None)
