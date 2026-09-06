from pathlib import Path
rm=Path("docs/ROADMAP.md").read_text(encoding="utf-8").splitlines()
for i,l in enumerate(rm):
  if "lions_mane" in l or ("Mane" in l and ("teeth" in l or "sash gap" in l)):
    print(f"{i+1}:{l}")
    print("---")
arch=Path("docs/ARCHITECTURE.md").read_text(encoding="utf-8").splitlines()
print("ARCH1:", arch[10][:400] if len(arch)>10 else "")
readme=Path("README.md").read_text(encoding="utf-8").splitlines()
# find fungi leftover sentence in README
for i,l in enumerate(readme):
  if "Mane" in l or "teeth" in l or "Puff" in l:
    print(f"README {i+1}:{l[:500]}")
desk=Path("desktop/README.md").read_text(encoding="utf-8").splitlines()
for i,l in enumerate(desk):
  if "Mane" in l or "teeth" in l or "Puff" in l or "fungi" in l:
    print(f"deskREADME {i+1}:{l[:500]}")
# api constants around TEETH
lines=Path("desktop/renderer/window-play.js").read_text(encoding="utf-8").splitlines()
for j in range(30470, 30500):
  print(f"{j+1}:{lines[j]}")
# ts playFor and DUR and pick similar
ts=Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8").splitlines()
for i,l in enumerate(ts):
  if "TEETH" in l or "lions_mane" in l:
    if i < 2500 or "function" in l or "export const" in l or "playFor" in l or "typeof TEETH" in l or "kind === TEETH" in l:
      print(f"TS {i+1}:{l[:180]}")
