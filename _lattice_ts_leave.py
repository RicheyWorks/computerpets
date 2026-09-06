from pathlib import Path
t = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
print("warted count", t.count("warted"))
i = t.find("leave:")
# find leave type
j = t.find("leave?:")
print("leave?:", j)
print(repr(t[j:j+400]) if j>=0 else "no optional")
# PlayTarget leave field
k = t.find("  leave:")
print("  leave:", k)
print(repr(t[k:k+250]) if k>=0 else "")
# refit warts
k2 = t.find("if (target.kind === WARTS)")
print("refit/approach WARTS at", k2)
print(t[k2:k2+180])
k3 = t.find("if (target.kind === WARTS)", k2+1)
print("second", k3)
print(t[k3:k3+180] if k3>=0 else "")
