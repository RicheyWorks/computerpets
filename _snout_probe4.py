from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# seedPoint and cerciPoint and lidPoint
for name, start in [("seedPoint", js.find("function seedPoint")), ("borePoint", js.find("function borePoint")), ("lidPoint", js.find("function lidPoint")), ("cerciPoint", js.find("function cerciPoint")), ("cachePoint", js.find("function cachePoint"))]:
    print("====", name)
    print(js[start:start+450])
# api export list end - find CERCI in api
i = js.find("CERCI,")
print("====API CERCI====")
print(js[i-200:i+400])
# sill pins acorn
print("====playFor tail====")
i = js.find('if (key === "lacewing")')
print(js[i:i+350])
# size gates
i = js.find("if (kind === CERCI)")
print("====size====")
print(js[i:i+200])
