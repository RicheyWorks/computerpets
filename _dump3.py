from pathlib import Path
lines = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8").splitlines()
out = []
for i,l in enumerate(lines):
  if "function wartsPoint" in l:
    for j in range(i, min(i+100, len(lines))):
      out.append(f"{j+1}:{lines[j]}")
    out.append("====")
    break
for i,l in enumerate(lines):
  if 'target.kind === TEETH' in l and i > 20000:
    for j in range(i-8, min(i+110, len(lines))):
      out.append(f"{j+1}:{lines[j]}")
    out.append("====")
    break
for i,l in enumerate(lines):
  if "function teethPoint" in l:
    for j in range(i, min(i+95, len(lines))):
      out.append(f"{j+1}:{lines[j]}")
      if j>i and lines[j].startswith("  function ") and "teeth" not in lines[j]:
        break
    out.append("====")
    break
for i,l in enumerate(lines):
  if "teethOffPath," in l:
    for j in range(i-10, min(i+20, len(lines))):
      out.append(f"{j+1}:{lines[j]}")
    break
Path("_dump3_out.txt").write_text("\n".join(out), encoding="utf-8")
print("ok", len(out))
