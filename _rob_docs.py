# -*- coding: utf-8 -*-
"""Update leftover-house + docs for Rob seize; meadow ten closed; next is Frill."""
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
        raise SystemExit("MISSING: " + label + " :: " + repr(old[:100]))
    if text.count(old) != 1:
        raise SystemExit("COUNT %s for %s" % (text.count(old), label))
    return text.replace(old, new, 1)

# --- leftover-house ---
house, hnl = load("desktop/renderer/leftover-house.test.cjs")
# title prefix
old_title_start = 'test("Click leftover rights a window stool as a bark plate; ninth leftover of the meadow den done; '
new_title_start = 'test("Rob leftover seizes a window stool as a grass perch; tenth leftover of the meadow den done; meadow ten closed; Click leftover still rights a window stool as a bark plate; ninth leftover of the meadow den done; '
house = must_replace(house, old_title_start, new_title_start, "house title start")

# next leftover phrase in title
house = must_replace(
    house,
    "shore ten is closed; next leftover is Rob; Milk leftover still weeds",
    "shore ten is closed; next leftover is Frill; Milk leftover still weeds",
    "house next leftover",
)

# sill pin robber_fly -> oyster (2 places)
n = house.count('assert.equal(WP.playFor("robber_fly"), "sill");')
print("house robber sill", n)
if n != 2:
    raise SystemExit("expected 2 robber sill asserts")
house = house.replace(
    'assert.equal(WP.playFor("robber_fly"), "sill");',
    'assert.equal(WP.playFor("oyster"), "sill");',
)

# After Click asserts block, replace the final oyster/robber sill with Rob seize asserts
# Current end of Click block:
old_click_tail = '''  assert.equal(WP.playFor("firefly"), "glow");
  assert.equal(WP.playFor("oyster"), "sill");
'''
# There may be two oyster sill now - the one at end of Click block and one earlier generic
# Find Click block: assert.equal(WP.playFor("click_beetle"), "right");
idx = house.find('assert.equal(WP.playFor("click_beetle"), "right");')
if idx < 0:
    raise SystemExit("no click right assert")
# from idx, find the oyster sill that follows in this block
sub = house[idx:]
pos = sub.find('assert.equal(WP.playFor("oyster"), "sill");')
if pos < 0:
    raise SystemExit("no oyster after click block")
# replace that one occurrence in context
old_block_end = sub[pos:pos+len('assert.equal(WP.playFor("oyster"), "sill");\n')]
# unique context: firefly glow then oyster
ctx = '''  assert.equal(WP.playFor("firefly"), "glow");
  assert.equal(WP.playFor("oyster"), "sill");
'''
if ctx not in house:
    # show nearby
    print(repr(sub[pos-120:pos+80]))
    raise SystemExit("click tail ctx missing")

new_block_end = '''  assert.equal(WP.playFor("firefly"), "glow");

  assert.equal(WP.playFor("robber_fly"), "seize");
  assert.equal(WP.SEIZE, "seize");
  assert.notEqual(WP.playFor("robber_fly"), "rob");
  assert.notEqual(WP.playFor("robber_fly"), "hunt");
  assert.notEqual(WP.playFor("robber_fly"), "hawk");
  assert.notEqual(WP.playFor("robber_fly"), "perch");
  assert.notEqual(WP.playFor("robber_fly"), "bristle");
  assert.notEqual(WP.playFor("robber_fly"), "pounce");
  assert.notEqual(WP.playFor("robber_fly"), "sip");
  assert.notEqual(WP.playFor("robber_fly"), "forage");
  assert.notEqual(WP.playFor("robber_fly"), "right");
  assert.notEqual(WP.playFor("robber_fly"), "drone");
  assert.notEqual(WP.playFor("robber_fly"), "ambush");
  assert.notEqual(WP.playFor("robber_fly"), "stoop");
  assert.notEqual(WP.playFor("robber_fly"), "sill");
  assert.equal(WP.playFor("click_beetle"), "right");
  assert.equal(WP.RIGHT, "right");
  assert.equal(WP.playFor("relay_dragon"), "click");
  assert.equal(WP.CLICK, "click");
  assert.equal(WP.playFor("house_centipede"), "hunt");
  assert.equal(WP.playFor("darner"), "hawk");
  assert.equal(WP.playFor("hummingbird"), "sip");
  assert.equal(WP.playFor("bumblebee"), "forage");
  assert.equal(WP.playFor("porcupine"), "bristle");
  assert.equal(WP.playFor("red_tail"), "soar");
  assert.equal(WP.playFor("jumping_spider"), "pounce");
  assert.equal(WP.playFor("honey_drone"), "drone");
  assert.equal(WP.playFor("oyster"), "sill");
'''
house = must_replace(house, ctx, new_block_end, "house rob asserts")
save("desktop/renderer/leftover-house.test.cjs", house, hnl)
print("ok house")

# --- ROADMAP ---
rm, rnl = load("docs/ROADMAP.md")
# Update Click bullet's "Next leftover is Rob" tails across meadow bullets
rm = rm.replace(
    "Next leftover is Rob. Do not start Rob. Rob (robber fly) is later meadow — after Click.",
    "Rob is done. Tenth leftover of the meadow den done. Meadow ten closed. Next leftover is Frill. Do not start Frill. Frill (oyster mushroom) is first fungi — after Rob.",
)
# Add Rob bullet after Click bullet
click_line_start = "- [x] Click (`click_beetle` / `click`) rights a real window stool as a bark plate:"
idx = rm.find(click_line_start)
if idx < 0:
    raise SystemExit("no click roadmap line")
# find end of click bullet (next blank line or next - [x])
end = rm.find("\n\n- [x] Spark sits the fifth cyber", idx)
if end < 0:
    end = rm.find("\n- [x] Spark sits the fifth cyber", idx)
if end < 0:
    raise SystemExit("no spark after click")

rob_bullet = (
    "\n\n- [x] Rob (`robber_fly` / `rob`) seizes a real window stool as a grass perch: walk onto the stool (the stool — papers are grass; the same furniture family Click rights as a bark plate, Snout drills as an acorn cup, Forceps cercis as a bark dish, Lace nets as a leaf dish, and Chirp songs as a grass dish, not Haste's sash-jamb-crack plaster hunt, not Dart's lamp-side-air prey hawk, not Sip's window-box-bloom nectar sip, not Thrum's window-box meadow forage, not Hook's lamp-post-stile soar, not Spine's jamb pine-post bristle, not Leap's meeting-rail-end blotter pounce; a fly that hunts; not a bee; not Thrum; not Sip; she sits then hunts then sits; perch kept my bristle; papers are grass; review the take; named: Rob. Seize first. Hello: \"I hunted. Hello.\" Play: \"A hunt. Review the take.\" Temperament: hunting.), then leave. One window. Seize is the tell — not Haste's `hunt`. Not Dart's `hawk`. Not Sip's `sip`. Not Thrum's `forage`. Not Click's `right`. Not Hook's `soar`. Not Spine's `bristle`. Not Leap's `pounce`. Not Hum's `drone`. playFor(\"robber_fly\") returns `seize` (not `rob`, not `hunt`, not `hawk`, not `perch`, not `bristle`, not `pounce`, not `sip`, not `forage`, not `thrum`, not `right`, not `drone`, not `ambush`, not `stoop`, not `sill`). Click (`click_beetle`) still owns `right`. Relay (`relay_dragon`) still owns `click`. Haste (`house_centipede`) still owns `hunt`. Dart (`darner`) still owns `hawk`. Sip (`hummingbird`) still owns `sip`. Thrum (`bumblebee`) still owns `forage`. Spine (`porcupine`) still owns `bristle`. Hook (`red_tail`) still owns `soar`. Leap (`jumping_spider`) still owns `pounce`. Hum (`honey_drone`) still owns `drone`. Same `playFor` door. `/demo/rob` lockstep. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. Tenth leftover of the meadow den. Meadow ten closed. Hive ten stays closed. Shore ten stays closed. Next leftover is Frill. Do not start Frill. Frill (oyster mushroom) is first fungi — after Rob."
)

# Insert rob bullet before Spark section; also update the Click bullet's trailing next-rob text already replaced globally
rm = rm[:end] + rob_bullet + rm[end:]

# Last updated
rm = must_replace(
    rm,
    "**Last Updated:** 2026-09-02 (Phase 6 leftover: Click rights a window stool as a bark plate; ninth leftover of the meadow den done; hive ten closed; shore ten is closed; next leftover is Rob; catalog stays 220; right is the tell; Snout still owns drill; Relay still owns click; Snap still owns count; Beak still owns snap; Bluff still owns flip; gecko still owns chirp)",
    "**Last Updated:** 2026-09-02 (Phase 6 leftover: Rob seizes a window stool as a grass perch; tenth leftover of the meadow den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Frill; catalog stays 220; seize is the tell; Click still owns right; Relay still owns click; Haste still owns hunt; Dart still owns hawk; Sip still owns sip; Thrum still owns forage)",
    "roadmap last updated",
)
save("docs/ROADMAP.md", rm, rnl)
print("ok roadmap")

# --- ARCHITECTURE / READMEs ---
for path, old, new, label in [
    (
        "docs/ARCHITECTURE.md",
        "2026-09-02 (Click rights a window stool as a bark plate; ninth leftover of the meadow den done; hive ten closed; shore",
        "2026-09-02 (Rob seizes a window stool as a grass perch; tenth leftover of the meadow den done; meadow ten closed; hive ten closed; shore",
        "arch",
    ),
]:
    text, tnl = load(path)
    if old not in text:
        # show what is there
        i = text.find("2026-09-02")
        print(path, "found:", repr(text[i:i+200]) if i>=0 else None)
        raise SystemExit("MISSING " + label)
    text = text.replace(old, new, 1)
    save(path, text, tnl)
    print("ok", label)

# README.md and desktop/README.md - Click mentioned?
for path in ["README.md", "desktop/README.md"]:
    text, tnl = load(path)
    # Click PR only changed 1 line each - likely a one-liner about latest leftover
    if "Click rights" in text:
        text = text.replace("Click rights a window stool as a bark plate", "Rob seizes a window stool as a grass perch", 1)
        save(path, text, tnl)
        print("ok", path, "click->rob")
    elif "ninth leftover of the meadow" in text:
        text = text.replace("ninth leftover of the meadow", "tenth leftover of the meadow", 1)
        save(path, text, tnl)
        print("ok", path, "ninth->tenth")
    else:
        # show recent date lines
        for line in text.splitlines():
            if "2026-09" in line or "meadow" in line.lower() or "Click" in line:
                print(path, ":", line[:160])
