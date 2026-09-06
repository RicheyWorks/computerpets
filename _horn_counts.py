from pathlib import Path
for p in ["desktop/renderer/window-play.test.cjs", "web/scripts/window-play.test.mjs", "desktop/renderer/leftover-house.test.cjs"]:
    t = Path(p).read_text(encoding="utf-8")
    print(p)
    print("  chanterelle sill", t.count('playFor("chanterelle"), "sill"'))
    print("  turkey_tail sill", t.count('playFor("turkey_tail"), "sill"'))
    print("  morel hollow", t.count('playFor("morel"), "hollow"'))
    print("  pick chanterelle", t.count('pickTarget([WIN], 80, "chanterelle"'))
    print("  next leftover is Horn", t.count("next leftover is Horn"))
