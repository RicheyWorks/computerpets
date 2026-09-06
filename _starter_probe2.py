from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# find chicken_of_woods context
idx = js.find("chicken_of_woods")
print("idx", idx)
print(js[max(0,idx-200):idx+800])
print("====PUFF====")
idx2 = js.find("puffball")
print(js[max(0,idx2-200):idx2+600] if idx2>=0 else "no puffball")
