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

ts, nl = load("web/src/lib/pets/window-play.ts")
bad = '"leafrim"\n  | "grassplate"'
# check actual
idx = ts.find("leafrim")
print(repr(ts[idx-20:idx+40]))
idx2 = ts.find("leafed")
print("leafed", repr(ts[idx2-20:idx2+40]))
# fix double pipe if present
if '|   | "grassplate"' in ts:
    ts = ts.replace('|   | "grassplate"', '| "grassplate"')
    print("fixed double pipe grassplate")
if '| \n  | "grassplate"' in ts:
    ts = ts.replace('| \n  | "grassplate"', '|\n  | "grassplate"')
    print("fixed space pipe")
# show after leafrim line
for i,l in enumerate(ts.splitlines()):
  if "leafrim" in l or "grassplate" in l:
    print(i+1, repr(l))
  if "leafed" in l or "vaulted" in l:
    print(i+1, repr(l))
save("web/src/lib/pets/window-play.ts", ts, nl)
print("saved")
