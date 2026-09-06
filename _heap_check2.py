cjs = open(r"desktop\renderer\window-play.test.cjs", encoding="utf-8").read().splitlines()
for i,l in enumerate(cjs):
    if 'playFor("lugworm"), "sill"' in l:
        print(f"{i+1}:{l}")
        for j in range(max(0,i-3), min(len(cjs), i+3)):
            print(f"  {j+1}:{cjs[j][:160]}")
