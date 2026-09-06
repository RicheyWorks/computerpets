from pathlib import Path
js = Path(r"C:\Users\730ri\projects\ComputerPets\desktop\renderer\window-play.js").read_text(encoding="utf-8")
# find GOLD playFor
i = js.find('return GOLD')
print("GOLD returns:")
idx=0
while True:
    i = js.find("return GOLD", idx)
    if i<0: break
    print(repr(js[i-80:i+20].replace("\n"," | ")))
    idx=i+8
i = js.find('return WRAP')
print("WRAP:")
idx=0
n=0
while True:
    i = js.find("return WRAP", idx)
    if i<0: break
    n+=1
    print(repr(js[i-80:i+20].replace("\n"," | ")))
    idx=i+8
    if n>3: break
# goldPoint exists
print("goldPoint", "function goldPoint" in js)
print("js header milk", "Milk weeds a window-box" in js)
print("js playFor monarch", 'if (key === "monarch") return WEED;' in js)
print("js playFor honeybee", 'if (key === "honeybee") return WAGGLE;' in js)
