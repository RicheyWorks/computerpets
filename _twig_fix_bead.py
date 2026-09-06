from pathlib import Path
old = '[{ id: "bead", x: 200, y: 80, width: 180, height: 160 }]'
new = '[{ id: "bead", x: 200, y: 80, width: 180, height: 208 }]'
for path in ["desktop/renderer/window-play.test.cjs", "web/scripts/window-play.test.mjs", "_twig_tests.py"]:
    raw = Path(path).read_bytes()
    nl = "\r\n" if b"\r\n" in raw else "\n"
    text = raw.decode("utf-8")
    if text.startswith("\ufeff"):
        text = text[1:]
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    n = text.count(old)
    text = text.replace(old, new)
    if nl != "\n":
        text = text.replace("\n", nl)
    Path(path).write_bytes(text.encode("utf-8"))
    print(path, n)
