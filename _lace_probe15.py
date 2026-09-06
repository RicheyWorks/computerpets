from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# exports
for name in ["weekPath,", "weekPoint,", "mountPoint,", "netPoint,", "NET,", "weekOnPath"]:
    print(name, name in js)
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
i = cjs.find("const WIN =")
print(cjs[i:i+120])
# check module.exports includes net
i = js.find("netOffPath")
print("export area", js[i:i+80])
