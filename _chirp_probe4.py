import re
js=open("desktop/renderer/window-play.js",encoding="utf-8").read()
for name in ["buryPoint","plowPoint","sandPoint","castingsPoint","wagglePoint","signalPoint"]:
    m=re.search(rf"function {name}\([\s\S]*?\n  \}}", js)
    if m:
        print("====",name)
        print(m.group(0)[:450])
        print()
# also stool-related sides
for m in re.finditer(r'side: "([^"]+)"', js):
    pass
sides=sorted(set(re.findall(r'side: "([^"]+)"', js)))
print("sides sample", [s for s in sides if "grass" in s or "stool" in s or "dish" in s or "paper" in s or "blot" in s or "sand" in s or "oak" in s][:40])
print("all stoolish", [s for s in sides if any(x in s for x in ("stool","dish","tray","pan","grass","paper","night","blot"))])
