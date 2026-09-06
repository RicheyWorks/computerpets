from pathlib import Path
ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")
HEADER_ADD = (ROOT / "_mail_header.txt").read_text(encoding="utf-8")
CJS_TESTS = (ROOT / "_mail_cjs_tests.txt").read_text(encoding="utf-8")
MJS_TESTS = (ROOT / "_mail_mjs_tests.txt").read_text(encoding="utf-8")
MAIL_ROADMAP = (ROOT / "_mail_roadmap.txt").read_text(encoding="utf-8")

CJS_TESTS = CJS_TESTS.replace('assert.equal(P.DUR.rollOn, 1.93, "Armor roll durations stay");', 'assert.equal(P.DUR.rollOn, 1.91, "Armor roll durations stay");')
CJS_TESTS = CJS_TESTS.replace('const armorOk = P.pickTarget([{ id: "stool", x: 200, y: 80, width: 186, height: 176 }], 80, "pillbug", WORK, P.SPRITE);', 'const armorOk = P.pickTarget([{ id: "stool", x: 200, y: 80, width: 194, height: 162 }], 80, "pillbug", WORK, P.SPRITE);')

def sub_once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1 occurrence, found {n}")
    return text.replace(old, new, 1)

def sub_all(text, old, new, label):
    n = text.count(old)
    if n == 0:
        raise SystemExit(f"{label}: found 0")
    print(f"{label}: {n}")
    return text.replace(old, new)

def patch_cjs():
    p = ROOT / "desktop" / "renderer" / "window-play.test.cjs"
    t = p.read_text(encoding="utf-8")
    t = t.replace('assert.equal(P.playFor("chiton"), "sill");', 'assert.equal(P.playFor("chiton"), "eight");')
    if not t.rstrip().endswith("});"):
        raise SystemExit("cjs: unexpected ending")
    t = t.rstrip() + "\n" + CJS_TESTS
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched cjs")

def patch_mjs():
    p = ROOT / "web" / "scripts" / "window-play.test.mjs"
    t = p.read_text(encoding="utf-8")
    t = t.replace('assert.equal(P.playFor("chiton"), "sill");', 'assert.equal(P.playFor("chiton"), "eight");')
    t = t.rstrip() + "\n" + MJS_TESTS
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched mjs")

def patch_house():
    p = ROOT / "desktop" / "renderer" / "leftover-house.test.cjs"
    t = p.read_text(encoding="utf-8")
    t = sub_once(
        t,
        'test("Cement leftover stays a sash stile as a stone rim; fourth shore leftover done; next leftover is Mail; ',
        'test("Mail leftover plates a meeting rail as a tide rock; fifth shore leftover done; next leftover is Spire; Cement leftover still stays a sash stile as a stone rim; fourth shore leftover done; ',
        "house title",
    )
    t = sub_once(
        t,
        '''  assert.equal(WP.playFor("chiton"), "sill");
  assert.equal(WP.playFor("honeybee"), "sill");
''',
        '''  assert.equal(WP.playFor("chiton"), "eight");
  assert.notEqual(WP.playFor("chiton"), "mail");
  assert.notEqual(WP.playFor("chiton"), "cirri");
  assert.notEqual(WP.playFor("chiton"), "clamp");
  assert.notEqual(WP.playFor("chiton"), "rasp");
  assert.notEqual(WP.playFor("chiton"), "roll");
  assert.equal(WP.playFor("barnacle"), "cirri");
  assert.equal(WP.playFor("limpet"), "clamp");
  assert.equal(WP.playFor("ghost_crab"), "sand");
  assert.equal(WP.playFor("fiddler_crab"), "signal");
  assert.equal(WP.playFor("periwinkle"), "sill");
  assert.equal(WP.playFor("honeybee"), "sill");
''',
        "house chiton pin",
    )
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched house")

def patch_docs():
    for rel in ["README.md", "desktop/README.md", "docs/ARCHITECTURE.md"]:
        p = ROOT.joinpath(*rel.split("/"))
        t = p.read_text(encoding="utf-8")
        if "This is the fourth shore leftover." not in t:
            raise SystemExit(f"{rel}: missing Cement leftover sentence")
        if "This is the fifth shore leftover." in t:
            print(f"{rel}: already has Mail")
            continue
        t = t.replace("This is the fourth shore leftover.", "This is the fourth shore leftover." + HEADER_ADD, 1)
        p.write_text(t, encoding="utf-8", newline="\n")
        print(f"patched {rel}")

    p = ROOT / "docs" / "ARCHITECTURE.md"
    t = p.read_text(encoding="utf-8")
    t = sub_once(
        t,
        "2026-09-01 (Cement stays a sash stile as a stone rim; fourth shore leftover done; next leftover is Mail; catalog stays 220; cirri is the tell; Cone still owns clamp; Pale still owns sand; Wave still owns signal; Lid still owns shut; Whorl still rasps; Dam still gnaws; Jet still owns velvet)",
        "2026-09-01 (Mail plates a meeting rail as a tide rock; fifth shore leftover done; next leftover is Spire; catalog stays 220; eight is the tell; Cement still owns cirri; Cone still owns clamp; Pale still owns sand; Wave still owns signal; Lid still owns shut; Whorl still rasps; Armor still owns roll)",
        "architecture last updated",
    )
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched architecture last updated")

    p = ROOT / "docs" / "ROADMAP.md"
    t = p.read_text(encoding="utf-8")
    t = sub_all(
        t,
        "Cement is done. Fourth shore leftover done. Next leftover is Mail. Do not start Mail.",
        "Cement is done. Fourth shore leftover done. Mail is done. Fifth shore leftover done. Next leftover is Spire. Do not start Spire.",
        "roadmap next leftover",
    )
    t = sub_once(
        t,
        "Catalog stays 220. Fourth shore leftover. Next leftover is Mail. Do not start Mail.",
        "Catalog stays 220. Fourth shore leftover. Mail is done. Fifth shore leftover done. Next leftover is Spire. Do not start Spire.\n" + MAIL_ROADMAP,
        "roadmap Cement item + Mail item",
    )
    t = sub_once(
        t,
        "**Last Updated:** 2026-09-01 (Phase 6 leftover: Cement stays a sash stile as a stone rim; fourth shore leftover done; next leftover is Mail; catalog stays 220; cirri is the tell; Cone still owns clamp; Pale still owns sand; Wave still owns signal; Lid still owns shut; Whorl still rasps; Dam still gnaws; Jet still owns velvet)",
        "**Last Updated:** 2026-09-01 (Phase 6 leftover: Mail plates a meeting rail as a tide rock; fifth shore leftover done; next leftover is Spire; catalog stays 220; eight is the tell; Cement still owns cirri; Cone still owns clamp; Pale still owns sand; Wave still owns signal; Lid still owns shut; Whorl still rasps; Armor still owns roll)",
        "roadmap last updated",
    )
    if "Next leftover is Mail." in t:
        raise SystemExit("roadmap still names Mail as next leftover")
    if "Do not start Spire." not in t:
        raise SystemExit("roadmap missing Spire next leftover")
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched roadmap")

if __name__ == "__main__":
    patch_cjs()
    patch_mjs()
    patch_house()
    patch_docs()
    print("tests docs ok")
