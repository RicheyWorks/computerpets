from pathlib import Path
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
i = ts.find("export type PlayTarget")
chunk = ts[i:i+2500]
print(chunk)
print("==== leave/side barkplate ====")
print("barkplate in type area", "barkplate" in chunk)
# find barkplate definition
j = ts.find('"barkplate"')
print("first barkplate", j, repr(ts[max(0,j-80):j+80]))
