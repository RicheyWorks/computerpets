from pathlib import Path

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit("%s: expected 1, got %d" % (label, n))
    return text.replace(old, new, 1)

ts_path = Path("web/src/lib/pets/window-play.ts")
ts = ts_path.read_text(encoding="utf-8")
ts = once(
    ts,
    "typeof ALIGN | typeof COOL | typeof SILL | typeof IGNORE;",
    "typeof ALIGN | typeof COOL | typeof WAIT | typeof SILL | typeof IGNORE;",
    "WindowPlayKind",
)
ts_path.write_text(ts, encoding="utf-8", newline="\n")
print("WindowPlayKind ok")
