js=open("desktop/renderer/window-play.js",encoding="utf-8").read()
# frost path once (stool tell)
idx=js.find("function frostPath")
print("==== frostPath ====")
print(js[idx:idx+1400])
print("==== exports QUIET ====")
# module.exports / return object near end
for pat in ["quietPoint","QUIET,","quietOnPath","quietPath","quietHoldPath","quietOffPath","quietFace","quietLampDir"]:
    print(pat, [m.start() for m in __import__('re').finditer(pat, js)][-3:])
