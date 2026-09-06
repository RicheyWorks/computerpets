from pathlib import Path
t = Path(r"desktop/renderer/window-play.js").read_text(encoding="utf-8")
end = t.find("*/")
print("HEADER TAIL:", t[end-450:end+2])
print("====")
idx = t.find('if (key === "nexus")')
print("PLAYFOR:", repr(t[idx:idx+140]))
print("====")
idx = t.find("const MANY")
print("CONST:", repr(t[idx-50:idx+90]))
print("====")
idx = t.find("manyOff:")
print("DUR:", repr(t[idx:idx+100]))
print("====")
start = 0
while True:
    i = t.find("kind === MANY", start)
    if i < 0:
        break
    print("SIZE/KIND:", repr(t[i:i+110]))
    start = i + 1
print("====")
idx = t.find("MANY,\n")
print("EXPORT:", repr(t[idx:idx+50]))
idx = t.find("manyOffPath,")
print("EXPORT FNS:", repr(t[idx:idx+80]))
print("halovore", t.count("halovore"))
print("magneton", t.count("magneton"))
# pick leave manyed
idx = t.find('leave: "manyed"')
print("PICK LEAVE:", repr(t[idx-200:idx+40]))
# approach many-on
idx = t.find('goPhase(next, "many-on"')
print("APPROACH:", repr(t[idx-120:idx+120]))
# refit many
idx = t.find("target.kind === MANY")
print("REFIT:", repr(t[idx-80:idx+160]))
# tick many-off end before sill
idx = t.find('if (next.phase === "many-off")')
print("TICK MANY-OFF start found", idx)
# find sill-hop after many-off
idx2 = t.find('if (next.phase === "sill-hop")')
print("SILL-HOP:", idx2)
print("between many-off and sill:", t[idx:idx2][-200:] if idx>0 else "n/a")
