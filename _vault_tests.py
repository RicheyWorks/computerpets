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

CJS_TESTS = Path(__file__).with_name("_vault_cjs_tests.txt").read_text(encoding="utf-8")
MJS_TESTS = Path(__file__).with_name("_vault_mjs_tests.txt").read_text(encoding="utf-8")

cjs, nl = load("desktop/renderer/window-play.test.cjs")
cjs = must_replace(
    cjs,
    'const target = P.pickTarget([WIN], 80, "grasshopper", WORK, P.SPRITE);',
    'const target = P.pickTarget([WIN], 80, "swallowtail", WORK, P.SPRITE);',
    "cjs generic sill pin",
)
n = cjs.count('assert.equal(P.playFor("grasshopper"), "sill");')
print("cjs grasshopper sill", n)
cjs = replace_all(
    cjs,
    'assert.equal(P.playFor("grasshopper"), "sill");',
    'assert.equal(P.playFor("swallowtail"), "sill");',
    "cjs grasshopper sill pins",
    n,
)
marker = 'test("a moved window refits Blade\'s leaf-rim still; sleep, card, and hide abort; Blade never starts asleep"'
idx = cjs.find(marker)
if idx < 0:
    raise SystemExit("MISSING blade refit test marker")
end = cjs.find("assert.equal(play.abort, true);\n});", idx)
if end < 0:
    raise SystemExit("MISSING blade refit end")
end = end + len("assert.equal(play.abort, true);\n});")
cjs = cjs[:end] + "\n" + CJS_TESTS + cjs[end:]
save("desktop/renderer/window-play.test.cjs", cjs, nl)
print("ok cjs")

mjs, mnl = load("web/scripts/window-play.test.mjs")
# pin
if 'pickTarget([WIN], 80, "grasshopper"' in mjs:
    mjs = must_replace(
        mjs,
        'const target = pickTarget([WIN], 80, "grasshopper", WORK, SPRITE);',
        'const target = pickTarget([WIN], 80, "swallowtail", WORK, SPRITE);',
        "mjs generic sill pin",
    )
n = mjs.count('assert.equal(playFor("grasshopper"), "sill");')
print("mjs grasshopper sill", n)
if n:
    mjs = replace_all(
        mjs,
        'assert.equal(playFor("grasshopper"), "sill");',
        'assert.equal(playFor("swallowtail"), "sill");',
        "mjs grasshopper sill pins",
        n,
    )
# imports
if "leafOffPath," in mjs and "jumpOffPath" not in mjs:
    mjs = must_replace(mjs, "leafOffPath,", "leafOffPath,\n  jumpPoint,\n  jumpOnPath,\n  jumpPath,\n  jumpHoldPath,\n  jumpOffPath,", "mjs import jump fns")
if "LEAF," in mjs and "JUMP," not in mjs:
    mjs = must_replace(mjs, "LEAF,", "LEAF,\n  JUMP,", "mjs import JUMP")

marker = 'test("a moved window refits Blade'
idx = mjs.find(marker)
if idx < 0:
    raise SystemExit("MISSING mjs blade refit")
end = mjs.find("assert.equal(play.abort, true);\n});", idx)
if end < 0:
    raise SystemExit("MISSING mjs blade refit end")
end = end + len("assert.equal(play.abort, true);\n});")
mjs = mjs[:end] + "\n" + MJS_TESTS + mjs[end:]
save("web/scripts/window-play.test.mjs", mjs, mnl)
print("ok mjs")
