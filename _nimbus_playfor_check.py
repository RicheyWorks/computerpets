import pathlib
js = pathlib.Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
i = js.find('if (key === "choir")')
print(repr(js[i:i+200]))
print("FLOAT const", 'const FLOAT = "float"' in js)
print("nimbus return FLOAT", 'key === "nimbus") return FLOAT' in js)
# quick require check
import subprocess
r = subprocess.run(["node", "-e", "const P=require('./desktop/renderer/window-play.js'); console.log(P.playFor('nimbus'), P.FLOAT, P.playFor('choir'), P.CHORD);"], capture_output=True, text=True)
print("stdout", r.stdout)
print("stderr", r.stderr[:500])
