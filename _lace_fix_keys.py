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

# fix test files and house
for p in [
    "desktop/renderer/window-play.test.cjs",
    "web/scripts/window-play.test.mjs",
    "desktop/renderer/leftover-house.test.cjs",
    "docs/ROADMAP.md",
    "_lace_cjs_tests.txt",
    "_lace_mjs_tests.txt",
]:
    text, nl = load(p)
    n1 = text.count('playFor("moth")')
    n2 = text.count("Seven (`ladybug`)")
    text2 = text.replace('playFor("moth")', 'playFor("orchid")')
    text2 = text2.replace("Seven (`ladybug`)", "Seven (`ladybird`)")
    # also Moth (`moth`) in roadmap bullet
    text2 = text2.replace("Moth (`moth`) still owns", "Moth (`orchid`) still owns")
    if text2 != text:
        save(p, text2, nl)
        print("fixed", p, "moth->orchid", n1, "ladybug->ladybird", n2)
    else:
        print("noop", p)
