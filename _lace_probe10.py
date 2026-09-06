from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# find streamjewel pick block
i = js.find('side: "streamjewel"')
print(js[i-350:i+280])
print("==== GO ====")
i = js.find('if (target.kind === BLACK)')
# second occurrence is goPhase
idx = 0
n = 0
while True:
    i = js.find('if (target.kind === BLACK)', idx)
    if i < 0: break
    n += 1
    print(n, js[i:i+280])
    print("---")
    idx = i + 1
print("==== exports ====")
i = js.find("    TAILS,\n    BLACK,\n    IGNORE")
print(js[i:i+80])
i = js.find("    blackOffPath,\n    pickTarget")
print(js[i:i+120])
# DUR black lines
i = js.find("blackOn:")
print(js[i:i+120])
# playFor end
i = js.find('if (key === "jewelwing") return BLACK;')
print(js[i:i+80])
# ts kind union
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
i = ts.find("typeof TAILS | typeof BLACK")
print("ts union", ts[i:i+80] if i>=0 else "no")
i = ts.find('| "black-off"')
print("ts phases", ts[i:i+60] if i>=0 else "no")
i = ts.find('| "streamjewel"')
print("ts side", ts[i:i+40] if i>=0 else "no")
i = ts.find('| "jewelled"')
print("ts leave", ts[i:i+40] if i>=0 else "no")
