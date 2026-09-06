from pathlib import Path
p = Path("_horn_core.py")
t = p.read_text(encoding="utf-8")
old = '''def patch_ts(t):
    t = once(t, HEADER_OLD, HEADER_NEW, "ts header")'''
new = '''HEADER_OLD_TS = "This is the leftover after Cap. This is the third leftover of the fungi den. Others walk a sill. Same map as desktop `window-play.js`. */"
HEADER_NEW_TS = (
    "This is the leftover after Cap. This is the third leftover of the fungi den. "
    "Horn forks a sash drip as a moss rim: walk onto the drip, sit the fork, then leave. "
    "Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. Latch still drinks the drip as blotter. "
    "This is the leftover after Lattice. This is the fourth leftover of the fungi den. Others walk a sill. Same map as desktop `window-play.js`. */"
)

def patch_ts(t):
    t = once(t, HEADER_OLD_TS, HEADER_NEW_TS, "ts header")'''
if t.count(old) != 1:
    raise SystemExit(f"patch_ts header once count {t.count(old)}")
t = t.replace(old, new, 1)
p.write_text(t, encoding="utf-8", newline="\n")
print("ok")
