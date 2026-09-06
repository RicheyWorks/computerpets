import re, pathlib
js = pathlib.Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# find playFor
for m in re.finditer(r"playFor", js):
    if js[m.start():m.start()+20].startswith("playFor"):
        pass
idx = js.find("function playFor")
print("fn idx", idx)
print(js[idx:idx+2500] if idx>=0 else "no function playFor")
idx2 = js.find("exports.playFor")
print("exports", idx2)
print(js[idx2:idx2+500] if idx2>=0 else "")
# choir kind mapping
for pat in ["choir", "photovore", "case \"chord\"", "case 'chord'", '=== "chord"', "CHORD", "chordPoints", "blotter"]:
    print(pat, js.find(pat))
