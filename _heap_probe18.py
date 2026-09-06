cjs = open(r"desktop\renderer\window-play.test.cjs", encoding="utf-8").read()
print("Knurl in first 50k", "Knurl" in cjs[:50000])
print("ninth shore leftover in cjs", cjs.count("ninth shore leftover"))
print("This is the ninth" in cjs[:2000])
# first 500 of file
print(cjs[:400])
print("---")
# leftover-house title start
house = open(r"desktop\renderer\leftover-house.test.cjs", encoding="utf-8").read()
print(house[house.find('test("'):house.find('test("')+180])

# TS knobs functions
ts = open(r"web\\src\\lib\\pets\\window-play.ts", encoding="utf-8").read().splitlines()
print("=== TS knobs funcs")
for i,l in enumerate(ts):
    if i+1 >= 16933 and i+1 <= 17000:
        print(f"{i+1}:{l}")
