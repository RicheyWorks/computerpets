from pathlib import Path
lines = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8").splitlines()
# print with numbers around 40046
for i in range(39990, 40060):
    if "spots" in lines[i] or "hole" in lines[i] or "refit" in lines[i] or "beforeX" in lines[i] or "shouldAbort" in lines[i]:
        print(f"{i+1}:{lines[i]}")
