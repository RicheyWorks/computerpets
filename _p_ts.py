from pathlib import Path
ts=Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
print("FACET in ts", "FACET" in ts, "facet-on" in ts, "silica" in ts and 'return FACET' in ts)
# find float-off tick
idx=ts.find('phase === "float-off"')
print("float-off idx", idx)
print(repr(ts[idx-20:idx+400]) if idx>=0 else "missing")
# sill-hop after float?
idx2=ts.find('phase === "sill-hop"')
# find the one after float-off
print("first sill-hop", idx2)
# show what follows float-off block end
if idx>=0:
    chunk=ts[idx:idx+800]
    print("---chunk---")
    print(chunk)
