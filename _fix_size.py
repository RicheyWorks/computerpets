from pathlib import Path
p = Path(r"C:\Users\730ri\projects\ComputerPets\_thread_ts.py")
t = p.read_text(encoding="utf-8")
old = '''  if (kind === SPLIT) return w.width >= 193 && w.height >= 200;
  return w.width >= 180 && w.height >= 70;'''
new = '''  if (kind === SPLIT) return w.width >= 193 && w.height >= 200;
    return w.width >= 180 && w.height >= 70;'''
if old not in t:
    raise SystemExit("size old string not in patcher")
t = t.replace(old, new, 1)
old2 = '''  if (kind === SPLIT) return w.width >= 193 && w.height >= 200;
  if (kind === THRASH) return w.width >= 192 && w.height >= 198;
  return w.width >= 180 && w.height >= 70;'''
new2 = '''  if (kind === SPLIT) return w.width >= 193 && w.height >= 200;
  if (kind === THRASH) return w.width >= 192 && w.height >= 198;
    return w.width >= 180 && w.height >= 70;'''
if old2 not in t:
    raise SystemExit("size new string not in patcher")
t = t.replace(old2, new2, 1)
p.write_text(t, encoding="utf-8")
print("updated size matcher")
