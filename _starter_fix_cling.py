from pathlib import Path
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
i = cjs.find("other guests do not clone Rui")
print(repr(cjs[i:i+220]))
# force replace yeast->lichen in that one test only
old = 'they walk a sill and hop down", () => {\n  const target = P.pickTarget([WIN], 80, "yeast", WORK, P.SPRITE);'
new = 'they walk a sill and hop down", () => {\n  const target = P.pickTarget([WIN], 80, "lichen", WORK, P.SPRITE);'
print("cjs old count", cjs.count(old))
cjs = cjs.replace(old, new)
Path("desktop/renderer/window-play.test.cjs").write_text(cjs, encoding="utf-8", newline="\n")
mjs = Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
print("mjs old count", mjs.count(old))
# mjs may differ
i = mjs.find("other guests do not clone Rui")
print("mjs ctx", repr(mjs[i:i+220]) if i>=0 else "missing")
mjs = mjs.replace(old, new)
# try alternate
old2 = 'pickTarget([WIN], 80, "yeast", WORK, P.SPRITE)'
# only replace first occurrence after cling title if still present
if 'pickTarget([WIN], 80, "yeast"' in mjs[i:i+300]:
    mjs = mjs[:i] + mjs[i:i+300].replace('pickTarget([WIN], 80, "yeast", WORK, P.SPRITE)', 'pickTarget([WIN], 80, "lichen", WORK, P.SPRITE)', 1) + mjs[i+300:]
Path("web/scripts/window-play.test.mjs").write_text(mjs, encoding="utf-8", newline="\n")
print("done", Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8").count('hop down", () => {\n  const target = P.pickTarget([WIN], 80, "lichen"'))
