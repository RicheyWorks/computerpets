from pathlib import Path
p = Path("_veil_apply.py")
t = p.read_text(encoding="utf-8")
old = '''    ts = ts.replace(
        "  if (kind === PAPILLAE) return w.width >= 189 && w.height >= 200;\\n  return w.width >= 180 && w.height >= 70;",
        "  if (kind === PAPILLAE) return w.width >= 189 && w.height >= 200;\\n  if (kind === RAYS) return w.width >= 187 && w.height >= 192;\\n  return w.width >= 180 && w.height >= 70;",
        1,
    )'''
new = '''    # size gate lives inside filter callback (4-space indent before if)
    old_size = "    if (kind === PAPILLAE) return w.width >= 189 && w.height >= 200;\\n    return w.width >= 180 && w.height >= 70;"
    new_size = "    if (kind === PAPILLAE) return w.width >= 189 && w.height >= 200;\\n    if (kind === RAYS) return w.width >= 187 && w.height >= 192;\\n    return w.width >= 180 && w.height >= 70;"
    if old_size not in ts:
        raise SystemExit("TS size gate marker missing")
    ts = ts.replace(old_size, new_size, 1)'''
if old not in t:
    # try to find the size replace block more loosely
    if "TS size gate marker" in t:
        print("already fixed")
    else:
        raise SystemExit("old size replace block not found")
else:
    t = t.replace(old, new, 1)
    p.write_text(t, encoding="utf-8")
    print("fixed size gate replace")
