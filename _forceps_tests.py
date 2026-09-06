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

CJS_TESTS = Path("_forceps_cjs_tests.txt").read_text(encoding="utf-8")
MJS_TESTS = Path("_forceps_mjs_tests.txt").read_text(encoding="utf-8")

cjs, nl = load("desktop/renderer/window-play.test.cjs")
# generic sill pin currently uses earwig — move to acorn_weevil
cjs = must_replace(
    cjs,
    'const target = P.pickTarget([WIN], 80, "earwig", WORK, P.SPRITE);',
    'const target = P.pickTarget([WIN], 80, "acorn_weevil", WORK, P.SPRITE);',
    "cjs generic sill pin",
)
n = cjs.count('assert.equal(P.playFor("earwig"), "sill");')
print("cjs earwig sill", n)
cjs = replace_all(
    cjs,
    'assert.equal(P.playFor("earwig"), "sill");',
    'assert.equal(P.playFor("acorn_weevil"), "sill");',
    "cjs earwig sill pins",
    n,
)
# Lace test still asserts earwig sill — already replaced by replace_all if it was there
# Insert after Lace refit abort test
marker = 'test("a moved window refits Lace\'s leaf-dish net; sleep, card, and hide abort; Lace never starts asleep"'
idx = cjs.find(marker)
if idx < 0:
    marker = 'test("a moved window refits Lace\'s leaf-dish net'
    idx = cjs.find(marker)
if idx < 0:
    raise SystemExit("MISSING lace refit test marker")
end = cjs.find("assert.equal(play.abort, true);\n});", idx)
if end < 0:
    raise SystemExit("MISSING lace refit end")
end = end + len("assert.equal(play.abort, true);\n});")
cjs = cjs[:end] + "\n" + CJS_TESTS + cjs[end:]
save("desktop/renderer/window-play.test.cjs", cjs, nl)
print("ok cjs")

mjs, mnl = load("web/scripts/window-play.test.mjs")
n = mjs.count('assert.equal(P.playFor("earwig"), "sill");')
print("mjs earwig sill", n)
if n:
    mjs = replace_all(
        mjs,
        'assert.equal(P.playFor("earwig"), "sill");',
        'assert.equal(P.playFor("acorn_weevil"), "sill");',
        "mjs earwig sill pins",
        n,
    )
marker = 'test("the demo window plate walks Lace net the same way"'
idx = mjs.find(marker)
if idx < 0:
    # lace mjs may not have that exact demo title — try leaf-dish abort or lace done
    for cand in [
        'test("a moved window refits Lace\'s leaf-dish net; sleep, card, and hide abort"',
        'test("Lace nets a window stool as a leaf dish',
    ]:
        idx = mjs.find(cand)
        if idx >= 0:
            marker = cand
            break
if idx < 0:
    raise SystemExit("MISSING mjs lace marker")
# Find end of the last lace-related test block starting at marker: prefer demo if present
demo = mjs.find('test("the demo window plate walks Lace')
start = demo if demo >= 0 else idx
# Walk to end of that test or the abort test
# Prefer inserting after the last Lace abort assertion
search_from = start
end = mjs.find('assert.equal(play.abort, true);\n});', search_from)
if end < 0:
    end = mjs.find('assert.equal(play.phase, "done");\n});', search_from)
    if end < 0:
        raise SystemExit("MISSING mjs lace end")
    end = end + len('assert.equal(play.phase, "done");\n});')
else:
    end = end + len('assert.equal(play.abort, true);\n});')
# If there is a demo after abort, append after demo instead
demo2 = mjs.find('test("the demo window plate walks Lace', end)
if demo2 >= 0:
    end2 = mjs.find('assert.equal(play.phase, "done");\n});', demo2)
    if end2 >= 0:
        end = end2 + len('assert.equal(play.phase, "done");\n});')
mjs = mjs[:end] + "\n" + MJS_TESTS + mjs[end:]
save("web/scripts/window-play.test.mjs", mjs, mnl)
print("ok mjs")
