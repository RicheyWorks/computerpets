ts = open(r"web\\src\\lib\\pets\\window-play.ts", encoding="utf-8").read().splitlines()
print("=== consts")
for i,l in enumerate(ts):
    if i+1 >= 158 and i+1 <= 172:
        print(f"{i+1}:{l}")
print("=== playFor end")
for i,l in enumerate(ts):
    if i+1 >= 1670 and i+1 <= 1685:
        print(f"{i+1}:{l}")
print("=== size gate")
for i,l in enumerate(ts):
    if i+1 >= 2016 and i+1 <= 2028:
        print(f"{i+1}:{l}")

# ROADMAP knurl item start
rm = open(r"docs\ROADMAP.md", encoding="utf-8").read()
i = rm.find("- [x] Knurl")
print("=== ROADMAP Knurl item")
print(rm[i:i+2200][-800:] if i>=0 else "none")
print("--- start ---")
print(rm[i:i+400] if i>=0 else "none")
