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
        raise SystemExit("MISSING " + label + " :: " + repr(old[:100]))
    n = text.count(old)
    if n != 1:
        raise SystemExit("COUNT %s for %s" % (n, label))
    return text.replace(old, new, 1)

ts, nl = load("web/src/lib/pets/window-play.ts")
print("grassperch", ts.count("grassperch"))
print("SEIZE", "SEIZE" in ts)
print("robber seize", 'robber_fly") return SEIZE' in ts)

# Fix side union - find exact ending
i = ts.find('export type PlayTarget')
j = ts.find("holdX:", i)
side = ts[i:j]
print("SIDE TAIL:", repr(side[-180:]))

old_side = side[side.rfind('| "streamjewel"'):]
print("OLD SIDE END REPR:", repr(old_side))
