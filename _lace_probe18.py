from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# find abort / shouldAbort / card in stepPlay
for needle in ["abort", "card", "hide", "asleep", "shouldLeave"]:
    print(needle, js.count(needle))
# find function that checks cmd
i = js.find("function stepPlay")
print(js[i:i+800])
