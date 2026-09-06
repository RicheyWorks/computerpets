js=open("desktop/renderer/window-play.js",encoding="utf-8").read()
i=js.find('if (next.phase === "trumpet-off")')
print(repr(js[i:i+900]))
