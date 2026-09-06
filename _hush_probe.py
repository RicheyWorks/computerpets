from pathlib import Path
t = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
lines = t.splitlines()
out = []
needles = [
    "const ALIGN", "const FROST", "const SILL", "umbral", "magneton", "halovore",
    "alignOn:", "  align:", "playFor", "This is the leftover after",
    "function alignPoint", "if (kind === ALIGN)", 'if (next.phase === "align-on")',
    "module.exports", "ALIGN,", "alignPoint,",
]
for n in needles:
    idx = t.find(n)
    out.append("FIND %r at %d" % (n, idx))
    if idx >= 0:
        line_no = t[:idx].count("\n") + 1
        out.append("  line %d: %s" % (line_no, lines[line_no-1][:160]))
out.append("LEN %d LINES %d" % (len(t), len(lines)))
out.append("===HEAD===")
out.extend(lines[:30])
# also find sill pin / umbral assignment
for i, line in enumerate(lines):
    if "umbral" in line or ("magneton" in line and "playFor" not in line[:20]):
        out.append("L%d: %s" % (i+1, line[:200]))
Path("_hush_probe_out.txt").write_text("\n".join(out), encoding="utf-8")
print("wrote", len(out), "lines")
