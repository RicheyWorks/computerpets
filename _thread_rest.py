from pathlib import Path
ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

HEADER_OLD = (
    "Half splits a meeting-rail underside as a stream stone: walk onto the underside, sit the split (she halves), then leave. "
    "Tun still owns dry. Hop still owns spring. This is the eighth log leftover."
)
HEADER_NEW = (
    HEADER_OLD
    + " Thread thrashes a glazing rebate as a soil film: walk into the rebate, thrash the round, then leave. "
    + "Wick still owns thread. Half still owns split. Tun still owns dry. This is the ninth log leftover."
)

def sub_once(path, old, new, label):
    p = ROOT / path
    text = p.read_text(encoding="utf-8")
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{path} {label}: expected 1, found {n}\nOLD: {old[:160]!r}")
    p.write_text(text.replace(old, new, 1), encoding="utf-8")
    print("ok", path, label)

def sub_all(path, old, new, label):
    p = ROOT / path
    text = p.read_text(encoding="utf-8")
    n = text.count(old)
    if n == 0:
        raise SystemExit(f"{path} {label}: found 0")
    p.write_text(text.replace(old, new), encoding="utf-8")
    print("ok", path, label, n)

for path in ["README.md", "desktop/README.md"]:
    sub_once(path, HEADER_OLD, HEADER_NEW, "header")

sub_once(
    "docs/ARCHITECTURE.md",
    "| **Last Updated** | 2026-09-01 (Half splits a meeting-rail underside as a stream stone; eighth log leftover done; next leftover is Thread; catalog stays 220; split is the half tell; Tun still owns dry; Hop still owns spring; Jet still owns velvet; Felt still owns lean; Latch still owns drink) |",
    "| **Last Updated** | 2026-09-01 (Thread thrashes a glazing rebate as a soil film; ninth log leftover done; next leftover is Scud; catalog stays 220; thrash is the round tell; Wick still owns thread; Half still owns split; Tun still owns dry; Hop still owns spring; Cast still owns band) |",
    "updated",
)

THREAD_ROADMAP = (
    '- [x] Thread (`nematode` / `thread`) thrashes a real window glazing rebate as a soil film: walk into the rebate (the film — the same furniture family Dew curls as a peat saucer, not Dew\'s curl, not Tun\'s pane moss film, not Half\'s meeting-rail-underside split, not Wick\'s sash-sill thread, not Cast\'s window-stool band), thrash the round (the tell — a roundworm; she thrashes; C. elegans; not Cast; not an earthworm you dig; named: Thread. The round is the tell. Ambient: "I sit. Then I thrash. Then I sit." Temperament: threading.), then leave. One window. The thrash is the tell — not Dew\'s `curl`. Not Tun\'s `dry`. Not Half\'s `split`. Not Wick\'s `thread`. Not Cast\'s `band`. playFor("nematode") returns `thrash` (not `thread`, not `split`, not `dry`, not `sill`). Wick (`ferret`) still owns `thread`. Half (`planarian`) still owns `split`. Tun (`tardigrade`) still owns `dry`. Hop (`springtail`) still owns `spring`. Cast (`earthworm`) still owns `band`. Dew (`sundew`) still owns `curl`. Same `playFor` door. `/demo/thread` lockstep. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. Ninth log leftover. Next leftover is Scud. Do not start Scud.\n'
)

sub_once(
    "docs/ROADMAP.md",
    "Catalog stays 220. Eighth log leftover. Next leftover is Thread. Do not start Thread.\n- [x] Tun (`tardigrade`",
    "Catalog stays 220. Eighth log leftover. Thread is done. Ninth log leftover done. Next leftover is Scud. Do not start Scud.\n"
    + THREAD_ROADMAP
    + "- [x] Tun (`tardigrade`",
    "insert Thread item",
)

sub_all(
    "docs/ROADMAP.md",
    "Next leftover is Thread. Do not start Thread.",
    "Thread is done. Ninth log leftover done. Next leftover is Scud. Do not start Scud.",
    "next leftover",
)

sub_once(
    "desktop/renderer/leftover-house.test.cjs",
    'test("Half leftover splits a meeting-rail underside as a stream stone; eighth log leftover done; next leftover is Thread;',
    'test("Thread leftover thrashes a glazing rebate as a soil film; ninth log leftover done; next leftover is Scud; Half leftover still splits a meeting-rail underside as a stream stone; eighth log leftover done;',
    "title",
)

sub_once(
    "desktop/renderer/leftover-house.test.cjs",
'''  assert.equal(WP.playFor("planarian"), "split");
  assert.notEqual(WP.playFor("planarian"), "half");
  assert.notEqual(WP.playFor("planarian"), "sill");
  assert.notEqual(WP.playFor("planarian"), "dry");
  assert.notEqual(WP.playFor("planarian"), "glide");
  assert.notEqual(WP.playFor("planarian"), "plane");
  assert.notEqual(WP.playFor("planarian"), "cling");
  assert.notEqual(WP.playFor("planarian"), "drink");
  assert.equal(WP.playFor("nematode"), "sill");
  assert.equal(WP.playFor("tardigrade"), "dry");
  assert.equal(WP.playFor("honeybee"), "sill");
''',
'''  assert.equal(WP.playFor("planarian"), "split");
  assert.notEqual(WP.playFor("planarian"), "half");
  assert.notEqual(WP.playFor("planarian"), "sill");
  assert.notEqual(WP.playFor("planarian"), "dry");
  assert.notEqual(WP.playFor("planarian"), "glide");
  assert.notEqual(WP.playFor("planarian"), "plane");
  assert.notEqual(WP.playFor("planarian"), "cling");
  assert.notEqual(WP.playFor("planarian"), "drink");
  assert.equal(WP.playFor("nematode"), "thrash");
  assert.notEqual(WP.playFor("nematode"), "thread");
  assert.notEqual(WP.playFor("nematode"), "split");
  assert.notEqual(WP.playFor("nematode"), "dry");
  assert.notEqual(WP.playFor("nematode"), "sill");
  assert.equal(WP.playFor("ferret"), "thread");
  assert.equal(WP.playFor("planarian"), "split");
  assert.equal(WP.playFor("tardigrade"), "dry");
  assert.equal(WP.playFor("amphipod"), "sill");
  assert.equal(WP.playFor("honeybee"), "sill");
''',
"asserts",
)

sub_all("desktop/renderer/window-play.test.cjs", 'P.playFor("nematode"), "sill"', 'P.playFor("amphipod"), "sill"', "sill pin")
sub_once("desktop/renderer/window-play.test.cjs", 'P.pickTarget([WIN], 80, "nematode", WORK, P.SPRITE)', 'P.pickTarget([WIN], 80, "amphipod", WORK, P.SPRITE)', "generic sill guest")
sub_all("web/scripts/window-play.test.mjs", 'P.playFor("nematode"), "sill"', 'P.playFor("amphipod"), "sill"', "web sill pin")
sub_all("web/scripts/window-play.test.mjs", 'Overlay.playFor("nematode"), "sill"', 'Overlay.playFor("amphipod"), "sill"', "overlay sill pin")

print("docs and pins done")
