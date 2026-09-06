from pathlib import Path
js=Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
print("COOL", 'const COOL = "cool"' in js)
print("WAIT", 'const WAIT' in js)
hdr=js[js.find("ninth leftover"):js.find("*/")+2]
print("HDR:", hdr)
ts=Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
print("TS HDR end:", ts[ts.find("ninth leftover"):ts.find("*/")+2])
print("cyst sill cjs", Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8").count('playFor("cyst"), "sill"'))
print("Arca tests", Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8").count("Arca leftover"))
