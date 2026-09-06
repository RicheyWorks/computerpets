from pathlib import Path

def load(p):
    b = Path(p).read_bytes()
    crlf = b"\r\n" in b
    t = b.decode("utf-8").replace("\r\n", "\n")
    return t, crlf

def save(p, t, crlf):
    if crlf:
        t = t.replace("\n", "\r\n")
    Path(p).write_bytes(t.encode("utf-8"))

def once(t, old, new, label):
    n = t.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, found {n}\nOLD[:180]={old[:180]!r}")
    return t.replace(old, new, 1)

# global amphipod sill -> side
for p in [
    "desktop/renderer/window-play.test.cjs",
    "web/scripts/window-play.test.mjs",
    "desktop/renderer/leftover-house.test.cjs",
]:
    t, crlf = load(p)
    n = t.count('playFor("amphipod"), "sill"')
    if n < 1:
        raise SystemExit(f"{p}: no amphipod sill pins ({n})")
    t = t.replace('playFor("amphipod"), "sill"', 'playFor("amphipod"), "side"')
    save(p, t, crlf)
    print(p, "amphipod pins", n)

# leftover-house title + assertions
t, crlf = load("desktop/renderer/leftover-house.test.cjs")
t = once(
    t,
    "Thread leftover thrashes a glazing rebate as a soil film; ninth log leftover done; next leftover is Scud;",
    "Scud leftover sides a window well as a side pool; tenth log leftover done; log ten is closed; next leftover is Wave; Thread leftover still thrashes a glazing rebate as a soil film; ninth log leftover done;",
    "house title",
)
t = once(
    t,
    '''  assert.equal(WP.playFor("amphipod"), "side");
  assert.equal(WP.playFor("honeybee"), "sill");
});''',
    '''  assert.equal(WP.playFor("amphipod"), "side");
  assert.notEqual(WP.playFor("amphipod"), "scud");
  assert.notEqual(WP.playFor("amphipod"), "thrash");
  assert.notEqual(WP.playFor("amphipod"), "roll");
  assert.notEqual(WP.playFor("amphipod"), "go");
  assert.notEqual(WP.playFor("amphipod"), "sill");
  assert.equal(WP.playFor("nematode"), "thrash");
  assert.equal(WP.playFor("ferret"), "thread");
  assert.equal(WP.playFor("planarian"), "split");
  assert.equal(WP.playFor("tardigrade"), "dry");
  assert.equal(WP.playFor("pillbug"), "roll");
  assert.equal(WP.playFor("american_eel"), "go");
  assert.equal(WP.playFor("fiddler_crab"), "sill");
  assert.equal(WP.playFor("honeybee"), "sill");
});''',
    "house pins",
)
save("desktop/renderer/leftover-house.test.cjs", t, crlf)
print("leftover-house ok")
