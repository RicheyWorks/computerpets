from pathlib import Path
mjs = Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
idx = mjs.find('Overlay.playFor("lichen")')
print(repr(mjs[idx:idx+350]))
idx2 = mjs.find("Pact plaques")
chunk = mjs[idx2:idx2+900]
print("---chunk---")
print(chunk)
print("lichen pick count in pact chunk", chunk.count('80, "lichen"'), chunk.count('80, "photovore"'))
