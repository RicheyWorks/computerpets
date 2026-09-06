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
        raise SystemExit("MISSING " + label)
    if text.count(old) != 1:
        raise SystemExit("COUNT %s for %s" % (text.count(old), label))
    return text.replace(old, new, 1)

text, nl = load("web/src/lib/pets/window-play.ts")
text = must_replace(
    text,
    '| "streamjewel"\n  | "leafdish";',
    '| "streamjewel"\n  | "leafdish"\n  | "acorncup"\n  | "barkplate"\n  | "grassperch";',
    "side union",
)

# leave union - find trailing end. Look for righted in leave field specifically.
i = text.find("leave?:")
semi = text.find(";", i)
leave = text[i:semi]
print("leave tail:", leave[-250:])
# Find a recent leave token to append after
# Click used righted - search
if '"righted"' in leave:
    text = must_replace(text, leave[leave.rfind('| "'):] , leave[leave.rfind('| "'):] + ' | "seized"', "leave seized via righted")
else:
    # append before semicolon by replacing last token area
    # find last | "something"
    last = leave.rfind('| "')
    last_tok = leave[last:]
    print("last leave tok", last_tok)
    # unique enough?
    # Use full leave ending of last 80 chars
    tail = leave[-80:]
    text = must_replace(text, tail, tail + ' | "seized"', "leave seized")

save("web/src/lib/pets/window-play.ts", text, nl)
print("ok unions")
# verify
t2 = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
print("grassperch", t2.count("grassperch"))
print("seized", t2.count('"seized"'))
