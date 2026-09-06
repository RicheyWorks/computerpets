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

CJS_TESTS = Path("_click_cjs_tests.txt").read_text(encoding="utf-8")
MJS_TESTS = Path("_click_mjs_tests.txt").read_text(encoding="utf-8")

cjs, nl = load("desktop/renderer/window-play.test.cjs")
# generic sill pin currently uses click_beetle — move to robber_fly
cjs = must_replace(
    cjs,
    'const target = P.pickTarget([WIN], 80, "click_beetle", WORK, P.SPRITE);',
    'const target = P.pickTarget([WIN], 80, "robber_fly", WORK, P.SPRITE);',
    "cjs generic sill pin",
)
n = cjs.count('assert.equal(P.playFor("click_beetle"), "sill");')
print("cjs click_beetle sill", n)
cjs = replace_all(
    cjs,
    'assert.equal(P.playFor("click_beetle"), "sill");',
    'assert.equal(P.playFor("robber_fly"), "sill");',
    "cjs click_beetle sill pins",
    n,
)
marker = 'test("a moved window refits Snout\'s acorn-cup drill; sleep, card, and hide abort; Snout never starts asleep"'
idx = cjs.find(marker)
if idx < 0:
    marker = 'test("a moved window refits Snout\'s acorn-cup drill'
    idx = cjs.find(marker)
if idx < 0:
    raise SystemExit("MISSING snout refit test marker")
end = cjs.find("assert.equal(play.abort, true);\n});", idx)
if end < 0:
    raise SystemExit("MISSING snout refit end")
end = end + len("assert.equal(play.abort, true);\n});")
cjs = cjs[:end] + "\n" + CJS_TESTS + cjs[end:]
save("desktop/renderer/window-play.test.cjs", cjs, nl)
print("ok cjs")

mjs, mnl = load("web/scripts/window-play.test.mjs")
n = mjs.count('assert.equal(P.playFor("click_beetle"), "sill");')
print("mjs click_beetle sill", n)
if n:
    mjs = replace_all(
        mjs,
        'assert.equal(P.playFor("click_beetle"), "sill");',
        'assert.equal(P.playFor("robber_fly"), "sill");',
        "mjs click_beetle sill pins",
        n,
    )
demo = mjs.find('test("the demo window plate walks Snout')
search_from = demo if demo >= 0 else mjs.find('test("a moved window refits Snout')
if search_from < 0:
    raise SystemExit("MISSING mjs snout marker")
end = mjs.find('assert.equal(play.phase, "done");\n});', search_from)
if end < 0:
    end = mjs.find('assert.equal(play.abort, true);\n});', search_from)
    if end < 0:
        raise SystemExit("MISSING mjs snout end")
    end = end + len('assert.equal(play.abort, true);\n});')
else:
    end = end + len('assert.equal(play.phase, "done");\n});')
demo2 = mjs.find('test("the demo window plate walks Snout', end)
if demo2 >= 0:
    end2 = mjs.find('assert.equal(play.phase, "done");\n});', demo2)
    if end2 >= 0:
        end = end2 + len('assert.equal(play.phase, "done");\n});')
mjs = mjs[:end] + "\n" + MJS_TESTS + mjs[end:]
save("web/scripts/window-play.test.mjs", mjs, mnl)
print("ok mjs")
