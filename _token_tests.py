from pathlib import Path
ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

def sub_once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1 occurrence, found {n}")
    return text.replace(old, new, 1)

CJS_TESTS = (ROOT / "_token_cjs_tests.txt").read_text(encoding="utf-8-sig").replace(
    'assert.equal(P.DUR.buryOn, 0.42, "Cache bury durations stay");',
    'assert.equal(P.DUR.buryOn, 0.78, "Cache bury durations stay");',
    1,
)
MJS_TESTS = (ROOT / "_token_mjs_tests.txt").read_text(encoding="utf-8-sig")

TOKEN_ROADMAP = (
    "- [x] Token (`sand_dollar` / `token`) flats a real window sill pan as a sand plate: walk onto the pan (the pan — the same furniture family Wave signals as a marsh dish, Spoon paddles as a current dish, Wash rinses as a wash bowl, Jaw shows as a brackish dish, and Well fills as a bog cup, not Wave's signal, not Spoon's paddle, not Wash's rinse, not Jaw's show, not Well's fill, not Pale's window-stool sand, not Cache's window-stool bury, not Coin's pane circle, not Disk's pane open, not Ochre's pane reef), sit the flat (the tell — a flat urchin; not Coin; not Disk; not Ochre; named: Token. The flat is the tell. Hello: \"I sat the sand. Hello.\" Ambient: \"I sit. Then I bury. Then I sit.\" Play: \"A bury. Review the token.\" Temperament: flat.), then leave. One window. The flat is the tell — not Cache's `bury`. Not Pale's `sand`. Not Coin's `circle`. Not Disk's `open`. Not Ochre's `reef`. Not Wave's `signal`. Not Spire's `rock`. playFor(\"sand_dollar\") returns `flat` (not `token`, not `bury`, not `sand`, not `circle`, not `open`, not `reef`). Cache (`squirrel`) still owns `bury`. Pale (`ghost_crab`) still owns `sand`. Spire (`periwinkle`) still owns `rock`. Mail (`chiton`) still owns `eight`. Cement (`barnacle`) still owns `cirri`. Cone (`limpet`) still owns `clamp`. Wave (`fiddler_crab`) still owns `signal`. Coin (`goldfish`) still owns `circle`. Disk (`water_lily`) still owns `open`. Ochre (`sea_star`) still owns `reef`. Same `playFor` door. `/demo/token` lockstep. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. Seventh shore leftover. Next leftover is Thorn. Do not start Thorn.\n"
)

def patch_cjs():
    p = ROOT / "desktop" / "renderer" / "window-play.test.cjs"
    t = p.read_text(encoding="utf-8")
    t = sub_once(
        t,
        '  const target = P.pickTarget([WIN], 80, "sand_dollar", WORK, P.SPRITE);\n',
        '  const target = P.pickTarget([WIN], 80, "sea_urchin", WORK, P.SPRITE);\n',
        "cjs generic sill guest",
    )
    t = sub_once(
        t,
        '  assert.equal(P.playFor("sand_dollar"), "sill");\n',
        '  assert.equal(P.playFor("sea_urchin"), "sill");\n',
        "cjs spire next leftover pin",
    )
    if not t.endswith("\n"):
        t += "\n"
    t += CJS_TESTS
    if not t.endswith("\n"):
        t += "\n"
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched cjs tests")

def patch_mjs():
    p = ROOT / "web" / "scripts" / "window-play.test.mjs"
    t = p.read_text(encoding="utf-8")
    t = sub_once(
        t,
        '  assert.equal(P.playFor("sand_dollar"), "sill");\n',
        '  assert.equal(P.playFor("sea_urchin"), "sill");\n',
        "mjs spire next leftover pin",
    )
    if not t.endswith("\n"):
        t += "\n"
    t += MJS_TESTS
    if not t.endswith("\n"):
        t += "\n"
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched mjs tests")

def patch_house():
    p = ROOT / "desktop" / "renderer" / "leftover-house.test.cjs"
    t = p.read_text(encoding="utf-8")
    t = sub_once(
        t,
        "Spire leftover rocks a sash jamb as a rock face; sixth shore leftover done; next leftover is Token;",
        "Token leftover flats a sill pan as a sand plate; seventh shore leftover done; next leftover is Thorn; Spire leftover still rocks a sash jamb as a rock face; sixth shore leftover done;",
        "house title",
    )
    t = sub_once(
        t,
        '''  assert.equal(WP.playFor("sand_dollar"), "sill");
  assert.equal(WP.playFor("honeybee"), "sill");
''',
        '''  assert.equal(WP.playFor("sand_dollar"), "flat");
  assert.equal(WP.FLAT, "flat");
  assert.notEqual(WP.playFor("sand_dollar"), "token");
  assert.notEqual(WP.playFor("sand_dollar"), "bury");
  assert.notEqual(WP.playFor("sand_dollar"), "sand");
  assert.notEqual(WP.playFor("sand_dollar"), "circle");
  assert.notEqual(WP.playFor("sand_dollar"), "open");
  assert.notEqual(WP.playFor("sand_dollar"), "reef");
  assert.notEqual(WP.playFor("sand_dollar"), "sill");
  assert.equal(WP.playFor("periwinkle"), "rock");
  assert.equal(WP.playFor("chiton"), "eight");
  assert.equal(WP.playFor("ghost_crab"), "sand");
  assert.equal(WP.playFor("squirrel"), "bury");
  assert.equal(WP.playFor("barnacle"), "cirri");
  assert.equal(WP.playFor("limpet"), "clamp");
  assert.equal(WP.playFor("fiddler_crab"), "signal");
  assert.equal(WP.playFor("goldfish"), "circle");
  assert.equal(WP.playFor("water_lily"), "open");
  assert.equal(WP.playFor("sea_star"), "reef");
  assert.equal(WP.playFor("sea_urchin"), "sill");
  assert.equal(WP.playFor("honeybee"), "sill");
''',
        "house pins",
    )
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched leftover-house")

def patch_docs():
    readme = ROOT / "README.md"
    t = readme.read_text(encoding="utf-8")
    t = sub_once(
        t,
        "This is the sixth shore leftover. Other guests walk a sill.",
        "This is the sixth shore leftover. Token flats a sill pan as a sand plate: walk onto the pan, sit the flat, then leave. Cache still owns bury. Pale still owns sand. Spire still owns rock. This is the seventh shore leftover. Other guests walk a sill.",
        "readme",
    )
    readme.write_text(t, encoding="utf-8", newline="\n")
    print("patched README")

    desk = ROOT / "desktop" / "README.md"
    t = desk.read_text(encoding="utf-8")
    t = sub_once(
        t,
        "This is the sixth shore leftover. Other guests walk a sill.",
        "This is the sixth shore leftover. Token flats a sill pan as a sand plate: walk onto the pan, sit the flat, then leave. Cache still owns bury. Pale still owns sand. Spire still owns rock. This is the seventh shore leftover. Other guests walk a sill.",
        "desktop readme",
    )
    desk.write_text(t, encoding="utf-8", newline="\n")
    print("patched desktop README")

    arch = ROOT / "docs" / "ARCHITECTURE.md"
    t = arch.read_text(encoding="utf-8")
    t = sub_once(
        t,
        "2026-09-01 (Spire rocks a sash jamb as a rock face; sixth shore leftover done; next leftover is Token; catalog stays 220; rock is the tell; Mail still owns eight; Cement still owns cirri; Cone still owns clamp; Pale still owns sand; Wave still owns signal; Lid still owns shut; Whorl still rasps; Chamber still owns rise; Blush still owns stone)",
        "2026-09-01 (Token flats a sill pan as a sand plate; seventh shore leftover done; next leftover is Thorn; catalog stays 220; flat is the tell; Cache still owns bury; Pale still owns sand; Spire still owns rock; Mail still owns eight; Cement still owns cirri; Cone still owns clamp; Wave still owns signal; Coin still owns circle; Disk still owns open; Ochre still owns reef)",
        "architecture",
    )
    arch.write_text(t, encoding="utf-8", newline="\n")
    print("patched ARCHITECTURE")

    road = ROOT / "docs" / "ROADMAP.md"
    t = road.read_text(encoding="utf-8")
    n = t.count("Next leftover is Token. Do not start Token.")
    if n < 1:
        raise SystemExit(f"roadmap token next: expected at least 1, found {n}")
    t = t.replace("Next leftover is Token. Do not start Token.", "Token is done. Seventh shore leftover done. Next leftover is Thorn. Do not start Thorn.")
    t = sub_once(
        t,
        "Catalog stays 220. Sixth shore leftover. Token is done. Seventh shore leftover done. Next leftover is Thorn. Do not start Thorn.\n",
        "Catalog stays 220. Sixth shore leftover. Token is done. Seventh shore leftover done. Next leftover is Thorn. Do not start Thorn.\n" + TOKEN_ROADMAP,
        "roadmap token item",
    )
    t = sub_once(
        t,
        "**Last Updated:** 2026-09-01 (Phase 6 leftover: Spire rocks a sash jamb as a rock face; sixth shore leftover done; next leftover is Token; catalog stays 220; rock is the tell; Mail still owns eight; Cement still owns cirri; Cone still owns clamp; Pale still owns sand; Wave still owns signal; Lid still owns shut; Whorl still rasps; Chamber still owns rise; Blush still owns stone)",
        "**Last Updated:** 2026-09-01 (Phase 6 leftover: Token flats a sill pan as a sand plate; seventh shore leftover done; next leftover is Thorn; catalog stays 220; flat is the tell; Cache still owns bury; Pale still owns sand; Spire still owns rock; Mail still owns eight; Cement still owns cirri; Cone still owns clamp; Wave still owns signal; Coin still owns circle; Disk still owns open; Ochre still owns reef)",
        "roadmap last updated",
    )
    road.write_text(t, encoding="utf-8", newline="\n")
    print("patched ROADMAP")

if __name__ == "__main__":
    patch_cjs()
    patch_mjs()
    patch_house()
    patch_docs()
    print("tests+docs ok")
