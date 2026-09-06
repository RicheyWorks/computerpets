from pathlib import Path
lines = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8").splitlines()
for i in range(35795, 35840):
    print(f"{i+1}:{lines[i]}")
