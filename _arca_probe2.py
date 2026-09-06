js=open("desktop/renderer/window-play.js",encoding="utf-8").read()
# frostPoint (stool) vs quiet
for name in ["function frostPoint","function alignPoint","function manyPoint","function quietLampDir","function quietOnPath","function quietTell","function onceQuiet","quietOnce"]:
    i=js.find(name)
    print(name, i)

# extract frostPoint fully
idx=js.find("function frostPoint")
print("==== frostPoint ====")
print(js[idx:idx+800])
print("==== quiet rest after quietFace ====")
idx=js.find("function quietFace")
print(js[idx:idx+2500])
