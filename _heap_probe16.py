js = open(r"desktop\renderer\window-play.js", encoding="utf-8").read()
# find knobs-off abort contexts
idx = 0
n = 0
while True:
    i = js.find("knobs-off", idx)
    if i < 0: break
    n += 1
    print("JS", n, "at", i)
    print(js[max(0,i-80):i+80].replace("\n"," | "))
    idx = i+1
print("count", n)

ts = open(r"web\\src\\lib\\pets\\window-play.ts", encoding="utf-8").read()
idx = 0
n = 0
while True:
    i = ts.find("knobs-off", idx)
    if i < 0: break
    n += 1
    print("TS", n, "at", i)
    print(ts[max(0,i-80):i+80].replace("\n"," | "))
    idx = i+1
print("TScount", n)

# header end
print("HEADER JS END")
print(js[js.find("This is the ninth shore leftover"):js.find("This is the ninth shore leftover")+250])
print("HEADER TS END")
print(ts[ts.find("This is the ninth shore leftover"):ts.find("This is the ninth shore leftover")+250])
