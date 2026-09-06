from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# DUR flip block
idx = js.find("flipOn:")
print(js[idx:idx+120])
idx = js.find("jumpOn:")
print(js[idx:idx+120])
idx = js.find("snapOn:")
print(js[idx:idx+120])
# exports flipRollPath
print("flipRollPath export", "flipRollPath," in js)
print("jumpPath export", "jumpPath," in js)
# snout tests used snap as Snap - check forceps/snout forbidden lists for Snap
cjs=Path("_snout_cjs_tests.txt").read_text(encoding="utf-8")
print("snout mentions snap", "snap" in cjs.lower())
# vault DUR names
