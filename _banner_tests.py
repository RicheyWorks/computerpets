from pathlib import Path

def load(p):
    raw = Path(p).read_bytes()
    nl = "\r\n" if b"\r\n" in raw else "\n"
    text = raw.decode("utf-8")
    if text.startswith("\ufeff"):
        text = text[1:]
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    return text, nl

def save(p, text, nl):
    if nl != "\n":
        text = text.replace("\n", nl)
    Path(p).write_bytes(text.encode("utf-8"))

def must_replace(text, old, new, label):
    if old not in text:
        raise SystemExit("MISSING: " + label)
    n = text.count(old)
    if n != 1:
        raise SystemExit("COUNT %s for %s" % (n, label))
    return text.replace(old, new, 1)

def replace_all(text, old, new, label, expect):
    n = text.count(old)
    if n != expect:
        raise SystemExit("COUNT %s want %s for %s" % (n, expect, label))
    return text.replace(old, new)

CJS_TESTS = Path(__file__).with_name("_banner_cjs_tests.txt").read_text(encoding="utf-8")
MJS_TESTS = Path(__file__).with_name("_banner_mjs_tests.txt").read_text(encoding="utf-8")

cjs, nl = load("desktop/renderer/window-play.test.cjs")
cjs = must_replace(
    cjs,
    'const target = P.pickTarget([WIN], 80, "swallowtail", WORK, P.SPRITE);',
    'const target = P.pickTarget([WIN], 80, "jewelwing", WORK, P.SPRITE);',
    "cjs generic sill pin",
)
n = cjs.count('assert.equal(P.playFor("swallowtail"), "sill");')
print("cjs swallowtail sill", n)
cjs = replace_all(
    cjs,
    'assert.equal(P.playFor("swallowtail"), "sill");',
    'assert.equal(P.playFor("jewelwing"), "sill");',
    "cjs swallowtail sill pins",
    n,
)
marker = 'test("a moved window refits Vault\'s grass-plate jump; sleep, card, and hide abort; Vault never starts asleep"'
idx = cjs.find(marker)
if idx < 0:
    raise SystemExit("MISSING vault refit test marker")
end = cjs.find("assert.equal(play.abort, true);\n});", idx)
if end < 0:
    raise SystemExit("MISSING vault refit end")
end = end + len("assert.equal(play.abort, true);\n});")
cjs = cjs[:end] + "\n" + CJS_TESTS + cjs[end:]
save("desktop/renderer/window-play.test.cjs", cjs, nl)
print("ok cjs")

mjs, mnl = load("web/scripts/window-play.test.mjs")
n = mjs.count('assert.equal(P.playFor("swallowtail"), "sill");')
print("mjs swallowtail sill", n)
if n:
    mjs = replace_all(
        mjs,
        'assert.equal(P.playFor("swallowtail"), "sill");',
        'assert.equal(P.playFor("jewelwing"), "sill");',
        "mjs swallowtail sill pins",
        n,
    )
marker = 'test("the demo window plate walks Vault jump the same way"'
idx = mjs.find(marker)
if idx < 0:
    raise SystemExit("MISSING mjs vault demo")
end = mjs.find('assert.equal(play.phase, "done");\n});', idx)
if end < 0:
    raise SystemExit("MISSING mjs vault demo end")
end = end + len('assert.equal(play.phase, "done");\n});')
mjs = mjs[:end] + "\n" + MJS_TESTS + mjs[end:]
save("web/scripts/window-play.test.mjs", mjs, mnl)
print("ok mjs")
