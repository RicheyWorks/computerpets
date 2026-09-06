from pathlib import Path
p = Path("_pact_core.py")
t = p.read_text(encoding="utf-8")
old = "tick_old + 'if (next.phase === \"sill-hop\") {',\n             tick_old + TS_TICK + '  if (next.phase === \"sill-hop\") {'"
new = "tick_old + '  if (next.phase === \"sill-hop\") {',\n             tick_old + TS_TICK + '  if (next.phase === \"sill-hop\") {'"
if old not in t:
    raise SystemExit("anchor missing")
p.write_text(t.replace(old, new, 1), encoding="utf-8", newline="\n")
print("fixed")
