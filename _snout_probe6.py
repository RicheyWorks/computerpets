from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
i = js.find("function seedPath")
print(js[i:i+900])
print("====BORE====")
i = js.find("function borePath")
print(js[i:i+900])
print("====HEADER====")
print(js[:600])
print("====README====")
r = Path("README.md").read_text(encoding="utf-8")
# find Forceps line in readme
j = r.find("Forceps cercis")
print(repr(r[j:j+450]))
