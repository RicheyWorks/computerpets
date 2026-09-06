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

cjs, nl = load("desktop/renderer/window-play.test.cjs")
cjs = must_replace(
    cjs,
    '  assert.equal(P.playFor("gecko"), "chirp");\n  assert.equal(P.CHIRP, "chirp");\n  assert.equal(P.playFor("stick"), "freeze");',
    '  assert.equal(P.playFor("gecko"), "chirp");\n  assert.equal(P.playFor("stick"), "freeze");',
    "cjs drop P.CHIRP",
)
# also assert opossum still if we mention Grin
cjs = must_replace(
    cjs,
    '  assert.equal(P.playFor("leafcutter"), "snip");\n  assert.equal(P.playFor("grasshopper"), "sill");',
    '  assert.equal(P.playFor("leafcutter"), "snip");\n  assert.equal(P.playFor("opossum"), "still");\n  assert.equal(P.playFor("grasshopper"), "sill");',
    "cjs opossum still",
)
save("desktop/renderer/window-play.test.cjs", cjs, nl)
print("cjs fixed")

road, rnl = load("docs/ROADMAP.md")
road = must_replace(
    road,
    "Vein (`maidenhair`) still owns `unfurl`. Grin (`tuatara`) still owns `still`. Gecko (`gecko`) still owns `chirp`.",
    "Vein (`maidenhair`) still owns `unfurl`. Grin (`opossum`) still owns `still`. Gecko (`gecko`) still owns `chirp`.",
    "roadmap grin key",
)
save("docs/ROADMAP.md", road, rnl)
print("roadmap fixed")
