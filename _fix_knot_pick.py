from pathlib import Path
p = Path(r"C:\Users\730ri\projects\ComputerPets\_knot_core.py")
t = p.read_text(encoding="utf-8")
old = """    old_pick = (
        '      leave: \"rimmed\",\\n'
        '      spin: \"none\",\\n'
        '    };\\n'
        '  }\\n'
        '\\n'
        '  if (kind === WRAP) {'
    )
    new_pick = (
        '      leave: \"rimmed\",\\n'
        '      spin: \"none\",\\n'
        '    };\\n'
        '  }\\n'
        '\\n'
        + TS_PICK
        + '  if (kind === WRAP) {'
    )
"""
new = """    old_pick = (
        '      leave: \"rimmed\",\\n'
        '      spin: \"none\",\\n'
        '    };\\n'
        '  }\\n'
        '  if (kind === WRAP) {'
    )
    new_pick = (
        '      leave: \"rimmed\",\\n'
        '      spin: \"none\",\\n'
        '    };\\n'
        '  }\\n'
        '\\n'
        + TS_PICK
        + '  if (kind === WRAP) {'
    )
"""
n = t.count(old)
print("ts pick blocks", n)
if n != 1:
    raise SystemExit("could not find ts pick block")
p.write_text(t.replace(old, new, 1), encoding="utf-8", newline="\n")
print("fixed ts pick marker")
