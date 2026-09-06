from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
i = js.find("function shouldAbort")
print(js[i:i+400])
print("====")
i = js.find("if (shouldAbort(life)")
# print longer chunk to see where black-off / tails-off are listed
chunk = js[i:i+3500]
print(chunk)
print("net-off in abort exempt?", "net-off" in chunk)
print("black-off in abort exempt?", "black-off" in chunk)
