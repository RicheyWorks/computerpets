import re
for p in [r"README.md", r"desktop\README.md"]:
    text = open(p, encoding="utf-8").read()
    idx = text.find("Knurl")
    print("====", p, "Knurl idx", idx)
    if idx>=0:
        print(text[idx:idx+800])
        print("====END")
    # last leftover mention
    for name in ["Knurl knobs", "Heap", "ninth shore", "next leftover"]:
        i = text.find(name)
        print(name, i)

arch = open(r"docs\ARCHITECTURE.md", encoding="utf-8").read()
idx = arch.find("Knurl knobs")
print("==== ARCH Knurl")
print(arch[idx:idx+900] if idx>=0 else "none")

# also leftover-house first test playFor lugworm elsewhere
cjs = open(r"desktop\renderer\window-play.test.cjs", encoding="utf-8").read()
print("lugworm count", cjs.count("lugworm"))
print("Knurl knobs a window", cjs.count("Knurl knobs a window"))

mjs = open(r"web\scripts\window-play.test.mjs", encoding="utf-8").read()
print("mjs lugworm", mjs.count("lugworm"))
print("mjs Knurl", mjs.count("Knurl knobs a window"))
print("mjs total lines", mjs.count("\n")+1)
