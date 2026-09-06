from pathlib import Path
t = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
idx = t.find("other guests do not clone")
print(t[idx:idx+350])