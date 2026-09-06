js = open(r"desktop\renderer\window-play.js", encoding="utf-8").read()
for needle in ["spines-off", "knobs-on", '"knobs"', "shouldAbort"]:
    print(needle, js.count(needle))

# find abort off-phase chain
i = js.find('next.phase !== "spines-off"')
print("spines-off abort", i)
if i>=0:
    print(js[i-100:i+200].replace("\n"," | "))

i = js.find('next.phase !== "knobs-off"')
print("knobs-off abort", i)

ts = open(r"web\\src\\lib\\pets\\window-play.ts", encoding="utf-8").read()
i = ts.find('next.phase !== "spines-off"')
print("TS spines-off abort", i)
i = ts.find("PlayPhase")
print("PlayPhase", i)
# print PlayPhase union around knobs
idx = ts.find('"knobs-on"')
print("TS phase union")
print(ts[idx-200:idx+400])
