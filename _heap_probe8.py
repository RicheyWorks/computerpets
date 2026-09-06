js = open(r"desktop\renderer\window-play.js", encoding="utf-8").read().splitlines()
for name in ["function hopPoint", "function shutPoint", "function stampPoint", "function prowPoint", "function carryPoint"]:
    for i,l in enumerate(js):
        if name in l:
            print("---", name, i+1)
            for j in range(i, min(i+8, len(js))):
                print(js[j])
            break
# hop pick target
for i,l in enumerate(js):
    if "kind === SPRING" in l and "return" not in l:
        print("--- SPRING pick", i+1)
        for j in range(i, min(i+20, len(js))):
            print(js[j])
        break
