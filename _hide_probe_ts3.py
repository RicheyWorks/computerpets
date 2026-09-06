from pathlib import Path
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
i = ts.find('if (target.kind === SPOTS)')
# find the approach one with spots-on
while i >= 0:
    chunk = ts[i:i+250]
    if "spots-on" in chunk:
        print(repr(chunk))
        # also next WRAP
        j = ts.find("if (target.kind === WRAP)", i)
        print("WRAP ctx", repr(ts[j-5:j+40]))
        break
    i = ts.find("if (target.kind === SPOTS)", i+1)
# also pickTarget leave spotted
i = ts.find('leave: "spotted"')
print("PICK", repr(ts[i-80:i+120]))
i = ts.find("if (target.kind === SPOTS)")
# refit
while i >= 0:
    chunk = ts[i:i+200]
    if "spotsPoint" in chunk:
        print("REFIT", repr(chunk))
        break
    i = ts.find("if (target.kind === SPOTS)", i+1)
# DUR
i = ts.find("spotsOff:")
print("DUR", repr(ts[i-5:i+40]))
# const
i = ts.find('export const SPOTS')
print("CONST", repr(ts[i:i+80]))
