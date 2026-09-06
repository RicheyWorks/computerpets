from pathlib import Path
lines = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8").splitlines()
for i,l in enumerate(lines):
  if "TEETH," == l.strip() or l.strip() == "TEETH," or (l.strip().startswith("TEETH") and "teeth" not in l.lower()[5:]):
    print(f"{i+1}:{l}")
# find api = {
for i,l in enumerate(lines):
  if "const api =" in l or "api = {" in l:
    print("api at", i+1)
    for j in range(i, min(i+220, len(lines))):
      if "TEETH" in lines[j] or "SILL" in lines[j] or "ZONES" in lines[j]:
        print(f"{j+1}:{lines[j]}")
# README pin lines around Mane
for p in ["README.md","desktop/README.md"]:
  text=Path(p).read_text(encoding="utf-8").splitlines()
  for i,l in enumerate(text):
    if "Mane" in l or "Puff" in l or "teeth" in l or "fungi" in l.lower():
      print(f"{p}:{i+1}:{l[:220]}")
# ROADMAP Mane line full
rm=Path("docs/ROADMAP.md").read_text(encoding="utf-8").splitlines()
for i,l in enumerate(rm):
  if "lions_mane" in l or ( "Mane" in l and "teeth" in l):
    print(f"ROADMAP:{i+1}:{l[:300]}")
for i,l in enumerate(rm):
  if i>=430 and i<=440:
    print(f"ROADMAP footer {i+1}:{l[:300]}")
