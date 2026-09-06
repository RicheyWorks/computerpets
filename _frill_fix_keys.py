from pathlib import Path
p = Path("_frill_tests.py")
t = p.read_text(encoding="utf-8")
t = t.replace('playFor("sugar_glider")', 'playFor("bat")')
t = t.replace('playFor("squirrel")', 'playFor("oak")')
p.write_text(t, encoding="utf-8")
print("sugar", "sugar_glider" in t)
print("bat counts", t.count('playFor("bat")'))
print("oak counts", t.count('playFor("oak")'))
