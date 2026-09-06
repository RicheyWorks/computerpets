from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# find lidPoint / seedPoint / borePoint / cup / latch / mast / auger / module.exports
for needle in ["function lidPoint", "function seedPoint", "function borePoint", "function cachePoint", "function cerciPoint", "function netPoint", "module.exports", "exports.", "playFor(", "CERCI", "const SILL"]:
    j = js.find(needle)
    print(needle, j)
# print playFor block
i = js.find("function playFor")
print("PLAYFOR", js[i:i+900])
print("====EXPORTS====")
i = js.rfind("module.exports")
print(js[i:i+2500])
