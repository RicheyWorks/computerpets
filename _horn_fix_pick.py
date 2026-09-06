from pathlib import Path
p = Path("_horn_core.py")
t = p.read_text(encoding="utf-8")
old = '''      leave: "hollowed",
      spin: "none",
    };
  }



  if (kind === WRAP) {'''
new = '''      leave: "hollowed",
      spin: "none",
    };
  }


  if (kind === WRAP) {'''
print("count", t.count(old))
if t.count(old) != 1:
    raise SystemExit("missing ts pick old")
t = t.replace(old, new, 1)
p.write_text(t, encoding="utf-8", newline="\n")
print("ok")
