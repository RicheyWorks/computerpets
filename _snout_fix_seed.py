from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
i = js.find("if (kind === SEED)")
print(js[i:i+200])
i = js.find("if (kind === BORE)")
print("BORE", js[i:i+200])
# Forceps used width 200 height 120 for claw - for oak seed need real gate
# Also check forceps seedOk in original - they didn't have seedOk
# Fix: use a larger window for seedOk like Forceps used for pray
