from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
for label, blob in [("js", js), ("ts", ts)]:
    i = blob.find('leave: "froze"')
    print("===", label, "pick after froze ===")
    print(repr(blob[i:i+280]))
    i = blob.find('freezeOffPath')
    print("===", label, "api freezeOff ===")
    print(repr(blob[i:i+120]))
    # approach freeze-on
    i = blob.find('return goPhase(next, "freeze-on"')
    print("===", label, "approach ===")
    print(repr(blob[i-80:i+200]))
