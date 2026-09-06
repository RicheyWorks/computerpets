from pathlib import Path
ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")
HEADER_ADD = (ROOT / "_spire_header.txt").read_text(encoding="utf-8")
CJS_TESTS = (ROOT / "_spire_cjs_tests.txt").read_text(encoding="utf-8-sig")
MJS_TESTS = (ROOT / "_spire_mjs_tests.txt").read_text(encoding="utf-8-sig")
SPIRE_ROADMAP = (ROOT / "_spire_roadmap.txt").read_text(encoding="utf-8-sig")

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
    t = t.replace('assert.equal(P.playFor("periwinkle"), "sill");', 'assert.equal(P.playFor("periwinkle"), "rock");')
    if not t.rstrip().endswith("});"):
        raise SystemExit("cjs: unexpected ending")
    t = t.rstrip() + "\n" + CJS_TESTS
    if not t.endswith("\n"):
        t += "\n"
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched cjs")

def patch_mjs():
    p = ROOT / "web" / "scripts" / "window-play.test.mjs"
    t = p.read_text(encoding="utf-8")
    t = t.replace('assert.equal(P.playFor("periwinkle"), "sill");', 'assert.equal(P.playFor("periwinkle"), "rock");')
    t = t.rstrip() + "\n" + MJS_TESTS
    if not t.endswith("\n"):
        t += "\n"
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched mjs")

def patch_house():
    p = ROOT / "desktop" / "renderer" / "leftover-house.test.cjs"
    t = p.read_text(encoding="utf-8")
    t = sub_once(
        t,
        'test("Mail leftover plates a meeting rail as a tide rock; fifth shore leftover done; next leftover is Spire; ',
        'test("Spire leftover rocks a sash jamb as a rock face; sixth shore leftover done; next leftover is Token; Mail leftover still plates a meeting rail as a tide rock; fifth shore leftover done; ',
        "house title",
    )
    t = sub_once(
        t,
        '''  assert.equal(WP.playFor("periwinkle"), "sill");
  assert.equal(WP.playFor("honeybee"), "sill");
''',
        '''  assert.equal(WP.playFor("periwinkle"), "rock");
  assert.notEqual(WP.playFor("periwinkle"), "spire");
  assert.notEqual(WP.playFor("periwinkle"), "rasp");
  assert.notEqual(WP.playFor("periwinkle"), "eight");
  assert.equal(WP.playFor("pond_snail"), "rasp");
  assert.equal(WP.playFor("chiton"), "eight");
  assert.equal(WP.playFor("barnacle"), "cirri");
  assert.equal(WP.playFor("limpet"), "clamp");
  assert.equal(WP.playFor("sand_dollar"), "sill");
  assert.equal(WP.playFor("honeybee"), "sill");
''',
        "house periwinkle pin",
    )
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched house")

def patch_docs():
    for rel in ["README.md", "desktop/README.md", "docs/ARCHITECTURE.md"]:
        p = ROOT.joinpath(*rel.split("/"))
        t = p.read_text(encoding="utf-8")
        if "This is the fifth shore leftover." not in t:
            raise SystemExit(f"{rel}: missing Mail leftover sentence")
        if "This is the sixth shore leftover." in t:
            print(f"{rel}: already has Spire")
            continue
        t = t.replace("This is the fifth shore leftover.", "This is the fifth shore leftover." + HEADER_ADD, 1)
        p.write_text(t, encoding="utf-8", newline="\n")
        print(f"patched {rel}")

    p = ROOT / "docs" / "ARCHITECTURE.md"
    t = p.read_text(encoding="utf-8")
    t = sub_once(
        t,
        "2026-09-01 (Mail plates a meeting rail as a tide rock; fifth shore leftover done; next leftover is Spire; catalog stays 220; eight is the tell; Cement still owns cirri; Cone still owns clamp; Pale still owns sand; Wave still owns signal; Lid still owns shut; Whorl still rasps; Armor still owns roll)",
        "2026-09-01 (Spire rocks a sash jamb as a rock face; sixth shore leftover done; next leftover is Token; catalog stays 220; rock is the tell; Mail still owns eight; Cement still owns cirri; Cone still owns clamp; Pale still owns sand; Wave still owns signal; Lid still owns shut; Whorl still rasps; Chamber still owns rise; Blush still owns stone)",
        "architecture last updated",
    )
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched architecture last updated")

    p = ROOT / "docs" / "ROADMAP.md"
    t = p.read_text(encoding="utf-8")
    t = sub_all(
        t,
        "Mail is done. Fifth shore leftover done. Next leftover is Spire. Do not start Spire.",
        "Mail is done. Fifth shore leftover done. Spire is done. Sixth shore leftover done. Next leftover is Token. Do not start Token.",
        "roadmap next leftover",
    )
    t = sub_once(
        t,
        "Catalog stays 220. Fifth shore leftover. Next leftover is Spire. Do not start Spire.",
        "Catalog stays 220. Fifth shore leftover. Spire is done. Sixth shore leftover done. Next leftover is Token. Do not start Token.\n" + SPIRE_ROADMAP.rstrip() + "\n",
        "roadmap Mail item + Spire item",
    )
    t = sub_once(
        t,
        "**Last Updated:** 2026-09-01 (Phase 6 leftover: Mail plates a meeting rail as a tide rock; fifth shore leftover done; next leftover is Spire; catalog stays 220; eight is the tell; Cement still owns cirri; Cone still owns clamp; Pale still owns sand; Wave still owns signal; Lid still owns shut; Whorl still rasps; Armor still owns roll)",
        "**Last Updated:** 2026-09-01 (Phase 6 leftover: Spire rocks a sash jamb as a rock face; sixth shore leftover done; next leftover is Token; catalog stays 220; rock is the tell; Mail still owns eight; Cement still owns cirri; Cone still owns clamp; Pale still owns sand; Wave still owns signal; Lid still owns shut; Whorl still rasps; Chamber still owns rise; Blush still owns stone)",
        "roadmap last updated",
    )
    if "Next leftover is Spire." in t:
        raise SystemExit("roadmap still names Spire as next leftover")
    if "Do not start Token." not in t:
        raise SystemExit("roadmap missing Token next leftover")
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched roadmap")

if __name__ == "__main__":
    patch_cjs()
    patch_mjs()
    patch_house()
    patch_docs()
    print("tests docs ok")
