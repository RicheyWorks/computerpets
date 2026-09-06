from pathlib import Path
p = Path("_silica_core.py")
t = p.read_text(encoding="utf-8")
# show occurrences
needle = "beginPlay(target"
idxs = []
start = 0
while True:
    i = t.find(needle, start)
    if i < 0: break
    idxs.append(i)
    print(i, repr(t[i:i+90]))
    start = i + 1
print("count", len(idxs))
# replace only the one used for TS_FACET_FNS insert
old = 't = once(t, "export function beginPlay(target: PlayTarget, petX?: number)", TS_FACET_FNS + "export function beginPlay(target: PlayTarget, petX?: number)", "ts fns")'
new = 't = once(t, "export function beginPlay(target: PlayTarget | null | undefined, petX: number)", TS_FACET_FNS + "export function beginPlay(target: PlayTarget | null | undefined, petX: number)", "ts fns")'
if old not in t:
    raise SystemExit("old once line missing")
p.write_text(t.replace(old, new, 1), encoding="utf-8")
print("core line fixed")
