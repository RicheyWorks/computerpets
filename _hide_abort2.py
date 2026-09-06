from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# find all shouldAbort
idx = 0
while True:
    i = js.find("shouldAbort", idx)
    if i < 0: break
    print(i, repr(js[max(0,i-40):i+120]).replace("\\n"," / "))
    idx = i+1
    if idx > 500000 and i > 500000:
        # only first few and near end
        pass
