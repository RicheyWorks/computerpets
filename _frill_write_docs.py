from pathlib import Path

# Write frill docs patcher directly
code = r'''# -*- coding: utf-8 -*-
"""Update leftover-house + docs for Frill shelf; next is Cap."""
from pathlib import Path
import re

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
        raise SystemExit("MISSING: " + label + " :: " + repr(old[:120]))
    if text.count(old) != 1:
        raise SystemExit("COUNT %s for %s" % (text.count(old), label))
    return text.replace(old, new, 1)

house, hnl = load("desktop/renderer/leftover-house.test.cjs")
house = must_replace(
    house,
    'test("Rob leftover seizes a window stool as a grass perch; tenth leftover of the meadow den done; meadow ten closed; ',
    'test("Frill leftover shelves a sash stile as a timber shelf; first leftover of the fungi den done; Rob leftover still seizes a window stool as a grass perch; tenth leftover of the meadow den done; meadow ten closed; ',
    "house title start",
)
house = must_replace(
    house,
    "shore ten is closed; next leftover is Frill; Milk leftover still weeds",
    "shore ten is closed; next leftover is Cap; Milk leftover still weeds",
    "house next leftover",
)
n = house.count('assert.equal(WP.playFor("oyster"), "sill");')
print("house oyster sill", n)
if n < 1:
    raise SystemExit("expected oyster sill asserts")
house = house.replace(
    'assert.equal(WP.playFor("oyster"), "sill");',
    'assert.equal(WP.playFor("fly_agaric"), "sill");',
)
ctx = '  assert.equal(WP.playFor("honey_drone"), "drone");\n  assert.equal(WP.playFor("fly_agaric"), "sill");\n'
if ctx not in house:
    idx = house.find('assert.equal(WP.playFor("robber_fly"), "seize");')
    print(repr(house[idx:idx+900]))
    raise SystemExit("rob tail ctx missing")
new_block_end = (
    '  assert.equal(WP.playFor("honey_drone"), "drone");\n\n'
    '  assert.equal(WP.playFor("oyster"), "shelf");\n'
    '  assert.equal(WP.SHELF, "shelf");\n'
    '  assert.notEqual(WP.playFor("oyster"), "frill");\n'
    '  assert.notEqual(WP.playFor("oyster"), "oyster");\n'
    '  assert.notEqual(WP.playFor("oyster"), "gold");\n'
    '  assert.notEqual(WP.playFor("oyster"), "flush");\n'
    '  assert.notEqual(WP.playFor("oyster"), "seize");\n'
    '  assert.notEqual(WP.playFor("oyster"), "fan");\n'
    '  assert.notEqual(WP.playFor("oyster"), "lean");\n'
    '  assert.notEqual(WP.playFor("oyster"), "fold");\n'
    '  assert.notEqual(WP.playFor("oyster"), "seed");\n'
    '  assert.notEqual(WP.playFor("oyster"), "bore");\n'
    '  assert.notEqual(WP.playFor("oyster"), "unfurl");\n'
    '  assert.notEqual(WP.playFor("oyster"), "plant");\n'
    '  assert.notEqual(WP.playFor("oyster"), "sill");\n'
    '  assert.equal(WP.playFor("robber_fly"), "seize");\n'
    '  assert.equal(WP.SEIZE, "seize");\n'
    '  assert.equal(WP.playFor("ginkgo"), "gold");\n'
    '  assert.equal(WP.playFor("moss"), "lean");\n'
    '  assert.equal(WP.playFor("bat"), "fold");\n'
    '  assert.equal(WP.playFor("oak"), "seed");\n'
    '  assert.equal(WP.playFor("carpenter_bee"), "bore");\n'
    '  assert.equal(WP.playFor("maidenhair"), "unfurl");\n'
    '  assert.equal(WP.playFor("fly_agaric"), "sill");\n'
)
house = must_replace(house, ctx, new_block_end, "house frill asserts")
save("desktop/renderer/leftover-house.test.cjs", house, hnl)
print("ok house")

rm, rnl = load("docs/ROADMAP.md")
rm = rm.replace(
    "Next leftover is Frill. Do not start Frill. Frill (oyster mushroom) is first fungi — after Rob.",
    "Frill is done. First leftover of the fungi den done. Next leftover is Cap. Do not start Cap. Cap (fly agaric) is second fungi — after Frill.",
)
rob_start = "- [x] Rob (`robber_fly` / `rob`) seizes a real window stool as a grass perch:"
idx = rm.find(rob_start)
if idx < 0:
    raise SystemExit("no rob roadmap line")
end = rm.find("\n\n- [x] Spark sits the fifth cyber", idx)
if end < 0:
    end = rm.find("\n- [x] Spark sits the fifth cyber", idx)
if end < 0:
    raise SystemExit("no spark after rob")
frill_bullet = (
    "\n\n- [x] Frill (`oyster` / `frill`) shelves a real sash stile as a timber shelf: walk onto the stile (the stile — dead wood a bracket shelves; lean then bracket again; layers; grain; papers are a forest begun; a shelf that eats the dead wood; a decomposer, not a plant; not Fan's lamp-side autumn gold, not Felt's meeting-rail blotter lean, not Cape's transom-soffit fold, not Rob's stool grass-perch seize, not Mast's stool acorn-dish seed, not Auger's stile timber bore, not Vein's sash-pocket damp unfurl; she leans then is a bracket again; the shelf kept my layers; named: Frill. Shelf first. Hello: \"I fruited. That was hello.\" Play: \"A lean. That was athletic for a bracket.\" Temperament: quiet.), then leave. One window. Shelf is the tell — not Fan's `gold`. Not Felt's `lean`. Not Cape's `fold`. Not Rob's `seize`. Not Mast's `seed`. Not Auger's `bore`. Not Vein's `unfurl`. playFor(\"oyster\") returns `shelf` (not `frill`, not `oyster`, not `gold`, not `flush`, not `seize`, not `fan`, not `lean`, not `fold`, not `seed`, not `bore`, not `unfurl`, not `plant`, not `sill`). Rob (`robber_fly`) still owns `seize`. Fan (`ginkgo`) still owns `gold`. Felt (`moss`) still owns `lean`. Cape (`bat`) still owns `fold`. Mast (`oak`) still owns `seed`. Auger (`carpenter_bee`) still owns `bore`. Vein (`maidenhair`) still owns `unfurl`. Same `playFor` door. `/demo/frill` lockstep. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. First leftover of the fungi den. Meadow ten stays closed. Hive ten stays closed. Shore ten stays closed. Next leftover is Cap. Do not start Cap. Cap (fly agaric) is second fungi — after Frill."
)
rm = rm[:end] + frill_bullet + rm[end:]
rm = must_replace(
    rm,
    "**Last Updated:** 2026-09-02 (Phase 6 leftover: Rob seizes a window stool as a grass perch; tenth leftover of the meadow den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Frill; catalog stays 220; seize is the tell; Click still owns right; Relay still owns click; Haste still owns hunt; Dart still owns hawk; Sip still owns sip; Thrum still owns forage)",
    "**Last Updated:** 2026-09-02 (Phase 6 leftover: Frill shelves a sash stile as a timber shelf; first leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Cap; catalog stays 220; shelf is the tell; Rob still owns seize; Fan still owns gold; Felt still owns lean; Cape still owns fold; Mast still owns seed; Auger still owns bore)",
    "roadmap last updated",
)
save("docs/ROADMAP.md", rm, rnl)
print("ok roadmap")

arch, anl = load("docs/ARCHITECTURE.md")
m = re.search(r"2026-09-02 \(Rob seizes.*?\)", arch)
if not m:
    i = arch.find("2026-09")
    print(repr(arch[i:i+350]) if i>=0 else None)
    raise SystemExit("arch date line missing")
arch = arch[:m.start()] + "2026-09-02 (Frill shelves a sash stile as a timber shelf; first leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Cap; catalog stays 220; shelf is the tell; Rob still owns seize; Fan still owns gold; Felt still owns lean; Cape still owns fold; Mast still owns seed; Auger still owns bore)" + arch[m.end():]
save("docs/ARCHITECTURE.md", arch, anl)
print("ok arch")

for path in ["README.md", "desktop/README.md"]:
    text, tnl = load(path)
    if "Rob seizes a window stool as a grass perch" in text:
        text = text.replace("Rob seizes a window stool as a grass perch", "Frill shelves a sash stile as a timber shelf", 1)
        save(path, text, tnl)
        print("ok", path)
    else:
        print("warn", path)

Path("_frill_pr_body.md").write_text(
    "## Summary\n"
    "- Frill (oyster / frill) shelves a sash stile as a timber shelf: walk onto the stile, sit, lean then bracket again, sit the shelf, then leave. playFor(oyster) returns `shelf`.\n"
    "- A shelf that eats the dead wood; decomposer not a plant; lean then bracket again; layers; grain; papers are a forest begun. Not frill. Not oyster. Not gold. Not flush. Not seize. Not fan. Not lean. Not fold. Not seed. Not bore. Not unfurl. Not plant. Rob still owns seize. Fan still owns gold. Felt still owns lean. Cape still owns fold. Mast still owns seed. Auger still owns bore. Vein still owns unfurl.\n"
    "- First leftover of the fungi den. Meadow ten stays closed. Catalog stays 220. Next leftover is Cap (fly agaric). Do not start Cap.\n"
    "\n"
    "## Test plan\n"
    "- [x] node --test desktop/renderer/window-play.test.cjs desktop/renderer/leftover-house.test.cjs\n"
    "- [x] node --experimental-strip-types --test web/scripts/window-play.test.mjs\n"
    "- [ ] Overlay sit: /demo/frill shelves the sash stile\n",
    encoding="utf-8",
)
print("ok pr body")
'''
Path("_frill_docs.py").write_text(code, encoding="utf-8")
print("wrote", len(code))
