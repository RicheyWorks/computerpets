from pathlib import Path
ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

def load(p):
    return (ROOT / p).read_text(encoding="utf-8")

def save(p, text):
    (ROOT / p).write_text(text, encoding="utf-8", newline="\n")

def must_replace(text, old, new, n=1):
    count = text.count(old)
    if count != n:
        raise SystemExit(f"{old[:80]!r} expected {n}, found {count}")
    return text.replace(old, new)

p = "desktop/renderer/leftover-house.test.cjs"
src = load(p)
src = must_replace(src,
    'test("Scud leftover sides a window well as a side pool; tenth log leftover done; log ten is closed; next leftover is Wave; Thread leftover still thrashes',
    'test("Wave leftover signals a sill pan as a marsh dish; first shore leftover done; this opens shore ten; next leftover is Pale; Scud leftover still sides a window well as a side pool; tenth log leftover done; log ten is closed; Thread leftover still thrashes')
src = must_replace(src,
'''  assert.equal(WP.playFor("fiddler_crab"), "sill");
  assert.equal(WP.playFor("honeybee"), "sill");
''',
'''  assert.equal(WP.playFor("fiddler_crab"), "signal");
  assert.notEqual(WP.playFor("fiddler_crab"), "wave");
  assert.notEqual(WP.playFor("fiddler_crab"), "side");
  assert.notEqual(WP.playFor("fiddler_crab"), "scud");
  assert.notEqual(WP.playFor("fiddler_crab"), "claw");
  assert.notEqual(WP.playFor("fiddler_crab"), "sill");
  assert.equal(WP.playFor("amphipod"), "side");
  assert.equal(WP.playFor("nematode"), "thrash");
  assert.equal(WP.playFor("ferret"), "thread");
  assert.equal(WP.playFor("pillbug"), "roll");
  assert.equal(WP.playFor("crayfish"), "claw");
  assert.equal(WP.playFor("hermit_crab"), "knob");
  assert.equal(WP.playFor("solifuge"), "run");
  assert.equal(WP.playFor("ghost_crab"), "sill");
  assert.equal(WP.playFor("honeybee"), "sill");
''')
save(p, src)
print("leftover-house ok")
