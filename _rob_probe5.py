from pathlib import Path
import re
# search for house names near robber_fly / oyster
for p in Path(".").rglob("*"):
    if not p.is_file():
        continue
    if p.suffix not in {".js",".ts",".cjs",".mjs",".json"}:
        continue
    if "node_modules" in str(p) or ".git" in str(p):
        continue
    try:
        t = p.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        continue
    if 'robber_fly' in t and ('"Rob"' in t or "Rob:" in t or "name: \"Rob\"" in t or "rob:" in t.lower()):
        # find Rob association
        for m in re.finditer(r'.{0,40}[Rr]ob.{0,40}robber_fly.|robber_fly.{0,60}', t):
            s = m.group(0).replace("\n"," ")
            if "Rob" in s or "rob" in s:
                print(p, ":", s[:140])
                break
