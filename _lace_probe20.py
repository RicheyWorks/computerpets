from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
i = js.find("function shouldAbort")
print(js[i:i+700])
# jewel abort test - does it use cmd card the same way?
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
i = cjs.find("refits Jewel's stream-jewel black")
print("==== jewel card section ====")
print(cjs[i:i+1200])
