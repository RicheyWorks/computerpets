from pathlib import Path

def fix(path):
    p = Path(path)
    t = p.read_text(encoding="utf-8")
    n = t.count("P.ballPath")
    print(path, "P.ballPath", n)
    t = t.replace("P.ballPath", "P.ballCurlPath")
    n2 = t.count("Overlay.ballPath")
    print(path, "Overlay.ballPath", n2)
    t = t.replace("Overlay.ballPath", "Overlay.ballCurlPath")
    p.write_text(t, encoding="utf-8", newline="\n")
    print("fixed", path)

fix(r"desktop/renderer/window-play.test.cjs")
fix(r"web/scripts/window-play.test.mjs")
