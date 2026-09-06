ts = open(r"web\src\lib\pets\window-play.ts", encoding="utf-8").read().splitlines()
for i,l in enumerate(ts):
    if i+1 >= 16990 and i+1 <= 17020:
        print(f"{i+1}:{l}")
print("--- tick sill-hop nearby")
for i,l in enumerate(ts):
    if i+1 >= 26535 and i+1 <= 26545:
        print(f"{i+1}:{l}")
