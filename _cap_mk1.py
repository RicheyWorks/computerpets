# -*- coding: utf-8 -*-
from pathlib import Path

# Start from frill core structure but rebuild patch_js for Cap
load_save = Path("_frill_core.py").read_text(encoding="utf-8").split("SHELF_FNS")[0]
# load_save ends before SHELF_FNS; includes helpers + HEADER that we need to replace

# Rebuild cleanly
warts_body = Path("_cap_warts_fns.js").read_text(encoding="utf-8")
# ensure trailing newline before closing
if not warts_body.endswith("\n"):
    warts_body += "\n"

out = []
out.append("# -*- coding: utf-8 -*-")
out.append('"""Apply Cap warts leftover across window-play.js (mirror Frill #511)."""')
out.append("from pathlib import Path")
out.append("")
out.append("def load(p):")
out.append("    raw = Path(p).read_bytes()")
out.append('    nl = "\\r\\n" if b"\\r\\n" in raw else "\\n"')
out.append('    text = raw.decode("utf-8")')
out.append('    if text.startswith("\\ufeff"):')
out.append("        text = text[1:]")
out.append('    text = text.replace("\\r\\n", "\\n").replace("\\r", "\\n")')
out.append("    return text, nl")
out.append("")
out.append("def save(p, text, nl):")
out.append('    if nl != "\\n":')
out.append('        text = text.replace("\\n", nl)')
out.append('    Path(p).write_bytes(text.encode("utf-8"))')
out.append("")
out.append("def must_replace(text, old, new, label):")
out.append("    if old not in text:")
out.append('        raise SystemExit("MISSING: " + label)')
out.append("    n = text.count(old)")
out.append("    if n != 1:")
out.append('        raise SystemExit("COUNT %s for %s" % (n, label))')
out.append("    return text.replace(old, new, 1)")
out.append("")
Path("_cap_core_head.py").write_text("\n".join(out) + "\n", encoding="utf-8")
Path("_cap_warts_body.txt").write_text(warts_body, encoding="utf-8")
print("head ok", Path("_cap_core_head.py").stat().st_size)
print("body ok", len(warts_body.splitlines()))
