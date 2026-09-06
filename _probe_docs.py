import re
# Blade ROADMAP entry + README snippets
for p in ["docs/ROADMAP.md", "README.md", "desktop/README.md", "docs/ARCHITECTURE.md"]:
    t = open(p, encoding="utf-8").read()
    # find Blade checklist
    m = re.search(r"- \[[ x]\] Blade .*", t)
    if m:
        print("====", p, "Blade len", len(m.group(0)))
        print(m.group(0)[:500])
        print("...")
        print(m.group(0)[-400:])
    # Last Updated lines
    for line in t.splitlines():
        if "Last updated" in line or "last updated" in line.lower() or line.startswith("2026-09-01 (Blade") or "Phase 6 leftover: Blade" in line or "next leftover is Vault" in line:
            if "Blade" in line or "Vault" in line or "Chirp" in line or "Last" in line:
                print(p, ":", line[:220])
