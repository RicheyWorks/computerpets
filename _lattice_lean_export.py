from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# find return { exports
i = js.rfind("    WARTS,")
print(js[i-400:i+80])
print("--- LEAN in export block ---")
# last 800 of exports start
j = js.find("    CLING,")
# actually search near HOLLOW
k = js.find("    HOLLOW,")
print(js[k-200:k+80])
print("count LEAN,", js.count("    LEAN,"))
print("count COVER,", js.count("    COVER,"))
print("count KICK,", js.count("    KICK,"))
print("count HAWK,", js.count("    HAWK,"))
