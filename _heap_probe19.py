ts = open(r"web\\src\\lib\\pets\\window-play.ts", encoding="utf-8").read().splitlines()
print("=== DUR")
for i,l in enumerate(ts):
    if i+1 >= 778 and i+1 <= 793:
        print(f"{i+1}:{l}")
print("=== pick KNOBS")
for i,l in enumerate(ts):
    if i+1 >= 4868 and i+1 <= 4900:
        print(f"{i+1}:{l}")
print("=== refit KNOBS")
for i,l in enumerate(ts):
    if i+1 >= 5640 and i+1 <= 5658:
        print(f"{i+1}:{l}")
print("=== begin KNOBS")
for i,l in enumerate(ts):
    if i+1 >= 17545 and i+1 <= 17562:
        print(f"{i+1}:{l}")
print("=== tick knobs")
for i,l in enumerate(ts):
    if i+1 >= 26470 and i+1 <= 26550:
        print(f"{i+1}:{l}")
