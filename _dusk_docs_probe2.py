from pathlib import Path
rm = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
print("next Dusk count", rm.count("Next leftover is Dusk"))
print("next leftover is Dusk count", rm.count("next leftover is Dusk"))
print("Do not start Dusk", rm.count("Do not start Dusk"))
i = rm.find("Next leftover is Dusk")
print("i", i)
if i>=0:
    print(repr(rm[i:i+160]))
i2 = rm.find("next leftover is Dusk")
print("i2", i2)
if i2>=0:
    print(repr(rm[i2:i2+120]))
# shard entry end
i3 = rm.find("Shard (`silica`")
print("shard entry tail", repr(rm[i3:i3+900][-200:]))