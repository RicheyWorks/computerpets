import re
js=open("desktop/renderer/window-play.js",encoding="utf-8").read()
m=re.search(r"function songPath\(u\) \{[\s\S]*?\n  \}", js)
print(m.group(0) if m else "NO")
print("---")
# evaluate via node
open("_chirp_rot.js","w",encoding="utf-8").write("""
const P = require("./desktop/renderer/window-play.js");
const p = P.songPath(0.5);
console.log(JSON.stringify(p));
console.log("absrot", Math.abs(p.rot));
""")
