from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
print("JS already has WAIT?", 'const WAIT = "wait"' in js)
print("JS cyst?", 'cyst") return WAIT' in js)
print("TS has WAIT?", 'WAIT' in ts and 'wait"' in ts)
# find cool size in ts
for i,l in enumerate(ts.splitlines(),1):
    if "COOL" in l and ("width" in l or "height" in l or "kind ===" in l):
        print(f"ts{i}:{l}")
    if "cool" in l and "width >=" in l:
        print(f"ts{i}:{l}")
# show size filter area
idx=ts.find("kind === COOL")
print("idx", idx)
print(repr(ts[idx:idx+200]))
