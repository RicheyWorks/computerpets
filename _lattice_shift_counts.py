from pathlib import Path
for p in ["desktop/renderer/window-play.test.cjs","web/scripts/window-play.test.mjs"]:
    t = Path(p).read_text(encoding="utf-8")
    print(p)
    print("  pickTarget morel", t.count('pickTarget([WIN], 80, "morel"'))
    print("  pickTarget morel 200", t.count('pickTarget([WIN], 200, "morel"'))
    print("  playFor morel sill", t.count('playFor("morel"), "sill"'))
    print("  Overlay morel", t.count('Overlay.playFor("morel")'))
