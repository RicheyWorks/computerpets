from pathlib import Path
import re
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
out = []
for key in ["orb_weaver", "spider", "loom", "luna", "autumn", "fan", "photovore", "terminator"]:
    m = re.search(r'if \(key === "%s"\) return ([A-Z_]+);' % key, js)
    out.append("%s -> %s" % (key, m.group(0) if m else "NO"))
for name in ["WEB", "WEEK", "GOLD", "RIM", "THIRST", "ALIGN", "QUIET", "DUSK"]:
    m = re.search(r'const %s = "([^"]+)";' % name, js)
    out.append("%s -> %s" % (name, m.group(0) if m else "missing"))
for fn in ["weekPoint", "rimPoint", "goldPoint", "thirstPoint", "webPoint", "alignPoint", "duskPoint"]:
    i = js.find("function %s" % fn)
    out.append("=== %s @ %d ===" % (fn, i))
    if i > 0:
        chunk = js[i:i+500]
        out.append(chunk)
Path("_hush_pts.txt").write_text("\n".join(out), encoding="utf-8")
print("ok", len(out))
