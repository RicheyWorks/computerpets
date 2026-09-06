from pathlib import Path
t = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
# unique sentences containing Next leftover is Lattice
import re
sents = set()
idx=0
while True:
    i=t.find("Next leftover is Lattice", idx)
    if i<0: break
    snippet=t[i:i+180]
    sents.add(snippet)
    idx=i+1
for s in sorted(sents):
    print("SNIP:", repr(s))
    print("---")
print("progress header:")
j=t.find("Cap is done. Second leftover of the fungi den done. Next leftover is Lattice")
print(repr(t[j-200:j+250]))
