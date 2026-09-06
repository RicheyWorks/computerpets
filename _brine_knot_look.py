from pathlib import Path
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
idx = cjs.find('test("Knot leftover manys')
print(cjs[idx:idx+1200])
