from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# DAUB pick block
i = js.find("if (kind === DAUB)")
print("DAUB pick:\n", js[i:i+700])
print("====")
i = js.find("if (kind === TEETH)")
# might be size gate first - find the one with side:
while i != -1 and 'side:' not in js[i:i+500]:
    i = js.find("if (kind === TEETH)", i+1)
print("TEETH pick:\n", js[i:i+700])
print("==== float point")
i = js.find("function floatPoint")
print(js[i:i+450])
