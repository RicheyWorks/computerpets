from pathlib import Path
p = Path("_silica_core.py")
t = p.read_text(encoding="utf-8")
old = "export function beginPlay(target: PlayTarget, petX?: number)"
new = "export function beginPlay(target: PlayTarget | null | undefined, petX: number)"
n = t.count(old)
if n != 1:
    raise SystemExit(f"marker count {n}")
p.write_text(t.replace(old, new, 1), encoding="utf-8")
print("fixed")
