import pathlib
ts = pathlib.Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
i = ts.find("export function thirstPoint")
print("thirst", repr(ts[i:i+250]))
i = ts.find("export function chordPoint")
print("chord", repr(ts[i:i+250]))
i = ts.find('if (next.phase === "thirst-off")')
print("thirst-off tick", repr(ts[i:i+200]))
