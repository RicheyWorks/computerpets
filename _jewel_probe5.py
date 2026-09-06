from pathlib import Path
import re
for p in ["README.md","desktop/README.md"]:
    t=Path(p).read_text(encoding="utf-8")
    # find species-true window play paragraph
    m=re.search(r"Banner tails.*?Others walk a sill\.", t, re.S)
    if m:
        print(p, "HAS BANNER HEADER", len(m.group(0)))
        print(m.group(0)[-400:])
    else:
        # try shorter
        idx=t.find("Banner tails")
        print(p, "idx", idx)
        if idx<0:
            idx=t.find("Vault jumps")
            print("vault idx", idx)
            print(t[idx:idx+200] if idx>=0 else t[0:200])
# roadmap next leftover Jewel
road=Path("docs/ROADMAP.md").read_text(encoding="utf-8")
print("next Jewel count", road.count("Next leftover is Jewel"))
print("Do not start Jewel", road.count("Do not start Jewel"))
# house swallowtail sill context
house=Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
for m in re.finditer(r'.{80}playFor\("swallowtail"\), "sill".{40}', house):
    print("SILL CTX:", m.group(0).replace("\n"," "))
for m in re.finditer(r'.{60}playFor\("jewelwing"\), "sill".{40}', house):
    print("JEWEL CTX:", m.group(0).replace("\n"," "))
# end of banner asserts in house
idx=house.find('playFor("swallowtail"), "tails"')
print("BANNER ASSERT BLOCK:\n", house[idx-20:idx+900])
