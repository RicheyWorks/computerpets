# -*- coding: utf-8 -*-
from pathlib import Path

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit("%s: expected 1, got %d\n%r" % (label, n, old[:180]))
    return text.replace(old, new, 1)

# Fix keys in cjs and mjs Arca tests
replacements = [
    ('P.playFor("starfish"), "reef"', 'P.playFor("sea_star"), "reef"'),
    ('P.playFor("mussel"), "drink"', 'P.playFor("leech"), "drink"'),
    ('P.playFor("slug"), "loop"', 'P.playFor("boa"), "loop"'),
]
for path in [Path("desktop/renderer/window-play.test.cjs"), Path("web/scripts/window-play.test.mjs")]:
    t = path.read_text(encoding="utf-8")
    for old, new in replacements:
        if old not in t:
            raise SystemExit("%s missing %s" % (path, old))
        t = t.replace(old, new)
    path.write_text(t, encoding="utf-8", newline="\n")
    print("fixed keys", path.name)

# House title + pins
path = Path("desktop/renderer/leftover-house.test.cjs")
t = path.read_text(encoding="utf-8")
lines = t.splitlines(True)
# line 19 is index 18
title = lines[18]
if not title.startswith('test("Hush leftover cools'):
    raise SystemExit("unexpected title: " + title[:80])
# rebuild title
inside = title[len('test("'):title.rfind('"')]
# prepend Arca close; change Hush cools -> Hush still cools; bump ninth phrasing
prefix = "Arca leftover waits a window stool as a damp blotter; tenth leftover of the far den done and closes far ten; "
# replace leading Hush leftover cools ... ninth ... done; with still form
old_hush = "Hush leftover cools a lamp-side pane as a lamp shadow; ninth leftover of the far den done; "
if not inside.startswith(old_hush):
    raise SystemExit("hush prefix mismatch: " + inside[:120])
rest = inside[len(old_hush):]
new_inside = prefix + "Hush leftover still cools a lamp-side pane as a lamp shadow; ninth leftover of the far den done; " + rest
new_inside = new_inside.replace("next leftover is Arca;", "next leftover is Boot;")
lines[18] = 'test("' + new_inside + '", () => {\n'
t = "".join(lines)
# pins
count = t.count('assert.equal(WP.playFor("cyst"), "sill");')
t = t.replace('assert.equal(WP.playFor("cyst"), "sill");', 'assert.equal(WP.playFor("paramecium"), "sill");')
print("house pins", count)
old = (
    '  assert.equal(WP.playFor("umbral"), "cool");\n'
    '  assert.equal(WP.COOL, "cool");\n'
)
new = (
    '  assert.equal(WP.playFor("umbral"), "cool");\n'
    '  assert.equal(WP.COOL, "cool");\n'
    '  assert.equal(WP.playFor("cyst"), "wait");\n'
    '  assert.equal(WP.WAIT, "wait");\n'
    '  assert.notEqual(WP.playFor("cyst"), "reef");\n'
    '  assert.notEqual(WP.playFor("cyst"), "drink");\n'
    '  assert.notEqual(WP.playFor("cyst"), "loop");\n'
    '  assert.notEqual(WP.playFor("cyst"), "emerge");\n'
    '  assert.notEqual(WP.playFor("cyst"), "cool");\n'
    '  assert.notEqual(WP.playFor("cyst"), "sill");\n'
    '  assert.equal(WP.playFor("paramecium"), "sill");\n'
)
t = once(t, old, new, "house arca kind")
path.write_text(t, encoding="utf-8", newline="\n")
print("house ok", "closes far ten" in t, "Arca leftover waits" in t)
