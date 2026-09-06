from pathlib import Path
p = Path("_lattice_core2.py")
t = p.read_text(encoding="utf-8")
old = '''    t = once(t, HEADER_OLD, HEADER_NEW, "ts header")'''
new = '''    t = once(t, "This is the second leftover of the fungi den. Others walk a sill. Same map as desktop `window-play.js`. */", "This is the second leftover of the fungi den. Lattice hollows a sash well as leaf mold: walk into the well, sit the hollow, then leave. Cap still owns warts. Frill still owns shelf. Felt still owns lean. This is the leftover after Cap. This is the third leftover of the fungi den. Others walk a sill. Same map as desktop `window-play.js`. */", "ts header")'''
if old not in t:
    raise SystemExit("marker missing")
p.write_text(t.replace(old, new, 1), encoding="utf-8")
print("patched core2")
