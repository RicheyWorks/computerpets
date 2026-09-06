import pathlib, re
ts = pathlib.Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
js = pathlib.Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
print("js has FLOAT", 'FLOAT = "float"' in js, "floatPoint" in js, "nimbus\") return FLOAT" in js or 'nimbus") return FLOAT' in js)
print("ts has FLOAT", 'FLOAT = "float"' in ts)
for m in re.finditer(r"function beginPlay|export function beginPlay|function chordPoint|export function chordPoint", ts):
    print("ts", m.group(0), m.start(), repr(ts[m.start():m.start()+120]))
# chordPoint export style
idx = ts.find("chordPoint")
print("first chordPoint", idx, repr(ts[idx-30:idx+80]))
