from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# all HOLE pick occurrences
idx = 0
while True:
    i = js.find("kind === HOLE", idx)
    if i < 0: break
    print("---", i, repr(js[i-80:i+200]))
    idx = i+1
# spotted leave contexts
idx = 0
while True:
    i = js.find('leave: "spotted"', idx)
    if i < 0: break
    print("SPOTTED", i, repr(js[i:i+150]))
    idx = i+1
