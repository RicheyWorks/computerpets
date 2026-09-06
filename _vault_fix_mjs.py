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

MJS = Path("_vault_mjs_tests_p.txt").read_text(encoding="utf-8")

mjs, nl = load("web/scripts/window-play.test.mjs")
n = mjs.count('assert.equal(P.playFor("grasshopper"), "sill");')
print("mjs P grasshopper sill", n)
mjs = replace_all(
    mjs,
    'assert.equal(P.playFor("grasshopper"), "sill");',
    'assert.equal(P.playFor("swallowtail"), "sill");',
    "mjs grasshopper sill",
    n,
)

# Append after Blade demo test - find last occurrence of Blade leaf demo end
marker = 'test("the demo window plate walks Blade leaf the same way"'
idx = mjs.find(marker)
if idx < 0:
    raise SystemExit("MISSING blade demo")
# find end of file's last test - after this test's closing
# walk to matching }); at test end - use last assert in that test
end = mjs.find("\n});\n", idx)
# might be more content - find the closing of this specific test by searching for pattern near end
# Blade demo is last test - append at end of file
if not mjs.rstrip().endswith("});"):
    # find last });
    pass
# Better: append after the Blade demo test block ends
# Read from idx to find the test function end - count braces roughly via "});" after "Overlay"
pos = idx
last = None
while True:
    nxt = mjs.find("\n});\n", pos)
    if nxt < 0:
        nxt = mjs.find("\n});", pos)
        if nxt < 0:
            break
        last = nxt + len("\n});")
        break
    last = nxt + len("\n});\n")
    # check if next test follows
    rest = mjs[last:last+20]
    if rest.startswith("test(") or rest.strip().startswith("test("):
        pos = last
        continue
    break
if last is None:
    raise SystemExit("no end")
print("insert at", last, "tail", repr(mjs[last-20:last+20]))
mjs = mjs[:last] + "\n" + MJS + mjs[last:]
save("web/scripts/window-play.test.mjs", mjs, nl)
print("ok mjs fix")
