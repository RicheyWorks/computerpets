from pathlib import Path
p = Path("_cap_apply_js.py")
t = p.read_text(encoding="utf-8-sig")
fixed = t.replace("\\\\n", "\\n")
p.write_text(fixed, encoding="utf-8")
i = fixed.find("const SHELF")
print(repr(fixed[i:i+90]))
print("remaining doubled", fixed.count("\\\\n"))
