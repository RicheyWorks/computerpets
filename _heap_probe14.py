cjs = open(r"desktop\renderer\window-play.test.cjs", encoding="utf-8").read().splitlines()
print("--- around 1116")
for i in range(1095, 1135):
    print(f"{i+1}:{cjs[i][:180]}")
print("--- first test name start")
print(cjs[12][-400:])
print("--- 29400")
for i in range(29390, 29420):
    print(f"{i+1}:{cjs[i][:180]}")
