import pathlib, re
js = pathlib.Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")

# pickTarget chord branch
for needle in ["CHORD", "chord", "photovore", "nimbus", "sillPoint", "function pickTarget", "function durationFor", "function refitTarget"]:
    print(needle, [m.start() for m in re.finditer(re.escape(needle), js)][:8])

# extract pickTarget section around CHORD
idx = js.find("function pickTarget")
print("\n=== pickTarget head ===")
print(js[idx:idx+2000])
