from pathlib import Path
rm=Path("docs/ROADMAP.md").read_text(encoding="utf-8")
lines=rm.splitlines()
pact=lines[421]
print("LEN", len(pact))
print("TAIL:", pact[-800:])
# also Mane/Flame etc - check if Gleam Choir Nimbus were supposed to be after Pact
for name in ["Gleam", "Choir", "Nimbus", "Mane", "Silica", "Shard"]:
    print(name, "count", rm.count(name))
