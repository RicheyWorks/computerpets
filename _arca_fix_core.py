from pathlib import Path
p = Path("_arca_core.py")
t = p.read_text(encoding="utf-8")
old = '''    t = once(
        t,
        "  if (kind === COOL) return w.width >= 198 && w.height >= 188;\\n  return w.width >= 180 && w.height >= 70;",
        "  if (kind === COOL) return w.width >= 198 && w.height >= 188;\\n  if (kind === WAIT) return w.width >= 196 && w.height >= 164;\\n  return w.width >= 180 && w.height >= 70;",
        "ts size",
    )'''
new = '''    t = once(
        t,
        "  if (kind === COOL) return w.width >= 198 && w.height >= 188;\\n    return w.width >= 180 && w.height >= 70;",
        "  if (kind === COOL) return w.width >= 198 && w.height >= 188;\\n  if (kind === WAIT) return w.width >= 196 && w.height >= 164;\\n    return w.width >= 180 && w.height >= 70;",
        "ts size",
    )'''
if old not in t:
    raise SystemExit("pattern not found in core")
p.write_text(t.replace(old, new, 1), encoding="utf-8")
print("fixed")
