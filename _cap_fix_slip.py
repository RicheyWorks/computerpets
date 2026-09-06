from pathlib import Path

def patch(p, old, new, label):
    raw = Path(p).read_bytes()
    nl = "\r\n" if b"\r\n" in raw else "\n"
    text = raw.decode("utf-8")
    if text.startswith("\ufeff"):
        text = text[1:]
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    n = text.count(old)
    if n != 1:
        raise SystemExit("%s count=%s" % (label, n))
    text = text.replace(old, new, 1)
    if nl != "\n":
        text = text.replace("\n", nl)
    Path(p).write_bytes(text.encode("utf-8"))
    print("ok", label)

patch(
    "desktop/renderer/window-play.test.cjs",
    '  assert.equal(P.playFor("lamprey"), "ring");',
    '  assert.equal(P.playFor("caecilian"), "ring");',
    "cjs slip key",
)
patch(
    "desktop/renderer/leftover-house.test.cjs",
    '  assert.equal(WP.playFor("lamprey"), "ring");',
    '  assert.equal(WP.playFor("caecilian"), "ring");',
    "house slip key",
)
