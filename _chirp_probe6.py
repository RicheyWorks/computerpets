import re
js=open("desktop/renderer/window-play.js",encoding="utf-8").read()
# find SAND / BURY / PLOW size gates and header end
for m in re.finditer(r'if \(kind === (SAND|BURY|PLOW|EMERGE|PRAY|SING|CHIRP|DRONE|DRUM|FORAGE)\) return[^\n]+', js):
    print(m.group(0))
print("---header---")
print(js.splitlines()[0][:500])
print("---")
# current playFor end
m=re.search(r'if \(key === "cicada"\) return EMERGE;\n    return SILL;', js)
print("playFor end ok", bool(m))
# emerge leave block end for pickTarget
idx=js.find('side: "soilhusk"')
print(js[idx-100:idx+350])
