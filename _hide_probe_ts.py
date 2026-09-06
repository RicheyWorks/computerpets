from pathlib import Path
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
i = ts.find("eagle_ray")
while i >= 0:
    print(repr(ts[i-30:i+60]))
    i = ts.find("eagle_ray", i+1)
