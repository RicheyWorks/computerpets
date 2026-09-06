from pathlib import Path
rm=Path("docs/ROADMAP.md").read_text(encoding="utf-8")
lines=rm.splitlines()
print("HUSH:", lines[423])
print()
print("After hush blank?", repr(lines[424]))
# find far den section note
for i,l in enumerate(lines):
    if "far den" in l.lower() and ("close" in l.lower() or "ten guests" in l.lower() or "Far den" in l):
        print(i+1, l[:200])

readme=Path("README.md").read_text(encoding="utf-8")
i=readme.find("Hush cools")
j=readme.find("Others walk a sill", i)
print("\nREADME Hush block:")
print(readme[i:j+40])
