from pathlib import Path
p = Path("_cap_apply_js.py")
t = p.read_text(encoding="utf-8-sig")
i = t.find("const SHELF")
print(repr(t[i:i+80]))
print("doubled", t.count("\\\\n"), "single-esc", t.count("\\n"))
