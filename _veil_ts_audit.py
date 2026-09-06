from pathlib import Path
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
checks = [
    "export const RAYS", "raysOn:", 'key === "lionfish"', "kind === RAYS",
    "reefledge", "raysPoint", "rays-on", "papillae-off",
    "export function raysPoint", 'side: "reefledge"', "return RAYS",
]
for c in checks:
    print(c, ts.find(c))
i = ts.find("kind === PAPILLAE) return")
print("SIZE CTX", repr(ts[i - 40 : i + 220]))
i = ts.find("target.kind === PAPILLAE")
print("APPROACH", repr(ts[i : i + 400]))
i = ts.find('next.phase === "papillae-off"')
j = ts.find('next.phase === "sill-hop"', i)
print("between", j - i, "rays-on" in ts[i:j])
print(repr(ts[i : i + 120]))
print("--- near sill ---")
print(repr(ts[j - 80 : j + 40]))
# pick
i = ts.find('leave: "papillaed"')
print("PICK", repr(ts[i : i + 350]))
