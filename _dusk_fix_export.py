from pathlib import Path
p = Path("_dusk_core.py")
t = p.read_text(encoding="utf-8")
old = 't = once(t, "    FACET,\\n    IGNORE,", "    FACET,\\n    RIM,\\n    IGNORE,", "js export kind")'
new = 't = once(t, "    FACET,\\n    SILL,", "    FACET,\\n    RIM,\\n    SILL,", "js export kind")'
n = t.count(old)
print("found", n)
if n != 1:
    # show nearby
    i = t.find("js export kind")
    print(repr(t[i-120:i+80]))
    raise SystemExit("no match")
p.write_text(t.replace(old, new, 1), encoding="utf-8", newline="\n")
print("fixed")