from pathlib import Path
lines = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8").splitlines()
for n in range(39810, 39840):
  print(f"{n+1}: {lines[n]}")
