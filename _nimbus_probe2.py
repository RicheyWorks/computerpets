import pathlib
js = pathlib.Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
idx = js.find('if (key === "photovore")')
print(js[idx:idx+800])
print('---CONST---')
# find CHORD const
for name in ["CHORD","SILL","THIRST","PLAQUE","CLOUD","MIST","FOG","HAZE","PUFF","DUST","FLOAT","DRIFT","WAFT","BUOY","LOFT","VEIL","PLUME","BOWL","COLD","GAS"]:
    i = js.find(f"const {name}")
    if i < 0:
        i = js.find(f"{name} =")
    print(name, i, js[i:i+80].replace('\n',' ') if i>=0 else '')
print('---header---')
print(js[:3500])
