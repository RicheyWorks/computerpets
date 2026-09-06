from pathlib import Path
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
# extract from first Hush leftover test to end of that test file section (next big guest or EOF near end)
i = cjs.find('test("Hush leftover quiets')
print("start", i, "len", len(cjs))
# find sill pin for cyst/umbral
j = cjs.find("umbral")
# write the hush test block - from Hush leftover to maybe next test after hush's last
# Find all test(" after hush start until we hit something not hush-related for a while
chunk = cjs[i:]
# take until we see a non-hush test that's clearly another topic after hush block
# Better: find "Beacon leftover" or look at file end structure
# Actually hush is last guest - so from i to near exports or end
k = chunk.find('\ntest("')
# find last hush-related content: look for cyst in sill list
print("cyst in cjs", "cyst" in cjs)
print("paramecium", "paramecium" in cjs)
# sill guests list
si = cjs.find("sill guests")
if si<0: si = cjs.find("generic sill")
if si<0: si = cjs.find("playFor(\"cyst\")")
print("sill idx hints", si)
for needle in ["umbral\", \"sill\"", "playFor(\"umbral\")", "SILL leftover", "still walks a sill", "cyst", "paramecium", "magneton"]:
    print(needle, cjs.find(needle))
# write hush block to file for inspection
Path("_hush_cjs_block.txt").write_text(cjs[i:i+25000], encoding="utf-8")
print("wrote hush block", min(25000, len(cjs)-i))
# also find sill mapping test
for m_start in [cjs.find('test("species that still walk a sill'), cjs.find("still walk a sill"), cjs.find("generic-sill")]:
    print("sill test at", m_start)
