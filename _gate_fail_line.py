from pathlib import Path
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8").splitlines()
for i in range(39610, 39640):
    print(f"{i+1}:{cjs[i]}")
