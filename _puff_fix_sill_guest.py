from pathlib import Path
p = Path("desktop/renderer/window-play.test.cjs")
t = p.read_text(encoding="utf-8")
# show the failing test
idx = t.find('other guests do not clone Rui')
print(t[idx:idx+900])
print("====")
# also mjs
p2 = Path("web/scripts/window-play.test.mjs")
t2 = p2.read_text(encoding="utf-8")
idx2 = t2.find('other guests do not clone Rui')
if idx2>=0:
  print(t2[idx2:idx2+700])
