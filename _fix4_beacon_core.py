from pathlib import Path
p = Path("_beacon_core.py")
t = p.read_text(encoding="utf-8")
a = '''        '| "floated" | "faceted" | "rimmed" | "frosted";',
        '| "floated" | "faceted" | "rimmed" | "frosted" | "aligned";','''
b = '''        '| "floated" | "faceted" | "rimmed" | "manyed" | "frosted";',
        '| "floated" | "faceted" | "rimmed" | "manyed" | "frosted" | "aligned";','''
assert t.count(a) == 1
t = t.replace(a, b)
p.write_text(t, encoding="utf-8")
print("leave fixed")
