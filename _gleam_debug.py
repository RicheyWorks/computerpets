from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
i = js.find('key === "photovore"')
print("photovore playFor ctx:", repr(js[i-80:i+80]))
i = js.find('key === "lichen"')
print("lichen ctx:", repr(js[i-40:i+120]))
# how tests load module
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
print(cjs[:500])
print("--- line 1115 area ---")
print("\n".join(f"{i+1110}:{l}" for i,l in enumerate(cjs.splitlines()[1110:1145])))
print("--- gleam fail line 34919 ---")
print("\n".join(f"{i+34910}:{l}" for i,l in enumerate(cjs.splitlines()[34910:34925])))
