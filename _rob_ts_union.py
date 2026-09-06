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
        raise SystemExit("COUNT " + label)
    return text.replace(old, new, 1)

text, nl = load("web/src/lib/pets/window-play.ts")
text = must_replace(
    text,
    '  | "streamjewel"\n  | "leafdish";',
    '  | "streamjewel"\n  | "leafdish"\n  | "barkdish"\n  | "acorncup"\n  | "barkplate"\n  | "grassperch";',
    "side union",
)
# leave - find end of leave union near righted/glo
# search for righted
if '"righted"' not in text:
    # find end of leave - look for glowed or similar recent
    idx = text.find('leave?:')
    # find the semicolon ending leave
    semi = text.find(";", idx)
    chunk = text[idx:semi]
    print("leave ends with:", chunk[-200:])
    # append seized before ending quote chain - find last leave token
    # typically ends with something like | "righted"
    # Looking at Click commit - maybe leave is string-extended loosely
    # Find last few tokens
    last = chunk.rfind('| "')
    print("last token area:", chunk[last:])
else:
    print("righted already present")

# try find "drilled" or "righted" or "cercised"
for tok in ["righted", "drilled", "cercised", "netted", "blacked", "tailed", "jumped", "leafed", "songed", "emerged"]:
    print(tok, tok in text[idx:semi] if 'idx' in dir() else tok in text)
